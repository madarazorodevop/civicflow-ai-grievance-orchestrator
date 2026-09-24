import React from "react";
import { User, Settings, LogOut, Mail, Building, MapPin } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto h-full">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-blue-600" />
          Operator Profile
        </h1>
        <p className="text-gray-500 mt-1">Manage your account and preferences.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start border-b border-gray-100">
          <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-4xl font-bold shrink-0">
            OP
          </div>
          <div className="flex flex-col text-center sm:text-left gap-2 flex-1">
            <h2 className="text-2xl font-bold text-gray-900">Demo Operator</h2>
            <div className="flex flex-col gap-2 text-gray-600 text-sm mt-2">
              <span className="flex items-center justify-center sm:justify-start gap-2">
                <Building className="w-4 h-4 text-gray-400" /> Department of Public Works
              </span>
              <span className="flex items-center justify-center sm:justify-start gap-2">
                <Mail className="w-4 h-4 text-gray-400" /> operator@civicflow.example.com
              </span>
              <span className="flex items-center justify-center sm:justify-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400" /> Civic Center, District 1
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md uppercase">Admin Access</span>
              <span className="bg-green-50 text-green-700 text-xs font-bold px-2.5 py-1 rounded-md uppercase">On Duty</span>
            </div>
          </div>
        </div>
        
        <div className="p-0">
          <button className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center gap-3 text-gray-700 font-medium">
              <Settings className="w-5 h-5 text-gray-400" />
              Account Settings
            </div>
            <span className="text-gray-400">→</span>
          </button>
          
          <button className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center gap-3 text-gray-700 font-medium">
              <Bell className="w-5 h-5 text-gray-400" />
              Notification Preferences
            </div>
            <span className="text-gray-400">→</span>
          </button>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors text-left group">
            <div className="flex items-center gap-3 text-red-600 font-medium group-hover:text-red-700">
              <LogOut className="w-5 h-5" />
              Sign Out
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
