'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

import { 
  Dumbbell, 
  Building, 
  Users, 
  Sparkles, 
  Building2, 
  Check, 
  ArrowRight,
  QrCode,
  MapPin,
  Layers,
  Server,
  Zap,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';

// --- HIGH-FIDELITY SILVER/WHITE DEVICE MOCKUPS ---

const QRScannerMockup = () => (
  <div className="relative w-full h-32 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden p-3 flex flex-col justify-between gap-2 shadow-inner">
    {/* Scan line */}
    <div className="absolute top-0 left-0 w-full h-0.5 bg-emerald-500 shadow-[0_0_8px_#10b981] animate-scan-line" />
    
    <div className="flex justify-between gap-2 items-center z-10">
      <div className="flex items-center gap-1">
        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[8px] font-bold text-slate-405 tracking-wider uppercase">Gate 01 Scanner</span>
      </div>
      <span className="text-[7.5px] bg-emerald-500/10 text-emerald-650 px-1.5 py-0.5 rounded-full font-bold border border-emerald-500/20">Online</span>
    </div>
    
    {/* QR box */}
    <div className="flex justify-center items-center my-0.5 z-10">
      <div className="relative p-1.5 border border-slate-250/60 rounded-xl bg-white shadow-sm transition-transform duration-350 group-hover:scale-105">
        <QrCode className="w-9 h-9 text-emerald-650" />
        {/* Futuristic Corners */}
        <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t border-l border-emerald-500/60" />
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t border-r border-emerald-500/60" />
        <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b border-l border-emerald-500/60" />
        <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b border-r border-emerald-500/60" />
      </div>
    </div>

    <div className="flex items-center justify-between gap-2 border-t border-slate-200/50 pt-1.5 z-10">
      <span className="text-[8px] text-slate-400 font-semibold">Auto-CheckIn System</span>
      <span className="text-[8px] text-emerald-655 font-bold uppercase tracking-wide">Active</span>
    </div>
  </div>
);

const BranchRoamingMockup = () => (
  <div className="relative w-full h-32 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden p-3 flex flex-col justify-between gap-2 shadow-inner">
    <div className="flex justify-between gap-2 items-center z-10">
      <span className="text-[8.5px] font-bold text-slate-405 tracking-wider uppercase">Regional Grid</span>
      <span className="text-[7.5px] bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded-full font-bold border border-blue-500/15">3 Branch Active</span>
    </div>

    {/* Map visualization */}
    <div className="relative h-14 flex items-center justify-around my-0.5 z-10">
      <svg className="absolute inset-0 w-full h-full text-blue-500/10" preserveAspectRatio="none">
        <line x1="20%" y1="50%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="animate-pulse" />
        <line x1="50%" y1="50%" x2="80%" y2="50%" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="animate-pulse" />
      </svg>
      
      {/* Branch Node 1 */}
      <div className="relative flex flex-col items-center group-hover:-translate-y-0.5 transition-transform duration-350">
        <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[7.5px] text-slate-500 font-bold shadow-sm">B1</div>
        <span className="text-[7.5px] text-slate-400 font-medium mt-0.5">Downtown</span>
      </div>

      {/* Central Hub Node */}
      <div className="relative flex flex-col items-center">
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-blue-500/10 blur-sm animate-ping" />
          <div className="relative w-8 h-8 rounded-full bg-white border border-blue-500 flex items-center justify-center shadow-sm">
            <Building className="w-3.5 h-3.5 text-blue-600" />
          </div>
        </div>
        <span className="text-[7.5px] text-blue-600 font-bold mt-0.5">HQ Hub</span>
      </div>

      {/* Branch Node 2 */}
      <div className="relative flex flex-col items-center group-hover:-translate-y-0.5 transition-transform duration-350">
        <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[7.5px] text-slate-500 font-bold shadow-sm">B2</div>
        <span className="text-[7.5px] text-slate-400 font-medium mt-0.5">Westside</span>
      </div>
    </div>

    <div className="flex justify-between gap-2 items-center text-[8px] text-slate-400 border-t border-slate-200/50 pt-1.5 z-10">
      <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5 text-blue-500" /> Member Roaming Active</span>
    </div>
  </div>
);

const TrainerSplitMockup = () => (
  <div className="relative w-full h-32 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden p-3 flex flex-col justify-between gap-2 shadow-inner">
    <div className="flex justify-between gap-2 items-center z-10">
      <span className="text-[8.5px] font-bold text-slate-405 tracking-wider uppercase">Active Split</span>
      <span className="text-[7.5px] bg-orange-500/10 text-orange-655 px-1.5 py-0.5 rounded-full font-bold border border-orange-500/15">Routine Builder</span>
    </div>

    <div className="my-0.5 space-y-1 z-10">
      <div className="bg-white border border-slate-200/60 rounded-lg p-1.5 flex justify-between gap-2 items-center transition-all duration-350 shadow-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-orange-500/10 flex items-center justify-center text-[8.5px] text-orange-655 font-bold">1</div>
          <div>
            <p className="text-[9px] text-slate-700 font-bold">Barbell Bench Press</p>
            <p className="text-[7.5px] text-slate-400">4 sets x 8 reps • 85 kg</p>
          </div>
        </div>
        <span className="w-3 h-3 rounded-full border border-orange-500 flex items-center justify-center bg-orange-500/5">
          <Check className="w-2 h-2 text-orange-655" />
        </span>
      </div>
    </div>

    <div className="flex justify-between gap-2 items-center text-[8px] text-slate-400 border-t border-slate-200/50 pt-1.5 z-10">
      <span>Completed: 1/2 Exercises</span>
      <span className="text-orange-655 font-bold uppercase">50% Done</span>
    </div>
  </div>
);

const StudioClassMockup = () => (
  <div className="relative w-full h-32 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden p-3 flex flex-col justify-between gap-2 shadow-inner">
    <div className="flex justify-between gap-2 items-center z-10">
      <span className="text-[8.5px] font-bold text-slate-405 tracking-wider uppercase">Class Slot</span>
      <span className="text-[7.5px] bg-purple-500/10 text-purple-650 px-1.5 py-0.5 rounded-full font-bold border border-purple-500/15">Studio Live</span>
    </div>

    <div className="my-0.5 p-1.5 bg-white border border-slate-200/60 rounded-lg flex items-center justify-between gap-2 z-10 transition-transform duration-350 shadow-sm group-hover:scale-[1.01]">
      <div className="space-y-0.5">
        <span className="text-[7.5px] text-purple-650 font-bold uppercase tracking-wider">Zumba Core</span>
        <p className="text-[9px] text-slate-700 font-bold">Today, 5:30 PM</p>
      </div>

      <div className="flex flex-col items-end gap-0.5">
        <div className="flex -space-x-1">
          <div className="w-3.5 h-3.5 rounded-full bg-indigo-650 border border-white text-[5.5px] flex items-center justify-center font-bold text-white shadow-sm">K</div>
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-650 border border-white text-[5.5px] flex items-center justify-center font-bold text-white shadow-sm">R</div>
        </div>
        <span className="text-[7.5px] font-bold text-emerald-650 bg-emerald-500/10 px-1 rounded">18/20 Booked</span>
      </div>
    </div>

    <div className="flex items-center gap-1.5 z-10">
      <div className="w-full bg-slate-200 rounded-full h-1 overflow-hidden">
        <div className="w-[90%] h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
      </div>
    </div>
  </div>
);

const EnterpriseCloudMockup = () => (
  <div className="relative w-full h-full min-h-[120px] lg:min-h-[140px] bg-slate-50 border border-slate-200/65 rounded-xl overflow-hidden p-4 flex flex-col justify-between gap-2 shadow-inner">
    <div className="flex justify-between gap-2 items-center z-10">
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[9px] font-bold text-slate-405 tracking-wider uppercase">Enterprise Cluster</span>
      </div>
      <span className="text-[7.5px] bg-emerald-500/10 text-emerald-655 px-2 py-0.5 rounded-full font-bold border border-emerald-500/15">AWS Dedicated Cloud</span>
    </div>

    {/* Analytical visualizer */}
    <div className="my-1.5 flex items-end gap-1.5 h-12 lg:h-16 px-1 z-10">
      {/* Dynamic graph bars */}
      <div className="flex-1 bg-white border border-slate-200 rounded-t h-[40%] relative group cursor-pointer shadow-sm">
        <div className="absolute bottom-0 inset-x-0 bg-emerald-500/10 rounded-t transition-all duration-300 group-hover:bg-emerald-500/20" style={{ height: '70%' }} />
      </div>
      <div className="flex-1 bg-white border border-slate-200 rounded-t h-[65%] relative group cursor-pointer shadow-sm">
        <div className="absolute bottom-0 inset-x-0 bg-emerald-500/10 rounded-t transition-all duration-300 group-hover:bg-emerald-500/20" style={{ height: '80%' }} />
      </div>
      <div className="flex-1 bg-white border border-slate-200 rounded-t h-[50%] relative group cursor-pointer shadow-sm">
        <div className="absolute bottom-0 inset-x-0 bg-emerald-500/10 rounded-t transition-all duration-300 group-hover:bg-emerald-500/20" style={{ height: '60%' }} />
      </div>
      <div className="flex-1 bg-white border border-slate-200 rounded-t h-[85%] relative group cursor-pointer shadow-sm">
        <div className="absolute bottom-0 inset-x-0 bg-emerald-555/20 rounded-t transition-all duration-300 group-hover:bg-emerald-555/30" style={{ height: '90%' }} />
      </div>
      <div className="flex-1 bg-white border border-slate-200/90 rounded-t h-[100%] relative group cursor-pointer shadow-sm">
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t transition-all duration-300" style={{ height: '95%' }} />
      </div>
    </div>

    <div className="flex justify-between gap-2 items-center text-[8.5px] text-slate-400 border-t border-slate-200/50 pt-2 z-10">
      <span className="flex items-center gap-1"><Server className="w-3 h-3 text-emerald-600" /> Dedicated SLA Protected</span>
      <span className="text-slate-455 font-medium">Latency: 42ms</span>
    </div>
  </div>
);

// --- CONFIG FOR EACH SOLUTIONS ITEM ---

const solutions = [
  {
    id: 'single-gyms',
    category: 'owners',
    badge: 'Most Popular Choice',
    badgeColor: 'bg-emerald-100/80 text-emerald-800 border-emerald-300',
    bgGradient: 'bg-gradient-to-br from-emerald-50/95 via-[#f4fbf8]/90 to-teal-50/80 border-emerald-100/60',
    title: 'For Single Gyms',
    tagline: 'Streamline operations & boost member retention.',
    icon: Dumbbell,
    color: 'from-emerald-100 to-teal-100',
    glowColor: 'hover:shadow-2xl shadow-slate-950/5',
    hoverBorder: 'hover:border-emerald-500/30 hover:shadow-emerald-950/10',
    iconColor: 'text-[#047857]',
    description: 'Perfect for independent gym owners looking to digitize their operations, automate fee tracking, and modernize check-ins.',
    features: [
      'QR Code check-in & auto-attendance',
      'Simple billing & UPI manual approvals',
      'Digital workout splits & diet plans',
      'Basic dashboard & income insights',
      'Support for up to 3 staff members'
    ],
    cta: 'Start Free Trial',
    href: '/register?role=gym_owner',
    mockup: QRScannerMockup
  },
  {
    id: 'multi-branch',
    category: 'owners',
    badge: 'Enterprise Scalability',
    badgeColor: 'bg-blue-100/85 text-blue-800 border-blue-300',
    bgGradient: 'bg-gradient-to-br from-blue-50/95 via-[#f5f9fc]/90 to-indigo-50/80 border-blue-100/60',
    title: 'For Multi-Branch Chains',
    tagline: 'Centralized control, decentralized operations.',
    icon: Building,
    color: 'from-blue-100 to-indigo-100',
    glowColor: 'hover:shadow-2xl shadow-slate-950/5',
    hoverBorder: 'hover:border-blue-500/30 hover:shadow-blue-950/10',
    iconColor: 'text-blue-600',
    description: 'Designed for fitness chains with multiple locations. Manage all branches from one parent dashboard while keeping local operations smooth.',
    features: [
      'Global member roaming access',
      'Branch-wise revenue & footfall analytics',
      'Centralized staff & trainer payroll',
      'Branch specific pricing & class slots',
      'Role-based permissions for managers'
    ],
    cta: 'Scale Your Brand',
    href: '/contact?subject=multi-branch',
    mockup: BranchRoamingMockup
  },
  {
    id: 'trainers',
    category: 'coaches',
    badge: 'High Impact Growth',
    badgeColor: 'bg-orange-100/85 text-orange-800 border-orange-300',
    bgGradient: 'bg-gradient-to-br from-orange-50/95 via-[#fbf7f4]/90 to-amber-50/80 border-orange-100/60',
    title: 'For Personal Trainers',
    tagline: 'Maximize client results & professional value.',
    icon: Users,
    color: 'from-orange-100 to-amber-100',
    glowColor: 'hover:shadow-2xl shadow-slate-950/5',
    hoverBorder: 'hover:border-orange-500/30 hover:shadow-orange-950/10',
    iconColor: 'text-orange-600',
    description: 'Empower individual trainers or online coaches to manage workout routines, food calendars, progress charts, and personal bookings.',
    features: [
      'Interactive Workout Builder',
      'Custom Diet & Calorie Planners',
      'Client progressive check-in logs',
      'Direct client chatroom (Socket.io)',
      'Easy scheduling & slot booking'
    ],
    cta: 'Join as Coach',
    href: '/register?role=trainer',
    mockup: TrainerSplitMockup
  },
  {
    id: 'studios',
    category: 'studios',
    badge: 'Boutique Premium Spec',
    badgeColor: 'bg-purple-100/85 text-purple-800 border-purple-300',
    bgGradient: 'bg-gradient-to-br from-purple-50/95 via-[#faf6fc]/90 to-pink-50/80 border-purple-100/60',
    title: 'For Fitness Studios',
    tagline: 'Boutique styling for premium experiences.',
    icon: Sparkles,
    color: 'from-purple-100 to-pink-100',
    glowColor: 'hover:shadow-2xl shadow-slate-950/5',
    hoverBorder: 'hover:border-purple-500/30 hover:shadow-purple-950/10',
    iconColor: 'text-purple-600',
    description: 'Tailored for Yoga, Pilates, Zumba, Spin, and CrossFit studios focusing on slot bookings, high engagement, and community building.',
    features: [
      'Class scheduling & hourly slot limits',
      'Automated waitlist notifications',
      'Integrated trainer schedules',
      'Community group chat rooms',
      'Flexible pack-based membership plans'
    ],
    cta: 'Launch Your Studio',
    href: '/register?role=gym_owner',
    mockup: StudioClassMockup
  }
];

// --- COLLAPSIBLE TEXT DESCRIPTION COMPONENT ---
function CollapsibleDescription({ text, className }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const truncateLength = 80;
  const isTooLong = text.length > truncateLength;
  const displayText = (!isExpanded && isTooLong) ? `${text.slice(0, truncateLength)}...` : text;

  return (
    <div className={className}>
      {/* Mobile View */}
      <span className="md:hidden">
        <span>{displayText}</span>
        {isTooLong && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[9px] font-bold text-[#047857] hover:text-[#065f46] tracking-wider uppercase ml-1.5 focus:outline-none transition cursor-pointer select-none inline-block"
          >
            [{isExpanded ? 'Less' : 'More'}]
          </button>
        )}
      </span>

      {/* Desktop View */}
      <span className="hidden md:inline">
        <span>{text}</span>
      </span>
    </div>
  );
}

// --- FEATURE LIST COMPONENT ---
function FeatureList({ features, isEnterprise = false }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleFeaturesOnMobile = isExpanded ? features : features.slice(0, 2);

  return (
    <div className="w-full">
      {/* Mobile View: Slice to 2 features unless expanded */}
      <div className="md:hidden space-y-2.5">
        <ul className="space-y-2.5">
          {visibleFeaturesOnMobile.map((feat, i) => (
            <li key={i} className="flex items-start gap-2.5 text-slate-500 text-xs font-normal transition-all duration-300">
              <span className="p-0.5 rounded-full bg-emerald-50/80 text-emerald-650 mt-0.5 flex-shrink-0 border border-emerald-100 shadow-sm">
                <Check className="h-3 w-3" />
              </span>
              <span>{feat}</span>
            </li>
          ))}
        </ul>
        
        {features.length > 2 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[10px] font-bold text-[#047857] hover:text-[#065f46] tracking-wider uppercase flex items-center gap-1 pt-1 focus:outline-none transition cursor-pointer select-none"
          >
            <span>{isExpanded ? 'Show Less' : `+ ${features.length - 2} More Modules`}</span>
          </button>
        )}
      </div>

      {/* Desktop View: Always show all features */}
      <div className="hidden md:block">
        <ul className={isEnterprise ? "space-y-3" : "space-y-2.5"}>
          {features.map((feat, i) => (
            <li key={i} className={`flex items-start gap-2.5 text-slate-500 ${isEnterprise ? 'text-sm lg:text-base' : 'text-xs lg:text-sm'} font-normal`}>
              <span className="p-0.5 rounded-full bg-emerald-50/80 text-emerald-650 mt-0.5 flex-shrink-0 border border-emerald-100 shadow-sm">
                <Check className="h-3 w-3" />
              </span>
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


// --- SOLUTION CARD COMPONENT ---
function SolutionCard({ sol }) {
  const [isDescVisible, setIsDescVisible] = useState(false);
  const Icon = sol.icon;
  const Mockup = sol.mockup;

  return (
    <div
      onClick={() => setIsDescVisible(!isDescVisible)}
      className={`group border border-slate-200/80 rounded-2xl p-5 md:p-6 flex flex-col justify-between gap-3 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.01] relative overflow-hidden shadow-xl shadow-slate-950/5 cursor-pointer ${sol.bgGradient} ${sol.glowColor} ${sol.hoverBorder}`}
    >
      {/* Luxury Top Badge */}
      <div className="absolute top-5 right-5 z-10">
        <span className={`px-2 py-0.5 rounded-full text-[8px] lg:text-[9.5px] font-bold tracking-widest uppercase border shadow-sm ${sol.badgeColor}`}>
          {sol.badge}
        </span>
      </div>

      <div className="relative z-10 flex-grow flex flex-col">
        {/* Floating Icon Badges */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${sol.color} ${sol.iconColor} shadow-sm border border-white/85`}>
            <Icon className="h-4.5 w-4.5" />
          </div>
        </div>

        <h3 className="text-base md:text-lg lg:text-xl font-bold text-slate-900 mb-1.5 tracking-tight">{sol.title}</h3>
        <p className="text-[#047857] font-bold text-xs lg:text-sm mb-2.5">{sol.tagline}</p>
        
        {/* Description: Hidden on small screens by default, visible on click. Always visible on desktop. */}
        <div className={`text-slate-500 text-xs lg:text-sm leading-relaxed mb-4 font-normal transition-all duration-300 ${isDescVisible ? 'block' : 'hidden md:block'}`}>
          {sol.description}
        </div>
        
        {/* Gorgeous Silver/White Preview Mockup Cased Frame inside Card */}
        <div className="mb-5">
          <div className="bg-slate-105 border border-slate-200 rounded-2xl p-2 shadow-sm shadow-slate-200/30 transition-transform duration-300 group-hover:scale-[1.02]">
            <Mockup />
          </div>
        </div>

        <div className="border-t border-slate-200/60 pt-4 mb-5 mt-auto">
          <p className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Included System Modules:</p>
          <FeatureList features={sol.features} />
        </div>
      </div>

      <Link 
        href={sol.href} 
        onClick={(e) => e.stopPropagation()} // Prevent card click toggle
        className="relative z-10 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#047857] hover:bg-[#065f46] text-white font-bold rounded-xl transition duration-300 active:scale-[0.98] shadow shadow-emerald-700/10 group-hover:shadow-emerald-750/20 overflow-hidden cursor-pointer text-xs lg:text-sm"
      >
        {/* Swipe beam animation on hover */}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        
        <span className="z-10">{sol.cta}</span>
        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200 z-10" />
      </Link>
    </div>
  );
}

export default function SolutionsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredSolutions = activeTab === 'all' 
    ? solutions 
    : solutions.filter(sol => sol.category === activeTab);

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen flex flex-col relative overflow-hidden">
      
      {/* Isolated styling for CSS Keyframes to ensure extreme smooth CSS animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0%, 100% { transform: translateY(4px); }
          50% { transform: translateY(122px); }
        }
        .animate-scan-line {
          position: absolute;
          width: 100%;
          animation: scan 3s infinite ease-in-out;
          will-change: transform;
        }
      `}} />

      <Navbar />

      {/* Premium Dashboard Light Background Image - Beautiful, Colorful & Professional */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-scroll opacity-[0.96] pointer-events-none select-none"
        style={{ backgroundImage: "url('/dashboard_bg_light_clean.png')" }}
      />

      {/* Multi-layered soft white-tint gradient overlay to guarantee perfect text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/80 to-white/30 z-0 pointer-events-none" />

      {/* Very Soft Ambient Glowing Spotlights behind Hero Text for premium look without noise */}
      <div 
        className="absolute top-0 inset-x-0 h-[600px] -z-10 pointer-events-none opacity-60" 
        style={{
          background: `
            radial-gradient(circle 350px at 25% 150px, rgba(16, 185, 129, 0.12), transparent),
            radial-gradient(circle 300px at 85% 200px, rgba(20, 184, 166, 0.08), transparent)
          `
        }}
      />

      {/* Hero Section */}
      <section className="pt-32 md:pt-28 pb-4 md:pb-6 relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#047857] text-[10px] md:text-xs font-bold tracking-widest uppercase border border-slate-200/80 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-[#047857] fill-[#047857]/10 animate-pulse" />
            <span>GymFlow Solutions Suite</span>
          </div>
          
          <h1 className="text-2xl md:text-4xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15] lg:leading-[1.12]">
            Tailored fitness management for <br className="hidden md:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800">
              every business scale.
            </span>
          </h1>
          
          <p className="text-slate-500 text-xs md:text-sm lg:text-lg max-w-3xl mx-auto font-medium leading-relaxed">
            From solo personal trainers to national multi-branch franchise networks, GymFlow provides premium, highly modular tools to run operations effortlessly.
          </p>
        </div>
      </section>

      {/* Scope Capability / Trust Bar */}
      <div className="w-full max-w-5xl mx-auto text-center pb-8 px-4 z-10">
        <p className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Empowering next-generation fitness hubs globally</p>
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-[9px] md:text-[10px] lg:text-xs text-slate-405 font-bold select-none">
          <span className="px-2 py-0.5 bg-white/70 rounded-lg border border-slate-200 shadow-sm">INTEGRATED QR DESK</span>
          <span>•</span>
          <span className="px-2 py-0.5 bg-white/70 rounded-lg border border-slate-200 shadow-sm">ROAMING ERP</span>
          <span>•</span>
          <span className="px-2 py-0.5 bg-white/70 rounded-lg border border-slate-200 shadow-sm">SOCKET.IO CHAT</span>
          <span>•</span>
          <span className="px-2 py-0.5 bg-white/70 rounded-lg border border-slate-200 shadow-sm">REAL-TIME CALENDARS</span>
        </div>
      </div>

      {/* Interactive Tabs Switcher - Adds High visual engagement */}
      <section className="pb-8 px-4 relative z-30 flex justify-center w-full max-w-3xl mx-auto select-none">
        {/* Mobile Dropdown View */}
        <div className="relative w-full max-w-[280px] md:hidden">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between gap-3 px-4 py-2.5 bg-white border border-slate-200/80 rounded-xl shadow-sm text-[10px] font-bold tracking-widest text-slate-700 uppercase focus:outline-none focus:border-[#047857] transition"
          >
            <span>{
              activeTab === 'all' ? 'All Solutions' :
              activeTab === 'owners' ? 'Gyms & Chains' :
              activeTab === 'coaches' ? 'Personal Trainers' : 'Boutique Studios'
            }</span>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-[#047857]' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="py-1">
                {[
                  { id: 'all', label: 'All Solutions' },
                  { id: 'owners', label: 'Gyms & Chains' },
                  { id: 'coaches', label: 'Personal Trainers' },
                  { id: 'studios', label: 'Boutique Studios' }
                ].map((tab) => {
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-[10px] font-bold tracking-widest uppercase transition-colors flex items-center justify-between ${
                        isSelected 
                          ? 'bg-emerald-50 text-[#047857]' 
                          : 'text-slate-655 hover:bg-slate-50 hover:text-slate-850'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#047857]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Tab Switcher View (Borderless with background removed) */}
        <div className="hidden md:flex gap-3 justify-center items-center">
          {[
            { id: 'all', label: 'All Solutions' },
            { id: 'owners', label: 'Gyms & Chains' },
            { id: 'coaches', label: 'Personal Trainers' },
            { id: 'studios', label: 'Boutique Studios' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 rounded-xl text-xs lg:text-sm font-bold tracking-wide uppercase transition-all duration-300 active:scale-95 z-10 cursor-pointer ${
                  isActive 
                    ? 'text-white shadow-sm' 
                    : 'text-slate-600 hover:text-[#047857] hover:bg-emerald-500/10'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-[#047857] rounded-xl -z-10 shadow-md shadow-emerald-700/20" />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2-Card Per Row Grid Section */}
      <section className="pb-16 px-4 sm:px-6 relative z-10 max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {filteredSolutions.map((sol) => (
            <SolutionCard key={sol.id} sol={sol} />
          ))}
        </div>

        {/* Enterprise Full-Width Solution Card (Premium White/Silver Luxury Layout) */}
        {(() => {
          const ent = {
            id: 'enterprise',
            title: 'Enterprise Solution',
            tagline: 'Robust architecture for custom scaling.',
            icon: Building2,
            bgGradient: 'bg-gradient-to-br from-slate-100/95 via-slate-50/95 to-zinc-100/80 border-slate-200/80',
            color: 'from-slate-150 to-slate-50',
            iconColor: 'text-[#047857]',
            description: 'A fully customized, high-performance portal package built for regional gym chains, franchise networks, and corporate health organizations.',
            features: [
              'Dedicated hosting & private cloud',
              'Custom API & external systems integration',
              'White-label mobile applications',
              'SLA-backed 24/7 dedicated support team',
              'Enterprise-grade security & audit logs'
            ],
            cta: 'Contact Enterprise Sales',
            href: '/contact?subject=enterprise'
          };
          const Icon = ent.icon;
          return (
            <div
              className={`mt-10 border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xl shadow-slate-950/5 flex flex-col lg:flex-row gap-6 lg:gap-8 relative overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.01] ${ent.bgGradient} hover:border-[#047857]/45 hover:shadow-emerald-950/5`}
            >
              {/* Background ambient lighting */}
              <div 
                className="absolute inset-0 pointer-events-none -z-0"
                style={{
                  background: 'radial-gradient(circle 250px at top right, rgba(16, 185, 129, 0.08), transparent)'
                }}
              />
              
              <div className="flex-1 flex flex-col justify-between gap-4 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-bold tracking-widest uppercase border border-emerald-150 mb-4 shadow-sm">
                    <Layers className="w-3 h-3 text-[#047857] animate-spin" style={{ animationDuration: '4s' }} />
                    <span>Scale Limitless</span>
                  </div>
                  
                  <h3 className="text-lg md:text-2xl lg:text-4xl font-bold text-slate-900 mb-1.5 tracking-tight">{ent.title}</h3>
                  <p className="text-[#047857] font-bold text-xs md:text-sm lg:text-base mb-2.5">{ent.tagline}</p>
                  <CollapsibleDescription text={ent.description} className="text-slate-500 text-xs md:text-sm lg:text-base leading-relaxed mb-4 font-normal max-w-xl" />
                </div>

                {/* Cloud Mockup Component */}
                <div className="w-full max-w-md mb-4 lg:mb-0">
                  <EnterpriseCloudMockup />
                </div>

                <Link 
                  href={ent.href} 
                  className="w-fit flex items-center justify-center gap-2 py-2.5 px-4 md:py-3 md:px-6 bg-[#047857] hover:bg-[#065f46] text-white font-bold rounded-xl transition duration-200 shadow shadow-emerald-700/10 active:scale-[0.98] mt-4 relative overflow-hidden group cursor-pointer text-xs"
                >
                  {/* Swipe beam animation */}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                  
                  <span className="z-10">{ent.cta}</span>
                  <ArrowRight className="h-4.5 w-4.5 z-10" />
                </Link>
              </div>

              <div className="flex-1 border-t lg:border-t-0 lg:border-l border-slate-200/80 pt-6 lg:pt-0 lg:pl-8 flex flex-col justify-center relative z-10">
                <p className="text-[9px] font-bold text-slate-405 uppercase tracking-widest mb-4">Enterprise SLA Modules:</p>
                <FeatureList features={ent.features} isEnterprise={true} />
              </div>
            </div>
          );
        })()}
      </section>

      {/* CTA section at bottom */}
      <section className="py-14 md:py-16 bg-white/70 backdrop-blur-md border-t border-slate-150 relative z-10">
        {/* Soft Background Orbs inside bottom box */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            background: 'radial-gradient(circle 200px at 33% 0px, rgba(16, 185, 129, 0.06), transparent)'
          }}
        />

        <div className="max-w-4xl mx-auto px-4 text-center space-y-4 relative z-10">
          <h2 className="text-xl md:text-3xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">Need a Custom Setup?</h2>
          <p className="text-slate-500 text-xs md:text-sm lg:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            Our expert solution architecture team can build dedicated integrations or configure custom functional tables to match your exact gym setup.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link 
              href="/contact" 
              className="bg-[#047857] hover:bg-[#065f46] text-white font-bold px-6 py-3 rounded-xl transition shadow-sm active:scale-[0.98] text-xs md:text-sm lg:text-base cursor-pointer"
            >
              Talk to Our Experts
            </Link>
            <Link 
              href="/register?role=gym_owner" 
              className="border border-slate-250 hover:border-slate-300 bg-white/80 text-slate-655 hover:text-slate-800 font-bold px-6 py-3 rounded-xl transition shadow-sm active:scale-[0.98] text-xs md:text-sm lg:text-base cursor-pointer"
            >
              Get Started Instantly
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
// Force reload solutions footers footer
