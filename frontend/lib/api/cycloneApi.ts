import { Cyclone } from '@/types/cyclone';
import { MOCK_CYCLONES } from '@/lib/mock/cycloneMock';

/**
 * Cyclone API Service Layer
 * Currently consumes mock data, architecture directly maps to REST/GraphQL backend endpoints.
 */
export const cycloneApi = {
  async getCyclones(): Promise<Cyclone[]> {
    // Simulated network async resolution
    return Promise.resolve([...MOCK_CYCLONES]);
  },

  async getCycloneById(id: string): Promise<Cyclone | null> {
    const found = MOCK_CYCLONES.find((c) => c.id === id);
    return Promise.resolve(found ? { ...found } : null);
  },

  async getActiveCyclones(): Promise<Cyclone[]> {
    const active = MOCK_CYCLONES.filter((c) => c.status === 'ACTIVE' || c.status === 'DEVELOPING');
    return Promise.resolve([...active]);
  },

  async searchCyclones(query: string): Promise<Cyclone[]> {
    const q = query.toLowerCase().trim();
    if (!q) return Promise.resolve([...MOCK_CYCLONES]);
    const filtered = MOCK_CYCLONES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q) ||
        c.classification.toLowerCase().includes(q)
    );
    return Promise.resolve(filtered);
  },

  async toggleSaveCyclone(id: string): Promise<Cyclone | null> {
    const target = MOCK_CYCLONES.find((c) => c.id === id);
    if (target) {
      target.isSaved = !target.isSaved;
      return Promise.resolve({ ...target });
    }
    return Promise.resolve(null);
  },
};
