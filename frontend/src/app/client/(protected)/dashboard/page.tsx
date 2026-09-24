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
      {/* Dashboard Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl h-48 md:h-64 flex items-center p-8 bg-gray-900 text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: "url('/dashboard_banner.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-transparent" />
        <div className="relative z-10 w-full">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-md mb-2">Citizen Portal</h1>
          <p className="text-blue-100 font-light text-lg">Welcome back. Manage and track your civic reports.</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/client/report" className="flex items-center gap-4 p-6 bg-blue-600/80 backdrop-blur-lg border border-blue-400/30 text-white rounded-2xl shadow-xl hover:bg-blue-600 transition-colors group">
          <div className="shrink-0 p-4 bg-white/20 rounded-xl group-hover:scale-110 transition-transform"><FileText className="w-8 h-8" /></div>
          <div>
            <h2 className="text-xl font-bold break-words">{d.report_issue || 'Report a Problem'}</h2>
            <p className="text-blue-100 text-sm mt-1 font-light">Submit a new civic issue for immediate AI triage.</p>
          </div>
        </Link>
        <Link href="/client/map" className="flex items-center gap-4 p-6 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-2xl shadow-xl hover:bg-white/20 transition-all group">
          <div className="shrink-0 p-4 bg-blue-400/20 text-blue-300 rounded-xl group-hover:scale-110 transition-transform"><MapIcon className="w-8 h-8" /></div>
          <div>
            <h2 className="text-xl font-bold">{d.map || 'Community Map'}</h2>
            <p className="text-gray-300 text-sm mt-1 font-light">View active civic issues around your area.</p>
          </div>
        </Link>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6 border-b border-white/20 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" /> Active Tracking
          </h2>
          <Link href="/client/complaints" className="text-sm font-bold text-blue-300 hover:text-white transition-colors">View All &rarr;</Link>
        </div>
        
        <div className="flex flex-col gap-4">
          {active.length === 0 ? <p className="text-gray-400 text-sm italic font-light">You have no active complaints to track.</p> : null}
          {active.map(c => (
            <div key={c.id} className="flex justify-between items-center p-4 bg-black/20 hover:bg-black/40 transition-colors rounded-xl border border-white/10">
              <div>
                <h3 className="font-bold text-white text-lg">{c.title}</h3>
                <p className="text-xs text-gray-400 mt-1">Submitted on {new Date(c.created_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-bold rounded-full">{c.status}</span>
                <span className="text-xs text-gray-300 font-medium">ETA: {c.eta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
