'use client';

import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import CollapsibleDescription from '../../components/ui/CollapsibleDescription';
import { motion } from 'framer-motion';
import { 
  QrCode, 
  Dumbbell, 
  MessageCircle, 
  TrendingUp, 
  Users, 
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';

export default function FeaturesPage() {
  const allFeatures = [
    {
      title: 'QR Code Attendance',
      description: 'Members scan the gym\'s unique QR code to instantly log daily check-ins. No physical registers or expensive biometric hardware needed.',
      icon: QrCode,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Unified Member Management',
      description: 'Manage active members, view pending fees, track expirations, and securely store member profiles all in one intuitive dashboard.',
      icon: Users,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Workout & Diet Plans',
      description: 'Assign customized day-wise workout tables and meal-wise diet blueprints directly to members. Members view these on their app.',
      icon: Dumbbell,
      color: 'text-orange-400',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Live Gym Chatrooms',
      description: 'Build community with Discord-like real-time chat channels for your gym. Send announcements, fitness tips, and motivate members.',
      icon: MessageCircle,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-50'
    },
    {
      title: 'Manual UPI Approvals',
      description: 'Avoid 2% payment gateway fees. Members upload UPI screenshots, and owners approve transactions with a single click.',
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Trainer Roster',
      description: 'Add your staff and trainers to the system. Assign them to specific members for personalized coaching and progress tracking.',
      icon: Zap,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Progress Tracking',
      description: 'Members can log their weight, BMI, and before/after photos. Visual charts help keep them motivated and retained.',
      icon: Activity,
      color: 'text-rose-400',
      bgColor: 'bg-rose-50'
    },
    {
      title: 'Role-Based Access',
      description: 'Secure, compartmentalized access for Owners, Trainers, and Members. Super Admin oversees the entire SaaS platform.',
      icon: ShieldCheck,
      color: 'text-slate-600',
      bgColor: 'bg-slate-100'
    }
  ];

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen flex flex-col relative overflow-hidden">
      
      {/* Premium White Mesh Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-scroll opacity-[0.96] pointer-events-none select-none"
        style={{ backgroundImage: "url('/bg-white-mesh.png')" }}
      />

      {/* Multi-layered soft white-tint gradient overlay to guarantee perfect text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/80 to-white/30 z-0 pointer-events-none" />

      {/* Very Soft Ambient Glowing Spotlights behind Hero Text */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[550px] rounded-full bg-emerald-100/40 blur-[130px] -z-10 pointer-events-none" />
      <div className="absolute top-10 right-10 w-[550px] h-[500px] rounded-full bg-teal-100/25 blur-[120px] -z-10 pointer-events-none" />

      <Navbar />

      {/* Header Section */}
      <section className="pt-24 sm:pt-44 pb-8 sm:pb-16 relative z-10 flex flex-col items-center text-center px-4 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#047857] text-xs font-black tracking-widest uppercase border border-slate-200/80 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-[#047857] fill-[#047857]/10 animate-pulse" />
            <span>Robust Feature Suite</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.12]">
            Everything you need to <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800">
              run your gym flawlessly.
            </span>
          </h1>
          
          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto font-semibold leading-relaxed">
            From seamless QR attendance to dynamic diet plans and real-time community chat. GymFlow replaces your spreadsheets with a premium SaaS experience.
          </p>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-16 relative z-10 bg-white/40 backdrop-blur-sm border-t border-slate-200/60 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="bg-white border border-slate-200 shadow-lg hover:shadow-xl p-8 rounded-3xl flex flex-col items-start hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                >
                  <div className={`p-4 rounded-2xl ${feat.bgColor} mb-6 border border-slate-100 group-hover:scale-105 transition-transform duration-300`}>
                    <Icon className={`h-7 w-7 ${feat.color}`} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{feat.title}</h3>
                  <CollapsibleDescription 
                    className="text-slate-550 text-xs md:text-sm leading-relaxed font-semibold"
                    text={feat.description}
                    limit={80}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
