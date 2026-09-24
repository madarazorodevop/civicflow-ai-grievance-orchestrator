'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Bell, AlertTriangle, Info } from 'lucide-react';

export default function AdminNotifications() {
  const [complaints, setComplaints] = useState<any[]>([]);

  useEffect(() => {
    api.get('/complaints/').then(res => setComplaints(res.data));
  }, []);

  // Filter recent severe risk for admin alerts
  const notifications = complaints
    .filter(c => c.riskLevel === 'SEVERE' || c.status === 'Submitted')
    .slice(0, 10)
    .map(c => ({
      id: c.id,
      title: c.riskLevel === 'SEVERE' ? `Critical Alert: ${c.title}` : `New Submission: ${c.title}`,
      message: `Risk: ${c.riskLevel}. Current Status: ${c.status}`,
      date: new Date(c.created_at).toLocaleDateString(),
      isHigh: c.riskLevel === 'SEVERE'
    }));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold dark:text-white mb-8 flex items-center gap-3"><Bell className="text-slate-700 dark:text-slate-400" /> System Alerts</h1>
      <div className="flex flex-col gap-4">
        {notifications.length === 0 ? <p className="text-gray-500">No active system alerts.</p> : null}
        {notifications.map(n => (
          <div key={n.id} className={`p-5 rounded-xl border flex gap-4 shadow-sm ${n.isHigh ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'}`}>
            <div className="mt-1">{n.isHigh ? <AlertTriangle className="text-red-500 w-6 h-6" /> : <Info className="text-blue-500 w-6 h-6" />}</div>
            <div>
              <h3 className={`font-bold ${n.isHigh ? 'text-red-900 dark:text-red-400' : 'dark:text-white'}`}>{n.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{n.message}</p>
              <div className="text-xs text-gray-500 mt-2">{n.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
