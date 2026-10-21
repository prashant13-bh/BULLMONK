import React, { useState, useEffect } from 'react';
import { Article, Comment } from '../types';
import { AdBanner } from '../components/AdBanner';
import { 
  Play, Pause, Bookmark, Share2, Type, ArrowLeft, Send, Clock, 
  UserCheck, ShieldCheck, AlertCircle, MapPin, Printer, Calculator, 
  Sparkles, Building2, CheckCircle2, ArrowRight
} from 'lucide-react';

import { Breadcrumbs } from '../components/Breadcrumbs';
import { SupabaseDB } from '../utils/supabase';

interface ArticleReaderPageProps {
  article: Article;
  relatedArticles: Article[];
  onSelectArticle: (article: Article) => void;
  onToggleBookmark: (id: string) => void;
  isBookmarked: boolean;
  onBackToWire: () => void;
  showToast: (msg: string) => void;
  onNavigateToTools?: () => void;
}

export const ArticleReaderPage: React.FC<ArticleReaderPageProps> = ({
  article,
  relatedArticles,
  onSelectArticle,
  onToggleBookmark,
  isBookmarked,
  onBackToWire,
  showToast,
  onNavigateToTools
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSeconds, setAudioSeconds] = useState(0);
  const [largeFont, setLargeFont] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'c-1',
      author: 'Dr. Arthur Pendelton',
      affiliation: 'Oxford Institute for Global Finance',
      timeAgo: '2 hours ago',
      content: 'The cross-border liquidity latency metrics reported here match what we have observed in synthetic stress simulations. If Phase Two sustains this throughput, Tier-1 custodians will likely reallocate reserves within the first two quarters.',
      likes: 18
    }
  ]);

  // Audio briefing timer simulation
  useEffect(() => {
    let isMounted = true;
    async function loadCloudComments() {
      try {
        const remote = await SupabaseDB.fetchComments(article.id);
        if (isMounted && remote && remote.length > 0) {
          setComments(prev => {
            const existingIds = new Set(prev.map(c => c.id));
            const fresh = remote.filter(r => !existingIds.has(r.id));
            return [...prev, ...fresh];
          });
        }
      } catch (err) {
        // Fallback silently to local state
      }
    }
    loadCloudComments();
    return () => { isMounted = false; };
  }, [article.id]);

  useEffect(() => {
    let timer: any;
    if (isPlayingAudio) {
      timer = setInterval(() => {
        setAudioSeconds((prev) => {
          if (prev >= 255) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlayingAudio]);

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio) {
      showToast('BullMonk Audio Briefing: Synthetic Voice Stream Playing');
    }
  };

  // Google News & Search Schema.org/NewsArticle JSON-LD structured data injection
  useEffect(() => {
    const originalTitle = document.title;
    document.title = `${article.title} | BULLMONK Intelligence`;

    const scriptId = 'bullmonk-article-schema';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://www.govtnaukri4u.com/#article/${article.id}`
      },
      "headline": article.title,
      "description": article.deck || article.title,
      "image": [
        article.heroImage
      ],
      "datePublished": article.publishedAt,
      "dateModified": article.publishedAt,
      "author": {
        "@type": "Person",
        "name": article.author.name,
        "jobTitle": article.author.title,
        "worksFor": {
          "@type": "NewsMediaOrganization",
          "name": "BULLMONK International Intelligence"
        }
      },
      "publisher": {
        "@type": "NewsMediaOrganization",
        "name": "BULLMONK",
        "url": "https://www.govtnaukri4u.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.govtnaukri4u.com/logo192.png",
          "width": 192,
          "height": 192
        }
      },
      "articleSection": article.category,
      "keywords": article.tags.join(', ')
    };

    script.textContent = JSON.stringify(jsonLd);

    return () => {
      document.title = originalTitle;
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [article]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Dispatch link copied to clipboard!');
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: 'c-' + Date.now(),
      author: 'You (Verified Analyst)',
      affiliation: 'Institutional Reader',
      timeAgo: 'Just now',
      content: commentText.trim(),
      likes: 0
    };

    setComments([newComment, ...comments]);
    setCommentText('');
    showToast('Analysis commentary broadcasted to reader room!');

    // Async persist to Supabase Database
    SupabaseDB.addComment(article.id, newComment);
  };

  const formatAudioTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <main className="reader-container">
      {/* Top Breadcrumb Navigation & Verification Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <Breadcrumbs 
          items={[
            { label: article.category, onClick: onBackToWire },
            { label: article.region, onClick: onBackToWire },
            { label: article.title.length > 45 ? article.title.slice(0, 42) + '...' : article.title, active: true }
          ]}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <button 
            type="button"
            className="btn btn-secondary" 
            onClick={onBackToWire}
            style={{ fontSize: '0.76rem', padding: '0.3rem 0.65rem' }}
            aria-label="Back to Global Wire"
          >
            <ArrowLeft size={13} /> Back to Wire
          </button>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} color="var(--accent-green)" /> Fact-Checked
          </span>
        </div>
      </div>


      {/* Top Article Ad Placement */}
      <AdBanner slotType="leaderboard" slotId="top-article-slot" />

      {/* Header & Meta */}
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span className={`badge ${article.breaking ? 'badge-breaking' : 'badge-category'}`}>
            {article.category}
          </span>
          <span className="badge badge-desk" style={{ background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)' }}>
            <MapPin size={11} style={{ marginRight: '2px' }} /> {article.region}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontWeight: 700, textTransform: 'uppercase' }}>
            {article.author.location}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Published: {new Date(article.publishedAt).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>

        <h1 className="article-main-title">{article.title}</h1>
        {article.deck && <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: '1.55', marginBottom: '1.5rem' }}>{article.deck}</p>}

        {/* Bylines & Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '1rem 0', margin: '1.5rem 0 2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img 
              src={article.author.avatar} 
              alt={article.author.name} 
              width={44}
              height={44}
              loading="lazy"
              decoding="async"
              style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--accent-gold)' }} 
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{article.author.name}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {article.author.title} • {article.author.credentials || article.author.location}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button 
              className="btn-icon" 
              onClick={() => onToggleBookmark(article.id)}
              style={{ color: isBookmarked ? 'var(--accent-gold)' : 'inherit' }}
              title="Bookmark story"
              aria-label="Bookmark this story"
            >
              <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>

            <button 
              className="btn-icon" 
              onClick={handleShare} 
              title="Copy link"
              aria-label="Share article link"
            >
              <Share2 size={16} />
            </button>

            <button 
              type="button"
              className="btn-icon" 
              onClick={() => setLargeFont(!largeFont)}
              title="Toggle reading font size"
              aria-label="Toggle reading font size"
              style={{ color: largeFont ? 'var(--accent-gold)' : 'inherit' }}
            >
              <Type size={16} />
            </button>

            <button 
              type="button"
              className="btn-icon hide-on-mobile" 
              onClick={() => window.print()}
              title="Print Dispatch"
              aria-label="Print Dispatch"
            >
              <Printer size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Audio Briefing Player */}
      <div className={`audio-bar ${isPlayingAudio ? 'playing' : ''}`}>
        <button 
          className="audio-play-btn" 
          onClick={toggleAudio}
          title={isPlayingAudio ? 'Pause synthetic voice' : 'Listen to audio briefing'}
          aria-label={isPlayingAudio ? 'Pause audio briefing' : 'Play audio briefing'}
        >
          {isPlayingAudio ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🎙️ BullMonk Audio Briefing: Synthetic Voice Dispatch</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>({article.readTime})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '16px', marginTop: '4px' }}>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
          </div>
        </div>
        <span style={{ fontSize: '0.76rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)' }}>
          {formatAudioTime(audioSeconds)} / 4:15
        </span>
      </div>

      {/* Responsive Hero Media */}
      <figure className="reader-hero-figure">
        <img 
          src={article.heroImage} 
          srcSet={
            article.heroImage.includes('w=')
              ? `${article.heroImage.replace(/w=\d+/, 'w=480')} 480w, ${article.heroImage.replace(/w=\d+/, 'w=800')} 800w, ${article.heroImage.replace(/w=\d+/, 'w=1200')} 1200w`
              : undefined
          }
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 840px"
          alt={article.title} 
          width={800}
          height={450}
          loading="eager"
          decoding="async"
          className="reader-hero-img"
        />
        {article.imageCaption && (
          <figcaption className="reader-hero-caption">
            {article.imageCaption}
          </figcaption>
        )}
      </figure>

      {/* Executive Key Takeaways Box */}
      {article.keyTakeaways && article.keyTakeaways.length > 0 && (
        <div style={{
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          borderLeft: '4px solid var(--accent-gold)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          marginBottom: '2.5rem',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.86rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
            <ShieldCheck size={16} /> Key Intelligence Takeaways & Forensic Data
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', color: 'var(--text-primary)', fontSize: '0.98rem', lineHeight: '1.6' }}>
            {article.keyTakeaways.map((takeaway, i) => (
              <li key={i}>{takeaway}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Body Prose */}
      <div 
        className="article-prose"
        style={{ fontSize: largeFont ? '1.3rem' : '1.15rem' }}
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Google Reader Revenue Manager: Official Inline CTA */}
      <div 
        {...{ 'rrm-inline-cta': '6431d91b-b87a-445f-86a2-b9b9d1608b0b' }} 
        className="rrm-inline-cta-container"
        style={{ margin: '2.5rem 0', minHeight: '60px' }}
      />

      {/* Quantitative Suite Cross-Link Callout */}
      {onNavigateToTools && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(180, 83, 9, 0.08) 0%, var(--bg-surface) 100%)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem 1.75rem',
          margin: '2.5rem 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.76rem', fontWeight: 800, color: 'var(--accent-gold)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              <Calculator size={14} /> BullMonk Quantitative Suite Integration
            </div>
            <h4 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.15rem', margin: 0, color: 'var(--text-primary)' }}>
              Stress-Test Sovereign Yields, FX Parity & Inflation Drag
            </h4>
            <p style={{ margin: '0.35rem 0 0', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              Run interactive duration calculations, measure purchasing power parity deviations, and evaluate central bank policy spreads.
            </p>
          </div>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={onNavigateToTools}
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
          >
            <span>Launch Financial Tools</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Mid-Article AdSense Banner (High-CPM In-Article format) */}
      <AdBanner slotType="in-article" slotId="in-article-flow" />

      {/* Mandatory YMYL Financial Disclaimer for Google AdSense Compliance */}
      <div style={{
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderLeft: '4px solid var(--accent-gold)',
        borderRadius: 'var(--radius-sm)',
        padding: '1.25rem 1.5rem',
        margin: '2.5rem 0',
        fontSize: '0.84rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.6'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
          <AlertCircle size={15} color="var(--accent-gold)" /> Institutional Financial & Risk Disclaimer (YMYL Policy)
        </div>
        <p style={{ margin: 0 }}>
          The macroeconomic analyses, asset valuations, and sovereign policy commentaries published by BULLMONK are provided strictly for informational, educational, and journalistic purposes. Nothing contained herein constitutes investment, legal, accounting, or tax advice. Market instruments and cross-border securities involve substantial capital risk. Consult an accredited fiduciary advisor before executing transactions.
        </p>
      </div>

      {/* Topic Tags */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', margin: '2rem 0', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Topics:</span>
        {article.tags.map((tag, idx) => (
          <span key={idx} className="cat-tab" style={{ fontSize: '0.74rem' }}>
            #{tag}
          </span>
        ))}
      </div>

      {/* Author & Bureau Chief Dossier Card */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-md)',
        padding: '1.75rem',
        margin: '2.5rem 0',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        flexWrap: 'wrap'
      }}>
        <img 
          src={article.author.avatar} 
          alt={article.author.name} 
          width={64}
          height={64}
          loading="lazy"
          decoding="async"
          style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-gold)' }} 
        />
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{article.author.name}</span>
            <span style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-green)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
              ✓ Bureau Fellow
            </span>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--accent-gold)', fontWeight: 600, marginBottom: '0.5rem' }}>
            {article.author.title} • {article.author.location} Bureau
          </div>
          <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
            {article.author.bio || `Specializing in cross-border forensic capital audits, semiconductor supply networks, and sovereign monetary mechanisms for the BULLMONK International Bureau.`}
          </p>
        </div>
      </div>

      {/* Reader Dialogue / Comments */}
      <section style={{ marginTop: '3.5rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem' }}>Global Reader Dialogue</h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Verified Subscribers & Institutional Analysts</span>
        </div>

        <form onSubmit={handleCommentSubmit} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '2rem' }}>
          <textarea 
            className="form-control" 
            rows={3}
            placeholder="Contribute institutional analysis or perspective on this dispatch..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            style={{ marginBottom: '1rem' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary">
              <Send size={14} /> Submit Verified Commentary
            </button>
          </div>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {comments.map((c) => (
            <div key={c.id} style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <UserCheck size={14} /> {c.author} • {c.affiliation}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.timeAgo}</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{c.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Stories */}
      {relatedArticles.length > 0 && (
        <section style={{ marginTop: '4rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.3rem', marginBottom: '1.5rem' }}>
            Related Dispatches & Dossiers
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {relatedArticles.slice(0, 3).map((rel) => (
              <div 
                key={rel.id} 
                className="article-card"
                onClick={() => {
                  onSelectArticle(rel);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <div style={{ height: '140px', overflow: 'hidden' }}>
                  <img 
                    src={rel.heroImage} 
                    alt={rel.title} 
                    width={320}
                    height={140}
                    loading="lazy"
                    decoding="async"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                <div style={{ padding: '1rem' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--accent-gold)', fontWeight: 700, textTransform: 'uppercase' }}>{rel.region} • {rel.category}</span>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '0.98rem', margin: '0.3rem 0' }}>{rel.title}</h4>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}><Clock size={11} style={{ display: 'inline', marginRight: '3px' }} /> {rel.readTime}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bottom Ad Unit */}
      <AdBanner slotType="leaderboard" slotId="bottom-article-slot" />
    </main>
  );
};
