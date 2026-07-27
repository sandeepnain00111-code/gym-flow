'use client';

import React, { useState } from 'react';
import BottomNav from '../../components/layout/BottomNav';
import Sidebar from '../../components/layout/Sidebar';
import { useAuthStore } from '../../store/authStore';
import { useRouter, usePathname } from 'next/navigation';
import Spinner from '../../components/ui/Spinner';
import { Dumbbell, LogOut, Bell, Menu } from 'lucide-react';
import Link from 'next/link';

export default function MemberLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, isAuthenticated, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isChat = pathname === '/member/chat';

  React.useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user && user.role !== 'member') {
        router.push('/login');
      }
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading || !isAuthenticated || !user || user.role !== 'member') {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex text-slate-800 font-sans relative"
      style={{
        backgroundImage: "url('/bg-white-mesh.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundColor: '#FCFDFE'
      }}
    >
      {/* Left Sidebar on desktop */}
      <Sidebar />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-64 pb-20 lg:pb-0">
        
        {/* Premium Sticky Header */}
        <header className="h-16 sticky top-0 left-0 w-full z-45 bg-white/70 backdrop-blur-md border-b border-slate-100 flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 shadow-sm">
          <div className="flex items-center space-x-2">
            {/* Hamburger menu for mobile layout */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg transition text-slate-500 hover:text-slate-850 hover:bg-slate-50"
            >
              <Menu className="h-5.5 w-5.5" />
            </button>

            <div className="flex items-center space-x-2">
              <Dumbbell className="h-6 w-6 text-emerald-600 lg:hidden" />
              <span className="text-base font-extrabold tracking-wider bg-gradient-to-r from-slate-900 to-emerald-600 bg-clip-text text-transparent lg:hidden">
                GymFlow
              </span>
              <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 hidden lg:inline-block">
                Gym Member Pass
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-slate-500 hover:text-slate-950 rounded-full hover:bg-slate-50 transition relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
            </button>

            {/* Quick Logout */}
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-slate-50 transition"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>

            {/* User profile bubble */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center border border-white text-white font-bold text-xs uppercase shadow-md shadow-emerald-500/10">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Main Content Area - Dynamically wider and full-bleed if Chat page */}
        <main className={`flex-1 w-full mx-auto ${isChat ? 'max-w-none px-0 py-0' : 'max-w-7xl px-4 sm:px-6 py-6 lg:py-8'}`}>
          {children}
        </main>
      </div>

      {/* Mobile Drawer Overlay */}
      <div 
        className={`fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-sm transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div 
          className={`w-64 bg-white h-screen relative p-6 border-r border-slate-100 flex flex-col justify-between gap-4 shadow-xl transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <span className="text-base font-extrabold text-slate-900 tracking-wider">GymFlow Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-slate-700">
                <span className="text-lg">✕</span>
              </button>
            </div>
            <div className="space-y-4 pt-6 max-h-[75vh] overflow-y-auto no-scrollbar font-bold text-xs" data-lenis-prevent>
              <Link href="/member/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-650 hover:text-emerald-600 transition">
                Dashboard Overview
              </Link>
              <Link href="/member/chat" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-650 hover:text-emerald-600 transition">
                Gym Lounge Chat
              </Link>
              <Link href="/member/workout-plan" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-650 hover:text-emerald-600 transition">
                Training Routines
              </Link>
              <Link href="/member/diet" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-650 hover:text-emerald-600 transition">
                Diet Blueprints
              </Link>
              <Link href="/member/attendance" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-650 hover:text-emerald-600 transition">
                Attendance Scanner
              </Link>
              <Link href="/member/joins" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-650 hover:text-emerald-600 transition">
                Joins & Invoices
              </Link>
              <Link href="/member/profile" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-650 hover:text-emerald-600 transition">
                Profile Settings
              </Link>
            </div>
          </div>
          
          {/* Mobile Drawer Logout */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              logout();
            }}
            className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-1.5 border border-red-200 transition duration-300"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout Account</span>
          </button>
        </div>
      </div>

      {/* Mobile navigation tab bar */}
      <BottomNav />
    </div>
  );
}
