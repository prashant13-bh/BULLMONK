# ⚡ BULLMONK — Global Intelligence & Market Truth

> **Unfiltered Global Journalism, Geopolitical Analysis & Financial Truth**  
> Built with **React 19 + TypeScript + Vite + Lucide Icons + Vanilla CSS Design System**

BullMonk is an international news and analytical intelligence platform engineered to bridge fast-paced financial markets and rigorous, monastic investigative journalism.

---

## 🌟 Architecture & Features

- **🏛️ Flagship Wire (`HomePage.tsx`)**: Real-time scrolling market ticker (S&P 500, NASDAQ, FTSE 100, Nikkei 225, Brent Crude, Gold, Bitcoin), breaking news alerts, lead hero dispatches, multi-category filter tabs, live search with instant filtering, macroeconomic radar, and daily institutional newsletter.
- **✍️ BullMonk Editorial Studio (`WriteStudioPage.tsx`)**: Full-featured CMS authoring suite allowing journalists to compose headlines, subdecks, bureau locations, author credentials, pick high-resolution editorial visual presets, use rich formatting toolbars, preview stories live, and publish instantly to the global wire with client-side persistence and story management.
- **🎙️ Immersive Reader View (`ArticleReaderPage.tsx`)**: Standalone reading view featuring a simulated synthetic audio voice briefing player with dynamic waveform equalizer animations, font-size zoom toggles, one-click sharing, dossier bookmarking, and interactive verified commentary.
- **🌐 Continental Bureaus & Manifesto (`AboutPage.tsx`)**: The founding thesis—**The Bull** (market momentum & animal spirits) and **The Monk** (disciplined forensic verification)—with 6 continental bureaus (Zurich, London, Tokyo, Singapore, Dubai, New York) and the Editorial Board.
- **⚖️ Legal Suite & Ethics Charter (`LegalPage.tsx`)**: Tabbed compliance center covering Terms of Service, Privacy Shield (GDPR / CCPA / Swiss FADP), Editorial Standards & Ethics, and Cookie Telemetry policies.
- **🔒 Encrypted Whistleblower Tip Line (`ContactPage.tsx`)**: Zero-knowledge whistleblower portal with PGP fingerprint, bureau directory, and interactive FAQ.
- **📱 100% Device Responsiveness**: Handcrafted responsive breakpoints for Mobile Portrait (<640px), Mobile Landscape / Tablets (640px-1024px), and Widescreen Desktops (>1024px) with custom mobile drawer navigation.
- **🌗 Dual-Mode Design System**: **Night Terminal** (obsidian & monastic gold) and **Prestige Paper** (warm luxury newsprint) with CSS variables and instant theme toggling.

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Build for production
npm run build
```

Then visit:
```
http://localhost:5173
```

---

## 📂 Project Structure

```
BullMonk/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx         # Header, ticker marquee, mobile drawer, theme toggle
│   │   └── Footer.tsx         # Desk links, bureau directory, governance links
│   ├── pages/
│   │   ├── HomePage.tsx       # Flagship landing wire & macro radar
│   │   ├── WriteStudioPage.tsx# CMS Studio for drafting & broadcasting stories
│   │   ├── ArticleReaderPage.tsx # Deep reader view & audio briefing player
│   │   ├── AboutPage.tsx      # Founding manifesto & 6 continental bureaus
│   │   ├── ContactPage.tsx    # Whistleblower tip line & press inquiry form
│   │   └── LegalPage.tsx      # Tabbed legal, privacy, and ethics center
│   ├── data/
│   │   └── newsData.ts        # Seed articles, market tickers, and storage manager
│   ├── types/
│   │   └── index.ts           # Strongly typed data models
│   ├── styles/
│   │   └── index.css          # Vanilla CSS responsive design system
│   ├── App.tsx                # Main controller & state routing
│   └── main.tsx               # React root entry point
├── index.html                 # HTML shell with meta tags & SEO schema
├── vite.config.ts             # Vite configuration
└── tsconfig.json              # TypeScript configuration
```

---

## 📜 License & Syndication
© 2026 BULLMONK Intelligence Group Ltd. All rights reserved.
