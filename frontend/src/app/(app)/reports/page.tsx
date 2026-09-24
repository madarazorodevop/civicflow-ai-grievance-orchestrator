import React from "react";
import Link from "next/link";
import { PlusCircle, Search, Filter } from "lucide-react";

export default function ReportsList() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reports</h1>
          <p className="text-gray-500">Track and manage all submitted civic issues.</p>
        </div>
        <Link 
          href="/reports/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
        >
          <PlusCircle className="w-5 h-5" />
          New Report
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full min-h-[500px]">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search reports by ID, location, or keyword..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center text-center">
            {/* Placeholder for list */}
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No reports found</h3>
            <p className="text-gray-500 max-w-sm mt-1">
              There are currently no reports matching your filters, or the database is empty.
            </p>
        </div>
      </div>
    </div>
  );
}
