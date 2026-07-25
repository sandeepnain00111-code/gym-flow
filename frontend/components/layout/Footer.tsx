import React from 'react';
import Link from 'next/link';
import { 
  Dumbbell, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUpRight, 
  Sparkles, 
  ShieldCheck, 
  Send 
} from 'lucide-react';

export default function Footer() {
  return (
    <footer 
      className="bg-black border-t border-slate-900 py-16 relative overflow-hidden z-20"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Premium ambient glowing spotlights behind footer blocks */}
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-12 border-b border-white/5">
          
          {/* Brand Info segment */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center space-x-2.5 w-fit group">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <Dumbbell className="h-6 w-6" />
              </div>
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-white to-emerald-400 bg-clip-text text-transparent">
                GymFlow
              </span>
            </Link>
            
            <p className="text-slate-400 text-xs md:text-sm font-semibold leading-relaxed max-w-sm">
              One QR. Complete Gym Management. Experience GymFlow, a modern premium SaaS platform built for high-performance athletic club environments, owners, and coaches.
            </p>

            {/* Social Icons with Glassmorphic scales and hover rotations */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link 
                href="https://linkedin.com" 
                className="p-2.5 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:scale-110 hover:-rotate-6 transition-all duration-300 shadow-inner flex items-center justify-center cursor-pointer"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </Link>
              <Link 
                href="https://twitter.com" 
                className="p-2.5 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:scale-110 hover:-rotate-6 transition-all duration-300 shadow-inner flex items-center justify-center cursor-pointer"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </Link>
              <Link 
                href="https://github.com" 
                className="p-2.5 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:scale-110 hover:-rotate-6 transition-all duration-300 shadow-inner flex items-center justify-center cursor-pointer"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </Link>
              <Link 
                href="https://instagram.com" 
                className="p-2.5 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:scale-110 hover:-rotate-6 transition-all duration-300 shadow-inner flex items-center justify-center cursor-pointer"
              >
                <svg className="h-4 w-4 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Combined Platform & Resources Column (Side-by-side on all screens) */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2 grid grid-cols-2 gap-8">
            {/* Platform Segment */}
            <div className="space-y-4">
              <h4 className="text-white font-extrabold text-xs tracking-widest uppercase border-l-2 border-emerald-500 pl-2">
                Platform
              </h4>
              <ul className="space-y-3 text-xs md:text-sm font-semibold">
                <li>
                  <Link href="/features" className="group flex items-center text-slate-400 hover:text-emerald-400 transition-all duration-300 transform hover:translate-x-1.5 cursor-pointer">
                    <span>Features</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-300 ml-1 text-emerald-400" />
                  </Link>
                </li>
                <li>
                  <Link href="/solutions" className="group flex items-center text-slate-400 hover:text-emerald-400 transition-all duration-300 transform hover:translate-x-1.5 cursor-pointer">
                    <span>Solutions</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-300 ml-1 text-emerald-400" />
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="group flex items-center text-slate-400 hover:text-emerald-400 transition-all duration-300 transform hover:translate-x-1.5 cursor-pointer">
                    <span>About Us</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-300 ml-1 text-emerald-400" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Segment */}
            <div className="space-y-4">
              <h4 className="text-white font-extrabold text-xs tracking-widest uppercase border-l-2 border-emerald-500 pl-2">
                Resources
              </h4>
              <ul className="space-y-3 text-xs md:text-sm font-semibold">
                <li>
                  <Link href="/login" className="group flex items-center text-slate-400 hover:text-emerald-400 transition-all duration-300 transform hover:translate-x-1.5 cursor-pointer">
                    <span>Help Center</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-300 ml-1 text-emerald-400" />
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="group flex items-center text-slate-400 hover:text-emerald-400 transition-all duration-300 transform hover:translate-x-1.5 cursor-pointer">
                    <span>Terms of Service</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-300 ml-1 text-emerald-400" />
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="group flex items-center text-slate-400 hover:text-emerald-400 transition-all duration-300 transform hover:translate-x-1.5 cursor-pointer">
                    <span>Privacy Policy</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-300 ml-1 text-emerald-400" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Growth Newsletter Segment */}
          <div className="space-y-4">
            <h4 className="text-white font-extrabold text-xs tracking-widest uppercase border-l-2 border-emerald-500 pl-2">
              Subscribe
            </h4>
            <p className="text-slate-450 text-[11px] font-semibold leading-relaxed">
              Get direct operational updates and early-bird growth feature notifications.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="relative flex items-center w-full">
              <input 
                type="email" 
                placeholder="you@domain.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500 transition duration-300"
              />
              <button 
                type="submit"
                className="absolute right-1.5 p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition cursor-pointer select-none"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
            <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-650 uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-[#047857]" />
              <span>SaaS Growth Partner 2026</span>
            </div>
          </div>

        </div>

        {/* Footer bottom bar */}
        <div className="mt-8 pt-8 flex flex-col md:flex-row justify-between gap-6 items-center text-xs text-slate-500 font-semibold">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <p>© {new Date().getFullYear()} GymFlow SaaS. All rights reserved.</p>
            <div className="hidden md:block h-3 w-px bg-slate-800" />
            <p className="flex items-center gap-1.5">
              Built for champions, by champions. 🏋️
            </p>
          </div>

          {/* Dynamic Systems Health status pulse indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-wider text-emerald-400 shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>All Systems Operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
