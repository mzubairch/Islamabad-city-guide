import React from 'react';
import { 
  MapPin, 
  Phone, 
  ExternalLink, 
  Star, 
  Bookmark, 
  ShieldCheck, 
  Clock, 
  Navigation,
  CheckCircle,
  Building2,
  GraduationCap,
  HeartPulse,
  Hotel,
  ShoppingBag,
  UtensilsCrossed,
  Bus,
  Trees
} from 'lucide-react';
import { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onSelect: (listing: Listing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  isSaved,
  onToggleSave,
  onSelect
}) => {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'government': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'education': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'healthcare': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'hotels': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'shopping': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'restaurants': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'transport': return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'tourism': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'parks': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const openGoogleDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://www.google.com/maps/dir/?api=1&destination=${listing.coordinates.lat},${listing.coordinates.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div 
      onClick={() => onSelect(listing)}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-emerald-500/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
    >
      {/* Top Image & Overlays */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={listing.featuredImage}
          alt={listing.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Category & Sector Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border backdrop-blur-md shadow-xs ${getCategoryColor(listing.category)}`}>
            {listing.subcategory}
          </span>
          <span className="px-2 py-1 text-xs font-semibold rounded-lg bg-black/60 text-white backdrop-blur-md flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-400" />
            {listing.sector}
          </span>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(listing.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-colors ${
            isSaved 
              ? 'bg-emerald-600 text-white shadow-md' 
              : 'bg-black/40 hover:bg-black/60 text-white'
          }`}
          title={isSaved ? 'Remove from Saved' : 'Save Place'}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Verified Shield Badge & Urgency / Rating */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md font-medium text-[11px] text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Official</span>
          </div>

          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md text-amber-300 font-bold">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{listing.rating.toFixed(1)}</span>
            <span className="text-white/70 font-normal">({listing.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-emerald-700 transition-colors line-clamp-1">
              {listing.name}
            </h3>
          </div>
          {listing.urduName && (
            <p className="text-xs text-slate-500 font-serif line-clamp-1 mt-0.5">
              {listing.urduName}
            </p>
          )}

          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mt-2 leading-relaxed">
            {listing.description}
          </p>
        </div>

        {/* Address & Hours Snippet */}
        <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{listing.address}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate text-slate-700 font-medium">{listing.openingHours}</span>
          </div>
        </div>

        {/* Key Facilities Pills */}
        {listing.facilities && listing.facilities.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {listing.facilities.slice(0, 3).map((f, i) => (
              <span key={i} className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium">
                {f}
              </span>
            ))}
            {listing.facilities.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 text-slate-400">
                +{listing.facilities.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <a
            href={`tel:${listing.emergencyPhone || listing.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-emerald-700 p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Call</span>
          </a>

          <div className="flex items-center gap-1.5">
            <button
              onClick={openGoogleDirections}
              className="p-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1"
              title="Get Directions"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-600" />
              <span>Map</span>
            </button>
            <button
              onClick={() => onSelect(listing)}
              className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-lg transition-colors"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
