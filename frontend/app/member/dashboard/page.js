'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import Spinner from '../../../components/ui/Spinner';
import Link from 'next/link';
import { useAuthStore } from '../../../store/authStore';
import {
  Dumbbell,
  Calendar,
  Utensils,
  Megaphone,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  TrendingUp,
  Activity,
  Flame,
  Award,
  User,
  CreditCard,
  MapPin,
  Scale,
  LogOut,
  Mail,
  Phone
} from 'lucide-react';

export default function MemberDashboard() {
  const { user } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/member/dashboard');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load member dashboard:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Not joined in any gym view
  if (!data?.membership) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-100 max-w-lg mx-auto text-center space-y-6 mt-12 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full" />
        <Dumbbell className="h-14 w-14 text-emerald-500 mx-auto mb-4 animate-bounce" />
        <h2 className="text-2xl font-black text-slate-800">Join Partner Gym</h2>
        <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto">
          Welcome to GymFlow! You haven't registered in any fitness center membership plan yet. Complete checkout at one of our high-end partner gyms to get started!
        </p>
        <Link
          href="/gyms"
          className="bg-emerald-600 hover:bg-emerald-550 text-white font-bold px-8 py-3 rounded-xl text-xs inline-flex items-center space-x-1.5 shadow-lg shadow-emerald-600/10 transition"
        >
          <span>Find Gym Near You</span>
          <ArrowRight className="h-4.5 w-4.5" />
        </Link>
      </div>
    );
  }

  const {
    membership,
    payments,
    attendance = [],
    totalAttendanceThisMonth = 0,
    todayWorkout,
    todayDiet,
    latestProgress,
    announcements = []
  } = data;

  // Determine Today's Attendance Check-in status
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = attendance.find(log => {
    if (!log.checkIn) return false;
    const logDateStr = new Date(log.checkIn).toISOString().split('T')[0];
    return logDateStr === todayStr;
  });

  // Calculate percentage of days left for membership
  let validityStatus = 'Expired';
  let validityColor = 'text-red-700 bg-red-50 border-red-100';
  if (membership.status === 'active') {
    validityStatus = 'Active Pass';
    validityColor = 'text-emerald-700 bg-emerald-50 border-emerald-100';
  } else if (membership.status === 'pending') {
    validityStatus = 'Pending Verification';
    validityColor = 'text-amber-700 bg-amber-50 border-amber-100';
  }

  return (
    <div className="space-y-6">
      {/* Header Profile Info */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Welcome back, {user?.name}!</h1>
          <p className="text-slate-500 text-xs mt-1">Ready to crush your workout splits and nutrition targets today?</p>
        </div>
        <Link
          href="/member/attendance"
          className="bg-emerald-600 hover:bg-emerald-550 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-600/10 transition hover:-translate-y-0.5"
        >
          <QrCode className="h-4.5 w-4.5" />
          <span>Check-in Scanner</span>
        </Link>
      </div>

      {/* Premium Visual Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Pass Validity */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-md shadow-slate-100/50 flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
            <Award className="h-5.5 w-5.5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Pass Validity</p>
            <p className="text-base font-black text-slate-800 mt-1">{membership.daysLeft || 0} Days Left</p>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border inline-block mt-1 ${validityColor}`}>
              {validityStatus}
            </span>
          </div>
        </div>

        {/* Attendance Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-md shadow-slate-100/50 flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600 border border-blue-100">
            <Activity className="h-5.5 w-5.5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Gym Check-ins</p>
            <p className="text-base font-black text-slate-800 mt-1">{membership.totalAttendanceLogs || 0} Logs</p>
            <span className="text-[9px] text-slate-500 font-semibold inline-block mt-1">
              {totalAttendanceThisMonth} this month
            </span>
          </div>
        </div>

        {/* Weight Tracker */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-md shadow-slate-100/50 flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 bg-purple-50 rounded-xl text-purple-600 border border-purple-100">
            <Scale className="h-5.5 w-5.5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Latest Weight</p>
            <p className="text-base font-black text-slate-800 mt-1">
              {latestProgress?.weight ? `${latestProgress.weight} kg` : 'No logs'}
            </p>
            <Link href="/member/progress" className="text-[9px] text-purple-600 font-extrabold hover:underline inline-block mt-1">
              Update Weight
            </Link>
          </div>
        </div>

        {/* Nutrition stats */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-md shadow-slate-100/50 flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 bg-orange-50 rounded-xl text-orange-650 border border-orange-100">
            <Utensils className="h-5.5 w-5.5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Nutrition splits</p>
            <p className="text-base font-black text-slate-800 mt-1">
              {todayDiet?.meals?.length || 0} Scheduled
            </p>
            <Link href="/member/diet" className="text-[9px] text-orange-600 font-extrabold hover:underline inline-block mt-1">
              View Meal Plan
            </Link>
          </div>
        </div>
      </div>

      {/* Main 2-Column Responsive Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Membership Details & Workouts/Diets */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Member Profile Details & Gym Info */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md shadow-slate-100/50 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <User className="h-4.5 w-4.5 text-emerald-600" />
                <span>Member Details & Active Program</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
              
              {/* Member Info */}
              <div className="space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-wide">Personal Details</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <span className="font-bold text-slate-800">{user?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>{user?.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>Member Since: {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Gym & Plan Info */}
              <div className="space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-wide">Membership Plan</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="h-3.5 w-3.5 text-slate-400" />
                    <span className="font-bold text-slate-800">{membership.gymId?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                    <span>Plan: <span className="font-bold text-emerald-600">{membership.planId?.name}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span className="truncate max-w-[200px]">{membership.gymId?.address || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>Expiry: {new Date(membership.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Program Validity and Fee Status */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-xs items-start sm:items-center">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-semibold">Payment mode & status:</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 uppercase">{payments[0]?.mode || 'Cash'}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md uppercase border ${
                    membership.paymentStatus === 'paid'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {membership.paymentStatus || 'Pending'}
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-500 font-semibold block">Total Program Fees Paid:</span>
                <span className="text-base font-black text-slate-900">₹{membership.amount || 0}</span>
              </div>
            </div>

            {membership.status === 'pending' && (
              <div className="p-3.5 bg-orange-500/15 border border-orange-550/20 text-orange-700 text-xs rounded-xl text-center font-bold">
                ⚠️ Your payment receipt is pending verification. Desk admins will unlock full dashboard routines shortly.
              </div>
            )}
          </div>

          {/* Today's Workout splits */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md shadow-slate-100/50 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-800 flex items-center space-x-2">
                <Dumbbell className="h-4.5 w-4.5 text-emerald-600" />
                <span>Today's Target Routine</span>
              </h3>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md font-black uppercase tracking-wider">
                {todayWorkout?.dayName || 'Rest Day'}
              </span>
            </div>

            {todayWorkout?.exercises?.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-700 font-bold">{todayWorkout.title}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {todayWorkout.exercises.map((ex, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between gap-3 text-xs items-center">
                      <div>
                        <span className="text-slate-800 font-bold block">{ex.name}</span>
                        {ex.notes && <span className="text-[10px] text-slate-400">{ex.notes}</span>}
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-600 font-extrabold block">{ex.sets} Sets</span>
                        <span className="text-slate-400 text-[10px]">{ex.reps} reps</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-3 text-center">Rest day / Workout splits not scheduled yet by your gym trainer.</p>
            )}
          </div>

          {/* Today's Diet blueprint */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md shadow-slate-100/50 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-800 flex items-center space-x-2">
                <Utensils className="h-4.5 w-4.5 text-orange-500" />
                <span>Today's Diet Blueprint</span>
              </h3>
              <span className="text-[10px] text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-md font-black uppercase tracking-wider">Meals</span>
            </div>

            {todayDiet?.meals?.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {todayDiet.meals.map((meal, idx) => (
                  <div key={idx} className="py-2.5 text-xs flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <span className="font-bold text-slate-800 block">{meal.name}</span>
                      <p className="text-[10px] text-slate-500 leading-relaxed max-w-sm">{meal.items}</p>
                    </div>
                    <span className="text-[9px] bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold uppercase shrink-0">
                      {meal.time}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-3 text-center">No scheduled diet blueprint plans logged yet by your gym trainer.</p>
            )}
          </div>
        </div>

        {/* Right Column: Attendance Status, Recent Logs & Announcements */}
        <div className="space-y-6">
          
          {/* Today's Attendance Status */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md shadow-slate-100/50 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 blur-xl rounded-full" />
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Activity className="h-4.5 w-4.5 text-emerald-600" />
              <span>Today's Check-in</span>
            </h3>

            {todayLog ? (
              <div className="space-y-3.5 py-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-emerald-300 relative flex items-center justify-center">
                    <span className="absolute w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                  </div>
                  <span className="text-xs font-black text-emerald-700">Checked In</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-650 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-450">Check-in:</span>
                    <span className="font-bold text-slate-800">{new Date(todayLog.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  {todayLog.checkOut ? (
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-450">Check-out:</span>
                      <span className="font-bold text-slate-800">{new Date(todayLog.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between gap-4 pt-1 border-t border-slate-200/50 mt-1">
                      <span className="text-slate-450 text-[10px]">Session Status:</span>
                      <span className="font-bold text-slate-500 text-[10px] animate-pulse">Working Out... 💪</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Clock className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800">Not Checked In Yet</p>
                  <p className="text-[10px] text-slate-400">Scan the gym QR code at the reception desk to check in.</p>
                </div>
                <Link
                  href="/member/attendance"
                  className="w-full bg-slate-900 hover:bg-slate-850 text-white font-bold py-2.5 px-4 rounded-xl text-[10px] flex items-center justify-center gap-1.5 transition inline-block shadow-sm"
                >
                  <QrCode className="h-4 w-4" />
                  <span>Scan QR Code</span>
                </Link>
              </div>
            )}
          </div>

          {/* Recent Attendance Logs */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md shadow-slate-100/50 space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calendar className="h-4.5 w-4.5 text-blue-600" />
              <span>Recent Check-ins</span>
            </h3>

            {attendance.length > 0 ? (
              <div className="space-y-2.5 max-h-[250px] overflow-y-auto no-scrollbar">
                {attendance.slice(0, 5).map((log, idx) => (
                  <div key={idx} className="flex justify-between gap-3 text-xs bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 items-center">
                    <div>
                      <span className="font-bold text-slate-800 block">
                        {new Date(log.checkIn).toLocaleDateString(undefined, { month: 'short', day: 'numeric', weekday: 'short' })}
                      </span>
                      <span className="text-[9px] text-slate-400 capitalize">Scan mode: {log.method || 'QR Code'}</span>
                    </div>
                    <div className="text-right space-y-0.5">
                      <span className="font-bold text-slate-700 block">
                        {new Date(log.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-[9px] text-slate-400 block">
                        {log.checkOut
                          ? `Out: ${new Date(log.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                          : 'No check-out'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No attendance logs available.</p>
            )}
          </div>

          {/* Gym Notices & Announcements */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md shadow-slate-100/50 space-y-4">
            <h3 className="text-sm font-black text-slate-800 flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Megaphone className="h-4.5 w-4.5 text-cyan-600" />
              <span>Gym Announcements</span>
            </h3>

            {announcements.length > 0 ? (
              <div className="space-y-4 divide-y divide-slate-150">
                {announcements.map((notif, idx) => (
                  <div key={notif._id} className={`pt-3.5 ${idx === 0 ? 'pt-0' : ''} space-y-1.5`}>
                    <div className="flex items-center justify-between gap-4 text-[10px] text-slate-400">
                      <span className="font-bold text-emerald-600 uppercase tracking-wide">{notif.title}</span>
                      <span>{new Date(notif.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{notif.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No notices posted by gym admin.</p>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
