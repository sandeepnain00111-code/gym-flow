'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { 
  Menu, 
  X, 
  ChevronDown, 
  QrCode, 
  Dumbbell, 
  Calendar, 
  Apple, 
  Users, 
  CreditCard, 
  ShieldCheck, 
  MessageSquare, 
  BarChart3 
} from 'lucide-react';

const featuresList = [
  { name: 'QR Attendance', href: '/features#qr-attendance', icon: QrCode, desc: 'Scan and check-in' },
  { name: 'Gym Portal', href: '/features#gym-portal', icon: Dumbbell, desc: 'Manage your gym' },
  { name: 'Workout Planner', href: '/features#workout-planner', icon: Calendar, desc: 'Custom splits & exercises' },
  { name: 'Diet Plans', href: '/features#diet-plans', icon: Apple, desc: 'Nutrition & diet charts' },
  { name: 'Trainer Management', href: '/features#trainers', icon: Users, desc: 'Assign trainers & sessions' },
  { name: 'Billing & Payments', href: '/features#billing', icon: CreditCard, desc: 'Invoices & automated fees' },
  { name: 'UPI Approvals', href: '/features#upi-approvals', icon: ShieldCheck, desc: 'Approve instant payments' },
  { name: 'Real-time Chat', href: '/features#chat', icon: MessageSquare, desc: 'Chat with members & trainers' },
  { name: 'Reports & Analytics', href: '/features#analytics', icon: BarChart3, desc: 'Revenue & attendance trends' },
];

export default function Navbar() {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = React.useState(false);

  const getLinkClass = (path) => {
    const isActive = pathname === path;
    return `text-sm font-semibold transition pb-1 border-b-2 ${
      isActive
        ? 'text-[#047857] border-[#047857]'
        : 'text-slate-500 hover:text-[#047857] border-transparent hover:border-[#047857]'
    }`;
  };

  const getMobileLinkClass = (path) => {
    const isActive = pathname === path;
    return `font-semibold block px-3 py-2 rounded-md text-base transition-all border-l-4 ${
      isActive
        ? 'text-[#047857] bg-emerald-50/50 border-[#047857] pl-3'
        : 'text-slate-600 hover:text-[#047857] hover:bg-slate-50 border-transparent'
    }`;
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'super_admin') return '/admin/dashboard';
    if (user.role === 'gym_owner') return '/owner/dashboard';
    return '/member/dashboard';
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#f8f9fc]/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-20">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                GymFlow
              </span>
            </Link>
          </div>

          {/* Desktop Center Links */}
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-8">
              <Link href="/" className={getLinkClass('/')}>
                Home
              </Link>
              
              {/* Features Dropdown */}
              <div 
                className="relative group py-5"
                onMouseEnter={() => setIsFeaturesOpen(true)}
                onMouseLeave={() => setIsFeaturesOpen(false)}
              >
                <button 
                  className={`flex items-center gap-1.5 text-sm font-semibold transition pb-1 border-b-2 outline-none cursor-pointer ${
                    pathname.startsWith('/features') || isFeaturesOpen
                      ? 'text-[#047857] border-[#047857]'
                      : 'text-slate-500 border-transparent hover:text-[#047857] hover:border-[#047857]'
                  }`}
                >
                  Features
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isFeaturesOpen ? 'rotate-180 text-[#047857]' : 'text-slate-400 group-hover:text-[#047857]'}`} />
                </button>

                {isFeaturesOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[580px] bg-white border border-slate-200 rounded-2xl shadow-xl p-4 grid grid-cols-2 gap-2 z-50 transition-all duration-200">
                    {featuresList.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsFeaturesOpen(false)}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-emerald-50/60 transition-all duration-200 group/item"
                        >
                          <div className="p-2 rounded-lg bg-emerald-50 text-[#047857] group-hover/item:bg-[#047857] group-hover/item:text-white transition-colors">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 group-hover/item:text-[#047857] transition-colors">
                              {item.name}
                            </p>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              <Link href="/solutions" className={getLinkClass('/solutions')}>
                Solutions
              </Link>
              <Link href="/about" className={getLinkClass('/about')}>
                About Us
              </Link>
              <Link href="/contact" className={getLinkClass('/contact')}>
                Contact
              </Link>
            </div>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-6">
              {isAuthenticated ? (
                <>
                  <Link
                    href={getDashboardLink()}
                    className="bg-[#047857] hover:bg-[#065f46] text-white font-bold px-6 py-2.5 rounded-full text-sm shadow-sm transition"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="text-slate-500 hover:text-red-500 text-sm font-semibold transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className={getLinkClass('/login')}>
                    Login
                  </Link>
                  <Link
                    href="/register?role=gym_owner"
                    className="bg-[#047857] hover:bg-[#065f46] text-white font-bold px-6 py-2.5 rounded-full text-sm shadow-sm transition hidden lg:inline-block"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      </nav>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 animate-fade-in shadow-xl fixed left-0 right-0 bottom-0 top-20 overflow-y-auto z-50">
          <div className="px-4 pt-4 pb-8 space-y-2 sm:px-6">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={getMobileLinkClass('/')}
            >
              Home
            </Link>
            {/* Features accordion on Mobile */}
            <div>
              <button
                onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
                className={`w-full flex items-center justify-between gap-4 font-semibold px-3 py-2 rounded-md text-base transition-all border-l-4 outline-none cursor-pointer ${
                  pathname.startsWith('/features') || isFeaturesOpen
                    ? 'text-[#047857] bg-emerald-50/50 border-[#047857]'
                    : 'text-slate-600 border-transparent hover:text-[#047857]'
                }`}
              >
                <span>Features</span>
                <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isFeaturesOpen ? 'rotate-180 text-[#047857]' : 'text-slate-400'}`} />
              </button>
              
              {isFeaturesOpen && (
                <div className="pl-4 pr-3 py-1.5 space-y-1 bg-slate-50/60 rounded-xl mt-1.5 border-l border-slate-200">
                  {featuresList.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => {
                          setIsOpen(false);
                          setIsFeaturesOpen(false);
                        }}
                        className="flex items-center gap-3 py-2 px-3 rounded-lg text-slate-600 hover:text-[#047857] hover:bg-emerald-50/50 transition-all text-sm font-semibold"
                      >
                        <Icon className="h-4.5 w-4.5 text-[#047857]" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
            <Link
              href="/solutions"
              onClick={() => setIsOpen(false)}
              className={getMobileLinkClass('/solutions')}
            >
              Solutions
            </Link>
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className={getMobileLinkClass('/about')}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className={getMobileLinkClass('/contact')}
            >
              Contact
            </Link>
            <div className="pt-4 pb-2 border-t border-slate-100 flex flex-col space-y-3 px-3">
              {isAuthenticated ? (
                <>
                  <Link
                    href={getDashboardLink()}
                    onClick={() => setIsOpen(false)}
                    className="bg-[#047857] text-white text-center font-bold py-3 rounded-full text-base"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      logout();
                    }}
                    className="text-red-500 hover:text-red-600 text-center py-2 text-base font-bold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-slate-700 hover:text-slate-900 text-center py-2 text-base font-bold"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
