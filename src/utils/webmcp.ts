/**
 * BULLMONK WebMCP (Web Model Context Protocol) & Agentic Web Adapter
 * Provides standard machine-readable tools for Autonomous AI Agents and in-browser assistants.
 * Adheres to W3C Web Machine Learning Community Group modelContext & WebMCP specifications.
 */

import { BullMonkStorage, MARKET_TICKERS, SECTOR_HEATMAP } from '../data/newsData';

export function initWebMCPTools(
  onSearch?: (query: string) => void,
  onNavigate?: (page: string) => void
) {
  if (typeof window === 'undefined') return;

  // 1. Declarative Manifest reference
  (window as any).__WEBMCP_ENABLED__ = true;

  // 2. Standard WebMCP Browser Interface (navigator.modelContext)
  const nav = navigator as any;
  if (nav.modelContext && typeof nav.modelContext.registerTool === 'function') {
    try {
      // Tool 1: Search Intelligence Dispatches
      nav.modelContext.registerTool({
        name: 'search_intelligence_dispatches',
        description: 'Search BullMonk macroeconomic, central bank, and semiconductor intelligence dispatches by keyword, ticker, or regional desk.',
        parameters: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Topic, sovereign institution, or asset class (e.g., "Treasury yields", "Dholera fab", "Gold repatriation")'
            },
            region: {
              type: 'string',
              enum: ['all', 'United States', 'Europe', 'India', 'Canada', 'Australia & NZ', 'Russia & Eurasia', 'Global'],
              default: 'all'
            }
          },
          required: ['query']
        },
        handler: async ({ query, region }: { query: string; region?: string }) => {
          if (onSearch) onSearch(query);
          const all = BullMonkStorage.getAllArticles();
          const q = query.toLowerCase();
          const results = all.filter(a => 
            (!region || region === 'all' || a.region === region) &&
            (a.title.toLowerCase().includes(q) || a.deck.toLowerCase().includes(q) || a.tags.some(t => t.toLowerCase().includes(q)))
          );
          return {
            status: 'success',
            matchCount: results.length,
            articles: results.map(r => ({
              id: r.id,
              title: r.title,
              category: r.category,
              region: r.region,
              deck: r.deck,
              url: `https://www.govtnaukri4u.com/`
            }))
          };
        }
      });

      // Tool 2: Read Latest Market Tickers & Foreign Exchange Rates
      nav.modelContext.registerTool({
        name: 'get_live_market_tickers',
        description: 'Fetch real-time financial market benchmarks including S&P 500, NASDAQ, Nikkei 225, Nifty 50, 10Y Treasury, and Spot Gold.',
        parameters: {
          type: 'object',
          properties: {}
        },
        handler: async () => {
          return {
            status: 'success',
            timestamp: new Date().toISOString(),
            benchmarks: MARKET_TICKERS,
            sectorFlows: SECTOR_HEATMAP
          };
        }
      });

      // Tool 3: Sovereign Real Yield Calculator
      nav.modelContext.registerTool({
        name: 'calculate_sovereign_real_yield',
        description: 'Calculate net real sovereign bond yield accounting for headline inflation drag, currency risk, and tax haircuts.',
        parameters: {
          type: 'object',
          properties: {
            nominalYield: { type: 'number', description: 'Nominal bond coupon or yield percentage (e.g., 4.25)' },
            inflationRate: { type: 'number', description: 'Expected inflation percentage (e.g., 2.50)' },
            taxRate: { type: 'number', description: 'Applicable capital tax rate percentage (e.g., 20.0)' }
          },
          required: ['nominalYield', 'inflationRate']
        },
        handler: async ({ nominalYield, inflationRate, taxRate = 0 }: { nominalYield: number; inflationRate: number; taxRate?: number }) => {
          const postTaxYield = nominalYield * (1 - taxRate / 100);
          const realYield = ((1 + postTaxYield / 100) / (1 + inflationRate / 100) - 1) * 100;
          return {
            status: 'success',
            nominalYield: `${nominalYield.toFixed(2)}%`,
            inflationRate: `${inflationRate.toFixed(2)}%`,
            realPurchasingPowerYield: `${realYield.toFixed(2)}%`,
            isPositive: realYield > 0
          };
        }
      });

      // Tool 4: Navigate Newsroom Sections
      nav.modelContext.registerTool({
        name: 'navigate_newsroom',
        description: 'Navigate to BullMonk newsroom sections: home, tools, about, contact, legal, privacy, disclaimer.',
        parameters: {
          type: 'object',
          properties: {
            section: { 
              type: 'string', 
              enum: ['home', 'tools', 'about', 'contact', 'legal', 'privacy', 'disclaimer', 'editorial'],
              description: 'Target section name'
            }
          },
          required: ['section']
        },
        handler: async ({ section }: { section: string }) => {
          if (onNavigate) onNavigate(section);
          return { status: 'success', navigatedTo: section };
        }
      });

    } catch (e) {
      console.debug('WebMCP registerTool notice:', e);
    }
  }

  // 3. Fallback Registry for Headless AI Agents (window.webMCP)
  (window as any).webMCP = {
    version: '1.0',
    specification: 'https://agenticresourcediscovery.org/spec/',
    catalogUrl: 'https://www.govtnaukri4u.com/.well-known/ai-catalog.json',
    tools: [
      {
        name: 'search_intelligence_dispatches',
        description: 'Search BullMonk macroeconomic and geopolitical intelligence dispatches',
        execute: (query: string) => {
          if (onSearch) onSearch(query);
          return BullMonkStorage.getAllArticles().filter(a => a.title.toLowerCase().includes(query.toLowerCase()));
        }
      },
      {
        name: 'get_live_market_tickers',
        description: 'Get real-time global market indices and commodities',
        execute: () => MARKET_TICKERS
      },
      {
        name: 'navigate_section',
        description: 'Navigate to a specific newsroom section',
        execute: (page: string) => {
          if (onNavigate) onNavigate(page);
          return page;
        }
      }
    ]
  };
}
