import React from 'react';
import { PageView } from '../types';
import { Home, ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  page?: PageView;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  setCurrentPage?: (page: PageView) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, setCurrentPage }) => {
  const handleClick = (item: BreadcrumbItem, e: React.MouseEvent) => {
    if (item.active) {
      e.preventDefault();
      return;
    }
    if (item.onClick) {
      e.preventDefault();
      item.onClick();
    } else if (item.page && setCurrentPage) {
      e.preventDefault();
      setCurrentPage(item.page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getUrl = (item: BreadcrumbItem, isHome = false): string => {
    if (isHome) return 'https://govtnaukri4u.com/';
    if (item.href) return item.href;
    if (item.page) {
      return item.page === 'home' 
        ? 'https://govtnaukri4u.com/' 
        : `https://govtnaukri4u.com/#${item.page}`;
    }
    return `https://govtnaukri4u.com/#${encodeURIComponent(item.label.toLowerCase().replace(/\s+/g, '-'))}`;
  };

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="bm-breadcrumbs"
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.45rem',
        fontSize: '0.82rem',
        color: 'var(--text-muted)',
        marginBottom: '1.5rem',
        padding: '0.5rem 0',
      }}
    >
      <ol 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '0.45rem', 
          listStyle: 'none', 
          padding: 0, 
          margin: 0 
        }}
        itemScope 
        itemType="https://schema.org/BreadcrumbList"
      >
        {/* Base Home item */}
        <li 
          itemProp="itemListElement" 
          itemScope 
          itemType="https://schema.org/ListItem"
          style={{ display: 'inline-flex', alignItems: 'center' }}
        >
          <a
            href="https://govtnaukri4u.com/"
            itemProp="item"
            className="breadcrumb-link"
            onClick={(e) => handleClick({ label: 'Home Wire', page: 'home' }, e)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'none',
              border: 'none',
              padding: '0.2rem 0.35rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              borderRadius: 'var(--radius-xs)',
              textDecoration: 'none',
              transition: 'color var(--transition-fast)'
            }}
            aria-label="Navigate to Home Wire"
          >
            <Home size={13} style={{ color: 'var(--accent-gold)' }} />
            <span itemProp="name">Home Wire</span>
          </a>
          <link itemProp="item" href="https://govtnaukri4u.com/" />
          <meta itemProp="position" content="1" />
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1 || item.active;
          const position = index + 2;
          const targetUrl = getUrl(item);

          return (
            <li 
              key={`${item.label}-${index}`}
              itemProp="itemListElement" 
              itemScope 
              itemType="https://schema.org/ListItem"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
            >
              <ChevronRight size={12} style={{ color: 'var(--border-medium)', flexShrink: 0 }} aria-hidden="true" />
              
              {isLast ? (
                <a 
                  href={targetUrl}
                  itemProp="item"
                  aria-current="page"
                  onClick={(e) => handleClick(item, e)}
                  style={{ 
                    fontWeight: 700, 
                    color: 'var(--text-primary)',
                    letterSpacing: '0.01em',
                    textDecoration: 'none',
                    cursor: 'default',
                    display: 'inline-flex',
                    alignItems: 'center'
                  }}
                >
                  <span itemProp="name">{item.label}</span>
                </a>
              ) : (
                <a
                  href={targetUrl}
                  itemProp="item"
                  className="breadcrumb-link"
                  onClick={(e) => handleClick(item, e)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0.2rem 0.35rem',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: 'inherit',
                    fontFamily: 'inherit',
                    borderRadius: 'var(--radius-xs)',
                    textDecoration: 'none',
                    transition: 'color var(--transition-fast)',
                    display: 'inline-flex',
                    alignItems: 'center'
                  }}
                >
                  <span itemProp="name">{item.label}</span>
                </a>
              )}
              <link itemProp="item" href={targetUrl} />
              <meta itemProp="position" content={String(position)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
