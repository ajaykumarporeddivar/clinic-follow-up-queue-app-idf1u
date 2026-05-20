'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Bell,
  ChevronDown,
  LogOut,
  User,
  LayoutDashboard,
  ClipboardEdit,
  BarChart2,
  Settings,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Avatar, Badge, Popover, PopoverContent, PopoverTrigger, Divider } from '@/components/ui';
import { DEMO_USER } from '@/lib/data';

// --- AppHeader ---
interface AppHeaderProps {
  title?: string;
  showSidebarToggle?: boolean;
  onToggleSidebar?: () => void;
}

export function AppHeader({ title, showSidebarToggle, onToggleSidebar }: AppHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = () => {
    // In a real app, this would clear auth tokens and redirect to login
    router.push('/');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 shadow-sm md:px-6">
      <div className="flex items-center gap-4">
        {showSidebarToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="hidden md:flex"
            aria-label="Toggle sidebar"
          >
            <LayoutDashboard size={18} />
          </Button>
        )}
        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">{title || 'Dashboard'}</h1>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="relative">
          <Bell size={18} />
          <Badge variant="danger" className="absolute -right-1 -top-1 px-1.5 py-0.5 text-xs">
            3
          </Badge>
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Avatar initials={DEMO_USER.avatar} size="sm" />
              <span className="hidden text-sm font-medium text-zinc-700 md:inline">{DEMO_USER.name}</span>
              <ChevronDown size={16} className="text-zinc-400" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="end">
            <div className="flex items-center gap-2 p-2">
              <Avatar initials={DEMO_USER.avatar} size="md" />
              <div>
                <p className="font-semibold text-zinc-900">{DEMO_USER.name}</p>
                <p className="text-sm text-zinc-600">{DEMO_USER.email}</p>
              </div>
            </div>
            <Divider className="my-2" />
            <Link href="/dashboard/settings" className="block">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <User size={16} /> Profile
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleSignOut}>
              <LogOut size={16} /> Sign out
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}

// --- AppSidebar ---
interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

interface AppSidebarProps {
  navItems: NavItem[];
  isOpen: boolean;
  onClose: () => void;
}

export function AppSidebar({ navItems, isOpen, onClose }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-zinc-950/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-zinc-900 text-zinc-100 transition-transform duration-200 ease-in-out md:static md:translate-x-0",
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-zinc-800 px-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
            <ClipboardEdit size={24} />
            Queue
          </Link>
          <Button variant="ghost" size="sm" onClick={onClose} className="md:hidden" aria-label="Close sidebar">
            <X size={20} />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    pathname.startsWith(item.href)
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto border-t border-zinc-800 p-4">
          <DemoBanner />
        </div>
      </aside>
    </>
  );
}

// --- DemoBanner ---
export function DemoBanner() {
  return (
    <div className="rounded-xl bg-zinc-800 p-4 text-center text-zinc-300">
      <p className="text-sm font-semibold">Unlock Full Roadmap</p>
      <p className="mt-1 text-xs text-zinc-400">
        Upgrade to unlock intake automation, queue automation, advanced reporting, and team features.
      </p>
      <Button variant="primary" size="sm" className="mt-3 w-full">
        Upgrade Now
      </Button>
    </div>
  );
}