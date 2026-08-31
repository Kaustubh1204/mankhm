'use client';

import React from 'react';
import { DashboardProvider } from '@/context/DashboardContext';

export default function UserRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardProvider>{children}</DashboardProvider>;
}
