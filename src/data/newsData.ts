import { Article, MarketTicker } from '../types';

export const DEFAULT_ARTICLES: Article[] = [
  {
    id: "bm-2026-001",
    slug: "global-central-banks-digital-reserve-frameworks",
    title: "Global Central Banks Signal Coordinated Shift Toward Sovereign Digital Reserve Frameworks",
    category: "Markets & Finance",
    deck: "Governments in Tokyo, Frankfurt, and Zurich announce joint protocol tests, marking the most ambitious overhaul of foreign exchange settlements in half a century.",
    content: `
      <p class="lead-paragraph">In what financial historians may soon recognize as the definitive inflection point for modern monetary policy, a coalition of six leading central banks and monetary authorities across three continents today unveiled the blueprint for Project Meridian-X: a high-throughput, cryptographically auditable reserve settlement network engineered to streamline cross-border liquidity and reduce frictional clearing costs across major sovereign fiat currencies.</p>
      
      <p>The landmark joint declaration, finalized during closed-door sessions in Basel following three years of classified bilateral simulations, brings together the Bank of Japan, the European Central Bank, the Swiss National Bank, the Monetary Authority of Singapore, the Bank of England, and observers from the New York Federal Reserve.</p>
      
      <h3>Beyond Traditional SWIFT Corridors</h3>
      <p>Unlike existing messaging rails that rely on multi-tier correspondent banking networks and T+2 settlement lag, Meridian-X executes atomic gross real-time settlement using distributed sovereign validator nodes. Initial stress testing simulated over 4.2 million wholesale institutional transactions across multi-currency bond issuances, recording an average finality latency of just 420 milliseconds without a single ledger discrepancy.</p>
      
      <blockquote class="article-quote">
        "We are not merely digitizing existing ledgers; we are eradicating the counterparty settlement friction that has artificially constrained global trade liquidity for four decades."
        <cite>— Dame Eleanor Vance, Deputy Governor for Financial Stability, Bank of England</cite>
      </blockquote>
      
      <p>Analysts at Morgan Stanley and Goldman Sachs published immediate flash notes anticipating that commercial banks could unlock upwards of $340 billion in dormant collateral currently tied up in pre-funded nostro accounts. However, sovereign debt strategists warned that smaller emerging market currencies could face capital velocity imbalances if not admitted into the primary clearing consortium within the preliminary 18-month rollout window.</p>
      
      <h3>Geopolitical Repercussions and Energy Settlement</h3>
      <p>The initiative also directly intersects with shifting petrodollar dynamics. With energy syndicates in the Arabian Gulf actively experimenting with non-dollar bilateral trades, Meridian-X provides a compliant, sanctions-auditable framework that satisfies both Western regulatory requirements and non-aligned trade corridors.</p>
    `,
    author: {
      name: "Marcus Vance",
      title: "Senior Macroeconomics Editor",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      location: "Zurich Bureau"
    },
    publishedAt: "2026-10-18T18:45:00Z",
    readTime: "6 min read",
    heroImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1600&q=80",
    imageCaption: "Trading terminals and sovereign currency indices at the International Settlement Centre, Zurich.",
    featured: true,
    breaking: true,
    tags: ["Monetary Policy", "Central Banks", "FinTech", "Global Macro", "Forex"],
    views: 18420,
    bookmarks: 942
  },
  {
    id: "bm-2026-002",
    slug: "silicon-strait-1nm-photonic-nodes-geopolitics",
    title: "The Silicon Strait: How Advanced 1.4nm Photonic Nodes Are Reshaping the Global Geopolitical Map",
    category: "Technology & AI",
    deck: "Breakthrough optical lithography fabrications in Hsinchu and Eindhoven shatter electronic clock barriers, triggering a multi-trillion-dollar diplomatic contest for rare earth optical substrates.",
    content: `
      <p class="lead-paragraph">Inside cleanrooms where air filtration standards exceed hospital surgical suites by a factor of ten thousand, the physics of computing has officially outrun the thermal limits of copper interconnects. Yesterday's confirmed yield reports on 1.4-nanometer optical-electronic hybrid wafers have set off alarms across foreign ministries from Washington to Beijing.</p>
      
      <p>By replacing traditional electronic gate routing with silicon-embedded micro-laser optical waveguides, the newly minted 'HyperPhoton-1' architectures consume 78% less power per petaflop while sustaining continuous processing frequencies once considered mathematically impossible outside cryogenic cooling chambers.</p>
      
      <h3>The New Battleground for Neodymium & Gallium</h3>
      <p>The transition from pure copper interconnects to integrated photonic circuits requires unprecedented purity levels of high-grade gallium arsenide and synthetic fluorite crystals. Sovereign export controls enacted over the past quarter have already driven spot prices for optical-grade quartz to ten-year highs on the Rotterdam exchange.</p>
      
      <blockquote class="article-quote">
        "Compute is no longer an economic commodity; it is the raw geopolitical sovereign currency of the next half-century."
        <cite>— Dr. Akira Takahashi, Director of Advanced Physical Sciences, Tokyo Cybernetics Institute</cite>
      </blockquote>
    `,
    author: {
      name: "Siddharth Rao",
      title: "Global Tech & Defense Analyst",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
      location: "Singapore Bureau"
    },
    publishedAt: "2026-10-18T15:20:00Z",
    readTime: "8 min read",
    heroImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Automated optical inspection array during 1.4nm silicon wafer fabrication.",
    featured: true,
    breaking: false,
    tags: ["Semiconductors", "AI Infrastructure", "Geopolitics", "Supply Chains", "Defense"],
    views: 14210,
    bookmarks: 720
  },
  {
    id: "bm-2026-003",
    slug: "arctic-silk-route-northern-sea-corridor",
    title: "The Arctic Silk Route: Year-Round Northern Corridors Open New Trade Chokepoints",
    category: "World Affairs",
    deck: "Commercial container convoys cut transit time from Yokohama to Rotterdam down to twelve days, unsettling Mediterranean transshipment hubs and testing Maritime Law.",
    content: `
      <p class="lead-paragraph">For over four centuries, maritime navigators dreamed of an unencumbered high-latitude passage linking the commercial powerhouses of East Asia with European seaports. This week, as automated ice-strengthened container giants berthed safely in Rotterdam after departing Yokohama a mere 11 days and 20 hours earlier, that historical dream materialized—bringing with it an unprecedented web of legal and environmental dilemmas.</p>
      
      <p>Navigating via the Northern Sea Route bypasses both the Malacca Strait and the Suez Canal, trimming roughly 4,800 nautical miles and an estimated $620,000 in fuel expenditure per standard 18,000-TEU vessel. Yet, the opening of this perennial corridor occurs amidst an acute absence of unified territorial jurisdiction over contested deep-water polar straits.</p>
    `,
    author: {
      name: "Helena Lindqvist",
      title: "Maritime & Climate Bureau Chief",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",
      location: "Stockholm Bureau"
    },
    publishedAt: "2026-10-18T12:10:00Z",
    readTime: "5 min read",
    heroImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Satellite telemetry tracing high-latitude maritime shipping channels through the Arctic circle.",
    featured: false,
    breaking: false,
    tags: ["Maritime Logistics", "Arctic Trade", "Suez Alternatives", "Global Shipping"],
    views: 9850,
    bookmarks: 410
  },
  {
    id: "bm-2026-004",
    slug: "fusion-grid-first-net-positive-pilot-substation",
    title: "Fusion Grid Realities: Commonwealth Consortium Connects First Net-Positive Pilot to Regional Substation",
    category: "Energy & Climate",
    deck: "Magnetic confinement tokamak achieves sustained Q-plasma factor of 1.34 over continuous 72-hour operational window, powering 45,000 suburban households.",
    content: `
      <p class="lead-paragraph">Inside the sprawling fusion campus outside Oxford, the high-pitched hum of cryogenic cooling systems gave way to resounding applause as telemetry monitors confirmed a sustained electrical power feed into the National Grid. For seventy-two uninterrupted hours, the experimental ST-80 Tokamak has produced more usable electrical energy than its superconducting magnetic coils consumed.</p>
      
      <p>Achieving a verified Q-total factor of 1.34 at thermal scale represents the technical threshold that energy physicists have chased since the 1958 Geneva atoms-for-peace conference. Unlike fission reactors, the compact deuterium-tritium chamber generates zero long-lived radioactive actinide waste.</p>
    `,
    author: {
      name: "Julian Thorne",
      title: "Senior Energy Correspondent",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
      location: "London Bureau"
    },
    publishedAt: "2026-10-18T09:30:00Z",
    readTime: "7 min read",
    heroImage: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Internal view of magnetic confinement torus with high-temperature superconducting coils.",
    featured: false,
    breaking: false,
    tags: ["Clean Energy", "Nuclear Fusion", "Grid Infrastructure", "Deep Tech"],
    views: 12640,
    bookmarks: 835
  },
  {
    id: "bm-2026-005",
    slug: "sovereign-ai-divide-national-reasoning-models",
    title: "The Sovereign AI Divide: Why Small Nation-States Are Building Their Own Large Reasoning Models",
    category: "Technology & AI",
    deck: "From Reykjavik to Abu Dhabi, governments refuse to outsource judicial deliberation, civil archives, and defensive intelligence to Silicon Valley hyper-scalers.",
    content: `
      <p class="lead-paragraph">When Iceland's Ministry of Justice announced its custom 120-billion-parameter linguistic model trained exclusively on centuries of Old Norse parliamentary transcripts, legal codices, and modern cultural literature, international observers viewed it as a whimsical linguistic preservation effort. Today, that narrative has dissolved into hard strategic reality.</p>
      
      <p>Across more than thirty mid-sized democracies and emerging powers, 'Data Sovereignty' has graduated from regulatory rhetoric into multi-billion-dollar national security imperatives.</p>
    `,
    author: {
      name: "Amara Okonjo",
      title: "Global Policy & Intelligence Analyst",
      avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=250&q=80",
      location: "Nairobi Bureau"
    },
    publishedAt: "2026-10-17T22:15:00Z",
    readTime: "6 min read",
    heroImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Security monitoring screens at a sovereign state computational facility.",
    featured: false,
    breaking: false,
    tags: ["Sovereign AI", "Public Policy", "National Security", "Digital Autonomy"],
    views: 8900,
    bookmarks: 520
  },
  {
    id: "bm-2026-006",
    slug: "re-urbanization-of-global-finance-physical-hubs",
    title: "The Re-Urbanization of Global Finance: Why Physical Trading Hubs Are Expanding Amidst Remote Decentralization",
    category: "Markets & Finance",
    deck: "Mayfair, Marunouchi, and DIFC report record office occupancy rates as dealmakers discover that hyper-volatile macro markets demand human proximity.",
    content: `
      <p class="lead-paragraph">Six years after apocalyptic predictions heralded the permanent demise of physical financial capitals, institutional square-footage leases in London's Mayfair, Tokyo's Marunouchi, and Dubai's International Financial Centre have not merely rebounded—they have shattered all historical valuation benchmarks.</p>
      
      <p>Private equity titans, macro hedge funds, and sovereign wealth syndicates have converged back into condensed walking districts. The rationale cited by chief investment officers is unambiguous: in an era of saturated synthetic data, asymmetric intelligence relies on trust and human proximity.</p>
    `,
    author: {
      name: "Marcus Vance",
      title: "Senior Macroeconomics Editor",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      location: "London Bureau"
    },
    publishedAt: "2026-10-17T17:40:00Z",
    readTime: "5 min read",
    heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Architectural lines of modern high-density financial towers in the City of London.",
    featured: false,
    breaking: false,
    tags: ["Real Estate", "Macro Hedge Funds", "Capital Markets", "Financial Hubs"],
    views: 7450,
    bookmarks: 390
  }
];

export const MARKET_TICKERS: MarketTicker[] = [
  { symbol: "S&P 500", value: "5,864.67", change: "+0.82%", positive: true },
  { symbol: "NASDAQ", value: "18,489.12", change: "+1.24%", positive: true },
  { symbol: "FTSE 100", value: "8,358.20", change: "-0.18%", positive: false },
  { symbol: "NIKKEI 225", value: "39,910.55", change: "+1.45%", positive: true },
  { symbol: "BRENT CRUDE", value: "$74.29", change: "-0.95%", positive: false },
  { symbol: "GOLD (OZ)", value: "$2,721.40", change: "+0.64%", positive: true },
  { symbol: "BITCOIN", value: "$68,410.00", change: "+2.15%", positive: true },
  { symbol: "EUR/USD", value: "1.0862", change: "+0.11%", positive: true },
  { symbol: "US 10Y YIELD", value: "4.08%", change: "-0.03%", positive: false },
  { symbol: "SILVER (OZ)", value: "$33.82", change: "+1.88%", positive: true }
];

const STORAGE_KEY = "BULLMONK_REACT_ARTICLES_V1";
const BOOKMARKS_KEY = "BULLMONK_REACT_BOOKMARKS_V1";

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
      deck: articleData.deck || "",
      content: articleData.content || "",
      author: articleData.author || {
        name: "BullMonk Editorial Staff",
        title: "Contributing Journalist",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
        location: "Global Bureau"
      },
      publishedAt: new Date().toISOString(),
      readTime: articleData.readTime || `${Math.max(2, Math.ceil((articleData.content || "").split(/\s+/).length / 200))} min read`,
      heroImage: articleData.heroImage || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
      imageCaption: articleData.imageCaption || "BullMonk Global News Service dispatch.",
      featured: Boolean(articleData.featured),
      breaking: Boolean(articleData.breaking),
      tags: articleData.tags && articleData.tags.length > 0 ? articleData.tags : ["Global News", "Analysis"],
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
