'use client';
import { useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <form onSubmit={handleLogin} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center text-gray-900 dark:text-white">Citizen Login</h1>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">Welcome to CIVICFLOW</p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md font-bold transition-colors">Login</button>
        <div className="mt-6 flex flex-col gap-2 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>No account? <Link href="/register" className="text-blue-600 dark:text-blue-400 hover:underline">Register here</Link></p>
          <Link href="/" className="hover:underline">← Back to Portal Selection</Link>
        </div>
      </form>
    </div>
  );
}
