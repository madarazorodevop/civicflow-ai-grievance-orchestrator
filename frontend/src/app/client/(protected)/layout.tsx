'use client';
import { useAuthStore, useLangStore } from '@/lib/store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ThemeSwitch from '@/components/ThemeSwitch';
import LangSwitch from '@/components/LangSwitch';
import { dict } from '@/lib/i18n';
import { Home, FileText, Map as MapIcon, LogOut, List, Bell, User, Settings, MessageSquare } from 'lucide-react';
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
    { href: '/client/ai-chat', icon: MessageSquare, label: d.ai_chat || 'AI Assistant' },
    { href: '/client/map', icon: MapIcon, label: d.map || 'Map' },
    { href: '/client/notifications', icon: Bell, label: d.notifications || 'Notifications' },
    { href: '/client/profile', icon: User, label: d.profile || 'Profile' },
    { href: '/client/settings', icon: Settings, label: d.settings || 'Settings' },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen relative overflow-hidden bg-[#050505] text-white p-2 md:p-4 gap-4">
      {/* Immersive Cinematic Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-60 fixed object-cover"
        style={{ backgroundImage: "url('/hero_bg.jpg')", filter: "contrast(1.2) brightness(0.7)" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-[#050505]/80 to-[#050505] z-0" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay z-0 pointer-events-none" />

      {/* Subtle Hyper-Modern Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 mix-blend-screen opacity-40">
        <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-blue-600/20 blur-[150px]" />
        <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute top-[30%] -right-[20%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/20 blur-[150px]" />
      </div>

      {/* Floating Premium Sidebar */}
      <aside className="w-full md:w-72 bg-white/[0.03] backdrop-blur-[40px] transform-gpu border border-white/[0.08] p-6 flex flex-col overflow-y-auto relative z-10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] h-full">
        <h1 className="text-3xl font-extrabold mb-10 tracking-tight flex items-center gap-4">
          <div className="relative p-1 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-2xl shadow-lg">
            <img src="/logo.jpg" alt="CivicFlow" className="w-10 h-10 rounded-xl" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-300">CIVICFLOW</span>
        </h1>
        <nav className="flex-1 flex flex-col gap-1.5">
          {links.map(l => {
            const active = pathname.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href} className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-colors duration-200 group ${active ? 'bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white font-bold shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-white/10' : 'text-gray-400 hover:bg-white/[0.06] hover:text-white'}`}>
                <div className={`shrink-0 transition-colors duration-200 ${active ? 'text-white' : 'text-gray-500 group-hover:text-blue-400'}`}><l.icon className="w-5 h-5"/></div> 
                <span className="break-words whitespace-normal leading-tight text-sm tracking-wide">{l.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-col gap-4">
          <div className="flex gap-2">
            <LangSwitch />
          </div>
          <button onClick={() => { logout(); router.push('/'); }} className="flex items-center justify-center gap-3 p-3.5 text-red-400/80 font-bold hover:bg-red-500/20 hover:text-red-200 rounded-2xl w-full transition-colors text-sm tracking-wide border border-transparent hover:border-red-500/30"><LogOut className="w-5 h-5"/> {d.logout || 'Logout'}</button>
        </div>
      </aside>

      {/* Floating Main Content Area */}
      <main className="flex-1 overflow-y-auto relative z-10 bg-black/40 backdrop-blur-[40px] transform-gpu border border-white/[0.05] rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
