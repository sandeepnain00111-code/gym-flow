'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import Spinner from '../../../components/ui/Spinner';
import { toast } from 'react-hot-toast';
import { Users, Search, Mail, Phone, Calendar } from 'lucide-react';

const DUMMY_USERS = [
  {
    _id: 'user_1',
    name: 'Super Admin',
    email: 'admin@gymflow.com',
    phone: '9999999999',
    role: 'super_admin',
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    _id: 'user_2',
    name: 'Rohan Sharma',
    email: 'owner@gymflow.com',
    phone: '8888888888',
    role: 'gym_owner',
    status: 'active',
    createdAt: '2026-02-15T00:00:00.000Z'
  },
  {
    _id: 'user_3',
    name: 'Rahul Roy',
    email: 'member@gymflow.com',
    phone: '9876543210',
    role: 'member',
    status: 'active',
    createdAt: '2026-03-10T00:00:00.000Z'
  },
  {
    _id: 'user_4',
    name: 'Priya Sharma',
    email: 'member2@gymflow.com',
    phone: '9123456789',
    role: 'member',
    status: 'active',
    createdAt: '2026-04-05T00:00:00.000Z'
  }
];

export default function AdminMembers() {
  const [users, setUsers] = useState(DUMMY_USERS);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('search') || '';
    if (q) setSearchTerm(q);

    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        if (res.data.success && Array.isArray(res.data.users)) {
          setUsers(res.data.users);
        }
      } catch (err) {
        console.log('Using default mock users list');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Global User Catalog</h1>
        <p className="text-slate-400 text-xs mt-1">Audit all platform user profiles, dynamic role markers, and registration records.</p>
      </div>

      {/* Filter */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search global users by name or email..."
          value={searchTerm}
          onChange={(e) => {
            const val = e.target.value;
            setSearchTerm(val);
            const params = new URLSearchParams(window.location.search);
            if (val) {
              params.set('search', val);
            } else {
              params.delete('search');
            }
            window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
          }}
          className="w-full pl-11 pr-4 py-3 text-xs bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#00DF89] focus:outline-none focus:ring-1 focus:ring-[#00DF89] rounded-2xl shadow-sm transition-all"
        />
      </div>

      {/* Table */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white text-center p-16 rounded-[28px] border border-slate-100 max-w-md mx-auto shadow-sm">
          <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-xs text-slate-400 font-bold">No users match search criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[28px] border border-slate-150 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-extrabold uppercase tracking-wider">
                  <th className="px-6 py-4.5">User Info</th>
                  <th className="px-6 py-4.5">Role Badge</th>
                  <th className="px-6 py-4.5">Contact Detail</th>
                  <th className="px-6 py-4.5">Account Status</th>
                  <th className="px-6 py-4.5">Registered On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center font-black text-[#00DF89] text-xs uppercase shadow-sm">
                        {u.name.charAt(0)}
                      </div>
                      <span className="font-extrabold text-slate-800">{u.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[8px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                          u.role === 'super_admin'
                            ? 'bg-rose-50 text-rose-600 border-rose-100'
                            : u.role === 'gym_owner'
                            ? 'bg-amber-50 text-amber-600 border-amber-100'
                            : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}
                      >
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 font-semibold">
                        <p className="flex items-center space-x-1.5">
                          <Mail className="h-3.5 w-3.5 text-[#00DF89] flex-shrink-0" />
                          <span className="text-slate-700">{u.email}</span>
                        </p>
                        <p className="flex items-center space-x-1.5 text-slate-400">
                          <Phone className="h-3.5 w-3.5 text-slate-300 flex-shrink-0" />
                          <span>{u.phone || 'N/A'}</span>
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 font-extrabold uppercase">
                        {u.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

