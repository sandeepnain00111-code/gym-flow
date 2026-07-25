'use client';

import React from 'react';
import { Settings, Save, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function GymOwnerSettings() {
  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Gym parameters updated successfully! 🏆');
  };

  return (
    <div className="space-y-6 max-w-xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Gym Settings</h1>
        <p className="text-gray-400 text-xs mt-1">Configure desk announcements, operational parameters, and attendance tolerances.</p>
      </div>

      <form onSubmit={handleSave} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
          <Settings className="h-4.5 w-4.5 text-emerald-400" />
          <span>Operational Parameters</span>
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase">Check-in Timeout (Minutes)</label>
            <input
              type="number"
              defaultValue="60"
              className="w-full px-4 py-2.5 text-xs glass-input rounded-xl bg-white/3"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase">Access Attendance tolerance (Minutes)</label>
            <input
              type="number"
              defaultValue="15"
              className="w-full px-4 py-2.5 text-xs glass-input rounded-xl bg-white/3"
            />
          </div>

          <div className="p-3 bg-white/3 border border-white/5 rounded-2xl flex items-start space-x-2 text-[10px] text-gray-405 leading-relaxed">
            <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>*Tolerances ensure active pass check-in restrictions on members during heavy traffic hours.</span>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-white/5">
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold py-2.5 px-6 rounded-xl text-xs flex items-center space-x-1.5 transition shadow"
          >
            <Save className="h-4 w-4" />
            <span>Save Gym Parameters</span>
          </button>
        </div>
      </form>
    </div>
  );
}
