'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { useAlerts } from '@/hooks/useCycloneData';
import { CycloneAlert } from '@/types/cyclone';
import { Bell, Search, CheckCircle2, ArrowRight, X, AlertTriangle } from 'lucide-react';

function AlertsContent() {
  const { alerts, markAsRead, markAllAsRead } = useAlerts();
  const [activeTab, setActiveTab] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MODERATE' | 'INFO'>('ALL');
  const [readFilter, setReadFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<CycloneAlert | null>(null);

  const filtered = alerts.filter((a) => {
    if (activeTab !== 'ALL' && a.severity !== activeTab) return false;
    if (readFilter === 'UNREAD' && a.isRead) return false;
    if (readFilter === 'READ' && !a.isRead) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.region.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <UserDashboardLayout>
      <div className="space-y-6 select-none font-mono text-xs">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#091126] border border-slate-800 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="h-4 w-4" /> Warning & Alert Dispatch Center
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                DEMO DATA
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Emergency Atmospheric Hazard Bulletins
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Automated vortex intensification notices, storm surge advisories, and track change alerts.
            </p>
          </div>

          <button
            onClick={markAllAsRead}
            className="px-4 py-2 rounded-2xl bg-[#060b19] border border-slate-800 hover:border-cyan-500/40 font-bold text-slate-300 flex items-center gap-2 transition-colors shadow-sm"
          >
            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
            <span>Mark All as Read</span>
          </button>
        </div>

        {/* Severity Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto custom-scrollbar">
          {(['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'INFO'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-2xl font-bold transition-all border ${
                activeTab === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                  : 'bg-[#060b19] text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#091126] border border-slate-800">
          <div className="flex items-center gap-2">
            {(['ALL', 'UNREAD', 'READ'] as const).map((rf) => (
              <button
                key={rf}
                onClick={() => setReadFilter(rf)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all border ${
                  readFilter === rf
                    ? 'bg-slate-800 text-white border-slate-700 shadow-sm'
                    : 'bg-[#060b19] text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {rf}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search alerts by region or title..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#060b19] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Alert Cards Grid */}
        <div className="grid grid-cols-1 gap-3.5">
          {filtered.length === 0 ? (
            <div className="p-12 rounded-3xl bg-[#091126] border border-slate-800 text-center text-slate-400 space-y-2">
              <AlertTriangle className="h-8 w-8 mx-auto text-slate-600" />
              <p className="font-bold text-white">No alerts matching filter criteria.</p>
              <p className="text-[10px]">All meteorological channels currently operating within normal parameters.</p>
            </div>
          ) : (
            filtered.map((alt) => (
              <div
                key={alt.id}
                onClick={() => {
                  setSelectedAlert(alt);
                  markAsRead(alt.id);
                }}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  !alt.isRead
                    ? 'bg-[#09142c] border-cyan-500/40 shadow-[0_0_20px_rgba(0,180,216,0.1)]'
                    : 'bg-[#091126]/60 border-slate-800 opacity-80 hover:opacity-100 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-3">
                    {!alt.isRead && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />}
                    <h3 className="text-sm font-extrabold text-white">{alt.title}</h3>
                    <StatusBadge status={alt.severity} size="sm" />
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">{alt.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-500 pt-1">
                    <span>Region: <strong className="text-slate-300">{alt.region}</strong></span>
                    <span>Issued: {alt.timestamp}</span>
                    <span>Source: {alt.source}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {alt.cycloneId && (
                    <Link
                      href={`/user/cyclones/${alt.cycloneId}`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <span>View Cyclone</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Alert Detail Modal */}
        {selectedAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="w-full max-w-lg p-6 rounded-3xl bg-[#091126] border border-cyan-500/40 space-y-4 shadow-2xl relative font-mono text-xs">
              <button
                onClick={() => setSelectedAlert(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                <StatusBadge status={selectedAlert.severity} />
                <span className="text-[10px] text-slate-400 font-bold">DEMO ALERT BULLETIN</span>
              </div>

              <h3 className="text-lg font-black text-white">{selectedAlert.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{selectedAlert.description}</p>

              <div className="space-y-2 p-4 rounded-2xl bg-[#060b19] border border-slate-800 text-slate-400">
                <p>Geographic Zone: <strong className="text-white">{selectedAlert.region}</strong></p>
                <p>Associated System: <strong className="text-cyan-300">{selectedAlert.cycloneName || 'Basin Wide'}</strong></p>
                <p>Timestamp Issued: <strong className="text-white">{selectedAlert.timestamp}</strong></p>
                <p>Issuing Engine: <strong className="text-white">{selectedAlert.source}</strong></p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                {selectedAlert.cycloneId && (
                  <Link
                    href={`/user/cyclones/${selectedAlert.cycloneId}`}
                    onClick={() => setSelectedAlert(null)}
                    className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 transition-colors"
                  >
                    View Cyclone Details →
                  </Link>
                )}
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-colors"
                >
                  Close Bulletin
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserDashboardLayout>
  );
}

export default function AlertsPage() {
  return (
    <ProtectedRoute requiredRole="USER">
      <AlertsContent />
    </ProtectedRoute>
  );
}
