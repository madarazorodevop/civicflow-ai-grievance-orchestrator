'use client';
import ThemeSwitch from '@/components/ThemeSwitch';
import LangSwitch from '@/components/LangSwitch';
import { Bell, Moon, Globe } from 'lucide-react';

export default function ClientSettings() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold dark:text-white mb-8">Settings</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
        
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><Globe className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold dark:text-white">Language</h3>
              <p className="text-sm text-gray-500">Choose your preferred interface language</p>
            </div>
          </div>
          <LangSwitch />
        </div>

        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg"><Moon className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold dark:text-white">Appearance</h3>
              <p className="text-sm text-gray-500">Toggle dark and light mode</p>
            </div>
          </div>
          <ThemeSwitch />
        </div>

        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg"><Bell className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold dark:text-white">Notifications</h3>
              <p className="text-sm text-gray-500">Receive email alerts on status updates</p>
            </div>
          </div>
          <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600" />
        </div>

      </div>
    </div>
  );
}
