'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import DataTable, { Column } from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { useReports } from '@/hooks/useCycloneData';
import { MockReport } from '@/lib/mock/reportMock';
import { FileText, Download, Eye, X } from 'lucide-react';

function ReportsContent() {
  const { reports } = useReports();
  const [selectedReport, setSelectedReport] = useState<MockReport | null>(null);

  const columns: Column<MockReport>[] = [
    { header: 'Report Name', accessorKey: 'reportName', cell: (row) => (
      <span className="font-bold text-white font-mono text-xs">{row.reportName}</span>
    )},
    { header: 'Report Category', accessorKey: 'type' },
    { header: 'Associated Cyclone', accessorKey: 'cycloneName', cell: (row) => row.cycloneName || 'General Basin' },
    { header: 'Generated (UTC)', accessorKey: 'generatedTimestamp' },
    { header: 'File Size', accessorKey: 'fileSizeMb', cell: (row) => `${row.fileSizeMb} MB` },
    { header: 'Status', accessorKey: 'status', cell: (row) => <StatusBadge status="ACTIVE" label={row.status} size="sm" /> },
    { header: 'Actions', cell: (row) => (
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSelectedReport(row)}
          className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
          title="Preview Report"
        >
          <Eye className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => alert(`Downloading DEMO PDF report: ${row.reportName}`)}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          title="Download PDF"
        >
          <Download className="h-3.5 w-3.5" />
        </button>
      </div>
    )},
  ];

  return (
    <UserDashboardLayout>
      <div className="space-y-6 select-none">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <FileText className="h-6 w-6 text-teal-400" />
              <span>Meteorological Intelligence Reports</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                DEMO REPORTS
              </span>
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Generate and download automated cyclone summaries, forecast analysis, and coastal risk reports.
            </p>
          </div>
        </div>

        {/* Report Types Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Cyclone Summary Report', type: 'CYCLONE_SUMMARY' },
            { name: 'Forecast Track Analysis', type: 'FORECAST_ANALYSIS' },
            { name: 'Coastal Risk Assessment', type: 'RISK_ASSESSMENT' },
            { name: 'Historical Archive', type: 'HISTORICAL_ARCHIVE' },
          ].map((rpt) => (
            <div key={rpt.name} className="p-5 rounded-2xl bg-[#091024] border border-slate-800 space-y-3">
              <FileText className="h-6 w-6 text-cyan-400" />
              <h3 className="text-xs font-mono font-bold text-white uppercase">{rpt.name}</h3>
              <p className="text-[10px] text-slate-400">PDF & GeoJSON export format</p>
              <button
                onClick={() => alert(`Generating DEMO ${rpt.name}...`)}
                className="w-full py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center gap-2 border border-cyan-500/40 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>GENERATE REPORT</span>
              </button>
            </div>
          ))}
        </div>

        {/* Existing Reports Table */}
        <DataTable columns={columns} data={reports} emptyMessage="No generated reports available." />

        {/* Report Preview Modal */}
        {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="w-full max-w-2xl p-8 rounded-3xl bg-[#091126] border border-cyan-500/40 space-y-6 shadow-2xl relative">
              <button
                onClick={() => setSelectedReport(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">DEMO REPORT PREVIEW</span>
                  <h3 className="text-xl font-extrabold text-white">{selectedReport.reportName}</h3>
                </div>
                <StatusBadge status="ACTIVE" label={selectedReport.type} />
              </div>

              <div className="space-y-4 text-xs font-mono text-slate-300 p-6 rounded-2xl bg-[#060b19] border border-slate-800">
                <p>Associated System: <strong className="text-white">{selectedReport.cycloneName || 'North Indian Ocean Basin'}</strong></p>
                <p>Generation Timestamp: <strong className="text-white">{selectedReport.generatedTimestamp}</strong></p>
                <p>File Payload Size: <strong className="text-cyan-300">{selectedReport.fileSizeMb} MB</strong></p>
                <p>Authoritative Source: <strong className="text-white">CycloneSense AI Automated Report Engine v1.0</strong></p>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-slate-400 block font-bold">Executive Summary:</span>
                  <p className="text-slate-300 leading-relaxed font-sans text-xs">
                    This automated meteorological report synthesizes orbital satellite imagery (INSAT-3DS), scatterometer surface winds, and 72-hour deep learning trajectory models. Coastal surge hazard warnings remain active for Northern Odisha and West Bengal coasts.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => alert(`Downloading ${selectedReport.reportName} (PDF)...`)}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/40 flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download PDF Report</span>
                </button>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-mono text-xs font-bold"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserDashboardLayout>
  );
}

export default function ReportsPage() {
  return (
    <ProtectedRoute requiredRole="USER">
      <ReportsContent />
    </ProtectedRoute>
  );
}
