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
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Left side Image */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden shadow-2xl z-10">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/login_bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 to-gray-900/90" />
        <div className="relative z-10 flex flex-col justify-center p-12 text-white w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-extrabold mb-6 leading-tight drop-shadow-lg">Empowering <br/><span className="text-cyan-400">Citizens</span></h1>
            <p className="text-lg text-blue-100 font-light max-w-md drop-shadow-md">Join the network and let AI quickly triage and direct your infrastructure concerns to the right authorities for faster, safer resolutions.</p>
          </motion.div>
        </div>
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 relative">
        {/* Subtle background glow for extra quirk on mobile */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-200/20 via-gray-50 to-gray-50 dark:from-blue-900/20 dark:via-gray-900 dark:to-gray-900 z-0"></div>
        
        <motion.form 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleLogin} 
          className="relative z-10 bg-white/70 dark:bg-gray-800/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 dark:border-gray-700 w-full max-w-md"
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
            <p>Don't have an account? <Link href="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Register here</Link></p>
            <Link href="/" className="font-medium hover:text-gray-900 dark:hover:text-white transition-colors mt-2">← Back to Portal Selection</Link>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
