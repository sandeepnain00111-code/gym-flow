'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import Spinner from '../../../components/ui/Spinner';
import { MapPin, Phone, Mail, Clock, Receipt, ShieldCheck } from 'lucide-react';

export default function MyGymDetails() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGymDetails = async () => {
      try {
        const res = await api.get('/member/dashboard');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load member profile details:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGymDetails();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (data?.noMembership) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-100 max-w-lg mx-auto text-center space-y-4 shadow-md">
        <Receipt className="h-12 w-12 text-red-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800">No Gym Joined</h3>
        <p className="text-slate-400 text-xs">You have no active membership. Browse the active partner gyms list to join!</p>
      </div>
    );
  }

  const { membership } = data;
  const gym = membership.gymId;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{gym?.name}</h1>
        <p className="text-slate-500 text-xs mt-1">Gym location, operational specs, and your membership payment transactions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Contact & facilities */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-6 shadow-md shadow-slate-100/50">
            <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">Gym Profile Specs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 font-medium">
              <div className="flex items-center space-x-2.5">
                <MapPin className="h-4.5 w-4.5 text-emerald-600 flex-shrink-0" />
                <span>{gym?.address}, {gym?.city}, {gym?.state}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="h-4.5 w-4.5 text-emerald-600 flex-shrink-0" />
                <span>{gym?.phone}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="h-4.5 w-4.5 text-emerald-600 flex-shrink-0" />
                <span className="break-all">{gym?.email}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Clock className="h-4.5 w-4.5 text-emerald-600 flex-shrink-0" />
                <span>Hours: {gym?.openingTime} - {gym?.closingTime}</span>
              </div>
            </div>

            {gym?.facilities?.length > 0 && (
              <div className="border-t border-slate-100 pt-5 space-y-3">
                <h3 className="text-xs font-bold text-slate-800">Facilities Specifications</h3>
                <div className="flex flex-wrap gap-2">
                  {gym.facilities.map((fac) => (
                    <span key={fac} className="text-[10px] px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/50 text-slate-650 flex items-center space-x-1 font-bold">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{fac}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Fees Transaction Ledger */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-6 shadow-md shadow-slate-100/50">
            <h2 className="text-sm font-bold text-slate-800 flex items-center space-x-1.5 border-b border-slate-100 pb-3">
              <Receipt className="h-4.5 w-4.5 text-emerald-600" />
              <span>Billing Ledger</span>
            </h2>

            {/* Displaying payments list */}
            {membership.paymentHistory?.length > 0 ? (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar">
                {membership.paymentHistory.map((p, idx) => (
                  <div key={p._id || idx} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-2 hover:bg-slate-50 transition">
                    <div className="flex justify-between gap-4 items-center text-xs">
                      <span className="font-extrabold text-slate-800">₹{p.amount}</span>
                      <span
                        className={`text-[9px] uppercase font-black px-2 py-0.5 rounded border ${
                          p.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-orange-50 text-orange-700 border-orange-100'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4 text-[10px] text-slate-500 font-bold">
                      <span>Mode: {p.paymentMode}</span>
                      <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                    {p.transactionId && (
                      <p className="text-[9px] text-slate-400 font-bold font-mono break-all pt-2 border-t border-slate-200/50">Ref: {p.transactionId}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No payment logs cached in database ledger.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
