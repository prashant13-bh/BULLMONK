import { Article, MarketTicker, Region } from '../types';

export const DEFAULT_ARTICLES: Article[] = [
  // 1. USA MACRO & WALL STREET
  {
    id: "bm-usa-001",
    slug: "us-treasury-debt-auctions-foreign-central-bank-demand",
    title: "US Treasury Debt Dynamics: Foreign Central Banks Rebalance Toward Short-Duration Yields",
    category: "Markets & Finance",
    region: "United States",
    deck: "Direct primary dealer data from the Federal Reserve Bank of New York reveals an accelerating institutional reallocation into 2-year and 5-year paper amidst shifting rate curves.",
    content: `
      <p class="lead-paragraph">In what financial strategists at major Wall Street institutions describe as a structural recalibration of sovereign reserve portfolios, the latest round of benchmark United States Treasury auctions recorded record indirect foreign bidding ratios. Primary dealer accounts managed through Tokyo, London, and Zurich demonstrated decisive appetite for short-to-intermediate paper, absorbing over $68 billion in new sovereign issuances with bid-to-cover metrics surpassing historical five-year medians.</p>

      <p>The yield curve behavior reflects an evolving consensus on the Federal Open Market Committee's (FOMC) terminal trajectory. While core personal consumption expenditure (PCE) metrics continue to signal residual services-sector inflation, domestic fixed-income desks have aggressively priced in liquidity management adjustments by the central bank's Open Market Trading Desk.</p>

      <h3>Foreign Custodial Balances at the New York Fed</h3>
      <p>According to Federal Reserve H.4.1 releases, foreign central bank marketable securities held in custody increased by $14.2 billion over the trailing four-week window. European central banking desks were responsible for roughly 48% of the aggregate inflow, utilizing proceeds from matured ten-year paper to lock in compelling real yields at the shorter end of the term structure.</p>

      <blockquote class="article-quote">
        "Global reserve managers are treating intermediate Treasury yields as an uncompromised defensive anchor while navigating synchronized volatility across currency clearing corridors."
        <cite>— Catherine Ross, Chief US Rates Strategist, Manhattan Capital Analytics</cite>
      </blockquote>

      <h3>Corporate Issuance and Spreads</h3>
      <p>Investment-grade corporate bond spreads have tightened commensurately, hovering at just 92 basis points over equivalent duration Treasuries. Blue-chip corporate treasuries in Silicon Valley and Charlotte, North Carolina capitalized on the constructive tone, completing over $24 billion in syndicated debt placements ahead of the upcoming quarterly blackout period.</p>
    `,
    author: {
      name: "Marcus Vance",
      title: "Senior Macroeconomics Editor",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      location: "New York Bureau",
      credentials: "MS in Financial Economics, Former Federal Reserve Research Associate"
    },
    publishedAt: "2026-10-18T19:30:00Z",
    readTime: "7 min read",
    heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Architectural lines of Wall Street financial towers in Lower Manhattan, New York.",
    featured: true,
    breaking: false,
    tags: ["US Economy", "Federal Reserve", "Treasury Yields", "Wall Street", "Bonds"],
    views: 22410,
    bookmarks: 1140
  },

  // 2. INDIA - EMERGING POWERHOUSE
  {
    id: "bm-ind-002",
    slug: "india-fdi-semiconductor-manufacturing-pli-expansion",
    title: "India's Capital Inflows Surge as Sovereign Funds Back Gujarat Semiconductor and Solar Corridors",
    category: "Technology & AI",
    region: "India",
    deck: "Over $38 billion in cross-border direct investments materialize as global foundries and institutional allocators expand production facilities in Dholera and Bengaluru.",
    content: `
      <p class="lead-paragraph">India's economic ascension reached another tangible milestone this quarter as the Reserve Bank of India (RBI) confirmed that foreign direct investment (FDI) equity inflows into high-technology fabrication and renewable logistics infrastructure grew by 31% year-on-year. The acceleration underscores how multinational technology conglomerates are decisively executing dual-corridor supply chain strategies centered on the subcontinent.</p>

      <p>In Gujarat's Special Investment Region at Dholera, cleanroom equipment installations for joint commercial silicon wafer fabrication are progressing three months ahead of project benchmarks. The initiative, funded through an alliance between leading domestic industrial syndicates and technology consortiums from Tokyo and Taipei, aims to commence pilot commercial packaging by early next year.</p>

      <h3>Rupee Settlement Rails and Forex Reserves</h3>
      <p>Bolstered by sustained foreign institutional investor (FII) purchases across Mumbai's Dalal Street, India's foreign exchange reserves reached an all-time high of $708 billion, according to official central bank statistical supplements. The robust buffer has provided the RBI substantial latitude to maintain currency stability amidst broad US dollar fluctuations.</p>

      <blockquote class="article-quote">
        "India is not merely providing cost-arbitrage labor; it is building sovereign technological manufacturing depth supported by world-class digital payment infrastructure."
        <cite>— Rajeshwar Iyer, Senior Fellow, Center for Asia-Pacific Industrial Strategy</cite>
      </blockquote>

      <p>Domestic capital markets have responded with record trading volumes, as retail and institutional systematic investment plan (SIP) contributions crossed the ₹24,000 crore monthly milestone, insulating Indian equities against overseas outflows.</p>
    `,
    author: {
      name: "Siddharth Rao",
      title: "Global Tech & Industrial Analyst",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
      location: "Bengaluru Desk",
      credentials: "B.Tech IIT Madras, MBA London Business School"
    },
    publishedAt: "2026-10-18T16:15:00Z",
    readTime: "8 min read",
    heroImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Automated wafer handling robot in cleanroom microelectronics fabrication.",
    featured: true,
    breaking: true,
    tags: ["India Economy", "RBI", "Semiconductors", "FDI", "Make In India"],
    views: 29850,
    bookmarks: 1820
  },

  // 3. EUROPE - FRANKFURT & LONDON
  {
    id: "bm-eur-003",
    slug: "ecb-monetary-policy-frankfurt-cross-border-settlements",
    title: "European Central Bank Tests Interbank Instant Gross Settlement Rails to Safeguard Industrial Competitiveness",
    category: "Markets & Finance",
    region: "Europe",
    deck: "Frankfurt and Paris policymakers accelerate digital euro wholesale pilot as Eurozone industrial powerhouses confront high energy input tariffs.",
    content: `
      <p class="lead-paragraph">Inside the European Central Bank’s towering headquarters overlooking the Main river in Frankfurt, members of the Governing Council finalized regulatory parameters for Project EuroGross: a high-capacity wholesale settlement architecture designed to allow commercial lenders across the Eurozone to settle sovereign repo transactions instantaneously around the clock.</p>

      <p>The move comes amidst structural head-winds facing heavy manufacturing in Germany, northern Italy, and France. As energy prices remain sensitive to liquefied natural gas (LNG) import parity, eliminating clearing friction in wholesale capital markets is viewed as essential to preserving European banking profitability.</p>

      <h3>London Commodity Clearing Integration</h3>
      <p>Simultaneously, financial desks in the City of London reported robust clearing activity on critical transition metals contracts. Direct nickel, copper, and cobalt hedging contracts traded across the London Metal Exchange (LME) reflected heightened demand from automotive original equipment manufacturers (OEMs) locking in long-term raw material supplies.</p>

      <blockquote class="article-quote">
        "Europe's capital markets union cannot afford incrementalism when global energy transitions require hundreds of billions in coordinated liquidity annually."
        <cite>— Henri de Montmirail, European Capital Markets Director, Paris</cite>
      </blockquote>
    `,
    author: {
      name: "Julian Thorne",
      title: "Senior European Economics Correspondent",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
      location: "Frankfurt Bureau",
      credentials: "Chartered Financial Analyst (CFA), Former Bundesbank Advisor"
    },
    publishedAt: "2026-10-18T13:40:00Z",
    readTime: "6 min read",
    heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "High-density financial architecture in the City of London banking quarter.",
    featured: false,
    breaking: false,
    tags: ["Europe", "ECB", "Banking Union", "Eurozone", "Commodities"],
    views: 16420,
    bookmarks: 840
  },

  // 4. CANADA - NATURAL RESOURCES & MONETARY POLICY
  {
    id: "bm-can-004",
    slug: "bank-of-canada-critical-minerals-trans-mountain-export",
    title: "Canada's Resource Export Boom: Pacific Pipeline Flows and Critical Minerals Reshape Trade Balance",
    category: "Energy & Climate",
    region: "Canada",
    deck: "Full-capacity operations on the expanded Trans Mountain pipeline and lithium refinery openings in Alberta flip Canada's current account balance into surplus.",
    content: `
      <p class="lead-paragraph">Commercial tankers loading heavy crude at the Westridge Marine Terminal in Burnaby, British Columbia are now departing for refineries in California, Japan, and South Korea on a daily cadence. Six months into sustained commercial throughput, the Trans Mountain Expansion has fundamentally altered Canadian commodity economics, shrinking the historical Western Canadian Select (WCS) discount to five-year lows.</p>

      <p>At the same time, the Bank of Canada (BoC) in Ottawa acknowledged in its monetary policy report that surging resource revenues and critical mineral exports have injected unexpected fiscal buoyancy into provincial and federal balance sheets. Spot royalties from lithium extraction and nickel mining across northern Ontario’s Ring of Fire region have driven corporate tax receipts substantially above budgetary forecasts.</p>

      <h3>Inflation Moderation and Housing Resilience</h3>
      <p>With consumer price index (CPI) inflation settling cleanly within the Bank of Canada's 1-to-3 percent target band, BoC Governor Tiff Macklem emphasized that monetary policy is entering a calibrated normalization phase, providing breathing room to domestic mortgage holders while sustaining business investment in mining automation.</p>
    `,
    author: {
      name: "Helena Lindqvist",
      title: "Maritime & Resource Bureau Chief",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",
      location: "Calgary Desk",
      credentials: "M.Sc. Geosciences, University of Alberta"
    },
    publishedAt: "2026-10-18T11:20:00Z",
    readTime: "6 min read",
    heroImage: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Clean energy substation and resource processing infrastructure in Western Canada.",
    featured: false,
    breaking: false,
    tags: ["Canada", "Bank of Canada", "Energy Exports", "Critical Minerals", "Economy"],
    views: 14350,
    bookmarks: 690
  },

  // 5. AUSTRALIA & NEW ZEALAND
  {
    id: "bm-aunz-005",
    slug: "australia-rba-clean-energy-superpower-lithium-exports",
    title: "Australia's Clean Energy Export Pivot: Lithium Refineries and Green Ammonia Challenge Traditional LNG",
    category: "Energy & Climate",
    region: "Australia & NZ",
    deck: "Reserve Bank of Australia analyzes structural terms-of-trade evolution as Western Australian mineral processing captures downstream battery manufacturing margin.",
    content: `
      <p class="lead-paragraph">Across the red desert expanse of the Pilbara and the coastal industrial complexes of Kwinana and Bunbury, Australia's identity as a raw dirt exporter is undergoing rapid industrial mutation. Spodumene concentrate that once shipped unprocessed overseas is now entering domestic hydroxide conversion plants, capturing five-fold value increases before loading onto specialized container vessels.</p>

      <p>In Sydney, Reserve Bank of Australia (RBA) economic analysis papers highlighted that downstream battery chemicals and green hydrogen exports could generate over AUD $85 billion in annual national income by 2030, offsetting gradual declines in thermal coal export receipts. Meanwhile, across the Tasman Sea, New Zealand's agritech sector announced major sovereign AI partnerships to optimize pastoral dairy yields and cut methane output.</p>

      <h3>The Australian Dollar and Pacific Trade Alliances</h3>
      <p>The Australian dollar (AUD) found steady support near $0.6750 against the greenback, supported by strong trade surpluses with East Asian manufacturing partners and disciplined federal budget debt management in Canberra.</p>
    `,
    author: {
      name: "Siddharth Rao",
      title: "Asia-Pacific Resources Analyst",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
      location: "Sydney Bureau",
      credentials: "Financial Modeling Institute Fellow, Sydney"
    },
    publishedAt: "2026-10-18T08:00:00Z",
    readTime: "7 min read",
    heroImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "High-latitude satellite mapping tracing Pacific maritime mineral corridors.",
    featured: false,
    breaking: false,
    tags: ["Australia", "RBA", "New Zealand", "Lithium", "Green Energy"],
    views: 12900,
    bookmarks: 720
  },

  // 6. RUSSIA & EURASIA
  {
    id: "bm-rus-006",
    slug: "russia-eurasian-trade-brics-ruble-yuan-clearing",
    title: "The Eurasian Settlement Architecture: How Non-SWIFT Bilateral Clearing Redefined Ruble-Yuan Trade",
    category: "World Affairs",
    region: "Russia & Eurasia",
    deck: "Central Bank of Russia and Asian trade counterparties route over 92% of bilateral bilateral commerce through national payment messaging systems.",
    content: `
      <p class="lead-paragraph">Four years after extensive Western financial restrictions severed major Russian financial institutions from the Brussels-based SWIFT cooperative, bilateral Eurasian commerce has established an independent operational equilibrium. According to trade registry data reviewed by BullMonk, over 92% of transactions between Russian energy exporters and Asian commercial importers are now settled in national currencies—predominantly rubles, yuan, and UAE dirhams.</p>

      <p>The shift has accelerated the adoption of Russia’s System for Transfer of Financial Messages (SPFS) and its interconnection with alternative cross-border payment platforms across the BRICS member economies. Commodity rail corridors through Kazakhstan and maritime routes along the Northern Sea Route from Arctic terminals have witnessed record transit volumes.</p>

      <h3>Foreign Exchange Reserves Composition</h3>
      <p>The Central Bank of Russia (CBR) continues to prioritize gold bullion acquisitions, with official monetary gold holdings expanding past 2,330 metric tons. High spot bullion valuations above $2,700 per ounce have provided substantial balance sheet support, mitigating foreign asset freeze impacts and stabilizing domestic monetary conditions.</p>
    `,
    author: {
      name: "Marcus Vance",
      title: "Senior Macroeconomics Editor",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      location: "Zurich Bureau",
      credentials: "Sovereign Debt & Sanctions Specialist"
    },
    publishedAt: "2026-10-17T21:00:00Z",
    readTime: "6 min read",
    heroImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Forex currency terminals and international settlement displays.",
    featured: false,
    breaking: false,
    tags: ["Russia", "BRICS", "De-Dollarization", "Commodities", "Eurasia"],
    views: 17890,
    bookmarks: 930
  },

  // 7. GLOBAL MACRO - GOLD & CENTRAL BANKS
  {
    id: "bm-glo-007",
    slug: "global-central-bank-gold-reserves-monetary-transition",
    title: "Sovereign Gold Accumulation Shatters Fifty-Year Records as Central Banks Hedge Fiat Volatility",
    category: "Markets & Finance",
    region: "Global",
    deck: "Net purchases surpass 1,000 metric tons for the third consecutive year as institutional allocators and monetary authorities diversify away from single-currency concentration.",
    content: `
      <p class="lead-paragraph">Physical bullion vaults beneath the Bank of England in London and the Federal Reserve Bank of New York have reported unprecedented sovereign repatriation requests and allocation audits. World Gold Council statistical registers confirm that central bank net bullion purchases exceeded 1,040 metric tons annually, marking the most aggressive sovereign gold accumulation epoch since the 1971 collapse of the Bretton Woods currency framework.</p>

      <p>The unprecedented sovereign appetite has propelled spot bullion prices past historic thresholds above $2,720 per troy ounce. Unlike historical rallies driven purely by real-rate declines or speculative retail ETF demand, today's momentum is structurally anchored by sovereign balance sheet de-risking.</p>

      <blockquote class="article-quote">
        "Gold is reasserting its ancient role as the ultimate unencumbered, zero-counterparty tier-1 sovereign asset."
        <cite>— Dame Eleanor Vance, Deputy Governor for Financial Stability, Bank of England</cite>
      </blockquote>

      <p>Private wealth management institutions in Zurich, Singapore, and Dubai report client portfolio allocations to physical allocated gold rising from standard 2% allocations to historical defensive thresholds of 8-to-12 percent.</p>
    `,
    author: {
      name: "Amara Okonjo",
      title: "Global Policy & Intelligence Director",
      avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=250&q=80",
      location: "Zurich Bureau",
      credentials: "PhD in International Monetary Law, Geneva"
    },
    publishedAt: "2026-10-17T14:30:00Z",
    readTime: "7 min read",
    heroImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Security monitoring screens at a sovereign state computational and reserve facility.",
    featured: false,
    breaking: false,
    tags: ["Gold", "Central Banks", "Sovereign Reserves", "Global Macro", "Forex"],
    views: 24100,
    bookmarks: 1450
  }
];

export const MARKET_TICKERS: MarketTicker[] = [
  { symbol: "S&P 500", value: "5,864.67", change: "+0.82%", positive: true },
  { symbol: "NASDAQ", value: "18,489.12", change: "+1.24%", positive: true },
  { symbol: "FTSE 100", value: "8,358.20", change: "-0.18%", positive: false },
  { symbol: "NIKKEI 225", value: "39,910.55", change: "+1.45%", positive: true },
  { symbol: "NIFTY 50", value: "24,854.00", change: "+0.95%", positive: true },
  { symbol: "BRENT CRUDE", value: "$74.29", change: "-0.95%", positive: false },
  { symbol: "GOLD (OZ)", value: "$2,721.40", change: "+0.64%", positive: true },
  { symbol: "BITCOIN", value: "$68,410.00", change: "+2.15%", positive: true },
  { symbol: "EUR/USD", value: "1.0862", change: "+0.11%", positive: true },
  { symbol: "USD/INR", value: "84.02", change: "-0.04%", positive: false },
  { symbol: "US 10Y YIELD", value: "4.08%", change: "-0.03%", positive: false },
  { symbol: "ASX 200", value: "8,284.10", change: "+0.73%", positive: true }
];

const STORAGE_KEY = "BULLMONK_REACT_ARTICLES_V2";
const BOOKMARKS_KEY = "BULLMONK_REACT_BOOKMARKS_V2";

export const BullMonkStorage = {
  getAllArticles(): Article[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ARTICLES));
        return DEFAULT_ARTICLES;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_ARTICLES;
    }
  },

  getArticleById(id: string): Article | undefined {
    const list = this.getAllArticles();
    return list.find(a => a.id === id || a.slug === id);
  },

  addArticle(articleData: Partial<Article>): Article {
    const articles = this.getAllArticles();
    const id = "bm-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 6);
    const slug = (articleData.title || "dispatch")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newArticle: Article = {
      id,
      slug,
      title: articleData.title || "Untitled Intelligence Briefing",
      category: articleData.category || "World Affairs",
      region: (articleData.region as Region) || "Global",
      deck: articleData.deck || "",
      content: articleData.content || "",
      author: articleData.author || {
        name: "BullMonk Editorial Staff",
        title: "Contributing Journalist",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
        location: "Global Bureau",
        credentials: "BullMonk Investigative Accreditation"
      },
      publishedAt: new Date().toISOString(),
      readTime: articleData.readTime || `${Math.max(2, Math.ceil((articleData.content || "").split(/\s+/).length / 200))} min read`,
      heroImage: articleData.heroImage || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
      imageCaption: articleData.imageCaption || "BullMonk Global News Service dispatch.",
      featured: Boolean(articleData.featured),
      breaking: Boolean(articleData.breaking),
      tags: articleData.tags && articleData.tags.length > 0 ? articleData.tags : ["Global News", "Finance"],
      views: 1,
      bookmarks: 0,
      userCreated: true
    };

    articles.unshift(newArticle);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    return newArticle;
  },

  deleteArticle(id: string): boolean {
    let articles = this.getAllArticles();
    articles = articles.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    return true;
  },

  toggleBookmark(id: string): boolean {
    try {
      const bookmarks: string[] = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || "[]");
      const idx = bookmarks.indexOf(id);
      let isSaved = false;
      if (idx > -1) {
        bookmarks.splice(idx, 1);
        isSaved = false;
      } else {
        bookmarks.push(id);
        isSaved = true;
      }
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
      return isSaved;
    } catch {
      return false;
    }
  },

  isBookmarked(id: string): boolean {
    try {
      const bookmarks: string[] = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || "[]");
      return bookmarks.includes(id);
    } catch {
      return false;
    }
  },

  incrementViews(id: string) {
    try {
      const articles = this.getAllArticles();
      const article = articles.find(a => a.id === id);
      if (article) {
        article.views = (article.views || 0) + 1;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
      }
    } catch {}
  }
};
