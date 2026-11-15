import React, { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  Building, 
  CheckCircle2,
  Clock
} from 'lucide-react';
import { CityJobItem } from '../types';

interface JobsSectionProps {
  jobs: CityJobItem[];
}

export const JobsSection: React.FC<JobsSectionProps> = ({ jobs }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Federal Govt', 'Higher Education', 'IT & Tech', 'Healthcare'];

  const filtered = selectedCategory === 'all'
    ? jobs
    : jobs.filter(j => j.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Jobs Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-800/80 text-purple-200 text-xs font-semibold border border-purple-600/40">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Employment & Professional Careers in Capital</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Islamabad Careers & Employment Directory
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Verified vacancies across Federal Ministries, autonomous institutions, premier national universities (NUST, QAU), National Science & Technology Park, and healthcare networks.
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
                ? 'bg-purple-700 text-white border-purple-600 shadow-md scale-105'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
            }`}
          >
            {cat === 'all' ? 'All Sectors' : cat}
          </button>
        ))}
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filtered.map((job) => (
          <div
            key={job.id}
            className="p-6 bg-white rounded-3xl border border-slate-200 hover:border-purple-400 hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-purple-50 text-purple-800 border border-purple-200">
                  {job.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-purple-600" />
                  Sector {job.sector}
                </span>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {job.title}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-purple-700 mt-1 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" />
                  {job.organization}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100 space-y-1">
                <strong className="text-slate-800">Eligibility & Requirements:</strong>
                <p>{job.eligibility}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-rose-700 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>Deadline: {job.deadline}</span>
              </div>

              <a
                href={job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <span>Official Application</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
