'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Filter, 
  Calendar,
  DollarSign, 
  ArrowUpRight, 
  Briefcase, 
  ShieldCheck, 
  Search,
  Sparkles
} from 'lucide-react';

const REVENUE_METRICS = [
  {
    name: 'Total SaaS Revenue (YTD)',
    value: '₹1,25,000',
    change: '+14.2% from last month',
    isPositive: true,
    icon: CreditCard,
    color: 'text-emerald-500 bg-emerald-500/10'
  },
  {
    name: 'Monthly Recurring Revenue (MRR)',
    value: '₹37,500',
    change: '+8.4% since last quarter',
    isPositive: true,
    icon: TrendingUp,
    color: 'text-[#00DF89] bg-[#00DF89]/10'
  },
  {
    name: 'Annual Recurring Revenue (ARR)',
    value: '₹4,50,000',
    change: 'Projected for FY26',
    isPositive: true,
    icon: Sparkles,
    color: 'text-violet-500 bg-violet-500/10'
  },
  {
    name: 'Avg. Revenue Per Partner (ARPU)',
    value: '₹3,750',
    change: 'Based on active plans',
    isPositive: true,
    icon: Briefcase,
    color: 'text-cyan-500 bg-cyan-500/10'
  }
];

const TRANSACTIONS = [
  {
    id: 'TXN-90281',
    gymName: 'Iron Forge Fitness',
    ownerName: 'Rohan Sharma',
    planName: 'Pro SaaS Enterprise',
    amount: 4999,
    status: 'success',
    method: 'UPI Auto-pay',
    date: '2026-05-27T10:14:00Z'
  },
  {
    id: 'TXN-90278',
    gymName: 'Apex Elite Gym',
    ownerName: 'Ananya Verma',
    planName: 'Lite SaaS Starter',
    amount: 2500,
    status: 'success',
    method: 'Credit Card',
    date: '2026-05-25T16:40:00Z'
  },
  {
    id: 'TXN-90250',
    gymName: 'Gold’s Gym South Delhi',
    ownerName: 'Vikram Malhotra',
    planName: 'Elite Gym Network',
    amount: 45000,
    status: 'success',
    method: 'Net Banking',
    date: '2026-05-20T09:30:00Z'
  },
  {
    id: 'TXN-90234',
    gymName: 'Pulse & Pace Studio',
    ownerName: 'Kunal Kapoor',
    planName: 'Pro SaaS Enterprise',
    amount: 4999,
    status: 'failed',
    method: 'UPI Auto-pay',
    date: '2026-05-18T14:22:00Z'
  },
  {
    id: 'TXN-90212',
    gymName: 'Fit & Flow Yoga Club',
    ownerName: 'Shalini Sen',
    planName: 'Lite SaaS Starter',
    amount: 2500,
    status: 'success',
    method: 'UPI',
    date: '2026-05-15T11:05:00Z'
  },
  {
    id: 'TXN-90199',
    gymName: 'Powerhouse Gym Sector 62',
    ownerName: 'Manish Rawat',
    planName: 'Pro SaaS Enterprise',
    amount: 4999,
    status: 'success',
    method: 'Debit Card',
    date: '2026-05-12T18:50:00Z'
  }
];

export default function SaaSRevenueLedger() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('search') || '';
    if (q) setSearchTerm(q);
  }, []);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const filteredTxns = TRANSACTIONS.filter((txn) => {
    const matchesSearch = 
      txn.gymName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || txn.status === statusFilter;
    
    let matchesDate = true;
    if (startDate) {
      const txnDate = new Date(txn.date);
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      matchesDate = matchesDate && (txnDate >= start);
    }
    if (endDate) {
      const txnDate = new Date(txn.date);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      matchesDate = matchesDate && (txnDate <= end);
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const filteredTotal = filteredTxns.reduce((sum, txn) => sum + (txn.status === 'success' ? txn.amount : 0), 0);
  const totalCount = filteredTxns.length;

  return (
    <div className="space-y-8">
      {/* Header and Back navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Link 
            href="/admin/dashboard" 
            className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Platform SaaS Revenue Ledger
          </h1>
          <p className="text-slate-400 text-xs">Real-time SaaS recurring billing analytics, transaction tracking, and payout ledger.</p>
        </div>
        
        <button className="self-start sm:self-center flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-extrabold text-xs px-4 py-2 rounded-xl transition shadow-sm">
          <Download className="h-4 w-4" />
          <span>Export Ledger</span>
        </button>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {REVENUE_METRICS.map((metric) => {
          const Icon = metric.icon;
          return (
            <div 
              key={metric.name}
              className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-md transition duration-300 flex flex-col justify-between gap-4 h-40"
            >
              <div className="flex items-center justify-between gap-4">
                <div className={`p-2.5 rounded-2xl ${metric.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  metric.isPositive 
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                    : 'bg-rose-50 text-rose-600 border border-rose-100'
                }`}>
                  {metric.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-850 tracking-tight mt-4">
                  {metric.value}
                </p>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                  {metric.name}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Settlement Bank Account Details */}
      <div className="bg-slate-50 border border-slate-100 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.015)] p-6 flex flex-col md:flex-row justify-between gap-6 overflow-hidden relative group/bank min-h-[220px]">
        {/* Full-bleed Corporate Banking & Finance Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center pointer-events-none transition-all duration-700 group-hover/bank:scale-105 opacity-[0.22] group-hover/bank:opacity-[0.28]"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=1200&q=80')" }}
        />
        {/* Soft glassmorphism background overlay for standard light theme elegance */}
        <div className="absolute inset-0 bg-white/85 backdrop-blur-[1px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Left Section: Account card & info */}
        <div className="flex-1 space-y-4 relative z-10">
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center">
              <ShieldCheck className="h-3.5 w-3.5 mr-1" />
              Verified Payout Destination
            </span>
            <span className="text-[10px] text-slate-400 font-bold">Settlements active • T+2 Cycle</span>
          </div>
          
          <h2 className="text-base font-black text-slate-800 tracking-tight">SaaS Settlement Bank Account</h2>
          <p className="text-slate-500 text-xs leading-relaxed max-w-xl">
            Inbound SaaS revenues are automatically swept and settled into the verified corporate account below according to your weekly payout schedule.
          </p>
          
          {/* Bank Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="bg-slate-50/90 backdrop-blur-sm border border-slate-100 p-3 rounded-2xl">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Account Holder</p>
              <p className="text-xs font-extrabold text-slate-700 mt-1 truncate">GymFlow Technologies Pvt Ltd</p>
            </div>
            
            <div className="bg-slate-50/90 backdrop-blur-sm border border-slate-100 p-3 rounded-2xl">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Bank Name</p>
              <p className="text-xs font-extrabold text-slate-700 mt-1 truncate">HDFC Corporate Bank</p>
            </div>
            
            <div className="bg-slate-50/90 backdrop-blur-sm border border-slate-100 p-3 rounded-2xl relative group">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Account Number</p>
              <p className="text-xs font-extrabold text-slate-700 mt-1 font-mono tracking-wide">
                •••• •••• 9283
              </p>
            </div>
            
            <div className="bg-slate-50/90 backdrop-blur-sm border border-slate-100 p-3 rounded-2xl">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">IFSC / Routing Code</p>
              <p className="text-xs font-extrabold text-slate-700 mt-1 font-mono">HDFC0000028</p>
            </div>
          </div>
        </div>

        {/* Right Section: Quick summary card / status */}
        <div className="md:w-72 bg-[#121927] border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between gap-4 text-white self-center group/card h-full min-h-[170px]">
          {/* Card Tech Watermark Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03] bg-cover bg-center pointer-events-none transition-opacity duration-500 group-hover/card:opacity-[0.07]"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&w=600&q=80')" }}
          />
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Payout Active
              </span>
              <Calendar className="h-4 w-4 text-slate-400" />
            </div>
            <div>
              <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Last Settlement Payout</p>
              <p className="text-lg font-black text-white mt-0.5">₹68,500</p>
              <p className="text-[9px] text-slate-400 font-bold mt-1">Paid on 24th May, 2026</p>
            </div>
          </div>
          
          <button className="w-full bg-white hover:bg-slate-50 text-slate-900 font-black text-[10px] uppercase tracking-wider py-2.5 rounded-xl transition duration-300 mt-4 shadow-md flex items-center justify-center space-x-1 relative z-10">
            <span>Payout Settings</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Transaction Log & Filter section */}
      <div className="bg-white border border-slate-100 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.015)] p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-50 pb-5">
          <div>
            <h2 className="text-base font-black text-slate-800 tracking-tight">Billing Transactions</h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Audit log of all inbound SaaS subscription transactions.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search gym, owner, txn..."
                value={searchTerm}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchTerm(val);
                  const params = new URLSearchParams(window.location.search);
                  if (val) {
                    params.set('search', val);
                  } else {
                    params.delete('search');
                  }
                  window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
                }}
                className="pl-9 pr-4 py-1.5 h-9 rounded-xl border border-slate-200 text-xs font-semibold w-44 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00DF89]/10 focus:border-[#00DF89] transition-all"
              />
            </div>

            {/* Date Filters */}
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 h-9 rounded-xl text-[11px] font-semibold text-slate-600">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer text-slate-700 font-bold"
              />
              <span className="text-slate-300">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer text-slate-700 font-bold"
              />
              {(startDate || endDate) && (
                <button 
                  onClick={() => { setStartDate(''); setEndDate(''); }}
                  className="text-rose-500 hover:text-rose-600 font-black text-[10px] ml-2 border-l border-slate-200 pl-2 cursor-pointer transition"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Status dropdown */}
            <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-250 px-2.5 py-1.5 h-9 rounded-xl text-xs font-semibold text-slate-600">
              <Filter className="h-3.5 w-3.5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer pr-1"
              >
                <option value="all">All Statuses</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Date range active summary banner */}
        {(startDate || endDate) && (
          <div className="bg-emerald-50/40 border border-emerald-100/60 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition duration-300">
            <div className="flex items-center space-x-3 text-xs font-semibold text-slate-700">
              <span className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="text-slate-900 font-extrabold">Active Date Range Filter Applied</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Found <strong className="text-slate-800 font-black">{totalCount} transaction(s)</strong> between{' '}
                  <strong className="text-slate-850 font-black">{startDate ? new Date(startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Beginning'}</strong> and{' '}
                  <strong className="text-slate-850 font-black">{endDate ? new Date(endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today'}</strong>.
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right bg-white border border-slate-100 px-4 py-2 rounded-xl shadow-sm self-start sm:self-auto min-w-[120px]">
              <span className="text-[9px] text-slate-400 font-black block uppercase tracking-wider">Filtered Revenue</span>
              <span className="text-sm font-black text-emerald-500 mt-0.5 block">₹{filteredTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

        {/* Ledger Table */}
        <div className="overflow-x-auto no-scrollbar">
          {filteredTxns.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <p className="text-xs text-slate-400 font-bold">No transactions found matching your criteria.</p>
            </div>
          ) : (
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-extrabold uppercase tracking-wider">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Gym & Partner</th>
                  <th className="px-6 py-4">SaaS Tier</th>
                  <th className="px-6 py-4">Payment Method</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-650 font-semibold">
                {filteredTxns.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-slate-700 bg-slate-100/70 px-2 py-1 rounded-md text-[10px]">
                        {txn.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-extrabold text-slate-800">{txn.gymName}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">Owner: {txn.ownerName}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-bold">{txn.planName}</td>
                    <td className="px-6 py-4 text-slate-500">{txn.method}</td>
                    <td className="px-6 py-4 text-[#00DF89] font-black">₹{txn.amount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(txn.date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                      <span className="text-[10px] block mt-0.5 text-slate-400 font-normal">
                        {new Date(txn.date).toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                        txn.status === 'success'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        className={`p-1.5 rounded-lg border transition ${
                          txn.status === 'success'
                            ? 'text-slate-400 hover:text-slate-700 border-slate-200 bg-slate-50 hover:bg-slate-100'
                            : 'text-slate-300 border-slate-100 bg-slate-50/50 cursor-not-allowed'
                        }`}
                        disabled={txn.status !== 'success'}
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
