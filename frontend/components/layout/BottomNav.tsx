'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Dumbbell,
  QrCode,
  Utensils,
  MessageSquare
} from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/member/dashboard', icon: LayoutDashboard },
    { name: 'Routines', href: '/member/workout-plan', icon: Dumbbell },
    { name: 'Scan QR', href: '/member/attendance', icon: QrCode, highlight: true },
    { name: 'Diet', href: '/member/diet', icon: Utensils },
    { name: 'Chat', href: '/member/chat', icon: MessageSquare }
  ];

  return (
    <nav className="fixed bottom-4 left-4 right-4 h-16 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-100 shadow-xl flex items-center justify-around px-4 z-40 lg:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        if (item.highlight) {
          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative -top-5 flex flex-col items-center"
            >
              <div className="w-13 h-13 bg-gradient-to-tr from-emerald-600 to-emerald-450 rounded-full flex items-center justify-center border-4 border-[#FCFDFE] shadow-lg shadow-emerald-500/25 transform hover:scale-105 active:scale-95 transition">
                <Icon className="h-5.5 w-5.5 text-white" />
              </div>
              <span className="text-[9px] text-emerald-600 font-extrabold mt-1 tracking-wide">
                {item.name}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-col items-center justify-center flex-1 h-full relative"
          >
            <Icon
              className={`h-5 w-5 transition-colors duration-200 ${
                isActive ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-650'
              }`}
            />
            <span
              className={`text-[9px] mt-1 font-bold transition-colors duration-200 ${
                isActive ? 'text-emerald-600' : 'text-slate-450'
              }`}
            >
              {item.name}
            </span>
            {isActive && (
              <div className="absolute bottom-0 left-50% -translate-x-50% w-3 h-1 rounded-full bg-emerald-500 shadow-sm" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
