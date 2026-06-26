'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CollapsibleDescription from '../components/ui/CollapsibleDescription';
import { useAuthStore } from '../store/authStore';
import {
  QrCode,
  Users,
  Dumbbell,
  TrendingUp,
  ShieldCheck,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Play
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const { isAuthenticated, user } = useAuthStore();

  const features = [
    {
      title: 'QR Code Attendance',
      description: 'Members simply scan the unique desk QR code to instantly log their daily attendance checks. No manual logs.',
      icon: QrCode,
      color: 'text-emerald-400'
    },
    {
      title: 'Unified Gym Portal',
      description: 'Supervise member fees, view billing approvals, schedule day-wise workout tables, diet blueprints, and trainer rosters.',
      icon: Dumbbell,
      color: 'text-orange-400'
    },
    {
      title: 'Discord-like Chat',
      description: 'Interact with owners, staff trainers, and gym peers in real-time general gym chat channels powered by Socket.io.',
      icon: MessageCircle,
      color: 'text-cyan-400'
    },
    {
      title: 'Manual UPI Approvals',
      description: 'Say goodbye to expensive gateways! Members upload UPI transaction reference screenshots for instant manual owner approval.',
      icon: TrendingUp,
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="bg-white min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Neon Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-500/10 blur-[60px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] rounded-full bg-emerald-700/10 blur-[80px] pointer-events-none" />

      <Navbar />

      {/* Hero Section */}
      <section className="min-h-0 w-full relative z-10 flex flex-col items-center justify-center overflow-hidden pt-28 pb-10 md:pt-24 lg:pt-28 lg:pb-16 xl:pt-36 xl:pb-28">
        {/* Background Image Layer with Heavy Slate Tint to match Figma */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-scroll"
          style={{ backgroundImage: "url('/bg-hero-new.png')" }}
        />
        <div className="absolute inset-0 z-0 bg-[#f8f9fc]/95" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow flex items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-4 lg:gap-8 xl:gap-12 items-center w-full">
            
            {/* Left Content */}
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-100/60 text-xs text-emerald-800 font-bold mb-6 tracking-wide uppercase shadow-sm border border-emerald-200/50"
              >
                NEXT-GEN GYM OS
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-[40px] lg:text-[60px] xl:text-[5rem] font-extrabold tracking-tight text-[#0f172a] mb-6 leading-[1.05] w-full max-w-[310px] sm:max-w-2xl mx-auto md:max-w-none"
              >
                One QR. <br className="hidden md:inline" />Complete Gym <br className="hidden md:inline" />Management.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-slate-600 text-lg w-full max-w-[310px] sm:max-w-2xl mx-auto md:max-w-lg md:mx-0 mb-10 leading-relaxed font-medium"
              >
                Streamline operations, engage members, and track performance with the industry's most advanced athletic SaaS platform.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full max-w-sm md:max-w-none mx-auto md:mx-0 md:w-auto"
              >
                {isAuthenticated ? (
                  <Link
                    href={
                      user?.role === 'super_admin'
                        ? '/admin/dashboard'
                        : user?.role === 'gym_owner'
                        ? '/owner/dashboard'
                        : '/member/dashboard'
                    }
                    className="w-full md:w-auto bg-[#047857] hover:bg-[#065f46] text-white font-semibold px-4 lg:px-8 py-3.5 rounded-full text-base transition flex items-center justify-center shadow-lg shadow-emerald-900/20"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/register?role=gym_owner"
                    className="w-full md:w-auto bg-[#047857] hover:bg-[#065f46] text-white font-semibold px-4 lg:px-8 py-3.5 rounded-full text-base transition flex items-center justify-center shadow-lg shadow-emerald-900/20"
                  >
                    Launch Your Gym
                  </Link>
                )}
                <button
                  className="w-full md:w-auto bg-white hover:bg-slate-50 text-slate-900 font-semibold px-4 lg:px-8 py-3.5 rounded-full text-base transition flex items-center justify-center space-x-2 border border-slate-200 shadow-sm"
                >
                  <Play className="h-5 w-5 text-slate-700" />
                  <span>Watch Demo</span>
                </button>
              </motion.div>
            </div>

            {/* Right Phone Mockup */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-[340px] mx-auto md:ml-auto md:mr-8 mt-12 md:mt-0 transition-all duration-300 md:scale-[0.78] lg:scale-[0.88] xl:scale-100 origin-center md:origin-right"
            >
              {/* Decorative shapes */}
              <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-100/50 rounded-2xl rotate-12 z-0 border-4 border-white shadow-sm backdrop-blur-md"></div>
              
              {/* Phone Frame */}
              <div className="relative z-10 bg-[#2d3748] p-3.5 rounded-[3rem] shadow-2xl shadow-slate-900/20 border-4 border-[#1a202c]">
                <div className="bg-white rounded-[2.5rem] overflow-hidden h-[620px] flex flex-col relative">
                  
                  {/* Phone Header */}
                  <div className="p-6 pb-2 pt-8">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Welcome Back</p>
                    <div className="flex justify-between gap-4 items-center">
                      <h3 className="text-xl font-bold text-slate-900">Alex Johnson</h3>
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Users className="w-4 h-4 text-[#047857]" />
                      </div>
                    </div>
                  </div>

                  {/* Focus Card */}
                  <div className="px-6 py-4">
                    <div className="bg-[#1e293b] rounded-2xl p-5 text-white shadow-lg">
                      <div className="inline-block px-2.5 py-1 bg-[#047857] text-white text-[10px] font-bold rounded mb-3 tracking-wide">
                        TODAY'S FOCUS
                      </div>
                      <h4 className="text-lg font-bold mb-1 text-white">Hypertrophy Chest</h4>
                      <p className="text-xs text-slate-300 mb-5">Coach Marcus</p>
                      <button className="w-full py-2.5 bg-[#047857] hover:bg-[#065f46] rounded-xl text-sm font-semibold transition">
                        Start Session
                      </button>
                    </div>
                  </div>

                  {/* Grid Actions */}
                  <div className="px-6 py-2 grid grid-cols-2 gap-4">
                    <div className="bg-[#f1f5f9] rounded-2xl p-4 py-5 flex flex-col items-center justify-center text-center shadow-sm">
                      <QrCode className="w-6 h-6 text-[#047857] mb-2" />
                      <span className="text-[11px] font-semibold text-slate-700">QR Access</span>
                    </div>
                    <div className="bg-[#f1f5f9] rounded-2xl p-4 py-5 flex flex-col items-center justify-center text-center shadow-sm">
                      <Dumbbell className="w-6 h-6 text-[#047857] mb-2" />
                      <span className="text-[11px] font-semibold text-slate-700">Book Class</span>
                    </div>
                  </div>

                  {/* Chat Snippet */}
                  <div className="px-6 py-4 mt-auto mb-10">
                    <div className="flex items-center space-x-3 bg-white border border-slate-100 shadow-sm p-3.5 rounded-2xl">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-slate-900 truncate">Marcus Stone</p>
                        <p className="text-[10px] text-slate-500 truncate">"Ready for that PR today?"</p>
                      </div>
                      <MessageCircle className="w-4 h-4 text-[#047857] flex-shrink-0" />
                    </div>
                  </div>

                  {/* Phone Bottom Icons */}
                  <div className="h-14 border-t border-slate-100 flex items-center justify-around px-6 absolute bottom-0 w-full bg-white">
                    <div className="w-5 h-5 rounded-sm bg-[#047857]"></div>
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
                    <div className="w-5 h-5 rounded-sm border-2 border-slate-300"></div>
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
                  </div>
                </div>
              </div>

              {/* Floating Widget */}
              <div className="absolute -right-16 bottom-28 z-20 bg-white p-4 py-5 rounded-xl shadow-2xl border border-slate-100 flex items-center space-x-4 w-64">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-[#047857]" />
                </div>
                <div className="flex-1 w-full">
                  <div className="flex justify-between gap-4 items-end mb-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Live Capacity</p>
                    <p className="text-sm font-extrabold text-slate-900">84%</p>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full">
                    <div className="w-[84%] h-full bg-[#047857] rounded-full"></div>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Flow Features */}
      <section
        id="features"
        className="pt-10 pb-28 md:pt-12 relative z-10 border-t border-slate-200 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.95)), url('/bg-white-waves.png')" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 flex flex-col items-center">
            {/* Custom Brand Graphic: Barbell Image placed at the top of the heading */}
            <div className="w-full max-w-[550px] md:max-w-[850px] mx-auto mb-4 flex justify-center items-center px-4">
              <img 
                src="/weight-lifting-underline.png" 
                alt="Weight Lifting Accent" 
                className="w-full h-16 md:h-24 object-contain opacity-95 select-none pointer-events-none mix-blend-multiply" 
              />
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Advanced SaaS Ecosystem
            </h2>
            
            <p className="text-gray-600 text-sm max-w-md mx-auto">
              Fully loaded with high performance tools supporting the entire business flow of modern high-end gym networks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group relative bg-white shadow-xl shadow-gray-200/50 p-6 rounded-2xl border border-gray-200 flex flex-col items-start overflow-hidden hover:border-emerald-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-gray-200"
                >
                  {/* Modern premium background design: Glow Orb + Dot Grid Pattern */}
                  <div className="absolute inset-0 z-0">
                    {/* The soft glowing blurred color orb in the bottom-right corner, color-matched to feature */}
                    <div className={`absolute -right-12 -bottom-12 w-36 h-36 rounded-full blur-[40px] opacity-[0.12] group-hover:scale-125 group-hover:opacity-[0.18] transition-all duration-500 bg-current ${feat.color}`} />
                    
                    {/* A premium, modern faint dot grid pattern overlay */}
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                  </div>

                  <div className="relative z-10 w-full">
                    <div className={`p-3 rounded-xl bg-gray-50 border border-gray-200 mb-5 inline-block ${feat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feat.title}</h3>
                    <CollapsibleDescription 
                      className="text-gray-600 text-xs leading-relaxed"
                      text={feat.description}
                      limit={70}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Owner Benefits Section */}
      <section
        id="owner-benefits"
        className="py-28 relative z-10 border-t border-b border-slate-200 bg-[#f8fafc] overflow-hidden"
      >
        {/* Premium Light SaaS Dot Grid & Glow */}
        <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#64748b 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-full z-0 pointer-events-none flex justify-between gap-4 opacity-60">
          <div className="w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-[100px] -ml-20 mt-10 animate-pulse"></div>
          <div className="w-[500px] h-[500px] bg-sky-100/50 rounded-full blur-[100px] -mr-20 mb-10"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Empower Your Fitness Business
            </h2>
            <p className="text-gray-600 text-sm max-w-md mx-auto">
              Everything a gym owner needs to scale operations, manage staff, and boost member retention seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white shadow-xl shadow-gray-200/50 p-8 rounded-3xl border border-gray-200 relative flex flex-col justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Operational Mastery</h3>
                <p className="text-gray-600 text-xs mb-6">Gain absolute control over your daily gym activities and staff management.</p>
                <ul className="space-y-3.5 text-xs text-gray-600 mb-8">
                  <li className="flex items-center space-x-2.5">
                    <ShieldCheck className="h-4.5 w-4.5 text-emerald-400 flex-shrink-0" />
                    <span>Comprehensive dashboard for daily analytics</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <ShieldCheck className="h-4.5 w-4.5 text-emerald-400 flex-shrink-0" />
                    <span>Seamless trainer roster and schedule management</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <ShieldCheck className="h-4.5 w-4.5 text-emerald-400 flex-shrink-0" />
                    <span>Real-time equipment maintenance tracking</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/register?role=gym_owner"
                className="w-full bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-900 font-bold py-3 px-6 rounded-full text-center text-xs transition"
              >
                Join as Owner
              </Link>
            </div>

            <div className="bg-white shadow-xl shadow-gray-200/50 p-8 rounded-3xl border-2 border-emerald-500/30 relative flex flex-col justify-between gap-4 shadow-emerald-950/20 shadow-2xl">
              <div className="absolute -top-3 right-6 bg-emerald-500 text-gray-900 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-widest shadow-md">
                Growth Focused
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Member Engagement</h3>
                <p className="text-gray-600 text-xs mb-6">Elevate the member experience to build loyalty and increase your revenue.</p>
                <ul className="space-y-3.5 text-xs text-gray-600 mb-8">
                  <li className="flex items-center space-x-2.5">
                    <ShieldCheck className="h-4.5 w-4.5 text-emerald-400 flex-shrink-0" />
                    <span>Automated attendance via QR scanning</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <ShieldCheck className="h-4.5 w-4.5 text-emerald-400 flex-shrink-0" />
                    <span>Direct community chat and announcement broadcasts</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <ShieldCheck className="h-4.5 w-4.5 text-emerald-400 flex-shrink-0" />
                    <span>Customized workout and diet plan assignments</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/register?role=gym_owner"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold py-3 px-6 rounded-full text-center text-xs transition"
              >
                Scale Your Gym
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}




