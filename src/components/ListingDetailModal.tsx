import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  Globe, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Star, 
  Bookmark, 
  Navigation, 
  Share2, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquarePlus,
  Send,
  Building,
  ExternalLink,
  PhoneCall,
  ChevronLeft,
  ChevronRight,
  Camera,
  Maximize2,
  Image as ImageIcon
} from 'lucide-react';
import { Listing, Review } from '../types';

interface ListingDetailModalProps {
  listing: Listing | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  allListings: Listing[];
  onSelectListing: (listing: Listing) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  onClose,
  isSaved,
  onToggleSave,
  allListings,
  onSelectListing
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const [correctionMode, setCorrectionMode] = useState(false);
  const [correctionText, setCorrectionText] = useState('');
  const [correctionSent, setCorrectionSent] = useState(false);

  const [copiedShare, setCopiedShare] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const galleryScrollRef = React.useRef<HTMLDivElement>(null);

  const allImages = React.useMemo(() => {
    if (!listing) return [];
    const list = [listing.featuredImage, ...(listing.gallery || [])].filter(Boolean);
    return Array.from(new Set(list));
  }, [listing]);

  const scrollGallery = (direction: 'left' | 'right') => {
    if (galleryScrollRef.current) {
      const scrollAmount = 260;
      galleryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handlePrevImage = () => {
    if (allImages.length <= 1) return;
    setActiveImageIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (allImages.length <= 1) return;
    setActiveImageIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (listing) {
      setActiveImageIndex(0);
      setFullscreenImage(null);
      // Fetch reviews for listing
      fetch(`/api/reviews/${listing.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setReviews(data.data);
          }
        })
        .catch(err => console.error('Failed to fetch reviews:', err));
      
      setCorrectionMode(false);
      setCorrectionSent(false);
      setReviewSuccess(false);
    }
  }, [listing]);

  if (!listing) return null;

  const nearbyInSector = allListings.filter(
    l => l.sector === listing.sector && l.id !== listing.id
  ).slice(0, 3);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim()) return;
    setReviewSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.id,
          userName: newReviewAuthor,
          rating: newReviewRating,
          comment: newReviewText
        })
      });
      const data = await res.json();
      if (data.success) {
        setReviews([data.data, ...reviews]);
        setNewReviewAuthor('');
        setNewReviewText('');
        setReviewSuccess(true);
        setTimeout(() => setReviewSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleCorrectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionText.trim()) return;
    // Post to suggestions
    setCorrectionSent(true);
    setTimeout(() => {
      setCorrectionMode(false);
      setCorrectionSent(false);
      setCorrectionText('');
    }, 2500);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const openGoogleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${listing.coordinates.lat},${listing.coordinates.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all shadow-md cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Header Image */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900 shrink-0 group">
          <img
            src={allImages[activeImageIndex] || listing.featuredImage}
            alt={`${listing.name} - Photo ${activeImageIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-black/30 pointer-events-none" />

          {/* Fullscreen button */}
          <button
            onClick={() => setFullscreenImage(allImages[activeImageIndex] || listing.featuredImage)}
            className="absolute top-4 right-16 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all shadow-md cursor-pointer"
            title="View Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Previous / Next buttons for multiple images */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
                title="Previous Photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
                title="Next Photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Top category badges & Photo count */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm">
              {listing.subcategory}
            </span>
            <span className="px-3 py-1 bg-white/90 text-slate-900 text-xs font-bold rounded-lg backdrop-blur-md flex items-center gap-1 shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              Sector {listing.sector}
            </span>
            {listing.isPublic !== undefined && (
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg backdrop-blur-md ${
                listing.isPublic ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
              }`}>
                {listing.isPublic ? 'Public / Government' : 'Private'}
              </span>
            )}
            {allImages.length > 1 && (
              <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-black/60 text-white backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                <Camera className="w-3.5 h-3.5 text-amber-300" />
                <span>Photo {activeImageIndex + 1} of {allImages.length}</span>
              </span>
            )}
          </div>

          {/* Title & Metadata Overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/80 text-white text-xs font-semibold backdrop-blur-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Listing
              </span>
              <span className="text-xs text-slate-300">
                Last verified: {listing.lastVerified}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
              {listing.name}
            </h2>
            {listing.urduName && (
              <p className="text-base sm:text-lg text-emerald-300 font-serif mt-0.5">
                {listing.urduName}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
              <div className="flex items-center gap-1.5 bg-amber-400/90 text-slate-950 px-2.5 py-1 rounded-lg font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span>{listing.rating.toFixed(1)}</span>
                <span className="text-xs font-normal">({listing.reviewCount} reviews)</span>
              </div>
              {listing.priceRange && (
                <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-lg font-semibold text-xs">
                  Price: {listing.priceRange}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`tel:${listing.emergencyPhone || listing.phone}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Official Number</span>
            </a>

            {listing.website && (
              <a
                href={listing.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium text-xs sm:text-sm rounded-xl transition-colors"
              >
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>Official Website</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            )}

            <button
              onClick={openGoogleDirections}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-emerald-600" />
              <span>Directions</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(listing.id)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isSaved 
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold' 
                  : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100'
              }`}
              title={isSaved ? 'Saved in favorites' : 'Save place'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current text-emerald-600' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Share Listing"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {copiedShare && (
              <span className="text-xs font-semibold text-emerald-700 animate-fade-in">
                Link copied!
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8 flex-1">
          
          {/* Horizontal Scrolling Photo Gallery (Shown when multiple photos exist) */}
          {allImages.length > 1 && (
            <div className="space-y-3 pb-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                    <span>Photo Gallery ({allImages.length} Photos)</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Browse all views of {listing.name}. Click any photo to display it in high-resolution above.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => scrollGallery('left')}
                    className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-2xs cursor-pointer active:scale-95"
                    title="Scroll left"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollGallery('right')}
                    className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-2xs cursor-pointer active:scale-95"
                    title="Scroll right"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Horizontal Scroll Track */}
              <div
                ref={galleryScrollRef}
                className="flex gap-3.5 overflow-x-auto pb-3 pt-1 scroll-smooth snap-x scrollbar-thin scrollbar-thumb-emerald-600/30 -mx-1 px-1"
                style={{ scrollbarWidth: 'thin' }}
              >
                {allImages.map((imgUrl, idx) => {
                  const isSelected = idx === activeImageIndex;
                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`snap-start shrink-0 relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-200 group ${
                        isSelected
                          ? 'border-emerald-600 ring-2 ring-emerald-500/40 shadow-md scale-102'
                          : 'border-slate-200 hover:border-emerald-400 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${listing.name} view ${idx + 1}`}
                        className="w-44 sm:w-56 h-28 sm:h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

                      <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px]">
                        <span className="font-semibold bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Camera className="w-3 h-3 text-emerald-300" />
                          <span>Photo {idx + 1}</span>
                        </span>
                        {isSelected ? (
                          <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-md text-[10px]">
                            Viewing
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                            Click to view
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Description Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              About This Institution / Place
            </h4>
            <p className="text-slate-700 text-base leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Contact & Location Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Physical Address & Sector
              </h4>
              <p className="text-sm font-medium text-slate-800">
                {listing.address}
              </p>
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <span>Sector: <strong>{listing.sector}</strong></span>
                <span>•</span>
                <span>Coordinates: {listing.coordinates.lat.toFixed(4)}, {listing.coordinates.lng.toFixed(4)}</span>
              </div>
              <button
                onClick={openGoogleDirections}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 pt-1"
              >
                <span>Open in Google Maps Navigation</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                Timings & Operating Hours
              </h4>
              <p className="text-sm font-semibold text-slate-900">
                {listing.openingHours}
              </p>
              <div className="pt-1 text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Phone: <a href={`tel:${listing.phone}`} className="font-semibold text-emerald-700 hover:underline">{listing.phone}</a></span>
                </div>
                {listing.emergencyPhone && (
                  <div className="flex items-center gap-1.5 text-rose-700 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Emergency / Short Helpline: {listing.emergencyPhone}</span>
                  </div>
                )}
                {listing.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Email: <a href={`mailto:${listing.email}`} className="text-slate-700 hover:underline">{listing.email}</a></span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Available Facilities & Amenities */}
          {listing.facilities && listing.facilities.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Key Facilities & Amenities
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {listing.facilities.map((fac, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{fac}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services Offered */}
          {listing.services && listing.services.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Services & Offerings
              </h4>
              <div className="flex flex-wrap gap-2">
                {listing.services.map((svc, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                    {svc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Source Attribution & Data Verification Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-900">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">Official Islamabad Verification Guarantee</p>
                <p className="text-emerald-700">Information cross-referenced with government and institutional records.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={listing.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-emerald-800 underline hover:text-emerald-950 flex items-center gap-1"
              >
                <span>View Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-emerald-400">•</span>
              <button
                onClick={() => setCorrectionMode(!correctionMode)}
                className="font-semibold text-slate-700 hover:text-slate-900 underline"
              >
                Report update
              </button>
            </div>
          </div>

          {/* Suggest Correction Form */}
          {correctionMode && (
            <form onSubmit={handleCorrectionSubmit} className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3 animate-fade-in">
              <h4 className="text-xs font-bold text-amber-900 uppercase">
                Suggest an Update or Correction
              </h4>
              <p className="text-xs text-amber-800">
                Notice a changed phone number, updated timings, or relocated office? Let our verification editors know.
              </p>
              <textarea
                value={correctionText}
                onChange={(e) => setCorrectionText(e.target.value)}
                placeholder="Describe the update (e.g. 'Opening time is now 8:00 AM on weekdays')..."
                className="w-full p-2.5 text-xs bg-white border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                rows={2}
                required
              />
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg transition-colors"
                >
                  Submit Correction
                </button>
                {correctionSent && (
                  <span className="text-xs font-semibold text-emerald-700">
                    Thank you! Submitted for editor review.
                  </span>
                )}
              </div>
            </form>
          )}

          {/* User Reviews & Rating Section */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Citizen & Visitor Reviews</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                  {reviews.length}
                </span>
              </h4>
            </div>

            {/* Submit Review Form */}
            <form onSubmit={handleReviewSubmit} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <p className="text-xs font-bold text-slate-700 uppercase">Share Your Experience</p>
              <div className="flex flex-wrap items-center gap-4">
                <input
                  type="text"
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="Your Name (e.g. Asad Ali)"
                  className="p-2 text-xs bg-white border border-slate-300 rounded-lg flex-1 min-w-[200px] focus:outline-none focus:border-emerald-500"
                  required
                />
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-500 mr-1">Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewReviewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-4 h-4 ${star <= newReviewRating ? 'text-amber-400 fill-current' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                placeholder="Help fellow Islamabad residents with your honest feedback..."
                className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
                rows={2}
                required
              />
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>{reviewSubmitting ? 'Posting...' : 'Post Review'}</span>
                </button>
                {reviewSuccess && (
                  <span className="text-xs font-semibold text-emerald-700">
                    Review published! Thank you.
                  </span>
                )}
              </div>
            </form>

            {/* Reviews List */}
            <div className="space-y-3">
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No reviews yet. Be the first to share your experience!</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{rev.userName}</span>
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400">{rev.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Related Nearby Places in the same Sector */}
          {nearbyInSector.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Other Verified Places in Sector {listing.sector}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {nearbyInSector.map((near) => (
                  <div
                    key={near.id}
                    onClick={() => onSelectListing(near)}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-emerald-500 transition-all cursor-pointer space-y-1"
                  >
                    <p className="font-bold text-xs text-slate-900 line-clamp-1">{near.name}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{near.subcategory}</p>
                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-emerald-700 font-semibold">{near.sector}</span>
                      <span className="text-amber-500 font-bold">★ {near.rating.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-70 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-5 right-5 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer z-20"
            title="Close Fullscreen"
          >
            <X className="w-6 h-6" />
          </button>

          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const nextIdx = activeImageIndex === 0 ? allImages.length - 1 : activeImageIndex - 1;
                  setActiveImageIndex(nextIdx);
                  setFullscreenImage(allImages[nextIdx]);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer z-20"
                title="Previous Photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const nextIdx = activeImageIndex === allImages.length - 1 ? 0 : activeImageIndex + 1;
                  setActiveImageIndex(nextIdx);
                  setFullscreenImage(allImages[nextIdx]);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer z-20"
                title="Next Photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div 
            className="max-w-5xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={fullscreenImage}
              alt={listing.name}
              className="w-full h-full object-contain max-h-[85vh] rounded-2xl"
            />
            <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md px-3.5 py-2 rounded-xl text-white text-xs flex items-center gap-2">
              <span className="font-bold">{listing.name}</span>
              <span className="text-white/40">•</span>
              <span className="text-emerald-300">Photo {activeImageIndex + 1} of {allImages.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
