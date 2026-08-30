"""
Cyclone Intensity Regressor & IMD Categorization Model.
Predicts Maximum Sustained Wind (MSW knots) and Minimum Central Pressure (hPa).
"""

import torch
import torch.nn as nn


class CycloneIntensityRegressor(nn.Module):
    """
    Predicts cyclone intensity parameters:
    1. Maximum Sustained Wind Speed (knots)
    2. Minimum Central Pressure (hPa)
    3. IMD Category (7-class classification head)
    """

    IMD_CATEGORIES = [
        "Depression (<28 kts)",
        "Deep Depression (28-33 kts)",
        "Cyclonic Storm (34-47 kts)",
        "Severe Cyclonic Storm (48-63 kts)",
        "Very Severe Cyclonic Storm (64-89 kts)",
        "Extremely Severe Cyclonic Storm (90-119 kts)",
        "Super Cyclonic Storm (>=120 kts)"
    ]

    def __init__(self, in_channels: int = 3, embed_dim: int = 512):
        super().__init__()

        self.feature_extractor = nn.Sequential(
            nn.Conv2d(in_channels, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),

            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),

            nn.Conv2d(128, 256, kernel_size=3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(),
            nn.AdaptiveAvgPool2d((1, 1))
        )

        self.fc_shared = nn.Sequential(
            nn.Linear(256, embed_dim),
            nn.ReLU(),
            nn.Dropout(0.3)
        )

        # Regression Head: [MSW knots, Central Pressure hPa]
        self.regression_head = nn.Linear(embed_dim, 2)

        # Classification Head: IMD 7-Category logits
        self.category_head = nn.Linear(embed_dim, 7)

    def forward(self, x: torch.Tensor):
        if x.dim() == 5:
            x = x[:, -1, ...] # take latest frame in sequence

        feat = self.feature_extractor(x)
        feat = feat.view(feat.size(0), -1)
        shared = self.fc_shared(feat)

        reg_output = self.regression_head(shared) # [B, 2]
        cat_logits = self.category_head(shared) # [B, 7]

        return {
            "intensity_reg": reg_output, # [msw_knots, pressure_hpa]
            "category_logits": cat_logits
        }
