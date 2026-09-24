'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { User, Mail, Shield } from 'lucide-react';

export default function ClientProfile() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    api.get('/users/me').then(res => setUser(res.data));
  }, []);

  if (!user) return <div className="p-8 dark:text-white">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold dark:text-white mb-8">My Profile</h1>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center">
        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6">
          <User className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold dark:text-white">{user.email.split('@')[0]}</h2>
        <div className="mt-6 w-full space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <Mail className="w-5 h-5" /> <span>Email Address</span>
            </div>
            <span className="font-medium dark:text-white">{user.email}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <Shield className="w-5 h-5" /> <span>Account Role</span>
            </div>
            <span className="font-medium uppercase px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs">{user.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
