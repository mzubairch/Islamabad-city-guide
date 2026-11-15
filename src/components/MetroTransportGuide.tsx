import React, { useState, useMemo } from 'react';
import { 
  Bus, 
  Plane, 
  CreditCard, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Info,
  Train,
  ExternalLink,
  ShieldCheck,
  PhoneCall,
  Search,
  X
} from 'lucide-react';
import { MetroRoute } from '../types';

interface MetroTransportGuideProps {
  metroRoutes: MetroRoute[];
}

export const MetroTransportGuide: React.FC<MetroTransportGuideProps> = ({
  metroRoutes
}) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(metroRoutes[0]?.id || 'metro-red');
  const [stationSearch, setStationSearch] = useState<string>('');

  const activeRoute = metroRoutes.find(r => r.id === selectedRouteId) || metroRoutes[0];

  const matchingStationsAcrossLines = useMemo(() => {
    const q = stationSearch.trim().toLowerCase();
    if (!q) return [];
    const results: { routeId: string; routeName: string; badgeColor: string; stationName: string; index: number; interchange?: boolean }[] = [];
    metroRoutes.forEach(route => {
      route.stations.forEach((st, idx) => {
        if (st.name.toLowerCase().includes(q)) {
          results.push({
            routeId: route.id,
            routeName: route.name.split('(')[0].trim(),
            badgeColor: route.badgeColor,
            stationName: st.name,
            index: idx + 1,
            interchange: st.interchange
          });
        }
      });
    });
    return results;
  }, [metroRoutes, stationSearch]);

  return (
    <div className="space-y-10">
      
      {/* Hero Transit Banner */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-orange-950 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-800/60 text-red-200 text-xs font-semibold border border-red-600/40">
            <Bus className="w-3.5 h-3.5" />
            <span>Federal Capital Bus Rapid Transit (BRT)</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Islamabad Metro & Airport Transit Guide
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Complete station directory across all 4 corridors (Red, Orange, Green, and Blue Lines) connecting Rawalpindi, Islamabad sectors, and Islamabad International Airport.
          </p>
        </div>
      </div>

      {/* Station Search Across All Metro Lines */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={stationSearch}
            onChange={(e) => setStationSearch(e.target.value)}
            placeholder="Find a Metro station across all 4 lines (e.g. Faizabad, 6th Road, NUST, Aabpara, Zero Point)..."
            className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {stationSearch && (
            <button
              onClick={() => setStationSearch('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {stationSearch.trim() !== '' && (
          <div className="pt-1">
            {matchingStationsAcrossLines.length === 0 ? (
              <p className="text-xs text-slate-500">No Metro stations found matching "{stationSearch}".</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {matchingStationsAcrossLines.map((m, idx) => (
                  <button
                    key={`${m.routeId}-${idx}`}
                    onClick={() => setSelectedRouteId(m.routeId)}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-xs flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${m.badgeColor}`}>
                      {m.routeName}
                    </span>
                    <span className="font-bold text-slate-900">#{m.index} {m.stationName}</span>
                    {m.interchange && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                        Interchange
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Metro Line Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {metroRoutes.map((route) => {
          const isSelected = route.id === activeRoute?.id;
          return (
            <div
              key={route.id}
              onClick={() => setSelectedRouteId(route.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-white border-slate-900 shadow-md ring-2 ring-emerald-500/20' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${route.badgeColor}`}>
                  {route.name.split('(')[0].trim()}
                </span>
                <span className="text-xs font-bold text-slate-500">{route.stations.length} Stations</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                {route.name}
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                {route.startPoint} ➔ {route.endPoint}
              </p>
            </div>
          );
        })}
      </div>

      {/* Selected Route Detailed View */}
      {activeRoute && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className={`px-3 py-1 rounded-md text-xs font-extrabold ${activeRoute.badgeColor}`}>
                {activeRoute.name}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                {activeRoute.startPoint} to {activeRoute.endPoint}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                {activeRoute.highlights}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5 shrink-0 text-xs">
              <div><strong>Operating Hours:</strong> <span className="text-slate-700">{activeRoute.operatingHours}</span></div>
              <div><strong>Transit Fare:</strong> <span className="text-emerald-700 font-bold">{activeRoute.fare}</span></div>
              <div><strong>Corridor Length:</strong> <span className="text-slate-700">{activeRoute.totalLength}</span></div>
            </div>
          </div>

          {/* Complete Numbered Station List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Complete Station Stops in Sequence ({activeRoute.stations.length} Stations)
              </h4>
              <span className="text-[11px] text-slate-500">
                Ordered from {activeRoute.startPoint.split('(')[0].trim()} ➔ {activeRoute.endPoint.split('(')[0].trim()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeRoute.stations.map((st, i) => {
                const isMatch = stationSearch.trim() !== '' && st.name.toLowerCase().includes(stationSearch.trim().toLowerCase());
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between gap-3 p-3 rounded-2xl border transition-colors ${
                      isMatch
                        ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-300'
                        : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-7 h-7 rounded-xl text-xs font-extrabold flex items-center justify-center shrink-0 ${
                          st.interchange
                            ? 'bg-amber-500 text-white shadow-2xs'
                            : 'bg-slate-800 text-white'
                        }`}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                        {st.name}
                      </span>
                    </div>
                    {st.interchange && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] border border-amber-300 shrink-0">
                        Interchange
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Islamabad International Airport (IIAP) Guide Card */}
      <div className="bg-gradient-to-br from-slate-900 to-sky-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-800/80 text-sky-200 text-xs font-semibold border border-sky-600/40 mb-2">
              <Plane className="w-3.5 h-3.5" />
              <span>Gateway to Northern Pakistan & World</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Islamabad International Airport (IIAP)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Equipped to serve 15 million passengers annually with Cat-III dual runways, modern baggage handling, CIP Lounges, and express direct bus service.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://islamabadairport.com.pk"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <span>Live Flight Schedule</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="tel:114"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-sky-300" />
              <span>Inquiry 114</span>
            </a>
          </div>
        </div>

        {/* Airport Access & Transport Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h4 className="font-bold text-sky-300 uppercase text-[11px] flex items-center gap-1.5">
              <Bus className="w-4 h-4" />
              Orange Metro Bus Line
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Departs directly from the Airport Lower Arrival Concourse to Faiz Ahmad Faiz station (H-8/I-8). Direct transfer to Blue & Red line networks. Fare is PKR 50.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h4 className="font-bold text-sky-300 uppercase text-[11px] flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              Road & Motorway Access
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Connected via Srinagar Highway and M-1/M-2 toll motorways. Approximate drive times: Blue Area (25 mins), F-7 (30 mins), DHA Phase II (40 mins).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h4 className="font-bold text-sky-300 uppercase text-[11px] flex items-center gap-1.5">
              <CreditCard className="w-4 h-4" />
              Taxis & Ride-Hailing
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Official CAA Pre-Paid yellow/white taxi counters inside arrivals terminal. Careem, Indrive, and Yango ride-hailing pickups permitted in dedicated lanes.
            </p>
          </div>
        </div>
      </div>

      {/* Metro Ticketing & Smart Card Information */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4">
        <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-600" />
          <span>Ticketing, Smart Cards & Rules</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-600">
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-1">
            <strong className="text-slate-900">Metro RFID Smart Card:</strong>
            <p>Purchase for PKR 150 at any station counter. Rechargeable and provides hassle-free tap-and-go entry without waiting in token lines.</p>
          </div>
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-1">
            <strong className="text-slate-900">Single Ride Tokens:</strong>
            <p>Token vending machines and ticket booths issue single-journey coins valid for 1 hour from issuance.</p>
          </div>
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-1">
            <strong className="text-slate-900">Accessibility & Luggage:</strong>
            <p>Every station has elevators, ramps, dedicated women sections in the front of each bus, and priority senior citizen seats.</p>
          </div>
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-1">
            <strong className="text-slate-900">Transit Helpline:</strong>
            <p>For timetable queries or lost baggage on Metro buses, call PMA twin cities helpline <strong>+92 51 111 222 627</strong>.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
