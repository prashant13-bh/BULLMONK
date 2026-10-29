// BULLMONK Enterprise Type Definitions - Tier-1 Global Media & AdSense Architecture

export interface Author {
  name: string;
  title: string;
  avatar: string;
  location: string;
  credentials?: string;
  bio?: string;
  email?: string;
  twitter?: string;
}

export type Region = 
  | 'Global'
  | 'United States'
  | 'Europe'
  | 'Canada'
  | 'India'
  | 'Australia & NZ'
  | 'Russia & Eurasia'
  | 'Asia-Pacific'
  | 'Middle East';

export interface RegionBureau {
  id: string;
  shortLabel: string;
  label: string;
  flag: string;
  bureau: string;
}

export const REGIONAL_BUREAUS: RegionBureau[] = [
  { id: 'all', shortLabel: 'GLOBAL', label: 'Global Macro Wire', flag: '🌐', bureau: 'All International Bureaus' },
  { id: 'United States', shortLabel: 'USA', label: 'United States (Wall St / DC)', flag: '🇺🇸', bureau: 'New York & Washington' },
  { id: 'Europe', shortLabel: 'EUROPE', label: 'Europe (ECB / London)', flag: '🇪🇺', bureau: 'Frankfurt & London' },
  { id: 'India', shortLabel: 'INDIA', label: 'India (Dalal St / GIFT City)', flag: '🇮🇳', bureau: 'Mumbai & GIFT City' },
  { id: 'Asia-Pacific', shortLabel: 'ASIA-PAC', label: 'Asia-Pacific (Tokyo / HK)', flag: '🌏', bureau: 'Tokyo, Taipei & Singapore' },
  { id: 'Middle East', shortLabel: 'MID-EAST', label: 'Middle East (Gulf Capital)', flag: '🌍', bureau: 'Dubai & Riyadh' },
  { id: 'Canada', shortLabel: 'CANADA', label: 'Canada (Bay St / TSX)', flag: '🇨🇦', bureau: 'Toronto & Montreal' },
  { id: 'Australia & NZ', shortLabel: 'AUSTRALIA', label: 'Australia & NZ (ASX)', flag: '🇦🇺', bureau: 'Sydney & Melbourne' },
  { id: 'Russia & Eurasia', shortLabel: 'EURASIA', label: 'Russia & Eurasia Corridors', flag: '🇷🇺', bureau: 'Eurasia Desks' }
];

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  region: Region;
  deck: string;
  content: string;
  keyTakeaways?: string[];
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  readTime: string;
  heroImage: string;
  imageCaption?: string;
  featured?: boolean;
  breaking?: boolean;
  tags: string[];
  views: number;
  bookmarks: number;
  userCreated?: boolean;
}

export interface MarketTicker {
  symbol: string;
  value: string;
  change: string;
  positive: boolean;
  sparkline: number[]; // Points for SVG mini chart
  high: string;
  low: string;
}

export interface SectorPerformance {
  name: string;
  ticker: string;
  change: string;
  positive: boolean;
  volume: string;
}

export interface Comment {
  id: string;
  author: string;
  affiliation: string;
  timeAgo: string;
  content: string;
  likes: number;
}

export type PageView = 
  | 'home' 
  | 'write' 
  | 'admin' 
  | 'article' 
  | 'about' 
  | 'contact' 
  | 'tools'
  | 'doc-tools'
  | 'legal'
  | 'privacy'
  | 'terms'
  | 'disclaimer'
  | 'editorial'
  | 'cookies'
  | 'corrections'
  | 'tool-bond'
  | 'tool-inflation'
  | 'tool-fx'
  | 'tool-compound'
  | 'tool-ai-power'
  | 'tool-repo-spread'
  | 'tool-water-cooling'
  | 'tool-forex-tariff'
  | 'tool-cloud-finops'
  | 'tool-iso20022'
  | 'tool-pdf'
  | 'tool-image';

export type LegalTab = 'terms' | 'privacy' | 'editorial' | 'cookies' | 'corrections' | 'financial-disclaimer';

export interface AdminUser {
  email: string;
  role: 'managing_editor' | 'bureau_chief' | 'editor';
  name: string;
  avatar?: string;
  authenticatedAt: string;
}

