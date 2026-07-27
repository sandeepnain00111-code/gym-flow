'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  Receipt,
  FileBarChart,
  Settings,
  QrCode,
  UserCheck,
  ClipboardList,
  Utensils,
  Megaphone,
  MessageSquare,
  BookOpen,
  CalendarCheck,
  LogOut,
  Award,
  Trophy
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const handleSwitchRole = (targetRole) => {
    if (targetRole === 'super_admin') {
      localStorage.setItem('accessToken', 'dev-bypass-token-admin');
      localStorage.setItem('user', JSON.stringify({ name: 'Dev Admin', role: 'super_admin', email: 'admin@gymflow.com' }));
      window.location.href = '/admin/dashboard';
    } else {
      localStorage.setItem('accessToken', 'dev-bypass-token-owner');
      localStorage.setItem('user', JSON.stringify({ name: 'Dev Gym Owner', role: 'gym_owner', email: 'owner@gymflow.com' }));
      window.location.href = '/owner/dashboard';
    }
  };

  if (!user) return null;

  const adminLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Gym Owners', href: '/admin/owners', icon: UserCheck },
    { name: 'Browse Gyms', href: '/admin/gyms', icon: Dumbbell },
    { name: 'All Members', href: '/admin/members', icon: Users },
    { name: 'Promo Slider', href: '/admin/promos', icon: Megaphone },
    { name: 'Payments History', href: '/admin/payments', icon: Receipt },
    { name: 'Platform Reports', href: '/admin/reports', icon: FileBarChart },
    { name: 'Settings', href: '/admin/settings', icon: Settings }
  ];

  const ownerLinks = [
    { name: 'Dashboard', href: '/owner/dashboard', icon: LayoutDashboard },
    { name: 'Gym Profile', href: '/owner/gym-profile', icon: Dumbbell },
    { name: 'Membership Plans', href: '/owner/plans', icon: ClipboardList },
    { name: 'QR Console', href: '/owner/qr', icon: QrCode },
    { name: 'Members Catalog', href: '/owner/members', icon: Users },
    { name: 'Join Requests', href: '/owner/join-requests', icon: UserCheck },
    { name: 'Demo Bookings', href: '/owner/demo-bookings', icon: BookOpen },
    { name: 'Gym Challenges', href: '/owner/challenges', icon: Trophy },
    { name: 'Fees & Renewals', href: '/owner/fees', icon: Receipt },
    { name: 'Daily Attendance', href: '/owner/attendance', icon: CalendarCheck },
    { name: 'Trainers Roster', href: '/owner/trainers', icon: UserCheck },
    { name: 'Staff Certificates', href: '/owner/certificates', icon: Award },
    { name: 'Workout Splits', href: '/owner/workout-plans', icon: ClipboardList },
    { name: 'Diet Blueprints', href: '/owner/diet-plans', icon: Utensils },
    { name: 'Announcements', href: '/owner/announcements', icon: Megaphone },
    { name: 'Gym Chatroom', href: '/owner/chat', icon: MessageSquare },
    { name: 'Gym Settings', href: '/owner/settings', icon: Settings }
  ];

  const memberLinks = [
    { name: 'Dashboard', href: '/member/dashboard', icon: LayoutDashboard },
    { name: 'Gym Lounge Chat', href: '/member/chat', icon: MessageSquare },
    { name: 'Training Routines', href: '/member/workout-plan', icon: ClipboardList },
    { name: 'Diet Blueprints', href: '/member/diet', icon: Utensils },
    { name: 'Attendance Scanner', href: '/member/attendance', icon: QrCode },
    { name: 'Joins & Invoices', href: '/member/joins', icon: Receipt },
    { name: 'Profile Settings', href: '/member/profile', icon: Settings }
  ];

  const links = user.role === 'super_admin' 
    ? adminLinks 
    : user.role === 'member'
    ? memberLinks
    : ownerLinks;

  return (
    <aside className="w-64 fixed top-0 left-0 h-screen flex flex-col z-20 hidden lg:flex bg-white border-r border-slate-100 shadow-sm transition-all duration-300" data-lenis-prevent>
      {/* Sidebar Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 bg-white">
        <Link href="/" className="flex items-center space-x-2">
          <img 
            src="/logo.png" 
            alt="GymFlow Logo" 
            className="h-14 w-auto object-contain"
          />
          <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex-shrink-0">
            {user.role === 'super_admin' ? 'Admin' : 'SaaS'}
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 no-scrollbar">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          const isSuperAdmin = user.role === 'super_admin';

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition duration-200 ${
                isSuperAdmin
                  ? isActive
                    ? 'bg-[#00DF89] text-white shadow-md shadow-emerald-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  : isActive
                    ? 'bg-emerald-500/10 text-emerald-600 border-l-4 border-emerald-500 shadow-inner'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`h-5 w-5 transition-colors ${
                isSuperAdmin
                  ? isActive ? 'text-white' : 'text-slate-400'
                  : isActive ? 'text-emerald-500' : 'text-slate-400'
              }`} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-100 bg-white space-y-3">
        {user.role === 'gym_owner' && (
          <Link
            href="/owner/join-requests"
            className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-500/10 transition duration-300"
          >
            <span>+ Join Requests (3)</span>
          </Link>
        )}

        {/* DEV Switch Button */}
        {user.role === 'super_admin' ? (
          <button
            onClick={() => handleSwitchRole('gym_owner')}
            className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-2 px-4 rounded-xl text-[10px] flex items-center justify-center space-x-1 border border-emerald-200 transition duration-350"
          >
            <span>🔄 DEV: Switch to Owner Dashboard</span>
          </button>
        ) : (
          <button
            onClick={() => handleSwitchRole('super_admin')}
            className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-bold py-2 px-4 rounded-xl text-[10px] flex items-center justify-center space-x-1 border border-red-200 transition duration-350"
          >
            <span>🔄 DEV: Switch to Admin Dashboard</span>
          </button>
        )}

        {user.role === 'super_admin' ? (
          <div className="flex items-center justify-between gap-4 w-full bg-slate-50 p-3 rounded-2xl border border-slate-100/80">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-[#00DF89] flex items-center justify-center text-white font-black text-xs shadow-sm">
                DA
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate max-w-[100px]">
                  Dev Admin
                </p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  Super Admin
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-200/50 transition"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4 w-full bg-slate-50 p-3 rounded-2xl border border-slate-100/80">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <span className="font-extrabold uppercase text-xs">
                  {user.name.charAt(0)}
                </span>
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate max-w-[100px]">
                  {user.name}
                </p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  {user.role === 'member' ? 'Gym Member' : 'Gym Manager'}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-200/50 transition"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
