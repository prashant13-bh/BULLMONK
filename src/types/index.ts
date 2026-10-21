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
  | 'Russia & Eurasia';

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
  | 'corrections';

export type LegalTab = 'terms' | 'privacy' | 'editorial' | 'cookies' | 'corrections' | 'financial-disclaimer';

export interface AdminUser {
  email: string;
  role: 'managing_editor' | 'bureau_chief' | 'editor';
  name: string;
  avatar?: string;
  authenticatedAt: string;
}

