'use client';

import React from 'react';
import { Settings, Save, ShieldAlert } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminSettings() {
  const handleSave = (e) => {
    e.preventDefault();
    toast.success('System parameters saved successfully!');
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">System Settings</h1>
        <p className="text-slate-400 text-xs mt-1">Configure global SaaS security, API rates, and notification parameters.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-[28px] border border-slate-100 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
        <h2 className="text-xs font-black text-slate-450 uppercase tracking-wider flex items-center space-x-2">
          <Settings className="h-4.5 w-4.5 text-[#00DF89]" />
          <span>SaaS System Parameters</span>
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-wider">Platform Name</label>
            <input
              type="text"
              defaultValue="GymFlow SaaS"
              className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#00DF89] focus:outline-none focus:ring-1 focus:ring-[#00DF89] rounded-2xl shadow-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-wider">Support Email Contact</label>
            <input
              type="email"
              defaultValue="support@gymflow.com"
              className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#00DF89] focus:outline-none focus:ring-1 focus:ring-[#00DF89] rounded-2xl shadow-sm transition-all"
            />
          </div>

          <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start space-x-2.5 text-[10.5px] text-amber-700 leading-relaxed font-semibold">
            <ShieldAlert className="h-4.5 w-4.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <span>*Global setting edits will propagate across all partner dashboards within 10 minutes cache cycles.</span>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="bg-[#00DF89] hover:bg-[#00c87a] text-white font-extrabold py-3 px-6 rounded-2xl text-xs flex items-center space-x-1.5 transition shadow-md shadow-emerald-500/10"
          >
            <Save className="h-4 w-4" />
            <span>Save System Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}

