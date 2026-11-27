/* ==========================================================================
   MONIFY — MY FINANCE MANAGER (FULL CLIENT LOGIC + GOOGLE SHEETS SYNC)
   ========================================================================== */

const GAS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycby5nM7sVrqWe0Pojnjo7rf-XvdNMZwu-nFm-41LdSLwSrYfgyfUj4ILZ9Jn2djIrrbD/exec";

// 6-Language Dictionary (EN default, KO, RU, VI, BE, UZ)
const I18N = {
  en: {
    login_title: "Welcome back",
    login_subtitle: "Sign in to sync your multi-currency wallets & Google Sheets ledger.",
    username: "Username",
    password: "Password",
    login_btn: "Sign In",
    no_account: "Don't have an account?",
    register_now: "Register now",
    back: "Back",
    register_title: "Create Account",
    register_subtitle: "Auto-assigns a sequential User_ID synced directly to Google Sheets.",
    fullname: "Full Name",
    dob: "Date of Birth",
    email: "Email Address",
    register_btn: "Create & Sync Account",
    edit_account: "Edit Account",
    language: "Language (6 Languages)",
    sync_now: "Sync Google Sheets & FX",
    logout: "Log Out",
    total_net_worth: "TOTAL NET WORTH (STABLECOIN-INDEXED)",
    log_tx: "Add Expense / Income",
    add_wallet: "Add Wallet",
    my_wallets: "Multi-Currency Wallets",
    bank_savings: "Bank Savings & Deposits",
    visa_guard: "Visa Balance Guard",
    fx_radar: "FX $50,000 Limit & Tax Radar",
    transfer_hub: "Cross-Border & Split",
    spend_budget: "6 Jars & Cashflow",
    goals_travel: "Goals & Travel Mode",
    ai_assistant: "Monify AI Advisor",
    nav_home: "Home",
    nav_transfer: "Transfer",
    nav_spend: "Spend",
    nav_goals: "Goals",
    nav_ai: "AI",
    ai_disclaimer: "* Disclaimer: Analysis and alerts are for informational reference only based on historical data and user-defined thresholds, and do not guarantee future exchange rate accuracy or legal compliance."
  },
  ko: {
    login_title: "다시 오신 것을 환영합니다",
    login_subtitle: "다통화 지갑 및 Google Sheets 원장을 동기화하려면 로그인하세요.",
    username: "아이디 (Username)",
    password: "비밀번호",
    login_btn: "로그인",
    no_account: "계정이 없으신가요?",
    register_now: "지금 회원가입",
    back: "뒤로",
    register_title: "계정 만들기",
    register_subtitle: "고유 User_ID가 자동 부여되며 Google Sheets에 즉시 저장됩니다.",
    fullname: "성명",
    dob: "생년월일",
    email: "이메일 주소",
    register_btn: "가입 및 동기화",
    edit_account: "계정 정보 수정",
    language: "언어 설정 (6개국어)",
    sync_now: "Google Sheets & 환율 동기화",
    logout: "로그아웃",
    total_net_worth: "총 순자산 (스테이블코인 기준 환산)",
    log_tx: "지출 / 수입 입력",
    add_wallet: "지갑 추가",
    my_wallets: "다통화 지갑 목록",
    bank_savings: "은행 예·적금 관리",
    visa_guard: "비자 잔고 보호 가드",
    fx_radar: "연 $50,000 송금 한도 & 세무 레이더",
    transfer_hub: "해외송금 & 더치페이",
    spend_budget: "6개의 통장 & 현금흐름",
    goals_travel: "목표 저축 & 여행 모드",
    ai_assistant: "Monify AI 금융 비서",
    nav_home: "홈",
    nav_transfer: "송금",
    nav_spend: "소비",
    nav_goals: "목표",
    nav_ai: "AI 비서",
    ai_disclaimer: "* 안내: AI 분석 및 알림은 과거 데이터와 사용자 설정 기준에 따른 참고용이며, 미래 환율의 정확한 예측이나 법적 요건 충족을 보장하지 않습니다."
  },
  vi: {
    login_title: "Chào mừng trở lại",
    login_subtitle: "Đăng nhập để đồng bộ ví đa tiền tệ và dữ liệu Google Sheets.",
    username: "Tên đăng nhập",
    password: "Mật khẩu",
    login_btn: "Đăng nhập",
    no_account: "Chưa có tài khoản?",
    register_now: "Đăng ký ngay",
    back: "Quay lại",
    register_title: "Đăng ký tài khoản",
    register_subtitle: "Tự động cấp User_ID định danh riêng và đồng bộ lên Google Sheets.",
    fullname: "Họ và tên",
    dob: "Ngày tháng năm sinh",
    email: "Địa chỉ Email",
    register_btn: "Đăng ký & Đồng bộ",
    edit_account: "Chỉnh sửa tài khoản",
    language: "Ngôn ngữ (6 ngôn ngữ)",
    sync_now: "Đồng bộ Sheets & Tỷ giá",
    logout: "Đăng xuất",
    total_net_worth: "TỔNG TÀI SẢN RÒNG (NEO STABLECOIN)",
    log_tx: "Ghi Thu / Chi",
    add_wallet: "Thêm ví",
    my_wallets: "Ví tiền đa quốc gia",
    bank_savings: "Ngân hàng & Sổ tiết kiệm",
    visa_guard: "Lá chắn số dư Visa",
    fx_radar: "Radar Hạn mức $50,000 & Thuế",
    transfer_hub: "Chuyển tiền & Chia bill",
    spend_budget: "6 Chiếc lọ & Dòng tiền",
    goals_travel: "Mục tiêu & Chế độ Du lịch",
    ai_assistant: "Trợ lý Tài chính AI",
    nav_home: "Trang chủ",
    nav_transfer: "Chuyển tiền",
    nav_spend: "Chi tiêu",
    nav_goals: "Mục tiêu",
    nav_ai: "Trợ lý AI",
    ai_disclaimer: "* Lưu ý: Phân tích chỉ mang tính tham khảo dựa trên dữ liệu lịch sử, không cam kết dự đoán chính xác tỷ giá tương lai."
  },
  ru: {
    login_title: "С возвращением",
    login_subtitle: "Войдите для синхронизации мультивалютных кошельков и Google Sheets.",
    username: "Логин",
    password: "Пароль",
    login_btn: "Войти",
    no_account: "Нет аккаунта?",
    register_now: "Регистрация",
    back: "Назад",
    register_title: "Создать аккаунт",
    register_subtitle: "Автоматическое присвоение User_ID в Google Sheets.",
    fullname: "ФИО",
    dob: "Дата рождения",
    email: "Электронная почта",
    register_btn: "Создать аккаунт",
    edit_account: "Редактировать профиль",
    language: "Язык (6 языков)",
    sync_now: "Синхронизация Sheets и курсов",
    logout: "Выйти",
    total_net_worth: "ОБЩИЙ КАПИТАЛ (ИНДЕКС STABLECOIN)",
    log_tx: "Добавить операцию",
    add_wallet: "Добавить кошелек",
    my_wallets: "Мультивалютные кошельки",
    bank_savings: "Вклады и сбережения",
    visa_guard: "Защита баланса для визы",
    fx_radar: "Лимит $50,000 и налоговый радар",
    transfer_hub: "Переводы и разделение счета",
    spend_budget: "6 кувшинов и аналитика",
    goals_travel: "Цели и режим путешествий",
    ai_assistant: "AI Финансовый помощник",
    nav_home: "Главная",
    nav_transfer: "Перевод",
    nav_spend: "Расходы",
    nav_goals: "Цели",
    nav_ai: "AI",
    ai_disclaimer: "* Примечание: Аналитика носит справочный характер и не гарантирует точный прогноз будущих курсов валют."
  },
  be: {
    login_title: "Сардэчна запрашаем",
    login_subtitle: "Увайдзіце для сінхранізацыі мультывалютных кашалькоў і Google Sheets.",
    username: "Імя карыстальніка",
    password: "Пароль",
    login_btn: "Увайсці",
    no_account: "Няма акаўнта?",
    register_now: "Зарэгістравацца",
    back: "Назад",
    register_title: "Стварыць акаўнт",
    register_subtitle: "Аўтаматычнае прысваенне User_ID у Google Sheets.",
    fullname: "Поўнае імя",
    dob: "Дата нараджэння",
    email: "Адрас электроннай пошты",
    register_btn: "Стварыць акаўнт",
    edit_account: "Рэдагаваць профіль",
    language: "Мова (6 моў)",
    sync_now: "Сінхранізаваць Sheets і курсы",
    logout: "Выйсці",
    total_net_worth: "АГУЛЬНЫ КАПІТАЛ (STABLECOIN)",
    log_tx: "Дадаць аперацыю",
    add_wallet: "Дадаць кашалёк",
    my_wallets: "Мультывалютныя кашалькі",
    bank_savings: "Банкаўскія ўклады",
    visa_guard: "Абарона балансу для візы",
    fx_radar: "Ліміт $50,000 і падатковы радар",
    transfer_hub: "Пераводы і падзел рахунку",
    spend_budget: "6 збаноў і аналітыка",
    goals_travel: "Мэты і рэжым падарожжаў",
    ai_assistant: "AI Фінансавы памочнік",
    nav_home: "Галоўная",
    nav_transfer: "Перавод",
    nav_spend: "Выдаткі",
    nav_goals: "Мэты",
    nav_ai: "AI",
    ai_disclaimer: "* Заўвага: Аналітыка носіць даведачны характар і не гарантуе дакладны прагноз будучых курсаў валют."
  },
  uz: {
    login_title: "Xush kelibsiz",
    login_subtitle: "Ko'p valyutali hamyonlar va Google Sheets ma'lumotlarini sinxronlash uchun kiring.",
    username: "Foydalanuvchi nomi",
    password: "Parol",
    login_btn: "Kirish",
    no_account: "Hisobingiz yo'qmi?",
    register_now: "Ro'yxatdan o'tish",
    back: "Orqaga",
    register_title: "Hisob yaratish",
    register_subtitle: "Google Sheets-ga ulangan noyob User_ID avtomatik beriladi.",
    fullname: "To'liq ism",
    dob: "Tug'ilgan sana",
    email: "Elektron pochta",
    register_btn: "Yaratish va sinxronlash",
    edit_account: "Profilni tahrirlash",
    language: "Til (6 ta til)",
    sync_now: "Sheets va kurslarni yangilash",
    logout: "Chiqish",
    total_net_worth: "UMUMIY SOF AKTIVLAR (STABLECOIN)",
    log_tx: "Xarajat / Daromad",
    add_wallet: "Hamyon qo'shish",
    my_wallets: "Ko'p valyutali hamyonlar",
    bank_savings: "Bank omonatlari",
    visa_guard: "Viza balansi himoyasi",
    fx_radar: "$50,000 limit va soliq radari",
    transfer_hub: "Pul o'tkazish va bo'lishish",
    spend_budget: "6 ko'za byudjeti va tahlil",
    goals_travel: "Maqsadlar va sayohat rejimi",
    ai_assistant: "Monify AI Yordamchi",
    nav_home: "Asosiy",
    nav_transfer: "O'tkazma",
    nav_spend: "Xarajat",
    nav_goals: "Maqsad",
    nav_ai: "AI",
    ai_disclaimer: "* Eslatma: AI tahlili faqat tarixiy ma'lumotlarga asoslangan ma'lumot uchun beriladi va kelajakdagi valyuta kurslarini kafolatlamaydi."
  }
};

// Fallback FX rates anchored to 1 USD = 1 USDT
const DEFAULT_FX = {
  USD: 1,
  USDT: 1,
  KRW: 1380,
  VND: 25420,
  RUB: 92.5,
  UZS: 12850
};

// Seed Data for Account: monify / 828282 / User_ID = 1
function createSeedUserRecord() {
  return {
    user: {
      User_ID: 1,
      Username: "monify",
      FullName: "Monify Demo User",
      DOB: "2000-05-15",
      Password: "828282",
      Email: "demo@monify.app",
      CreatedAt: "2026-01-01"
    },
    wallets: [
      { Wallet_ID: "W1", User_ID: 1, Wallet_Name: "Toss Bank", Type: "Bank", Country: "South Korea", Currency: "KRW", Balance: 1000000 },
      { Wallet_ID: "W2", User_ID: 1, Wallet_Name: "Vietnam Bank", Type: "Bank", Country: "Vietnam", Currency: "VND", Balance: 3000000 },
      { Wallet_ID: "W3", User_ID: 1, Wallet_Name: "USD Cash", Type: "Cash", Country: "International", Currency: "USD", Balance: 1000 },
      { Wallet_ID: "W4", User_ID: 1, Wallet_Name: "Vietnam Cash", Type: "Cash", Country: "Vietnam", Currency: "VND", Balance: 7000000 },
      { Wallet_ID: "W5", User_ID: 1, Wallet_Name: "Korea Cash", Type: "Cash", Country: "South Korea", Currency: "KRW", Balance: 300000 }
    ],
    savings: [
      {
        Saving_ID: "S1",
        User_ID: 1,
        Bank_Name: "Korea Term Deposit (정기예금)",
        Country: "South Korea",
        Currency: "KRW",
        Principal_Amount: 10000000,
        Start_Date: "2025-06-03",
        Maturity_Date: "2026-06-03",
        Interest_Rate: 3.0
      },
      {
        Saving_ID: "S2",
        User_ID: 1,
        Bank_Name: "Vietnam Savings Account",
        Country: "Vietnam",
        Currency: "VND",
        Principal_Amount: 200000000,
        Start_Date: "2025-09-01",
        Maturity_Date: "2026-09-01",
        Interest_Rate: 5.2
      }
    ],
    jars: [
      { name: "Necessities (Thiết yếu)", pct: 50, spentKrw: 820000 },
      { name: "Education / Tuition", pct: 15, spentKrw: 250000 },
      { name: "Long-Term Savings", pct: 10, spentKrw: 0 },
      { name: "Play / Dining", pct: 10, spentKrw: 310000 },
      { name: "Investment / USDT", pct: 10, spentKrw: 200000 },
      { name: "Family Remittance", pct: 5, spentKrw: 310000 }
    ],
    transactions: [
      { Tx_ID: "T1", User_ID: 1, Date: "2026-11-24", Type: "Expense", Currency: "KRW", Amount: 14500, Jar_Category: "Necessities (Thiết yếu)", Wallet_ID: "W1", Is_Travel_Mode: false, Note: "CU Convenience Store" },
      { Tx_ID: "T2", User_ID: 1, Date: "2026-11-22", Type: "Income", Currency: "KRW", Amount: 1200000, Jar_Category: "Necessities (Thiết yếu)", Wallet_ID: "W1", Is_Travel_Mode: false, Note: "Part-time Research Stipend" },
      { Tx_ID: "T3", User_ID: 1, Date: "2026-11-20", Type: "Expense", Currency: "USD", Amount: 20, Jar_Category: "Play / Dining", Wallet_ID: "W3", Is_Travel_Mode: false, Note: "ChatGPT Plus" }
    ],
    goals_subs: {
      visaMinKrw: 10000000,
      fxUsedUsd: 17200,
      travelMode: false,
      travelExpenses: [
        { item: "ICN–HAN Flight Ticket", amountUsd: 240 },
        { item: "Airport Express & Sim", amountUsd: 80 }
      ],
      goals: [
        { id: "G1", title: "Spring Semester Tuition", target: 4500000, saved: 2800000, currency: "KRW", deadline: "2027-02-20" },
        { id: "G2", title: "Seoul Housing Deposit (보증금)", target: 10000, saved: 4200, currency: "USD", deadline: "2027-08-01" }
      ],
      subscriptions: [
        { id: "SUB1", name: "Coupang Wow Membership", amount: 7890, currency: "KRW", nextDate: "Tomorrow (24h alert!)" },
        { id: "SUB2", name: "ChatGPT Plus", amount: 20, currency: "USD", nextDate: "2026-12-05" },
        { id: "SUB3", name: "Netflix Standard", amount: 13500, currency: "KRW", nextDate: "2026-12-12" },
        { id: "SUB4", name: "iCloud+ 200GB", amount: 2.99, currency: "USD", nextDate: "2026-12-18" }
      ],
      splitBills: [
        { id: "SP1", payer: "Yumi", item: "Hongdae Korean BBQ", amount: 96000, currency: "KRW" },
        { id: "SP2", payer: "Dasha", item: "KTX Tickets", amount: 85, currency: "USD" },
        { id: "SP3", payer: "Madina", item: "Cafe & Dessert", amount: 34000, currency: "KRW" }
      ],
      rateAlerts: [
        { id: "RA1", pair: "KRW_VND", target: 18.50, active: true },
        { id: "RA2", pair: "USD_KRW", target: 1365, active: true }
      ]
    }
  };
}

// Global App State
let state = {
  lang: localStorage.getItem("monify_lang") || "en",
  baseCurrency: "KRW",
  fxRates: JSON.parse(localStorage.getItem("monify_fx")) || { ...DEFAULT_FX },
  currentUserId: null,
  db: JSON.parse(localStorage.getItem("monify_db_v1")) || {
    nextUserId: 2,
    records: {
      1: createSeedUserRecord()
    }
  },
  leafletMap: null
};

function saveLocalDB() {
  localStorage.setItem("monify_db_v1", JSON.stringify(state.db));
}

function getCurrentRecord() {
  return state.db.records[state.currentUserId];
}

function showToast(msg) {
  const el = document.getElementById("toast-banner");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2600);
}

// Currency Conversion via USDT Bridge
function toUSD(amount, currency) {
  if (currency === "USD" || currency === "USDT") return Number(amount);
  const rate = state.fxRates[currency] || DEFAULT_FX[currency] || 1;
  return Number(amount) / rate;
}

function fromUSD(usdAmount, targetCurrency) {
  if (targetCurrency === "USD" || targetCurrency === "USDT") return usdAmount;
  const rate = state.fxRates[targetCurrency] || DEFAULT_FX[targetCurrency] || 1;
  return usdAmount * rate;
}

function convertCurrency(amount, fromCurr, toCurr) {
  if (fromCurr === toCurr) return Number(amount);
  const usd = toUSD(amount, fromCurr);
  return fromUSD(usd, toCurr);
}

function formatMoney(amount, currency) {
  const num = Number(amount) || 0;
  if (currency === "KRW") return `₩ ${Math.round(num).toLocaleString("en-US")}`;
  if (currency === "VND") return `${Math.round(num).toLocaleString("en-US")} ₫`;
  if (currency === "USD") return `$ ${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (currency === "USDT") return `${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT`;
  if (currency === "RUB") return `₽ ${num.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  return `${num.toLocaleString("en-US")} ${currency}`;
}

// Fetch Live FX & CoinGecko Stablecoin Rates
async function fetchLiveRates(silent = false) {
  try {
    const [erRes, cgRes] = await Promise.allSettled([
      fetch("https://open.er-api.com/v6/latest/USD"),
      fetch("https://api.coingecko.com/api/v3/simple/price?ids=tether,usd-coin&vs_currencies=usd,krw,vnd")
    ]);

    if (erRes.status === "fulfilled" && erRes.value.ok) {
      const erData = await erRes.value.json();
      if (erData && erData.rates) {
        state.fxRates.KRW = erData.rates.KRW || state.fxRates.KRW;
        state.fxRates.VND = erData.rates.VND || state.fxRates.VND;
        state.fxRates.RUB = erData.rates.RUB || state.fxRates.RUB;
        state.fxRates.UZS = erData.rates.UZS || state.fxRates.UZS;
      }
    }

    if (cgRes.status === "fulfilled" && cgRes.value.ok) {
      const cgData = await cgRes.value.json();
      if (cgData && cgData.tether && cgData.tether.krw) {
        state.fxRates.USDT_KRW = cgData.tether.krw;
      }
    }

    localStorage.setItem("monify_fx", JSON.stringify(state.fxRates));
    if (!silent) showToast("Live FX & USDT rates updated!");
    if (state.currentUserId) renderAll();
  } catch (e) {
    if (!silent) showToast("Using cached offline FX rates.");
  }
}

// Sync with Google Sheets Apps Script Web App URL
async function syncWithGoogleSheets(action, payload = {}) {
  const badge = document.getElementById("sync-badge");
  if (badge) badge.textContent = "↻ Syncing...";
  try {
    const response = await fetch(GAS_WEBAPP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action, ...payload })
    });
    if (badge) badge.textContent = "● Sheets Synced";
    return true;
  } catch (err) {
    if (badge) badge.textContent = "● Local Fallback";
    return false;
  }
}

// Also support GET query check from Google Sheets when logging in
async function fetchUserFromGoogleSheets(username, password) {
  try {
    const url = `${GAS_WEBAPP_URL}?action=login&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.status === "success" && data.user) {
      return data;
    }
  } catch (e) {
    return null;
  }
  return null;
}

// Language Translation Applier
function applyLanguage(lang) {
  state.lang = lang;
  localStorage.setItem("monify_lang", lang);
  const dict = I18N[lang] || I18N.en;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });

  const authSelect = document.getElementById("auth-lang-select");
  if (authSelect) authSelect.value = lang;

  document.querySelectorAll(".lang-chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.lang === lang);
  });
}

// Screen Switcher
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
}

// ==================== INITIALIZATION & AUTH ====================
document.addEventListener("DOMContentLoaded", () => {
  applyLanguage(state.lang);
  fetchLiveRates(true);

  // 1. Launch Screen (2 seconds -> Login Screen)
  setTimeout(() => {
    showScreen("login-screen");
  }, 2000);

  // Language switcher on Login
  document.getElementById("auth-lang-select").addEventListener("change", (e) => {
    applyLanguage(e.target.value);
  });

  // Password visibility toggles
  document.getElementById("toggle-login-pw").addEventListener("click", () => {
    const inp = document.getElementById("login-password");
    inp.type = inp.type === "password" ? "text" : "password";
  });

  document.getElementById("toggle-reg-pw").addEventListener("click", () => {
    const inp = document.getElementById("reg-password");
    inp.type = inp.type === "password" ? "text" : "password";
  });

  // Quick-fill demo credentials
  document.getElementById("quick-fill-demo").addEventListener("click", () => {
    document.getElementById("login-username").value = "monify";
    document.getElementById("login-password").value = "828282";
  });

  // Navigation between Login & Register
  document.getElementById("go-register-btn").addEventListener("click", () => {
    document.getElementById("login-error").style.display = "none";
    showScreen("register-screen");
  });

  document.getElementById("back-to-login-btn").addEventListener("click", () => {
    document.getElementById("register-error").style.display = "none";
    showScreen("login-screen");
  });

  // LOGIN HANDLER
  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const uname = document.getElementById("login-username").value.trim();
    const pw = document.getElementById("login-password").value.trim();
    const errEl = document.getElementById("login-error");
    const btn = document.getElementById("login-submit-btn");

    btn.textContent = "Verifying...";
    errEl.style.display = "none";

    // 1. Check local database first (includes seeded monify / 828282)
    let matchedId = null;
    for (const id of Object.keys(state.db.records)) {
      const u = state.db.records[id].user;
      if (u.Username.toLowerCase() === uname.toLowerCase() && String(u.Password) === pw) {
        matchedId = Number(id);
        break;
      }
    }

    // 2. Also attempt remote Google Sheets lookup if not found locally
    if (!matchedId) {
      const remoteData = await fetchUserFromGoogleSheets(uname, pw);
      if (remoteData && remoteData.user) {
        const uid = Number(remoteData.user.User_ID) || state.db.nextUserId++;
        state.db.records[uid] = {
          user: remoteData.user,
          wallets: remoteData.wallets || [],
          savings: remoteData.savings || [],
          jars: remoteData.jars || createSeedUserRecord().jars,
          transactions: remoteData.transactions || [],
          goals_subs: remoteData.goals_subs || createSeedUserRecord().goals_subs
        };
        saveLocalDB();
        matchedId = uid;
      }
    }

    btn.textContent = I18N[state.lang]?.login_btn || "Sign In";

    if (matchedId) {
      state.currentUserId = matchedId;
      enterMainApp();
    } else {
      errEl.textContent = "Invalid Username or Password. Try demo: monify / 828282";
      errEl.style.display = "block";
    }
  });

  // REGISTER HANDLER (5 required fields + Auto-increment User_ID)
  document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("reg-username").value.trim();
    const fullName = document.getElementById("reg-fullname").value.trim();
    const dob = document.getElementById("reg-dob").value;
    const password = document.getElementById("reg-password").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const errEl = document.getElementById("register-error");

    // Check duplicate username
    for (const id of Object.keys(state.db.records)) {
      if (state.db.records[id].user.Username.toLowerCase() === username.toLowerCase()) {
        errEl.textContent = "Username already exists. Please choose another.";
        errEl.style.display = "block";
        return;
      }
    }

    const newUserId = state.db.nextUserId++;
    const newUserObj = {
      User_ID: newUserId,
      Username: username,
      FullName: fullName,
      DOB: dob,
      Password: password,
      Email: email,
      CreatedAt: new Date().toISOString().split("T")[0]
    };

    const seedTemplate = createSeedUserRecord();
    state.db.records[newUserId] = {
      user: newUserObj,
      wallets: [
        { Wallet_ID: `W_${newUserId}_1`, User_ID: newUserId, Wallet_Name: "Primary KRW Bank", Type: "Bank", Country: "South Korea", Currency: "KRW", Balance: 500000 }
      ],
      savings: [],
      jars: seedTemplate.jars.map(j => ({ ...j, spentKrw: 0 })),
      transactions: [],
      goals_subs: {
        visaMinKrw: 10000000,
        fxUsedUsd: 0,
        travelMode: false,
        travelExpenses: [],
        goals: [],
        subscriptions: [],
        splitBills: [],
        rateAlerts: [{ id: "RA1", pair: "USD_KRW", target: 1370, active: true }]
      }
    };

    saveLocalDB();
    state.currentUserId = newUserId;

    // Push new user to Google Sheets
    await syncWithGoogleSheets("register", { user: newUserObj });
    showToast(`Registered! Assigned User_ID #${newUserId}`);
    enterMainApp();
  });

  bindMainAppEvents();
});

function enterMainApp() {
  showScreen("main-app");
  renderAll();
}

// ==================== RENDER ALL VIEWS ====================
function renderAll() {
  const rec = getCurrentRecord();
  if (!rec) return;

  // Update Dropdown User Info
  document.getElementById("menu-user-fullname").textContent = rec.user.FullName;
  document.getElementById("menu-user-meta").textContent = `User_ID: #${rec.user.User_ID} · @${rec.user.Username}`;

  renderHomeTab();
  renderTransferTab();
  renderSpendTab();
  renderGoalsTab();
  renderAiTab();
}

// ==================== TAB 1: HOME ====================
function renderHomeTab() {
  const rec = getCurrentRecord();
  const base = state.baseCurrency;

  // Calculate Wallets Sum & Savings Sum in Base Currency
  let walletsUsd = 0;
  rec.wallets.forEach((w) => {
    walletsUsd += toUSD(w.Balance, w.Currency);
  });

  let savingsUsd = 0;
  rec.savings.forEach((s) => {
    savingsUsd += toUSD(s.Principal_Amount, s.Currency);
  });

  const totalUsd = walletsUsd + savingsUsd;
  const totalBase = fromUSD(totalUsd, base);
  const walletsBase = fromUSD(walletsUsd, base);
  const savingsBase = fromUSD(savingsUsd, base);

  document.getElementById("total-asset-display").textContent = formatMoney(totalBase, base);
  const usdtKrw = Math.round(state.fxRates.USDT_KRW || state.fxRates.KRW);
  document.getElementById("stablecoin-equiv-display").textContent =
    `≈ ${totalUsd.toLocaleString("en-US", { maximumFractionDigits: 2 })} USDT (1 USDT = ₩${usdtKrw.toLocaleString()})`;

  document.getElementById("liquid-sum-pill").textContent = `Wallets: ${formatMoney(walletsBase, base)}`;
  document.getElementById("savings-sum-pill").textContent = `Savings: ${formatMoney(savingsBase, base)}`;

  // Wallet Counter & Max 6 Lock
  const count = rec.wallets.length;
  document.getElementById("wallet-count-badge").textContent = `${count}/6`;
  document.getElementById("wallet-slot-text").textContent = `${count} / 6 Slots Used`;
  const addWalletBtn = document.getElementById("open-add-wallet-btn");
  addWalletBtn.disabled = count >= 6;

  // Render Wallets List (Strictly separated currencies)
  const wList = document.getElementById("wallets-list");
  wList.innerHTML = "";
  rec.wallets.forEach((w) => {
    const card = document.createElement("div");
    card.className = "wallet-item-card";
    card.innerHTML = `
      <div class="wallet-left">
        <span class="wallet-title">${w.Wallet_Name}</span>
        <span class="wallet-meta">${w.Type} · ${w.Country} · <strong>${w.Currency}</strong></span>
      </div>
      <div class="wallet-right">
        <span class="wallet-balance num-font">${formatMoney(w.Balance, w.Currency)}</span>
        <div class="wallet-actions">
          <button type="button" class="tiny-btn" onclick="openEditWallet('${w.Wallet_ID}')">Edit</button>
          <button type="button" class="tiny-btn" onclick="deleteWallet('${w.Wallet_ID}')">Del</button>
        </div>
      </div>
    `;
    wList.appendChild(card);
  });

  // Render Savings List with D-Day Countdown
  const sList = document.getElementById("savings-list");
  sList.innerHTML = "";
  const today = new Date("2026-11-28");
  rec.savings.forEach((s) => {
    const matDate = new Date(s.Maturity_Date);
    const diffDays = Math.ceil((matDate - today) / (1000 * 60 * 60 * 24));
    const dDayText = diffDays >= 0 ? `D-${diffDays}` : `Matured (+${Math.abs(diffDays)}d)`;
    const estInterest = s.Principal_Amount * (s.Interest_Rate / 100);

    const card = document.createElement("div");
    card.className = "wallet-item-card";
    card.innerHTML = `
      <div class="wallet-left">
        <span class="wallet-title">${s.Bank_Name}</span>
        <span class="wallet-meta num-font">${s.Start_Date} → ${s.Maturity_Date} (${dDayText})</span>
        <span class="wallet-meta num-font">Rate: ${s.Interest_Rate}%/yr · Est. +${formatMoney(estInterest, s.Currency)}</span>
      </div>
      <div class="wallet-right">
        <span class="wallet-balance num-font">${formatMoney(s.Principal_Amount, s.Currency)}</span>
        <button type="button" class="tiny-btn" onclick="openEditSaving('${s.Saving_ID}')">Edit Dates/Rate</button>
      </div>
    `;
    sList.appendChild(card);
  });

  // Render Visa Balance Guard
  const visaMin = rec.goals_subs.visaMinKrw || 10000000;
  const totalKrw = fromUSD(totalUsd, "KRW");
  const ratioPct = Math.min(100, Math.round((totalKrw / (visaMin * 1.5)) * 100));

  document.getElementById("visa-min-display").textContent = formatMoney(visaMin, "KRW");
  document.getElementById("visa-avail-display").textContent = formatMoney(totalKrw, "KRW");
  document.getElementById("visa-progress-bar").style.width = `${ratioPct}%`;

  const visaBanner = document.getElementById("visa-alert-banner");
  const diffKrw = totalKrw - visaMin;
  if (diffKrw >= 0) {
    visaBanner.className = "alert-strip safe num-font";
    visaBanner.textContent = `✓ Safe: Above Visa minimum threshold by ${formatMoney(diffKrw, "KRW")}`;
  } else {
    visaBanner.className = "alert-strip danger num-font";
    visaBanner.textContent = `⚠ WARNING: Below Visa minimum by ${formatMoney(Math.abs(diffKrw), "KRW")}!`;
  }

  // Render FX $50,000 Annual Limit
  const usedUsd = rec.goals_subs.fxUsedUsd || 0;
  const remUsd = Math.max(0, 50000 - usedUsd);
  const fxPct = Math.min(100, Math.round((usedUsd / 50000) * 100));
  document.getElementById("fx-limit-bar").style.width = `${fxPct}%`;
  document.getElementById("fx-used-display").textContent = `$${usedUsd.toLocaleString()}`;
  document.getElementById("fx-rem-display").textContent = `$${remUsd.toLocaleString()} / $50,000`;

  // Travel mode chip
  document.getElementById("travel-mode-quick-badge").style.display = rec.goals_subs.travelMode ? "inline-block" : "none";
}

// ==================== TAB 2: TRANSFER ====================
function renderTransferTab() {
  const rec = getCurrentRecord();
  renderRemittanceComparison();

  // Personal QR Code
  document.getElementById("qr-owner-name").textContent = `@${rec.user.Username} (User_ID #${rec.user.User_ID})`;
  const qrCanvas = document.getElementById("my-qr-canvas");
  if (window.QRCode && qrCanvas) {
    QRCode.toCanvas(qrCanvas, `monify://pay?user=${rec.user.Username}&id=${rec.user.User_ID}`, {
      width: 170,
      margin: 1,
      color: { dark: "#150811", light: "#FAF9F8" }
    });
  }

  updateQrConversionPreview();
  renderSplitBill();
  renderAtmList();
}

function renderRemittanceComparison() {
  const amount = Number(document.getElementById("remit-send-amount").value) || 0;
  const fromCurr = document.getElementById("remit-from-curr").value;
  const toCurr = document.getElementById("remit-to-curr").value;

  const baseReceived = convertCurrency(amount, fromCurr, toCurr);

  const providers = [
    { name: "Monify Stablecoin Bridge (USDT/USDC)", feePct: 0.0015, speed: "Instant (2 min)", best: true },
    { name: "SentBe (Licensed Partner API)", feePct: 0.0065, speed: "Within 4 hrs", best: false },
    { name: "Hanpass (Licensed Partner API)", feePct: 0.0075, speed: "Same Day", best: false },
    { name: "WireBarley", feePct: 0.0085, speed: "1 Business Day", best: false }
  ];

  const list = document.getElementById("remit-providers-list");
  list.innerHTML = "";
  providers.forEach((p) => {
    const netReceive = baseReceived * (1 - p.feePct);
    const feeInFrom = amount * p.feePct;
    const card = document.createElement("div");
    card.className = `provider-card ${p.best ? "best" : ""}`;
    card.innerHTML = `
      <div>
        <div class="wallet-title">${p.name} ${p.best ? "★ BEST" : ""}</div>
        <div class="wallet-meta num-font">Fee: ${formatMoney(feeInFrom, fromCurr)} · Speed: ${p.speed}</div>
        <div class="wallet-balance num-font mt-8">${formatMoney(netReceive, toCurr)}</div>
      </div>
      <button type="button" class="btn-primary-xs" onclick="executeRemittance('${p.name}', ${amount}, '${fromCurr}')">Send 1-Tap</button>
    `;
    list.appendChild(card);
  });
}

window.executeRemittance = async function(providerName, amount, fromCurr) {
  const rec = getCurrentRecord();
  const wallet = rec.wallets.find((w) => w.Currency === fromCurr && w.Balance >= amount);
  if (!wallet) {
    showToast(`Insufficient ${fromCurr} wallet balance!`);
    return;
  }
  wallet.Balance -= amount;
  const usdSent = toUSD(amount, fromCurr);
  rec.goals_subs.fxUsedUsd = Math.round((rec.goals_subs.fxUsedUsd || 0) + usdSent);

  rec.transactions.unshift({
    Tx_ID: `TX_${Date.now()}`,
    User_ID: rec.user.User_ID,
    Date: new Date().toISOString().split("T")[0],
    Type: "Transfer",
    Currency: fromCurr,
    Amount: amount,
    Jar_Category: "Family Remittance",
    Wallet_ID: wallet.Wallet_ID,
    Is_Travel_Mode: rec.goals_subs.travelMode,
    Note: `Remit via ${providerName}`
  });

  saveLocalDB();
  await syncWithGoogleSheets("addTransaction", { userId: rec.user.User_ID, amount, currency: fromCurr, providerName });
  showToast(`Sent ${formatMoney(amount, fromCurr)} via ${providerName}!`);
  renderAll();
};

function updateQrConversionPreview() {
  const krw = Number(document.getElementById("qr-send-krw").value) || 0;
  const target = document.getElementById("qr-receive-curr").value;
  const converted = convertCurrency(krw, "KRW", target);
  document.getElementById("qr-conversion-preview").innerHTML =
    `Recipient receives: <strong>${formatMoney(converted, target)}</strong> (0 KRW fee)`;
}

function renderSplitBill() {
  const rec = getCurrentRecord();
  const bills = rec.goals_subs.splitBills || [];
  const list = document.getElementById("split-expenses-list");
  list.innerHTML = "";

  const paidByPerson = {};
  let totalKrw = 0;

  bills.forEach((b) => {
    const krwVal = convertCurrency(b.amount, b.currency, "KRW");
    totalKrw += krwVal;
    paidByPerson[b.payer] = (paidByPerson[b.payer] || 0) + krwVal;

    const row = document.createElement("div");
    row.className = "mini-row num-font";
    row.innerHTML = `
      <span><strong>${b.payer}</strong> · ${b.item}</span>
      <span>${formatMoney(b.amount, b.currency)} (≈ ₩${Math.round(krwVal).toLocaleString()})</span>
    `;
    list.appendChild(row);
  });

  const members = Object.keys(paidByPerson);
  const out = document.getElementById("split-settlement-output");
  if (members.length < 2) {
    out.innerHTML = "<span>Add at least 2 payers to calculate cross-currency split.</span>";
    return;
  }

  const perHead = totalKrw / members.length;
  out.innerHTML = `<div>Total Group Spend: ₩${Math.round(totalKrw).toLocaleString()} (₩${Math.round(perHead).toLocaleString()}/person)</div>`;
  members.forEach((m) => {
    const diff = paidByPerson[m] - perHead;
    const line = document.createElement("div");
    if (diff >= 0) {
      line.textContent = `• ${m} receives +₩${Math.round(diff).toLocaleString()}`;
    } else {
      line.textContent = `• ${m} owes ₩${Math.round(Math.abs(diff)).toLocaleString()}`;
    }
    out.appendChild(line);
  });
}

const SEOUL_ATMS = [
  { name: "Myeongdong Embassy FX Booth", area: "Myeongdong", lat: 37.5612, lng: 126.9825, info: "Top KRW/USD/VND rate · 09:00–21:00" },
  { name: "Woori Bank 24/7 Global ATM", area: "Hongdae Entrance", lat: 37.5572, lng: 126.9245, info: "24/7 Visa/Mastercard/UnionPay" },
  { name: "Hana Bank Global ATM & FX", area: "Itaewon Station", lat: 37.5345, lng: 126.9946, info: "Multi-currency withdrawal 24/7" },
  { name: "Shinhan Global ATM", area: "Sinchon Yonsei-ro", lat: 37.5585, lng: 126.9368, info: "24/7 English/Vietnamese/Russian UI" }
];

function renderAtmList() {
  const list = document.getElementById("atm-locations-list");
  list.innerHTML = "";
  SEOUL_ATMS.forEach((loc) => {
    const card = document.createElement("div");
    card.className = "wallet-item-card";
    card.innerHTML = `
      <div class="wallet-left">
        <span class="wallet-title">${loc.name}</span>
        <span class="wallet-meta">${loc.area} · ${loc.info}</span>
      </div>
      <a class="btn-primary-xs" target="_blank" rel="noopener" href="https://maps.google.com/?q=${loc.lat},${loc.lng}">Directions</a>
    `;
    list.appendChild(card);
  });
}

function initLeafletMap() {
  if (state.leafletMap || !window.L) return;
  const mapEl = document.getElementById("atm-map");
  if (!mapEl) return;
  state.leafletMap = L.map("atm-map").setView([37.556, 126.96], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(state.leafletMap);

  SEOUL_ATMS.forEach((loc) => {
    L.marker([loc.lat, loc.lng]).addTo(state.leafletMap).bindPopup(`<b>${loc.name}</b><br>${loc.info}`);
  });
}

// ==================== TAB 3: SPEND (6 JARS, CHART, SUBS) ====================
function renderSpendTab() {
  const rec = getCurrentRecord();
  const container = document.getElementById("six-jars-container");
  container.innerHTML = "";

  let totalPct = 0;
  rec.jars.forEach((jar, idx) => {
    totalPct += Number(jar.pct);
    const row = document.createElement("div");
    row.className = "jar-row";
    row.innerHTML = `
      <div class="jar-top">
        <input type="text" class="jar-name-input" value="${jar.name}" data-jar-idx="${idx}" />
        <span class="num-font"><strong>${jar.pct}%</strong> (Spent: ₩${Math.round(jar.spentKrw || 0).toLocaleString()})</span>
      </div>
      <input type="range" min="0" max="100" value="${jar.pct}" class="jar-slider" data-jar-slider="${idx}" />
    `;
    container.appendChild(row);
  });

  const pctBadge = document.getElementById("jars-total-pct");
  pctBadge.textContent = `Total: ${totalPct}%`;
  pctBadge.style.backgroundColor = totalPct === 100 ? "var(--powder)" : "var(--deep)";
  pctBadge.style.color = totalPct === 100 ? "var(--coffee)" : "var(--snow)";

  // Bind live slider updates
  container.querySelectorAll(".jar-slider").forEach((sl) => {
    sl.addEventListener("input", (e) => {
      const idx = Number(e.target.dataset.jarSlider);
      rec.jars[idx].pct = Number(e.target.value);
      renderSpendTab();
    });
  });

  container.querySelectorAll(".jar-name-input").forEach((inp) => {
    inp.addEventListener("change", (e) => {
      const idx = Number(e.target.dataset.jarIdx);
      rec.jars[idx].name = e.target.value;
    });
  });

  renderCashflowChart("1M");
  renderSubscriptions();
}

function renderCashflowChart(period) {
  const datasets = {
    "1W": { inc: 800000, exp: 420000, bars: [[80, 40], [70, 55], [90, 35], [60, 45]] },
    "1M": { inc: 3200000, exp: 1890000, bars: [[75, 45], [85, 62], [70, 48], [90, 52]] },
    "3M": { inc: 9600000, exp: 5400000, bars: [[80, 50], [82, 46], [88, 54]] },
    "6M": { inc: 19200000, exp: 11100000, bars: [[72, 45], [78, 50], [80, 48], [85, 60], [82, 47], [90, 51]] },
    "1Y": { inc: 38400000, exp: 21500000, bars: [[70, 40], [75, 45], [82, 55], [88, 48]] }
  };

  const d = datasets[period] || datasets["1M"];
  document.getElementById("cf-income-val").textContent = formatMoney(d.inc, "KRW");
  document.getElementById("cf-expense-val").textContent = formatMoney(d.exp, "KRW");
  document.getElementById("cf-net-val").textContent = `+${formatMoney(d.inc - d.exp, "KRW")}`;

  const area = document.getElementById("cashflow-chart-bars");
  area.innerHTML = "";
  d.bars.forEach((pair, idx) => {
    const grp = document.createElement("div");
    grp.className = "bar-group";
    grp.innerHTML = `
      <div class="bars-pair">
        <div class="bar-inc" style="height:${pair[0]}%"></div>
        <div class="bar-exp" style="height:${pair[1]}%"></div>
      </div>
      <span class="bar-label num-font">P${idx + 1}</span>
    `;
    area.appendChild(grp);
  });
}

function renderSubscriptions() {
  const rec = getCurrentRecord();
  const subs = rec.goals_subs.subscriptions || [];
  const list = document.getElementById("subscriptions-list");
  list.innerHTML = "";
  let totalKrw = 0;

  subs.forEach((s) => {
    const krw = convertCurrency(s.amount, s.currency, "KRW");
    totalKrw += krw;
    const row = document.createElement("div");
    row.className = "mini-row num-font";
    row.innerHTML = `
      <div>
        <strong>${s.name}</strong>
        <div class="wallet-meta">Next: ${s.nextDate}</div>
      </div>
      <span><strong>${formatMoney(s.amount, s.currency)}</strong></span>
    `;
    list.appendChild(row);
  });

  document.getElementById("subs-monthly-total").textContent = `≈ ${formatMoney(totalKrw, "KRW")}/mo`;
}

// ==================== TAB 4: GOALS & TRAVEL MODE ====================
function renderGoalsTab() {
  const rec = getCurrentRecord();
  const toggle = document.getElementById("travel-mode-toggle");
  const ledgerBox = document.getElementById("travel-ledger-box");
  toggle.checked = Boolean(rec.goals_subs.travelMode);
  ledgerBox.style.display = toggle.checked ? "block" : "none";

  const travelList = document.getElementById("travel-tx-list");
  travelList.innerHTML = "";
  let spentUsd = 0;
  (rec.goals_subs.travelExpenses || []).forEach((t) => {
    spentUsd += t.amountUsd;
    const div = document.createElement("div");
    div.className = "stats-pair-row num-font";
    div.innerHTML = `<span>• ${t.item}</span><span>$${t.amountUsd} USD</span>`;
    travelList.appendChild(div);
  });
  document.getElementById("travel-spent-total").textContent = `$${spentUsd} USD`;

  // Smart Financial Goals with Stablecoin Auto-Hedging
  const gList = document.getElementById("goals-list");
  gList.innerHTML = "";
  (rec.goals_subs.goals || []).forEach((g) => {
    const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
    const rem = Math.max(0, g.target - g.saved);
    const monthlyNeed = Math.round(rem / 6);
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-header-row">
        <h3>${g.title}</h3>
        <span class="badge-powder num-font">${pct}%</span>
      </div>
      <p class="muted-text num-font">Target: ${formatMoney(g.target, g.currency)} · Deadline: ${g.deadline}</p>
      <div class="progress-track-dark" style="background-color: var(--thistle); margin-top:8px;">
        <div class="progress-fill-powder" style="width:${pct}%; background-color: var(--velvet);"></div>
      </div>
      <div class="wallet-meta num-font">
        Save <strong>${formatMoney(monthlyNeed, g.currency)}/mo</strong> · AI Suggestion: DCA into USDT on dip days.
      </div>
    `;
    gList.appendChild(card);
  });
}

// ==================== TAB 5: AI ASSISTANT ====================
function renderAiTab() {
  const rec = getCurrentRecord();
  const krwToVnd = (state.fxRates.VND / state.fxRates.KRW).toFixed(2);
  const usdToKrw = Math.round(state.fxRates.KRW);
  const usdtToKrw = Math.round(state.fxRates.USDT_KRW || state.fxRates.KRW);

  document.getElementById("live-krw-vnd").textContent = `${krwToVnd} ₫`;
  document.getElementById("live-usd-krw").textContent = `${usdToKrw.toLocaleString()} ₩`;
  document.getElementById("live-usdt-krw").textContent = `${usdtToKrw.toLocaleString()} ₩`;

  // Compute Dynamic Financial Health Score (0-100)
  let totalUsd = 0;
  rec.wallets.forEach(w => totalUsd += toUSD(w.Balance, w.Currency));
  rec.savings.forEach(s => totalUsd += toUSD(s.Principal_Amount, s.Currency));
  const totalKrw = fromUSD(totalUsd, "KRW");
  const visaSafe = totalKrw >= (rec.goals_subs.visaMinKrw || 10000000);
  const score = Math.min(98, Math.max(45, (visaSafe ? 55 : 30) + (rec.savings.length * 12) + 5));

  document.getElementById("health-score-val").textContent = score;
  document.getElementById("health-score-label").textContent = score >= 75 ? "Strong & Visa-Safe" : "Needs Reserve Buffer";

  // Rate Alerts List
  const aList = document.getElementById("rate-alerts-list");
  aList.innerHTML = "";
  (rec.goals_subs.rateAlerts || []).forEach((al) => {
    const row = document.createElement("div");
    row.className = "mini-row num-font";
    row.innerHTML = `
      <span><strong>${al.pair.replace("_", "/")}</strong> Target: ${al.target}</span>
      <span class="badge-powder">Active</span>
    `;
    aList.appendChild(row);
  });
}

// ==================== EVENT BINDINGS ====================
function bindMainAppEvents() {
  // Bottom Navigation Tabs
  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));
      btn.classList.add("active");

      const target = btn.dataset.target;
      document.querySelectorAll(".tab-pane").forEach((p) => p.classList.remove("active"));
      document.getElementById(target).classList.add("active");
    });
  });

  // Top-Right 3-Line Hamburger Dropdown
  const dropdown = document.getElementById("settings-dropdown");
  document.getElementById("hamburger-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && e.target.id !== "hamburger-btn") {
      dropdown.style.display = "none";
    }
  });

  // 6 Language buttons inside Settings menu
  document.querySelectorAll(".lang-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      applyLanguage(chip.dataset.lang);
      dropdown.style.display = "none";
      showToast(`Language switched to ${chip.textContent}`);
    });
  });

  // Edit Account Modal
  document.getElementById("open-edit-account-btn").addEventListener("click", () => {
    dropdown.style.display = "none";
    const u = getCurrentRecord().user;
    document.getElementById("edit-acc-fullname").value = u.FullName;
    document.getElementById("edit-acc-dob").value = u.DOB;
    document.getElementById("edit-acc-email").value = u.Email;
    document.getElementById("edit-account-modal").style.display = "flex";
  });

  document.getElementById("edit-account-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const u = getCurrentRecord().user;
    u.FullName = document.getElementById("edit-acc-fullname").value.trim();
    u.DOB = document.getElementById("edit-acc-dob").value;
    u.Email = document.getElementById("edit-acc-email").value.trim();
    saveLocalDB();
    await syncWithGoogleSheets("editAccount", { user: u });
    document.getElementById("edit-account-modal").style.display = "none";
    renderAll();
    showToast("Account profile updated!");
  });

  // Manual Sync & Logout
  document.getElementById("manual-sync-btn").addEventListener("click", async () => {
    dropdown.style.display = "none";
    await fetchLiveRates(false);
    await syncWithGoogleSheets("syncAll", { record: getCurrentRecord() });
  });

  document.getElementById("logout-btn").addEventListener("click", () => {
    dropdown.style.display = "none";
    state.currentUserId = null;
    showScreen("login-screen");
  });

  // Base Currency Switcher on Home Hero Card
  document.querySelectorAll(".curr-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".curr-pill").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      state.baseCurrency = pill.dataset.curr;
      renderHomeTab();
    });
  });

  document.getElementById("refresh-fx-btn").addEventListener("click", () => fetchLiveRates(false));

  // Add Wallet Modal (Max 6)
  document.getElementById("open-add-wallet-btn").addEventListener("click", () => {
    const rec = getCurrentRecord();
    if (rec.wallets.length >= 6) {
      showToast("Maximum 6 wallets reached!");
      return;
    }
    document.getElementById("wallet-modal-title").textContent = "Add Currency Wallet";
    document.getElementById("edit-wallet-id").value = "";
    document.getElementById("wallet-form").reset();
    document.getElementById("wallet-modal").style.display = "flex";
  });

  document.getElementById("wallet-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const rec = getCurrentRecord();
    const editId = document.getElementById("edit-wallet-id").value;
    const wData = {
      Wallet_Name: document.getElementById("wallet-name-input").value.trim(),
      Type: document.getElementById("wallet-type-input").value,
      Country: document.getElementById("wallet-country-input").value.trim(),
      Currency: document.getElementById("wallet-curr-input").value,
      Balance: Number(document.getElementById("wallet-bal-input").value) || 0
    };

    if (editId) {
      const idx = rec.wallets.findIndex((w) => w.Wallet_ID === editId);
      if (idx !== -1) rec.wallets[idx] = { ...rec.wallets[idx], ...wData };
    } else {
      if (rec.wallets.length >= 6) return;
      rec.wallets.push({
        Wallet_ID: `W_${Date.now()}`,
        User_ID: rec.user.User_ID,
        ...wData
      });
    }

    saveLocalDB();
    await syncWithGoogleSheets("upsertWallet", { userId: rec.user.User_ID, wallet: wData });
    document.getElementById("wallet-modal").style.display = "none";
    renderAll();
    showToast("Wallet saved!");
  });

  // Add / Edit Savings Modal
  document.getElementById("open-add-saving-btn").addEventListener("click", () => {
    document.getElementById("edit-saving-id").value = "";
    document.getElementById("saving-form").reset();
    document.getElementById("saving-modal").style.display = "flex";
  });

  document.getElementById("saving-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const rec = getCurrentRecord();
    const editId = document.getElementById("edit-saving-id").value;
    const sData = {
      Bank_Name: document.getElementById("saving-bank-input").value.trim(),
      Country: document.getElementById("saving-country-input").value.trim(),
      Currency: document.getElementById("saving-curr-input").value,
      Principal_Amount: Number(document.getElementById("saving-amount-input").value) || 0,
      Interest_Rate: Number(document.getElementById("saving-rate-input").value) || 0,
      Start_Date: document.getElementById("saving-start-input").value,
      Maturity_Date: document.getElementById("saving-end-input").value
    };

    if (editId) {
      const idx = rec.savings.findIndex((s) => s.Saving_ID === editId);
      if (idx !== -1) rec.savings[idx] = { ...rec.savings[idx], ...sData };
    } else {
      rec.savings.push({
        Saving_ID: `S_${Date.now()}`,
        User_ID: rec.user.User_ID,
        ...sData
      });
    }

    saveLocalDB();
    await syncWithGoogleSheets("upsertSaving", { userId: rec.user.User_ID, saving: sData });
    document.getElementById("saving-modal").style.display = "none";
    renderAll();
    showToast("Savings deposit updated!");
  });

  // Edit Visa Balance Guard Limit
  document.getElementById("edit-visa-guard-btn").addEventListener("click", () => {
    const rec = getCurrentRecord();
    const val = prompt("Enter minimum KRW balance required for Visa renewal:", rec.goals_subs.visaMinKrw || 10000000);
    if (val !== null && !isNaN(Number(val))) {
      rec.goals_subs.visaMinKrw = Number(val);
      saveLocalDB();
      renderAll();
      showToast("Visa Balance Guard updated!");
    }
  });

  // Log Remittance towards $50K Limit
  document.getElementById("log-remittance-limit-btn").addEventListener("click", () => {
    const rec = getCurrentRecord();
    const addUsd = prompt("Add overseas remittance amount (in USD) to annual $50,000 tracker:", "1000");
    if (addUsd !== null && !isNaN(Number(addUsd))) {
      rec.goals_subs.fxUsedUsd = (rec.goals_subs.fxUsedUsd || 0) + Number(addUsd);
      saveLocalDB();
      renderAll();
      showToast("FX $50K tracker updated!");
    }
  });

  // Add Expense / Income Transaction
  document.getElementById("open-add-tx-btn").addEventListener("click", () => {
    const rec = getCurrentRecord();
    const wSel = document.getElementById("tx-wallet-input");
    wSel.innerHTML = rec.wallets.map(w => `<option value="${w.Wallet_ID}">${w.Wallet_Name} (${w.Currency})</option>`).join("");

    const jSel = document.getElementById("tx-jar-input");
    jSel.innerHTML = rec.jars.map((j, i) => `<option value="${i}">${j.name}</option>`).join("");

    document.getElementById("tx-modal").style.display = "flex";
  });

  document.getElementById("tx-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const rec = getCurrentRecord();
    const type = document.getElementById("tx-type-input").value;
    const walletId = document.getElementById("tx-wallet-input").value;
    const amount = Number(document.getElementById("tx-amount-input").value) || 0;
    const jarIdx = Number(document.getElementById("tx-jar-input").value);
    const note = document.getElementById("tx-note-input").value.trim();

    const wallet = rec.wallets.find(w => w.Wallet_ID === walletId);
    if (wallet) {
      if (type === "Expense") {
        wallet.Balance = Math.max(0, wallet.Balance - amount);
        const krwEq = convertCurrency(amount, wallet.Currency, "KRW");
        if (rec.goals_subs.travelMode) {
          rec.goals_subs.travelExpenses.push({ item: note, amountUsd: Math.round(toUSD(amount, wallet.Currency)) });
        } else if (rec.jars[jarIdx]) {
          rec.jars[jarIdx].spentKrw = (rec.jars[jarIdx].spentKrw || 0) + krwEq;
        }
      } else {
        wallet.Balance += amount;
      }
    }

    saveLocalDB();
    await syncWithGoogleSheets("addTransaction", { userId: rec.user.User_ID, type, amount, note });
    document.getElementById("tx-modal").style.display = "none";
    renderAll();
    showToast(`${type} logged & synced!`);
  });

  // Transfer Sub-tabs
  document.querySelectorAll(".sub-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".sub-tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".sub-panel").forEach(p => p.classList.remove("active"));
      document.getElementById(btn.dataset.subtab).classList.add("active");
      if (btn.dataset.subtab === "atm-panel") {
        setTimeout(() => {
          initLeafletMap();
          if (state.leafletMap) state.leafletMap.invalidateSize();
        }, 120);
      }
    });
  });

  // Remittance live inputs
  ["remit-send-amount", "remit-from-curr", "remit-to-curr"].forEach((id) => {
    document.getElementById(id).addEventListener("input", renderRemittanceComparison);
  });

  // QR live preview & execution
  ["qr-send-krw", "qr-receive-curr"].forEach((id) => {
    document.getElementById(id).addEventListener("input", updateQrConversionPreview);
  });

  document.getElementById("execute-qr-pay-btn").addEventListener("click", () => {
    const rec = getCurrentRecord();
    const krw = Number(document.getElementById("qr-send-krw").value) || 0;
    const krwWallet = rec.wallets.find(w => w.Currency === "KRW" && w.Balance >= krw);
    if (!krwWallet) {
      showToast("Insufficient KRW balance for QR payment.");
      return;
    }
    krwWallet.Balance -= krw;
    saveLocalDB();
    renderAll();
    showToast(`Instant QR payment of ₩${krw.toLocaleString()} sent!`);
  });

  // Group Bill Split
  document.getElementById("add-split-item-btn").addEventListener("click", () => {
    const payer = document.getElementById("split-payer").value.trim();
    const item = document.getElementById("split-item").value.trim();
    const amount = Number(document.getElementById("split-amount").value) || 0;
    const currency = document.getElementById("split-curr").value;
    if (!payer || !item || amount <= 0) return;

    const rec = getCurrentRecord();
    rec.goals_subs.splitBills.push({ id: `SP_${Date.now()}`, payer, item, amount, currency });
    saveLocalDB();
    document.getElementById("split-payer").value = "";
    document.getElementById("split-item").value = "";
    document.getElementById("split-amount").value = "";
    renderSplitBill();
    showToast("Added to multi-currency split!");
  });

  // Save 6 Jars Allocation
  document.getElementById("save-jars-btn").addEventListener("click", async () => {
    const rec = getCurrentRecord();
    const sum = rec.jars.reduce((acc, j) => acc + Number(j.pct), 0);
    if (sum !== 100) {
      showToast(`Total must equal 100% (Currently ${sum}%)`);
      return;
    }
    saveLocalDB();
    await syncWithGoogleSheets("saveJars", { userId: rec.user.User_ID, jars: rec.jars });
    showToast("6-Jars budget saved!");
  });

  // Cashflow Period Tabs
  document.querySelectorAll(".period-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".period-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderCashflowChart(btn.dataset.period);
    });
  });

  // AI Receipt Scanner Modal
  document.getElementById("open-ocr-modal-btn").addEventListener("click", () => {
    const rec = getCurrentRecord();
    document.getElementById("ocr-jar").innerHTML = rec.jars.map((j, i) => `<option value="${i}">${j.name}</option>`).join("");
    document.getElementById("ocr-result-box").style.display = "none";
    document.getElementById("ocr-modal").style.display = "flex";
  });

  function triggerMockOcr(merchant, amount, curr, jarIdx) {
    const status = document.getElementById("ocr-scan-status");
    const resBox = document.getElementById("ocr-result-box");
    status.style.display = "flex";
    resBox.style.display = "none";
    setTimeout(() => {
      status.style.display = "none";
      resBox.style.display = "block";
      document.getElementById("ocr-merchant").value = merchant;
      document.getElementById("ocr-amount").value = amount;
      document.getElementById("ocr-curr").value = curr;
      document.getElementById("ocr-jar").value = String(jarIdx);
    }, 900);
  }

  document.getElementById("receipt-file-input").addEventListener("change", () => {
    triggerMockOcr("Olive Young Myeongdong", 28500, "KRW", 0);
  });

  document.querySelectorAll(".ocr-sample-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.sample === "gs25") triggerMockOcr("GS25 Seoul Station", 12400, "KRW", 0);
      else triggerMockOcr("Phở Hà Nội", 145000, "VND", 3);
    });
  });

  document.getElementById("confirm-ocr-save-btn").addEventListener("click", () => {
    const rec = getCurrentRecord();
    const merchant = document.getElementById("ocr-merchant").value;
    const amount = Number(document.getElementById("ocr-amount").value) || 0;
    const curr = document.getElementById("ocr-curr").value;
    const jarIdx = Number(document.getElementById("ocr-jar").value);

    const w = rec.wallets.find(wl => wl.Currency === curr) || rec.wallets[0];
    if (w) w.Balance = Math.max(0, w.Balance - amount);
    if (rec.jars[jarIdx]) {
      rec.jars[jarIdx].spentKrw = (rec.jars[jarIdx].spentKrw || 0) + convertCurrency(amount, curr, "KRW");
    }
    saveLocalDB();
    document.getElementById("ocr-modal").style.display = "none";
    renderAll();
    showToast(`Receipt "${merchant}" logged to Jar!`);
  });

  // Travel Mode Toggle
  document.getElementById("travel-mode-toggle").addEventListener("change", (e) => {
    const rec = getCurrentRecord();
    rec.goals_subs.travelMode = e.target.checked;
    saveLocalDB();
    renderAll();
    showToast(e.target.checked ? "Travel Mode ON: Trip expenses isolated" : "Travel Mode OFF");
  });

  // Add Goal Modal
  document.getElementById("open-add-goal-btn").addEventListener("click", () => {
    document.getElementById("goal-modal").style.display = "flex";
  });

  document.getElementById("goal-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const rec = getCurrentRecord();
    rec.goals_subs.goals.push({
      id: `G_${Date.now()}`,
      title: document.getElementById("goal-title-input").value.trim(),
      target: Number(document.getElementById("goal-target-input").value) || 1000,
      saved: 0,
      currency: document.getElementById("goal-curr-input").value,
      deadline: document.getElementById("goal-deadline-input").value
    });
    saveLocalDB();
    document.getElementById("goal-modal").style.display = "none";
    renderGoalsTab();
    showToast("Smart FX Goal created!");
  });

  // Add Rate Alert
  document.getElementById("add-rate-alert-btn").addEventListener("click", () => {
    const pair = document.getElementById("alert-pair-select").value;
    const target = Number(document.getElementById("alert-target-input").value);
    if (!target) return;
    const rec = getCurrentRecord();
    rec.goals_subs.rateAlerts.push({ id: `RA_${Date.now()}`, pair, target, active: true });
    saveLocalDB();
    document.getElementById("alert-target-input").value = "";
    renderAiTab();
    showToast("Target FX alert activated!");
  });

  // Modal Close Buttons
  document.querySelectorAll(".close-modal-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById(btn.dataset.close).style.display = "none";
    });
  });
}

// Global Helpers for Wallet & Saving Edit/Delete
window.openEditWallet = function(walletId) {
  const rec = getCurrentRecord();
  const w = rec.wallets.find(item => item.Wallet_ID === walletId);
  if (!w) return;
  document.getElementById("wallet-modal-title").textContent = "Edit Wallet";
  document.getElementById("edit-wallet-id").value = w.Wallet_ID;
  document.getElementById("wallet-name-input").value = w.Wallet_Name;
  document.getElementById("wallet-type-input").value = w.Type;
  document.getElementById("wallet-country-input").value = w.Country;
  document.getElementById("wallet-curr-input").value = w.Currency;
  document.getElementById("wallet-bal-input").value = w.Balance;
  document.getElementById("wallet-modal").style.display = "flex";
};

window.deleteWallet = function(walletId) {
  const rec = getCurrentRecord();
  rec.wallets = rec.wallets.filter(w => w.Wallet_ID !== walletId);
  saveLocalDB();
  renderAll();
  showToast("Wallet removed.");
};

window.openEditSaving = function(savingId) {
  const rec = getCurrentRecord();
  const s = rec.savings.find(item => item.Saving_ID === savingId);
  if (!s) return;
  document.getElementById("edit-saving-id").value = s.Saving_ID;
  document.getElementById("saving-bank-input").value = s.Bank_Name;
  document.getElementById("saving-country-input").value = s.Country;
  document.getElementById("saving-curr-input").value = s.Currency;
  document.getElementById("saving-amount-input").value = s.Principal_Amount;
  document.getElementById("saving-rate-input").value = s.Interest_Rate;
  document.getElementById("saving-start-input").value = s.Start_Date;
  document.getElementById("saving-end-input").value = s.Maturity_Date;
  document.getElementById("saving-modal").style.display = "flex";
};
