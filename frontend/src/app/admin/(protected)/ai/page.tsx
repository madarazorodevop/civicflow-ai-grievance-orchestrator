'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { ShieldCheck, Activity, Cpu, ChevronDown, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIOrchestrator() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    api.get('/complaints/').then(res => setComplaints(res.data));
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-8 flex items-center justify-between bg-black/20 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-extrabold mb-2 text-white flex items-center gap-3">
            <Cpu className="w-8 h-8 text-cyan-400" /> AI Neural Orchestrator
          </h1>
          <p className="text-slate-300 font-medium">
            Live telemetry of AI-triage logic and automated grievance routing.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full font-bold text-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          AI Engine Online
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {complaints.map((c: any, i: number) => {
          const isExpanded = expandedId === c.id;
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={c.id}
              className={`border transition-all duration-300 rounded-2xl overflow-hidden backdrop-blur-md ${isExpanded ? 'bg-slate-900/80 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)]' : 'bg-black/40 border-white/10 hover:border-white/20 hover:bg-black/60'}`}
            >
              <div 
                className="p-5 flex items-center justify-between cursor-pointer group"
                onClick={() => setExpandedId(isExpanded ? null : c.id)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-3 rounded-xl flex-shrink-0 ${c.riskLevel === 'SEVERE' ? 'bg-red-500/20 text-red-400' : c.riskLevel === 'MEDIUM' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {c.riskLevel === 'SEVERE' ? <AlertTriangle className="w-6 h-6" /> : c.riskLevel === 'MEDIUM' ? <Activity className="w-6 h-6" /> : <Info className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">{c.title}</h3>
                    <div className="text-sm text-slate-400 flex items-center gap-2">
                      <span className="font-mono text-xs">{c.id}</span>
                      <span>•</span>
                      <span>Processed by GPT-OSS-20B</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wide ${c.riskLevel === 'SEVERE' ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' : c.riskLevel === 'MEDIUM' ? 'bg-orange-500 text-white' : 'bg-blue-600 text-white'}`}>
                    {c.riskLevel}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-cyan-400' : ''}`} />
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-5 pt-0 border-t border-white/5 mt-2 bg-black/20">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div className="space-y-4">
                          <div>
                            <span className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1 block">User Input Payload</span>
                            <p className="text-slate-300 text-sm italic border-l-2 border-slate-600 pl-3 py-1">"{c.description}"</p>
                          </div>
                          <div className="flex gap-4">
                            <div className="bg-white/5 p-3 rounded-xl flex-1 border border-white/10">
                              <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Routed Category</span>
                              <strong className="text-white text-sm">{c.category}</strong>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl flex-1 border border-white/10">
                              <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Calculated Priority</span>
                              <strong className="text-white text-sm">{c.priority}</strong>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-slate-950/80 p-4 rounded-xl border border-cyan-900/50 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 shadow-[0_0_20px_#06b6d4]"></div>
                          <span className="text-xs text-cyan-500 uppercase tracking-wider font-bold mb-2 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" /> AI Neural Reasoning Output
                          </span>
                          <p className="text-cyan-100 font-mono text-xs leading-relaxed opacity-90">
                            {c.riskReason || "No advanced reasoning matrix provided for this node."}
                          </p>
                          <div className="mt-4 pt-3 border-t border-cyan-900/50 flex justify-between items-center">
                            <span className="text-xs text-slate-500">Auto-Assigned ETA</span>
                            <strong className="text-cyan-400 text-sm bg-cyan-950 px-2 py-1 rounded">{c.eta}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
