'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/authStore';
import { UserRole } from '@/lib/auth/authTypes';
import { User as UserIcon, Mail, Building, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function SignUpForm() {
  const { signUp, clearError } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('USER');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};
    setServerError('');

    if (!name.trim()) {
      errs.name = 'Full name is required.';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Enter a valid email address.';
    }

    if (!organization.trim()) {
      errs.organization = 'Organization name is required.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 8) {
      errs.password = 'Password must contain at least 8 characters.';
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validate()) return;

    setIsSubmitting(true);
    const res = await signUp({ name, email, organization, password, role });
    setIsSubmitting(false);

    if (res.success) {
      setIsSuccess(true);
    } else {
      setServerError(res.error || 'Failed to create account. Please try again.');
    }
  };

  // Success Feedback Screen
  if (isSuccess) {
    return (
      <div className="text-center space-y-6 py-4">
        <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-400 flex items-center justify-center text-cyan-400 mx-auto animate-pulse">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-extrabold text-white">Account Created Successfully!</h3>
          <p className="text-sm text-slate-300">
            Your CycloneSense AI account has been provisioned for{' '}
            <span className="text-cyan-300 font-semibold">{email}</span>.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#060b19] border border-slate-800 text-xs text-slate-400 text-left space-y-1">
          <div className="flex justify-between">
            <span>Selected Role:</span>
            <span className="font-mono text-cyan-300 font-bold">{role}</span>
          </div>
          <div className="flex justify-between">
            <span>Organization:</span>
            <span className="text-slate-200">{organization}</span>
          </div>
        </div>

        <button
          onClick={() => router.push('/signin')}
          className="btn interactive-button w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-md"
        >
          PROCEED TO SIGN IN
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Server Error Banner */}
      {serverError && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Full Name */}
      <div>
        <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1">
          Full Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <UserIcon className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
            }}
            placeholder="Dr. Alexander Vance"
            required
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#060b19] border border-slate-700/80 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 transition-colors"
          />
        </div>
        {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
      </div>

      {/* Email Address */}
      <div>
        <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1">
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
              if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
            }}
            placeholder="name@agency.gov"
            autoComplete="email"
            required
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#060b19] border border-slate-700/80 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 transition-colors"
          />
        </div>
        {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
      </div>

      {/* Organization */}
      <div>
        <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1">
          Organization / Agency
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Building className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={organization}
            onChange={(e) => {
              setOrganization(e.target.value);
              if (errors.organization) setErrors((prev) => ({ ...prev, organization: '' }));
            }}
            placeholder="National Meteorological Agency"
            required
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#060b19] border border-slate-700/80 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 transition-colors"
          />
        </div>
        {errors.organization && <p className="text-xs text-red-400 mt-1">{errors.organization}</p>}
      </div>

      {/* Role Selection */}
      <div>
        <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1">
          Account Operational Role
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole('USER')}
            className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              role === 'USER'
                ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,180,216,0.2)]'
                : 'bg-[#060b19] border-slate-700/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>USER (Operational)</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('ADMIN')}
            className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              role === 'ADMIN'
                ? 'bg-blue-500/20 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                : 'bg-[#060b19] border-slate-700/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>ADMIN (Control)</span>
          </button>
        </div>
        <p className="text-[10px] text-slate-500 mt-1">
          * Frontend role selection is for testing; admin privileges must be verified by backend authorization.
        </p>
      </div>

      {/* Password */}
      <div>
        <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Lock className="h-4 w-4" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
            }}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            required
            className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-[#060b19] border border-slate-700/80 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 transition-colors"
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
        {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1">
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Lock className="h-4 w-4" />
          </div>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
            }}
            placeholder="Re-enter password"
            autoComplete="new-password"
            required
            className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-[#060b19] border border-slate-700/80 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn interactive-button w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm transition-all shadow-[0_0_25px_rgba(0,180,216,0.3)] hover:shadow-[0_0_35px_rgba(0,180,216,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-white" />
            <span>CREATING ACCOUNT...</span>
          </>
        ) : (
          <span>CREATE ACCOUNT</span>
        )}
      </button>

      {/* Footer Link */}
      <p className="text-center text-xs text-slate-400 pt-1">
        Already have an account?{' '}
        <a href="/signin" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
          Sign In
        </a>
      </p>
    </form>
  );
}
