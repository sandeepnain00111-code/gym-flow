'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Spinner from '../../components/ui/Spinner';
import { Dumbbell, User, Mail, Phone, Lock, Eye, EyeOff, Building, CheckCircle } from 'lucide-react';
import api from '../../lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const { register: signup, loading, error, setError } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [ownerPendingModal, setOwnerPendingModal] = useState(false);

  const [redirect, setRedirect] = useState('');
  const [isFromGymQR, setIsFromGymQR] = useState(false);
  const [role, setRole] = useState('gym_owner');

  // Member registration specific states
  const [gyms, setGyms] = useState<any[]>([]);
  const [selectedGymSlug, setSelectedGymSlug] = useState('');
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [submittingMember, setSubmittingMember] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<any>();

  // Reset form errors and inputs when the active tab/role changes
  useEffect(() => {
    reset();
  }, [role, reset]);

  // Initial load
  useEffect(() => {
    setError(null);
    const params = new URLSearchParams(window.location.search);
    const redir = params.get('redirect') || '';
    setRedirect(redir);
    const qr = redir.startsWith('/gym/');
    setIsFromGymQR(qr);

    const roleParam = params.get('role');
    if (roleParam === 'member' || qr) {
      setRole('member');
    } else {
      setRole('gym_owner');
    }

    // Fetch active gyms for membership registrations
    const fetchGyms = async () => {
      try {
        const res = await api.get('/public/gyms');
        if (res.data.success) {
          setGyms(res.data.gyms);
          if (qr) {
            const slugPart = redir.split('/gym/')[1]?.split('/')[0] || '';
            if (slugPart) {
              setSelectedGymSlug(slugPart);
              return;
            }
          }
          if (res.data.gyms.length > 0) {
            setSelectedGymSlug(res.data.gyms[0].slug);
          }
        }
      } catch (err) {
        console.error('Failed to fetch gyms:', err);
      }
    };
    fetchGyms();
  }, [setError]);

  // Fetch plans of the selected gym
  useEffect(() => {
    const fetchPlans = async () => {
      if (!selectedGymSlug) return;
      try {
        const res = await api.get(`/public/gym/${selectedGymSlug}/plans`);
        if (res.data.success) {
          setPlans(res.data.plans);
          if (res.data.plans.length > 0) {
            setSelectedPlanId(res.data.plans[0]._id);
          } else {
            setSelectedPlanId('');
          }
        }
      } catch (err) {
        console.error('Failed to fetch plans:', err);
      }
    };
    fetchPlans();
  }, [selectedGymSlug]);

  const onSubmit = async (data) => {
    try {
      if (role === 'gym_owner') {
        const payload = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
          role: 'gym_owner'
        };

        await signup(payload);
        setOwnerPendingModal(true);
      } else {
        setSubmittingMember(true);
        // 1. Sign up the user account
        const selectedGym = gyms.find(g => g.slug === selectedGymSlug);
        const signupPayload = {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone,
          password: data.password,
          role: 'member',
          gymId: selectedGym?._id || null,
          purpose: data.purpose || '',
          age: data.age ? Number(data.age) : null,
          weight: data.weight ? Number(data.weight) : null
        };

        const user = await signup(signupPayload);
        if (!user) {
          throw new Error('Registration failed, please check details.');
        }

        // 2. Submit join request for selected plan & duration
        if (selectedPlanId) {
          const selectedPlan = plans.find((p) => p._id === selectedPlanId);
          if (selectedPlan) {
            const postData = {
              planId: selectedPlanId,
              paymentMode: 'cash', // default payment mode for general registrations
              transactionId: '',
              screenshot: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=400&auto=format&fit=crop',
              amount: selectedPlan.price
            };
            await api.post(`/member/join/${selectedGymSlug}`, postData);
          }
        }

        toast.success('Registration successful! Welcome to GymFlow! 💪');
        if (redirect) {
          router.push(redirect);
        } else {
          router.push('/member/dashboard');
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Registration failed, please try again');
    } finally {
      setSubmittingMember(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full relative">
      {/* Left Column - Form */}
      <div 
        className="w-full lg:w-[45%] flex flex-col px-6 sm:px-12 md:px-20 py-8 lg:py-10 overflow-y-auto min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.3)), url('/bg-white-mesh.png')" }}
      >
        
        {/* Back button */}
        <div className="mb-8">
          <Link href="/" className="text-slate-500 hover:text-slate-800 text-xs font-bold tracking-widest flex items-center gap-2 transition uppercase">
            <span>&larr;</span> BACK TO HOME
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-[420px] w-full mx-auto pb-8">
          {/* Brand */}
          <div className="flex items-center gap-2 mb-6">
            <Dumbbell className="w-7 h-7 text-slate-900" />
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">GymFlow</span>
          </div>

          {/* Role Tab Selector (Only show if not directly coming from specific Gym QR check-in) */}
          {!isFromGymQR && (
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100/80 border border-slate-200/50 rounded-full mb-6 max-w-[320px]">
              <button
                type="button"
                onClick={() => setRole('gym_owner')}
                className={`py-2 px-4 text-xs font-extrabold rounded-full transition-all duration-300 ${
                  role === 'gym_owner'
                    ? 'bg-[#047857] text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Gym Owner
              </button>
              <button
                type="button"
                onClick={() => setRole('member')}
                className={`py-2 px-4 text-xs font-extrabold rounded-full transition-all duration-300 ${
                  role === 'member'
                    ? 'bg-[#047857] text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Gym Member
              </button>
            </div>
          )}

          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
            {role === 'member' ? 'Member Registration' : 'Create Owner Account'}
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            {role === 'member' ? 'Join a gym and access active fitness plans' : 'Start your digital gym transformation today'}
          </p>

          {/* Registration Notice */}
          {role === 'member' ? (
            <div className="flex gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl mb-6">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-600 leading-relaxed">
                <strong>Gym Member Portal - Note:</strong> You are registering to join your selected gym. Select a plan to request immediate access.
              </p>
            </div>
          ) : (
            <div className="flex gap-3 p-4 bg-[#eff6ff] border border-blue-100 rounded-2xl mb-6">
              <div className="w-5 h-5 rounded-full border border-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs font-bold font-serif">i</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                <strong>Gym Owner Portal - Note:</strong> Owner registrations require approval from the Super Admin. Your portal access activates immediately upon verification.
              </p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-100 border border-red-200 text-red-600 text-sm rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {role === 'gym_owner' ? (
              /* OWNER FULL NAME */
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-widest">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    {...register('name', { required: role === 'gym_owner' ? 'Name is required' : false })}
                    className="w-full pl-12 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] transition text-slate-800 placeholder-slate-400"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1.5 ml-4">{String(errors.name.message)}</p>}
              </div>
            ) : (
              /* MEMBER FIELDS */
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-widest">First Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="John"
                        {...register('firstName', { required: role === 'member' ? 'First name is required' : false })}
                        className="w-full pl-12 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] transition text-slate-800 placeholder-slate-400"
                      />
                    </div>
                    {errors.firstName && <p className="text-red-500 text-xs mt-1.5 ml-4">{String(errors.firstName.message)}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-widest">Last Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Doe"
                        {...register('lastName', { required: role === 'member' ? 'Last name is required' : false })}
                        className="w-full pl-12 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] transition text-slate-800 placeholder-slate-400"
                      />
                    </div>
                    {errors.lastName && <p className="text-red-500 text-xs mt-1.5 ml-4">{String(errors.lastName.message)}</p>}
                  </div>
                </div>

                {/* Gym Selection */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-widest">Select Gym</label>
                  <div className="relative">
                    <Building className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <select
                      value={selectedGymSlug}
                      onChange={(e) => setSelectedGymSlug(e.target.value)}
                      className="w-full pl-12 pr-10 py-3 text-sm bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] transition text-slate-800 appearance-none outline-none cursor-pointer"
                    >
                      <option value="">Select a Gym...</option>
                      {gyms.map((g: any) => (
                        <option key={g.slug} value={g.slug}>
                          {g.name} ({g.city})
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-4 pointer-events-none text-slate-450">
                      <span className="text-[10px]">▼</span>
                    </div>
                  </div>
                </div>

                {/* Plan Selection (Duration) */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-widest">Duration (Select Plan)</label>
                  <div className="relative">
                    <Dumbbell className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <select
                      value={selectedPlanId}
                      onChange={(e) => setSelectedPlanId(e.target.value)}
                      className="w-full pl-12 pr-10 py-3 text-sm bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] transition text-slate-800 appearance-none outline-none cursor-pointer"
                    >
                      <option value="">Select a Duration...</option>
                      {plans.map((p: any) => (
                        <option key={p._id} value={p._id}>
                          {p.name} ({p.durationInDays} Days) - ₹{p.price}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-4 pointer-events-none text-slate-450">
                      <span className="text-[10px]">▼</span>
                    </div>
                  </div>
                </div>

                {/* Purpose Selector */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-widest">Fitness Goal (Purpose)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 flex items-center justify-center font-bold text-xs">🎯</span>
                    <select
                      {...register('purpose', { required: role === 'member' ? 'Goal is required' : false })}
                      className="w-full pl-12 pr-10 py-3 text-sm bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] transition text-slate-800 appearance-none outline-none cursor-pointer"
                    >
                      <option value="">Choose a Goal...</option>
                      <option value="weight_gain">Weight Gain</option>
                      <option value="weight_loss">Weight Loss</option>
                      <option value="fitness">General Fitness</option>
                    </select>
                    <div className="absolute right-4 top-4 pointer-events-none text-slate-450">
                      <span className="text-[10px]">▼</span>
                    </div>
                  </div>
                  {errors.purpose && <p className="text-red-500 text-xs mt-1.5 ml-4">{String(errors.purpose.message)}</p>}
                </div>
              </>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  placeholder="john@gymflow.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                  })}
                  className="w-full pl-12 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] transition text-slate-800 placeholder-slate-400"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-4">{String(errors.email.message)}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-widest">Phone Number (10-digit Indian Mobile)</label>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="tel"
                  placeholder="9876543210"
                  {...register('phone', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^(?:\+91|91|0)?[\s\-]?[6-9](?:[\s\-]?\d){9}$/,
                      message: 'Please enter a valid 10-digit Indian mobile number'
                    }
                  })}
                  className="w-full pl-12 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] transition text-slate-800 placeholder-slate-400"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1.5 ml-4">{String(errors.phone.message)}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                  className="w-full pl-12 pr-12 py-3 text-sm bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] transition text-slate-800 placeholder-slate-400"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || submittingMember}
              className="w-full bg-[#00e676] hover:bg-[#00c853] text-slate-900 font-bold py-3.5 rounded-full text-sm flex items-center justify-center space-x-2 transition shadow-lg shadow-[#00e676]/20 mt-6"
            >
              {loading || submittingMember ? <Spinner size="sm" /> : <span>{role === 'gym_owner' ? 'Create SaaS Account' : 'Create Account & Join Gym'}</span>}
            </button>
          </form>

          <div className="text-center pt-6 mt-6">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-[#047857] hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="w-full text-center mt-auto pb-4 pt-8">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            © 2024 GymFlow. Tech-Forward Athleticism for Gym Owners.
          </p>
        </div>
      </div>

      {/* Right Column - Image & Quote */}
      <div className="hidden lg:flex w-[55%] bg-slate-900 relative overflow-hidden items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-70 mix-blend-luminosity grayscale"
          style={{ backgroundImage: "url('/bg-hero-new.png')" }}
        />
        <div className="absolute inset-0 bg-slate-800/40"></div>
        
        {/* Glassmorphism Quote Card */}
        <div className="relative z-10 w-[80%] max-w-lg bg-white/10 backdrop-blur-2xl border border-white/20 p-12 rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]">
          <div className="inline-flex items-center gap-1 bg-[#4ade80]/20 text-[#4ade80] px-3 py-1 rounded-full text-[10px] font-bold tracking-widest mb-6">
             ★★★★★ 5.0 RATING
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Join 2,000+<br/>elite gym<br/>owners
          </h2>
          <p className="text-slate-200 text-sm mb-10 leading-relaxed opacity-90">
            Scale your fitness business with enterprise-grade tools. From member management to AI-driven performance analytics, GymFlow is the engine of high-performance growth.
          </p>
          
          <div className="flex items-center gap-12">
            <div>
              <p className="text-[#4ade80] text-2xl font-bold mb-1">98%</p>
              <p className="text-[10px] text-white/60 font-bold tracking-widest uppercase">Efficiency Increase</p>
            </div>
            <div>
              <p className="text-[#4ade80] text-2xl font-bold mb-1">24/7</p>
              <p className="text-[10px] text-white/60 font-bold tracking-widest uppercase">Priority Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Owner Pending Review Modal */}
      {ownerPendingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl text-center space-y-6 animate-scale-in">
            <CheckCircle className="h-16 w-16 text-[#10b981] mx-auto" />
            <div>
              <h3 className="text-xl font-bold text-slate-900">Registration Successful!</h3>
              <p className="text-slate-500 text-xs mt-3 leading-relaxed">
                Thank you! Your Gym Owner registration has been logged. Our Super Admin team is reviewing your application details. You will receive access credentials upon approval.
              </p>
            </div>
            <button
              onClick={() => {
                setOwnerPendingModal(false);
                router.push('/login');
              }}
              className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-3.5 rounded-full text-sm transition shadow-lg shadow-[#10b981]/20"
            >
              Back to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
