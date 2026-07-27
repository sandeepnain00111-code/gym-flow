'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { Bell, Menu, Search, ChevronDown } from 'lucide-react';
import api from '../../lib/api';
import { toast } from 'react-hot-toast';

const mockNotificationsFallback = [
  {
    _id: 'mock-1',
    title: 'New Membership Request',
    message: 'Rahul Roy has requested access to join with the plan Gold Monthly Split.',
    type: 'membership_request',
    isRead: false,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'mock-2',
    title: 'Membership Expiry Alert',
    message: 'Membership for Priya Sharma is expiring in 2 days.',
    type: 'membership_expiry',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];

export default function Topbar({ onMenuToggle }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [notifications, setNotifications] = React.useState([]);
  const notificationRef = React.useRef(null);

  // Web Audio dynamic chime sound generator (Ding-dong chime)
  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const playTone = (freq, start, duration) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        
        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(start);
        osc.stop(start + duration);
      };

      const now = audioCtx.currentTime;
      playTone(523.25, now, 0.15); // C5 tone
      playTone(659.25, now + 0.1, 0.3); // E5 tone
    } catch (e) {
      console.error('AudioContext sound failed', e);
    }
  };

  // Fetch notifications with polling (runs only for gym_owner role)
  React.useEffect(() => {
    if (!user || user.role !== 'gym_owner') return;

    const fetchNotifications = async () => {
      const currentOwner = user?.name || 'Dev Gym Owner';
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

      const getLocalNotifications = () => {
        const localSaved = localStorage.getItem('gymflow_notifications');
        if (!localSaved) {
          localStorage.setItem('gymflow_notifications', JSON.stringify(mockNotificationsFallback));
          return mockNotificationsFallback;
        }
        try {
          return JSON.parse(localSaved);
        } catch (e) {
          return mockNotificationsFallback;
        }
      };

      if (token === 'dev-bypass-token') {
        const localNotifs = getLocalNotifications();
        const filtered = localNotifs.filter((n: any) => !n.ownerName || n.ownerName === currentOwner);
        setNotifications(filtered.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        return;
      }

      try {
        const res = await api.get('/owner/notifications');
        let apiNotifs = [];
        if (res.data.success) {
          apiNotifs = res.data.notifications;
        }

        const localNotifs = getLocalNotifications();
        const combined = [...localNotifs, ...apiNotifs];

        // Remove duplicate IDs if any
        const uniqueMap = new Map();
        combined.forEach((n: any) => {
          const id = n._id || n.id;
          uniqueMap.set(id, n);
        });
        const uniqueList = Array.from(uniqueMap.values());

        const filtered = uniqueList.filter((n: any) => !n.ownerName || n.ownerName === currentOwner);
        const sorted = filtered.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setNotifications(prev => {
          const prevUnread = prev.filter((n: any) => !n.isRead).length;
          const newUnread = sorted.filter((n: any) => !n.isRead).length;
          if (newUnread > prevUnread && prev.length > 0) {
            playNotificationSound();
          }
          return sorted;
        });
      } catch (e) {
        console.warn('Failed to fetch notifications, falling back to mock/local notifications.', e);
        const localNotifs = getLocalNotifications();
        const filtered = localNotifs.filter((n: any) => !n.ownerName || n.ownerName === currentOwner);
        setNotifications(filtered.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);

    const handleStorageChange = () => {
      fetchNotifications();
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user]);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const handleMarkAllRead = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (token !== 'dev-bypass-token') {
        await api.post('/owner/notifications/mark-all-read');
      }
    } catch (e) {
      console.warn('Failed to mark all read on backend');
    }

    // Update local storage
    const localSaved = localStorage.getItem('gymflow_notifications');
    if (localSaved) {
      try {
        const localNotifs = JSON.parse(localSaved).map((n: any) => ({ ...n, isRead: true }));
        localStorage.setItem('gymflow_notifications', JSON.stringify(localNotifs));
      } catch (e) {
        console.error(e);
      }
    }

    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast.success('All notifications marked as read');
  };

  const handleMarkRead = async (id: string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (token !== 'dev-bypass-token') {
        await api.patch(`/owner/notifications/${id}/read`);
      }
    } catch (e) {
      console.warn('Failed to mark read on backend');
    }

    // Update local storage
    const localSaved = localStorage.getItem('gymflow_notifications');
    if (localSaved) {
      try {
        const localNotifs = JSON.parse(localSaved).map((n: any) => {
          const nid = n._id || n.id;
          if (nid === id) return { ...n, isRead: true };
          return n;
        });
        localStorage.setItem('gymflow_notifications', JSON.stringify(localNotifs));
      } catch (e) {
        console.error(e);
      }
    }

    setNotifications(prev => prev.map((n: any) => {
      const nid = n._id || n.id;
      if (nid === id) return { ...n, isRead: true };
      return n;
    }));
  };

  const getPageTitle = () => {
    const parts = pathname.split('/');
    const lastPart = parts[parts.length - 1];
    if (!lastPart || lastPart === 'dashboard') return 'Dashboard Overview';
    return lastPart
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', icon: '🌅' };
    if (hour < 17) return { text: 'Good Afternoon', icon: '☀️' };
    return { text: 'Good Evening', icon: '🌙' };
  };

  // Helper helper to get icon and bgClass based on type
  const getNotificationMeta = (type: string) => {
    switch (type) {
      case 'membership_request':
        return {
          icon: '👤',
          bgClass: 'bg-blue-50 text-blue-600 border-blue-100'
        };
      case 'membership_expiry':
        return {
          icon: '⚡',
          bgClass: 'bg-amber-50 text-amber-600 border-amber-100'
        };
      case 'battle_accepted':
        return {
          icon: '⚔️',
          bgClass: 'bg-rose-50 text-rose-600 border-rose-100'
        };
      default:
        return {
          icon: '🔔',
          bgClass: 'bg-slate-50 text-slate-600 border-slate-100'
        };
    }
  };

  return (
    <header className="h-16 fixed top-0 right-0 left-0 lg:left-64 z-50 border-b border-slate-100 bg-white/85 backdrop-blur-md flex items-center justify-between gap-4 px-6 transition-all duration-300">
      {/* Page Title & Mobile Toggle */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg transition focus:outline-none text-slate-500 hover:text-slate-800 hover:bg-slate-50"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="hidden md:flex flex-col">
          <h1 className="text-base font-extrabold tracking-tight text-slate-800 transition-colors duration-300">
            {getPageTitle()}
          </h1>
          <p className="text-[10px] font-bold flex items-center gap-1.5 mt-0.5 text-slate-400">
            <span>{getGreeting().icon}</span>
            <span>{getGreeting().text}, {user?.name || 'Dev Admin'}</span>
          </p>
        </div>
      </div>

      {/* Quick search and User actions */}
      <div className="flex items-center space-x-6">
        {/* Search bar inside light gray rounded input */}
        <div className="relative max-w-xs hidden sm:block group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-hover:text-[#10b981]" />
          <input
            type="text"
            placeholder="Search members, plans..."
            className="w-52 pl-9 pr-12 h-9 rounded-full text-xs font-semibold transition-all duration-300 bg-slate-100/80 border border-slate-200 text-slate-800 focus:bg-white focus:border-[#10b981] focus:outline-none focus:ring-2 focus:ring-[#10b981]/10 focus:w-64"
          />
          <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[9px] font-black border bg-white border-slate-200 text-slate-400 shadow-sm transition-colors">
            ⌘K
          </kbd>
        </div>

        {/* Notifications Dropdown */}
        <div ref={notificationRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full transition relative focus:outline-none group text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          >
            <Bell className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12 group-active:scale-95" />
            {notifications.some(n => !n.isRead) && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full border bg-red-500 border-white shadow-sm animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="fixed sm:absolute right-4 sm:right-0 top-16 sm:top-auto left-4 sm:left-auto mt-3 w-auto sm:w-80 max-w-md sm:max-w-none mx-auto sm:mx-0 rounded-2xl shadow-xl py-3 border border-slate-100 bg-white text-slate-800 shadow-slate-200/50 z-50 transition-all duration-200 transform origin-top-right">
              <div className="flex items-center justify-between gap-4 px-4 pb-2.5 border-b border-slate-100">
                <span className="text-xs font-extrabold text-slate-800">Alert Notifications</span>
                {notifications.some(n => !n.isRead) && (
                  <span 
                    onClick={handleMarkAllRead} 
                    className="text-[10px] text-emerald-500 hover:text-emerald-600 font-extrabold cursor-pointer"
                  >
                    Mark all read
                  </span>
                )}
              </div>
              <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto no-scrollbar" data-lenis-prevent>
                {notifications.length === 0 ? (
                  <p className="text-[10px] text-slate-450 text-center py-8 font-semibold">No notifications yet.</p>
                ) : (
                  notifications.map((notif) => {
                    const meta = getNotificationMeta(notif.type);
                    return (
                      <div 
                        key={notif._id || notif.id} 
                        onClick={() => !notif.isRead && handleMarkRead(notif._id || notif.id)}
                        className={`p-3 flex items-start space-x-3 hover:bg-slate-50/80 transition cursor-pointer ${
                          !notif.isRead ? 'bg-slate-50/20 font-bold' : ''
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm border flex-shrink-0 ${meta.bgClass}`}>
                          {meta.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-extrabold truncate text-slate-800 flex items-center justify-between gap-2">
                            <span>{notif.title}</span>
                            {!notif.isRead && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0 animate-ping" />}
                          </p>
                          <p className="text-[10px] mt-0.5 leading-normal text-slate-500">{notif.message}</p>
                          <span className="text-[9px] mt-1.5 block font-bold text-slate-400">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile indicator */}
        <div className="flex items-center">
          <div 
            onClick={() => router.push(`/owner/profile?name=${encodeURIComponent(user?.name || 'Dev Gym Owner')}`)}
            className="flex items-center space-x-3 bg-slate-50 pl-3.5 pr-2 py-1.5 rounded-full border border-slate-150 shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:border-slate-250 hover:bg-slate-100/50 transition duration-300 cursor-pointer group"
          >
            <div className="text-left hidden sm:block">
              <p className="text-xs font-extrabold text-slate-800 leading-tight">
                {user?.name || 'Dev Gym Owner'}
              </p>
              <p className="text-[9px] text-slate-450 font-bold uppercase tracking-wider mt-0.5">
                {user?.role === 'super_admin' ? 'Super Admin' : 'Gym Owner'}
              </p>
            </div>
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 font-black text-xs uppercase shadow-sm transition duration-300 group-hover:scale-105">
                {(user?.name || 'Dev Gym Owner').charAt(0)}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition-transform duration-300 group-hover:translate-y-0.5" />
          </div>
        </div>
      </div>
    </header>
  );
}
