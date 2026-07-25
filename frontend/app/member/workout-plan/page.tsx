'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import Spinner from '../../../components/ui/Spinner';
import { Dumbbell, Utensils, ClipboardList, Target, ShieldCheck } from 'lucide-react';

export default function WorkoutAndDietRoutines() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('workout');

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const res = await api.get('/member/dashboard');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load member plans:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutines();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (data?.noMembership) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-100 max-w-lg mx-auto text-center space-y-4 shadow-md">
        <ClipboardList className="h-12 w-12 text-red-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800">Routines Unavailable</h3>
        <p className="text-slate-400 text-xs">Join an active partner gym to unlock daily target splits and nutrition tables.</p>
      </div>
    );
  }

  const { todayWorkout, todayDiet } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Training & Nutrition Logs</h1>
        <p className="text-slate-500 text-xs mt-1">Access scheduled exercise blueprints and macro-meal plans assigned by trainers.</p>
      </div>

      {/* Tab Switcher */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/50 max-w-md">
        <button
          type="button"
          onClick={() => setActiveTab('workout')}
          className={`py-2.5 rounded-xl text-xs font-bold tracking-wide transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'workout' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/20' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Dumbbell className="h-4.5 w-4.5 text-emerald-600" />
          <span>Exercise Splits</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('diet')}
          className={`py-2.5 rounded-xl text-xs font-bold tracking-wide transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'diet' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/20' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Utensils className="h-4.5 w-4.5 text-orange-550" />
          <span>Diet Blueprints</span>
        </button>
      </div>

      {activeTab === 'workout' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 space-y-6 shadow-md shadow-slate-100/50">
          {todayWorkout ? (
            <div className="space-y-6">
              <div className="flex justify-between gap-4 items-center border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800">{todayWorkout.title || 'Day Splitting'}</h3>
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-1.5 block">
                    Day Name: {todayWorkout.dayName}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                  <Target className="h-5 w-5" />
                </div>
              </div>

              {/* Exercises List */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Exercise List</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {todayWorkout.exercises && todayWorkout.exercises.map((ex) => (
                    <div key={ex.name} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between gap-4 hover:bg-slate-50 transition">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 border border-emerald-100">
                          <Dumbbell className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{ex.name}</p>
                          {ex.notes && <p className="text-[10px] text-slate-450 mt-1">{ex.notes}</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-extrabold text-emerald-600">{ex.sets} sets</p>
                        <p className="text-[10px] text-slate-400 mt-1">{ex.reps} reps</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 space-y-3">
              <ClipboardList className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-400">Rest day / Workout splits not scheduled yet by your gym trainer.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'diet' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 space-y-6 shadow-md shadow-slate-100/50">
          {todayDiet ? (
            <div className="space-y-6">
              <div className="flex justify-between gap-4 items-center border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Daily Meal Blueprint</h3>
                  <span className="text-[10px] text-orange-600 font-bold uppercase tracking-wider mt-1.5 block">
                    Nutrition Splits
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-100 text-orange-600">
                  <Utensils className="h-5 w-5" />
                </div>
              </div>

              {/* Meals List */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Meal Catalog</h4>
                <div className="space-y-3">
                  {todayDiet.meals && todayDiet.meals.map((meal) => (
                    <div key={meal.name} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:justify-between gap-4 sm:items-center space-y-2 sm:space-y-0 hover:bg-slate-50 transition">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-orange-50 rounded-lg text-orange-600 border border-orange-100 mt-0.5">
                          <ShieldCheck className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{meal.name}</p>
                          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed max-w-lg">{meal.items}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-black uppercase text-right self-end sm:self-center bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/50">{meal.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 space-y-3">
              <ClipboardList className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-400">No scheduled diet blueprint plans logged yet by your gym trainer.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
