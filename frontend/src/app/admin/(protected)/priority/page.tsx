'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function PriorityQueue() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    api.get('/complaints/').then(res => {
      // Filter only SEVERE and MEDIUM, sort by SEVERE first
      const critical = res.data.filter((c: any) => c.riskLevel === 'SEVERE' || c.riskLevel === 'MEDIUM' && c.status !== 'Resolved');
      critical.sort((a: any, b: any) => (a.riskLevel === 'SEVERE' ? -1 : 1));
      setComplaints(critical);
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3">
        <AlertTriangle className="text-red-500" /> Action Priority Queue
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">This queue auto-sorts active complaints requiring immediate administrative attention based on AI severity.</p>
      
      <div className="flex flex-col gap-4">
        {complaints.length === 0 ? (
          <div className="p-8 text-center bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl border border-green-200 dark:border-green-800">
            No critical or high-priority items currently in the queue.
          </div>
        ) : complaints.map((c: any) => (
          <div key={c.id} className={`p-5 rounded-xl border flex items-center justify-between ${c.riskLevel === 'SEVERE' ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900' : 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-900'}`}>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-1 text-xs font-bold rounded ${c.riskLevel === 'SEVERE' ? 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-orange-200 text-orange-800 dark:bg-orange-900 dark:text-orange-200'}`}>{c.riskLevel} PRIORITY</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{c.id}</span>
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{c.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Status: {c.status} • ETA: {c.eta}</p>
            </div>
            <Link href={`/admin/complaints/${c.id}`} className="px-6 py-3 bg-slate-900 text-white dark:bg-slate-700 hover:bg-slate-800 rounded-lg font-medium transition-colors">
              Manage Incident
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
