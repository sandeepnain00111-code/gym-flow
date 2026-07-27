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
import { CreditCard, Dumbbell, QrCode, FileCheck, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function GymMembershipJoin() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [gym, setGym] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(searchParams.get('plan') || '');
  const [paymentMode, setPaymentMode] = useState('upi');

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

  const selectedPlan = plans.find((p) => p._id === selectedPlanId);

  if (loading) {
    return (
      <div className="bg-transparent min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Not Authenticated view
  if (!isAuthenticated) {
    return (
      <div className="bg-transparent min-h-screen flex flex-col justify-between gap-4">
        <Navbar />
        <div className="max-w-md mx-auto py-32 px-6 text-center">
          <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full" />
            <Dumbbell className="h-12 w-12 text-emerald-500 mx-auto mb-4 animate-bounce" />
            <h2 className="text-xl font-bold text-white mb-2">Unlock Gym Membership</h2>
            <p className="text-gray-400 text-xs mb-6">
              To join <span className="text-emerald-400 font-bold">{gym?.name}</span> and select active plans, please login or register a member account first.
            </p>
            <div className="flex flex-col space-y-3">
              <Link
                href={`/login?redirect=/gym/${slug}/join`}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold py-3 rounded-xl text-xs transition"
              >
                Log In As Member
              </Link>
              <Link
                href={`/register?role=member&redirect=/gym/${slug}/join`}
                className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl text-xs border border-white/10 transition"
              >
                Register Free Account
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-transparent min-h-screen flex flex-col relative overflow-hidden">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column: Form & checkout details */}
        <div className="lg:col-span-3">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 shadow-2xl space-y-6">
            <div>
              <h1 className="text-xl font-extrabold text-white">Review & Checkout</h1>
              <p className="text-gray-400 text-xs mt-1">
                Selected plan for <span className="text-emerald-400 font-bold">{gym?.name}</span>
              </p>
            </div>

            {/* Select Gym Plan drop down */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Membership Plan</label>
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-xs glass-input bg-[#111827] text-gray-300"
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
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Payment Mode</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMode('upi')}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border transition flex items-center justify-center space-x-2 ${
                    paymentMode === 'upi'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-white/5 bg-white/3 text-gray-400 hover:text-white'
                  }`}
                >
                  <QrCode className="h-4.5 w-4.5" />
                  <span>Pay with UPI</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode('cash')}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border transition flex items-center justify-center space-x-2 ${
                    paymentMode === 'cash'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-white/5 bg-white/3 text-gray-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="h-4.5 w-4.5" />
                  <span>Pay Cash at Desk</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {paymentMode === 'upi' && (
                <div className="space-y-4 pt-2">
                  <div className="glass-card p-4 rounded-2xl border border-white/5 bg-[#090d16] flex flex-col items-center text-center">
                    <p className="text-xs text-gray-400 mb-3">Scan this code using GPay, PhonePe or Paytm</p>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=mockgym@upi%26pn=${encodeURIComponent(
                        gym?.name || 'Gym'
                      )}%26am=${selectedPlan?.price || 1000}%26cu=INR`}
                      alt="UPI QR Code"
                      className="w-36 h-36 rounded-xl border-4 border-white p-1 bg-white mb-3"
                    />
                    <p className="text-[11px] font-semibold text-emerald-400">UPI: mockgym@upi</p>
                  </div>

                  {/* Transaction ID */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">UPI Transaction ID / Ref Number</label>
                    <input
                      type="text"
                      placeholder="12-digit UPI reference number"
                      {...register('transactionId', { required: paymentMode === 'upi' ? 'Transaction ID is required' : false })}
                      className="w-full px-4 py-3 text-xs glass-input rounded-xl"
                    />
                    {errors.transactionId && <p className="text-red-400 text-[10px] mt-1">{String(errors.transactionId.message)}</p>}
                  </div>

                  {/* Screenshot Mock url upload indicator */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Uploaded Payment Receipt (Simulated)</label>
                    <div className="p-3 rounded-xl bg-white/3 border border-dashed border-white/10 text-center text-[10px] text-gray-400">
                      Receipt screenshot attached successfully! (Simulated backend storage)
                    </div>
                  </div>
                </div>
              )}

              {paymentMode === 'cash' && (
                <div className="p-4 rounded-2xl border border-white/5 bg-white/3 text-xs text-gray-400 leading-relaxed">
                  You are choosing to pay cash or manual UPI at the front desk desk desk. Submit this request, and present your payment confirmation to the gym counter staff to activate your account.
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition shadow-lg shadow-emerald-500/10"
              >
                {submitting ? <Spinner size="sm" /> : <span>Request Gym Access</span>}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Checkout Pricing Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-6">
            <h3 className="text-base font-bold text-white">Membership Summary</h3>

            {selectedPlan ? (
              <div className="space-y-4">
                <div className="flex justify-between gap-4 text-xs border-b border-white/5 pb-3">
                  <span className="text-gray-400">Plan Description</span>
                  <span className="text-white font-semibold">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between gap-4 text-xs border-b border-white/5 pb-3">
                  <span className="text-gray-400">Access Duration</span>
                  <span className="text-white font-semibold">{selectedPlan.durationInDays} Days</span>
                </div>
                <div className="flex justify-between gap-4 text-xs border-b border-white/5 pb-3">
                  <span className="text-gray-400">Amount Due</span>
                  <span className="text-white font-semibold">₹{selectedPlan.price}</span>
                </div>
                <div className="flex justify-between gap-4 text-sm pt-2">
                  <span className="text-emerald-400 font-bold">Total Bill</span>
                  <span className="text-emerald-400 font-extrabold text-base">₹{selectedPlan.price}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500">Select a membership plan to calculate checkout summary.</p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
