'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/authStore';
import {
  Shield,
  LayoutDashboard,
  Radio,
  MapPin,
  TrendingUp,
  ShieldAlert,
  Bell,
  History,
  Activity,
  Cpu,
  Layers,
  Database,
  Terminal,
  Settings,
  LogOut,
  X,
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export default function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { currentUser, signOut } = useAuth();
  const role = currentUser?.role || 'USER';

  const userNav = [
    { label: 'Overview', href: '/user/dashboard', icon: LayoutDashboard },
    { label: 'Live Cyclones', href: '/user/cyclones', icon: Radio },
    { label: 'Live Map', href: '/user/live-map', icon: MapPin },
    { label: 'Forecast', href: '/user/forecast', icon: TrendingUp },
    { label: 'Risk Map', href: '/user/risk-map', icon: ShieldAlert },
    { label: 'Alerts', href: '/user/alerts', icon: Bell },
    { label: 'Historical Data', href: '/user/history', icon: History },
  ];

  const adminNav = [
    { group: 'COMMAND CENTER', items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Live Tracking', href: '/admin/live-tracking', icon: MapPin },
      { label: 'Historical Data', href: '/admin/historical-data', icon: History },
      { label: 'Telemetry', href: '/admin/telemetry', icon: Activity },
      { label: 'Forecast Models', href: '/admin/forecast-models', icon: TrendingUp },
    ]},
    { group: 'PIPELINE MONITOR', items: [
      { label: 'Pipeline Overview', href: '/admin/pipelines', icon: Layers },
      { label: 'Realtime Pipeline', href: '/admin/realtime', icon: Radio },
      { label: 'Batch Pipeline', href: '/admin/batch', icon: Database },
      { label: 'Kafka Topics', href: '/admin/kafka', icon: Activity },
      { label: 'Data Processing', href: '/admin/data', icon: Layers },
    ]},
    { group: 'SYSTEM & MODELS', items: [
      { label: 'ML Models', href: '/admin/models', icon: Cpu },
      { label: 'System Health', href: '/admin/system', icon: Activity },
      { label: 'Operational Logs', href: '/admin/logs', icon: Terminal },
    ]},
  ];

  const settingsHref = role === 'ADMIN' ? '/admin/settings' : '/user/settings';

  return (
    <aside className="w-64 bg-[#060b19] border-r border-slate-800/80 flex flex-col justify-between h-full select-none">
      {/* Brand Header */}
      <div>
        <div className="h-20 px-6 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(0,180,216,0.3)]">
              <Shield className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-1">
                CYCLONESENSE <span className="text-cyan-400 font-mono text-xs">AI</span>
              </span>
              <span className="text-[8px] font-mono tracking-widest text-slate-400 uppercase">
                TROPICAL INTELLIGENCE
              </span>
            </div>
          </Link>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <div className="p-4 overflow-y-auto max-h-[calc(100vh-160px)] space-y-6">
          {role === 'USER' ? (
            <div className="space-y-1">
              {userNav.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,180,216,0.15)]'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="space-y-6">
              {adminNav.map((sec) => (
                <div key={sec.group} className="space-y-1">
                  <div className="px-3.5 text-[9px] font-mono font-bold tracking-widest text-cyan-400/80 uppercase mb-2">
                    {sec.group}
                  </div>
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onCloseMobile}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          active
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${active ? 'text-blue-400' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Controls & User Profile */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        <Link
          href={settingsHref}
          className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            pathname === settingsHref
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <Settings className="h-4 w-4 text-slate-400" />
          <span>Settings</span>
        </Link>

        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#091024] border border-slate-800">
          <div className="flex flex-col truncate pr-2">
            <span className="text-xs font-bold text-white truncate">{currentUser?.name}</span>
            <span className="text-[10px] font-mono text-cyan-400 truncate">{currentUser?.role}</span>
          </div>
          <button
            onClick={() => signOut()}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
