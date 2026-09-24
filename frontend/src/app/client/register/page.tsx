'use client';
import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { email, password, role: 'client' });
      toast.success('Registered successfully. Please login.');
      router.push('/client/login');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Registration failed');
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
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 z-0"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 z-0"></div>

      <div className="relative z-10 w-full max-w-md p-6">
        <form 
          onSubmit={handleRegister} 
          className="w-full bg-white/10 dark:bg-black/40 backdrop-blur-2xl p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_32px_rgb(0,0,0,0.3)] border border-white/20"
        >
          <div className="flex justify-center mb-6">
             <img src="/logo.jpg" alt="Logo" className="w-16 h-16 rounded-full shadow-lg border border-white/20" />
          </div>
          <h2 className="text-3xl font-extrabold mb-2 text-center text-white tracking-tight">Join CIVICFLOW</h2>
          <p className="text-center text-sm text-blue-200 mb-8 font-light">Create an account to report issues</p>
          
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-200 mb-2">Email Address</label>
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-3.5 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all shadow-inner" />
          </div>
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-200 mb-2">Password</label>
            <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-3.5 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all shadow-inner" />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/40 text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95">Register Now</button>
          
          <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-gray-300">
            <p>Already have an account? <Link href="/client/login" className="text-cyan-400 font-bold hover:underline">Login here</Link></p>
            <div className="mt-4"><Link href="/" className="font-medium hover:text-white transition-colors">← Back to Portal Selection</Link></div>
          </div>
        </form>
      </div>
    </div>
  );
}
