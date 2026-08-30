'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/lib/auth/authStore';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { isAuthenticated, currentUser, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const dashboardHref = currentUser?.role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#060b19]/85 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(0,180,216,0.4)] group-hover:scale-105 transition-transform duration-200">
            <Shield className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              CYCLONESENSE <span className="text-cyan-400 font-mono text-sm">AI</span>
            </span>
            <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase -mt-0.5">
              DETECT. CLASSIFY. PREDICT.
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link href="/" className="hover:text-cyan-400 transition-colors">
            Overview
          </Link>
          <a href="#technology" className="hover:text-cyan-400 transition-colors">
            Technology
          </a>
          <a href="#capabilities" className="hover:text-cyan-400 transition-colors">
            Capabilities
          </a>
          <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">
            How It Works
          </a>
        </nav>

        {/* Action Buttons: Unauthenticated vs Authenticated */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                href={dashboardHref}
                className="btn interactive-button inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0e172e] border border-cyan-500/40 hover:bg-[#14203e] text-cyan-300 text-sm font-semibold transition-all shadow-md"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>

              <div className="hidden sm:flex flex-col text-right px-2">
                <span className="text-xs font-bold text-white leading-tight">{currentUser?.name}</span>
                <span className="text-[10px] font-mono text-cyan-400">{currentUser?.role}</span>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-300 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="btn interactive-button px-4 py-2 rounded-lg bg-[#0e172e] border border-slate-700/80 hover:border-cyan-500/40 text-slate-200 text-sm font-medium transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="btn interactive-button px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-[0_0_15px_rgba(0,180,216,0.3)]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
