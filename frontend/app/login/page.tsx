'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Spinner from '../../components/ui/Spinner';
import { Dumbbell, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, logout, isAuthenticated, user, loading, error, setError } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [redirect, setRedirect] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRedirect(params.get('redirect') || '');
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<any>();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'member' && !redirect.startsWith('/gym/') && !localStorage.getItem('isDevMemberBypass')) {
        logout();
        toast.error('Access Denied: Gym Members can only log in after scanning a gym\'s QR code.');
        return;
      }
      if (redirect) {
        router.push(redirect);
      } else if (user.role === 'member') {
        router.push('/member/dashboard');
      } else if (user.role === 'super_admin') {
        router.push('/admin/dashboard');
      } else if (user.role === 'gym_owner') {
        router.push('/owner/dashboard');
      }
    }
  }, [isAuthenticated, user, router, redirect, logout]);

  const onSubmit = async (data) => {
    try {
      const loggedUser = await login(data.email, data.password);
      if (loggedUser.role === 'member' && !redirect.startsWith('/gym/') && !localStorage.getItem('isDevMemberBypass')) {
        await logout();
        toast.error('Access Denied: Gym Members can only log in after scanning a gym\'s QR code.');
        return;
      }
      toast.success(`Welcome back, ${loggedUser.name}! 💪`);
    } catch (err) {
      toast.error(err.message || 'Login failed, please check your credentials');
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Column - Form */}
      <div 
        className="w-full lg:w-1/2 flex flex-col px-6 sm:px-12 md:px-20 lg:px-24 xl:px-32 py-8 lg:py-10 overflow-y-auto min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.3)), url('/bg-white-mesh.png')" }}
      >
        {/* Back button */}
        <div className="mb-8">
          <Link href="/" className="text-slate-500 hover:text-slate-800 text-sm font-semibold flex items-center gap-2 transition">
            <span>&larr;</span> Back to Home
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-[420px] w-full mx-auto pb-8">
          {/* Brand */}
          <div className="flex items-center gap-2 mb-8">
            <Dumbbell className="w-6 h-6 text-[#047857]" />
            <span className="text-xl font-bold text-slate-900 tracking-tight">GymFlow</span>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Welcome back</h1>
          <p className="text-slate-500 text-sm mb-4">Sign in to manage your gym's pulse and performance.</p>

          <div className="flex flex-wrap gap-2.5 mb-6">
            <button 
              type="button" 
              onClick={() => {
                localStorage.setItem('accessToken', 'dev-bypass-token');
                localStorage.setItem('user', JSON.stringify({ name: 'Dev Admin', role: 'super_admin', email: 'admin@gymflow.com' }));
                window.location.href = '/admin/dashboard';
              }}
              className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold py-2.5 px-3 rounded-xl hover:bg-red-100 transition flex-1 text-center"
            >
              🚧 DEV: Admin
            </button>
            <button 
              type="button" 
              onClick={() => {
                localStorage.setItem('accessToken', 'dev-bypass-token');
                localStorage.setItem('user', JSON.stringify({ name: 'Dev Gym Owner', role: 'gym_owner', email: 'owner@gymflow.com' }));
                window.location.href = '/owner/dashboard';
              }}
              className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold py-2.5 px-3 rounded-xl hover:bg-emerald-100 transition flex-1 text-center"
            >
              🚧 DEV: Owner
            </button>
            <button 
              type="button" 
              onClick={() => {
                localStorage.setItem('accessToken', 'dev-bypass-token');
                localStorage.setItem('isDevMemberBypass', 'true');
                localStorage.setItem('user', JSON.stringify({ name: 'Dev Member', role: 'member', email: 'member@gymflow.com' }));
                window.location.href = '/member/dashboard';
              }}
              className="bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold py-2.5 px-3 rounded-xl hover:bg-blue-100 transition flex-1 text-center"
            >
              🚧 DEV: Member
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-200 text-red-600 text-sm rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Address */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  placeholder="owner@gymflow.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' }
                  })}
                  className="w-full pl-12 pr-4 py-3.5 text-sm bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] transition text-slate-800 placeholder-slate-400"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-4">{String(errors.email.message)}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required' })}
                  className="w-full pl-12 pr-12 py-3.5 text-sm bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] transition text-slate-800 placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-4">{String(errors.password.message)}</p>}
            </div>

            {/* Options */}
            <div className="flex items-center justify-between gap-4 pt-1 pb-4">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="w-4 h-4 rounded-full border-2 border-slate-300 group-hover:border-slate-400 transition"></div>
                <span className="text-sm text-slate-500 group-hover:text-slate-700 transition">Remember Me</span>
              </label>
              <Link href="/forgot-password" className="text-sm font-bold text-[#047857] hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-3.5 rounded-full text-sm flex items-center justify-center space-x-2 transition shadow-lg shadow-[#10b981]/20"
            >
              {loading ? <Spinner size="sm" /> : (
                <>
                  <span>Sign In</span>
                  <span>&rarr;</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center pt-8 border-t border-slate-200 mt-8">
            <p className="text-sm text-slate-500">
              Don't have an account?{' '}
              <Link href="/register?role=gym_owner" className="font-bold text-[#047857] hover:underline">
                Start your free trial
              </Link>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="w-full text-center mt-auto pb-4 pt-8">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            © 2024 GYMFLOW TECH-FORWARD ATHLETICISM
          </p>
        </div>
      </div>

      {/* Right Column - Image & Quote */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/bg-hero-new.png')" }}
        />
        {/* Dark subtle overlay */}
        <div className="absolute inset-0 bg-slate-900/30"></div>
        
        {/* Glassmorphism Quote Card */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[85%] max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]">
          <div className="text-[#10b981] text-5xl font-serif mb-2 leading-none">"</div>
          <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
            Unlock your gym's true potential.
          </h2>
          <p className="text-slate-200 text-sm mb-8 leading-relaxed opacity-90">
            Join over 2,000 gym owners who have streamlined their operations and tripled member engagement with our tech-forward platform.
          </p>
          
          <div className="flex items-center gap-4 pt-4 border-t border-white/10">
            <div className="flex -space-x-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#2a3641] bg-slate-500 flex items-center justify-center overflow-hidden">
                 <img src="https://i.pravatar.cc/100?img=33" alt="user" className="w-full h-full object-cover" />
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-[#2a3641] bg-slate-500 flex items-center justify-center overflow-hidden">
                <img src="https://i.pravatar.cc/100?img=12" alt="user" className="w-full h-full object-cover" />
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-[#2a3641] bg-slate-500 flex items-center justify-center overflow-hidden">
                <img src="https://i.pravatar.cc/100?img=47" alt="user" className="w-full h-full object-cover" />
              </div>
            </div>
            <p className="text-white text-xs font-bold">4.9/5 Rating by Club Owners</p>
          </div>
        </div>
      </div>
    </div>
  );
}
