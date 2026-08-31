import { CycloneAlert } from '@/types/cyclone';
import { MOCK_ALERTS } from '@/lib/mock/alertMock';

export const alertApi = {
  async getAlerts(): Promise<CycloneAlert[]> {
    return Promise.resolve([...MOCK_ALERTS]);
  },

  async getAlertsByCycloneId(cycloneId: string): Promise<CycloneAlert[]> {
    const matched = MOCK_ALERTS.filter((a) => a.cycloneId === cycloneId);
    return Promise.resolve(matched.length > 0 ? matched : [...MOCK_ALERTS]);
  },

  async markAlertAsRead(id: string): Promise<CycloneAlert | null> {
    const alert = MOCK_ALERTS.find((a) => a.id === id);
    if (alert) {
      alert.isRead = true;
      return Promise.resolve({ ...alert });
    }
    return Promise.resolve(null);
  },

  async markAllAlertsAsRead(): Promise<boolean> {
    MOCK_ALERTS.forEach((a) => {
      a.isRead = true;
    });
    return Promise.resolve(true);
  },
};
