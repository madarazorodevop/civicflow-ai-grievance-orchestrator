'use client';
import { useAuthStore, useLangStore } from '@/lib/store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ThemeSwitch from '@/components/ThemeSwitch';
import LangSwitch from '@/components/LangSwitch';
import { dict } from '@/lib/i18n';
import { Home, FileText, Map as MapIcon, LogOut, List, Bell, User, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { token, role, logout } = useAuthStore();
  const lang = useLangStore(s => s.lang);
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!token || role !== 'client') {
      router.push('/client/login');
    }
  }, [token, role, router]);

  if (!mounted || !token || role !== 'client') return null;
  const d = dict[lang];

  const links = [
    { href: '/client/dashboard', icon: Home, label: d.dashboard || 'Dashboard' },
    { href: '/client/report', icon: FileText, label: d.report_issue || 'Report Problem' },
    { href: '/client/complaints', icon: List, label: d.my_complaints || 'My Complaints' },
    { href: '/client/map', icon: MapIcon, label: d.map || 'Map' },
    { href: '/client/notifications', icon: Bell, label: d.notifications || 'Notifications' },
    { href: '/client/profile', icon: User, label: d.profile || 'Profile' },
    { href: '/client/settings', icon: Settings, label: d.settings || 'Settings' },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen relative overflow-hidden bg-gray-900 text-white">
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-40 fixed"
        style={{ backgroundImage: "url('/hero_bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-gray-900/90 to-gray-900/95 z-0" />

      {/* Glassmorphism Sidebar */}
      <aside className="w-full md:w-72 bg-white/10 backdrop-blur-2xl border-r border-white/10 p-6 flex flex-col overflow-y-auto relative z-10 shadow-2xl">
        <h1 className="text-3xl font-extrabold mb-10 tracking-tight flex items-center gap-3 drop-shadow-md">
          <img src="/logo.jpg" alt="CivicFlow" className="w-10 h-10 rounded-full border-2 border-white/20 shadow-lg" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">CIVICFLOW</span>
        </h1>
        <nav className="flex-1 flex flex-col gap-2">
          {links.map(l => {
            const active = pathname.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href} className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${active ? 'bg-blue-600/80 text-white font-bold shadow-lg shadow-blue-500/20 translate-x-1' : 'text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-1'}`}>
                <div className="shrink-0"><l.icon className="w-5 h-5"/></div> 
                <span className="break-words whitespace-normal leading-tight">{l.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-4">
          <div className="flex gap-2">
            <LangSwitch />
          </div>
          <button onClick={() => { logout(); router.push('/'); }} className="flex items-center gap-3 p-3 text-red-300 font-bold hover:bg-red-500/20 hover:text-red-100 rounded-xl w-full transition-all"><LogOut className="w-5 h-5"/> {d.logout || 'Logout'}</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
