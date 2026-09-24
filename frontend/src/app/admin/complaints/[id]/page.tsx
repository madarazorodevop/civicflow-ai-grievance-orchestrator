'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, MapPin, ShieldAlert, Activity } from 'lucide-react';
import Link from 'next/link';

export default function AdminComplaintDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [c, setC] = useState<any>(null);

  useEffect(() => {
    api.get(`/complaints/${id}`).then(res => setC(res.data)).catch(() => {
      toast.error('Complaint not found');
      router.push('/admin/complaints');
    });
  }, [id, router]);

  const updateStatus = async (status: string) => {
    try {
      await api.patch(`/complaints/${id}/status`, { status });
      setC({ ...c, status });
      toast.success('Status updated');
    } catch {
      toast.error('Update failed');
    }
  };

  if (!c) return <div className="dark:text-white">Loading detailed view...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin/complaints" className="flex items-center gap-2 text-blue-600 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Complaints
        </Link>
        <div className="text-sm text-gray-500 dark:text-gray-400">Created: {new Date(c.created_at).toLocaleDateString()}</div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center bg-gray-50 dark:bg-gray-800/50">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{c.id}: {c.title}</h1>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">{c.category}</span>
              <span className={`px-2 py-0.5 rounded font-bold ${c.riskLevel === 'HIGH' ? 'bg-red-100 text-red-700' : c.riskLevel === 'MEDIUM' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                {c.riskLevel} RISK
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={c.status}
              onChange={(e) => updateStatus(e.target.value)}
              className="p-2 font-medium bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
            >
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Description</h3>
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{c.description}</p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wide flex items-center gap-2"><Activity className="w-4 h-4"/> AI Orchestrator Analysis</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Risk Severity:</span><strong className={c.riskLevel === 'HIGH' ? 'text-red-600' : 'text-slate-700 dark:text-slate-300'}>{c.riskLevel}</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Auto-Priority:</span><strong className="text-slate-700 dark:text-slate-300">{c.priority}</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Computed ETA:</span><strong className="text-slate-700 dark:text-slate-300">{c.eta}</strong></div>
                <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 block mb-1">AI Reasoning Context:</span>
                  <p className="font-mono text-xs text-slate-700 dark:text-slate-400">{c.riskReason}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide flex items-center gap-2"><MapPin className="w-4 h-4"/> Geolocation</h3>
              {c.lat && c.lng ? (
                <div className="text-gray-800 dark:text-gray-200 font-mono text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded">
                  {c.lat}, {c.lng}
                </div>
              ) : (
                <span className="text-gray-400 italic">No coordinates provided.</span>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Evidentiary Image</h3>
            {c.image_url ? (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 aspect-[4/3] flex items-center justify-center">
                <img src={`http://localhost:8000${c.image_url}`} alt="Evidence" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg h-48 flex items-center justify-center text-gray-400 italic bg-gray-50 dark:bg-gray-800/50">
                No image uploaded
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
