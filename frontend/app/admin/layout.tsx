'use client';

import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Topbar from '../../components/layout/Topbar';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'next/navigation';
import Spinner from '../../components/ui/Spinner';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user && user.role !== 'super_admin') {
        router.push('/login');
      }
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading || !isAuthenticated || !user || user.role !== 'super_admin') {
    return (
      <div className="bg-[#030712] min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex text-[#0F172A] font-sans transition-colors duration-300"
      style={{
        backgroundColor: '#F8FAFC',
        backgroundImage: 'url("/bg-white-mesh.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <Sidebar />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-64">
        <Topbar onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        {/* Content Body */}
        <main className="flex-1 p-6 pt-28 sm:pt-32 overflow-x-hidden">
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
            <div className="space-y-4 pt-6">
              <Link href="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-gray-300 hover:text-emerald-400">
                Dashboard
              </Link>
              <Link href="/admin/owners" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-gray-300 hover:text-emerald-400">
                Gym Owners
              </Link>
              <Link href="/admin/gyms" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-gray-300 hover:text-emerald-400">
                Gyms
              </Link>
              <Link href="/admin/members" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-gray-300 hover:text-emerald-400">
                Members
              </Link>
              <Link href="/admin/promos" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-gray-300 hover:text-emerald-400">
                Promo Slider
              </Link>
              <Link href="/admin/payments" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-gray-300 hover:text-emerald-400">
                Payments
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline helper for Link to avoid import errors
import Link from 'next/link';
