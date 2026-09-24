'use client';
import { useAuthStore } from '@/lib/store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import ThemeSwitch from '@/components/ThemeSwitch';
import { Home, List, Map as MapIcon, Cpu, LogOut, AlertTriangle, BarChart3, Bell, User, Settings } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { token, role, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!token || role !== 'admin') {
      router.push('/login');
    }
  }, [token, role, router]);

  if (!token || role !== 'admin') return null;

  const links = [
    { href: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/admin/complaints', icon: List, label: 'Complaints' },
    { href: '/admin/priority', icon: AlertTriangle, label: 'Priority Queue' },
    { href: '/admin/ai', icon: Cpu, label: 'AI Orchestrator' },
    { href: '/admin/map', icon: MapIcon, label: 'Map' },
    { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/admin/notifications', icon: Bell, label: 'Notifications' },
    { href: '/admin/profile', icon: User, label: 'Profile' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-gray-900">
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 p-4 flex flex-col shrink-0 overflow-y-auto">
        <h1 className="text-2xl font-bold text-white mb-8 tracking-tight flex items-center gap-2">
          <img src="/logo.jpg" alt="CivicFlow" className="w-8 h-8 rounded-full bg-white p-0.5" />
          CIVICFLOW <span className="text-sm font-normal text-slate-400">Admin</span>
        </h1>
        <nav className="flex-1 flex flex-col gap-1">
          {links.map(l => {
            const active = pathname.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href} className={`flex items-center gap-3 p-2 rounded-md transition-colors ${active ? 'bg-blue-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}>
                <l.icon className="w-5 h-5"/> {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex gap-2">
            <ThemeSwitch />
          </div>
          <button onClick={() => { logout(); router.push('/'); }} className="flex items-center gap-3 p-2 text-red-400 hover:bg-red-400/10 rounded-md w-full transition-colors"><LogOut className="w-5 h-5"/> Logout</button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
