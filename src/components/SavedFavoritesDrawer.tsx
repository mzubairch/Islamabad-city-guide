import React from 'react';
import { 
  X, 
  Bookmark, 
  Trash2, 
  MapPin, 
  Star, 
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { Listing } from '../types';

interface SavedFavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedListings: Listing[];
  onRemoveSave: (id: string) => void;
  onClearAll: () => void;
  onSelectListing: (listing: Listing) => void;
}

export const SavedFavoritesDrawer: React.FC<SavedFavoritesDrawerProps> = ({
  isOpen,
  onClose,
  savedListings,
  onRemoveSave,
  onClearAll,
  onSelectListing
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div 
        className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-emerald-600 fill-current" />
            <h3 className="font-extrabold text-base text-slate-900">
              Saved Places ({savedListings.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedListings.length === 0 ? (
            <div className="py-20 text-center space-y-3 text-slate-400">
              <Bookmark className="w-12 h-12 mx-auto stroke-1" />
              <p className="text-sm">You haven't saved any places yet.</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Click the bookmark icon on any hospital, restaurant, mall or university to save it for quick offline access.
              </p>
            </div>
          ) : (
            savedListings.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectListing(item);
                  onClose();
                }}
                className="p-3 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all flex gap-3 cursor-pointer group"
              >
                <img
                  src={item.featuredImage}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase">
                      {item.subcategory}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveSave(item.id);
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 truncate group-hover:text-emerald-700">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {item.sector}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] mt-1 text-amber-500 font-bold">
                    <span>★ {item.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {savedListings.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
            <button
              onClick={onClearAll}
              className="text-rose-600 hover:underline font-semibold"
            >
              Clear All Saved
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
