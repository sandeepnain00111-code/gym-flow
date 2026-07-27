'use client';

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import Spinner from '../../../components/ui/Spinner';
import { toast } from 'react-hot-toast';
import { Award, Printer, UserCheck, Star, FileText, Calendar, PlusCircle, CheckCircle, ChevronDown, Check } from 'lucide-react';

export default function ExperienceCertificateGenerator() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gym, setGym] = useState(null);

  // Form parameters
  const [selectedTrainerId, setSelectedTrainerId] = useState('');
  const [performance, setPerformance] = useState('Best');
  const [yearsOfExperience, setYearsOfExperience] = useState('2.5');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [remarks, setRemarks] = useState('We found them to be exceptionally professional, hardworking, and deeply committed to the well-being of our gym members.');
  const [signatureTitle, setSignatureTitle] = useState('Gym Executive Director');

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch trainers
        const trainersRes = await api.get('/owner/trainers');
        if (trainersRes.data.success && trainersRes.data.trainers && trainersRes.data.trainers.length > 0) {
          setTrainers(trainersRes.data.trainers);
        } else {
          setTrainers(fallbackTrainers);
        }

        // Fetch Gym details
        const gymRes = await api.get('/owner/gym');
        if (gymRes.data.success && gymRes.data.gym) {
          setGym(gymRes.data.gym);
        } else {
          setGym(mockGym);
        }
      } catch (err) {
        setTrainers(fallbackTrainers);
        setGym(mockGym);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const fallbackTrainers = [
    {
      _id: 't1',
      name: 'Coach Kabir Singh',
      specialization: 'Crossfit & Powerlifting Expert',
      timings: '06:00 AM - 02:00 PM',
      email: 'kabir.singh@gmail.com'
    },
    {
      _id: 't2',
      name: 'Coach Simran Kaur',
      specialization: 'Yoga, Pilates & Mobility Guidance',
      timings: '07:00 AM - 03:00 PM',
      email: 'simran.kaur@yahoo.com'
    },
    {
      _id: 't3',
      name: 'Coach Rohan Verma',
      specialization: 'Strength Training & Supplement desk',
      timings: '02:00 PM - 10:00 PM',
      email: 'rohan.verma@gmail.com'
    },
    {
      _id: 't4',
      name: 'Coach Preeti Joshi',
      specialization: 'Cardio, HIIT & Functional Training',
      timings: '04:00 PM - 10:00 PM',
      email: 'preeti.joshi@outlook.com'
    }
  ];

  const mockGym = {
    name: 'Iron Forge Fitness Club',
    address: 'Plot No. 12, Sector 5, Dwarka, New Delhi',
    phone: '+91 99887 76655'
  };

  const activeTrainer = trainers.find(t => t._id === selectedTrainerId) || fallbackTrainers[0];

  const handlePrintCertificate = () => {
    if (!selectedTrainerId) {
      toast.error('Please select a trainer first to preview and print.');
      return;
    }
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

  const inputClass = "w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] rounded-xl transition duration-200 outline-none";

  return (
    <div className="space-y-6">
      {/* Printer CSS rules to print ONLY the gorgeous certificate */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* 1. Hide everything else: sidebars, layout wrappers, top bars, forms */
          aside,
          header,
          nav,
          footer,
          .print\\:hidden,
          .no-print-area,
          h1,
          p,
          form,
          button {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
            opacity: 0 !important;
            overflow: hidden !important;
          }

          .lg\\:pl-64 {
            padding-left: 0 !important;
          }

          main {
            padding: 0 !important;
            margin: 0 !important;
          }

          body, html {
            background-color: #ffffff !important;
            background-image: none !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
          }

          /* 2. Setup landscape certificate layout centering */
          .certificate-container-wrapper {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            width: 100% !important;
            min-height: 100vh !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
          }

          /* 3. High resolution color rendering for certificate backgrounds and fonts */
          .experience-certificate-paper {
            display: block !important;
            width: 820px !important;
            height: 560px !important;
            margin: auto !important;
            border: 12px double #d4af37 !important; /* Premium golden double border */
            border-radius: 8px !important;
            padding: 40px !important;
            background-color: #fdfcf7 !important; /* Parchment cream certificate background */
            background-image: linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.97)), url('/card_bg_cover.png') !important;
            box-shadow: none !important;
            position: relative !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            page-break-inside: avoid !important;
          }

          .experience-certificate-paper * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center no-print-area">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Staff Certificates</h1>
          <p className="text-slate-500 text-xs mt-1">Issue official, premium-grade Professional Experience Certificates to certified coaching staff.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Controls and inputs Form */}
        <div className="lg:col-span-4 space-y-6 no-print-area">
          <div className="bg-white border border-slate-100 shadow-sm p-6 rounded-3xl space-y-4">
            <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <FileText className="w-4.5 h-4.5 text-emerald-500" />
              <span>Certificate Parameters</span>
            </h3>

            <div className="space-y-4">
              {/* Select Trainer */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-wider">Select Trainer</label>
                <select
                  value={selectedTrainerId}
                  onChange={(e) => setSelectedTrainerId(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select target trainer...</option>
                  {trainers.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name} ({t.specialization})
                    </option>
                  ))}
                </select>
              </div>

              {/* Performance */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-wider">Overall Performance</label>
                <select
                  value={performance}
                  onChange={(e) => setPerformance(e.target.value)}
                  className={inputClass}
                >
                  <option value="Good">Good</option>
                  <option value="Better">Better</option>
                  <option value="Best">Best</option>
                </select>
              </div>

              {/* Years of Experience */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-wider">Years of Experience at Gym</label>
                <input
                  type="text"
                  placeholder="e.g. 2.5"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Issue Date */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-wider">Date of Issuance</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Signature title designation */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-wider">Designation of Signatory</label>
                <input
                  type="text"
                  placeholder="e.g. Managing Director"
                  value={signatureTitle}
                  onChange={(e) => setSignatureTitle(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Custom Remarks */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-wider">Appreciation Remarks</label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className={`${inputClass} resize-none`}
                  placeholder="Appreciation details..."
                />
              </div>

              {/* Print Trigger */}
              <button
                onClick={handlePrintCertificate}
                disabled={!selectedTrainerId}
                className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-500/10 transition disabled:opacity-50"
              >
                <Printer className="w-4 h-4" />
                <span>Print Experience Certificate</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Certificate Live Interactive Preview */}
        <div className="lg:col-span-8 flex justify-center certificate-container-wrapper">
          {!selectedTrainerId ? (
            <div className="bg-white border border-slate-100 text-center p-16 rounded-[32px] max-w-md w-full shadow-sm no-print-area">
              <Award className="h-12 w-12 text-slate-300 mx-auto mb-3 animate-pulse" />
              <p className="text-xs text-slate-400 font-semibold">Select a staff trainer from the dropdown menu on the left to preview and generate their professional certificate.</p>
            </div>
          ) : (
            <div className="w-full max-w-[820px] bg-[#fdfcf7] border-[12px] border-double border-[#d4af37] p-8 sm:p-12 rounded-3xl shadow-xl space-y-6 relative overflow-hidden experience-certificate-paper select-none">
              
              {/* Premium geometric layout styling overlays */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-emerald-600/25 rounded-tl-xl pointer-events-none" />
              <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-emerald-600/25 rounded-tr-xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-emerald-600/25 rounded-bl-xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-emerald-600/25 rounded-br-xl pointer-events-none" />

              {/* Certificate content starts here */}
              <div className="text-center space-y-4">
                {/* Brand Seal badge */}
                <div className="flex justify-center">
                  <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 shadow-inner">
                    <Award className="w-8 h-8 text-emerald-600" />
                    <Star className="w-3.5 h-3.5 text-amber-500 absolute -top-1 right-2 fill-amber-500" />
                  </div>
                </div>

                {/* Sub headers */}
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#10b981] font-sans">Official Coaching Credential</span>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight font-serif uppercase">Certificate of Experience</h2>
                  <div className="h-0.5 w-32 bg-[#d4af37] mx-auto rounded-full mt-2" />
                </div>

                {/* Certificate main paragraph */}
                <div className="py-6 max-w-2xl mx-auto space-y-6 text-slate-655 font-serif leading-relaxed text-sm">
                  <p>
                    This is to officially certify that <span className="font-extrabold text-slate-800 underline decoration-[#d4af37] decoration-2 underline-offset-4">{activeTrainer.name}</span> has
                    been an integral member of our coaching team at <span className="font-bold text-slate-800">{gym?.name || mockGym.name}</span>, serving diligently in the capacity of a
                    dedicated <span className="font-bold text-slate-700">{activeTrainer.specialization}</span>.
                  </p>

                  <p>
                    Over a tenure duration of <span className="font-bold text-slate-800">{yearsOfExperience} Years</span>, their professional work performance, sportsmanship, and client training results
                    have been evaluated and rated as <span className="px-3 py-1 font-black text-xs uppercase tracking-widest rounded-full bg-emerald-50 text-emerald-650 border border-emerald-150">{performance}</span>.
                  </p>

                  <p className="text-xs italic text-slate-500 px-4">
                    "{remarks}"
                  </p>

                  <p>
                    We appreciate their contribution, dynamic physical training skills, and professional dedication to our community. We wish them success in their future coaching career and professional endeavors.
                  </p>
                </div>

                {/* Footer coordinates and physical signatures lines */}
                <div className="pt-8 grid grid-cols-2 gap-8 text-[10px] font-sans text-slate-500 items-end">
                  {/* Left: Issuing Gym coordinates */}
                  <div className="text-left space-y-1.5">
                    <p className="font-black text-slate-700 tracking-wide uppercase text-[9px]">Issued by Authority</p>
                    <p className="font-bold text-slate-800">{gym?.name || mockGym.name}</p>
                    <p className="text-slate-400 max-w-xs">{gym?.address || mockGym.address}</p>
                    <p className="text-slate-450 mt-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      <span>Date: {new Date(issueDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}</span>
                    </p>
                  </div>

                  {/* Right: Signature box */}
                  <div className="text-right space-y-3 pb-1">
                    <div className="flex justify-end">
                      <div className="w-48 border-b-2 border-slate-300 border-dashed" />
                    </div>
                    <div>
                      <p className="font-black text-slate-800 uppercase tracking-wider">{signatureTitle}</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">Physical Signature & Seal Verification</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
