'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Trophy, 
  Video, 
  Image as ImageIcon, 
  FileText, 
  DollarSign, 
  Users, 
  Flame, 
  Send, 
  MessageCircle, 
  ThumbsUp, 
  Share2, 
  Plus, 
  X, 
  Play, 
  Pause,
  Award,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Search,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Target
} from 'lucide-react';
import api from '../../../lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// Registered Gyms for direct ID searching
const mockGymsList = [
  { id: "GYM-7701", name: "Powerhouse Gym", owner: "Vikram Sharma", location: "Delhi, IN" },
  { id: "GYM-3402", name: "Gold's Fitness", owner: "Amit Patel", location: "Mumbai, IN" },
  { id: "GYM-9912", name: "Iron Temple Delhi", owner: "Neha Gupta", location: "Delhi, IN" },
  { id: "GYM-5510", name: "Velocity Fitness Club", owner: "Rohan Malhotra", location: "Bangalore, IN" },
  { id: "GYM-8822", name: "Alpha Arena Gym", owner: "Rajesh Kumar", location: "Pune, IN" }
];

// Initial Mock Challenges for high-fidelity interactive experience
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

const historyChallenges = [
  {
    id: 101,
    title: "150kg Snatch Max weight",
    type: "video",
    reward: 15005,
    creatorName: "Vikram Sharma",
    creatorGym: "Powerhouse Gym",
    creatorAvatar: "VS",
    status: "won",
    completedAt: "2 days ago",
    winnerName: "Dev Gym Owner",
    participantsCount: 8,
    scope: "public"
  },
  {
    id: 102,
    title: "Plank Hold Challenge (5 Mins)",
    type: "written",
    reward: 3000,
    creatorName: "Gold's Fitness Mumbai",
    creatorGym: "Gold's Fitness Mumbai",
    creatorAvatar: "AP",
    status: "completed",
    completedAt: "1 week ago",
    winnerName: "Rohan Malhotra",
    participantsCount: 15,
    scope: "public"
  },
  {
    id: 103,
    title: "300kg Deadlift Single Rep",
    type: "video",
    reward: 20000,
    creatorName: "Iron Temple Delhi",
    creatorGym: "Iron Temple Delhi",
    creatorAvatar: "NG",
    status: "expired",
    completedAt: "2 weeks ago",
    winnerName: "No Winner (Expired)",
    participantsCount: 0,
    scope: "regional"
  },
  {
    id: 104,
    title: "100 Push-ups Speedrun",
    type: "image",
    reward: 4000,
    creatorName: "Dev Gym Owner",
    creatorGym: "My Fitness Arena",
    creatorAvatar: "MO",
    status: "lost",
    completedAt: "3 weeks ago",
    winnerName: "Neha Gupta",
    participantsCount: 12,
    scope: "direct"
  }
];

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
    bio: "Calisthenics practitioner, mobility coach, and athlete. Believes physical training is a daily journey of building movement freedom.",
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
    gymName: "Independent Affiliate Gym",
    avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    bio: "Passionate gym owner and athlete looking to improve community physical standards.",
    supporters: 320,
    joined: "Recently"
  };
};

export default function ChallengesPage() {
  const router = useRouter();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [filterType, setFilterType] = useState('all');
  const [filterArea, setFilterArea] = useState('all');
  const [searchCityQuery, setSearchCityQuery] = useState('');
  const [activeProfileOwner, setActiveProfileOwner] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'feed' | 'history' | 'profile'>('feed');

  // Comments Drawer/Modal State
  const [activeCommentsChallengeId, setActiveCommentsChallengeId] = useState<number | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  // Multi-step modal state
  const [modalStep, setModalStep] = useState(1);

  // Gym search query state (used inside modal step 2)
  const [gymSearchIdQuery, setGymSearchIdQuery] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState('video');
  const [reward, setReward] = useState('');
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  
  // Step 2 scope selection
  const [scope, setScope] = useState('public'); // public, regional, direct
  const [targetRegion, setTargetRegion] = useState('Delhi');
  const [targetGym, setTargetGym] = useState('All Gyms');

  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  // Load challenges from localStorage on mount
  useEffect(() => {
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

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !reward || !description.trim()) {
      toast.error('Please complete Step 1 details first');
      setModalStep(1);
      return;
    }

    const price = parseFloat(reward);
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid price/reward amount');
      setModalStep(1);
      return;
    }

    if (scope === 'direct' && targetGym === 'All Gyms') {
      toast.error('Please search and select a target gym for direct challenge');
      return;
    }

    // Default high-quality media fallbacks if not provided
    let finalMedia = mediaUrl.trim();
    if (!finalMedia) {
      if (type === 'video') {
        finalMedia = "https://assets.mixkit.co/videos/preview/mixkit-man-performing-barbell-bench-press-exercise-41584-large.mp4";
      } else if (type === 'image') {
        finalMedia = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop";
      }
    }

    // Format target display name
    let finalTarget = 'All Gyms';
    let challengeArea = 'Global';
    if (scope === 'regional') {
      finalTarget = `Region: ${targetRegion}`;
      challengeArea = targetRegion;
    } else if (scope === 'direct') {
      finalTarget = targetGym;
      // find gym's region from mockGymsList
      const matchedGym = mockGymsList.find(g => targetGym.includes(g.id));
      challengeArea = matchedGym ? matchedGym.location.split(',')[0].trim() : 'Delhi';
    }

    const newChallenge = {
      id: Date.now(), // Use unique timestamp to prevent ID collisions
      creatorName: "Dev Gym Owner",
      creatorGym: "My Fitness Arena",
      creatorAvatar: "MO",
      title: title.trim(),
      type,
      reward: price,
      description: description.trim(),
      mediaUrl: finalMedia,
      likes: 0,
      hasLiked: false,
      commentsCount: 0,
      comments: [] as any[],
      acceptedCount: 0,
      status: "active",
      createdAt: "Just now",
      scope,
      targetGym: finalTarget,
      area: challengeArea
    };

    const updatedChallenges = [newChallenge, ...challenges];
    setChallenges(updatedChallenges);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gymflow_challenges', JSON.stringify(updatedChallenges));
    }
    setIsModalOpen(false);
    
    if (scope === 'public') {
      toast.success('Challenge created and broadcasted globally! 🌍🏆');
    } else if (scope === 'regional') {
      toast.success(`Challenge broadcasted to region: ${targetRegion}! 📍`);
    } else {
      toast.success(`Direct 1-on-1 challenge sent to ${finalTarget}! ⚔️`);
    }

    // Reset Form
    setTitle('');
    setType('video');
    setReward('');
    setDescription('');
    setMediaUrl('');
    setScope('public');
    setTargetRegion('Delhi');
    setTargetGym('All Gyms');
    setGymSearchIdQuery('');
    setModalStep(1);
  };

  const handleLikeToggle = (id: number) => {
    const updatedChallenges = challenges.map(c => {
      if (c.id === id) {
        const hasLiked = c.hasLiked;
        return {
          ...c,
          likes: hasLiked ? Math.max(0, c.likes - 1) : c.likes + 1,
          hasLiked: !hasLiked
        };
      }
      return c;
    });
    setChallenges(updatedChallenges);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gymflow_challenges', JSON.stringify(updatedChallenges));
    }
  };

  const handleShare = (challenge: any) => {
    const shareText = `Check out this Gym Challenge: "${challenge.title}" - Reward Pool: ₹${challenge.reward.toLocaleString('en-IN')}! Join now on GymFlow!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText)
        .then(() => toast.success('Challenge details copied to clipboard! 📋✨'))
        .catch(() => toast.error('Failed to copy details.'));
    } else {
      toast.error('Sharing not supported on this browser.');
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || activeCommentsChallengeId === null) return;

    const updatedChallenges = challenges.map(c => {
      if (c.id === activeCommentsChallengeId) {
        const newComment = {
          id: (c.comments?.length || 0) + 1,
          userName: "Dev Gym Owner",
          userAvatar: "MO",
          gymName: "My Fitness Arena",
          text: newCommentText.trim(),
          createdAt: "Just now"
        };
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
    toast.success('Comment posted successfully! 💬');
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
    toast.success(`You have accepted the challenge: "${title}"! Get training! 💪`);
  };

  const toggleVideoPlay = (id: number) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (playingVideoId === id) {
      video.pause();
      setPlayingVideoId(null);
    } else {
      // Pause previously playing video
      if (playingVideoId !== null && videoRefs.current[playingVideoId]) {
        videoRefs.current[playingVideoId]?.pause();
      }
      video.play().catch(err => console.log('Video play error:', err));
      setPlayingVideoId(id);
    }
  };

  const filteredList = challenges.filter(c => {
    const matchesCitySearch = !searchCityQuery.trim() || 
      c.area.toLowerCase().includes(searchCityQuery.toLowerCase()) ||
      c.creatorGym.toLowerCase().includes(searchCityQuery.toLowerCase());
    return matchesCitySearch;
  });

  const searchedGyms = mockGymsList.filter(g => 
    g.id.toLowerCase().includes(gymSearchIdQuery.toLowerCase()) || 
    g.name.toLowerCase().includes(gymSearchIdQuery.toLowerCase()) || 
    g.owner.toLowerCase().includes(gymSearchIdQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12 font-sans text-slate-800">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Trophy className="h-7 w-7 text-emerald-600 animate-pulse" />
            <h1 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight">Gym Battles & Challenges</h1>
          </div>
          <p className="text-slate-500 text-[10px] sm:text-xs font-semibold">
            Challenge other gym owners, set reward pools, and verify athletic milestones.
          </p>
        </div>

        <button 
          onClick={() => {
            setModalStep(1);
            setIsModalOpen(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 sm:py-3 sm:px-6 rounded-2xl text-[10px] sm:text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Launch New Challenge</span>
        </button>
      </div>

      {/* STATS & METRICS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-100/80 shadow-sm rounded-3xl p-5 flex items-center gap-4 bg-[linear-gradient(rgba(255,255,255,0.92),rgba(255,255,255,0.97)),url('/card_bg_cover.png')] bg-cover">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Active Bets</p>
            <p className="text-lg sm:text-2xl font-black text-slate-800">₹{challenges.reduce((acc, c) => acc + c.reward, 0).toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-100/80 shadow-sm rounded-3xl p-5 flex items-center gap-4 bg-[linear-gradient(rgba(255,255,255,0.92),rgba(255,255,255,0.97)),url('/card_bg_cover.png')] bg-cover">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 tracking-wider">Active Competitors</p>
            <p className="text-lg sm:text-2xl font-black text-slate-800">18 Gym Owners</p>
          </div>
        </div>

        <div className="bg-white border border-slate-100/80 shadow-sm rounded-3xl p-5 flex items-center gap-4 bg-[linear-gradient(rgba(255,255,255,0.92),rgba(255,255,255,0.97)),url('/card_bg_cover.png')] bg-cover">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 tracking-wider">My Challenge Rank</p>
            <p className="text-lg sm:text-2xl font-black text-slate-800">#4 Leaderboard</p>
          </div>
        </div>
      </div>

      {/* SECTION TABS */}
      <div className="flex border-b border-slate-100 gap-6">
        <button 
          onClick={() => setActiveTab('feed')}
          className={`flex items-center gap-2 pb-3.5 px-2 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all border-b-2 cursor-pointer ${
            activeTab === 'feed'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-400 hover:text-slate-650'
          }`}
        >
          <Flame className="h-4 w-4" />
          <span>Active Feed ({challenges.length})</span>
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 pb-3.5 px-2 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all border-b-2 cursor-pointer ${
            activeTab === 'history'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-400 hover:text-slate-650'
          }`}
        >
          <Award className="h-4 w-4" />
          <span>Challenge History ({historyChallenges.length})</span>
        </button>
      </div>

      {/* CHALLENGES BATTLE FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Feed Left Column */}
        <div className="lg:col-span-8 space-y-8">
          {activeTab === 'feed' && (
            <>
              {/* FILTER CONTROLS */}
              <div className="bg-slate-50 p-4 rounded-[24px] border border-slate-100">
                <div className="relative w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search battles by city or area (e.g. Delhi, Mumbai)..." 
                    value={searchCityQuery}
                    onChange={(e) => setSearchCityQuery(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-8 py-3 text-xs font-semibold focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition text-slate-800 placeholder-slate-400 shadow-sm"
                  />
                  {searchCityQuery && (
                    <button 
                      type="button"
                      onClick={() => setSearchCityQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-655 text-xs font-black p-0.5 cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {filteredList.length === 0 ? (
                <div className="bg-white border border-slate-150 p-12 rounded-3xl text-center space-y-4">
                  <Trophy className="h-12 w-12 text-slate-350 mx-auto" />
                  <p className="text-sm font-black text-slate-700">No active challenges found in this category.</p>
                  <p className="text-xs text-slate-400">Be the first to spark the flame and challenge other gyms!</p>
                </div>
              ) : (
                filteredList.map((challenge) => (
                  <div 
                    key={challenge.id}
                    id={`challenge-card-${challenge.id}`}
                    className="bg-white border border-slate-100/95 rounded-2xl sm:rounded-[32px] p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden w-full max-w-xl mx-auto text-slate-800"
                  >
                    {/* Visual Type Indicator Tag */}
                    <div className="absolute top-0 right-0 p-3 sm:p-4 flex flex-col items-end gap-1.5">
                      <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border ${
                        challenge.type === 'video' 
                          ? 'bg-purple-50 text-purple-600 border-purple-100' 
                          : challenge.type === 'image' 
                          ? 'bg-blue-50 text-blue-600 border-blue-100' 
                          : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {challenge.type}
                      </span>
                    </div>

                    <div 
                      onClick={() => {
                        router.push(`/owner/profile?name=${encodeURIComponent(challenge.creatorName)}`);
                      }}
                      className="flex items-center gap-3 pb-4 border-b border-slate-50 cursor-pointer hover:opacity-85 transition group"
                      title="View Owner Profile"
                    >
                      <div className="h-9 w-9 rounded-full bg-emerald-50 text-emerald-600 font-extrabold flex items-center justify-center border border-emerald-100 shadow-sm text-xs uppercase group-hover:scale-105 transition-transform duration-200">
                        {challenge.creatorAvatar}
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-slate-800 leading-none group-hover:text-emerald-600 transition-colors">{challenge.creatorName}</h3>
                        <p className="text-[9px] text-slate-400 font-bold mt-1 flex flex-wrap items-center gap-1 leading-normal">
                          <span>{challenge.creatorGym}</span>
                          <span className="h-1 w-1 bg-slate-200 rounded-full" />
                          <span>{challenge.createdAt}</span>
                        </p>
                        {challenge.targetGym && challenge.targetGym !== 'All Gyms' && (
                          <span className="inline-block mt-1 text-[8px] font-black uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                            🎯 Target: {challenge.targetGym}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Challenge Details */}
                    <div className="py-4 space-y-3.5">
                      <div className="flex flex-row justify-between items-center gap-3">
                        <h2 className="text-xs sm:text-base font-black text-slate-850 tracking-tight leading-tight flex-1">
                          {challenge.title}
                        </h2>
                        
                        {/* Reward Badge */}
                        <div className="flex-shrink-0 bg-[#ECFDF5] border border-emerald-500/10 rounded-xl px-3 py-1.5 text-center shadow-inner">
                          <span className="text-[8px] font-black uppercase text-emerald-700 block tracking-widest mb-0.5">Reward Pool</span>
                          <span className="text-[10px] sm:text-sm font-black text-emerald-650">₹{challenge.reward.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <p className="text-slate-500 text-[10px] sm:text-xs leading-relaxed font-semibold">
                        {challenge.description}
                      </p>

                      {/* MEDIA DISPLAY (INSTAGRAM REEL STYLE FOR VIDEOS) */}
                      {challenge.type === 'video' && (
                        <div className="relative rounded-xl overflow-hidden w-full max-w-[260px] mx-auto aspect-[9/16] bg-slate-950 group shadow-md border border-slate-900">
                          
                          {/* Video Player */}
                          <video
                            ref={el => { videoRefs.current[challenge.id] = el; }}
                            src={challenge.mediaUrl}
                            className="w-full h-full object-cover"
                            loop
                            muted
                            playsInline
                            onClick={() => toggleVideoPlay(challenge.id)}
                          />

                          {/* Playback Overlay Controls */}
                          <div 
                            onClick={() => toggleVideoPlay(challenge.id)}
                            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors cursor-pointer"
                          >
                            {playingVideoId !== challenge.id && (
                              <div className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl scale-100 hover:scale-110 transition-transform duration-300">
                                <Play className="h-6 w-6 fill-white" />
                              </div>
                            )}
                          </div>

                          {/* Reels Style Floating Actions Panel */}
                          <div className="absolute right-2.5 bottom-16 flex flex-col gap-3.5 z-20">
                            <button 
                              onClick={(e) => {
                                  e.stopPropagation();
                                  handleLikeToggle(challenge.id);
                              }}
                              className="flex flex-col items-center gap-1 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white p-2 rounded-xl border border-white/10 transition scale-100 hover:scale-105 cursor-pointer"
                            >
                              <ThumbsUp className={`h-4 w-4 ${challenge.hasLiked ? 'fill-emerald-450 text-emerald-450' : 'text-white'}`} />
                              <span className="text-[8px] font-black">{challenge.likes}</span>
                            </button>

                            <button 
                              onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveCommentsChallengeId(challenge.id);
                              }}
                              className="flex flex-col items-center gap-1 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white p-2 rounded-xl border border-white/10 transition scale-100 hover:scale-105 cursor-pointer"
                            >
                              <MessageCircle className="h-4 w-4" />
                              <span className="text-[8px] font-black">{challenge.commentsCount}</span>
                            </button>

                            <button 
                              onClick={(e) => {
                                  e.stopPropagation();
                                  handleShare(challenge);
                              }}
                              className="flex flex-col items-center gap-1 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white p-2 rounded-xl border border-white/10 transition scale-100 hover:scale-105 cursor-pointer"
                            >
                              <Share2 className="h-4 w-4" />
                              <span className="text-[8px] font-black">Share</span>
                            </button>
                          </div>

                          {/* Video Progress Bar */}
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                            <div 
                              className="h-full bg-emerald-500 transition-all duration-300"
                              style={{ width: playingVideoId === challenge.id ? '100%' : '0%', transitionDuration: playingVideoId === challenge.id ? '10s' : '0s' }}
                            />
                          </div>
                        </div>
                      )}

                      {challenge.type === 'image' && challenge.mediaUrl && (
                        <div className="relative rounded-xl overflow-hidden border border-slate-100 max-w-md mx-auto max-h-80 bg-slate-50">
                          <img 
                            src={challenge.mediaUrl} 
                            alt={challenge.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-102"
                          />
                          <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white text-[8px] font-black px-2 py-0.5 rounded">
                            🖼️ Challenge Image Verification
                          </div>
                        </div>
                      )}

                      {challenge.type === 'written' && (
                        <div className="bg-slate-50/60 border border-slate-100 p-3.5 rounded-xl flex items-start gap-2.5">
                          <FileText className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <div className="space-y-1">
                            <h4 className="text-[9px] font-black text-slate-450 uppercase tracking-wider">Verification Steps</h4>
                            <p className="text-[10px] text-slate-500 leading-normal font-semibold">
                              To claim this reward, submit a time-stamped text log detailing each interval, signed off by a certified gym trainer.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer Controls */}
                    <div className="pt-3 border-t border-slate-50 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-slate-500 text-[10px] sm:text-xs">
                        <button 
                          onClick={() => handleLikeToggle(challenge.id)}
                          className={`flex items-center gap-1.5 font-bold transition cursor-pointer px-2 py-1 rounded-lg ${
                            challenge.hasLiked 
                              ? 'text-rose-600 bg-rose-50' 
                              : 'hover:text-rose-500 hover:bg-slate-50'
                          }`}
                        >
                          <ThumbsUp className={`h-4 w-4 ${challenge.hasLiked ? 'fill-rose-600' : ''}`} />
                          <span>{challenge.likes} <span className="hidden xs:inline">Likes</span></span>
                        </button>
                        <button 
                          onClick={() => setActiveCommentsChallengeId(challenge.id)}
                          className="flex items-center gap-1.5 font-bold hover:text-emerald-650 hover:bg-slate-50 transition px-2 py-1 rounded-lg cursor-pointer"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>{challenge.commentsCount} <span className="hidden xs:inline">Comments</span></span>
                        </button>
                        <button 
                          onClick={() => handleShare(challenge)}
                          className="flex items-center gap-1.5 hover:text-emerald-650 font-bold transition cursor-pointer px-2 py-1 rounded-lg hover:bg-slate-50"
                        >
                          <Share2 className="h-4 w-4 text-slate-400 hover:text-emerald-650" />
                          <span>Share</span>
                        </button>
                        <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-lg text-slate-450 font-bold">
                          <Users className="h-3.5 w-3.5" />
                          <span>{challenge.acceptedCount} <span className="hidden xs:inline">accepted</span></span>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        {challenge.hasAccepted ? (
                          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-750 font-black py-2 px-4 rounded-xl text-xs border border-emerald-100 shadow-sm select-none">
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Accepted</span>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleAccept(challenge.id, challenge.title)}
                            className="w-full sm:w-auto bg-[#047857] hover:bg-[#065f46] text-white font-bold py-2 px-4 rounded-xl text-xs shadow-md shadow-emerald-500/10 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Flame className="h-3.5 w-3.5" />
                            <span>Accept Battle</span>
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              {/* HISTORY HEADER */}
              <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-[10px] sm:text-xs font-black text-slate-800 uppercase tracking-widest leading-none">
                    Past Battles & Milestone Logs
                  </h2>
                </div>
                <div className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2.5 py-1 bg-white border border-slate-200/60 rounded-lg">
                  {historyChallenges.length} Logged
                </div>
              </div>

              {/* HISTORY CARDS LIST */}
              <div className="space-y-4">
                {historyChallenges.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-white border border-slate-100/90 rounded-[32px] p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden"
                  >
                    {/* Left: Info */}
                    <div className="flex items-center gap-4">
                      <div className={`p-3.5 rounded-2xl flex-shrink-0 ${
                        item.status === 'won' 
                          ? 'bg-emerald-50 text-emerald-650' 
                          : item.status === 'lost' 
                          ? 'bg-rose-50 text-rose-650' 
                          : item.status === 'completed'
                          ? 'bg-blue-50 text-blue-650'
                          : 'bg-slate-50 text-slate-500'
                      }`}>
                        <Trophy className="h-5.5 w-5.5" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xs sm:text-sm font-black text-slate-850 tracking-tight leading-tight">{item.title}</h3>
                        <p className="text-[10px] text-slate-400 font-bold flex flex-wrap items-center gap-2 mt-1">
                          <span>By <button type="button" onClick={() => router.push(`/owner/profile?name=${encodeURIComponent(item.creatorName)}`)} className="hover:text-emerald-600 transition cursor-pointer underline decoration-dotted font-black p-0">{item.creatorName}</button></span>
                          <span className="h-1 w-1 bg-slate-300 rounded-full" />
                          <span>{item.completedAt}</span>
                        </p>
                      </div>
                    </div>

                    {/* Right: Stats & Status */}
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 self-start md:self-auto">
                      <div className="text-left md:text-right min-w-[70px]">
                        <span className="text-[8px] font-black uppercase text-slate-400 block tracking-widest">Reward Pool</span>
                        <span className="text-[10px] sm:text-xs font-black text-slate-850">₹{item.reward.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="text-left md:text-right min-w-[80px]">
                        <span className="text-[8px] font-black uppercase text-slate-400 block tracking-widest">Winner</span>
                        <span className="text-[10px] sm:text-xs font-black text-slate-700">{item.winnerName}</span>
                      </div>

                      {/* Status Badge */}
                      <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                        item.status === 'won' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : item.status === 'lost' 
                          ? 'bg-rose-50 text-rose-700 border-rose-100' 
                          : item.status === 'completed'
                          ? 'bg-blue-50 text-blue-700 border-blue-100'
                          : 'bg-slate-50 text-slate-500 border-slate-200'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && activeProfileOwner && (() => {
            const profile = getOwnerProfile(activeProfileOwner);
            const ownerChallenges = challenges.filter(c => c.creatorName === profile.name);

            return (
              <div className="space-y-8 animate-fade-in">
                {/* Full Page Profile Header Card */}
                <div className="bg-white border border-slate-105 rounded-[32px] overflow-hidden shadow-sm relative">
                  {/* Banner */}
                  <div className="relative bg-slate-950 h-36">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-slate-950 to-slate-950" />
                  </div>
                  
                  {/* Body */}
                  <div className="px-8 pb-8 relative">
                    {/* Avatar */}
                    <div className="absolute -top-12 left-8 h-24 w-24 rounded-3xl bg-gradient-to-tr from-emerald-500 to-emerald-450 text-white font-black text-3xl flex items-center justify-center border-4 border-white shadow-md uppercase">
                      {profile.avatar}
                    </div>

                    <div className="pt-16 space-y-6">
                      {/* Identity */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{profile.name}</h2>
                            <span className="bg-emerald-50 text-emerald-600 p-0.5 rounded-full" title="Verified Owner">
                              <CheckCircle className="h-4.5 w-4.5 fill-emerald-50 text-emerald-600" />
                            </span>
                          </div>
                          <p className="text-sm font-bold text-emerald-650 mt-1">{profile.id}</p>
                          <p className="text-xs font-semibold text-slate-400 mt-1">{profile.gymName}</p>
                        </div>

                        {/* Stats Row */}
                        <div className="flex flex-wrap gap-4">
                          <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-2xl px-5 py-3.5 text-center min-w-[100px]">
                            <span className="text-[8px] font-black uppercase text-slate-450 block tracking-widest mb-1">Supporters</span>
                            <span className="text-base font-black text-emerald-600">{profile.supporters.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-center min-w-[100px]">
                            <span className="text-[8px] font-black uppercase text-slate-450 block tracking-widest mb-1">Battles</span>
                            <span className="text-base font-black text-slate-800">{ownerChallenges.length} Active</span>
                          </div>
                          <div className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-center min-w-[100px]">
                            <span className="text-[8px] font-black uppercase text-slate-455 block tracking-widest mb-1">Joined</span>
                            <span className="text-xs font-black text-slate-700 truncate block mt-1">{profile.joined}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bio */}
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Gym Philosophy & Bio</h4>
                        <p className="text-xs text-slate-655 leading-relaxed font-semibold">
                          {profile.bio}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Uploaded Battles List Header */}
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 pt-2">
                  <Flame className="h-5 w-5 text-emerald-650" />
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                    Battles launched by {profile.name} ({ownerChallenges.length})
                  </h3>
                </div>

                {/* Uploaded Battles List (Full Cards) */}
                {ownerChallenges.length === 0 ? (
                  <div className="bg-white border border-slate-100 p-12 rounded-3xl text-center">
                    <p className="text-sm font-black text-slate-600">No active battles uploaded by this gym owner.</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {ownerChallenges.map((challenge) => (
                      <div 
                        key={challenge.id}
                        className="bg-white border border-slate-100/90 rounded-[32px] p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
                      >
                        {/* Visual Type Indicator Tag */}
                        <div className="absolute top-0 right-0 p-4 flex flex-col items-end gap-1.5">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                            challenge.type === 'video' 
                              ? 'bg-purple-50 text-purple-600 border-purple-100' 
                              : challenge.type === 'image' 
                              ? 'bg-blue-50 text-blue-600 border-blue-100' 
                              : 'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                            {challenge.type} Challenge
                          </span>
                        </div>

                        {/* Creator Header */}
                        <div className="flex items-center gap-3.5 pb-5 border-b border-slate-50">
                          <div className="h-11 w-11 rounded-full bg-emerald-50 text-emerald-600 font-extrabold flex items-center justify-center border border-emerald-100 shadow-sm text-sm uppercase">
                            {challenge.creatorAvatar}
                          </div>
                          <div>
                            <h3 className="text-xs font-black text-slate-800 leading-none">{challenge.creatorName}</h3>
                            <p className="text-[10px] text-slate-450 font-bold mt-1.5 flex items-center gap-1">
                              <span>{challenge.creatorGym}</span>
                              <span className="h-1 w-1 bg-slate-300 rounded-full" />
                              <span>{challenge.createdAt}</span>
                            </p>
                          </div>
                        </div>

                        {/* Challenge Details */}
                        <div className="py-5 space-y-4">
                          <div className="flex justify-between items-start gap-4">
                            <h2 className="text-base font-black text-slate-800 tracking-tight leading-tight">
                              {challenge.title}
                            </h2>
                            
                            {/* Reward Badge */}
                            <div className="flex-shrink-0 bg-[#ECFDF5] border border-emerald-500/10 rounded-2xl px-4 py-2 text-center shadow-inner">
                              <span className="text-[8px] font-black uppercase text-emerald-700 block tracking-widest">Reward Pool</span>
                              <span className="text-base font-black text-emerald-600">₹{challenge.reward.toLocaleString('en-IN')}</span>
                            </div>
                          </div>

                          <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                            {challenge.description}
                          </p>

                          {/* MEDIA DISPLAY */}
                          {challenge.type === 'video' && (
                            <div className="relative rounded-2xl overflow-hidden max-w-sm mx-auto aspect-[9/16] bg-slate-950 group shadow-lg border border-slate-900">
                              <video
                                ref={el => { videoRefs.current[challenge.id] = el; }}
                                src={challenge.mediaUrl}
                                className="w-full h-full object-cover"
                                loop
                                muted
                                playsInline
                                onClick={() => toggleVideoPlay(challenge.id)}
                              />

                              {/* Playback Overlay Controls */}
                              <div 
                                onClick={() => toggleVideoPlay(challenge.id)}
                                className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors cursor-pointer"
                              >
                                {playingVideoId !== challenge.id && (
                                  <div className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl scale-100 hover:scale-110 transition-transform duration-300">
                                    <Play className="h-8 w-8 fill-white" />
                                  </div>
                                )}
                              </div>

                              {/* Reels Style Floating Actions Panel */}
                              <div className="absolute right-3 bottom-20 flex flex-col gap-4.5 z-20">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleLikeToggle(challenge.id);
                                  }}
                                  className="flex flex-col items-center gap-1 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white p-2 rounded-2xl border border-white/10 transition scale-100 hover:scale-105 cursor-pointer"
                                >
                                  <ThumbsUp className={`h-4.5 w-4.5 ${challenge.hasLiked ? 'fill-emerald-450 text-emerald-450' : 'text-white'}`} />
                                  <span className="text-[9px] font-black">{challenge.likes}</span>
                                </button>

                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveCommentsChallengeId(challenge.id);
                                  }}
                                  className="flex flex-col items-center gap-1 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white p-2 rounded-2xl border border-white/10 transition scale-100 hover:scale-105 cursor-pointer"
                                >
                                  <MessageCircle className="h-4.5 w-4.5" />
                                  <span className="text-[9px] font-black">{challenge.commentsCount}</span>
                                </button>

                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleShare(challenge);
                                  }}
                                  className="flex flex-col items-center gap-1 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white p-2 rounded-2xl border border-white/10 transition scale-100 hover:scale-105 cursor-pointer"
                                >
                                  <Share2 className="h-4.5 w-4.5" />
                                  <span className="text-[9px] font-black">Share</span>
                                </button>
                              </div>

                              {/* Video Progress Bar */}
                              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                                <div 
                                  className="h-full bg-emerald-500 transition-all duration-300"
                                  style={{ width: playingVideoId === challenge.id ? '100%' : '0%', transitionDuration: playingVideoId === challenge.id ? '10s' : '0s' }}
                                />
                              </div>
                            </div>
                          )}

                          {challenge.type === 'image' && challenge.mediaUrl && (
                            <div className="relative rounded-2xl overflow-hidden border border-slate-100 max-h-96 bg-slate-50">
                              <img 
                                src={challenge.mediaUrl} 
                                alt={challenge.title}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-102"
                              />
                            </div>
                          )}
                        </div>

                        {/* Card Bottom Actions */}
                        <div className="pt-5 border-t border-slate-50 flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                            <div className="flex items-center gap-1">
                              <Users className="h-4.5 w-4.5 text-slate-400" />
                              <span>{challenge.acceptedCount} Gyms Training</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleLikeToggle(challenge.id)}
                              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 rounded-xl text-xs text-slate-655 font-bold transition cursor-pointer"
                            >
                              <ThumbsUp className={`h-4 w-4 ${challenge.hasLiked ? 'fill-emerald-600 text-emerald-600' : 'text-slate-500'}`} />
                              <span>{challenge.likes} Likes</span>
                            </button>

                            <button 
                              onClick={() => setActiveCommentsChallengeId(challenge.id)}
                              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 rounded-xl text-xs text-slate-655 font-bold transition cursor-pointer"
                            >
                              <MessageCircle className="h-4 w-4 text-slate-500" />
                              <span>{challenge.commentsCount} Comments</span>
                            </button>

                            <button 
                              onClick={() => handleShare(challenge)}
                              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 rounded-xl text-xs text-slate-655 font-bold transition cursor-pointer"
                            >
                              <Share2 className="h-4 w-4 text-slate-500" />
                              <span>Share</span>
                            </button>

                            {challenge.hasAccepted ? (
                              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-750 font-black py-2.5 px-5 rounded-xl text-xs border border-emerald-100 shadow-sm select-none">
                                <CheckCircle className="h-4 w-4 text-emerald-600" />
                                <span>Accepted</span>
                              </div>
                            ) : (
                              <button 
                                onClick={() => handleAccept(challenge.id, challenge.title)}
                                className="bg-[#047857] hover:bg-[#065f46] text-white font-bold py-2.5 px-5 rounded-xl text-xs shadow-md shadow-emerald-500/10 transition-all cursor-pointer flex items-center gap-1.5"
                              >
                                <Flame className="h-4 w-4" />
                                <span>Accept Battle</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Sidebar Panel Right Column (Search widget removed from here) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Rules & Rewards Info Panel */}
          <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" />
              <span>Rules of Engagement</span>
            </h3>
            
            <div className="space-y-4 text-[11px] text-slate-500 font-semibold leading-relaxed">
              <div className="flex gap-2.5">
                <CheckCircle className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p>All video verification uploads must be continuous, unedited, and clearly show the weights/movements.</p>
              </div>
              <div className="flex gap-2.5">
                <CheckCircle className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p>Rewards will be escrowed in the GymFlow platform until form checks are verified by admins or community votes.</p>
              </div>
              <div className="flex gap-2.5">
                <CheckCircle className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p>A 5% platform validation fee applies to completed challenges claiming cash prizes.</p>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={() => toast.success('Instructional guide loaded.')}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center space-x-1.5 transition duration-300"
              >
                <HelpCircle className="h-4 w-4 text-slate-400" />
                <span>Read Full Battle Guide</span>
              </button>
            </div>
          </div>

          {/* Active Leaders / Top Gyms Leaderboard */}
          <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Award className="h-4.5 w-4.5 text-amber-500" />
              <span>Top Gym Battlers</span>
            </h3>

            <div className="space-y-4">
              {[
                { name: "Vikram Sharma", gym: "Powerhouse Gym", pool: "₹45,000", badge: "🥇" },
                { name: "Amit Patel", gym: "Gold's Fitness", pool: "₹28,500", badge: "🥈" },
                { name: "Rohan Malhotra", gym: "Velocity Club", pool: "₹18,000", badge: "🥉" }
              ].map((leader, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4 p-3 rounded-2xl border border-slate-50 bg-slate-50/20 hover:border-slate-200 transition duration-300">
                  <div className="flex items-center space-x-3">
                    <span className="text-base select-none">{leader.badge}</span>
                    <div>
                      <p className="text-xs font-black text-slate-800 leading-none">{leader.name}</p>
                      <p className="text-[9px] text-slate-400 font-bold mt-1">{leader.gym}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-emerald-600">{leader.pool}</span>
                    <p className="text-[8px] text-slate-400 font-bold mt-0.5">Won Pool</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* CREATE CHALLENGE MULTI-STEP MODAL (GLASSMORPHIC BACKDROP) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div 
            className="bg-white rounded-[32px] border border-slate-200 w-full max-w-lg overflow-hidden shadow-2xl relative animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-5.5 w-5.5 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                  Launch Battle — Step {modalStep} of 2
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Step Indicators */}
            <div className="px-6 pt-4 flex items-center gap-2.5">
              <div className={`h-1.5 flex-1 rounded-full ${modalStep >= 1 ? 'bg-emerald-500' : 'bg-slate-100'}`} />
              <div className={`h-1.5 flex-1 rounded-full ${modalStep >= 2 ? 'bg-emerald-500' : 'bg-slate-100'}`} />
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleCreateChallenge} className="p-6 space-y-5">
              
              {/* STEP 1: Basic Challenge Details */}
              {modalStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  
                  {/* Challenge Title */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Challenge Title *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. 200kg Squat Max Reps Challenge"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:bg-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all text-slate-800 placeholder-slate-400"
                    />
                  </div>

                  {/* Challenge Type & Bet Price */}
                  <div className="grid grid-cols-2 gap-4">
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Media Format</label>
                      <select 
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:bg-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all text-slate-800"
                      >
                        <option value="video">🎥 Video Reel</option>
                        <option value="image">🖼️ Image/Photo</option>
                        <option value="written">✍️ Written Task</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Bet Pool Reward (₹) *</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-3.5 text-slate-400 text-xs font-bold">₹</span>
                        <input 
                          type="number" 
                          required
                          placeholder="e.g. 5000"
                          value={reward}
                          onChange={(e) => setReward(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-xs font-bold focus:outline-none focus:bg-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all text-slate-800 placeholder-slate-400"
                        />
                      </div>
                    </div>

                  </div>

                  {/* Challenge Description / Target */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Challenge Rules & Description *</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="Detail the target rules, rep range, duration, or form requirements. Be specific!"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:bg-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all text-slate-800 placeholder-slate-400"
                    />
                  </div>

                  {/* Media URL / Source */}
                  {type !== 'written' && (
                    <div className="space-y-1.5 animate-fade-in">
                      <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">
                        {type === 'video' ? 'Video URL (mp4 loop)' : 'Image URL (jpg/png)'}
                      </label>
                      <input 
                        type="text" 
                        placeholder="Leave blank to use a high-quality demonstration asset"
                        value={mediaUrl}
                        onChange={(e) => setMediaUrl(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:bg-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all text-slate-800 placeholder-slate-400"
                      />
                    </div>
                  )}

                  {/* Footer Actions (Step 1) */}
                  <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-3 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-xs transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        if (!title.trim() || !reward || !description.trim()) {
                          toast.error('Please fill in all required fields');
                          return;
                        }
                        setModalStep(2);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl text-xs shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Next Step</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>

                </div>
              )}

              {/* STEP 2: Target Audience / Scope & Direct Challenge Search */}
              {modalStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  
                  {/* Scope Selector Options */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider block">Target Audience Scope</label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { id: 'public', label: 'Global Public', icon: Trophy },
                        { id: 'regional', label: 'Regional Area', icon: MapPin },
                        { id: 'direct', label: '1-on-1 Direct', icon: Target }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setScope(item.id)}
                          className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1.5 transition cursor-pointer ${
                            scope === item.id 
                              ? 'bg-emerald-50 border-emerald-500/30 text-emerald-700 shadow-sm' 
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100/70 hover:text-slate-700'
                          }`}
                        >
                          <item.icon className="h-4.5 w-4.5" />
                          <span className="text-[10px] font-black uppercase tracking-wider">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* regional Scope input */}
                  {scope === 'regional' && (
                    <div className="space-y-1.5 animate-fade-in">
                      <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Target City / State</label>
                      <select
                        value={targetRegion}
                        onChange={(e) => setTargetRegion(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:bg-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all text-slate-800"
                      >
                        <option value="Delhi, NCR">Delhi, NCR</option>
                        <option value="Mumbai, Maharashtra">Mumbai, Maharashtra</option>
                        <option value="Bangalore, Karnataka">Bangalore, Karnataka</option>
                        <option value="Pune, Maharashtra">Pune, Maharashtra</option>
                      </select>
                    </div>
                  )}

                  {/* Direct 1-on-1 search section embedded inside step 2 */}
                  {scope === 'direct' && (
                    <div className="space-y-3.5 animate-fade-in">
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Search Target Gym Owner by ID or Name</label>
                        <div className="relative">
                          <input 
                            type="text"
                            placeholder="Enter Gym ID or Name (e.g. GYM-7701)..."
                            value={gymSearchIdQuery}
                            onChange={(e) => setGymSearchIdQuery(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs font-bold focus:outline-none focus:bg-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all text-slate-850 placeholder-slate-400 shadow-inner"
                          />
                          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-450" />
                        </div>
                      </div>

                      {/* Display Selected Gym confirmation if set */}
                      {targetGym !== 'All Gyms' && (
                        <div className="p-3 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-xl flex items-center justify-between text-xs font-bold animate-fade-in">
                          <span>Selected Gym: <span className="font-black underline">{targetGym}</span></span>
                          <button 
                            type="button" 
                            onClick={() => setTargetGym('All Gyms')}
                            className="text-emerald-700 hover:text-emerald-900"
                          >
                            Reset
                          </button>
                        </div>
                      )}

                      {/* Searched gyms list inside the modal */}
                      <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar border-t border-slate-50 pt-2" data-lenis-prevent>
                        {searchedGyms.length === 0 ? (
                          <p className="text-[10px] text-slate-400 font-bold text-center py-2">
                            {gymSearchIdQuery ? 'No matching gyms found' : 'Type to search registered gyms'}
                          </p>
                        ) : (
                          searchedGyms.map((g) => {
                            const isChosen = targetGym === `${g.id} - ${g.name}`;
                            return (
                              <div 
                                key={g.id} 
                                className={`p-2.5 rounded-xl border flex items-center justify-between gap-4 transition duration-300 ${
                                  isChosen 
                                    ? 'bg-emerald-50 border-emerald-500/30' 
                                    : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                                }`}
                              >
                                <div>
                                  <p className="text-xs font-black text-slate-800 leading-none">{g.name}</p>
                                  <p className="text-[9px] text-slate-500 font-bold mt-1">ID: <span className="text-slate-800 font-extrabold">{g.id}</span> • {g.owner}</p>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setTargetGym(`${g.id} - ${g.name}`);
                                    toast.success(`Selected ${g.name} as target!`);
                                  }}
                                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition cursor-pointer ${
                                    isChosen 
                                      ? 'bg-emerald-600 text-white' 
                                      : 'bg-slate-200 text-slate-700 hover:bg-slate-350'
                                  }`}
                                >
                                  {isChosen ? 'Selected ✓' : 'Select'}
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>

                    </div>
                  )}

                  {/* Footer Actions (Step 2) */}
                  <div className="pt-4 flex justify-between gap-3 border-t border-slate-100">
                    <button 
                      type="button"
                      onClick={() => setModalStep(1)}
                      className="px-5 py-3 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back</span>
                    </button>
                    <button 
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl text-xs shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Send className="h-4 w-4" />
                      <span>Launch Battle</span>
                    </button>
                  </div>

                </div>
              )}

            </form>
          </div>
        </div>
      )}

      {/* COMMENTS MODAL */}
      {activeCommentsChallengeId !== null && (() => {
        const activeChallenge = challenges.find(c => c.id === activeCommentsChallengeId);
        if (!activeChallenge) return null;
        return (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-fade-in text-slate-800 font-sans"
            onClick={() => setActiveCommentsChallengeId(null)}
          >
            <div 
              className="bg-white rounded-[32px] border border-slate-200 w-full max-w-lg overflow-hidden shadow-2xl relative animate-scale-up flex flex-col max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-slate-105 flex items-center justify-between gap-4 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-850 uppercase tracking-widest leading-none">
                      Comments ({activeChallenge.commentsCount})
                    </h3>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1 line-clamp-1">{activeChallenge.title}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveCommentsChallengeId(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Comments Scrollable Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[45vh]" data-lenis-prevent="true">
                {(!activeChallenge.comments || activeChallenge.comments.length === 0) ? (
                  <div className="text-center py-12 space-y-2">
                    <MessageCircle className="h-10 w-10 text-slate-300 mx-auto" />
                    <p className="text-xs font-black text-slate-500">No comments yet.</p>
                    <p className="text-[10px] text-slate-450 font-bold">Be the first to share your thoughts!</p>
                  </div>
                ) : (
                  activeChallenge.comments.map((comment: any) => (
                    <div key={comment.id} className="flex gap-3 items-start bg-slate-50/50 hover:bg-slate-50 p-3 rounded-2xl border border-slate-100/50 transition duration-200">
                      <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-650 font-extrabold flex items-center justify-center border border-emerald-100 text-xs flex-shrink-0">
                        {comment.userAvatar}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <h4 className="text-xs font-black text-slate-800">{comment.userName}</h4>
                          <span className="text-[9px] text-slate-400 font-bold">{comment.createdAt}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment Input Form */}
              <form onSubmit={handleAddComment} className="p-4 border-t border-slate-100 bg-slate-50/30 flex-shrink-0">
                <div className="flex gap-2 items-center">
                  <input 
                    type="text" 
                    placeholder="Write a supportive comment or ask a question..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition text-slate-800 placeholder-slate-400 shadow-inner"
                  />
                  <button 
                    type="submit"
                    disabled={!newCommentText.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold p-3 rounded-xl shadow-lg shadow-emerald-600/10 transition cursor-pointer flex-shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
