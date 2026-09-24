'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useLangStore } from '@/lib/store';
import { dict } from '@/lib/i18n';
import Link from 'next/link';
import { FileText, Map as MapIcon, Activity } from 'lucide-react';

export default function ClientDashboard() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const lang = useLangStore(s => s.lang);
  const d = dict[lang];

  useEffect(() => {
    api.get('/complaints/').then(res => setComplaints(res.data));
  }, []);

  const active = complaints.filter(c => c.status !== 'Resolved');

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Citizen Portal</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/client/report" className="flex items-center gap-4 p-6 bg-blue-600 text-white rounded-2xl shadow-md hover:bg-blue-700 transition-colors group">
          <div className="p-4 bg-white/20 rounded-xl group-hover:scale-110 transition-transform"><FileText className="w-8 h-8" /></div>
          <div>
            <h2 className="text-xl font-bold">{d.report_issue || 'Report a Problem'}</h2>
            <p className="opacity-90 text-sm mt-1">Submit a new civic issue for immediate AI triage.</p>
          </div>
        </Link>
        <Link href="/client/map" className="flex items-center gap-4 p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all group">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl group-hover:scale-110 transition-transform"><MapIcon className="w-8 h-8" /></div>
          <div>
            <h2 className="text-xl font-bold">{d.map || 'Community Map'}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">View active civic issues around your area.</p>
          </div>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6 border-b pb-4 dark:border-gray-700">
          <h2 className="text-lg font-bold dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" /> Active Tracking
          </h2>
          <Link href="/client/complaints" className="text-sm font-bold text-blue-600 hover:underline">View All &rarr;</Link>
        </div>
        
        <div className="flex flex-col gap-4">
          {active.length === 0 ? <p className="text-gray-500 text-sm italic">You have no active complaints to track.</p> : null}
          {active.map(c => (
            <div key={c.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
              <div>
                <h3 className="font-bold dark:text-white">{c.title}</h3>
                <p className="text-xs text-gray-500 mt-1">Submitted on {new Date(c.created_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right flex flex-col items-end gap-1">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs font-bold rounded-full">{c.status}</span>
                <span className="text-xs text-gray-500 font-medium">ETA: {c.eta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
