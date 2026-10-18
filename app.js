// BullMonk Global News Engine - Application Controller & Interactive Logic

document.addEventListener("DOMContentLoaded", () => {
  BullMonkApp.init();
});

const BullMonkApp = {
  currentCategory: "all",
  searchQuery: "",
  activeAudio: null,

  init() {
    this.initTheme();
    this.renderMarketTicker();
    this.initScrollProgress();
    this.initMobileNav();
    this.bindGlobalEvents();

    // Context-specific page initializations
    if (document.getElementById("featured-hero-container")) {
      this.initHomePage();
    }
    if (document.getElementById("article-reader-container")) {
      this.initArticleReaderPage();
    }
    if (document.getElementById("studio-form")) {
      this.initStudioPage();
    }
    if (document.querySelector(".legal-tabs")) {
      this.initLegalTabs();
    }
    if (document.getElementById("contact-form")) {
      this.initContactPage();
    }
  },

  // 1. Theme Management (Sleek Dark by default, Luxe Paper Light)
  initTheme() {
    const savedTheme = localStorage.getItem("BULLMONK_THEME") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    this.updateThemeToggleIcon(savedTheme);

    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme") || "dark";
        const target = current === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", target);
        localStorage.setItem("BULLMONK_THEME", target);
        this.updateThemeToggleIcon(target);
        this.showToast(`Switched to ${target === 'dark' ? 'Night Terminal' : 'Prestige Paper'} edition`);
      });
    }
  },

  updateThemeToggleIcon(theme) {
    const iconEl = document.getElementById("theme-toggle-icon");
    if (!iconEl) return;
    if (theme === "dark") {
      iconEl.innerHTML = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`;
    } else {
      iconEl.innerHTML = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>`;
    }
  },

  // 2. Live Market Ticker
  renderMarketTicker() {
    const track = document.getElementById("ticker-track");
    if (!track || !window.MARKET_TICKERS) return;

    const items = [...window.MARKET_TICKERS, ...window.MARKET_TICKERS]; // duplicate for seamless looping
    track.innerHTML = items.map(item => `
      <div class="ticker-item">
        <span class="ticker-symbol">${item.symbol}</span>
        <span class="ticker-val">${item.value}</span>
        <span class="ticker-change ${item.positive ? 'positive' : 'negative'}">
          ${item.positive ? '▲' : '▼'} ${item.change}
        </span>
      </div>
    `).join("");
  },

  // 3. Scroll Reading Progress Bar
  initScrollProgress() {
    const bar = document.getElementById("reading-progress");
    if (!bar) return;
    window.addEventListener("scroll", () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    });
  },

  // 4. Mobile Navigation
  initMobileNav() {
    const toggle = document.getElementById("mobile-menu-toggle");
    const nav = document.getElementById("site-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        nav.classList.toggle("mobile-open");
      });
    }
  },

  // 5. Home Page Logic
  initHomePage() {
    this.renderArticles();
    this.initCategoryFilters();
    this.initSearchFilter();
    this.initNewsletterForm();
  },

  renderArticles() {
    const articles = window.BullMonkDB.getAllArticles();
    const heroContainer = document.getElementById("featured-hero-container");
    const asideContainer = document.getElementById("hero-aside-list");
    const gridContainer = document.getElementById("articles-grid");
    const countDisplay = document.getElementById("articles-count-display");

    // Filter articles based on category & search
    let filtered = articles.filter(art => {
      const matchCat = this.currentCategory === "all" || art.category.toLowerCase().includes(this.currentCategory.toLowerCase());
      const query = this.searchQuery.trim().toLowerCase();
      const matchQuery = !query ||
        art.title.toLowerCase().includes(query) ||
        (art.deck && art.deck.toLowerCase().includes(query)) ||
        art.category.toLowerCase().includes(query) ||
        art.author.name.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });

    if (countDisplay) {
      countDisplay.textContent = `${filtered.length} Dispatches Recorded`;
    }

    // Lead Hero Rendering (First featured or first item)
    if (heroContainer) {
      const lead = filtered.find(a => a.featured) || filtered[0] || articles[0];
      if (lead) {
        const isSaved = window.BullMonkDB.isBookmarked(lead.id);
        heroContainer.innerHTML = `
          <article class="lead-card" onclick="window.location.href='article.html?id=${lead.id}'">
            <div class="lead-media-wrap">
              <img src="${lead.heroImage}" alt="${lead.title}" class="lead-img" loading="eager" />
              <div class="lead-overlay">
                <div class="badge-row">
                  ${lead.breaking ? '<span class="badge badge-breaking"><span class="ticker-label-pulse"></span> Breaking Intelligence</span>' : ''}
                  <span class="badge badge-category">${lead.category}</span>
                  <span class="badge badge-desk">${lead.author.location}</span>
                </div>
                <h2 class="lead-title">${lead.title}</h2>
                <p class="lead-deck">${lead.deck}</p>
                <div class="lead-meta">
                  <div class="author-pill">
                    <img src="${lead.author.avatar}" alt="${lead.author.name}" class="author-avatar" />
                    <div class="author-details">
                      <span class="author-name">${lead.author.name}</span>
                      <span class="author-role">${lead.author.title}</span>
                    </div>
                  </div>
                  <div style="display:flex; align-items:center; gap: 1rem;">
                    <span>🕒 ${lead.readTime}</span>
                    <span>👁️ ${lead.views.toLocaleString()}</span>
                    <button class="card-bookmark-btn ${isSaved ? 'active' : ''}" title="Save Dispatch" onclick="event.stopPropagation(); BullMonkApp.handleBookmark('${lead.id}', this)">
                      ${isSaved ? '★' : '☆'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        `;
      }
    }

    // Hero Aside Column (Next 4 dispatches)
    if (asideContainer) {
      const asideItems = filtered.slice(1, 5);
      asideContainer.innerHTML = asideItems.map(item => `
        <div class="aside-item" onclick="window.location.href='article.html?id=${item.id}'">
          <span class="aside-item-cat">${item.category} • ${item.author.location}</span>
          <h4 class="aside-item-title">${item.title}</h4>
          <div class="aside-item-meta">
            <span>By ${item.author.name}</span>
            <span>•</span>
            <span>${item.readTime}</span>
          </div>
        </div>
      `).join("");
    }

    // Main Grid Rendering
    if (gridContainer) {
      if (filtered.length === 0) {
        gridContainer.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; background: var(--bg-surface); border-radius: var(--radius-md); border: 1px dashed var(--border-medium);">
            <div style="font-size: 2.5rem; margin-bottom: 0.8rem;">🔍</div>
            <h3 style="font-family: var(--font-brand); font-size: 1.3rem; margin-bottom: 0.5rem;">No Dispatches Found</h3>
            <p style="color: var(--text-muted); max-width: 440px; margin: 0 auto 1.5rem;">We couldn't locate any intelligence matches for "${this.searchQuery}" in ${this.currentCategory}.</p>
            <button class="btn btn-primary" onclick="BullMonkApp.resetFilters()">Reset Global Search</button>
          </div>
        `;
        return;
      }

      gridContainer.innerHTML = filtered.map(art => {
        const isSaved = window.BullMonkDB.isBookmarked(art.id);
        const formattedDate = new Date(art.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
        return `
          <article class="article-card" onclick="window.location.href='article.html?id=${art.id}'">
            <div class="card-media">
              <img src="${art.heroImage}" alt="${art.title}" class="card-img" loading="lazy" />
              <div class="card-badge">
                <span class="badge ${art.breaking ? 'badge-breaking' : 'badge-category'}">${art.category}</span>
              </div>
              <button class="card-bookmark-btn ${isSaved ? 'active' : ''}" title="Bookmark Story" onclick="event.stopPropagation(); BullMonkApp.handleBookmark('${art.id}', this)">
                ${isSaved ? '★' : '☆'}
              </button>
            </div>
            <div class="card-body">
              <div class="card-category-meta">
                <span>${art.author.location}</span>
                <span>${formattedDate}</span>
              </div>
              <h3 class="card-title">${art.title}</h3>
              <p class="card-deck">${art.deck || (art.content ? art.content.replace(/<[^>]*>?/gm, '').slice(0, 140) + '...' : '')}</p>
              <div class="card-footer">
                <div class="card-author-info">
                  <img src="${art.author.avatar}" alt="${art.author.name}" class="card-author-avatar" />
                  <span class="card-author-name">${art.author.name}</span>
                </div>
                <span>${art.readTime}</span>
              </div>
            </div>
          </article>
        `;
      }).join("");
    }
  },

  initCategoryFilters() {
    const tabs = document.querySelectorAll(".cat-tab");
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        this.currentCategory = tab.getAttribute("data-category") || "all";
        this.renderArticles();
      });
    });
  },

  initSearchFilter() {
    const searchInput = document.getElementById("global-search-input");
    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => {
      this.searchQuery = e.target.value;
      this.renderArticles();
    });
  },

  resetFilters() {
    this.currentCategory = "all";
    this.searchQuery = "";
    const searchInput = document.getElementById("global-search-input");
    if (searchInput) searchInput.value = "";
    const tabs = document.querySelectorAll(".cat-tab");
    tabs.forEach(t => t.classList.toggle("active", t.getAttribute("data-category") === "all"));
    this.renderArticles();
  },

  handleBookmark(articleId, buttonEl) {
    const active = window.BullMonkDB.toggleBookmark(articleId);
    buttonEl.classList.toggle("active", active);
    buttonEl.innerHTML = active ? '★' : '☆';
    this.showToast(active ? "Story saved to your private dossier" : "Story removed from saved dossier");
  },

  initNewsletterForm() {
    const form = document.getElementById("newsletter-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input[type='email']");
      if (input && input.value) {
        this.showToast(`Subscribed! "The Morning Monk" dispatch will arrive at ${input.value}`);
        input.value = "";
      }
    });
  },

  // 6. Article Reader Page Logic
  initArticleReaderPage() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || "bm-2026-001";
    const article = window.BullMonkDB.getArticleById(id);

    const container = document.getElementById("article-reader-container");
    if (!container) return;

    if (!article) {
      container.innerHTML = `
        <div style="text-align: center; padding: 5rem 1rem;">
          <h2 style="font-family: var(--font-serif); font-size: 2rem; margin-bottom: 1rem;">Dispatch Not Found</h2>
          <p style="color: var(--text-secondary); margin-bottom: 2rem;">The requested intelligence briefing does not exist or has been archived.</p>
          <a href="index.html" class="btn btn-primary">Return to Global Front</a>
        </div>
      `;
      return;
    }

    // Increment read views
    window.BullMonkDB.incrementViews(article.id);

    // Populate metadata
    document.title = `${article.title} | BullMonk Global Intelligence`;
    const formattedDate = new Date(article.publishedAt).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const isSaved = window.BullMonkDB.isBookmarked(article.id);

    container.innerHTML = `
      <header class="article-header">
        <div class="article-read-meta">
          <span class="badge ${article.breaking ? 'badge-breaking' : 'badge-category'}">${article.category}</span>
          <span style="font-size: 0.8rem; color: var(--accent-gold); font-weight: 700; text-transform: uppercase;">${article.author.location} Bureau</span>
          <span style="color: var(--text-muted);">•</span>
          <span style="font-size: 0.82rem; color: var(--text-secondary);">${formattedDate}</span>
        </div>

        <h1 class="article-main-title">${article.title}</h1>
        ${article.deck ? `<p class="article-main-deck">${article.deck}</p>` : ''}

        <div class="article-byline-bar">
          <div class="author-pill">
            <img src="${article.author.avatar}" alt="${article.author.name}" class="author-avatar" style="width: 44px; height: 44px;" />
            <div class="author-details">
              <span class="author-name" style="font-size: 0.95rem;">${article.author.name}</span>
              <span class="author-role">${article.author.title} • ${article.author.location}</span>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <button class="btn btn-icon ${isSaved ? 'active' : ''}" id="article-save-btn" title="Bookmark Article">
              ${isSaved ? '★' : '☆'}
            </button>
            <button class="btn btn-icon" id="article-share-btn" title="Copy Dispatch Link">
              🔗
            </button>
            <button class="btn btn-icon" id="article-font-btn" title="Toggle Larger Font">
              A<sup>+</sup>
            </button>
          </div>
        </div>
      </header>

      <!-- Audio Briefing Player -->
      <div class="audio-player-bar" id="audio-player-bar">
        <button class="audio-play-btn" id="audio-btn" title="Play Voice Briefing">
          ▶
        </button>
        <div class="audio-track-info">
          <div class="audio-track-title">
            <span>🎙️ BullMonk Audio Briefing: Synthetic Voice Dispatch</span>
            <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: normal;">(${article.readTime})</span>
          </div>
          <div class="audio-waveform">
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
          </div>
        </div>
        <span style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--accent-gold);" id="audio-time">0:00 / 4:15</span>
      </div>

      <!-- Lead Media -->
      <figure class="article-lead-media">
        <img src="${article.heroImage}" alt="${article.title}" class="article-lead-img" />
        ${article.imageCaption ? `<figcaption class="image-caption">${article.imageCaption}</figcaption>` : ''}
      </figure>

      <!-- Article Content Prose -->
      <div class="article-prose" id="article-body">
        ${article.content}
      </div>

      <!-- Tags & Dossier Bar -->
      <div class="article-tags-bar">
        <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-right: 0.5rem;">Topics:</span>
        ${(article.tags || []).map(tag => `<span class="article-tag">#${tag}</span>`).join("")}
      </div>

      <!-- Interactive Article Reactions / Comments Section -->
      <section style="margin-top: 3.5rem; padding-top: 2.5rem; border-top: 1px solid var(--border-subtle);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1.5rem;">
          <h3 style="font-family: var(--font-serif); font-size: 1.6rem;">Global Reader Dialogue</h3>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Verified Subscribers & Analysts</span>
        </div>

        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.5rem; margin-bottom: 2rem;">
          <textarea id="comment-input" class="form-control" rows="3" placeholder="Contribute institutional analysis or perspective on this report..." style="margin-bottom: 1rem;"></textarea>
          <div style="display:flex; justify-content: flex-end;">
            <button class="btn btn-primary" id="post-comment-btn">Submit Verified Commentary</button>
          </div>
        </div>

        <div id="comments-list" style="display:flex; flex-direction:column; gap: 1.25rem;">
          <div style="background: var(--bg-surface-elevated); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
            <div style="display:flex; justify-content:space-between; margin-bottom: 0.5rem;">
              <span style="font-weight: 700; font-size: 0.88rem; color: var(--accent-gold);">Dr. Arthur Pendelton • Oxford Institute for Global Finance</span>
              <span style="font-size: 0.74rem; color: var(--text-muted);">2 hours ago</span>
            </div>
            <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">The cross-border liquidity latency metrics reported here match what we've been observing in synthetic stress simulations. If Phase Two sustains this throughput, Tier-1 custodians will likely reallocate reserves within the first two quarters.</p>
          </div>
        </div>
      </section>
    `;

    // Audio Briefing Player Logic
    const audioBtn = document.getElementById("audio-btn");
    const audioBar = document.getElementById("audio-player-bar");
    let isPlaying = false;
    let audioTimer = null;
    let secondsElapsed = 0;

    if (audioBtn) {
      audioBtn.addEventListener("click", () => {
        isPlaying = !isPlaying;
        audioBar.classList.toggle("playing", isPlaying);
        audioBtn.textContent = isPlaying ? "⏸" : "▶";

        if (isPlaying) {
          this.showToast("Voice Briefing Active - Synthesized Audio Stream Playing");
          audioTimer = setInterval(() => {
            secondsElapsed++;
            const mins = Math.floor(secondsElapsed / 60);
            const secs = secondsElapsed % 60;
            const timeEl = document.getElementById("audio-time");
            if (timeEl) {
              timeEl.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs} / 4:15`;
            }
            if (secondsElapsed >= 255) {
              clearInterval(audioTimer);
              isPlaying = false;
              audioBar.classList.remove("playing");
              audioBtn.textContent = "▶";
            }
          }, 1000);
        } else {
          clearInterval(audioTimer);
        }
      });
    }

    // Share Button
    const shareBtn = document.getElementById("article-share-btn");
    if (shareBtn) {
      shareBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(window.location.href);
        this.showToast("Link copied to clipboard!");
      });
    }

    // Bookmark Toggle
    const saveBtn = document.getElementById("article-save-btn");
    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        const active = window.BullMonkDB.toggleBookmark(article.id);
        saveBtn.classList.toggle("active", active);
        saveBtn.textContent = active ? '★' : '☆';
        this.showToast(active ? "Dispatch saved to private reading dossier" : "Dispatch removed from dossier");
      });
    }

    // Font Toggle
    const fontBtn = document.getElementById("article-font-btn");
    const proseEl = document.getElementById("article-body");
    if (fontBtn && proseEl) {
      let isLarge = false;
      fontBtn.addEventListener("click", () => {
        isLarge = !isLarge;
        proseEl.style.fontSize = isLarge ? "1.35rem" : "1.15rem";
        this.showToast(isLarge ? "Comfort reading font enabled" : "Standard reading font enabled");
      });
    }

    // Comment Submission
    const postCommentBtn = document.getElementById("post-comment-btn");
    const commentInput = document.getElementById("comment-input");
    const commentsList = document.getElementById("comments-list");
    if (postCommentBtn && commentInput && commentsList) {
      postCommentBtn.addEventListener("click", () => {
        const val = commentInput.value.trim();
        if (!val) {
          this.showToast("Please write a comment before submitting.");
          return;
        }
        const commentDiv = document.createElement("div");
        commentDiv.style.cssText = "background: var(--bg-surface-elevated); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); animation: slide-in-toast 0.3s ease;";
        commentDiv.innerHTML = `
          <div style="display:flex; justify-content:space-between; margin-bottom: 0.5rem;">
            <span style="font-weight: 700; font-size: 0.88rem; color: var(--accent-gold);">You (Verified Analyst)</span>
            <span style="font-size: 0.74rem; color: var(--text-muted);">Just now</span>
          </div>
          <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">${val.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
        `;
        commentsList.prepend(commentDiv);
        commentInput.value = "";
        this.showToast("Comment successfully broadcasted to dialogue room!");
      });
    }
  },

  // 7. Write Article / CMS Studio Page
  initStudioPage() {
    const form = document.getElementById("studio-form");
    if (!form) return;

    // Preset Image Chips
    const presetChips = document.querySelectorAll(".preset-chip");
    const heroInput = document.getElementById("article-hero-image");
    presetChips.forEach(chip => {
      chip.addEventListener("click", () => {
        if (heroInput) {
          heroInput.value = chip.getAttribute("data-url");
          this.showToast(`Selected "${chip.textContent.trim()}" image preset`);
        }
      });
    });

    // Formatting Toolbar Helpers
    const textarea = document.getElementById("article-content");
    const toolBtns = document.querySelectorAll(".tool-btn");
    toolBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        if (!textarea) return;
        const tag = btn.getAttribute("data-tag");
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = textarea.value.substring(start, end) || "text here";
        let replacement = "";
        if (tag === "b") replacement = `<strong>${selected}</strong>`;
        else if (tag === "i") replacement = `<em>${selected}</em>`;
        else if (tag === "h3") replacement = `\n<h3>${selected}</h3>\n`;
        else if (tag === "quote") replacement = `\n<blockquote class="article-quote">\n  "${selected}"\n  <cite>— Source Name</cite>\n</blockquote>\n`;
        else if (tag === "p") replacement = `\n<p>${selected}</p>\n`;

        textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
        textarea.focus();
      });
    });

    // Publish Submit
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const title = document.getElementById("article-title").value.trim();
      const category = document.getElementById("article-category").value;
      const deck = document.getElementById("article-deck").value.trim();
      const content = document.getElementById("article-content").value.trim();
      const authorName = document.getElementById("article-author-name").value.trim() || "BullMonk Editor";
      const authorTitle = document.getElementById("article-author-title").value.trim() || "Correspondent";
      const authorLocation = document.getElementById("article-author-location").value.trim() || "Global Desk";
      const heroImage = document.getElementById("article-hero-image").value.trim() || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80";
      const imageCaption = document.getElementById("article-image-caption").value.trim() || "BullMonk exclusive dispatch.";
      const tags = document.getElementById("article-tags").value.trim();
      const breaking = document.getElementById("article-breaking").checked;

      if (!title || !content) {
        this.showToast("Please provide both a Headline and Article Content.");
        return;
      }

      // Convert simple line breaks to paragraphs if plain text
      let formattedContent = content;
      if (!formattedContent.includes("<p>")) {
        formattedContent = formattedContent
          .split("\n\n")
          .map((para, i) => `<p class="${i === 0 ? 'lead-paragraph' : ''}">${para.trim()}</p>`)
          .join("\n");
      }

      const created = window.BullMonkDB.addArticle({
        title,
        category,
        deck,
        content: formattedContent,
        authorName,
        authorTitle,
        authorLocation,
        heroImage,
        imageCaption,
        tags,
        breaking,
        featured: true
      });

      this.showToast("Article published to BullMonk Global Wire!");
      setTimeout(() => {
        window.location.href = `article.html?id=${created.id}`;
      }, 1000);
    });
  },

  // 8. Legal Center Tabs
  initLegalTabs() {
    const tabs = document.querySelectorAll(".legal-tab-btn");
    const panes = document.querySelectorAll(".legal-pane");

    // Check URL hash
    const hash = window.location.hash ? window.location.hash.substring(1) : "terms";
    
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const targetId = tab.getAttribute("data-tab");
        tabs.forEach(t => t.classList.remove("active"));
        panes.forEach(p => p.classList.remove("active"));

        tab.classList.add("active");
        const activePane = document.getElementById(targetId);
        if (activePane) activePane.classList.add("active");
        window.location.hash = targetId;
      });

      if (tab.getAttribute("data-tab") === hash) {
        tabs.forEach(t => t.classList.remove("active"));
        panes.forEach(p => p.classList.remove("active"));
        tab.classList.add("active");
        const activePane = document.getElementById(hash);
        if (activePane) activePane.classList.add("active");
      }
    });
  },

  // 9. Contact Page Form
  initContactPage() {
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.showToast("Inquiry received. The BullMonk editorial desk will review your transmission.");
        contactForm.reset();
      });
    }

    const tipForm = document.getElementById("tip-form");
    if (tipForm) {
      tipForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.showToast("Encrypted tip securely encrypted and dispatched to investigative bureau.");
        tipForm.reset();
      });
    }
  },

  // 10. Global Event Bindings
  bindGlobalEvents() {
    // Quick escape to close mobile nav
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const nav = document.getElementById("site-nav");
        if (nav) nav.classList.remove("mobile-open");
      }
    });
  },

  // Toast Notification Utility
  showToast(message) {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <span style="color: var(--accent-gold); font-size: 1.1rem;">⚡</span>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = "opacity 0.4s ease, transform 0.4s ease";
      toast.style.opacity = "0";
      toast.style.transform = "translateX(50px)";
      setTimeout(() => toast.remove(), 400);
    }, 3800);
  }
};

window.BullMonkApp = BullMonkApp;
