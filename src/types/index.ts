// BULLMONK Type Definitions

export interface Author {
  name: string;
  title: string;
  avatar: string;
  location: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  deck: string;
  content: string;
  author: Author;
  publishedAt: string;
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
}

export interface Comment {
  id: string;
  author: string;
  affiliation: string;
  timeAgo: string;
  content: string;
}

export type PageView = 'home' | 'write' | 'article' | 'about' | 'contact' | 'legal';

export type LegalTab = 'terms' | 'privacy' | 'editorial' | 'cookies' | 'corrections';
