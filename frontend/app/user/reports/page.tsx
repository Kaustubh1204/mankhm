'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import DataTable, { Column } from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { useReports } from '@/hooks/useCycloneData';
import { CycloneReport } from '@/types/cyclone';
import { FileText, Download, Eye, X, Check, RefreshCw } from 'lucide-react';

function ReportsContent() {
  const { reports, generateReport } = useReports();
  const [selectedReport, setSelectedReport] = useState<CycloneReport | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async (type: CycloneReport['type'], name: string) => {
    setGenerating(true);
    await generateReport(type, undefined, name);
    setGenerating(false);
  };

  const handleDownload = (rpt: CycloneReport) => {
    setDownloadSuccess(`Downloaded ${rpt.reportName} (DEMO PDF)`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const columns: Column<CycloneReport>[] = [
    {
      header: 'Intelligence Report Name',
      accessorKey: 'reportName',
      cell: (row) => (
        <span className="font-bold text-white font-mono text-xs block">{row.reportName}</span>
      ),
    },
    { header: 'Category', accessorKey: 'type' },
    { header: 'System', accessorKey: 'cycloneName', cell: (row) => row.cycloneName || 'General Basin' },
    { header: 'Generated Timestamp', accessorKey: 'generatedTimestamp' },
    { header: 'File Payload', accessorKey: 'fileSizeMb', cell: (row) => `${row.fileSizeMb} MB` },
    { header: 'Status', accessorKey: 'status', cell: (row) => <StatusBadge status="ACTIVE" label={row.status} size="sm" /> },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedReport(row)}
            className="p-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
            title="Preview Intelligence Report"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handleDownload(row)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Download PDF Report"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <UserDashboardLayout>
      <div className="space-y-6 select-none font-mono text-xs">
        {/* Header */}
        <div className="flex items-center justify-between p-6 rounded-3xl bg-[#091126] border border-slate-800 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-teal-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-4 w-4" /> Meteorological Intelligence Reports
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                DEMO REPORTS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Automated Intelligence Briefings
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Generate, preview, and download comprehensive cyclone synthesis briefs and hydrodynamic coastal risk evaluations.
            </p>
          </div>
        </div>

        {downloadSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-400" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Generate Report Type Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Cyclone Summary Report', type: 'CYCLONE_SUMMARY' as const, desc: 'Vortex synoptics, wind radii & satellite frames' },
            { name: 'Forecast Track Analysis', type: 'FORECAST_ANALYSIS' as const, desc: '72h ensemble convergence & error bands' },
            { name: 'Coastal Risk Assessment', type: 'RISK_ASSESSMENT' as const, desc: 'Hydrodynamic surge & district exposure' },
            { name: 'Historical Archive Benchmark', type: 'HISTORICAL_ARCHIVE' as const, desc: 'Multi-year retrospective verification' },
          ].map((rpt) => (
            <div key={rpt.name} className="p-5 rounded-3xl bg-[#091126] border border-slate-800 space-y-3 flex flex-col justify-between shadow-xl">
              <div>
                <FileText className="h-6 w-6 text-cyan-400 mb-2" />
                <h3 className="font-bold text-white uppercase text-xs">{rpt.name}</h3>
                <p className="text-[10px] text-slate-400 mt-1">{rpt.desc}</p>
              </div>

              <button
                disabled={generating}
                onClick={() => handleGenerate(rpt.type, rpt.name)}
                className="w-full py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold flex items-center justify-center gap-2 border border-cyan-500/40 transition-colors shadow-sm"
              >
                {generating ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
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
            <div className="w-full max-w-2xl p-8 rounded-3xl bg-[#091126] border border-cyan-500/40 space-y-6 shadow-2xl relative font-mono text-xs">
              <button
                onClick={() => setSelectedReport(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase">DEMO REPORT PREVIEW</span>
                  <h3 className="text-xl font-black text-white">{selectedReport.reportName}</h3>
                </div>
                <StatusBadge status="ACTIVE" label={selectedReport.type} />
              </div>

              <div className="space-y-4 text-slate-300 p-6 rounded-2xl bg-[#060b19] border border-slate-800">
                <p>Associated Vortex: <strong className="text-white">{selectedReport.cycloneName || 'North Indian Ocean Basin'}</strong></p>
                <p>Generation Timestamp: <strong className="text-white">{selectedReport.generatedTimestamp}</strong></p>
                <p>Payload Size: <strong className="text-cyan-300">{selectedReport.fileSizeMb} MB</strong></p>
                <p>Issuing System: <strong className="text-white">CycloneSense AI Automated Report Engine v1.0</strong></p>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-slate-400 block font-bold">Executive Intelligence Summary:</span>
                  <p className="text-slate-300 leading-relaxed font-sans text-xs">
                    {selectedReport.executiveSummary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-1.5">
                  <span className="text-slate-400 block font-bold">Briefing Sections Included:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                    {selectedReport.sections.map((sec) => (
                      <li key={sec}>{sec}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    handleDownload(selectedReport);
                    setSelectedReport(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 flex items-center gap-2 hover:bg-cyan-500/30 transition-colors shadow-md"
                >
                  <Download className="h-4 w-4" />
                  <span>Download PDF Report</span>
                </button>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors"
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
