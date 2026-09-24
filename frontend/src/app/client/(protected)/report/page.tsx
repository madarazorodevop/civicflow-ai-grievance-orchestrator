'use client';
import { useState } from 'react';
import api from '@/lib/api';
import { useLangStore } from '@/lib/store';
import { dict } from '@/lib/i18n';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { MapPin, Camera } from 'lucide-react';
import dynamic from 'next/dynamic';

const LocationPickerMap = dynamic(() => import('@/components/map/LocationPickerMap').then(m => m.LocationPickerMap), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-black/20 flex items-center justify-center animate-pulse">Loading Live Map...</div>
});

export default function ReportPage() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [cat, setCat] = useState('Roads');
  const [lat, setLat] = useState<number|null>(null);
  const [lng, setLng] = useState<number|null>(null);
  const [file, setFile] = useState<File|null>(null);
  const [addressInput, setAddressInput] = useState('');
  
  const lang = useLangStore(s => s.lang);
  const d = dict[lang];
  const router = useRouter();

  const locateMe = () => {
    if (navigator.geolocation) {
      toast.loading('Detecting location (this relies on your device GPS accuracy)...', { id: 'geo' });
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setLat(latitude);
          setLng(longitude);
          
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            if (data && data.display_name) {
              setAddressInput(data.display_name);
            }
          } catch (e) {
            console.error('Reverse geocode failed', e);
          }
          
          toast.success('Location locked! Drag the map if it needs adjusting.', { id: 'geo' });
        },
        (error) => {
          console.error(error);
          toast.error('Location access denied or unavailable. Please enable permissions.', { id: 'geo' });
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    } else {
      toast.error('Geolocation is not supported by your browser', { id: 'geo' });
    }
  };

  const geocodeAddress = async () => {
    if (!addressInput) return;
    toast.loading('Searching...', { id: 'geo' });
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressInput)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        setLat(parseFloat(data[0].lat));
        setLng(parseFloat(data[0].lon));
        toast.success('Location found! You can drag the map if needed.', { id: 'geo' });
      } else {
        toast.error('Address not found', { id: 'geo' });
      }
    } catch {
      toast.error('Search failed', { id: 'geo' });
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
            <option className="bg-gray-800 text-red-400 font-bold" value="Gang Violence">Gang Violence</option>
            <option className="bg-gray-800 text-red-400 font-bold" value="Water Contamination">Water Contamination</option>
            <option className="bg-gray-800 text-red-400 font-bold" value="Armed Robbery">Armed Robbery</option>
            <option className="bg-gray-800 text-red-400 font-bold" value="Assault">Assault / Battery</option>
            <option className="bg-gray-800 text-red-400 font-bold" value="Mass Health Hazard">Mass Health Hazard</option>
            <option className="bg-gray-800 text-gray-400 font-bold" value="Other">Other (Low Threat)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-200">{d.photo}</label>
          <div className="flex items-center gap-4">
            <input type="file" accept=".webp,.jpg,.jpeg,.png,image/webp,image/jpeg,image/png" id="cam" capture="environment" className="hidden" onChange={e => {
              const f = e.target.files?.[0];
              if (f) {
                if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type) && !/\.(webp|jpg|jpeg|png)$/i.test(f.name)) {
                  toast.error('only image file is accepted eg webp jpg png jpeg');
                  e.target.value = '';
                  setFile(null);
                  return;
                }
                setFile(f);
              } else {
                setFile(null);
              }
            }} />
            <label htmlFor="cam" className="flex items-center gap-2 px-5 py-4 bg-white/10 hover:bg-white/20 cursor-pointer rounded-xl font-bold text-white transition-colors border border-white/10 shadow-lg">
              <Camera className="w-5 h-5"/> Capture or Upload
            </label>
            {file && <span className="text-sm text-green-400 font-bold truncate max-w-[200px]">{file.name}</span>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-200">Precise Location</label>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <button type="button" onClick={locateMe} className="flex items-center gap-2 px-5 py-4 bg-blue-500/20 text-blue-200 hover:bg-blue-500/40 border border-blue-400/30 rounded-xl font-bold transition-all shadow-lg shrink-0">
              <MapPin className="w-5 h-5"/> Auto Detect
            </button>
            <div className="flex-1 flex gap-2">
              <input 
                type="text" 
                placeholder="Or search address manually..." 
                value={addressInput} 
                onChange={e => setAddressInput(e.target.value)} 
                className="w-full p-4 border border-white/20 rounded-xl bg-black/20 text-white outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all shadow-inner backdrop-blur-md"
              />
              <button type="button" onClick={geocodeAddress} className="px-5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl font-bold text-white transition-colors shrink-0 shadow-lg">
                Search
              </button>
            </div>
          </div>
          
          <div className="w-full border border-white/20 rounded-xl overflow-hidden shadow-inner relative z-0">
            <LocationPickerMap lat={lat} lng={lng} onChange={(l, g) => { setLat(l); setLng(g); }} />
          </div>
          <p className="text-xs text-gray-400 mt-2">Click anywhere on the map to place a precise pin.</p>
          {lat && lng && <p className="text-sm font-mono text-gray-300 mt-2 text-center">Selected Coordinates: {lat.toFixed(5)}, {lng.toFixed(5)}</p>}
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-lg py-5 rounded-2xl mt-4 transition-all hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(59,130,246,0.7)] shadow-xl border border-blue-400/30">
          {d.submit}
        </button>
      </form>
    </div>
  );
}
