'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import EmptyState from '@/components/dashboard/EmptyState';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { modelApi, ModelAgreement } from '@/lib/api/modelApi';
import { TrendingUp, Cpu } from 'lucide-react';

function ForecastModelsContent() {
  const [agreement, setAgreement] = useState<ModelAgreement[]>([]);

  useEffect(() => {
    async function loadData() {
      const res = await modelApi.getModelAgreement();
      setAgreement(res.data || []);
    }
    loadData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6 select-none">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Forecast Models & Model Agreement Matrix</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Compare multi-model predictions across Detection, Intensity, Rapid Intensification, and Track tasks.
          </p>
        </div>

        {/* Agreement Matrix Card */}
        <div className="p-6 rounded-2xl bg-[#091024] border border-slate-800 space-y-4">
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Cpu className="h-4 w-4 text-blue-400" />
            <span>Ensemble Model Agreement Matrix</span>
          </h3>

          {agreement.length === 0 ? (
            <EmptyState
              title="Model metrics unavailable."
              description="Awaiting multi-model prediction output from ML inference workers."
              icon={TrendingUp}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {agreement.map((item) => (
                <div key={item.task} className="p-4 rounded-xl bg-[#060b19] border border-slate-800 space-y-2">
                  <div className="text-xs font-mono font-bold text-slate-400">{item.task}</div>
                  <StatusBadge status={item.status} />
                  <div className="text-[10px] font-mono text-slate-500">
                    Confidence: {item.confidencePct !== null ? `${item.confidencePct}%` : '--'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function ForecastModelsPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <ForecastModelsContent />
    </ProtectedRoute>
  );
}
