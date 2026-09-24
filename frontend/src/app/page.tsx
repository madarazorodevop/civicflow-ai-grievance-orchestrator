import React from "react";
import Link from "next/link";
import { ArrowRight, MapPin, ShieldCheck, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full h-full min-h-screen bg-gray-50 -mx-4 md:-mx-6 lg:-mx-8 -my-4 md:-my-6 lg:-my-8">
      {/* Hero Section */}
      <section className="bg-blue-700 text-white pt-20 pb-24 px-6 relative overflow-hidden flex flex-col items-center text-center">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full border-[20px] border-white"></div>
          <div className="absolute top-1/2 right-10 w-64 h-64 rounded-full border-[10px] border-white"></div>
        </div>

        <div className="max-w-3xl relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 border border-blue-500 rounded-full text-xs font-bold uppercase tracking-wider mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            CIVICFLOW 1.0.0 is Live
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Report it once. <br className="hidden sm:block" />
            Track it. Resolve it.
          </h1>
          <p className="text-xl sm:text-2xl text-blue-100 mb-10 max-w-2xl font-light leading-relaxed">
            AI-powered civic grievance orchestration. We route your issues to the right department automatically, so they get fixed faster.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              href="/reports/new"
              className="flex items-center justify-center gap-2 bg-white text-blue-700 font-bold px-8 py-4 rounded-full hover:bg-gray-50 transition-colors shadow-lg text-lg"
            >
              Report an Issue <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/dashboard"
              className="flex items-center justify-center gap-2 bg-blue-800 text-white font-bold px-8 py-4 rounded-full border border-blue-600 hover:bg-blue-900 transition-colors text-lg"
            >
              Explore Demo Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works / Architecture */}
      <section className="py-20 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How it works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">From the moment you snap a photo, our AI handles the complexity of municipal bureaucracy.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative z-10">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">1. Capture</h3>
            <p className="text-gray-600">Submit a photo and location. Our app works instantly on any smartphone with zero downloads required.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">2. AI Triage</h3>
            <p className="text-gray-600">Our LLM-powered orchestrator instantly categorizes the issue, assesses severity, and assigns an SLA deadline.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">3. Orchestrate</h3>
            <p className="text-gray-600">Smart routing sends the ticket to the correct department while autonomous agents monitor for SLA breaches.</p>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6 text-center">
        <p className="font-bold text-gray-100 mb-2">CIVICFLOW</p>
        <p className="text-sm">Built for scalable civic resolution. Open Source Architecture.</p>
      </footer>
    </div>
  );
}
