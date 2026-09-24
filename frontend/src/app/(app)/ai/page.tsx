"use client";

import React, { useState } from "react";
import { Cpu, Server, ShieldCheck, Activity, Zap, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const AI_AGENTS = [
  { id: "intake", name: "Intake", status: "active", icon: MessageSquare, description: "Extracts data from citizen reports" },
  { id: "routing", name: "Routing", status: "active", icon: Zap, description: "Determines correct department" },
  { id: "sla", name: "SLA", status: "active", icon: Activity, description: "Calculates resolution deadlines" },
  { id: "followup", name: "Follow-up", status: "standby", icon: Server, description: "Monitors idle complaints" },
  { id: "escalation", name: "Escalation", status: "standby", icon: ShieldCheck, description: "Escalates breached SLAs" },
];

const LIVE_EVENTS = [
  { time: "10:44:12", agent: "Follow-up", action: "Monitoring queue", details: "Checked 142 open complaints" },
  { time: "10:43:05", agent: "SLA", action: "SLA created", details: "CF-1043 set to 48h deadline" },
  { time: "10:42:50", agent: "Routing", action: "Routed to Roads", details: "CF-1042 mapped to Roads Dept" },
  { time: "10:42:15", agent: "Intake", action: "Classified CF-1042", details: "Category: Road Damage, Confidence: 94%" },
];

export default function AIOrchestrator() {
  const [aiMode, setAiMode] = useState<"openai" | "demo">("openai");

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Cpu className="w-6 h-6 text-blue-600" />
            AI Orchestrator
          </h1>
          <p className="text-gray-500">Real-time view of autonomous agents and triage events.</p>
        </div>
        
        <div className={cn(
          "px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2",
          aiMode === "demo" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"
        )}>
          <span className="relative flex h-2 w-2">
            <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", aiMode === "demo" ? "bg-orange-400" : "bg-green-400")}></span>
            <span className={cn("relative inline-flex rounded-full h-2 w-2", aiMode === "demo" ? "bg-orange-500" : "bg-green-500")}></span>
          </span>
          AI MODE: {aiMode.toUpperCase()}
          {aiMode === "demo" && <span className="ml-1 text-orange-600 font-medium font-normal">(Fallback/Deterministic)</span>}
        </div>
      </div>

      {/* Main Layout: Stacked on Phone, Side-by-side on Desktop */}
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        
        {/* Left Column: AI Agents */}
        <div className="w-full lg:w-1/3 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="font-semibold text-gray-800">Active Agents</h2>
          </div>
          <div className="p-4 flex flex-col gap-4">
            {AI_AGENTS.map((agent) => (
              <div key={agent.id} className="flex items-start gap-4 p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <div className={cn(
                  "p-2 rounded-lg",
                  agent.status === "active" ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-500"
                )}>
                  <agent.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">{agent.name}</span>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                      agent.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                    )}>
                      {agent.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{agent.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Events */}
        <div className="w-full lg:w-2/3 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden lg:h-[600px]">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="font-semibold text-gray-800">Live Event Stream</h2>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Activity className="w-3 h-3 animate-pulse" /> Live
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 relative">
            <div className="absolute left-[39px] top-6 bottom-6 w-0.5 bg-gray-200 z-0 hidden sm:block"></div>
            
            {LIVE_EVENTS.map((event, i) => (
              <div key={i} className="flex items-start gap-4 relative z-10">
                <div className="hidden sm:flex flex-col items-center justify-center w-20 shrink-0 text-xs font-mono text-gray-400 pt-1">
                  {event.time}
                </div>
                <div className="hidden sm:flex w-4 h-4 rounded-full bg-white border-2 border-blue-500 mt-1 shrink-0 z-10 shadow-sm" />
                
                <div className="flex-1 bg-white border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex sm:hidden items-center justify-between mb-2">
                    <span className="text-xs font-mono text-gray-400">{event.time}</span>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">{event.agent}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <span className="hidden sm:inline-flex text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">{event.agent}</span>
                        {event.action}
                      </h3>
                      <div className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded border border-gray-100 font-mono">
                        {event.details}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
