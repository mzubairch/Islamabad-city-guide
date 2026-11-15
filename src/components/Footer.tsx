import React from 'react';
import { 
  Compass, 
  PhoneCall, 
  ShieldCheck, 
  Heart, 
  MapPin, 
  ExternalLink,
  Mail,
  Building2,
  Bus,
  Sparkles
} from 'lucide-react';
import { CategoryId } from '../types';

interface FooterProps {
  onSelectCategory: (cat: CategoryId | 'all') => void;
  onOpenAI: () => void;
  onOpenSubmit: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenAI,
  onOpenSubmit,
  onOpenAdmin
}) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      
      {/* Emergency & Municipal Support Banner */}
      <div className="bg-emerald-950/70 border-b border-emerald-900/60 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800/80 flex items-center justify-center text-emerald-200">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Need Urgent Assistance in Islamabad?</p>
              <p className="text-emerald-300 text-xs">Emergency helplines operate 24 hours a day, 7 days a week.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-semibold text-white">
            <a href="tel:15" className="px-3 py-1.5 rounded-xl bg-emerald-900 border border-emerald-700 hover:bg-emerald-800 transition-colors">
              Police: <strong>15</strong>
            </a>
            <a href="tel:1122" className="px-3 py-1.5 rounded-xl bg-emerald-900 border border-emerald-700 hover:bg-emerald-800 transition-colors">
              Rescue / Ambulance: <strong>1122</strong>
            </a>
            <a href="tel:1819" className="px-3 py-1.5 rounded-xl bg-emerald-900 border border-emerald-700 hover:bg-emerald-800 transition-colors">
              CDA Civic Care: <strong>1819</strong>
            </a>
            <a href="tel:1915" className="px-3 py-1.5 rounded-xl bg-emerald-900 border border-emerald-700 hover:bg-emerald-800 transition-colors">
              Traffic Helpline: <strong>1915</strong>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Sitemap Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 text-white">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-white">
                ISLAMABAD CITY GUIDE
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              The premier digital information platform for Islamabad, Pakistan. Dedicated to providing residents, tourists, students, and businesses with authentic, verified municipal and commercial directory information.
            </p>
            <div className="flex items-center gap-2 pt-1 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official Data Verification Standards</span>
            </div>
            <div className="pt-2">
              <button
                onClick={onOpenAI}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold transition-all shadow-md cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Ask Islamabad AI Assistant</span>
              </button>
            </div>
          </div>

          {/* Directory Categories */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">
              City Directory
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onSelectCategory('government')} className="hover:text-emerald-400 transition-colors">
                  Government & Ministries
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('education')} className="hover:text-emerald-400 transition-colors">
                  Universities & Colleges
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('healthcare')} className="hover:text-emerald-400 transition-colors">
                  Hospitals & Medical Centers
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('shopping')} className="hover:text-emerald-400 transition-colors">
                  Malls & Commercial Markaz
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('restaurants')} className="hover:text-emerald-400 transition-colors">
                  Dining & Street Food
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('hotels')} className="hover:text-emerald-400 transition-colors">
                  Hotels & Guest Houses
                </button>
              </li>
            </ul>
          </div>

          {/* Transit & Sectors */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">
              Navigation & Transit
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onSelectCategory('transport')} className="hover:text-emerald-400 transition-colors">
                  Metro Bus Red Line
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('transport')} className="hover:text-emerald-400 transition-colors">
                  Airport Orange Line Link
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('tourism')} className="hover:text-emerald-400 transition-colors">
                  Faisal Mosque & Monuments
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('parks')} className="hover:text-emerald-400 transition-colors">
                  Margalla Trails & Parks
                </button>
              </li>
              <li>
                <a href="#sectors-explorer" className="hover:text-emerald-400 transition-colors">
                  Sector Directory (F-6 to G-11)
                </a>
              </li>
              <li>
                <button onClick={onOpenSubmit} className="hover:text-emerald-400 transition-colors">
                  Submit Business / Listing
                </button>
              </li>
            </ul>
          </div>

          {/* Official Verification Sources */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">
              Verified Sources
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="https://www.cda.gov.pk" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 flex items-center gap-1">
                  <span>Capital Development Authority</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://islamabadpolice.gov.pk" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 flex items-center gap-1">
                  <span>Islamabad Capital Police</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.nadra.gov.pk" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 flex items-center gap-1">
                  <span>NADRA Mega Services</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://islamabadairport.com.pk" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 flex items-center gap-1">
                  <span>Islamabad Int'l Airport</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://hec.gov.pk" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 flex items-center gap-1">
                  <span>Higher Education Commission</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li className="pt-2">
                <button onClick={onOpenAdmin} className="text-emerald-400 hover:text-emerald-300 font-semibold underline">
                  Admin Dashboard Login
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © {new Date().getFullYear()} Islamabad City Guide. Built for residents, tourists, and students of the Federal Capital of Pakistan.
          </p>
          <div className="flex items-center gap-4">
            <span>Data verified for accuracy</span>
            <span>•</span>
            <span>All emergency helplines verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
