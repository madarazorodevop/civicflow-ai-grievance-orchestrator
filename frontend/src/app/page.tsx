'use client';
import Link from 'next/link';
import { ShieldCheck, Users, ArrowRight } from 'lucide-react';
import ThemeSwitch from '@/components/ThemeSwitch';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="p-6 flex justify-between items-center max-w-6xl w-full mx-auto">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">CIVICFLOW</h1>
        <ThemeSwitch />
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto w-full">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
          AI-Powered Civic Grievance Resolution
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl">
          Report local infrastructure issues, track resolutions in real-time, and help authorities prioritize public safety using advanced AI triage.
        </p>
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl">
          <Link href="/login" className="flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 transition-all group text-left">
            <Users className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 w-full text-center">Citizen Portal</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-6">Report problems, track status, and view the community map.</p>
            <div className="mt-auto flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-1 transition-transform">
              Enter as Citizen <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
          
          <Link href="/admin/login" className="flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 transition-all group text-left">
            <ShieldCheck className="w-12 h-12 text-slate-700 dark:text-slate-400 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 w-full text-center">Admin Portal</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-6">Review AI triage, manage complaints, and update resolutions.</p>
            <div className="mt-auto flex items-center justify-center gap-2 text-slate-700 dark:text-slate-400 font-bold group-hover:translate-x-1 transition-transform">
              Enter as Admin <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
