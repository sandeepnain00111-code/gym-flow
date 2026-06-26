'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import api from '../../../lib/api';
import Spinner from '../../../components/ui/Spinner';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Dumbbell, CalendarRange } from 'lucide-react';

export default function PublicGymLanding() {
  const { slug } = useParams();
  const [gym, setGym] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGymData = async () => {
      try {
        const res = await api.get(`/public/gym/${slug}`);
        if (res.data.success) {
          setGym(res.data.gym);
          setPlans(res.data.plans);
        }
      } catch (err) {
        setError('Gym details not found or inactive');
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchGymData();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-transparent min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !gym) {
    return (
      <div className="bg-transparent min-h-screen flex flex-col justify-between gap-4">
        <Navbar />
        <div className="max-w-md mx-auto py-20 px-6 text-center">
          <Dumbbell className="h-14 w-14 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Gym Not Found</h2>
          <p className="text-gray-400 text-sm mb-6">{error || 'The requested gym details could not be retrieved.'}</p>
          <Link href="/gyms" className="bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold px-6 py-2.5 rounded-full text-xs transition">
            Browse Other Gyms
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-transparent min-h-screen flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Hero Header Cover image */}
      <div className="h-[300px] sm:h-[400px] w-full relative">
        <img
          src={gym.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop'}
          alt={gym.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/50 to-transparent" />
        <div className="absolute bottom-6 left-0 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              {gym.logo ? (
                <img
                  src={gym.logo}
                  alt={`${gym.name} Logo`}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-500/20 bg-gray-950"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-2xl">
                  {gym.name.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white">{gym.name}</h1>
                <p className="text-gray-400 text-xs sm:text-sm flex items-center mt-1">
                  <MapPin className="h-4 w-4 text-emerald-400 mr-1 flex-shrink-0" />
                  {gym.address}, {gym.city}, {gym.state}
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <Link
                href={`/gym/${gym.slug}/demo`}
                className="glass-card hover:bg-white/10 text-white font-bold py-2.5 px-5 rounded-full text-xs border border-white/10 flex items-center space-x-1.5 transition"
              >
                <CalendarRange className="h-4 w-4 text-emerald-400" />
                <span>Book Free Trial</span>
              </Link>
              <Link
                href={`/gym/${gym.slug}/join`}
                className="bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold py-2.5 px-6 rounded-full text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-500/10 transition transform hover:scale-105"
              >
                <Dumbbell className="h-4 w-4" />
                <span>Join Now</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Gym details and facilities */}
        <div className="lg:col-span-2 space-y-8">
          {/* About section */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/5">
            <h2 className="text-lg font-bold text-white mb-4">About Gym</h2>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {gym.description || 'Welcome to Iron Forge Gym, equipped with premium facilities, cardio split sections, personal lockers, and certified trainers focused on your body transformations.'}
            </p>
          </div>

          {/* Facilities list */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/5">
            <h2 className="text-lg font-bold text-white mb-4">Core Facilities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {gym.facilities && gym.facilities.map((fac) => (
                <div key={fac} className="flex items-center space-x-2 text-xs text-gray-300 bg-white/3 py-2 px-3 rounded-xl border border-white/5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <span>{fac}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Membership plans */}
          <div>
            <h2 className="text-lg font-bold text-white mb-6">Select Membership Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div key={plan._id} className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col justify-between gap-4 hover:border-emerald-500/20">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {plan.durationInDays} Days Plan
                    </span>
                    <h3 className="text-base font-bold text-white mt-4">{plan.name}</h3>
                    {plan.description && (
                      <p className="text-gray-450 text-[11px] leading-relaxed mt-2 line-clamp-3">
                        {plan.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-6">
                    <p className="text-xl font-extrabold text-white">₹{plan.price}</p>
                    <Link
                      href={`/gym/${gym.slug}/join?plan=${plan._id}`}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold py-2 rounded-xl text-center text-xs mt-4 block transition"
                    >
                      Choose Plan
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Timing / Location / Quick Contact */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-6">
            <h3 className="text-base font-bold text-white">Operational Hours</h3>
            <div className="flex items-center justify-between gap-4 text-xs text-gray-300 border-b border-white/5 pb-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-emerald-400" />
                <span>Opening Time</span>
              </div>
              <span className="font-semibold">{gym.openingTime}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-xs text-gray-300 pb-1">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-emerald-400" />
                <span>Closing Time</span>
              </div>
              <span className="font-semibold">{gym.closingTime}</span>
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-6">
            <h3 className="text-base font-bold text-white">Contact & Support</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-xs text-gray-300">
                <Phone className="h-4.5 w-4.5 text-emerald-400 flex-shrink-0" />
                <span>{gym.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-gray-300">
                <Mail className="h-4.5 w-4.5 text-emerald-400 flex-shrink-0" />
                <span className="break-all">{gym.email}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
