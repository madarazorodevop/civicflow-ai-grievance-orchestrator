'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { ShieldCheck, Activity, MessageSquare } from 'lucide-react';

export default function AIOrchestrator() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    api.get('/complaints/').then(res => setComplaints(res.data));
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3">
        <ShieldCheck className="w-8 h-8 text-blue-600" /> AI Orchestrator Logs
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        This panel displays the exact AI analysis results for every newly submitted complaint, showing the logic used for triage.
      </p>

      <div className="flex flex-col gap-6">
        {complaints.map((c: any) => (
          <div key={c.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1">
              <div className="text-sm font-bold text-gray-400 mb-1">Problem</div>
              <h3 className="font-bold text-lg dark:text-white mb-2">{c.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{c.description}</p>
            </div>
            
            <div className="hidden md:flex flex-col items-center justify-center px-4 text-gray-300">
              <Activity className="w-6 h-6 mb-1" />
              <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-700"></div>
            </div>

            <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-800 w-full md:w-auto">
              <div className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> AI Analysis
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Risk Level:</span>
                  <strong className={c.riskLevel === 'SEVERE' ? 'text-red-600' : c.riskLevel === 'MEDIUM' ? 'text-orange-600' : 'text-blue-600'}>{c.riskLevel}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Priority:</span>
                  <strong className="dark:text-white">{c.priority}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Estimated Resolution:</span>
                  <strong className="dark:text-white">{c.eta}</strong>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-500 block mb-1">AI Reasoning:</span>
                  <p className="text-gray-700 dark:text-gray-300 font-mono text-xs">{c.riskReason}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
