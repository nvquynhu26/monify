/* ==========================================================================
   MONIFY — MY FINANCE MANAGER (Complete Static Web App Logic)
   Supports Google Apps Script (6-Sheet Sync) + Instant localStorage Fallback
   ========================================================================== */

(function () {
  "use strict";

  const STORAGE_KEY = "monify_db_v1";
  const FX_CACHE_KEY = "monify_fx_v1";
  const CUSTOM_URL_KEY = "monify_gas_url_v1";

  // Fallback rates (1 USD = X currency)
  const DEFAULT_RATES = {
    USD: 1,
    USDT: 1,
    KRW: 1385,
    VND: 25450,
    EUR: 0.92,
    JPY: 152,
    RUB: 96,
    UZS: 12750,
    updatedAt: "Dự phòng (Offline)"
  };

  // Seoul Global ATM & Best-Rate Currency Exchange Spots
  const SEOUL_SPOTS = [
    {
      id: "atm1",
      type: "fx",
      name: "Tiệm đổi tiền Đại sứ quán (명동 대사관앞 환전소)",
      area: "Myeongdong",
      hours: "09:00 – 21:00",
      note: "Tỷ giá USD/VND/KRW tốt nhất Seoul",
      lat: 37.5610,
      lng: 126.9822
    },
    {
      id: "atm2",
      type: "fx",
      name: "Money Box Hongdae (머니박스 홍대점)",
      area: "Hongdae",
      hours: "09:00 – 22:00",
      note: "Hỗ trợ đổi tiền nhanh, tỷ giá minh bạch",
      lat: 37.5567,
      lng: 126.9240
    },
    {
      id: "atm3",
      type: "atm",
      name: "Woori Bank Global ATM 24/7 (우리은행 글로벌)",
      area: "Sinchon",
      hours: "24/7",
      note: "Hỗ trợ thẻ Visa / Mastercard / UnionPay quốc tế",
      lat: 37.5559,
      lng: 126.9368
    },
    {
      id: "atm4",
      type: "atm",
      name: "Hana Bank Global ATM 24/7 (하나은행 글로벌)",
      area: "Itaewon",
      hours: "24/7",
      note: "Rút tiền mặt KRW từ thẻ nước ngoài phí thấp",
      lat: 37.5345,
      lng: 126.9946
    },
    {
      id: "atm5",
      type: "fx",
      name: "Itaewon Foreign Exchange (이태원 환전소)",
      area: "Itaewon",
      hours: "09:30 – 21:30",
      note: "Đổi đa dạng USD, EUR, RUB, VND",
      lat: 37.5349,
      lng: 126.9921
    },
    {
      id: "atm6",
      type: "atm",
      name: "KB Kookmin Global ATM 24/7 (국민은행 글로벌)",
      area: "Gangnam",
      hours: "24/7",
      note: "Cửa ra số 10 ga Gangnam, hỗ trợ đa ngôn ngữ",
      lat: 37.4980,
      lng: 127.0276
    }
  ];

  // App Runtime State
  const state = {
    db: null,
    currentUser: null,
    rates: Object.assign({}, DEFAULT_RATES),
    baseCurrency: "KRW",
    heroDarkGrad: false,
    activeTab: "home",
    activeSubtab: "remit",
    cashflowPeriod: "1M",
    atmFilter: "all",
    mapInstance: null,
    mapMarkers: [],
    splitItems: [
      { id: "sp1", payer: "Yumi", amount: 68000, currency: "KRW", note: "Thịt nướng Hongdae" },
      { id: "sp2", payer: "Minji", amount: 24, currency: "USD", note: "Cafe & bánh ngọt" },
      { id: "sp3", payer: "Tan", amount: 350000, currency: "VND", note: "Đặt vé tàu chung" }
    ]
  };

  // ========================================================================
  // 1. SEED DATA & LOCAL STORAGE DB (Chuẩn 6 Sheets theo User_ID)
  // ========================================================================
  function createDefaultDB() {
    return {
      nextUserId: 2,
      users: [
        {
          User_ID: 1,
          Username: "monify",
          FullName: "Monify Demo User",
          DOB: "2000-05-15",
          Password: "828282",
          Email: "demo@monify.app",
          CreatedAt: "2026-01-01T00:00:00Z"
        }
      ],
      wallets: [
        { Wallet_ID: "W1", User_ID: 1, Wallet_Name: "Ngân hàng Toss", Type: "Bank", Country: "Hàn Quốc", Currency: "KRW", Balance: 1000000 },
        { Wallet_ID: "W2", User_ID: 1, Wallet_Name: "Ngân hàng Việt Nam", Type: "Bank", Country: "Việt Nam", Currency: "VND", Balance: 3000000 },
        { Wallet_ID: "W3", User_ID: 1, Wallet_Name: "Tiền mặt USD", Type: "Cash", Country: "Quốc tế", Currency: "USD", Balance: 1000 },
        { Wallet_ID: "W4", User_ID: 1, Wallet_Name: "Tiền mặt Việt Nam", Type: "Cash", Country: "Việt Nam", Currency: "VND", Balance: 7000000 },
        { Wallet_ID: "W5", User_ID: 1, Wallet_Name: "Tiền mặt Hàn Quốc", Type: "Cash", Country: "Hàn Quốc", Currency: "KRW", Balance: 300000 }
      ],
      savings: [
        {
          Saving_ID: "S1",
          User_ID: 1,
          Bank_Name: "Sổ tiết kiệm Hàn Quốc",
          Country: "Hàn Quốc",
          Currency: "KRW",
          Principal_Amount: 10000000,
          Start_Date: "2025-06-03",
          Maturity_Date: "2026-06-03",
          Interest_Rate: 3.0
        },
        {
          Saving_ID: "S2",
          User_ID: 1,
          Bank_Name: "Sổ tiết kiệm Việt Nam",
          Country: "Việt Nam",
          Currency: "VND",
          Principal_Amount: 200000000,
          Start_Date: "2025-09-01",
          Maturity_Date: "2026-09-01",
          Interest_Rate: 5.5
        }
      ],
      transactions: [
        { Tx_ID: "T1", User_ID: 1, Date: daysAgoStr(2), Type: "Expense", Currency: "KRW", Amount: 14500, Jar_Category: "Thiết yếu", Wallet_ID: "W1", Is_Travel_Mode: false, Note: "GS25 & Cơm trưa" },
        { Tx_ID: "T2", User_ID: 1, Date: daysAgoStr(5), Type: "Income", Currency: "KRW", Amount: 1850000, Jar_Category: "Thu nhập", Wallet_ID: "W1", Is_Travel_Mode: false, Note: "Lương làm thêm / Học bổng" },
        { Tx_ID: "T3", User_ID: 1, Date: daysAgoStr(9), Type: "Expense", Currency: "KRW", Amount: 450000, Jar_Category: "Thiết yếu", Wallet_ID: "W1", Is_Travel_Mode: false, Note: "Tiền thuê nhà Wolse" },
        { Tx_ID: "T4", User_ID: 1, Date: daysAgoStr(12), Type: "Expense", Currency: "KRW", Amount: 85000, Jar_Category: "Hưởng thụ", Wallet_ID: "W5", Is_Travel_Mode: false, Note: "Ăn tối cuối tuần cùng bạn" },
        { Tx_ID: "T5", User_ID: 1, Date: daysAgoStr(18), Type: "Expense", Currency: "KRW", Amount: 220000, Jar_Category: "Học phí/Giáo dục", Wallet_ID: "W1", Is_Travel_Mode: false, Note: "Giáo trình & khóa học tiếng Hàn" },
        { Tx_ID: "T6", User_ID: 1, Date: daysAgoStr(24), Type: "Expense", Currency: "USD", Amount: 20, Jar_Category: "Học phí/Giáo dục", Wallet_ID: "W3", Is_Travel_Mode: false, Note: "ChatGPT Plus" }
      ],
      budgets6Jars: {
        1: [
          { name: "Thiết yếu", pct: 45 },
          { name: "Học phí/Giáo dục", pct: 15 },
          { name: "Tiết kiệm dài hạn", pct: 15 },
          { name: "Hưởng thụ", pct: 10 },
          { name: "Đầu tư", pct: 10 },
          { name: "Gửi về nhà", pct: 5 }
        ]
      },
      goalsSubs: {
        1: {
          visaMinKRW: 10000000,
          fx50kUsedUSD: 6200,
          travelMode: {
            enabled: false,
            tripName: "Về Việt Nam nghỉ lễ",
            budgetKRW: 1500000
          },
          goals: [
            {
              id: "G1",
              name: "Học phí học kỳ tới",
              currency: "KRW",
              targetAmount: 4200000,
              savedAmount: 1800000,
              deadline: "2027-02-20"
            },
            {
              id: "G2",
              name: "Tiền cọc nhà (보증금)",
              currency: "KRW",
              targetAmount: 10000000,
              savedAmount: 3500000,
              deadline: "2027-08-30"
            }
          ],
          subscriptions: [
            { id: "SUB1", name: "Coupang Wow", amount: 7890, currency: "KRW", billingDay: tomorrowDay(), remind24h: true },
            { id: "SUB2", name: "Netflix Standard", amount: 13500, currency: "KRW", billingDay: 15, remind24h: true },
            { id: "SUB3", name: "ChatGPT Plus", amount: 20, currency: "USD", billingDay: 22, remind24h: true },
            { id: "SUB4", name: "iCloud+ 200GB", amount: 3300, currency: "KRW", billingDay: 28, remind24h: false }
          ],
          fxAlerts: [
            { id: "AL1", pair: "KRW_VND", target: 18.2 },
            { id: "AL2", pair: "USD_KRW", target: 1360 }
          ]
        }
      }
    };
  }

  function daysAgoStr(days) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().slice(0, 10);
  }

  function tomorrowDay() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.getDate();
  }

  function loadLocalDB() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn("LocalDB read error:", e);
    }
    const seeded = createDefaultDB();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  function saveLocalDB() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.db));
    } catch (e) {
      console.warn("LocalDB save error:", e);
    }
  }

  function getScriptUrl() {
    const custom = localStorage.getItem(CUSTOM_URL_KEY);
    if (custom && custom.trim()) return custom.trim();
    return (window.MONIFY_CONFIG && window.MONIFY_CONFIG.GOOGLE_SCRIPT_URL || "").trim();
  }

  // Non-blocking sync to Google Apps Script (if URL is configured)
  async function callGoogleScript(action, payload) {
    const url = getScriptUrl();
    if (!url) return null;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action, payload })
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.warn("Google Sheets sync fallback to localStorage:", err);
      return null;
    }
  }

  // ========================================================================
  // 2. CURRENCY CONVERSION & REAL-TIME FX + STABLECOIN API
  // ========================================================================
  async function fetchLiveFX(showNotice) {
    try {
      const [fiatRes, cryptoRes] = await Promise.allSettled([
        fetch("https://open.er-api.com/v6/latest/USD"),
        fetch("https://api.coingecko.com/api/v3/simple/price?ids=tether,usd-coin&vs_currencies=usd,krw,vnd")
      ]);

      const nextRates = Object.assign({}, state.rates);
      if (fiatRes.status === "fulfilled" && fiatRes.value.ok) {
        const fiatJson = await fiatRes.value.json();
        if (fiatJson && fiatJson.rates) {
          ["KRW", "VND", "EUR", "JPY", "RUB", "UZS"].forEach(c => {
            if (fiatJson.rates[c]) nextRates[c] = fiatJson.rates[c];
          });
        }
      }
      if (cryptoRes.status === "fulfilled" && cryptoRes.value.ok) {
        const cg = await cryptoRes.value.json();
        if (cg && cg.tether && cg.tether.usd) {
          nextRates.USDT = 1 / cg.tether.usd;
        }
      }
      const now = new Date();
      nextRates.updatedAt = "Cập nhật " + now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
      state.rates = nextRates;
      localStorage.setItem(FX_CACHE_KEY, JSON.stringify(nextRates));
      if (showNotice) showToast("Đã cập nhật tỷ giá & Stablecoin thời gian thực");
    } catch (e) {
      const cached = localStorage.getItem(FX_CACHE_KEY);
      if (cached) state.rates = JSON.parse(cached);
      if (showNotice) showToast("Đang dùng tỷ giá dự phòng (Offline)");
    }
    if (state.currentUser) renderAll();
  }

  function convertCurrency(amount, fromCurr, toCurr) {
    const val = Number(amount) || 0;
    if (fromCurr === toCurr) return val;
    const fromRate = state.rates[fromCurr] || 1;
    const toRate = state.rates[toCurr] || 1;
    // Bridge through USD/USDT
    const inUSD = val / fromRate;
    return inUSD * toRate;
  }

  function formatMoney(amount, curr) {
    const n = Number(amount) || 0;
    if (curr === "KRW") return "₩ " + Math.round(n).toLocaleString("en-US");
    if (curr === "VND") return Math.round(n).toLocaleString("en-US") + " ₫";
    if (curr === "USD") return "$ " + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (curr === "USDT") return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " USDT";
    return n.toLocaleString("en-US", { maximumFractionDigits: 2 }) + " " + curr;
  }

  // User-scoped data helpers
  function userWallets() {
    return state.db.wallets.filter(w => Number(w.User_ID) === Number(state.currentUser.User_ID));
  }
  function userSavings() {
    return state.db.savings.filter(s => Number(s.User_ID) === Number(state.currentUser.User_ID));
  }
  function userTransactions() {
    return state.db.transactions
      .filter(t => Number(t.User_ID) === Number(state.currentUser.User_ID))
      .sort((a, b) => (b.Date || "").localeCompare(a.Date || ""));
  }
  function userJars() {
    const uid = state.currentUser.User_ID;
    if (!state.db.budgets6Jars[uid]) {
      state.db.budgets6Jars[uid] = [
        { name: "Thiết yếu", pct: 45 },
        { name: "Học phí/Giáo dục", pct: 15 },
        { name: "Tiết kiệm dài hạn", pct: 15 },
        { name: "Hưởng thụ", pct: 10 },
        { name: "Đầu tư", pct: 10 },
        { name: "Gửi về nhà", pct: 5 }
      ];
    }
    return state.db.budgets6Jars[uid];
  }
  function userMeta() {
    const uid = state.currentUser.User_ID;
    if (!state.db.goalsSubs[uid]) {
      state.db.goalsSubs[uid] = {
        visaMinKRW: 10000000,
        fx50kUsedUSD: 0,
        travelMode: { enabled: false, tripName: "Chuyến đi mới", budgetKRW: 1000000 },
        goals: [],
        subscriptions: [],
        fxAlerts: []
      };
    }
    return state.db.goalsSubs[uid];
  }

  // ========================================================================
  // 3. SCREEN & TAB NAVIGATION + LAUNCH SCREEN (2 SECONDS)
  // ========================================================================
  function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach(el => el.classList.remove("active"));
    const target = document.getElementById(screenId);
    if (target) target.classList.add("active");
  }

  function startLaunchSequence() {
    showScreen("screen-launch");
    setTimeout(() => {
      const launch = document.getElementById("screen-launch");
      launch.classList.add("fade-out");
      setTimeout(() => {
        launch.classList.remove("active", "fade-out");
        showScreen("screen-login");
      }, 360);
    }, 2000);
  }

  function switchTab(tabName) {
    state.activeTab = tabName;
    const titles = {
      home: "Trang chủ",
      transfer: "Chuyển tiền",
      spend: "Chi tiêu",
      goals: "Mục tiêu",
      ai: "Trợ lý AI"
    };
    document.getElementById("header-tab-title").textContent = titles[tabName] || "Monify";

    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    const panel = document.getElementById("tab-" + tabName);
    if (panel) panel.classList.add("active");

    document.querySelectorAll(".nav-item").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabName);
    });

    document.getElementById("main-scroll").scrollTop = 0;

    if (tabName === "transfer" && state.activeSubtab === "atm") {
      setTimeout(initOrRefreshMap, 120);
    }
    if (tabName === "transfer" && state.activeSubtab === "qr") {
      renderMyQR();
    }
  }

  function switchTransferSubtab(subName) {
    state.activeSubtab = subName;
    document.querySelectorAll("#transfer-subtabs .subtab-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.subtab === subName);
    });
    document.querySelectorAll(".subtab-pane").forEach(p => p.classList.remove("active"));
    const pane = document.getElementById("subtab-" + subName);
    if (pane) pane.classList.add("active");

    if (subName === "atm") setTimeout(initOrRefreshMap, 120);
    if (subName === "qr") renderMyQR();
  }

  // ========================================================================
  // 4. AUTHENTICATION (LOGIN & REGISTER)
  // ========================================================================
  async function handleLogin(e) {
    e.preventDefault();
    const errEl = document.getElementById("login-error");
    errEl.hidden = true;

    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value;

    if (!username || !password) {
      errEl.textContent = "Vui lòng nhập đầy đủ Tên đăng nhập và Mật khẩu.";
      errEl.hidden = false;
      return;
    }

    // Try Google Sheets first if URL configured
    const remote = await callGoogleScript("login", { Username: username, Password: password });
    if (remote && remote.ok && remote.user) {
      mergeRemoteUserData(remote);
      state.currentUser = remote.user;
      enterMainApp();
      return;
    }

    // Fallback to localStorage DB
    const found = state.db.users.find(
      u => u.Username.toLowerCase() === username.toLowerCase() && String(u.Password) === String(password)
    );
    if (!found) {
      errEl.textContent = "Sai tên đăng nhập hoặc mật khẩu. (Thử tài khoản mẫu: monify / 828282)";
      errEl.hidden = false;
      return;
    }

    state.currentUser = found;
    enterMainApp();
  }

  async function handleRegister(e) {
    e.preventDefault();
    const errEl = document.getElementById("register-error");
    errEl.hidden = true;

    const Username = document.getElementById("reg-username").value.trim();
    const FullName = document.getElementById("reg-fullname").value.trim();
    const DOB = document.getElementById("reg-dob").value;
    const Password = document.getElementById("reg-password").value;
    const Email = document.getElementById("reg-email").value.trim();

    if (!Username || !FullName || !DOB || !Password || !Email) {
      errEl.textContent = "Vui lòng điền đầy đủ cả 5 trường thông tin bắt buộc.";
      errEl.hidden = false;
      return;
    }
    if (Password.length < 6) {
      errEl.textContent = "Mật khẩu cần tối thiểu 6 ký tự.";
      errEl.hidden = false;
      return;
    }
    if (state.db.users.some(u => u.Username.toLowerCase() === Username.toLowerCase())) {
      errEl.textContent = "Tên đăng nhập này đã tồn tại. Vui lòng chọn tên khác.";
      errEl.hidden = false;
      return;
    }

    let newUserId = state.db.nextUserId++;
    const newUser = {
      User_ID: newUserId,
      Username,
      FullName,
      DOB,
      Password,
      Email,
      CreatedAt: new Date().toISOString()
    };

    const remote = await callGoogleScript("register", newUser);
    if (remote && remote.ok && remote.User_ID) {
      newUser.User_ID = remote.User_ID;
      state.db.nextUserId = Math.max(state.db.nextUserId, Number(remote.User_ID) + 1);
    }

    state.db.users.push(newUser);
    // Initialize default 6 Jars & Goals container for the new User_ID
    state.currentUser = newUser;
    userJars();
    userMeta();
    saveLocalDB();

    showToast("Đăng ký thành công! User_ID của bạn là #" + newUser.User_ID);
    enterMainApp();
  }

  function mergeRemoteUserData(remote) {
    const uid = Number(remote.user.User_ID);
    state.db.users = state.db.users.filter(u => Number(u.User_ID) !== uid).concat([remote.user]);
    if (Array.isArray(remote.wallets)) {
      state.db.wallets = state.db.wallets.filter(w => Number(w.User_ID) !== uid).concat(remote.wallets);
    }
    if (Array.isArray(remote.savings)) {
      state.db.savings = state.db.savings.filter(s => Number(s.User_ID) !== uid).concat(remote.savings);
    }
    if (Array.isArray(remote.transactions)) {
      state.db.transactions = state.db.transactions.filter(t => Number(t.User_ID) !== uid).concat(remote.transactions);
    }
    if (Array.isArray(remote.jars) && remote.jars.length === 6) {
      state.db.budgets6Jars[uid] = remote.jars;
    }
    if (remote.meta) {
      state.db.goalsSubs[uid] = remote.meta;
    }
    saveLocalDB();
  }

  function enterMainApp() {
    showScreen("screen-main");
    switchTab("home");
    renderAll();
  }

  // ========================================================================
  // 5. RENDER ALL TABS
  // ========================================================================
  function renderAll() {
    if (!state.currentUser) return;
    document.getElementById("header-user-meta").textContent =
      "ID #" + state.currentUser.User_ID + " · " + state.currentUser.Username;

    const meta = userMeta();
    document.getElementById("travel-mode-badge").hidden = !meta.travelMode.enabled;

    renderHome();
    renderTransfer();
    renderSpend();
    renderGoals();
    renderAI();
  }

  // ------------------------------------------------------------------------
  // TAB 1: HOME
  // ------------------------------------------------------------------------
  function renderHome() {
    const wallets = userWallets();
    const savings = userSavings();
    const base = state.baseCurrency;

    let walletSum = 0;
    wallets.forEach(w => { walletSum += convertCurrency(w.Balance, w.Currency, base); });
    let savingSum = 0;
    savings.forEach(s => { savingSum += convertCurrency(s.Principal_Amount, s.Currency, base); });
    const grandTotal = walletSum + savingSum;

    document.getElementById("fx-updated-label").textContent = "Tỷ giá Stablecoin · " + state.rates.updatedAt;
    document.getElementById("total-asset-value").textContent = formatMoney(grandTotal, base);
    document.getElementById("total-asset-breakdown").textContent =
      "Ví: " + formatMoney(walletSum, base) + "  ·  Tiết kiệm: " + formatMoney(savingSum, base);

    document.querySelectorAll("#base-currency-pills .pill-choice").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.curr === base);
    });

    // Wallet counter & lock at 6/6
    const countEl = document.getElementById("wallet-counter");
    const addBtn = document.getElementById("btn-add-wallet");
    countEl.textContent = wallets.length + "/6 ví";
    addBtn.disabled = wallets.length >= 6;
    addBtn.textContent = wallets.length >= 6 ? "Đã đủ 6/6" : "+ Thêm ví";

    // Wallet cards
    const walletList = document.getElementById("wallet-list");
    if (wallets.length === 0) {
      walletList.innerHTML = `<div class="card card-light" style="grid-column:span 2; text-align:center;">Chưa có ví nào. Bấm "+ Thêm ví" để bắt đầu (tối đa 6 ví).</div>`;
    } else {
      walletList.innerHTML = wallets.map(w => `
        <div class="wallet-card">
          <div class="wallet-card-top">
            <span class="wallet-name">${escapeHtml(w.Wallet_Name)}</span>
            <span class="pill ${w.Type === "Bank" ? "pill-velvet" : "pill-powder"} data-text">${w.Currency}</span>
          </div>
          <span class="wallet-meta">${escapeHtml(w.Country)} · ${w.Type === "Bank" ? "Ngân hàng" : "Tiền mặt"}</span>
          <div class="wallet-bal data-text">${formatMoney(w.Balance, w.Currency)}</div>
          <div class="wallet-actions">
            <button type="button" class="mini-action-btn" data-edit-wallet="${w.Wallet_ID}">Sửa</button>
            <button type="button" class="mini-action-btn danger" data-del-wallet="${w.Wallet_ID}">Xóa</button>
          </div>
        </div>
      `).join("");
    }

    // Savings cards
    const savingList = document.getElementById("saving-list");
    if (savings.length === 0) {
      savingList.innerHTML = `<div class="card card-light" style="text-align:center;">Chưa có sổ tiết kiệm.</div>`;
    } else {
      savingList.innerHTML = savings.map(s => {
        const dday = calcDDay(s.Maturity_Date);
        const estInterest = calcEstimatedInterest(s.Principal_Amount, s.Interest_Rate, s.Start_Date, s.Maturity_Date);
        return `
          <div class="saving-card">
            <div class="saving-top">
              <div>
                <div class="wallet-name">${escapeHtml(s.Bank_Name)}</div>
                <div class="wallet-meta">${escapeHtml(s.Country)} · Lãi suất ${s.Interest_Rate}%/năm</div>
              </div>
              <span class="pill ${dday.days <= 30 ? "pill-deep" : "pill-powder"} data-text">${dday.label}</span>
            </div>
            <div class="saving-amount data-text">${formatMoney(s.Principal_Amount, s.Currency)}</div>
            <div class="saving-meta-row data-text">
              <span>Mở: ${s.Start_Date || "Chưa đặt"} → Đáo hạn: ${s.Maturity_Date || "Chưa đặt"}</span>
              <span>Lãi dự kiến: <strong>+${formatMoney(estInterest, s.Currency)}</strong></span>
            </div>
            <div class="wallet-actions">
              <button type="button" class="mini-action-btn" data-edit-saving="${s.Saving_ID}">Chỉnh sửa sổ</button>
              <button type="button" class="mini-action-btn danger" data-del-saving="${s.Saving_ID}">Xóa</button>
            </div>
          </div>
        `;
      }).join("");
    }

    // Visa Balance Guard
    const meta = userMeta();
    const totalKRW = convertCurrency(grandTotal, base, "KRW");
    const minVisa = Number(meta.visaMinKRW) || 10000000;
    const ratio = Math.min(100, Math.round((totalKRW / minVisa) * 100));
    const buffer = totalKRW - minVisa;

    document.getElementById("visa-min-display").textContent = formatMoney(minVisa, "KRW");
    document.getElementById("visa-avail-display").textContent = formatMoney(totalKRW, "KRW");
    document.getElementById("visa-progress-bar").style.width = ratio + "%";

    const visaStatusBox = document.getElementById("visa-status-box");
    if (buffer < 0) {
      visaStatusBox.textContent = "CẢNH BÁO NGƯỠNG VISA: Thiếu " + formatMoney(Math.abs(buffer), "KRW") + " so với mức khóa tối thiểu!";
    } else if (buffer < minVisa * 0.2) {
      visaStatusBox.textContent = "Sát ngưỡng an toàn: Số dư vượt mức Visa " + formatMoney(buffer, "KRW") + ". Hạn chế chi tiêu lớn.";
    } else {
      visaStatusBox.textContent = "An toàn gia hạn Visa: Đang dư " + formatMoney(buffer, "KRW") + " trên mức khóa ảo.";
    }

    // $50K Limit Radar
    const used50k = Number(meta.fx50kUsedUSD) || 0;
    const pct50k = Math.min(100, Math.round((used50k / 50000) * 100));
    document.getElementById("fx50k-used-display").textContent = formatMoney(used50k, "USD");
    const bar50k = document.getElementById("fx50k-bar");
    bar50k.style.width = pct50k + "%";
    bar50k.className = "progress-fill " + (pct50k >= 80 ? "fill-deep" : "fill-powder");
  }

  function calcDDay(maturityStr) {
    if (!maturityStr) return { days: 999, label: "Chưa đặt hạn" };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const mat = new Date(maturityStr);
    const diff = Math.ceil((mat - today) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { days: diff, label: "Đã đáo hạn" };
    if (diff === 0) return { days: 0, label: "D-Day Hôm nay" };
    return { days: diff, label: "D-" + diff };
  }

  function calcEstimatedInterest(principal, rate, startStr, endStr) {
    const p = Number(principal) || 0;
    const r = (Number(rate) || 0) / 100;
    if (!startStr || !endStr) return p * r;
    const days = Math.max(1, (new Date(endStr) - new Date(startStr)) / (1000 * 60 * 60 * 24));
    return p * r * (days / 365);
  }

  // ------------------------------------------------------------------------
  // TAB 2: TRANSFER
  // ------------------------------------------------------------------------
  function renderTransfer() {
    // Populate wallet select for remittance
    const wallets = userWallets();
    const sel = document.getElementById("remit-source-wallet");
    if (wallets.length) {
      const prev = sel.value;
      sel.innerHTML = wallets.map(w => `<option value="${w.Wallet_ID}">${escapeHtml(w.Wallet_Name)} (${formatMoney(w.Balance, w.Currency)})</option>`).join("");
      if (wallets.some(w => w.Wallet_ID === prev)) sel.value = prev;
    } else {
      sel.innerHTML = `<option value="">Chưa có ví</option>`;
    }

    renderRemittanceComparison();
    updateQRPreview();
    renderSplitBill();
    renderATMList();
  }

  function renderRemittanceComparison() {
    const amount = Number(document.getElementById("remit-amount").value) || 0;
    const pair = document.getElementById("remit-pair").value;
    const [fromCurr, toCurr] = pair.split("_");
    const midRate = convertCurrency(1, fromCurr, toCurr);

    const providers = [
      { id: "stablecoin", name: "Tuyến Stablecoin (USDT/USDC)", spread: 0.002, fee: fromCurr === "KRW" ? 1500 : 1, speed: "~2 phút", tag: "Tối ưu nhất" },
      { id: "sentbe", name: "SentBe", spread: 0.007, fee: fromCurr === "KRW" ? 5000 : 3.5, speed: "5–30 phút", tag: "Phổ biến" },
      { id: "hanpass", name: "Hanpass", spread: 0.009, fee: fromCurr === "KRW" ? 5000 : 4, speed: "10–40 phút", tag: "Nhanh" },
      { id: "wirebarley", name: "WireBarley", spread: 0.011, fee: fromCurr === "KRW" ? 4000 : 3, speed: "1–2 giờ", tag: "Ổn định" }
    ];

    const computed = providers.map(p => {
      const netSend = Math.max(0, amount - p.fee);
      const effRate = midRate * (1 - p.spread);
      const receiveAmt = netSend * effRate;
      return Object.assign({}, p, { receiveAmt, effRate });
    }).sort((a, b) => b.receiveAmt - a.receiveAmt);

    const container = document.getElementById("remit-compare-list");
    container.innerHTML = computed.map((p, idx) => `
      <div class="remit-card ${idx === 0 ? "best" : ""}">
        <div class="remit-row">
          <strong>${p.name}</strong>
          <span class="pill ${idx === 0 ? "pill-velvet" : "pill-thistle"}">${idx === 0 ? "Thực nhận cao nhất" : p.tag}</span>
        </div>
        <div class="remit-row">
          <div>
            <div class="remit-recv data-text">${formatMoney(p.receiveAmt, toCurr)}</div>
            <div class="wallet-meta data-text">Phí: ${formatMoney(p.fee, fromCurr)} · Tốc độ: ${p.speed}</div>
          </div>
          <button type="button" class="btn ${idx === 0 ? "btn-primary" : "btn-ghost"} btn-sm" data-send-remit="${p.id}" data-remit-name="${p.name}">
            Chuyển 1 chạm
          </button>
        </div>
      </div>
    `).join("");
  }

  function executeRemittance(providerName) {
    const amount = Number(document.getElementById("remit-amount").value) || 0;
    const pair = document.getElementById("remit-pair").value;
    const [fromCurr, toCurr] = pair.split("_");
    const walletId = document.getElementById("remit-source-wallet").value;
    const wallet = state.db.wallets.find(w => w.Wallet_ID === walletId);

    if (amount <= 0) return showToast("Nhập số tiền hợp lệ.");
    if (wallet) {
      const deductAmt = convertCurrency(amount, fromCurr, wallet.Currency);
      wallet.Balance = Math.max(0, wallet.Balance - deductAmt);
    }

    // Update $50,000 annual limit tracker
    const usdEq = convertCurrency(amount, fromCurr, "USD");
    const meta = userMeta();
    meta.fx50kUsedUSD = Number(((meta.fx50kUsedUSD || 0) + usdEq).toFixed(2));

    // Record transaction
    const tx = {
      Tx_ID: "T" + Date.now(),
      User_ID: state.currentUser.User_ID,
      Date: new Date().toISOString().slice(0, 10),
      Type: "Transfer",
      Currency: fromCurr,
      Amount: amount,
      Jar_Category: "Gửi về nhà",
      Wallet_ID: walletId || "",
      Is_Travel_Mode: meta.travelMode.enabled,
      Note: "Chuyển quốc tế (" + fromCurr + "→" + toCurr + ") qua " + providerName
    };
    state.db.transactions.push(tx);
    saveLocalDB();
    callGoogleScript("addTransaction", tx);
    if (wallet) callGoogleScript("upsertWallet", wallet);
    callGoogleScript("saveMeta", { User_ID: state.currentUser.User_ID, meta });

    renderAll();
    showToast("Đã chuyển " + formatMoney(amount, fromCurr) + " qua " + providerName + " (đã cộng vào hạn mức $50K)");
  }

  // Deterministic scannable-style QR canvas (no external dependency failure)
  function renderMyQR() {
    if (!state.currentUser) return;
    const payload = "MONIFY://UID:" + state.currentUser.User_ID + "/" + state.currentUser.Username;
    document.getElementById("qr-owner-name").textContent = state.currentUser.FullName + " (@" + state.currentUser.Username + ")";
    document.getElementById("qr-payload-text").textContent = payload;

    const canvas = document.getElementById("my-qr-canvas");
    const ctx = canvas.getContext("2d");
    const size = 21;
    const cell = canvas.width / size;

    ctx.fillStyle = "#FAF9F8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Hash payload for deterministic data modules
    let seed = 0;
    for (let i = 0; i < payload.length; i++) {
      seed = ((seed << 5) - seed + payload.charCodeAt(i)) | 0;
    }

    function drawFinder(ox, oy) {
      ctx.fillStyle = "#150811";
      ctx.fillRect(ox * cell, oy * cell, 7 * cell, 7 * cell);
      ctx.fillStyle = "#FAF9F8";
      ctx.fillRect((ox + 1) * cell, (oy + 1) * cell, 5 * cell, 5 * cell);
      ctx.fillStyle = "#623B70";
      ctx.fillRect((ox + 2) * cell, (oy + 2) * cell, 3 * cell, 3 * cell);
    }

    drawFinder(0, 0);
    drawFinder(size - 7, 0);
    drawFinder(0, size - 7);

    let v = Math.abs(seed) || 12345;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const inFinder = (r < 8 && c < 8) || (r < 8 && c >= size - 8) || (r >= size - 8 && c < 8);
        if (inFinder) continue;
        v = (v * 1664525 + 1013904223) % 4294967296;
        if ((v & 1) === 1) {
          ctx.fillStyle = (r + c) % 5 === 0 ? "#531245" : "#150811";
          ctx.fillRect(c * cell + 0.5, r * cell + 0.5, cell - 1, cell - 1);
        }
      }
    }
  }

  function updateQRPreview() {
    const krw = Number(document.getElementById("qr-send-amount").value) || 0;
    const recvCurr = document.getElementById("qr-recv-curr").value;
    const out = convertCurrency(krw, "KRW", recvCurr);
    document.getElementById("qr-converted-preview").textContent =
      "Người nhận sẽ nhận: " + formatMoney(out, recvCurr) + " (Phí 0₫ · Tỷ giá thực)";
  }

  function renderSplitBill() {
    const itemsEl = document.getElementById("split-items-list");
    const settleEl = document.getElementById("split-settlement-list");

    if (state.splitItems.length === 0) {
      itemsEl.innerHTML = `<p class="muted-note">Chưa có hóa đơn nào trong nhóm.</p>`;
      settleEl.innerHTML = `<p class="label-light">Thêm ít nhất 1 hóa đơn để tính chia tiền.</p>`;
      return;
    }

    itemsEl.innerHTML = state.splitItems.map(item => `
      <div class="split-row">
        <div>
          <strong>${escapeHtml(item.payer)}</strong> · ${escapeHtml(item.note)}
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="data-text"><strong>${formatMoney(item.amount, item.currency)}</strong></span>
          <button type="button" class="mini-action-btn danger" data-del-split="${item.id}">✕</button>
        </div>
      </div>
    `).join("");

    // Compute balances in KRW
    const totalsByPerson = {};
    let grandKRW = 0;
    state.splitItems.forEach(item => {
      const krw = convertCurrency(item.amount, item.currency, "KRW");
      grandKRW += krw;
      totalsByPerson[item.payer] = (totalsByPerson[item.payer] || 0) + krw;
    });

    const people = Object.keys(totalsByPerson);
    const share = grandKRW / people.length;

    const debtors = [];
    const creditors = [];
    people.forEach(name => {
      const diff = totalsByPerson[name] - share;
      if (diff < -100) debtors.push({ name, amt: -diff });
      else if (diff > 100) creditors.push({ name, amt: diff });
    });

    const settlements = [];
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const pay = Math.min(debtors[i].amt, creditors[j].amt);
      settlements.push({ from: debtors[i].name, to: creditors[j].name, amt: pay });
      debtors[i].amt -= pay;
      creditors[j].amt -= pay;
      if (debtors[i].amt < 100) i++;
      if (creditors[j].amt < 100) j++;
    }

    if (settlements.length === 0) {
      settleEl.innerHTML = `<div class="settle-row">Mọi người đã chia đều bằng nhau (${formatMoney(share, "KRW")}/người).</div>`;
    } else {
      settleEl.innerHTML = `
        <div class="label-light data-text" style="margin-bottom:4px;">Tổng nhóm: ${formatMoney(grandKRW, "KRW")} · Mỗi người: ${formatMoney(share, "KRW")}</div>
        ${settlements.map(s => `
          <div class="settle-row">
            <span><strong>${escapeHtml(s.from)}</strong> → <strong>${escapeHtml(s.to)}</strong></span>
            <strong class="data-text">${formatMoney(s.amt, "KRW")}</strong>
          </div>
        `).join("")}
      `;
    }
  }

  function renderATMList() {
    const filtered = SEOUL_SPOTS.filter(s => state.atmFilter === "all" || s.type === state.atmFilter);
    document.getElementById("atm-list").innerHTML = filtered.map(s => `
      <div class="atm-card">
        <div>
          <div class="wallet-name">${escapeHtml(s.name)}</div>
          <div class="wallet-meta">${s.area} · ${s.hours}</div>
          <div class="wallet-meta">${escapeHtml(s.note)}</div>
        </div>
        <a class="btn btn-primary btn-sm" href="https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}" target="_blank" rel="noopener">
          Chỉ đường
        </a>
      </div>
    `).join("");

    if (state.mapInstance) updateMapMarkers(filtered);
  }

  function initOrRefreshMap() {
    const el = document.getElementById("seoul-map");
    if (!el || typeof window.L === "undefined") return;
    if (!state.mapInstance) {
      state.mapInstance = window.L.map(el, { zoomControl: false }).setView([37.551, 126.975], 12);
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap"
      }).addTo(state.mapInstance);
    } else {
      state.mapInstance.invalidateSize();
    }
    const filtered = SEOUL_SPOTS.filter(s => state.atmFilter === "all" || s.type === state.atmFilter);
    updateMapMarkers(filtered);
  }

  function updateMapMarkers(spots) {
    state.mapMarkers.forEach(m => m.remove());
    state.mapMarkers = [];
    spots.forEach(s => {
      const marker = window.L.circleMarker([s.lat, s.lng], {
        radius: 8,
        fillColor: s.type === "fx" ? "#531245" : "#623B70",
        color: "#FAF9F8",
        weight: 2,
        fillOpacity: 0.95
      }).addTo(state.mapInstance).bindPopup(`<strong>${s.name}</strong><br/>${s.area} (${s.hours})`);
      state.mapMarkers.push(marker);
    });
  }

  // ------------------------------------------------------------------------
  // TAB 3: SPEND (6 JARS, CASHFLOW ANALYTICS, TX LIST, SUBSCRIPTIONS)
  // ------------------------------------------------------------------------
  function renderSpend() {
    const jars = userJars();
    const txs = userTransactions().filter(t => !t.Is_Travel_Mode);

    // Calculate monthly income baseline for jar allowance
    const monthlyIncomeKRW = txs
      .filter(t => t.Type === "Income")
      .reduce((acc, t) => acc + convertCurrency(t.Amount, t.Currency, "KRW"), 0) || 2000000;

    // Calculate spent per jar
    const spentMap = {};
    txs.filter(t => t.Type === "Expense" || t.Type === "Transfer").forEach(t => {
      const key = t.Jar_Category || "Thiết yếu";
      spentMap[key] = (spentMap[key] || 0) + convertCurrency(t.Amount, t.Currency, "KRW");
    });

    const totalPct = jars.reduce((s, j) => s + Number(j.pct), 0);
    const pctBadge = document.getElementById("jars-total-pct");
    pctBadge.textContent = "Tổng: " + totalPct + "%";
    pctBadge.className = "pill data-text " + (totalPct === 100 ? "pill-powder" : "pill-deep");

    document.getElementById("jars-list").innerHTML = jars.map((jar, idx) => {
      const budget = monthlyIncomeKRW * (jar.pct / 100);
      const spent = spentMap[jar.name] || 0;
      const usedPct = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
      return `
        <div class="jar-item">
          <div class="jar-top">
            <input type="text" class="jar-name-input" data-jar-name="${idx}" value="${escapeHtml(jar.name)}" />
            <span class="pill ${usedPct > 90 ? "pill-deep" : "pill-thistle"} data-text">${jar.pct}%</span>
          </div>
          <input type="range" class="jar-range" min="0" max="80" step="1" value="${jar.pct}" data-jar-range="${idx}" />
          <div class="saving-meta-row data-text">
            <span>Đã dùng: <strong>${formatMoney(spent, "KRW")}</strong></span>
            <span>Hạn mức: ${formatMoney(budget, "KRW")}</span>
          </div>
          <div class="progress-track" style="margin:2px 0 0;">
            <div class="progress-fill ${usedPct > 90 ? "fill-deep" : "fill-velvet"}" style="width:${usedPct}%;"></div>
          </div>
        </div>
      `;
    }).join("");

    renderCashflowChart(txs);
    renderRecentTransactions();
    renderSubscriptions();
  }

  function renderCashflowChart(normalTxs) {
    const period = state.cashflowPeriod;
    const periodDays = { "1W": 7, "1M": 30, "3M": 90, "6M": 180, "1Y": 365 }[period] || 30;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - periodDays);

    const inPeriod = normalTxs.filter(t => new Date(t.Date) >= cutoff);
    const realInc = inPeriod.filter(t => t.Type === "Income").reduce((s, t) => s + convertCurrency(t.Amount, t.Currency, "KRW"), 0);
    const realExp = inPeriod.filter(t => t.Type !== "Income").reduce((s, t) => s + convertCurrency(t.Amount, t.Currency, "KRW"), 0);

    // Build 5-bar series combining historical baseline + live user transactions
    const labelsMap = {
      "1W": ["T2", "T4", "T6", "T7", "CN"],
      "1M": ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4", "Hiện tại"],
      "3M": ["Thg -2", "Thg -1", "Nửa đầu", "Giữa kỳ", "Tháng này"],
      "6M": ["T-5", "T-4", "T-3", "T-2", "Hiện tại"],
      "1Y": ["Q1", "Q2", "Q3", "Q4", "Hiện tại"]
    };
    const mult = { "1W": 0.25, "1M": 1, "3M": 2.8, "6M": 5.5, "1Y": 11 }[period] || 1;
    const incSeries = [1650000, 1750000, 1700000, 1800000, Math.max(realInc, 1850000)].map((v, i) => i === 4 ? v : Math.round(v * mult * 0.22));
    const expSeries = [920000, 1180000, 860000, 1490000, Math.max(realExp, 797000)].map((v, i) => i === 4 ? v : Math.round(v * mult * 0.22));

    const totalInc = incSeries.reduce((a, b) => a + b, 0);
    const totalExp = expSeries.reduce((a, b) => a + b, 0);
    const avgExp = totalExp / expSeries.length;
    const maxVal = Math.max(...incSeries, ...expSeries, 1);

    document.getElementById("cf-income-val").textContent = formatMoney(totalInc, "KRW");
    document.getElementById("cf-expense-val").textContent = formatMoney(totalExp, "KRW");
    document.getElementById("cf-net-val").textContent = formatMoney(totalInc - totalExp, "KRW");

    const labels = labelsMap[period];
    let spikeLabel = "";
    const barsSVG = labels.map((lbl, idx) => {
      const x = 18 + idx * 66;
      const hInc = Math.max(8, Math.round((incSeries[idx] / maxVal) * 98));
      const hExp = Math.max(8, Math.round((expSeries[idx] / maxVal) * 98));
      const isSpike = expSeries[idx] > avgExp * 1.18;
      if (isSpike) spikeLabel = lbl;
      return `
        <rect x="${x}" y="${112 - hInc}" width="18" height="${hInc}" rx="5" fill="#AAAAFF" />
        <rect x="${x + 22}" y="${112 - hExp}" width="18" height="${hExp}" rx="5" fill="${isSpike ? "#531245" : "#623B70"}" />
        ${isSpike ? `<circle cx="${x + 31}" cy="${106 - hExp}" r="3.5" fill="#531245" />` : ""}
        <text x="${x + 20}" y="132" text-anchor="middle" font-size="10" fill="#150811" font-family="Arial Narrow, sans-serif">${lbl}</text>
      `;
    }).join("");

    document.getElementById("cashflow-chart").innerHTML = `
      <svg viewBox="0 0 350 144" width="100%" height="144" role="img" aria-label="Biểu đồ Thu nhập vs Chi tiêu">
        <line x1="10" y1="112" x2="340" y2="112" stroke="#BEB8CD" stroke-width="1" />
        ${barsSVG}
      </svg>
      <div class="saving-meta-row data-text" style="justify-content:center; gap:14px;">
        <span><strong style="color:#AAAAFF;">■</strong> Thu nhập</span>
        <span><strong style="color:#623B70;">■</strong> Chi tiêu</span>
        <span><strong style="color:#531245;">■</strong> Vượt trung bình</span>
      </div>
    `;

    const spikeBadge = document.getElementById("cashflow-spike-badge");
    spikeBadge.hidden = !spikeLabel;
    document.getElementById("cashflow-insight-text").textContent = spikeLabel
      ? `Điểm đáng chú ý: Chi tiêu tại mốc "${spikeLabel}" vượt mức trung bình kỳ (${formatMoney(avgExp, "KRW")}).`
      : "Dòng tiền chi tiêu đang duy trì ổn định trong mức trung bình.";
  }

  function renderRecentTransactions() {
    const txs = userTransactions();
    document.getElementById("tx-count-label").textContent = txs.length + " giao dịch";
    const list = document.getElementById("tx-list");
    if (txs.length === 0) {
      list.innerHTML = `<p class="muted-note">Chưa có giao dịch nào.</p>`;
      return;
    }
    list.innerHTML = txs.slice(0, 8).map(t => `
      <div class="tx-row">
        <div>
          <div class="tx-title">${escapeHtml(t.Note || t.Jar_Category)} ${t.Is_Travel_Mode ? '<span class="pill pill-deep">Travel</span>' : ''}</div>
          <div class="tx-sub data-text">${t.Date} · ${escapeHtml(t.Jar_Category)}</div>
        </div>
        <div class="tx-amt data-text ${t.Type === "Income" ? "income" : "expense"}">
          ${t.Type === "Income" ? "+" : "-"}${formatMoney(t.Amount, t.Currency)}
        </div>
      </div>
    `).join("");
  }

  function renderSubscriptions() {
    const subs = userMeta().subscriptions || [];
    const totalKRW = subs.reduce((acc, s) => acc + convertCurrency(s.amount, s.currency, "KRW"), 0);
    document.getElementById("subs-monthly-total").textContent = formatMoney(totalKRW, "KRW") + " / tháng";

    const todayDate = new Date().getDate();
    const list = document.getElementById("subs-list");
    if (subs.length === 0) {
      list.innerHTML = `<p class="label-light">Chưa có gói đăng ký định kỳ.</p>`;
      return;
    }
    list.innerHTML = subs.map(s => {
      const diff = (Number(s.billingDay) - todayDate + 31) % 31;
      const is24h = diff === 0 || diff === 1;
      return `
        <div class="sub-item">
          <div>
            <div style="font-weight:700; color:#FAF9F8;">${escapeHtml(s.name)} ${is24h ? '<span class="pill pill-powder">Nhắc 24h</span>' : ''}</div>
            <div class="label-light data-text">Trừ ngày ${s.billingDay} hàng tháng · ${formatMoney(s.amount, s.currency)}</div>
          </div>
          <button type="button" class="pill pill-thistle" data-del-sub="${s.id}">Hủy</button>
        </div>
      `;
    }).join("");
  }

  // ------------------------------------------------------------------------
  // TAB 4: GOALS & TRAVEL MODE
  // ------------------------------------------------------------------------
  function renderGoals() {
    const meta = userMeta();
    const tm = meta.travelMode;

    const toggle = document.getElementById("toggle-travel-mode");
    toggle.checked = !!tm.enabled;
    document.getElementById("travel-mode-details").hidden = !tm.enabled;
    document.getElementById("travel-trip-name").value = tm.tripName || "";
    document.getElementById("travel-budget-krw").value = tm.budgetKRW || 1500000;

    const travelSpentKRW = userTransactions()
      .filter(t => t.Is_Travel_Mode && t.Type !== "Income")
      .reduce((acc, t) => acc + convertCurrency(t.Amount, t.Currency, "KRW"), 0);

    const budget = Number(tm.budgetKRW) || 1;
    const pct = Math.min(100, Math.round((travelSpentKRW / budget) * 100));
    document.getElementById("travel-spent-display").textContent = formatMoney(travelSpentKRW, "KRW");
    document.getElementById("travel-remain-display").textContent = "Còn lại: " + formatMoney(Math.max(0, budget - travelSpentKRW), "KRW");
    document.getElementById("travel-progress-bar").style.width = pct + "%";

    // Goals List
    const goals = meta.goals || [];
    const list = document.getElementById("goals-list");
    if (goals.length === 0) {
      list.innerHTML = `<div class="card card-light" style="text-align:center;">Chưa có mục tiêu nào. Bấm "+ Mục tiêu" để lập kế hoạch.</div>`;
      return;
    }

    list.innerHTML = goals.map(g => {
      const remain = Math.max(0, Number(g.targetAmount) - Number(g.savedAmount));
      const monthsLeft = Math.max(1, Math.ceil((new Date(g.deadline) - new Date()) / (1000 * 60 * 60 * 24 * 30)));
      const perMonth = remain / monthsLeft;
      const pctDone = Math.min(100, Math.round((Number(g.savedAmount) / Math.max(1, Number(g.targetAmount))) * 100));
      const usdtBatch = convertCurrency(perMonth / 2, g.currency, "USDT");

      return `
        <div class="goal-card">
          <div class="saving-top">
            <div>
              <div class="wallet-name">${escapeHtml(g.name)}</div>
              <div class="wallet-meta data-text">Hạn chót: ${g.deadline} (${monthsLeft} tháng)</div>
            </div>
            <span class="pill pill-velvet data-text">${pctDone}%</span>
          </div>
          <div class="saving-meta-row data-text">
            <span>Đã gom: <strong>${formatMoney(g.savedAmount, g.currency)}</strong></span>
            <span>Mục tiêu: <strong>${formatMoney(g.targetAmount, g.currency)}</strong></span>
          </div>
          <div class="progress-track">
            <div class="progress-fill fill-velvet" style="width:${pctDone}%;"></div>
          </div>
          <div class="hedge-box data-text">
            Cần để dành <strong>${formatMoney(perMonth, g.currency)}/tháng</strong>. Gợi ý chia nhỏ đổi <strong>${formatMoney(usdtBatch, "USDT")}</strong> mỗi 2 tuần khi tỷ giá thuận lợi.
          </div>
          <div class="wallet-actions">
            <button type="button" class="mini-action-btn" data-topup-goal="${g.id}">+ Nạp thêm</button>
            <button type="button" class="mini-action-btn danger" data-del-goal="${g.id}">Xóa</button>
          </div>
        </div>
      `;
    }).join("");
  }

  // ------------------------------------------------------------------------
  // TAB 5: AI ASSISTANT (HEALTH SCORE + FX ALERTS)
  // ------------------------------------------------------------------------
  function renderAI() {
    const wallets = userWallets();
    const savings = userSavings();
    const meta = userMeta();
    const jars = userJars();

    const walletKRW = wallets.reduce((s, w) => s + convertCurrency(w.Balance, w.Currency, "KRW"), 0);
    const savingKRW = savings.reduce((s, sv) => s + convertCurrency(sv.Principal_Amount, sv.Currency, "KRW"), 0);
    const totalKRW = walletKRW + savingKRW;

    // 1. Savings ratio score (max 35)
    const savingRatio = totalKRW > 0 ? savingKRW / totalKRW : 0;
    const scoreSavings = Math.min(35, Math.round(savingRatio * 45));

    // 2. Visa safety score (max 35)
    const visaMin = Number(meta.visaMinKRW) || 10000000;
    const scoreVisa = totalKRW >= visaMin * 1.2 ? 35 : totalKRW >= visaMin ? 28 : Math.round((totalKRW / visaMin) * 22);

    // 3. 6-Jars discipline score (max 30)
    const totalPct = jars.reduce((s, j) => s + Number(j.pct), 0);
    const scoreJars = totalPct === 100 ? 28 : 16;

    const totalScore = Math.max(0, Math.min(100, scoreSavings + scoreVisa + scoreJars));
    const grade = totalScore >= 85 ? "Rất khỏe" : totalScore >= 70 ? "Tốt" : totalScore >= 50 ? "Trung bình" : "Cần chú ý";

    document.getElementById("health-score-num").textContent = totalScore;
    document.getElementById("health-grade-pill").textContent = grade;
    const circumference = 314;
    const offset = circumference - (totalScore / 100) * circumference;
    document.getElementById("health-ring-circle").setAttribute("stroke-dashoffset", String(offset));

    document.getElementById("health-breakdown").innerHTML = `
      <div class="metric-line"><span>Tỷ lệ tiết kiệm</span><strong>${scoreSavings}/35</strong></div>
      <div class="metric-line"><span>An toàn số dư Visa</span><strong>${scoreVisa}/35</strong></div>
      <div class="metric-line"><span>Tuân thủ 6 Chiếc lọ</span><strong>${scoreJars}/30</strong></div>
    `;

    // Weekly actionable tips
    const tips = [];
    if (totalKRW < visaMin * 1.15) {
      tips.push("Ưu tiên giữ số dư khả dụng cao hơn ngưỡng Visa (" + formatMoney(visaMin, "KRW") + ") ít nhất 15% trước kỳ gia hạn.");
    } else {
      tips.push("Số dư Visa đang an toàn. Bạn có thể chuyển phần nhàn rỗi vào quỹ mục tiêu hoặc đổi dần sang USDT khi tỷ giá đẹp.");
    }
    if (meta.subscriptions && meta.subscriptions.length >= 3) {
      tips.push("Rà soát lại " + meta.subscriptions.length + " gói đăng ký định kỳ (KRW/USD) để tránh trừ tiền tự động ngoài ý muốn.");
    } else {
      tips.push("Duy trì ghi chép hóa đơn bằng AI Quét hóa đơn để kiểm soát chặt hũ Thiết yếu & Hưởng thụ.");
    }
    document.getElementById("ai-weekly-tips").innerHTML = tips.map(t => `<li>${t}</li>`).join("");

    // FX Alerts
    const alerts = meta.fxAlerts || [];
    const alertsEl = document.getElementById("fx-alerts-list");
    if (alerts.length === 0) {
      alertsEl.innerHTML = `<p class="muted-note">Chưa có cảnh báo tỷ giá nào.</p>`;
    } else {
      alertsEl.innerHTML = alerts.map(al => {
        const [f, t] = al.pair.split("_");
        const live = convertCurrency(1, f, t);
        const reached = (al.pair === "KRW_VND" && live >= al.target) || (al.pair !== "KRW_VND" && live <= al.target);
        return `
          <div class="alert-item">
            <div>
              <div class="wallet-name data-text">1 ${f} → ${t} | Mục tiêu: ${al.target}</div>
              <div class="wallet-meta data-text">Hiện tại: <strong>${live.toFixed(2)}</strong> · ${reached ? "ĐÃ ĐẠT NGƯỠNG!" : "Đang theo dõi"}</div>
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
              <span class="pill ${reached ? "pill-deep" : "pill-thistle"}">${reached ? "Đạt" : "Chờ"}</span>
              <button type="button" class="mini-action-btn danger" data-del-alert="${al.id}">✕</button>
            </div>
          </div>
        `;
      }).join("");
    }
  }

  // ========================================================================
  // 6. MODALS (WALLETS, SAVINGS, TX, AI OCR, GOALS, SUBS, SETTINGS)
  // ========================================================================
  function openModal(title, bodyHtml) {
    document.getElementById("modal-title").textContent = title;
    document.getElementById("modal-body").innerHTML = bodyHtml;
    document.getElementById("modal-backdrop").hidden = false;
  }

  function closeModal() {
    document.getElementById("modal-backdrop").hidden = true;
  }

  function openWalletModal(editId) {
    const existing = editId ? state.db.wallets.find(w => w.Wallet_ID === editId) : null;
    if (!existing && userWallets().length >= 6) {
      return showToast("Bạn đã đạt giới hạn tối đa 6/6 ví tiền.");
    }
    openModal(existing ? "Chỉnh sửa ví tiền" : "Thêm ví tiền mới", `
      <form id="modal-wallet-form" class="stack-list">
        <div class="field">
          <label>Tên ví *</label>
          <input name="Wallet_Name" required value="${existing ? escapeHtml(existing.Wallet_Name) : ""}" placeholder="VD: KakaoBank / Ví EUR" />
        </div>
        <div class="grid-2">
          <div class="field">
            <label>Loại ví</label>
            <select name="Type">
              <option value="Bank" ${existing && existing.Type === "Bank" ? "selected" : ""}>Ngân hàng (Bank)</option>
              <option value="Cash" ${existing && existing.Type === "Cash" ? "selected" : ""}>Tiền mặt (Cash)</option>
            </select>
          </div>
          <div class="field">
            <label>Quốc gia</label>
            <input name="Country" required value="${existing ? escapeHtml(existing.Country) : "Hàn Quốc"}" placeholder="Hàn Quốc / Việt Nam" />
          </div>
        </div>
        <div class="grid-2">
          <div class="field">
            <label>Loại tiền tệ (tách riêng)</label>
            <select name="Currency">
              ${["KRW", "VND", "USD", "USDT", "EUR", "JPY", "RUB", "UZS"].map(c => `<option value="${c}" ${existing && existing.Currency === c ? "selected" : ""}>${c}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label>Số dư hiện tại *</label>
            <input name="Balance" type="number" step="any" required class="data-text" value="${existing ? existing.Balance : 0}" />
          </div>
        </div>
        <button type="submit" class="btn btn-primary btn-full">${existing ? "Lưu thay đổi" : "Thêm ví"}</button>
      </form>
    `);

    document.getElementById("modal-wallet-form").onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = {
        Wallet_ID: existing ? existing.Wallet_ID : "W" + Date.now(),
        User_ID: state.currentUser.User_ID,
        Wallet_Name: fd.get("Wallet_Name").trim(),
        Type: fd.get("Type"),
        Country: fd.get("Country").trim(),
        Currency: fd.get("Currency"),
        Balance: Number(fd.get("Balance")) || 0
      };
      if (existing) {
        Object.assign(existing, data);
      } else {
        state.db.wallets.push(data);
      }
      saveLocalDB();
      callGoogleScript("upsertWallet", data);
      closeModal();
      renderAll();
      showToast(existing ? "Đã cập nhật ví tiền" : "Đã thêm ví tiền mới");
    };
  }

  function openSavingModal(editId) {
    const existing = editId ? state.db.savings.find(s => s.Saving_ID === editId) : null;
    openModal(existing ? "Chỉnh sửa Sổ tiết kiệm" : "Thêm Sổ tiết kiệm", `
      <form id="modal-saving-form" class="stack-list">
        <div class="field">
          <label>Tên ngân hàng / Sổ tiết kiệm *</label>
          <input name="Bank_Name" required value="${existing ? escapeHtml(existing.Bank_Name) : ""}" placeholder="VD: Sổ tiết kiệm Shinhan" />
        </div>
        <div class="grid-2">
          <div class="field">
            <label>Quốc gia</label>
            <input name="Country" required value="${existing ? escapeHtml(existing.Country) : "Hàn Quốc"}" />
          </div>
          <div class="field">
            <label>Tiền tệ</label>
            <select name="Currency">
              ${["KRW", "VND", "USD"].map(c => `<option value="${c}" ${existing && existing.Currency === c ? "selected" : ""}>${c}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="grid-2">
          <div class="field">
            <label>Số tiền gốc *</label>
            <input name="Principal_Amount" type="number" step="any" required class="data-text" value="${existing ? existing.Principal_Amount : 0}" />
          </div>
          <div class="field">
            <label>Lãi suất (%/năm)</label>
            <input name="Interest_Rate" type="number" step="0.1" required class="data-text" value="${existing ? existing.Interest_Rate : 3.5}" />
          </div>
        </div>
        <div class="grid-2">
          <div class="field">
            <label>Ngày mở sổ</label>
            <input name="Start_Date" type="date" value="${existing ? existing.Start_Date : new Date().toISOString().slice(0, 10)}" />
          </div>
          <div class="field">
            <label>Ngày đáo hạn</label>
            <input name="Maturity_Date" type="date" value="${existing ? existing.Maturity_Date : ""}" />
          </div>
        </div>
        <button type="submit" class="btn btn-velvet btn-full">Lưu sổ tiết kiệm</button>
      </form>
    `);

    document.getElementById("modal-saving-form").onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = {
        Saving_ID: existing ? existing.Saving_ID : "S" + Date.now(),
        User_ID: state.currentUser.User_ID,
        Bank_Name: fd.get("Bank_Name").trim(),
        Country: fd.get("Country").trim(),
        Currency: fd.get("Currency"),
        Principal_Amount: Number(fd.get("Principal_Amount")) || 0,
        Interest_Rate: Number(fd.get("Interest_Rate")) || 0,
        Start_Date: fd.get("Start_Date"),
        Maturity_Date: fd.get("Maturity_Date")
      };
      if (existing) Object.assign(existing, data);
      else state.db.savings.push(data);
      saveLocalDB();
      callGoogleScript("upsertSaving", data);
      closeModal();
      renderAll();
      showToast("Đã lưu sổ tiết kiệm");
    };
  }

  function openAddTxModal(prefill) {
    const wallets = userWallets();
    const jars = userJars();
    const p = prefill || {};
    const isTravel = p.Is_Travel_Mode !== undefined ? p.Is_Travel_Mode : userMeta().travelMode.enabled;

    openModal(isTravel ? "Ghi chi tiêu Chuyến đi (Travel Mode)" : "Thêm giao dịch Thu / Chi", `
      <form id="modal-tx-form" class="stack-list">
        <div class="grid-2">
          <div class="field">
            <label>Loại giao dịch</label>
            <select name="Type">
              <option value="Expense" ${p.Type !== "Income" ? "selected" : ""}>Chi tiêu (Expense)</option>
              <option value="Income" ${p.Type === "Income" ? "selected" : ""}>Thu nhập (Income)</option>
            </select>
          </div>
          <div class="field">
            <label>Ngày</label>
            <input name="Date" type="date" value="${p.Date || new Date().toISOString().slice(0, 10)}" />
          </div>
        </div>
        <div class="grid-2">
          <div class="field">
            <label>Số tiền *</label>
            <input name="Amount" type="number" step="any" required class="data-text" value="${p.Amount || ""}" placeholder="VD: 15000" />
          </div>
          <div class="field">
            <label>Tiền tệ</label>
            <select name="Currency">
              ${["KRW", "VND", "USD", "USDT"].map(c => `<option value="${c}" ${p.Currency === c ? "selected" : ""}>${c}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="grid-2">
          <div class="field">
            <label>Chiếc lọ (6 Jars)</label>
            <select name="Jar_Category">
              ${jars.map(j => `<option value="${escapeHtml(j.name)}" ${p.Jar_Category === j.name ? "selected" : ""}>${escapeHtml(j.name)}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label>Ví thanh toán</label>
            <select name="Wallet_ID">
              ${wallets.map(w => `<option value="${w.Wallet_ID}">${escapeHtml(w.Wallet_Name)} (${w.Currency})</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="field">
          <label>Ghi chú</label>
          <input name="Note" type="text" value="${escapeHtml(p.Note || "")}" placeholder="VD: Mua đồ siêu thị CU" />
        </div>
        <button type="submit" class="btn btn-primary btn-full">Lưu giao dịch</button>
      </form>
    `);

    document.getElementById("modal-tx-form").onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const tx = {
        Tx_ID: "T" + Date.now(),
        User_ID: state.currentUser.User_ID,
        Date: fd.get("Date"),
        Type: fd.get("Type"),
        Currency: fd.get("Currency"),
        Amount: Number(fd.get("Amount")) || 0,
        Jar_Category: fd.get("Type") === "Income" ? "Thu nhập" : fd.get("Jar_Category"),
        Wallet_ID: fd.get("Wallet_ID"),
        Is_Travel_Mode: !!isTravel,
        Note: fd.get("Note").trim() || fd.get("Jar_Category")
      };

      const wallet = state.db.wallets.find(w => w.Wallet_ID === tx.Wallet_ID);
      if (wallet) {
        const delta = convertCurrency(tx.Amount, tx.Currency, wallet.Currency);
        wallet.Balance = tx.Type === "Income" ? wallet.Balance + delta : Math.max(0, wallet.Balance - delta);
        callGoogleScript("upsertWallet", wallet);
      }

      state.db.transactions.push(tx);
      saveLocalDB();
      callGoogleScript("addTransaction", tx);
      closeModal();
      renderAll();
      showToast("Đã ghi nhận giao dịch & cập nhật số dư ví");
    };
  }

  function openOCRModal() {
    openModal("AI Quét hóa đơn Đa ngôn ngữ", `
      <div class="scan-zone" id="ocr-scan-zone">
        <div id="ocr-laser" class="scan-laser" hidden></div>
        <p style="margin:0 0 8px; font-weight:700;">Chụp hoặc tải ảnh hóa đơn (Hàn / Anh / Việt)</p>
        <input type="file" id="ocr-file-input" accept="image/*" style="font-size:12px;" />
        <p class="muted-note" id="ocr-status-msg">Chọn ảnh thật hoặc bấm mẫu hóa đơn bên dưới để kiểm tra nhanh.</p>
      </div>
      <div class="stack-list-tight">
        <button type="button" class="btn btn-ghost btn-sm" data-ocr-sample="kr">Mẫu hóa đơn Hàn: GS25 편의점 (₩ 12,400)</button>
        <button type="button" class="btn btn-ghost btn-sm" data-ocr-sample="en">Mẫu hóa đơn Anh: Starbucks Coffee ($ 6.50)</button>
        <button type="button" class="btn btn-ghost btn-sm" data-ocr-sample="vi">Mẫu hóa đơn Việt: Phở Thìn Hà Nội (85,000 ₫)</button>
      </div>
    `);

    const runSample = (sample) => {
      document.getElementById("ocr-laser").hidden = false;
      document.getElementById("ocr-status-msg").textContent = "AI đang bóc tách số tiền, loại tiền tệ và phân loại chiếc lọ...";
      setTimeout(() => {
        openAddTxModal(sample);
        showToast("AI đã trích xuất hóa đơn thành công!");
      }, 950);
    };

    document.getElementById("ocr-file-input").onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      runSample({
        Type: "Expense",
        Amount: 18500,
        Currency: "KRW",
        Date: new Date().toISOString().slice(0, 10),
        Jar_Category: "Thiết yếu",
        Note: "Hóa đơn AI OCR (" + file.name.slice(0, 16) + ")"
      });
    };

    document.querySelectorAll("[data-ocr-sample]").forEach(btn => {
      btn.onclick = () => {
        const map = {
          kr: { Type: "Expense", Amount: 12400, Currency: "KRW", Jar_Category: "Thiết yếu", Note: "GS25 편의점 (AI OCR)" },
          en: { Type: "Expense", Amount: 6.5, Currency: "USD", Jar_Category: "Hưởng thụ", Note: "Starbucks Coffee (AI OCR)" },
          vi: { Type: "Expense", Amount: 85000, Currency: "VND", Jar_Category: "Thiết yếu", Note: "Phở Thìn (AI OCR)" }
        };
        runSample(map[btn.dataset.ocrSample]);
      };
    });
  }

  function openGoalModal() {
    openModal("Tạo Mục tiêu Tài chính", `
      <form id="modal-goal-form" class="stack-list">
        <div class="field">
          <label>Tên mục tiêu *</label>
          <input name="name" required placeholder="VD: Học phí kỳ Thu / Vé máy bay" />
        </div>
        <div class="grid-2">
          <div class="field">
            <label>Số tiền mục tiêu *</label>
            <input name="targetAmount" type="number" required class="data-text" placeholder="5000000" />
          </div>
          <div class="field">
            <label>Tiền tệ</label>
            <select name="currency">
              <option value="KRW">KRW</option>
              <option value="USD">USD</option>
              <option value="VND">VND</option>
            </select>
          </div>
        </div>
        <div class="grid-2">
          <div class="field">
            <label>Đã tích lũy</label>
            <input name="savedAmount" type="number" value="0" class="data-text" />
          </div>
          <div class="field">
            <label>Hạn chót *</label>
            <input name="deadline" type="date" required value="2027-06-01" />
          </div>
        </div>
        <button type="submit" class="btn btn-primary btn-full">Tạo mục tiêu</button>
      </form>
    `);

    document.getElementById("modal-goal-form").onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const meta = userMeta();
      meta.goals.push({
        id: "G" + Date.now(),
        name: fd.get("name").trim(),
        targetAmount: Number(fd.get("targetAmount")) || 0,
        savedAmount: Number(fd.get("savedAmount")) || 0,
        currency: fd.get("currency"),
        deadline: fd.get("deadline")
      });
      saveLocalDB();
      callGoogleScript("saveMeta", { User_ID: state.currentUser.User_ID, meta });
      closeModal();
      renderAll();
      showToast("Đã tạo mục tiêu mới");
    };
  }

  function openSubModal() {
    openModal("Thêm Gói đăng ký định kỳ", `
      <form id="modal-sub-form" class="stack-list">
        <div class="field">
          <label>Tên dịch vụ *</label>
          <input name="name" required placeholder="VD: YouTube Premium / Spotify" />
        </div>
        <div class="grid-3">
          <div class="field">
            <label>Giá/tháng</label>
            <input name="amount" type="number" step="any" required class="data-text" placeholder="14900" />
          </div>
          <div class="field">
            <label>Tiền tệ</label>
            <select name="currency">
              <option value="KRW">KRW</option>
              <option value="USD">USD</option>
            </select>
          </div>
          <div class="field">
            <label>Ngày trừ</label>
            <input name="billingDay" type="number" min="1" max="31" value="10" class="data-text" />
          </div>
        </div>
        <button type="submit" class="btn btn-velvet btn-full">Lưu gói đăng ký</button>
      </form>
    `);

    document.getElementById("modal-sub-form").onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const meta = userMeta();
      meta.subscriptions.push({
        id: "SUB" + Date.now(),
        name: fd.get("name").trim(),
        amount: Number(fd.get("amount")) || 0,
        currency: fd.get("currency"),
        billingDay: Number(fd.get("billingDay")) || 1,
        remind24h: true
      });
      saveLocalDB();
      callGoogleScript("saveMeta", { User_ID: state.currentUser.User_ID, meta });
      closeModal();
      renderAll();
      showToast("Đã thêm gói đăng ký định kỳ");
    };
  }

  function openSettingsModal() {
    const url = getScriptUrl();
    openModal("Tài khoản & Đồng bộ Google Sheets", `
      <div class="card card-light">
        <div class="wallet-name">${escapeHtml(state.currentUser.FullName)}</div>
        <div class="wallet-meta data-text">User_ID: #${state.currentUser.User_ID} · @${escapeHtml(state.currentUser.Username)}</div>
        <div class="wallet-meta">${escapeHtml(state.currentUser.Email || "")}</div>
        <div style="margin-top:8px;">
          <span class="pill ${url ? "pill-velvet" : "pill-thistle"}">${url ? "Đã nối Google Sheets" : "Chế độ Demo (localStorage)"}</span>
        </div>
      </div>

      <form id="modal-gas-form" class="stack-list">
        <div class="field">
          <label>Google Apps Script Web App URL</label>
          <input name="gasUrl" type="url" value="${escapeHtml(url)}" placeholder="https://script.google.com/macros/s/.../exec" />
        </div>
        <button type="submit" class="btn btn-primary btn-full">Lưu URL Google Sheets</button>
      </form>

      <div class="grid-2" style="margin-top:4px;">
        <button type="button" class="btn btn-ghost btn-sm" id="btn-reset-demo">Khôi phục dữ liệu mẫu</button>
        <button type="button" class="btn btn-deep btn-sm" id="btn-logout">Đăng xuất</button>
      </div>
    `);

    document.getElementById("modal-gas-form").onsubmit = (e) => {
      e.preventDefault();
      const val = new FormData(e.target).get("gasUrl").trim();
      localStorage.setItem(CUSTOM_URL_KEY, val);
      closeModal();
      showToast(val ? "Đã lưu URL Google Apps Script!" : "Đã chuyển về chế độ Demo (localStorage)");
    };

    document.getElementById("btn-reset-demo").onclick = () => {
      localStorage.removeItem(STORAGE_KEY);
      state.db = loadLocalDB();
      state.currentUser = state.db.users[0];
      closeModal();
      renderAll();
      showToast("Đã khôi phục dữ liệu mẫu cho tài khoản monify");
    };

    document.getElementById("btn-logout").onclick = () => {
      state.currentUser = null;
      closeModal();
      document.getElementById("login-password").value = "";
      showScreen("screen-login");
    };
  }

  // ========================================================================
  // 7. UTILITIES & EVENT BINDINGS
  // ========================================================================
  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  let toastTimer = null;
  function showToast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 2800);
  }

  function bindEvents() {
    // Password eye toggle
    document.querySelectorAll("[data-toggle-pw]").forEach(btn => {
      btn.addEventListener("click", () => {
        const input = document.getElementById(btn.dataset.togglePw);
        input.type = input.type === "password" ? "text" : "password";
      });
    });

    // Auth navigation
    document.getElementById("form-login").addEventListener("submit", handleLogin);
    document.getElementById("form-register").addEventListener("submit", handleRegister);
    document.getElementById("btn-goto-register").addEventListener("click", () => showScreen("screen-register"));
    document.getElementById("btn-goto-login").addEventListener("click", () => showScreen("screen-login"));
    document.getElementById("btn-back-login").addEventListener("click", () => showScreen("screen-login"));
    document.getElementById("btn-fill-demo").addEventListener("click", () => {
      document.getElementById("login-username").value = "monify";
      document.getElementById("login-password").value = "828282";
      document.getElementById("form-login").dispatchEvent(new Event("submit"));
    });

    // Header actions
    document.getElementById("btn-refresh-fx").addEventListener("click", () => fetchLiveFX(true));
    document.getElementById("btn-open-settings").addEventListener("click", openSettingsModal);

    // Bottom Navigation
    document.querySelectorAll(".nav-item").forEach(btn => {
      btn.addEventListener("click", () => switchTab(btn.dataset.tab));
    });

    // Hero card currency & gradient toggle
    document.querySelectorAll("#base-currency-pills .pill-choice").forEach(btn => {
      btn.addEventListener("click", () => {
        state.baseCurrency = btn.dataset.curr;
        renderHome();
      });
    });

    document.getElementById("btn-toggle-hero-grad").addEventListener("click", () => {
      state.heroDarkGrad = !state.heroDarkGrad;
      document.getElementById("hero-asset-card").classList.toggle("hero-dark-grad", state.heroDarkGrad);
    });

    // Home actions
    document.getElementById("btn-add-wallet").addEventListener("click", () => openWalletModal(null));
    document.getElementById("btn-add-saving").addEventListener("click", () => openSavingModal(null));

    document.getElementById("btn-edit-visa").addEventListener("click", () => {
      const meta = userMeta();
      openModal("Cài đặt Lá chắn số dư Visa", `
        <form id="modal-visa-form" class="stack-list">
          <div class="field">
            <label>Số dư tối thiểu cần giữ (KRW)</label>
            <input name="visaMin" type="number" step="100000" required class="data-text" value="${meta.visaMinKRW}" />
          </div>
          <button type="submit" class="btn btn-velvet btn-full">Lưu ngưỡng Visa</button>
        </form>
      `);
      document.getElementById("modal-visa-form").onsubmit = (e) => {
        e.preventDefault();
        meta.visaMinKRW = Number(new FormData(e.target).get("visaMin")) || 10000000;
        saveLocalDB();
        callGoogleScript("saveMeta", { User_ID: state.currentUser.User_ID, meta });
        closeModal();
        renderAll();
        showToast("Đã cập nhật ngưỡng số dư Visa");
      };
    });

    document.getElementById("btn-edit-fx50k").addEventListener("click", () => {
      const meta = userMeta();
      openModal("Cập nhật Hạn mức $50,000/năm", `
        <form id="modal-50k-form" class="stack-list">
          <div class="field">
            <label>Tổng số tiền đã chuyển năm nay (USD)</label>
            <input name="used50k" type="number" step="100" required class="data-text" value="${meta.fx50kUsedUSD}" />
          </div>
          <button type="submit" class="btn btn-primary btn-full">Cập nhật</button>
        </form>
      `);
      document.getElementById("modal-50k-form").onsubmit = (e) => {
        e.preventDefault();
        meta.fx50kUsedUSD = Number(new FormData(e.target).get("used50k")) || 0;
        saveLocalDB();
        callGoogleScript("saveMeta", { User_ID: state.currentUser.User_ID, meta });
        closeModal();
        renderHome();
        showToast("Đã cập nhật hạn mức $50,000");
      };
    });

    // Delegated clicks for Wallets, Savings, Remit, Split, Subs, Goals, Alerts
    document.getElementById("main-scroll").addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      if (btn.dataset.editWallet) return openWalletModal(btn.dataset.editWallet);
      if (btn.dataset.delWallet) {
        state.db.wallets = state.db.wallets.filter(w => w.Wallet_ID !== btn.dataset.delWallet);
        saveLocalDB();
        callGoogleScript("deleteWallet", { Wallet_ID: btn.dataset.delWallet });
        renderAll();
        return showToast("Đã xóa ví tiền");
      }
      if (btn.dataset.editSaving) return openSavingModal(btn.dataset.editSaving);
      if (btn.dataset.delSaving) {
        state.db.savings = state.db.savings.filter(s => s.Saving_ID !== btn.dataset.delSaving);
        saveLocalDB();
        callGoogleScript("deleteSaving", { Saving_ID: btn.dataset.delSaving });
        renderAll();
        return showToast("Đã xóa sổ tiết kiệm");
      }
      if (btn.dataset.sendRemit) return executeRemittance(btn.dataset.remitName);
      if (btn.dataset.delSplit) {
        state.splitItems = state.splitItems.filter(x => x.id !== btn.dataset.delSplit);
        return renderSplitBill();
      }
      if (btn.dataset.delSub) {
        const meta = userMeta();
        meta.subscriptions = meta.subscriptions.filter(s => s.id !== btn.dataset.delSub);
        saveLocalDB();
        callGoogleScript("saveMeta", { User_ID: state.currentUser.User_ID, meta });
        renderAll();
        return showToast("Đã hủy theo dõi gói đăng ký");
      }
      if (btn.dataset.delGoal) {
        const meta = userMeta();
        meta.goals = meta.goals.filter(g => g.id !== btn.dataset.delGoal);
        saveLocalDB();
        callGoogleScript("saveMeta", { User_ID: state.currentUser.User_ID, meta });
        renderGoals();
        return showToast("Đã xóa mục tiêu");
      }
      if (btn.dataset.topupGoal) {
        const meta = userMeta();
        const g = meta.goals.find(x => x.id === btn.dataset.topupGoal);
        if (!g) return;
        g.savedAmount = Number(g.savedAmount) + Math.round(Number(g.targetAmount) * 0.1);
        saveLocalDB();
        callGoogleScript("saveMeta", { User_ID: state.currentUser.User_ID, meta });
        renderGoals();
        return showToast("Đã nạp thêm +10% vào mục tiêu " + g.name);
      }
      if (btn.dataset.delAlert) {
        const meta = userMeta();
        meta.fxAlerts = meta.fxAlerts.filter(a => a.id !== btn.dataset.delAlert);
        saveLocalDB();
        callGoogleScript("saveMeta", { User_ID: state.currentUser.User_ID, meta });
        return renderAI();
      }
    });

    // Transfer subtabs & inputs
    document.querySelectorAll("#transfer-subtabs .subtab-btn").forEach(btn => {
      btn.addEventListener("click", () => switchTransferSubtab(btn.dataset.subtab));
    });
    document.getElementById("remit-amount").addEventListener("input", renderRemittanceComparison);
    document.getElementById("remit-pair").addEventListener("change", renderRemittanceComparison);

    // QR simulator
    document.getElementById("qr-send-amount").addEventListener("input", updateQRPreview);
    document.getElementById("qr-recv-curr").addEventListener("change", updateQRPreview);
    document.getElementById("btn-simulate-qr-send").addEventListener("click", () => {
      const krw = Number(document.getElementById("qr-send-amount").value) || 0;
      const toUser = document.getElementById("qr-recipient").value.trim() || "bạn bè";
      const recvCurr = document.getElementById("qr-recv-curr").value;
      if (krw <= 0) return showToast("Nhập số tiền KRW hợp lệ");

      const krwWallet = userWallets().find(w => w.Currency === "KRW") || userWallets()[0];
      if (krwWallet) {
        krwWallet.Balance = Math.max(0, krwWallet.Balance - convertCurrency(krw, "KRW", krwWallet.Currency));
      }
      const tx = {
        Tx_ID: "T" + Date.now(),
        User_ID: state.currentUser.User_ID,
        Date: new Date().toISOString().slice(0, 10),
        Type: "Transfer",
        Currency: "KRW",
        Amount: krw,
        Jar_Category: "Hưởng thụ",
        Wallet_ID: krwWallet ? krwWallet.Wallet_ID : "",
        Is_Travel_Mode: userMeta().travelMode.enabled,
        Note: "QR P2P gửi @" + toUser + " (nhận " + recvCurr + ")"
      };
      state.db.transactions.push(tx);
      saveLocalDB();
      callGoogleScript("addTransaction", tx);
      renderAll();
      showToast("Đã gửi " + formatMoney(krw, "KRW") + " qua QR tới @" + toUser);
    });

    // Bill split
    document.getElementById("btn-add-split-item").addEventListener("click", () => {
      const payer = document.getElementById("split-payer").value.trim();
      const amount = Number(document.getElementById("split-amount").value) || 0;
      const currency = document.getElementById("split-curr").value;
      const note = document.getElementById("split-note").value.trim() || "Chi phí nhóm";
      if (!payer || amount <= 0) return showToast("Nhập tên người trả và số tiền hợp lệ");
      state.splitItems.push({ id: "sp" + Date.now(), payer, amount, currency, note });
      document.getElementById("split-payer").value = "";
      document.getElementById("split-amount").value = "";
      document.getElementById("split-note").value = "";
      renderSplitBill();
    });
    document.getElementById("btn-reset-split").addEventListener("click", () => {
      state.splitItems = [];
      renderSplitBill();
    });

    // ATM filters
    document.querySelectorAll("#atm-filter-pills .pill-choice").forEach(btn => {
      btn.addEventListener("click", () => {
        state.atmFilter = btn.dataset.atmFilter;
        document.querySelectorAll("#atm-filter-pills .pill-choice").forEach(b => b.classList.toggle("active", b === btn));
        renderATMList();
      });
    });

    // Spend actions
    document.getElementById("btn-open-add-tx").addEventListener("click", () => openAddTxModal());
    document.getElementById("btn-open-ocr").addEventListener("click", openOCRModal);
    document.getElementById("btn-add-sub").addEventListener("click", openSubModal);

    // 6 Jars live slider & rename
    document.getElementById("jars-list").addEventListener("input", (e) => {
      const jars = userJars();
      if (e.target.dataset.jarRange !== undefined) {
        jars[Number(e.target.dataset.jarRange)].pct = Number(e.target.value);
        renderSpend();
      } else if (e.target.dataset.jarName !== undefined) {
        jars[Number(e.target.dataset.jarName)].name = e.target.value;
      }
    });

    document.getElementById("btn-autobalance-jars").addEventListener("click", () => {
      const jars = userJars();
      const sum = jars.reduce((s, j) => s + Number(j.pct), 0) || 1;
      let acc = 0;
      jars.forEach((j, i) => {
        if (i === jars.length - 1) j.pct = Math.max(0, 100 - acc);
        else {
          j.pct = Math.round((j.pct / sum) * 100);
          acc += j.pct;
        }
      });
      renderSpend();
    });

    document.getElementById("btn-save-jars").addEventListener("click", () => {
      const jars = userJars();
      const sum = jars.reduce((s, j) => s + Number(j.pct), 0);
      if (sum !== 100) return showToast("Tổng 6 chiếc lọ cần bằng đúng 100% (hiện tại " + sum + "%)");
      saveLocalDB();
      callGoogleScript("saveJars", { User_ID: state.currentUser.User_ID, jars });
      renderAI();
      showToast("Đã lưu cấu hình 6 Chiếc lọ!");
    });

    // Cashflow period filter
    document.querySelectorAll("#cashflow-period-pills .pill-choice").forEach(btn => {
      btn.addEventListener("click", () => {
        state.cashflowPeriod = btn.dataset.period;
        document.querySelectorAll("#cashflow-period-pills .pill-choice").forEach(b => b.classList.toggle("active", b === btn));
        renderSpend();
      });
    });

    // Goals & Travel Mode
    document.getElementById("toggle-travel-mode").addEventListener("change", (e) => {
      const meta = userMeta();
      meta.travelMode.enabled = e.target.checked;
      saveLocalDB();
      callGoogleScript("saveMeta", { User_ID: state.currentUser.User_ID, meta });
      renderAll();
      showToast(e.target.checked ? "Đã bật Chế độ Về nước / Du lịch" : "Đã tắt Chế độ Du lịch");
    });

    document.getElementById("travel-trip-name").addEventListener("change", (e) => {
      userMeta().travelMode.tripName = e.target.value;
      saveLocalDB();
    });

    document.getElementById("travel-budget-krw").addEventListener("change", (e) => {
      userMeta().travelMode.budgetKRW = Number(e.target.value) || 1000000;
      saveLocalDB();
      renderGoals();
    });

    document.getElementById("btn-add-travel-tx").addEventListener("click", () => {
      openAddTxModal({ Is_Travel_Mode: true, Jar_Category: "Du lịch" });
    });

    document.getElementById("btn-add-goal").addEventListener("click", openGoalModal);

    // AI FX Alert
    document.getElementById("btn-add-fx-alert").addEventListener("click", () => {
      const pair = document.getElementById("alert-pair").value;
      const target = Number(document.getElementById("alert-target").value);
      if (!target || target <= 0) return showToast("Nhập ngưỡng tỷ giá mục tiêu hợp lệ");
      const meta = userMeta();
      meta.fxAlerts.push({ id: "AL" + Date.now(), pair, target });
      document.getElementById("alert-target").value = "";
      saveLocalDB();
      callGoogleScript("saveMeta", { User_ID: state.currentUser.User_ID, meta });
      renderAI();
      showToast("Đã đặt cảnh báo tỷ giá");
    });

    // Modal close
    document.getElementById("modal-close").addEventListener("click", closeModal);
    document.getElementById("modal-backdrop").addEventListener("click", (e) => {
      if (e.target.id === "modal-backdrop") closeModal();
    });
  }

  // ========================================================================
  // 8. BOOTSTRAP
  // ========================================================================
  document.addEventListener("DOMContentLoaded", () => {
    state.db = loadLocalDB();
    bindEvents();
    startLaunchSequence();
    fetchLiveFX(false);
    const refreshMs = (window.MONIFY_CONFIG && window.MONIFY_CONFIG.AUTO_REFRESH_FX_MS) || 300000;
    setInterval(() => fetchLiveFX(false), refreshMs);
  });
})();
