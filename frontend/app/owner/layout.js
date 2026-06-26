'use client';

import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Topbar from '../../components/layout/Topbar';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'next/navigation';
import Spinner from '../../components/ui/Spinner';
import Link from 'next/link';

export default function OwnerLayout({ children }) {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user && user.role !== 'gym_owner') {
        router.push('/login');
      }
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading || !isAuthenticated || !user || user.role !== 'gym_owner') {
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
        backgroundColor: '#FFFFFF'
      }}
    >
      <Sidebar />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-64">
        <Topbar onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 pt-28 sm:pt-32 overflow-x-hidden">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Drawer Overlay */}
      <div 
        className={`fixed inset-0 z-50 flex lg:hidden bg-black/80 backdrop-blur-sm transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div 
          className={`w-64 bg-[#030712] h-screen relative p-6 border-r border-white/5 flex flex-col justify-between gap-4 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <div className="flex items-center justify-between gap-4 pb-6 border-b border-white/5">
              <span className="text-base font-bold text-white tracking-wider">GymFlow Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white">
                <span className="text-lg">✕</span>
              </button>
            </div>
            <div className="space-y-4 pt-6 max-h-[75vh] overflow-y-auto no-scrollbar">
              <Link href="/owner/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-gray-300 hover:text-emerald-400">
                Dashboard
              </Link>
              <Link href="/owner/gym-profile" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-gray-300 hover:text-emerald-400">
                Gym Profile
              </Link>
              <Link href="/owner/qr" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-gray-300 hover:text-emerald-400">
                QR Console
              </Link>
              <Link href="/owner/members" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-gray-300 hover:text-emerald-400">
                Members
              </Link>
              <Link href="/owner/join-requests" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-gray-300 hover:text-emerald-400">
                Join Requests
              </Link>
              <Link href="/owner/demo-bookings" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-gray-300 hover:text-emerald-400">
                Demo Bookings
              </Link>
              <Link href="/owner/fees" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-gray-300 hover:text-emerald-400">
                Fees & Payments
              </Link>
              <Link href="/owner/attendance" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-gray-300 hover:text-emerald-400">
                Attendance
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
