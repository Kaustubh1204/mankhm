'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { useAlerts } from '@/hooks/useCycloneData';
import { CycloneAlert } from '@/lib/mock/alertMock';
import { Bell, Search, CheckCircle2, ArrowRight, X } from 'lucide-react';

function AlertsContent() {
  const { alerts, setAlerts } = useAlerts();
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

  const markAsRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, isRead: true } : a)));
  };

  return (
    <UserDashboardLayout>
      <div className="space-y-6 select-none">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Bell className="h-6 w-6 text-amber-400" />
              <span>Emergency Warning & Alert Center</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                DEMO DATA
              </span>
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Realtime atmospheric hazard bulletins & automated vortex notifications.
            </p>
          </div>

          <button
            onClick={() => setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })))}
            className="px-3.5 py-2 rounded-xl bg-[#091024] border border-slate-800 hover:border-cyan-500/40 text-xs font-mono font-bold text-slate-300 flex items-center gap-2 transition-colors"
          >
            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
            <span>Mark All as Read</span>
          </button>
        </div>

        {/* Severity Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          {(['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'INFO'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                activeTab === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#091024] border border-slate-800">
          <div className="flex items-center gap-2">
            {(['ALL', 'UNREAD', 'READ'] as const).map((rf) => (
              <button
                key={rf}
                onClick={() => setReadFilter(rf)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  readFilter === rf
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {rf}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
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
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((alt) => (
            <div
              key={alt.id}
              onClick={() => {
                setSelectedAlert(alt);
                markAsRead(alt.id);
              }}
              className={`p-6 rounded-2xl border transition-all cursor-pointer space-y-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                !alt.isRead
                  ? 'bg-[#091126] border-cyan-500/40 shadow-[0_0_20px_rgba(0,180,216,0.1)]'
                  : 'bg-[#091024]/60 border-slate-800 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  {!alt.isRead && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                  <h3 className="text-base font-bold text-white">{alt.title}</h3>
                  <StatusBadge status={alt.severity} size="sm" />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">{alt.description}</p>
                <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500 pt-1">
                  <span>Region: <strong className="text-slate-400">{alt.region}</strong></span>
                  <span>Issued: {alt.timestamp}</span>
                  <span>Source: {alt.source}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {alt.cycloneId && (
                  <Link
                    href={`/user/cyclones/${alt.cycloneId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1"
                  >
                    <span>View Cyclone</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Alert Detail Modal Drawer */}
        {selectedAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="w-full max-w-lg p-6 rounded-3xl bg-[#091126] border border-cyan-500/40 space-y-4 shadow-2xl relative">
              <button
                onClick={() => setSelectedAlert(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                <StatusBadge status={selectedAlert.severity} />
                <span className="text-xs font-mono text-slate-400">DEMO ALERT BULLETIN</span>
              </div>

              <h3 className="text-xl font-bold text-white">{selectedAlert.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedAlert.description}</p>

              <div className="space-y-2 text-xs font-mono text-slate-400 p-4 rounded-xl bg-[#060b19] border border-slate-800">
                <p>Region: <strong className="text-white">{selectedAlert.region}</strong></p>
                <p>Associated Cyclone: <strong className="text-cyan-300">{selectedAlert.cycloneName || 'N/A'}</strong></p>
                <p>Timestamp: <strong className="text-white">{selectedAlert.timestamp}</strong></p>
                <p>Issuing Authority: <strong className="text-white">{selectedAlert.source}</strong></p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                {selectedAlert.cycloneId && (
                  <Link
                    href={`/user/cyclones/${selectedAlert.cycloneId}`}
                    onClick={() => setSelectedAlert(null)}
                    className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/40"
                  >
                    View Cyclone Details →
                  </Link>
                )}
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-mono text-xs font-bold"
                >
                  Close
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
