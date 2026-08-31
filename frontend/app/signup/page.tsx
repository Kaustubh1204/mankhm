'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/authStore';
import AuthLayout from '@/components/auth/AuthLayout';
import SignUpForm from '@/components/auth/SignUpForm';

export default function SignUpPage() {
  const { isAuthenticated, role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (role === 'ADMIN') {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/user/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, role, router]);

  if (isLoading || isAuthenticated) {
    return null;
  }

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Register for CycloneSense AI operational intelligence"
    >
      <SignUpForm />
    </AuthLayout>
  );
}
