export interface MockUserProfile {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  preferences: {
    windSpeedUnit: 'kmh' | 'kt' | 'mph';
    pressureUnit: 'hPa' | 'mb';
    distanceUnit: 'km' | 'miles';
    timezone: 'UTC' | 'IST' | 'LOCAL';
    cycloneUpdateAlerts: boolean;
    forecastChangeAlerts: boolean;
    riskAlerts: boolean;
    criticalAlerts: boolean;
    systemNotifications: boolean;
  };
}

export const MOCK_USER_PROFILE: MockUserProfile = {
  id: 'user_fixed_master',
  name: 'Dr. Alexander Vance',
  email: 'user@cyclonesense.ai',
  organization: 'National Meteorological Agency',
  role: 'USER',
  createdAt: '2026-08-30T00:00:00.000Z',
  preferences: {
    windSpeedUnit: 'kmh',
    pressureUnit: 'hPa',
    distanceUnit: 'km',
    timezone: 'UTC',
    cycloneUpdateAlerts: true,
    forecastChangeAlerts: true,
    riskAlerts: true,
    criticalAlerts: true,
    systemNotifications: true,
  },
};
