'use client';

import React, { useState } from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const notifications: { id: string; title: string; category: string; time: string }[] = [];

  return (
    <div className="relative select-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl bg-[#091024] border border-slate-700/80 text-slate-300 hover:text-white hover:border-cyan-500/40 transition-colors relative"
        title="Notifications"
      >
        <Bell className="h-4 w-4" />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-[#091126] border border-slate-700 shadow-2xl p-4 z-50 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Notifications</h4>
            <span className="text-[10px] font-mono text-slate-400">0 UNREAD</span>
          </div>

          {notifications.length === 0 ? (
            <div className="py-6 text-center text-xs font-mono text-slate-400 space-y-1">
              <CheckCircle2 className="h-6 w-6 text-slate-600 mx-auto mb-2" />
              <p>No new notifications.</p>
              <p className="text-[10px] text-slate-500">Alerts will stream when backend triggers event.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((n) => (
                <div key={n.id} className="p-2.5 rounded-xl bg-[#060b19] border border-slate-800 text-xs">
                  <div className="flex justify-between font-semibold text-white">
                    <span>{n.title}</span>
                    <span className="text-[10px] font-mono text-slate-400">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
