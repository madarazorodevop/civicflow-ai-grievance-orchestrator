'use client';
import { useLangStore } from '@/lib/store';
import { Globe } from 'lucide-react';

export default function LangSwitch() {
  const { lang, setLang } = useLangStore();
  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
      className="flex items-center justify-center gap-3 p-3.5 w-full text-blue-200 font-bold hover:bg-blue-500/20 hover:text-blue-100 rounded-2xl transition-colors text-sm tracking-wide border border-transparent hover:border-blue-500/30"
    >
      <Globe className="w-5 h-5" />
      {lang === 'en' ? 'Translate to தமிழ்' : 'Translate to English'}
    </button>
  );
}
