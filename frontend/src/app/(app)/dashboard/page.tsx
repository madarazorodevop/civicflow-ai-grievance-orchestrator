"use client";

import React from "react";
import { AlertCircle, Clock, MapPin, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const ResponsiveMap = dynamic(() => import("@/components/map/ResponsiveMap").then(mod => mod.ResponsiveMap), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 flex items-center justify-center">Loading interactive map...</div>
});

// Mock data
const COMPLAINTS = [
  { id: "CF-1042", category: "Pothole", priority: "HIGH", department: "Roads", sla: "17h 42m", status: "OPEN" },
  { id: "CF-1043", category: "Streetlight", priority: "MEDIUM", department: "Electrical", sla: "51h 10m", status: "IN_PROGRESS" },
  { id: "CF-1044", category: "Drainage", priority: "HIGH", department: "Water", sla: "5h 20m", status: "OPEN" },
  { id: "CF-1045", category: "Garbage", priority: "LOW", department: "Sanitation", sla: "120h 00m", status: "RESOLVED" },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto h-full">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "OPEN", value: 142, color: "text-blue-600" },
          { label: "HIGH", value: 27, color: "text-red-600" },
          { label: "AT RISK", value: 18, color: "text-orange-600" },
          { label: "RESOLVED", value: 53, color: "text-green-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
            <span className="text-xs font-semibold text-gray-500">{stat.label}</span>
            <span className={cn("text-3xl font-bold mt-1", stat.color)}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Main Content Area (Split on Desktop, Stacked on Mobile) */}
      <div className="flex flex-col lg:flex-row gap-6 h-full flex-1 min-h-0">
        
        {/* Left Column: Complaint Queue */}
        <div className="w-full lg:w-1/2 flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden h-[400px] lg:h-full">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
            <h2 className="font-semibold text-gray-800">Complaint Queue</h2>
            <button className="text-sm text-blue-600 font-medium">Filter</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {/* Mobile/Tablet view: Cards */}
            <div className="flex flex-col gap-3 md:hidden">
              {COMPLAINTS.map((c) => (
                <div key={c.id} className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white flex flex-col gap-2 relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-gray-900">{c.id}</span>
                      <p className="text-sm font-medium text-gray-700">{c.category}</p>
                    </div>
                    {c.priority === "HIGH" && <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full"><AlertCircle className="w-3 h-3" /> HIGH</span>}
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    <div className="text-sm text-gray-500 flex flex-col">
                      <span>{c.department}</span>
                      <span className="flex items-center gap-1 mt-1"><Clock className="w-3 h-3"/> {c.sla}</span>
                    </div>
                    <button className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-md">Open</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop view: Table */}
            <div className="hidden md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="pb-3 font-semibold">ID</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Priority</th>
                    <th className="pb-3 font-semibold">SLA</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPLAINTS.map((c) => (
                    <tr key={c.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-3 font-medium text-gray-900">{c.id}</td>
                      <td className="py-3 text-gray-700">{c.category}</td>
                      <td className="py-3">
                        {c.priority === "HIGH" ? (
                          <span className="flex items-center gap-1 text-xs font-bold text-red-600"><AlertCircle className="w-3 h-3" /> HIGH</span>
                        ) : (
                          <span className="text-xs font-medium text-gray-600">{c.priority}</span>
                        )}
                      </td>
                      <td className="py-3 text-gray-600">{c.sla}</td>
                      <td className="py-3 text-right">
                        <button className="text-blue-600 font-medium hover:underline">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Map */}
        <div className="w-full lg:w-1/2 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden h-[400px] lg:h-full relative z-0">
          <div className="absolute top-4 left-4 z-[400] bg-white shadow p-2 text-sm font-medium rounded-md">
            Live Incident Map
          </div>
          <ResponsiveMap 
            markers={[
              { id: "CF-1042", lat: 40.7128, lng: -74.0060, title: "Pothole", category: "Roads", priority: "HIGH" },
              { id: "CF-1043", lat: 40.7228, lng: -74.0160, title: "Streetlight", category: "Electrical", priority: "MEDIUM" },
              { id: "CF-1044", lat: 40.7028, lng: -73.9960, title: "Drainage", category: "Water", priority: "HIGH" },
            ]}
          />
        </div>

      </div>
    </div>
  );
}
