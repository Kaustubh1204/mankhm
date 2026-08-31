import { CycloneReport } from '@/types/cyclone';
import { MOCK_REPORTS } from '@/lib/mock/reportMock';

export const reportApi = {
  async getReports(): Promise<CycloneReport[]> {
    return Promise.resolve([...MOCK_REPORTS]);
  },

  async getReportById(id: string): Promise<CycloneReport | null> {
    const found = MOCK_REPORTS.find((r) => r.id === id);
    return Promise.resolve(found ? { ...found } : null);
  },

  async generateReport(type: CycloneReport['type'], cycloneId?: string, cycloneName?: string): Promise<CycloneReport> {
    const newReport: CycloneReport = {
      id: `rpt_${Date.now()}`,
      reportName: `${cycloneName || 'North Indian Ocean Basin'} - ${type.replace(/_/g, ' ')}`,
      type,
      cycloneId,
      cycloneName,
      generatedTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC (DEMO)',
      fileSizeMb: Number((Math.random() * 4 + 2).toFixed(1)),
      status: 'READY',
      executiveSummary: `Generated meteorological briefing synthesizing current AI ensemble trajectory runs, scatterometer winds, and coastal vulnerability data.`,
      sections: [
        'Executive Briefing Summary',
        'Trajectory & Intensity Confidence Envelope',
        'Spatial Inundation & Coastal Hazard Matrix',
      ],
    };
    MOCK_REPORTS.unshift(newReport);
    return Promise.resolve(newReport);
  },
};
