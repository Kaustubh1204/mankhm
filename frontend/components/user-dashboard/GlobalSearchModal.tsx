'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboard } from '@/context/DashboardContext';
import { cycloneApi } from '@/lib/api/cycloneApi';
import { historyApi } from '@/lib/api/historyApi';
import { alertApi } from '@/lib/api/alertApi';
import { reportApi } from '@/lib/api/reportApi';
import { Cyclone, HistoricalCyclone, CycloneAlert, CycloneReport } from '@/types/cyclone';
import { Search, Radio, History, Bell, FileText, X, ArrowRight } from 'lucide-react';
import StatusBadge from '@/components/dashboard/StatusBadge';

export default function GlobalSearchModal() {
  const { isSearchOpen, setIsSearchOpen, setSelectedCycloneId } = useDashboard();
  const [query, setQuery] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [cycloneResults, setCycloneResults] = useState<Cyclone[]>([]);
  const [historyResults, setHistoryResults] = useState<HistoricalCyclone[]>([]);
  const [alertResults, setAlertResults] = useState<CycloneAlert[]>([]);
  const [reportResults, setReportResults] = useState<CycloneReport[]>([]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Execute search queries
  useEffect(() => {
    let isMounted = true;

    async function runSearch() {
      if (!query.trim()) {
        const [cycs, alts, rpts] = await Promise.all([
          cycloneApi.getCyclones(),
          alertApi.getAlerts(),
          reportApi.getReports(),
        ]);
        if (isMounted) {
          setCycloneResults(cycs);
          setHistoryResults([]);
          setAlertResults(alts.slice(0, 3));
          setReportResults(rpts.slice(0, 2));
        }
        return;
      }

      const [cycs, hists, alts, rpts] = await Promise.all([
        cycloneApi.searchCyclones(query),
        historyApi.searchHistoricalCyclones(query),
        alertApi.getAlerts(),
        reportApi.getReports(),
      ]);

      if (isMounted) {
        setCycloneResults(cycs);
        setHistoryResults(hists);
        setAlertResults(
          alts.filter(
            (a) =>
              a.title.toLowerCase().includes(query.toLowerCase()) ||
              a.region.toLowerCase().includes(query.toLowerCase())
          )
        );
        setReportResults(
          rpts.filter(
            (r) =>
              r.reportName.toLowerCase().includes(query.toLowerCase()) ||
              (r.cycloneName && r.cycloneName.toLowerCase().includes(query.toLowerCase()))
          )
        );
      }
    }

    runSearch();

    return () => {
      isMounted = false;
    };
  }, [query]);

  if (!isSearchOpen) return null;

  const handleSelectCyclone = (c: Cyclone) => {
    setSelectedCycloneId(c.id);
    setIsSearchOpen(false);
    router.push(`/user/cyclones/${c.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-md select-none">
      <div className="w-full max-w-2xl rounded-3xl bg-[#091126] border border-cyan-500/40 shadow-2xl overflow-hidden font-mono text-xs animate-in fade-in zoom-in duration-200">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-800 bg-[#060b19]">
          <Search className="h-5 w-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search active cyclones, historical vortex records, alerts, reports..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5 custom-scrollbar">
          {/* Active Cyclones */}
          {cycloneResults.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Radio className="h-3.5 w-3.5 text-cyan-400" /> Active & Monitored Cyclones
              </span>
              <div className="space-y-1.5">
                {cycloneResults.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCyclone(c)}
                    className="p-3 rounded-2xl bg-[#060b19] border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/40 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white group-hover:text-cyan-300 text-sm">{c.name}</span>
                        <StatusBadge status={c.status} size="sm" />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {c.classification} • {c.region} ({c.maxWindKmH} km/h, {c.centralPressureHpa} hPa)
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Historical Archives */}
          {historyResults.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1.5">
                <History className="h-3.5 w-3.5 text-cyan-400" /> Historical Cyclone Records
              </span>
              <div className="space-y-1.5">
                {historyResults.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      router.push('/user/history');
                    }}
                    className="p-3 rounded-2xl bg-[#060b19] border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/40 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white group-hover:text-cyan-300">{h.cycloneName}</span>
                        <span className="text-[10px] text-cyan-400">({h.year})</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Peak: {h.peakWindKmH} km/h • {h.maxClassification} • {h.region}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alerts */}
          {alertResults.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Bell className="h-3.5 w-3.5 text-amber-400" /> Related Emergency Alerts
              </span>
              <div className="space-y-1.5">
                {alertResults.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      router.push('/user/alerts');
                    }}
                    className="p-2.5 rounded-xl bg-[#060b19] border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/40 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="truncate pr-2">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={a.severity} size="sm" />
                        <span className="font-bold text-white truncate text-xs">{a.title}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{a.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-cyan-400 shrink-0 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reports */}
          {reportResults.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-teal-400" /> Generated Intelligence Reports
              </span>
              <div className="space-y-1.5">
                {reportResults.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      router.push('/user/reports');
                    }}
                    className="p-2.5 rounded-xl bg-[#060b19] border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/40 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <span className="font-bold text-white group-hover:text-cyan-300 text-xs">{r.reportName}</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{r.generatedTimestamp} ({r.fileSizeMb} MB)</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-cyan-400 shrink-0 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
