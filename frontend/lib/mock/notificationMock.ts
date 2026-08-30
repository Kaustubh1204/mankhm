export interface MockNotification {
  id: string;
  type: 'CYCLONE_UPDATE' | 'FORECAST_UPDATE' | 'RISK_UPDATE' | 'ALERT' | 'SYSTEM';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  linkHref?: string;
}

export const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: 'notif_001',
    type: 'CYCLONE_UPDATE',
    title: 'Cyclone Aruna Intensity Escalation',
    message: 'Cyclone Aruna has upgraded to Very Severe Cyclonic Storm (145 km/h max wind).',
    timestamp: '2026-08-31 03:05 UTC',
    isRead: false,
    linkHref: '/user/cyclones/cyc_aruna',
  },
  {
    id: 'notif_002',
    type: 'FORECAST_UPDATE',
    title: 'Ensemble Track Horizon Update',
    message: 'New 72h trajectory cone computed for Cyclone Aruna with 87% model agreement.',
    timestamp: '2026-08-31 02:45 UTC',
    isRead: false,
    linkHref: '/user/forecast',
  },
  {
    id: 'notif_003',
    type: 'RISK_UPDATE',
    title: 'North Odisha Coastal Risk Upgrade',
    message: 'Storm surge assessment upgraded to CRITICAL (4.2m projected max surge).',
    timestamp: '2026-08-31 02:10 UTC',
    isRead: true,
    linkHref: '/user/risk-map',
  },
  {
    id: 'notif_004',
    type: 'SYSTEM',
    title: 'Demo Data Environment Active',
    message: 'Frontend is running in demonstration mode consuming high-fidelity mock streams.',
    timestamp: '2026-08-30 20:00 UTC',
    isRead: true,
  },
];
