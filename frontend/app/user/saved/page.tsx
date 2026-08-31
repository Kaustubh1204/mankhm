'use client';

import React from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import StatusBadge from '@/components/dashboard/StatusBadge';
import EmptyState from '@/components/dashboard/EmptyState';
import { useSavedCyclones } from '@/hooks/useCycloneData';
import { Bookmark, ArrowRight, Trash2, Wind, Gauge, Compass } from 'lucide-react';

function SavedCyclonesContent() {
  const { savedCyclones, removeSaved } = useSavedCyclones();

  return (
    <UserDashboardLayout>
      <div className="space-y-6 select-none font-mono text-xs">
        {/* Header */}
        <div className="flex items-center justify-between p-6 rounded-3xl bg-[#091126] border border-slate-800 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Bookmark className="h-4 w-4 fill-cyan-400" /> Bookmarked Systems
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                DEMO DATA
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Saved & Monitored Cyclones
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Follow active vortex systems receiving continuous AI trajectory and coastal hazard advisory feeds.
            </p>
          </div>
        </div>

        {savedCyclones.length === 0 ? (
          <EmptyState
            title="No saved cyclones."
            description="Bookmark active or developing cyclone vortex systems from their detail view to receive direct tracking updates."
            icon={Bookmark}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedCyclones.map((c) => (
              <div
                key={c.id}
                className="p-6 rounded-3xl bg-[#091126] border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between hover:border-cyan-500/40 transition-all group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors">
                        {c.name}
                      </h3>
                      <span className="text-xs text-cyan-400 font-bold">{c.classification}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{c.region} Basin</span>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Wind className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Wind: <strong>{c.maxWindKmH} km/h</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Gauge className="h-3.5 w-3.5 text-teal-400" />
                      <span>Pressure: <strong className="text-teal-300">{c.centralPressureHpa} hPa</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <Compass className="h-3.5 w-3.5 text-blue-400" />
                      <span>Movement: {c.movementDirection} @ {c.movementSpeedKmH} km/h</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <button
                    onClick={() => removeSaved(c.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-bold flex items-center gap-1.5 transition-colors border border-red-500/30"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>REMOVE</span>
                  </button>

                  <Link
                    href={`/user/cyclones/${c.id}`}
                    className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-2 border border-cyan-500/40 transition-colors shadow-md"
                  >
                    <span>VIEW DETAILS</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserDashboardLayout>
  );
}

export default function SavedCyclonesPage() {
  return (
    <ProtectedRoute requiredRole="USER">
      <SavedCyclonesContent />
    </ProtectedRoute>
  );
}
