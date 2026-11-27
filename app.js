/* ==========================================================================
   MONIFY v2 — MISA MONEY KEEPER CLEAN EDITION
   Default Language: English (Switchable to EN / 한국어 / Tiếng Việt)
   Auto-connected Google Apps Script + Instant localStorage Fallback
   ========================================================================== */

(function () {
  "use strict";

  const STORAGE_KEY = "monify_db_v2";
  const FX_CACHE_KEY = "monify_fx_v2";
  const LANG_KEY = "monify_lang_v2";

  const GAS_URL =
    (window.MONIFY_CONFIG && window.MONIFY_CONFIG.GOOGLE_SCRIPT_URL) ||
    "https://script.google.com/macros/s/AKfycby5nM7sVrqWe0Pojnjo7rf-XvdNMZwu-nFm-41LdSLwSrYfgyfUj4ILZ9Jn2djIrrbD/exec";

  // ========================================================================
  // 1. MULTI-LANGUAGE DICTIONARY (EN default | KO | VI)
  // ========================================================================
  const I18N = {
    en: {
      auth_subtitle: "Simple multi-currency finance manager",
      login_title: "Sign In",
      username: "Username",
      password: "Password",
      login_btn: "Sign In",
      demo_btn: "Quick Demo (monify / 828282)",
      no_account: "Don't have an account?",
      register_now: "Sign up",
      register_title: "Create Account",
      register_hint: "A unique User_ID will be assigned and synced automatically to Google Sheets.",
      reg_username: "1. Username *",
      reg_fullname: "2. Full Name *",
      reg_dob: "3. Date of Birth *",
      reg_password: "4. Password *",
      reg_email: "5. Email Address *",
      register_btn: "Create Account",
      have_account: "Already have an account?",
      tab_home: "Home",
      tab_transfer: "Transfer",
      tab_spend: "Spend",
      tab_goals: "Goals",
      tab_ai: "AI",
      total_balance: "Total Balance",
      theme_btn: "Style",
      my_wallets: "My Wallets",
      add_wallet: "+ Add",
      max_wallets: "Full 6/6",
      savings_deposits: "Savings & Deposits",
      add_saving: "+ Add",
      visa_guard: "Visa Balance Guard",
      edit: "Edit",
      min_lock: "Min Lock:",
      available: "Available:",
      fx50k_radar: "$50,000 FX Limit & Tax",
      update: "Update",
      used_year: "Used this year:",
      tax_may_note: "May reminder: Comprehensive Income Tax & 3.3% refund filing in Korea.",
      sub_remit: "Compare",
      sub_qr: "QR Pay",
      sub_split: "Split",
      sub_atm: "ATM/FX",
      remit_title: "International Transfer Comparison",
      send_amount: "Send Amount",
      route: "Route",
      from_wallet: "From Wallet",
      my_qr: "MY QR CODE",
      qr_sim_title: "Instant Multi-Currency QR Pay",
      qr_sim_desc: "Pay in KRW — receiver gets VND, USD, or USDT instantly.",
      recipient: "Recipient (Username / QR)",
      pay_krw: "Pay (KRW)",
      recv_in: "Receive in",
      qr_send_btn: "Scan & Send Now",
      split_title: "Multi-Currency Bill Split",
      clear: "Clear",
      group_name: "Group / Trip Name",
      payer: "Paid by",
      currency: "Currency",
      amount: "Amount",
      note: "Item",
      add_bill: "+ Add Bill",
      bills_list: "Bills",
      who_owes: "Who owes whom?",
      all: "All",
      global_atm: "Global ATM",
      fx_booth: "Exchange",
      add_tx: "+ Add Record",
      scan_receipt: "AI Scan Receipt",
      six_jars: "6 Jars Budget",
      auto_100: "Auto 100%",
      save_jars: "Save Jars",
      cashflow_title: "Cashflow Report",
      over_avg: "Above Avg",
      income: "Income",
      expense: "Expense",
      net: "Net",
      recent_tx: "Recent Transactions",
      subscriptions: "Subscriptions (KRW & USD)",
      add_sub: "+ Add",
      monthly_total: "Monthly total:",
      travel_mode: "Home-Visit / Travel Mode",
      travel_sub: "Separate trip costs from monthly stats",
      trip_name: "Trip Name",
      trip_budget: "Budget (KRW)",
      spent: "Spent:",
      add_travel_tx: "+ Log Trip Expense",
      fin_goals: "Financial Goals",
      add_goal: "+ Add Goal",
      health_score: "Financial Health Score",
      weekly_tips: "WEEKLY ACTION TIPS",
      fx_alert_title: "Target FX Rate Alerts",
      fx_alert_desc: "Set your desired rate to receive timely alerts.",
      fx_pair: "Pair",
      target_rate: "Target Rate",
      set_alert: "+ Set Rate Alert",
      ai_disclaimer: "Analysis is for reference only based on historical data and does not guarantee accurate future exchange rate predictions.",
      account_modal: "Account & Language",
      sheets_connected: "Google Sheets Sync: Connected",
      app_language: "App Language",
      reset_demo: "Reset Demo Data",
      logout: "Sign Out",
      best_rate: "Best Receive",
      send_1tap: "Send",
      directions: "Map",
      cancel: "Remove",
      delete: "Delete",
      topup: "+10%",
      wallets_lbl: "Wallets",
      savings_lbl: "Savings",
      bank: "Bank",
      cash: "Cash",
      est_interest: "Est. Interest",
      visa_warn: "WARNING: Short by {amt} below Visa lock threshold!",
      visa_tight: "Near threshold: Buffer is {amt}. Avoid large expenses.",
      visa_safe: "Safe for Visa extension: {amt} above minimum lock."
    },
    ko: {
      auth_subtitle: "간편한 다통화 개인 자산관리",
      login_title: "로그인",
      username: "아이디",
      password: "비밀번호",
      login_btn: "로그인",
      demo_btn: "데모 계정 바로가기 (monify / 828282)",
      no_account: "계정이 없으신가요?",
      register_now: "회원가입",
      register_title: "회원가입",
      register_hint: "고유 User_ID가 자동 부여되며 Google Sheets에 자동 동기화됩니다.",
      reg_username: "1. 아이디 *",
      reg_fullname: "2. 성명 *",
      reg_dob: "3. 생년월일 *",
      reg_password: "4. 비밀번호 *",
      reg_email: "5. 이메일 주소 *",
      register_btn: "가입하기",
      have_account: "이미 계정이 있으신가요?",
      tab_home: "홈",
      tab_transfer: "송금",
      tab_spend: "소비",
      tab_goals: "목표",
      tab_ai: "AI",
      total_balance: "총 자산",
      theme_btn: "스타일",
      my_wallets: "내 지갑",
      add_wallet: "+ 추가",
      max_wallets: "최대 6/6",
      savings_deposits: "예·적금",
      add_saving: "+ 추가",
      visa_guard: "비자 잔고 가드",
      edit: "설정",
      min_lock: "최소 유지:",
      available: "보유 자산:",
      fx50k_radar: "$50,000 송금 한도 & 세금",
      update: "수정",
      used_year: "올해 송금액:",
      tax_may_note: "5월 안내: 한국 종합소득세 신고 및 3.3% 세금 환급 일정.",
      sub_remit: "송금비교",
      sub_qr: "QR송금",
      sub_split: "더치페이",
      sub_atm: "ATM/환전",
      remit_title: "원터치 해외송금 비교",
      send_amount: "송금 금액",
      route: "통화 경로",
      from_wallet: "출금 지갑",
      my_qr: "내 QR 코드",
      qr_sim_title: "다통화 QR 간편송금",
      qr_sim_desc: "원화(KRW)로 보내면 상대방이 VND/USD/USDT로 즉시 수령합니다.",
      recipient: "받는 사람 (아이디 / QR)",
      pay_krw: "보낼 금액 (KRW)",
      recv_in: "수령 통화",
      qr_send_btn: "QR 스캔 및 즉시 송금",
      split_title: "다통화 그룹 정산",
      clear: "초기화",
      group_name: "모임 / 여행 이름",
      payer: "결제자",
      currency: "통화",
      amount: "금액",
      note: "항목",
      add_bill: "+ 영수증 추가",
      bills_list: "결제 내역",
      who_owes: "정산 결과",
      all: "전체",
      global_atm: "글로벌 ATM",
      fx_booth: "환전소",
      add_tx: "+ 내역 입력",
      scan_receipt: "AI 영수증 스캔",
      six_jars: "6개 통장 예산",
      auto_100: "100% 맞추기",
      save_jars: "저장",
      cashflow_title: "현금흐름 리포트",
      over_avg: "평균 초과",
      income: "수입",
      expense: "지출",
      net: "순이익",
      recent_tx: "최근 거래 내역",
      subscriptions: "정기구독 (KRW & USD)",
      add_sub: "+ 추가",
      monthly_total: "월 합계:",
      travel_mode: "귀국 / 여행 모드",
      travel_sub: "여행 지출을 한국 생활비 통계에서 분리",
      trip_name: "여행 이름",
      trip_budget: "예산 (KRW)",
      spent: "지출:",
      add_travel_tx: "+ 여행 지출 기록",
      fin_goals: "재무 목표",
      add_goal: "+ 목표 추가",
      health_score: "금융 건강 점수",
      weekly_tips: "주간 실행 팁",
      fx_alert_title: "목표 환율 알림",
      fx_alert_desc: "원하는 환율을 설정하고 알림을 받아보세요.",
      fx_pair: "통화 쌍",
      target_rate: "목표 환율",
      set_alert: "+ 환율 알림 설정",
      ai_disclaimer: "본 분석은 과거 데이터를 기반으로 한 참고용이며, 미래 환율의 정확한 예측을 보장하지 않습니다.",
      account_modal: "계정 및 언어 설정",
      sheets_connected: "Google Sheets 자동 동기화 연결됨",
      app_language: "앱 언어",
      reset_demo: "데모 데이터 초기화",
      logout: "로그아웃",
      best_rate: "최고 수령액",
      send_1tap: "송금",
      directions: "길찾기",
      cancel: "삭제",
      delete: "삭제",
      topup: "+10%",
      wallets_lbl: "지갑",
      savings_lbl: "적금",
      bank: "은행",
      cash: "현금",
      est_interest: "예상 이자",
      visa_warn: "경고: 비자 최소 잔고 기준보다 {amt} 부족합니다!",
      visa_tight: "기준선 근접: 여유분 {amt}. 큰 지출에 주의하세요.",
      visa_safe: "비자 연장 안전: 기준선 대비 {amt} 여유가 있습니다."
    },
    vi: {
      auth_subtitle: "Quản lý tài chính đa tiền tệ đơn giản",
      login_title: "Đăng nhập",
      username: "Tên đăng nhập",
      password: "Mật khẩu",
      login_btn: "Đăng nhập",
      demo_btn: "Dùng nhanh tài khoản mẫu (monify / 828282)",
      no_account: "Chưa có tài khoản?",
      register_now: "Đăng ký ngay",
      register_title: "Tạo tài khoản",
      register_hint: "Hệ thống tự động cấp User_ID riêng và đồng bộ lên Google Sheets.",
      reg_username: "1. Tên đăng nhập *",
      reg_fullname: "2. Họ và tên *",
      reg_dob: "3. Ngày sinh *",
      reg_password: "4. Mật khẩu *",
      reg_email: "5. Địa chỉ Email *",
      register_btn: "Đăng ký",
      have_account: "Đã có tài khoản?",
      tab_home: "Trang chủ",
      tab_transfer: "Chuyển tiền",
      tab_spend: "Chi tiêu",
      tab_goals: "Mục tiêu",
      tab_ai: "Trợ lý AI",
      total_balance: "Tổng tài sản",
      theme_btn: "Đổi nền",
      my_wallets: "Ví của tôi",
      add_wallet: "+ Thêm",
      max_wallets: "Đủ 6/6",
      savings_deposits: "Sổ tiết kiệm",
      add_saving: "+ Thêm",
      visa_guard: "Lá chắn số dư Visa",
      edit: "Cài đặt",
      min_lock: "Khóa tối thiểu:",
      available: "Khả dụng:",
      fx50k_radar: "Hạn mức $50,000 & Thuế",
      update: "Cập nhật",
      used_year: "Đã chuyển năm nay:",
      tax_may_note: "Nhắc tháng 5: Quyết toán & hoàn thuế thu nhập 3.3% tại Hàn Quốc.",
      sub_remit: "So sánh",
      sub_qr: "QR Pay",
      sub_split: "Chia tiền",
      sub_atm: "ATM/Đổi",
      remit_title: "So sánh chuyển tiền quốc tế",
      send_amount: "Số tiền gửi",
      route: "Tuyến tiền tệ",
      from_wallet: "Từ ví",
      my_qr: "MÃ QR CỦA TÔI",
      qr_sim_title: "QR chuyển tiền đa tiền tệ",
      qr_sim_desc: "Trả bằng KRW — người nhận nhận ngay VND, USD hoặc USDT.",
      recipient: "Người nhận (Username / QR)",
      pay_krw: "Trả (KRW)",
      recv_in: "Nhận bằng",
      qr_send_btn: "Quét & Gửi ngay",
      split_title: "Chia tiền nhóm đa tiền tệ",
      clear: "Làm mới",
      group_name: "Tên nhóm / Chuyến đi",
      payer: "Người trả",
      currency: "Tiền tệ",
      amount: "Số tiền",
      note: "Khoản chi",
      add_bill: "+ Thêm hóa đơn",
      bills_list: "Danh sách hóa đơn",
      who_owes: "Ai cần chuyển cho ai?",
      all: "Tất cả",
      global_atm: "Global ATM",
      fx_booth: "Đổi tiền",
      add_tx: "+ Ghi thu/chi",
      scan_receipt: "AI Quét hóa đơn",
      six_jars: "Ngân sách 6 chiếc lọ",
      auto_100: "Cân 100%",
      save_jars: "Lưu lọ",
      cashflow_title: "Báo cáo dòng tiền",
      over_avg: "Vượt TB",
      income: "Thu nhập",
      expense: "Chi tiêu",
      net: "Ròng",
      recent_tx: "Giao dịch gần đây",
      subscriptions: "Gói định kỳ (KRW & USD)",
      add_sub: "+ Thêm",
      monthly_total: "Tổng hàng tháng:",
      travel_mode: "Chế độ Về nước / Du lịch",
      travel_sub: "Tách chi tiêu chuyến đi khỏi sinh hoạt hàng tháng",
      trip_name: "Tên chuyến đi",
      trip_budget: "Ngân sách (KRW)",
      spent: "Đã chi:",
      add_travel_tx: "+ Ghi chi tiêu chuyến đi",
      fin_goals: "Mục tiêu tài chính",
      add_goal: "+ Thêm mục tiêu",
      health_score: "Điểm sức khỏe tài chính",
      weekly_tips: "GỢI Ý TUẦN NÀY",
      fx_alert_title: "Canh tỷ giá mục tiêu",
      fx_alert_desc: "Đặt ngưỡng tỷ giá mong muốn để nhận cảnh báo.",
      fx_pair: "Cặp tỷ giá",
      target_rate: "Tỷ giá mục tiêu",
      set_alert: "+ Đặt cảnh báo",
      ai_disclaimer: "Phân tích chỉ mang tính tham khảo dựa trên dữ liệu lịch sử, không cam kết dự đoán chính xác tỷ giá tương lai.",
      account_modal: "Tài khoản & Ngôn ngữ",
      sheets_connected: "Đồng bộ Google Sheets: Đã kết nối",
      app_language: "Ngôn ngữ ứng dụng",
      reset_demo: "Khôi phục dữ liệu mẫu",
      logout: "Đăng xuất",
      best_rate: "Thực nhận cao nhất",
      send_1tap: "Chuyển",
      directions: "Chỉ đường",
      cancel: "Hủy",
      delete: "Xóa",
      topup: "+10%",
      wallets_lbl: "Ví",
      savings_lbl: "Tiết kiệm",
      bank: "Ngân hàng",
      cash: "Tiền mặt",
      est_interest: "Lãi dự kiến",
      visa_warn: "CẢNH BÁO: Thiếu {amt} so với ngưỡng khóa Visa!",
      visa_tight: "Sát ngưỡng: Dư {amt}. Hạn chế chi tiêu lớn.",
      visa_safe: "An toàn gia hạn Visa: Dư {amt} trên mức khóa."
    }
  };

  function t(key, vars) {
    const dict = I18N[state.lang] || I18N.en;
    let str = dict[key] || I18N.en[key] || key;
    if (vars) {
      Object.keys(vars).forEach(k => { str = str.replace("{" + k + "}", vars[k]); });
    }
    return str;
  }

  function applyStaticI18n() {
    document.documentElement.lang = state.lang;
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (key) el.textContent = t(key);
    });
    const authSel = document.getElementById("auth-lang-select");
    if (authSel) authSel.value = state.lang;
    updateHeaderTitle();
  }

  function setLanguage(lang) {
    if (!I18N[lang]) lang = "en";
    state.lang = lang;
    localStorage.setItem(LANG_KEY, lang);
    applyStaticI18n();
    if (state.currentUser) renderAll();
  }

  const DEFAULT_RATES = {
    USD: 1,
    USDT: 1,
    KRW: 1385,
    VND: 25450,
    EUR: 0.92,
    JPY: 152,
    RUB: 96,
    UZS: 12750,
    updatedAt: "Offline Fallback"
  };

  const SEOUL_SPOTS = [
    { id: "atm1", type: "fx", name: "Embassy Exchange (명동 대사관앞)", area: "Myeongdong", hours: "09:00–21:00", note: "Top USD/VND/KRW rate", lat: 37.5610, lng: 126.9822 },
    { id: "atm2", type: "fx", name: "Money Box Hongdae (머니박스)", area: "Hongdae", hours: "09:00–22:00", note: "Fast transparent FX", lat: 37.5567, lng: 126.9240 },
    { id: "atm3", type: "atm", name: "Woori Global ATM 24/7", area: "Sinchon", hours: "24/7", note: "Visa / Mastercard / UnionPay", lat: 37.5559, lng: 126.9368 },
    { id: "atm4", type: "atm", name: "Hana Global ATM 24/7", area: "Itaewon", hours: "24/7", note: "Foreign card KRW withdrawal", lat: 37.5345, lng: 126.9946 },
    { id: "atm5", type: "fx", name: "Itaewon FX Booth (이태원 환전소)", area: "Itaewon", hours: "09:30–21:30", note: "USD, EUR, RUB, VND", lat: 37.5349, lng: 126.9921 },
    { id: "atm6", type: "atm", name: "KB Kookmin Global ATM 24/7", area: "Gangnam", hours: "24/7", note: "Exit 10, multilingual UI", lat: 37.4980, lng: 127.0276 }
  ];

  const state = {
    lang: localStorage.getItem(LANG_KEY) || (window.MONIFY_CONFIG && window.MONIFY_CONFIG.DEFAULT_LANG) || "en",
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
      { id: "sp1", payer: "Yumi", amount: 68000, currency: "KRW", note: "Hongdae BBQ" },
      { id: "sp2", payer: "Minji", amount: 24, currency: "USD", note: "Cafe & Dessert" },
      { id: "sp3", payer: "Tan", amount: 350000, currency: "VND", note: "Train Tickets" }
    ]
  };

  // ========================================================================
  // 2. SEED DATA & GOOGLE SHEETS SYNC (Hardcoded URL, Zero Manual Input)
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
        { Wallet_ID: "W1", User_ID: 1, Wallet_Name: "Toss Bank", Type: "Bank", Country: "South Korea", Currency: "KRW", Balance: 1000000 },
        { Wallet_ID: "W2", User_ID: 1, Wallet_Name: "Vietnam Bank", Type: "Bank", Country: "Vietnam", Currency: "VND", Balance: 3000000 },
        { Wallet_ID: "W3", User_ID: 1, Wallet_Name: "USD Cash", Type: "Cash", Country: "Global", Currency: "USD", Balance: 1000 },
        { Wallet_ID: "W4", User_ID: 1, Wallet_Name: "Vietnam Cash", Type: "Cash", Country: "Vietnam", Currency: "VND", Balance: 7000000 },
        { Wallet_ID: "W5", User_ID: 1, Wallet_Name: "Korea Cash", Type: "Cash", Country: "South Korea", Currency: "KRW", Balance: 300000 }
      ],
      savings: [
        {
          Saving_ID: "S1",
          User_ID: 1,
          Bank_Name: "Korea Savings Deposit",
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
          Bank_Name: "Vietnam Savings Deposit",
          Country: "Vietnam",
          Currency: "VND",
          Principal_Amount: 200000000,
          Start_Date: "2025-09-01",
          Maturity_Date: "2026-09-01",
          Interest_Rate: 5.5
        }
      ],
      transactions: [
        { Tx_ID: "T1", User_ID: 1, Date: daysAgoStr(2), Type: "Expense", Currency: "KRW", Amount: 14500, Jar_Category: "Necessities", Wallet_ID: "W1", Is_Travel_Mode: false, Note: "GS25 & Lunch" },
        { Tx_ID: "T2", User_ID: 1, Date: daysAgoStr(5), Type: "Income", Currency: "KRW", Amount: 1850000, Jar_Category: "Income", Wallet_ID: "W1", Is_Travel_Mode: false, Note: "Part-time / Scholarship" },
        { Tx_ID: "T3", User_ID: 1, Date: daysAgoStr(9), Type: "Expense", Currency: "KRW", Amount: 450000, Jar_Category: "Necessities", Wallet_ID: "W1", Is_Travel_Mode: false, Note: "Monthly Rent (Wolse)" },
        { Tx_ID: "T4", User_ID: 1, Date: daysAgoStr(12), Type: "Expense", Currency: "KRW", Amount: 85000, Jar_Category: "Play", Wallet_ID: "W5", Is_Travel_Mode: false, Note: "Weekend Dinner" },
        { Tx_ID: "T5", User_ID: 1, Date: daysAgoStr(18), Type: "Expense", Currency: "KRW", Amount: 220000, Jar_Category: "Education", Wallet_ID: "W1", Is_Travel_Mode: false, Note: "Korean Textbooks" },
        { Tx_ID: "T6", User_ID: 1, Date: daysAgoStr(24), Type: "Expense", Currency: "USD", Amount: 20, Jar_Category: "Education", Wallet_ID: "W3", Is_Travel_Mode: false, Note: "ChatGPT Plus" }
      ],
      budgets6Jars: {
        1: [
          { name: "Necessities", pct: 45 },
          { name: "Education", pct: 15 },
          { name: "Long-Term Savings", pct: 15 },
          { name: "Play", pct: 10 },
          { name: "Investment", pct: 10 },
          { name: "Remittance / Give", pct: 5 }
        ]
      },
      goalsSubs: {
        1: {
          visaMinKRW: 10000000,
          fx50kUsedUSD: 6200,
          travelMode: { enabled: false, tripName: "Home Visit Trip", budgetKRW: 1500000 },
          goals: [
            { id: "G1", name: "Next Semester Tuition", currency: "KRW", targetAmount: 4200000, savedAmount: 1800000, deadline: "2027-02-20" },
            { id: "G2", name: "Housing Deposit (보증금)", currency: "KRW", targetAmount: 10000000, savedAmount: 3500000, deadline: "2027-08-30" }
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
    } catch (e) {}
    const seeded = createDefaultDB();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  function saveLocalDB() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.db)); } catch (e) {}
  }

  async function callGoogleScript(action, payload) {
    if (!GAS_URL) return null;
    try {
      const res = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action, payload })
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      return null;
    }
  }

  // ========================================================================
  // 3. FX & CURRENCY HELPERS
  // ========================================================================
  async function fetchLiveFX(showNotice) {
    try {
      const [fiatRes, cryptoRes] = await Promise.allSettled([
        fetch("https://open.er-api.com/v6/latest/USD"),
        fetch("https://api.coingecko.com/api/v3/simple/price?ids=tether,usd-coin&vs_currencies=usd,krw,vnd")
      ]);
      const nextRates = Object.assign({}, state.rates);
      if (fiatRes.status === "fulfilled" && fiatRes.value.ok) {
        const j = await fiatRes.value.json();
        if (j && j.rates) {
          ["KRW", "VND", "EUR", "JPY", "RUB", "UZS"].forEach(c => {
            if (j.rates[c]) nextRates[c] = j.rates[c];
          });
        }
      }
      if (cryptoRes.status === "fulfilled" && cryptoRes.value.ok) {
        const cg = await cryptoRes.value.json();
        if (cg && cg.tether && cg.tether.usd) nextRates.USDT = 1 / cg.tether.usd;
      }
      const now = new Date();
      nextRates.updatedAt = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      state.rates = nextRates;
      localStorage.setItem(FX_CACHE_KEY, JSON.stringify(nextRates));
      if (showNotice) showToast("FX & Stablecoin rates updated");
    } catch (e) {
      const cached = localStorage.getItem(FX_CACHE_KEY);
      if (cached) state.rates = JSON.parse(cached);
    }
    if (state.currentUser) renderAll();
  }

  function convertCurrency(amount, fromCurr, toCurr) {
    const val = Number(amount) || 0;
    if (fromCurr === toCurr) return val;
    return (val / (state.rates[fromCurr] || 1)) * (state.rates[toCurr] || 1);
  }

  function formatMoney(amount, curr) {
    const n = Number(amount) || 0;
    if (curr === "KRW") return "₩" + Math.round(n).toLocaleString("en-US");
    if (curr === "VND") return Math.round(n).toLocaleString("en-US") + "₫";
    if (curr === "USD") return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (curr === "USDT") return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " USDT";
    return n.toLocaleString("en-US", { maximumFractionDigits: 2 }) + " " + curr;
  }

  function userWallets() { return state.db.wallets.filter(w => Number(w.User_ID) === Number(state.currentUser.User_ID)); }
  function userSavings() { return state.db.savings.filter(s => Number(s.User_ID) === Number(state.currentUser.User_ID)); }
  function userTransactions() {
    return state.db.transactions
      .filter(t => Number(t.User_ID) === Number(state.currentUser.User_ID))
      .sort((a, b) => (b.Date || "").localeCompare(a.Date || ""));
  }
  function userJars() {
    const uid = state.currentUser.User_ID;
    if (!state.db.budgets6Jars[uid]) {
      state.db.budgets6Jars[uid] = [
        { name: "Necessities", pct: 45 },
        { name: "Education", pct: 15 },
        { name: "Long-Term Savings", pct: 15 },
        { name: "Play", pct: 10 },
        { name: "Investment", pct: 10 },
        { name: "Remittance / Give", pct: 5 }
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
        travelMode: { enabled: false, tripName: "Trip", budgetKRW: 1000000 },
        goals: [],
        subscriptions: [],
        fxAlerts: []
      };
    }
    return state.db.goalsSubs[uid];
  }

  // ========================================================================
  // 4. NAVIGATION & AUTH
  // ========================================================================
  function showScreen(id) {
    document.querySelectorAll(".screen").forEach(el => el.classList.remove("active"));
    const el = document.getElementById(id);
    if (el) el.classList.add("active");
  }

  function startLaunchSequence() {
    showScreen("screen-launch");
    setTimeout(() => {
      const launch = document.getElementById("screen-launch");
      launch.classList.add("fade-out");
      setTimeout(() => {
        launch.classList.remove("active", "fade-out");
        showScreen("screen-login");
      }, 340);
    }, 2000);
  }

  function updateHeaderTitle() {
    const map = { home: "tab_home", transfer: "tab_transfer", spend: "tab_spend", goals: "tab_goals", ai: "tab_ai" };
    const el = document.getElementById("header-tab-title");
    if (el) el.textContent = t(map[state.activeTab] || "tab_home");
  }

  function switchTab(tabName) {
    state.activeTab = tabName;
    updateHeaderTitle();
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    const panel = document.getElementById("tab-" + tabName);
    if (panel) panel.classList.add("active");
    document.querySelectorAll(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.tab === tabName));
    document.getElementById("main-scroll").scrollTop = 0;

    if (tabName === "transfer" && state.activeSubtab === "atm") setTimeout(initOrRefreshMap, 120);
    if (tabName === "transfer" && state.activeSubtab === "qr") renderMyQR();
  }

  function switchTransferSubtab(subName) {
    state.activeSubtab = subName;
    document.querySelectorAll("#transfer-subtabs .seg-btn").forEach(b => b.classList.toggle("active", b.dataset.subtab === subName));
    document.querySelectorAll(".subtab-pane").forEach(p => p.classList.remove("active"));
    const pane = document.getElementById("subtab-" + subName);
    if (pane) pane.classList.add("active");

    if (subName === "atm") setTimeout(initOrRefreshMap, 120);
    if (subName === "qr") renderMyQR();
  }

  async function handleLogin(e) {
    e.preventDefault();
    const errEl = document.getElementById("login-error");
    errEl.hidden = true;
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value;

    if (!username || !password) {
      errEl.textContent = "Please enter Username and Password.";
      errEl.hidden = false;
      return;
    }

    const remote = await callGoogleScript("login", { Username: username, Password: password });
    if (remote && remote.ok && remote.user) {
      mergeRemoteUserData(remote);
      state.currentUser = remote.user;
      enterMainApp();
      return;
    }

    const found = state.db.users.find(
      u => u.Username.toLowerCase() === username.toLowerCase() && String(u.Password) === String(password)
    );
    if (!found) {
      errEl.textContent = "Invalid username or password. (Demo: monify / 828282)";
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
      errEl.textContent = "Please fill in all 5 required fields.";
      errEl.hidden = false;
      return;
    }
    if (Password.length < 6) {
      errEl.textContent = "Password must be at least 6 characters.";
      errEl.hidden = false;
      return;
    }
    if (state.db.users.some(u => u.Username.toLowerCase() === Username.toLowerCase())) {
      errEl.textContent = "Username already exists.";
      errEl.hidden = false;
      return;
    }

    const newUser = {
      User_ID: state.db.nextUserId++,
      Username, FullName, DOB, Password, Email,
      CreatedAt: new Date().toISOString()
    };

    const remote = await callGoogleScript("register", newUser);
    if (remote && remote.ok && remote.User_ID) {
      newUser.User_ID = remote.User_ID;
      state.db.nextUserId = Math.max(state.db.nextUserId, Number(remote.User_ID) + 1);
    }

    state.db.users.push(newUser);
    state.currentUser = newUser;
    userJars();
    userMeta();
    saveLocalDB();
    showToast("Account created! User_ID #" + newUser.User_ID);
    enterMainApp();
  }

  function mergeRemoteUserData(remote) {
    const uid = Number(remote.user.User_ID);
    state.db.users = state.db.users.filter(u => Number(u.User_ID) !== uid).concat([remote.user]);
    if (Array.isArray(remote.wallets)) state.db.wallets = state.db.wallets.filter(w => Number(w.User_ID) !== uid).concat(remote.wallets);
    if (Array.isArray(remote.savings)) state.db.savings = state.db.savings.filter(s => Number(s.User_ID) !== uid).concat(remote.savings);
    if (Array.isArray(remote.transactions)) state.db.transactions = state.db.transactions.filter(t => Number(t.User_ID) !== uid).concat(remote.transactions);
    if (Array.isArray(remote.jars) && remote.jars.length === 6) state.db.budgets6Jars[uid] = remote.jars;
    if (remote.meta) state.db.goalsSubs[uid] = remote.meta;
    saveLocalDB();
  }

  function enterMainApp() {
    showScreen("screen-main");
    switchTab("home");
    renderAll();
  }

  // ========================================================================
  // 5. RENDER ALL TABS (MISA MONEY KEEPER CLEAN LISTS)
  // ========================================================================
  function renderAll() {
    if (!state.currentUser) return;
    document.getElementById("header-user-meta").textContent =
      "ID #" + state.currentUser.User_ID + " · " + state.currentUser.Username;
    document.getElementById("travel-mode-badge").hidden = !userMeta().travelMode.enabled;

    renderHome();
    renderTransfer();
    renderSpend();
    renderGoals();
    renderAI();
  }

  function renderHome() {
    const wallets = userWallets();
    const savings = userSavings();
    const base = state.baseCurrency;

    let walletSum = 0;
    wallets.forEach(w => { walletSum += convertCurrency(w.Balance, w.Currency, base); });
    let savingSum = 0;
    savings.forEach(s => { savingSum += convertCurrency(s.Principal_Amount, s.Currency, base); });
    const grandTotal = walletSum + savingSum;

    document.getElementById("fx-updated-label").textContent = "Stablecoin FX · " + state.rates.updatedAt;
    document.getElementById("total-asset-value").textContent = formatMoney(grandTotal, base);
    document.getElementById("total-asset-breakdown").textContent =
      t("wallets_lbl") + ": " + formatMoney(walletSum, base) + " · " + t("savings_lbl") + ": " + formatMoney(savingSum, base);

    document.querySelectorAll("#base-currency-pills .seg-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.curr === base);
    });

    // Wallets (Max 6)
    document.getElementById("wallet-counter").textContent = wallets.length + "/6";
    const addBtn = document.getElementById("btn-add-wallet");
    addBtn.disabled = wallets.length >= 6;
    addBtn.textContent = wallets.length >= 6 ? t("max_wallets") : t("add_wallet");

    const walletList = document.getElementById("wallet-list");
    if (wallets.length === 0) {
      walletList.innerHTML = `<p class="muted-note" style="text-align:center; padding:8px 0;">No wallets yet (max 6).</p>`;
    } else {
      walletList.innerHTML = wallets.map(w => `
        <div class="mk-row">
          <div class="mk-row-left">
            <div class="mk-icon-circle ${w.Type === "Bank" ? "bank" : ""}">${w.Currency}</div>
            <div class="mk-row-info">
              <div class="mk-row-title">${escapeHtml(w.Wallet_Name)}</div>
              <div class="mk-row-sub">${escapeHtml(w.Country)} · ${w.Type === "Bank" ? t("bank") : t("cash")}</div>
            </div>
          </div>
          <div class="mk-row-right">
            <div class="mk-row-amt data-text">${formatMoney(w.Balance, w.Currency)}</div>
            <div class="mk-row-actions">
              <button type="button" class="mini-link" data-edit-wallet="${w.Wallet_ID}">${t("edit")}</button>
              <button type="button" class="mini-link danger" data-del-wallet="${w.Wallet_ID}">${t("delete")}</button>
            </div>
          </div>
        </div>
      `).join("");
    }

    // Savings list
    const savingList = document.getElementById("saving-list");
    if (savings.length === 0) {
      savingList.innerHTML = `<p class="muted-note" style="text-align:center; padding:8px 0;">No savings deposits.</p>`;
    } else {
      savingList.innerHTML = savings.map(s => {
        const dday = calcDDay(s.Maturity_Date);
        const estInt = calcEstimatedInterest(s.Principal_Amount, s.Interest_Rate, s.Start_Date, s.Maturity_Date);
        return `
          <div class="mk-row">
            <div class="mk-row-left">
              <div class="mk-icon-circle deep">${dday.short}</div>
              <div class="mk-row-info">
                <div class="mk-row-title">${escapeHtml(s.Bank_Name)}</div>
                <div class="mk-row-sub data-text">${s.Interest_Rate}% · ${s.Maturity_Date || "No date"} · +${formatMoney(estInt, s.Currency)}</div>
              </div>
            </div>
            <div class="mk-row-right">
              <div class="mk-row-amt data-text">${formatMoney(s.Principal_Amount, s.Currency)}</div>
              <div class="mk-row-actions">
                <button type="button" class="mini-link" data-edit-saving="${s.Saving_ID}">${t("edit")}</button>
                <button type="button" class="mini-link danger" data-del-saving="${s.Saving_ID}">${t("delete")}</button>
              </div>
            </div>
          </div>
        `;
      }).join("");
    }

    // Visa Guard & $50K Radar
    const meta = userMeta();
    const totalKRW = convertCurrency(grandTotal, base, "KRW");
    const minVisa = Number(meta.visaMinKRW) || 10000000;
    const ratio = Math.min(100, Math.round((totalKRW / minVisa) * 100));
    const buffer = totalKRW - minVisa;

    document.getElementById("visa-min-display").textContent = formatMoney(minVisa, "KRW");
    document.getElementById("visa-avail-display").textContent = formatMoney(totalKRW, "KRW");
    document.getElementById("visa-progress-bar").style.width = ratio + "%";

    const visaBox = document.getElementById("visa-status-box");
    if (buffer < 0) {
      visaBox.className = "status-note warn";
      visaBox.textContent = t("visa_warn", { amt: formatMoney(Math.abs(buffer), "KRW") });
    } else if (buffer < minVisa * 0.2) {
      visaBox.className = "status-note";
      visaBox.textContent = t("visa_tight", { amt: formatMoney(buffer, "KRW") });
    } else {
      visaBox.className = "status-note";
      visaBox.textContent = t("visa_safe", { amt: formatMoney(buffer, "KRW") });
    }

    const used50k = Number(meta.fx50kUsedUSD) || 0;
    const pct50k = Math.min(100, Math.round((used50k / 50000) * 100));
    document.getElementById("fx50k-used-display").textContent = formatMoney(used50k, "USD");
    const bar50k = document.getElementById("fx50k-bar");
    bar50k.style.width = pct50k + "%";
    bar50k.className = "progress-fill " + (pct50k >= 80 ? "fill-deep" : "fill-powder");
  }

  function calcDDay(maturityStr) {
    if (!maturityStr) return { days: 999, short: "SAVE" };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.ceil((new Date(maturityStr) - today) / 86400000);
    if (diff < 0) return { days: diff, short: "END" };
    if (diff === 0) return { days: 0, short: "D-0" };
    return { days: diff, short: "D-" + diff };
  }

  function calcEstimatedInterest(p, r, s, e) {
    const principal = Number(p) || 0;
    const rate = (Number(r) || 0) / 100;
    if (!s || !e) return principal * rate;
    const days = Math.max(1, (new Date(e) - new Date(s)) / 86400000);
    return principal * rate * (days / 365);
  }

  // ------------------------------------------------------------------------
  // TAB 2: TRANSFER
  // ------------------------------------------------------------------------
  function renderTransfer() {
    const wallets = userWallets();
    const sel = document.getElementById("remit-source-wallet");
    if (wallets.length) {
      const prev = sel.value;
      sel.innerHTML = wallets.map(w => `<option value="${w.Wallet_ID}">${escapeHtml(w.Wallet_Name)} (${formatMoney(w.Balance, w.Currency)})</option>`).join("");
      if (wallets.some(w => w.Wallet_ID === prev)) sel.value = prev;
    } else {
      sel.innerHTML = `<option value="">--</option>`;
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
      { id: "stablecoin", name: "Stablecoin (USDT/USDC)", spread: 0.002, fee: fromCurr === "KRW" ? 1500 : 1, speed: "~2 min" },
      { id: "sentbe", name: "SentBe", spread: 0.007, fee: fromCurr === "KRW" ? 5000 : 3.5, speed: "5–30 min" },
      { id: "hanpass", name: "Hanpass", spread: 0.009, fee: fromCurr === "KRW" ? 5000 : 4, speed: "10–40 min" },
      { id: "wirebarley", name: "WireBarley", spread: 0.011, fee: fromCurr === "KRW" ? 4000 : 3, speed: "1–2 hrs" }
    ];

    const computed = providers.map(p => {
      const net = Math.max(0, amount - p.fee);
      return Object.assign({}, p, { receiveAmt: net * midRate * (1 - p.spread) });
    }).sort((a, b) => b.receiveAmt - a.receiveAmt);

    document.getElementById("remit-compare-list").innerHTML = computed.map((p, idx) => `
      <div class="remit-card ${idx === 0 ? "best" : ""}">
        <div class="row-between">
          <strong style="font-size:13.5px;">${p.name}</strong>
          ${idx === 0 ? `<span class="badge-pill badge-velvet">${t("best_rate")}</span>` : `<span class="small-meta data-text">${p.speed}</span>`}
        </div>
        <div class="remit-bottom">
          <div style="min-width:0;">
            <div class="remit-recv data-text">${formatMoney(p.receiveAmt, toCurr)}</div>
            <div class="small-meta data-text">Fee: ${formatMoney(p.fee, fromCurr)} · ${p.speed}</div>
          </div>
          <button type="button" class="btn ${idx === 0 ? "btn-velvet" : "btn-soft"} btn-sm" data-send-remit="${p.id}" data-remit-name="${p.name}">
            ${t("send_1tap")}
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
    if (amount <= 0) return showToast("Enter a valid amount.");

    if (wallet) wallet.Balance = Math.max(0, wallet.Balance - convertCurrency(amount, fromCurr, wallet.Currency));

    const meta = userMeta();
    meta.fx50kUsedUSD = Number(((meta.fx50kUsedUSD || 0) + convertCurrency(amount, fromCurr, "USD")).toFixed(2));

    const tx = {
      Tx_ID: "T" + Date.now(),
      User_ID: state.currentUser.User_ID,
      Date: new Date().toISOString().slice(0, 10),
      Type: "Transfer",
      Currency: fromCurr,
      Amount: amount,
      Jar_Category: "Remittance / Give",
      Wallet_ID: walletId || "",
      Is_Travel_Mode: meta.travelMode.enabled,
      Note: fromCurr + "→" + toCurr + " via " + providerName
    };
    state.db.transactions.push(tx);
    saveLocalDB();
    callGoogleScript("addTransaction", tx);
    if (wallet) callGoogleScript("upsertWallet", wallet);
    callGoogleScript("saveMeta", { User_ID: state.currentUser.User_ID, meta });
    renderAll();
    showToast("Sent " + formatMoney(amount, fromCurr) + " via " + providerName);
  }

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

    let seed = 0;
    for (let i = 0; i < payload.length; i++) seed = ((seed << 5) - seed + payload.charCodeAt(i)) | 0;

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
        if ((r < 8 && c < 8) || (r < 8 && c >= size - 8) || (r >= size - 8 && c < 8)) continue;
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
    document.getElementById("qr-converted-preview").textContent =
      "→ " + formatMoney(convertCurrency(krw, "KRW", recvCurr), recvCurr) + " (0 Fee)";
  }

  function renderSplitBill() {
    const itemsEl = document.getElementById("split-items-list");
    const settleEl = document.getElementById("split-settlement-list");

    if (state.splitItems.length === 0) {
      itemsEl.innerHTML = `<p class="muted-note">No bills added.</p>`;
      settleEl.innerHTML = `<p class="muted-note">Add at least 1 bill to calculate.</p>`;
      return;
    }

    itemsEl.innerHTML = state.splitItems.map(item => `
      <div class="mk-row">
        <div class="mk-row-info">
          <div class="mk-row-title">${escapeHtml(item.payer)} · ${escapeHtml(item.note)}</div>
        </div>
        <div class="row-gap">
          <strong class="data-text">${formatMoney(item.amount, item.currency)}</strong>
          <button type="button" class="mini-link danger" data-del-split="${item.id}">✕</button>
        </div>
      </div>
    `).join("");

    const totals = {};
    let grandKRW = 0;
    state.splitItems.forEach(item => {
      const k = convertCurrency(item.amount, item.currency, "KRW");
      grandKRW += k;
      totals[item.payer] = (totals[item.payer] || 0) + k;
    });

    const people = Object.keys(totals);
    const share = grandKRW / people.length;
    const debtors = [], creditors = [];
    people.forEach(name => {
      const diff = totals[name] - share;
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
      settleEl.innerHTML = `<div class="settle-row">All settled (${formatMoney(share, "KRW")}/person).</div>`;
    } else {
      settleEl.innerHTML = `
        <div class="small-meta data-text">Total: ${formatMoney(grandKRW, "KRW")} · Each: ${formatMoney(share, "KRW")}</div>
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
      <div class="mk-card" style="padding:12px;">
        <div class="row-between">
          <div class="mk-row-info">
            <div class="mk-row-title">${escapeHtml(s.name)}</div>
            <div class="mk-row-sub">${s.area} · ${s.hours} · ${escapeHtml(s.note)}</div>
          </div>
          <a class="btn btn-powder btn-sm" href="https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}" target="_blank" rel="noopener">
            ${t("directions")}
          </a>
        </div>
      </div>
    `).join("");
    if (state.mapInstance) updateMapMarkers(filtered);
  }

  function initOrRefreshMap() {
    const el = document.getElementById("seoul-map");
    if (!el || typeof window.L === "undefined") return;
    if (!state.mapInstance) {
      state.mapInstance = window.L.map(el, { zoomControl: false }).setView([37.551, 126.975], 12);
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OSM" }).addTo(state.mapInstance);
    } else {
      state.mapInstance.invalidateSize();
    }
    updateMapMarkers(SEOUL_SPOTS.filter(s => state.atmFilter === "all" || s.type === state.atmFilter));
  }

  function updateMapMarkers(spots) {
    state.mapMarkers.forEach(m => m.remove());
    state.mapMarkers = [];
    spots.forEach(s => {
      const m = window.L.circleMarker([s.lat, s.lng], {
        radius: 7, fillColor: s.type === "fx" ? "#531245" : "#623B70",
        color: "#FAF9F8", weight: 2, fillOpacity: 0.95
      }).addTo(state.mapInstance).bindPopup(`<strong>${s.name}</strong><br/>${s.area}`);
      state.mapMarkers.push(m);
    });
  }

  // ------------------------------------------------------------------------
  // TAB 3: SPEND
  // ------------------------------------------------------------------------
  function renderSpend() {
    const jars = userJars();
    const txs = userTransactions().filter(x => !x.Is_Travel_Mode);
    const monthlyIncomeKRW = txs.filter(x => x.Type === "Income").reduce((s, x) => s + convertCurrency(x.Amount, x.Currency, "KRW"), 0) || 2000000;

    const spentMap = {};
    txs.filter(x => x.Type !== "Income").forEach(x => {
      const k = x.Jar_Category || "Necessities";
      spentMap[k] = (spentMap[k] || 0) + convertCurrency(x.Amount, x.Currency, "KRW");
    });

    const totalPct = jars.reduce((s, j) => s + Number(j.pct), 0);
    const pctBadge = document.getElementById("jars-total-pct");
    pctBadge.textContent = totalPct + "%";
    pctBadge.className = "badge-pill data-text " + (totalPct === 100 ? "badge-powder" : "badge-deep");

    document.getElementById("jars-list").innerHTML = jars.map((jar, idx) => {
      const budget = monthlyIncomeKRW * (jar.pct / 100);
      const spent = spentMap[jar.name] || 0;
      const usedPct = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
      return `
        <div class="jar-item">
          <div class="row-between">
            <input type="text" class="jar-name-input" data-jar-name="${idx}" value="${escapeHtml(jar.name)}" />
            <span class="badge-pill ${usedPct > 90 ? "badge-deep" : "badge-thistle"} data-text">${jar.pct}%</span>
          </div>
          <input type="range" class="jar-range" min="0" max="80" step="1" value="${jar.pct}" data-jar-range="${idx}" />
          <div class="row-between small-meta data-text">
            <span>${formatMoney(spent, "KRW")}</span>
            <span>/ ${formatMoney(budget, "KRW")}</span>
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
    const days = { "1W": 7, "1M": 30, "3M": 90, "6M": 180, "1Y": 365 }[period] || 30;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const inP = normalTxs.filter(x => new Date(x.Date) >= cutoff);
    const realInc = inP.filter(x => x.Type === "Income").reduce((s, x) => s + convertCurrency(x.Amount, x.Currency, "KRW"), 0);
    const realExp = inP.filter(x => x.Type !== "Income").reduce((s, x) => s + convertCurrency(x.Amount, x.Currency, "KRW"), 0);

    const labelsMap = {
      "1W": ["Mon", "Wed", "Fri", "Sat", "Sun"],
      "1M": ["W1", "W2", "W3", "W4", "Now"],
      "3M": ["M-2", "M-1", "Mid", "Late", "Now"],
      "6M": ["M-5", "M-4", "M-3", "M-2", "Now"],
      "1Y": ["Q1", "Q2", "Q3", "Q4", "Now"]
    };
    const mult = { "1W": 0.25, "1M": 1, "3M": 2.8, "6M": 5.5, "1Y": 11 }[period] || 1;
    const incS = [1650000, 1750000, 1700000, 1800000, Math.max(realInc, 1850000)].map((v, i) => i === 4 ? v : Math.round(v * mult * 0.22));
    const expS = [920000, 1180000, 860000, 1490000, Math.max(realExp, 797000)].map((v, i) => i === 4 ? v : Math.round(v * mult * 0.22));

    const totInc = incS.reduce((a, b) => a + b, 0);
    const totExp = expS.reduce((a, b) => a + b, 0);
    const avgExp = totExp / expS.length;
    const maxV = Math.max(...incS, ...expS, 1);

    document.getElementById("cf-income-val").textContent = formatMoney(totInc, "KRW");
    document.getElementById("cf-expense-val").textContent = formatMoney(totExp, "KRW");
    document.getElementById("cf-net-val").textContent = formatMoney(totInc - totExp, "KRW");

    let spikeLbl = "";
    const bars = labelsMap[period].map((lbl, idx) => {
      const x = 18 + idx * 66;
      const hI = Math.max(8, Math.round((incS[idx] / maxV) * 94));
      const hE = Math.max(8, Math.round((expS[idx] / maxV) * 94));
      const spike = expS[idx] > avgExp * 1.18;
      if (spike) spikeLbl = lbl;
      return `
        <rect x="${x}" y="${108 - hI}" width="18" height="${hI}" rx="4" fill="#AAAAFF" />
        <rect x="${x + 22}" y="${108 - hE}" width="18" height="${hE}" rx="4" fill="${spike ? "#531245" : "#623B70"}" />
        <text x="${x + 20}" y="128" text-anchor="middle" font-size="10" fill="#150811" font-family="Arial Narrow, sans-serif">${lbl}</text>
      `;
    }).join("");

    document.getElementById("cashflow-chart").innerHTML = `
      <svg viewBox="0 0 350 138" width="100%" height="138">
        <line x1="10" y1="108" x2="340" y2="108" stroke="#BEB8CD" stroke-width="1" />
        ${bars}
      </svg>
    `;

    document.getElementById("cashflow-spike-badge").hidden = !spikeLbl;
    document.getElementById("cashflow-insight-text").textContent = spikeLbl
      ? `Spending at "${spikeLbl}" exceeded period average (${formatMoney(avgExp, "KRW")}).`
      : "Spending stays within normal average.";
  }

  function renderRecentTransactions() {
    const txs = userTransactions();
    document.getElementById("tx-count-label").textContent = String(txs.length);
    const list = document.getElementById("tx-list");
    if (txs.length === 0) {
      list.innerHTML = `<p class="muted-note">No records yet.</p>`;
      return;
    }
    list.innerHTML = txs.slice(0, 8).map(x => `
      <div class="mk-row">
        <div class="mk-row-info">
          <div class="mk-row-title">${escapeHtml(x.Note || x.Jar_Category)} ${x.Is_Travel_Mode ? '<span class="badge-pill badge-deep">Travel</span>' : ''}</div>
          <div class="mk-row-sub data-text">${x.Date} · ${escapeHtml(x.Jar_Category)}</div>
        </div>
        <div class="mk-row-amt data-text ${x.Type === "Income" ? "income" : "expense"}">
          ${x.Type === "Income" ? "+" : "-"}${formatMoney(x.Amount, x.Currency)}
        </div>
      </div>
    `).join("");
  }

  function renderSubscriptions() {
    const subs = userMeta().subscriptions || [];
    const totalKRW = subs.reduce((s, x) => s + convertCurrency(x.amount, x.currency, "KRW"), 0);
    document.getElementById("subs-monthly-total").textContent = formatMoney(totalKRW, "KRW");

    const today = new Date().getDate();
    const list = document.getElementById("subs-list");
    if (subs.length === 0) {
      list.innerHTML = `<p class="muted-note">No subscriptions.</p>`;
      return;
    }
    list.innerHTML = subs.map(s => {
      const diff = (Number(s.billingDay) - today + 31) % 31;
      const is24h = diff === 0 || diff === 1;
      return `
        <div class="mk-row">
          <div class="mk-row-info">
            <div class="mk-row-title">${escapeHtml(s.name)} ${is24h ? '<span class="badge-pill badge-deep">24h</span>' : ''}</div>
            <div class="mk-row-sub data-text">Day ${s.billingDay} · ${formatMoney(s.amount, s.currency)}</div>
          </div>
          <button type="button" class="mini-link danger" data-del-sub="${s.id}">${t("cancel")}</button>
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
    document.getElementById("toggle-travel-mode").checked = !!tm.enabled;
    document.getElementById("travel-mode-details").hidden = !tm.enabled;
    document.getElementById("travel-trip-name").value = tm.tripName || "";
    document.getElementById("travel-budget-krw").value = tm.budgetKRW || 1500000;

    const spentKRW = userTransactions().filter(x => x.Is_Travel_Mode && x.Type !== "Income")
      .reduce((s, x) => s + convertCurrency(x.Amount, x.Currency, "KRW"), 0);
    const budget = Number(tm.budgetKRW) || 1;
    document.getElementById("travel-spent-display").textContent = formatMoney(spentKRW, "KRW");
    document.getElementById("travel-remain-display").textContent = formatMoney(Math.max(0, budget - spentKRW), "KRW");
    document.getElementById("travel-progress-bar").style.width = Math.min(100, Math.round((spentKRW / budget) * 100)) + "%";

    const goals = meta.goals || [];
    const list = document.getElementById("goals-list");
    if (goals.length === 0) {
      list.innerHTML = `<p class="muted-note">No goals yet.</p>`;
      return;
    }
    list.innerHTML = goals.map(g => {
      const remain = Math.max(0, Number(g.targetAmount) - Number(g.savedAmount));
      const months = Math.max(1, Math.ceil((new Date(g.deadline) - new Date()) / 2592000000));
      const perMo = remain / months;
      const pct = Math.min(100, Math.round((Number(g.savedAmount) / Math.max(1, Number(g.targetAmount))) * 100));
      const usdtBatch = convertCurrency(perMo / 2, g.currency, "USDT");
      return `
        <div class="goal-item">
          <div class="row-between">
            <div class="mk-row-title">${escapeHtml(g.name)}</div>
            <span class="badge-pill badge-velvet data-text">${pct}%</span>
          </div>
          <div class="row-between small-meta data-text">
            <span>${formatMoney(g.savedAmount, g.currency)} / ${formatMoney(g.targetAmount, g.currency)}</span>
            <span>${g.deadline}</span>
          </div>
          <div class="progress-track"><div class="progress-fill fill-velvet" style="width:${pct}%;"></div></div>
          <div class="hedge-box data-text">
            Save <strong>${formatMoney(perMo, g.currency)}/mo</strong> · Auto-hedge <strong>${formatMoney(usdtBatch, "USDT")}</strong> bi-weekly.
          </div>
          <div class="row-between">
            <button type="button" class="mini-link" data-topup-goal="${g.id}">${t("topup")}</button>
            <button type="button" class="mini-link danger" data-del-goal="${g.id}">${t("delete")}</button>
          </div>
        </div>
      `;
    }).join("");
  }

  // ------------------------------------------------------------------------
  // TAB 5: AI ASSISTANT
  // ------------------------------------------------------------------------
  function renderAI() {
    const wallets = userWallets();
    const savings = userSavings();
    const meta = userMeta();
    const jars = userJars();

    const wKRW = wallets.reduce((s, w) => s + convertCurrency(w.Balance, w.Currency, "KRW"), 0);
    const sKRW = savings.reduce((s, sv) => s + convertCurrency(sv.Principal_Amount, sv.Currency, "KRW"), 0);
    const totalKRW = wKRW + sKRW;

    const scoreSav = Math.min(35, Math.round((totalKRW > 0 ? sKRW / totalKRW : 0) * 45));
    const visaMin = Number(meta.visaMinKRW) || 10000000;
    const scoreVisa = totalKRW >= visaMin * 1.2 ? 35 : totalKRW >= visaMin ? 28 : Math.round((totalKRW / visaMin) * 22);
    const scoreJars = jars.reduce((s, j) => s + Number(j.pct), 0) === 100 ? 28 : 16;
    const total = Math.max(0, Math.min(100, scoreSav + scoreVisa + scoreJars));

    document.getElementById("health-score-num").textContent = total;
    document.getElementById("health-grade-pill").textContent = total >= 85 ? "Strong" : total >= 70 ? "Good" : "Watch";
    document.getElementById("health-ring-circle").setAttribute("stroke-dashoffset", String(302 - (total / 100) * 302));

    document.getElementById("health-breakdown").innerHTML = `
      <div class="metric-line"><span>Savings Ratio</span><strong>${scoreSav}/35</strong></div>
      <div class="metric-line"><span>Visa Safety</span><strong>${scoreVisa}/35</strong></div>
      <div class="metric-line"><span>6 Jars Rule</span><strong>${scoreJars}/30</strong></div>
    `;

    const tips = [
      totalKRW < visaMin * 1.15
        ? "Keep liquid balance at least 15% above your Visa minimum (" + formatMoney(visaMin, "KRW") + ")."
        : "Visa reserve is safe. Consider hedging spare KRW into USDT for upcoming goals.",
      "Review your " + (meta.subscriptions ? meta.subscriptions.length : 0) + " recurring KRW/USD subscriptions before renewal."
    ];
    document.getElementById("ai-weekly-tips").innerHTML = tips.map(x => `<li>${x}</li>`).join("");

    const alerts = meta.fxAlerts || [];
    const alertsEl = document.getElementById("fx-alerts-list");
    if (alerts.length === 0) {
      alertsEl.innerHTML = `<p class="muted-note">No FX alerts set.</p>`;
    } else {
      alertsEl.innerHTML = alerts.map(al => {
        const [f, to] = al.pair.split("_");
        const live = convertCurrency(1, f, to);
        const reached = (al.pair === "KRW_VND" && live >= al.target) || (al.pair !== "KRW_VND" && live <= al.target);
        return `
          <div class="mk-row">
            <div class="mk-row-info">
              <div class="mk-row-title data-text">1 ${f} → ${to} | Target: ${al.target}</div>
              <div class="mk-row-sub data-text">Live: <strong>${live.toFixed(2)}</strong></div>
            </div>
            <div class="row-gap">
              <span class="badge-pill ${reached ? "badge-deep" : "badge-thistle"}">${reached ? "Hit" : "Watch"}</span>
              <button type="button" class="mini-link danger" data-del-alert="${al.id}">✕</button>
            </div>
          </div>
        `;
      }).join("");
    }
  }

  // ========================================================================
  // 6. MODALS (ACCOUNT WITH LANGUAGE SWITCHER — NO MANUAL SHEET INPUT)
  // ========================================================================
  function openModal(title, html) {
    document.getElementById("modal-title").textContent = title;
    document.getElementById("modal-body").innerHTML = html;
    document.getElementById("modal-backdrop").hidden = false;
  }
  function closeModal() { document.getElementById("modal-backdrop").hidden = true; }

  function openSettingsModal() {
    openModal(t("account_modal"), `
      <div class="mk-card" style="box-shadow:none;">
        <div class="mk-row-title">${escapeHtml(state.currentUser.FullName)}</div>
        <div class="small-meta data-text">User_ID: #${state.currentUser.User_ID} · @${escapeHtml(state.currentUser.Username)}</div>
        <div class="small-meta">${escapeHtml(state.currentUser.Email || "")}</div>
        <div style="margin-top:8px;">
          <span class="badge-pill badge-velvet">${t("sheets_connected")}</span>
        </div>
      </div>

      <div class="field">
        <label for="modal-lang-select">${t("app_language")}</label>
        <select id="modal-lang-select">
          <option value="en" ${state.lang === "en" ? "selected" : ""}>English (Default)</option>
          <option value="ko" ${state.lang === "ko" ? "selected" : ""}>한국어 (Korean)</option>
          <option value="vi" ${state.lang === "vi" ? "selected" : ""}>Tiếng Việt (Vietnamese)</option>
        </select>
      </div>

      <div class="grid-2" style="margin-top:4px;">
        <button type="button" class="btn btn-soft btn-sm btn-full" id="btn-reset-demo">${t("reset_demo")}</button>
        <button type="button" class="btn btn-deep btn-sm btn-full" id="btn-logout">${t("logout")}</button>
      </div>
    `);

    document.getElementById("modal-lang-select").onchange = (e) => {
      setLanguage(e.target.value);
      openSettingsModal();
      showToast("Language updated");
    };

    document.getElementById("btn-reset-demo").onclick = () => {
      localStorage.removeItem(STORAGE_KEY);
      state.db = loadLocalDB();
      state.currentUser = state.db.users[0];
      closeModal();
      renderAll();
      showToast("Demo data restored");
    };

    document.getElementById("btn-logout").onclick = () => {
      state.currentUser = null;
      closeModal();
      document.getElementById("login-password").value = "";
      showScreen("screen-login");
    };
  }

  function openWalletModal(editId) {
    const existing = editId ? state.db.wallets.find(w => w.Wallet_ID === editId) : null;
    if (!existing && userWallets().length >= 6) return showToast("Maximum 6/6 wallets reached.");

    openModal(existing ? "Edit Wallet" : "Add Wallet", `
      <form id="modal-wallet-form" class="stack-list">
        <div class="field">
          <label>Wallet Name *</label>
          <input name="Wallet_Name" required value="${existing ? escapeHtml(existing.Wallet_Name) : ""}" placeholder="e.g. KakaoBank" />
        </div>
        <div class="grid-2">
          <div class="field">
            <label>Type</label>
            <select name="Type">
              <option value="Bank" ${existing && existing.Type === "Bank" ? "selected" : ""}>Bank</option>
              <option value="Cash" ${existing && existing.Type === "Cash" ? "selected" : ""}>Cash</option>
            </select>
          </div>
          <div class="field">
            <label>Country</label>
            <input name="Country" required value="${existing ? escapeHtml(existing.Country) : "South Korea"}" />
          </div>
        </div>
        <div class="grid-2">
          <div class="field">
            <label>Currency</label>
            <select name="Currency">
              ${["KRW", "VND", "USD", "USDT", "EUR", "JPY", "RUB", "UZS"].map(c => `<option value="${c}" ${existing && existing.Currency === c ? "selected" : ""}>${c}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label>Balance *</label>
            <input name="Balance" type="number" step="any" required class="data-text" value="${existing ? existing.Balance : 0}" />
          </div>
        </div>
        <button type="submit" class="btn btn-velvet btn-full">Save Wallet</button>
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
      if (existing) Object.assign(existing, data);
      else state.db.wallets.push(data);
      saveLocalDB();
      callGoogleScript("upsertWallet", data);
      closeModal();
      renderAll();
      showToast("Wallet saved");
    };
  }

  function openSavingModal(editId) {
    const existing = editId ? state.db.savings.find(s => s.Saving_ID === editId) : null;
    openModal(existing ? "Edit Savings" : "Add Savings Deposit", `
      <form id="modal-saving-form" class="stack-list">
        <div class="field">
          <label>Bank / Deposit Name *</label>
          <input name="Bank_Name" required value="${existing ? escapeHtml(existing.Bank_Name) : ""}" />
        </div>
        <div class="grid-2">
          <div class="field">
            <label>Country</label>
            <input name="Country" required value="${existing ? escapeHtml(existing.Country) : "South Korea"}" />
          </div>
          <div class="field">
            <label>Currency</label>
            <select name="Currency">
              ${["KRW", "VND", "USD"].map(c => `<option value="${c}" ${existing && existing.Currency === c ? "selected" : ""}>${c}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="grid-2">
          <div class="field">
            <label>Principal *</label>
            <input name="Principal_Amount" type="number" step="any" required class="data-text" value="${existing ? existing.Principal_Amount : 0}" />
          </div>
          <div class="field">
            <label>Interest (%/yr)</label>
            <input name="Interest_Rate" type="number" step="0.1" required class="data-text" value="${existing ? existing.Interest_Rate : 3.5}" />
          </div>
        </div>
        <div class="grid-2">
          <div class="field">
            <label>Start Date</label>
            <input name="Start_Date" type="date" value="${existing ? existing.Start_Date : new Date().toISOString().slice(0, 10)}" />
          </div>
          <div class="field">
            <label>Maturity Date</label>
            <input name="Maturity_Date" type="date" value="${existing ? existing.Maturity_Date : ""}" />
          </div>
        </div>
        <button type="submit" class="btn btn-velvet btn-full">Save Deposit</button>
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
      showToast("Savings saved");
    };
  }

  function openAddTxModal(prefill) {
    const wallets = userWallets();
    const jars = userJars();
    const p = prefill || {};
    const isTravel = p.Is_Travel_Mode !== undefined ? p.Is_Travel_Mode : userMeta().travelMode.enabled;

    openModal(isTravel ? "Log Travel Expense" : "Add Transaction", `
      <form id="modal-tx-form" class="stack-list">
        <div class="grid-2">
          <div class="field">
            <label>Type</label>
            <select name="Type">
              <option value="Expense" ${p.Type !== "Income" ? "selected" : ""}>Expense</option>
              <option value="Income" ${p.Type === "Income" ? "selected" : ""}>Income</option>
            </select>
          </div>
          <div class="field">
            <label>Date</label>
            <input name="Date" type="date" value="${p.Date || new Date().toISOString().slice(0, 10)}" />
          </div>
        </div>
        <div class="grid-2">
          <div class="field">
            <label>Amount *</label>
            <input name="Amount" type="number" step="any" required class="data-text" value="${p.Amount || ""}" />
          </div>
          <div class="field">
            <label>Currency</label>
            <select name="Currency">
              ${["KRW", "VND", "USD", "USDT"].map(c => `<option value="${c}" ${p.Currency === c ? "selected" : ""}>${c}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="grid-2">
          <div class="field">
            <label>6 Jars Category</label>
            <select name="Jar_Category">
              ${jars.map(j => `<option value="${escapeHtml(j.name)}" ${p.Jar_Category === j.name ? "selected" : ""}>${escapeHtml(j.name)}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label>Wallet</label>
            <select name="Wallet_ID">
              ${wallets.map(w => `<option value="${w.Wallet_ID}">${escapeHtml(w.Wallet_Name)}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="field">
          <label>Note</label>
          <input name="Note" type="text" value="${escapeHtml(p.Note || "")}" placeholder="e.g. Coffee / Groceries" />
        </div>
        <button type="submit" class="btn btn-velvet btn-full">Save Record</button>
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
        Jar_Category: fd.get("Type") === "Income" ? "Income" : fd.get("Jar_Category"),
        Wallet_ID: fd.get("Wallet_ID"),
        Is_Travel_Mode: !!isTravel,
        Note: fd.get("Note").trim() || fd.get("Jar_Category")
      };
      const w = state.db.wallets.find(x => x.Wallet_ID === tx.Wallet_ID);
      if (w) {
        const delta = convertCurrency(tx.Amount, tx.Currency, w.Currency);
        w.Balance = tx.Type === "Income" ? w.Balance + delta : Math.max(0, w.Balance - delta);
        callGoogleScript("upsertWallet", w);
      }
      state.db.transactions.push(tx);
      saveLocalDB();
      callGoogleScript("addTransaction", tx);
      closeModal();
      renderAll();
      showToast("Record saved");
    };
  }

  function openOCRModal() {
    openModal("AI Multilingual Receipt Scanner", `
      <div class="scan-zone">
        <div id="ocr-laser" class="scan-laser" hidden></div>
        <p style="margin:0 0 8px; font-weight:700;">Upload or snap receipt (KR / EN / VI)</p>
        <input type="file" id="ocr-file-input" accept="image/*" style="font-size:12px; max-width:100%;" />
        <p class="muted-note" id="ocr-status-msg">Or tap a sample receipt below to test instantly.</p>
      </div>
      <div class="stack-list-tight">
        <button type="button" class="btn btn-soft btn-sm btn-full" data-ocr-sample="kr">Sample KR: GS25 편의점 (₩12,400)</button>
        <button type="button" class="btn btn-soft btn-sm btn-full" data-ocr-sample="en">Sample EN: Starbucks Coffee ($6.50)</button>
        <button type="button" class="btn btn-soft btn-sm btn-full" data-ocr-sample="vi">Sample VI: Pho Thin (85,000₫)</button>
      </div>
    `);

    const run = (sample) => {
      document.getElementById("ocr-laser").hidden = false;
      document.getElementById("ocr-status-msg").textContent = "AI extracting amount, currency & jar...";
      setTimeout(() => { openAddTxModal(sample); showToast("Receipt extracted!"); }, 850);
    };

    document.getElementById("ocr-file-input").onchange = (e) => {
      const f = e.target.files[0];
      if (f) run({ Type: "Expense", Amount: 18500, Currency: "KRW", Jar_Category: "Necessities", Note: "Receipt (" + f.name.slice(0, 14) + ")" });
    };
    document.querySelectorAll("[data-ocr-sample]").forEach(btn => {
      btn.onclick = () => {
        const m = {
          kr: { Type: "Expense", Amount: 12400, Currency: "KRW", Jar_Category: "Necessities", Note: "GS25 편의점 (AI OCR)" },
          en: { Type: "Expense", Amount: 6.5, Currency: "USD", Jar_Category: "Play", Note: "Starbucks (AI OCR)" },
          vi: { Type: "Expense", Amount: 85000, Currency: "VND", Jar_Category: "Necessities", Note: "Pho Thin (AI OCR)" }
        };
        run(m[btn.dataset.ocrSample]);
      };
    });
  }

  function openGoalModal() {
    openModal("New Financial Goal", `
      <form id="modal-goal-form" class="stack-list">
        <div class="field"><label>Goal Name *</label><input name="name" required placeholder="e.g. Tuition / Deposit" /></div>
        <div class="grid-2">
          <div class="field"><label>Target *</label><input name="targetAmount" type="number" required class="data-text" /></div>
          <div class="field"><label>Currency</label><select name="currency"><option value="KRW">KRW</option><option value="USD">USD</option><option value="VND">VND</option></select></div>
        </div>
        <div class="grid-2">
          <div class="field"><label>Saved</label><input name="savedAmount" type="number" value="0" class="data-text" /></div>
          <div class="field"><label>Deadline *</label><input name="deadline" type="date" required value="2027-06-01" /></div>
        </div>
        <button type="submit" class="btn btn-velvet btn-full">Create Goal</button>
      </form>
    `);
    document.getElementById("modal-goal-form").onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const meta = userMeta();
      meta.goals.push({
        id: "G" + Date.now(), name: fd.get("name").trim(),
        targetAmount: Number(fd.get("targetAmount")) || 0,
        savedAmount: Number(fd.get("savedAmount")) || 0,
        currency: fd.get("currency"), deadline: fd.get("deadline")
      });
      saveLocalDB();
      callGoogleScript("saveMeta", { User_ID: state.currentUser.User_ID, meta });
      closeModal();
      renderGoals();
      showToast("Goal created");
    };
  }

  function openSubModal() {
    openModal("Add Subscription", `
      <form id="modal-sub-form" class="stack-list">
        <div class="field"><label>Service Name *</label><input name="name" required placeholder="e.g. YouTube Premium" /></div>
        <div class="grid-2">
          <div class="field"><label>Monthly Price *</label><input name="amount" type="number" step="any" required class="data-text" /></div>
          <div class="field"><label>Currency</label><select name="currency"><option value="KRW">KRW</option><option value="USD">USD</option></select></div>
        </div>
        <div class="field"><label>Billing Day (1–31)</label><input name="billingDay" type="number" min="1" max="31" value="10" class="data-text" /></div>
        <button type="submit" class="btn btn-velvet btn-full">Save Subscription</button>
      </form>
    `);
    document.getElementById("modal-sub-form").onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const meta = userMeta();
      meta.subscriptions.push({
        id: "SUB" + Date.now(), name: fd.get("name").trim(),
        amount: Number(fd.get("amount")) || 0, currency: fd.get("currency"),
        billingDay: Number(fd.get("billingDay")) || 1, remind24h: true
      });
      saveLocalDB();
      callGoogleScript("saveMeta", { User_ID: state.currentUser.User_ID, meta });
      closeModal();
      renderAll();
      showToast("Subscription added");
    };
  }

  // ========================================================================
  // 7. UTILITIES & EVENT BINDINGS
  // ========================================================================
  function escapeHtml(str) {
    return String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  let toastTimer = null;
  function showToast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 2600);
  }

  function bindEvents() {
    document.getElementById("auth-lang-select").addEventListener("change", (e) => setLanguage(e.target.value));

    document.querySelectorAll("[data-toggle-pw]").forEach(btn => {
      btn.addEventListener("click", () => {
        const inp = document.getElementById(btn.dataset.togglePw);
        inp.type = inp.type === "password" ? "text" : "password";
      });
    });

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

    document.getElementById("btn-refresh-fx").addEventListener("click", () => fetchLiveFX(true));
    document.getElementById("btn-open-settings").addEventListener("click", openSettingsModal);

    document.querySelectorAll(".nav-item").forEach(btn => btn.addEventListener("click", () => switchTab(btn.dataset.tab)));

    document.querySelectorAll("#base-currency-pills .seg-btn").forEach(btn => {
      btn.addEventListener("click", () => { state.baseCurrency = btn.dataset.curr; renderHome(); });
    });

    document.getElementById("btn-toggle-hero-grad").addEventListener("click", () => {
      state.heroDarkGrad = !state.heroDarkGrad;
      document.getElementById("hero-asset-card").classList.toggle("hero-dark-grad", state.heroDarkGrad);
    });

    document.getElementById("btn-add-wallet").addEventListener("click", () => openWalletModal(null));
    document.getElementById("btn-add-saving").addEventListener("click", () => openSavingModal(null));

    document.getElementById("btn-edit-visa").addEventListener("click", () => {
      const meta = userMeta();
      openModal(t("visa_guard"), `
        <form id="modal-visa-form" class="stack-list">
          <div class="field"><label>Minimum Lock (KRW)</label><input name="visaMin" type="number" step="100000" required class="data-text" value="${meta.visaMinKRW}" /></div>
          <button type="submit" class="btn btn-velvet btn-full">Save</button>
        </form>
      `);
      document.getElementById("modal-visa-form").onsubmit = (e) => {
        e.preventDefault();
        meta.visaMinKRW = Number(new FormData(e.target).get("visaMin")) || 10000000;
        saveLocalDB();
        callGoogleScript("saveMeta", { User_ID: state.currentUser.User_ID, meta });
        closeModal();
        renderAll();
      };
    });

    document.getElementById("btn-edit-fx50k").addEventListener("click", () => {
      const meta = userMeta();
      openModal(t("fx50k_radar"), `
        <form id="modal-50k-form" class="stack-list">
          <div class="field"><label>Transferred this year (USD)</label><input name="used50k" type="number" step="100" required class="data-text" value="${meta.fx50kUsedUSD}" /></div>
          <button type="submit" class="btn btn-velvet btn-full">Save</button>
        </form>
      `);
      document.getElementById("modal-50k-form").onsubmit = (e) => {
        e.preventDefault();
        meta.fx50kUsedUSD = Number(new FormData(e.target).get("used50k")) || 0;
        saveLocalDB();
        callGoogleScript("saveMeta", { User_ID: state.currentUser.User_ID, meta });
        closeModal();
        renderHome();
      };
    });

    // Delegated clicks
    document.getElementById("main-scroll").addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      if (btn.dataset.editWallet) return openWalletModal(btn.dataset.editWallet);
      if (btn.dataset.delWallet) {
        state.db.wallets = state.db.wallets.filter(w => w.Wallet_ID !== btn.dataset.delWallet);
        saveLocalDB(); callGoogleScript("deleteWallet", { Wallet_ID: btn.dataset.delWallet });
        return renderAll();
      }
      if (btn.dataset.editSaving) return openSavingModal(btn.dataset.editSaving);
      if (btn.dataset.delSaving) {
        state.db.savings = state.db.savings.filter(s => s.Saving_ID !== btn.dataset.delSaving);
        saveLocalDB(); callGoogleScript("deleteSaving", { Saving_ID: btn.dataset.delSaving });
        return renderAll();
      }
      if (btn.dataset.sendRemit) return executeRemittance(btn.dataset.remitName);
      if (btn.dataset.delSplit) {
        state.splitItems = state.splitItems.filter(x => x.id !== btn.dataset.delSplit);
        return renderSplitBill();
      }
      if (btn.dataset.delSub) {
        const meta = userMeta();
        meta.subscriptions = meta.subscriptions.filter(s => s.id !== btn.dataset.delSub);
        saveLocalDB(); callGoogleScript("saveMeta", { User_ID: state.currentUser.User_ID, meta });
        return renderAll();
      }
      if (btn.dataset.delGoal) {
        const meta = userMeta();
        meta.goals = meta.goals.filter(g => g.id !== btn.dataset.delGoal);
        saveLocalDB(); callGoogleScript("saveMeta", { User_ID: state.currentUser.User_ID, meta });
        return renderGoals();
      }
      if (btn.dataset.topupGoal) {
        const meta = userMeta();
        const g = meta.goals.find(x => x.id === btn.dataset.topupGoal);
        if (g) {
          g.savedAmount = Number(g.savedAmount) + Math.round(Number(g.targetAmount) * 0.1);
          saveLocalDB(); callGoogleScript("saveMeta", { User_ID: state.currentUser.User_ID, meta });
          renderGoals();
        }
        return;
      }
      if (btn.dataset.delAlert) {
        const meta = userMeta();
        meta.fxAlerts = meta.fxAlerts.filter(a => a.id !== btn.dataset.delAlert);
        saveLocalDB(); callGoogleScript("saveMeta", { User_ID: state.currentUser.User_ID, meta });
        return renderAI();
      }
    });

    document.querySelectorAll("#transfer-subtabs .seg-btn").forEach(btn => btn.addEventListener("click", () => switchTransferSubtab(btn.dataset.subtab)));
    document.getElementById("remit-amount").addEventListener("input", renderRemittanceComparison);
    document.getElementById("remit-pair").addEventListener("change", renderRemittanceComparison);
    document.getElementById("qr-send-amount").addEventListener("input", updateQRPreview);
    document.getElementById("qr-recv-curr").addEventListener("change", updateQRPreview);

    document.getElementById("btn-simulate-qr-send").addEventListener("click", () => {
      const krw = Number(document.getElementById("qr-send-amount").value) || 0;
      const toUser = document.getElementById("qr-recipient").value.trim() || "friend";
      const recvCurr = document.getElementById("qr-recv-curr").value;
      if (krw <= 0) return showToast("Enter valid KRW amount");
      const w = userWallets().find(x => x.Currency === "KRW") || userWallets()[0];
      if (w) w.Balance = Math.max(0, w.Balance - convertCurrency(krw, "KRW", w.Currency));
      const tx = {
        Tx_ID: "T" + Date.now(), User_ID: state.currentUser.User_ID,
        Date: new Date().toISOString().slice(0, 10), Type: "Transfer", Currency: "KRW", Amount: krw,
        Jar_Category: "Play", Wallet_ID: w ? w.Wallet_ID : "", Is_Travel_Mode: userMeta().travelMode.enabled,
        Note: "QR to @" + toUser + " (" + recvCurr + ")"
      };
      state.db.transactions.push(tx);
      saveLocalDB(); callGoogleScript("addTransaction", tx);
      renderAll();
      showToast("Sent " + formatMoney(krw, "KRW") + " to @" + toUser);
    });

    document.getElementById("btn-add-split-item").addEventListener("click", () => {
      const payer = document.getElementById("split-payer").value.trim();
      const amount = Number(document.getElementById("split-amount").value) || 0;
      const currency = document.getElementById("split-curr").value;
      const note = document.getElementById("split-note").value.trim() || "Shared item";
      if (!payer || amount <= 0) return showToast("Enter payer & amount");
      state.splitItems.push({ id: "sp" + Date.now(), payer, amount, currency, note });
      document.getElementById("split-payer").value = "";
      document.getElementById("split-amount").value = "";
      document.getElementById("split-note").value = "";
      renderSplitBill();
    });
    document.getElementById("btn-reset-split").addEventListener("click", () => { state.splitItems = []; renderSplitBill(); });

    document.querySelectorAll("#atm-filter-pills .seg-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        state.atmFilter = btn.dataset.atmFilter;
        document.querySelectorAll("#atm-filter-pills .seg-btn").forEach(b => b.classList.toggle("active", b === btn));
        renderATMList();
      });
    });

    document.getElementById("btn-open-add-tx").addEventListener("click", () => openAddTxModal());
    document.getElementById("btn-open-ocr").addEventListener("click", openOCRModal);
    document.getElementById("btn-add-sub").addEventListener("click", openSubModal);

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
        else { j.pct = Math.round((j.pct / sum) * 100); acc += j.pct; }
      });
      renderSpend();
    });

    document.getElementById("btn-save-jars").addEventListener("click", () => {
      const jars = userJars();
      if (jars.reduce((s, j) => s + Number(j.pct), 0) !== 100) return showToast("Total must equal 100%");
      saveLocalDB(); callGoogleScript("saveJars", { User_ID: state.currentUser.User_ID, jars });
      renderAI(); showToast("6 Jars saved");
    });

    document.querySelectorAll("#cashflow-period-pills .seg-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        state.cashflowPeriod = btn.dataset.period;
        document.querySelectorAll("#cashflow-period-pills .seg-btn").forEach(b => b.classList.toggle("active", b === btn));
        renderSpend();
      });
    });

    document.getElementById("toggle-travel-mode").addEventListener("change", (e) => {
      const meta = userMeta();
      meta.travelMode.enabled = e.target.checked;
      saveLocalDB(); callGoogleScript("saveMeta", { User_ID: state.currentUser.User_ID, meta });
      renderAll();
    });
    document.getElementById("travel-trip-name").addEventListener("change", (e) => { userMeta().travelMode.tripName = e.target.value; saveLocalDB(); });
    document.getElementById("travel-budget-krw").addEventListener("change", (e) => { userMeta().travelMode.budgetKRW = Number(e.target.value) || 1000000; saveLocalDB(); renderGoals(); });
    document.getElementById("btn-add-travel-tx").addEventListener("click", () => openAddTxModal({ Is_Travel_Mode: true, Jar_Category: "Travel" }));
    document.getElementById("btn-add-goal").addEventListener("click", openGoalModal);

    document.getElementById("btn-add-fx-alert").addEventListener("click", () => {
      const pair = document.getElementById("alert-pair").value;
      const target = Number(document.getElementById("alert-target").value);
      if (!target || target <= 0) return showToast("Enter valid target rate");
      const meta = userMeta();
      meta.fxAlerts.push({ id: "AL" + Date.now(), pair, target });
      document.getElementById("alert-target").value = "";
      saveLocalDB(); callGoogleScript("saveMeta", { User_ID: state.currentUser.User_ID, meta });
      renderAI(); showToast("FX alert added");
    });

    document.getElementById("modal-close").addEventListener("click", closeModal);
    document.getElementById("modal-backdrop").addEventListener("click", (e) => { if (e.target.id === "modal-backdrop") closeModal(); });
  }

  document.addEventListener("DOMContentLoaded", () => {
    state.db = loadLocalDB();
    applyStaticI18n();
    bindEvents();
    startLaunchSequence();
    fetchLiveFX(false);
    setInterval(() => fetchLiveFX(false), (window.MONIFY_CONFIG && window.MONIFY_CONFIG.AUTO_REFRESH_FX_MS) || 300000);
  });
})();
