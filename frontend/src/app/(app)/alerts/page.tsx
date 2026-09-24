import React from "react";
import { Bell, AlertTriangle, Info, CheckCircle2 } from "lucide-react";

export default function AlertsPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto h-full">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <Bell className="w-6 h-6 text-blue-600" />
          System Alerts
        </h1>
        <p className="text-gray-500 mt-1">Real-time notifications and SLA breach warnings.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-gray-800">Recent Alerts</h2>
        </div>
        <div className="p-0">
          <div className="flex items-start gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg shrink-0 mt-1">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">SLA Breach Warning</span>
                <span className="text-xs text-gray-500 font-mono">10 mins ago</span>
              </div>
              <p className="text-gray-700 text-sm mt-1">Complaint <span className="font-bold">CF-1044</span> (Drainage) is within 1 hour of SLA breach. Escalation protocol initiated.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0 mt-1">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">System Update</span>
                <span className="text-xs text-gray-500 font-mono">2 hours ago</span>
              </div>
              <p className="text-gray-700 text-sm mt-1">AI Routing engine has been updated to version 1.0.4. Triage confidence threshold increased.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg shrink-0 mt-1">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">Queue Resolved</span>
                <span className="text-xs text-gray-500 font-mono">5 hours ago</span>
              </div>
              <p className="text-gray-700 text-sm mt-1">Sanitation department has resolved 12 low-priority complaints in the last 24 hours.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
