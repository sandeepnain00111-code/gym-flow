'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import Spinner from '../../../components/ui/Spinner';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../../store/authStore';
import { User, Phone, Lock, Save, Sparkles, Key, Mail, ShieldCheck } from 'lucide-react';

export default function MemberProfileSettings() {
  const { user } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<any>();

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('phone', user.phone || '');
    }
  }, [user, setValue]);

  const onSubmitProfile = async (data) => {
    setSubmitting(true);
    try {
      const res = await api.put('/auth/profile-update', data);
      if (res.data.success) {
        toast.success('Profile details updated successfully! 🎉');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile details');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <User className="h-7 w-7 text-emerald-600" />
          <span>My Profile Settings</span>
        </h1>
        <p className="text-slate-500 text-xs mt-1">Configure your personal contact numbers and update account access credentials.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmitProfile)} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 space-y-6 shadow-md shadow-slate-100/50">
        <h2 className="text-base font-extrabold text-slate-800 flex items-center space-x-2 border-b border-slate-100 pb-3">
          <ShieldCheck className="h-5 w-5 text-emerald-650" />
          <span>Personal Information Details</span>
        </h2>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-[10px] font-bold text-slate-450 mb-1.5 uppercase tracking-wide">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Name"
                {...register('name', { required: 'Name is required' })}
                className="w-full pl-11 pr-4 py-3 text-xs bg-slate-50 border border-slate-200/50 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all font-semibold"
              />
            </div>
            {errors.name && <p className="text-red-500 text-[10px] mt-1">{String(errors.name.message)}</p>}
          </div>

          {/* Email (Readonly) */}
          <div>
            <label className="block text-[10px] font-bold text-slate-450 mb-1.5 uppercase tracking-wide">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className="w-full pl-11 pr-4 py-3 text-xs bg-slate-100 border border-slate-200/30 rounded-xl text-slate-500 font-semibold cursor-not-allowed"
              />
            </div>
            <p className="text-[9px] text-slate-400 mt-1">*Account authentication emails are locked and cannot be changed.</p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[10px] font-bold text-slate-455 mb-1.5 uppercase tracking-wide">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="tel"
                placeholder="Phone number"
                {...register('phone', { required: 'Phone number is required' })}
                className="w-full pl-11 pr-4 py-3 text-xs bg-slate-50 border border-slate-200/50 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all font-semibold"
              />
            </div>
            {errors.phone && <p className="text-red-500 text-[10px] mt-1">{String(errors.phone.message)}</p>}
          </div>

          {/* Passwords */}
          <div className="border-t border-slate-100 pt-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Key className="h-4.5 w-4.5 text-emerald-600" />
              <span>Change Password Credentials</span>
            </h3>
            <p className="text-[10px] text-slate-450 font-medium">Leave password boxes blank if you do not wish to modify access credentials.</p>

            <div>
              <label className="block text-[10px] font-bold text-slate-450 mb-1.5 uppercase tracking-wide">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register('currentPassword')}
                  className="w-full pl-11 pr-4 py-3 text-xs bg-slate-50 border border-slate-200/50 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-450 mb-1.5 uppercase tracking-wide">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register('newPassword')}
                  className="w-full pl-11 pr-4 py-3 text-xs bg-slate-50 border border-slate-200/50 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all font-semibold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-5 border-t border-slate-100">
          <button
            type="submit"
            disabled={submitting}
            className="bg-emerald-600 hover:bg-emerald-550 text-white font-extrabold py-3.5 px-8 rounded-xl text-xs flex items-center space-x-1.5 transition shadow-md shadow-emerald-600/10 hover:-translate-y-0.5"
          >
            {submitting ? <Spinner size="sm" /> : (
              <>
                <Save className="h-4.5 w-4.5" />
                <span>Save Profile Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
