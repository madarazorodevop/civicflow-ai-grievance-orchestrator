'use client';
import { useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setAuth = useAuthStore(s => s.setAuth);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);
      const res = await api.post('/auth/token', formData);
      
      if (res.data.role !== 'admin') {
        toast.error('Unauthorized: Admin access required');
        return;
      }
      
      setAuth(res.data.access_token, res.data.role);
      toast.success('Admin logged in successfully');
      router.push('/admin/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Full Background Image Always Visible */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 scale-105"
        style={{ backgroundImage: "url('/dashboard_banner.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-bl from-slate-900/90 via-black/80 to-slate-900/90 z-0" />
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 z-0"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-700/20 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 z-0"></div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row-reverse items-center justify-between p-6 gap-12">
        {/* Right Side Text / Branding */}
        <div className="hidden md:flex flex-col w-1/2 text-white p-8">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="border-r-4 border-cyan-500 pr-8 py-2 text-right"
          >
            <h1 className="text-6xl font-black mb-6 drop-shadow-2xl">Command<br/>Center</h1>
            <p className="text-xl text-slate-300 font-light max-w-lg ml-auto leading-relaxed drop-shadow-md">
              Oversee civic reports, manage intelligent triage, and coordinate resolution teams from a centralized, high-security dashboard.
            </p>
          </motion.div>
        </div>

        {/* Left side form */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <motion.form 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleLogin} 
            className="w-full max-w-md bg-black/40 backdrop-blur-2xl p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_32px_rgb(0,0,0,0.5)] border border-slate-500/30"
          >
          <div className="flex justify-center mb-6">
             <img src="/logo.jpg" alt="Logo" className="w-16 h-16 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 bg-white p-1" />
          </div>
          <h2 className="text-3xl font-extrabold mb-2 text-center text-gray-900 dark:text-white tracking-tight">Admin Portal</h2>
          <p className="text-center text-xs text-red-500 dark:text-red-400 mb-8 font-bold tracking-widest uppercase">Authorized Personnel Only</p>
          
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Admin Email</label>
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all shadow-sm" />
          </div>
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all shadow-sm" />
          </div>
          <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 hover:shadow-lg hover:shadow-slate-500/30 text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95">Secure Login</button>
          
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex flex-col gap-3 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>New Administrator? <Link href="/admin/register" className="text-cyan-500 dark:text-cyan-400 font-bold hover:underline">Register here</Link></p>
            <Link href="/" className="font-medium hover:text-gray-900 dark:hover:text-white transition-colors mt-2">← Back to Portal Selection</Link>
          </div>
        </motion.form>
      </div>
      </div>
    </div>
  );
}
