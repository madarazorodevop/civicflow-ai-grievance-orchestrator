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
    <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-white/20 text-white">
      <h1 className="text-4xl font-extrabold mb-8 drop-shadow-md">{d.report_issue}</h1>
      <form onSubmit={submit} className="flex flex-col gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-200">{d.title}</label>
          <input required value={title} onChange={e=>setTitle(e.target.value)} className="w-full p-4 border border-white/20 rounded-xl bg-black/20 text-white outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all shadow-inner backdrop-blur-md" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-200">{d.description}</label>
          <textarea required value={desc} onChange={e=>setDesc(e.target.value)} rows={4} className="w-full p-4 border border-white/20 rounded-xl bg-black/20 text-white outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all shadow-inner backdrop-blur-md" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-200">{d.category}</label>
          <select value={cat} onChange={e=>setCat(e.target.value)} className="w-full p-4 border border-white/20 rounded-xl bg-black/20 text-white outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all shadow-inner backdrop-blur-md appearance-none">
            <option className="bg-gray-800" value="Roads">Roads / Potholes</option>
            <option className="bg-gray-800" value="Sanitation">Sanitation / Garbage</option>
            <option className="bg-gray-800" value="Infrastructure">Infrastructure Hazard</option>
            <option className="bg-gray-800" value="Water">Water Supply / Leakage</option>
            <option className="bg-gray-800" value="Electricity">Street Lighting / Electricity</option>
            <option className="bg-gray-800" value="Transit">Public Transport / Transit</option>
            <option className="bg-gray-800" value="Noise">Noise Pollution</option>
            <option className="bg-gray-800" value="Animals">Animal Control / Strays</option>
            <option className="bg-gray-800" value="Safety">Public Safety / Vandalism</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-200">{d.photo}</label>
          <div className="flex items-center gap-4">
            <input type="file" accept="image/*" id="cam" capture="environment" className="hidden" onChange={e => setFile(e.target.files?.[0]||null)} />
            <label htmlFor="cam" className="flex items-center gap-2 px-5 py-4 bg-white/10 hover:bg-white/20 cursor-pointer rounded-xl font-bold text-white transition-colors border border-white/10 shadow-lg">
              <Camera className="w-5 h-5"/> Capture or Upload
            </label>
            {file && <span className="text-sm text-green-400 font-bold truncate max-w-[200px]">{file.name}</span>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-200">Location</label>
          <div className="flex items-center gap-4">
            <button type="button" onClick={locateMe} className="flex items-center gap-2 px-5 py-4 bg-blue-500/20 text-blue-200 hover:bg-blue-500/40 border border-blue-400/30 rounded-xl font-bold transition-all shadow-lg">
              <MapPin className="w-5 h-5"/> {d.locate_me}
            </button>
            {lat && lng && <span className="text-sm font-mono text-gray-300">{lat.toFixed(4)}, {lng.toFixed(4)}</span>}
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-lg py-5 rounded-2xl mt-4 transition-all hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(59,130,246,0.7)] shadow-xl border border-blue-400/30">
          {d.submit}
        </button>
      </form>
    </div>
  );
}
