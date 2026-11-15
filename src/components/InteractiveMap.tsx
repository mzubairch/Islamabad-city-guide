import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Layers, 
  Navigation, 
  Locate, 
  Filter, 
  Info,
  Maximize2,
  ExternalLink
} from 'lucide-react';
import { Listing, CategoryId, SectorInfo } from '../types';

interface InteractiveMapProps {
  listings: Listing[];
  sectors: SectorInfo[];
  selectedCategory: CategoryId | 'all';
  setSelectedCategory: (cat: CategoryId | 'all') => void;
  onSelectListing: (listing: Listing) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  listings,
  sectors,
  selectedCategory,
  setSelectedCategory,
  onSelectListing
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [activeSector, setActiveSector] = useState<string>('all');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Center on Islamabad Blue Area / Faisal Mosque area
    const map = L.map(mapContainerRef.current, {
      center: [33.7200, 73.0600],
      zoom: 12,
      minZoom: 10,
      maxZoom: 18,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers when listings, filters or sectors change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    const filtered = listings.filter((l) => {
      const matchCat = selectedCategory === 'all' || l.category === selectedCategory;
      const matchSec = activeSector === 'all' || l.sector.toLowerCase().includes(activeSector.toLowerCase());
      return matchCat && matchSec;
    });

    filtered.forEach((listing) => {
      const { lat, lng } = listing.coordinates;
      if (!lat || !lng) return;

      const getPinColor = (cat: string) => {
        switch (cat) {
          case 'government': return '#059669';
          case 'education': return '#4f46e5';
          case 'healthcare': return '#e11d48';
          case 'shopping': return '#0d9488';
          case 'restaurants': return '#ea580c';
          case 'hotels': return '#d97706';
          case 'tourism': return '#7c3aed';
          case 'transport': return '#0284c7';
          default: return '#10b981';
        }
      };

      const color = getPinColor(listing.category);

      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid #ffffff;">
            <div style="transform: rotate(45deg); color: white; font-weight: bold; font-size: 11px;">
              ★
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      const popupHtml = document.createElement('div');
      popupHtml.className = 'p-1 text-slate-800 font-sans';
      popupHtml.innerHTML = `
        <div style="width: 220px;">
          <img src="${listing.featuredImage}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
          <div style="font-size: 11px; font-weight: 700; color: #059669; text-transform: uppercase;">${listing.subcategory} • Sector ${listing.sector}</div>
          <h4 style="font-weight: 800; font-size: 14px; margin: 4px 0 2px 0; color: #0f172a;">${listing.name}</h4>
          <p style="font-size: 11px; color: #64748b; margin: 0 0 8px 0; line-height: 1.3;">${listing.address}</p>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 6px;">
            <span style="font-weight: 700; font-size: 12px; color: #d97706;">★ ${listing.rating.toFixed(1)}</span>
            <button id="btn-view-${listing.id}" style="background-color: #059669; color: white; border: none; border-radius: 6px; padding: 4px 10px; font-size: 11px; font-weight: 700; cursor: pointer;">
              View Details
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-view-${listing.id}`);
        if (btn) {
          btn.onclick = () => onSelectListing(listing);
        }
      });

      marker.addTo(markersLayerRef.current!);
    });

  }, [listings, selectedCategory, activeSector]);

  // Jump to Sector
  const handleSectorJump = (sectorCode: string) => {
    setActiveSector(sectorCode);
    if (!mapInstanceRef.current) return;

    if (sectorCode === 'all') {
      mapInstanceRef.current.flyTo([33.7200, 73.0600], 12);
      return;
    }

    const sec = sectors.find(s => s.code.toLowerCase() === sectorCode.toLowerCase());
    if (sec && sec.coordinates) {
      mapInstanceRef.current.flyTo([sec.coordinates.lat, sec.coordinates.lng], 14, { duration: 1.2 });
    }
  };

  // Find user's location
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([coords.lat, coords.lng], 14);
          L.marker([coords.lat, coords.lng], {
            icon: L.divIcon({
              className: 'user-loc-marker',
              html: `<div style="background: #2563eb; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 8px rgba(37,99,235,0.3);"></div>`,
              iconSize: [18, 18],
              iconAnchor: [9, 9]
            })
          })
          .bindPopup('<b>Your Current Location</b>')
          .addTo(mapInstanceRef.current);
        }
      },
      (err) => {
        console.warn('Geolocation denied or unavailable:', err);
      }
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-[750px] relative">
      {/* Top Map Control Bar */}
      <div className="p-4 bg-slate-50/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 z-10 backdrop-blur-sm">
        
        {/* Left: Sector Selector */}
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-700" />
          <span className="text-xs font-bold text-slate-700 uppercase">Sector Jump:</span>
          <select
            value={activeSector}
            onChange={(e) => handleSectorJump(e.target.value)}
            className="p-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600 shadow-2xs"
          >
            <option value="all">Whole Islamabad</option>
            {sectors.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Center: Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto text-xs py-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Places
          </button>
          <button
            onClick={() => setSelectedCategory('government')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              selectedCategory === 'government'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Govt
          </button>
          <button
            onClick={() => setSelectedCategory('education')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              selectedCategory === 'education'
                ? 'bg-indigo-700 text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Universities
          </button>
          <button
            onClick={() => setSelectedCategory('healthcare')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              selectedCategory === 'healthcare'
                ? 'bg-rose-700 text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Hospitals
          </button>
          <button
            onClick={() => setSelectedCategory('shopping')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              selectedCategory === 'shopping'
                ? 'bg-teal-700 text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Shopping
          </button>
          <button
            onClick={() => setSelectedCategory('restaurants')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              selectedCategory === 'restaurants'
                ? 'bg-orange-700 text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Dining
          </button>
          <button
            onClick={() => setSelectedCategory('tourism')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              selectedCategory === 'tourism'
                ? 'bg-purple-700 text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Tourism
          </button>
        </div>

        {/* Right: Geolocation button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLocateMe}
            className="p-1.5 px-3 bg-white border border-slate-300 text-slate-700 hover:text-emerald-700 hover:border-emerald-500 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            title="Locate my position in Islamabad"
          >
            <Locate className="w-3.5 h-3.5 text-blue-600" />
            <span>Near Me</span>
          </button>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div 
        ref={mapContainerRef} 
        id="islamabad-leaflet-map" 
        className="flex-1 w-full h-full z-0"
      />

      {/* Bottom Floating Map Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-lg border border-slate-200 text-[11px] space-y-1.5 hidden sm:block">
        <div className="font-bold text-slate-900 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-emerald-600" />
          <span>Interactive Map Guide</span>
        </div>
        <div className="flex items-center gap-3 text-slate-600">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Government</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span> University</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span> Hospital</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span> Mall</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span> Dining</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Landmark</span>
        </div>
      </div>
    </div>
  );
};
