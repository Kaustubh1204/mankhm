'use client';

import React, { useState } from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import { Mail, AlertCircle, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your email to request a password recovery link"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Backend Not Connected Notice */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
          <div>
            <span className="font-semibold block mb-0.5">SERVICE NOTICE</span>
            <span>Password recovery service is not connected yet. Please contact system administrator for manual password reset.</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@organization.com"
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#060b19] border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitted}
          className="btn interactive-button w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-sm transition-all shadow-md disabled:opacity-50"
        >
          SEND RESET LINK
        </button>

        <p className="text-center text-xs text-slate-400 pt-2">
          <a href="/signin" className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors font-semibold">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Sign In</span>
          </a>
        </p>
      </form>
    </AuthLayout>
  );
}
