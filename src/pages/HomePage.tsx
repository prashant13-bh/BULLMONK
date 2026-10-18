import React, { useState } from 'react';
import { Article } from '../types';
import { Search, Bookmark, Clock, Eye, Sparkles, TrendingUp, Cpu, Globe2, Zap, BookOpen, Send } from 'lucide-react';

interface HomePageProps {
  articles: Article[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onSelectArticle: (article: Article) => void;
  onToggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  showToast: (msg: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  articles,
  selectedCategory,
  setSelectedCategory,
  onSelectArticle,
  onToggleBookmark,
  isBookmarked,
  showToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const categories = [
    { id: 'all', label: 'All Dispatches', icon: <Sparkles size={14} /> },
    { id: 'Markets & Finance', label: 'Markets & Finance', icon: <TrendingUp size={14} /> },
    { id: 'Technology & AI', label: 'Tech & AI', icon: <Cpu size={14} /> },
    { id: 'World Affairs', label: 'World Affairs', icon: <Globe2 size={14} /> },
    { id: 'Energy & Climate', label: 'Energy & Climate', icon: <Zap size={14} /> },
    { id: 'Culture & Ideas', label: 'Culture & Ideas', icon: <BookOpen size={14} /> }
  ];

  // Filtering
  const filteredArticles = articles.filter(art => {
    const matchCat = selectedCategory === 'all' || art.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const query = searchQuery.trim().toLowerCase();
    const matchQuery = !query ||
      art.title.toLowerCase().includes(query) ||
      (art.deck && art.deck.toLowerCase().includes(query)) ||
      art.category.toLowerCase().includes(query) ||
      art.author.name.toLowerCase().includes(query) ||
      art.tags.some(t => t.toLowerCase().includes(query));
    return matchCat && matchQuery;
  });

  const leadArticle = filteredArticles.find(a => a.featured) || filteredArticles[0] || articles[0];
  const asideArticles = filteredArticles.filter(a => a.id !== leadArticle?.id).slice(0, 4);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      showToast(`Subscribed! "The Morning Monk" daily dispatch scheduled for ${newsletterEmail}`);
      setNewsletterEmail('');
    }
  };

  return (
    <main>
      {/* 1. Lead Hero Dispatch & Fast Intelligence Column */}
      <section className="hero-dispatch-section">
        <div className="container">
          <div className="lead-hero-grid">
            
            {/* Main Featured Lead Story */}
            {leadArticle && (
              <article 
                className="lead-card"
                onClick={() => onSelectArticle(leadArticle)}
              >
                <div className="lead-media-wrap">
                  <img src={leadArticle.heroImage} alt={leadArticle.title} className="lead-img" />
                  <div className="lead-overlay">
                    <div className="badge-row">
                      {leadArticle.breaking && (
                        <span className="badge badge-breaking">
                          <span className="ticker-pulse"></span> Breaking Intelligence
                        </span>
                      )}
                      <span className="badge badge-category">{leadArticle.category}</span>
                      <span className="badge badge-desk">{leadArticle.author.location}</span>
                    </div>

                    <h2 className="lead-title">{leadArticle.title}</h2>
                    <p className="lead-deck">{leadArticle.deck}</p>

                    <div className="lead-meta">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <img 
                          src={leadArticle.author.avatar} 
                          alt={leadArticle.author.name} 
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--accent-gold)' }} 
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.85rem' }}>{leadArticle.author.name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{leadArticle.author.title}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={13} /> {leadArticle.readTime}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Eye size={13} /> {leadArticle.views.toLocaleString()}
                        </span>
                        <button 
                          className="btn-icon" 
                          style={{ 
                            width: '32px', 
                            height: '32px', 
                            background: isBookmarked(leadArticle.id) ? 'var(--accent-gold)' : 'rgba(0,0,0,0.6)',
                            color: isBookmarked(leadArticle.id) ? '#000' : '#fff' 
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleBookmark(leadArticle.id);
                          }}
                          title="Bookmark dispatch"
                        >
                          <Bookmark size={14} fill={isBookmarked(leadArticle.id) ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            )}

            {/* Fast Intelligence Desk Briefings */}
            <aside className="aside-panel">
              <div className="panel-header">
                <span className="panel-title">
                  <Zap size={16} /> Desk Briefings
                </span>
                <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  VERIFIED HOURLY
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {asideArticles.map((item) => (
                  <div key={item.id} className="aside-item" onClick={() => onSelectArticle(item)}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-gold)', letterSpacing: '0.08em' }}>
                      {item.category} • {item.author.location}
                    </span>
                    <h4 className="aside-item-title">{item.title}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      <span>By {item.author.name}</span>
                      <span>•</span>
                      <span>{item.readTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </aside>

          </div>
        </div>
      </section>

      {/* 2. Controls: Category Tabs & Live Search */}
      <section className="container">
        <div className="filter-bar">
          <div className="category-tabs" role="tablist">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`cat-tab ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  {cat.icon}
                  {cat.label}
                </span>
              </button>
            ))}
          </div>

          <div className="search-input-wrap">
            <Search size={15} className="search-icon" />
            <input 
              type="text"
              className="search-field"
              placeholder="Search dispatches, tags, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* 3. News Grid Section */}
      <section className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--border-subtle)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.3rem', fontWeight: 800, letterSpacing: '0.08em', margin: 0 }}>
            Global Dispatches & Analyses
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {filteredArticles.length} Dispatches Recorded
          </span>
        </div>

        {filteredArticles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-medium)', margin: '2rem 0' }}>
            <Search size={36} color="var(--accent-gold)" style={{ margin: '0 auto 1rem' }} />
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>No Dispatches Located</h4>
            <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
              We could not find any intelligence records matching "{searchQuery}" in {selectedCategory}.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            >
              Reset Search Parameters
            </button>
          </div>
        ) : (
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
                    <img src={art.heroImage} alt={art.title} className="card-img" loading="lazy" />
                    <div style={{ position: 'absolute', top: '0.85rem', left: '0.85rem' }}>
                      <span className={`badge ${art.breaking ? 'badge-breaking' : 'badge-category'}`}>
                        {art.category}
                      </span>
                    </div>

                    <button 
                      className="btn-icon"
                      style={{ 
                        position: 'absolute', 
                        top: '0.85rem', 
                        right: '0.85rem', 
                        width: '32px', 
                        height: '32px',
                        background: saved ? 'var(--accent-gold)' : 'rgba(0,0,0,0.6)',
                        color: saved ? '#000' : '#fff'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(art.id);
                      }}
                      title="Bookmark Story"
                    >
                      <Bookmark size={13} fill={saved ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--accent-gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                      <span>{art.author.location}</span>
                      <span>{new Date(art.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>

                    <h3 className="card-title">{art.title}</h3>
                    <p className="card-deck">{art.deck || art.content.replace(/<[^>]*>?/gm, '').slice(0, 130) + '...'}</p>

                    <div className="card-footer">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img src={art.author.avatar} alt={art.author.name} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{art.author.name}</span>
                      </div>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Clock size={12} /> {art.readTime}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Macroeconomic Radar Box */}
      <section style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '3.5rem 0', margin: '1rem 0 3.5rem' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid var(--border-subtle)', paddingBottom: '0.75rem', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.35rem', fontWeight: 800 }}>Macroeconomic Radar & Policy Matrix</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Cross-border liquidity, sovereign reserves, and computational power allocation</p>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>Q4 2026 FORECAST</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            <div style={{ background: 'var(--bg-surface-elevated)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.15rem', color: 'var(--accent-gold)', marginBottom: '0.85rem' }}>
                The Sovereign Liquidity Pivot
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.65', marginBottom: '1.25rem' }}>
                Central bank balance sheets are undergoing asymmetric normalization. While G10 sovereign yields reflect persistent term premiums, bilateral commodities settlements outside G7 payment networks continue to compress standard dollar velocity.
              </p>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                Coverage by Zurich & Tokyo Financial Desks
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface-elevated)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.15rem', color: 'var(--accent-gold)', marginBottom: '0.85rem' }}>
                The Photonic Infrastructure Supercycle
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.65', marginBottom: '1.25rem' }}>
                Hyperscale computational density has decoupled from pure electrical grid capacity. Optical interconnects and modular micro-tokamak power plants now determine sovereign cloud sovereignty, restructuring supply chains across the Pacific rim.
              </p>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                Coverage by Singapore & Eindhoven Technology Desks
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Flagship Daily Newsletter */}
      <section className="container" style={{ marginBottom: '4rem' }}>
        <div style={{ 
          background: 'radial-gradient(circle at top right, rgba(234, 179, 8, 0.16) 0%, rgba(14, 22, 38, 0.96) 70%)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          padding: 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2.5rem)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent-gold)', display: 'block', marginBottom: '0.4rem' }}>
              Institutional Daily Briefing
            </span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
              The Morning Monk
            </h3>
            <p style={{ color: '#CBD5E1', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Join 185,000+ portfolio managers, diplomats, and senior policy makers receiving our unfiltered 6:00 AM macro dispatch. Zero fluff, pure signal.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <input 
              type="email"
              className="form-control"
              style={{ flex: '1 1 220px' }}
              placeholder="Enter institutional email..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
              <Send size={15} /> Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};
