"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { AlertCircle, X, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

const ResponsiveMap = dynamic(() => import("@/components/map/ResponsiveMap").then(mod => mod.ResponsiveMap), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 flex items-center justify-center">Loading interactive map...</div>
});

const MOCK_COMPLAINTS = [
  { id: "CF-1042", lat: 40.7128, lng: -74.0060, title: "Pothole", category: "Roads", priority: "HIGH", sla: "17h 42m" },
  { id: "CF-1043", lat: 40.7228, lng: -74.0160, title: "Streetlight", category: "Electrical", priority: "MEDIUM", sla: "51h 10m" },
  { id: "CF-1044", lat: 40.7028, lng: -73.9960, title: "Drainage", category: "Water", priority: "HIGH", sla: "5h 20m" },
];

export default function MapView() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedComplaint = MOCK_COMPLAINTS.find(c => c.id === selectedId);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] lg:h-[calc(100vh-64px)] -mx-4 md:-mx-6 lg:-mx-8 -my-4 md:-my-6 lg:-my-8 relative">
      <div className="absolute top-4 left-4 z-[400] bg-white shadow-md p-3 rounded-xl flex items-center gap-3">
        <h1 className="font-bold text-gray-900 hidden sm:block">City Map</h1>
        <div className="flex items-center gap-2">
          <select className="text-sm bg-gray-50 border border-gray-200 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
            <option>All Priorities</option>
            <option>HIGH Priority</option>
          </select>
        </div>
      </div>

      {/* The Map */}
      <ResponsiveMap 
        markers={MOCK_COMPLAINTS}
        onMarkerClick={(id) => setSelectedId(id)}
        className="flex-1 w-full"
      />

      {/* Bottom Sheet / Drawer for selected complaint (Mobile & Desktop overlay) */}
      {selectedComplaint && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:w-96 sm:bottom-8 sm:right-8 z-[500] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="p-4 border-b border-gray-100 flex justify-between items-start bg-gray-50">
            <div>
              <span className="font-bold text-lg text-gray-900">{selectedComplaint.id}</span>
              <p className="font-medium text-gray-700">{selectedComplaint.title}</p>
            </div>
            <button 
              onClick={() => setSelectedId(null)}
              className="p-1.5 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-5 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 font-semibold uppercase">Category</span>
                <span className="font-medium">{selectedComplaint.category}</span>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <span className="text-xs text-gray-500 font-semibold uppercase">Priority</span>
                <span className={cn(
                  "flex items-center gap-1 font-bold text-sm",
                  selectedComplaint.priority === "HIGH" ? "text-red-600" : "text-orange-600"
                )}>
                  {selectedComplaint.priority === "HIGH" && <AlertCircle className="w-4 h-4" />}
                  {selectedComplaint.priority}
                </span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Time to Resolution:</span>
              <span className="font-mono font-bold text-gray-900">{selectedComplaint.sla}</span>
            </div>

            <div className="flex gap-3 mt-2">
              <button className="flex-1 bg-blue-600 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-sm">
                Open Case
              </button>
              <button className="px-4 bg-gray-100 text-gray-700 font-medium py-2.5 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors border border-gray-200">
                <Navigation className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
