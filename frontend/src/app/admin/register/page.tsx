'use client';
import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AdminRegister() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (secretCode !== 'tamilnadugov@1234') {
      toast.error('Invalid admin secret code');
      return;
    }

    try {
      await api.post('/auth/register', { email, password, role: 'admin' });
      toast.success('Admin registered successfully. Please login.');
      router.push('/admin/login');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Registration failed');
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

      <div className="relative z-10 w-full max-w-md p-6">
        <motion.form 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onSubmit={handleRegister} 
          className="w-full bg-black/40 backdrop-blur-2xl p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_32px_rgb(0,0,0,0.5)] border border-slate-500/30"
        >
          <div className="flex justify-center mb-6">
             <img src="/logo.jpg" alt="Logo" className="w-16 h-16 rounded-full shadow-lg border border-slate-500/30 bg-white p-1" />
          </div>
          <h2 className="text-3xl font-extrabold mb-2 text-center text-white tracking-tight">Admin Registration</h2>
          <p className="text-center text-xs text-red-400 mb-8 font-bold tracking-widest uppercase">Secret Code Required</p>
          
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-200 mb-2">Admin Email</label>
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-3.5 bg-black/20 border border-slate-500/30 rounded-xl text-white outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-inner" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-200 mb-2">Password</label>
            <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-3.5 bg-black/20 border border-slate-500/30 rounded-xl text-white outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-inner" />
          </div>
          <div className="mb-8">
            <label className="block text-sm font-semibold text-red-400 mb-2">Govt Secret Code</label>
            <input type="password" required value={secretCode} onChange={e=>setSecretCode(e.target.value)} className="w-full p-3.5 bg-red-950/30 border border-red-500/50 rounded-xl text-white outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-inner" />
          </div>
          <button type="submit" className="w-full bg-slate-800 hover:bg-slate-700 hover:shadow-lg hover:shadow-slate-500/40 text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 border border-slate-600">Register Admin</button>
          
          <div className="mt-8 pt-6 border-t border-slate-500/30 text-center text-sm text-gray-400">
            <p>Already an admin? <Link href="/admin/login" className="text-cyan-400 font-bold hover:underline">Login here</Link></p>
            <div className="mt-4"><Link href="/" className="font-medium hover:text-white transition-colors">← Back to Portal Selection</Link></div>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
