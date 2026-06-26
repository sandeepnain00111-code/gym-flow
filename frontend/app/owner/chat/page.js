'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import Spinner from '../../../components/ui/Spinner';
import ChatContainer from '../../../components/chat/ChatContainer';
import { MessageCircle, AlertCircle, Play } from 'lucide-react';

export default function OwnerChatRoom() {
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sandboxMode, setSandboxMode] = useState(false);

  useEffect(() => {
    const fetchGym = async () => {
      try {
        const res = await api.get('/owner/gym');
        if (res.data.success && res.data.gym) {
          setGym(res.data.gym);
        } else {
          // If no gym completed, activate Sandbox preview so the user isn't blocked!
          setGym({
            _id: "sandbox_gym_lounge_id",
            name: "GymFlow Elite Arena (Sandbox)"
          });
          setSandboxMode(true);
        }
      } catch (err) {
        console.error('Gym profile not completed, initiating Sandbox mode');
        setGym({
          _id: "sandbox_gym_lounge_id",
          name: "GymFlow Elite Arena (Sandbox)"
        });
        setSandboxMode(true);
      } finally {
        setLoading(false);
      }
    };
    fetchGym();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Gym Lounge chatroom</h1>
          <p className="text-gray-400 text-xs mt-1">Real-time peer discussion space with trainers and checked-in members.</p>
        </div>

        {/* Dynamic Sandbox Mode Tag */}
        {sandboxMode && (
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 px-4 py-2 rounded-2xl w-fit">
            <AlertCircle className="h-4 w-4 text-amber-450 animate-pulse" />
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">
              Preview Sandbox Active
            </span>
          </div>
        )}
      </div>

      {/* Main chat */}
      {gym && <ChatContainer gymId={gym._id} gymName={gym.name} />}
    </div>
  );
}
