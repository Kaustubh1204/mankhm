'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/authStore';
import NotificationsDropdown from './NotificationsDropdown';
import GlobalSearch from './GlobalSearch';
import { Menu, Shield, User, Settings, LogOut, Info } from 'lucide-react';

interface UserTopbarProps {
  onOpenMobileNav?: () => void;
}

export default function UserTopbar({ onOpenMobileNav }: UserTopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, signOut } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const getPageTitle = (path: string) => {
    const parts = path.split('/').filter(Boolean);
    if (parts.length === 0) return 'Dashboard';
    const last = parts[parts.length - 1];
    return last.replace(/-/g, ' ').toUpperCase();
  };

  const title = getPageTitle(pathname);

  const handleLogout = async () => {
    await signOut();
    router.replace('/');
  };

  return (
    <header className="h-20 border-b border-slate-800/80 bg-[#060b19]/85 backdrop-blur-xl px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Left: Mobile Trigger, Breadcrumb & Title */}
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
          <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
            <Link href="/" className="hover:text-cyan-400 transition-colors">
              CycloneSense AI
            </Link>
            <span>/</span>
            <span className="text-cyan-400 font-semibold">User Intelligence</span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Right Controls: Global Search, DEMO DATA Badge, Notifications, Profile Menu */}
      <div className="flex items-center gap-3">
        {/* Global Search Component */}
        <div className="hidden md:block">
          <GlobalSearch />
        </div>

        {/* DEMO DATA Mode Badge */}
        <div
          className="group relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/40 cursor-help"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>DEMO DATA</span>
          <Info className="h-3.5 w-3.5 text-amber-400" />

          {/* Hover Tooltip */}
          <div className="absolute top-full right-0 mt-2 w-64 p-2.5 rounded-xl bg-[#091126] border border-amber-500/40 text-[10px] font-mono text-slate-300 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            Dashboard is currently using demonstration data. Production data will be connected through the backend.
          </div>
        </div>

        {/* Notifications Dropdown */}
        <NotificationsDropdown />

        {/* User Profile Menu */}
        <div className="relative pl-2 border-l border-slate-800">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl bg-[#091024] border border-slate-800 hover:border-cyan-500/40 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs">
              <Shield className="h-3.5 w-3.5" />
            </div>
            <span className="hidden xl:inline text-xs font-bold text-white max-w-[100px] truncate">
              {currentUser?.name || 'User'}
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-48 rounded-2xl bg-[#091126] border border-slate-700 shadow-2xl p-2 z-50 space-y-1">
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
                <p className="text-[10px] font-mono text-cyan-400 truncate">{currentUser?.role}</p>
              </div>

              <Link
                href="/user/profile"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span>Profile</span>
              </Link>

              <Link
                href="/user/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                <Settings className="h-3.5 w-3.5 text-slate-400" />
                <span>Settings</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors text-left"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
