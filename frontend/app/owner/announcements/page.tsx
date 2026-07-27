'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import Spinner from '../../../components/ui/Spinner';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Megaphone, PlusCircle, Trash, Save, Calendar } from 'lucide-react';

export default function AnnouncementsManagement() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<any>();

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/owner/announcements');
      if (res.data.success) {
        setAnnouncements(res.data.announcements);
      }
    } catch (err) {
      toast.error('Failed to load gym announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const onSubmitAnnouncement = async (data) => {
    setSubmitting(true);
    try {
      const res = await api.post('/owner/announcements', data);
      if (res.data.success) {
        toast.success('Announcement broadcasted successfully! 📢');
        setShowAddForm(false);
        reset();
        fetchAnnouncements();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post notice');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const res = await api.delete(`/owner/announcements/${id}`);
      if (res.data.success) {
        toast.success('Announcement deleted');
        fetchAnnouncements();
      }
    } catch (error) {
      toast.error('Failed to delete announcement');
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Gym Announcements Hub</h1>
          <p className="text-gray-400 text-xs mt-1">Broadcast daily notices, schedules adjustments, holiday announcements, and trainer rosters.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-500/10 transition"
          >
            <PlusCircle className="h-4.5 w-4.5" />
            <span>Post New Announcement</span>
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit(onSubmitAnnouncement)}
          className="glass-panel p-6 rounded-3xl border border-emerald-500/20 space-y-4 animate-fade-in"
        >
          <h3 className="text-sm font-bold text-white">Draft Announcement</h3>
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Title</label>
              <input
                type="text"
                placeholder="e.g. Independence Day Holiday Schedule"
                {...register('title', { required: 'Title is required' })}
                className="w-full px-4 py-2.5 text-xs glass-input rounded-xl"
              />
              {errors.title && <p className="text-red-400 text-[10px] mt-1">{String(errors.title.message)}</p>}
            </div>

            {/* Content */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">Content Message</label>
              <textarea
                rows={4}
                placeholder="Write notice details to broadcast..."
                {...register('content', { required: 'Content details are required' })}
                className="w-full px-4 py-2.5 text-xs glass-input rounded-xl resize-none"
              />
              {errors.content && <p className="text-red-400 text-[10px] mt-1">{String(errors.content.message)}</p>}
            </div>
          </div>

          <div className="flex space-x-3 pt-2 justify-end">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bg-white/5 hover:bg-white/10 text-white font-bold py-2 px-4 rounded-xl text-[10px] transition border border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold py-2 px-5 rounded-xl text-[10px] flex items-center space-x-1 transition shadow-md shadow-emerald-500/10"
            >
              {submitting ? <Spinner size="sm" /> : <span>Broadcast Announcement</span>}
            </button>
          </div>
        </form>
      )}

      {/* Listing */}
      {announcements.length === 0 ? (
        <div className="glass-panel text-center p-16 rounded-3xl border border-white/5 max-w-md mx-auto">
          <Megaphone className="h-10 w-10 text-gray-600 mx-auto mb-3" />
          <p className="text-xs text-gray-400">No announcements posted yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((notif) => (
            <div key={notif._id} className="glass-card p-6 rounded-3xl border border-white/5 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full pointer-events-none" />
              <div className="flex justify-between gap-4 items-start">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <Megaphone className="h-4.5 w-4.5" />
                  <h3 className="text-sm font-bold text-white">{notif.title}</h3>
                </div>
                <button
                  onClick={() => handleDeleteAnnouncement(notif._id)}
                  className="text-red-400 hover:text-red-300 p-1 bg-red-500/10 border border-red-500/20 rounded-lg transition"
                >
                  <Trash className="h-3.5 w-3.5" />
                </button>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed font-sans">{notif.content}</p>

              <div className="flex items-center space-x-1.5 text-[10px] text-gray-500 pt-2 border-t border-white/5">
                <Calendar className="h-3.5 w-3.5" />
                <span>Posted on: {new Date(notif.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
