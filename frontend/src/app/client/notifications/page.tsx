'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Bell, CheckCircle2, Clock } from 'lucide-react';

export default function ClientNotifications() {
  const [complaints, setComplaints] = useState<any[]>([]);

  useEffect(() => {
    api.get('/complaints/').then(res => setComplaints(res.data));
  }, []);

  const notifications = complaints.map(c => ({
    id: c.id,
    title: `Status update on: ${c.title}`,
    message: `Your complaint is currently ${c.status}. ETA: ${c.eta}`,
    date: new Date(c.created_at).toLocaleDateString(),
    isResolved: c.status === 'Resolved'
  }));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold dark:text-white mb-8 flex items-center gap-3"><Bell className="text-blue-500" /> Notifications</h1>
      <div className="flex flex-col gap-4">
        {notifications.length === 0 ? <p className="text-gray-500">No new notifications.</p> : null}
        {notifications.map(n => (
          <div key={n.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 flex gap-4 shadow-sm">
            <div className="mt-1">{n.isResolved ? <CheckCircle2 className="text-green-500 w-6 h-6" /> : <Clock className="text-blue-500 w-6 h-6" />}</div>
            <div>
              <h3 className="font-bold dark:text-white">{n.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{n.message}</p>
              <div className="text-xs text-gray-400 mt-2">{n.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
