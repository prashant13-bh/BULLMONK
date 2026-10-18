// BullMonk Global News Engine - Initial Seed Data & Storage Layer
const DEFAULT_ARTICLES = [
  {
    id: "bm-2026-001",
    title: "Global Central Banks Signal Coordinated Shift Toward Sovereign Digital Reserve Frameworks",
    slug: "global-central-banks-digital-reserve-frameworks",
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

<p>Global markets responded with brisk volatility. Benchmark ten-year yields dipped three basis points, while sovereign credit default swap spreads tightened across Tier-1 sovereign issuers. BullMonk will continue monitoring regulatory filings as the pilot enters Phase Two wholesale testing this autumn.</p>
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
    title: "The Silicon Strait: How Advanced 1.4nm Photonic Nodes Are Reshaping the Global Geopolitical Map",
    slug: "silicon-strait-1nm-photonic-nodes-geopolitics",
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

<p>As sovereign AI superclusters prepare to ingest petabyte streams of global meteorological, genomic, and macroeconomic data simultaneously, access to these photonic foundry allocations will determine which nations achieve real-time strategic predictive capabilities.</p>
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
    title: "The Arctic Silk Route: Year-Round Northern Corridors Open New Trade Chokepoints",
    slug: "arctic-silk-route-northern-sea-corridor",
    category: "World Affairs",
    deck: "Commercial container convoys cut transit time from Yokohama to Rotterdam down to twelve days, unsettling Mediterranean transshipment hubs and testing Maritime Law.",
    content: `
<p class="lead-paragraph">For over four centuries, maritime navigators dreamed of an unencumbered high-latitude passage linking the commercial powerhouses of East Asia with European seaports. This week, as automated ice-strengthened container giants berthed safely in Rotterdam after departing Yokohama a mere 11 days and 20 hours earlier, that historical dream materialized—bringing with it an unprecedented web of legal and environmental dilemmas.</p>

<p>Navigating via the Northern Sea Route bypasses both the Malacca Strait and the Suez Canal, trimming roughly 4,800 nautical miles and an estimated $620,000 in fuel expenditure per standard 18,000-TEU vessel. Yet, the opening of this perennial corridor occurs amidst an acute absence of unified territorial jurisdiction over contested deep-water polar straits.</p>

<h3>Insurers and Salvage Infrastructure</h3>
<p>Lloyd's of London underwriters have instituted strict navigational criteria, mandating redundant dual-fuel LNG propulsion and autonomous satellite telemetry links. Search-and-rescue staging posts remain scarce across the 3,000-mile stretch between Murmansk and the Bering Strait, leading environmental agencies to demand stringent black carbon emissions ceilings.</p>

<p>As traditional Mediterranean transshipment hubs like Piraeus and Gioia Tauro review long-term volume projections, northern European logistics hubs are racing to expand deep-water container berths to accommodate the high-latitude surge.</p>
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
    title: "Fusion Grid Realities: Commonwealth Consortium Connects First Net-Positive Pilot to Regional Substation",
    slug: "fusion-grid-first-net-positive-pilot-substation",
    category: "Energy & Climate",
    deck: "Magnetic confinement tokamak achieves sustained Q-plasma factor of 1.34 over continuous 72-hour operational window, powering 45,000 suburban households.",
    content: `
<p class="lead-paragraph">Inside the sprawling fusion campus outside Oxford, the high-pitched hum of cryogenic cooling systems gave way to resounding applause as telemetry monitors confirmed a sustained electrical power feed into the National Grid. For seventy-two uninterrupted hours, the experimental ST-80 Tokamak has produced more usable electrical energy than its superconducting magnetic coils consumed.</p>

<p>Achieving a verified Q-total factor of 1.34 at thermal scale represents the technical threshold that energy physicists have chased since the 1958 Geneva atoms-for-peace conference. Unlike fission reactors, the compact deuterium-tritium chamber generates zero long-lived radioactive actinide waste, and cannot experience runaway thermal meltdown.</p>

<h3>Commercial Scaling and Materials Science</h3>
<p>The true triumph belongs to advances in high-temperature superconducting (HTS) rare-earth barium copper oxide tapes, which permitted magnetic containment pressures exceeding 21 Tesla in a footprint one-fifth the size of legacy international reactors.</p>

<p>Bilateral financing discussions between sovereign wealth funds in Abu Dhabi and industrial consortiums in Germany have commenced, with commercial turnkey contracts projected for groundbreaking by 2029.</p>
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
    title: "The Sovereign AI Divide: Why Small Nation-States Are Building Their Own Large Reasoning Models",
    slug: "sovereign-ai-divide-national-reasoning-models",
    category: "Technology & AI",
    deck: "From Reykjavik to Abu Dhabi, governments refuse to outsource judicial deliberation, civil archives, and defensive intelligence to Silicon Valley hyper-scalers.",
    content: `
<p class="lead-paragraph">When Iceland's Ministry of Justice announced its custom 120-billion-parameter linguistic model trained exclusively on centuries of Old Norse parliamentary transcripts, legal codices, and modern cultural literature, international observers viewed it as a whimsical linguistic preservation effort. Today, that narrative has dissolved into hard strategic reality.</p>

<p>Across more than thirty mid-sized democracies and emerging powers, 'Data Sovereignty' has graduated from regulatory rhetoric into multi-billion-dollar national security imperatives. Relying on foreign foundational model APIs carries severe vulnerabilities: algorithmic cultural bias, sudden sanctions cutoff risk, and non-compliance with local constitutional privacy mandates.</p>

<p>The BullMonk Institute for Digital Strategy surveyed 48 national digital agencies: 71% now maintain sovereign supercomputing clusters dedicated to self-hosted foundational architectures.</p>
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
    title: "The Re-Urbanization of Global Finance: Why Physical Trading Hubs Are Expanding Amidst Remote Decentralization",
    slug: "re-urbanization-of-global-finance-physical-hubs",
    category: "Markets & Finance",
    deck: "Mayfair, Marunouchi, and DIFC report record office occupancy rates as dealmakers discover that hyper-volatile macro markets demand human proximity.",
    content: `
<p class="lead-paragraph">Six years after apocalyptic predictions heralded the permanent demise of physical financial capitals, institutional square-footage leases in London's Mayfair, Tokyo's Marunouchi, and Dubai's International Financial Centre have not merely rebounded—they have shattered all historical valuation benchmarks.</p>

<p>Private equity titans, macro hedge funds, and sovereign wealth syndicates have converged back into condensed walking districts. The rationale cited by chief investment officers is unambiguous: in an era of saturated synthetic data and algorithmic arbitrage, high-alpha asymmetric intelligence relies on trust, nuance, and interpersonal velocity that no teleconference can replicate.</p>

<p>High-end hospitality and private club memberships catering to sovereign capital allocators have witnessed multi-year waiting lists, prompting property developers to design dedicated subterranean secure comms bunkers within landmark financial towers.</p>
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
  },
  {
    id: "bm-2026-007",
    title: "Deep Sea Minerals and the Battle for the Clarion-Clipperton Fracture Zone",
    slug: "deep-sea-minerals-clarion-clipperton-zone",
    category: "World Affairs",
    deck: "International Seabed Authority faces decisive vote on commercial seabed harvesting permits as battery demand collides with benthic ecosystem conservation.",
    content: `
<p class="lead-paragraph">Four thousand meters beneath the sunlit surface of the Central Pacific, fields of potato-sized polymetallic nodules rest upon the abyssal silt. Containing billions of tons of high-grade nickel, cobalt, copper, and manganese, the Clarion-Clipperton Zone holds more battery metals than all terrestrial reserves combined.</p>

<p>With sovereign nations split between energy transition requirements and marine ecosystem protection, delegates in Kingston, Jamaica are navigating one of the most consequential environmental showdowns in international treaty history.</p>
    `,
    author: {
      name: "Helena Lindqvist",
      title: "Maritime & Climate Bureau Chief",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",
      location: "Stockholm Bureau"
    },
    publishedAt: "2026-10-16T14:15:00Z",
    readTime: "7 min read",
    heroImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Deep-ocean submersibles mapping seafloor polymetallic nodule deposits.",
    featured: false,
    breaking: false,
    tags: ["Marine Treaty", "Battery Metals", "Seabed Mining", "Geopolitics"],
    views: 6310,
    bookmarks: 310
  },
  {
    id: "bm-2026-008",
    title: "The Architecture of Solitude: Modern Literature's Turn Inward Against Algorithmic Cacophony",
    slug: "architecture-of-solitude-modern-literature-critique",
    category: "Culture & Ideas",
    deck: "A new generation of novelists and essayists renounces social virality in favor of slow, deliberate prose that interrogates memory, presence, and stillness.",
    content: `
<p class="lead-paragraph">In Parisian salons, Kyoto teahouses, and small independent bookstores across Brooklyn, a quiet rebellion has taken root. As digital platforms optimize relentlessly for outrage and immediate reflex, a rising wave of contemporary authors is intentionally writing novels of extreme observational patience.</p>

<p>This neo-monastic literary current is not mere nostalgia; it represents a deliberate defense of human consciousness against the constant fragmentation of attention. Readers, exhausted by notifications, are voting with their bookmarks—catapulting reflective 600-page philosophical narratives to the top of independent bestseller lists worldwide.</p>
    `,
    author: {
      name: "Genevieve Moreau",
      title: "Cultural Critic & Essayist",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80",
      location: "Paris Bureau"
    },
    publishedAt: "2026-10-16T10:00:00Z",
    readTime: "6 min read",
    heroImage: "https://images.unsplash.com/photo-1507842229458-5776106c8252?auto=format&fit=crop&w=1200&q=80",
    imageCaption: "Atmospheric library interior with natural light illuminating rows of classic texts.",
    featured: false,
    breaking: false,
    tags: ["Philosophy", "Literature", "Attention Economy", "Culture"],
    views: 5200,
    bookmarks: 480
  }
];

// Market Ticker Feed Data
const MARKET_TICKERS = [
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

// LocalStorage Manager for BullMonk
const BullMonkDB = {
  STORAGE_KEY: "BULLMONK_ARTICLES_V1",
  BOOKMARKS_KEY: "BULLMONK_BOOKMARKS_V1",

  init() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(DEFAULT_ARTICLES));
    }
    if (!localStorage.getItem(this.BOOKMARKS_KEY)) {
      localStorage.setItem(this.BOOKMARKS_KEY, JSON.stringify(["bm-2026-001"]));
    }
  },

  getAllArticles() {
    this.init();
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : DEFAULT_ARTICLES;
    } catch (e) {
      console.error("Storage error:", e);
      return DEFAULT_ARTICLES;
    }
  },

  getArticleById(id) {
    const articles = this.getAllArticles();
    return articles.find(a => a.id === id || a.slug === id) || null;
  },

  addArticle(newArticle) {
    const articles = this.getAllArticles();
    const id = "bm-" + Date.now().toString(36) + "-" + Math.random().toString(36).substr(2, 4);
    const slug = newArticle.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const articleToSave = {
      id,
      slug,
      title: newArticle.title,
      category: newArticle.category || "World Affairs",
      deck: newArticle.deck || "",
      content: newArticle.content,
      author: {
        name: newArticle.authorName || "BullMonk Editorial Staff",
        title: newArticle.authorTitle || "Contributing Journalist",
        avatar: newArticle.authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
        location: newArticle.authorLocation || "Global Bureau"
      },
      publishedAt: newArticle.publishedAt || new Date().toISOString(),
      readTime: newArticle.readTime || `${Math.max(2, Math.ceil((newArticle.content || "").split(/\s+/).length / 200))} min read`,
      heroImage: newArticle.heroImage || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
      imageCaption: newArticle.imageCaption || "BullMonk Global News Service dispatch.",
      featured: Boolean(newArticle.featured),
      breaking: Boolean(newArticle.breaking),
      tags: Array.isArray(newArticle.tags) ? newArticle.tags : (newArticle.tags ? newArticle.tags.split(",").map(t => t.trim()) : ["Global News"]),
      views: 1,
      bookmarks: 0,
      userCreated: true
    };

    articles.unshift(articleToSave);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(articles));
    return articleToSave;
  },

  deleteArticle(id) {
    let articles = this.getAllArticles();
    articles = articles.filter(a => a.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(articles));
    return true;
  },

  toggleBookmark(id) {
    try {
      let bookmarks = JSON.parse(localStorage.getItem(this.BOOKMARKS_KEY) || "[]");
      const idx = bookmarks.indexOf(id);
      let isBookmarked = false;
      if (idx > -1) {
        bookmarks.splice(idx, 1);
        isBookmarked = false;
      } else {
        bookmarks.push(id);
        isBookmarked = true;
      }
      localStorage.setItem(this.BOOKMARKS_KEY, JSON.stringify(bookmarks));
      return isBookmarked;
    } catch (e) {
      return false;
    }
  },

  isBookmarked(id) {
    try {
      const bookmarks = JSON.parse(localStorage.getItem(this.BOOKMARKS_KEY) || "[]");
      return bookmarks.includes(id);
    } catch (e) {
      return false;
    }
  },

  incrementViews(id) {
    try {
      const articles = this.getAllArticles();
      const article = articles.find(a => a.id === id);
      if (article) {
        article.views = (article.views || 0) + 1;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(articles));
      }
    } catch (e) {}
  }
};

// Expose globally
window.BullMonkDB = BullMonkDB;
window.MARKET_TICKERS = MARKET_TICKERS;
