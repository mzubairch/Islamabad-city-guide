import React, { useState } from 'react';
import { 
  Layers, 
  MapPin, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  ExternalLink 
} from 'lucide-react';
import { SectorInfo, Listing } from '../types';

interface SectorExplorerProps {
  sectors: SectorInfo[];
  listings: Listing[];
  onSelectSectorListings: (sectorCode: string) => void;
  onSelectListing: (listing: Listing) => void;
}

export const SectorExplorer: React.FC<SectorExplorerProps> = ({
  sectors,
  listings,
  onSelectSectorListings,
  onSelectListing
}) => {
  const [selectedSectorCode, setSelectedSectorCode] = useState<string>(sectors[0]?.code || 'F-7');

  const currentSector = sectors.find(s => s.code === selectedSectorCode) || sectors[0];
  const sectorListings = listings.filter(l => 
    l.sector.toLowerCase().includes(currentSector?.code.toLowerCase() || '')
  );

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold border border-emerald-600/40">
            <Layers className="w-3.5 h-3.5" />
            <span>Master Planned Capital Grid</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Explore Islamabad by Sector
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Designed on a systematic grid system by Greek urban architect Constantinos Doxiadis, each 2km × 2km sector is divided into four sub-sectors with a central commercial 'Markaz' and community facilities.
          </p>
        </div>
      </div>

      {/* Sector Quick Pills Grid */}
      <div className="flex flex-wrap items-center gap-2">
        {sectors.map((s) => {
          const isSelected = s.code === currentSector?.code;
          return (
            <button
              key={s.code}
              onClick={() => setSelectedSectorCode(s.code)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-emerald-700 text-white border-emerald-600 shadow-md scale-105'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50'
              }`}
            >
              Sector {s.code}
            </button>
          );
        })}
      </div>

      {/* Active Sector Detailed Card */}
      {currentSector && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-xs">
                  {currentSector.zone}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Central Markaz: <strong className="text-slate-800">{currentSector.markazName}</strong>
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {currentSector.name}
              </h3>
              <p className="text-sm text-slate-600 mt-2 max-w-2xl">
                {currentSector.description}
              </p>
            </div>

            <button
              onClick={() => onSelectSectorListings(currentSector.code)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shrink-0 cursor-pointer"
            >
              <span>View All Places in {currentSector.code} ({sectorListings.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Key Sector Highlights */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Sector Landmarks & Commercial Highlights
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {currentSector.highlights.map((h, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs font-semibold text-slate-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="line-clamp-1">{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Directory Listings in this Sector */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-base font-bold text-slate-900">
              Verified Institutions & Attractions in {currentSector.code}
            </h4>

            {sectorListings.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-4 bg-slate-50 rounded-xl">
                More listings are continuously being verified for Sector {currentSector.code}.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sectorListings.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectListing(item)}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex gap-3 group"
                  >
                    <img
                      src={item.featuredImage}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase font-bold text-emerald-700">
                        {item.subcategory}
                      </span>
                      <h5 className="font-bold text-xs sm:text-sm text-slate-900 truncate group-hover:text-emerald-700">
                        {item.name}
                      </h5>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {item.address}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                        <span className="text-amber-500 font-bold">★ {item.rating.toFixed(1)}</span>
                        <span className="text-emerald-700 font-medium">Verified</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
