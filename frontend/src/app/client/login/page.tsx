'use client';
import { useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Login() {
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
      
      if (res.data.role !== 'client') {
        toast.error('Unauthorized: Citizen access required');
        return;
      }

      setAuth(res.data.access_token, res.data.role);
      toast.success('Logged in successfully');
      router.push('/client/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Full Background Image Always Visible */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 scale-105"
        style={{ backgroundImage: "url('/login_bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-slate-900/70 to-black/90 z-0" />
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 z-0"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 z-0"></div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row items-center justify-between p-6 gap-12">
        {/* Left Side Text / Branding */}
        <div className="hidden md:flex flex-col w-1/2 text-white p-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-6xl font-black mb-6 leading-tight drop-shadow-2xl">
              Empowering <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Citizens</span>
            </h1>
            <p className="text-xl text-blue-100 font-light max-w-lg drop-shadow-md leading-relaxed">
              Join the network and let AI quickly triage and direct your infrastructure concerns to the right authorities for faster, safer resolutions.
            </p>
          </motion.div>
        </div>

        {/* Right side form */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <motion.form 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleLogin} 
            className="w-full max-w-md bg-white/10 dark:bg-black/40 backdrop-blur-2xl p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_32px_rgb(0,0,0,0.3)] border border-white/20"
          >
          <div className="flex justify-center mb-6">
             <img src="/logo.jpg" alt="Logo" className="w-16 h-16 rounded-full shadow-lg border border-gray-200 dark:border-gray-700" />
          </div>
          <h2 className="text-3xl font-extrabold mb-2 text-center text-gray-900 dark:text-white tracking-tight">Citizen Login</h2>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8 font-medium">Welcome back to CIVICFLOW</p>
          
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm" />
          </div>
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm" />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95">Login</button>
          
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex flex-col gap-3 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Don't have an account? <Link href="/client/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Register here</Link></p>
            <Link href="/" className="font-medium hover:text-gray-900 dark:hover:text-white transition-colors mt-2">← Back to Portal Selection</Link>
          </div>
        </motion.form>
      </div>
    </div>
    </div>
  );
}
