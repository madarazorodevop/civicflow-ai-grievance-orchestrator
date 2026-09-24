'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { BarChart3 } from 'lucide-react';

export default function AdminAnalytics() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get('/stats/').then(res => setStats(res.data));
  }, []);

  if (!stats) return <div className="dark:text-white">Loading analytics...</div>;

  const getPct = (val: number) => stats.total > 0 ? Math.round((val / stats.total) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3">
        <BarChart3 className="text-blue-600" /> System Analytics
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-6 dark:text-white">Complaints by Risk Level</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1 font-medium"><span className="text-red-600">HIGH ({stats.high_risk})</span><span className="dark:text-white">{getPct(stats.high_risk)}%</span></div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3"><div className="bg-red-500 h-3 rounded-full" style={{ width: `${getPct(stats.high_risk)}%` }}></div></div>
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
    </div>
  );
}
