import { SatelliteLayer } from '@/types/cyclone';
import { MOCK_SATELLITE_LAYERS } from '@/lib/mock/satelliteMock';

export const satelliteApi = {
  async getSatelliteLayers(): Promise<SatelliteLayer[]> {
    return Promise.resolve([...MOCK_SATELLITE_LAYERS]);
  },

  async getSatelliteLayerByType(type: string): Promise<SatelliteLayer | null> {
    const found = MOCK_SATELLITE_LAYERS.find((l) => l.type === type);
    return Promise.resolve(found ? { ...found } : null);
  },
};
