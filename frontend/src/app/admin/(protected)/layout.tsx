'use client';
import { useAuthStore, useLangStore } from '@/lib/store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import LangSwitch from '@/components/LangSwitch';
import { dict } from '@/lib/i18n';
import { Home, List, Map as MapIcon, Cpu, LogOut, AlertTriangle, BarChart3, Bell, User, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { token, role, logout } = useAuthStore();
  const lang = useLangStore(s => s.lang);
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!token || role !== 'admin') {
      router.push('/admin/login');
    }
  }, [token, role, router]);

  if (!mounted || !token || role !== 'admin') return null;
  const d = dict[lang];

  const links = [
    { href: '/admin/dashboard', icon: Home, label: d.dashboard || 'Dashboard' },
    { href: '/admin/complaints', icon: List, label: d.complaints || 'Complaints' },
    { href: '/admin/priority', icon: AlertTriangle, label: d.priority_queue || 'Priority Queue' },
    { href: '/admin/ai', icon: Cpu, label: d.ai || 'AI Orchestrator' },
    { href: '/admin/map', icon: MapIcon, label: d.map || 'Map' },
    { href: '/admin/analytics', icon: BarChart3, label: d.analytics || 'Analytics' },
    { href: '/admin/notifications', icon: Bell, label: d.notifications || 'Notifications' },
    { href: '/admin/profile', icon: User, label: d.profile || 'Profile' },
    { href: '/admin/settings', icon: Settings, label: d.settings || 'Settings' },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen relative overflow-hidden bg-gray-900 text-white">
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-30 fixed"
        style={{ backgroundImage: "url('/dashboard_banner.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-bl from-slate-900/90 via-slate-900/95 to-black/95 z-0" />

      <aside className="w-full md:w-72 bg-white/5 backdrop-blur-3xl border-r border-white/5 p-6 flex flex-col shrink-0 overflow-y-auto relative z-10 shadow-2xl">
        <h1 className="text-3xl font-extrabold mb-10 tracking-tight flex items-center gap-3 drop-shadow-md">
          <img src="/logo.jpg" alt="CivicFlow" className="w-10 h-10 rounded-full bg-white p-0.5 shadow-lg" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">CIVICFLOW</span>
        </h1>
        <nav className="flex-1 flex flex-col gap-2">
          {links.map(l => {
            const active = pathname.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href} className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${active ? 'bg-cyan-600/80 text-white font-bold shadow-lg shadow-cyan-500/20 translate-x-1' : 'text-slate-400 hover:bg-white/10 hover:text-white hover:translate-x-1'}`}>
                <l.icon className="w-5 h-5"/> {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-4">
          <div className="flex gap-2">
            <LangSwitch />
          </div>
          <button onClick={() => { logout(); router.push('/'); }} className="flex items-center gap-3 p-3 text-red-400 font-bold hover:bg-red-500/20 hover:text-red-100 rounded-xl w-full transition-all"><LogOut className="w-5 h-5"/> {d.logout || 'Secure Logout'}</button>
        </div>
      </aside>
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
