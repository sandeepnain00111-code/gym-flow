'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../../components/layout/Navbar';
import Footer from '../../../../components/layout/Footer';
import api from '../../../../lib/api';
import Spinner from '../../../../components/ui/Spinner';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Dumbbell, Calendar, Clock, User, Phone, Mail, FileText } from 'lucide-react';

export default function BookFreeDemo() {
  const { slug } = useParams();
  const router = useRouter();
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchGym = async () => {
      try {
        const res = await api.get(`/public/gym/${slug}`);
        if (res.data.success) {
          setGym(res.data.gym);
        }
      } catch (err) {
        toast.error('Gym details not found');
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchGym();
  }, [slug]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await api.post(`/public/gym/${slug}/demo-booking`, data);
      if (res.data.success) {
        toast.success(res.data.message || 'Demo class requested successfully!');
        router.push(`/gym/${slug}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request demo slot');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-transparent min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-transparent min-h-screen flex flex-col relative overflow-hidden">
      <Navbar />

      <main className="flex-1 max-w-lg mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full relative z-10">
        <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl space-y-6">
          {/* Header info */}
          <div className="text-center">
            <Dumbbell className="h-10 w-10 text-emerald-500 mx-auto mb-3 animate-pulse" />
            <h1 className="text-2xl font-extrabold text-white">Book Free Demo Session</h1>
            <p className="text-gray-400 text-xs mt-1">
              at <span className="text-emerald-400 font-bold">{gym?.name}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Enter full name"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full pl-11 pr-4 py-3 text-xs glass-input rounded-xl"
                />
              </div>
              {errors.name && <p className="text-red-400 text-[10px] mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-500" />
                <input
                  type="email"
                  placeholder="Enter email address"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                  })}
                  className="w-full pl-11 pr-4 py-3 text-xs glass-input rounded-xl"
                />
              </div>
              {errors.email && <p className="text-red-400 text-[10px] mt-1">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-500" />
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  {...register('phone', { required: 'Phone number is required' })}
                  className="w-full pl-11 pr-4 py-3 text-xs glass-input rounded-xl"
                />
              </div>
              {errors.phone && <p className="text-red-400 text-[10px] mt-1">{errors.phone.message}</p>}
            </div>

            {/* Preferred Date */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Preferred Date</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-500" />
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  {...register('date', { required: 'Preferred date is required' })}
                  className="w-full pl-11 pr-4 py-3 text-xs glass-input rounded-xl text-gray-300"
                />
              </div>
              {errors.date && <p className="text-red-400 text-[10px] mt-1">{errors.date.message}</p>}
            </div>

            {/* Time slot */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Preferred Time Slot</label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-500" />
                <select
                  {...register('timeSlot', { required: 'Preferred time slot is required' })}
                  className="w-full pl-11 pr-4 py-3 text-xs glass-input rounded-xl text-gray-300 bg-[#111827]"
                >
                  <option value="Morning (06:00 AM - 10:00 AM)">Morning (06:00 AM - 10:00 AM)</option>
                  <option value="Noon (12:00 PM - 03:00 PM)">Noon (12:00 PM - 03:00 PM)</option>
                  <option value="Evening (05:00 PM - 09:00 PM)">Evening (05:00 PM - 09:00 PM)</option>
                </select>
              </div>
              {errors.timeSlot && <p className="text-red-400 text-[10px] mt-1">{errors.timeSlot.message}</p>}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Any health notes / targets (Optional)</label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-500" />
                <textarea
                  rows="2"
                  placeholder="e.g. Weight loss, heart condition..."
                  {...register('notes')}
                  className="w-full pl-11 pr-4 py-3 text-xs glass-input rounded-xl resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition shadow-lg shadow-emerald-500/10"
            >
              {submitting ? <Spinner size="sm" /> : <span>Confirm Free Demo Class</span>}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
