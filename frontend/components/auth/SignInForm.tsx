'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/authStore';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

export default function SignInForm() {
  const { signIn, adapterMode, clearError } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    let valid = true;
    setEmailError('');
    setPasswordError('');
    setServerError('');

    if (!email.trim()) {
      setEmailError('Email address is required.');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Enter a valid email address.');
      valid = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validate()) return;

    setIsSubmitting(true);
    const res = await signIn({ email, password, rememberMe });
    setIsSubmitting(false);

    if (res.success && res.user) {
      if (res.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/user/dashboard');
      }
    } else {
      setServerError(res.error || 'Invalid email or password.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Dev Adapter Notice */}
      {adapterMode === 'DEV_ADAPTER' && (
        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 flex items-center justify-between">
          <span className="font-mono font-semibold">AUTH UI READY (DEV ADAPTER)</span>
          <span className="text-[10px] bg-cyan-950 px-2 py-0.5 rounded text-cyan-400">TEST MODE</span>
        </div>
      )}

      {/* Global Error Banner */}
      {serverError && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Email Field */}
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
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError('');
            }}
            placeholder="name@organization.com"
            autoComplete="email"
            required
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#060b19] border border-slate-700/80 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 transition-colors"
          />
        </div>
        {emailError && <p className="text-xs text-red-400 mt-1">{emailError}</p>}
      </div>

      {/* Password Field */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
            Password
          </label>
          <a
            href="/forgot-password"
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
          >
            Forgot Password?
          </a>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Lock className="h-4 w-4" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError('');
            }}
            placeholder="••••••••"
            autoComplete="current-password"
            required
            className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#060b19] border border-slate-700/80 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {passwordError && <p className="text-xs text-red-400 mt-1">{passwordError}</p>}
      </div>

      {/* Remember Me Checkbox */}
      <div className="flex items-center">
        <input
          id="remember-me"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 rounded bg-[#060b19] border-slate-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-[#0a1126]"
        />
        <label htmlFor="remember-me" className="ml-2 text-xs text-slate-300 cursor-pointer">
          Remember me on this device
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn interactive-button w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm transition-all shadow-[0_0_25px_rgba(0,180,216,0.3)] hover:shadow-[0_0_35px_rgba(0,180,216,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-white" />
            <span>SIGNING IN...</span>
          </>
        ) : (
          <span>SIGN IN</span>
        )}
      </button>

      {/* Footer Link */}
      <p className="text-center text-xs text-slate-400 pt-2">
        Don&apos;t have an account?{' '}
        <a href="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
          Create Account
        </a>
      </p>
    </form>
  );
}
