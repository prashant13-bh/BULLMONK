import React, { useState, useEffect } from 'react';
import { MarketTicker } from '../types';
import { LiveMarketService } from '../utils/liveMarketService';
import { TRADINGVIEW_AFFILIATE_URL } from './TradingViewBanner';
import { TrendingUp, RefreshCw, Radio, ExternalLink, ShieldCheck } from 'lucide-react';

interface MarketTickerBarProps {
  initialTickers: MarketTicker[];
  className?: string;
}

export const MarketTickerBar: React.FC<MarketTickerBarProps> = ({ 
  initialTickers,
  className = '' 
}) => {
  const [tickers, setTickers] = useState<MarketTicker[]>(initialTickers);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [liveSourceCount, setLiveSourceCount] = useState<number>(2);

  // Helper to render SVG mini sparkline polyline points
  const generateSvgPoints = (data: number[], width = 38, height = 14) => {
    if (!data || data.length === 0) return '';
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    return data
      .map((val, idx) => {
        const x = (idx / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 3) - 1.5;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  };

  const refreshMarketData = async () => {
    setIsRefreshing(true);
    try {
      const res = await LiveMarketService.fetchLiveTickers();
      setTickers(res.tickers);
      setLastUpdated(res.lastUpdated);
      setLiveSourceCount(res.sourceCount);
    } catch (e) {
      // Keep existing
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-refresh every 45 seconds for non-blocking live stream
  useEffect(() => {
    refreshMarketData();
    const interval = setInterval(refreshMarketData, 45000);
    return () => clearInterval(interval);
  }, []);

  const formatLastUpdatedTime = () => {
    return lastUpdated.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <aside 
      className={`market-ticker-strip ${className}`}
      aria-label="Live International Market Ticker Tape"
      style={{
        background: 'var(--bg-surface-elevated)',
        borderBottom: '1px solid var(--border-medium)',
        overflow: 'hidden',
        position: 'relative',
        fontSize: '0.78rem',
        zIndex: 10
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        {/* Left Sticky Ticker Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '0.45rem 0.85rem',
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-medium)',
          zIndex: 2,
          flexShrink: 0,
          boxShadow: '2px 0 8px rgba(0,0,0,0.04)'
        }}>
          <span style={{ 
            width: '7px', 
            height: '7px', 
            borderRadius: '50%', 
            background: 'var(--accent-green)',
            display: 'inline-block',
            boxShadow: '0 0 8px var(--accent-green)',
            animation: 'pulse 2s infinite'
          }} />
          <span style={{ fontWeight: 800, fontSize: '0.68rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
            LIVE FEED
          </span>
          <button 
            type="button"
            onClick={refreshMarketData}
            title={`Refresh Live Quotes (Last: ${formatLastUpdatedTime()})`}
            aria-label="Refresh Market Quotes"
            disabled={isRefreshing}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px',
              display: 'inline-flex',
              alignItems: 'center',
              color: 'var(--text-muted)'
            }}
          >
            <RefreshCw size={11} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Scrollable Horizontal Tape */}
        <div 
          className="ticker-tape-scroll"
          style={{
            display: 'flex',
            alignItems: 'center',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            padding: '0.35rem 0.75rem',
            gap: '1.25rem'
          }}
        >
          {tickers.map((t, idx) => (
            <a 
              key={idx}
              href={TRADINGVIEW_AFFILIATE_URL}
              target="_blank"
              rel="sponsored noopener noreferrer"
              title={`${t.symbol}: High ${t.high} • Low ${t.low} (Click to open TradingView chart)`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                color: 'inherit',
                padding: '2px 6px',
                borderRadius: '4px',
                transition: 'background 0.15s ease'
              }}
            >
              <span style={{ fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.74rem' }}>
                {t.symbol}
              </span>
              <span style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontSize: '0.78rem' }}>
                {t.value}
              </span>
              <span style={{ 
                fontWeight: 700, 
                fontSize: '0.7rem', 
                fontFamily: 'var(--font-mono)',
                color: t.positive ? 'var(--accent-green)' : 'var(--accent-red)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px'
              }}>
                {t.positive ? '▲' : '▼'} {t.change}
              </span>

              {/* Mini SVG Sparkline */}
              {t.sparkline && t.sparkline.length > 0 && (
                <svg width="36" height="13" style={{ overflow: 'visible', opacity: 0.85 }}>
                  <polyline
                    fill="none"
                    stroke={t.positive ? 'var(--accent-green)' : 'var(--accent-red)'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={generateSvgPoints(t.sparkline, 36, 13)}
                  />
                </svg>
              )}
            </a>
          ))}
        </div>

        {/* Right Partner Indicator */}
        <div className="hide-on-mobile" style={{
          padding: '0.45rem 0.85rem',
          background: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border-medium)',
          zIndex: 2,
          flexShrink: 0,
          fontSize: '0.66rem',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>ECB &amp; Crypto Data</span>
          <a 
            href={TRADINGVIEW_AFFILIATE_URL}
            target="_blank"
            rel="sponsored noopener noreferrer"
            style={{ color: '#2962FF', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
          >
            <span>Full Charts</span>
            <ExternalLink size={10} />
          </a>
        </div>
      </div>
    </aside>
  );
};
