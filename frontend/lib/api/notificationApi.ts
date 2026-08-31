import { MOCK_NOTIFICATIONS, MockNotification } from '../mock/notificationMock';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export type { MockNotification };

export const notificationApi = {
  async getNotifications(): Promise<{ success: boolean; data: MockNotification[]; isMock: boolean; error?: string }> {
    if (!API_URL) {
      await new Promise((res) => setTimeout(res, 200));
      return { success: true, data: MOCK_NOTIFICATIONS, isMock: true };
    }
    try {
      const res = await fetch(`${API_URL}/api/notifications`);
      if (!res.ok) return { success: false, data: MOCK_NOTIFICATIONS, isMock: true };
      const json = await res.json();
      return { success: true, data: json.data, isMock: false };
    } catch {
      return { success: false, data: MOCK_NOTIFICATIONS, isMock: true };
    }
  },
};
