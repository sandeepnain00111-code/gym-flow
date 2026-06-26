'use client';

import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen flex flex-col relative overflow-hidden">
      
      {/* Premium White Mesh Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-scroll opacity-[0.96] pointer-events-none select-none"
        style={{ backgroundImage: "url('/bg-white-mesh.png')" }}
      />

      {/* Multi-layered soft white-tint gradient overlay to guarantee perfect text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/80 to-white/30 z-0 pointer-events-none" />

      {/* Very Soft Ambient Glowing Spotlights behind Hero Text */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[550px] rounded-full bg-emerald-100/40 blur-[130px] -z-10 pointer-events-none" />
      <div className="absolute top-10 right-10 w-[550px] h-[500px] rounded-full bg-teal-100/25 blur-[120px] -z-10 pointer-events-none" />

      <Navbar />

      {/* Header Section */}
      <section className="pt-24 sm:pt-40 pb-6 sm:pb-12 relative z-10 flex flex-col items-center text-center px-4 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 md:space-y-6"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-white text-[#047857] text-[10px] md:text-xs font-black tracking-widest uppercase border border-slate-200/80 shadow-sm">
            <Mail className="w-3.5 h-3.5 text-[#047857]" />
            <span>Connect With Us</span>
          </div>
 
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.12]">
            Let's build something <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800">
              incredible together.
            </span>
          </h1>
          
          <p className="text-slate-600 text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl mx-auto font-semibold leading-relaxed">
            Have questions about GymFlow? Need help setting up your gym? Our dedicated engineering and growth support team is here to assist.
          </p>
        </motion.div>
      </section>

      {/* Contact Content */}
      <section className="py-6 md:py-12 relative z-10 flex-grow px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24">
          
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-xl md:text-3xl font-bold text-slate-900 mb-4 md:mb-8">Let's talk about your business.</h2>
            
            <div className="space-y-5 md:space-y-8">
              <div className="flex items-start">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-50 rounded-full flex items-center justify-center mr-3 md:mr-4 flex-shrink-0">
                  <Mail className="w-4 h-4 md:w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xs md:text-sm font-bold text-slate-900 uppercase tracking-wider mb-0.5 md:mb-1">Email Us</h4>
                  <p className="text-xs md:text-sm text-slate-600">hello@gymflow.com</p>
                  <p className="text-[10px] md:text-xs text-slate-500 mt-0.5">We aim to reply within 24 hours.</p>
                </div>
              </div>
 
              <div className="flex items-start">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-50 rounded-full flex items-center justify-center mr-3 md:mr-4 flex-shrink-0">
                  <Phone className="w-4 h-4 md:w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="text-xs md:text-sm font-bold text-slate-900 uppercase tracking-wider mb-0.5 md:mb-1">Call Us</h4>
                  <p className="text-xs md:text-sm text-slate-600">+91 98765 43210</p>
                  <p className="text-[10px] md:text-xs text-slate-500 mt-0.5">Mon-Fri, 9am to 6pm IST.</p>
                </div>
              </div>
 
              <div className="flex items-start">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-50 rounded-full flex items-center justify-center mr-3 md:mr-4 flex-shrink-0">
                  <MapPin className="w-4 h-4 md:w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="text-xs md:text-sm font-bold text-slate-900 uppercase tracking-wider mb-0.5 md:mb-1">Visit Us</h4>
                  <p className="text-xs md:text-sm text-slate-600">TechPark Tower A, 4th Floor<br/>Koramangala, Bangalore 560034</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white border border-slate-200 rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-xl shadow-slate-200/50"
          >
            <form className="space-y-4 md:space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-xs md:text-sm font-bold text-slate-700 mb-1.5">First Name</label>
                  <input type="text" className="w-full px-3.5 py-2.5 md:px-4 md:py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs md:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition" placeholder="John" />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-bold text-slate-700 mb-1.5">Last Name</label>
                  <input type="text" className="w-full px-3.5 py-2.5 md:px-4 md:py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs md:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition" placeholder="Doe" />
                </div>
              </div>
 
              <div>
                <label className="block text-xs md:text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
                <input type="email" className="w-full px-3.5 py-2.5 md:px-4 md:py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs md:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition" placeholder="john@example.com" />
              </div>
 
              <div>
                <label className="block text-xs md:text-sm font-bold text-slate-700 mb-1.5">Message</label>
                <textarea rows="3" className="w-full px-3.5 py-2.5 md:px-4 md:py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs md:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition" placeholder="How can we help you?"></textarea>
              </div>
 
              <button type="submit" className="w-full py-3 md:py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center justify-center space-x-2 text-xs md:text-sm cursor-pointer">
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
// Force reload contact footer
