import React, { useState } from 'react';
import { List, ChevronDown, ChevronUp, BookmarkCheck } from 'lucide-react';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
  activeId: string;
  onItemClick: (id: string) => void;
  readTime?: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  items,
  activeId,
  onItemClick,
  readTime
}) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav 
      className="toc-container"
      aria-label="Article Table of Contents"
      style={{
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem 1.5rem',
        margin: '2rem 0',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all var(--transition-fast)'
      }}
    >
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none'
        }}
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        aria-expanded={isOpen}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: 'var(--accent-gold-glow)',
            color: 'var(--accent-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <List size={16} />
          </div>
          <div>
            <span style={{ 
              fontWeight: 800, 
              fontSize: '0.86rem', 
              letterSpacing: '0.06em', 
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-brand)'
            }}>
              Table of Contents
            </span>
            {readTime && (
              <span style={{ 
                fontSize: '0.72rem', 
                color: 'var(--text-muted)', 
                marginLeft: '0.6rem',
                fontFamily: 'var(--font-mono)'
              }}>
                • {readTime}
              </span>
            )}
          </div>
        </div>

        <button 
          type="button"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
          aria-label={isOpen ? 'Collapse Table of Contents' : 'Expand Table of Contents'}
        >
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {isOpen && (
        <ol style={{
          listStyle: 'none',
          padding: 0,
          margin: '1rem 0 0 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '0.85rem'
        }}>
          {items.map((item, index) => {
            const isActive = activeId === item.id;
            return (
              <li 
                key={item.id}
                style={{
                  paddingLeft: item.level === 3 ? '1.25rem' : '0'
                }}
              >
                <button
                  type="button"
                  onClick={() => onItemClick(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    textAlign: 'left',
                    background: isActive ? 'var(--bg-surface)' : 'transparent',
                    border: 'none',
                    borderLeft: isActive ? '3px solid var(--accent-gold)' : '3px solid transparent',
                    padding: '0.4rem 0.65rem',
                    borderRadius: '0 4px 4px 0',
                    color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: item.level === 3 ? '0.84rem' : '0.88rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ 
                    fontFamily: 'var(--font-mono)', 
                    fontSize: '0.72rem', 
                    opacity: 0.6,
                    minWidth: '18px'
                  }}>
                    {index + 1}.
                  </span>
                  <span style={{ flex: 1 }}>{item.text}</span>
                  {isActive && <BookmarkCheck size={13} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />}
                </button>
              </li>
            );
          })}
        </ol>
      )}
    </nav>
  );
};
