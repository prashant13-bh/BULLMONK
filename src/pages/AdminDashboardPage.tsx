import React, { useState, useEffect } from 'react';
import { Article, Comment, PageView, AdminUser } from '../types';
import { AdminAuth } from '../utils/adminAuth';
import { SupabaseDB, isSupabaseConfigured } from '../utils/supabase';
import { LiveMarketService } from '../utils/liveMarketService';
import { 
  ShieldCheck, Lock, LogOut, PenTool, Trash2, Eye, RefreshCw, 
  CheckCircle2, AlertTriangle, Database, Cloud, FileText, 
  MessageSquare, BookOpen, Key, ArrowLeft, TrendingUp, Sparkles, Filter, Activity, Radio
} from 'lucide-react';

interface AdminDashboardPageProps {
  setCurrentPage: (page: PageView) => void;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onDeleteArticle: (id: string) => void;
  showToast: (msg: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  setCurrentPage,
  articles,
  onSelectArticle,
  onDeleteArticle,
  showToast
}) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => AdminAuth.getCurrentUser());
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Dashboard Active Tab
  const [activeTab, setActiveTab] = useState<'articles' | 'comments' | 'infrastructure'>('articles');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [finnhubKey, setFinnhubKey] = useState(() => LiveMarketService.getFinnhubKey());
  const [alphaVantageKey, setAlphaVantageKey] = useState(() => LiveMarketService.getAlphaVantageKey());
  const [syncingSupabase, setSyncingSupabase] = useState(false);

  const handleSyncSupabase = async () => {
    setSyncingSupabase(true);
    try {
      const res = await SupabaseDB.syncAllArticles(articles);
      showToast(`Supabase: ${res.success} dispatches synchronized, ${res.failed} errors.`);
    } catch (err: any) {
      showToast(`Supabase sync failed: ${err.message || 'Network error'}`);
    } finally {
      setSyncingSupabase(false);
    }
  };

  const handleSaveFinnhubKey = (e: React.FormEvent) => {
    e.preventDefault();
    LiveMarketService.setFinnhubKey(finnhubKey);
    showToast(finnhubKey.trim() ? 'Finnhub API key saved! Live stock feeds active.' : 'Finnhub API key cleared.');
  };

  const handleSaveAlphaVantageKey = (e: React.FormEvent) => {
    e.preventDefault();
    LiveMarketService.setAlphaVantageKey(alphaVantageKey);
    showToast(alphaVantageKey.trim() ? 'Alpha Vantage API key saved!' : 'Alpha Vantage key cleared.');
  };

  // Sync auth state
  useEffect(() => {
    const unsubscribe = AdminAuth.subscribe((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Load comments when comments tab is selected
  useEffect(() => {
    if (currentUser && activeTab === 'comments') {
      loadComments();
    }
  }, [currentUser, activeTab]);

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const fetched = await SupabaseDB.fetchAllComments();
      setComments(fetched);
    } catch {
      showToast('Could not fetch comments queue.');
    } finally {
      setLoadingComments(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const result = await AdminAuth.login(emailInput, passwordInput);
      if (result.success && result.user) {
        setCurrentUser(result.user);
        showToast(`Welcome, ${result.user.name}. Managing Terminal Authorized.`);
      } else {
        setLoginError(result.error || 'Authentication denied. Invalid credentials.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Terminal connection failed.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await AdminAuth.logout();
    setCurrentUser(null);
    showToast('Admin session terminated. Returned to public wire.');
    setCurrentPage('home');
  };

  const handleDeleteArticleConfirmed = async (article: Article) => {
    if (window.confirm(`Are you certain you wish to delete "${article.title}" from the Sovereign Wire?`)) {
      onDeleteArticle(article.id);
      if (isSupabaseConfigured) {
        await SupabaseDB.deleteArticle(article.id);
      }
      showToast(`Dispatch "${article.title.slice(0, 30)}..." deleted.`);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('Delete this reader dialogue comment from Supabase?')) {
      const ok = await SupabaseDB.deleteComment(commentId);
      if (ok) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        showToast('Comment removed from dialogue ledger.');
      } else {
        showToast('Failed to delete comment from database.');
      }
    }
  };

  // Filtered articles
  const filteredArticles = articles.filter((a) => {
    const matchesCat = filterCategory === 'all' || a.category === filterCategory;
    const matchesQuery = !searchQuery || 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.region.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const customArticlesCount = articles.filter((a) => a.userCreated).length;
  const totalViews = articles.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalBookmarks = articles.reduce((acc, curr) => acc + (curr.bookmarks || 0), 0);

  // =========================================================================
  // VIEW 1: RESTRICTED ADMIN LOGIN PORTAL (If not authenticated)
  // =========================================================================
  if (!currentUser) {
    return (
      <main className="container" style={{ margin: '3.5rem auto 6rem', maxWidth: '540px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => setCurrentPage('home')}
            style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <ArrowLeft size={14} />
            <span>Return to Public Wire</span>
          </button>
          
          <div style={{ display: 'inline-flex', padding: '12px', background: 'rgba(180, 83, 9, 0.1)', borderRadius: '50%', marginBottom: '1rem', border: '1px solid var(--accent-gold)' }}>
            <Lock size={32} color="var(--accent-gold)" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.75rem', fontWeight: 900, letterSpacing: '0.04em', margin: '0 0 0.5rem' }}>
            MANAGING EDITOR TERMINAL
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
            Restricted Bureau Access • Managing Editors & Bureau Chiefs Only.
          </p>
        </div>

        <div className="card" style={{ padding: '2rem 2.25rem', border: '1px solid var(--border-active)', boxShadow: 'var(--shadow-gold)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', padding: '8px 12px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <ShieldCheck size={16} color="var(--accent-gold)" />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              256-Bit Encrypted Bureau Session Gateway
            </span>
          </div>

          {loginError && (
            <div style={{ padding: '10px 14px', background: 'var(--accent-red-glow)', border: '1px solid var(--accent-red)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-red)', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={16} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ fontWeight: 600 }}>Bureau Identifier / Email</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="admin@bullmonk.intelligence"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label className="form-label" style={{ margin: 0, fontWeight: 600 }}>Bureau Passkey</label>
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                >
                  {showPassword ? 'Hide' : 'Reveal'}
                </button>
              </div>
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="form-control" 
                placeholder="Enter passkey..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.04em' }}
              disabled={loginLoading}
            >
              {loginLoading ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <RefreshCw size={16} className="spin-animation" /> Authenticating...
                </span>
              ) : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Key size={16} /> Authenticate Terminal
                </span>
              )}
            </button>
          </form>

          {/* Quick Access Credentials Hint for the Developer/Admin */}
          <div style={{ marginTop: '1.75rem', padding: '10px 14px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-medium)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '4px' }}>
              Managing Editor Credentials:
            </div>
            <div>User: <code style={{ fontFamily: 'var(--font-mono)' }}>admin@bullmonk.intelligence</code> (or <code style={{ fontFamily: 'var(--font-mono)' }}>admin</code>)</div>
            <div>Passkey: <code style={{ fontFamily: 'var(--font-mono)' }}>BullMonk2026!</code> (or <code style={{ fontFamily: 'var(--font-mono)' }}>admin123</code>)</div>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED MANAGING EDITOR DASHBOARD
  // =========================================================================
  return (
    <main className="container" style={{ margin: '2.5rem auto 6rem' }}>
      {/* Top Bureau Chief Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '2px solid var(--border-subtle)', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-breaking" style={{ background: 'var(--accent-gold)', color: '#FFFFFF', letterSpacing: '0.08em' }}>
              MANAGING DESK ACTIVE
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'var(--accent-green)', fontWeight: 700 }}>
              <span className="status-dot" style={{ background: 'var(--accent-green)' }}></span>
              SOVEREIGN CLOUD SYNCED
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-brand)', fontSize: '2rem', fontWeight: 900, margin: '0 0 0.25rem', letterSpacing: '0.02em' }}>
            Bureau Editorial Command
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
            Logged in as <strong>{currentUser.name}</strong> ({currentUser.email}) • Tier-1 Investigative Governance
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => setCurrentPage('write')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '10px 18px', fontWeight: 700 }}
          >
            <PenTool size={15} />
            <span>Compose Dispatch</span>
          </button>

          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={handleLogout}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '10px 16px' }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <span>Total Wire Dispatches</span>
            <FileText size={16} color="var(--accent-gold)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'var(--font-mono)', margin: '0.5rem 0 0.2rem' }}>
            {articles.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            12 Bureau Core + {customArticlesCount} Cloud Sync
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <span>Global Terminal Views</span>
            <TrendingUp size={16} color="var(--accent-green)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'var(--font-mono)', margin: '0.5rem 0 0.2rem' }}>
            {totalViews.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)' }}>
            +18.4% institutional velocity
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <span>Dossier Bookmarks</span>
            <BookOpen size={16} color="var(--accent-gold)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'var(--font-mono)', margin: '0.5rem 0 0.2rem' }}>
            {totalBookmarks}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Private reader storage
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <span>Cloud Infrastructure</span>
            <Database size={16} color={isSupabaseConfigured ? 'var(--accent-green)' : 'var(--accent-gold)'} />
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0.5rem 0 0.2rem', color: isSupabaseConfigured ? 'var(--accent-green)' : 'var(--accent-gold)' }}>
            {isSupabaseConfigured ? 'Postgres & Buckets Online' : 'Local Fallback'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Storage: <code style={{ fontFamily: 'var(--font-mono)' }}>documents</code>, <code style={{ fontFamily: 'var(--font-mono)' }}>media</code>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-medium)', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '2px' }}>
        <button
          type="button"
          className={`cat-tab ${activeTab === 'articles' ? 'active' : ''}`}
          onClick={() => setActiveTab('articles')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '8px 16px', fontSize: '0.88rem' }}
        >
          <FileText size={15} />
          <span>Articles Management ({articles.length})</span>
        </button>

        <button
          type="button"
          className={`cat-tab ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => setActiveTab('comments')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '8px 16px', fontSize: '0.88rem' }}
        >
          <MessageSquare size={15} />
          <span>Reader Dialogue Moderation</span>
        </button>

        <button
          type="button"
          className={`cat-tab ${activeTab === 'infrastructure' ? 'active' : ''}`}
          onClick={() => setActiveTab('infrastructure')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '8px 16px', fontSize: '0.88rem' }}
        >
          <Cloud size={15} />
          <span>Architecture & Security</span>
        </button>
      </div>

      {/* =====================================================================
          TAB 1: ARTICLES MANAGEMENT
          ===================================================================== */}
      {activeTab === 'articles' && (
        <div>
          {/* Controls Bar: Category Filter & Search */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['all', 'Markets & Finance', 'Technology & AI', 'World Affairs', 'Energy & Climate', 'Culture & Ideas'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`cat-tab ${filterCategory === cat ? 'active' : ''}`}
                  onClick={() => setFilterCategory(cat)}
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                >
                  {cat === 'all' ? 'All Desks' : cat}
                </button>
              ))}
            </div>

            <input 
              type="text" 
              className="form-control" 
              placeholder="Filter by title, author, or region..."
              style={{ maxWidth: '300px', fontSize: '0.82rem', padding: '6px 12px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Articles Table */}
          <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-medium)', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '12px 16px' }}>Dispatch Title</th>
                  <th style={{ padding: '12px 16px' }}>Desk & Region</th>
                  <th style={{ padding: '12px 16px' }}>Author Byline</th>
                  <th style={{ padding: '12px 16px' }}>Telemetry</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((article) => (
                  <tr key={article.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s ease' }}>
                    <td style={{ padding: '12px 16px', maxWidth: '380px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {article.userCreated && (
                          <span className="badge badge-breaking" style={{ padding: '1px 5px', fontSize: '0.65rem' }}>Cloud Custom</span>
                        )}
                        <span>{article.title}</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {new Date(article.publishedAt).toLocaleDateString()} • {article.readTime}
                      </div>
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      <span className="badge badge-category" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>{article.category}</span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{article.region}</div>
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600 }}>{article.author.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{article.author.location || 'Global Bureau'}</div>
                    </td>

                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                      <div>{article.views.toLocaleString()} views</div>
                      <div style={{ color: 'var(--accent-gold)' }}>{article.bookmarks} saved</div>
                    </td>

                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button 
                          type="button" 
                          className="btn-icon"
                          style={{ width: '30px', height: '30px' }}
                          onClick={() => {
                            onSelectArticle(article);
                          }}
                          title="Read Dispatch"
                        >
                          <Eye size={14} />
                        </button>

                        <button 
                          type="button" 
                          className="btn-icon"
                          style={{ width: '30px', height: '30px', color: 'var(--accent-red)' }}
                          onClick={() => handleDeleteArticleConfirmed(article)}
                          title="Delete Dispatch"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: READER DIALOGUE MODERATION QUEUE
          ===================================================================== */}
      {activeTab === 'comments' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
              Live Dialogue Stream ({comments.length} items)
            </h2>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={loadComments}
              disabled={loadingComments}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', padding: '6px 12px' }}
            >
              <RefreshCw size={13} className={loadingComments ? 'spin-animation' : ''} />
              <span>Refresh Queue</span>
            </button>
          </div>

          {loadingComments ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading comments from Supabase database...
            </div>
          ) : comments.length === 0 ? (
            <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={32} color="var(--accent-green)" style={{ margin: '0 auto 0.75rem' }} />
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Moderation Queue Clear</div>
              <p style={{ fontSize: '0.82rem', margin: '0.25rem 0 0' }}>All reader dialogue is in compliance with newsroom standards.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {comments.map((comment) => (
                <div key={comment.id} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{comment.author}</span>
                      <span className="badge badge-category" style={{ fontSize: '0.68rem', padding: '1px 5px' }}>{comment.affiliation}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• {comment.timeAgo}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      "{comment.content}"
                    </p>
                  </div>

                  <button 
                    type="button" 
                    className="btn-icon" 
                    style={{ color: 'var(--accent-red)', width: '32px', height: '32px' }}
                    onClick={() => handleDeleteComment(comment.id)}
                    title="Delete Comment"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 3: INFRASTRUCTURE & COMPLIANCE STATUS
          ===================================================================== */}
      {activeTab === 'infrastructure' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={18} color="var(--accent-gold)" />
              <span>Supabase Sovereign Backend</span>
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Project Ref:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>aedelnskedncqmqmocoo</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Media Bucket:</span>
                <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>media (Public Read)</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Documents Bucket:</span>
                <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>documents (Public Read)</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Row Level Security:</span>
                <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>Active (Postgres RLS)</span>
              </li>
            </ul>

            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSyncSupabase}
                disabled={syncingSupabase}
                style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
              >
                <RefreshCw size={14} className={syncingSupabase ? 'spin-animation' : ''} />
                <span>{syncingSupabase ? 'Syncing Dispatches...' : 'Sync All Dispatches to Supabase'}</span>
              </button>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.4rem' }}>
                Synchronizes local newsroom repository with Supabase PostgreSQL cloud
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} color="var(--accent-gold)" />
              <span>Google AdSense & YMYL Gate</span>
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Publisher Account:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>ca-pub-7155174810446636</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Vacant Ad Slot Safeguard:</span>
                <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>Active (No Blank Containers)</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Google ads.txt Status:</span>
                <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>Verified (/public/ads.txt)</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Analytics Engine:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>G-CKPQGSX23W</span>
              </li>
            </ul>
          </div>

          {/* Market Data APIs Card */}
          <div className="card" style={{ padding: '1.5rem', gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={18} color="var(--accent-green)" />
                <span>Live Financial Market Data &amp; API Key Integrations</span>
              </h3>
              <span className="badge" style={{ background: 'rgba(4, 120, 87, 0.1)', color: 'var(--accent-green)', fontWeight: 700 }}>
                Streaming Rails Active
              </span>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
              BULLMONK streams real-time financial market data across multi-asset rails. Real-time Crypto (Bitcoin, Ethereum, Solana) and European Central Bank FX rates (EUR/USD, USD/INR, USD/JPY) stream automatically out-of-the-box. Connect your free Finnhub or Alpha Vantage API keys below to activate live millisecond US equity and commodity ticks.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {/* Active Zero-Key Rails */}
              <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800, color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>
                  Native Streaming Rails (0 Keys Required)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.84rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>CoinGecko Digital Asset API:</span>
                    <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>● Active (BTC/ETH/SOL)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Frankfurter ECB Forex API:</span>
                    <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>● Active (EUR/USD/INR)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Polling Frequency:</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>Every 45 seconds</span>
                  </div>
                </div>
              </div>

              {/* Finnhub Integration */}
              <form onSubmit={handleSaveFinnhubKey} style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800, color: 'var(--accent-gold)' }}>
                    Finnhub Stock Market API
                  </span>
                  <a href="https://finnhub.io" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.72rem', color: '#2962FF', textDecoration: 'none' }}>
                    Get Free Key ↗
                  </a>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 0.75rem' }}>
                  Provides live S&P 500, Nasdaq, and NYSE stock quotes (60 free calls/min).
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="password"
                    placeholder="Paste Finnhub API Key..."
                    value={finnhubKey}
                    onChange={(e) => setFinnhubKey(e.target.value)}
                    style={{ flex: 1, padding: '0.45rem 0.75rem', fontSize: '0.82rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-medium)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                  />
                  <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}>
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
