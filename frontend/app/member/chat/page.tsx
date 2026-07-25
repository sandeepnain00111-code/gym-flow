'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import Spinner from '../../../components/ui/Spinner';
import ChatContainer from '../../../components/chat/ChatContainer';

export default function MemberChatRoom() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sandboxMode, setSandboxMode] = useState(false);

  useEffect(() => {
    const fetchGymDetails = async () => {
      try {
        const res = await api.get('/member/dashboard');
        if (res.data.success) {
          setData(res.data);
          if (res.data.noMembership) {
            setSandboxMode(true);
          }
        } else {
          setSandboxMode(true);
        }
      } catch (err) {
        console.error('Failed to load member chat, initiating Sandbox mode:', err.message);
        setSandboxMode(true);
      } finally {
        setLoading(false);
      }
    };
    fetchGymDetails();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Fallback gym if no active membership is configured in local db
  const gym = sandboxMode 
    ? { _id: "sandbox_member_lounge_id", name: "GymFlow Elite Arena (Sandbox)" } 
    : data?.membership?.gymId;

  return (
    <div className="w-full">
      {/* Immersive chat container directly starting under the navbar, touching left sidebar and right edge */}
      <ChatContainer gymId={gym?._id} gymName={gym?.name || 'Gym'} />
    </div>
  );
}
