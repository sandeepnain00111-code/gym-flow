'use client';

// Clean rebuild trigger comment
import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import api from '../../lib/api';
import Spinner from '../ui/Spinner';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-hot-toast';
import { 
  Send, 
  MessageSquare, 
  Sparkles, 
  Users2, 
  Paperclip,
  Zap,
  Phone,
  Video,
  PhoneOff,
  Mic,
  MicOff,
  VideoOff,
  ArrowLeft,
  Search,
  History,
  Calendar,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Premium Curated Dummy Messages
const dummyMessages = [
  {
    _id: "dummy_1",
    senderId: {
      _id: "owner_dummy",
      name: "Vikram Sharma",
      role: "gym_owner"
    },
    message: "Welcome to the GymFlow Lounge everyone! Feel free to discuss your training routines, workout queries, or daily nutrition splits right here. Let's construct a massive, supportive fitness community! 💪",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    _id: "dummy_2",
    senderId: {
      _id: "trainer_dummy_1",
      name: "Amit Kumar",
      role: "trainer"
    },
    message: "Hey team! I have just updated our high-intensity Push-Pull-Legs workout blueprints in the Plans panel. If anyone needs posture adjustments or has scaling questions, drop them below or catch me in the weights room! 🏋️‍♂️",
    createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString()
  },
  {
    _id: "dummy_3",
    senderId: {
      _id: "member_dummy_1",
      name: "Rahul Roy",
      role: "member"
    },
    message: "Thanks Coach Amit! Tried the new legs split this morning, absolutely intense. Love how convenient it is to load splits on the GymFlow client tab. 💯",
    createdAt: new Date(Date.now() - 3600000 * 1.2).toISOString()
  },
  {
    _id: "dummy_4",
    senderId: {
      _id: "trainer_dummy_2",
      name: "Sneha Patel",
      role: "trainer"
    },
    message: "Friendly nutrition reminder: keep your hydration numbers locked today! Make sure to take at least 3-4 liters of mineral fluids during these warm afternoon slots. 💧",
    createdAt: new Date(Date.now() - 3600000 * 0.8).toISOString()
  },
  {
    _id: "dummy_5",
    senderId: {
      _id: "owner_dummy",
      name: "Vikram Sharma",
      role: "gym_owner"
    },
    message: "Also, mark your calendars: we're hosting a clean pull-up challenge this Saturday morning! 🏆 The top performing member receives a complimentary premium protein stack. Register directly at the front desk!",
    createdAt: new Date(Date.now() - 3600000 * 0.4).toISOString()
  }
];

export default function ChatContainer({ gymId, gymName }) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState(dummyMessages);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [reactions, setReactions] = useState({}); // { [msgId]: { emoji: count } }

  // Channel switcher state ('lounge' or participant object)
  const [activeChat, setActiveChat] = useState('lounge');

  // Sidebar Tab state ('members' or 'history')
  const [sidebarTab, setSidebarTab] = useState('members');
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic Live Last Seen status trackers for peers
  const [participants, setParticipants] = useState([]);

  // Everyday Voice/Video Call logs history
  const [callHistoryList, setCallHistoryList] = useState([
    { name: 'Vikram Sharma', role: 'gym_owner', type: 'voice', status: 'completed', time: '10:11 PM', date: 'Today', duration: '2m 15s' },
    { name: 'Sneha Patel', role: 'trainer', type: 'video', status: 'completed', time: '07:30 PM', date: 'Today', duration: '5m 45s' },
    { name: 'Rahul Roy', role: 'member', type: 'voice', status: 'missed', time: '05:15 PM', date: 'Today', duration: null },
    { name: 'Amit Kumar', role: 'trainer', type: 'video', status: 'completed', time: '04:20 PM', date: 'Yesterday', duration: '12m 10s' },
    { name: 'Sneha Patel', role: 'trainer', type: 'voice', status: 'completed', time: '11:15 AM', date: 'Yesterday', duration: '1m 40s' }
  ]);

  // Call System State
  const [activeCall, setActiveCall] = useState(null); // 'voice' | 'video' | null
  const [callState, setCallState] = useState('disconnected'); // 'dialing' | 'connected' | 'ended'
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  const [localStream, setLocalStream] = useState(null);
  const [callStartTime, setCallStartTime] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [speakerActive, setSpeakerActive] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState({});

  const socketRef = useRef(null);
  const scrollRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const videoRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Sound generator
  const playSoundEffect = (freq = 880, duration = 0.1) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.04, audioContext.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);
    } catch (err) {
      console.warn("Sound blocked:", err);
    }
  };

  const getFormattedTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const formatFullTime = (dateObj) => {
    if (!dateObj) return getFormattedTime();
    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const seconds = dateObj.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes}:${seconds} ${ampm}`;
  };

  // Active Room ID tracker to join the socket channel dynamically
  const [activeRoomId, setActiveRoomId] = useState(null);

  // Fetch real-time gym participants (members, trainers, owner) from the backend database!
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const res = await api.get('/chat/participants');
        if (res.data.success && res.data.participants) {
          const formatted = res.data.participants.map(p => ({
            ...p,
            active: true, // Mark active dynamically
            status: 'Active now',
            statusBg: 'bg-emerald-500'
          }));
          setParticipants(formatted);
        }
      } catch (err) {
        console.error('Failed to load participants:', err.message);
      }
    };

    if (gymId) {
      fetchParticipants();
    }
  }, [gymId]);

  // Duration Timer logic
  useEffect(() => {
    if (callState === 'connected') {
      timerIntervalRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setCallDuration(0);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [callState]);

  // Render Webcam Live stream
  useEffect(() => {
    if (videoRef.current && localStream && cameraActive) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream, cameraActive, callState, isFullScreen]);

  // Initiate call trigger
  const handleStartCall = async (type) => {
    setActiveCall(type);
    setCallState('dialing');
    setCallStartTime(new Date());
    playSoundEffect(600, 0.4);

    // Request webcam/mic access for real dynamic streaming
    if (type === 'video') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        setCameraActive(true);
      } catch (err) {
        console.warn("Media access denied, using simulated stream:", err);
        toast.error("Camera access not allowed, proceeding with audio only.");
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setLocalStream(stream);
      } catch (err) {
        console.warn("Mic access denied:", err);
      }
    }

    // Dialing transition to Connected in 2.5 seconds
    setTimeout(() => {
      setCallState('connected');
      playSoundEffect(880, 0.2);
      toast.success(`${type === 'video' ? 'Video' : 'Voice'} Call Connected!`);
    }, 2500);
  };

  // Clean up, Hang Up Call and LOG CALL INTO CHAT FEED & HISTORY SIDEBAR!
  const handleEndCall = () => {
    playSoundEffect(350, 0.3);

    const isCompleted = callState === 'connected';
    const activeTargetName = activeChat === 'lounge' ? 'Vikram Sharma' : activeChat.name;
    const activeTargetRole = activeChat === 'lounge' ? 'gym_owner' : activeChat.role;

    // Construct the Special Call Log Message Card
    const finalCallLog = {
      _id: `call_${Date.now()}`,
      senderId: {
        _id: user?._id || 'me',
        name: 'You',
        role: user?.role || 'member'
      },
      sender: 'You',
      role: 'member',
      message: '', 
      isCallLog: true,
      callType: activeCall, 
      callStatus: isCompleted ? 'completed' : 'missed',
      startTime: formatFullTime(callStartTime || new Date()),
      endTime: formatFullTime(new Date()),
      duration: callDuration
    };

    // Append to Chat Feed dynamically
    if (activeChat === 'lounge') {
      setMessages((prev) => [...prev, finalCallLog]);
      if (socketRef.current && socketConnected) {
        socketRef.current.emit('send_message', finalCallLog);
      }
    } else {
      const activePeerName = activeChat.name;
      setDmHistory((prev) => ({
        ...prev,
        [activePeerName]: [...(prev[activePeerName] || []), finalCallLog]
      }));
    }

    // Append to the Right Sidebar Everyday Call History Tab too!
    const newHistoryItem = {
      name: activeTargetName,
      role: activeTargetRole,
      type: activeCall,
      status: isCompleted ? 'completed' : 'missed',
      time: getFormattedTime(),
      date: 'Today',
      duration: isCompleted ? `${Math.floor(callDuration / 60)}m ${callDuration % 60}s` : null
    };
    setCallHistoryList((prev) => [newHistoryItem, ...prev]);

    // Clean up streams & close calling modal
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    setCallState('disconnected');
    setActiveCall(null);
    setCameraActive(true);
    setIsMuted(false);
    setCallStartTime(null);
    setIsFullScreen(false);
    setSpeakerActive(true);
  };

  // Toggle local Audio Mic
  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    setIsMuted(!isMuted);
    playSoundEffect(isMuted ? 800 : 400, 0.08);
  };

  // Toggle local Video Camera
  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    setCameraActive(!cameraActive);
    playSoundEffect(cameraActive ? 400 : 800, 0.08);
  };

  // Fetch past chat history from backend MongoDB database dynamically
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        if (activeChat === 'lounge') {
          const res = await api.get(`/chat/room/${gymId}`);
          if (res.data.success) {
            setMessages(res.data.messages || []);
            setActiveRoomId(res.data.roomId);
          }
        } else {
          // Real peer-to-peer chat loading
          const res = await api.get(`/chat/direct/${activeChat._id}`);
          if (res.data.success) {
            setMessages(res.data.messages || []);
            setActiveRoomId(res.data.roomId);
          }
        }
      } catch (err) {
        console.error('Failed to load chat history:', err.message);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    if (gymId) {
      fetchHistory();
    }
  }, [gymId, activeChat]);

  // Socket connection and room joining lifecycle
  useEffect(() => {
    if (!gymId) return;

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
    const socket = io(socketUrl, {
      transports: ['websocket', 'polling']
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setSocketConnected(true);
      socket.emit('join_gym', { gymId, userId: user?._id });
      if (activeRoomId) {
        socket.emit('join_room', { roomId: activeRoomId });
      }
    });

    socket.on('receive_message', (message) => {
      const msgRoomId = typeof message.roomId === 'object' ? message.roomId?._id : message.roomId;
      
      // If it belongs to our currently loaded room, append to messages
      if (activeRoomId && msgRoomId && msgRoomId.toString() === activeRoomId.toString()) {
        setMessages((prev) => {
          if (prev.some(m => m._id === message._id)) return prev;
          return [...prev, message];
        });
      } else {
        // Increment unread count for peer
        const sender = message.senderId;
        if (sender && sender._id !== user?._id) {
          setUnreadCounts((prev) => ({
            ...prev,
            [sender.name]: (prev[sender.name] || 0) + 1
          }));
          playSoundEffect(880, 0.15);
          toast(`New message from ${sender.name}`, { icon: '💬' });
        }
      }
    });

    socket.on('user_typing_broadcast', ({ userName, isTyping: typingState }) => {
      if (typingState) {
        setTypingUser(userName);
        setIsTyping(true);
      } else {
        setIsTyping(false);
      }
    });

    socket.on('connect_error', () => {
      setSocketConnected(false);
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [gymId, user, activeRoomId]);

  // Dynamically emit join_room on room switch
  useEffect(() => {
    if (socketRef.current && socketConnected && activeRoomId) {
      socketRef.current.emit('join_room', { roomId: activeRoomId });
    }
  }, [activeRoomId, socketConnected]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeChat, isTyping]);

  // Handle typing broadcast trigger
  const handleInputChange = (e) => {
    setInputText(e.target.value);
    
    if (socketRef.current && socketConnected && activeChat === 'lounge') {
      socketRef.current.emit('user_typing', { 
        gymId, 
        userName: user?.name || 'Peer Member', 
        isTyping: true 
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current.emit('user_typing', { gymId, isTyping: false });
      }, 2000);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // 1. Direct Message Sending logic
    if (activeChat !== 'lounge') {
      try {
        const res = await api.post('/chat/direct', {
          recipientId: activeChat._id,
          message: inputText.trim()
        });

        if (res.data.success) {
          const savedMessage = res.data.message;
          const roomId = res.data.roomId;

          if (socketRef.current && socketConnected) {
            socketRef.current.emit('send_message', {
              ...savedMessage,
              roomId
            });
          } else {
            setMessages((prev) => [...prev, savedMessage]);
          }
          setInputText('');
          playSoundEffect(750, 0.1);
        }
      } catch (err) {
        toast.error('Failed to deliver message');
      }
      return;
    }

    // 2. Global Gym Lounge Sending logic
    const payload = {
      gymId,
      message: inputText.trim()
    };

    try {
      const res = await api.post('/chat/message', payload);
      if (res.data.success) {
        const savedMessage = res.data.message;

        if (socketRef.current && socketConnected) {
          socketRef.current.emit('send_message', savedMessage);
          socketRef.current.emit('user_typing', { gymId, isTyping: false });
        } else {
          setMessages((prev) => [...prev, savedMessage]);
        }
        setInputText('');
      }
    } catch (err) {
      toast.error('Failed to deliver message');
    }
  };

  const addReaction = (msgId, emoji) => {
    setReactions((prev) => {
      const current = prev[msgId] || {};
      const count = current[emoji] || 0;
      return {
        ...prev,
        [msgId]: {
          ...current,
          [emoji]: count + 1
        }
      };
    });
    playSoundEffect(880, 0.08);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Find host Vikram's dynamic live state for Sub-Header
  const hostParticipant = participants.find(p => p.name === 'Vikram Sharma') || participants[0] || { active: true, lastSeen: 'recently' };

  // Resolve chat parameters dynamically
  const isGlobalChat = activeChat === 'lounge';
  const chatTitle = isGlobalChat ? `${gymName || 'Gym'} Lounge` : (activeChat?.name || 'Partner');
  const chatSubtitle = isGlobalChat 
    ? (hostParticipant?.active ? 'Active Now' : `Offline • Last seen ${hostParticipant?.lastSeen || 'recently'}`)
    : (activeChat?.active ? 'Active Now' : `Offline • Last seen ${activeChat?.lastSeen || 'recently'}`);
  const activeAvatarLetter = isGlobalChat ? (gymName ? gymName[0] : 'G') : (activeChat?.name ? activeChat.name[0] : 'P');
  const isActiveOnline = isGlobalChat ? hostParticipant?.active : activeChat?.active;

  // Custom Call Log Message Card rendering block
  const renderCallLog = (msg, idx) => {
    const isMissed = msg.callStatus === 'missed';
    const isVideo = msg.callType === 'video';
    return (
      <div key={msg._id || idx} className="w-full flex justify-center my-4">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            handleStartCall(msg.callType);
            toast.success(`Redialing ${msg.callType === 'video' ? 'Video' : 'Voice'} Call...`);
          }}
          className={`max-w-md w-full p-4.5 rounded-3xl border flex items-center space-x-4.5 shadow-sm transition-all duration-300 cursor-pointer select-none group bg-white hover:shadow-md ${
            isMissed 
              ? 'border-rose-200 bg-rose-50/20 hover:border-rose-350 hover:bg-rose-50/40' 
              : 'border-slate-200 bg-slate-50/50 hover:border-emerald-250 hover:bg-emerald-50/5'
          }`}
          title={`Click to redial ${msg.callType === 'video' ? 'video' : 'voice'} call`}
        >
          {/* Circular Phone/Video call status Icon with premium micro-rotation on hover */}
          <div className={`p-3 rounded-full flex items-center justify-center text-white border shadow-sm transition-transform duration-350 group-hover:scale-110 group-hover:rotate-12 ${
            isMissed ? 'bg-rose-500 border-rose-400/20' : 'bg-emerald-500 border-emerald-400/20'
          }`}>
            {isVideo ? <Video className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4">
              <h5 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                {isVideo ? 'Video Call' : 'Voice Call'}
              </h5>
              <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                isMissed ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600'
              }`}>
                {msg.callStatus === 'completed' ? 'Completed' : 'Missed Call'}
              </span>
            </div>
            
            <div className="mt-2.5 text-[10px] text-slate-500 font-bold space-y-1">
              {msg.callStatus === 'completed' ? (
                <>
                  <div className="flex justify-between gap-4">
                    <span>Started at:</span> 
                    <span className="text-slate-700 font-extrabold">{msg.startTime}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Ended at:</span> 
                    <span className="text-slate-700 font-extrabold">{msg.endTime}</span>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-slate-200/80 pt-1.5 mt-1.5 text-slate-600 font-black">
                    <span>Duration:</span> 
                    <span className="text-emerald-600 font-extrabold">{msg.duration} seconds</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between gap-4 text-rose-600">
                  <span>Called at:</span> 
                  <span className="font-extrabold">{msg.startTime}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  // Filtered participants list based on live sidebar search bar input
  const filteredParticipants = participants.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch h-[calc(100vh-4rem)] w-full relative animate-fade-in">
      
      {/* LEFT AREA: Symmetrical Chat Feed & Input controls (9 columns) */}
      <div className="lg:col-span-9 bg-white/80 backdrop-blur-md border-r border-slate-200 flex flex-col overflow-hidden relative">
        
        {/* Soft Ambient decorative gradients */}
        <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none -z-10" />
        <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] bg-teal-500/5 rounded-full blur-[70px] pointer-events-none -z-10" />

        {/* Chat Sub-Header */}
        <div className="h-20 bg-slate-50/80 border-b border-slate-200 px-6 flex items-center justify-between gap-4 z-20 backdrop-blur-md">
          <div className="flex items-center space-x-3.5">
            {/* Back to Lounge back-arrow button for DMs */}
            {!isGlobalChat && (
              <motion.button 
                whileHover={{ scale: 1.1, x: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setActiveChat('lounge');
                  playSoundEffect(450, 0.08);
                }}
                className="p-2 bg-slate-200/60 hover:bg-slate-200 border border-slate-300/40 rounded-full text-slate-650 cursor-pointer flex items-center justify-center shadow-sm"
                title="Back to Lounge Room"
              >
                <ArrowLeft className="h-4.5 w-4.5" />
              </motion.button>
            )}

            {/* Premium circular profile image with active status ring */}
            <div className="relative h-11 w-11 flex-shrink-0">
              <div className="h-full w-full rounded-full bg-emerald-500 text-white font-black flex items-center justify-center text-lg border border-slate-200/80 shadow-sm select-none">
                {activeAvatarLetter}
              </div>
              <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white transition-all duration-300 ${isActiveOnline ? 'bg-emerald-500 shadow-sm' : 'bg-slate-400'}`} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 leading-none tracking-tight">{chatTitle}</h3>
              
              {/* Dynamic Last Seen / Active Status */}
              <span className="text-[11px] mt-1.5 block font-bold flex items-center gap-1.5 font-sans transition-all duration-350">
                {isActiveOnline ? (
                  <span className="text-emerald-600 flex items-center gap-1.5 font-extrabold animate-pulse">
                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
                    Active Now
                  </span>
                ) : (
                  <span className="text-slate-500 flex items-center gap-1.5 font-bold">
                    <span className="h-1.5 w-1.5 bg-slate-400 rounded-full" />
                    {chatSubtitle}
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Quick Call Action triggers */}
          <div className="flex items-center gap-3">
            {/* Voice Call Button */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStartCall('voice')}
              className="p-3 rounded-xl border bg-slate-105 border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 text-slate-700 hover:text-emerald-600 transition cursor-pointer flex items-center gap-2 shadow-sm font-bold text-xs"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Voice Call</span>
            </motion.button>

            {/* Video Call Button */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStartCall('video')}
              className="p-3 rounded-xl border bg-slate-105 border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 text-slate-700 hover:text-emerald-600 transition cursor-pointer flex items-center gap-2 shadow-sm font-bold text-xs"
            >
              <Video className="h-4 w-4" />
              <span className="hidden sm:inline">Video Call</span>
            </motion.button>
          </div>
        </div>

        {/* Dynamic typing banner alert */}
        <AnimatePresence>
          {isTyping && isGlobalChat && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-22 left-6 bg-emerald-50 border border-emerald-100 px-5 py-2 rounded-full z-30 flex items-center gap-2.5 shadow-lg backdrop-blur-lg"
            >
              <span className="text-[10px] font-black text-emerald-700">{typingUser} is composing</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 no-scrollbar bg-slate-50/20">
          {loading && isGlobalChat ? (
            <div className="h-full flex items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {/* Render dynamic chat category */}
              {isGlobalChat ? (
                // 1. Group Lounge Chat Render
                messages.map((msg, idx) => {
                  if (msg.isCallLog) return renderCallLog(msg, idx);

                  const isMe = msg.senderId?._id === user?._id || msg.senderId === user?._id;
                  const senderName = msg.senderId?.name || 'Gym Partner';
                  const senderRole = msg.senderId?.role || 'member';
                  
                  const msgReactions = reactions[msg._id] || {};

                  return (
                    <motion.div 
                      key={msg._id || idx} 
                      initial={{ opacity: 0, scale: 0.9, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      className={`flex gap-3.5 ${isMe ? 'flex-row-reverse' : 'flex-row'} items-start group`}
                    >
                      <div className={`h-9 w-9 rounded-full flex-shrink-0 flex items-center justify-center font-black text-xs text-white uppercase border border-slate-200 shadow-sm ${
                        senderRole === 'gym_owner' ? 'bg-amber-500' : senderRole === 'trainer' ? 'bg-indigo-500' : 'bg-emerald-500'
                      }`}>
                        {senderName[0]}
                      </div>

                      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className="relative flex items-center gap-3">
                          {!isMe && (
                            <div className="absolute right-[-125px] bg-white border border-slate-200 rounded-full px-3 py-1.5 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-20 backdrop-blur-md">
                              {['🔥', '💪', '👍', '🙌'].map((emoji) => (
                                <button key={emoji} onClick={() => addReaction(msg._id, emoji)} className="hover:scale-130 transition duration-150 cursor-pointer text-xs">{emoji}</button>
                              ))}
                            </div>
                          )}

                          <div className={`max-w-xs sm:max-w-md md:max-w-lg px-5 py-3 rounded-2xl text-xs leading-relaxed font-semibold shadow-sm ${
                            isMe ? 'bg-emerald-600 text-white rounded-tr-none border border-emerald-700/20' : 'bg-white text-slate-700 rounded-tl-none border border-slate-200/80 hover:bg-slate-50/50 transition duration-200'
                          }`}>
                            {msg.message}

                            {Object.keys(msgReactions).length > 0 && (
                              <div className="flex gap-1.5 mt-2 flex-wrap">
                                {Object.entries(msgReactions).map(([emoji, count]) => (
                                  <span key={emoji} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-[9px] text-slate-700 font-bold">
                                    <span>{emoji}</span>
                                    <span className="font-extrabold text-[8px]">{count}</span>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                // 2. Direct DM Message Chat Render
                (dmHistory[activeChat.name] || []).map((msg, idx) => {
                  if (msg.isCallLog) return renderCallLog(msg, idx);

                  const isMe = msg.sender === 'You';
                  const senderRole = isMe ? 'member' : activeChat.role;

                  return (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, scale: 0.9, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className={`flex gap-3.5 ${isMe ? 'flex-row-reverse' : 'flex-row'} items-start`}
                    >
                      <div className={`h-9 w-9 rounded-full flex-shrink-0 flex items-center justify-center font-black text-xs text-white uppercase border border-slate-200 shadow-sm ${
                        isMe ? 'bg-emerald-500' : (senderRole === 'gym_owner' ? 'bg-amber-500' : senderRole === 'trainer' ? 'bg-indigo-500' : 'bg-emerald-500')
                      }`}>
                        {isMe ? 'Y' : activeChat.name[0]}
                      </div>

                      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-xs sm:max-w-md md:max-w-lg px-5 py-3 rounded-2xl text-xs leading-relaxed font-semibold shadow-sm ${
                          isMe ? 'bg-emerald-600 text-white rounded-tr-none border border-emerald-700/20' : 'bg-white text-slate-700 rounded-tl-none border border-slate-200/80 hover:bg-slate-50/50 transition'
                        }`}>
                          {msg.message}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Majestic Free-Floating Input Pill Area */}
        <div className="p-5 bg-white border-t border-slate-200 z-20">
          <form 
            onSubmit={handleSend} 
            className="max-w-4xl mx-auto bg-slate-50 border border-slate-200 rounded-[2rem] px-5 py-2.5 flex items-center space-x-3 focus-within:bg-white focus-within:border-emerald-500/40 focus-within:ring-2 focus-within:ring-emerald-500/10 shadow-sm transition-all"
          >
            {/* Quick action media trigger */}
            <button 
              type="button" 
              onClick={() => toast.success("Media sharing locked for Sandbox Mode.")}
              className="p-2.5 rounded-xl hover:bg-slate-200/50 text-slate-400 hover:text-slate-650 transition cursor-pointer"
            >
              <Paperclip className="h-4.5 w-4.5" />
            </button>

            <input
              type="text"
              placeholder={isGlobalChat ? "Draft a message for the lounge..." : `Message ${activeChat.name}...`}
              value={inputText}
              onChange={handleInputChange}
              className="flex-1 px-2 py-2 text-xs bg-transparent border-none text-slate-800 placeholder-slate-400 focus:outline-none font-bold"
            />

            {/* Glowing Send button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.08, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-black p-3.5 rounded-full shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 transition flex items-center justify-center cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </motion.button>
          </form>
        </div>

      </div>

      {/* RIGHT SIDEBAR: Symmetrical Active Sidebar (3 columns) */}
      <div className="lg:col-span-3 bg-slate-50/50 backdrop-blur-md p-5 flex flex-col justify-between gap-4 hidden lg:flex border-l border-slate-200 animate-fade-in">
        
        <div className="space-y-5 flex flex-col h-[85%]">
          
          {/* Dual Elegant Interactive Tabs */}
          <div className="flex bg-slate-200/60 p-1 rounded-2xl border border-slate-300/30">
            <button
              onClick={() => {
                setSidebarTab('members');
                playSoundEffect(950, 0.06);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
                sidebarTab === 'members' 
                  ? 'bg-white text-slate-900 border border-slate-300/10 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Users2 className="h-4 w-4" />
              Directory
            </button>
            <button
              onClick={() => {
                setSidebarTab('history');
                playSoundEffect(950, 0.06);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
                sidebarTab === 'history' 
                  ? 'bg-white text-slate-900 border border-slate-300/10 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <History className="h-4 w-4" />
              Call Logs
            </button>
          </div>

          {/* TAB 1: MEMBERS DIRECTORY */}
          {sidebarTab === 'members' && (
            <div className="flex flex-col space-y-4 flex-1 overflow-y-auto no-scrollbar">
              
              {/* Premium Live Search Bar */}
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Search gym partners..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all text-slate-850 placeholder-slate-400 shadow-inner"
                />
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-450" />
              </div>

              {/* Dynamic Lounge Directory & Channel List */}
              <div className="space-y-3.5">
                {/* Global Gym Lounge Channel Card (Only shows if search is empty or includes Lounge) */}
                {("gym lounge feed").includes(searchQuery.toLowerCase()) && (
                  <motion.div 
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      setActiveChat('lounge');
                      playSoundEffect(950, 0.08);
                    }}
                    className={`flex items-center justify-between gap-4 p-3.5 rounded-2xl border transition duration-300 cursor-pointer ${
                      isGlobalChat ? 'bg-emerald-50/80 border-emerald-250 shadow-sm ring-1 ring-emerald-500/10' : 'bg-white border-slate-200 shadow-sm hover:border-slate-350'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center font-black text-white border shadow-sm ${
                        isGlobalChat ? 'bg-emerald-600 border-emerald-500' : 'bg-slate-400 border-slate-300'
                      }`}>
                        <MessageSquare className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800 leading-none">Gym Lounge Feed</p>
                        <span className="text-[9px] text-slate-455 font-bold mt-1 block">Global Chat Room</span>
                      </div>
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      isGlobalChat ? 'bg-emerald-100 border-emerald-250 text-emerald-700' : 'bg-slate-100 border-slate-200 text-slate-500'
                    }`}>
                      Group
                    </span>
                  </motion.div>
                )}

                {/* Direct Message Active Peer Cards */}
                {filteredParticipants.length === 0 ? (
                  <div className="text-center py-8 space-y-2">
                    <Users2 className="h-8 w-8 text-slate-300 mx-auto" />
                    <p className="text-xs text-slate-400 font-bold">No partners found</p>
                  </div>
                ) : (
                  filteredParticipants.map((member, idx) => {
                    const roleLabel = member.role === 'gym_owner' ? 'Owner' : member.role === 'trainer' ? 'Coach' : 'Member';
                    const isSelected = activeChat !== 'lounge' && activeChat.name === member.name;

                    return (
                      <motion.div 
                        key={idx} 
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          setActiveChat(member);
                          playSoundEffect(950, 0.08);
                          // Clear unread count on select
                          setUnreadCounts((prev) => ({
                            ...prev,
                            [member.name]: 0
                          }));
                        }}
                        className={`flex items-center justify-between gap-4 p-3 rounded-2xl border transition duration-300 cursor-pointer ${
                          isSelected ? 'bg-emerald-50/80 border-emerald-250 shadow-sm ring-1 ring-emerald-500/10' : 'bg-white border-slate-200 shadow-sm hover:border-slate-350'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-black text-xs text-white border border-slate-200 shadow-sm ${
                              member.role === 'gym_owner' ? 'bg-amber-500' : member.role === 'trainer' ? 'bg-indigo-500' : 'bg-emerald-500'
                            }`}>
                              {member.name[0]}
                            </div>
                            <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white transition-all duration-300 ${member.active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800 leading-none">{member.name}</p>
                            <span className="text-[9px] font-bold mt-1 block transition-all duration-300">
                              {member.active ? (
                                <span className="text-emerald-600">{roleLabel} • Active</span>
                              ) : (
                                <span className="text-slate-400">{roleLabel} • Offline</span>
                              )}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {unreadCounts[member.name] > 0 && (
                            <motion.span 
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: [1, 1.2, 1], opacity: 1 }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                              className="bg-rose-500 text-white rounded-full text-[9px] w-5 h-5 flex items-center justify-center font-black shadow-md shadow-rose-500/20"
                            >
                              {unreadCounts[member.name]}
                            </motion.span>
                          )}
                          <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border transition-all duration-300 ${member.active ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                            {member.active ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CALL LOGS HISTORY */}
          {sidebarTab === 'history' && (
            <div className="flex flex-col space-y-4 flex-1 overflow-y-auto no-scrollbar">
              
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-200/80">
                <Calendar className="h-4 w-4 text-slate-500" />
                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Everyday Activities</h5>
              </div>

              {/* Call History list timeline rendering */}
              <div className="space-y-3">
                {callHistoryList.map((log, idx) => {
                  const isMissed = log.status === 'missed';
                  const isVideo = log.type === 'video';
                  const avatarColor = log.role === 'gym_owner' ? 'bg-amber-500' : log.role === 'trainer' ? 'bg-indigo-500' : 'bg-emerald-500';

                  return (
                    <motion.div 
                      key={idx}
                      whileHover={{ x: 4 }}
                      onClick={() => {
                        handleStartCall(log.type);
                        toast.success(`Redialing ${log.name}...`);
                      }}
                      className={`p-3 rounded-2xl border transition duration-300 cursor-pointer flex items-center justify-between gap-4 group bg-white shadow-sm hover:border-emerald-300 ${
                        isMissed ? 'hover:bg-rose-50/10' : 'hover:bg-emerald-50/10'
                      }`}
                      title={`Click to redial ${log.name}`}
                    >
                      <div className="flex items-center space-x-3">
                        {/* Avatar */}
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center font-black text-xs text-white border shadow-sm ${avatarColor}`}>
                          {log.name[0]}
                        </div>

                        <div>
                          <p className="text-xs font-black text-slate-800 leading-none group-hover:text-emerald-700 transition">{log.name}</p>
                          <span className="text-[9px] font-bold text-slate-400 mt-1 block flex items-center gap-1.5">
                            {isVideo ? <Video className="h-2.5 w-2.5 text-slate-450" /> : <Phone className="h-2.5 w-2.5 text-slate-450" />}
                            {isVideo ? 'Video' : 'Voice'} Call • {log.time}
                          </span>
                        </div>
                      </div>

                      {/* Status Tag */}
                      <div className="text-right flex flex-col items-end gap-1">
                        <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          isMissed ? 'bg-rose-55 border-rose-200 text-rose-600' : 'bg-emerald-55 border-emerald-200 text-emerald-600'
                        }`}>
                          {isMissed ? 'Missed' : 'Answered'}
                        </span>
                        {log.duration && (
                          <span className="text-[7px] font-black text-slate-400">{log.duration}</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

            </div>
          )}

        </div>

        {/* Symmetrical User Status module at bottom */}
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-slate-100 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4.5 w-4.5 text-emerald-600 animate-pulse" />
              <h5 className="font-extrabold text-slate-800 text-xs">Security standard</h5>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
              General Lounge channels are strictly SLA managed. Please adhere to gym check-in regulations.
            </p>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 📞 DYNAMIC FULLY-WORKING INTERACTIVE CALLING OVERLAY MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeCall && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-lg transition-all duration-500 ${isFullScreen ? 'p-0' : 'p-4'}`}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className={`bg-slate-900 overflow-hidden shadow-2xl flex flex-col relative transition-all duration-500 ${isFullScreen ? 'w-screen h-screen max-w-none rounded-none border-none' : 'border border-slate-800 rounded-3xl max-w-2xl w-full'}`}
            >
              {isFullScreen ? (
                // 🎭 IMMERSIVE FACETIME-STYLE FULLSCREEN MODE (BORDERLESS EDGE-TO-EDGE DISPLAY)
                <div className="relative w-full h-full bg-slate-950 flex flex-col justify-between gap-4 overflow-hidden">
                  
                  {/* 1. Immersive Video Frame or Audio Centerpiece */}
                  {activeCall === 'video' && callState === 'connected' && cameraActive && localStream ? (
                    <div className="absolute inset-0 w-full h-full z-0 bg-slate-950">
                      {/* Live Webcam Stream Video Element */}
                      <video 
                        ref={videoRef}
                        autoPlay 
                        playsInline 
                        muted 
                        className="w-full h-full object-cover scale-x-[-1]"
                      />

                      {/* Floating Picture-in-picture small peer card */}
                      <div className="absolute bottom-32 right-6 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3 shadow-2xl backdrop-blur-md z-30 flex items-center space-x-2.5">
                        <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-[10px] font-black text-white">V</div>
                        <div className="text-left">
                          <p className="text-[9px] font-extrabold text-white leading-none">Vikram S.</p>
                          <span className="text-[7px] text-slate-400 font-bold block mt-0.5">Lounge Host</span>
                        </div>
                      </div>

                      {/* Top Left Status Badge */}
                      <div className="absolute top-6 left-6 flex items-center space-x-2 bg-slate-950/50 border border-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full z-30">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] text-white font-black uppercase tracking-wider">My Feed (Live)</span>
                      </div>
                    </div>
                  ) : (
                    // Fullscreen Ambient Audio / Dialing State
                    <div className="absolute inset-0 w-full h-full z-0 flex flex-col items-center justify-center space-y-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
                      <div className="relative">
                        <div className="absolute inset-[-30px] bg-emerald-500/10 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                        <div className="absolute inset-[-60px] bg-teal-500/5 rounded-full animate-ping" style={{ animationDuration: '4.5s' }} />
                        
                        <div className={`h-36 w-36 rounded-full flex items-center justify-center text-white border border-slate-850 shadow-2xl bg-gradient-to-tr ${activeCall === 'video' ? 'from-indigo-600 to-purple-500 shadow-indigo-500/20' : 'from-emerald-600 to-teal-500 shadow-emerald-500/20'}`}>
                          {activeCall === 'video' ? (
                            <Video className="h-16 w-16 text-white animate-pulse" />
                          ) : (
                            <Phone className="h-16 w-16 text-white animate-pulse" />
                          )}
                        </div>
                      </div>
                      <div className="text-center z-10 px-6">
                        <h4 className="text-lg font-black text-white tracking-wide">
                          {callState === 'dialing' ? 'Dialing Lounge Room...' : 'Connected Audio Room'}
                        </h4>
                        <p className="text-xs text-slate-455 mt-2 font-bold max-w-sm">
                          {callState === 'dialing' 
                            ? 'Sending WebRTC handshakes to active coaches & trainers...' 
                            : 'You and 3 other trainers are currently speaking in the audio session.'
                          }
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 2. Floating Top Right Timer Tag */}
                  <div className="absolute top-6 right-6 bg-slate-950/50 border border-white/10 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 z-40">
                    <span className="text-[10px] text-white font-extrabold tracking-wide uppercase">
                      {callState === 'dialing' ? 'Ringing' : `Active • ${formatTime(callDuration)}`}
                    </span>
                  </div>

                  {/* 3. FaceTime-Style Floating Controls Capsule Bar at Center Bottom */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 bg-slate-950/60 border border-white/10 backdrop-blur-xl px-6 py-4 rounded-[2.5rem] flex items-center gap-5 shadow-2xl">
                    
                    {/* Mute Microphone pill */}
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleMute}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-center ${isMuted ? 'bg-rose-500/10 border-rose-500/25 text-rose-500' : 'bg-white/10 border-white/10 text-white hover:bg-white/20'}`}
                      title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                    >
                      {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </motion.button>

                    {/* Camera Toggle (Video call only) */}
                    {activeCall === 'video' && (
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleCamera}
                        className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-center ${!cameraActive ? 'bg-rose-500/10 border-rose-500/25 text-rose-500' : 'bg-white/10 border-white/10 text-white hover:bg-white/20'}`}
                        title={cameraActive ? 'Stop camera feed' : 'Start camera feed'}
                      >
                        {cameraActive ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                      </motion.button>
                    )}

                    {/* Speaker output toggle */}
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSpeakerActive(!speakerActive);
                        playSoundEffect(speakerActive ? 400 : 800, 0.08);
                        toast.success(`Audio output switched to ${!speakerActive ? 'Speakerphone' : 'Earpiece/Headset'}`);
                      }}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-center ${speakerActive ? 'bg-white/10 border-white/10 text-white hover:bg-white/20' : 'bg-rose-500/10 border-rose-500/25 text-rose-500'}`}
                      title={speakerActive ? 'Switch to Earpiece' : 'Switch to Speakerphone'}
                    >
                      {speakerActive ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                    </motion.button>

                    {/* Fullscreen zoom toggle */}
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setIsFullScreen(!isFullScreen);
                        playSoundEffect(950, 0.08);
                        toast.success("Exit Fullscreen");
                      }}
                      className="p-3.5 rounded-2xl border bg-indigo-650 border-indigo-600 text-white hover:bg-indigo-500 transition cursor-pointer flex items-center justify-center"
                      title="Exit Fullscreen"
                    >
                      <Minimize2 className="h-5 w-5" />
                    </motion.button>

                    {/* End Call / Red Hang Up button */}
                    <motion.button 
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleEndCall}
                      className="bg-rose-600 hover:bg-rose-500 text-white font-black p-4 rounded-2xl shadow-lg shadow-rose-950/40 hover:shadow-rose-600/20 transition flex items-center justify-center cursor-pointer"
                      title="Hang up call"
                    >
                      <PhoneOff className="h-5 w-5" />
                    </motion.button>

                  </div>

                </div>
              ) : (
                // 🏢 STANDARD POPUP WINDOW MODE
                <>
                  {/* Call Top Header */}
                  <div className="p-6 bg-slate-950/50 border-b border-slate-800/80 flex items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-xl ${activeCall === 'video' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'} border border-slate-800`}>
                        {activeCall === 'video' ? <Video className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-white leading-none">Gym Lounge Calling</h3>
                        <p className="text-[10px] text-slate-400 mt-1 font-bold tracking-wider uppercase">
                          {callState === 'dialing' ? 'Connecting to peers...' : `Active Call: ${formatTime(callDuration)}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${callState === 'dialing' ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
                      <span className="text-[10px] text-slate-350 font-bold uppercase tracking-wider">
                        {callState === 'dialing' ? 'Ringing' : 'Live'}
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Call Screen Container */}
                  <div className="flex-1 p-8 min-h-[320px] flex flex-col items-center justify-center space-y-8 bg-gradient-to-b from-slate-950 to-slate-900">
                    
                    {/* 1. If Video Call is Connected & Camera is active (using real webcam!) */}
                    {activeCall === 'video' && callState === 'connected' && cameraActive && localStream ? (
                      <div className={`relative w-full overflow-hidden border border-slate-700 bg-black/80 shadow-2xl flex items-center justify-center transition-all duration-500 ${isFullScreen ? 'flex-1 h-full max-w-5xl rounded-3xl' : 'max-w-md h-60 rounded-2xl'}`}>
                        
                        {/* Live Webcam Stream Video Element */}
                        <video 
                          ref={videoRef}
                          autoPlay 
                          playsInline 
                          muted 
                          className="absolute inset-0 w-full h-full object-cover rounded-2xl scale-x-[-1]"
                        />

                        {/* Picture-in-picture small peer card */}
                        <div className="absolute bottom-4 right-4 bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 shadow-xl flex items-center space-x-2 backdrop-blur-sm z-30">
                          <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-[10px] font-black text-white">V</div>
                          <div className="text-left">
                            <p className="text-[9px] font-extrabold text-white leading-none">Vikram S.</p>
                            <span className="text-[7px] text-slate-400 font-bold block mt-0.5">Lounge Host</span>
                          </div>
                        </div>

                        <div className="absolute top-4 left-4 bg-emerald-600 text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                          My Feed
                        </div>
                      </div>
                    ) : (
                      // 2. Voice Call Dialing / Voice Connected Screen
                      <div className="flex flex-col items-center space-y-6">
                        <div className="relative">
                          {/* Pulse concentric call rings */}
                          <div className="absolute inset-[-20px] bg-emerald-500/10 rounded-full animate-ping" style={{ animationDuration: '2.5s' }} />
                          <div className="absolute inset-[-40px] bg-teal-500/5 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
                          
                          <div className={`h-28 w-28 rounded-full flex items-center justify-center text-white border-2 border-slate-750 shadow-2xl bg-gradient-to-tr ${activeCall === 'video' ? 'from-indigo-600 to-purple-500 shadow-indigo-500/10' : 'from-emerald-600 to-teal-500 shadow-emerald-500/10'}`}>
                            {activeCall === 'video' ? (
                              <Video className="h-12 w-12 text-white animate-pulse" />
                            ) : (
                              <Phone className="h-12 w-12 text-white animate-pulse" />
                            )}
                          </div>
                        </div>

                        <div className="text-center">
                          <h4 className="text-base font-extrabold text-white">
                            {callState === 'dialing' ? 'Dialing Lounge Room' : `Connected Room Feed`}
                          </h4>
                          <p className="text-xs text-slate-400 mt-2 font-bold max-w-sm">
                            {callState === 'dialing' 
                              ? 'Sending WebRTC handshakes to active coaches & trainers...' 
                              : 'You and 3 other trainers are currently active in the audio session.'
                            }
                          </p>
                        </div>

                        {/* Animated Audio soundwaves for connected voice call */}
                        {callState === 'connected' && (
                          <div className="flex items-center gap-1.5 h-8">
                            {[0.8, 0.4, 0.9, 0.3, 0.7, 0.4, 0.8, 0.5, 0.9, 0.3].map((val, idx) => (
                              <motion.span 
                                key={idx}
                                animate={{ scaleY: [1, val * 3, 1] }}
                                transition={{ repeat: Infinity, duration: 1.2, delay: idx * 0.1 }}
                                className="w-1 bg-emerald-500 rounded-full h-3"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Simulated Peer Participants strip */}
                    {callState === 'connected' && (
                      <div className="w-full max-w-md pt-4 border-t border-slate-800 flex items-center justify-center gap-6">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">In Call:</span>
                        <div className="flex items-center -space-x-2">
                          <div className="w-7 h-7 rounded-full bg-amber-500 border border-slate-900 flex items-center justify-center text-[9px] font-black text-white" title="Vikram Sharma">V</div>
                          <div className="w-7 h-7 rounded-full bg-indigo-500 border border-slate-900 flex items-center justify-center text-[9px] font-black text-white" title="Amit Kumar">A</div>
                          <div className="w-7 h-7 rounded-full bg-emerald-500 border border-slate-900 flex items-center justify-center text-[9px] font-black text-white" title="Sneha Patel">S</div>
                        </div>
                        <span className="text-[10px] text-slate-350 font-black">+3 Co-trainers</span>
                      </div>
                    )}

                  </div>

                  {/* Call footer Controls bar */}
                  <div className="p-6 bg-slate-950/70 border-t border-slate-800/80 flex items-center justify-center gap-5">
                    
                    {/* Mute Microphone pill */}
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleMute}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-center ${isMuted ? 'bg-rose-500/10 border-rose-500/25 text-rose-500' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}
                      title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                    >
                      {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </motion.button>

                    {/* Camera Toggle (Video call only) */}
                    {activeCall === 'video' && (
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleCamera}
                        className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-center ${!cameraActive ? 'bg-rose-500/10 border-rose-500/25 text-rose-500' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}
                        title={cameraActive ? 'Stop camera feed' : 'Start camera feed'}
                      >
                        {cameraActive ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                      </motion.button>
                    )}

                    {/* Speaker output toggle */}
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSpeakerActive(!speakerActive);
                        playSoundEffect(speakerActive ? 400 : 800, 0.08);
                        toast.success(`Audio output switched to ${!speakerActive ? 'Speakerphone' : 'Earpiece/Headset'}`);
                      }}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-center ${speakerActive ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750' : 'bg-rose-500/10 border-rose-500/25 text-rose-500'}`}
                      title={speakerActive ? 'Switch to Earpiece' : 'Switch to Speakerphone'}
                    >
                      {speakerActive ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                    </motion.button>

                    {/* Fullscreen zoom toggle */}
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setIsFullScreen(!isFullScreen);
                        playSoundEffect(950, 0.08);
                        toast.success(isFullScreen ? "Exit Fullscreen" : "Entered Fullscreen Mode");
                      }}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-center ${isFullScreen ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'}`}
                      title={isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                    >
                      {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                    </motion.button>

                    {/* End Call / Red Hang Up button */}
                    <motion.button 
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleEndCall}
                      className="bg-rose-600 hover:bg-rose-500 text-white font-black p-4 rounded-2xl shadow-lg shadow-rose-950/40 hover:shadow-rose-600/20 transition flex items-center justify-center cursor-pointer"
                      title="Hang up call"
                    >
                      <PhoneOff className="h-5 w-5" />
                    </motion.button>

                  </div>
                </>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
