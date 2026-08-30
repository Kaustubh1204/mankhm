'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/authStore';
import { UserRole } from '@/lib/auth/authTypes';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/signin');
    }
  }, [isLoading, isAuthenticated, router]);

  // Loading spinner during session check (no dashboard content flicker)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#060b19] flex flex-col items-center justify-center text-slate-100 p-4">
        <div className="p-4 rounded-full bg-cyan-500/10 border border-cyan-500/30 animate-spin mb-4">
          <RefreshCw className="h-8 w-8 text-cyan-400" />
        </div>
        <p className="text-sm font-mono text-cyan-300 tracking-wider">VERIFYING SECURITY SESSION...</p>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Role authorization check (User trying to access Admin route)
  if (requiredRole === 'ADMIN' && role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-[#060b19] flex flex-col items-center justify-center text-slate-100 p-6 select-none">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#0b132a] border border-red-500/40 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Access Unauthorized</h2>
            <p className="text-sm text-slate-300 mt-2">
              You do not have permission to access the System Admin Command Center. Admin privileges must be verified by the backend.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => router.replace('/user/dashboard')}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-md"
            >
              Return to User Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
