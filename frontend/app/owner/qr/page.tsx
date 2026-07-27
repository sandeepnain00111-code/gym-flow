'use client';

import React, { useEffect, useState, useRef } from 'react';
import api from '../../../lib/api';
import Spinner from '../../../components/ui/Spinner';
import QRCode from 'react-qr-code';
import { toast } from 'react-hot-toast';
import { QrCode, Printer, Download, Dumbbell, ShieldCheck, HelpCircle } from 'lucide-react';

export default function QRConsole() {
  const mockGym = {
    _id: 'iron-forge',
    name: 'Iron Forge Fitness Club',
    description: 'Gold class gym equipment and professional strength coaches.'
  };

  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef(null);

  // The QR scanner value is the gym registration/join URL
  const [qrValue, setQrValue] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const slug = gym?.slug || 'iron-forge';
      setQrValue(`${origin}/gym/${slug}/join`);
    }
  }, [gym]);

  useEffect(() => {
    const fetchGym = async () => {
      try {
        const res = await api.get('/owner/gym');
        if (res.data.success && res.data.gym) {
          setGym(res.data.gym);
        } else {
          setGym(mockGym);
        }
      } catch (err) {
        setGym(mockGym);
      } finally {
        setLoading(false);
      }
    };
    fetchGym();
  }, []);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
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
    <div className="space-y-6">
      {/* Precision design layout rules for browser printer media */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* 1. Hide Sidebar, Topbar header, instructions, and non-poster divs completely */
          aside,
          header,
          nav,
          footer,
          .print\\:hidden,
          .print-hidden {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
            opacity: 0 !important;
            overflow: hidden !important;
          }

          /* 2. Re-adjust main layout offsets to occupy full A4 space cleanly */
          .lg\\:pl-64 {
            padding-left: 0 !important;
          }

          main {
            padding: 0 !important;
            margin: 0 !important;
          }

          body, html {
            background-color: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
          }

          /* 3. Re-structure grid container to center the single column wrapper */
          .printable-poster-container {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            width: 100% !important;
            min-height: 100vh !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .printable-poster-container > div:first-child {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* 4. Beautiful high contrast colorful printable poster design specifications */
          .printable-qr-poster {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: space-between !important;
            width: 380px !important;
            height: 560px !important;
            border: 1px solid #e2e8f0 !important;
            border-radius: 32px !important;
            padding: 40px 24px !important;
            margin: auto !important;
            page-break-inside: avoid !important;
            
            /* FORCE colors and background images to render in print media */
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            
            background-image: linear-gradient(rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.98)), url('/card_bg_cover.png') !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
          }

          /* Preserve original colors in print preview */
          .printable-qr-poster * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}} />

      {/* Header controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center print:hidden">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">QR Check-in Console</h1>
          <p className="text-slate-500 text-xs mt-1">Display this unique QR at your front desk for member attendance scans.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3 print:hidden">
          <button
            onClick={handlePrint}
            className="bg-[#10b981] hover:bg-[#059669] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-500/10 transition duration-300"
          >
            <Printer className="h-4.5 w-4.5" />
            <span>Print Desk Poster</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 printable-poster-container">
        {/* Left Side: Live Printable QR Poster */}
        <div className="lg:col-span-3 flex justify-center">
          <div
            ref={printRef}
            className="w-full max-w-sm rounded-[32px] p-8 bg-white border border-slate-100 text-center flex flex-col items-center justify-between gap-4 space-y-6 shadow-md relative overflow-hidden printable-qr-poster"
            style={{
              backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.98)), url('/card_bg_cover.png')",
              backgroundSize: 'cover'
            }}
          >
            {/* Poster Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2 text-[#10b981]">
                <Dumbbell className="h-6 w-6 text-[#10b981]" />
                <span className="text-sm font-black tracking-widest uppercase text-slate-800">GymFlow</span>
              </div>
              <h2 className="text-lg font-black text-slate-800 tracking-tight uppercase">
                {gym?.name}
              </h2>
              <div className="h-0.5 w-16 bg-[#10b981] mx-auto rounded-full" />
            </div>

            {/* Poster QR code */}
            <div className="p-6 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
              <QRCode
                value={qrValue}
                size={200}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
              />
            </div>

            {/* Poster Footer scan instructions */}
            <div className="space-y-3">
              <p className="text-[10px] font-black text-[#10b981] uppercase tracking-widest">
                Scan QR Code to Check In
              </p>
              <p className="text-[9px] text-slate-500 max-w-xs leading-relaxed">
                Open GymFlow member dashboard, select scan check-in, point camera at this box to record attendance instantly.
              </p>
            </div>

            {/* Subtle decorative ring */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/5 blur-2xl pointer-events-none rounded-full" />
          </div>
        </div>

        {/* Right Side: QR Instructions and stats */}
        <div className="lg:col-span-2 space-y-6 print:hidden">
          <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <HelpCircle className="h-4 w-4 text-emerald-500" />
              <span>How Check-in Works</span>
            </h3>
            
            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-emerald-50 text-[#10b981] border border-emerald-100 flex items-center justify-center text-[10px] font-black mt-0.5 flex-shrink-0">1</div>
                <p className="leading-relaxed">Mount this high-fidelity QR Code flyer near your entry turnstiles or welcome desk.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center text-[10px] font-black mt-0.5 flex-shrink-0">2</div>
                <p className="leading-relaxed">Members click the glowing "Scan Check-in" action bubble on their mobile PWA dash.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center text-[10px] font-black mt-0.5 flex-shrink-0">3</div>
                <p className="leading-relaxed">Our custom frame scanner records their check-in time and flashes verified green markers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
