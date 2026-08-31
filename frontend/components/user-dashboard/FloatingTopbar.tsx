'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/authStore';
import { useDashboard } from '@/context/DashboardContext';
import { Search, Bell, Shield, User, Settings, LogOut, Info, Menu } from 'lucide-react';
import NotificationsDropdown from '@/components/dashboard/NotificationsDropdown';

interface FloatingTopbarProps {
  onOpenMobileSidebar?: () => void;
}

export default function FloatingTopbar({ onOpenMobileSidebar }: FloatingTopbarProps) {
  const router = useRouter();
  const { currentUser, signOut } = useAuth();
  const { setIsSearchOpen, isSidebarExpanded, setIsSidebarExpanded } = useDashboard();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.replace('/');
  };

  return (
    <header className="fixed top-4 left-4 right-4 z-40 h-14 rounded-2xl bg-[#091126]/90 border border-slate-800/80 shadow-2xl backdrop-blur-xl px-4 flex items-center justify-between select-none pointer-events-auto transition-all">
      {/* Left: Brand & Sidebar Trigger */}
      <div className="flex items-center gap-3">
        {onOpenMobileSidebar && (
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-1.5 rounded-xl bg-[#060b19] border border-slate-800 text-slate-300 hover:text-white"
            title="Open Menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        )}

        <button
          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          className="hidden lg:flex p-1.5 rounded-xl bg-[#060b19] border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
          title="Toggle Navigation Sidebar"
        >
          <Menu className="h-4 w-4" />
        </button>

        <Link href="/user/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-all shadow-inner">
            <span className="font-mono font-black text-sm">CS</span>
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-wider text-white flex items-center gap-1.5 group-hover:text-cyan-300 transition-colors">
              CYCLONESENSE <span className="text-cyan-400 text-xs">AI</span>
            </span>
          </div>
        </Link>
      </div>

      {/* Center: Global Search Bar Trigger */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-[#060b19]/90 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-400 transition-all shadow-inner group"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            <span className="text-slate-400 group-hover:text-slate-200">Search cyclone, region or location...</span>
          </div>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Controls: DEMO DATA, Notifications, User Profile */}
      <div className="flex items-center gap-2.5">
        {/* Mobile Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="md:hidden p-2 rounded-xl bg-[#060b19] border border-slate-800 text-slate-300 hover:text-white"
          title="Search"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Subtle DEMO DATA Badge with explanatory Tooltip */}
        <div className="group relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/40 cursor-help">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>DEMO DATA</span>
          <Info className="h-3 w-3 text-amber-400" />

          {/* Hover Tooltip */}
          <div className="absolute top-full right-0 mt-2 w-64 p-2.5 rounded-xl bg-[#091126] border border-amber-500/40 text-[10px] font-mono text-slate-300 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            Current dashboard data is for demonstration. Production data will be connected through the backend.
          </div>
        </div>

        {/* Notifications Dropdown */}
        <NotificationsDropdown />

        {/* Profile Avatar & Dropdown */}
        <div className="relative pl-1">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl bg-[#060b19] border border-slate-800 hover:border-cyan-500/40 transition-colors"
          >
            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs">
              <Shield className="h-3.5 w-3.5" />
            </div>
            <span className="hidden lg:inline text-xs font-bold text-white max-w-[100px] truncate font-mono">
              {currentUser?.name?.split(' ')[0] || 'User'}
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-52 rounded-2xl bg-[#091126] border border-slate-700 shadow-2xl p-2 z-50 space-y-1 font-mono text-xs">
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="font-bold text-white truncate">{currentUser?.name || 'Dr. Alexander Vance'}</p>
                <p className="text-[10px] text-cyan-400 truncate">{currentUser?.role || 'METEOROLOGIST'}</p>
              </div>

              <Link
                href="/user/profile"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span>Profile</span>
              </Link>

              <Link
                href="/user/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                <Settings className="h-3.5 w-3.5 text-slate-400" />
                <span>Settings</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-left font-bold"
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
