'use client';

import React, { useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Trophy, 
  Flame, 
  MessageCircle, 
  ThumbsUp, 
  Share2, 
  Play, 
  Users, 
  CheckCircle, 
  ArrowLeft, 
  Send,
  X,
  Award,
  Video,
  Image as ImageIcon,
  Heart,
  Camera,
  Edit
} from 'lucide-react';
import api from '../../../lib/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../../store/authStore';

// Registered owner profiles registry
const mockOwnerProfiles: Record<string, {
  id: string;
  name: string;
  gymName: string;
  avatar: string;
  bio: string;
  supporters: number;
  joined: string;
}> = {
  "Vikram Sharma": {
    id: "@vikram_powerhouse",
    name: "Vikram Sharma",
    gymName: "Powerhouse Gym",
    avatar: "VS",
    bio: "Elite strength coach, Powerlifting gold medalist. Pushing the boundaries of heavy physical performance at Powerhouse Gym Delhi.",
    supporters: 1420,
    joined: "1 year ago"
  },
  "Neha Gupta": {
    id: "@neha_irontemple",
    name: "Neha Gupta",
    gymName: "Iron Temple Delhi",
    avatar: "NG",
    bio: "CrossFit Level 3 Trainer. Strong believer in functional training, HIIT, high-intensity aerobic conditioning, and mental resilience.",
    supporters: 890,
    joined: "8 months ago"
  },
  "Amit Patel": {
    id: "@amit_golds_fitness",
    name: "Amit Patel",
    gymName: "Gold's Fitness Mumbai",
    avatar: "AP",
    bio: "Natural bodybuilding athlete, certified nutritionist, and consultant. Dedicated to real, natural body recomposition.",
    supporters: 2350,
    joined: "2 years ago"
  },
  "Rohan Malhotra": {
    id: "@rohan_velocity",
    name: "Rohan Malhotra",
    gymName: "Velocity Fitness Club",
    avatar: "RM",
    bio: "Calisthenics practitioner, mobility coach, and athlete. Believes physical training is a daily journey of daily movement freedom.",
    supporters: 620,
    joined: "6 months ago"
  },
  "Dev Gym Owner": {
    id: "@dev_fitness_arena",
    name: "Dev Gym Owner",
    gymName: "My Fitness Arena",
    avatar: "MO",
    bio: "Founder of My Fitness Arena. Building the next generation of SaaS fitness challenges to keep athletes engaged and motivated.",
    supporters: 1050,
    joined: "Recently"
  }
};

const getOwnerProfile = (name: string) => {
  if (mockOwnerProfiles[name]) {
    return mockOwnerProfiles[name];
  }
  return {
    id: `@${name.toLowerCase().replace(/\s+/g, '_')}`,
    name: name,
    gymName: "GymFlow Partner Gym",
    avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    bio: "Passionate gym owner and athlete looking to improve community physical standards.",
    supporters: 320,
    joined: "Recently"
  };
};

const initialChallenges = [
  {
    id: 1,
    creatorName: "Vikram Sharma",
    creatorGym: "Powerhouse Gym",
    creatorAvatar: "VS",
    title: "150kg Bench Press Max Reps",
    type: "video",
    reward: 5000,
    description: "Who can beat 12 clean repetitions of 150kg bench press? Post your video verification here. No bouncing off the chest! Form must be locked in.",
    mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-boxer-training-with-a-punching-bag-40097-large.mp4",
    likes: 42,
    hasLiked: false,
    commentsCount: 2,
    comments: [
      { id: 1, userName: "Rohan Malhotra", userAvatar: "RM", gymName: "Velocity Fitness Club", text: "Locked in! I am definitely trying this tomorrow.", createdAt: "1 hour ago" },
      { id: 2, userName: "Amit Patel", userAvatar: "AP", gymName: "Gold's Fitness Mumbai", text: "Form must be strict. Good luck guys!", createdAt: "30 mins ago" }
    ],
    acceptedCount: 3,
    status: "active",
    createdAt: "2 hours ago",
    scope: "public",
    targetGym: "All Gyms",
    area: "Delhi"
  },
  {
    id: 2,
    creatorName: "Neha Gupta",
    creatorGym: "Iron Temple Delhi",
    creatorAvatar: "NG",
    title: "1000 Burpees Cardiotonic",
    type: "written",
    reward: 12000,
    description: "Complete 1000 standard burpees in under 60 minutes. Written log of timestamped intervals required, along with trainer sign-off. Let's see who has the best conditioning!",
    likes: 18,
    hasLiked: false,
    commentsCount: 1,
    comments: [
      { id: 1, userName: "Vikram Sharma", userAvatar: "VS", gymName: "Powerhouse Gym", text: "Conditioning at its best. Neha always sets tough ones!", createdAt: "2 hours ago" }
    ],
    acceptedCount: 1,
    status: "active",
    createdAt: "5 hours ago",
    scope: "direct",
    targetGym: "GYM-3402 - Gold's Fitness",
    area: "Mumbai"
  },
  {
    id: 3,
    creatorName: "Amit Patel",
    creatorGym: "Gold's Fitness Mumbai",
    creatorAvatar: "AP",
    title: "Bicep Peak Peak Performance",
    type: "image",
    reward: 7500,
    description: "Best 30-day bicep peak transformation. Upload progress photo with date verification. Winner takes the bet pool!",
    mediaUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop",
    likes: 35,
    hasLiked: false,
    commentsCount: 3,
    comments: [
      { id: 1, userName: "Neha Gupta", userAvatar: "NG", gymName: "Iron Temple Delhi", text: "Wow, 30 days is short but exciting!", createdAt: "12 hours ago" },
      { id: 2, userName: "Rohan Malhotra", userAvatar: "RM", gymName: "Velocity Fitness Club", text: "Already started my peak week training.", createdAt: "8 hours ago" },
      { id: 3, userName: "Vikram Sharma", userAvatar: "VS", gymName: "Powerhouse Gym", text: "Looking forward to seeing the submissions.", createdAt: "4 hours ago" }
    ],
    acceptedCount: 5,
    status: "active",
    createdAt: "1 day ago",
    scope: "public",
    targetGym: "All Gyms",
    area: "Delhi"
  },
  {
    id: 4,
    creatorName: "Rohan Malhotra",
    creatorGym: "Velocity Fitness Club",
    creatorAvatar: "RM",
    title: "500kg Leg Press Burnout",
    type: "video",
    reward: 8000,
    description: "Loading 500kg leg press for maximum reps until failure. Reps must be 90 degrees knee flexion. Send your video replies to claim the cash prize!",
    mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-athlete-working-out-with-suspension-straps-43093-large.mp4",
    likes: 29,
    hasLiked: false,
    commentsCount: 2,
    comments: [
      { id: 1, userName: "Amit Patel", userAvatar: "AP", gymName: "Gold's Fitness Mumbai", text: "500kg is serious weight. Be safe with the knees!", createdAt: "18 hours ago" },
      { id: 2, userName: "Neha Gupta", userAvatar: "NG", gymName: "Iron Temple Delhi", text: "Whoa, that leg pump is going to be insane.", createdAt: "10 hours ago" }
    ],
    acceptedCount: 2,
    status: "active",
    createdAt: "1 day ago",
    scope: "public",
    targetGym: "All Gyms",
    area: "Global"
  },
  {
    id: 5,
    creatorName: "Vikram Sharma",
    creatorGym: "Powerhouse Gym",
    creatorAvatar: "VS",
    title: "100 Pull-Ups Speedrun Battle",
    description: "Hang in and hit 100 dead-hang pull-ups in the minimum time possible. Strict forms only—no chin-ups, no kipping, no momentum. Record with a continuous, uncut video showing full extension at the bottom and chin clearing the bar at the top.",
    reward: 15000,
    likes: 84,
    hasLiked: false,
    commentsCount: 2,
    comments: [
      { id: 1, userName: "Amit Patel", userAvatar: "AP", gymName: "Gold's Fitness Mumbai", text: "Vikram form looks solid! Kipping is definitely out of this.", createdAt: "1 hour ago" },
      { id: 2, userName: "Neha Gupta", userAvatar: "NG", gymName: "Iron Temple Delhi", text: "I'm going to attempt this tomorrow. Watch out for the timer!", createdAt: "45 mins ago" }
    ],
    acceptedCount: 9,
    createdAt: "2 hours ago",
    type: "video",
    mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-doing-pull-ups-in-a-gym-43029-large.mp4",
    status: "active",
    scope: "public",
    targetGym: "All Gyms",
    area: "Delhi"
  },
  {
    id: 6,
    creatorName: "Vikram Sharma",
    creatorGym: "Powerhouse Gym",
    creatorAvatar: "VS",
    title: "200kg Squat Depth Verification",
    description: "Verify your heavy squat depth battle. Squat at least 200kg (440lbs) below parallel. Video must clearly capture side-view angles showing hip crease dropping below the top of the knee.",
    reward: 25000,
    likes: 128,
    hasLiked: false,
    commentsCount: 1,
    comments: [
      { id: 1, userName: "Rohan Malhotra", userAvatar: "RM", gymName: "Velocity Fitness Club", text: "200kg depth is no joke. Respect!", createdAt: "22 hours ago" }
    ],
    acceptedCount: 14,
    createdAt: "1 day ago",
    type: "video",
    mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-weightlifter-doing-squats-with-heavy-barbell-43027-large.mp4",
    status: "active",
    scope: "public",
    targetGym: "All Gyms",
    area: "Delhi"
  },
  {
    id: 7,
    creatorName: "Neha Gupta",
    creatorGym: "Iron Temple Delhi",
    creatorAvatar: "NG",
    title: "3-Minute HIIT Burpee Challenge",
    description: "Perform maximum chest-to-ground burpees with a jump in exactly 180 seconds. Submit your continuous video to claim the reward pool.",
    reward: 8000,
    likes: 56,
    hasLiked: false,
    commentsCount: 0,
    comments: [],
    acceptedCount: 31,
    createdAt: "3 hours ago",
    type: "video",
    mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-burpees-in-fitness-studio-43031-large.mp4",
    status: "active",
    scope: "public",
    targetGym: "All Gyms",
    area: "Delhi"
  },
  {
    id: 8,
    creatorName: "Amit Patel",
    creatorGym: "Gold's Fitness Mumbai",
    creatorAvatar: "AP",
    title: "Maximum Bench Press Reps (Bodyweight)",
    description: "Load your exact current bodyweight on the bar and press it for max repetitions. Submit a clear uncut video showing locking out of arms.",
    reward: 12000,
    likes: 92,
    hasLiked: false,
    commentsCount: 0,
    comments: [],
    acceptedCount: 8,
    createdAt: "2 days ago",
    type: "image",
    mediaUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800",
    status: "active",
    scope: "public",
    targetGym: "All Gyms",
    area: "Mumbai"
  },
  {
    id: 9,
    creatorName: "Rohan Malhotra",
    creatorGym: "Velocity Fitness Club",
    creatorAvatar: "RM",
    title: "Plank Hold Endurance Arena",
    description: "Hold a forearm plank for maximum duration. Post your continuous verification logs below. Target is to break the 6-minute barrier.",
    reward: 6000,
    likes: 47,
    hasLiked: false,
    commentsCount: 0,
    comments: [],
    acceptedCount: 18,
    createdAt: "5 days ago",
    type: "image",
    mediaUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800",
    status: "active",
    scope: "public",
    targetGym: "All Gyms",
    area: "Pune"
  }
];

function ProfilePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ownerName = searchParams.get('name') || 'Vikram Sharma';

  const { user } = useAuthStore();
  const currentLoggedInOwner = user?.name || 'Dev Gym Owner';
  
  const [challenges, setChallenges] = useState<any[]>([]);
  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null);
  
  // Custom Profile Banners upload state
  const [customBanners, setCustomBanners] = useState<Record<string, string>>({});
  const bannerInputRef = useRef<HTMLInputElement | null>(null);

  // Editing challenge state
  const [editingChallenge, setEditingChallenge] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editReward, setEditReward] = useState('');
  const [editMediaUrl, setEditMediaUrl] = useState('');
  const [editType, setEditType] = useState<'image' | 'video'>('video');

  // Load challenges from localStorage on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gymflow_challenges');
      if (saved) {
        try {
          setChallenges(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse challenges:', e);
          setChallenges(initialChallenges);
        }
      } else {
        setChallenges(initialChallenges);
        localStorage.setItem('gymflow_challenges', JSON.stringify(initialChallenges));
      }
    }
  }, []);

  // Load custom banners on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gymflow_profile_banners');
      if (saved) {
        try {
          setCustomBanners(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse saved banners:', e);
        }
      }
    }
  }, []);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        setCustomBanners(prev => {
          const updated = {
            ...prev,
            [ownerName]: result
          };
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('gymflow_profile_banners', JSON.stringify(updated));
            } catch (err) {
              console.error('LocalStorage write failed:', err);
              toast.error('Storage full! Please upload a smaller image.');
            }
          }
          return updated;
        });
        toast.success('Profile banner updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Instagram Lightbox State
  const [activeLightboxId, setActiveLightboxId] = useState<number | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  const profile = getOwnerProfile(ownerName);
  const ownerChallenges = challenges.filter(c => c.creatorName === profile.name);
  
  const activeBanner = customBanners[ownerName] || null;
  const isOwnProfile = ownerName === 'Dev Gym Owner';

  // Playback handler in Lightbox
  const toggleVideoPlay = (id: number) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (playingVideoId === id) {
      video.pause();
      setPlayingVideoId(null);
    } else {
      if (playingVideoId !== null && videoRefs.current[playingVideoId]) {
        videoRefs.current[playingVideoId]?.pause();
      }
      video.play().catch(() => {});
      setPlayingVideoId(id);
    }
  };

  const handleLikeToggle = (id: number) => {
    const updatedChallenges = challenges.map(c => {
      if (c.id === id) {
        return {
          ...c,
          likes: c.hasLiked ? Math.max(0, c.likes - 1) : c.likes + 1,
          hasLiked: !c.hasLiked
        };
      }
      return c;
    });
    setChallenges(updatedChallenges);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gymflow_challenges', JSON.stringify(updatedChallenges));
    }
    toast.success('Battle liked!');
  };

  const handleShare = (challenge: any) => {
    const shareUrl = `${window.location.origin}/owner/profile?name=${encodeURIComponent(challenge.creatorName)}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast.success(`Share link copied: ${challenge.title}`);
      }).catch(() => {
        toast.error('Failed to copy link.');
      });
    } else {
      toast.success(`Sharing: ${challenge.title}`);
    }
  };

  const handleAccept = (id: number, title: string) => {
    const challenge = challenges.find(c => c.id === id);
    const creatorName = challenge ? challenge.creatorName : "Vikram Sharma";

    const updatedChallenges = challenges.map(c => {
      if (c.id === id) {
        if (c.hasAccepted) return c;
        return { 
          ...c, 
          acceptedCount: c.acceptedCount + 1,
          hasAccepted: true
        };
      }
      return c;
    });

    setChallenges(updatedChallenges);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gymflow_challenges', JSON.stringify(updatedChallenges));

      // Create local notifications
      const savedNotifs = localStorage.getItem('gymflow_notifications');
      let notifications = savedNotifs ? JSON.parse(savedNotifs) : [];

      // 1. Notification for creator owner
      notifications.unshift({
        _id: `notif-creator-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: 'Challenge Accepted! ⚔️',
        message: `Dev Gym Owner has accepted your challenge: "${title}"`,
        type: 'battle_accepted',
        isRead: false,
        createdAt: new Date().toISOString(),
        ownerName: creatorName
      });

      // 2. Notification for current logged in user (Dev Gym Owner)
      notifications.unshift({
        _id: `notif-user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: 'Battle Accepted! 💪',
        message: `You successfully accepted ${creatorName}'s challenge: "${title}"`,
        type: 'battle_accepted',
        isRead: false,
        createdAt: new Date().toISOString(),
        ownerName: "Dev Gym Owner"
      });

      localStorage.setItem('gymflow_notifications', JSON.stringify(notifications));
      window.dispatchEvent(new Event('storage'));
    }
    toast.success(`Successfully accepted: ${title}! Get ready to record!`);
  };

  const handleStartEditChallenge = (challenge: any) => {
    setEditingChallenge(challenge);
    setEditTitle(challenge.title);
    setEditDescription(challenge.description);
    setEditReward(challenge.reward.toString());
    setEditMediaUrl(challenge.mediaUrl);
    setEditType(challenge.type);
  };

  const handleSaveEditChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChallenge) return;
    if (!editTitle.trim() || !editDescription.trim() || !editReward.trim()) {
      toast.error('Please fill out all required fields');
      return;
    }

    const price = parseFloat(editReward);
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid price/reward amount');
      return;
    }

    const updatedChallenges = challenges.map(c => {
      if (c.id === editingChallenge.id) {
        return {
          ...c,
          title: editTitle.trim(),
          description: editDescription.trim(),
          reward: price,
          mediaUrl: editMediaUrl.trim() || c.mediaUrl,
          type: editType
        };
      }
      return c;
    });

    setChallenges(updatedChallenges);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gymflow_challenges', JSON.stringify(updatedChallenges));
      window.dispatchEvent(new Event('storage'));
    }

    setActiveLightboxId(null);
    setEditingChallenge(null);
    toast.success('Challenge updated successfully! 🏆');
  };

  const handleDeleteChallenge = (id: number) => {
    if (!window.confirm('Are you sure you want to delete this challenge? This action cannot be undone.')) return;
    
    const updatedChallenges = challenges.filter(c => c.id !== id);
    setChallenges(updatedChallenges);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gymflow_challenges', JSON.stringify(updatedChallenges));
      window.dispatchEvent(new Event('storage'));
    }
    setActiveLightboxId(null);
    setEditingChallenge(null);
    toast.success('Challenge deleted successfully.');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || activeLightboxId === null) return;

    const newComment = {
      id: Date.now(),
      userName: "Dev Gym Owner",
      userAvatar: "MO",
      gymName: "My Fitness Arena",
      text: newCommentText.trim(),
      createdAt: "Just now"
    };

    const updatedChallenges = challenges.map(c => {
      if (c.id === activeLightboxId) {
        return {
          ...c,
          commentsCount: (c.commentsCount || 0) + 1,
          comments: [...(c.comments || []), newComment]
        };
      }
      return c;
    });

    setChallenges(updatedChallenges);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gymflow_challenges', JSON.stringify(updatedChallenges));
    }

    setNewCommentText('');
    toast.success('Comment added successfully!');
  };

  const lightboxChallenge = challenges.find(c => c.id === activeLightboxId);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans px-0 sm:px-3 pt-0 pb-2">
      <div className="w-full max-w-full space-y-3">
        
        {/* Back Button Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 px-3 sm:px-0">
          <button
            onClick={() => router.push('/owner/challenges')}
            className="flex items-center gap-1 sm:gap-2 text-[9px] sm:text-xs font-black uppercase tracking-widest text-slate-500 hover:text-emerald-650 transition cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Back to Battles Feed</span>
          </button>
          
          <span className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 sm:px-3 py-1 border border-slate-200/50 rounded-lg">
            Dedicated Creator Profile
          </span>
        </div>

        {/* Profile Card */}
        <div className="bg-white border-y border-x-0 sm:border border-slate-200 rounded-none sm:rounded-[32px] overflow-hidden shadow-sm relative">
          {/* Banner */}
          <div 
            className="relative bg-slate-950 h-32 sm:h-36 overflow-hidden bg-cover bg-center"
            style={activeBanner ? { backgroundImage: `url(${activeBanner})` } : undefined}
          >
            {!activeBanner && (
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-slate-950 to-slate-950" />
            )}
            {activeBanner && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
            )}
            
            {/* Change Banner Button (for owner of the profile) */}
            {isOwnProfile && (
              <button 
                onClick={() => bannerInputRef.current?.click()}
                className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white px-2.5 py-1.5 rounded-xl border border-white/20 text-[9px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
                title="Change Profile Banner"
              >
                <Camera className="h-3.5 w-3.5" />
                <span className="hidden xs:inline">Change Banner</span>
              </button>
            )}
            
            <input 
              type="file" 
              ref={bannerInputRef} 
              onChange={handleBannerChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          
          {/* Body */}
          <div className="px-2.5 sm:px-6 pb-3.5 sm:pb-6 relative">
            {/* Avatar */}
            <div className="absolute -top-10 left-3.5 sm:left-6 h-20 w-20 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-emerald-500 to-emerald-450 text-white font-black text-2xl flex items-center justify-center border-4 border-white shadow-md uppercase">
              {profile.avatar}
            </div>

            <div className="pt-12 space-y-4 sm:space-y-5">
              {/* Identity */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">{profile.name}</h2>
                    <span className="bg-emerald-50 text-emerald-600 p-0.5 rounded-full" title="Verified Owner">
                      <CheckCircle className="h-4 w-4 fill-emerald-50 text-emerald-605" />
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-emerald-650 mt-1">{profile.id}</p>
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-400 mt-1">{profile.gymName}</p>
                </div>

                {/* Stats Row */}
                <div className="flex flex-wrap gap-2 sm:gap-4">
                  <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-5 sm:py-3.5 text-center min-w-[80px] sm:min-w-[100px] flex-1 sm:flex-initial">
                    <span className="text-[8px] font-black uppercase text-slate-450 block tracking-widest mb-1">Supporters</span>
                    <span className="text-sm sm:text-base font-black text-emerald-600">{profile.supporters.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-5 sm:py-3.5 text-center min-w-[80px] sm:min-w-[100px] flex-1 sm:flex-initial">
                    <span className="text-[8px] font-black uppercase text-slate-450 block tracking-widest mb-1">Battles</span>
                    <span className="text-sm sm:text-base font-black text-slate-800">{ownerChallenges.length} Active</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-5 sm:py-3.5 text-center min-w-[80px] sm:min-w-[100px] flex-1 sm:flex-initial">
                    <span className="text-[8px] font-black uppercase text-slate-455 block tracking-widest mb-1">Joined</span>
                    <span className="text-[10px] sm:text-xs font-black text-slate-700 truncate block mt-0.5">{profile.joined}</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="bg-slate-50 p-3.5 sm:p-5 rounded-2xl border border-slate-100">
                <h4 className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Gym Philosophy & Bio</h4>
                <p className="text-xs text-slate-655 leading-relaxed font-semibold">
                  {profile.bio}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Uploaded Battles List Header */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 pt-2 px-3 sm:px-0">
          <Flame className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-650" />
          <h3 className="text-[10px] sm:text-xs font-black text-slate-800 uppercase tracking-widest">
            Battles launched by {profile.name} ({ownerChallenges.length})
          </h3>
        </div>

        {/* INSTAGRAM STYLE GRID OF UPLOADED POSTS */}
        {ownerChallenges.length === 0 ? (
          <div className="bg-white border border-slate-200 p-12 rounded-3xl text-center shadow-inner">
            <p className="text-sm font-black text-slate-400">No active battles uploaded by this gym owner.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1 sm:gap-3 md:gap-4 px-2 sm:px-0">
            {ownerChallenges.map((challenge) => (
              <div 
                key={challenge.id}
                onClick={() => setActiveLightboxId(challenge.id)}
                className="relative aspect-square bg-slate-900 rounded-2xl overflow-hidden cursor-pointer group border border-slate-200"
              >
                {/* Media Thumbnail */}
                {challenge.type === 'video' ? (
                  <div className="w-full h-full relative">
                    <video
                      src={challenge.mediaUrl}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                    <div className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-white shadow">
                      <Video className="h-3.5 w-3.5" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full relative">
                    <img 
                      src={challenge.mediaUrl} 
                      alt={challenge.title}
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-white shadow">
                      <ImageIcon className="h-3.5 w-3.5" />
                    </div>
                  </div>
                )}

                {/* Instagram Hover Stats Overlay */}
                <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-6 text-white font-black text-xs md:text-sm">
                  <div className="flex items-center gap-1.5">
                    <Heart className="h-4.5 w-4.5 fill-white text-white" />
                    <span>{challenge.likes}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="h-4.5 w-4.5 fill-white text-white" />
                    <span>{challenge.commentsCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* INSTAGRAM POST LIGHTBOX MODAL */}
      {activeLightboxId !== null && lightboxChallenge && (() => {
        const activeCommentsList = lightboxChallenge.comments || [];

        return (
          <div 
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-fade-in"
            onClick={() => setActiveLightboxId(null)}
          >
            {/* Close Button */}
            <button 
              onClick={() => setActiveLightboxId(null)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition cursor-pointer z-[60]"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Lightbox Container */}
            <div 
              className="bg-white rounded-[32px] overflow-hidden max-w-5xl w-full h-[85vh] grid grid-cols-1 md:grid-cols-12 shadow-2xl relative animate-scale-up border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Left Side: Large Media Player (md:col-span-7) */}
              <div className="md:col-span-7 bg-slate-950 flex items-center justify-center relative overflow-hidden h-[40vh] md:h-full">
                {lightboxChallenge.type === 'video' ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-black">
                    <video
                      ref={el => { videoRefs.current[lightboxChallenge.id] = el; }}
                      src={lightboxChallenge.mediaUrl}
                      className="w-full h-full object-contain"
                      loop
                      muted
                      playsInline
                      onClick={() => toggleVideoPlay(lightboxChallenge.id)}
                    />
                    
                    {/* Playback Indicator */}
                    <div 
                      onClick={() => toggleVideoPlay(lightboxChallenge.id)}
                      className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/35 transition-colors cursor-pointer"
                    >
                      {playingVideoId !== lightboxChallenge.id && (
                        <div className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl scale-100 hover:scale-110 transition-transform duration-300">
                          <Play className="h-8 w-8 fill-white" />
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-300"
                        style={{ width: playingVideoId === lightboxChallenge.id ? '100%' : '0%', transitionDuration: playingVideoId === lightboxChallenge.id ? '10s' : '0s' }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-slate-950 flex items-center justify-center">
                    <img 
                      src={lightboxChallenge.mediaUrl} 
                      alt={lightboxChallenge.title} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Right Side: Creator info & Comments section (md:col-span-5) */}
              <div className="md:col-span-5 flex flex-col h-[45vh] md:h-full bg-white border-l border-slate-100">
                
                {/* Header: User avatar, name, verification checkmark */}
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-3.5">
                    <div className="h-9 w-9 rounded-full bg-emerald-50 text-emerald-600 font-extrabold flex items-center justify-center border border-emerald-100 shadow-sm text-xs uppercase">
                      {lightboxChallenge.creatorAvatar}
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-slate-800 flex items-center gap-1 leading-none">
                        <span>{lightboxChallenge.creatorName}</span>
                        <CheckCircle className="h-3.5 w-3.5 fill-emerald-50 text-emerald-600" />
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold mt-1.5">{lightboxChallenge.creatorGym}</p>
                    </div>
                  </div>
                  {/* EDIT OPTION FOR OWNER */}
                  {lightboxChallenge.creatorName === currentLoggedInOwner && (
                    <button
                      onClick={() => handleStartEditChallenge(lightboxChallenge)}
                      className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 hover:text-[#047857] uppercase tracking-wider bg-slate-50 hover:bg-emerald-50 border border-slate-200/60 hover:border-emerald-100 px-3 py-1.5 rounded-xl transition cursor-pointer"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                {/* Body Details & Comments Thread */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5" data-lenis-prevent="true">
                  
                  {/* Title & Reward pool */}
                  <div className="space-y-3.5 pb-4 border-b border-slate-50">
                    <div className="flex items-center justify-between gap-4">
                      <h2 className="text-base font-black text-slate-800 tracking-tight leading-tight">
                        {lightboxChallenge.title}
                      </h2>
                      
                      <div className="bg-[#ECFDF5] border border-emerald-500/10 rounded-xl px-3 py-1.5 text-center flex-shrink-0">
                        <span className="text-[8px] font-black uppercase text-emerald-700 block tracking-widest">Reward</span>
                        <span className="text-xs font-black text-emerald-600">₹{lightboxChallenge.reward.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                       {lightboxChallenge.description}
                    </p>

                    <div className="flex gap-4 text-[10px] font-bold text-slate-400">
                      <span className="bg-slate-50 border border-slate-100 px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-black">{lightboxChallenge.type} challenge</span>
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-slate-350" /> {lightboxChallenge.acceptedCount} Gyms accepted</span>
                    </div>
                  </div>

                  {/* Comments Thread */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Comments Thread</h4>
                    
                    {activeCommentsList.length === 0 ? (
                      <p className="text-xs text-slate-400 italic font-semibold text-center py-4">No comments on this battle yet.</p>
                    ) : (
                      <div className="space-y-3.5">
                        {activeCommentsList.map(comment => (
                          <div key={comment.id} className="bg-slate-50 p-3 rounded-2xl border border-slate-100/50 flex gap-2.5 items-start">
                            <div className="h-7 w-7 rounded-full bg-emerald-55 text-emerald-650 font-black flex items-center justify-center text-[10px] uppercase border border-emerald-100">
                              {comment.userName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-[10px] font-black text-slate-800 leading-none">{comment.userName}</h4>
                                <span className="text-[8px] font-semibold text-slate-400">({comment.gymName})</span>
                                <span className="text-[8px] text-slate-350">• {comment.createdAt}</span>
                              </div>
                              <p className="text-xs text-slate-600 leading-normal font-semibold mt-1">
                                {comment.text}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Controls, Comment Input and Accept Action */}
                <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50 flex-shrink-0 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    
                    {/* Likes & Comments Counters */}
                    <div className="flex items-center gap-4 text-xs">
                      <button 
                        onClick={() => handleLikeToggle(lightboxChallenge.id)}
                        className={`flex items-center gap-1.5 font-bold transition cursor-pointer px-2 py-1 rounded ${
                          lightboxChallenge.hasLiked 
                            ? 'text-rose-600 bg-rose-50' 
                            : 'hover:text-rose-500 hover:bg-slate-100/50 text-slate-500'
                        }`}
                      >
                        <ThumbsUp className={`h-4 w-4 ${lightboxChallenge.hasLiked ? 'fill-rose-600' : ''}`} />
                        <span>{lightboxChallenge.likes}</span>
                      </button>
                      
                      <button 
                        onClick={() => handleShare(lightboxChallenge)}
                        className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-600 font-bold transition cursor-pointer px-2 py-1 rounded hover:bg-slate-100/50"
                      >
                        <Share2 className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                    </div>

                    {/* Accept Battle */}
                    {lightboxChallenge.hasAccepted ? (
                      <div className="bg-emerald-50 text-emerald-755 border border-emerald-100 font-black py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 shadow-sm select-none">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Accepted</span>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleAccept(lightboxChallenge.id, lightboxChallenge.title)}
                        className="bg-[#047857] hover:bg-[#065f46] text-white font-bold py-2 px-4 rounded-xl text-xs shadow-md shadow-emerald-500/10 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Flame className="h-3.5 w-3.5" />
                        <span>Accept Battle</span>
                      </button>
                    )}
                  </div>

                  {/* Comment form */}
                  <form onSubmit={handleAddComment} className="flex gap-2 items-center">
                    <input 
                      type="text" 
                      placeholder="Comment..."
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition text-slate-800 placeholder-slate-400 shadow-inner"
                    />
                    <button 
                      type="submit"
                      disabled={!newCommentText.trim()}
                      className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold p-2.5 rounded-xl shadow transition cursor-pointer flex-shrink-0"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </div>

              </div>
            </div>
          </div>
        );
      })()}

      {/* EDIT CHALLENGE MODAL */}
      {editingChallenge && (
        <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-fade-in" onClick={() => setEditingChallenge(null)}>
          <div 
            className="bg-white rounded-[32px] overflow-hidden max-w-lg w-full shadow-2xl relative border border-slate-100 flex flex-col max-h-[90vh] animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0 bg-slate-50/50">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-none">Edit Battle Challenge</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-1.5">Modify the details of your active gym battle.</p>
              </div>
              <button 
                onClick={() => setEditingChallenge(null)}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full p-2 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveEditChallenge} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              
              {/* Challenge Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Challenge Title</label>
                <input 
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="e.g. 100 Pull-Ups Speedrun Battle"
                  className="w-full bg-[#F8FAFC] border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition text-slate-800 placeholder-slate-400 shadow-sm"
                />
              </div>

              {/* Reward Pool */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Reward Pool (₹ INR)</label>
                <input 
                  type="number"
                  required
                  min="1"
                  value={editReward}
                  onChange={(e) => setEditReward(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full bg-[#F8FAFC] border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition text-slate-800 placeholder-slate-400 shadow-sm"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Challenge Description</label>
                <textarea 
                  required
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Describe details, time cap, standards..."
                  className="w-full bg-[#F8FAFC] border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition text-slate-800 placeholder-slate-400 shadow-sm resize-none"
                />
              </div>

              {/* Media Type selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Media Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEditType('video')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      editType === 'video'
                        ? 'border-emerald-500/20 bg-emerald-50 text-emerald-700'
                        : 'border-slate-250 bg-white text-slate-655 hover:bg-slate-50'
                    }`}
                  >
                    <Video className="h-4 w-4" />
                    <span>Video Clip</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditType('image')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      editType === 'image'
                        ? 'border-emerald-500/20 bg-emerald-50 text-emerald-700'
                        : 'border-slate-250 bg-white text-slate-655 hover:bg-slate-50'
                    }`}
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span>Photo/Image</span>
                  </button>
                </div>
              </div>

              {/* Media URL */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Media URL</label>
                <input 
                  type="url"
                  value={editMediaUrl}
                  onChange={(e) => setEditMediaUrl(e.target.value)}
                  placeholder="Paste direct video mp4 or image url..."
                  className="w-full bg-[#F8FAFC] border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition text-slate-800 placeholder-slate-400 shadow-sm"
                />
              </div>

              {/* Actions Footer */}
              <div className="pt-5 border-t border-slate-100 flex flex-col xs:flex-row items-center justify-between gap-3 bg-slate-50/20">
                <button
                  type="button"
                  onClick={() => handleDeleteChallenge(editingChallenge.id)}
                  className="w-full xs:w-auto px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Delete Post
                </button>
                <div className="flex items-center gap-2.5 w-full xs:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingChallenge(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-bold transition hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow shadow-emerald-600/10 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Owner Profile...</p>
        </div>
      </div>
    }>
      <ProfilePageContent />
    </Suspense>
  );
}
