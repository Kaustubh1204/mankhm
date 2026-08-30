'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { useNotifications } from '@/hooks/useCycloneData';
import { MessageSquare, CheckCircle2, ArrowRight } from 'lucide-react';

function NotificationsContent() {
  const { notifications, setNotifications } = useNotifications();
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL');

  const filtered = notifications.filter((n) => {
    if (filter === 'UNREAD' && n.isRead) return false;
    if (filter === 'READ' && !n.isRead) return false;
    return true;
  });

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <UserDashboardLayout>
      <div className="space-y-6 select-none">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-cyan-400" />
              <span>Notification Center</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                DEMO NOTIFICATIONS
              </span>
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Realtime stream updates for Cyclone Intensity, Forecast Trajectory, and System Health.
            </p>
          </div>

          <button
            onClick={markAllRead}
            className="px-3.5 py-2 rounded-xl bg-[#091024] border border-slate-800 hover:border-cyan-500/40 text-xs font-mono font-bold text-slate-300 flex items-center gap-2 transition-colors"
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
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                filter === f
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Notification Cards */}
        <div className="space-y-3">
          {filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                setNotifications((prev) => prev.map((item) => item.id === n.id ? { ...item, isRead: true } : item));
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                !n.isRead
                  ? 'bg-[#091126] border-cyan-500/40 shadow-[0_0_20px_rgba(0,180,216,0.1)]'
                  : 'bg-[#091024]/60 border-slate-800 opacity-80'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {!n.isRead && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                  <StatusBadge status="ACTIVE" label={n.type} size="sm" />
                  <h3 className="text-sm font-bold text-white">{n.title}</h3>
                </div>
                <p className="text-xs text-slate-300">{n.message}</p>
                <span className="text-[10px] font-mono text-slate-500 block pt-1">{n.timestamp}</span>
              </div>

              {n.linkHref && (
                <Link
                  href={n.linkHref}
                  onClick={(e) => e.stopPropagation()}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1 shrink-0"
                >
                  <span>View Details</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          ))}
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
