'use client';

import React, { useEffect, useState, useRef } from 'react';
import api from '../../../lib/api';
import Spinner from '../../../components/ui/Spinner';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode, CheckCircle, ShieldAlert, Sparkles, Camera, Zap, Calendar, History, ShieldCheck, ArrowRightLeft } from 'lucide-react';

export default function CheckInScanner() {
  const router = useRouter();
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
  const [checkedInTime, setCheckedInTime] = useState(null);
  const [activeTab, setActiveTab] = useState('scanner'); // 'scanner' or 'history'
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const scannerRef = useRef(null);

  // Fetch Member Details
  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const res = await api.get('/member/dashboard');
        if (res.data.success && res.data.membership) {
          setMembership(res.data.membership);
        }
      } catch (err) {
        console.error('Failed to load member profile:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMembership();
  }, []);

  // Fetch Full Attendance History when activeTab changes to 'history'
  useEffect(() => {
    if (activeTab === 'history') {
      const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
          // Backend route: GET /api/member/attendance
          const res = await api.get('/member/attendance');
          if (res.data.success) {
            setHistoryLogs(res.data.attendance || []);
          }
        } catch (err) {
          console.error('Failed to fetch attendance history:', err.message);
          toast.error('Failed to load attendance logs');
        } finally {
          setLoadingHistory(false);
        }
      };
      fetchHistory();
    }
  }, [activeTab]);

  // Initialize camera scanner
  useEffect(() => {
    if (!membership || checkedInTime || activeTab !== 'scanner') return;

    setScannerActive(true);
    const scanner = new Html5QrcodeScanner(
      'qr-reader-viewport',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true
      },
      false
    );

    scanner.render(
      async (decodedText) => {
        try {
          const parsed = JSON.parse(decodedText);
          if (parsed.gymId) {
            scanner.clear();
            setScannerActive(false);
            handleCheckIn(parsed.gymId);
          }
        } catch (e) {
          scanner.clear();
          setScannerActive(false);
          handleCheckIn(decodedText);
        }
      },
      (err) => {
        // silent scanning errors
      }
    );

    return () => {
      scanner.clear().catch((e) => console.log('Cleanup error:', e.message));
    };
  }, [membership, checkedInTime, activeTab]);

  const handleCheckIn = async (gymId) => {
    setSubmitting(true);
    try {
      const res = await api.post('/member/attendance/scan', { qrData: gymId });
      if (res.data.success) {
        setCheckedInTime(new Date());
        toast.success(res.data.message || 'Check-in verified successfully! 🏋️');
        setTimeout(() => {
          router.push('/member/dashboard');
        }, 3000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Check-in failed. Please scan valid gym QR');
      setScannerActive(true);
    } finally {
      setSubmitting(false);
    }
  };

  const simulateCheckIn = () => {
    if (!membership) {
      toast.error('No active membership found');
      return;
    }
    const gymId = membership.gymId?._id;
    if (!gymId) {
      toast.error('Gym details missing');
      return;
    }
    handleCheckIn(gymId);
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!membership) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-100 max-w-lg mx-auto text-center space-y-4 shadow-md">
        <ShieldAlert className="h-12 w-12 text-red-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800">Access Denied</h3>
        <p className="text-slate-400 text-xs">You must register and be accepted by a partner gym first to access check-ins.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <QrCode className="h-10 w-10 text-emerald-600 mx-auto mb-3 animate-pulse" />
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Gym Attendance Log Room</h1>
        <p className="text-slate-500 text-xs mt-1">Verify your gym entry using live QR scans or review your past monthly logs below.</p>
      </div>

      {/* Navigation tabs */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/50 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('scanner')}
          className={`py-2.5 rounded-xl text-xs font-bold tracking-wide transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'scanner' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/20' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Camera className="h-4 w-4 text-emerald-600" />
          <span>Live Check-in</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`py-2.5 rounded-xl text-xs font-bold tracking-wide transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'history' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/20' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="h-4 w-4 text-slate-650" />
          <span>Attendance History</span>
        </button>
      </div>

      {activeTab === 'scanner' ? (
        /* SCANNER TAB VIEW */
        checkedInTime ? (
          /* Success Screen */
          <div className="bg-white p-8 rounded-3xl border-2 border-emerald-500/20 text-center space-y-6 shadow-xl animate-scale-in max-w-md mx-auto">
            <CheckCircle className="h-16 w-16 text-emerald-600 mx-auto animate-bounce" />
            <div>
              <h3 className="text-xl font-black text-slate-800">Check-in Verified!</h3>
              <p className="text-emerald-600 text-xs font-bold mt-1 uppercase tracking-wider">Welcome to {membership.gymId?.name}</p>
              <p className="text-slate-500 text-xs mt-3 leading-relaxed">
                Entry recorded at{' '}
                <span className="text-slate-800 font-bold">
                  {checkedInTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
                . Redirecting back to home splits...
              </p>
            </div>
          </div>
        ) : (
          /* Live QR Scanner Viewport */
          <div className="space-y-6 max-w-md mx-auto">
            <div className="relative bg-white rounded-3xl border border-slate-100 p-4 shadow-md overflow-hidden flex flex-col items-center">
              {/* Camera Area */}
              <div id="qr-reader-viewport" className="w-full max-w-sm rounded-2xl overflow-hidden bg-slate-900 border border-slate-100 relative">
                {scannerActive && <div className="animate-scan-line z-20" />}
              </div>

              {submitting && (
                <div className="absolute inset-0 z-30 bg-slate-900/80 flex items-center justify-center space-y-4 flex-col">
                  <Spinner size="lg" />
                  <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest">Verifying Pass...</p>
                </div>
              )}
            </div>

            {/* Quick Simulate Button */}
            <div className="text-center">
              <button
                onClick={simulateCheckIn}
                className="bg-emerald-600 hover:bg-emerald-550 text-white font-bold py-3.5 px-6 rounded-2xl text-xs w-full shadow-md shadow-emerald-600/10 flex items-center justify-center space-x-1.5 transition hover:-translate-y-0.5"
              >
                <Zap className="h-4.5 w-4.5" />
                <span>Simulate Check-in Scan</span>
              </button>
              <p className="text-[10px] text-slate-400 mt-2.5 leading-relaxed">
                *Testing locally? Use the simulation button to bypass webcam access and verify checking logs instantly!
              </p>
            </div>
          </div>
        )
      ) : (
        /* ATTENDANCE HISTORY LOGS VIEW */
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md shadow-slate-100/50 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Calendar className="h-4.5 w-4.5 text-emerald-600" />
            <span>Monthly Attendance Log Sheets</span>
          </h3>

          {loadingHistory ? (
            <div className="py-12 flex justify-center">
              <Spinner size="md" />
            </div>
          ) : historyLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Check-in</th>
                    <th className="py-3 px-4">Check-out</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {historyLogs.map((log) => {
                    const checkInTimeStr = log.checkIn ? new Date(log.checkIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '--:--';
                    const checkOutTimeStr = log.checkOut ? new Date(log.checkOut).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '--:--';
                    const logDate = new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                    return (
                      <tr key={log._id} className="hover:bg-slate-50/50 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-800">{logDate}</td>
                        <td className="py-3.5 px-4 text-slate-600">{checkInTimeStr}</td>
                        <td className="py-3.5 px-4 text-slate-450">{checkOutTimeStr}</td>
                        <td className="py-3.5 px-4 uppercase text-[9px] font-black text-slate-500 tracking-wider">{log.method || 'QR Scanner'}</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                            Present
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 space-y-3">
              <Calendar className="h-10 w-10 text-slate-350 mx-auto" />
              <p className="text-xs text-slate-400 font-bold">No attendance logs scanned yet in this program billing slot.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
