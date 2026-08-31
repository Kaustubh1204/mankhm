import { UserProfileData, UserSettings } from '@/types/cyclone';
import { MOCK_USER_PROFILE, MOCK_USER_SETTINGS } from '@/lib/mock/userMock';

let currentProfile = { ...MOCK_USER_PROFILE };
let currentSettings = { ...MOCK_USER_SETTINGS };

export const userApi = {
  async getUserProfile(): Promise<UserProfileData> {
    return Promise.resolve({ ...currentProfile });
  },

  async updateUserProfile(updates: Partial<UserProfileData>): Promise<UserProfileData> {
    currentProfile = { ...currentProfile, ...updates };
    return Promise.resolve({ ...currentProfile });
  },

  async getUserSettings(): Promise<UserSettings> {
    return Promise.resolve({ ...currentSettings });
  },

  async updateUserSettings(updates: Partial<UserSettings>): Promise<UserSettings> {
    currentSettings = {
      ...currentSettings,
      ...updates,
      notifications: {
        ...currentSettings.notifications,
        ...(updates.notifications || {}),
      },
    };
    return Promise.resolve({ ...currentSettings });
  },
};
