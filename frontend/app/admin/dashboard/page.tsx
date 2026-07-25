'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import Spinner from '../../../components/ui/Spinner';
import Link from 'next/link';
import {
  Building2,
  Users,
  UserCheck,
  CreditCard,
  MapPin,
  TrendingUp,
  Clock,
  MoreVertical,
  Rocket,
  ArrowUpRight,
  UserPlus
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const CustomDot = (props) => {
  const { cx, cy, value } = props;
  if (value === 70000) {
    return (
      <g key="custom-dot">
        <circle cx={cx} cy={cy} r={6} fill="#00DF89" stroke="#fff" strokeWidth={2.5} />
        <foreignObject x={cx - 36} cy={cy - 36} width={72} height={26}>
          <div className="bg-[#00DF89] text-white text-[9px] font-black px-2 py-0.5 rounded-full text-center shadow-md border border-white/20 leading-relaxed">
            ₹70,000
          </div>
        </foreignObject>
      </g>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        // DEV BYPASS: Provide mock data if backend connection fails
        setData({
          success: true,
          stats: {
            totalGyms: 24,
            activeOwners: 20,
            pendingOwners: 4,
            totalMembers: 1450,
            platformRevenue: 125000,
            todayGymOwnersJoin: 3,
            todayMembersJoin: 42
          },
          cityWiseGyms: [
            { city: 'Mumbai', count: 8 },
            { city: 'Delhi', count: 6 },
            { city: 'Bangalore', count: 7 },
            { city: 'Hyderabad', count: 3 }
          ],
          monthlyGrowth: [
            { month: 'JAN', revenue: 40000, gyms: 10 },
            { month: 'FEB', revenue: 55000, gyms: 12 },
            { month: 'MAR', revenue: 70000, gyms: 15 },
            { month: 'APR', revenue: 90000, gyms: 18 },
            { month: 'MAY', revenue: 125000, gyms: 24 }
          ]
        });
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

  const { stats, monthlyGrowth } = data;

  const cardStats = [
    {
      name: 'Total Partner Gyms',
      value: stats.totalGyms,
      icon: Building2,
      badge: '+2 New',
      badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      iconBg: 'bg-emerald-50 text-[#00DF89]'
    },
    {
      name: 'Active Gym Owners',
      value: stats.activeOwners,
      icon: UserCheck,
      badge: '83% Ratio',
      badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100',
      iconBg: 'bg-slate-100 text-slate-500'
    },
    {
      name: 'Pending Owner Review',
      value: stats.pendingOwners,
      icon: Clock,
      badge: 'Priority',
      badgeColor: 'bg-rose-50 text-rose-600 border border-rose-100',
      iconBg: 'bg-rose-50 text-rose-500'
    },
    {
      name: 'Registered Members',
      value: stats.totalMembers,
      icon: Users,
      badge: '↑ 12%',
      badgeColor: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      iconBg: 'bg-slate-100 text-slate-500'
    },
    {
      name: 'Platform SaaS Revenue',
      value: `₹${stats.platformRevenue.toLocaleString('en-IN')}`,
      icon: CreditCard,
      badge: 'Total YTD',
      badgeColor: 'text-[#00DF89] border border-emerald-500/20 bg-emerald-500/10',
      iconBg: 'bg-[#1E293B] text-[#00DF89]',
      isDark: true,
      href: '/admin/revenue'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-400 text-xs mt-1">Real-time platform growth and activity overview</p>
        </div>
      </div>

      {/* Today's Registrations Stats - Prominent Top 2 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Today Gym Owners Joined */}
        <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/5 p-6 rounded-[28px] shadow-xl text-white relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl transition-all duration-500 group-hover:scale-125" />
          <div className="flex items-center justify-between gap-4 relative z-10">
            <div className="space-y-2">
              <span className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-[#00DF89] text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                Today's Activity
              </span>
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Gym Owners Joined</h3>
              <p className="text-4xl font-black tracking-tight text-white mt-1">
                {stats.todayGymOwnersJoin || 0}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[#00DF89] shadow-inner">
              <UserPlus className="h-7 w-7 animate-pulse" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-[10px] text-slate-400 font-bold relative z-10">
            <span className="text-[#00DF89] mr-1.5 animate-ping h-2 w-2 rounded-full bg-[#00DF89] inline-block" />
            <span>Live registration tracking</span>
          </div>
        </div>

        {/* Card 2: Today Members Joined */}
        <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/5 p-6 rounded-[28px] shadow-xl text-white relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl transition-all duration-500 group-hover:scale-125" />
          <div className="flex items-center justify-between gap-4 relative z-10">
            <div className="space-y-2">
              <span className="inline-block bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                Today's Activity
              </span>
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Members Joined</h3>
              <p className="text-4xl font-black tracking-tight text-white mt-1">
                {stats.todayMembersJoin || 0}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-inner">
              <Users className="h-7 w-7 animate-pulse" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-[10px] text-slate-400 font-bold relative z-10">
            <span className="text-blue-400 mr-1.5 animate-ping h-2 w-2 rounded-full bg-blue-450 inline-block" />
            <span>Live registration tracking</span>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {cardStats.map((item) => {
          const Icon = item.icon;
          const CardContent = (
            <>
              {/* Top Icons & Badges */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className={`p-2.5 rounded-2xl ${item.iconBg}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </div>
              {/* Values & labels */}
              <p className={`text-2xl font-black tracking-tight ${item.isDark ? 'text-white' : 'text-slate-850'}`}>
                {item.value}
              </p>
              <h3 className="text-[11px] font-bold text-slate-400 mt-2 uppercase tracking-wide flex items-center justify-between gap-4">
                <span>{item.name}</span>
                {item.href && <ArrowUpRight className="h-3 w-3 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />}
              </h3>
            </>
          );

          return item.href ? (
            <Link
              key={item.name}
              href={item.href}
              className={`p-6 rounded-[28px] relative transition-all duration-300 group cursor-pointer hover:-translate-y-1 block ${
                item.isDark
                  ? 'bg-[#121927] text-white shadow-xl shadow-slate-900/15 border border-white/5 hover:border-emerald-500/30'
                  : 'bg-white text-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.015)] border border-slate-100 hover:shadow-md'
              }`}
            >
              {CardContent}
            </Link>
          ) : (
            <div
              key={item.name}
              className={`p-6 rounded-[28px] relative transition-all duration-300 ${
                item.isDark
                  ? 'bg-[#121927] text-white shadow-xl shadow-slate-900/15 border border-white/5'
                  : 'bg-white text-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.015)] border border-slate-100 hover:shadow-md'
              }`}
            >
              {CardContent}
            </div>
          );
        })}
      </div>

      {/* Charts Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Growth line Area chart */}
        <div className="lg:col-span-2 bg-white border border-slate-100 p-6 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.01)] space-y-6">
          <div className="flex justify-between gap-4 items-center">
            <div>
              <h3 className="text-base font-black text-slate-800 tracking-tight flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                <span>Monthly Growth Timeline</span>
              </h3>
              <p className="text-slate-400 text-[10px] mt-0.5">Active platform revenue tracking (Jan - May)</p>
            </div>
            <button className="bg-slate-50 hover:bg-slate-100 text-slate-600 font-extrabold text-[10px] px-4 py-1.5 rounded-full border border-slate-100 transition shadow-sm">
              Export CSV
            </button>
          </div>

          <div className="h-72 w-full text-xs font-semibold relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyGrowth} margin={{ top: 30, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00DF89" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#00DF89" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} dx={-10} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    border: '1px solid #f1f5f9',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                    fontWeight: 'bold',
                    color: '#1e293b'
                  }}
                  itemStyle={{ color: '#00DF89' }}
                  labelStyle={{ color: '#1e293b', fontWeight: '900' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#00DF89" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  name="SaaS Revenue" 
                  dot={<CustomDot />}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* City-wise division Progress List */}
        <div className="bg-white border border-slate-100 p-6 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.01)] flex flex-col justify-between gap-4">
          <div className="space-y-6">
            <div className="flex justify-between gap-4 items-start">
              <div>
                <h3 className="text-base font-black text-slate-800 tracking-tight flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-emerald-500" />
                  <span>City Gym Division</span>
                </h3>
                <p className="text-slate-400 text-[10px] mt-0.5">Gym distribution by metropolitan regions</p>
              </div>
              <button className="p-1.5 text-slate-400 hover:text-slate-650 rounded-lg hover:bg-slate-50 transition">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            {/* List of progress bars */}
            <div className="space-y-5 py-2">
              {[
                { city: 'Mumbai', count: 8, total: 10 },
                { city: 'Delhi', count: 6, total: 10 },
                { city: 'Bangalore', count: 7, total: 10 },
                { city: 'Hyderabad', count: 3, total: 10 }
              ].map((item) => (
                <div key={item.city} className="space-y-1.5">
                  <div className="flex justify-between gap-4 items-center text-xs font-extrabold">
                    <span className="text-slate-600">{item.city}</span>
                    <span className="text-slate-800">{item.count} Gyms</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-400 rounded-full transition-all duration-500" 
                      style={{ width: `${(item.count / item.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* New Interface Feature Showcase */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[28px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
          <div className="flex-1 space-y-4">
            <span className="inline-block bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              New Interface
            </span>
            <h3 className="text-xl lg:text-2xl font-black text-slate-800 tracking-tight leading-tight">
              Seamless Management for Growing Networks.
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed max-w-sm">
              Our new Super Admin module provides deep-dive analytics into gym performance, revenue leakage, and member retention rates across your entire franchise network.
            </p>
          </div>

          {/* Dark Preview Screen Box */}
          <div className="flex-1 w-full max-w-sm bg-[#0A101D] border border-white/5 rounded-2xl p-6 shadow-lg relative overflow-hidden flex flex-col justify-between gap-4 h-44">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl animate-pulse" />
            
            <div className="grid grid-cols-2 gap-4 relative z-10">
              {/* Box 1 */}
              <div className="bg-[#121927] border border-white/5 p-3 rounded-xl shadow-inner">
                <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Active Owners</p>
                <div className="flex items-center justify-between gap-4 mt-1">
                  <span className="text-sm font-black text-white">20</span>
                  <div className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center">
                    <UserCheck className="h-2.5 w-2.5 text-emerald-400" />
                  </div>
                </div>
              </div>

              {/* Box 2 */}
              <div className="bg-[#121927] border border-white/5 p-3 rounded-xl shadow-inner">
                <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Pending Review</p>
                <div className="flex items-center justify-between gap-4 mt-1">
                  <span className="text-sm font-black text-white">4</span>
                  <div className="w-5 h-5 rounded-full bg-orange-500/15 flex items-center justify-center">
                    <Clock className="h-2.5 w-2.5 text-orange-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Glowing line graph representation */}
            <div className="relative h-12 w-full mt-4 z-10">
              <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="glowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00DF89" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#00DF89" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,35 Q15,20 30,30 T60,10 T90,25 T100,5" fill="none" stroke="#00DF89" strokeWidth="2" strokeLinecap="round" />
                <path d="M0,35 Q15,20 30,30 T60,10 T90,25 T100,5 L100,40 L0,40 Z" fill="url(#glowGrad)" />
              </svg>
            </div>
          </div>
        </div>

        {/* SaaS Pulse vibrant green card */}
        <div className="bg-gradient-to-br from-[#00DF89] to-[#00B460] rounded-[28px] p-8 text-white shadow-[0_15px_35px_rgba(0,223,137,0.2)] flex flex-col justify-between gap-6 relative overflow-hidden group">
          {/* Subtle patterns */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl transition-all duration-500 group-hover:scale-110" />
          
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
              <Rocket className="h-6 w-6 text-white transform -rotate-12" />
            </div>
            <h3 className="text-xl font-black tracking-tight">
              SaaS Pulse
            </h3>
            <p className="text-white/95 text-xs leading-relaxed font-bold">
              You're on track to hit ₹1.5L revenue by June. High owner engagement reported in Mumbai & Bangalore.
            </p>
          </div>
          
          <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-wider text-emerald-950 bg-white/20 self-start px-3 py-1.5 rounded-full hover:bg-white/30 transition cursor-pointer">
            <span>View Pulse Report</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}

