import React from 'react';
import { 
  Search, 
  MapPin, 
  Building2, 
  GraduationCap, 
  HeartPulse, 
  Hotel, 
  ShoppingBag, 
  UtensilsCrossed, 
  Bus, 
  Landmark, 
  Trees, 
  Sparkles,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { CategoryId } from '../types';
import { WeatherForecast } from './WeatherForecast';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSector: string;
  setSelectedSector: (sector: string) => void;
  selectedCategory: CategoryId | 'all';
  setSelectedCategory: (cat: CategoryId | 'all') => void;
  onSearchSubmit: () => void;
  onOpenAI: () => void;
  sectors: string[];
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  setSearchQuery,
  selectedSector,
  setSelectedSector,
  selectedCategory,
  setSelectedCategory,
  onSearchSubmit,
  onOpenAI,
  sectors
}) => {
  const quickCategories: { id: CategoryId; label: string; icon: any; count: string }[] = [
    { id: 'government', label: 'Government', icon: Landmark, count: '17+' },
    { id: 'education', label: 'Universities', icon: GraduationCap, count: '15+' },
    { id: 'healthcare', label: 'Hospitals', icon: HeartPulse, count: '12+' },
    { id: 'shopping', label: 'Malls & Markets', icon: ShoppingBag, count: '14+' },
    { id: 'restaurants', label: 'Food & Cafes', icon: UtensilsCrossed, count: '20+' },
    { id: 'hotels', label: 'Hotels & Stay', icon: Hotel, count: '10+' },
    { id: 'tourism', label: 'Attractions', icon: Building2, count: '16+' },
    { id: 'transport', label: 'Metro & Airport', icon: Bus, count: '4 Lines' },
    { id: 'parks', label: 'Parks & Trails', icon: Trees, count: '8+' }
  ];

  const popularSearches = [
    'Faisal Mosque',
    'NADRA 24/7 Mega Center',
    'Centaurus Mall',
    'NUST H-12',
    'PIMS Hospital',
    'Orange Metro Airport',
    'Savour Foods Blue Area'
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 text-white">
      {/* Background imagery with subtle overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay scale-105 transform duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1598890777032-bde13fbe3497?auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/60 pointer-events-none" />

      {/* Decorative glow circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-20 md:pb-24">
        
        {/* Welcome Tag */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-800/60 border border-emerald-600/40 text-emerald-200 text-xs md:text-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-semibold">Official City Information Portal</span>
            <span className="text-emerald-400">•</span>
            <span className="text-emerald-300">100% Verified Records</span>
          </div>
          <button
            onClick={onOpenAI}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs md:text-sm backdrop-blur-md hover:bg-amber-500/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Need advice? Ask AI Assistant</span>
          </button>
        </div>

        {/* Hero Title & Subheading */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Explore • Discover • Navigate
            <span className="block mt-1 bg-gradient-to-r from-emerald-400 via-teal-200 to-green-300 bg-clip-text text-transparent">
              Islamabad, Pakistan
            </span>
          </h1>
          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            The comprehensive digital directory for citizens, tourists, students, and businesses.
            Find verified government offices, universities, hospitals, shopping malls, metro routes, and attractions.
          </p>
        </div>

        {/* Central Search Box */}
        <div className="mt-8 md:mt-10 max-w-4xl mx-auto">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 shadow-2xl shadow-black/50 border border-white/20 flex flex-col md:flex-row gap-2">
            
            {/* Main Search Input */}
            <div className="flex-1 flex items-center px-3 gap-2 border-b md:border-b-0 md:border-r border-slate-200 py-1.5 md:py-0">
              <Search className="w-5 h-5 text-emerald-600 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
                placeholder="What are you looking for in Islamabad? (e.g. NADRA, NUST, PIMS, Savour Foods...)"
                className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-sm md:text-base focus:outline-none"
              />
            </div>

            {/* Sector Dropdown */}
            <div className="flex items-center px-3 gap-2 border-b md:border-b-0 md:border-r border-slate-200 py-1.5 md:py-0 shrink-0">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="bg-transparent text-slate-700 text-xs md:text-sm font-medium focus:outline-none cursor-pointer py-1"
              >
                <option value="all" className="text-slate-800">All Sectors / Major Areas</option>
                {sectors.map((sec) => (
                  <option key={sec} value={sec} className="text-slate-800">
                    Sector {sec}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Dropdown */}
            <div className="flex items-center px-3 gap-2 py-1.5 md:py-0 shrink-0">
              <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as CategoryId | 'all')}
                className="bg-transparent text-slate-700 text-xs md:text-sm font-medium focus:outline-none cursor-pointer py-1"
              >
                <option value="all" className="text-slate-800">All Categories</option>
                <option value="government" className="text-slate-800">Government & Ministries</option>
                <option value="education" className="text-slate-800">Universities & Colleges</option>
                <option value="healthcare" className="text-slate-800">Hospitals & Clinics</option>
                <option value="hotels" className="text-slate-800">Hotels & Stay</option>
                <option value="shopping" className="text-slate-800">Shopping & Malls</option>
                <option value="restaurants" className="text-slate-800">Restaurants & Dining</option>
                <option value="tourism" className="text-slate-800">Monuments & Tourism</option>
                <option value="transport" className="text-slate-800">Metro & Airport</option>
                <option value="parks" className="text-slate-800">Parks & Trails</option>
                <option value="services" className="text-slate-800">Services & Utility</option>
              </select>
            </div>

            {/* Search Submit Button */}
            <button
              onClick={onSearchSubmit}
              className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm md:text-base cursor-pointer shrink-0"
            >
              <span>Search Directory</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Popular Searches */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-300">
            <span className="text-slate-400 font-medium">Trending:</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchQuery(term);
                  onSearchSubmit();
                }}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 transition-colors cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Live Weather Forecast & 3-Day Outlook */}
        <WeatherForecast />

        {/* Quick Category Icons Strip */}
        <div className="mt-10 max-w-6xl mx-auto">
          <p className="text-xs uppercase font-bold tracking-wider text-emerald-400 text-center mb-3">
            Browse by Essential Category
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 md:gap-3">
            {quickCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    onSearchSubmit();
                  }}
                  className={`p-3 rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer border ${
                    isActive 
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg scale-105' 
                      : 'bg-slate-900/60 hover:bg-slate-800/90 text-slate-200 border-white/10 hover:border-emerald-500/40 backdrop-blur-sm'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-1.5 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                  <span className="text-xs font-semibold leading-tight line-clamp-1">{cat.label}</span>
                  <span className={`text-[10px] mt-0.5 ${isActive ? 'text-emerald-200' : 'text-slate-400'}`}>{cat.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Verification & Key Metrics Strip */}
        <div className="mt-12 pt-6 border-t border-white/10 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl md:text-3xl font-extrabold text-white">100%</div>
            <div className="text-xs text-emerald-300 font-medium flex items-center justify-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Verified Sources
            </div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-extrabold text-white">20+</div>
            <div className="text-xs text-slate-300 font-medium mt-0.5">Islamabad Sectors</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-extrabold text-white">4 Lines</div>
            <div className="text-xs text-slate-300 font-medium mt-0.5">Metro BRT Network</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-extrabold text-white">24/7</div>
            <div className="text-xs text-emerald-300 font-medium mt-0.5">Emergency Directory</div>
          </div>
        </div>

      </div>
    </div>
  );
};
