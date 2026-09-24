'use client';
import { useAuthStore, useLangStore } from '@/lib/store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import ThemeSwitch from '@/components/ThemeSwitch';
import LangSwitch from '@/components/LangSwitch';
import { dict } from '@/lib/i18n';
import { Home, FileText, Map as MapIcon, LogOut, List, Bell, User, Settings } from 'lucide-react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { token, role, logout } = useAuthStore();
  const lang = useLangStore(s => s.lang);
  const router = useRouter();
  const pathname = usePathname();
  const d = dict[lang];

  useEffect(() => {
    if (!token || role !== 'client') {
      router.push('/login');
    }
  }, [token, role, router]);

  if (!token || role !== 'client') return null;

  const links = [
    { href: '/client/dashboard', icon: Home, label: d.dashboard || 'Dashboard' },
    { href: '/client/report', icon: FileText, label: d.report_issue || 'Report Problem' },
    { href: '/client/complaints', icon: List, label: 'My Complaints' },
    { href: '/client/map', icon: MapIcon, label: d.map || 'Map' },
    { href: '/client/notifications', icon: Bell, label: 'Notifications' },
    { href: '/client/profile', icon: User, label: 'Profile' },
    { href: '/client/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-gray-900">
      <aside className="w-full md:w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 p-4 flex flex-col overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-8 tracking-tight">CIVICFLOW</h1>
        <nav className="flex-1 flex flex-col gap-1">
          {links.map(l => {
            const active = pathname.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href} className={`flex items-center gap-3 p-2 rounded-md transition-colors ${active ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-750'}`}>
                <l.icon className="w-5 h-5"/> {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex gap-2">
            <ThemeSwitch />
            <LangSwitch />
          </div>
          <button onClick={() => { logout(); router.push('/'); }} className="flex items-center gap-3 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md w-full transition-colors"><LogOut className="w-5 h-5"/> {d.logout || 'Logout'}</button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
