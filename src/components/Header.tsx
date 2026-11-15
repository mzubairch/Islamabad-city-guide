import React, { useState } from 'react';
import { 
  Compass, 
  Search, 
  Bookmark, 
  Sparkles, 
  PlusCircle, 
  ShieldCheck, 
  PhoneCall, 
  MapPin, 
  Menu, 
  X,
  Layers,
  Bus,
  Briefcase,
  Newspaper,
  SlidersHorizontal
} from 'lucide-react';
import { CategoryId } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCategory: CategoryId | 'all';
  setSelectedCategory: (cat: CategoryId | 'all') => void;
  savedCount: number;
  onOpenSaved: () => void;
  onOpenAI: () => void;
  onOpenSubmit: () => void;
  onOpenAdmin: () => void;
  onSearchFocus: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  savedCount,
  onOpenSaved,
  onOpenAI,
  onOpenSubmit,
  onOpenAdmin,
  onSearchFocus
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories: { id: CategoryId; label: string }[] = [
    { id: 'government', label: 'Government & Red Zone' },
    { id: 'education', label: 'Universities & Colleges' },
    { id: 'healthcare', label: 'Hospitals & Healthcare' },
    { id: 'hotels', label: 'Hotels & Stay' },
    { id: 'shopping', label: 'Shopping & Markets' },
    { id: 'restaurants', label: 'Restaurants & Dining' },
    { id: 'transport', label: 'Metro & Airport' },
    { id: 'tourism', label: 'Monuments & Tourism' },
    { id: 'parks', label: 'Parks & Recreation' },
    { id: 'services', label: 'Emergency & Services' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Emergency & Public Helpline Bar */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4 hidden md:block border-b border-emerald-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-semibold text-emerald-300">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              Islamabad Helplines:
            </span>
            <span>Police: <strong className="text-white">15</strong></span>
            <span className="text-emerald-500">•</span>
            <span>Rescue & Medical: <strong className="text-white">1122</strong></span>
            <span className="text-emerald-500">•</span>
            <span>CDA Civic Complaint: <strong className="text-white">1819</strong></span>
            <span className="text-emerald-500">•</span>
            <span>NADRA Mega Center: <strong className="text-white">111-786-100</strong></span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-emerald-200">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live City Portal
            </span>
            <span className="text-emerald-600">|</span>
            <button 
              onClick={onOpenAdmin}
              className="hover:text-white transition-colors underline decoration-emerald-500/60"
            >
              Admin Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => { setActiveTab('home'); setSelectedCategory('all'); }}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform duration-200">
              <Compass className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg md:text-xl tracking-tight text-slate-900">
                  ISLAMABAD
                </span>
                <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-sm bg-emerald-100 text-emerald-800 border border-emerald-200">
                  City Guide
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide flex items-center gap-1">
                <span>The Capital Portal</span>
                <span className="text-slate-300">•</span>
                <span className="font-serif text-emerald-700">رہنمائے اسلام آباد</span>
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600">
            <button
              onClick={() => { setActiveTab('home'); setSelectedCategory('all'); }}
              className={`px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'home' && selectedCategory === 'all'
                  ? 'text-emerald-700 font-semibold bg-emerald-50'
                  : 'hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              Explore
            </button>

            {/* Categories Dropdown or Link */}
            <button
              onClick={() => { setActiveTab('directory'); }}
              className={`px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'directory'
                  ? 'text-emerald-700 font-semibold bg-emerald-50'
                  : 'hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              Directory
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'map'
                  ? 'text-emerald-700 font-semibold bg-emerald-50'
                  : 'hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <MapPin className="w-4 h-4 text-emerald-600" />
              City Map
            </button>

            <button
              onClick={() => setActiveTab('sectors')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'sectors'
                  ? 'text-emerald-700 font-semibold bg-emerald-50'
                  : 'hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-600" />
              Sectors
            </button>

            <button
              onClick={() => setActiveTab('metro')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'metro'
                  ? 'text-emerald-700 font-semibold bg-emerald-50'
                  : 'hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Bus className="w-4 h-4 text-orange-600" />
              Metro & Airport
            </button>

            <button
              onClick={() => setActiveTab('news')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'news'
                  ? 'text-emerald-700 font-semibold bg-emerald-50'
                  : 'hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Newspaper className="w-4 h-4 text-blue-600" />
              News
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'jobs'
                  ? 'text-emerald-700 font-semibold bg-emerald-50'
                  : 'hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Briefcase className="w-4 h-4 text-purple-600" />
              Jobs
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            
            {/* Ask AI Button with Gradient */}
            <button
              onClick={onOpenAI}
              className="relative group flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium text-xs md:text-sm shadow-sm hover:shadow-md hover:from-emerald-700 hover:to-teal-700 transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
              <span>Ask Islamabad AI</span>
              <span className="hidden xl:inline-block px-1.5 py-0.5 text-[10px] uppercase font-bold bg-white/20 rounded text-emerald-100">
                24/7
              </span>
            </button>

            {/* Saved Bookmarks */}
            <button
              onClick={onOpenSaved}
              className="relative p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-colors cursor-pointer"
              title="Saved Places"
            >
              <Bookmark className="w-5 h-5 text-slate-600" />
              {savedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center ring-2 ring-white">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Submit Listing Button */}
            <button
              onClick={onOpenSubmit}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs md:text-sm font-semibold hover:bg-slate-100 hover:border-slate-400 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>Submit Listing</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <button
              onClick={() => { setActiveTab('home'); setSelectedCategory('all'); setMobileMenuOpen(false); }}
              className="p-2.5 text-left rounded-lg bg-slate-50 font-medium text-slate-800 hover:bg-emerald-50"
            >
              Explore Home
            </button>
            <button
              onClick={() => { setActiveTab('directory'); setMobileMenuOpen(false); }}
              className="p-2.5 text-left rounded-lg bg-slate-50 font-medium text-slate-800 hover:bg-emerald-50"
            >
              All Directory
            </button>
            <button
              onClick={() => { setActiveTab('map'); setMobileMenuOpen(false); }}
              className="p-2.5 text-left rounded-lg bg-slate-50 font-medium text-slate-800 hover:bg-emerald-50 flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4 text-emerald-600" />
              Interactive Map
            </button>
            <button
              onClick={() => { setActiveTab('sectors'); setMobileMenuOpen(false); }}
              className="p-2.5 text-left rounded-lg bg-slate-50 font-medium text-slate-800 hover:bg-emerald-50 flex items-center gap-1.5"
            >
              <Layers className="w-4 h-4 text-emerald-600" />
              Sectors Guide
            </button>
            <button
              onClick={() => { setActiveTab('metro'); setMobileMenuOpen(false); }}
              className="p-2.5 text-left rounded-lg bg-slate-50 font-medium text-slate-800 hover:bg-emerald-50 flex items-center gap-1.5"
            >
              <Bus className="w-4 h-4 text-orange-600" />
              Metro & Airport
            </button>
            <button
              onClick={() => { setActiveTab('news'); setMobileMenuOpen(false); }}
              className="p-2.5 text-left rounded-lg bg-slate-50 font-medium text-slate-800 hover:bg-emerald-50 flex items-center gap-1.5"
            >
              <Newspaper className="w-4 h-4 text-blue-600" />
              City News
            </button>
            <button
              onClick={() => { setActiveTab('jobs'); setMobileMenuOpen(false); }}
              className="p-2.5 text-left rounded-lg bg-slate-50 font-medium text-slate-800 hover:bg-emerald-50 flex items-center gap-1.5"
            >
              <Briefcase className="w-4 h-4 text-purple-600" />
              Jobs Portal
            </button>
            <button
              onClick={() => { onOpenSubmit(); setMobileMenuOpen(false); }}
              className="p-2.5 text-left rounded-lg bg-emerald-50 text-emerald-800 font-semibold flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              Submit Listing
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Rescue: 1122 | Police: 15 | CDA: 1819</span>
            <button onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }} className="text-emerald-700 font-semibold underline">
              Admin Panel
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
