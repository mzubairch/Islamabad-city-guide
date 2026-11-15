import React, { useState } from 'react';
import { 
  Newspaper, 
  Calendar, 
  ExternalLink, 
  AlertTriangle, 
  ShieldCheck, 
  Filter,
  CheckCircle2
} from 'lucide-react';
import { CityNewsItem } from '../types';

interface NewsUpdatesProps {
  news: CityNewsItem[];
}

export const NewsUpdates: React.FC<NewsUpdatesProps> = ({ news }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'CDA Updates', 'Traffic', 'Weather & Environment', 'Government', 'Public Notice'];

  const filtered = selectedCategory === 'all' 
    ? news 
    : news.filter(n => n.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* News Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 text-blue-200 text-xs font-semibold border border-blue-600/40">
            <Newspaper className="w-3.5 h-3.5" />
            <span>Verified Local News & Official Bulletins</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Islamabad City Updates & Public Notices
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Stay informed with verified notifications from the Capital Development Authority, Islamabad Traffic Police (ITP), district administration, and educational boards.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white border-blue-500 shadow-md scale-105'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
            }`}
          >
            {cat === 'all' ? 'All Notices' : cat}
          </button>
        ))}
      </div>

      {/* News Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 text-xs font-extrabold rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
                  {item.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.date}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {item.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Source: {item.source}</span>
              </div>

              {item.sourceUrl && (
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>Official Notice</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
