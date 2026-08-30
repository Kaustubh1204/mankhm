'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/authStore';
import NotificationsDropdown from './NotificationsDropdown';
import { Search, Menu, WifiOff, Shield } from 'lucide-react';

interface TopbarProps {
  onOpenMobileNav?: () => void;
}

export default function Topbar({ onOpenMobileNav }: TopbarProps) {
  const pathname = usePathname();
  const { currentUser } = useAuth();
  const isApiConnected = Boolean(process.env.NEXT_PUBLIC_API_URL);

  // Compute title from route
  const getPageTitle = (path: string) => {
    const parts = path.split('/').filter(Boolean);
    if (parts.length === 0) return 'Dashboard';
    const last = parts[parts.length - 1];
    return last.replace(/-/g, ' ').toUpperCase();
  };

  const title = getPageTitle(pathname);

  return (
    <header className="h-20 border-b border-slate-800/80 bg-[#060b19]/85 backdrop-blur-xl px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Mobile Drawer Trigger & Title */}
      <div className="flex items-center gap-4">
        {onOpenMobileNav && (
          <button
            onClick={onOpenMobileNav}
            className="lg:hidden p-2 rounded-xl bg-[#091024] border border-slate-700 text-slate-300 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div>
          {/* Breadcrumb */}
          <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
            <Link href="/" className="hover:text-cyan-400 transition-colors">
              CycloneSense AI
            </Link>
            <span>/</span>
            <span className="text-cyan-400 font-semibold">{currentUser?.role || 'USER'}</span>
          </div>
          {/* Page Title */}
          <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Right Controls: Search, Data Status, Notifications, User Badge */}
      <div className="flex items-center gap-3">
        {/* Global Search Bar */}
        <div className="hidden md:flex relative w-48 xl:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="h-3.5 w-3.5" />
          </div>
          <input
            type="text"
            placeholder="Search cyclones, alerts..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#091024] border border-slate-800 focus:border-cyan-500 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Data Status Indicator */}
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold border ${
            isApiConnected
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
          }`}
          title={isApiConnected ? 'Backend API Connected' : 'No backend API configured'}
        >
          <span className={`w-2 h-2 rounded-full ${isApiConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span className="hidden sm:inline">{isApiConnected ? 'DATA STREAM ONLINE' : 'DATA OFFLINE'}</span>
          {!isApiConnected && <WifiOff className="h-3.5 w-3.5 sm:hidden text-amber-400" />}
        </div>

        {/* Notifications Dropdown */}
        <NotificationsDropdown />

        {/* User Role Badge */}
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
            <Shield className="h-4 w-4" />
          </div>
        </div>
      </div>
    </header>
  );
}
