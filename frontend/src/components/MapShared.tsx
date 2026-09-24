'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import api from '@/lib/api';

const ResponsiveMap = dynamic(() => import('@/components/map/ResponsiveMap').then(m => m.ResponsiveMap), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 flex items-center justify-center">Loading Map...</div>
});

export default function MapShared({ role }: { role: 'client'|'admin' }) {
  const [complaints, setComplaints] = useState([]);
  useEffect(() => {
    api.get('/complaints/').then(res => setComplaints(res.data));
  }, []);

  return (
    <div className="w-full h-[calc(100vh-100px)] -m-4 md:-m-8">
      <ResponsiveMap markers={complaints} onMarkerClick={() => {}} className="w-full h-full" />
    </div>
  );
}
