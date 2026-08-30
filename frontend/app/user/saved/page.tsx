'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import StatusBadge from '@/components/dashboard/StatusBadge';
import EmptyState from '@/components/dashboard/EmptyState';
import { MOCK_CYCLONES, MockCyclone } from '@/lib/mock/cycloneMock';
import { Bookmark, ArrowRight, Trash2 } from 'lucide-react';

function SavedCyclonesContent() {
  const [savedList, setSavedList] = useState<MockCyclone[]>(
    MOCK_CYCLONES.filter((c) => c.isSaved !== false)
  );

  const removeSaved = (id: string) => {
    setSavedList((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <UserDashboardLayout>
      <div className="space-y-6 select-none">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Bookmark className="h-6 w-6 text-cyan-400 fill-cyan-400" />
              <span>Saved & Followed Cyclones</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                DEMO DATA
              </span>
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Bookmarked tropical vortex systems receiving automated trajectory alert feeds.
            </p>
          </div>
        </div>

        {savedList.length === 0 ? (
          <EmptyState
            title="No saved cyclones."
            description="Bookmark active or historical cyclone systems from their detail view to receive direct trajectory updates."
            icon={Bookmark}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedList.map((c) => (
              <div
                key={c.id}
                className="p-6 rounded-2xl bg-[#091024] border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white font-mono">{c.name}</h3>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="text-xs text-slate-400">{c.classification} ({c.region})</p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300 pt-2 border-t border-slate-800">
                    <span>Wind: <strong>{c.maxWindKmH} km/h</strong></span>
                    <span>Pressure: <strong>{c.centralPressureHpa} hPa</strong></span>
                    <span>Vector: <strong>{c.movementDirection} @ {c.movementSpeedKmH} km/h</strong></span>
                    <span>Position: <strong>{c.latitude}°N, {c.longitude}°E</strong></span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <button
                    onClick={() => removeSaved(c.id)}
                    className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors border border-red-500/30"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>REMOVE</span>
                  </button>

                  <Link
                    href={`/user/cyclones/${c.id}`}
                    className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center gap-2 border border-cyan-500/40 transition-colors"
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
