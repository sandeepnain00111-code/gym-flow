'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import Spinner from '../../../components/ui/Spinner';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Scale, PlusCircle, Save, TrendingDown, ClipboardList } from 'lucide-react';

export default function BodyProgressTracker() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<any>();

  const fetchProgressLogs = async () => {
    try {
      const res = await api.get('/member/progress');
      if (res.data.success) {
        setLogs(res.data.logs);
      }
    } catch (err) {
      toast.error('Failed to load progress history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgressLogs();
  }, []);

  const onSubmitProgress = async (data) => {
    setSubmitting(true);
    try {
      const res = await api.post('/member/progress', {
        weight: parseFloat(data.weight),
        bodyFat: data.bodyFat ? parseFloat(data.bodyFat) : undefined,
        height: data.height ? parseFloat(data.height) : undefined
      });

      if (res.data.success) {
        toast.success('Bodily stats recorded successfully! 📈');
        setShowLogForm(false);
        reset();
        fetchProgressLogs();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record metrics');
    } finally {
      setSubmitting(false);
    }
  };

  // Prepare chart data: sort logs by date ascending
  const chartData = [...logs]
    .sort((a, b) => new Date(a.logDate).getTime() - new Date(b.logDate).getTime())
    .map((log) => ({
      date: new Date(log.logDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      weight: log.weight,
      fat: log.bodyFat || 0
    }));

  const latestLog = logs[0]; // Already sorted desc from backend
  const calculatedBMI =
    latestLog && latestLog.height
      ? (latestLog.weight / Math.pow(latestLog.height / 100, 2)).toFixed(1)
      : null;
  const calculatedBMIFloat = calculatedBMI ? parseFloat(calculatedBMI) : null;

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">Bodily Progress Tracker</h1>
          <p className="text-gray-400 text-xs mt-1">Audit daily body weight logs, fat ratio metrics, and verify active trends.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowLogForm(!showLogForm)}
            className="bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-500/10 transition"
          >
            <PlusCircle className="h-4.5 w-4.5" />
            <span>Record New Log</span>
          </button>
        </div>
      </div>

      {/* Manual log form */}
      {showLogForm && (
        <form
          onSubmit={handleSubmit(onSubmitProgress)}
          className="glass-panel p-6 rounded-3xl border border-emerald-500/20 max-w-xl animate-fade-in space-y-4"
        >
          <h3 className="text-sm font-bold text-white">Record Today's Bodily Metrics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Weight */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                placeholder="75.5"
                {...register('weight', { required: 'Weight is required' })}
                className="w-full px-4 py-2.5 text-xs glass-input rounded-xl"
              />
              {errors.weight && <p className="text-red-400 text-[10px] mt-1">{String(errors.weight.message)}</p>}
            </div>

            {/* Height */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Height (cm)</label>
              <input
                type="number"
                step="0.1"
                placeholder="178.0"
                {...register('height')}
                className="w-full px-4 py-2.5 text-xs glass-input rounded-xl"
              />
            </div>

            {/* Body Fat */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Body Fat (%)</label>
              <input
                type="number"
                step="0.1"
                placeholder="14.5"
                {...register('bodyFat')}
                className="w-full px-4 py-2.5 text-xs glass-input rounded-xl"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-2 justify-end">
            <button
              type="button"
              onClick={() => setShowLogForm(false)}
              className="bg-white/5 hover:bg-white/10 text-white font-bold py-2 px-4 rounded-xl text-[10px] transition border border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold py-2 px-5 rounded-xl text-[10px] flex items-center space-x-1 transition shadow-md shadow-emerald-500/10"
            >
              {submitting ? <Spinner size="sm" /> : <span>Record Log</span>}
            </button>
          </div>
        </form>
      )}

      {/* Grid of stats & charts */}
      {logs.length === 0 ? (
        <div className="glass-panel text-center p-16 rounded-3xl border border-white/5 max-w-md mx-auto">
          <Scale className="h-10 w-10 text-gray-600 mx-auto mb-3 animate-pulse" />
          <p className="text-xs text-gray-400">No body progress logs entered yet. Log your weight today to unlock trending charts!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Metrics display */}
          <div className="lg:col-span-1 space-y-6">
            {/* Weight card */}
            <div className="glass-card p-6 rounded-3xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full pointer-events-none" />
              <p className="text-[10px] font-bold text-gray-500 uppercase">Latest Weight Record</p>
              <p className="text-3xl font-black text-white mt-2">
                {latestLog.weight} <span className="text-xs text-gray-400 font-bold">kg</span>
              </p>
              {latestLog.bodyFat && (
                <p className="text-[10px] text-gray-450 mt-1 font-semibold">Body Fat: {latestLog.bodyFat}%</p>
              )}
            </div>

            {/* BMI card */}
            {calculatedBMI && (
              <div className="glass-card p-6 rounded-3xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-2xl rounded-full pointer-events-none" />
                <p className="text-[10px] font-bold text-gray-500 uppercase">Calculated Body Mass Index (BMI)</p>
                <p className="text-3xl font-black text-cyan-405 mt-2">{calculatedBMI}</p>
                <p className="text-[9px] font-black uppercase text-emerald-450 mt-1 tracking-wider">
                  {calculatedBMIFloat !== null && calculatedBMIFloat < 18.5
                    ? 'Underweight'
                    : calculatedBMIFloat !== null && calculatedBMIFloat < 25
                    ? 'Healthy Weight'
                    : calculatedBMIFloat !== null && calculatedBMIFloat < 30
                    ? 'Overweight'
                    : 'Obesity'}
                </p>
              </div>
            )}
          </div>

          {/* Weight area chart history */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/5 space-y-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
              <TrendingDown className="h-4.5 w-4.5 text-emerald-400" />
              <span>Weight Transformation History</span>
            </h3>

            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{
                      background: '#111827',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px'
                    }}
                  />
                  <Area type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" name="Weight (kg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
