'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../../../components/layout/Navbar';
import Footer from '../../../../components/layout/Footer';
import api from '../../../../lib/api';
import Spinner from '../../../../components/ui/Spinner';
import { useAuthStore } from '../../../../store/authStore';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { CreditCard, Dumbbell, QrCode, FileCheck, CheckCircle, Upload } from 'lucide-react';
import Link from 'next/link';

export default function GymMembershipJoin() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, register: authRegister } = useAuthStore();

  const [gym, setGym] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(searchParams.get('plan') || '');
  const [paymentMode, setPaymentMode] = useState('upi');

  const avatars = [
    { name: 'Athletic Male', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200' },
    { name: 'Athletic Female', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
    { name: 'Coach Male', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
    { name: 'Coach Female', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200' }
  ];
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0].url);

  const { register, handleSubmit, formState: { errors } } = useForm<any>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/public/gym/${slug}`);
        if (res.data.success) {
          setGym(res.data.gym);
          setPlans(res.data.plans);
          if (!selectedPlanId && res.data.plans.length > 0) {
            setSelectedPlanId(res.data.plans[0]._id);
          }
        }
      } catch (err) {
        toast.error('Gym details not found');
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchData();
  }, [slug, selectedPlanId]);

  const onSubmit = async (data) => {
    if (!isAuthenticated) {
      toast.error('Please log in to complete registration');
      return;
    }

    setSubmitting(true);
    try {
      const selectedPlan = plans.find((p) => p._id === selectedPlanId);
      if (!selectedPlan) {
        toast.error('Please select a valid plan');
        setSubmitting(false);
        return;
      }

      const postData = {
        planId: selectedPlanId,
        paymentMode,
        transactionId: data.transactionId || '',
        screenshot: data.screenshot || 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=400&auto=format&fit=crop',
        amount: selectedPlan.price
      };

      const res = await api.post(`/member/join/${slug}`, postData);
      if (res.data.success) {
        toast.success(res.data.message || 'Membership join requested successfully!');
        router.push('/member/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request membership');
    } finally {
      setSubmitting(false);
    }
  };

  const onUnifiedSubmit = async (data) => {
    setSubmitting(true);
    try {
      // 1. Sign up the user account
      const signupPayload = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: 'member',
        gymId: gym?._id,
        avatar: selectedAvatar,
        age: data.age ? Number(data.age) : null,
        weight: data.weight ? Number(data.weight) : null,
        purpose: data.purpose || ''
      };

      const user = await authRegister(signupPayload);
      if (!user) {
        throw new Error('Registration failed, please check details.');
      }

      // 2. Submit join request using new authenticated session
      const selectedPlan = plans.find((p) => p._id === selectedPlanId);
      if (!selectedPlan) {
        toast.error('Please select a valid plan');
        setSubmitting(false);
        return;
      }

      const postData = {
        planId: selectedPlanId,
        paymentMode,
        transactionId: data.transactionId || '',
        screenshot: data.screenshot || 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=400&auto=format&fit=crop',
        amount: selectedPlan.price
      };

      const res = await api.post(`/member/join/${slug}`, postData);
      if (res.data.success) {
        toast.success('Account registered & membership join requested! 🎉');
        router.push('/member/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedPlan = plans.find((p) => p._id === selectedPlanId);

  if (loading) {
    return (
      <div className="bg-transparent min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const lightInputClass = "w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] rounded-xl transition duration-200 outline-none placeholder-slate-400";
  const lightLabelClass = "block text-[10px] font-black text-slate-450 mb-1.5 uppercase tracking-wider";

  if (!isAuthenticated) {
    return (
      <div 
        className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50"
        style={{
          backgroundImage: "linear-gradient(to bottom, rgba(248, 250, 252, 0.88), rgba(241, 245, 249, 0.92)), url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2000&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <Navbar />

        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 w-full relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          {/* Left Column: Register Form */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-slate-100 shadow-xl p-6 sm:p-7 rounded-[28px] space-y-5 text-slate-800">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h1 className="text-lg font-extrabold text-slate-900 leading-none">Join Gym & Create Account</h1>
                  <p className="text-slate-400 text-xs mt-1">
                    Register your member profile at <span className="text-emerald-600 font-bold">{gym?.name}</span>
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onUnifiedSubmit)} className="space-y-4">
                {/* 1. Account Info Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={lightLabelClass}>First Name</label>
                    <input
                      type="text"
                      placeholder="John"
                      {...register('firstName', { required: 'First name is required' })}
                      className={lightInputClass}
                    />
                    {errors.firstName && <p className="text-red-500 text-[10px] mt-1">{String(errors.firstName.message)}</p>}
                  </div>

                  <div>
                    <label className={lightLabelClass}>Last Name</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      {...register('lastName', { required: 'Last name is required' })}
                      className={lightInputClass}
                    />
                    {errors.lastName && <p className="text-red-500 text-[10px] mt-1">{String(errors.lastName.message)}</p>}
                  </div>
                </div>

                {/* Account Info Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={lightLabelClass}>Email Address</label>
                    <input
                      type="email"
                      placeholder="john@gmail.com"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                      })}
                      className={lightInputClass}
                    />
                    {errors.email && <p className="text-red-500 text-[10px] mt-1">{String(errors.email.message)}</p>}
                  </div>

                  <div>
                    <label className={lightLabelClass}>Mobile Number</label>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      {...register('phone', { 
                        required: 'Phone number is required',
                        pattern: {
                          value: /^(?:\+91|91|0)?[\s\-]?[6-9](?:[\s\-]?\d){9}$/,
                          message: 'Invalid number'
                        }
                      })}
                      className={lightInputClass}
                    />
                    {errors.phone && <p className="text-red-500 text-[10px] mt-1">{String(errors.phone.message)}</p>}
                  </div>
                </div>

                {/* Account Info Row 3 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className={lightLabelClass}>Age (Years)</label>
                    <input
                      type="number"
                      placeholder="24"
                      {...register('age', { 
                        required: 'Required',
                        min: { value: 1, message: 'Invalid age' }
                      })}
                      className={lightInputClass}
                    />
                    {errors.age && <p className="text-red-500 text-[10px] mt-1">{String(errors.age.message)}</p>}
                  </div>

                  <div>
                    <label className={lightLabelClass}>Weight (kg)</label>
                    <input
                      type="number"
                      placeholder="70"
                      {...register('weight', { 
                        required: 'Required',
                        min: { value: 1, message: 'Invalid weight' }
                      })}
                      className={lightInputClass}
                    />
                    {errors.weight && <p className="text-red-500 text-[10px] mt-1">{String(errors.weight.message)}</p>}
                  </div>

                  <div>
                    <label className={lightLabelClass}>Fitness Goal</label>
                    <select
                      {...register('purpose', { required: 'Required' })}
                      className={lightInputClass}
                    >
                      <option value="">Goal...</option>
                      <option value="weight_gain">Weight Gain</option>
                      <option value="weight_loss">Weight Loss</option>
                      <option value="fitness">For Fitness</option>
                    </select>
                    {errors.purpose && <p className="text-red-500 text-[10px] mt-1">{String(errors.purpose.message)}</p>}
                  </div>

                  <div>
                    <label className={lightLabelClass}>Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      {...register('password', {
                        required: 'Required',
                        minLength: { value: 6, message: 'Min 6 chars' }
                      })}
                      className={lightInputClass}
                    />
                    {errors.password && <p className="text-red-500 text-[10px] mt-1">{String(errors.password.message)}</p>}
                  </div>
                </div>

                {/* 2. Photo, Plan, and Payment Selector Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center pt-3 border-t border-slate-100">
                  {/* Photo Upload Circle */}
                  <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-3 rounded-xl">
                    <label className={`relative w-12 h-12 rounded-full border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition shrink-0 ${
                      selectedAvatar
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                        : 'border-slate-300 bg-white text-slate-400 hover:text-slate-600'
                    }`}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setSelectedAvatar(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                      {selectedAvatar ? (
                        <img src={selectedAvatar} className="w-full h-full rounded-full object-cover" alt="Profile Preview" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                    </label>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-700">Profile Image</p>
                      <p className="text-[10px] text-slate-400 font-semibold">Upload photo</p>
                    </div>
                  </div>

                  {/* Plan Selection */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Membership Program</label>
                    <select
                      value={selectedPlanId}
                      onChange={(e) => setSelectedPlanId(e.target.value)}
                      className="w-full px-3 py-3 text-xs bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-[#10b981] rounded-xl outline-none"
                    >
                      {plans.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name} ({p.durationInDays} Days)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Payment Mode */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Payment Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMode('upi')}
                        className={`py-3 px-3 text-xs font-bold border rounded-xl flex items-center justify-center space-x-1.5 transition ${
                          paymentMode === 'upi'
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                            : 'border-slate-200 bg-slate-50 text-slate-500'
                        }`}
                      >
                        <QrCode className="h-4 w-4" />
                        <span>UPI</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMode('cash')}
                        className={`py-3 px-3 text-xs font-bold border rounded-xl flex items-center justify-center space-x-1.5 transition ${
                          paymentMode === 'cash'
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                            : 'border-slate-200 bg-slate-50 text-slate-500'
                        }`}
                      >
                        <CreditCard className="h-4 w-4" />
                        <span>Cash</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Conditional Pay Ref ID */}
                {paymentMode === 'upi' && (
                  <div className="pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Please pay fee of <strong>₹{selectedPlan?.price}</strong> using the QR code in the summary card and enter the transaction reference ID.
                      </p>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-slate-400 uppercase mb-1.5">UPI Transaction ID / Ref Number</label>
                      <input
                        type="text"
                        placeholder="12-digit reference number"
                        {...register('transactionId', { required: paymentMode === 'upi' ? 'Transaction ID is required' : false })}
                        className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-[#10b981] rounded-xl outline-none"
                      />
                      {errors.transactionId && <p className="text-red-500 text-[10px] mt-1">{String(errors.transactionId.message)}</p>}
                    </div>
                  </div>
                )}

                {paymentMode === 'cash' && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500 leading-relaxed">
                    You chose to pay cash or manual UPI at the front desk. Submit this request, and present your confirmation to activate your membership.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition shadow shadow-emerald-500/10"
                >
                  {submitting ? <Spinner size="sm" /> : <span>Create Account & Request Access</span>}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Checkout Pricing Summary & QR Code */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-slate-100 shadow-xl p-5 rounded-2xl space-y-4 text-slate-800">
              <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">Membership Summary</h3>

              {selectedPlan ? (
                <div className="space-y-2">
                  <div className="flex justify-between gap-4 text-xs border-b border-slate-100 pb-2">
                    <span className="text-slate-400">Plan Description</span>
                    <span className="text-slate-800 font-semibold">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between gap-4 text-xs border-b border-slate-100 pb-2">
                    <span className="text-slate-400">Access Duration</span>
                    <span className="text-slate-800 font-semibold">{selectedPlan.durationInDays} Days</span>
                  </div>
                  <div className="flex justify-between gap-4 text-xs border-b border-slate-100 pb-2">
                    <span className="text-slate-400">Amount Due</span>
                    <span className="text-slate-800 font-semibold">₹{selectedPlan.price}</span>
                  </div>
                  <div className="flex justify-between gap-4 text-sm pt-1">
                    <span className="text-emerald-600 font-bold">Total Bill</span>
                    <span className="text-emerald-600 font-extrabold text-base">₹{selectedPlan.price}</span>
                  </div>

                  {paymentMode === 'upi' && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col items-center text-center space-y-2">
                      <p className="text-[10px] text-slate-400">Scan QR to pay ₹{selectedPlan.price}</p>
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi://pay?pa=mockgym@upi%26pn=${encodeURIComponent(
                          gym?.name || 'Gym'
                        )}%26am=${selectedPlan.price}%26cu=INR`}
                        alt="UPI QR Code"
                        className="w-24 h-24 rounded-lg border-2 border-slate-100 p-1 bg-white shadow-sm"
                      />
                      <p className="text-[10px] font-semibold text-emerald-600">UPI ID: mockgym@upi</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-400">Select a membership plan to calculate checkout summary.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(248, 250, 252, 0.88), rgba(241, 245, 249, 0.92)), url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2000&auto=format&fit=crop')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-4 w-full relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
        {/* Left Column: Form & checkout details */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-slate-100 shadow-xl p-4 sm:p-5 rounded-2xl space-y-3 text-slate-800">
            <div>
              <h1 className="text-base font-extrabold text-slate-900 leading-none">Review & Checkout</h1>
              <p className="text-slate-450 text-[10px] mt-0.5">
                Selected plan for <span className="text-emerald-600 font-bold">{gym?.name}</span>
              </p>
            </div>

            {/* Select Gym Plan drop down */}
            <div>
              <label className="block text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1">Membership Plan</label>
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-[#10b981] rounded-xl outline-none"
              >
                {plans.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} - {p.durationInDays} Days (₹{p.price})
                  </option>
                ))}
              </select>
            </div>

            {/* Select Payment Mode */}
            <div>
              <label className="block text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1">Payment Mode</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMode('upi')}
                  className={`py-2 px-3 text-xs font-bold border rounded-xl flex items-center justify-center space-x-1.5 transition ${
                    paymentMode === 'upi'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                      : 'border-slate-200 bg-slate-50 text-slate-500'
                  }`}
                >
                  <QrCode className="h-4 w-4" />
                  <span>Pay with UPI</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode('cash')}
                  className={`py-2 px-3 text-xs font-bold border rounded-xl flex items-center justify-center space-x-1.5 transition ${
                    paymentMode === 'cash'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                      : 'border-slate-200 bg-slate-50 text-slate-500'
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Pay Cash at Desk</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              {paymentMode === 'upi' && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  {/* Transaction ID */}
                  <div>
                    <label className="block text-[8px] font-black text-slate-400 uppercase mb-1">UPI Transaction ID / Ref Number</label>
                    <input
                      type="text"
                      placeholder="12-digit UPI reference number"
                      {...register('transactionId', { required: paymentMode === 'upi' ? 'Transaction ID is required' : false })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-[#10b981] rounded-xl outline-none"
                    />
                    {errors.transactionId && <p className="text-red-500 text-[10px] mt-1">{String(errors.transactionId.message)}</p>}
                  </div>

                  {/* Screenshot Mock url upload indicator */}
                  <div>
                    <label className="block text-[8px] font-black text-slate-400 uppercase mb-1">Uploaded Payment Receipt (Simulated)</label>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-[10px] text-slate-500">
                      Receipt screenshot attached successfully! (Simulated backend storage)
                    </div>
                  </div>
                </div>
              )}

              {paymentMode === 'cash' && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[10px] text-slate-500 leading-relaxed">
                  You are choosing to pay cash or manual UPI at the front desk. Submit this request, and present your payment confirmation to the gym counter staff to activate your account.
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition shadow shadow-emerald-500/10"
              >
                {submitting ? <Spinner size="sm" /> : <span>Request Gym Access</span>}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Checkout Pricing Summary & QR Code */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-100 shadow-xl p-4 sm:p-5 rounded-2xl space-y-4 text-slate-800">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">Membership Summary</h3>

            {selectedPlan ? (
              <div className="space-y-2">
                <div className="flex justify-between gap-4 text-xs border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Plan Description</span>
                  <span className="text-slate-800 font-semibold">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between gap-4 text-xs border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Access Duration</span>
                  <span className="text-slate-800 font-semibold">{selectedPlan.durationInDays} Days</span>
                </div>
                <div className="flex justify-between gap-4 text-xs border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Amount Due</span>
                  <span className="text-slate-800 font-semibold">₹{selectedPlan.price}</span>
                </div>
                <div className="flex justify-between gap-4 text-sm pt-1">
                  <span className="text-emerald-600 font-bold">Total Bill</span>
                  <span className="text-emerald-600 font-extrabold text-base">₹{selectedPlan.price}</span>
                </div>

                {paymentMode === 'upi' && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col items-center text-center space-y-2">
                    <p className="text-[10px] text-slate-400">Scan QR to pay ₹{selectedPlan.price}</p>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi://pay?pa=mockgym@upi%26pn=${encodeURIComponent(
                        gym?.name || 'Gym'
                      )}%26am=${selectedPlan.price}%26cu=INR`}
                      alt="UPI QR Code"
                      className="w-24 h-24 rounded-lg border-2 border-slate-100 p-1 bg-white shadow-sm"
                    />
                    <p className="text-[10px] font-semibold text-emerald-600">UPI ID: mockgym@upi</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Select a membership plan to calculate checkout summary.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
