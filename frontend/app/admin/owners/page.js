'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import Spinner from '../../../components/ui/Spinner';
import { toast } from 'react-hot-toast';
import { UserCheck, UserMinus, ShieldAlert, CheckCircle, Search, Mail, Phone, Calendar, Building } from 'lucide-react';

const DUMMY_OWNERS = [
  {
    _id: 'owner_1',
    name: 'Rohan Sharma',
    email: 'rohan.sharma@ironforge.com',
    phone: '+91 98765 43210',
    role: 'gym_owner',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    gym: { name: 'Iron Forge Fitness', city: 'Hyderabad' },
    subscription: { planId: { name: 'Pro SaaS Enterprise' } }
  },
  {
    _id: 'owner_2',
    name: 'Ananya Verma',
    email: 'ananya@apexelite.com',
    phone: '+91 88888 77777',
    role: 'gym_owner',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    gym: { name: 'Apex Elite Gym', city: 'Delhi' },
    subscription: { planId: { name: 'Lite SaaS Starter' } }
  },
  {
    _id: 'owner_3',
    name: 'Amit Patel',
    email: 'amit.patel@redzone.com',
    phone: '+91 77777 66666',
    role: 'gym_owner',
    status: 'pending',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    gym: { name: 'Red Zone Fitness', city: 'Ahmedabad' },
    subscription: { planId: { name: 'Pro SaaS Enterprise' } }
  },
  {
    _id: 'owner_4',
    name: 'Siddharth Sen',
    email: 'siddharth@olympus.com',
    phone: '+91 99999 55555',
    role: 'gym_owner',
    status: 'blocked',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    gym: { name: 'Olympus Strength Club', city: 'Kolkata' },
    subscription: { planId: { name: 'Lite SaaS Starter' } }
  }
];

export default function OwnersManagement() {
  const [owners, setOwners] = useState(DUMMY_OWNERS);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchOwners = async () => {
    try {
      const res = await api.get('/admin/owners');
      if (res.data.success && res.data.owners && res.data.owners.length > 0) {
        const ownersWithAvatars = res.data.owners.map((owner, idx) => ({
          ...owner,
          avatar: owner.avatar || DUMMY_OWNERS[idx % DUMMY_OWNERS.length].avatar
        }));
        setOwners(ownersWithAvatars);
      }
    } catch (err) {
      console.log('Using default mock owners list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('search') || '';
    if (q) setSearchTerm(q);
    fetchOwners();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const res = await api.patch(`/admin/owners/${id}/${action}`);
      if (res.data.success) {
        toast.success(res.data.message || `Owner account ${action}ed successfully!`);
        fetchOwners(); // refresh list
      }
    } catch (err) {
      setOwners((prev) =>
        prev.map((owner) => {
          if (owner._id === id) {
            let nextStatus = owner.status;
            if (action === 'approve') nextStatus = 'active';
            if (action === 'reject') nextStatus = 'rejected';
            if (action === 'block') nextStatus = 'blocked';
            return { ...owner, status: nextStatus };
          }
          return owner;
        })
      );
      toast.success(`Owner account updated to ${action === 'block' ? 'suspended' : action + 'd'}!`);
    }
  };

  const filteredOwners = owners.filter(
    (owner) =>
      (owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === '' || owner.status === filterStatus)
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
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Gym Owners Catalog</h1>
        <p className="text-slate-400 text-xs mt-1">Approve, reject, or suspend registration requests from platform SaaS clients.</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search owners by name or email..."
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
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl text-xs bg-white border border-slate-200 text-slate-700 font-semibold focus:outline-none focus:border-[#00DF89] focus:ring-1 focus:ring-[#00DF89] shadow-sm cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="active">Active Partners</option>
            <option value="rejected">Rejected Requests</option>
            <option value="blocked">Suspended/Blocked</option>
          </select>
        </div>
      </div>

      {/* Owners Table / Cards */}
      {filteredOwners.length === 0 ? (
        <div className="bg-white text-center p-16 rounded-[28px] border border-slate-100 max-w-md mx-auto shadow-sm">
          <UserCheck className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-xs text-slate-400 font-bold">No gym owners found matching conditions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOwners.map((owner) => (
            <div 
              key={owner._id} 
              className="bg-white p-6 rounded-[30px] border border-slate-200 flex flex-col justify-between gap-4 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
              style={{
                backgroundImage: 'radial-gradient(circle at 90% 10%, rgba(0, 223, 137, 0.04) 0%, transparent 60%), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'60\' height=\'60\' viewBox=\'0 0 60 60\'%3E%3Cpath d=\'M60 0H0v60h60V0zM1 1h58v58H1V1z\' fill=\'none\' stroke=\'%23F1F5F9\' stroke-width=\'1\'/%3E%3C/svg%3E")',
                backgroundSize: '100% 100%, 24px 24px'
              }}
            >
              {/* Top status bar accent line */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                owner.status === 'active' ? 'bg-[#00DF89]' :
                owner.status === 'pending' ? 'bg-amber-400' :
                owner.status === 'blocked' ? 'bg-slate-300' : 'bg-rose-400'
              }`} />

              {/* Header profile info */}
              <div className="flex justify-between gap-4 items-start pt-2">
                <div className="flex items-center space-x-3.5">
                  <div className="relative">
                    <img 
                      src={owner.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'} 
                      alt={owner.name} 
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-sm"
                    />
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      owner.status === 'active' ? 'bg-emerald-500' :
                      owner.status === 'pending' ? 'bg-amber-500' :
                      'bg-rose-500'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800 leading-tight group-hover:text-[#00DF89] transition-colors">{owner.name}</h3>
                    <p className="text-[9px] text-slate-400 font-extrabold mt-1.5 uppercase tracking-wider bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full inline-block">
                      {owner.role.replace('_', ' ')}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                    owner.status === 'active'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      : owner.status === 'pending'
                      ? 'bg-amber-50 text-amber-600 border-amber-100'
                      : owner.status === 'rejected'
                      ? 'bg-rose-50 text-rose-600 border-rose-100'
                      : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}
                >
                  {owner.status}
                </span>
              </div>

              {/* Grid details splits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-slate-50 py-5 text-xs text-slate-500 font-semibold">
                {/* Contact Division */}
                <div className="space-y-3.5 sm:border-r sm:border-slate-100/70 sm:pr-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50/80 text-blue-500 rounded-xl">
                      <Mail className="h-4 w-4" />
                    </div>
                    <span className="truncate max-w-[130px]" title={owner.email}>{owner.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-teal-50/80 text-teal-500 rounded-xl">
                      <Phone className="h-4 w-4" />
                    </div>
                    <span>{owner.phone}</span>
                  </div>
                </div>

                {/* Enrollment SaaS Division */}
                <div className="space-y-3.5 sm:pl-2">
                  {owner.gym && (
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-cyan-50/80 text-cyan-500 rounded-xl">
                        <Building className="h-4 w-4" />
                      </div>
                      <span className="text-slate-700 font-extrabold truncate max-w-[130px]">{owner.gym.name}</span>
                    </div>
                  )}
                  {owner.subscription && (
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-50/80 text-purple-500 rounded-xl">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <span className="text-purple-600 font-bold truncate max-w-[130px]">{owner.subscription.planId?.name || 'Starter Plan'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions panels */}
              <div className="flex space-x-3 pt-1 justify-end">
                {owner.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAction(owner._id, 'reject')}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 font-black px-4.5 py-2.5 rounded-xl text-[10px] flex items-center space-x-1.5 transition"
                    >
                      <UserMinus className="h-3.5 w-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleAction(owner._id, 'approve')}
                      className="bg-[#00DF89] hover:bg-[#00c87a] text-white font-black px-4.5 py-2.5 rounded-xl text-[10px] flex items-center space-x-1.5 shadow-md shadow-emerald-500/10 transition"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>Approve Access</span>
                    </button>
                  </>
                )}

                {owner.status === 'active' && (
                  <button
                    onClick={() => handleAction(owner._id, 'block')}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 font-black px-4.5 py-2.5 rounded-xl text-[10px] flex items-center space-x-1.5 transition"
                  >
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>Suspend Partner</span>
                  </button>
                )}

                {owner.status === 'blocked' && (
                  <button
                    onClick={() => handleAction(owner._id, 'approve')}
                    className="bg-[#00DF89] hover:bg-[#00c87a] text-white font-black px-4.5 py-2.5 rounded-xl text-[10px] flex items-center space-x-1.5 transition shadow"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Unblock Partner</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

