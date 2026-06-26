'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import Spinner from '../../../components/ui/Spinner';
import { toast } from 'react-hot-toast';
import { Receipt, Search, CreditCard } from 'lucide-react';

const DUMMY_PAYMENTS = [
  {
    id: 'pay_1',
    ownerName: 'Rohan Sharma',
    gymName: 'Iron Forge Fitness',
    amount: 4999,
    status: 'active',
    date: '2026-05-01T00:00:00.000Z'
  },
  {
    id: 'pay_2',
    ownerName: 'Ananya Verma',
    gymName: 'Apex Elite Gym',
    amount: 2500,
    status: 'active',
    date: '2026-05-10T00:00:00.000Z'
  },
  {
    id: 'pay_3',
    ownerName: 'Amit Patel',
    gymName: 'Red Zone Fitness',
    amount: 4999,
    status: 'pending',
    date: '2026-05-25T00:00:00.000Z'
  }
];

export default function AdminPaymentsCatalog() {
  const [payments, setPayments] = useState(DUMMY_PAYMENTS);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('search') || '';
    if (q) setSearchTerm(q);

    const fetchPayments = async () => {
      try {
        const res = await api.get('/admin/owners'); // Reuse owner subscriptions details
        if (res.data.success && res.data.owners && res.data.owners.length > 0) {
          const list = res.data.owners
            .filter((o) => o.subscription)
            .map((o) => ({
              id: o.subscription._id,
              ownerName: o.name,
              gymName: o.gym?.name || 'SaaS partner gym',
              amount: o.subscription.amountPaid || 1499,
              status: o.subscription.status || 'active',
              date: o.subscription.startDate
            }));
          if (list.length > 0) {
            setPayments(list);
          }
        }
      } catch (err) {
        console.log('Using default mock payments list');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(
    (p) =>
      p.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.gymName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">SaaS Payments History</h1>
        <p className="text-slate-400 text-xs mt-1">Audit billing transactions log records across active platform owners.</p>
      </div>

      {/* Filter */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search transactions by owner or gym..."
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
          className="w-full pl-11 pr-4 py-3 text-xs bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#00DF89] focus:outline-none focus:ring-1 focus:ring-[#00DF89] rounded-2xl shadow-sm transition-all"
        />
      </div>

      {/* Table */}
      {filteredPayments.length === 0 ? (
        <div className="bg-white text-center p-16 rounded-[28px] border border-slate-100 max-w-md mx-auto shadow-sm">
          <Receipt className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-xs text-slate-400 font-bold">No payment transaction records matches.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[28px] border border-slate-150 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-extrabold uppercase tracking-wider">
                  <th className="px-6 py-4.5">SaaS Client</th>
                  <th className="px-6 py-4.5">Transaction Amount</th>
                  <th className="px-6 py-4.5">Channel Mode</th>
                  <th className="px-6 py-4.5">Payment Status</th>
                  <th className="px-6 py-4.5 text-right">Transaction Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-650 font-semibold">
                {filteredPayments.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4">
                      <p className="font-extrabold text-slate-800">{p.gymName}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">Owner: {p.ownerName}</p>
                    </td>
                    <td className="px-6 py-4 text-[#00DF89] font-black">₹{p.amount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1.5 text-slate-600">
                        <CreditCard className="h-4 w-4 text-slate-400" />
                        <span>Card/UPI Portal</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[9px] px-2.5 py-0.5 rounded-full border border-emerald-100 bg-emerald-50 text-emerald-600 font-extrabold uppercase tracking-wide">
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-400">
                      {new Date(p.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

