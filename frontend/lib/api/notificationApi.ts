import { CycloneNotification } from '@/types/cyclone';
import { MOCK_NOTIFICATIONS } from '@/lib/mock/notificationMock';

export const notificationApi = {
  async getNotifications(): Promise<CycloneNotification[]> {
    return Promise.resolve([...MOCK_NOTIFICATIONS]);
  },

  async markNotificationAsRead(id: string): Promise<CycloneNotification | null> {
    const found = MOCK_NOTIFICATIONS.find((n) => n.id === id);
    if (found) {
      found.isRead = true;
      return Promise.resolve({ ...found });
    }
    return Promise.resolve(null);
  },

  async markAllNotificationsAsRead(): Promise<boolean> {
    MOCK_NOTIFICATIONS.forEach((n) => {
      n.isRead = true;
    });
    return Promise.resolve(true);
  },
};
