import { UserProfileData, UserSettings } from '@/types/cyclone';

export const MOCK_USER_PROFILE: UserProfileData = {
  id: 'usr_meteorologist_01',
  name: 'Dr. Alexander Vance',
  email: 'alexander.vance@cyclonesense.ai',
  organization: 'National Meteorological & Marine Intelligence Agency',
  role: 'USER',
  createdAt: '2026-01-15',
  avatarUrl: '',
};

export const MOCK_USER_SETTINGS: UserSettings = {
  windUnit: 'kmh',
  pressureUnit: 'hPa',
  distanceUnit: 'km',
  timezone: 'UTC',
  notifications: {
    cycloneUpdateAlerts: true,
    forecastChangeAlerts: true,
    riskAlerts: true,
    criticalAlerts: true,
    systemNotifications: true,
  },
  theme: 'dark-meteorological',
  mapStyle: 'dark-vector',
};
