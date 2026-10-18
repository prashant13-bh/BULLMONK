import React, { useState } from 'react';
import { Article, Region } from '../types';
import { SECTOR_HEATMAP } from '../data/newsData';
import { AdBanner } from '../components/AdBanner';
import { 
  Search, Bookmark, Clock, Eye, Sparkles, TrendingUp, Cpu, Globe2, 
  Zap, BookOpen, Send, MapPin, Volume2, ShieldCheck, Activity, 
  Flame, ArrowUpRight, BarChart3, ChevronRight 
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
}

export const HomePage: React.FC<HomePageProps> = ({
  articles,
  selectedCategory,
  setSelectedCategory,
  onSelectArticle,
  onToggleBookmark,
  isBookmarked,
  onStartAudioBriefing,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [wireFilter, setWireFilter] = useState<'all' | 'macro' | 'tech'>('all');
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const categories = [
    { id: 'all', label: 'All Desks', icon: <Sparkles size={13} /> },
    { id: 'Markets & Finance', label: 'Markets & Finance', icon: <TrendingUp size={13} /> },
    { id: 'Technology & AI', label: 'Tech & AI', icon: <Cpu size={13} /> },
    { id: 'World Affairs', label: 'Geopolitics', icon: <Globe2 size={13} /> },
    { id: 'Energy & Climate', label: 'Commodities & Energy', icon: <Flame size={13} /> },
    { id: 'Culture & Ideas', label: 'Strategy & Ideas', icon: <BookOpen size={13} /> }
  ];

  const regions: { id: string; label: string; flag: string }[] = [
    { id: 'all', label: 'Global Macro', flag: '🌐' },
    { id: 'United States', label: 'USA (Wall St)', flag: '🇺🇸' },
    { id: 'Europe', label: 'Europe (ECB)', flag: '🇪🇺' },
    { id: 'India', label: 'India (Dalal St)', flag: '🇮🇳' },
    { id: 'Canada', label: 'Canada (Bay St)', flag: '🇨🇦' },
    { id: 'Australia & NZ', label: 'Australia & NZ', flag: '🇦🇺' },
    { id: 'Russia & Eurasia', label: 'Russia & Eurasia', flag: '🇷🇺' }
  ];

  // Filtering by category, region, and search query
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
    return matchCat && matchRegion && matchQuery;
  });

  const leadArticle = filteredArticles.find(a => a.featured) || filteredArticles[0] || articles[0];
  
  // Wire dispatches (fast feed in left column)
  const wireArticles = articles.filter(a => {
    if (a.id === leadArticle?.id) return false;
    if (wireFilter === 'macro') return a.category === 'Markets & Finance';
    if (wireFilter === 'tech') return a.category === 'Technology & AI';
    return true;
  }).slice(0, 5);

  // Leaderboard / Most Read (right column)
  const mostReadArticles = [...articles]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      showToast(`Subscribed! "The Morning Monk" daily finance dispatch scheduled for ${newsletterEmail}`);
      setNewsletterEmail('');
    }
  };

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

      {/* 2. Top Responsive AdSense Leaderboard */}
      <div className="container">
        <AdBanner slotType="leaderboard" slotId="top-home-leaderboard" />
      </div>

      {/* 3. Bloomberg-Caliber 3-Column Hero Centerpiece */}
      <section className="hero-dispatch-section">
        <div className="container">
          <div className="bloomberg-three-col-grid">
            
            {/* COLUMN 1: 24/7 THE WIRE (FAST NEWS TIMELINE) */}
            <aside className="wire-feed-column">
              <div className="wire-feed-header">
                <div className="wire-feed-title-wrap">
                  <span className="live-pulse-dot"></span>
                  <h3 className="wire-feed-title">THE WIRE (24/7)</h3>
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

                    <h4 className="wire-card-title">{item.title}</h4>

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

            {/* COLUMN 2: GRAND FEATURED EDITORIAL INVESTIGATION */}
            {leadArticle && (
              <article 
                className="grand-hero-card"
                onClick={() => onSelectArticle(leadArticle)}
              >
                <div className="grand-hero-media">
                  <img 
                    src={leadArticle.heroImage} 
                    alt={leadArticle.title} 
                    className="grand-hero-img" 
                    width={800}
                    height={450}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                  />
                  <div className="grand-hero-badge-overlay">
                    <span className="badge badge-breaking">
                      <span className="ticker-pulse"></span> EXCLUSIVE INVESTIGATION
                    </span>
                    <span className="badge badge-category">{leadArticle.category}</span>
                    <span className="badge badge-desk">{leadArticle.region}</span>
                  </div>
                </div>

                <div className="grand-hero-content">
                  <div className="grand-hero-eyebrow">
                    <span>{leadArticle.author.location.toUpperCase()} BUREAU</span>
                    <span>•</span>
                    <span>VERIFIED STRATEGIC INTELLIGENCE</span>
                  </div>

                  <h2 className="grand-hero-title">{leadArticle.title}</h2>
                  <p className="grand-hero-deck">{leadArticle.deck}</p>

                  {/* Audio Briefing Pill */}
                  <div className="grand-hero-audio-bar" onClick={(e) => {
                    e.stopPropagation();
                    if (onStartAudioBriefing) onStartAudioBriefing(leadArticle);
                  }}>
                    <button className="audio-pill-btn" title="Listen to 3-Min Executive Audio Briefing">
                      <Volume2 size={15} />
                      <span>Listen to Executive Audio Dispatch (3 min 45s)</span>
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

                  {/* Author Byline & Metrics */}
                  <div className="grand-hero-author-row">
                    <div className="grand-hero-author-info">
                      <img 
                        src={leadArticle.author.avatar} 
                        alt={leadArticle.author.name} 
                        className="author-avatar-img"
                      />
                      <div>
                        <div className="author-name-with-seal">
                          <span>{leadArticle.author.name}</span>
                          <span className="contributor-seal" title="Verified BullMonk Institutional Fellow">✓ Verified</span>
                        </div>
                        <div className="author-role-sub">{leadArticle.author.title} • {leadArticle.author.location}</div>
                      </div>
                    </div>

                    <div className="grand-hero-action-tools">
                      <span className="hero-metric-item">
                        <Clock size={13} /> {leadArticle.readTime}
                      </span>
                      <span className="hero-metric-item">
                        <Eye size={13} /> {leadArticle.views.toLocaleString()}
                      </span>
                      <button 
                        className={`btn-icon ${isBookmarked(leadArticle.id) ? 'active-bookmark' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(leadArticle.id);
                        }}
                        title="Bookmark to Private Dossier"
                      >
                        <Bookmark size={14} fill={isBookmarked(leadArticle.id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )}

            {/* COLUMN 3: MARKET BAROMETER & MOST READ LEADERBOARD */}
            <aside className="market-leaderboard-column">
              
              {/* Sector Heatmap Barometer */}
              <div className="sector-heatmap-widget">
                <div className="widget-header">
                  <div className="widget-title">
                    <BarChart3 size={15} color="var(--accent-gold)" />
                    <span>SECTOR BAROMETER</span>
                  </div>
                  <span className="widget-subtitle">GLOBAL FLOWS</span>
                </div>

                <div className="sector-heatmap-grid">
                  {SECTOR_HEATMAP.map((sec, idx) => (
                    <div 
                      key={idx} 
                      className={`sector-tile ${sec.positive ? 'positive' : 'negative'}`}
                      title={`${sec.name}: ${sec.change} (Volume: ${sec.volume})`}
                    >
                      <div className="sector-tile-top">
                        <span className="sector-ticker">{sec.ticker}</span>
                        <span className="sector-change">{sec.change}</span>
                      </div>
                      <div className="sector-name">{sec.name}</div>
                      <div className="sector-vol">Vol: {sec.volume}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ranked Leaderboard: Most Read by Allocators */}
              <div className="leaderboard-widget">
                <div className="widget-header">
                  <div className="widget-title">
                    <Activity size={15} color="var(--accent-gold)" />
                    <span>MOST READ BY ALLOCATORS</span>
                  </div>
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
                        <h4 className="leaderboard-item-title">{item.title}</h4>
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
                <h4 className="sponsor-headline">Global Sovereign Liquidity & Gold Re-Anchoring 2026-2027</h4>
                <p className="sponsor-text">Comprehensive 84-page surveillance report compiled across Tokyo, London, and New York research desks.</p>
                <button 
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => showToast('Institutional Dossier downloaded: 84-page PDF')}
                >
                  Download Executive Briefing (PDF)
                </button>
              </div>

            </aside>

          </div>
        </div>
      </section>

      {/* 4. Controls: Category Desk Tabs & Live Search Bar */}
      <section className="container" style={{ marginTop: '2rem' }}>
        <div className="filter-bar">
          <div className="category-tabs" role="tablist">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`cat-tab ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  {cat.icon}
                  {cat.label}
                </span>
              </button>
            ))}
          </div>

          <div className="search-input-wrap">
            <Search size={15} className="search-icon" aria-hidden="true" />
            <label htmlFor="homepage-filter-input" className="sr-only">Filter dispatches by keyword or author</label>
            <input 
              id="homepage-filter-input"
              type="text"
              className="search-field"
              placeholder="Filter by keyword, commodity, ticker, author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* 5. In-Depth News Grid Section */}
      <section className="container" style={{ marginBottom: '3rem' }}>
        <div className="section-masthead-header">
          <div>
            <h3 className="section-heading-brand">
              Global Dispatches & Analytical Archive
            </h3>
            <span className="section-sub-filter-info">
              Surveillance Desk: {selectedRegion !== 'all' ? selectedRegion : 'Global Desks'} • {selectedCategory !== 'all' ? selectedCategory : 'All Categories'}
            </span>
          </div>
          <span className="section-count-badge">
            {filteredArticles.length} Verified Records
          </span>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="no-results-box">
            <Search size={40} color="var(--accent-gold)" style={{ margin: '0 auto 1rem' }} />
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>No Intelligence Found</h4>
            <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
              We could not find any active dispatches matching "{searchQuery}".
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedRegion('all'); }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="articles-grid">
              {filteredArticles.map((art) => {
                const saved = isBookmarked(art.id);
                return (
                  <article 
                    key={art.id} 
                    className="article-card"
                    onClick={() => onSelectArticle(art)}
                  >
                    <div className="card-media">
                      <img 
                        src={art.heroImage} 
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
                          <img src={art.author.avatar} alt={art.author.name} className="card-author-avatar" />
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
              <h3 className="macro-matrix-title">Macroeconomic Radar & Cross-Border Sovereign Matrix</h3>
              <p className="macro-matrix-deck">High-frequency surveillance across central banks, currency clearing corridors, and strategic reserves</p>
            </div>
            <span className="macro-matrix-badge">GLOBAL MACRO Q4</span>
          </div>

          <div className="macro-matrix-grid">
            <div className="macro-matrix-card">
              <h4 className="macro-card-title">
                🇺🇸 US Dollar & Federal Reserve Balance Sheet Normalization
              </h4>
              <p className="macro-card-text">
                Treasury term premiums remain sensitive to overseas sovereign reserve recycling. While indirect foreign bidding remains solid, structural trade adjustments across the Atlantic and Pacific corridors continue to influence duration appetite.
              </p>
              <div className="macro-card-footer">
                Surveillance by New York & Washington Intelligence Desks
              </div>
            </div>

            <div className="macro-matrix-card">
              <h4 className="macro-card-title">
                🇮🇳 Asia-Pacific & Emerging Sovereign Liquidity Rails
              </h4>
              <p className="macro-card-text">
                Record high foreign exchange reserves in India ($708B) and expanding sovereign wealth partnerships across Singapore and Tokyo demonstrate shifting capital concentration, driving industrial fabrication and battery metals logistics.
              </p>
              <div className="macro-card-footer">
                Surveillance by Mumbai, Tokyo & Singapore Desks
              </div>
            </div>

            <div className="macro-matrix-card">
              <h4 className="macro-card-title">
                🇪🇺 European Central Bank & Cross-Border Sovereign Spreads
              </h4>
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

      {/* 7. Flagship Daily Finance Newsletter */}
      <section className="container" style={{ marginBottom: '4rem' }}>
        <div className="newsletter-callout-box">
          <div>
            <span className="newsletter-kicker">
              Institutional Daily Briefing
            </span>
            <h3 className="newsletter-title">
              The Morning Monk
            </h3>
            <p className="newsletter-deck">
              Join 185,000+ portfolio managers, diplomats, and senior policy makers receiving our unfiltered 6:00 AM macro dispatch. Zero fluff, pure signal.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
            <label htmlFor="newsletter-email-input" className="sr-only">Institutional email address for daily briefing</label>
            <input 
              id="newsletter-email-input"
              type="email"
              className="form-control"
              style={{ flex: '1 1 240px' }}
              placeholder="Enter institutional email..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }} aria-label="Subscribe to The Morning Monk">
              <Send size={15} /> Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};
