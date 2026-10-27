import React, { useState, useEffect, Suspense, lazy } from 'react';
import { PageView, Article } from './types';
import { BullMonkStorage, MARKET_TICKERS } from './data/newsData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { SearchModal } from './components/SearchModal';
import { AudioDock } from './components/AudioDock';
import { Sparkles } from 'lucide-react';
import { initWebMCPTools } from './utils/webmcp';
import { SupabaseDB } from './utils/supabase';
import { AdminAuth } from './utils/adminAuth';

// Asynchronous Route Splitting for 95+ PageSpeed & Low Initial Payload
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const WriteStudioPage = lazy(() => import('./pages/WriteStudioPage').then(m => ({ default: m.WriteStudioPage })));
const ArticleReaderPage = lazy(() => import('./pages/ArticleReaderPage').then(m => ({ default: m.ArticleReaderPage })));
const FinancialToolsPage = lazy(() => import('./pages/FinancialToolsPage').then(m => ({ default: m.FinancialToolsPage })));
const DocumentToolsPage = lazy(() => import('./pages/DocumentToolsPage').then(m => ({ default: m.DocumentToolsPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const LegalPage = lazy(() => import('./pages/LegalPage').then(m => ({ default: m.LegalPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const FinancialDisclaimerPage = lazy(() => import('./pages/FinancialDisclaimerPage').then(m => ({ default: m.FinancialDisclaimerPage })));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage').then(m => ({ default: m.TermsOfServicePage })));
const EditorialStandardsPage = lazy(() => import('./pages/EditorialStandardsPage').then(m => ({ default: m.EditorialStandardsPage })));
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage').then(m => ({ default: m.CookiePolicyPage })));
const CorrectionsPage = lazy(() => import('./pages/CorrectionsPage').then(m => ({ default: m.CorrectionsPage })));

export const PAGE_TITLES: Record<PageView, string> = {
  home: "BULLMONK | Global News, Geopolitical Intelligence & Financial Truth",
  article: "Global Dispatch | BULLMONK Intelligence",
  tools: "Sovereign Quantitative Financial Suite & Yield Calculators | BULLMONK",
  'doc-tools': "PDF Studio & Client-Side Document Security Suite | BULLMONK",
  about: "About BULLMONK | Editorial Board, Leadership & International Bureaus",
  contact: "Contact BULLMONK | Editorial Bureau Directory & Secure Leaks",
  legal: "Master Compliance Hub & International Regulatory Framework | BULLMONK",
  privacy: "Privacy Policy & Google AdSense Publisher Disclosures | BULLMONK",
  terms: "Terms of Service & AI Content Moratorium | BULLMONK Legal",
  disclaimer: "YMYL Financial Disclaimer & Capital Risk Disclosures | BULLMONK",
  editorial: "Editorial Standards, Sourcing & 72-Hour Trading Moratorium | BULLMONK",
  cookies: "Cookie Policy & Interactive Client-Side Consent Manager | BULLMONK",
  corrections: "Corrections Protocol & Public Errata Log | BULLMONK Newsroom",
  write: "Dispatch Drafting Studio & Editorial Filing Console | BULLMONK",
  admin: "Editorial Command Terminal & Bureau Operations Console | BULLMONK"
};

export const PAGE_DESCRIPTIONS: Record<PageView, string> = {
  home: "BullMonk delivers unfiltered global journalism, macroeconomics, geopolitical dispatches, semiconductor diplomacy, and deep analytical columns from world bureaus.",
  article: "Deep investigative reporting, macroeconomic forensic data, and sovereign intelligence from BULLMONK international correspondents.",
  tools: "Quantitative financial tools including Sovereign Real Yield, Bond Duration, Inflation Purchasing Power, and PPP FX Arbitrage valuation models.",
  'doc-tools': "High-precision client-side document processing, PDF conversion, image super-resolution, and secure local file triage.",
  about: "BULLMONK international newsroom, editorial leadership, charter of editorial independence, and global bureau locations.",
  contact: "Official communication channels, international bureau phone lines, press syndication desk, and cryptographic whistleblower submission gateway.",
  legal: "Central compliance and governance directory for BULLMONK International Intelligence Group.",
  privacy: "Comprehensive privacy framework detailing GDPR, CCPA, and Google AdSense third-party cookie and advertisement disclosures.",
  terms: "Terms of service, fair-use quotation allowance, prohibited AI scraping policies, and dispute resolution mechanisms.",
  disclaimer: "Crucial regulatory financial dispatches disclaimer regarding non-advisory journalism and market volatility warnings.",
  editorial: "Newsroom ethics, mandatory two-source verification protocol, commercial separation, and 72-hour financial trading moratorium.",
  cookies: "Client-side consent management console and detailed audit table of essential and analytical cookies.",
  corrections: "Transparent errata procedure, retraction protocols, and publicly logged corrections log.",
  write: "Authoring studio for accredited correspondents and sovereign analysts filing verified field dispatches.",
  admin: "Managing editor administrative terminal for headline review, wire curation, and author credential management."
};

const PAGE_CANONICALS: Record<PageView, string> = {
  home: 'https://bullmonk.live/',
  article: 'https://bullmonk.live/',
  tools: 'https://bullmonk.live/tools',
  'doc-tools': 'https://bullmonk.live/doc-tools',
  about: 'https://bullmonk.live/about',
  contact: 'https://bullmonk.live/contact',
  legal: 'https://bullmonk.live/legal',
  privacy: 'https://bullmonk.live/privacy',
  terms: 'https://bullmonk.live/terms',
  disclaimer: 'https://bullmonk.live/disclaimer',
  editorial: 'https://bullmonk.live/editorial',
  cookies: 'https://bullmonk.live/cookies',
  corrections: 'https://bullmonk.live/corrections',
  write: 'https://bullmonk.live/#write',
  admin: 'https://bullmonk.live/#admin'
};

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [articles, setArticles] = useState<Article[]>(() => BullMonkStorage.getAllArticles());
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(() => {
    const loaded = BullMonkStorage.getAllArticles();
    return loaded.length > 0 ? loaded[0] : null;
  });
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('BULLMONK_REACT_THEME') as 'dark' | 'light') || 'light';
    }
    return 'light';
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);

  // Search Modal state
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Audio Dock state
  const [audioArticle, setAudioArticle] = useState<Article | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // URL Hash synchronization
  const navigateToPage = (page: PageView) => {
    setCurrentPage(page);
    if (page === 'home') {
      history.pushState(null, '', window.location.pathname + window.location.search);
    } else {
      window.location.hash = page;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Synchronize document.title, OpenGraph, and meta descriptions across all page transitions
  useEffect(() => {
    let title = PAGE_TITLES[currentPage] || "BULLMONK | Global News & Macro Intelligence";
    let desc = PAGE_DESCRIPTIONS[currentPage] || "Unfiltered global journalism, financial intelligence, and geopolitical dispatches.";

    if (currentPage === 'article' && selectedArticle) {
      title = `${selectedArticle.title} | BULLMONK Intelligence`;
      if (selectedArticle.deck) desc = selectedArticle.deck;
    }

    document.title = title;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', desc);

    const canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonicalLink) {
      if (currentPage === 'article' && selectedArticle) {
        canonicalLink.href = `https://bullmonk.live/article/${selectedArticle.id}`;
      } else {
        canonicalLink.href = PAGE_CANONICALS[currentPage] || 'https://bullmonk.live/';
      }
    }
  }, [currentPage, selectedArticle]);

  useEffect(() => {
    const handleNavigation = () => {
      const hash = window.location.hash.replace(/^#\/?/, '') as PageView;
      const pathname = window.location.pathname.replace(/^\//, '').replace(/\/$/, '') as PageView;

      const validPages: PageView[] = [
        'home', 'admin', 'write', 'about', 'contact', 'tools', 'doc-tools', 'legal', 
        'privacy', 'terms', 'disclaimer', 'editorial', 'cookies', 'corrections'
      ];

      // Handle article deep links e.g. /article/bm-nuc-018 or #article/bm-nuc-018/slug
      const raw = window.location.hash || window.location.pathname;
      const match = raw.match(/article\/([^/?#]+)(?:\/([^/?#]+))?/);
      if (match) {
        const p1 = match[1];
        const p2 = match[2];
        const found = articles.find((a) => a.id === p1 || a.slug === p1 || (p2 && (a.id === p2 || a.slug === p2)));
        if (found) {
          setSelectedArticle(found);
          setCurrentPage('article');
          return;
        }
      }

      if (validPages.includes(hash)) {
        setCurrentPage(hash);
      } else if (validPages.includes(pathname)) {
        setCurrentPage(pathname);
      }
    };

    // Check on initial load
    handleNavigation();

    window.addEventListener('hashchange', handleNavigation);
    window.addEventListener('popstate', handleNavigation);
    return () => {
      window.removeEventListener('hashchange', handleNavigation);
      window.removeEventListener('popstate', handleNavigation);
    };
  }, [articles]);

  // Admin Session State
  const [adminUser, setAdminUser] = useState(() => AdminAuth.getCurrentUser());

  useEffect(() => {
    const unsubscribe = AdminAuth.subscribe((user) => setAdminUser(user));
    return () => unsubscribe();
  }, []);

  // Synchronize remote community and sovereign articles from Supabase DB
  useEffect(() => {
    const syncSupabaseArticles = async () => {
      try {
        const remoteArticles = await SupabaseDB.fetchArticles();
        if (remoteArticles && remoteArticles.length > 0) {
          setArticles((prev) => {
            const existingIds = new Set(prev.map((a) => a.id));
            const uniqueRemote = remoteArticles.filter((a) => !existingIds.has(a.id));
            return [...uniqueRemote, ...prev];
          });
        }
      } catch (err) {
        console.warn('Supabase articles sync silent fallback:', err);
      }
    };
    syncSupabaseArticles();
  }, []);

  // Theme attribute synchronization
  useEffect(() => {
    const savedTheme = (localStorage.getItem('BULLMONK_REACT_THEME') as 'dark' | 'light') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', savedTheme === 'dark' ? '#080C14' : '#F8F9FA');

    // Register WebMCP Tools for in-browser AI agents
    initWebMCPTools(
      (query) => {
        navigateToPage('home');
      },
      (page) => {
        navigateToPage(page as PageView);
      }
    );
  }, []);

  // Theme switch
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('BULLMONK_REACT_THEME', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    document.body.setAttribute('data-theme', nextTheme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', nextTheme === 'dark' ? '#080C14' : '#F8F9FA');
    showToast(`Switched to ${nextTheme === 'dark' ? 'Night Terminal' : 'Prestige Paper'} edition`);
  };

  // Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3800);
  };

  // Reading Progress Bar
  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global Audio Briefing trigger
  const handleStartAudioBriefing = (article: Article) => {
    setAudioArticle(article);
    setIsAudioPlaying(true);
    showToast(`Streaming audio briefing: ${article.title.slice(0, 40)}...`);
  };

  // Handlers
  const handleSelectArticle = (article: Article) => {
    BullMonkStorage.incrementViews(article.id);
    setSelectedArticle(article);
    setCurrentPage('article');
    const slug = article.slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    window.location.hash = `article/${article.id}/${slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleBookmark = (id: string) => {
    const isNowSaved = BullMonkStorage.toggleBookmark(id);
    setArticles([...BullMonkStorage.getAllArticles()]);
    showToast(isNowSaved ? 'Story added to private reading dossier' : 'Story removed from reading dossier');
  };

  const handlePublish = async (newArticleData: Partial<Article>) => {
    const fullArticle: Article = {
      id: `art-${Date.now()}`,
      slug: (newArticleData.title || 'dispatch')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      title: newArticleData.title || 'Untitled Dispatch',
      deck: newArticleData.deck || '',
      category: newArticleData.category || 'Markets & Finance',
      region: newArticleData.region || 'Global',
      content: newArticleData.content || '',
      keyTakeaways: newArticleData.keyTakeaways || [],
      author: newArticleData.author || {
        name: 'BullMonk Correspondent',
        title: 'Senior Financial Analyst',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        location: 'Global Bureau'
      },
      publishedAt: new Date().toISOString(),
      readTime: `${Math.max(3, Math.ceil((newArticleData.content || '').split(' ').length / 200))} min read`,
      heroImage: newArticleData.heroImage || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
      imageCaption: newArticleData.imageCaption || 'BullMonk Sovereign Wire Dispatch.',
      featured: newArticleData.featured ?? true,
      breaking: newArticleData.breaking ?? false,
      tags: newArticleData.tags || ['Global Macro'],
      views: 0,
      bookmarks: 0,
      userCreated: true
    };

    BullMonkStorage.addArticle(fullArticle);
    setArticles(BullMonkStorage.getAllArticles());

    try {
      const saved = await SupabaseDB.saveArticle(fullArticle);
      if (saved) {
        showToast('Dispatch published and securely archived in Supabase Cloud.');
      } else {
        showToast('Dispatch published to local news wire.');
      }
    } catch {
      showToast('Dispatch published to local news wire.');
    }

    setSelectedArticle(fullArticle);
    navigateToPage('article');
  };

  const handleDeleteArticle = (id: string) => {
    BullMonkStorage.deleteArticle(id);
    setArticles(BullMonkStorage.getAllArticles());
    showToast('Dispatch removed from editorial ledger.');
  };

  return (
    <>
      {/* Top Reading Progress Bar */}
      <div className="reading-bar" style={{ width: `${readingProgress}%` }} />

      {/* Navigation */}
      <Navbar 
        currentPage={currentPage}
        setCurrentPage={navigateToPage}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        tickers={MARKET_TICKERS}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenSearch={() => setIsSearchOpen(true)}
        adminUser={adminUser}
      />

      {/* Dynamic Page Routing */}
      {currentPage === 'home' && (
        <HomePage 
          articles={articles}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onSelectArticle={handleSelectArticle}
          onToggleBookmark={handleToggleBookmark}
          isBookmarked={(id) => BullMonkStorage.isBookmarked(id)}
          onStartAudioBriefing={handleStartAudioBriefing}
          showToast={showToast}
          onNavigateToTools={() => navigateToPage('tools')}
          onNavigateToDocTools={() => navigateToPage('doc-tools')}
        />
      )}

      <Suspense fallback={
        <div style={{ padding: '6rem 2rem', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <div className="status-dot" style={{ width: '10px', height: '10px', background: 'var(--accent-gold)' }}></div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
            DECRYPTING DISPATCH DOSSIER...
          </span>
        </div>
      }>
        {/* Managing Editor & Bureau Command Center */}
        {currentPage === 'admin' && (
          <AdminDashboardPage 
            setCurrentPage={navigateToPage}
            articles={articles}
            onSelectArticle={handleSelectArticle}
            onDeleteArticle={handleDeleteArticle}
            showToast={showToast}
          />
        )}

        {/* Restricted Write Studio for Admin */}
        {currentPage === 'write' && (
          <WriteStudioPage 
            onPublish={handlePublish}
            onSelectArticle={handleSelectArticle}
            publishedArticles={articles.filter(a => a.userCreated)}
            onDeleteArticle={handleDeleteArticle}
            onBackToWire={() => navigateToPage('home')}
            onNavigateToAdmin={() => navigateToPage('admin')}
            showToast={showToast}
          />
        )}

        {currentPage === 'article' && selectedArticle && (
          <ArticleReaderPage 
            article={selectedArticle}
            relatedArticles={articles.filter((a) => a.id !== selectedArticle.id && a.category === selectedArticle.category)}
            onSelectArticle={handleSelectArticle}
            onToggleBookmark={handleToggleBookmark}
            isBookmarked={BullMonkStorage.isBookmarked(selectedArticle.id)}
            onBackToWire={() => navigateToPage('home')}
            showToast={showToast}
            onNavigateToTools={() => navigateToPage('tools')}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage setCurrentPage={navigateToPage} />
        )}

        {currentPage === 'contact' && (
          <ContactPage setCurrentPage={navigateToPage} showToast={showToast} />
        )}

        {/* Quantitative & Macro Intelligence Tools Suite */}
        {currentPage === 'tools' && (
          <FinancialToolsPage setCurrentPage={navigateToPage} showToast={showToast} />
        )}

        {/* Document & Media AI Utilities Suite */}
        {currentPage === 'doc-tools' && (
          <DocumentToolsPage setCurrentPage={navigateToPage} showToast={showToast} />
        )}

        {/* Legal & Compliance Suite Portal Hub */}
        {currentPage === 'legal' && (
          <LegalPage setCurrentPage={navigateToPage} />
        )}

        {/* 6 Dedicated Separate Legal Pages */}
        {currentPage === 'privacy' && (
          <PrivacyPolicyPage setCurrentPage={navigateToPage} />
        )}

        {currentPage === 'disclaimer' && (
          <FinancialDisclaimerPage setCurrentPage={navigateToPage} />
        )}

        {currentPage === 'terms' && (
          <TermsOfServicePage setCurrentPage={navigateToPage} />
        )}

        {currentPage === 'editorial' && (
          <EditorialStandardsPage setCurrentPage={navigateToPage} />
        )}

        {currentPage === 'cookies' && (
          <CookiePolicyPage setCurrentPage={navigateToPage} showToast={showToast} />
        )}

        {currentPage === 'corrections' && (
          <CorrectionsPage setCurrentPage={navigateToPage} />
        )}
      </Suspense>

      {/* Global Command Palette / Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        articles={articles}
        onSelectArticle={handleSelectArticle}
      />

      {/* Floating Audio Briefing Dock */}
      <AudioDock 
        article={audioArticle}
        isPlaying={isAudioPlaying}
        onTogglePlay={() => setIsAudioPlaying(!isAudioPlaying)}
        onClose={() => {
          setIsAudioPlaying(false);
          setAudioArticle(null);
        }}
        onOpenArticle={handleSelectArticle}
      />

      {/* Footer */}
      <Footer 
        setCurrentPage={navigateToPage} 
        setSelectedCategory={setSelectedCategory}
        adminUser={adminUser}
      />

      {/* Toast Notification Box */}
      {toastMessage && (
        <div className="toast-box">
          <Sparkles size={16} color="var(--accent-gold)" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
};

export default App;
