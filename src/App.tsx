import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  GraduationCap, 
  HeartPulse, 
  Hotel, 
  ShoppingBag, 
  UtensilsCrossed, 
  Bus, 
  Landmark, 
  Trees, 
  Wrench, 
  Sparkles, 
  Layers, 
  Search, 
  MapPin, 
  Filter, 
  X, 
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ListingCard } from './components/ListingCard';
import { ListingDetailModal } from './components/ListingDetailModal';
import { InteractiveMap } from './components/InteractiveMap';
import { SectorExplorer } from './components/SectorExplorer';
import { MetroTransportGuide } from './components/MetroTransportGuide';
import { NewsUpdates } from './components/NewsUpdates';
import { JobsSection } from './components/JobsSection';
import { SubmitListingModal } from './components/SubmitListingModal';
import { AdminDashboard } from './components/AdminDashboard';
import { SavedFavoritesDrawer } from './components/SavedFavoritesDrawer';
import { AskIslamabadAIModal } from './components/AskIslamabadAIModal';
import { Footer } from './components/Footer';

import { 
  INITIAL_LISTINGS, 
  SECTORS_LIST, 
  METRO_ROUTES, 
  CITY_NEWS, 
  CITY_JOBS 
} from './data/initialData';
import { Listing, CategoryId, SectorInfo, MetroRoute, CityNewsItem, CityJobItem } from './types';

export default function App() {
  // Directory & Data States
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [sectors, setSectors] = useState<SectorInfo[]>(SECTORS_LIST);
  const [metroRoutes, setMetroRoutes] = useState<MetroRoute[]>(METRO_ROUTES);
  const [news, setNews] = useState<CityNewsItem[]>(CITY_NEWS);
  const [jobs, setJobs] = useState<CityJobItem[]>(CITY_JOBS);

  // Navigation & Filtering States
  const [activeTab, setActiveTab] = useState<string>('home'); // 'home' | 'directory' | 'map' | 'sectors' | 'metro' | 'news' | 'jobs'
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [filterPublic, setFilterPublic] = useState<'all' | 'public' | 'private'>('all');

  // Interactive Modals & Drawers
  const [selectedListingModal, setSelectedListingModal] = useState<Listing | null>(null);
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);
  const [submitModalOpen, setSubmitModalOpen] = useState<boolean>(false);
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);
  const [savedDrawerOpen, setSavedDrawerOpen] = useState<boolean>(false);

  // Saved Bookmarks from LocalStorage
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('isb_saved_listings');
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Fetch updated data from backend (gracefully skipped on static hosting like GitHub Pages)
  const fetchListings = () => {
    fetch('./api/listings')
      .then(r => {
        const ct = r.headers.get('content-type') || '';
        if (!r.ok || !ct.includes('application/json')) return null;
        return r.json();
      })
      .then(d => {
        if (d?.success && d.data) setListings(d.data);
      })
      .catch(() => {
        // Static hosting uses bundled INITIAL_LISTINGS
      });
  };

  const fetchNews = () => {
    fetch('./api/news')
      .then(r => {
        const ct = r.headers.get('content-type') || '';
        if (!r.ok || !ct.includes('application/json')) return null;
        return r.json();
      })
      .then(d => {
        if (d?.success && d.data) setNews(d.data);
      })
      .catch(() => {
        // Static hosting uses bundled CITY_NEWS
      });
  };

  useEffect(() => {
    fetchListings();
    fetchNews();
  }, []);

  // Save Bookmarks to LocalStorage
  const toggleSave = (id: string) => {
    setSavedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem('isb_saved_listings', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const clearAllSaved = () => {
    setSavedIds([]);
    try {
      localStorage.removeItem('isb_saved_listings');
    } catch (e) {
      console.error(e);
    }
  };

  const savedListings = useMemo(() => {
    return listings.filter(l => savedIds.includes(l.id));
  }, [listings, savedIds]);

  // Sector list for select dropdowns
  const sectorCodes = useMemo(() => {
    const set = new Set<string>();
    sectors.forEach(s => set.add(s.code));
    listings.forEach(l => {
      if (l.sector) set.add(l.sector);
    });
    return Array.from(set);
  }, [sectors, listings]);

  // Filtered Listings for directory view
  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      // 1. Category Filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // 2. Sector Filter
      if (selectedSector !== 'all' && !item.sector.toLowerCase().includes(selectedSector.toLowerCase())) {
        return false;
      }
      // 3. Public / Private Filter
      if (filterPublic === 'public' && item.isPublic === false) return false;
      if (filterPublic === 'private' && item.isPublic === true) return false;

      // 4. Search Query Filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchUrdu = item.urduName && item.urduName.includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchSubcat = item.subcategory.toLowerCase().includes(q);
        const matchAddress = item.address.toLowerCase().includes(q);
        const matchSector = item.sector.toLowerCase().includes(q);
        const matchFacility = item.facilities?.some(f => f.toLowerCase().includes(q));

        if (!matchName && !matchUrdu && !matchDesc && !matchSubcat && !matchAddress && !matchSector && !matchFacility) {
          return false;
        }
      }

      return true;
    });
  }, [listings, selectedCategory, selectedSector, filterPublic, searchQuery]);

  // Quick category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    listings.forEach(l => {
      counts[l.category] = (counts[l.category] || 0) + 1;
    });
    return counts;
  }, [listings]);

  const handleSearchSubmit = () => {
    setActiveTab('directory');
    const el = document.getElementById('directory-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleJumpToSector = (code: string) => {
    setSelectedSector(code);
    setActiveTab('directory');
    const el = document.getElementById('directory-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedSector('all');
    setSelectedCategory('all');
    setFilterPublic('all');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        savedCount={savedIds.length}
        onOpenSaved={() => setSavedDrawerOpen(true)}
        onOpenAI={() => setAiModalOpen(true)}
        onOpenSubmit={() => setSubmitModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
        onSearchFocus={() => {
          setActiveTab('home');
          window.scrollTo({ top: 150, behavior: 'smooth' });
        }}
      />

      {/* Main View Router */}
      <main className="flex-1">
        
        {/* HOME VIEW */}
        {activeTab === 'home' && (
          <div className="space-y-16 pb-20">
            {/* Hero Section */}
            <Hero
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedSector={selectedSector}
              setSelectedSector={setSelectedSector}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onSearchSubmit={handleSearchSubmit}
              onOpenAI={() => setAiModalOpen(true)}
              sectors={sectorCodes}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
              
              {/* Featured Highlights Strip */}
              <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div>
                    <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-700">
                      Editor’s Selection
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Prominent Landmarks & Institutions
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Essential institutions and world-famous landmarks that define Islamabad.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setActiveTab('directory');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                  >
                    <span>View all {listings.length} listings</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.filter(l => l.isFeatured).slice(0, 6).map((item) => (
                    <ListingCard
                      key={item.id}
                      listing={item}
                      isSaved={savedIds.includes(item.id)}
                      onToggleSave={toggleSave}
                      onSelect={(l) => setSelectedListingModal(l)}
                    />
                  ))}
                </div>
              </section>

              {/* Interactive City Map Preview */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-700">
                      Geographic Discovery
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Interactive Islamabad Map
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveTab('map')}
                    className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <span>Full Map View</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <InteractiveMap
                  listings={listings}
                  sectors={sectors}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  onSelectListing={(l) => setSelectedListingModal(l)}
                />
              </section>

              {/* Browse By Category Section Preview */}
              <section id="categories-strip" className="space-y-6">
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-700">
                    City Portals
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Directory by Main Sector & Domain
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { id: 'government', title: 'Federal Government & Red Zone', desc: 'Supreme Court, Parliament, CDA, NADRA 24/7 Mega Center & Police HQ.', count: categoryCounts['government'] || 0, icon: Landmark, color: 'text-emerald-600 bg-emerald-50' },
                    { id: 'education', title: 'Universities & Higher Education', desc: 'Quaid-i-Azam, NUST H-12, FAST NUCES, COMSATS & research institutes.', count: categoryCounts['education'] || 0, icon: GraduationCap, color: 'text-indigo-600 bg-indigo-50' },
                    { id: 'healthcare', title: 'Hospitals & Medical Centers', desc: 'PIMS trauma hospital, Shifa International, Maroof & 24/7 IDC labs.', count: categoryCounts['healthcare'] || 0, icon: HeartPulse, color: 'text-rose-600 bg-rose-50' },
                    { id: 'shopping', title: 'Malls & Commercial Markaz', desc: 'Centaurus Mall, Giga Mall, Jinnah Super F-7 & Karachi Company G-9.', count: categoryCounts['shopping'] || 0, icon: ShoppingBag, color: 'text-teal-600 bg-teal-50' },
                    { id: 'restaurants', title: 'Restaurants & Dining Spots', desc: 'Savour Foods Blue Area, Monal Pir Sohawa, Kabul Restaurant & cafes.', count: categoryCounts['restaurants'] || 0, icon: UtensilsCrossed, color: 'text-orange-600 bg-orange-50' },
                    { id: 'transport', title: 'Metro BRT & International Airport', desc: 'Red Line, Orange Line to Airport, Green & Blue transit connections.', count: categoryCounts['transport'] || 0, icon: Bus, color: 'text-sky-600 bg-sky-50' },
                    { id: 'tourism', title: 'Landmarks, Monuments & Heritage', desc: 'Faisal Mosque, Pakistan Monument, Lok Virsa & Margalla trails.', count: categoryCounts['tourism'] || 0, icon: Building2, color: 'text-purple-600 bg-purple-50' },
                    { id: 'parks', title: 'Parks, Lakes & Outdoor Recreation', desc: 'Fatima Jinnah F-9 Park, Rawal Lake, Lake View Park & Rose Garden.', count: categoryCounts['parks'] || 0, icon: Trees, color: 'text-green-600 bg-green-50' },
                    { id: 'services', title: 'Public Utilities & Municipal Helplines', desc: 'Rescue 1122, IESCO electricity, CDA 1819 & emergency services.', count: categoryCounts['services'] || 0, icon: Wrench, color: 'text-slate-600 bg-slate-100' }
                  ].map((card) => {
                    const Icon = card.icon;
                    return (
                      <div
                        key={card.id}
                        onClick={() => {
                          setSelectedCategory(card.id as CategoryId);
                          setActiveTab('directory');
                        }}
                        className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex items-start gap-4 group"
                      >
                        <div className={`p-3 rounded-xl ${card.color} shrink-0 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                              {card.title}
                            </h3>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2">
                            {card.desc}
                          </p>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[11px] font-bold text-emerald-700">
                              {card.count} Verified Listings
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Sector Explorer Section */}
              <section id="sectors-explorer">
                <SectorExplorer
                  sectors={sectors}
                  listings={listings}
                  onSelectSectorListings={handleJumpToSector}
                  onSelectListing={(l) => setSelectedListingModal(l)}
                />
              </section>

              {/* Transit & Airport Guide */}
              <section>
                <MetroTransportGuide metroRoutes={metroRoutes} />
              </section>

              {/* News & Updates Preview */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase font-extrabold tracking-wider text-blue-700">
                      City Bulletins
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Islamabad City News & Traffic Alerts
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveTab('news')}
                    className="text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
                  >
                    <span>View all bulletins</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <NewsUpdates news={news} />
              </section>

            </div>
          </div>
        )}

        {/* DIRECTORY VIEW */}
        {activeTab === 'directory' && (
          <div id="directory-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
            
            {/* Filter & Search Header */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Islamabad City Directory
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Explore verified government offices, hospitals, universities, markets, dining and municipal facilities.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={clearAllFilters}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Reset Filters
                  </button>
                  <button
                    onClick={() => setSubmitModalOpen(true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    + Submit Listing
                  </button>
                </div>
              </div>

              {/* Search & Sector Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, subcategory, keyword, or street address..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Sector Selector */}
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="all">All Sectors / Localities</option>
                    {sectorCodes.map((s) => (
                      <option key={s} value={s}>
                        Sector {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category Pills Strip */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All Categories ({listings.length})
                </button>
                {[
                  { id: 'government', label: 'Government' },
                  { id: 'education', label: 'Universities' },
                  { id: 'healthcare', label: 'Hospitals' },
                  { id: 'shopping', label: 'Shopping' },
                  { id: 'restaurants', label: 'Dining' },
                  { id: 'hotels', label: 'Hotels' },
                  { id: 'transport', label: 'Metro & Airport' },
                  { id: 'tourism', label: 'Tourism' },
                  { id: 'parks', label: 'Parks' },
                  { id: 'services', label: 'Services' }
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id as CategoryId)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      selectedCategory === c.id
                        ? 'bg-emerald-700 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {c.label} {categoryCounts[c.id] ? `(${categoryCounts[c.id]})` : ''}
                  </button>
                ))}
              </div>

              {/* Public / Private Toggle */}
              <div className="flex items-center gap-2 pt-1 text-xs">
                <span className="font-bold text-slate-500">Ownership:</span>
                <button
                  onClick={() => setFilterPublic('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    filterPublic === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterPublic('public')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    filterPublic === 'public' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Public / Government Only
                </button>
                <button
                  onClick={() => setFilterPublic('private')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    filterPublic === 'private' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Private Only
                </button>
              </div>
            </div>

            {/* Results Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>Showing <strong>{filteredListings.length}</strong> verified places</span>
                {savedIds.length > 0 && (
                  <button
                    onClick={() => setSavedDrawerOpen(true)}
                    className="text-emerald-700 font-semibold hover:underline"
                  >
                    View {savedIds.length} Saved Places
                  </button>
                )}
              </div>

              {filteredListings.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                  <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="font-bold text-slate-800 text-base">No listings match your search criteria</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try searching with another keyword or reset the sector and category filters.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredListings.map((item) => (
                    <ListingCard
                      key={item.id}
                      listing={item}
                      isSaved={savedIds.includes(item.id)}
                      onToggleSave={toggleSave}
                      onSelect={(l) => setSelectedListingModal(l)}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* MAP VIEW */}
        {activeTab === 'map' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Islamabad Interactive City Map
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Navigate through sectors, click pins for verified details, and get real-time directions.
                </p>
              </div>
            </div>
            <InteractiveMap
              listings={listings}
              sectors={sectors}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onSelectListing={(l) => setSelectedListingModal(l)}
            />
          </div>
        )}

        {/* SECTORS VIEW */}
        {activeTab === 'sectors' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SectorExplorer
              sectors={sectors}
              listings={listings}
              onSelectSectorListings={handleJumpToSector}
              onSelectListing={(l) => setSelectedListingModal(l)}
            />
          </div>
        )}

        {/* METRO & AIRPORT VIEW */}
        {activeTab === 'metro' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <MetroTransportGuide metroRoutes={metroRoutes} />
          </div>
        )}

        {/* NEWS VIEW */}
        {activeTab === 'news' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <NewsUpdates news={news} />
          </div>
        )}

        {/* JOBS VIEW */}
        {activeTab === 'jobs' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <JobsSection jobs={jobs} />
          </div>
        )}

      </main>

      {/* Floating Ask Islamabad AI Assistant Button */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setAiModalOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-white/80"
        >
          <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold leading-none">Ask Islamabad AI</div>
            <div className="text-[10px] text-emerald-100 font-medium mt-0.5">Instant City Guide</div>
          </div>
          <span className="sm:hidden text-xs font-bold">Ask AI</span>
        </button>
      </div>

      {/* Detail Modal */}
      <ListingDetailModal
        listing={selectedListingModal}
        onClose={() => setSelectedListingModal(null)}
        isSaved={selectedListingModal ? savedIds.includes(selectedListingModal.id) : false}
        onToggleSave={toggleSave}
        allListings={listings}
        onSelectListing={(l) => setSelectedListingModal(l)}
      />

      {/* Ask AI Assistant Modal */}
      <AskIslamabadAIModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        listings={listings}
        sectors={sectors}
        metroRoutes={metroRoutes}
        news={news}
        jobs={jobs}
      />

      {/* Submit Listing Modal */}
      <SubmitListingModal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        sectors={sectorCodes}
      />

      {/* Admin Dashboard */}
      <AdminDashboard
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        listings={listings}
        onRefreshListings={fetchListings}
        news={news}
        onRefreshNews={fetchNews}
      />

      {/* Saved Bookmarks Drawer */}
      <SavedFavoritesDrawer
        isOpen={savedDrawerOpen}
        onClose={() => setSavedDrawerOpen(false)}
        savedListings={savedListings}
        onRemoveSave={toggleSave}
        onClearAll={clearAllSaved}
        onSelectListing={(l) => setSelectedListingModal(l)}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setActiveTab('directory');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAI={() => setAiModalOpen(true)}
        onOpenSubmit={() => setSubmitModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />
    </div>
  );
}
