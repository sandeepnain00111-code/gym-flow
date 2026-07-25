'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '../../lib/api';
import Spinner from '../../components/ui/Spinner';
import { toast } from 'react-hot-toast';
import { Dumbbell, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error('Reset token is missing or invalid');
    }
  }, [token]);

  const handleSubmitReset = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Invalid token. Please request a new password reset link.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', {
        resetToken: token,
        newPassword
      });
      if (res.data.success) {
        setSuccess(true);
        toast.success(res.data.message || 'Password reset successful!');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password. Token may be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
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
          <h2 className="text-xl font-extrabold text-white">Set New Password</h2>
          <p className="text-gray-500 text-[11px] mt-1">Create a secure password for your account</p>
        </div>

        {success ? (
          <div className="text-center space-y-4 py-4 animate-scale-in">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl leading-relaxed font-bold">
              🎉 Password updated successfully! Redirecting to login page...
            </div>
            <Link
              href="/login"
              className="inline-flex items-center space-x-1.5 text-xs text-emerald-400 font-bold hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Click here if not redirected</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmitReset} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-550" />
                <input
                  type="password"
                  placeholder="Enter new password (min 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-11 pr-4 py-3 text-xs glass-input rounded-xl text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-550" />
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-11 pr-4 py-3 text-xs glass-input rounded-xl text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition shadow-lg shadow-emerald-500/10 mt-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <Spinner size="sm" /> : <span>Reset Password & Login</span>}
            </button>
          </form>
        )}

        {!success && (
          <div className="text-center pt-2 border-t border-white/5">
            <Link
              href="/login"
              className="inline-flex items-center space-x-1 text-xs text-gray-400 hover:text-emerald-400 transition font-bold"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to login</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <div className="bg-[#030712] min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Neon Glowing Orbs */}
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-emerald-700/10 blur-[100px] pointer-events-none" />

      <Suspense fallback={<Spinner size="lg" />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
