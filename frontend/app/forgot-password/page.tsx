'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import api from '../../lib/api';
import Spinner from '../../components/ui/Spinner';
import { toast } from 'react-hot-toast';
import { Dumbbell, Mail, ArrowLeft, Send } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitRecovery = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        setSubmitted(true);
        toast.success(res.data.message || 'Recovery email dispatched successfully! 📧');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to dispatch recovery instructions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#030712] min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Neon Glowing Orbs */}
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-emerald-700/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Dumbbell className="h-9 w-9 text-emerald-500 animate-pulse" />
            <span className="text-2xl font-bold tracking-wider bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
              GymFlow
            </span>
          </Link>
          <p className="text-gray-400 text-xs mt-2">One QR. Complete Gym Management.</p>
        </div>

        {/* Card */}
        <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-extrabold text-white">Password Recovery</h2>
            <p className="text-gray-500 text-[11px] mt-1">Enter your email below to reset your password credentials</p>
          </div>

          {submitted ? (
            <div className="text-center space-y-4 py-4 animate-scale-in">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl leading-relaxed">
                📬 Recovery instructions have been sent to <span className="font-bold text-white">{email}</span>. Please verify your spam box if not found within 2 minutes.
              </div>
              <Link
                href="/login"
                className="inline-flex items-center space-x-1.5 text-xs text-emerald-400 font-bold hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Return to login page</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmitRecovery} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Registered Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-550" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 text-xs glass-input rounded-xl"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition shadow-lg shadow-emerald-500/10 mt-2"
              >
                {loading ? <Spinner size="sm" /> : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Recovery Credentials</span>
                  </>
                )}
              </button>
            </form>
          )}

          {!submitted && (
            <div className="text-center pt-2 border-t border-white/5">
              <Link
                href="/login"
                className="inline-flex items-center space-x-1 text-xs text-gray-400 hover:text-emerald-405 transition font-bold"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to login</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
