'use client';

import React, { useState } from 'react';
import FloatingTopbar from '@/components/user-dashboard/FloatingTopbar';
import FloatingSidebar from '@/components/user-dashboard/FloatingSidebar';
import GlobalSearchModal from '@/components/user-dashboard/GlobalSearchModal';
import ForecastChartsModal from '@/components/user-dashboard/ForecastChartsModal';

interface UserDashboardLayoutProps {
  children: React.ReactNode;
  fullScreenMap?: boolean;
}

function InnerLayout({ children, fullScreenMap = false }: UserDashboardLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 flex flex-col overflow-hidden relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Global Interactive Search Modal (Ctrl+K) */}
      <GlobalSearchModal />

      {/* Global Expandable Analytics Charts Modal */}
      <ForecastChartsModal />

      {/* Floating Top Navigation */}
      <FloatingTopbar onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />

      {/* Floating Collapsible Sidebar (Desktop) */}
      <div className="hidden lg:block">
        <FloatingSidebar />
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-64 max-w-xs z-50">
            <FloatingSidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Viewport Rendering: Full-Screen Map HUD vs Analytical Viewport */}
      {fullScreenMap ? (
        <main className="w-screen h-screen overflow-hidden relative">
          {children}
        </main>
      ) : (
        <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:pl-24 lg:pr-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {children}
        </main>
      )}
    </div>
  );
}

export default function UserDashboardLayout(props: UserDashboardLayoutProps) {
  return <InnerLayout {...props} />;
}
