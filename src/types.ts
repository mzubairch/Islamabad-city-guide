export type CategoryId = 
  | 'government'
  | 'education'
  | 'healthcare'
  | 'hotels'
  | 'shopping'
  | 'restaurants'
  | 'transport'
  | 'tourism'
  | 'parks'
  | 'services'
  | 'sectors'
  | 'jobs'
  | 'news';

export interface Listing {
  id: string;
  name: string;
  urduName?: string;
  category: CategoryId;
  subcategory: string;
  isPublic?: boolean; // For universities, hospitals, schools
  description: string;
  address: string;
  sector: string; // e.g. "F-8", "G-9", "Blue Area", "H-12"
  coordinates: {
    lat: number;
    lng: number;
  };
  phone: string;
  emergencyPhone?: string;
  email?: string;
  website?: string;
  openingHours: string;
  priceRange?: 'Free' | '$' | '$$' | '$$$' | '$$$$';
  rating: number;
  reviewCount: number;
  featuredImage: string;
  gallery?: string[];
  facilities: string[];
  services?: string[];
  sourceUrl: string;
  lastVerified: string;
  isVerified: boolean;
  isFeatured?: boolean;
}

export interface Review {
  id: string;
  listingId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface SectorInfo {
  code: string;
  name: string;
  zone: string;
  description: string;
  markazName: string;
  highlights: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface MetroStation {
  name: string;
  urduName?: string;
  line: 'Red Line' | 'Orange Line' | 'Green Line' | 'Blue Line';
  interchange?: boolean;
}

export interface MetroRoute {
  id: string;
  name: string;
  color: string;
  badgeColor: string;
  startPoint: string;
  endPoint: string;
  totalLength: string;
  operatingHours: string;
  fare: string;
  stations: MetroStation[];
  highlights: string;
}

export interface CityNewsItem {
  id: string;
  title: string;
  category: 'CDA Updates' | 'Traffic' | 'Public Notice' | 'Government' | 'Weather & Environment' | 'Education';
  date: string;
  summary: string;
  source: string;
  sourceUrl: string;
  isImportant?: boolean;
}

export interface CityJobItem {
  id: string;
  title: string;
  organization: string;
  category: 'Federal Govt' | 'Higher Education' | 'IT & Tech' | 'Healthcare' | 'NGO';
  sector: string;
  deadline: string;
  eligibility: string;
  applyUrl: string;
  postedDate: string;
}
