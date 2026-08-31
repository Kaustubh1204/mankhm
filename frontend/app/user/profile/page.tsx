'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import { useUserProfile } from '@/hooks/useCycloneData';
import { User, Mail, Building, Shield, Calendar, Edit3, Save, Check } from 'lucide-react';

function ProfileContent() {
  const { profile, updateProfile } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile?.name || 'Dr. Alexander Vance');
  const [organization, setOrganization] = useState(profile?.organization || 'National Meteorological & Marine Intelligence Agency');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async () => {
    await updateProfile({ name, organization });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <UserDashboardLayout>
      <div className="space-y-6 max-w-4xl select-none font-mono text-xs">
        {/* Header */}
        <div className="flex items-center justify-between p-6 rounded-3xl bg-[#091126] border border-slate-800 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <User className="h-4 w-4" /> Meteorologist Identity
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                AUTHENTICATED ACTIVE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              User Account Profile
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Personal meteorological credentials, organizational affiliation, and platform permissions.
            </p>
          </div>

          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="px-5 py-2.5 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold flex items-center gap-2 transition-colors shadow-md"
          >
            {isEditing ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
            <span>{isEditing ? 'SAVE PROFILE' : 'EDIT PROFILE'}</span>
          </button>
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-400" />
            <span>Profile credentials updated successfully.</span>
          </div>
        )}

        <div className="p-8 rounded-3xl bg-[#091126] border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center gap-5 pb-6 border-b border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-bold text-2xl shadow-inner">
              <Shield className="h-8 w-8" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <label className="block text-slate-400 text-[10px]">Full Name:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-2 rounded-xl bg-[#060b19] border border-cyan-500/50 text-white text-base font-bold w-full max-w-md focus:outline-none"
                  />
                  <label className="block text-slate-400 text-[10px] pt-1">Organization:</label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="p-2 rounded-xl bg-[#060b19] border border-slate-800 text-cyan-400 text-xs w-full max-w-md focus:outline-none"
                  />
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-black text-white">{profile?.name || name}</h2>
                  <span className="text-xs text-cyan-400 font-bold block mt-0.5">{profile?.organization || organization}</span>
                  <span className="text-[10px] text-slate-500 block mt-1">Account Created: {profile?.createdAt || '2026-01-15'}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-1.5 p-4 rounded-2xl bg-[#060b19] border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase block font-bold">Email Address</span>
              <div className="flex items-center gap-2 text-white font-bold">
                <Mail className="h-4 w-4 text-cyan-400" />
                <span>{profile?.email || 'alexander.vance@cyclonesense.ai'}</span>
              </div>
            </div>

            <div className="space-y-1.5 p-4 rounded-2xl bg-[#060b19] border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase block font-bold">Organizational Affiliation</span>
              <div className="flex items-center gap-2 text-white font-bold">
                <Building className="h-4 w-4 text-cyan-400" />
                <span>{profile?.organization || organization}</span>
              </div>
            </div>

            <div className="space-y-1.5 p-4 rounded-2xl bg-[#060b19] border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase block font-bold">Role & Access Tier</span>
              <div className="flex items-center gap-2 text-cyan-300 font-bold">
                <Shield className="h-4 w-4 text-cyan-400" />
                <span>{profile?.role || 'USER'} (Meteorological Analyst Tier)</span>
              </div>
            </div>

            <div className="space-y-1.5 p-4 rounded-2xl bg-[#060b19] border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase block font-bold">Security Session</span>
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Calendar className="h-4 w-4 text-emerald-400" />
                <span>ACTIVE ENCRYPTED SESSION</span>
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
