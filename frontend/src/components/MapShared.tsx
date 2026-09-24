'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import api from '@/lib/api';
import { useLangStore } from '@/lib/store';
import { dict } from '@/lib/i18n';

const ResponsiveMap = dynamic(() => import('@/components/map/ResponsiveMap').then(m => m.ResponsiveMap), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-900/50 flex items-center justify-center text-white">Loading Map...</div>
});

export default function MapShared({ role }: { role: 'client'|'admin' }) {
  const [complaints, setComplaints] = useState([]);
  const lang = useLangStore(s => s.lang);
  const d = dict[lang];

  useEffect(() => {
    api.get('/complaints/').then(res => setComplaints(res.data));
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <h1 className="text-3xl font-extrabold mb-6 tracking-tight drop-shadow-md text-white">
        {d.map || 'Community Map'}
      </h1>
      <div className="flex-1 rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10 relative z-10">
        <ResponsiveMap markers={complaints} onMarkerClick={() => {}} className="w-full h-full" />
      </div>
    </div>
  );
}
