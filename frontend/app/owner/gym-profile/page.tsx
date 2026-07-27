'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import Spinner from '../../../components/ui/Spinner';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Dumbbell, Save, MapPin, Clock, Phone, Mail, Globe } from 'lucide-react';

export default function GymProfileManagement() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<any>();

  useEffect(() => {
    const fetchGymProfile = async () => {
      try {
        const res = await api.get('/owner/gym');
        if (res.data.success && res.data.gym) {
          const g = res.data.gym;
          setValue('name', g.name);
          setValue('description', g.description || '');
          setValue('address', g.address);
          setValue('city', g.city);
          setValue('state', g.state);
          setValue('phone', g.phone);
          setValue('email', g.email);
          setValue('openingTime', g.openingTime || '06:00 AM');
          setValue('closingTime', g.closingTime || '10:00 PM');
          setValue('facilities', g.facilities ? g.facilities.join(', ') : '');
          setValue('facebook', g.socialLinks?.facebook || '');
          setValue('instagram', g.socialLinks?.instagram || '');
          setValue('twitter', g.socialLinks?.twitter || '');
          setValue('website', g.socialLinks?.website || '');
        }
      } catch (err) {
        console.error('Failed to load gym profile:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGymProfile();
  }, [setValue]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await api.post('/owner/gym', data);
      if (res.data.success) {
        toast.success('Gym profile saved successfully! 🎉');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update gym details');
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

  const inputClass = "w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] rounded-xl transition duration-200 outline-none";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Gym Profile Settings</h1>
        <p className="text-slate-500 text-xs mt-1">Configure your fitness center identity, operational schedules, and premium facilities.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: General Profile Specs */}
        <div className="lg:col-span-2 bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Dumbbell className="h-4.5 w-4.5 text-[#10b981]" />
            <span>Basic Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Gym Name */}
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-wider">Gym Name</label>
              <input
                type="text"
                placeholder="e.g. Iron Forge Fitness Center"
                {...register('name', { required: 'Gym name is required' })}
                className={inputClass}
              />
              {errors.name && <p className="text-red-500 text-[10px] mt-1">{String(errors.name.message)}</p>}
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-wider">Gym Description</label>
              <textarea
                rows={4}
                placeholder="Brief summary of gym focus, machinery, supplement desks..."
                {...register('description')}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-wider">Gym Email Address</label>
              <input
                type="email"
                placeholder="gyminfo@gmail.com"
                {...register('email', { required: 'Gym email is required' })}
                className={inputClass}
              />
              {errors.email && <p className="text-red-500 text-[10px] mt-1">{String(errors.email.message)}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-wider">Gym Contact Phone</label>
              <input
                type="text"
                placeholder="e.g. 040-2345678"
                {...register('phone', { required: 'Gym phone is required' })}
                className={inputClass}
              />
              {errors.phone && <p className="text-red-500 text-[10px] mt-1">{String(errors.phone.message)}</p>}
            </div>
          </div>

          <h2 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-3 pt-4 flex items-center gap-2">
            <MapPin className="h-4.5 w-4.5 text-blue-500" />
            <span>Location Coordinates</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Address */}
            <div className="sm:col-span-3">
              <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-wider">Street Address</label>
              <input
                type="text"
                placeholder="Plot 45, Huda Heights, Jubilee Hills"
                {...register('address', { required: 'Address is required' })}
                className={inputClass}
              />
              {errors.address && <p className="text-red-500 text-[10px] mt-1">{String(errors.address.message)}</p>}
            </div>

            {/* City */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-wider">City</label>
              <input
                type="text"
                placeholder="Hyderabad"
                {...register('city', { required: 'City is required' })}
                className={inputClass}
              />
              {errors.city && <p className="text-red-500 text-[10px] mt-1">{String(errors.city.message)}</p>}
            </div>

            {/* State */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-wider">State</label>
              <input
                type="text"
                placeholder="Telangana"
                {...register('state', { required: 'State is required' })}
                className={inputClass}
              />
              {errors.state && <p className="text-red-500 text-[10px] mt-1">{String(errors.state.message)}</p>}
            </div>
          </div>
        </div>

        {/* Right Side: Timings, facilities, socials */}
        <div className="space-y-6">
          {/* Timing details */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-1.5">
              <Clock className="h-4.5 w-4.5 text-amber-500" />
              <span>Operational Timings</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-wider">Opens At</label>
                <input
                  type="text"
                  placeholder="06:00 AM"
                  {...register('openingTime')}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-wider">Closes At</label>
                <input
                  type="text"
                  placeholder="10:00 PM"
                  {...register('closingTime')}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Facilities tags input */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-1.5">
              <Dumbbell className="h-4.5 w-4.5 text-emerald-500" />
              <span>Facilities Specifications</span>
            </h3>
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-wider">Separate by commas (,)</label>
              <input
                type="text"
                placeholder="Steam bath, AC, Supplement Shop..."
                {...register('facilities')}
                className={inputClass}
              />
            </div>
          </div>

          {/* Socials Link handles */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-1.5">
              <Globe className="h-4.5 w-4.5 text-blue-500" />
              <span>Social Connections</span>
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[9px] font-black text-slate-400 mb-1 uppercase tracking-wider">Instagram URL</label>
                <input
                  type="text"
                  placeholder="https://instagram.com/yourgym"
                  {...register('instagram')}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-400 mb-1 uppercase tracking-wider">Facebook URL</label>
                <input
                  type="text"
                  placeholder="https://facebook.com/yourgym"
                  {...register('facebook')}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition shadow-lg shadow-emerald-500/10"
          >
            {submitting ? <Spinner size="sm" /> : (
              <>
                <Save className="h-4.5 w-4.5" />
                <span>Save Profile Parameters</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
