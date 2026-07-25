'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import Spinner from '../../../components/ui/Spinner';
import { CreditCard, FileText, CheckCircle2, AlertCircle, Calendar, ShieldCheck, MapPin, Receipt } from 'lucide-react';

export default function MembershipHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        // Backend endpoint: GET /api/member/payments
        const res = await api.get('/member/payments');
        if (res.data.success) {
          setPayments(res.data.payments || []);
        }
      } catch (err) {
        console.error('Failed to load payment history:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Receipt className="h-7 w-7 text-emerald-650" />
          <span>Membership Joins & Invoices</span>
        </h1>
        <p className="text-slate-500 text-xs mt-1">Review your registered billing transactions, active passes, and payment receipts status.</p>
      </div>

      {payments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {payments.map((invoice) => {
            const isPaid = invoice.status === 'paid' || invoice.status === 'approved';
            const payDate = new Date(invoice.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div
                key={invoice._id}
                className="bg-white p-6 rounded-3xl border border-slate-100 relative overflow-hidden shadow-md shadow-slate-100/50 flex flex-col justify-between gap-4"
              >
                {/* Visual side accent */}
                <div className={`absolute top-0 left-0 w-1.5 h-full ${isPaid ? 'bg-emerald-500' : 'bg-amber-500'}`} />

                <div className="space-y-4">
                  {/* Gym Details */}
                  <div className="flex justify-between gap-4 items-start">
                    <div className="space-y-1 pl-1">
                      <h3 className="text-sm font-black text-slate-800">{invoice.gymId?.name}</h3>
                      <p className="text-slate-400 text-[10px] flex items-center gap-1.5 font-bold">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span>{invoice.gymId?.city || 'Partner Gym Location'}</span>
                      </p>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        isPaid
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse'
                      }`}
                    >
                      {isPaid ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Approved</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3" />
                          <span>Pending Approval</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Transaction specs */}
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/30 text-xs">
                    <div>
                      <p className="text-[10px] text-slate-450 uppercase font-semibold">Subscribed Fee</p>
                      <p className="font-extrabold text-slate-800 mt-0.5">₹{invoice.amount}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-455 uppercase font-semibold">Billing Mode</p>
                      <p className="font-extrabold text-slate-850 mt-0.5 uppercase tracking-wide">{invoice.mode || 'Cash'}</p>
                    </div>
                  </div>

                  {/* Date details */}
                  <div className="flex items-center justify-between gap-4 text-[10px] text-slate-500 font-semibold border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>Purchased: {payDate}</span>
                    </div>
                    {invoice.transactionId && (
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-bold font-mono">
                        TXN: {invoice.transactionId.substring(0, 10)}...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center space-y-4 shadow-sm shadow-slate-100/50 max-w-xl mx-auto">
          <FileText className="h-12 w-12 text-slate-300 mx-auto animate-bounce" />
          <h3 className="text-base font-bold text-slate-800">No Past Joins History</h3>
          <p className="text-slate-400 text-xs max-w-sm mx-auto">
            You don't have any past active or pending gym checkouts recorded. Join a local fitness franchise by scanning their dashboard link!
          </p>
        </div>
      )}
    </div>
  );
}
