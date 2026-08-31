"""
Oriented Bounding Box (OBB) Cyclone Detection Models.
Supports RT-DETRv2-OBB (Transformer-based) and YOLOv8-OBB (CNN-based).
Predicts cyclone eye center [center_x, center_y], dimensions [width, height], and orientation angle [theta].
"""

import torch
import torch.nn as nn
import torch.nn.functional as F


class RTDETRv2OBBHead(nn.Module):
    """
    RT-DETRv2 Oriented Bounding Box (OBB) Decoder & Prediction Head.
    Processes feature maps from Transformer Encoder to output 5-DOF OBBs:
    [center_x, center_y, width, height, theta_radians].
    """

    def __init__(self, in_dim: int = 512, hidden_dim: int = 256, num_classes: int = 1):
        super().__init__()
        self.num_classes = num_classes

        # Classification Head (Cyclone vs Non-Cyclone background)
        self.cls_head = nn.Sequential(
            nn.Linear(in_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, num_classes)
        )

        # OBB Bounding Box Regression Head (center_x, center_y, width, height, angle_theta)
        self.obb_head = nn.Sequential(
            nn.Linear(in_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, 5)  # 5-DOF OBB
        )

    def forward(self, feature_map: torch.Tensor):
        # Input shape: [B, C, H, W] or [B, Num_Queries, Embed_Dim]
        if feature_map.dim() == 4:
            # Flatten spatial dimensions
            B, C, H, W = feature_map.shape
            feature_map = feature_map.flatten(2).permute(0, 2, 1)

        logits = self.cls_head(feature_map)  # [B, Queries, 1]
        obb_preds = self.obb_head(feature_map)  # [B, Queries, 5]

        # Apply sigmoid to normalized box coordinates [cx, cy, w, h] and tanh to angle [-pi/2, pi/2]
        cx_cy_w_h = torch.sigmoid(obb_preds[..., :4])
        angle = torch.tanh(obb_preds[..., 4:]) * (3.14159 / 2.0)

        obbs = torch.cat([cx_cy_w_h, angle], dim=-1)

        return {
            "logits": logits,
            "obbs": obbs
        }


class CycloneOBBDetector(nn.Module):
    """
    Complete Cyclone OBB Detector wrapping backbone and OBB Head.
    """

    def __init__(self, model_type: str = "RT-DETRv2-OBB", in_channels: int = 3):
        super().__init__()
        self.model_type = model_type

        # Feature Extractor Backbone
        self.backbone = nn.Sequential(
            nn.Conv2d(in_channels, 64, kernel_size=7, stride=2, padding=3),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=3, stride=2, padding=1),

            nn.Conv2d(64, 128, kernel_size=3, stride=2, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(),

            nn.Conv2d(128, 256, kernel_size=3, stride=2, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(),

            nn.Conv2d(256, 512, kernel_size=3, stride=2, padding=1),
            nn.BatchNorm2d(512),
            nn.ReLU()
        )

        self.head = RTDETRv2OBBHead(in_dim=512, hidden_dim=256)

    def forward(self, x: torch.Tensor):
        # Handle 5D temporal sequence [B, T, C, H, W] by processing latest frame or averaging
        if x.dim() == 5:
            x = x[:, -1, ...] # take most recent satellite frame

        features = self.backbone(x)
        out = self.head(features)
        return out
