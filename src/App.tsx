import React, { useState, useEffect } from 'react';
import { PageView, Article } from './types';
import { BullMonkStorage, MARKET_TICKERS } from './data/newsData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { WriteStudioPage } from './pages/WriteStudioPage';
import { ArticleReaderPage } from './pages/ArticleReaderPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';
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

  const handlePublish = (articleData: Partial<Article>) => {
    const created = BullMonkStorage.addArticle(articleData);
    const updated = BullMonkStorage.getAllArticles();
    setArticles(updated);
    setSelectedArticle(created);
    setCurrentPage('article');
    showToast('Success! Story broadcasted live to BullMonk Global Wire.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteArticle = (id: string) => {
    BullMonkStorage.deleteArticle(id);
    const updated = BullMonkStorage.getAllArticles();
    setArticles(updated);
    showToast('Article retracted from publication database.');
    if (selectedArticle?.id === id) {
      setSelectedArticle(updated[0] || null);
      setCurrentPage('home');
    }
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
        setCurrentPage={setCurrentPage}
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
        />
      )}

      {currentPage === 'write' && (
        <WriteStudioPage 
          onPublish={handlePublish}
          onSelectArticle={handleSelectArticle}
          publishedArticles={articles}
          onDeleteArticle={handleDeleteArticle}
          onBackToWire={() => setCurrentPage('home')}
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
          onBackToWire={() => setCurrentPage('home')}
          showToast={showToast}
        />
      )}

      {currentPage === 'about' && (
        <AboutPage setCurrentPage={setCurrentPage} />
      )}

      {currentPage === 'contact' && (
        <ContactPage setCurrentPage={setCurrentPage} showToast={showToast} />
      )}

      {currentPage === 'legal' && (
        <LegalPage setCurrentPage={setCurrentPage} />
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
      <Footer setCurrentPage={setCurrentPage} setSelectedCategory={setSelectedCategory} />

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
