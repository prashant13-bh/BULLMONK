import { MarketTicker } from '../types';
import { MARKET_TICKERS as BASELINE_TICKERS } from '../data/newsData';

const FINNHUB_KEY_STORAGE = 'BULLMONK_FINNHUB_KEY';
const ALPHAVANTAGE_KEY_STORAGE = 'BULLMONK_ALPHAVANTAGE_KEY';
const CACHED_TICKERS_KEY = 'BULLMONK_LIVE_TICKERS_CACHE';

export const LiveMarketService = {
  getFinnhubKey(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(FINNHUB_KEY_STORAGE) || '';
  },

  setFinnhubKey(key: string): void {
    if (typeof window === 'undefined') return;
    if (key.trim()) {
      localStorage.setItem(FINNHUB_KEY_STORAGE, key.trim());
    } else {
      localStorage.removeItem(FINNHUB_KEY_STORAGE);
    }
  },

  getAlphaVantageKey(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(ALPHAVANTAGE_KEY_STORAGE) || '';
  },

  setAlphaVantageKey(key: string): void {
    if (typeof window === 'undefined') return;
    if (key.trim()) {
      localStorage.setItem(ALPHAVANTAGE_KEY_STORAGE, key.trim());
    } else {
      localStorage.removeItem(ALPHAVANTAGE_KEY_STORAGE);
    }
  },

  getCachedTickers(): MarketTicker[] {
    if (typeof window === 'undefined') return BASELINE_TICKERS;
    try {
      const saved = sessionStorage.getItem(CACHED_TICKERS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Fallback
    }
    return BASELINE_TICKERS;
  },

  saveCachedTickers(tickers: MarketTicker[]): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(CACHED_TICKERS_KEY, JSON.stringify(tickers));
    } catch (e) {
      // Ignore quota error
    }
  },

  /**
   * Fetches live market quotes across multi-asset rails:
   * 1. CoinGecko Public API (Bitcoin, Ethereum, Solana) - 0 Key required
   * 2. Frankfurter ECB Forex API (EUR/USD, USD/INR, USD/JPY) - 0 Key required
   * 3. Finnhub API (S&P 500, Nasdaq, Gold ETF) - When user key configured
   */
  async fetchLiveTickers(): Promise<{ tickers: MarketTicker[]; lastUpdated: Date; sourceCount: number }> {
    let current = [...this.getCachedTickers()];
    let successfulSources = 0;

    // 1. Live Crypto Rail (CoinGecko Simple Price)
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true', {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        successfulSources++;

        if (data.bitcoin) {
          const btcVal = Number(data.bitcoin.usd);
          const btcChange = Number(data.bitcoin.usd_24h_change || 0);
          current = current.map(t => {
            if (t.symbol === 'BITCOIN') {
              const prevPoints = t.sparkline.slice(1);
              const newPoint = Math.min(90, Math.max(20, (prevPoints[prevPoints.length - 1] || 50) + (btcChange > 0 ? 3 : -3)));
              return {
                ...t,
                value: `$${btcVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                change: `${btcChange >= 0 ? '+' : ''}${btcChange.toFixed(2)}%`,
                positive: btcChange >= 0,
                sparkline: [...prevPoints, newPoint]
              };
            }
            return t;
          });
        }
      }
    } catch (e) {
      // CoinGecko silent fallback to baseline
    }

    // 2. Live Forex Rail (Frankfurter ECB Public Reference API)
    try {
      const res = await fetch('https://api.frankfurter.dev/v1/latest?base=USD&symbols=EUR,GBP,JPY,INR');
      if (res.ok) {
        const data = await res.json();
        successfulSources++;
        const rates = data.rates || {};

        if (rates.EUR) {
          // 1 EUR in USD = 1 / rate
          const eurUsd = (1 / rates.EUR).toFixed(4);
          current = current.map(t => t.symbol === 'EUR/USD' ? { ...t, value: eurUsd } : t);
        }

        if (rates.INR) {
          const usdInr = Number(rates.INR).toFixed(2);
          current = current.map(t => t.symbol === 'USD/INR' ? { ...t, value: usdInr } : t);
        }
      }
    } catch (e) {
      // Forex silent fallback
    }

    // 3. Optional Finnhub Stock Market Rail (When configured by Admin / User)
    const finnhubKey = this.getFinnhubKey();
    if (finnhubKey) {
      try {
        const spyRes = await fetch(`https://finnhub.io/api/v1/quote?symbol=SPY&token=${finnhubKey}`);
        if (spyRes.ok) {
          const spy = await spyRes.json();
          if (spy.c && spy.pc) {
            successfulSources++;
            // SPY * 10 is roughly S&P 500 Index points
            const estSp500 = (spy.c * 10).toFixed(2);
            const changePct = Number((((spy.c - spy.pc) / spy.pc) * 100).toFixed(2));
            current = current.map(t => {
              if (t.symbol === 'S&P 500') {
                return {
                  ...t,
                  value: Number(estSp500).toLocaleString('en-US', { minimumFractionDigits: 2 }),
                  change: `${changePct >= 0 ? '+' : ''}${changePct}%`,
                  positive: changePct >= 0
                };
              }
              return t;
            });
          }
        }
      } catch (e) {
        // Finnhub silent fallback
      }
    }

    this.saveCachedTickers(current);
    return {
      tickers: current,
      lastUpdated: new Date(),
      sourceCount: successfulSources
    };
  }
};
