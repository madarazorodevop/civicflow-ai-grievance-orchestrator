'use client';
import { useState } from 'react';
import api from '@/lib/api';
import { useLangStore } from '@/lib/store';
import { dict } from '@/lib/i18n';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { MapPin, Camera } from 'lucide-react';

export default function ReportPage() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [cat, setCat] = useState('Roads');
  const [lat, setLat] = useState<number|null>(null);
  const [lng, setLng] = useState<number|null>(null);
  const [file, setFile] = useState<File|null>(null);
  
  const lang = useLangStore(s => s.lang);
  const d = dict[lang];
  const router = useRouter();

  const locateMe = () => {
    if (navigator.geolocation) {
      toast.loading('Detecting location...', { id: 'geo' });
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
          toast.success('Location locked successfully', { id: 'geo' });
        },
        (error) => {
          console.error(error);
          toast.error('Location access denied or unavailable. Please enable permissions.', { id: 'geo' });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      toast.error('Geolocation is not supported by your browser', { id: 'geo' });
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lat || !lng) {
      toast.error('Please detect your location first');
      return;
    }
    try {
      toast.loading('Submitting...', { id: 'sub' });
      let image_url = null;
      if (file) {
        const fd = new FormData();
        fd.append('file', file);
        const up = await api.post('/upload', fd);
        image_url = up.data.url;
      }
      await api.post('/complaints/', {
        title, description: desc, category: cat, lat, lng, image_url
      });
      toast.success('Complaint submitted successfully', { id: 'sub' });
      router.push('/client/dashboard');
    } catch (err) {
      toast.error('Submission failed', { id: 'sub' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{d.report_issue}</h1>
      <form onSubmit={submit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">{d.title}</label>
          <input required value={title} onChange={e=>setTitle(e.target.value)} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">{d.description}</label>
          <textarea required value={desc} onChange={e=>setDesc(e.target.value)} rows={4} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">{d.category}</label>
          <select value={cat} onChange={e=>setCat(e.target.value)} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
            <option value="Roads">Roads / Potholes</option>
            <option value="Sanitation">Sanitation / Garbage</option>
            <option value="Infrastructure">Infrastructure Hazard</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">{d.photo}</label>
          <div className="flex items-center gap-4">
            <input type="file" accept="image/*" id="cam" capture="environment" className="hidden" onChange={e => setFile(e.target.files?.[0]||null)} />
            <label htmlFor="cam" className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer rounded-lg font-medium text-gray-700 dark:text-gray-300 transition-colors">
              <Camera className="w-5 h-5"/> Capture or Upload
            </label>
            {file && <span className="text-sm text-green-600 font-bold truncate max-w-[200px]">{file.name}</span>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Location</label>
          <div className="flex items-center gap-4">
            <button type="button" onClick={locateMe} className="flex items-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg font-medium transition-colors">
              <MapPin className="w-5 h-5"/> {d.locate_me}
            </button>
            {lat && lng && <span className="text-sm font-mono text-gray-500">{lat.toFixed(4)}, {lng.toFixed(4)}</span>}
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 rounded-xl mt-4 transition-colors">
          {d.submit}
        </button>
      </form>
    </div>
  );
}
