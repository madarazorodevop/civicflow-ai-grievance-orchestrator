'use client';
import Link from 'next/link';
import { ShieldCheck, Users, ArrowRight } from 'lucide-react';
import ThemeSwitch from '@/components/ThemeSwitch';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gray-900 text-white">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero_bg.jpg')" }}
      >
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900/90" />
      </div>

      <header className="p-6 flex justify-between items-center max-w-6xl w-full mx-auto relative z-10">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-extrabold tracking-tight flex items-center gap-3 drop-shadow-lg"
        >
          <img src="/logo.jpg" alt="CivicFlow" className="w-10 h-10 rounded-full border-2 border-white/20 shadow-xl" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">CIVICFLOW</span>
        </motion.h1>
        <ThemeSwitch />
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-xl">
            AI-Powered <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Civic Resolution</span>
          </h2>
          <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto drop-shadow-md font-light">
            Report local infrastructure issues, track resolutions in real-time, and help authorities prioritize public safety using advanced AI triage.
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 gap-8 w-full max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link href="/login" className="relative group">
            <div className="absolute inset-0 bg-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative flex flex-col items-center p-8 bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all text-left overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <Users className="w-12 h-12 text-blue-400 mb-4 drop-shadow-md relative z-10" />
              <h3 className="text-2xl font-bold mb-2 w-full text-center relative z-10">Citizen Portal</h3>
              <p className="text-gray-300 text-center mb-6 font-light relative z-10">Report problems, track status, and view the community map.</p>
              <div className="mt-auto flex items-center justify-center gap-2 text-blue-400 font-bold group-hover:translate-x-2 transition-transform relative z-10">
                Enter as Citizen <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </Link>
          
          <Link href="/admin/login" className="relative group">
            <div className="absolute inset-0 bg-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative flex flex-col items-center p-8 bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700/50 hover:border-cyan-500/50 transition-all text-left overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <ShieldCheck className="w-12 h-12 text-cyan-400 mb-4 drop-shadow-md relative z-10" />
              <h3 className="text-2xl font-bold mb-2 w-full text-center relative z-10">Admin Portal</h3>
              <p className="text-gray-300 text-center mb-6 font-light relative z-10">Review AI triage, manage complaints, and update resolutions.</p>
              <div className="mt-auto flex items-center justify-center gap-2 text-cyan-400 font-bold group-hover:translate-x-2 transition-transform relative z-10">
                Enter as Admin <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
