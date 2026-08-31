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
  ShieldAlert,
  TrendingUp,
  History,
  Bookmark,
  FileText,
  Bell,
  MessageSquare,
  User,
  Settings,
  HelpCircle,
  LogOut,
  X,
} from 'lucide-react';

interface UserSidebarProps {
  onCloseMobile?: () => void;
}

export default function UserSidebar({ onCloseMobile }: UserSidebarProps) {
  const pathname = usePathname();
  const { currentUser, signOut } = useAuth();

  const navGroups = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', href: '/user/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'MONITOR',
      items: [
        { label: 'Live Cyclones', href: '/user/cyclones', icon: Radio },
        { label: 'Live Map', href: '/user/live-map', icon: MapPin },
        { label: 'Risk Map', href: '/user/risk-map', icon: ShieldAlert },
      ],
    },
    {
      title: 'ANALYSIS',
      items: [
        { label: 'Forecast', href: '/user/forecast', icon: TrendingUp },
        { label: 'Historical Data', href: '/user/history', icon: History },
        { label: 'Saved Cyclones', href: '/user/saved', icon: Bookmark },
        { label: 'Reports', href: '/user/reports', icon: FileText },
      ],
    },
    {
      title: 'COMMUNICATION',
      items: [
        { label: 'Alerts', href: '/user/alerts', icon: Bell },
        { label: 'Notifications', href: '/user/notifications', icon: MessageSquare },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { label: 'Profile', href: '/user/profile', icon: User },
        { label: 'Settings', href: '/user/settings', icon: Settings },
      ],
    },
  ];

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
              <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">
                Cyclone Intelligence
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

        {/* Grouped Navigation */}
        <div className="p-4 overflow-y-auto max-h-[calc(100vh-160px)] space-y-5">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-3 text-[9px] font-mono font-bold tracking-widest text-cyan-400/80 uppercase mb-1.5">
                {group.title}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
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
          ))}
        </div>
      </div>

      {/* Bottom Controls: Help & Logout */}
      <div className="p-4 border-t border-slate-800/80 space-y-2">
        <button
          onClick={() => alert('CycloneSense AI Help Desk: Contact support@cyclonesense.ai')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/40 transition-colors"
        >
          <HelpCircle className="h-4 w-4 text-slate-400" />
          <span>Help & Support</span>
        </button>

        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#091024] border border-slate-800">
          <div className="flex flex-col truncate pr-2">
            <span className="text-xs font-bold text-white truncate">{currentUser?.name}</span>
            <span className="text-[10px] font-mono text-cyan-400 truncate">{currentUser?.email}</span>
          </div>
          <button
            onClick={() => signOut()}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
            title="Log Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
