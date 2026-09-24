'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [complaints, setComplaints] = useState<any[]>([]);

  useEffect(() => {
    api.get('/stats/').then(res => setStats(res.data));
    api.get('/complaints/').then(res => setComplaints(res.data));
  }, []);

  if (!stats) return <div className="dark:text-white p-8">Loading dashboard...</div>;

  const kpis = [
    { label: 'TOTAL COMPLAINTS', value: stats.total, color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100' },
    { label: 'NEW / PENDING', value: stats.new, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
    { label: 'HIGH RISK', value: stats.high_risk, color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
    { label: 'MEDIUM RISK', value: stats.medium_risk, color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
    { label: 'LOW RISK', value: stats.low_risk, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
    { label: 'IN PROGRESS', value: stats.in_progress, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
    { label: 'RESOLVED', value: stats.resolved, color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' },
  ];

  const priorityQueue = complaints
    .filter(c => (c.riskLevel === 'HIGH' || c.riskLevel === 'MEDIUM') && c.status !== 'Resolved')
    .sort((a, b) => a.riskLevel === 'HIGH' ? -1 : 1)
    .slice(0, 5);

  const recent = [...complaints].slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">CIVICFLOW ADMIN DASHBOARD</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {kpis.map(k => (
          <div key={k.label} className={`p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-center items-center text-center ${k.color}`}>
            <div className="text-[10px] font-bold opacity-80 mb-1 tracking-wider">{k.label}</div>
            <div className="text-3xl font-black">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Priority Queue Snapshot */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col">
          <h2 className="text-lg font-bold mb-4 dark:text-white border-b pb-2 dark:border-gray-700">PRIORITY QUEUE</h2>
          <div className="flex flex-col gap-3 flex-1">
            {priorityQueue.length === 0 ? <p className="text-sm text-gray-500">No critical pending issues.</p> : null}
            {priorityQueue.map(c => (
              <div key={c.id} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700 text-sm">
                <div className="flex justify-between items-start mb-1">
                  <strong className="dark:text-white">{c.id}</strong>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${c.riskLevel === 'HIGH' ? 'bg-red-200 text-red-800' : 'bg-orange-200 text-orange-800'}`}>{c.riskLevel}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 truncate mb-2">{c.title}</p>
                <Link href={`/admin/complaints/${c.id}`} className="text-blue-600 hover:underline text-xs font-bold">Manage &rarr;</Link>
              </div>
            ))}
          </div>
          <Link href="/admin/priority" className="mt-4 text-center text-sm font-bold text-slate-600 dark:text-slate-400 hover:underline">View Full Queue</Link>
        </div>

        {/* Recent Complaints */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold mb-4 dark:text-white border-b pb-2 dark:border-gray-700">RECENT COMPLAINTS</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                <tr>
                  <th className="pb-3">Complaint</th>
                  <th className="pb-3">Risk</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">ETA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {recent.length === 0 ? <tr><td colSpan={4} className="py-4 text-gray-500">0 complaints</td></tr> : null}
                {recent.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-750/50 transition-colors">
                    <td className="py-3">
                      <Link href={`/admin/complaints/${c.id}`} className="font-bold text-blue-600 dark:text-blue-400 hover:underline">{c.id}</Link>
                      <div className="text-gray-500 text-xs mt-0.5">{c.category}</div>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.riskLevel === 'HIGH' ? 'bg-red-100 text-red-700' : c.riskLevel === 'MEDIUM' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                        {c.riskLevel}
                      </span>
                    </td>
                    <td className="py-3 font-medium dark:text-gray-300">{c.status}</td>
                    <td className="py-3 text-gray-500">{c.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link href="/admin/complaints" className="block mt-4 text-center text-sm font-bold text-slate-600 dark:text-slate-400 hover:underline">View All Complaints</Link>
        </div>
      </div>
    </div>
  );
}
