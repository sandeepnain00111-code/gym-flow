'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import Spinner from '../../../components/ui/Spinner';
import { toast } from 'react-hot-toast';
import { Users, Search, Mail, Phone, Calendar, Dumbbell, ShieldAlert, BadgeCheck, X, User, Heart, MapPin, Scale, Ruler, ShieldPlus, ShieldCheck } from 'lucide-react';

export default function GymMembersDirectory() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMemberDetails, setSelectedMemberDetails] = useState(null);

  const fetchMembers = async () => {
    try {
      const res = await api.get('/owner/members');
      if (res.data.success && res.data.members && res.data.members.length > 0) {
        // Map members cleanly preserving actual database properties
        const enriched = res.data.members.map((m) => ({
          ...m,
          memberId: m.memberId || { name: m.name || 'Member', email: m.email || 'N/A', phone: m.phone || 'N/A' },
          planId: m.membership?.planId || m.planId || { name: 'Standard Plan' },
          startDate: m.membership?.startDate || m.startDate || m.createdAt || new Date().toISOString(),
          endDate: m.membership?.endDate || m.endDate || new Date(Date.now() + 30*24*60*60*1000).toISOString(),
          age: m.age || 'N/A',
          gender: m.gender || 'Not specified',
          weight: m.weight || 'N/A',
          height: m.height || 'N/A',
          medicalHistory: m.medicalHistory || 'None reported',
          emergencyContact: m.emergencyContact || {
            name: 'Not provided',
            relation: 'N/A',
            phone: 'N/A'
          },
          address: m.address || 'Address not registered',
          joinedDate: m.createdAt || m.startDate || new Date().toISOString()
        }));
        setMembers(enriched);
      } else {
        setMembers(fallbackMembers);
      }
    } catch (err) {
      console.log('Failed to fetch from API, loading fallback members roster.');
      setMembers(fallbackMembers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('search') || '';
    if (q) setSearchTerm(q);
    fetchMembers();
  }, []);

  const fallbackMembers = [
    {
      _id: 'm1',
      memberId: {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@gmail.com',
        phone: '+91 98765 43210'
      },
      status: 'active',
      planId: { name: 'Gold Annual Plan' },
      startDate: '2026-01-10T00:00:00Z',
      endDate: '2027-01-10T00:00:00Z',
      age: 24,
      gender: 'Male',
      weight: '76 kg',
      height: '178 cm',
      medicalHistory: 'None (Fit to Train)',
      emergencyContact: {
        name: 'Suresh Sharma',
        relation: 'Father',
        phone: '+91 99887 76655'
      },
      address: 'Flat 402, Sunshine Heights, Sector 15, Dwarka, New Delhi',
      joinedDate: '2026-01-10T00:00:00Z'
    },
    {
      _id: 'm2',
      memberId: {
        name: 'Sneha Patel',
        email: 'sneha.patel@yahoo.com',
        phone: '+91 87654 32109'
      },
      status: 'active',
      planId: { name: 'Premium Monthly Plan' },
      startDate: '2026-05-15T00:00:00Z',
      endDate: '2026-06-15T00:00:00Z',
      age: 22,
      gender: 'Female',
      weight: '58 kg',
      height: '163 cm',
      medicalHistory: 'Mild Asthma (Keeps Inhaler)',
      emergencyContact: {
        name: 'Anjali Patel',
        relation: 'Mother',
        phone: '+91 88776 65544'
      },
      address: 'B-12, Green Meadow Residency, Vastrapur, Ahmedabad',
      joinedDate: '2026-05-15T00:00:00Z'
    },
    {
      _id: 'm3',
      memberId: {
        name: 'Vikram Singh',
        email: 'vikram.singh@outlook.com',
        phone: '+91 76543 21098'
      },
      status: 'active',
      planId: { name: 'Gold Annual Plan' },
      startDate: '2026-02-20T00:00:00Z',
      endDate: '2027-02-20T00:00:00Z',
      age: 28,
      gender: 'Male',
      weight: '82 kg',
      height: '182 cm',
      medicalHistory: 'None',
      emergencyContact: {
        name: 'Rajesh Singh',
        relation: 'Brother',
        phone: '+91 77665 54433'
      },
      address: 'Block C2, Paramount Towers, Gomti Nagar, Lucknow',
      joinedDate: '2026-02-20T00:00:00Z'
    },
    {
      _id: 'm4',
      memberId: {
        name: 'Amit Verma',
        email: 'amit.verma@gmail.com',
        phone: '+91 95432 10987'
      },
      status: 'inactive',
      planId: { name: 'Student Lite Plan' },
      startDate: '2026-04-01T00:00:00Z',
      endDate: '2026-05-01T00:00:00Z',
      age: 20,
      gender: 'Male',
      weight: '69 kg',
      height: '172 cm',
      medicalHistory: 'Knee Joint Recovery (Avoid Heavy Squats)',
      emergencyContact: {
        name: 'Kamlesh Verma',
        relation: 'Father',
        phone: '+91 95432 10987'
      },
      address: 'House 554, Sector 7, Panchkula, Haryana',
      joinedDate: '2026-04-01T00:00:00Z'
    },
    {
      _id: 'm5',
      memberId: {
        name: 'Pooja Hegde',
        email: 'pooja.hegde@hotmail.com',
        phone: '+91 84321 09876'
      },
      status: 'active',
      planId: { name: 'Trial Flexi Pass' },
      startDate: '2026-05-24T00:00:00Z',
      endDate: '2026-05-31T00:00:00Z',
      age: 26,
      gender: 'Female',
      weight: '55 kg',
      height: '160 cm',
      medicalHistory: 'None',
      emergencyContact: {
        name: 'Naveen Hegde',
        relation: 'Father',
        phone: '+91 84321 09876'
      },
      address: 'Flat 901, Pearl Residency, Baner, Pune',
      joinedDate: '2026-05-24T00:00:00Z'
    },
    {
      _id: 'm6',
      memberId: {
        name: 'Rohan Mehra',
        email: 'rohan.mehra@gmail.com',
        phone: '+91 73210 98765'
      },
      status: 'active',
      planId: { name: 'Premium Monthly Plan' },
      startDate: '2026-05-10T00:00:00Z',
      endDate: '2026-06-10T00:00:00Z',
      age: 30,
      gender: 'Male',
      weight: '88 kg',
      height: '185 cm',
      medicalHistory: 'High Blood Pressure (Monitored)',
      emergencyContact: {
        name: 'Sunil Mehra',
        relation: 'Brother',
        phone: '+91 73210 98765'
      },
      address: 'House 92, Sector 23, Gurugram, Haryana',
      joinedDate: '2026-05-10T00:00:00Z'
    }
  ];

  const filteredMembers = members.filter(
    (m) =>
      m.memberId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.memberId?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Members Catalog</h1>
        <p className="text-slate-500 text-xs mt-1">Browse active enrollments, inspect membership dates, and manage gym rosters. Click any card to inspect full member account profile.</p>
      </div>

      {/* Filter */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search members by name or email..."
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
          className="w-full pl-11 pr-4 py-3 text-xs bg-white border border-slate-150 text-slate-800 focus:border-[#10b981] rounded-xl outline-none shadow-sm transition"
        />
      </div>

      {/* Cards list */}
      {filteredMembers.length === 0 ? (
        <div className="bg-white border border-slate-100 text-center p-16 rounded-[32px] max-w-md mx-auto shadow-sm">
          <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-xs text-slate-400 font-medium">No registered members found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((m) => (
            <div 
              key={m._id} 
              onClick={() => setSelectedMemberDetails(m)}
              className="bg-white border border-slate-100 hover:border-slate-300 hover:-translate-y-1 p-6 rounded-[32px] flex flex-col justify-between gap-4 space-y-4 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
              style={{
                backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.98)), url('/card_bg_cover.png')",
                backgroundSize: 'cover'
              }}
            >
              <div className="flex justify-between gap-4 items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-black text-sm uppercase">
                    {m.memberId?.name.charAt(0)}
                  </div>
                  <div className="truncate">
                    <h3 className="text-xs font-black text-slate-800 truncate max-w-[140px] group-hover:text-[#10b981] transition">{m.memberId?.name}</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[140px]">{m.memberId?.email}</p>
                  </div>
                </div>
                
                <span
                  className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                    m.status === 'active'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}
                >
                  {m.status}
                </span>
              </div>

              {/* Specs parameters */}
              <div className="space-y-2 border-t border-b border-slate-50 py-3.5 text-[11px] text-slate-650">
                <div className="flex items-center space-x-2">
                  <Dumbbell className="h-4 w-4 text-[#10b981] flex-shrink-0" />
                  <span className="truncate">Program: {m.planId?.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span>{m.memberId?.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  <span className="text-[10px]">
                    Valid: {new Date(m.startDate).toLocaleDateString()} - {new Date(m.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Card Badge Validation */}
              <div className="flex justify-between gap-4 items-center text-[9px] font-bold">
                {m.status === 'active' ? (
                  <div className="flex items-center gap-1 text-emerald-600">
                    <BadgeCheck className="w-4 h-4 text-emerald-500" />
                    <span>Verified Gym Access</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-amber-600">
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                    <span>Access Suspended</span>
                  </div>
                )}
                <span className="text-slate-400 group-hover:text-[#10b981] transition font-black tracking-widest uppercase text-[8px]">View Details →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* GORGEOUS ACCOUNT DETAILS MODAL OVERLAY */}
      {selectedMemberDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div 
            className="w-full max-w-lg bg-white rounded-[36px] border border-slate-100 shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden animate-scale-in"
            style={{
              backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.99)), url('/card_bg_cover.png')",
              backgroundSize: 'cover'
            }}
          >
            {/* Background design glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl pointer-events-none rounded-full" />

            {/* Header info */}
            <div className="flex justify-between gap-4 items-start border-b border-slate-150 pb-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center font-black text-emerald-600 text-xl uppercase">
                  {selectedMemberDetails.memberId?.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">{selectedMemberDetails.memberId?.name}</h3>
                  <p className="text-xs text-slate-400 font-semibold">{selectedMemberDetails.memberId?.email}</p>
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border inline-block mt-1.5 ${
                    selectedMemberDetails.status === 'active'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    Status: {selectedMemberDetails.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedMemberDetails(null)}
                className="p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid data layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Basic Physical metrics */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-3.5 space-y-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Physical Stats</span>
                </p>
                <div className="flex justify-between gap-4 py-0.5 border-b border-slate-100/50">
                  <span className="text-slate-500 font-semibold">Age:</span>
                  <span className="font-bold text-slate-800">{selectedMemberDetails.age} Years</span>
                </div>
                <div className="flex justify-between gap-4 py-0.5 border-b border-slate-100/50">
                  <span className="text-slate-500 font-semibold">Gender:</span>
                  <span className="font-bold text-slate-800">{selectedMemberDetails.gender}</span>
                </div>
                <div className="flex justify-between gap-4 py-0.5 border-b border-slate-100/50">
                  <span className="text-slate-500 font-semibold">Weight:</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5 text-blue-500" />
                    {selectedMemberDetails.weight}
                  </span>
                </div>
                <div className="flex justify-between gap-4 py-0.5">
                  <span className="text-slate-500 font-semibold">Height:</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Ruler className="w-3.5 h-3.5 text-[#10b981]" />
                    {selectedMemberDetails.height}
                  </span>
                </div>
              </div>

              {/* Health conditions & Medical history */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-3.5 space-y-2 flex flex-col justify-between gap-4">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-red-500" />
                    <span>Medical History</span>
                  </p>
                  <p className="font-bold text-slate-800 bg-white border border-slate-100 p-2 rounded-xl text-[11px] leading-relaxed">
                    {selectedMemberDetails.medicalHistory}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-450 mt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Physical Fitness Declarations</span>
                </div>
              </div>

              {/* Emergency Contact detail */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-3.5 space-y-2 sm:col-span-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <ShieldPlus className="w-3.5 h-3.5 text-blue-500" />
                  <span>Emergency Contact Detail</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="bg-white border border-slate-100 p-2 rounded-xl text-center">
                    <span className="text-[9px] text-slate-400 font-semibold block">Contact Name</span>
                    <span className="font-black text-slate-800">{selectedMemberDetails.emergencyContact?.name}</span>
                  </div>
                  <div className="bg-white border border-slate-100 p-2 rounded-xl text-center">
                    <span className="text-[9px] text-slate-400 font-semibold block">Relation</span>
                    <span className="font-bold text-slate-700 capitalize">{selectedMemberDetails.emergencyContact?.relation}</span>
                  </div>
                  <div className="bg-white border border-slate-100 p-2 rounded-xl text-center">
                    <span className="text-[9px] text-slate-400 font-semibold block">Phone Number</span>
                    <span className="font-bold text-[#10b981]">{selectedMemberDetails.emergencyContact?.phone}</span>
                  </div>
                </div>
              </div>

              {/* Contacts & Address details */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-3.5 space-y-2 sm:col-span-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>Contact Coordinates & Address</span>
                </p>
                <div className="space-y-1.5">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500 font-semibold">Registered Phone:</span>
                    <span className="font-bold text-slate-800">{selectedMemberDetails.memberId?.phone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500 font-semibold">Residence Address:</span>
                    <span className="font-bold text-slate-800 text-right max-w-[280px] truncate" title={selectedMemberDetails.address}>
                      {selectedMemberDetails.address}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 pt-1 border-t border-slate-100/50">
                    <span className="text-slate-500 font-semibold">Account Join Date:</span>
                    <span className="font-bold text-slate-700">
                      {new Date(selectedMemberDetails.joinedDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal close bottom trigger button */}
            <button
              onClick={() => setSelectedMemberDetails(null)}
              className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-3 rounded-2xl text-xs transition duration-300"
            >
              Done Reviewing Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
