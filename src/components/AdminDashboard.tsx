import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  XCircle, 
  Download, 
  RefreshCw, 
  Newspaper, 
  Layers, 
  Search,
  AlertCircle
} from 'lucide-react';
import { Listing, CityNewsItem } from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  listings: Listing[];
  onRefreshListings: () => void;
  news: CityNewsItem[];
  onRefreshNews: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  listings,
  onRefreshListings,
  news,
  onRefreshNews
}) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'submissions' | 'news'>('listings');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [loading, setLoading] = useState(false);

  // New Listing Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newListingName, setNewListingName] = useState('');
  const [newListingCat, setNewListingCat] = useState('government');
  const [newListingSubcat, setNewListingSubcat] = useState('');
  const [newListingSector, setNewListingSector] = useState('G-5');
  const [newListingAddress, setNewListingAddress] = useState('');
  const [newListingPhone, setNewListingPhone] = useState('');
  const [newListingWebsite, setNewListingWebsite] = useState('');
  const [newListingDesc, setNewListingDesc] = useState('');

  // New News Item State
  const [newNewsTitle, setNewNewsTitle] = useState('');
  const [newNewsCategory, setNewNewsCategory] = useState<'CDA Updates' | 'Traffic' | 'Public Notice'>('CDA Updates');
  const [newNewsSummary, setNewNewsSummary] = useState('');
  const [newNewsSource, setNewNewsSource] = useState('CDA Public Relations');
  const [newNewsSourceUrl, setNewNewsSourceUrl] = useState('https://www.cda.gov.pk');

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/submissions');
      const data = await res.json();
      if (data.success) {
        setSubmissions(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSubmissions();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApproveSubmission = async (id: string) => {
    try {
      const res = await fetch(`/api/submissions/${id}/approve`, { method: 'POST' });
      if (res.ok) {
        fetchSubmissions();
        onRefreshListings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectSubmission = async (id: string) => {
    try {
      const res = await fetch(`/api/submissions/${id}/reject`, { method: 'POST' });
      if (res.ok) {
        fetchSubmissions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing from Islamabad Guide?')) return;
    try {
      const res = await fetch(`/api/listings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onRefreshListings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newListingName,
          category: newListingCat,
          subcategory: newListingSubcat || 'General',
          sector: newListingSector,
          address: newListingAddress,
          phone: newListingPhone,
          website: newListingWebsite,
          description: newListingDesc,
          coordinates: { lat: 33.72, lng: 73.06 },
          openingHours: 'Mon-Sat: 09:00 AM - 05:00 PM',
          priceRange: '$$',
          rating: 4.8,
          reviewCount: 1,
          featuredImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=900&q=80',
          facilities: ['Parking', 'Customer Support Desk'],
          sourceUrl: newListingWebsite || 'https://islamabad.gov.pk',
          isVerified: true
        })
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewListingName('');
        setNewListingSubcat('');
        setNewListingAddress('');
        setNewListingPhone('');
        setNewListingWebsite('');
        setNewListingDesc('');
        onRefreshListings();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishNews = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newNewsTitle,
          category: newNewsCategory,
          summary: newNewsSummary,
          source: newNewsSource,
          sourceUrl: newNewsSourceUrl,
          isImportant: true
        })
      });

      if (res.ok) {
        setNewNewsTitle('');
        setNewNewsSummary('');
        onRefreshNews();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(listings, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `islamabad_directory_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Category', 'Subcategory', 'Sector', 'Address', 'Phone', 'Website', 'Rating'];
    const rows = listings.map(l => [
      `"${l.id}"`,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.category}"`,
      `"${l.subcategory}"`,
      `"${l.sector}"`,
      `"${l.address.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.website || ''}"`,
      l.rating
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `islamabad_directory_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const filteredListings = listings.filter(l => 
    l.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    l.sector.toLowerCase().includes(searchFilter.toLowerCase()) ||
    l.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-5xl w-full h-[90vh] max-h-[900px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold tracking-tight">
                  Islamabad Guide Administration
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-bold border border-emerald-500/30">
                  Master Control
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Manage verified database listings, moderate submissions & broadcast updates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Controls & Metrics Strip */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('listings')}
              className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === 'listings'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Directory Listings ({listings.length})
            </button>

            <button
              onClick={() => setActiveTab('submissions')}
              className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer relative ${
                activeTab === 'submissions'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>Submissions</span>
              {submissions.filter(s => s.status === 'pending').length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px]">
                  {submissions.filter(s => s.status === 'pending').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('news')}
              className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === 'news'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Post City News ({news.length})
            </button>
          </div>

          {activeTab === 'listings' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Listing</span>
            </button>
          )}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* 1. Listings Table Tab */}
          {activeTab === 'listings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Filter by name, category, or sector..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="text-xs text-slate-500">
                  Showing <strong>{filteredListings.length}</strong> of {listings.length} verified listings
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3">Institution Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Sector</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Rating</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredListings.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-semibold text-slate-900">
                          {item.name}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                            {item.subcategory}
                          </span>
                        </td>
                        <td className="p-3 font-medium text-emerald-700">{item.sector}</td>
                        <td className="p-3 text-slate-500">{item.phone}</td>
                        <td className="p-3 font-bold text-amber-500">★ {item.rating.toFixed(1)}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteListing(item.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. Submissions Moderation Tab */}
          {activeTab === 'submissions' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800">
                Community & Business Directory Submissions
              </h4>
              {submissions.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                  No submissions pending moderation.
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions.map((sub) => (
                    <div 
                      key={sub.id} 
                      className={`p-4 rounded-2xl border ${
                        sub.status === 'approved' 
                          ? 'bg-emerald-50/50 border-emerald-200' 
                          : sub.status === 'rejected'
                          ? 'bg-rose-50/50 border-rose-200'
                          : 'bg-white border-amber-300 shadow-2xs'
                      } flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{sub.name}</span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                            {sub.subcategory || sub.category}
                          </span>
                          <span className="font-semibold text-emerald-700">Sector {sub.sector}</span>
                        </div>
                        <p className="text-slate-600">{sub.address}</p>
                        <p className="text-slate-500 italic">{sub.description}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {sub.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleApproveSubmission(sub.id)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleRejectSubmission(sub.id)}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </>
                        ) : (
                          <span className={`px-2.5 py-1 rounded-md font-bold uppercase text-[10px] ${
                            sub.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {sub.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. News Publication Tab */}
          {activeTab === 'news' && (
            <div className="space-y-6">
              <form onSubmit={handlePublishNews} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs">
                <h4 className="text-sm font-bold text-slate-800">
                  Broadcast New City Update / Alert
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Headline Title *</label>
                    <input
                      type="text"
                      required
                      value={newNewsTitle}
                      onChange={(e) => setNewNewsTitle(e.target.value)}
                      placeholder="e.g. CDA Opens New Underpass on Srinagar Highway"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Category *</label>
                    <select
                      value={newNewsCategory}
                      onChange={(e) => setNewNewsCategory(e.target.value as any)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                    >
                      <option value="CDA Updates">CDA Updates</option>
                      <option value="Traffic">Traffic Police Advisory</option>
                      <option value="Public Notice">Public Notice</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Summary Text *</label>
                  <textarea
                    required
                    rows={2}
                    value={newNewsSummary}
                    onChange={(e) => setNewNewsSummary(e.target.value)}
                    placeholder="Details about traffic diversions, opening dates, or municipal procedures..."
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Publish to Portal
                  </button>
                </div>
              </form>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-800">Active Published Bulletins</h4>
                {news.map(n => (
                  <div key={n.id} className="p-4 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{n.title}</span>
                      <span className="text-slate-400">{n.date}</span>
                    </div>
                    <p className="text-slate-600">{n.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Add Listing Sub-Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b">
                <h4 className="font-bold text-sm text-slate-900">Add Verified Directory Listing</h4>
                <button onClick={() => setShowAddModal(false)}><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleCreateListing} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Institution / Business Name"
                  value={newListingName}
                  onChange={(e) => setNewListingName(e.target.value)}
                  className="w-full p-2.5 border rounded-lg"
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newListingCat}
                    onChange={(e) => setNewListingCat(e.target.value)}
                    className="p-2 border rounded-lg"
                  >
                    <option value="government">Government</option>
                    <option value="education">Education</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="hotels">Hotels</option>
                    <option value="shopping">Shopping</option>
                    <option value="restaurants">Restaurants</option>
                    <option value="tourism">Tourism</option>
                    <option value="parks">Parks</option>
                    <option value="services">Services</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Subcategory (e.g. Public University)"
                    value={newListingSubcat}
                    onChange={(e) => setNewListingSubcat(e.target.value)}
                    className="p-2 border rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Sector (e.g. F-8)"
                    value={newListingSector}
                    onChange={(e) => setNewListingSector(e.target.value)}
                    className="p-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    value={newListingPhone}
                    onChange={(e) => setNewListingPhone(e.target.value)}
                    className="p-2 border rounded-lg"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Full Address"
                  value={newListingAddress}
                  onChange={(e) => setNewListingAddress(e.target.value)}
                  className="w-full p-2.5 border rounded-lg"
                />
                <textarea
                  rows={2}
                  placeholder="Description"
                  value={newListingDesc}
                  onChange={(e) => setNewListingDesc(e.target.value)}
                  className="w-full p-2.5 border rounded-lg"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-3 py-1.5 border rounded-lg text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-lg"
                  >
                    {loading ? 'Saving...' : 'Save Listing'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
