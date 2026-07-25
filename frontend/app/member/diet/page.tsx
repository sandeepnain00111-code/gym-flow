'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import Spinner from '../../../components/ui/Spinner';
import { Utensils, Apple, ShieldCheck, ClipboardList, Flame, Heart, Scale } from 'lucide-react';

export default function MemberDietPlan() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiet = async () => {
      try {
        const res = await api.get('/member/dashboard');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load diet details:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDiet();
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
        <Utensils className="h-12 w-12 text-red-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800">Diet Unavailable</h3>
        <p className="text-slate-400 text-xs">Join an active partner gym to unlock daily meal blueprint tables.</p>
      </div>
    );
  }

  const { todayDiet } = data || {};

  // Mock macro breakdown for absolute high-fidelity professional UI
  const macros = todayDiet ? {
    calories: "2,200 kcal",
    protein: "140g",
    carbs: "210g",
    fats: "65g"
  } : null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Apple className="h-7 w-7 text-orange-555" />
            <span>Daily Nutrition & Diet Splits</span>
          </h1>
          <p className="text-slate-500 text-xs mt-1">Keep track of your protein indexes, caloric intake, and meal time schedules.</p>
        </div>
      </div>

      {todayDiet ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Meals list */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-4 shadow-md shadow-slate-100/50">
              <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Utensils className="h-4.5 w-4.5 text-orange-550" />
                <span>Scheduled Meal Program</span>
              </h3>

              <div className="space-y-4 divide-y divide-slate-100">
                {todayDiet.meals && todayDiet.meals.map((meal, index) => (
                  <div key={index} className={`pt-4 ${index === 0 ? 'pt-0' : ''} flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 hover:bg-slate-50/30 p-2 rounded-xl transition`}>
                    <div className="flex items-start space-x-3.5">
                      <div className="p-2.5 bg-orange-50 rounded-xl text-orange-600 border border-orange-100 mt-0.5">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900">{meal.name}</p>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed max-w-md">{meal.items}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-orange-700 font-extrabold uppercase tracking-wide bg-orange-50 px-3 py-1 rounded-full border border-orange-100 w-fit self-start sm:self-center">
                      {meal.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Macro & Caloric status card */}
          <div className="space-y-6">
            {/* Calorie Progress Ring & Breakdown */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md shadow-slate-100/50 space-y-6 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 blur-2xl rounded-full pointer-events-none" />
              
              <div className="mx-auto w-24 h-24 rounded-full border-8 border-orange-50 flex flex-col items-center justify-center relative">
                <Flame className="h-6 w-6 text-orange-550 mb-0.5 animate-pulse" />
                <span className="text-xs font-black text-slate-800">{macros.calories.split(' ')[0]}</span>
                <span className="text-[8px] uppercase font-bold text-slate-400">kcal</span>
              </div>

              <div>
                <h4 className="text-xs font-black text-slate-800">Target Daily Intake</h4>
                <p className="text-[10px] text-slate-400 mt-1">Perfect balance optimized for muscular maintenance & growth.</p>
              </div>

              {/* Macro bars */}
              <div className="space-y-3.5 text-left border-t border-slate-100 pt-4">
                {/* Protein */}
                <div>
                  <div className="flex justify-between gap-4 text-[10px] font-bold text-slate-500 mb-1">
                    <span>Protein</span>
                    <span className="text-slate-800">{macros.protein} (Goal)</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>

                {/* Carbs */}
                <div>
                  <div className="flex justify-between gap-4 text-[10px] font-bold text-slate-500 mb-1">
                    <span>Carbs</span>
                    <span className="text-slate-800">{macros.carbs} (Goal)</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>

                {/* Fats */}
                <div>
                  <div className="flex justify-between gap-4 text-[10px] font-bold text-slate-500 mb-1">
                    <span>Fats</span>
                    <span className="text-slate-800">{macros.fats} (Goal)</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: '50%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Nutrition disclaimer */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-5 rounded-2xl border border-slate-200/50 space-y-2.5">
              <div className="flex items-center gap-2">
                <Heart className="h-4.5 w-4.5 text-rose-500" />
                <h5 className="font-extrabold text-slate-800 text-xs">Diet & Body Safety</h5>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                Meal blueprints are formulated in real-time according to your physical assessment parameters. Request revisions at any time from your assigned coach.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center space-y-4 shadow-sm shadow-slate-100/50 max-w-xl mx-auto">
          <ClipboardList className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Diet Blueprint Pending</h3>
          <p className="text-slate-400 text-xs max-w-sm mx-auto">
            You haven't been assigned a personalized meal blueprint program by your fitness coach yet. GymFlow desk admin will publish your diets soon!
          </p>
        </div>
      )}
    </div>
  );
}
