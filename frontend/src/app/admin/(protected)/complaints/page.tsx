'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState('ALL');

  const fetchComplaints = () => {
    api.get('/complaints/').then(res => setComplaints(res.data));
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const filtered = filter === 'ALL' ? complaints : complaints.filter((c: any) => c.riskLevel === filter);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Complaints Management</h1>
        <div className="flex gap-2">
          {['ALL', 'SEVERE', 'MEDIUM', 'LOW'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${filter === f ? 'bg-slate-800 text-white dark:bg-slate-700' : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs">
            <tr>
              <th className="p-4 font-semibold">ID / Overview</th>
              <th className="p-4 font-semibold">Risk & Priority</th>
              <th className="p-4 font-semibold">Current Status</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c: any) => (
              <tr key={c.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-gray-900 dark:text-white">{c.id}</div>
                  <div className="text-gray-600 dark:text-gray-400 mt-1">{c.title}</div>
                  <div className="text-xs text-gray-400 mt-1">{c.category} • {new Date(c.created_at).toLocaleDateString()}</div>
                </td>
                <td className="p-4">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${c.riskLevel === 'SEVERE' ? 'bg-red-100 text-red-700' : c.riskLevel === 'MEDIUM' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                    {c.riskLevel} RISK
                  </span>
                  <div className="text-xs text-gray-500 mt-2 font-medium">ETA: {c.eta}</div>
                </td>
                <td className="p-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                    {c.status}
                  </span>
                </td>
                <td className="p-4">
                  <Link href={`/admin/complaints/${c.id}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm">
                    View Details &rarr;
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500 dark:text-gray-400">No complaints found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
