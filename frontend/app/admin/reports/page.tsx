'use client';

import React from 'react';
import { FileBarChart, BookOpen, Clock, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminReports() {
  const handleDownload = () => {
    toast.success('System audit report PDF dispatched to download queue!');
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">System Audit & Reports</h1>
        <p className="text-slate-400 text-xs mt-1">Acquire physical audit logs, SaaS revenue breakdowns, and gym conversion reviews.</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-slate-100 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
        <h2 className="text-xs font-black text-slate-450 uppercase tracking-wider flex items-center space-x-2">
          <FileBarChart className="h-4.5 w-4.5 text-[#00DF89]" />
          <span>Audit Log Registers</span>
        </h2>

        <div className="space-y-4 text-xs text-slate-600">
          <div className="flex items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100/50 transition">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-cyan-500 flex-shrink-0" />
              <div>
                <p className="font-extrabold text-slate-800">Monthly Platform SaaS Revenue Audit</p>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">Aggregates subscriptions logs across active owners</p>
              </div>
            </div>
            <button
              onClick={handleDownload}
              className="text-[#00DF89] hover:text-[#00c87a] font-black flex items-center space-x-1 transition"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100/50 transition">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-5 w-5 text-cyan-500 flex-shrink-0" />
              <div>
                <p className="font-extrabold text-slate-800">Partner Gym Growth Ledger</p>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">Logs active/pending/blocked registrations by city</p>
              </div>
            </div>
            <button
              onClick={handleDownload}
              className="text-[#00DF89] hover:text-[#00c87a] font-black flex items-center space-x-1 transition"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

