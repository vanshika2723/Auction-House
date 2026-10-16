
/* ==========================================================
   AUCTION HOUSE — COMPLETE FIXED JAVASCRIPT
   Dark & Gold | Demo Project | LocalStorage

   Features:
   - Sign In / Register / Guest Account
   - Auction Details & Bidding
   - Bid History & View Button
   - Watchlist
   - Seller Listings
   - Dashboard & Won Items
   - Demo Payment & Payment History
   - Countdown Timer & Winner Detection
   - Search, Filters & Sorting
   - Light / Dark Theme
   - Mobile Menu
   - Newsletter & Contact Form
========================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

  const KEYS = {
    user: "ah_user_v2",
    watchlist: "ah_watchlist_v2",
    bids: "ah_bids_v2",
    listings: "ah_listings_v2",
    theme: "ah_theme_v2",
    newsletter: "ah_newsletter_v2",
    wins: "ah_wins_v2",
    auctionEnds: "ah_auction_ends_v2",
    payments: "ah_payments_v2"
  };

  /* =========================
     LOCAL STORAGE
  ========================= */

  function load(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn("Local storage unavailable:", error);
    }
  }

  let user = load(KEYS.user, null);
  let watchlist = load(KEYS.watchlist, []);
  let bids = load(KEYS.bids, []);
  let listings = load(KEYS.listings, []);
  let auctionOutcomes = load(KEYS.wins, []);
  let savedAuctionEnds = load(KEYS.auctionEnds, {});
  let payments = load(KEYS.payments, []);

  if (!Array.isArray(watchlist)) watchlist = [];
  if (!Array.isArray(bids)) bids = [];
  if (!Array.isArray(listings)) listings = [];
  if (!Array.isArray(auctionOutcomes)) auctionOutcomes = [];
  if (!Array.isArray(payments)) payments = [];

  if (
    !savedAuctionEnds ||
    typeof savedAuctionEnds !== "object" ||
    Array.isArray(savedAuctionEnds)
  ) {
    savedAuctionEnds = {};
  }

  let activeAuctionId = null;
  let authMode = "login";
  let selectedPaymentAuctionId = null;

  const now = Date.now();

  /* =========================
     AUCTION DATA
  ========================= */

  const auctions = [
    {
      id: "LOT-001",
      lot: "001",
      title: "The Art of a Timeless Era",
      category: "Art",
      price: 72000,
      startingPrice: 65000,
      premium: true,
      dateAdded: 1,
      end: now + 2 * 86400000 + 5 * 3600000,
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1000&q=85",
      description: "A remarkable artwork selected for our signature collection. Discover expressive composition, thoughtful craftsmanship and a piece designed to inspire collectors."
    },
    {
      id: "LOT-002",
      lot: "002",
      title: "Antique Collector's Treasure",
      category: "Antiques",
      price: 38500,
      startingPrice: 30000,
      premium: false,
      dateAdded: 2,
      end: now + 4 * 3600000,
      image: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=85",
      description: "A distinctive collectible with timeless character. A wonderful addition for enthusiasts who appreciate the stories behind exceptional objects."
    },
    {
      id: "LOT-003",
      lot: "003",
      title: "Golden Heritage Necklace",
      category: "Jewelry",
      price: 125000,
      startingPrice: 110000,
      premium: true,
      dateAdded: 3,
      end: now + 86400000 + 3 * 3600000,
      image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1000&q=85",
      description: "An elegant jewellery piece celebrating fine design and timeless style. Review the listing details before placing a simulated bid."
    },
    {
      id: "LOT-004",
      lot: "004",
      title: "Classic Collector Automobile",
      category: "Luxury",
      price: 450000,
      startingPrice: 425000,
      premium: true,
      dateAdded: 4,
      end: now + 5 * 86400000,
      image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=85",
      description: "A striking automotive collectible for enthusiasts who appreciate design, heritage and distinctive engineering."
    },
    {
      id: "LOT-005",
      lot: "005",
      title: "Modern Gallery Masterpiece",
      category: "Art",
      price: 185000,
      startingPrice: 160000,
      premium: false,
      dateAdded: 5,
      end: now + 7 * 3600000,
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1000&q=85",
      description: "A gallery-inspired piece for contemporary art lovers. Explore its visual character and make your next collection discovery."
    },
    {
      id: "LOT-006",
      lot: "006",
      title: "Vintage Decorative Collectible",
      category: "Antiques",
      price: 24000,
      startingPrice: 18000,
      premium: false,
      dateAdded: 6,
      end: now + 3 * 86400000,
      image: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=85",
      description: "A decorative vintage find selected for its distinctive appearance and collector appeal."
    },
    {
      id: "LOT-007",
      lot: "007",
      title: "Fine Jewellery Collection",
      category: "Jewelry",
      price: 215000,
      startingPrice: 195000,
      premium: true,
      dateAdded: 7,
      end: now + 6 * 86400000,
      image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1000&q=85",
      description: "A refined jewellery selection for collectors who value distinctive design and timeless elegance."
    },
    {
      id: "LOT-008",
      lot: "008",
      title: "Luxury Design Icon",
      category: "Luxury",
      price: 98000,
      startingPrice: 90000,
      premium: false,
      dateAdded: 8,
      end: now + 10 * 3600000,
      image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=85",
      description: "A design-led luxury collectible that brings distinctive character to a carefully considered collection."
    }
  ];

  // Restore auction end times after refreshing the page.
  auctions.forEach(item => {
    if (Number.isFinite(Number(savedAuctionEnds[item.id]))) {
      item.end = Number(savedAuctionEnds[item.id]);
    } else {
      savedAuctionEnds[item.id] = item.end;
    }
  });

  save(KEYS.auctionEnds, savedAuctionEnds);

  /* =========================
     UTILITIES
  ========================= */

  function money(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(Number(amount) || 0);
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  }

  function toast(message, type = "success") {
    const container = $("#toastContainer");

    if (!container) {
      console.log(message);
      return;
    }

    const item = document.createElement("div");
    item.className = `auction-toast toast-${type}`;
    item.textContent =
      `${type === "error" ? "!" : "✓"} ${message}`;
    item.setAttribute("role", "status");

    container.appendChild(item);

    requestAnimationFrame(() => item.classList.add("show"));

    setTimeout(() => {
      item.classList.remove("show");
      setTimeout(() => item.remove(), 250);
    }, 3000);
  }

  /* =========================
     MODALS
  ========================= */

  function openModal(id) {
    const modal = typeof id === "string" ? $("#" + id) : id;

    if (!modal) {
      console.error("Modal not found:", id);
      toast(`Unable to find modal: ${id}`, "error");
      return;
    }

    $$(".modal").forEach(element => {
      if (element !== modal) {
        element.classList.remove("active", "open");
        element.hidden = true;
        element.setAttribute("aria-hidden", "true");
      }
    });

    modal.hidden = false;
    modal.removeAttribute("hidden");
    modal.setAttribute("aria-hidden", "false");
    modal.classList.add("active", "open");

    document.body.classList.add("modal-open");
  }

  function closeModal(id) {
    const modal = typeof id === "string" ? $("#" + id) : id;
    if (!modal) return;

    modal.classList.remove("active", "open");
    modal.setAttribute("aria-hidden", "true");
    modal.hidden = true;

    if ($$(".modal.active, .modal.open").length === 0) {
      document.body.classList.remove("modal-open");
    }
  }

  $$(".modal").forEach(modal => {
    modal.classList.remove("active", "open");
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");

    modal.addEventListener("click", event => {
      if (event.target === modal) closeModal(modal);
    });
  });

  $$("[data-close]").forEach(element => {
    element.addEventListener("click", () => {
      closeModal(element.dataset.close);
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      $$(".modal.active, .modal.open").forEach(closeModal);
    }
  });

  /* =========================
     THEME
  ========================= */

  const themeToggle = $("#themeToggle");
  const initialTheme = load(KEYS.theme, "dark");

  document.body.classList.toggle(
    "light-theme",
    initialTheme === "light"
  );

  if (themeToggle) {
    themeToggle.textContent =
      document.body.classList.contains("light-theme") ? "☾" : "☼";

    themeToggle.addEventListener("click", () => {
      const light = document.body.classList.toggle("light-theme");

      save(KEYS.theme, light ? "light" : "dark");
      themeToggle.textContent = light ? "☾" : "☼";

      toast(`${light ? "Light" : "Dark"} theme enabled.`);
    });
  }

  /* =========================
     MOBILE MENU
  ========================= */

  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    $$(".nav-link", mainNav).forEach(link => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
      });
    });
  }

  /* =========================
     AUCTION HELPERS
  ========================= */

  function allAuctions() {
    return [
      ...auctions,
      ...listings.map(item => ({
        ...item,
        end: item.end || Date.now() + 30 * 86400000,
        premium: false,
        dateAdded: item.dateAdded || 0,
        startingPrice: item.startingPrice || item.price
      }))
    ];
  }

  function getAuction(id) {
    return allAuctions().find(item => item.id === id);
  }

  function currentPrice(item) {
    const itemBids = bids.filter(
      bid => bid.auctionId === item.id
    );

    return itemBids.reduce(
      (highest, bid) =>
        Math.max(highest, Number(bid.amount) || 0),
      Number(item.price) || 0
    );
  }

  function isWatched(id) {
    return watchlist.includes(id);
  }

  /* =========================
     WINNER SYSTEM
  ========================= */

  function getMyWins() {
    if (!user?.email) return [];

    return auctionOutcomes
      .filter(outcome => outcome.winnerEmail === user.email)
      .sort((a, b) =>
        new Date(b.endedAt) - new Date(a.endedAt)
      );
  }

  function settleEndedAuctions() {
    let changed = false;

    allAuctions().forEach(item => {
      const alreadySettled = auctionOutcomes.some(
        outcome => outcome.auctionId === item.id
      );

      if (alreadySettled || item.end > Date.now()) return;

      const itemBids = bids
        .filter(bid => bid.auctionId === item.id)
        .sort((a, b) => Number(b.amount) - Number(a.amount));

      const highestBid = itemBids[0] || null;

      auctionOutcomes.push({
        auctionId: item.id,
        title: item.title,
        winningBid: highestBid ? Number(highestBid.amount) : 0,
        winnerEmail: highestBid
          ? highestBid.bidderEmail || null
          : null,
        winnerName: highestBid
          ? highestBid.bidder || "Bidder"
          : null,
        endedAt: new Date(item.end).toISOString()
      });

      changed = true;
    });

    if (changed) {
      save(KEYS.wins, auctionOutcomes);
    }

    return changed;
  }

  /* =========================
     DEMO PAYMENT SYSTEM
     No real money is charged.
  ========================= */

  function getMyPayment(auctionId) {
    if (!user?.email) return null;

    return payments.find(payment =>
      payment.auctionId === auctionId &&
      payment.userEmail === user.email &&
      payment.status === "Paid"
    ) || null;
  }

  function ensurePaymentModal() {
    if ($("#demoPaymentModal")) return;

    const modal = document.createElement("div");
    modal.id = "demoPaymentModal";
    modal.className = "modal";
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");

    modal.innerHTML = `
      <div class="modal-content payment-modal-content"
           role="dialog"
           aria-modal="true"
           aria-labelledby="demoPaymentTitle">

        <button type="button"
                class="payment-close"
                id="closeDemoPayment"
                aria-label="Close payment">×</button>

        <div class="eyebrow">AUCTION HOUSE · DEMO CHECKOUT</div>
        <h2 id="demoPaymentTitle">Complete Your Payment</h2>

        <p class="payment-demo-notice">
          Demo mode only. No real money will be charged.
        </p>

        <div class="payment-summary">
          <span>Winning item</span>
          <strong id="paymentItemTitle">Auction item</strong>
          <span>Amount payable</span>
          <strong id="paymentItemAmount">₹0</strong>
        </div>

        <form id="demoPaymentForm">
          <label for="demoPaymentMethod">Payment method</label>

          <select id="demoPaymentMethod" required>
            <option value="UPI">UPI</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Net Banking">Net Banking</option>
          </select>

          <p class="payment-method-note">
            No real card number, PIN, CVV or banking credentials are needed.
          </p>

          <button type="submit" class="btn btn-gold payment-confirm">
            Confirm Demo Payment
          </button>

          <button type="button"
                  class="btn btn-outline payment-cancel"
                  id="cancelDemoPayment">
            Cancel
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    $("#closeDemoPayment").addEventListener("click", () => {
      closeModal("demoPaymentModal");
    });

    $("#cancelDemoPayment").addEventListener("click", () => {
      closeModal("demoPaymentModal");
    });

    modal.addEventListener("click", event => {
      if (event.target === modal) closeModal("demoPaymentModal");
    });

    $("#demoPaymentForm").addEventListener("submit", event => {
      event.preventDefault();

      const auctionId = selectedPaymentAuctionId;
      const win = auctionOutcomes.find(outcome =>
        outcome.auctionId === auctionId &&
        outcome.winnerEmail === user?.email
      );

      if (!user?.email) {
        toast("Please sign in before making a payment.", "error");
        closeModal("demoPaymentModal");
        return;
      }

      if (!win) {
        toast("This item is not recorded as your win.", "error");
        closeModal("demoPaymentModal");
        return;
      }

      if (getMyPayment(auctionId)) {
        toast("This item has already been paid for.", "error");
        closeModal("demoPaymentModal");
        updateDashboard("myWins");
        return;
      }

      const method = $("#demoPaymentMethod").value;

      payments.push({
        transactionId:
          "DEMO-" + Date.now().toString(36).toUpperCase(),
        auctionId,
        title: win.title,
        amount: Number(win.winningBid) || 0,
        method,
        status: "Paid",
        userEmail: user.email,
        paidAt: new Date().toISOString()
      });

      save(KEYS.payments, payments);

      closeModal("demoPaymentModal");
      selectedPaymentAuctionId = null;

      updateDashboard("myWins");
      toast("Demo payment successful! No real money was charged.");
    });
  }

  function openDemoPayment(auctionId) {
    if (!user?.email) {
      toast("Please sign in first.", "error");
      setAuthMode("login");
      openModal("authModal");
      return;
    }

    const win = auctionOutcomes.find(outcome =>
      outcome.auctionId === auctionId &&
      outcome.winnerEmail === user.email
    );

    if (!win) {
      toast("Only your won items can be paid for.", "error");
      return;
    }

    if (getMyPayment(auctionId)) {
      toast("This item is already marked as paid.", "error");
      updateDashboard("myWins");
      return;
    }

    ensurePaymentModal();

    selectedPaymentAuctionId = auctionId;
    $("#paymentItemTitle").textContent = win.title;
    $("#paymentItemAmount").textContent = money(win.winningBid);
    $("#demoPaymentMethod").value = "UPI";

    openModal("demoPaymentModal");
  }

  /* =========================
     FEATURED AUCTION
  ========================= */

  const featured = auctions[0];

  function updateFeatured() {
    const item = getAuction("LOT-001");
    if (!item) return;

    if ($("#featuredLot")) {
      $("#featuredLot").textContent = item.lot;
    }

    if ($("#featuredTitle")) {
      $("#featuredTitle").textContent = item.title;
    }

    if ($("#featuredDescription")) {
      $("#featuredDescription").textContent = item.description;
    }

    if ($("#featuredPrice")) {
      $("#featuredPrice").textContent = money(currentPrice(item));
    }

    if ($("#featuredImage")) {
      $("#featuredImage").src = item.image;
      $("#featuredImage").alt = item.title;
    }
  }

  $("#featuredBidButton")?.addEventListener("click", () => {
    openBidModal(featured.id);
  });

  $("#featuredDetailsButton")?.addEventListener("click", () => {
    openDetailsModal(featured.id);
  });

  /* =========================
     SEARCH, FILTERS & SORT
  ========================= */

  const grid = $("#auctionGrid");
  const searchInput = $("#auctionSearch");
  const categoryFilter = $("#categoryFilter");
  const priceFilter = $("#priceFilter");
  const sortFilter = $("#sortFilter");
  const premiumFilter = $("#premiumFilter");

  function filteredAuctions() {
    let items = allAuctions();

    const query = (searchInput?.value || "").trim().toLowerCase();
    const category = categoryFilter?.value || "all";
    const price = priceFilter?.value || "all";
    const premiumOnly = premiumFilter?.checked || false;

    items = items.filter(item => {
      const text =
        `${item.title} ${item.category} ${item.description}`.toLowerCase();

      if (query && !text.includes(query)) return false;
      if (category !== "all" && item.category !== category) return false;
      if (premiumOnly && !item.premium) return false;

      const amount = currentPrice(item);

      if (price === "under50000" && amount >= 50000) return false;

      if (
        price === "50000to200000" &&
        (amount < 50000 || amount > 200000)
      ) return false;

      if (price === "above200000" && amount <= 200000) return false;

      return true;
    });

    const sort = sortFilter?.value || "ending";

    items.sort((a, b) => {
      if (sort === "priceLow") return currentPrice(a) - currentPrice(b);
      if (sort === "priceHigh") return currentPrice(b) - currentPrice(a);
      if (sort === "newest") return (b.dateAdded || 0) - (a.dateAdded || 0);
      return a.end - b.end;
    });

    return items;
  }

  function renderAuctions() {
    if (!grid) return;

    const items = filteredAuctions();

    grid.innerHTML = items.map(item => {
      const watched = isWatched(item.id);
      const price = currentPrice(item);

      return `
        <article class="auction-card ${item.premium ? "premium" : ""}"
                 data-auction-id="${escapeHTML(item.id)}">
          <div class="auction-card-image">
            <img src="${escapeHTML(item.image)}"
                 alt="${escapeHTML(item.title)}"
                 loading="lazy">

            <span class="auction-category">
              ${escapeHTML(item.category)}
            </span>

            ${item.premium
              ? '<span class="featured-badge">PREMIUM</span>'
              : ""}

            <button type="button"
                    class="watch-button ${watched ? "active" : ""}"
                    data-watch-id="${escapeHTML(item.id)}"
                    aria-label="${watched ? "Remove from watchlist" : "Add to watchlist"}"
                    aria-pressed="${watched}">
              ${watched ? "♥" : "♡"}
            </button>
          </div>

          <div class="auction-card-body">
            <div class="eyebrow">LOT NO. ${escapeHTML(item.lot || item.id)}</div>
            <h3 class="auction-card-title">${escapeHTML(item.title)}</h3>
            <p class="auction-description">${escapeHTML(item.description)}</p>

            <div class="auction-card-price">
              <span>Current bid</span>
              <strong>${money(price)}</strong>
            </div>

            <div class="countdown"
                 data-countdown-id="${escapeHTML(item.id)}">
              Calculating time…
            </div>

            <div class="auction-card-footer">
              <button type="button"
                      class="btn btn-outline"
                      data-details-id="${escapeHTML(item.id)}">
                Details
              </button>

              <button type="button"
                      class="btn btn-gold"
                      data-bid-id="${escapeHTML(item.id)}"
                      ${item.end <= Date.now() ? "disabled" : ""}>
                ${item.end <= Date.now() ? "Auction Ended" : "Place Bid ↗"}
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");

    if ($("#resultsCount")) {
      $("#resultsCount").textContent =
        `Showing ${items.length} of ${allAuctions().length} auction lots`;
    }

    if ($("#emptyAuctions")) {
      $("#emptyAuctions").hidden = items.length !== 0;
    }

    updateCountdowns();
    updateFeatured();
    updateDashboard();
  }

  [
    searchInput,
    categoryFilter,
    priceFilter,
    sortFilter,
    premiumFilter
  ].filter(Boolean).forEach(element => {
    element.addEventListener(
      element === searchInput ? "input" : "change",
      renderAuctions
    );
  });

  $("#clearFilters")?.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    if (categoryFilter) categoryFilter.value = "all";
    if (priceFilter) priceFilter.value = "all";
    if (sortFilter) sortFilter.value = "ending";
    if (premiumFilter) premiumFilter.checked = false;

    renderAuctions();
    toast("All filters cleared.");
  });

  $$(".category-card").forEach(card => {
    card.addEventListener("click", () => {
      if (categoryFilter) {
        categoryFilter.value = card.dataset.category || "all";
      }

      renderAuctions();

      $("#auctions")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });

  /* =========================
     AUCTION CARD BUTTONS
  ========================= */

  grid?.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const watchButton = target.closest("[data-watch-id]");
    const bidButton = target.closest("[data-bid-id]");
    const detailsButton = target.closest("[data-details-id]");

    if (watchButton) toggleWatchlist(watchButton.dataset.watchId);
    if (bidButton) openBidModal(bidButton.dataset.bidId);
    if (detailsButton) openDetailsModal(detailsButton.dataset.detailsId);
  });

  /* =========================
     WATCHLIST
  ========================= */

  function toggleWatchlist(id) {
    if (!id) return;

    if (isWatched(id)) {
      watchlist = watchlist.filter(item => item !== id);
      toast("Removed from your watchlist.");
    } else {
      watchlist.push(id);
      toast("Added to your watchlist.");
    }

    save(KEYS.watchlist, watchlist);
    renderAuctions();
    updateDashboard();
  }

  $("#watchlistButton")?.addEventListener("click", () => {
    $("#dashboard")?.scrollIntoView({ behavior: "smooth" });
    setDashboardTab("myWatchlist");
  });

  $("#footerWatchlist")?.addEventListener("click", event => {
    event.preventDefault();
    $("#dashboard")?.scrollIntoView({ behavior: "smooth" });
    setDashboardTab("myWatchlist");
  });

  /* =========================
     COUNTDOWN TIMER
  ========================= */

  function formatRemaining(end) {
    const remaining = end - Date.now();

    if (remaining <= 0) return "Auction ended";

    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining % 86400000) / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    return `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
  }

  function updateCountdowns() {
    const newlySettled = settleEndedAuctions();

    allAuctions().forEach(item => {
      const element = $(
        `[data-countdown-id="${item.id}"]`
      );

      if (element) {
        element.textContent = formatRemaining(item.end);
      }
    });

    const countdown = $("#featuredCountdown");
    const item = getAuction("LOT-001");

    if (countdown && item) {
      const remaining = Math.max(0, item.end - Date.now());

      const values = [
        Math.floor(remaining / 86400000),
        Math.floor((remaining % 86400000) / 3600000),
        Math.floor((remaining % 3600000) / 60000),
        Math.floor((remaining % 60000) / 1000)
      ];

      $$("div strong", countdown).forEach((element, index) => {
        element.textContent =
          String(values[index] || 0).padStart(2, "0");
      });
    }

    if (newlySettled) {
      updateDashboard();
      renderCalendar();
    }
  }

  window.setInterval(updateCountdowns, 1000);

  /* =========================
     AUCTION DETAILS MODAL
  ========================= */

  function openDetailsModal(id) {
    const item = getAuction(id);
    if (!item || !$("#auctionDetailContent")) return;

    activeAuctionId = id;

    $("#auctionDetailContent").innerHTML = `
      <div class="auction-detail-layout">
        <div>
          <img src="${escapeHTML(item.image)}"
               alt="${escapeHTML(item.title)}"
               style="width:100%;height:100%;max-height:480px;object-fit:cover;border-radius:12px">
        </div>

        <div class="auction-detail-info">
          <div class="eyebrow">LOT NO. ${escapeHTML(item.lot || item.id)}</div>
          <h2 id="detailTitle">${escapeHTML(item.title)}</h2>
          <p>${escapeHTML(item.description)}</p>
          <p><strong>Category:</strong> ${escapeHTML(item.category)}</p>
          <p><strong>Current bid:</strong> ${money(currentPrice(item))}</p>

          <p>
            <strong>Time remaining:</strong>
            <span data-countdown-id="${escapeHTML(item.id)}">
              ${formatRemaining(item.end)}
            </span>
          </p>

          <button type="button"
                  class="btn btn-gold"
                  data-modal-bid="${escapeHTML(item.id)}"
                  ${item.end <= Date.now() ? "disabled" : ""}>
            Place a Bid ↗
          </button>

          <button type="button"
                  class="btn btn-outline"
                  data-modal-watch="${escapeHTML(item.id)}">
            ${isWatched(id) ? "♥ Remove from Watchlist" : "♡ Add to Watchlist"}
          </button>
        </div>
      </div>
    `;

    openModal("auctionModal");
    updateCountdowns();
  }

  $("#auctionDetailContent")?.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const bidButton = target.closest("[data-modal-bid]");
    const watchButton = target.closest("[data-modal-watch]");

    if (bidButton) {
      const id = bidButton.dataset.modalBid;
      closeModal("auctionModal");
      openBidModal(id);
    }

    if (watchButton) {
      const id = watchButton.dataset.modalWatch;
      toggleWatchlist(id);
      openDetailsModal(id);
    }
  });

  /* =========================
     BIDDING
  ========================= */

  function openBidModal(id) {
    const item = getAuction(id);
    if (!item) return;

    if (item.end <= Date.now()) {
      settleEndedAuctions();
      updateDashboard();
      toast("This auction has ended.", "error");
      return;
    }

    activeAuctionId = id;

    if ($("#bidAuctionId")) $("#bidAuctionId").value = id;
    if ($("#bidItemName")) $("#bidItemName").textContent = item.title;

    if ($("#bidCurrentPrice")) {
      $("#bidCurrentPrice").textContent = money(currentPrice(item));
    }

    const minimum = currentPrice(item) + 1000;

    if ($("#bidAmount")) {
      $("#bidAmount").min = String(minimum);
      $("#bidAmount").value = String(minimum);
    }

    if ($("#bidHint")) {
      $("#bidHint").textContent =
        `Minimum next bid: ${money(minimum)} (increment ₹1,000).`;
    }

    openModal("bidModal");
  }

  $("#bidForm")?.addEventListener("submit", event => {
    event.preventDefault();

    const id = $("#bidAuctionId")?.value || activeAuctionId;
    const item = getAuction(id);
    const amount = Number($("#bidAmount")?.value);

    if (!item) {
      toast("Auction not found.", "error");
      return;
    }

    if (item.end <= Date.now()) {
      settleEndedAuctions();
      updateDashboard();
      toast("This auction has ended.", "error");
      closeModal("bidModal");
      return;
    }

    const minimum = currentPrice(item) + 1000;

    if (!Number.isFinite(amount) || amount < minimum) {
      toast(`Your bid must be at least ${money(minimum)}.`, "error");

      if ($("#bidAmount")) {
        $("#bidAmount").min = String(minimum);
      }

      if ($("#bidHint")) {
        $("#bidHint").textContent =
          `Minimum next bid: ${money(minimum)}.`;
      }

      return;
    }

    bids.push({
      id: `BID-${Date.now()}`,
      auctionId: id,
      title: item.title,
      amount,
      date: new Date().toISOString(),
      bidder: user?.name || "Guest",
      bidderEmail: user?.email || "guest@auction-demo.local"
    });

    save(KEYS.bids, bids);

    closeModal("bidModal");
    updateFeatured();
    renderAuctions();
    updateDashboard();

    toast("Demo bid placed successfully.");
  });

  /* =========================
     AUTHENTICATION
  ========================= */

  function setAuthMode(mode) {
    authMode = mode === "register" ? "register" : "login";

    $$(".auth-tab").forEach(tab => {
      const active = tab.dataset.auth === authMode;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });

    const nameGroup = $("#authNameGroup");
    const roleGroup = $("#authRoleGroup");
    const nameInput = $("#authName");
    const title = $("#authTitle");
    const description = $("#authDescription");
    const submit = $("#authSubmit");

    if (nameGroup) nameGroup.hidden = authMode !== "register";
    if (roleGroup) roleGroup.hidden = authMode !== "register";
    if (nameInput) nameInput.required = authMode === "register";

    if (title) {
      title.textContent = authMode === "login"
        ? "Welcome back."
        : "Join the collection.";
    }

    if (description) {
      description.textContent = authMode === "login"
        ? "Sign in to follow lots and participate in auctions."
        : "Create your demo account to save lots and track your bids.";
    }

    if (submit) {
      submit.textContent = authMode === "login"
        ? "Sign In ↗"
        : "Create Account ↗";
    }
  }

  $("#loginButton")?.addEventListener("click", event => {
    event.preventDefault();
    setAuthMode("login");
    openModal("authModal");
  });

  $("#registerButton")?.addEventListener("click", event => {
    event.preventDefault();
    setAuthMode("register");
    openModal("authModal");
  });

  $("#footerRegisterButton")?.addEventListener("click", event => {
    event.preventDefault();
    setAuthMode("register");
    openModal("authModal");
  });

  $$(".auth-tab").forEach(tab => {
    tab.addEventListener("click", event => {
      event.preventDefault();
      setAuthMode(tab.dataset.auth);
    });
  });

  $("#authForm")?.addEventListener("submit", event => {
    event.preventDefault();

    const emailInput = $("#authEmail");
    const passwordInput = $("#authPassword");

    if (!emailInput || !passwordInput) {
      toast("Login form fields are missing in index.html.", "error");
      return;
    }

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (
      !emailInput.checkValidity() ||
      !email ||
      password.length < 6
    ) {
      toast(
        "Enter a valid email and a password of at least 6 characters.",
        "error"
      );

      if (!emailInput.checkValidity()) {
        emailInput.reportValidity();
      } else {
        passwordInput.reportValidity();
      }

      return;
    }

    if (authMode === "register") {
      const nameInput = $("#authName");
      const roleInput = $("#authRole");
      const name = nameInput?.value.trim();

      if (!name) {
        toast("Please enter your full name.", "error");
        nameInput?.focus();
        return;
      }

      user = {
        name,
        email,
        role: roleInput?.value || "bidder"
      };
    } else {
      user = {
        name: email.split("@")[0],
        email,
        role: "bidder"
      };
    }

    save(KEYS.user, user);

    $("#authForm")?.reset();
    setAuthMode("login");
    closeModal("authModal");
    updateDashboard();

    toast(`Welcome, ${user.name}!`);
  });

  /* =========================
     GUEST ACCOUNT
  ========================= */

  function continueAsGuest() {
    user = {
      name: "Guest",
      email: "guest@auction-demo.local",
      role: "guest"
    };

    save(KEYS.user, user);
    closeModal("authModal");
    updateDashboard();

    toast("You are continuing as a guest.");
  }

  $("#guestButton")?.addEventListener("click", event => {
    event.preventDefault();
    continueAsGuest();
  });

  $("#continueAsGuest")?.addEventListener("click", event => {
    event.preventDefault();
    continueAsGuest();
  });

  /* =========================
     SELLER LISTINGS
  ========================= */

  function openSellerModal() {
    if (!user) {
      setAuthMode("register");
      openModal("authModal");
      toast("Create a demo account before listing an item.");
      return;
    }

    if (user.role === "guest") {
      setAuthMode("register");
      openModal("authModal");
      toast("Create an account to list an item.", "error");
      return;
    }

    openModal("sellerModal");
  }

  $("#sellItemButton")?.addEventListener("click", event => {
    event.preventDefault();
    openSellerModal();
  });

  $("#footerSellButton")?.addEventListener("click", event => {
    event.preventDefault();
    openSellerModal();
  });

  $("#sellerForm")?.addEventListener("submit", event => {
    event.preventDefault();

    if (!user || user.role === "guest") {
      closeModal("sellerModal");
      setAuthMode("register");
      openModal("authModal");
      return;
    }

    const title = $("#sellerItemTitle")?.value.trim() || "";
    const category = $("#sellerCategory")?.value || "Art";
    const description = $("#sellerDescription")?.value.trim() || "";
    const price = Number($("#sellerPrice")?.value);

    if (
      !title ||
      !description ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      toast("Please complete all listing fields correctly.", "error");
      return;
    }

    listings.push({
      id: `SELL-${Date.now()}`,
      lot: `S${String(listings.length + 1).padStart(3, "0")}`,
      title,
      category,
      description,
      price,
      startingPrice: price,
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1000&q=85",
      seller: user.email,
      premium: false,
      end: Date.now() + 30 * 86400000,
      dateAdded: Date.now()
    });

    save(KEYS.listings, listings);

    $("#sellerForm")?.reset();
    closeModal("sellerModal");

    renderAuctions();
    renderCalendar();
    updateDashboard();

    toast("Demo listing added successfully.");
  });

  /* =========================
     DASHBOARD TABS
  ========================= */

  function setDashboardTab(tabName) {
    $$(".dashboard-tab").forEach(tab => {
      const active = tab.dataset.tab === tabName;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });

    updateDashboard(tabName);
  }

  $$(".dashboard-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      setDashboardTab(tab.dataset.tab);
    });
  });

  /* =========================
     DASHBOARD RENDER
  ========================= */

  function updateDashboard(tabName) {
    const content = $("#dashboardContent");
    if (!content) return;

    const activeTab =
      tabName ||
      $(".dashboard-tab.active")?.dataset.tab ||
      "myBids";

    if ($("#dashboardUser")) {
      $("#dashboardUser").textContent =
        user ? `${user.name} · ${user.role}` : "Guest Account";
    }

    if ($("#activeBidsCount")) {
      $("#activeBidsCount").textContent = bids.filter(
        bid => getAuction(bid.auctionId)?.end > Date.now()
      ).length;
    }

    if ($("#watchlistCount")) {
      $("#watchlistCount").textContent = watchlist.length;
    }

    if ($("#wonCount")) {
      $("#wonCount").textContent = getMyWins().length;
    }

    if ($("#listingCount")) {
      $("#listingCount").textContent = listings.filter(
        item => user && item.seller === user.email
      ).length;
    }

    let rows = [];
    let emptyMessage = "";
    let heading = "";

    if (activeTab === "myBids") {
      heading = "My Bid History";

      rows = bids
        .filter(bid => user && bid.bidderEmail === user.email)
        .slice()
        .reverse()
        .map(bid => ({
          title: bid.title || getAuction(bid.auctionId)?.title || "Auction item",
          detail: bid.date
            ? new Date(bid.date).toLocaleString("en-IN")
            : "Date unavailable",
          amount: money(bid.amount),
          action: "View",
          auctionId: bid.auctionId || ""
        }));

      emptyMessage = "You haven't placed any demo bids yet.";

    } else if (activeTab === "myWatchlist") {
      heading = "Saved Lots";

      rows = watchlist.map(id => {
        const item = getAuction(id);

        return item ? {
          title: item.title,
          detail: item.category,
          amount: money(currentPrice(item)),
          action: "Saved",
          auctionId: item.id
        } : null;
      }).filter(Boolean);

      emptyMessage =
        "Your watchlist is empty. Save an auction to see it here.";

    } else if (activeTab === "myWins") {
      heading = "Won Items";

      rows = getMyWins().map(win => {
        const paid = Boolean(getMyPayment(win.auctionId));

        return {
          title: win.title,
          detail: paid
            ? "Payment completed"
            : `Auction ended · ${new Date(win.endedAt).toLocaleString("en-IN")}`,
          amount: money(win.winningBid),
          action: paid ? "Paid" : "Pay Now",
          auctionId: win.auctionId,
          paid
        };
      });

      emptyMessage = user
        ? "No items won yet. Your winning items will appear here after their auctions end."
        : "Sign in using the same account you used to place your bids.";

    } else if (activeTab === "myPayments") {
      heading = "Payment History";

      rows = payments
        .filter(payment => user && payment.userEmail === user.email)
        .slice()
        .reverse()
        .map(payment => ({
          title: payment.title,
          detail:
            `${payment.method} · ${new Date(payment.paidAt).toLocaleString("en-IN")} · ${payment.transactionId}`,
          amount: money(payment.amount),
          action: payment.status,
          auctionId: payment.auctionId
        }));

      emptyMessage =
        "No payments recorded yet. Your completed demo payments will appear here.";

    } else if (activeTab === "myListings") {
      heading = "My Listings";

      rows = listings
        .filter(item => user && item.seller === user.email)
        .map(item => ({
          title: item.title,
          detail: item.category,
          amount: money(item.price),
          action: "View",
          auctionId: item.id
        }));

      emptyMessage = "You haven't listed any items yet.";

    } else {
      heading = "My Bid History";
      emptyMessage = "No records available.";
    }

    content.innerHTML = `
      <div class="dashboard-panel">
        <div class="dashboard-panel-heading">
          <h3>${escapeHTML(heading)}</h3>
          <span>
            ${rows.length} item${rows.length === 1 ? "" : "s"}
          </span>
        </div>

        ${
          rows.length
            ? `<div class="dashboard-list">
                ${rows.map(row => `
                  <div class="dashboard-list-item">
                    <div class="dashboard-list-info">
                      <strong>${escapeHTML(row.title)}</strong>
                      <small>${escapeHTML(row.detail)}</small>
                    </div>

                    <strong class="bid-history-amount">
                      ${escapeHTML(row.amount)}
                    </strong>

                    ${
                      activeTab === "myWins"
                        ? row.paid
                          ? `<span class="payment-status-paid">✓ Paid</span>`
                          : `<button type="button"
                                     class="btn btn-gold"
                                     data-pay-now="${escapeHTML(row.auctionId)}">
                               Pay Now
                             </button>`
                        : activeTab === "myBids" ||
                          activeTab === "myWatchlist" ||
                          activeTab === "myListings"
                          ? `<button type="button"
                                     class="bid-view-button"
                                     data-view-bid="${escapeHTML(row.auctionId)}"
                                     ${row.auctionId ? "" : "disabled"}>
                               View
                             </button>`
                          : `<span>${escapeHTML(row.action)}</span>`
                    }
                  </div>
                `).join("")}
              </div>`
            : `<div class="empty-state">
                <span>◇</span>
                <p>${escapeHTML(emptyMessage)}</p>
              </div>`
        }
      </div>
    `;
  }

  /* =========================
     DASHBOARD ACTION BUTTONS
  ========================= */

  $("#dashboardContent")?.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const payButton = target.closest("[data-pay-now]");

    if (payButton) {
      openDemoPayment(payButton.dataset.payNow);
      return;
    }

    const viewButton = target.closest("[data-view-bid]");
    if (!viewButton) return;

    const auctionId = viewButton.dataset.viewBid;

    if (!auctionId) {
      toast("Auction details are unavailable for this saved record.", "error");
      return;
    }

    if (!getAuction(auctionId)) {
      toast("This auction item could not be found.", "error");
      return;
    }

    openDetailsModal(auctionId);
  });

  /* =========================
     AUCTION CALENDAR
  ========================= */

  function renderCalendar() {
    const container = $("#calendarEvents");
    if (!container) return;

    const upcoming = allAuctions()
      .filter(item => item.end > Date.now())
      .sort((a, b) => a.end - b.end)
      .slice(0, 4);

    container.innerHTML = upcoming.map(item => {
      const date = new Date(item.end);

      return `
        <article class="calendar-event">
          <div class="calendar-event-date">
            <strong>
              ${date.toLocaleDateString("en-IN", { day: "2-digit" })}
            </strong>
            <span>
              ${date.toLocaleDateString("en-IN", { month: "short" })}
            </span>
          </div>

          <div class="calendar-event-info">
            <span class="eyebrow">
              ${escapeHTML(item.category)} · LOT ${escapeHTML(item.lot || "")}
            </span>

            <h3>${escapeHTML(item.title)}</h3>
            <p>Current bid: ${money(currentPrice(item))}</p>
          </div>

          <button type="button"
                  class="btn btn-outline"
                  data-calendar-details="${escapeHTML(item.id)}">
            View Lot
          </button>
        </article>
      `;
    }).join("");
  }

  $("#calendarEvents")?.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const button = target.closest("[data-calendar-details]");

    if (button) {
      openDetailsModal(button.dataset.calendarDetails);
    }
  });

  /* =========================
     CONTACT FORM
  ========================= */

  $("#contactForm")?.addEventListener("submit", event => {
    event.preventDefault();

    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    toast("Inquiry validated! Connect a backend to send the message.");
    form.reset();
  });

  /* =========================
     NEWSLETTER
  ========================= */

  $("#newsletterForm")?.addEventListener("submit", event => {
    event.preventDefault();

    const form = event.currentTarget;
    const input = $("#newsletterEmail");

    if (!input) return;

    const email = input.value.trim().toLowerCase();

    if (!input.checkValidity() || !email) {
      input.reportValidity();
      return;
    }

    const emails = load(KEYS.newsletter, []);

    if (!Array.isArray(emails)) {
      toast("Unable to read newsletter subscriptions.", "error");
      return;
    }

    if (emails.includes(email)) {
      toast("This email is already subscribed.", "error");
      return;
    }

    emails.push(email);
    save(KEYS.newsletter, emails);

    form.reset();
    toast("Subscribed successfully in this browser demo!");
  });

  /* =========================
     SMOOTH SCROLL & NAV ACTIVE
  ========================= */

  $$('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      let target = null;

      try {
        target = $(href);
      } catch {
        return;
      }

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });

  const sections = $$("main section[id]");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        $$(".nav-link").forEach(link => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    }, {
      rootMargin: "-25% 0px -65% 0px"
    });

    sections.forEach(section => observer.observe(section));
  }

  /* =========================
     BACK TO TOP
  ========================= */

  const backToTop = $("#backToTop");

  function updateBackToTop() {
    if (backToTop) {
      backToTop.classList.toggle(
        "visible",
        window.scrollY > 400
      );
    }
  }

  window.addEventListener("scroll", updateBackToTop, {
    passive: true
  });

  backToTop?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  /* =========================
     INITIALIZATION
  ========================= */

  if ($("#currentYear")) {
    $("#currentYear").textContent = new Date().getFullYear();
  }

  updateFeatured();
  renderAuctions();
  renderCalendar();
  updateDashboard();
  setAuthMode("login");
  updateCountdowns();

  console.log("Auction House initialized successfully.");
});
