'use client';

import React from 'react';
import { AppSidebar } from '@/components/layout';
import {
  ClipboardEdit,
  LayoutDashboard,
  BarChart2,
  Settings,
} from 'lucide-react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: <ClipboardEdit size={16} />, label: 'Intake', href: '/dashboard/intake' },
  { icon: <LayoutDashboard size={16} />, label: 'Dashboard', href: '/dashboard/dashboard' },
  { icon: <BarChart2 size={16} />, label: 'Reports', href: '/dashboard/reports' },
  { icon: <Settings size={16} />, label: 'Settings', href: '/dashboard/settings' },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-zinc-50">
      <AppSidebar items={navItems} projectName="Clinic Follow-up Queue" />
      <div className="flex-1 ml-64 flex flex-col min-h-full">
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}