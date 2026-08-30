'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/lib/auth/authStore';
import { ShieldCheck, RefreshCw } from 'lucide-react';

function AdminSettingsContent() {
  const { currentUser } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl select-none">
        <div>
          <h1 className="text-2xl font-extrabold text-white">System Admin Settings & Operations</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            System configuration, data refresh intervals, and notification webhook hooks.
          </p>
        </div>

        {/* Administrator Profile Details */}
        <div className="p-6 rounded-2xl bg-[#091024] border border-slate-800 space-y-6">
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-400" />
            <span>Admin Console Identity</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Admin Name</label>
              <input
                type="text"
                readOnly
                value={currentUser?.name || ''}
                className="w-full p-2.5 rounded-xl bg-[#060b19] border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Admin Email</label>
              <input
                type="text"
                readOnly
                value={currentUser?.email || ''}
                className="w-full p-2.5 rounded-xl bg-[#060b19] border border-slate-800 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Refresh & Ingestion Preferences */}
        <div className="p-6 rounded-2xl bg-[#091024] border border-slate-800 space-y-4">
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-blue-400" />
            <span>Telemetry Refresh Frequency</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1">Realtime Pipeline Target</label>
              <select className="w-full p-2.5 rounded-xl bg-[#060b19] border border-slate-800 text-white focus:outline-none">
                <option>Every 15 Minutes (Default)</option>
                <option>Every 5 Minutes</option>
                <option>Immediate / Event-Driven</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Batch Cycle Target</label>
              <select className="w-full p-2.5 rounded-xl bg-[#060b19] border border-slate-800 text-white focus:outline-none">
                <option>Every 6 Hours (Default)</option>
                <option>Every 12 Hours</option>
                <option>Every 24 Hours</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function AdminSettingsPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminSettingsContent />
    </ProtectedRoute>
  );
}
