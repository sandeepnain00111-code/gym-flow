'use client';

import React, { useRef, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import CollapsibleDescription from '../../components/ui/CollapsibleDescription';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { 
  Target, 
  Eye, 
  Sparkles, 
  Dumbbell, 
  TrendingUp, 
  Users2, 
  Mail,
  ArrowRight,
  Check,
  ShieldCheck,
  Zap,
  Activity,
  Quote,
  Flame,
  Award
} from 'lucide-react';
import Link from 'next/link';

const LinkedinIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

// Scale-based Premium Card Component
function Card3D({ children, className, stripeBg }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      className={`relative rounded-[2.5rem] bg-white border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between gap-4 overflow-hidden cursor-pointer ${className}`}
    >
      {/* Colored Top Accent Stripe */}
      {stripeBg && <div className={`absolute left-0 right-0 top-0 h-1.5 ${stripeBg} z-20`} />}

      {/* Internal Content Container */}
      <div className="h-full flex flex-col justify-between gap-4 relative z-20">
        {children}
      </div>
    </motion.div>
  );
}

export default function AboutPage() {
  const stats = [
    { 
      number: "500+", 
      label: "Gyms Onboarded", 
      desc: "Across multiple states",
      icon: Dumbbell, 
      color: "text-emerald-500",
      stripeBg: "bg-emerald-500",
      glowColor: "hover:border-emerald-500/25 shadow-emerald-100/10"
    },
    { 
      number: "50K+", 
      label: "Active Members", 
      desc: "Daily active users",
      icon: Users2, 
      color: "text-blue-500",
      stripeBg: "bg-blue-500",
      glowColor: "hover:border-blue-500/25 shadow-blue-100/10"
    },
    { 
      number: "1M+", 
      label: "QR Scan Check-ins", 
      desc: "Zero hardware failure",
      icon: Sparkles, 
      color: "text-purple-500",
      stripeBg: "bg-purple-500",
      glowColor: "hover:border-purple-500/25 shadow-purple-100/10"
    },
    { 
      number: "99.9%", 
      label: "System Uptime", 
      desc: "SLA-backed cloud setup",
      icon: TrendingUp, 
      color: "text-orange-500",
      stripeBg: "bg-orange-500",
      glowColor: "hover:border-orange-500/25 shadow-orange-100/10"
    }
  ];

  const values = [
    {
      title: "Eliminate Friction",
      desc: "We believe in removing physical registers and administrative lag. Every interaction should resolve in milliseconds.",
      icon: Zap,
      color: "text-emerald-500",
      stripeBg: "bg-emerald-500",
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-100",
      glowColor: "hover:border-emerald-500/30 shadow-emerald-100/10"
    },
    {
      title: "Complete Control",
      desc: "Whether you manage one local branch or a national chain, our dashboards offer direct operational clarity.",
      icon: ShieldCheck,
      color: "text-blue-500",
      stripeBg: "bg-blue-500",
      badgeBg: "bg-blue-50 text-blue-700 border-blue-100",
      glowColor: "hover:border-blue-500/30 shadow-blue-100/10"
    },
    {
      title: "Continuous Innovation",
      desc: "From automatic UPI sheet scanning to interactive day-wise workout builders, we lead the industry feature set.",
      icon: Flame,
      color: "text-purple-500",
      stripeBg: "bg-purple-500",
      badgeBg: "bg-purple-50 text-purple-700 border-purple-100",
      glowColor: "hover:border-purple-500/30 shadow-purple-100/10"
    },
    {
      title: "Community Driven",
      desc: "Fitness is highly social. Our Socket.io powered instant chatrooms connect coaches, owners, and peers directly.",
      icon: Users2,
      color: "text-orange-500",
      stripeBg: "bg-orange-500",
      badgeBg: "bg-orange-50 text-orange-700 border-orange-100",
      glowColor: "hover:border-orange-500/30 shadow-orange-100/10"
    }
  ];



  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen flex flex-col relative overflow-hidden">
      
      <Navbar />

      {/* Premium White Mesh Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-scroll opacity-[0.96] pointer-events-none select-none"
        style={{ backgroundImage: "url('/bg-white-mesh.png')" }}
      />

      {/* Multi-layered soft white-tint gradient overlay to guarantee perfect text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/80 to-white/30 z-0 pointer-events-none" />

      {/* Beautiful 3D Floating Geometric Assets in background */}
      <motion.div 
        animate={{ 
          rotateX: [0, 360],
          rotateY: [360, 0],
          y: [0, -15, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute top-[20%] left-[8%] w-14 h-14 border-2 border-emerald-500/15 rounded-2xl pointer-events-none -z-10 hidden lg:block"
        style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
      />
      <motion.div 
        animate={{ 
          rotateX: [360, 0],
          rotateY: [0, 360],
          y: [0, 15, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[25%] right-[8%] w-16 h-16 border-2 border-teal-500/15 rounded-[1.5rem] pointer-events-none -z-10 hidden lg:block"
        style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
      />

      {/* Ambient spotlights behind main blocks */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[550px] rounded-full bg-emerald-100/40 blur-[130px] -z-10 pointer-events-none" />
      <div className="absolute top-10 right-10 w-[550px] h-[500px] rounded-full bg-teal-100/25 blur-[120px] -z-10 pointer-events-none" />

      {/* Hero Section */}
      <section className="pt-24 sm:pt-48 pb-10 sm:pb-20 relative z-10 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-6 max-w-4xl mx-auto flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-sm"
          >
            <Sparkles className="h-4 w-4 text-[#047857] animate-pulse" />
            <span className="text-[#047857] text-xs font-black tracking-widest uppercase">
              ABOUT GYMFLOW
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.05]"
          >
            Redefining the <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 bg-clip-text text-transparent">
              Fitness Ecosystem.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-xl text-slate-655 max-w-2xl mx-auto font-semibold leading-relaxed"
          >
            GymFlow is a high-performance SaaS platform engineered to unify gym owners, personal coaches, and members into a seamless digital workspace.
          </motion.p>

          {/* Majestic Holographic 3D Spinning Ring Visual Component */}
          <div className="pt-10 flex justify-center items-center pointer-events-none select-none">
            <motion.div 
              animate={{ 
                rotateY: 360,
                rotateX: [12, 28, 12]
              }}
              transition={{ 
                duration: 7, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="w-28 h-28 rounded-full border-4 border-emerald-500/20 border-t-emerald-600 border-r-teal-500 flex items-center justify-center shadow-lg relative"
              style={{ transformStyle: "preserve-3d", perspective: "800px" }}
            >
              <div className="absolute inset-2 rounded-full border border-dashed border-teal-500/30" />
              <Dumbbell className="h-8 w-8 text-[#047857] transform translate-z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Origin & Symmetrical Narrative Section */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Narrative Detail */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="space-y-4 flex flex-col items-center lg:items-start text-center lg:text-left">
              <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                Why We Built GymFlow
              </h2>
              <div className="h-1.5 w-24 bg-[#047857] rounded-full shadow-sm" />
            </div>
            
            <div className="space-y-6 text-slate-600 text-sm md:text-base leading-relaxed font-semibold text-center lg:text-left">
              <CollapsibleDescription 
                text="In early 2025, fitness management was fundamentally broken. Gym owners were struggling, juggling manual registers, offline bank transfers, and rigid legacy software. Personal trainers had no simple, professional way to distribute day-wise workout tables and food blueprints to clients, while members faced slow check-in queues and complex booking flows."
              />
              <CollapsibleDescription 
                text="We set out to create a unified software suite built on high-performance web APIs and real-time Socket.io connections. Today, GymFlow offers single-scan QR attendance scanners, automated subscription managers, interactive workout split builders, and integrated member chatrooms."
              />
              <CollapsibleDescription 
                className="text-[#047857] font-black border-l-4 border-[#047857] pl-4 bg-emerald-500/5 py-4 rounded-r-2xl shadow-sm border border-emerald-100"
                text="Our core philosophy is simple: Eliminate administrative overhead entirely, letting gym owners and elite trainers focus 100% on transforming lives."
              />
            </div>
          </motion.div>

          {/* Right Stats Grid / Swiper */}
          <div className="lg:col-span-5">
            {/* Mobile View: Continuous Infinite Marquee Ticker (below sm breakpoint) */}
            <div className="sm:hidden w-full overflow-hidden relative -mx-4 py-2 select-none pointer-events-none">
              {/* Fade masks at edges for extreme luxury overlay */}
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-slate-50 to-transparent z-10" />
              <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-slate-50 to-transparent z-10" />
              
              <div className="animate-marquee gap-4 flex flex-row">
                {[...stats, ...stats].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div 
                      key={idx}
                      className="w-[170px] flex-shrink-0 relative border border-slate-200/60 rounded-[1.3rem] bg-white p-4 shadow-sm overflow-hidden"
                    >
                      {/* Left accent stripe */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${stat.stripeBg}`} />
                      
                      <div className="space-y-3 relative z-10 pl-1.5">
                        <div className={`p-1.5 rounded-lg ${stat.color} w-fit bg-slate-50 border border-slate-100 shadow-inner`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        
                        <div className="space-y-0.5">
                          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">{stat.number}</h3>
                          <p className="text-[9px] font-black text-slate-800 uppercase tracking-wider leading-none">{stat.label}</p>
                          <p className="text-[8px] font-bold text-slate-400 leading-tight">{stat.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Desktop View: Grid (sm and above) */}
            <div className="hidden sm:grid grid-cols-2 gap-6" style={{ perspective: "1000px" }}>
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <Card3D 
                    key={idx}
                    stripeBg={stat.stripeBg}
                    className={`group p-6 h-full ${stat.glowColor}`}
                  >
                    <div className="space-y-6">
                      <motion.div 
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: idx * 0.3 }}
                        className={`p-3.5 rounded-2xl ${stat.color} w-fit bg-slate-50 border border-slate-100 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                      >
                        <Icon className="h-5 w-5" />
                      </motion.div>
                      
                      <div className="space-y-1">
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{stat.number}</h3>
                        <p className="text-xs font-black text-slate-805 uppercase tracking-wider">{stat.label}</p>
                        <p className="text-[10px] font-bold text-slate-450">{stat.desc}</p>
                      </div>
                    </div>
                  </Card3D>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Symmetrical Founder Spotlight Section with Mouse-Tracking 3D Parallax Card */}
      <section className="py-12 sm:py-24 bg-white/50 border-t border-b border-slate-200/60 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-16 max-w-2xl mx-auto">
            <span className="text-[#047857] text-xs font-black uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
              OUR FOUNDER
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">Meet the Architect</h2>
            <p className="text-slate-555 text-sm md:text-base font-semibold">
              The creative mind and technical director driving GymFlow SaaS forward.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch max-w-5xl mx-auto" style={{ perspective: "1200px" }}>
            
            {/* Left Symmetrical: Founder Portrait Card with mouse-tracking 3D tilt */}
            <div className="lg:col-span-5 flex">
              <Card3D 
                stripeBg="bg-emerald-500"
                className="w-full flex-grow group shadow-xl hover:border-emerald-500/25 transition-all duration-500"
              >
                <div className="relative h-[320px] w-full overflow-hidden bg-slate-100 flex items-center justify-center rounded-t-[2.4rem]">
                  <img 
                    src="/ceo.png" 
                    alt="Vikram Sharma - Founder & CEO" 
                    className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* 3D Gloss reflection sweep across portrait */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-85" />
                  
                  {/* Floating Tags structured in separate 3D z-axis layer */}
                  <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2" style={{ transform: "translateZ(30px)" }}>
                    <span className="bg-[#047857] text-white font-black text-[9px] tracking-widest uppercase px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <Award className="h-3 w-3 animate-pulse" /> FOUNDER & CEO
                    </span>
                    <span className="bg-white/95 text-slate-855 font-black text-[9px] px-3 py-1 rounded-full shadow-sm">
                      FitTech Architect
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-grow flex flex-col justify-between gap-4 bg-gradient-to-b from-white to-slate-50/30" style={{ transform: "translateZ(15px)" }}>
                  <div className="space-y-1">
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight">Vikram Sharma</h4>
                    <p className="text-xs font-black text-[#047857] uppercase tracking-widest">Founder, GymFlow SaaS</p>
                  </div>
                  
                  <p className="text-slate-555 text-xs leading-relaxed font-semibold">
                    A software engineer and dedicated fitness athlete. Vikram built the blueprint of GymFlow to revolutionize gym administration.
                  </p>

                  <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200/60">
                    <Link href="https://linkedin.com" className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-[#047857] hover:bg-emerald-50 transition duration-300 cursor-pointer">
                      <LinkedinIcon className="h-4 w-4" />
                    </Link>
                    <Link href="https://twitter.com" className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-[#047857] hover:bg-emerald-50 transition duration-300 cursor-pointer">
                      <TwitterIcon className="h-4 w-4" />
                    </Link>
                    <Link href="mailto:vikram@gymflow.com" className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-[#047857] hover:bg-emerald-50 transition duration-300 flex items-center gap-2 font-black text-[10px] cursor-pointer">
                      <Mail className="h-4 w-4 text-[#047857]" />
                      <span className="text-slate-650 hover:text-[#047857]">vikram@gymflow.com</span>
                    </Link>
                  </div>
                </div>
              </Card3D>
            </div>

            {/* Right Symmetrical: Founder Statement block */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-7 flex flex-col justify-between gap-4 space-y-8 lg:pl-4"
            >
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 md:p-10 shadow-lg space-y-6 flex-grow flex flex-col justify-center relative overflow-hidden bg-gradient-to-br from-white via-white to-emerald-50/20 hover:border-emerald-500/20 transition-all duration-350">
                <div className="absolute top-8 right-8 text-emerald-100/60">
                  <Quote className="h-16 w-16 transform rotate-180" />
                </div>
                
                <h3 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                  "SaaS should be invisible. It should just flow."
                </h3>
                
                <div className="space-y-4 text-slate-600 font-semibold text-xs md:text-sm leading-relaxed">
                  <CollapsibleDescription 
                    text='"When I started GymFlow, I didn’t want to build just another administrative ledger. I wanted to build a high-performance system that feels native to athletic culture: fast, clean, and reliable."'
                  />
                  <CollapsibleDescription 
                    text='"Gyms are high-velocity physical spaces. Members are focused, trainers are active, and owners need immediate operational data without clicking through nested, slow dashboards. Our QR scan system logs entries in under 150ms. Our UPI verification eliminates standard gateway tolls. We keep software out of your way, so you can scale your brand."'
                  />
                  <CollapsibleDescription 
                    text='"Thank you for choosing GymFlow. We’re committing all of our engineering efforts to build the absolute ultimate digital partner for your fitness journey."'
                  />
                </div>

                <div className="pt-4 flex items-center gap-4 border-t border-slate-150">
                  <div className="h-10 w-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-650 shadow-inner">
                    <Check className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-900 text-sm">Vikram Sharma</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Founder's Personal Guarantee</p>
                  </div>
                </div>
              </div>

              {/* Mini Feature block */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 p-4 rounded-[1.5rem] flex items-center gap-4 shadow-sm">
                  <div className="p-3 bg-emerald-500/10 text-[#047857] rounded-xl border border-emerald-100">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-905 text-sm">Enterprise Security</h5>
                    <p className="text-xs text-slate-500 font-semibold">100% localized data encryption</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-[1.5rem] flex items-center gap-4 shadow-sm">
                  <div className="p-3 bg-teal-500/10 text-teal-655 rounded-xl border border-teal-100">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-905 text-sm">Real-time Sync</h5>
                    <p className="text-xs text-slate-500 font-semibold">Socket.io connection system</p>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* Symmetrical Philosophy Grid */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-4 mb-20 max-w-2xl mx-auto">
          <span className="text-[#047857] text-xs font-black uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            OUR PHILOSOPHY
          </span>
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">Our Core Pillars</h2>
          <p className="text-slate-550 text-sm md:text-base font-semibold">
            Every line of code and feature we ship adheres to these structural standards.
          </p>
        </div>
        
        <style dangerouslySetInnerHTML={{__html: `
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}} />

        {/* Mobile View: Premium Touch-Draggable Swiper Carousel (below sm breakpoint) */}
        <div 
          className="sm:hidden w-full flex flex-row overflow-x-auto gap-5 px-6 py-4 select-none snap-x snap-mandatory no-scrollbar relative z-10"
          style={{ 
            scrollbarWidth: "none", 
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch"
          }}
        >
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div 
                key={idx}
                className="w-[280px] flex-shrink-0 relative border border-slate-200/60 rounded-[2rem] bg-white p-6 shadow-md overflow-hidden flex flex-col justify-between gap-4 snap-center"
              >
                {/* Colored Top Stripe */}
                <div className={`absolute left-0 right-0 top-0 h-1.5 ${val.stripeBg}`} />
                
                <div className="space-y-4 relative z-10">
                  <div className={`p-3 rounded-xl bg-slate-50 border border-slate-100 shadow-inner ${val.color} w-fit`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight leading-snug">{val.title}</h3>
                    <CollapsibleDescription 
                      className="text-slate-500 text-[11.5px] leading-relaxed font-semibold"
                      text={val.desc}
                      limit={60}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-[9px] font-black text-emerald-650 uppercase tracking-wider">
                  <span>Engineered Standard</span>
                  <Check className="h-3.5 w-3.5 text-[#047857]" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View: Grid (sm and above) */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-8" style={{ perspective: "1000px" }}>
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <Card3D
                key={idx}
                stripeBg={val.stripeBg}
                className={`group p-8 h-full ${val.glowColor}`}
              >
                <div className="space-y-6">
                  <div className={`p-4 rounded-2xl bg-slate-50 border border-slate-150 ${val.color} w-fit shadow-inner group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">{val.title}</h3>
                  <CollapsibleDescription 
                    className="text-slate-500 text-xs md:text-sm leading-relaxed font-semibold"
                    text={val.desc}
                    limit={60}
                  />
                </div>
                
                <div className="pt-6 border-t border-slate-200/40 mt-8 flex items-center gap-2 text-[10px] font-black text-emerald-650 uppercase tracking-wider">
                  <span>Engineered Standard</span>
                  <Check className="h-4 w-4 text-[#047857]" />
                </div>
              </Card3D>
            );
          })}
        </div>
      </section>

      {/* Symmetrical Dual-Segment Mission & Vision */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="bg-white/80 backdrop-blur-sm border border-slate-200 p-6 md:p-8 rounded-[2.5rem] shadow-lg flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 hover:border-emerald-500/20 hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-2xl flex-shrink-0 shadow-lg shadow-emerald-500/10">
              <Target className="h-7 w-7" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Our Mission</h3>
              <p className="text-slate-655 text-xs md:text-sm leading-relaxed font-semibold">
                To empower fitness businesses with robust, easy-to-use, and highly accessible digital management tools. We aim to eliminate administrative overhead so gym owners and trainers can focus entirely on what they do best: transforming lives through fitness.
              </p>
            </div>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-white/80 backdrop-blur-sm border border-slate-200 p-6 md:p-8 rounded-[2.5rem] shadow-lg flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 hover:border-emerald-500/20 hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-2xl flex-shrink-0 shadow-lg shadow-emerald-500/10">
              <Eye className="h-7 w-7" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Our Vision</h3>
              <p className="text-slate-655 text-xs md:text-sm leading-relaxed font-semibold">
                To build a seamless, global fitness standard. We envision a future where checking in, tracking personal analytics, subscribing to memberships, and sharing dietary goals with trusted coaches happens effortlessly with one singular QR code check-in platform.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA section at bottom - Glassmorphic high-contrast dark block */}
      <section className="pt-12 pb-0 sm:pb-8 md:pt-20 md:pb-12 relative z-10 sm:px-4 max-w-7xl mx-auto w-full mb-0">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-slate-950 border-y border-slate-800 sm:border sm:rounded-[3rem] rounded-none p-8 md:p-16 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row gap-8 lg:gap-12 justify-between items-center text-center lg:text-left shadow-emerald-950/20"
        >
          {/* Background glowing gradients */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-505/10 rounded-full blur-[100px] pointer-events-none -z-0" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-505/10 rounded-full blur-[80px] pointer-events-none -z-0" />
          
          <div className="space-y-4 max-w-2xl relative z-10">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight">
              Be a Part of Our <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-350 bg-clip-text text-transparent">
                Fitness Revolution.
              </span>
            </h2>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-semibold max-w-xl">
              We are constantly seeking outstanding engineers, designers, and growth partners to join our rapidly scaling SaaS team.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto relative z-10 flex-shrink-0">
            <Link 
              href="/contact" 
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-8 py-4 rounded-full transition shadow-lg shadow-emerald-500/20 text-center text-base cursor-pointer"
            >
              Contact Our Team
            </Link>
            <Link 
              href="/register?role=gym_owner" 
              className="border border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-slate-200 font-bold px-8 py-4 rounded-full transition text-center text-base backdrop-blur-md cursor-pointer"
            >
              Start Your Gym Free
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
// Force reload about footer
