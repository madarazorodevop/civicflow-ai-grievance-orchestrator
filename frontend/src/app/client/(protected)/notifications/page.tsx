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
    message: `Your complaint is currently ${c.status}. ${c.status === 'RESOLVED' ? 'Completed' : `ETA: ${c.eta}`}`,
    date: new Date(c.created_at).toLocaleDateString(),
    isResolved: c.status === 'Resolved'
  }));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-4xl font-extrabold text-white mb-8 flex items-center gap-4 drop-shadow-md"><Bell className="text-blue-400 w-8 h-8" /> Notifications</h1>
      <div className="flex flex-col gap-5">
        {notifications.length === 0 ? <p className="text-gray-300 font-light bg-white/10 p-6 rounded-2xl border border-white/20">No new notifications.</p> : null}
        {notifications.map(n => (
          <div key={n.id} className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 flex gap-5 shadow-2xl hover:bg-white/20 transition-all">
            <div className="mt-1">{n.isResolved ? <CheckCircle2 className="text-green-400 w-8 h-8 drop-shadow-sm" /> : <Clock className="text-blue-400 w-8 h-8 drop-shadow-sm" />}</div>
            <div>
              <h3 className="font-bold text-white text-lg drop-shadow-sm">{n.title}</h3>
              <p className="text-blue-100 text-sm mt-1 font-light">{n.message}</p>
              <div className="text-xs text-blue-300 mt-3 font-medium">{n.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
