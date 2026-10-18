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

// Asynchronous Route Splitting for 95+ PageSpeed & Low Initial Payload
const ArticleReaderPage = lazy(() => import('./pages/ArticleReaderPage').then(m => ({ default: m.ArticleReaderPage })));
const FinancialToolsPage = lazy(() => import('./pages/FinancialToolsPage').then(m => ({ default: m.FinancialToolsPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const LegalPage = lazy(() => import('./pages/LegalPage').then(m => ({ default: m.LegalPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const FinancialDisclaimerPage = lazy(() => import('./pages/FinancialDisclaimerPage').then(m => ({ default: m.FinancialDisclaimerPage })));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage').then(m => ({ default: m.TermsOfServicePage })));
const EditorialStandardsPage = lazy(() => import('./pages/EditorialStandardsPage').then(m => ({ default: m.EditorialStandardsPage })));
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage').then(m => ({ default: m.CookiePolicyPage })));
const CorrectionsPage = lazy(() => import('./pages/CorrectionsPage').then(m => ({ default: m.CorrectionsPage })));

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

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageView;
      const validPages: PageView[] = [
        'home', 'about', 'contact', 'tools', 'legal', 
        'privacy', 'terms', 'disclaimer', 'editorial', 'cookies', 'corrections'
      ];
      if (validPages.includes(hash)) {
        setCurrentPage(hash);
      }
    };

    // Check hash on initial load
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleBookmark = (id: string) => {
    const isNowSaved = BullMonkStorage.toggleBookmark(id);
    setArticles([...BullMonkStorage.getAllArticles()]);
    showToast(isNowSaved ? 'Story added to private reading dossier' : 'Story removed from reading dossier');
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
      <Footer setCurrentPage={navigateToPage} setSelectedCategory={setSelectedCategory} />

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
