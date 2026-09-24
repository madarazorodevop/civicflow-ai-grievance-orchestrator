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
      <h1 className="text-4xl font-extrabold mb-8 text-white drop-shadow-md">My Complaints</h1>
      <div className="flex flex-col gap-6">
        {complaints.length === 0 ? <p className="text-gray-300 p-8 text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl font-light">You have not submitted any complaints yet.</p> : null}
        {complaints.map((c: any) => (
          <div key={c.id} className="bg-white/10 backdrop-blur-2xl p-6 md:p-8 rounded-3xl shadow-2xl border border-white/20 flex flex-col md:flex-row gap-8 transition-transform hover:-translate-y-1">
            {c.image_url && (
              <div className="w-full md:w-64 h-48 bg-black/30 rounded-2xl overflow-hidden shrink-0 shadow-inner">
                <img src={`http://localhost:8000${c.image_url}`} alt="Complaint" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 text-white">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-extrabold text-2xl drop-shadow-sm">{c.title}</h3>
                <span className="text-xs font-mono font-bold px-3 py-1.5 bg-white/20 border border-white/30 rounded-full text-blue-100">{c.id}</span>
              </div>
              <p className="text-gray-200 mb-6 font-light leading-relaxed">{c.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-black/20 p-5 rounded-2xl border border-white/10 shadow-inner">
                <div><div className="text-gray-400 mb-1 font-semibold">{d.category || 'Category'}</div><div className="font-bold text-blue-200">{c.category}</div></div>
                <div>
                  <div className="text-gray-400 mb-1 font-semibold">AI Risk Assessment</div>
                  <div className={`font-extrabold ${c.riskLevel === 'SEVERE' ? 'text-red-400' : c.riskLevel === 'MEDIUM' ? 'text-orange-400' : 'text-cyan-400'}`}>
                    {c.riskLevel === 'SEVERE' ? '🔴 ' : c.riskLevel === 'MEDIUM' ? '🟠 ' : '🔵 '}
                    {c.riskLevel || 'PENDING'}
                  </div>
                </div>
                <div><div className="text-gray-400 mb-1 font-semibold">{d.status || 'Status'}</div><div className="font-extrabold text-green-400">{c.status}</div></div>
                <div><div className="text-gray-400 mb-1 font-semibold">{d.eta || 'ETA'}</div><div className="font-bold text-blue-200">{c.eta}</div></div>
                <div><div className="text-gray-400 mb-1 font-semibold">Submitted On</div><div className="font-bold text-gray-300">{new Date(c.created_at).toLocaleDateString()}</div></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
