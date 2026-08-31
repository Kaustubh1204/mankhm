'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import { useUserSettings } from '@/hooks/useCycloneData';
import { Settings, Compass, Bell, Check, Save, Sliders } from 'lucide-react';

function UserSettingsContent() {
  const { settings, updateSettings } = useUserSettings();

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

  useEffect(() => {
    if (settings) {
      setWindUnit(settings.windUnit);
      setPressureUnit(settings.pressureUnit);
      setDistanceUnit(settings.distanceUnit);
      setTimezone(settings.timezone);
      setNotifState(settings.notifications);
    }
  }, [settings]);

  const toggleNotif = (key: keyof typeof notifState) => {
    setNotifState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    await updateSettings({
      windUnit,
      pressureUnit,
      distanceUnit,
      timezone,
      notifications: notifState,
    });
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
                <Settings className="h-4 w-4" /> Preferences & System Tuning
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                USER PREFERENCES
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Dashboard Settings & Measurement Units
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Configure meteorological unit standards, display timezones, and telemetry push notification channels.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold flex items-center gap-2 transition-colors shadow-md"
          >
            <Save className="h-4 w-4" />
            <span>SAVE PREFERENCES</span>
          </button>
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-400" />
            <span>Meteorological preferences and notification channels saved successfully.</span>
          </div>
        )}

        {/* Unit & Display Preferences */}
        <div className="p-6 rounded-3xl bg-[#091126] border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Compass className="h-4 w-4 text-cyan-400" />
            <span>Measurement Units & Display Timezone</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 p-4 rounded-2xl bg-[#060b19] border border-slate-800">
              <label className="block text-slate-400 text-[10px] uppercase font-bold">Wind Speed Standard</label>
              <select
                value={windUnit}
                onChange={(e) => setWindUnit(e.target.value as 'kmh' | 'kt' | 'mph')}
                className="w-full p-2.5 rounded-xl bg-[#091126] border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="kmh">Kilometers per Hour (km/h)</option>
                <option value="kt">Nautical Knots (kt)</option>
                <option value="mph">Miles per Hour (mph)</option>
              </select>
            </div>

            <div className="space-y-1.5 p-4 rounded-2xl bg-[#060b19] border border-slate-800">
              <label className="block text-slate-400 text-[10px] uppercase font-bold">Pressure Standard</label>
              <select
                value={pressureUnit}
                onChange={(e) => setPressureUnit(e.target.value as 'hPa' | 'mb')}
                className="w-full p-2.5 rounded-xl bg-[#091126] border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="hPa">Hectopascals (hPa)</option>
                <option value="mb">Millibars (mb)</option>
              </select>
            </div>

            <div className="space-y-1.5 p-4 rounded-2xl bg-[#060b19] border border-slate-800">
              <label className="block text-slate-400 text-[10px] uppercase font-bold">Spatial Distance Unit</label>
              <select
                value={distanceUnit}
                onChange={(e) => setDistanceUnit(e.target.value as 'km' | 'miles')}
                className="w-full p-2.5 rounded-xl bg-[#091126] border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="km">Kilometers (km)</option>
                <option value="miles">Nautical Miles (NM)</option>
              </select>
            </div>

            <div className="space-y-1.5 p-4 rounded-2xl bg-[#060b19] border border-slate-800">
              <label className="block text-slate-400 text-[10px] uppercase font-bold">Observation Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value as 'UTC' | 'IST' | 'LOCAL')}
                className="w-full p-2.5 rounded-xl bg-[#091126] border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="IST">IST (Indian Standard Time UTC+5:30)</option>
                <option value="LOCAL">Local System Clock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings Toggles */}
        <div className="p-6 rounded-3xl bg-[#091126] border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Bell className="h-4 w-4 text-cyan-400" />
            <span>Automated Telemetry & Hazard Dispatch Toggles</span>
          </h3>

          <div className="space-y-2.5">
            {[
              { key: 'cycloneUpdateAlerts' as const, label: 'Cyclone Intensity Escalation & Dvorak T-Number Shifts' },
              { key: 'forecastChangeAlerts' as const, label: '72h Trajectory Ensemble Divergence & Landfall Track Shifts' },
              { key: 'riskAlerts' as const, label: 'Coastal Hazard & Storm Surge Inundation Upgrades' },
              { key: 'criticalAlerts' as const, label: 'Critical Emergency Warnings & Rapid Intensification Notices' },
              { key: 'systemNotifications' as const, label: 'Satellite Ingestion & Sensor Pipeline Status Reports' },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#060b19] border border-slate-800 hover:border-slate-700 transition-colors"
              >
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
