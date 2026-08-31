'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/authStore';
import { useDashboard } from '@/context/DashboardContext';
import {
  LayoutDashboard,
  Radio,
  Map as MapIcon,
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
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

interface FloatingSidebarProps {
  onCloseMobile?: () => void;
}

export default function FloatingSidebar({ onCloseMobile }: FloatingSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const { isSidebarExpanded, setIsSidebarExpanded } = useDashboard();

  const handleLogout = async () => {
    await signOut();
    router.replace('/');
  };

  const navGroups = [
    {
      label: 'OVERVIEW',
      items: [
        { label: 'Dashboard', href: '/user/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      label: 'MONITOR',
      items: [
        { label: 'Live Cyclones', href: '/user/cyclones', icon: Radio },
        { label: 'Live Map', href: '/user/live-map', icon: MapIcon },
        { label: 'Risk Map', href: '/user/risk-map', icon: ShieldAlert },
      ],
    },
    {
      label: 'ANALYSIS',
      items: [
        { label: 'Forecast', href: '/user/forecast', icon: TrendingUp },
        { label: 'Historical Data', href: '/user/history', icon: History },
        { label: 'Saved Cyclones', href: '/user/saved', icon: Bookmark },
        { label: 'Reports', href: '/user/reports', icon: FileText },
      ],
    },
    {
      label: 'COMMUNICATION',
      items: [
        { label: 'Alerts', href: '/user/alerts', icon: Bell },
        { label: 'Notifications', href: '/user/notifications', icon: MessageSquare },
      ],
    },
    {
      label: 'ACCOUNT',
      items: [
        { label: 'Profile', href: '/user/profile', icon: User },
        { label: 'Settings', href: '/user/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={`fixed left-4 top-[76px] bottom-4 z-40 rounded-3xl bg-[#091126]/95 border border-slate-800/80 shadow-2xl backdrop-blur-2xl flex flex-col justify-between p-3 select-none pointer-events-auto transition-all duration-300 ${
        isSidebarExpanded ? 'w-60' : 'w-16'
      }`}
    >
      {/* Top Section: Collapse Toggle & Navigation Groups */}
      <div className="flex-1 overflow-y-auto space-y-5 custom-scrollbar pr-0.5">
        {/* Mobile close button / Desktop collapse toggle */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
          {onCloseMobile ? (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-xl bg-slate-800/60 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              className="w-full flex items-center justify-center p-1 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 transition-colors"
              title={isSidebarExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
            >
              {isSidebarExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          )}
        </div>

        {navGroups.map((group) => (
          <div key={group.label} className="space-y-1">
            {isSidebarExpanded && (
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 px-3 block">
                {group.label}
              </span>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/user/dashboard' && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      if (onCloseMobile) onCloseMobile();
                    }}
                    title={item.label}
                    className={`flex items-center gap-3 px-2.5 py-2 rounded-2xl font-mono text-xs transition-all ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    {isSidebarExpanded && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Actions: Help & Logout */}
      <div className="pt-3 border-t border-slate-800/80 space-y-1">
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          title="Help & Documentation"
          className="flex items-center gap-3 px-2.5 py-2 rounded-2xl font-mono text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <HelpCircle className="h-4 w-4 shrink-0 text-slate-400" />
          {isSidebarExpanded && <span>Help & Docs</span>}
        </a>

        <button
          onClick={handleLogout}
          title="Sign Out"
          className="w-full flex items-center gap-3 px-2.5 py-2 rounded-2xl font-mono text-xs text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0 text-red-400" />
          {isSidebarExpanded && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
