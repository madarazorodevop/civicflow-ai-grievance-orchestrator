'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { BarChart3 } from 'lucide-react';

export default function AdminAnalytics() {
  const [stats, setStats] = useState<any>(null);
  const [bannedUsers, setBannedUsers] = useState<any[]>([]);

  useEffect(() => {
    api.get('/stats/').then(res => setStats(res.data));
    api.get('/banned_users/').then(res => setBannedUsers(res.data));
  }, []);

  if (!stats) return <div className="dark:text-white">Loading analytics...</div>;

  const getPct = (val: number) => stats.total > 0 ? Math.round((val / stats.total) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3">
        <BarChart3 className="text-blue-600" /> System Analytics
      </h1>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-6 dark:text-white">Complaints by Risk Level</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1 font-medium"><span className="text-red-600">SEVERE ({stats.severe_risk})</span><span className="dark:text-white">{getPct(stats.severe_risk)}%</span></div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3"><div className="bg-red-500 h-3 rounded-full" style={{ width: `${getPct(stats.severe_risk)}%` }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1 font-medium"><span className="text-orange-500">MEDIUM ({stats.medium_risk})</span><span className="dark:text-white">{getPct(stats.medium_risk)}%</span></div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3"><div className="bg-orange-400 h-3 rounded-full" style={{ width: `${getPct(stats.medium_risk)}%` }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1 font-medium"><span className="text-blue-500">LOW ({stats.low_risk})</span><span className="dark:text-white">{getPct(stats.low_risk)}%</span></div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3"><div className="bg-blue-500 h-3 rounded-full" style={{ width: `${getPct(stats.low_risk)}%` }}></div></div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-6 dark:text-white">Resolution Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1 font-medium"><span className="text-emerald-600">Resolved ({stats.resolved})</span><span className="dark:text-white">{getPct(stats.resolved)}%</span></div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3"><div className="bg-emerald-500 h-3 rounded-full" style={{ width: `${getPct(stats.resolved)}%` }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1 font-medium"><span className="text-yellow-600">In Progress ({stats.in_progress})</span><span className="dark:text-white">{getPct(stats.in_progress)}%</span></div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3"><div className="bg-yellow-400 h-3 rounded-full" style={{ width: `${getPct(stats.in_progress)}%` }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1 font-medium"><span className="text-slate-600 dark:text-slate-400">New / Unassigned ({stats.new})</span><span className="dark:text-white">{getPct(stats.new)}%</span></div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3"><div className="bg-slate-400 h-3 rounded-full" style={{ width: `${getPct(stats.new)}%` }}></div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-red-200 dark:border-red-900/50 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-red-50 dark:bg-red-900/10">
          <h3 className="text-lg font-bold text-red-600 dark:text-red-400 flex items-center gap-2">Terminated Accounts (Spam Policy)</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Accounts banned for submitting 10 or more complaints.</p>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
            <tr>
              <th className="p-4 font-semibold">User ID</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Total Complaints</th>
              <th className="p-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {bannedUsers.map(u => (
              <tr key={u.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <td className="p-4 text-gray-900 dark:text-gray-300 font-bold">{u.id}</td>
                <td className="p-4 text-gray-900 dark:text-gray-300">{u.email}</td>
                <td className="p-4 font-bold text-red-500">{u.complaints_count}</td>
                <td className="p-4"><span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">BANNED</span></td>
              </tr>
            ))}
            {bannedUsers.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">No banned users.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
