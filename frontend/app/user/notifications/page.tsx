'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { useNotifications } from '@/hooks/useCycloneData';
import { MessageSquare, CheckCircle2, ArrowRight, Bell } from 'lucide-react';

function NotificationsContent() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL');

  const filtered = notifications.filter((n) => {
    if (filter === 'UNREAD' && n.isRead) return false;
    if (filter === 'READ' && !n.isRead) return false;
    return true;
  });

  return (
    <UserDashboardLayout>
      <div className="space-y-6 select-none font-mono text-xs">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#091126] border border-slate-800 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4" /> Realtime Telemetry & Updates
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                DEMO STREAM
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Notification & Event Stream
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Inference updates for Cyclone Intensity, Forecast Trajectory shifts, and AI Platform Telemetry.
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

        {/* Read / Unread Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          {(['ALL', 'UNREAD', 'READ'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-2xl font-bold transition-all border ${
                filter === f
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                  : 'bg-[#060b19] text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Notification Cards */}
        <div className="space-y-3.5">
          {filtered.length === 0 ? (
            <div className="p-12 rounded-3xl bg-[#091126] border border-slate-800 text-center text-slate-400 space-y-2">
              <Bell className="h-8 w-8 mx-auto text-slate-600" />
              <p className="font-bold text-white">No notifications.</p>
              <p className="text-[10px]">You are completely caught up with all telemetry stream events.</p>
            </div>
          ) : (
            filtered.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  !n.isRead
                    ? 'bg-[#09142c] border-cyan-500/40 shadow-[0_0_20px_rgba(0,180,216,0.1)]'
                    : 'bg-[#091126]/60 border-slate-800 opacity-80 hover:opacity-100 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5">
                    {!n.isRead && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />}
                    <StatusBadge status="ACTIVE" label={n.type.replace('_', ' ')} size="sm" />
                    <h3 className="text-sm font-extrabold text-white">{n.title}</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">{n.message}</p>
                  <span className="text-[10px] text-slate-500 block pt-1">{n.timestamp}</span>
                </div>

                {n.linkHref && (
                  <Link
                    href={n.linkHref}
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold flex items-center gap-1.5 shrink-0 transition-colors"
                  >
                    <span>View Workspace</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </UserDashboardLayout>
  );
}

export default function NotificationsPage() {
  return (
    <ProtectedRoute requiredRole="USER">
      <NotificationsContent />
    </ProtectedRoute>
  );
}
