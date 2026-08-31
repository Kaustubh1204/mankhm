'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, Radio, Bell, History, FileText, X } from 'lucide-react';
import { MOCK_CYCLONES } from '@/lib/mock/cycloneMock';
import { MOCK_ALERTS } from '@/lib/mock/alertMock';
import { MOCK_HISTORICAL_CYCLONES } from '@/lib/mock/historyMock';
import { MOCK_REPORTS } from '@/lib/mock/reportMock';
import { HistoricalCyclone } from '@/types/cyclone';

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const q = query.trim().toLowerCase();

  const cycloneResults = q ? MOCK_CYCLONES.filter((c) => c.name.toLowerCase().includes(q) || c.classification.toLowerCase().includes(q)) : [];
  const alertResults = q ? MOCK_ALERTS.filter((a) => a.title.toLowerCase().includes(q) || a.region.toLowerCase().includes(q)) : [];
  const historyResults = q ? MOCK_HISTORICAL_CYCLONES.filter((h: HistoricalCyclone) => h.cycloneName.toLowerCase().includes(q) || h.region.toLowerCase().includes(q)) : [];
  const reportResults = q ? MOCK_REPORTS.filter((r) => r.reportName.toLowerCase().includes(q)) : [];

  const totalResults = cycloneResults.length + alertResults.length + historyResults.length + reportResults.length;

  return (
    <div ref={containerRef} className="relative w-48 xl:w-64">
      <div className="relative">
        <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-500 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search cyclones, alerts..."
          className="w-full pl-9 pr-7 py-1.5 rounded-xl bg-[#091024] border border-slate-800 focus:border-cyan-500 text-xs text-white placeholder-slate-500 focus:outline-none"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Search Dropdown Results */}
      {isOpen && q.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-[#091126] border border-slate-700 shadow-2xl p-3 z-50 max-h-96 overflow-y-auto space-y-3">
          {totalResults === 0 ? (
            <div className="p-4 text-center text-xs font-mono text-slate-400">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            <>
              {cycloneResults.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest px-2">Cyclones</span>
                  {cycloneResults.map((c) => (
                    <Link
                      key={c.id}
                      href={`/user/cyclones/${c.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/60 text-xs text-white transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Radio className="h-3.5 w-3.5 text-cyan-400" />
                        <span className="font-bold font-mono">{c.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{c.classification}</span>
                    </Link>
                  ))}
                </div>
              )}

              {alertResults.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest px-2">Alerts</span>
                  {alertResults.map((a) => (
                    <Link
                      key={a.id}
                      href="/user/alerts"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/60 text-xs text-white transition-colors"
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <Bell className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{a.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">{a.severity}</span>
                    </Link>
                  ))}
                </div>
              )}

              {historyResults.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest px-2">Historical Records</span>
                  {historyResults.map((h) => (
                    <Link
                      key={h.id}
                      href="/user/history"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/60 text-xs text-white transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <History className="h-3.5 w-3.5 text-blue-400" />
                        <span className="font-bold">{h.cycloneName}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{h.year}</span>
                    </Link>
                  ))}
                </div>
              )}

              {reportResults.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-teal-400 uppercase tracking-widest px-2">Reports</span>
                  {reportResults.map((r) => (
                    <Link
                      key={r.id}
                      href="/user/reports"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/60 text-xs text-white transition-colors"
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <FileText className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                        <span className="truncate">{r.reportName}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
