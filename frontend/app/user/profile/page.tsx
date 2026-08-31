'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import { useAuth } from '@/lib/auth/authStore';
import { User, Mail, Building, Shield, Calendar, Edit3, Save, Check } from 'lucide-react';

function ProfileContent() {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || 'Dr. Alexander Vance');
  const [organization, setOrganization] = useState(currentUser?.organization || 'National Meteorological Agency');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <UserDashboardLayout>
      <div className="space-y-6 max-w-3xl select-none">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white">User Account Profile</h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Personal identity credentials and organizational membership details.
            </p>
          </div>

          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-2 transition-colors"
          >
            {isEditing ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
            <span>{isEditing ? 'SAVE CHANGES' : 'EDIT PROFILE'}</span>
          </button>
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-400" />
            <span>Profile details updated successfully.</span>
          </div>
        )}

        <div className="p-8 rounded-3xl bg-[#091024] border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-bold text-2xl shadow-inner">
              <User className="h-8 w-8" />
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-1.5 rounded-lg bg-[#060b19] border border-cyan-500/50 text-white text-lg font-bold w-full focus:outline-none"
                />
              ) : (
                <h2 className="text-xl font-extrabold text-white">{name}</h2>
              )}
              {isEditing ? (
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="p-1 rounded-lg bg-[#060b19] border border-slate-800 text-cyan-400 text-xs font-mono w-full mt-1 focus:outline-none"
                />
              ) : (
                <span className="text-xs font-mono text-cyan-400 block mt-0.5">{organization}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-mono">
            <div className="space-y-1">
              <span className="text-slate-500 block">Email Address</span>
              <div className="flex items-center gap-2 text-white font-bold">
                <Mail className="h-4 w-4 text-cyan-400" />
                <span>{currentUser?.email || 'user@cyclonesense.ai'}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 block">Organization</span>
              <div className="flex items-center gap-2 text-white font-bold">
                <Building className="h-4 w-4 text-cyan-400" />
                <span>{organization}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 block">Access Level</span>
              <div className="flex items-center gap-2 text-cyan-300 font-bold">
                <Shield className="h-4 w-4 text-cyan-400" />
                <span>{currentUser?.role || 'USER'}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 block">Account Status</span>
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Calendar className="h-4 w-4 text-emerald-400" />
                <span>AUTHENTICATED ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute requiredRole="USER">
      <ProfileContent />
    </ProtectedRoute>
  );
}
