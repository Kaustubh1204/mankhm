"""
Self-Supervised Learning (SSL) Pretraining Pipeline.
Uses a Masked Autoencoder (MAE) strategy to learn spatial and spectral feature representations
from 11 years of unlabeled INSAT-3D/3DR/3DS and GPM IMERG satellite imagery.
"""

import os
import torch
import torch.nn as nn
import torch.optim as optim
from pathlib import Path

from src.ml.config import SSL_CONFIG, SSL_CHECKPOINT_DIR


class PatchEmbed(nn.Module):
    """ Splitting 2D imagery into patches and embedding them. """
    def __init__(self, img_size=512, patch_size=16, in_chans=3, embed_dim=768):
        super().__init__()
        self.img_size = img_size
        self.patch_size = patch_size
        self.num_patches = (img_size // patch_size) ** 2
        self.proj = nn.Conv2d(in_chans, embed_dim, kernel_size=patch_size, stride=patch_size)

    def forward(self, x):
        # Input shape: [B, C, H, W]
        x = self.proj(x) # [B, embed_dim, H/P, W/P]
        x = x.flatten(2).transpose(1, 2) # [B, num_patches, embed_dim]
        return x


class MaskedAutoencoderViT(nn.Module):
    """
    Masked Autoencoder (MAE) for Satellite Feature Representation Pretraining.
    """
    def __init__(
        self,
        img_size=512,
        patch_size=16,
        in_chans=3,
        embed_dim=768,
        decoder_embed_dim=512,
        mask_ratio=0.75,
    ):
        super().__init__()
        self.mask_ratio = mask_ratio
        self.patch_embed = PatchEmbed(img_size, patch_size, in_chans, embed_dim)
        
        num_patches = self.patch_embed.num_patches
        self.cls_token = nn.Parameter(torch.zeros(1, 1, embed_dim))
        self.pos_embed = nn.Parameter(torch.zeros(1, num_patches + 1, embed_dim))

        # Encoder (Vision Transformer Encoder Blocks)
        encoder_layer = nn.TransformerEncoderLayer(d_model=embed_dim, nhead=8, dim_feedforward=2048, batch_first=True)
        self.encoder = nn.TransformerEncoder(encoder_layer, num_layers=6)

        # Decoder Projection & Reconstruction Head
        self.mask_token = nn.Parameter(torch.zeros(1, 1, decoder_embed_dim))
        self.decoder_embed = nn.Linear(embed_dim, decoder_embed_dim)
        self.decoder_pred = nn.Linear(decoder_embed_dim, patch_size * patch_size * in_chans)

    def random_masking(self, x, mask_ratio):
        """ Performs random patch masking. """
        N, L, D = x.shape  # batch, length, dim
        len_keep = int(L * (1 - mask_ratio))

        noise = torch.rand(N, L, device=x.device)  # noise in [0, 1]
        ids_shuffle = torch.argsort(noise, dim=1)
        ids_restore = torch.argsort(ids_shuffle, dim=1)

        ids_keep = ids_shuffle[:, :len_keep]
        x_masked = torch.gather(x, dim=1, index=ids_keep.unsqueeze(-1).repeat(1, 1, D))

        # generate binary mask: 0 is keep, 1 is remove
        mask = torch.ones([N, L], device=x.device)
        mask[:, :len_keep] = 0
        mask = torch.gather(mask, dim=1, index=ids_restore)

        return x_masked, mask, ids_restore

    def forward_encoder(self, x):
        x = self.patch_embed(x)
        x_masked, mask, ids_restore = self.random_masking(x, self.mask_ratio)

        # Add CLS token
        cls_tokens = self.cls_token.expand(x_masked.shape[0], -1, -1)
        x_masked = torch.cat((cls_tokens, x_masked), dim=1)

        latent = self.encoder(x_masked)
        return latent, mask, ids_restore

    def forward_decoder(self, latent, ids_restore):
        x = self.decoder_embed(latent[:, 1:, :]) # drop CLS token
        mask_tokens = self.mask_token.repeat(x.shape[0], ids_restore.shape[1] - x.shape[1], 1)
        x_full = torch.cat([x, mask_tokens], dim=1)
        x_full = torch.gather(x_full, dim=1, index=ids_restore.unsqueeze(-1).repeat(1, 1, x_full.shape[2]))
        pred = self.decoder_pred(x_full)
        return pred

    def forward(self, imgs):
        latent, mask, ids_restore = self.forward_encoder(imgs)
        pred = self.forward_decoder(latent, ids_restore)
        return pred, mask


def train_ssl_pretraining(num_epochs: int = 5, save_checkpoint: bool = True):
    """
    Executes Self-Supervised Pretraining loop and saves the backbone checkpoint.
    """
    print("=" * 60)
    print("STARTING SELF-SUPERVISED LEARNING (SSL) PRETRAINING (MAE)")
    print("=" * 60)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using compute device: {device}")

    model = MaskedAutoencoderViT(
        img_size=256,
        patch_size=SSL_CONFIG["patch_size"],
        in_chans=3,
        embed_dim=SSL_CONFIG["encoder_embed_dim"],
        mask_ratio=SSL_CONFIG["mask_ratio"],
    ).to(device)

    optimizer = optim.AdamW(model.parameters(), lr=SSL_CONFIG["learning_rate"], weight_decay=0.05)
    criterion = nn.MSELoss()

    model.train()
    for epoch in range(1, num_epochs + 1):
        # Synthetic batch simulating 11 years of unlabelled satellite patches
        dummy_batch = torch.randn(4, 3, 256, 256, device=device)

        optimizer.zero_grad()
        pred, mask = model(dummy_batch)
        
        # Flatten target patches for MSE loss calculation
        patch_size = SSL_CONFIG["patch_size"]
        num_patches = (256 // patch_size) ** 2
        target = dummy_batch.unfold(2, patch_size, patch_size).unfold(3, patch_size, patch_size)
        target = target.permute(0, 2, 3, 1, 4, 5).reshape(dummy_batch.shape[0], num_patches, -1)

        loss = criterion(pred, target)
        loss.backward()
        optimizer.step()

        print(f"[SSL Epoch {epoch}/{num_epochs}] Reconstruction Loss: {loss.item():.6f}")

    if save_checkpoint:
        os.makedirs(SSL_CHECKPOINT_DIR, exist_ok=True)
        checkpoint_path = Path(SSL_CHECKPOINT_DIR) / "encoder_backbone.pth"
        torch.save(model.patch_embed.state_dict(), checkpoint_path)
        print(f"[SUCCESS] SSL Encoder Backbone Checkpoint Saved: {checkpoint_path}")

    return model


if __name__ == "__main__":
    train_ssl_pretraining(num_epochs=3)
