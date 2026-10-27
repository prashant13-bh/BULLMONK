import React, { useState } from 'react';
import { Article, Region } from '../types';
import { SECTOR_HEATMAP } from '../data/newsData';
import { AdBanner } from '../components/AdBanner';
import { TradingViewBanner } from '../components/TradingViewBanner';
import { 
  Search, Bookmark, Clock, Eye, Sparkles, TrendingUp, Cpu, Globe2, 
  Zap, BookOpen, Send, MapPin, Volume2, ShieldCheck, Activity, 
  Flame, ArrowUpRight, BarChart3, ChevronRight, ChevronLeft, ArrowLeft, Layers,
  Calculator, FileText, Scissors, LayoutGrid, List, Wrench, SlidersHorizontal, ArrowUpDown
} from 'lucide-react';

interface HomePageProps {
  articles: Article[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onSelectArticle: (article: Article) => void;
  onToggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  onStartAudioBriefing?: (article: Article) => void;
  showToast: (msg: string) => void;
  onNavigateToTools?: () => void;
  onNavigateToDocTools?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  articles,
  selectedCategory,
  setSelectedCategory,
  onSelectArticle,
  onToggleBookmark,
  isBookmarked,
  onStartAudioBriefing,
  showToast,
  onNavigateToTools,
  onNavigateToDocTools
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [wireFilter, setWireFilter] = useState<'all' | 'macro' | 'tech'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'blotter'>('grid');
  const [triageOnly, setTriageOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'quick'>('latest');
  const [selectedSubTag, setSelectedSubTag] = useState<string>('all');

  const isTriageArticle = (art: Article) => {
    return art.id.startsWith('bm-calc-') || 
           art.id.startsWith('bm-ev-') || 
           art.id.startsWith('bm-solar-') || 
           art.id.startsWith('bm-iot-') || 
           art.id.startsWith('bm-hvac-') || 
           art.content.includes('bluf-triage-card') || 
           art.title.toLowerCase().includes('calculator') || 
           art.title.toLowerCase().includes('triage') || 
           art.title.toLowerCase().includes('protocol');
  };

  const triageCount = articles.filter(isTriageArticle).length;

  const categories = [
    { id: 'all', label: 'All Desks', icon: <Sparkles size={13} /> },
    { id: 'Markets & Finance', label: 'Markets & Finance', icon: <TrendingUp size={13} /> },
    { id: 'Technology & AI', label: 'Tech & AI', icon: <Cpu size={13} /> },
    { id: 'World Affairs', label: 'Geopolitics', icon: <Globe2 size={13} /> },
    { id: 'Energy & Climate', label: 'Commodities & Energy', icon: <Flame size={13} /> },
    { id: 'Culture & Ideas', label: 'Strategy & Ideas', icon: <BookOpen size={13} /> }
  ];

  const CATEGORY_META: Record<string, { title: string; subtitle: string; icon: string; leadBureau: string; rpmPill: string }> = {
    'Technology & AI': {
      title: 'Technology & Applied Engineering Intelligence',
      subtitle: 'Surveillance across cloud FinOps, local AI quantization, wide-bandgap 1,200V semiconductors, and IoT mesh hardware diagnostics.',
      icon: '⚡',
      leadBureau: 'Silicon Valley, Zurich & Taipei Bureaus',
      rpmPill: 'Cloud FinOps & Edge Triage • High-Intent Tier-1 Engine'
    },
    'Markets & Finance': {
      title: 'Global Macro, Fixed Income & Fintech Architecture',
      subtitle: 'Sovereign bond yield telemetry, central bank liquidity rails, B2B interchange optimization, and gold bullion repatriation.',
      icon: '📈',
      leadBureau: 'New York, London & Zurich Bureaus',
      rpmPill: 'Fixed Income & Commercial Clearing • Institutional Sovereign Rails'
    },
    'Energy & Climate': {
      title: 'Energy Transition, Inverter Diagnostics & Critical Minerals',
      subtitle: 'Rooftop PV ground isolation triage, behind-the-meter nuclear PPAs, and $11,000/ton copper deficit modeling.',
      icon: '☀️',
      leadBureau: 'Denver, Santiago & London Bureaus',
      rpmPill: 'Renewable Power & Grid Reliability • High-eCPM Diagnostic Hub'
    },
    'World Affairs': {
      title: 'Geopolitical Risk, Trade Corridors & Sovereign Logistics',
      subtitle: 'Advanced 2nm packaging bottlenecks, bilateral settlement mechanisms, and strategic maritime chokepoints.',
      icon: '🌐',
      leadBureau: 'Washington, Taipei & Singapore Bureaus',
      rpmPill: 'Silicon Diplomacy & Sovereign Corridors • Geopolitical Intel'
    },
    'Culture & Ideas': {
      title: 'Enterprise Systems, Regulatory Filings & Industrial Standards',
      subtitle: 'Windows Server SMBv2 database lockup recovery, corporate governance, and international standard protocols.',
      icon: '🏛️',
      leadBureau: 'Detroit, London & New York Bureaus',
      rpmPill: 'Enterprise IT & Practical Triage • Applied Problem Solving'
    }
  };

  const CATEGORY_SUBTAGS: Record<string, { id: string; label: string }[]> = {
    'Technology & AI': [
      { id: 'all', label: 'All Tech & AI' },
      { id: 'finops', label: 'Cloud FinOps' },
      { id: 'vram', label: 'Local AI & VRAM' },
      { id: 'nacs', label: 'EV & NACS Hardware' },
      { id: 'matter', label: 'Matter & IoT Mesh' },
      { id: 'semiconductor', label: 'Chips & GaN' },
      { id: 'sump', label: 'Appliance Triage' }
    ],
    'Markets & Finance': [
      { id: 'all', label: 'All Financial Topics' },
      { id: 'sovereign', label: 'Sovereign Debt' },
      { id: 'interchange', label: 'B2B Interchange' },
      { id: 'gold', label: 'Gold Bullion' },
      { id: 'carry', label: 'Yen Carry Unwind' },
      { id: 'erlang', label: 'Fintech Telecom Sizing' }
    ],
    'Energy & Climate': [
      { id: 'all', label: 'All Energy Topics' },
      { id: 'solar', label: 'Solar & Inverter RISO' },
      { id: 'nuclear', label: 'Nuclear Baseload' },
      { id: 'copper', label: 'Copper Deficit' },
      { id: 'lithium', label: 'Battery Metals' }
    ],
    'World Affairs': [
      { id: 'all', label: 'All Geopolitics' },
      { id: 'semiconductor', label: 'Silicon Diplomacy' },
      { id: 'corridor', label: 'Trade Corridors' },
      { id: 'sovereign', label: 'Sovereign Reserves' }
    ],
    'Culture & Ideas': [
      { id: 'all', label: 'All Business & Strategy' },
      { id: 'quickbooks', label: 'SMB IT & Database' },
      { id: 'standards', label: 'Regulatory Filings' }
    ]
  };

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    setSelectedSubTag('all');
  };

  const getCategoryCount = (id: string) => {
    if (id === 'all') return articles.length;
    return articles.filter(a => a.category.toLowerCase().includes(id.toLowerCase())).length;
  };

  const regions: { id: string; label: string; flag: string }[] = [
    { id: 'all', label: 'Global Macro', flag: '🌐' },
    { id: 'United States', label: 'USA (Wall St)', flag: '🇺🇸' },
    { id: 'Europe', label: 'Europe (ECB)', flag: '🇪🇺' },
    { id: 'India', label: 'India (Dalal St)', flag: '🇮🇳' },
    { id: 'Canada', label: 'Canada (Bay St)', flag: '🇨🇦' },
    { id: 'Australia & NZ', label: 'Australia & NZ', flag: '🇦🇺' },
    { id: 'Russia & Eurasia', label: 'Russia & Eurasia', flag: '🇷🇺' }
  ];

  // Filtering by category, region, search query, triage mode, and sub-tags
  const filteredArticles = articles.filter(art => {
    const matchCat = selectedCategory === 'all' || art.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchRegion = selectedRegion === 'all' || art.region === selectedRegion;
    const query = searchQuery.trim().toLowerCase();
    const matchQuery = !query ||
      art.title.toLowerCase().includes(query) ||
      (art.deck && art.deck.toLowerCase().includes(query)) ||
      art.category.toLowerCase().includes(query) ||
      (art.region && art.region.toLowerCase().includes(query)) ||
      art.author.name.toLowerCase().includes(query) ||
      art.tags.some(t => t.toLowerCase().includes(query));
    
    const matchSubTag = selectedSubTag === 'all' ||
      art.tags.some(t => t.toLowerCase().includes(selectedSubTag.toLowerCase())) ||
      art.title.toLowerCase().includes(selectedSubTag.toLowerCase()) ||
      (art.deck && art.deck.toLowerCase().includes(selectedSubTag.toLowerCase()));

    return matchCat && matchRegion && matchQuery && matchSubTag;
  });

  // Sort and apply Triage filter for the main feed
  let processedArticles = [...filteredArticles];
  if (triageOnly) {
    processedArticles = processedArticles.filter(isTriageArticle);
  }
  if (sortBy === 'popular') {
    processedArticles.sort((a, b) => b.views - a.views);
  } else if (sortBy === 'quick') {
    processedArticles.sort((a, b) => parseInt(a.readTime) - parseInt(b.readTime));
  } else {
    processedArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  // Curated Category Showcases (Displayed when browsing All Desks)
  const isAllDesksActive = selectedCategory === 'all' && !searchQuery.trim() && !triageOnly && selectedRegion === 'all';

  // Showcase 1: Tech & AI
  const showcaseTech = articles.filter(a => a.category === 'Technology & AI' || isTriageArticle(a));
  const leadTech = showcaseTech.find(a => a.id === 'bm-calc-036') || showcaseTech[0];
  const sideTech = showcaseTech.filter(a => a.id !== leadTech?.id && (a.id === 'bm-calc-037' || a.id === 'bm-ev-041' || a.id === 'bm-iot-043')).slice(0, 3);

  // Showcase 2: Markets & Sovereign Finance
  const showcaseMacro = articles.filter(a => a.category === 'Markets & Finance');
  const leadMacro = showcaseMacro.find(a => a.id === 'bm-usa-001') || showcaseMacro[0];
  const sideMacro = showcaseMacro.filter(a => a.id !== leadMacro?.id && (a.id === 'bm-calc-039' || a.id === 'bm-gold-020' || a.id === 'bm-calc-038')).slice(0, 3);

  // Showcase 3: Renewable Energy & Grid Reliability
  const showcaseEnergy = articles.filter(a => a.category === 'Energy & Climate' || a.id === 'bm-solar-046' || a.id === 'bm-nuc-018' || a.id === 'bm-cop-023' || a.id === 'bm-lith-032');
  const leadEnergy = showcaseEnergy.find(a => a.id === 'bm-solar-046') || showcaseEnergy[0];
  const sideEnergy = showcaseEnergy.filter(a => a.id !== leadEnergy?.id).slice(0, 3);

  // Showcase 4: Enterprise Systems, IT Triage & Practical Engineering
  const showcaseBusiness = articles.filter(a => a.id === 'bm-calc-040' || a.id === 'bm-hvac-050' || a.id === 'bm-semi-039' || a.category === 'Culture & Ideas');
  const leadBusiness = showcaseBusiness.find(a => a.id === 'bm-calc-040') || showcaseBusiness[0];
  const sideBusiness = showcaseBusiness.filter(a => a.id !== leadBusiness?.id).slice(0, 3);

  const leadArticle = filteredArticles.find(a => a.featured) || filteredArticles[0] || articles[0];
  
  // Secondary in-depth bureau investigations in center column (eliminates dead white space)
  const centerFeaturedArticles = articles
    .filter(a => a.id !== leadArticle?.id)
    .slice(0, 2);

  // Wire dispatches (fast feed in left column)
  const wireArticles = articles.filter(a => {
    if (a.id === leadArticle?.id) return false;
    if (centerFeaturedArticles.some(c => c.id === a.id)) return false;
    if (wireFilter === 'macro') return a.category === 'Markets & Finance';
    if (wireFilter === 'tech') return a.category === 'Technology & AI';
    return true;
  }).slice(0, 5);

  // Leaderboard / Most Read (right column)
  const mostReadArticles = [...articles]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const handleSectorClick = (sec: typeof SECTOR_HEATMAP[0]) => {
    if (sec.ticker === 'SOXX') {
      setSelectedCategory('Technology & AI');
      showToast(`Sector Intelligence: ${sec.name} (${sec.ticker} ${sec.change})`);
    } else if (sec.ticker === 'XLF' || sec.ticker === 'TLT') {
      setSelectedCategory('Markets & Finance');
      showToast(`Sector Intelligence: ${sec.name} (${sec.ticker} ${sec.change})`);
    } else if (sec.ticker === 'ICLN' || sec.ticker === 'LIT' || sec.ticker === 'XLE') {
      setSelectedCategory('Energy & Climate');
      showToast(`Sector Intelligence: ${sec.name} (${sec.ticker} ${sec.change})`);
    } else {
      showToast(`Sector Flow: ${sec.ticker} ${sec.change} (Vol: ${sec.volume})`);
    }

    const target = document.getElementById('intel-feed-anchor');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const heroSrc = leadArticle ? leadArticle.heroImage : "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=65&fm=webp";
  const hero600 = heroSrc.includes('w=') ? heroSrc.replace(/w=\d+/, 'w=600') : heroSrc;
  const hero800 = heroSrc.includes('w=') ? heroSrc.replace(/w=\d+/, 'w=800') : heroSrc;



  return (
    <main>
      {/* Semantic H1 for 100% SEO & Screen Reader Accessibility */}
      <h1 className="sr-only">BULLMONK | Global News, Macroeconomic Forensics & Sovereign Financial Journal</h1>

      {/* 1. Regional Bureau Fast Navigation Bar */}
      <section className="regional-desks-bar">
        <div className="container">
          <div className="regional-desks-inner">
            <span className="regional-desks-label">
              <MapPin size={12} /> GLOBAL BUREAUS:
            </span>
            <div className="regional-buttons-track">
              {regions.map((reg) => {
                const count = reg.id === 'all' 
                  ? articles.length 
                  : articles.filter(a => a.region === reg.id).length;
                const isActive = selectedRegion === reg.id;
                return (
                  <button
                    key={reg.id}
                    onClick={() => setSelectedRegion(reg.id)}
                    className={`regional-pill-btn ${isActive ? 'active' : ''}`}
                    title={`Filter by ${reg.label}`}
                  >
                    <span className="regional-pill-flag">{reg.flag}</span>
                    <span className="regional-pill-name">{reg.label}</span>
                    <span className="regional-pill-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Bloomberg-Caliber 3-Column Hero Centerpiece */}
      <section className="hero-dispatch-section">
        <div className="container">
          <div className="bloomberg-three-col-grid">
            
            {/* COLUMN 1: 24/7 THE WIRE (FAST NEWS TIMELINE) */}
            <aside className="wire-feed-column">
              <div className="wire-feed-header">
                <div className="wire-feed-title-wrap">
                  <span className="live-pulse-dot"></span>
                  <h2 className="wire-feed-title">THE WIRE (24/7)</h2>
                </div>
                <span className="wire-feed-tag">REAL-TIME</span>
              </div>

              {/* Wire Filter Tabs */}
              <div className="wire-filter-tabs">
                <button 
                  className={`wire-tab-btn ${wireFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setWireFilter('all')}
                >
                  All Intel
                </button>
                <button 
                  className={`wire-tab-btn ${wireFilter === 'macro' ? 'active' : ''}`}
                  onClick={() => setWireFilter('macro')}
                >
                  Macro
                </button>
                <button 
                  className={`wire-tab-btn ${wireFilter === 'tech' ? 'active' : ''}`}
                  onClick={() => setWireFilter('tech')}
                >
                  Chips & AI
                </button>
              </div>

              {/* Timeline Items */}
              <div className="wire-items-list">
                {wireArticles.map((item, idx) => (
                  <div 
                    key={item.id} 
                    className="wire-dispatch-card"
                    title={item.title}
                    onClick={() => onSelectArticle(item)}
                  >
                    <div className="wire-card-meta">
                      <span className="wire-time-badge">
                        {idx === 0 ? '4m ago' : (idx === 1 ? '18m ago' : (idx === 2 ? '42m ago' : '1h ago'))}
                      </span>
                      <span className="wire-desk-badge">
                        {item.region} • {item.category}
                      </span>
                    </div>

                    <h3 className="wire-card-title">{item.title}</h3>

                    <p className="wire-card-snippet">
                      {item.deck || item.content.replace(/<[^>]*>?/gm, '').slice(0, 80) + '...'}
                    </p>

                    <div className="wire-card-footer">
                      <span className="wire-author-byline">By {item.author.name}</span>
                      <span className="wire-read-estimate">{item.readTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            {/* COLUMN 2: CENTER INVESTIGATIVE CORE */}
            <div className="hero-center-column">
              {leadArticle && (
                <article 
                  className="grand-hero-card"
                  title={leadArticle.title}
                  onClick={() => onSelectArticle(leadArticle)}
                >
                  <div className="grand-hero-media">
                    <img 
                      src={hero600} 
                      srcSet={`${hero600} 600w, ${hero800} 800w`}
                      sizes="(max-width: 768px) 100vw, 800px"
                      alt={leadArticle.title} 
                      className="grand-hero-img" 
                      width={800}
                      height={450}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                    />
                    <div className="grand-hero-overlay">
                      <div className="grand-hero-top-meta">
                        <div className="grand-hero-badge-overlay">
                          <span className="badge badge-breaking">
                            <span className="ticker-pulse"></span> EXCLUSIVE INVESTIGATION
                          </span>
                          <span className="badge badge-category">{leadArticle.category}</span>
                          <span className="badge badge-desk">{leadArticle.region}</span>
                        </div>
                      </div>

                      <div className="grand-hero-overlay-body">
                        <div className="grand-hero-eyebrow">
                          <span>{leadArticle.author.location.toUpperCase()} BUREAU</span>
                          <span>•</span>
                          <span>VERIFIED STRATEGIC INTELLIGENCE</span>
                        </div>

                        <h2 className="grand-hero-title">{leadArticle.title}</h2>
                        <p className="grand-hero-deck">{leadArticle.deck}</p>

                        {/* Author Byline & Metrics directly in overlay */}
                        <div className="grand-hero-author-row overlay-author-row">
                          <div className="grand-hero-author-info">
                            <img 
                              src={leadArticle.author.avatar} 
                              alt={leadArticle.author.name} 
                              className="author-avatar-img"
                              width={36}
                              height={36}
                              loading="lazy"
                              decoding="async"
                            />
                            <div>
                              <div className="author-name-with-seal">
                                <span style={{ color: '#FFFFFF' }}>{leadArticle.author.name}</span>
                                <span className="contributor-seal" title="Verified BullMonk Institutional Fellow">✓ Verified</span>
                              </div>
                              <div className="author-role-sub" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
                                {leadArticle.author.title} • {leadArticle.author.location}
                              </div>
                            </div>
                          </div>

                          <div className="grand-hero-action-tools">
                            <span className="hero-metric-item" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                              <Clock size={13} /> {leadArticle.readTime}
                            </span>
                            <span className="hero-metric-item hide-on-mobile" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                              <Eye size={13} /> {leadArticle.views.toLocaleString()}
                            </span>
                            <button 
                              type="button"
                              className={`btn-icon ${isBookmarked(leadArticle.id) ? 'active-bookmark' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleBookmark(leadArticle.id);
                              }}
                              title="Bookmark to Private Dossier"
                              aria-label="Bookmark Grand Hero Article"
                              style={{ 
                                background: 'rgba(255, 255, 255, 0.15)', 
                                borderColor: 'rgba(255, 255, 255, 0.25)', 
                                color: '#FFFFFF' 
                              }}
                            >
                              <Bookmark size={15} fill={isBookmarked(leadArticle.id) ? 'currentColor' : 'none'} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grand-hero-content">
                    {/* Audio Briefing Pill */}
                    <div className="grand-hero-audio-bar" onClick={(e) => {
                      e.stopPropagation();
                      if (onStartAudioBriefing) onStartAudioBriefing(leadArticle);
                    }}>
                      <button 
                        type="button" 
                        className="audio-pill-btn" 
                        title="Listen to 3-Min Executive Audio Briefing"
                        aria-label="Listen to 3-Min Executive Audio Briefing"
                        style={{ width: '100%', justifyContent: 'space-between' }}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <Volume2 size={15} />
                          <span>Listen to Executive Audio Dispatch ({leadArticle.readTime})</span>
                        </span>
                        <div className="audio-mini-visualizer">
                          <span></span><span></span><span></span><span></span>
                        </div>
                      </button>
                    </div>

                    {/* Key Intelligence Takeaways Box */}
                    {leadArticle.keyTakeaways && leadArticle.keyTakeaways.length > 0 && (
                      <div className="hero-takeaways-box" onClick={(e) => e.stopPropagation()}>
                        <div className="takeaways-header">
                          <ShieldCheck size={14} color="var(--accent-gold)" />
                          <span>INSTITUTIONAL CORE THESIS & DATA</span>
                        </div>
                        <ul className="takeaways-list">
                          {leadArticle.keyTakeaways.map((point, i) => (
                            <li key={i}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </article>
              )}

              {/* Secondary In-Depth Bureau Investigations (Eliminates dead white space) */}
              {centerFeaturedArticles.length > 0 && (
                <div className="center-featured-subgrid">
                  <div className="center-subgrid-header">
                    <span className="subgrid-header-label">
                      <TrendingUp size={13} color="var(--accent-gold)" />
                      <span>EXECUTIVE FIELD DISPATCHES &amp; DOSSIERS</span>
                    </span>
                    <span className="subgrid-header-count">VERIFIED INTELLIGENCE</span>
                  </div>

                  <div className="center-subgrid-cards">
                    {centerFeaturedArticles.map((art) => (
                      <article 
                        key={art.id}
                        className="center-subcard"
                        title={art.title}
                        onClick={() => onSelectArticle(art)}
                      >
                        <div className="center-subcard-media">
                          <img 
                            src={art.heroImage} 
                            alt={art.title}
                            className="center-subcard-img"
                            loading="lazy"
                            decoding="async"
                            width={320}
                            height={145}
                          />
                          <span className={`badge ${art.breaking ? 'badge-breaking' : 'badge-category'}`}>
                            {art.category}
                          </span>
                        </div>

                        <div className="center-subcard-body">
                          <div className="center-subcard-meta">
                            <span>{art.region}</span>
                            <span>•</span>
                            <span>{art.readTime}</span>
                          </div>

                          <h3 className="center-subcard-title">
                            {art.title}
                          </h3>

                          <p className="center-subcard-deck">
                            {art.deck}
                          </p>

                          <div className="center-subcard-footer">
                            <span>By {art.author.name}</span>
                            <button
                              type="button"
                              className={`btn-icon ${isBookmarked(art.id) ? 'active-bookmark' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleBookmark(art.id);
                              }}
                              title="Bookmark"
                              style={{ width: '28px', height: '28px', padding: 0 }}
                            >
                              <Bookmark size={13} fill={isBookmarked(art.id) ? 'currentColor' : 'none'} />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* COLUMN 3: MARKET BAROMETER & MOST READ LEADERBOARD */}
            <aside className="market-leaderboard-column">
              
              {/* Sector Heatmap Barometer */}
              <div className="sector-heatmap-widget">
                <div className="widget-header">
                  <h2 className="widget-title">
                    <BarChart3 size={15} color="var(--accent-gold)" />
                    <span>SECTOR BAROMETER</span>
                  </h2>
                  <span className="widget-subtitle">GLOBAL FLOWS</span>
                </div>

                <div className="sector-heatmap-grid">
                  {SECTOR_HEATMAP.map((sec, idx) => (
                    <div 
                      key={idx} 
                      className={`sector-tile ${sec.positive ? 'positive' : 'negative'}`}
                      onClick={() => handleSectorClick(sec)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSectorClick(sec); }}
                      title={`Click to analyze ${sec.name}: ${sec.change} (Volume: ${sec.volume})`}
                      aria-label={`${sec.name} ${sec.ticker} ${sec.change}`}
                    >
                      <div className="sector-tile-top">
                        <span className="sector-ticker">{sec.ticker}</span>
                        <span className="sector-change">
                          <span className="sector-change-arrow" aria-hidden="true">{sec.positive ? '▲' : '▼'}</span>
                          <span>{sec.change}</span>
                        </span>
                      </div>
                      <div className="sector-name">{sec.name}</div>
                      <div className="sector-vol-row">
                        <span className="sector-vol">Vol: {sec.volume}</span>
                        <span className="sector-action-link" aria-hidden="true">Intel →</span>
                      </div>
                      <div className="sector-momentum-track" aria-hidden="true">
                        <div 
                          className="sector-momentum-fill"
                          style={{ 
                            width: `${Math.min(100, Math.max(30, parseFloat(sec.change.replace(/[^0-9.]/g, '')) * 26))}%` 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ranked Leaderboard: Most Read by Allocators */}
              <div className="leaderboard-widget">
                <div className="widget-header">
                  <h2 className="widget-title">
                    <Activity size={15} color="var(--accent-gold)" />
                    <span>MOST READ BY ALLOCATORS</span>
                  </h2>
                  <span className="widget-subtitle">TOP 5</span>
                </div>

                <div className="leaderboard-list">
                  {mostReadArticles.map((item, idx) => (
                    <div 
                      key={item.id} 
                      className="leaderboard-item"
                      onClick={() => onSelectArticle(item)}
                    >
                      <div className="leaderboard-rank">0{idx + 1}</div>
                      <div className="leaderboard-info">
                        <span className="leaderboard-region-tag">
                          {item.region} • {item.category}
                        </span>
                        <h3 className="leaderboard-item-title">{item.title}</h3>
                        <div className="leaderboard-sub-meta">
                          <span>{item.author.name}</span>
                          <span>•</span>
                          <span>{item.readTime}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Institutional Research Report Card */}
              <div className="research-sponsor-card">
                <span className="sponsor-kicker">INSTITUTIONAL DOSSIER</span>
                <h3 className="sponsor-headline">Global Sovereign Liquidity & Gold Re-Anchoring 2026-2027</h3>
                <p className="sponsor-text">Comprehensive 84-page surveillance report compiled across Tokyo, London, and New York research desks.</p>
                <button 
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => showToast('Institutional Dossier downloaded: 84-page PDF')}
                >
                  Download Executive Briefing (PDF)
                </button>
              </div>

              {/* Inside the BULLMONK Bureau Showcase */}
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                margin: '1.25rem 0'
              }}>
                <img 
                  src="/images/bullmonk_global_newsroom.webp" 
                  alt="Inside the BULLMONK Intelligence Newsroom Floor"
                  style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
                  loading="lazy"
                />
                <div style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.35rem' }}>
                    <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent-red)' }}></span>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)', fontWeight: 700, letterSpacing: '0.06em' }}>
                      GLOBAL WIRE SURVEILLANCE
                    </span>
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '0.96rem', margin: '0 0 0.4rem', lineHeight: 1.35, color: 'var(--text-primary)' }}>
                    Inside the Central Newsroom & Trading Desks
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
                    Our international bureau desks operate around the clock across Zurich, London, New York, Tokyo, and Bengaluru.
                  </p>
                </div>
              </div>

              {/* Official Financial Charting Partner: TradingView */}
              <TradingViewBanner variant="compact" />

              {/* Google Reader Revenue Manager: Official Inline CTA */}
              <div 
                {...{ 'rrm-inline-cta': '6431d91b-b87a-445f-86a2-b9b9d1608b0b' }} 
                className="rrm-inline-cta-container"
                style={{ margin: '1.5rem 0', minHeight: '60px' }}
              />

            </aside>

          </div>
        </div>
      </section>

      {/* 4. Controls: Category Desk Tabs & Live Search Bar */}
      <section id="intel-feed-anchor" className="container" style={{ marginTop: '2rem' }}>
        <div className="filter-bar">
          <div className="category-tabs" role="tablist">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={selectedCategory === cat.id}
                className={`cat-tab ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => handleCategorySelect(cat.id)}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  {cat.icon}
                  {cat.label}
                  <span style={{
                    fontSize: '0.64rem',
                    fontWeight: 800,
                    padding: '1px 6px',
                    borderRadius: '10px',
                    background: selectedCategory === cat.id ? 'var(--accent-gold)' : 'var(--bg-surface-subtle)',
                    color: selectedCategory === cat.id ? '#FFFFFF' : 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {getCategoryCount(cat.id)}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <form 
            role="search"
            onSubmit={(e) => e.preventDefault()}
            toolname="search_dispatches"
            tooldescription="Search BullMonk global macroeconomic, semiconductor diplomacy, and sovereign bond intelligence dispatches"
            data-webmcp-tool="search_dispatches"
            data-webmcp-description="Search BullMonk global macroeconomic, semiconductor diplomacy, and sovereign bond intelligence dispatches"
            className="search-input-wrap"
          >
            <Search size={15} className="search-icon" aria-hidden="true" />
            <label htmlFor="homepage-filter-input" className="sr-only">Filter dispatches by keyword or author</label>
            <input 
              id="homepage-filter-input"
              type="search"
              name="query"
              toolparam="query"
              toolparamdescription="Search keyword, commodity, ticker, or author"
              data-webmcp-input="query"
              data-webmcp-description="Search keyword, commodity, ticker, or author"
              className="search-field"
              placeholder="Filter by keyword, commodity, ticker, author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      </section>

      {/* DEDICATED CATEGORY DESK MASTHEAD (Rendered when a specific category is active) */}
      {selectedCategory !== 'all' && CATEGORY_META[selectedCategory] && (
        <section className="container">
          <div className="category-desk-hero">
            <div className="category-desk-hero-top">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                <span className="category-desk-badge-pill">
                  <span>{CATEGORY_META[selectedCategory].icon}</span>
                  <span>{selectedCategory} INTELLIGENCE DESK</span>
                </span>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: 'var(--accent-gold)',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {CATEGORY_META[selectedCategory].rpmPill}
                </span>
              </div>
              <button 
                type="button" 
                className="desk-back-btn"
                onClick={() => handleCategorySelect('all')}
              >
                <ArrowLeft size={13} />
                <span>← All Desks Master Dashboard</span>
              </button>
            </div>

            <h2 className="category-desk-title">
              {CATEGORY_META[selectedCategory].title}
            </h2>
            <p className="category-desk-desc">
              {CATEGORY_META[selectedCategory].subtitle}
            </p>

            <div className="category-desk-telemetry-row">
              <div className="desk-telemetry-item">
                <span className="text-muted">Total Bureau Dispatches:</span>
                <span className="desk-telemetry-val">{getCategoryCount(selectedCategory)} Verified Records</span>
              </div>
              <div className="desk-telemetry-item">
                <span className="text-muted">Avg Institutional Dwell:</span>
                <span className="desk-telemetry-val">8.4 Min / Deep Read</span>
              </div>
              <div className="desk-telemetry-item">
                <span className="text-muted">Active Correspondent Hubs:</span>
                <span className="desk-telemetry-val">{CATEGORY_META[selectedCategory].leadBureau}</span>
              </div>
            </div>

            {/* Sub-Topic Interactive Tags Rail */}
            {CATEGORY_SUBTAGS[selectedCategory] && (
              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Filter Desk Specializations:
                </div>
                <div className="desk-subtags-rail" role="tablist" aria-label="Desk sub-topic specializations">
                  {CATEGORY_SUBTAGS[selectedCategory].map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      className={`subtag-pill ${selectedSubTag === sub.id ? 'active' : ''}`}
                      onClick={() => setSelectedSubTag(sub.id)}
                    >
                      <span>{sub.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CURATED CATEGORY SHOWCASES (Rendered when viewing All Desks with no search query) */}
      {isAllDesksActive && (
        <section className="container">
          {/* Showcase 1: Cloud FinOps, Local AI & Hardware Triage */}
          <div className="category-showcase-section">
            <div className="category-showcase-header">
              <div>
                <div className="showcase-eyebrow">
                  <Cpu size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                  B2B CLOUD FINOPS &amp; EDGE HARDWARE TRIAGE • $15–$45 RPM TIER-1 ENGINE
                </div>
                <h2 className="showcase-masthead-title">
                  Cloud Infrastructure, Local AI Sizing &amp; Hardware Triage
                </h2>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button 
                  type="button"
                  className="showcase-action-btn"
                  onClick={() => handleCategorySelect('Technology & AI')}
                >
                  <span>Explore Tech Desk ({getCategoryCount('Technology & AI')}) →</span>
                </button>
                {onNavigateToTools && (
                  <button 
                    type="button"
                    className="showcase-action-btn"
                    onClick={onNavigateToTools}
                  >
                    <Calculator size={14} />
                    <span>Launch Sizing Tools →</span>
                  </button>
                )}
              </div>
            </div>

            <div className="showcase-grid-layout">
              {leadTech && (
                <article 
                  className="showcase-lead-card"
                  onClick={() => onSelectArticle(leadTech)}
                >
                  <div className="showcase-lead-img-box">
                    <img 
                      src={leadTech.heroImage} 
                      alt={leadTech.title} 
                      className="showcase-lead-img"
                      loading="lazy"
                      width={560}
                      height={280}
                    />
                    <div className="card-badge-container">
                      <span className="badge badge-breaking">FEATURED TRIAGE</span>
                      <span className="badge badge-category">{leadTech.category}</span>
                    </div>
                    {isTriageArticle(leadTech) && (
                      <span className="card-bluf-indicator">🛠️ BLUF Triage Scorecard</span>
                    )}
                  </div>
                  <div className="showcase-lead-body">
                    <div className="card-date-row">
                      <span>{leadTech.author.location}</span>
                      <span>{leadTech.readTime}</span>
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.35rem' }}>{leadTech.title}</h3>
                    <p className="card-deck">{leadTech.deck}</p>
                    <div className="card-footer">
                      <div className="card-author-group">
                        <img 
                          src={leadTech.author.avatar} 
                          alt={leadTech.author.name} 
                          className="card-author-avatar" 
                          width={24}
                          height={24}
                          loading="lazy"
                        />
                        <span className="card-author-name">{leadTech.author.name}</span>
                      </div>
                      <span className="card-read-time">
                        <Eye size={12} /> {leadTech.views.toLocaleString()} reads
                      </span>
                    </div>
                  </div>
                </article>
              )}

              <div className="showcase-subcards-stack">
                {sideTech.map((art) => (
                  <article 
                    key={art.id}
                    className="showcase-subcard-item"
                    onClick={() => onSelectArticle(art)}
                  >
                    <div className="showcase-subcard-img-box">
                      <img 
                        src={art.heroImage} 
                        alt={art.title} 
                        className="showcase-subcard-img" 
                        loading="lazy"
                        width={140}
                        height={105}
                      />
                    </div>
                    <div className="showcase-subcard-body">
                      <div className="card-date-row" style={{ fontSize: '0.68rem', marginBottom: '0.2rem' }}>
                        <span>{art.region}</span>
                        <span>{art.readTime}</span>
                      </div>
                      <h4 className="showcase-subcard-title">{art.title}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        <span>By {art.author.name}</span>
                        {isTriageArticle(art) && (
                          <span style={{ color: 'var(--accent-gold)', fontWeight: 700, fontSize: '0.68rem' }}>BLUF Tool</span>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          {/* High-Impact In-Feed Ad Banner Between Editorial Hubs */}
          <AdBanner slotType="in-article" slotId="mid-hub-ad-1" />

          {/* Showcase 2: Central Banking, Sovereign Debt & Liquidity Corridors */}
          <div className="category-showcase-section">
            <div className="category-showcase-header">
              <div>
                <div className="showcase-eyebrow">
                  <TrendingUp size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                  GLOBAL FIXED INCOME &amp; SOVEREIGN CLEARING RAILS
                </div>
                <h2 className="showcase-masthead-title">
                  Sovereign Bond Yields, Carry Trades &amp; Interbank Clearing
                </h2>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button 
                  type="button"
                  className="showcase-action-btn"
                  onClick={() => handleCategorySelect('Markets & Finance')}
                >
                  <span>Explore Macro Desk ({getCategoryCount('Markets & Finance')}) →</span>
                </button>
                {onNavigateToTools && (
                  <button 
                    type="button"
                    className="showcase-action-btn"
                    onClick={onNavigateToTools}
                  >
                    <TrendingUp size={14} />
                    <span>Sovereign Yield Spread Engine →</span>
                  </button>
                )}
              </div>
            </div>

            <div className="showcase-grid-layout">
              {leadMacro && (
                <article 
                  className="showcase-lead-card"
                  onClick={() => onSelectArticle(leadMacro)}
                >
                  <div className="showcase-lead-img-box">
                    <img 
                      src={leadMacro.heroImage} 
                      alt={leadMacro.title} 
                      className="showcase-lead-img"
                      loading="lazy"
                      width={560}
                      height={280}
                    />
                    <div className="card-badge-container">
                      <span className="badge badge-breaking">MACRO INVESTIGATION</span>
                      <span className="badge badge-desk">{leadMacro.region}</span>
                    </div>
                  </div>
                  <div className="showcase-lead-body">
                    <div className="card-date-row">
                      <span>{leadMacro.author.location}</span>
                      <span>{leadMacro.readTime}</span>
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.35rem' }}>{leadMacro.title}</h3>
                    <p className="card-deck">{leadMacro.deck}</p>
                    <div className="card-footer">
                      <div className="card-author-group">
                        <img 
                          src={leadMacro.author.avatar} 
                          alt={leadMacro.author.name} 
                          className="card-author-avatar" 
                          width={24}
                          height={24}
                          loading="lazy"
                        />
                        <span className="card-author-name">{leadMacro.author.name}</span>
                      </div>
                      <span className="card-read-time">
                        <Eye size={12} /> {leadMacro.views.toLocaleString()} reads
                      </span>
                    </div>
                  </div>
                </article>
              )}

              <div className="showcase-subcards-stack">
                {sideMacro.map((art) => (
                  <article 
                    key={art.id}
                    className="showcase-subcard-item"
                    onClick={() => onSelectArticle(art)}
                  >
                    <div className="showcase-subcard-img-box">
                      <img 
                        src={art.heroImage} 
                        alt={art.title} 
                        className="showcase-subcard-img" 
                        loading="lazy"
                        width={140}
                        height={105}
                      />
                    </div>
                    <div className="showcase-subcard-body">
                      <div className="card-date-row" style={{ fontSize: '0.68rem', marginBottom: '0.2rem' }}>
                        <span>{art.region}</span>
                        <span>{art.readTime}</span>
                      </div>
                      <h4 className="showcase-subcard-title">{art.title}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        <span>By {art.author.name}</span>
                        {isTriageArticle(art) && (
                          <span style={{ color: 'var(--accent-gold)', fontWeight: 700, fontSize: '0.68rem' }}>BLUF Tool</span>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          {/* High-Impact In-Feed Ad Banner Between Editorial Hubs */}
          <AdBanner slotType="in-article" slotId="mid-hub-ad-2" />

          {/* Showcase 3: Renewable Energy & Grid Reliability */}
          <div className="category-showcase-section">
            <div className="category-showcase-header">
              <div>
                <div className="showcase-eyebrow">
                  <Flame size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                  ENERGY TRANSITION, INVERTER DIAGNOSTICS &amp; GRID BASELOAD
                </div>
                <h2 className="showcase-masthead-title">
                  Renewable Power, Solar Inverter RISO &amp; Critical Minerals
                </h2>
              </div>
              <button 
                type="button"
                className="showcase-action-btn"
                onClick={() => handleCategorySelect('Energy & Climate')}
              >
                <span>Explore Energy Desk ({getCategoryCount('Energy & Climate')}) →</span>
              </button>
            </div>

            <div className="showcase-grid-layout">
              {leadEnergy && (
                <article 
                  className="showcase-lead-card"
                  onClick={() => onSelectArticle(leadEnergy)}
                >
                  <div className="showcase-lead-img-box">
                    <img 
                      src={leadEnergy.heroImage} 
                      alt={leadEnergy.title} 
                      className="showcase-lead-img"
                      loading="lazy"
                      width={560}
                      height={280}
                    />
                    <div className="card-badge-container">
                      <span className="badge badge-breaking">ENERGY TRIAGE</span>
                      <span className="badge badge-category">{leadEnergy.category}</span>
                    </div>
                    {isTriageArticle(leadEnergy) && (
                      <span className="card-bluf-indicator">🛠️ BLUF Triage Scorecard</span>
                    )}
                  </div>
                  <div className="showcase-lead-body">
                    <div className="card-date-row">
                      <span>{leadEnergy.author.location}</span>
                      <span>{leadEnergy.readTime}</span>
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.35rem' }}>{leadEnergy.title}</h3>
                    <p className="card-deck">{leadEnergy.deck}</p>
                    <div className="card-footer">
                      <div className="card-author-group">
                        <img 
                          src={leadEnergy.author.avatar} 
                          alt={leadEnergy.author.name} 
                          className="card-author-avatar" 
                          width={24}
                          height={24}
                          loading="lazy"
                        />
                        <span className="card-author-name">{leadEnergy.author.name}</span>
                      </div>
                      <span className="card-read-time">
                        <Eye size={12} /> {leadEnergy.views.toLocaleString()} reads
                      </span>
                    </div>
                  </div>
                </article>
              )}

              <div className="showcase-subcards-stack">
                {sideEnergy.map((art) => (
                  <article 
                    key={art.id}
                    className="showcase-subcard-item"
                    onClick={() => onSelectArticle(art)}
                  >
                    <div className="showcase-subcard-img-box">
                      <img 
                        src={art.heroImage} 
                        alt={art.title} 
                        className="showcase-subcard-img" 
                        loading="lazy"
                        width={140}
                        height={105}
                      />
                    </div>
                    <div className="showcase-subcard-body">
                      <div className="card-date-row" style={{ fontSize: '0.68rem', marginBottom: '0.2rem' }}>
                        <span>{art.region}</span>
                        <span>{art.readTime}</span>
                      </div>
                      <h4 className="showcase-subcard-title">{art.title}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        <span>By {art.author.name}</span>
                        {isTriageArticle(art) && (
                          <span style={{ color: 'var(--accent-gold)', fontWeight: 700, fontSize: '0.68rem' }}>BLUF Tool</span>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          {/* High-Impact In-Feed Ad Banner Between Editorial Hubs */}
          <AdBanner slotType="in-article" slotId="mid-hub-ad-3" />

          {/* Showcase 4: Enterprise Systems, IT Triage & Practical Engineering */}
          <div className="category-showcase-section">
            <div className="category-showcase-header">
              <div>
                <div className="showcase-eyebrow">
                  <BookOpen size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                  ENTERPRISE IT SYSTEMS, PAYMENT NETWORKS &amp; APPLIED TRIAGE
                </div>
                <h2 className="showcase-masthead-title">
                  Business Infrastructure, Database Locks &amp; Operational Triage
                </h2>
              </div>
              <button 
                type="button"
                className="showcase-action-btn"
                onClick={() => handleCategorySelect('Culture & Ideas')}
              >
                <span>Explore Strategy &amp; Systems Desk →</span>
              </button>
            </div>

            <div className="showcase-grid-layout">
              {leadBusiness && (
                <article 
                  className="showcase-lead-card"
                  onClick={() => onSelectArticle(leadBusiness)}
                >
                  <div className="showcase-lead-img-box">
                    <img 
                      src={leadBusiness.heroImage} 
                      alt={leadBusiness.title} 
                      className="showcase-lead-img"
                      loading="lazy"
                      width={560}
                      height={280}
                    />
                    <div className="card-badge-container">
                      <span className="badge badge-breaking">IT SYSTEMS TRIAGE</span>
                      <span className="badge badge-category">{leadBusiness.category}</span>
                    </div>
                    {isTriageArticle(leadBusiness) && (
                      <span className="card-bluf-indicator">🛠️ BLUF Triage Scorecard</span>
                    )}
                  </div>
                  <div className="showcase-lead-body">
                    <div className="card-date-row">
                      <span>{leadBusiness.author.location}</span>
                      <span>{leadBusiness.readTime}</span>
                    </div>
                    <h3 className="card-title" style={{ fontSize: '1.35rem' }}>{leadBusiness.title}</h3>
                    <p className="card-deck">{leadBusiness.deck}</p>
                    <div className="card-footer">
                      <div className="card-author-group">
                        <img 
                          src={leadBusiness.author.avatar} 
                          alt={leadBusiness.author.name} 
                          className="card-author-avatar" 
                          width={24}
                          height={24}
                          loading="lazy"
                        />
                        <span className="card-author-name">{leadBusiness.author.name}</span>
                      </div>
                      <span className="card-read-time">
                        <Eye size={12} /> {leadBusiness.views.toLocaleString()} reads
                      </span>
                    </div>
                  </div>
                </article>
              )}

              <div className="showcase-subcards-stack">
                {sideBusiness.map((art) => (
                  <article 
                    key={art.id}
                    className="showcase-subcard-item"
                    onClick={() => onSelectArticle(art)}
                  >
                    <div className="showcase-subcard-img-box">
                      <img 
                        src={art.heroImage} 
                        alt={art.title} 
                        className="showcase-subcard-img" 
                        loading="lazy"
                        width={140}
                        height={105}
                      />
                    </div>
                    <div className="showcase-subcard-body">
                      <div className="card-date-row" style={{ fontSize: '0.68rem', marginBottom: '0.2rem' }}>
                        <span>{art.region}</span>
                        <span>{art.readTime}</span>
                      </div>
                      <h4 className="showcase-subcard-title">{art.title}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        <span>By {art.author.name}</span>
                        {isTriageArticle(art) && (
                          <span style={{ color: 'var(--accent-gold)', fontWeight: 700, fontSize: '0.68rem' }}>BLUF Tool</span>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. In-Depth News Grid Section */}
      <section className="container" style={{ marginBottom: '3rem' }}>
        <div className="section-masthead-header">
          <div>
            <h2 className="section-heading-brand">
              Global Dispatches &amp; Analytical Archive
            </h2>
            <span className="section-sub-filter-info">
              Surveillance Desk: {selectedRegion !== 'all' ? selectedRegion : 'Global Desks'} • {selectedCategory !== 'all' ? selectedCategory : 'All Categories'}
            </span>
          </div>
          <span className="section-count-badge">
            {processedArticles.length} Verified Records
          </span>
        </div>

        {/* Dashboard Workflow Controls Bar (Sort, View Mode, Triage Only) */}
        <div className="dashboard-workflow-bar">
          <div className="dashboard-workflow-left">
            <button 
              type="button"
              className={`triage-toggle-btn ${triageOnly ? 'active' : ''}`}
              onClick={() => setTriageOnly(!triageOnly)}
              title="Filter by high-intent technical triage guides with BLUF scorecards"
            >
              <Wrench size={13} />
              <span>BLUF Triage &amp; Sizing Tools</span>
              <span style={{
                fontSize: '0.64rem',
                fontWeight: 800,
                padding: '1px 5px',
                borderRadius: '8px',
                background: triageOnly ? 'var(--accent-gold)' : 'var(--border-medium)',
                color: triageOnly ? '#fff' : 'inherit'
              }}>
                {triageCount}
              </span>
            </button>
          </div>

          <div className="dashboard-workflow-right">
            <div className="sort-select-wrap">
              <ArrowUpDown size={13} />
              <label htmlFor="feed-sort-select" className="sr-only">Sort Articles</label>
              <select 
                id="feed-sort-select"
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="latest">Latest Dispatches</option>
                <option value="popular">Most Read by Allocators</option>
                <option value="quick">Quick Skim (&lt; 8 min)</option>
              </select>
            </div>

            <div className="view-mode-group" role="group" aria-label="Layout view mode">
              <button 
                type="button"
                className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Magazine Grid View"
                aria-label="Magazine Grid View"
              >
                <LayoutGrid size={15} />
              </button>
              <button 
                type="button"
                className={`view-mode-btn ${viewMode === 'blotter' ? 'active' : ''}`}
                onClick={() => setViewMode('blotter')}
                title="Executive Blotter List View"
                aria-label="Executive Blotter List View"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {processedArticles.length === 0 ? (
          <div className="no-results-box">
            <Search size={40} color="var(--accent-gold)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>No Intelligence Found</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
              We could not find any active dispatches matching "{searchQuery}".
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedRegion('all'); setTriageOnly(false); }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="articles-grid">
                {processedArticles.map((art) => {
                  const saved = isBookmarked(art.id);
                  const isTriage = isTriageArticle(art);
                  return (
                    <article 
                      key={art.id} 
                      className="article-card"
                      onClick={() => onSelectArticle(art)}
                    >
                      <div className="card-media">
                        <img 
                          src={art.heroImage} 
                          srcSet={
                            art.heroImage.includes('w=')
                              ? `${art.heroImage.replace(/w=\d+/, 'w=400')} 400w, ${art.heroImage.replace(/w=\d+/, 'w=640')} 640w`
                              : undefined
                          }
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                          alt={art.title} 
                          className="card-img" 
                          loading="lazy" 
                          decoding="async"
                          width={400}
                          height={205}
                        />
                        <div className="card-badge-container">
                          <span className={`badge ${art.breaking ? 'badge-breaking' : 'badge-category'}`}>
                            {art.category}
                          </span>
                          <span className="badge badge-desk">
                            {art.region}
                          </span>
                        </div>

                        {isTriage && (
                          <span className="card-bluf-indicator">🛠️ BLUF Triage</span>
                        )}

                        <button 
                          className={`btn-icon card-bookmark-btn ${saved ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleBookmark(art.id);
                          }}
                          title="Bookmark Story"
                          aria-label={`Bookmark ${art.title}`}
                        >
                          <Bookmark size={13} fill={saved ? 'currentColor' : 'none'} />
                        </button>
                      </div>

                      <div className="card-body">
                        <div className="card-date-row">
                          <span>{art.author.location}</span>
                          <span>{new Date(art.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>

                        <h3 className="card-title">{art.title}</h3>
                        <p className="card-deck">{art.deck || art.content.replace(/<[^>]*>?/gm, '').slice(0, 130) + '...'}</p>

                        <div className="card-footer">
                          <div className="card-author-group">
                            <img 
                              src={art.author.avatar} 
                              alt={art.author.name} 
                              className="card-author-avatar" 
                              width={24}
                              height={24}
                              loading="lazy"
                              decoding="async"
                            />
                            <span className="card-author-name">{art.author.name}</span>
                          </div>
                          <span className="card-read-time">
                            <Clock size={12} /> {art.readTime}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="blotter-feed-container">
                {processedArticles.map((art) => {
                  const saved = isBookmarked(art.id);
                  const isTriage = isTriageArticle(art);
                  return (
                    <article 
                      key={art.id} 
                      className="blotter-row-item"
                      onClick={() => onSelectArticle(art)}
                    >
                      <div className="blotter-col-main">
                        <div className="blotter-meta-row">
                          <span className="blotter-desk-pill">{art.category}</span>
                          <span>•</span>
                          <span>{art.region}</span>
                          <span>•</span>
                          <span>{new Date(art.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                          {isTriage && (
                            <span style={{ color: '#38bdf8', fontWeight: 800 }}>• 🛠️ BLUF TRIAGE</span>
                          )}
                        </div>
                        <h3 className="blotter-title">{art.title}</h3>
                        <p className="blotter-deck-snippet">{art.deck}</p>
                      </div>

                      <div className="blotter-col-meta">
                        <span className="blotter-author">By {art.author.name}</span>
                        <span className="blotter-read">
                          <Clock size={12} /> {art.readTime}
                        </span>
                        <button 
                          className={`btn-icon ${saved ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleBookmark(art.id);
                          }}
                          title="Bookmark Story"
                          aria-label={`Bookmark ${art.title}`}
                          style={{ width: '28px', height: '28px', padding: 0 }}
                        >
                          <Bookmark size={13} fill={saved ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Mid-Feed Responsive In-Feed Ad Banner */}
            <AdBanner slotType="in-article" slotId="mid-feed-banner" />
          </>
        )}
      </section>

      {/* 6. Macroeconomic Sovereign Radar Section */}
      <section className="macro-matrix-section">
        <div className="container">
          <div className="macro-matrix-header">
            <div>
              <h2 className="macro-matrix-title">Macroeconomic Radar & Cross-Border Sovereign Matrix</h2>
              <p className="macro-matrix-deck">High-frequency surveillance across central banks, currency clearing corridors, and strategic reserves</p>
            </div>
            <span className="macro-matrix-badge">GLOBAL MACRO Q4</span>
          </div>

          <div className="macro-matrix-grid">
            <div className="macro-matrix-card">
              <h3 className="macro-card-title">
                🇺🇸 US Dollar & Federal Reserve Balance Sheet Normalization
              </h3>
              <p className="macro-card-text">
                Treasury term premiums remain sensitive to overseas sovereign reserve recycling. While indirect foreign bidding remains solid, structural trade adjustments across the Atlantic and Pacific corridors continue to influence duration appetite.
              </p>
              <div className="macro-card-footer">
                Surveillance by New York & Washington Intelligence Desks
              </div>
            </div>

            <div className="macro-matrix-card">
              <h3 className="macro-card-title">
                🇮🇳 Asia-Pacific & Emerging Sovereign Liquidity Rails
              </h3>
              <p className="macro-card-text">
                Record high foreign exchange reserves in India ($708B) and expanding sovereign wealth partnerships across Singapore and Tokyo demonstrate shifting capital concentration, driving industrial fabrication and battery metals logistics.
              </p>
              <div className="macro-card-footer">
                Surveillance by Mumbai, Tokyo & Singapore Desks
              </div>
            </div>

            <div className="macro-matrix-card">
              <h3 className="macro-card-title">
                🇪🇺 European Central Bank & Cross-Border Sovereign Spreads
              </h3>
              <p className="macro-card-text">
                Frankfurt and Zurich desks evaluate liquidity transmission mechanism behavior as industrial energy prices stabilise and defense bonds gain traction among pension funds and institutional asset managers.
              </p>
              <div className="macro-card-footer">
                Surveillance by Frankfurt & London Desks
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Institutional Quantitative Suite Gateway */}
      <section className="container" style={{ marginBottom: '4rem' }}>
        <div className="tools-gateway-card">
          <div className="tools-gateway-header">
            <div className="tools-gateway-badge">
              <Calculator size={13} color="var(--accent-gold)" />
              <span>BULLMONK QUANTITATIVE SUITE • LIVE TERMINAL</span>
            </div>
            <h2 className="tools-gateway-title">
              Institutional Financial Forensics & Macro Computational Engines
            </h2>
            <p className="tools-gateway-deck">
              Interactive analytical models designed for portfolio managers, sovereign wealth desks, and investigative researchers. Model bond yield duration sensitivity, measure purchasing power debasement, evaluate purchasing power parity deviations, and forecast multi-decade reserve accumulation.
            </p>
          </div>

          <div className="tools-gateway-grid">
            <div className="tools-mini-card" onClick={onNavigateToTools} role="button" tabIndex={0}>
              <div className="tools-mini-icon">
                <BarChart3 size={18} color="var(--accent-gold)" />
              </div>
              <h3 className="tools-mini-heading">Sovereign Bond & Duration</h3>
              <p className="tools-mini-desc">Estimate clean bond pricing, Macaulay duration, and basis point yield shock impact.</p>
              <span className="tools-mini-action">Launch Bond Terminal →</span>
            </div>

            <div className="tools-mini-card" onClick={onNavigateToTools} role="button" tabIndex={0}>
              <div className="tools-mini-icon">
                <TrendingUp size={18} color="var(--accent-green)" />
              </div>
              <h3 className="tools-mini-heading">Inflation & Real CAGR</h3>
              <p className="tools-mini-desc">Quantify purchasing power erosion, monetary debasement drag, and real returns.</p>
              <span className="tools-mini-action">Run Inflation Model →</span>
            </div>

            <div className="tools-mini-card" onClick={onNavigateToTools} role="button" tabIndex={0}>
              <div className="tools-mini-icon">
                <Globe2 size={18} color="var(--accent-blue)" />
              </div>
              <h3 className="tools-mini-heading">FX Arbitrage & PPP Matrix</h3>
              <p className="tools-mini-desc">Audit implied PPP currency over/undervaluations and central bank real policy spreads.</p>
              <span className="tools-mini-action">Audit FX Matrix →</span>
            </div>

            <div className="tools-mini-card" onClick={onNavigateToTools} role="button" tabIndex={0}>
              <div className="tools-mini-icon">
                <Zap size={18} color="var(--accent-gold)" />
              </div>
              <h3 className="tools-mini-heading">Compound Capital Forecaster</h3>
              <p className="tools-mini-desc">Model monthly reserve capital inflows, dividend reinvestment, and multi-decade wealth.</p>
              <span className="tools-mini-action">Simulate Reserves →</span>
            </div>
          </div>

          <div className="tools-gateway-footer">
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={onNavigateToTools}
                style={{ padding: '0.75rem 1.4rem', fontSize: '0.90rem' }}
              >
                <span>Quantitative Finance Suite</span>
                <ArrowUpRight size={15} />
              </button>

              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={onNavigateToDocTools}
                style={{ padding: '0.75rem 1.4rem', fontSize: '0.90rem' }}
              >
                <FileText size={15} color="var(--accent-gold)" />
                <span>PDF, Word & AI Image Studio</span>
                <ArrowUpRight size={15} />
              </button>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Zero Cloud Logging • 100% Client-Side Privacy Standard • Free Open Access
            </span>
          </div>
        </div>
      </section>
    </main>
  );
};
