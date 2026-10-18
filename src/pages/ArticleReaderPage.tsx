import React, { useState, useEffect } from 'react';
import { Article, Comment } from '../types';
import { Play, Pause, Bookmark, Share2, Type, ArrowLeft, Send, Clock, UserCheck } from 'lucide-react';

interface ArticleReaderPageProps {
  article: Article;
  relatedArticles: Article[];
  onSelectArticle: (article: Article) => void;
  onToggleBookmark: (id: string) => void;
  isBookmarked: boolean;
  onBackToWire: () => void;
  showToast: (msg: string) => void;
}

export const ArticleReaderPage: React.FC<ArticleReaderPageProps> = ({
  article,
  relatedArticles,
  onSelectArticle,
  onToggleBookmark,
  isBookmarked,
  onBackToWire,
  showToast
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
      content: 'The cross-border liquidity latency metrics reported here match what we have observed in synthetic stress simulations. If Phase Two sustains this throughput, Tier-1 custodians will likely reallocate reserves within the first two quarters.'
    }
  ]);

  // Audio briefing timer simulation
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
      content: commentText.trim()
    };

    setComments([newComment, ...comments]);
    setCommentText('');
    showToast('Analysis commentary broadcasted to reader room!');
  };

  const formatAudioTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <main className="reader-container">
      {/* Back button */}
      <button 
        className="btn btn-secondary" 
        onClick={onBackToWire}
        style={{ marginBottom: '1.5rem', fontSize: '0.8rem' }}
      >
        <ArrowLeft size={14} /> Back to Global Wire
      </button>

      {/* Header & Meta */}
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span className={`badge ${article.breaking ? 'badge-breaking' : 'badge-category'}`}>
            {article.category}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontWeight: 700, textTransform: 'uppercase' }}>
            {article.author.location} Bureau
          </span>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {new Date(article.publishedAt).toLocaleDateString(undefined, {
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
            <img src={article.author.avatar} alt={article.author.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--accent-gold)' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{article.author.name}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{article.author.title} • {article.author.location}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button 
              className="btn-icon" 
              onClick={() => onToggleBookmark(article.id)}
              style={{ color: isBookmarked ? 'var(--accent-gold)' : 'inherit' }}
              title="Bookmark story"
            >
              <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>

            <button className="btn-icon" onClick={handleShare} title="Copy link">
              <Share2 size={16} />
            </button>

            <button 
              className="btn-icon" 
              onClick={() => setLargeFont(!largeFont)}
              title="Toggle reading font size"
              style={{ color: largeFont ? 'var(--accent-gold)' : 'inherit' }}
            >
              <Type size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Audio Briefing Player */}
      <div className={`audio-bar ${isPlayingAudio ? 'playing' : ''}`}>
        <button className="audio-play-btn" onClick={toggleAudio}>
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

      {/* Hero Media */}
      <figure style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-subtle)', marginBottom: '2.5rem' }}>
        <img src={article.heroImage} alt={article.title} style={{ width: '100%', maxHeight: '480px', objectFit: 'cover' }} />
        {article.imageCaption && (
          <figcaption style={{ padding: '0.65rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', fontStyle: 'italic' }}>
            {article.imageCaption}
          </figcaption>
        )}
      </figure>

      {/* Body Prose */}
      <div 
        className="article-prose"
        style={{ fontSize: largeFont ? '1.3rem' : '1.15rem' }}
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Topic Tags */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', margin: '2.5rem 0', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Topics:</span>
        {article.tags.map((tag, idx) => (
          <span key={idx} className="cat-tab" style={{ fontSize: '0.74rem' }}>
            #{tag}
          </span>
        ))}
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
                  <img src={rel.heroImage} alt={rel.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '1rem' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--accent-gold)', fontWeight: 700, textTransform: 'uppercase' }}>{rel.category}</span>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '0.98rem', margin: '0.3rem 0' }}>{rel.title}</h4>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}><Clock size={11} style={{ display: 'inline', marginRight: '3px' }} /> {rel.readTime}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};
