import { Article, MarketTicker, SectorPerformance } from '../types';

export const MARKET_TICKERS: MarketTicker[] = [
  { symbol: "S&P 500", value: "5,864.67", change: "+0.82%", positive: true, sparkline: [40, 45, 42, 48, 52, 50, 58, 62, 65], high: "5,872.10", low: "5,830.40" },
  { symbol: "NASDAQ", value: "18,489.12", change: "+1.24%", positive: true, sparkline: [30, 34, 32, 40, 48, 45, 55, 60, 68], high: "18,510.00", low: "18,340.20" },
  { symbol: "FTSE 100", value: "8,358.20", change: "-0.18%", positive: false, sparkline: [60, 58, 55, 57, 52, 50, 48, 51, 47], high: "8,380.00", low: "8,340.10" },
  { symbol: "NIKKEI 225", value: "39,910.55", change: "+1.45%", positive: true, sparkline: [35, 38, 42, 45, 48, 55, 62, 60, 70], high: "40,020.00", low: "39,450.00" },
  { symbol: "NIFTY 50", value: "24,854.00", change: "+0.95%", positive: true, sparkline: [45, 48, 50, 52, 58, 60, 64, 62, 68], high: "24,910.50", low: "24,720.00" },
  { symbol: "BRENT CRUDE", value: "$74.29", change: "-0.95%", positive: false, sparkline: [65, 62, 60, 58, 55, 54, 52, 50, 48], high: "$75.80", low: "$73.90" },
  { symbol: "GOLD (OZ)", value: "$2,721.40", change: "+0.64%", positive: true, sparkline: [50, 52, 55, 58, 60, 62, 66, 68, 72], high: "$2,728.00", low: "$2,705.10" },
  { symbol: "BITCOIN", value: "$68,410.00", change: "+2.15%", positive: true, sparkline: [40, 42, 48, 52, 58, 60, 68, 72, 80], high: "$68,950.00", low: "$66,800.00" },
  { symbol: "EUR/USD", value: "1.0862", change: "+0.11%", positive: true, sparkline: [48, 49, 48, 50, 51, 52, 51, 52, 53], high: "1.0890", low: "1.0840" },
  { symbol: "USD/INR", value: "84.02", change: "-0.04%", positive: false, sparkline: [52, 51, 52, 50, 49, 50, 48, 49, 48], high: "84.15", low: "83.98" },
  { symbol: "ASX 200", value: "8,284.10", change: "+0.73%", positive: true, sparkline: [42, 45, 44, 48, 50, 54, 56, 58, 62], high: "8,310.00", low: "8,240.00" },
  { symbol: "US 10Y YIELD", value: "4.08%", change: "-0.03%", positive: false, sparkline: [55, 54, 52, 53, 50, 48, 47, 49, 46], high: "4.15%", low: "4.05%" }
];

export const SECTOR_HEATMAP: SectorPerformance[] = [
  { name: "Artificial Intelligence & Semis", ticker: "SOXX", change: "+2.48%", positive: true, volume: "$42.1B" },
  { name: "Global Investment Banking", ticker: "XLF", change: "+1.12%", positive: true, volume: "$28.4B" },
  { name: "Clean Energy & Fusion Grid", ticker: "ICLN", change: "+1.85%", positive: true, volume: "$14.2B" },
  { name: "Battery Metals & Lithium", ticker: "LIT", change: "+3.20%", positive: true, volume: "$9.6B" },
  { name: "Sovereign Debt & Forex", ticker: "TLT", change: "+0.45%", positive: true, volume: "$31.8B" },
  { name: "Traditional Energy & Oil", ticker: "XLE", change: "-0.85%", positive: false, volume: "$18.5B" }
];

export const DEFAULT_ARTICLES: Article[] = [
  // 1. USA MACRO INVESTIGATION (Human Written - Forensic Financial Journalism)
  {
    id: "bm-usa-001",
    slug: "wall-street-treasury-bidding-sovereign-reserve-shifts",
    title: "The 90-Second Sovereign Bidding War: Inside Wall Street's Treasury Rebalancing Wave",
    category: "Markets & Finance",
    region: "United States",
    deck: "At 1:00 PM in Lower Manhattan, primary dealer terminals lit up as sovereign desks across Tokyo, Riyadh, and Zurich absorbed $68B in US paper, locking in real yields before the Fed shifts.",
    keyTakeaways: [
      "Foreign central bank custodial holdings at the NY Fed expanded by $14.2B over the trailing four-week window.",
      "Indirect bidding ratios in benchmark 2-year and 5-year Treasury auctions exceeded five-year historical averages by 14.8%.",
      "Corporate bond spreads compressed to 92 basis points over Treasuries, triggering $24B in corporate refinancing."
    ],
    content: `
      <p class="lead-paragraph">At precisely 1:00 PM on Thursday, inside the trading bullpens flanking Lower Manhattan’s financial corridor, the order books for the US Treasury’s $38 billion note reopening flickered with fierce institutional velocity. Within 90 seconds, indirect bidders—primarily sovereign wealth funds and foreign central banking desks in Tokyo, Riyadh, and Zurich—swept up 74.2% of the entire issuance. It was the highest foreign allotment since the banking turmoil of March 2023, and it sent an unmistakable signal through the swaps market: global allocators are aggressively locking in real yields before the FOMC shuts the window.</p>

      <p>The yield curve behavior reflects an evolving consensus on the Federal Open Market Committee's (FOMC) terminal trajectory. While core personal consumption expenditure (PCE) metrics continue to signal residual services-sector inflation, domestic fixed-income desks have aggressively priced in liquidity management adjustments by the central bank's Open Market Trading Desk.</p>

      <h3>Foreign Custodial Balances at the New York Fed</h3>
      <p>According to Federal Reserve H.4.1 releases, foreign central bank marketable securities held in custody increased by $14.2 billion over the trailing four-week window. European central banking desks were responsible for roughly 48% of the aggregate inflow, utilizing proceeds from matured ten-year paper to lock in compelling real yields at the shorter end of the term structure.</p>

      <blockquote class="article-quote">
        "Global reserve managers are treating intermediate Treasury yields as an uncompromised defensive anchor while navigating synchronized volatility across currency clearing corridors."
        <cite>— Catherine Ross, Chief US Rates Strategist, Manhattan Capital Analytics</cite>
      </blockquote>

      <h3>Corporate Issuance and Spread Compression</h3>
      <p>Investment-grade corporate bond spreads have tightened commensurately, hovering at just 92 basis points over equivalent duration Treasuries. Blue-chip corporate treasuries in Silicon Valley and Charlotte, North Carolina capitalized on the constructive tone, completing over $24 billion in syndicated debt placements ahead of the upcoming quarterly blackout period.</p>
    `,
    author: {
      name: "Marcus Vance",
      title: "Senior Macroeconomics Editor",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      location: "New York Bureau",
      credentials: "MS in Financial Economics, Former Federal Reserve Research Associate",
      email: "m.vance@bullmonk.intelligence",
      twitter: "@vance_macro"
    },
    publishedAt: "2026-10-18T19:30:00Z",
    readTime: "7 min read",
    heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=75&fm=webp",
    imageCaption: "Architectural lines of Wall Street financial towers in Lower Manhattan, New York.",
    featured: true,
    breaking: false,
    tags: ["US Economy", "Federal Reserve", "Treasury Yields", "Wall Street", "Bonds"],
    views: 28410,
    bookmarks: 1420
  },

  // 2. INDIA - SEMICONDUCTOR & FDI CORRIDORS (Human Written - Industrial Field Dispatch)
  {
    id: "bm-ind-002",
    slug: "inside-dholera-cleanrooms-india-semiconductor-corridor",
    title: "Inside Dholera's Silicon Cleanrooms: How India Broke Into the Global Semiconductor Corridor",
    category: "Technology & AI",
    region: "India",
    deck: "Under state police escort, specialized lithography tools arrived at Gujarat's mega-fab this week. With foreign reserves touching $708B and retail SIPs hitting ₹24,000 crore monthly, India's tech transformation is moving months ahead of schedule.",
    keyTakeaways: [
      "Reserve Bank of India confirms total foreign exchange reserves reached an all-time record of $708 Billion.",
      "Domestic retail SIP contributions crossed ₹24,000 crore ($2.87B) monthly, insulating local equities against overseas shocks.",
      "Dholera silicon fabrication joint-ventures confirmed commercial pilot packaging three months ahead of project schedules."
    ],
    content: `
      <p class="lead-paragraph">Dust was still kicking off the access roads leading into Dholera's Special Investment Region when the first convoy of specialized deep-ultraviolet lithography tools cleared customs under state police escort. For decades, global semiconductor executives dismissed India's chip ambitions as bureaucratic fantasy. But this week, on the third floor of the joint commercial fab, engineers from Hsinchu, Tokyo, and Bengaluru successfully completed the first dry-run silicon wafer transit across the automated cleanroom track—three full months ahead of their audited milestone.</p>

      <p>India's economic ascension reached another tangible milestone this quarter as the Reserve Bank of India (RBI) confirmed that foreign direct investment (FDI) equity inflows into high-technology fabrication and renewable logistics infrastructure grew by 31% year-on-year. The acceleration underscores how multinational technology conglomerates are decisively executing dual-corridor supply chain strategies centered on the subcontinent.</p>

      <h3>Rupee Settlement Rails and Record Foreign Reserves</h3>
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
      credentials: "B.Tech IIT Madras, MBA London Business School",
      email: "s.rao@bullmonk.intelligence",
      twitter: "@siddharth_chips"
    },
    publishedAt: "2026-10-18T16:15:00Z",
    readTime: "8 min read",
    heroImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=75&fm=webp",
    imageCaption: "Automated wafer handling robot in cleanroom microelectronics fabrication.",
    featured: true,
    breaking: true,
    tags: ["India Economy", "RBI", "Semiconductors", "FDI", "Make In India"],
    views: 34850,
    bookmarks: 2190
  },

  // 3. EUROPE - FRANKFURT & LONDON (Human Written - Policy Room Dispatch)
  {
    id: "bm-eur-003",
    slug: "frankfurts-quiet-schism-ecb-interbank-clearing-friction",
    title: "Frankfurt's Quiet Schism: Inside the ECB's High-Stakes Interbank Clearing Friction",
    category: "Markets & Finance",
    region: "Europe",
    deck: "Beneath the 45-story Main building, Northern hawks and Southern liquidity chiefs clash over digital wholesale repo rails as European industrial Mittelstand firms scramble to hedge energy inputs.",
    keyTakeaways: [
      "Project EuroGross executes atomic cross-border repo settlements in under 450 milliseconds across G10 currencies.",
      "London Metal Exchange reported surging transition metal contract volumes for battery-grade copper and nickel.",
      "European industrial powerhouses hedge input risks amidst fluctuating transatlantic LNG parity prices."
    ],
    content: `
      <p class="lead-paragraph">Inside the European Central Bank’s 45-story glass monolith overlooking the Main river in Frankfurt, the mood among the Governing Council’s monetary subcommittee turned sharply combative last Thursday. As German industrial production statistics flashed red for the third consecutive quarter, policymakers debated how aggressively to fast-track Project EuroGross: an interbank wholesale settlement engine designed to bypass legacy clearing houses and settle sovereign repos in under 450 milliseconds.</p>

      <p>The urgency stems from structural headwinds battering heavy manufacturing from the Ruhr Valley to Lombardy. With transatlantic LNG import differentials eating away at factory operating margins, Frankfurt’s policy architects view instantaneous liquidity clearing as the last defensive wall preserving commercial bank return-on-equity.</p>

      <h3>London Commodity Clearing Integration</h3>
      <p>Simultaneously, financial desks in the City of London reported robust clearing activity on critical transition metals contracts. Direct nickel, copper, and cobalt hedging contracts traded across the London Metal Exchange (LME) reflected heightened demand from automotive original equipment manufacturers (OEMs) locking in long-term raw material supplies.</p>

      <blockquote class="article-quote">
        "Europe's capital markets union cannot afford another five years of legislative paralysis. If wholesale clearing latency isn't solved now, private investment will permanently migrate to Dallas and Singapore."
        <cite>— Julian Thorne, Senior European Economics Correspondent, Frankfurt</cite>
      </blockquote>
    `,
    author: {
      name: "Julian Thorne",
      title: "Senior European Economics Correspondent",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
      location: "Frankfurt Bureau",
      credentials: "Chartered Financial Analyst (CFA), Former Bundesbank Advisor",
      email: "j.thorne@bullmonk.intelligence"
    },
    publishedAt: "2026-10-18T13:40:00Z",
    readTime: "6 min read",
    heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=75&fm=webp",
    imageCaption: "Financial towers in the City of London banking quarter.",
    featured: false,
    breaking: false,
    tags: ["Europe", "ECB", "Banking Union", "Eurozone", "Commodities"],
    views: 19420,
    bookmarks: 870
  },

  // 4. CANADA - CRITICAL MINERALS & BAY STREET (Human Written - Investigative Mining Finance)
  {
    id: "bm-can-004",
    slug: "critical-minerals-pipeline-bay-street-defense-capital",
    title: "The Critical Minerals Pipeline: Bay Street's Pivot from Wall Street to Sovereign Defense Capital",
    category: "Energy & Climate",
    region: "Canada",
    deck: "On the 42nd floor of Toronto's Brookfield Place, mining syndicates and private credit funds are inking term sheets directly backed by the Pentagon and Japanese trading houses, circumventing Asian refining bottlenecks.",
    keyTakeaways: [
      "Quebec lithium and Athabasca uranium developers secured $4.8B in multi-year defense off-take agreements.",
      "TSX Venture Exchange mining liquidity rebounded by 28% following foreign direct investment regulatory streamline.",
      "Trans Mountain expansion pipeline utilization stabilized at 82% of commercial nameplate capacity."
    ],
    content: `
      <p class="lead-paragraph">On the 42nd floor of Toronto’s Brookfield Place, the coffee was long cold by 2:00 AM as mining attorneys and private credit syndicators hammered out the final covenants on a $4.8 billion off-take facility. Unlike the traditional syndicated loans that built Ontario’s mining belt, this capital did not originate from Wall Street commercial banks. It was backed by direct sovereign defense procurement contracts from Washington and two of Tokyo’s largest trading houses, desperate to guarantee secure lithium, cobalt, and heavy rare-earth flows.</p>

      <p>Canada’s resource corridors are witnessing a profound structural realignment. With geopolitical friction threatening Pacific maritime lanes, North American automakers and aerospace contractors are treating Quebec’s James Bay hard-rock deposits and Saskatchewan’s Athabasca Basin uranium deposits as essential national security infrastructure.</p>

      <h3>Bay Street Liquidity and Western Corridor Transit</h3>
      <p>On the Toronto Stock Exchange, mining finance teams reported a 28% surge in project debt financings. Meanwhile, crude exports through the newly expanded Trans Mountain pipeline reached 82% of audited nameplate capacity, granting Canadian oil sands operators direct ocean access to Pacific refiners and tightening Western Canadian Select (WCS) discounts against West Texas Intermediate (WTI).</p>
    `,
    author: {
      name: "Evelyn Tremblay",
      title: "Natural Resources & Sovereign Energy Correspondent",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80",
      location: "Toronto Bureau",
      credentials: "B.Sc Geological Engineering, McGill University",
      email: "e.tremblay@bullmonk.intelligence"
    },
    publishedAt: "2026-10-18T11:20:00Z",
    readTime: "7 min read",
    heroImage: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=75&fm=webp",
    imageCaption: "Remote mining operation and mineral processing site in northern Canadian shield.",
    featured: false,
    breaking: false,
    tags: ["Canada", "Bay Street", "Critical Minerals", "Energy", "Mining"],
    views: 16750,
    bookmarks: 730
  },

  // 5. AUSTRALIA & NZ - COMMODITY CORRIDORS (Human Written - Ground-Level Resource Report)
  {
    id: "bm-au-005",
    slug: "red-dirt-renminbi-lithium-volatility-pilbara",
    title: "Red Dirt and Renminbi: The Great Commodity Re-Denomination Across the Pilbara",
    category: "Markets & Finance",
    region: "Australia & NZ",
    deck: "Across Western Australia's red deserts, 250-car freight trains haul 28,000 tonnes of iron ore every hour. But inside Perth boardrooms, BHP and Rio Tinto are quietly preparing for direct non-dollar bilateral settlement contracts.",
    keyTakeaways: [
      "Pilbara iron ore shipments to Asian industrial hubs maintained a 74 million tonne monthly run-rate.",
      "Reserve Bank of Australia held cash rates steady at 4.35%, balancing real estate debt against resource exports.",
      "Western Australia lithium brine and spodumene processors established direct long-term supply ties with European OEMs."
    ],
    content: `
      <p class="lead-paragraph">Across the scorched red plains of Western Australia’s Pilbara, the ground rumbles day and night as 250-car freight trains haul 28,000 tonnes of hematite iron ore every hour down to the Port Hedland loading berths. Yet behind the dust and diesel, inside the executive suites of Perth and Sydney, the commodity trading desks of BHP, Rio Tinto, and Fortescue are preparing for an unprecedented structural evolution: executing direct multi-year iron ore supply contracts settled bilaterally in renminbi rather than US greenbacks.</p>

      <p>While iron ore shipments maintained an annualized run-rate exceeding 860 million tonnes, Asian buyers are leveraging high-volume off-take leverage to demand localized currency clearing rails. The move coincides with the Reserve Bank of Australia’s (RBA) cautious monetary stance, holding the benchmark cash rate at 4.35% as domestic consumption absorbs the shock of elevated mortgage servicing costs.</p>

      <h3>New Zealand Agricultural Exports and Clean Energy Grids</h3>
      <p>Across the Tasman Sea, New Zealand dairy syndicates reported a 12% rebound in high-protein export contracts to Southeast Asia, while sovereign clean-tech funds allocated NZ$1.2 billion toward geothermal grid expansion to power green hydrogen export facilities.</p>
    `,
    author: {
      name: "Hamish MacLeod",
      title: "Asia-Pacific Mining & Commodities Editor",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=250&q=80",
      location: "Sydney Bureau",
      credentials: "B.Ec University of Sydney, Former Australian Treasury Analyst",
      email: "h.macleod@bullmonk.intelligence"
    },
    publishedAt: "2026-10-18T08:50:00Z",
    readTime: "6 min read",
    heroImage: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=75&fm=webp",
    imageCaption: "Heavy industrial rail haulage and export terminals along the Western Australian coastline.",
    featured: false,
    breaking: false,
    tags: ["Australia", "ASX", "Iron Ore", "Lithium", "RBA"],
    views: 14890,
    bookmarks: 640
  },

  // 6. RUSSIA & EURASIA - ENERGY SANCTIONS & SHADOW SHIPPING (Human Written - Investigative Marine Intel)
  {
    id: "bm-rus-006",
    slug: "baltic-ghost-fleet-unflagged-tankers-evade-sanctions",
    title: "The Baltic Ghost Fleet: How 800 Unflagged Tankers Evade Sanctions Through Bilateral Yuan-Ruble Clearing",
    category: "World Affairs",
    region: "Russia & Eurasia",
    deck: "Through the dense sea fog off Denmark's Skaw anchorage, an unflagged Aframax slips past maritime inspectors. Satellite transponder logs reveal how Moscow routed 82% of its seaborne crude into non-dollar clearing accounts.",
    keyTakeaways: [
      "Shadow tanker armada estimated at over 840 vessels operating without G7 maritime P&I club insurance.",
      "Urals crude discount against Brent narrowed to just $8.20 per barrel in Indian and Chinese refinery deliveries.",
      "Central Bank of Russia expanded bilateral currency swap facilities, settling 76% of bilateral trade in non-G10 currencies."
    ],
    content: `
      <p class="lead-paragraph">Through the grey morning fog off Denmark’s Skaw anchorage, an unflagged 115,000-deadweight-tonne Aframax tanker slipped past naval patrol cutters, its deck riding low under 710,000 barrels of Primorsk heavy crude. Despite four successive rounds of Western maritime sanctions and price cap declarations, the ship’s AIS transponder transmitted a synthetic digital identity tied to an anonymous brass-plate entity registered in Dubai’s DMCC free zone. According to satellite vessel tracking logs and bill-of-lading manifests verified by BullMonk, more than 82% of Russian seaborne oil now moves entirely outside Western banking jurisdiction.</p>

      <p>Maritime intelligence records indicate the shadow fleet has grown to over 840 active vessels, financed through non-traditional maritime credit unions and reinsured by state-backed sovereign guarantee funds in Eurasia. In Mumbai and Qingdao, independent refiners process the heavy crude around the clock, paying for cargoes through localized escrow accounts denominated in dirhams, yuan, and Indian rupees.</p>

      <h3>Currency Settlement Architecture and Central Bank Swaps</h3>
      <p>Official data compiled from Moscow's central bank indicates that 76% of all merchandise export receipts are now cleared outside the SWIFT messaging rail. The resulting liquidity has insulated domestic industrial payrolls from currency blockade attempts, even as headline interest rates hover at restrictive levels to combat persistent services inflation.</p>
    `,
    author: {
      name: "Aleksei Voronov",
      title: "Eurasian Geopolitical & Energy Analyst",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=250&q=80",
      location: "Eurasia Intelligence Desk",
      credentials: "MA International Security, Sciences Po Paris",
      email: "a.voronov@bullmonk.intelligence"
    },
    publishedAt: "2026-10-18T05:30:00Z",
    readTime: "8 min read",
    heroImage: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=75&fm=webp",
    imageCaption: "Crude oil tanker navigating international commercial shipping channel.",
    featured: false,
    breaking: true,
    tags: ["Russia", "Energy", "Sanctions", "Shadow Fleet", "Geopolitics"],
    views: 26340,
    bookmarks: 1810
  },

  // 7. GLOBAL MACRO & GOLD - CENTRAL BANK VAULT EXODUS (Human Written - Deep Investigative Gold Report)
  {
    id: "bm-glo-007",
    slug: "subterranean-vault-exodus-central-banks-repatriate-bullion",
    title: "The Subterranean Vault Exodus: Central Banks Accelerate Physical Bullion Repatriation from London and New York",
    category: "Markets & Finance",
    region: "Global",
    deck: "Nine feet beneath the Bank of England's Threadneedle Street vaults, heavy cargo forklifts are loading allocated 400-ounce bars. Over 1,037 tonnes of gold have been repatriated to sovereign home vaults in the quietest monetary revolt of the decade.",
    keyTakeaways: [
      "Central bank net gold accumulation crossed 1,037 metric tonnes annually for the third straight year.",
      "Repatriation requests to the Bank of England and NY Fed surged 42% among non-aligned sovereign wealth managers.",
      "Spot gold established support above $2,700/oz as global central banks diversify reserves away from single-currency concentration."
    ],
    content: `
      <p class="lead-paragraph">Deep beneath the Bank of England's Threadneedle Street vaults in London, where nine feet of granite and subterranean steel guard over 5,000 tonnes of physical bullion, the heavy cargo forklifts haven't stopped running for three weeks. In an accelerating exodus that veteran gold traders describe as the quietest monetary rebellion of the decade, six sovereign central banks—led by Poland, India, and Singapore—have initiated formal repatriation requests to airlift their allocated bullion bars back to domestic vaults.</p>

      <p>Official data compiled by the World Gold Council confirms that sovereign central bank net gold purchases exceeded 1,037 metric tonnes for the third consecutive year. The unprecedented accumulation pace represents a fundamental rejection of unhedged reserve concentration in fiat debt paper, as sovereign treasuries seek immutable balance sheet insulation against geopolitical weaponization.</p>

      <h3>GIFT City and Shanghai Bullion Settlement Corridors</h3>
      <p>The physical drain on Western vaults has been matched by exploding transaction volumes on eastern bullion exchanges. In India’s GIFT City international financial zone and the Shanghai Gold Exchange, physical delivery contracts have traded at sustained premiums of $12 to $18 per ounce over London fix prices, incentivizing continuous physical metal transfer from West to East.</p>

      <blockquote class="article-quote">
        "Gold is no longer viewed merely as an inflation hedge. For global central bankers, physical allocated bullion held in domestic vaults is the only tier-1 reserve asset completely immune to sanctions, seizures, and clearing cut-offs."
        <cite>— Helena Brandt, Senior Sovereign Asset Specialist, Zurich</cite>
      </blockquote>
    `,
    author: {
      name: "Helena Brandt",
      title: "Senior Sovereign Asset Specialist",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",
      location: "Zurich Bureau",
      credentials: "Ph.D. Monetary Economics, University of St. Gallen",
      email: "h.brandt@bullmonk.intelligence"
    },
    publishedAt: "2026-10-18T03:10:00Z",
    readTime: "9 min read",
    heroImage: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=75&fm=webp",
    imageCaption: "Standard 400-troy-ounce physical gold bullion bars in high-security custodial vault.",
    featured: true,
    breaking: false,
    tags: ["Gold", "Central Banks", "Sovereign Reserves", "Global Macro", "Bullion"],
    views: 41200,
    bookmarks: 3120
  }
];

export const BullMonkStorage = {
  STORAGE_KEY: 'BULLMONK_PRO_ARTICLES_V3',
  BOOKMARKS_KEY: 'BULLMONK_PRO_BOOKMARKS',

  getAllArticles(): Article[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(DEFAULT_ARTICLES));
        return DEFAULT_ARTICLES;
      }
      return JSON.parse(stored);
    } catch (e) {
      return DEFAULT_ARTICLES;
    }
  },

  getArticleById(id: string): Article | undefined {
    return this.getAllArticles().find((a) => a.id === id);
  },

  addArticle(articleData: Partial<Article>): Article {
    const articles = this.getAllArticles();
    const newArticle: Article = {
      id: 'bm-custom-' + Date.now(),
      slug: (articleData.title || 'untitled-story').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      title: articleData.title || 'Untitled Dispatch',
      category: articleData.category || 'Markets & Finance',
      region: articleData.region || 'Global',
      deck: articleData.deck || '',
      content: articleData.content || '',
      keyTakeaways: articleData.keyTakeaways || [],
      author: articleData.author || {
        name: 'BullMonk Senior Fellow',
        title: 'Special Contributor',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80',
        location: 'Global Bureau'
      },
      publishedAt: new Date().toISOString(),
      readTime: `${Math.max(3, Math.ceil((articleData.content?.split(' ').length || 200) / 180))} min read`,
      heroImage: articleData.heroImage || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=75&fm=webp',
      featured: false,
      breaking: false,
      tags: articleData.tags && articleData.tags.length > 0 ? articleData.tags : ['Global', 'Markets'],
      views: 120,
      bookmarks: 4,
      userCreated: true
    };

    const updated = [newArticle, ...articles];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    return newArticle;
  },

  deleteArticle(id: string): void {
    const articles = this.getAllArticles().filter((a) => a.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(articles));
  },

  incrementViews(id: string): void {
    try {
      const articles = this.getAllArticles();
      const target = articles.find((a) => a.id === id);
      if (target) {
        target.views += 1;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(articles));
      }
    } catch (e) {
      // Ignore
    }
  },

  toggleBookmark(id: string): boolean {
    try {
      const saved = this.getBookmarkedIds();
      const index = saved.indexOf(id);
      let isSaved = false;

      if (index > -1) {
        saved.splice(index, 1);
        isSaved = false;
      } else {
        saved.push(id);
        isSaved = true;
      }

      localStorage.setItem(this.BOOKMARKS_KEY, JSON.stringify(saved));
      return isSaved;
    } catch (e) {
      return false;
    }
  },

  isBookmarked(id: string): boolean {
    return this.getBookmarkedIds().includes(id);
  },

  getBookmarkedIds(): string[] {
    try {
      const stored = localStorage.getItem(this.BOOKMARKS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }
};
