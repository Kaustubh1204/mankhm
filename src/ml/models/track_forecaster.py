"""
Track Forecasting & Rapid Intensification Models.
Supports:
1. Realtime Track Forecaster (ConvLSTM for 0-6 hour kinematic trajectory)
2. Batch Track & Rapid Intensification Forecaster (Physics-Informed 72-hour forecast cone & RI alert)
"""

import torch
import torch.nn as nn


class ConvLSTMCell(nn.Module):
    """ ConvLSTM Cell for spatiotemporal sequence processing. """
    def __init__(self, in_channels: int, hidden_channels: int, kernel_size: int = 3):
        super().__init__()
        padding = kernel_size // 2
        self.conv = nn.Conv2d(
            in_channels + hidden_channels,
            4 * hidden_channels,
            kernel_size=kernel_size,
            padding=padding
        )
        self.hidden_channels = hidden_channels

    def forward(self, x, state):
        if state is None:
            B, _, H, W = x.shape
            h = torch.zeros(B, self.hidden_channels, H, W, device=x.device)
            c = torch.zeros(B, self.hidden_channels, H, W, device=x.device)
        else:
            h, c = state

        combined = torch.cat([x, h], dim=1)
        gates = self.conv(combined)

        i, f, o, g = torch.split(gates, self.hidden_channels, dim=1)
        i = torch.sigmoid(i)
        f = torch.sigmoid(f)
        o = torch.sigmoid(o)
        g = torch.tanh(g)

        c_next = f * c + i * g
        h_next = o * torch.tanh(c_next)

        return h_next, (h_next, c_next)


class RealtimeTrackForecaster(nn.Module):
    """
    Realtime Speed Lane Forecaster (ConvLSTM).
    Inputs: Sequence of 15-minute satellite tensors [B, T, C, H, W]
    Outputs: 0–6 Hour Track Displacement Delta [delta_lat, delta_lon]
    """

    def __init__(self, in_channels: int = 3, hidden_channels: int = 64):
        super().__init__()
        self.conv_lstm = ConvLSTMCell(in_channels, hidden_channels)
        self.avg_pool = nn.AdaptiveAvgPool2d((1, 1))
        self.fc = nn.Sequential(
            nn.Linear(hidden_channels, 32),
            nn.ReLU(),
            nn.Linear(32, 2) # [delta_lat, delta_lon]
        )

    def forward(self, x: torch.Tensor):
        # x shape: [B, T, C, H, W]
        B, T, C, H, W = x.shape
        state = None

        for t in range(T):
            _, state = self.conv_lstm(x[:, t, ...], state)

        h_final, _ = state
        pooled = self.avg_pool(h_final).view(B, -1)
        track_delta = self.fc(pooled)
        return track_delta


class BatchSynopticTrackForecaster(nn.Module):
    """
    Batch Synoptic Lane Forecaster (Physics-Informed Multi-Sensor Fusion).
    Inputs: 6-hour multi-sensor sequence [B, T=12, Multi_Channels, H, W]
    Outputs:
      1. 72-Hour Track Forecast Cone: [B, 12, 2] (12 waypoints at 6-hour intervals)
      2. Rapid Intensification (RI) Alert: Binary probability [B, 1]
    """

    def __init__(self, in_channels: int = 5, hidden_dim: int = 256):
        super().__init__()

        self.encoder = nn.Sequential(
            nn.Conv3d(in_channels, 32, kernel_size=(3, 3, 3), padding=(1, 1, 1)),
            nn.BatchNorm3d(32),
            nn.ReLU(),
            nn.MaxPool3d((1, 2, 2)),

            nn.Conv3d(32, 64, kernel_size=(3, 3, 3), padding=(1, 1, 1)),
            nn.BatchNorm3d(64),
            nn.ReLU(),
            nn.AdaptiveAvgPool3d((1, 1, 1))
        )

        self.fc_shared = nn.Sequential(
            nn.Linear(64, hidden_dim),
            nn.ReLU(),
            nn.Dropout(0.2)
        )

        # 72-Hour Track Cone Head (12 steps x 2 coords = 24 values)
        self.track_cone_head = nn.Linear(hidden_dim, 24)

        # Rapid Intensification Binary Classifier
        self.ri_alert_head = nn.Sequential(
            nn.Linear(hidden_dim, 64),
            nn.ReLU(),
            nn.Linear(64, 1),
            nn.Sigmoid()
        )

    def forward(self, x: torch.Tensor):
        # x shape: [B, T, C, H, W] -> convert to [B, C, T, H, W] for Conv3D
        if x.dim() == 5:
            x = x.permute(0, 2, 1, 3, 4)

        feat = self.encoder(x).squeeze()
        if feat.dim() == 1:
            feat = feat.unsqueeze(0)

        shared = self.fc_shared(feat)

        track_cone_raw = self.track_cone_head(shared)
        track_cone = track_cone_raw.view(-1, 12, 2) # [B, 12 waypoints, (lat, lon)]

        ri_probability = self.ri_alert_head(shared) # [B, 1]

        return {
            "track_72h_cone": track_cone,
            "rapid_intensification_prob": ri_probability
        }
