'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useLangStore } from '@/lib/store';
import { dict } from '@/lib/i18n';

export default function ClientComplaints() {
  const [complaints, setComplaints] = useState([]);
  const lang = useLangStore(s => s.lang);
  const d = dict[lang];

  useEffect(() => {
    api.get('/complaints/').then(res => setComplaints(res.data));
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">My Complaints</h1>
      <div className="flex flex-col gap-4">
        {complaints.length === 0 ? <p className="text-gray-500 dark:text-gray-400 p-8 text-center bg-gray-100 dark:bg-gray-800 rounded-xl">You have not submitted any complaints yet.</p> : null}
        {complaints.map((c: any) => (
          <div key={c.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-6">
            {c.image_url && (
              <div className="w-full md:w-48 h-32 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden shrink-0">
                <img src={`http://localhost:8000${c.image_url}`} alt="Complaint" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-xl dark:text-white">{c.title}</h3>
                <span className="text-xs font-bold px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300">{c.id}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{c.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <div><div className="text-gray-500 mb-1">{d.category || 'Category'}</div><div className="font-medium dark:text-white">{c.category}</div></div>
                <div><div className="text-gray-500 mb-1">{d.status || 'Status'}</div><div className="font-medium dark:text-white text-blue-600">{c.status}</div></div>
                <div><div className="text-gray-500 mb-1">{d.eta || 'ETA'}</div><div className="font-medium dark:text-white">{c.eta}</div></div>
                <div><div className="text-gray-500 mb-1">Submitted On</div><div className="font-medium dark:text-white">{new Date(c.created_at).toLocaleDateString()}</div></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
