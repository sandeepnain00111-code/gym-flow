'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import Spinner from '../../../components/ui/Spinner';
import { toast } from 'react-hot-toast';
import { Utensils, PlusCircle, Trash, Save, UserCheck, Calendar } from 'lucide-react';

export default function DietPlansCreator() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [selectedMember, setSelectedMember] = useState('');
  const [dayName, setDayName] = useState('monday');
  const [title, setTitle] = useState('');
  const [meals, setMeals] = useState([{ name: 'Breakfast', time: '08:00 AM', items: '' }]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get('/owner/members');
        if (res.data.success) {
          setMembers(res.data.members);
        }
      } catch (err) {
        toast.error('Failed to load gym members list');
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const handleAddMealRow = () => {
    setMeals([...meals, { name: '', time: '', items: '' }]);
  };

  const handleRemoveMealRow = (index) => {
    if (meals.length === 1) return;
    setMeals(meals.filter((_, idx) => idx !== index));
  };

  const handleMealChange = (index, field, value) => {
    const updated = meals.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setMeals(updated);
  };

  const handleSubmitDiet = async (e) => {
    e.preventDefault();
    if (!selectedMember) {
      toast.error('Please select a target gym member');
      return;
    }
    if (!title.trim()) {
      toast.error('Please add diet target profile title');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        memberEmail: selectedMember,
        dayName,
        title,
        meals: meals.filter((meal) => meal.items.trim() !== '')
      };

      const res = await api.post('/owner/diet-plans', payload);
      if (res.data.success) {
        toast.success('Diet blueprint assigned successfully! 🍎');
        setTitle('');
        setMeals([{ name: 'Breakfast', time: '08:00 AM', items: '' }]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register diet blueprint');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Diet Blueprint Creator</h1>
        <p className="text-gray-400 text-xs mt-1">Design daily nutrition profiles and schedule meals logs for gym members.</p>
      </div>

      <form onSubmit={handleSubmitDiet} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6">
        <h2 className="text-base font-extrabold text-white flex items-center space-x-2">
          <Utensils className="h-5 w-5 text-orange-450" />
          <span>Nutrition Profile Builder</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Target Member Select */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Gym Member</label>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="w-full px-4 py-3 text-xs glass-input rounded-xl bg-[#111827] text-gray-300"
            >
              <option value="">Select target member...</option>
              {members.map((m) => (
                <option key={m._id} value={m.memberId?.email}>
                  {m.memberId?.name} ({m.memberId?.email})
                </option>
              ))}
            </select>
          </div>

          {/* Target Day */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Schedule Day</label>
            <select
              value={dayName}
              onChange={(e) => setDayName(e.target.value)}
              className="w-full px-4 py-3 text-xs glass-input rounded-xl bg-[#111827] text-gray-300"
            >
              <option value="monday">Monday</option>
              <option value="tuesday">Tuesday</option>
              <option value="wednesday">Wednesday</option>
              <option value="thursday">Thursday</option>
              <option value="friday">Friday</option>
              <option value="saturday">Saturday</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Diet Title Description</label>
            <input
              type="text"
              placeholder="e.g. Lean Bulk Calorie Split"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 text-xs glass-input rounded-xl"
            />
          </div>
        </div>

        {/* Meals dynamic list */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex justify-between gap-4 items-center">
            <h3 className="text-xs font-bold text-gray-450 uppercase tracking-wider">Meal Schedule</h3>
            <button
              type="button"
              onClick={handleAddMealRow}
              className="text-orange-450 hover:text-orange-350 text-xs flex items-center space-x-1 font-bold"
            >
              <PlusCircle className="h-4.5 w-4.5" />
              <span>Add Meal Row</span>
            </button>
          </div>

          <div className="space-y-3">
            {meals.map((item, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white/3 p-3.5 rounded-2xl border border-white/5 items-end animate-fade-in">
                {/* Meal name */}
                <div className="sm:col-span-3">
                  <label className="block text-[9px] font-bold text-gray-450 mb-1 uppercase">Meal Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Pre-workout breakfast"
                    value={item.name}
                    onChange={(e) => handleMealChange(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 text-xs glass-input rounded-xl"
                  />
                </div>

                {/* Time */}
                <div className="sm:col-span-2">
                  <label className="block text-[9px] font-bold text-gray-450 mb-1 uppercase">Timing Time</label>
                  <input
                    type="text"
                    placeholder="08:30 AM"
                    value={item.time}
                    onChange={(e) => handleMealChange(index, 'time', e.target.value)}
                    className="w-full px-3 py-2 text-xs glass-input rounded-xl"
                  />
                </div>

                {/* Items */}
                <div className="sm:col-span-6">
                  <label className="block text-[9px] font-bold text-gray-450 mb-1 uppercase">Meal details / Macros</label>
                  <input
                    type="text"
                    placeholder="4 boiled egg whites + 50g oatmeal + 1 banana"
                    value={item.items}
                    onChange={(e) => handleMealChange(index, 'items', e.target.value)}
                    className="w-full px-3 py-2 text-xs glass-input rounded-xl"
                  />
                </div>

                {/* Delete button */}
                <div className="sm:col-span-1 text-right sm:text-center pb-0.5">
                  <button
                    type="button"
                    onClick={() => handleRemoveMealRow(index)}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 p-2 rounded-xl transition"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-white/5">
          <button
            type="submit"
            disabled={submitting}
            className="bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold py-3.5 px-8 rounded-xl text-xs flex items-center space-x-1.5 transition shadow-lg shadow-emerald-500/10"
          >
            {submitting ? <Spinner size="sm" /> : (
              <>
                <Save className="h-4.5 w-4.5" />
                <span>Save & Assign Diet Profile</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
