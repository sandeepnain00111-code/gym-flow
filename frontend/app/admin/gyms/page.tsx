'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import Spinner from '../../../components/ui/Spinner';
import { toast } from 'react-hot-toast';
import { Building2, MapPin, Clock, Search, Dumbbell, Mail, Phone } from 'lucide-react';

const DUMMY_GYMS = [
  {
    _id: 'gym_1',
    name: 'Iron Forge Fitness',
    slug: 'iron-forge',
    address: 'Plot 45, Huda Heights, Jubilee Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    openingTime: '05:00 AM',
    closingTime: '11:00 PM',
    phone: '0402324567',
    email: 'ironforge@gmail.com',
    facilities: ['Air Conditioning', 'Free Parking', 'Steam Shower Bath', 'Personal Lockers', 'Premium Supplement Store']
  },
  {
    _id: 'gym_2',
    name: 'Apex Elite Gym',
    slug: 'apex-elite',
    address: 'Sector 54, Golf Course Road',
    city: 'Gurugram',
    state: 'Haryana',
    openingTime: '06:00 AM',
    closingTime: '10:00 PM',
    phone: '0124987654',
    email: 'apexelite@gmail.com',
    facilities: ['Strength Training Area', 'Cardio Deck', 'Certified Trainers', 'Nutritionist Support']
  },
  {
    _id: 'gym_3',
    name: 'Red Zone Fitness',
    slug: 'red-zone',
    address: 'CG Road, Above Apple Store',
    city: 'Ahmedabad',
    state: 'Gujarat',
    openingTime: '05:30 AM',
    closingTime: '10:30 PM',
    phone: '0794433221',
    email: 'redzone@gmail.com',
    facilities: ['Zumba Classes', 'Crossfit Section', 'Sauna Bath', 'Cafe Bar']
  }
];

export default function AdminGyms() {
  const [gyms, setGyms] = useState(DUMMY_GYMS);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('search') || '';
    if (q) setSearchTerm(q);

    const fetchGyms = async () => {
      try {
        const res = await api.get('/admin/gyms');
        if (res.data.success && res.data.gyms && res.data.gyms.length > 0) {
          setGyms(res.data.gyms);
        }
      } catch (err) {
        console.log('Using default mock gyms list');
      } finally {
        setLoading(false);
      }
    };
    fetchGyms();
  }, []);

  const filteredGyms = gyms.filter(
    (gym) =>
      gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gym.city.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Active Platform Gyms</h1>
        <p className="text-slate-400 text-xs mt-1">Audit registered fitness centers, locations, schedules, and active owners.</p>
      </div>

      {/* Filter */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search gyms by name or city..."
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

      {/* Grid */}
      {filteredGyms.length === 0 ? (
        <div className="bg-white text-center p-16 rounded-[28px] border border-slate-100 max-w-md mx-auto shadow-sm">
          <Building2 className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-xs text-slate-400 font-bold">No partner gyms found matching terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredGyms.map((gym) => (
            <div 
              key={gym._id} 
              className="bg-white p-6 rounded-[30px] border border-slate-200 flex flex-col justify-between gap-4 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
              style={{
                backgroundImage: 'radial-gradient(circle at 90% 10%, rgba(0, 223, 137, 0.04) 0%, transparent 60%), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'60\' height=\'60\' viewBox=\'0 0 60 60\'%3E%3Cpath d=\'M60 0H0v60h60V0zM1 1h58v58H1V1z\' fill=\'none\' stroke=\'%23F1F5F9\' stroke-width=\'1\'/%3E%3C/svg%3E")',
                backgroundSize: '100% 100%, 24px 24px'
              }}
            >
              {/* Top status bar accent line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-cyan-400" />
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 pt-2">
                  <div className="p-3 bg-emerald-50 border border-emerald-100 text-[#00DF89] rounded-2xl group-hover:bg-[#00DF89] group-hover:text-white transition-all duration-300 shadow-sm">
                    <Dumbbell className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800 leading-tight group-hover:text-[#00DF89] transition-colors">{gym.name}</h3>
                    <p className="text-[9px] text-slate-400 font-extrabold mt-1.5 uppercase tracking-wider bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full inline-block">
                      Slug: {gym.slug}
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5 border-t border-slate-50 pt-4 text-xs text-slate-500 font-semibold">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-50/80 text-blue-500 rounded-xl flex-shrink-0 mt-0.5">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <span className="leading-relaxed">{gym.address}, {gym.city}, {gym.state}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-teal-50/80 text-teal-500 rounded-xl flex-shrink-0">
                      <Clock className="h-4 w-4" />
                    </div>
                    <span>Hours: {gym.openingTime || '06:00 AM'} - {gym.closingTime || '10:00 PM'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-cyan-50/80 text-cyan-500 rounded-xl flex-shrink-0">
                      <Phone className="h-4 w-4" />
                    </div>
                    <span>{gym.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-50/80 text-purple-500 rounded-xl flex-shrink-0">
                      <Mail className="h-4 w-4" />
                    </div>
                    <span className="truncate max-w-[170px]">{gym.email || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {gym.facilities && gym.facilities.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {gym.facilities.map((fac) => (
                    <span key={fac} className="text-[8px] px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-500 uppercase font-black tracking-wide">
                      {fac}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

