import React, { useState, useEffect } from 'react';
import { PageView, Article } from './types';
import { BullMonkStorage, MARKET_TICKERS } from './data/newsData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ArticleReaderPage } from './pages/ArticleReaderPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { FinancialDisclaimerPage } from './pages/FinancialDisclaimerPage';
import { EditorialStandardsPage } from './pages/EditorialStandardsPage';
import { CookiePolicyPage } from './pages/CookiePolicyPage';
import { CorrectionsPage } from './pages/CorrectionsPage';
import { FinancialToolsPage } from './pages/FinancialToolsPage';
import { SearchModal } from './components/SearchModal';
import { AudioDock } from './components/AudioDock';
import { Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
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

  // Initialize articles and theme
  useEffect(() => {
    const loaded = BullMonkStorage.getAllArticles();
    setArticles(loaded);
    if (loaded.length > 0) {
      setSelectedArticle(loaded[0]);
    }

    const savedTheme = (localStorage.getItem('BULLMONK_REACT_THEME') as 'dark' | 'light') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Theme switch
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('BULLMONK_REACT_THEME', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
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
