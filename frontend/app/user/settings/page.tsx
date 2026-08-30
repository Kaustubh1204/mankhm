'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import { useAuth } from '@/lib/auth/authStore';
import { User, Compass, Bell, Check, Save } from 'lucide-react';

function UserSettingsContent() {
  const { currentUser } = useAuth();
  const [windUnit, setWindUnit] = useState<'kmh' | 'kt' | 'mph'>('kmh');
  const [pressureUnit, setPressureUnit] = useState<'hPa' | 'mb'>('hPa');
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'miles'>('km');
  const [timezone, setTimezone] = useState<'UTC' | 'IST' | 'LOCAL'>('UTC');

  const [notifState, setNotifState] = useState({
    cycloneUpdateAlerts: true,
    forecastChangeAlerts: true,
    riskAlerts: true,
    criticalAlerts: true,
    systemNotifications: true,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleNotif = (key: keyof typeof notifState) => {
    setNotifState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <UserDashboardLayout>
      <div className="space-y-6 max-w-4xl select-none">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Account Settings & Preferences</h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Manage profile settings, notification channels, and measurement units.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-2 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>SAVE PREFERENCES</span>
          </button>
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-400" />
            <span>Preferences saved successfully.</span>
          </div>
        )}

        {/* Profile Identity */}
        <div className="p-6 rounded-2xl bg-[#091024] border border-slate-800 space-y-6">
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <User className="h-4 w-4 text-cyan-400" />
            <span>Profile Identity</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                readOnly
                value={currentUser?.name || 'Dr. Alexander Vance'}
                className="w-full p-2.5 rounded-xl bg-[#060b19] border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Email Address</label>
              <input
                type="text"
                readOnly
                value={currentUser?.email || 'user@cyclonesense.ai'}
                className="w-full p-2.5 rounded-xl bg-[#060b19] border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Organization</label>
              <input
                type="text"
                readOnly
                value={currentUser?.organization || 'National Meteorological Agency'}
                className="w-full p-2.5 rounded-xl bg-[#060b19] border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Role Permission</label>
              <input
                type="text"
                readOnly
                value={currentUser?.role || 'USER'}
                className="w-full p-2.5 rounded-xl bg-[#060b19] border border-slate-800 text-xs text-cyan-400 font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings Toggles */}
        <div className="p-6 rounded-2xl bg-[#091024] border border-slate-800 space-y-4">
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Bell className="h-4 w-4 text-cyan-400" />
            <span>Notification Preferences</span>
          </h3>

          <div className="space-y-3 text-xs font-mono">
            {[
              { key: 'cycloneUpdateAlerts' as const, label: 'Cyclone Intensity Escalation Updates' },
              { key: 'forecastChangeAlerts' as const, label: 'Trajectory Forecast Horizon Changes' },
              { key: 'riskAlerts' as const, label: 'Coastal Hazard & Surge Risk Upgrades' },
              { key: 'criticalAlerts' as const, label: 'Critical Emergency Warnings' },
              { key: 'systemNotifications' as const, label: 'System Telemetry Bulletins' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-[#060b19] border border-slate-800">
                <span className="text-slate-200">{item.label}</span>
                <button
                  onClick={() => toggleNotif(item.key)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    notifState[item.key] ? 'bg-cyan-500 justify-end' : 'bg-slate-800 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-md" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Unit & Display Preferences */}
        <div className="p-6 rounded-2xl bg-[#091024] border border-slate-800 space-y-4">
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Compass className="h-4 w-4 text-cyan-400" />
            <span>Measurement Units & Display Timezone</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1">Wind Speed Unit</label>
              <select
                value={windUnit}
                onChange={(e) => setWindUnit(e.target.value as 'kmh' | 'kt' | 'mph')}
                className="w-full p-2.5 rounded-xl bg-[#060b19] border border-slate-800 text-white focus:outline-none"
              >
                <option value="kmh">Kilometers per Hour (km/h)</option>
                <option value="kt">Knots (kt)</option>
                <option value="mph">Miles per Hour (mph)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Pressure Unit</label>
              <select
                value={pressureUnit}
                onChange={(e) => setPressureUnit(e.target.value as 'hPa' | 'mb')}
                className="w-full p-2.5 rounded-xl bg-[#060b19] border border-slate-800 text-white focus:outline-none"
              >
                <option value="hPa">Hectopascals (hPa)</option>
                <option value="mb">Millibars (mb)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Distance Unit</label>
              <select
                value={distanceUnit}
                onChange={(e) => setDistanceUnit(e.target.value as 'km' | 'miles')}
                className="w-full p-2.5 rounded-xl bg-[#060b19] border border-slate-800 text-white focus:outline-none"
              >
                <option value="km">Kilometers (km)</option>
                <option value="miles">Nautical Miles (miles)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Display Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value as 'UTC' | 'IST' | 'LOCAL')}
                className="w-full p-2.5 rounded-xl bg-[#060b19] border border-slate-800 text-white focus:outline-none"
              >
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="IST">IST (Indian Standard Time UTC+5:30)</option>
                <option value="LOCAL">Local System Timezone</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
}

export default function UserSettingsPage() {
  return (
    <ProtectedRoute requiredRole="USER">
      <UserSettingsContent />
    </ProtectedRoute>
  );
}
