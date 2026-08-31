'use client';

import React, { useState } from 'react';
import UserSidebar from './UserSidebar';
import UserTopbar from './UserTopbar';
import CycloneCursor from '@/components/landing/CycloneCursor';

interface UserDashboardLayoutProps {
  children: React.ReactNode;
}

export default function UserDashboardLayout({ children }: UserDashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#060b19] text-slate-100 flex overflow-hidden">
      {/* Signature Cyclone Custom Cursor */}
      <CycloneCursor />

      {/* Desktop Fixed Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-50">
        <UserSidebar />
      </div>

      {/* Mobile Drawer Navigation Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 max-w-xs z-50">
            <UserSidebar onCloseMobile={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Viewport */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">
        <UserTopbar onOpenMobileNav={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
