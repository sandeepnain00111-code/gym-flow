'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Megaphone, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  RotateCcw, 
  Star, 
  MapPin, 
  Sparkles, 
  ArrowRight,
  Eye,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const DEFAULT_GYMS = [
  {
    id: 1,
    name: "Iron Forge Fitness Center",
    tagline: "Unleash your inner beast in Hyderabad's premier heavy lifting and bodybuilding arena.",
    location: "Jubilee Hills, Hyderabad",
    offer: "Flat 25% Off on Annual Memberships",
    rating: "4.9 (480+ Reviews)",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop",
    slug: "iron-forge"
  },
  {
    id: 2,
    name: "Valkyrie Cardio & HIIT Studio",
    tagline: "High-intensity circuits, dynamic yoga spaces, and group training tailored for transformations.",
    location: "Gachibowli, Hyderabad",
    offer: "Get a Free 3-Day Guest Pass Today!",
    rating: "4.8 (320+ Reviews)",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1470&auto=format&fit=crop",
    slug: "valkyrie-studio"
  },
  {
    id: 3,
    name: "Pulse 24/7 Premium Athletics",
    tagline: "Your goals don't sleep. Enjoy premium strength coaching, steam baths, and dynamic layouts 24/7.",
    location: "Banjara Hills, Hyderabad",
    offer: "Free Personal Training Session on Sign Up",
    rating: "4.9 (510+ Reviews)",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1470&auto=format&fit=crop",
    slug: "pulse-athletics"
  }
];

export default function AdminPromos() {
  const [slides, setSlides] = useState<any[]>([]);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<number | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    location: '',
    offer: '',
    rating: '4.8 (100+ Reviews)',
    image: '',
    slug: ''
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('gymflow_sponsored_gyms');
    if (saved) {
      try {
        setSlides(JSON.parse(saved));
      } catch (e) {
        setSlides(DEFAULT_GYMS);
      }
    } else {
      setSlides(DEFAULT_GYMS);
    }
  }, []);

  // Save utility
  const saveToStorage = (updatedSlides: any[]) => {
    setSlides(updatedSlides);
    localStorage.setItem('gymflow_sponsored_gyms', JSON.stringify(updatedSlides));
    // Trigger custom storage event for sync
    window.dispatchEvent(new Event('storage'));
  };

  const handleResetDefaults = () => {
    if (window.confirm('Are you sure you want to reset the slider to default system gym promotions?')) {
      saveToStorage(DEFAULT_GYMS);
      setActivePreviewIndex(0);
      toast.success('Slider reset to default system gyms.');
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this promotional ad slide?')) {
      const updated = slides.filter(slide => slide.id !== id);
      saveToStorage(updated);
      setActivePreviewIndex(0);
      toast.success('Slide deleted.');
    }
  };

  const handleEditClick = (slide: any) => {
    setEditingSlideId(slide.id);
    setFormData({
      name: slide.name,
      tagline: slide.tagline,
      location: slide.location,
      offer: slide.offer,
      rating: slide.rating,
      image: slide.image,
      slug: slide.slug
    });
    setShowAddForm(false);
  };

  const handleAddNewClick = () => {
    setEditingSlideId(null);
    setFormData({
      name: '',
      tagline: '',
      location: '',
      offer: '',
      rating: '4.9 (250+ Reviews)',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1470&auto=format&fit=crop',
      slug: ''
    });
    setShowAddForm(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.tagline || !formData.location || !formData.offer || !formData.image) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (editingSlideId !== null) {
      // Editing
      const updated = slides.map(slide => {
        if (slide.id === editingSlideId) {
          return { ...slide, ...formData };
        }
        return slide;
      });
      saveToStorage(updated);
      setEditingSlideId(null);
      toast.success('Slide updated successfully!');
    } else {
      // Adding new
      const newId = slides.length > 0 ? Math.max(...slides.map(s => s.id)) + 1 : 1;
      const slugVal = formData.slug.trim() || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newSlide = {
        id: newId,
        ...formData,
        slug: slugVal
      };
      saveToStorage([...slides, newSlide]);
      setShowAddForm(false);
      toast.success('New promotional slide added!');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-[#00DF89]" />
            <span>Home Page Promos</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Manage the full-width promotional gym advertisements slider on the landing page.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs rounded-2xl border border-slate-200 flex items-center gap-1.5 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restore Defaults</span>
          </button>
          <button
            onClick={handleAddNewClick}
            className="px-4 py-2.5 bg-[#00DF89] hover:bg-[#00c87a] text-white font-extrabold text-xs rounded-2xl flex items-center gap-1.5 transition shadow-md shadow-emerald-500/10"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add New Banner</span>
          </button>
        </div>
      </div>

      {/* Grid: Left config form/list, Right: Real-time preview */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Left Side: List & Forms */}
        <div className="space-y-6">
          
          {/* Add / Edit Form Panel */}
          {(showAddForm || editingSlideId !== null) && (
            <form 
              onSubmit={handleFormSubmit}
              className="bg-white p-6 sm:p-8 rounded-[28px] border border-slate-200 shadow-sm space-y-5 relative"
            >
              <button 
                type="button" 
                onClick={() => { setShowAddForm(false); setEditingSlideId(null); }}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-xs font-black text-slate-550 uppercase tracking-wider flex items-center space-x-2">
                <Sparkles className="h-4.5 w-4.5 text-[#00DF89]" />
                <span>{editingSlideId !== null ? 'Edit Banner Details' : 'Add New Promotional Banner'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[9px] font-black text-slate-400 mb-1.5 uppercase tracking-wider">Gym Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Gold's Gym Premium"
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#00DF89] focus:outline-none focus:ring-1 focus:ring-[#00DF89] rounded-xl shadow-sm transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[9px] font-black text-slate-400 mb-1.5 uppercase tracking-wider">Tagline / Short description *</label>
                  <input
                    type="text"
                    required
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="e.g. Elevate your performance with state-of-the-art power cages and premium coaches."
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#00DF89] focus:outline-none focus:ring-1 focus:ring-[#00DF89] rounded-xl shadow-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-slate-400 mb-1.5 uppercase tracking-wider">Location / Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Jubilee Hills, Hyderabad"
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#00DF89] focus:outline-none focus:ring-1 focus:ring-[#00DF89] rounded-xl shadow-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-slate-400 mb-1.5 uppercase tracking-wider">Rating text</label>
                  <input
                    type="text"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    placeholder="e.g. 4.9 (420+ Reviews)"
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#00DF89] focus:outline-none focus:ring-1 focus:ring-[#00DF89] rounded-xl shadow-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-slate-400 mb-1.5 uppercase tracking-wider">Exclusive Deal / Offer *</label>
                  <input
                    type="text"
                    required
                    value={formData.offer}
                    onChange={(e) => setFormData({ ...formData, offer: e.target.value })}
                    placeholder="e.g. Flat 20% Off + Free Session"
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#00DF89] focus:outline-none focus:ring-1 focus:ring-[#00DF89] rounded-xl shadow-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-slate-400 mb-1.5 uppercase tracking-wider">Gym Page Slug (Optional)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. golds-gym"
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#00DF89] focus:outline-none focus:ring-1 focus:ring-[#00DF89] rounded-xl shadow-sm transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[9px] font-black text-slate-400 mb-1.5 uppercase tracking-wider">Background Image URL *</label>
                  <input
                    type="url"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="e.g. https://images.unsplash.com/photo-..."
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#00DF89] focus:outline-none focus:ring-1 focus:ring-[#00DF89] rounded-xl shadow-sm transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setShowAddForm(false); setEditingSlideId(null); }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-650 font-bold text-xs rounded-xl border border-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#00DF89] hover:bg-[#00c87a] text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition shadow-sm"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingSlideId !== null ? 'Save Changes' : 'Create Slide'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Banner Slides List */}
          <div className="bg-white rounded-[28px] border border-slate-200 p-6 space-y-4">
            <h2 className="text-xs font-black text-slate-450 uppercase tracking-wider">
              Active Promo Slides ({slides.length})
            </h2>

            {slides.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl text-slate-400">
                <p className="text-xs font-bold">No promotional slides available.</p>
                <p className="text-[10px] mt-1">Click Add New Banner to create one.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {slides.map((slide, index) => (
                  <div 
                    key={slide.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                      index === activePreviewIndex 
                        ? 'border-emerald-500 bg-emerald-50/20 shadow-sm' 
                        : 'border-slate-150 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5 min-w-0">
                      <div 
                        className="w-12 h-12 rounded-xl bg-cover bg-center border border-slate-200/80 flex-shrink-0"
                        style={{ backgroundImage: `url('${slide.image}')` }}
                      />
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-slate-800 truncate">{slide.name}</span>
                          <span className="text-[8px] bg-slate-100 text-slate-500 border border-slate-200 font-extrabold px-1.5 py-0.5 rounded uppercase">
                            Slide {index + 1}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-1">{slide.location}</p>
                        <p className="text-[9px] text-[#00DF89] font-extrabold mt-1">{slide.offer}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => setActivePreviewIndex(index)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                        title="Preview Slide"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditClick(slide)}
                        className="p-1.5 text-slate-400 hover:text-[#00DF89] hover:bg-slate-100 rounded-lg transition"
                        title="Edit Slide"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(slide.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg transition"
                        title="Delete Slide"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Live Visual Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black text-slate-450 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-[#00DF89]" />
              <span>Real-Time Visual Preview</span>
            </h2>
            <span className="text-[9px] bg-slate-100 text-slate-500 border border-slate-200 font-extrabold px-2 py-0.5 rounded-full uppercase">
              As seen on Home Page
            </span>
          </div>

          <div className="bg-slate-950 rounded-[32px] overflow-hidden border border-slate-800 shadow-xl relative aspect-[16/10] flex flex-col justify-center">
            {slides.length === 0 ? (
              <div className="text-slate-400 text-center py-20 px-6">
                <p className="text-xs font-bold">No slides to preview.</p>
              </div>
            ) : (() => {
              const activeSlideObj = slides[activePreviewIndex] || slides[0];
              if (!activeSlideObj) return null;
              return (
                <div className="absolute inset-0 w-full h-full">
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center select-none opacity-80"
                    style={{ backgroundImage: `url('${activeSlideObj.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent z-10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />

                  {/* Content Box */}
                  <div className="relative z-20 h-full flex flex-col justify-center px-8 sm:px-12 text-white space-y-3.5">
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-black uppercase tracking-widest w-fit">
                      <Sparkles className="h-2.5 w-2.5" />
                      <span>Featured Gym Partner</span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight text-white">
                      {activeSlideObj.name}
                    </h2>
                    <p className="text-slate-300 text-[10px] sm:text-xs leading-relaxed max-w-sm">
                      {activeSlideObj.tagline}
                    </p>

                    <div className="flex items-center gap-3.5 text-[10px] font-semibold text-slate-300">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                        <span>{activeSlideObj.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{activeSlideObj.rating}</span>
                      </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 flex justify-between gap-4 items-center max-w-xs sm:max-w-md">
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Exclusive Deal</p>
                        <p className="text-xs font-black text-emerald-400 mt-0.5">{activeSlideObj.offer}</p>
                      </div>
                      <button
                        className="bg-emerald-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-1"
                        disabled
                      >
                        <span>Claim Offer</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Slider Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePreviewIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === activePreviewIndex ? 'w-5 bg-emerald-500' : 'w-2 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
