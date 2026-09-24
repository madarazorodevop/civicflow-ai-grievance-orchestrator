'use client';
import { useLangStore } from '@/lib/store';

export default function LangSwitch() {
  const { lang, setLang } = useLangStore();
  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
      className="px-3 py-1 font-bold rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
    >
      {lang === 'en' ? 'தமிழ்' : 'English'}
    </button>
  );
}
