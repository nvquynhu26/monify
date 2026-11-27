/* ==========================================================================
   MONIFY — MY FINANCE MANAGER (v2)
   Default: English | 6 Languages: EN, KO, RU, VI, UZ, BE
   Hardcoded Google Apps Script backend + localStorage instant fallback
   ========================================================================== */

(function () {
  "use strict";

  const STORAGE_KEY = "monify_db_v2";
  const FX_CACHE_KEY = "monify_fx_v2";
  const LANG_KEY = "monify_lang_v2";
  const GAS_URL =
    (window.MONIFY_CONFIG && window.MONIFY_CONFIG.GOOGLE_SCRIPT_URL) ||
    "https://script.google.com/macros/s/AKfycby5nM7sVrqWe0Pojnjo7rf-XvdNMZwu-nFm-41LdSLwSrYfgyfUj4ILZ9Jn2djIrrbD/exec";

  // ------------------------------------------------------------------------
  // 1. MULTI-LANGUAGE DICTIONARY (EN, KO, RU, VI, UZ, BE)
  // ------------------------------------------------------------------------
  const LANGUAGES = [
    { code: "en", label: "English" },
    { code: "ko", label: "한국어" },
    { code: "ru", label: "Русский" },
    { code: "vi", label: "Tiếng Việt" },
    { code: "uz", label: "Oʻzbekcha" },
    { code: "be", label: "Беларуская" }
  ];

  const I18N = {
    en: {
      auth_tagline: "Smart multi-currency finance manager",
      login_title: "Sign In",
      register_title: "Create Account",
      username: "Username",
      password: "Password",
      full_name: "Full Name",
      dob: "Date of Birth",
      email: "Email Address",
      login_btn: "Sign In",
      register_btn: "Create Account",
      demo_btn: "Quick Demo (monify)",
      no_account: "Don't have an account?",
      register_now: "Sign Up",
      have_account: "Already have an account?",
      nav_home: "Home",
      nav_transfer: "Transfer",
      nav_spend: "Spend",
      nav_goals: "Goals",
      nav_ai: "AI",
      total_balance: "Total Balance",
      theme_btn: "Theme",
      my_wallets: "My Wallets",
      add_wallet: "+ Add",
      full_wallets: "6/6 Full",
      savings_deposits: "Savings & Deposits",
      add_saving: "+ Add",
      visa_eyebrow: "VISA PROTECTION",
      visa_title: "Visa Balance Guard",
      edit_btn: "Edit",
      visa_min: "Minimum Reserve",
      visa_current: "Current Total (KRW)",
      tax_eyebrow: "KOREA FX & TAX RADAR",
      fx50k_title: "$50,000 Annual Limit",
      update_btn: "Update",
      used_label: "Used:",
      limit_label: "Limit:",
      may_badge: "May",
      tax_reminder: "Korea 3.3% freelance income tax refund filing window.",
      sub_compare: "Compare",
      sub_qr: "QR Pay",
      sub_split: "Split",
      sub_atm: "ATM/FX",
      remit_title: "1-Tap Remittance Compare",
      send_amount: "Amount",
      currency_route: "Route",
      from_wallet: "From Wallet",
      my_qr: "MY PERSONAL QR",
      qr_sim_title: "Instant QR Transfer",
      qr_sim_desc: "Pay in KRW; recipient receives VND, USD, or USDT instantly.",
      recipient: "Recipient",
      pay_krw: "Pay (KRW)",
      recv_in: "Receive in",
      qr_send_btn: "Scan & Send Now",
      split_title: "Multi-Currency Bill Split",
      clear_btn: "Clear",
      payer: "Paid by",
      item_note: "Item",
      amount: "Amount",
      currency: "Currency",
      add_bill_btn: "+ Add Expense",
      expenses_list: "Group Expenses",
      settlement_eyebrow: "SETTLEMENT",
      who_owes_whom: "Who Owes Whom",
      filter_all: "All",
      filter_atm: "Global ATM",
      filter_fx: "FX Booth",
      add_tx_btn: "+ Add Record",
      ai_scan_btn: "AI Receipt Scan",
      cashflow_title: "Cashflow Overview",
      above_avg: "Above Avg",
      income: "Income",
      expense: "Expense",
      net: "Net",
      jars_title: "6-Jar Budget",
      jars_sub: "Customize names & percentages",
      balance_100: "Auto 100%",
      save_jars: "Save Jars",
      recent_tx: "Recent Transactions",
      subs_eyebrow: "RECURRING BILLS",
      subs_title: "Subscriptions",
      add_btn: "+ Add",
      monthly_total: "Monthly total",
      travel_eyebrow: "SEPARATE BUDGET",
      travel_title: "Home-Visit & Travel Mode",
      travel_desc: "Keep trip expenses separate from your monthly Korea living statistics.",
      trip_name: "Trip Name",
      trip_budget: "Budget (KRW)",
      spent_label: "Spent:",
      add_travel_tx: "+ Log Trip Expense",
      goals_title: "Savings Goals",
      goals_sub: "With Stablecoin auto-hedging tips",
      add_goal: "+ Goal",
      ai_eyebrow: "FINANCIAL DIAGNOSTICS",
      health_title: "Financial Health Score",
      weekly_tips: "WEEKLY ACTION TIPS",
      fx_alert_title: "Target FX Rate Alerts",
      fx_alert_sub: "Get notified when exchange rates hit your target.",
      pair: "Pair",
      target_rate: "Target",
      set_alert_btn: "+ Set Rate Alert",
      ai_disclaimer: "Analysis is for reference only based on historical data and does not guarantee future exchange rate predictions.",
      account_settings: "Account & Language",
      language_label: "App Language",
      reset_demo: "Reset Demo",
      logout_btn: "Log Out",
      directions: "Map",
      send_now: "Send",
      best_rate: "Best Rate",
      bank: "Bank",
      cash: "Cash",
      wallets_short: "Wallets",
      savings_short: "Savings",
      left_label: "Left:"
    },
    ko: {
      auth_tagline: "스마트 다통화 자산관리 플랫폼",
      login_title: "로그인",
      register_title: "회원가입",
      username: "아이디",
      password: "비밀번호",
      full_name: "이름",
      dob: "생년월일",
      email: "이메일",
      login_btn: "로그인",
      register_btn: "가입하기",
      demo_btn: "체험 계정으로 시작 (monify)",
      no_account: "계정이 없으신가요?",
      register_now: "회원가입",
      have_account: "이미 계정이 있으신가요?",
      nav_home: "홈",
      nav_transfer: "송금",
      nav_spend: "소비",
      nav_goals: "목표",
      nav_ai: "AI",
      total_balance: "총 자산",
      theme_btn: "테마",
      my_wallets: "내 지갑",
      add_wallet: "+ 추가",
      full_wallets: "6/6 최대",
      savings_deposits: "예·적금",
      add_saving: "+ 추가",
      visa_eyebrow: "비자 안전망",
      visa_title: "비자 잔고 보호 가드",
      edit_btn: "설정",
      visa_min: "최소 유지 잔고",
      visa_current: "현재 총자산 (KRW)",
      tax_eyebrow: "외환·세무 레이더",
      fx50k_title: "연간 $50,000 송금 한도",
      update_btn: "수정",
      used_label: "사용:",
      limit_label: "한도:",
      may_badge: "5월",
      tax_reminder: "5월 종합소득세(3.3%) 신고 및 환급 일정 안내.",
      sub_compare: "송금비교",
      sub_qr: "QR송금",
      sub_split: "더치페이",
      sub_atm: "ATM/환전",
      remit_title: "원터치 해외송금 비교",
      send_amount: "송금액",
      currency_route: "통화 경로",
      from_wallet: "출금 지갑",
      my_qr: "내 개인 QR",
      qr_sim_title: "다통화 QR 간편 송금",
      qr_sim_desc: "KRW로 결제하고 상대방은 VND, USD, USDT로 수령합니다.",
      recipient: "받는 사람",
      pay_krw: "결제 (KRW)",
      recv_in: "수령 통화",
      qr_send_btn: "QR 스캔 및 송금",
      split_title: "다통화 그룹 정산",
      clear_btn: "초기화",
      payer: "결제자",
      item_note: "항목",
      amount: "금액",
      currency: "통화",
      add_bill_btn: "+ 지출 추가",
      expenses_list: "그룹 지출 내역",
      settlement_eyebrow: "정산 결과",
      who_owes_whom: "누가 얼마를 보낼까요?",
      filter_all: "전체",
      filter_atm: "글로벌 ATM",
      filter_fx: "우대 환전소",
      add_tx_btn: "+ 내역 입력",
      ai_scan_btn: "AI 영수증 스캔",
      cashflow_title: "현금흐름 분석",
      above_avg: "평균 초과",
      income: "수입",
      expense: "지출",
      net: "순수익",
      jars_title: "6개 통장 예산",
      jars_sub: "항목 이름과 비율을 자유롭게 설정",
      balance_100: "100% 맞춤",
      save_jars: "저장",
      recent_tx: "최근 거래 내역",
      subs_eyebrow: "정기 결제",
      subs_title: "정기구독 관리",
      add_btn: "+ 추가",
      monthly_total: "월 합계",
      travel_eyebrow: "분리 예산",
      travel_title: "귀국·여행 모드",
      travel_desc: "여행 지출을 한국 생활비 통계와 분리해 관리합니다.",
      trip_name: "여행 이름",
      trip_budget: "예산 (KRW)",
      spent_label: "사용:",
      add_travel_tx: "+ 여행 지출 기록",
      goals_title: "저축 목표",
      goals_sub: "스테이블코인 환율 분산 적립 팁",
      add_goal: "+ 목표",
      ai_eyebrow: "재무 진단",
      health_title: "금융 건강 점수",
      weekly_tips: "이번 주 실행 팁",
      fx_alert_title: "목표 환율 알림",
      fx_alert_sub: "원하는 환율에 도달하면 알려드립니다.",
      pair: "통화쌍",
      target_rate: "목표 환율",
      set_alert_btn: "+ 환율 알림 설정",
      ai_disclaimer: "본 분석은 과거 데이터에 기반한 참고용 정보이며, 미래 환율의 정확한 예측을 보장하지 않습니다.",
      account_settings: "계정 및 언어",
      language_label: "앱 언어",
      reset_demo: "데모 초기화",
      logout_btn: "로그아웃",
      directions: "길찾기",
      send_now: "송금",
      best_rate: "최고 수령액",
      bank: "은행",
      cash: "현금",
      wallets_short: "지갑",
      savings_short: "예적금",
      left_label: "남음:"
    },
    ru: {
      auth_tagline: "Умный мультивалютный менеджер финансов",
      login_title: "Вход",
      register_title: "Регистрация",
      username: "Логин",
      password: "Пароль",
      full_name: "Полное имя",
      dob: "Дата рождения",
      email: "Email",
      login_btn: "Войти",
      register_btn: "Создать аккаунт",
      demo_btn: "Демо-вход (monify)",
      no_account: "Нет аккаунта?",
      register_now: "Регистрация",
      have_account: "Уже есть аккаунт?",
      nav_home: "Главная",
      nav_transfer: "Перевод",
      nav_spend: "Траты",
      nav_goals: "Цели",
      nav_ai: "AI",
      total_balance: "Общий баланс",
      theme_btn: "Тема",
      my_wallets: "Мои кошельки",
      add_wallet: "+ Добавить",
      full_wallets: "6/6 макс",
      savings_deposits: "Вклады и сбережения",
      add_saving: "+ Добавить",
      visa_eyebrow: "ЗАЩИТА ВИЗЫ",
      visa_title: "Контроль баланса визы",
      edit_btn: "Изм.",
      visa_min: "Мин. резерв",
      visa_current: "Всего (KRW)",
      tax_eyebrow: "ЛИМИТ И НАЛОГИ КОРЕИ",
      fx50k_title: "Годовой лимит $50,000",
      update_btn: "Обновить",
      used_label: "Исп.:",
      limit_label: "Лимит:",
      may_badge: "Май",
      tax_reminder: "Период возврата налога 3.3% в Корее.",
      sub_compare: "Сравнить",
      sub_qr: "QR",
      sub_split: "Сплит",
      sub_atm: "ATM/FX",
      remit_title: "Сравнение переводов",
      send_amount: "Сумма",
      currency_route: "Направление",
      from_wallet: "С кошелька",
      my_qr: "МОЙ QR-КОД",
      qr_sim_title: "Мгновенный QR-перевод",
      qr_sim_desc: "Оплата в KRW; получатель выбирает VND, USD или USDT.",
      recipient: "Получатель",
      pay_krw: "Сумма (KRW)",
      recv_in: "Валюта",
      qr_send_btn: "Отправить по QR",
      split_title: "Разделение счёта",
      clear_btn: "Очистить",
      payer: "Кто платил",
      item_note: "Описание",
      amount: "Сумма",
      currency: "Валюта",
      add_bill_btn: "+ Добавить чек",
      expenses_list: "Расходы группы",
      settlement_eyebrow: "РАСЧЁТ",
      who_owes_whom: "Кто кому должен",
      filter_all: "Все",
      filter_atm: "ATM 24/7",
      filter_fx: "Обменники",
      add_tx_btn: "+ Запись",
      ai_scan_btn: "AI Скан чека",
      cashflow_title: "Денежный поток",
      above_avg: "Выше нормы",
      income: "Доход",
      expense: "Расход",
      net: "Итог",
      jars_title: "Бюджет 6 банок",
      jars_sub: "Настройте названия и проценты",
      balance_100: "Авто 100%",
      save_jars: "Сохранить",
      recent_tx: "Последние операции",
      subs_eyebrow: "ПОДПИСКИ",
      subs_title: "Регулярные списания",
      add_btn: "+ Добавить",
      monthly_total: "В месяц",
      travel_eyebrow: "ОТДЕЛЬНЫЙ БЮДЖЕТ",
      travel_title: "Режим поездки",
      travel_desc: "Отделяет траты в поездке от обычных расходов в Корее.",
      trip_name: "Название поездки",
      trip_budget: "Бюджет (KRW)",
      spent_label: "Потрачено:",
      add_travel_tx: "+ Расход в поездке",
      goals_title: "Финансовые цели",
      goals_sub: "Советы по хеджированию в USDT",
      add_goal: "+ Цель",
      ai_eyebrow: "ДИАГНОСТИКА",
      health_title: "Индекс фин. здоровья",
      weekly_tips: "СОВЕТЫ НА НЕДЕЛЮ",
      fx_alert_title: "Алерты курса валют",
      fx_alert_sub: "Уведомления при достижении целевого курса.",
      pair: "Пара",
      target_rate: "Цель",
      set_alert_btn: "+ Создать алерт",
      ai_disclaimer: "Анализ носит справочный характер на основе исторических данных и не гарантирует прогноз будущих курсов.",
      account_settings: "Аккаунт и язык",
      language_label: "Язык приложения",
      reset_demo: "Сброс демо",
      logout_btn: "Выйти",
      directions: "Маршрут",
      send_now: "Отправить",
      best_rate: "Лучший курс",
      bank: "Банк",
      cash: "Наличные",
      wallets_short: "Кошельки",
      savings_short: "Вклады",
      left_label: "Осталось:"
    },
    vi: {
      auth_tagline: "Quản lý tài chính đa tiền tệ thông minh",
      login_title: "Đăng nhập",
      register_title: "Tạo tài khoản",
      username: "Tên đăng nhập",
      password: "Mật khẩu",
      full_name: "Họ và tên",
      dob: "Ngày sinh",
      email: "Địa chỉ Email",
      login_btn: "Đăng nhập",
      register_btn: "Đăng ký",
      demo_btn: "Dùng thử nhanh (monify)",
      no_account: "Chưa có tài khoản?",
      register_now: "Đăng ký ngay",
      have_account: "Đã có tài khoản?",
      nav_home: "Trang chủ",
      nav_transfer: "Chuyển tiền",
      nav_spend: "Chi tiêu",
      nav_goals: "Mục tiêu",
      nav_ai: "Trợ lý AI",
      total_balance: "Tổng tài sản",
      theme_btn: "Đổi nền",
      my_wallets: "Ví của tôi",
      add_wallet: "+ Thêm",
      full_wallets: "Đủ 6/6",
      savings_deposits: "Sổ tiết kiệm",
      add_saving: "+ Thêm",
      visa_eyebrow: "BẢO VỆ VISA",
      visa_title: "Lá chắn số dư Visa",
      edit_btn: "Cài đặt",
      visa_min: "Ngưỡng tối thiểu",
      visa_current: "Tổng tài sản (KRW)",
      tax_eyebrow: "RADAR HẠN MỨC & THUẾ",
      fx50k_title: "Hạn mức $50,000/năm",
      update_btn: "Cập nhật",
      used_label: "Đã chuyển:",
      limit_label: "Giới hạn:",
      may_badge: "Tháng 5",
      tax_reminder: "Nhắc lịch quyết toán & hoàn thuế 3.3% tại Hàn Quốc.",
      sub_compare: "So sánh",
      sub_qr: "QR Pay",
      sub_split: "Chia bill",
      sub_atm: "ATM/FX",
      remit_title: "So sánh chuyển tiền 1 chạm",
      send_amount: "Số tiền gửi",
      currency_route: "Tuyến tiền",
      from_wallet: "Từ ví",
      my_qr: "MÃ QR CÁ NHÂN",
      qr_sim_title: "Chuyển tiền QR đa tiền tệ",
      qr_sim_desc: "Trả bằng KRW; người nhận nhận VND, USD hoặc USDT.",
      recipient: "Người nhận",
      pay_krw: "Trả (KRW)",
      recv_in: "Nhận bằng",
      qr_send_btn: "Quét QR & Gửi ngay",
      split_title: "Chia tiền nhóm đa tiền tệ",
      clear_btn: "Làm mới",
      payer: "Người trả",
      item_note: "Khoản chi",
      amount: "Số tiền",
      currency: "Tiền tệ",
      add_bill_btn: "+ Thêm hóa đơn",
      expenses_list: "Hóa đơn trong nhóm",
      settlement_eyebrow: "CẤN TRỪ CÔNG NỢ",
      who_owes_whom: "Ai cần chuyển cho ai?",
      filter_all: "Tất cả",
      filter_atm: "Global ATM",
      filter_fx: "Đổi tiền",
      add_tx_btn: "+ Ghi thu/chi",
      ai_scan_btn: "AI Quét hóa đơn",
      cashflow_title: "Phân tích dòng tiền",
      above_avg: "Vượt TB",
      income: "Thu nhập",
      expense: "Chi tiêu",
      net: "Ròng",
      jars_title: "Ngân sách 6 Chiếc lọ",
      jars_sub: "Tùy chỉnh tên và tỷ lệ %",
      balance_100: "Cân 100%",
      save_jars: "Lưu lọ",
      recent_tx: "Giao dịch gần đây",
      subs_eyebrow: "GÓI ĐỊNH KỲ",
      subs_title: "Subscriptions",
      add_btn: "+ Thêm",
      monthly_total: "Tổng hàng tháng",
      travel_eyebrow: "NGÂN SÁCH RIÊNG",
      travel_title: "Chế độ Về nước / Du lịch",
      travel_desc: "Tách chi tiêu chuyến đi khỏi thống kê sinh hoạt tại Hàn.",
      trip_name: "Tên chuyến đi",
      trip_budget: "Ngân sách (KRW)",
      spent_label: "Đã chi:",
      add_travel_tx: "+ Ghi chi tiêu chuyến đi",
      goals_title: "Mục tiêu tích lũy",
      goals_sub: "Gợi ý chia nhỏ đổi sang Stablecoin",
      add_goal: "+ Mục tiêu",
      ai_eyebrow: "CHẨN ĐOÁN TÀI CHÍNH",
      health_title: "Điểm Sức khỏe Tài chính",
      weekly_tips: "GỢI Ý TUẦN NÀY",
      fx_alert_title: "Canh tỷ giá mục tiêu",
      fx_alert_sub: "Nhận cảnh báo khi tỷ giá đạt ngưỡng mong muốn.",
      pair: "Cặp tỷ giá",
      target_rate: "Mục tiêu",
      set_alert_btn: "+ Đặt cảnh báo",
      ai_disclaimer: "Phân tích chỉ mang tính tham khảo dựa trên dữ liệu lịch sử, không cam kết dự đoán chính xác tỷ giá tương lai.",
      account_settings: "Tài khoản & Ngôn ngữ",
      language_label: "Ngôn ngữ ứng dụng",
      reset_demo: "Reset mẫu",
      logout_btn: "Đăng xuất",
      directions: "Chỉ đường",
      send_now: "Chuyển",
      best_rate: "Tốt nhất",
      bank: "Ngân hàng",
      cash: "Tiền mặt",
      wallets_short: "Ví",
      savings_short: "Tiết kiệm",
      left_label: "Còn lại:"
    },
    uz: {
      auth_tagline: "Aqlli ko'p valyutali moliya menejeri",
      login_title: "Kirish",
      register_title: "Ro'yxatdan o'tish",
      username: "Foydalanuvchi nomi",
      password: "Parol",
      full_name: "To'liq ism",
      dob: "Tug'ilgan sana",
      email: "Email manzil",
      login_btn: "Kirish",
      register_btn: "Hisob yaratish",
      demo_btn: "Tezkor demo (monify)",
      no_account: "Hisobingiz yo'qmi?",
      register_now: "Ro'yxatdan o'tish",
      have_account: "Hisobingiz bormi?",
      nav_home: "Asosiy",
      nav_transfer: "O'tkazma",
      nav_spend: "Xarajat",
      nav_goals: "Maqsad",
      nav_ai: "AI",
      total_balance: "Umumiy balans",
      theme_btn: "Mavzu",
      my_wallets: "Hamyonlarim",
      add_wallet: "+ Qo'shish",
      full_wallets: "6/6 To'liq",
      savings_deposits: "Omonatlar",
      add_saving: "+ Qo'shish",
      visa_eyebrow: "VIZA HIMOYASI",
      visa_title: "Viza balansi nazorati",
      edit_btn: "Tahrirlash",
      visa_min: "Minimal qoldiq",
      visa_current: "Jami (KRW)",
      tax_eyebrow: "KOREYA LIMIT VA SOLIQ",
      fx50k_title: "$50,000 yillik limit",
      update_btn: "Yangilash",
      used_label: "Ishlatildi:",
      limit_label: "Limit:",
      may_badge: "May",
      tax_reminder: "Koreyada 3.3% daromad solig'ini qaytarish davri.",
      sub_compare: "Taqqoslash",
      sub_qr: "QR",
      sub_split: "Bo'lish",
      sub_atm: "ATM/FX",
      remit_title: "Xalqaro o'tkazma taqqoslash",
      send_amount: "Summa",
      currency_route: "Yo'nalish",
      from_wallet: "Hamyondan",
      my_qr: "SHAXSIY QR",
      qr_sim_title: "Tezkor QR o'tkazma",
      qr_sim_desc: "KRWda to'lang; qabul qiluvchi VND, USD yoki USDT oladi.",
      recipient: "Qabul qiluvchi",
      pay_krw: "To'lov (KRW)",
      recv_in: "Valyuta",
      qr_send_btn: "QR orqali yuborish",
      split_title: "Guruh hisobini bo'lish",
      clear_btn: "Tozalash",
      payer: "To'lovchi",
      item_note: "Izoh",
      amount: "Summa",
      currency: "Valyuta",
      add_bill_btn: "+ Xarajat qo'shish",
      expenses_list: "Guruh xarajatlari",
      settlement_eyebrow: "HISOB-KITOB",
      who_owes_whom: "Kim kimga to'laydi?",
      filter_all: "Barchasi",
      filter_atm: "Global ATM",
      filter_fx: "Valyuta",
      add_tx_btn: "+ Yozuv",
      ai_scan_btn: "AI Chek skan",
      cashflow_title: "Pul oqimi tahlili",
      above_avg: "Yuqori",
      income: "Daromad",
      expense: "Xarajat",
      net: "Qoldiq",
      jars_title: "6 bankali byudjet",
      jars_sub: "Nom va foizlarni sozlang",
      balance_100: "Avto 100%",
      save_jars: "Saqlash",
      recent_tx: "So'nggi operatsiyalar",
      subs_eyebrow: "OBUNALAR",
      subs_title: "Doimiy to'lovlar",
      add_btn: "+ Qo'shish",
      monthly_total: "Oylik jami",
      travel_eyebrow: "ALOHIDA BYUDJET",
      travel_title: "Sayohat rejimi",
      travel_desc: "Sayohat xarajatlarini kundalik statistikadan ajratadi.",
      trip_name: "Sayohat nomi",
      trip_budget: "Byudjet (KRW)",
      spent_label: "Sarflandi:",
      add_travel_tx: "+ Sayohat xarajati",
      goals_title: "Jamg'arma maqsadlari",
      goals_sub: "Stablecoin orqali bosqichma-bosqich jamg'arish",
      add_goal: "+ Maqsad",
      ai_eyebrow: "MOLIYAVIY TAHLIL",
      health_title: "Moliyaviy salomatlik bali",
      weekly_tips: "HAFTALIK TAVSIYALAR",
      fx_alert_title: "Kurs ogohlantirishlari",
      fx_alert_sub: "Kerakli kursga yetganda xabar oling.",
      pair: "Juftlik",
      target_rate: "Maqsad",
      set_alert_btn: "+ Ogohlantirish qo'shish",
      ai_disclaimer: "Tahlil tarixiy ma'lumotlarga asoslangan bo'lib, kelajakdagi kursni aniq bashorat qilishni kafolatlamaydi.",
      account_settings: "Hisob va Til",
      language_label: "Ilova tili",
      reset_demo: "Demo tiklash",
      logout_btn: "Chiqish",
      directions: "Xarita",
      send_now: "Yuborish",
      best_rate: "Eng yaxshi",
      bank: "Bank",
      cash: "Naqd",
      wallets_short: "Hamyon",
      savings_short: "Omonat",
      left_label: "Qoldi:"
    },
    be: {
      auth_tagline: "Разумны мультывалютны менеджар фінансаў",
      login_title: "Уваход",
      register_title: "Рэгістрацыя",
      username: "Лагін",
      password: "Пароль",
      full_name: "Поўнае імя",
      dob: "Дата нараджэння",
      email: "Email",
      login_btn: "Увайсці",
      register_btn: "Стварыць акаўнт",
      demo_btn: "Хуткае дэма (monify)",
      no_account: "Няма акаўнта?",
      register_now: "Рэгістрацыя",
      have_account: "Ужо ёсць акаўнт?",
      nav_home: "Галоўная",
      nav_transfer: "Перавод",
      nav_spend: "Выдаткі",
      nav_goals: "Мэты",
      nav_ai: "AI",
      total_balance: "Агульны баланс",
      theme_btn: "Тэма",
      my_wallets: "Мае кашалькі",
      add_wallet: "+ Дадаць",
      full_wallets: "6/6 макс",
      savings_deposits: "Уклады і ашчаджэнні",
      add_saving: "+ Дадаць",
      visa_eyebrow: "АБАРОНА ВІЗЫ",
      visa_title: "Кантроль балансу візы",
      edit_btn: "Змяніць",
      visa_min: "Мін. рэзерв",
      visa_current: "Усяго (KRW)",
      tax_eyebrow: "ЛІМІТ І ПАДАТКІ КАРЭІ",
      fx50k_title: "Гадавы ліміт $50,000",
      update_btn: "Абнавіць",
      used_label: "Выкар.:",
      limit_label: "Ліміт:",
      may_badge: "Май",
      tax_reminder: "Перыяд вяртання падатку 3.3% у Карэі.",
      sub_compare: "Параўнаць",
      sub_qr: "QR",
      sub_split: "Спліт",
      sub_atm: "ATM/FX",
      remit_title: "Параўнанне пераводаў",
      send_amount: "Сума",
      currency_route: "Кірунак",
      from_wallet: "З кашалька",
      my_qr: "МОЙ QR-КОД",
      qr_sim_title: "Імгненны QR-перавод",
      qr_sim_desc: "Аплата ў KRW; атрымальнік выбірае VND, USD або USDT.",
      recipient: "Атрымальнік",
      pay_krw: "Сума (KRW)",
      recv_in: "Валюта",
      qr_send_btn: "Адправіць па QR",
      split_title: "Падзел рахунку",
      clear_btn: "Ачысціць",
      payer: "Хто плаціў",
      item_note: "Апісанне",
      amount: "Сума",
      currency: "Валюта",
      add_bill_btn: "+ Дадаць чэк",
      expenses_list: "Выдаткі групы",
      settlement_eyebrow: "РАЗЛІК",
      who_owes_whom: "Хто каму вінен",
      filter_all: "Усе",
      filter_atm: "ATM 24/7",
      filter_fx: "Абменнікі",
      add_tx_btn: "+ Запіс",
      ai_scan_btn: "AI Скан чэка",
      cashflow_title: "Грашовы паток",
      above_avg: "Вышэй нормы",
      income: "Даход",
      expense: "Выдатак",
      net: "Вынік",
      jars_title: "Бюджэт 6 слоікаў",
      jars_sub: "Наладзьце назвы і працэнты",
      balance_100: "Аўта 100%",
      save_jars: "Захаваць",
      recent_tx: "Апошнія аперацыі",
      subs_eyebrow: "ПАДПІСКІ",
      subs_title: "Рэгулярныя спісанні",
      add_btn: "+ Дадаць",
      monthly_total: "За месяц",
      travel_eyebrow: "АСОБНЫ БЮДЖЭТ",
      travel_title: "Рэжым паездкі",
      travel_desc: "Аддзяляе выдаткі ў паездцы ад штодзённай статыстыкі.",
      trip_name: "Назва паездкі",
      trip_budget: "Бюджэт (KRW)",
      spent_label: "Патрачана:",
      add_travel_tx: "+ Выдатак у паездцы",
      goals_title: "Фінансавыя мэты",
      goals_sub: "Парады па хеджаванні ў USDT",
      add_goal: "+ Мэта",
      ai_eyebrow: "ДЫЯГНОСТЫКА",
      health_title: "Індэкс фін. здароўя",
      weekly_tips: "ПАРАДЫ НА ТЫДЗЕНЬ",
      fx_alert_title: "Апавяшчэнні курсаў",
      fx_alert_sub: "Атрымлівайце сігнал пры дасягненні патрэбнага курсу.",
      pair: "Пара",
      target_rate: "Мэта",
      set_alert_btn: "+ Стварыць сігнал",
      ai_disclaimer: "Аналіз носіць даведачны характар на аснове гістарычных даных і не гарантуе прагноз будучых курсаў.",
      account_settings: "Акаўнт і мова",
      language_label: "Мова дадатку",
      reset_demo: "Скід дэма",
      logout_btn: "Выйсці",
      directions: "Маршрут",
      send_now: "Даслаць",
      best_rate: "Лепшы курс",
      bank: "Банк",
      cash: "Гатоўка",
      wallets_short: "Кашалькі",
      savings_short: "Уклады",
      left_label: "Засталося:"
    }
  };

  function t(key) {
    const dict = I18N[state.lang] || I18N.en;
    return dict[key] || I18N.en[key] || key;
  }

  function applyI18n() {
    document.documentElement.lang = state.lang;
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const k = el.getAttribute("data-i18n");
      if (k) el.textContent = t(k);
    });
    const tabKeyMap = { home: "nav_home", transfer: "nav_transfer", spend: "nav_spend", goals: "nav_goals", ai: "nav_ai" };
    const headerTitle = document.getElementById("header-tab-title");
    if (headerTitle) headerTitle.textContent = t(tabKeyMap[state.activeTab] || "nav_home");
  }

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
    BYN: 3.28,
    updatedAt: "Offline fallback"
  };

  const SEOUL_SPOTS = [
    { id: "atm1", type: "fx", name: "Embassy Exchange (명동 대사관앞)", area: "Myeongdong", hours: "09:00–21:00", note: "Top USD/VND/KRW rates in Seoul", lat: 37.5610, lng: 126.9822 },
    { id: "atm2", type: "fx", name: "Money Box Hongdae", area: "Hongdae", hours: "09:00–22:00", note: "Fast multi-currency booth", lat: 37.5567, lng: 126.9240 },
    { id: "atm3", type: "atm", name: "Woori Global ATM 24/7", area: "Sinchon", hours: "24/7", note: "Visa / Mastercard / UnionPay", lat: 37.5559, lng: 126.9368 },
    { id: "atm4", type: "atm", name: "Hana Global ATM 24/7", area: "Itaewon", hours: "24/7", note: "Low foreign card withdrawal fee", lat: 37.5345, lng: 126.9946 },
    { id: "atm5", type: "fx", name: "Itaewon Foreign Exchange", area: "Itaewon", hours: "09:30–21:30", note: "USD, EUR, RUB, VND supported", lat: 37.5349, lng: 126.9921 },
    { id: "atm6", type: "atm", name: "KB Kookmin Global ATM 24/7", area: "Gangnam", hours: "24/7", note: "Gangnam Stn Exit 10 · Multilingual", lat: 37.4980, lng: 127.0276 }
  ];

  const state = {
    db: null,
    currentUser: null,
    lang: localStorage.getItem(LANG_KEY) || (window.MONIFY_CONFIG && window.MONIFY_CONFIG.DEFAULT_LANG) || "en",
    rates: Object.assign({}, DEFAULT_RATES),
    baseCurrency: "KRW",
    hideBalance: false,
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

  // ------------------------------------------------------------------------
  // 2. SEED DATA & SILENT GOOGLE APPS SCRIPT SYNC
  // ------------------------------------------------------------------------
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
        { Saving_ID: "S1", User_ID: 1, Bank_Name: "Korea Savings Account", Country: "South Korea", Currency: "KRW", Principal_Amount: 10000000, Start_Date: "2025-06-03", Maturity_Date: "2026-06-03", Interest_Rate: 3.0 },
        { Saving_ID: "S2", User_ID: 1, Bank_Name: "Vietnam Savings Account", Country: "Vietnam", Currency: "VND", Principal_Amount: 200000000, Start_Date: "2025-09-01", Maturity_Date: "2026-09-01", Interest_Rate: 5.5 }
      ],
      transactions: [
        { Tx_ID: "T1", User_ID: 1, Date: daysAgoStr(2), Type: "Expense", Currency: "KRW", Amount: 14500, Jar_Category: "Necessities", Wallet_ID: "W1", Is_Travel_Mode: false, Note: "GS25 & Lunch" },
        { Tx_ID: "T2", User_ID: 1, Date: daysAgoStr(5), Type: "Income", Currency: "KRW", Amount: 1850000, Jar_Category: "Income", Wallet_ID: "W1", Is_Travel_Mode: false, Note: "Part-time / Scholarship" },
        { Tx_ID: "T3", User_ID: 1, Date: daysAgoStr(9), Type: "Expense", Currency: "KRW", Amount: 450000, Jar_Category: "Necessities", Wallet_ID: "W1", Is_Travel_Mode: false, Note: "Monthly Rent (Wolse)" },
        { Tx_ID: "T4", User_ID: 1, Date: daysAgoStr(12), Type: "Expense", Currency: "KRW", Amount: 85000, Jar_Category: "Play", Wallet_ID: "W5", Is_Travel_Mode: false, Note: "Weekend Dinner" },
        { Tx_ID: "T5", User_ID: 1, Date: daysAgoStr(18), Type: "Expense", Currency: "KRW", Amount: 220000, Jar_Category: "Education", Wallet_ID: "W1", Is_Travel_Mode: false, Note: "Korean Language Course" },
        { Tx_ID: "T6", User_ID: 1, Date: daysAgoStr(24), Type: "Expense", Currency: "USD", Amount: 20, Jar_Category: "Education", Wallet_ID: "W3", Is_Travel_Mode: false, Note: "ChatGPT Plus" }
      ],
      budgets6Jars: {
        1: [
          { name: "Necessities", pct: 45 },
          { name: "Education", pct: 15 },
          { name: "Long-term Savings", pct: 15 },
          { name: "Play", pct: 10 },
          { name: "Investment", pct: 10 },
          { name: "Family Remittance", pct: 5 }
        ]
      },
      goalsSubs: {
        1: {
          visaMinKRW: 10000000,
          fx50kUsedUSD: 6200,
          travelMode: { enabled: false, tripName: "Home Visit", budgetKRW: 1500000 },
          goals: [
            { id: "G1", name: "Next Semester Tuition", currency: "KRW", targetAmount: 4200000, savedAmount: 1800000, deadline: "2027-02-20" },
            { id: "G2", name: "Housing Deposit (Bojeunggeum)", currency: "KRW", targetAmount: 10000000, savedAmount: 3500000, deadline: "2027-08-30" }
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

  async function callBackend(action, payload) {
    if (!GAS_URL) return null;
    try {
      const res = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action, payload })
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  // ------------------------------------------------------------------------
  // 3. LIVE FX & STABLECOIN RATES
  // ------------------------------------------------------------------------
  async function fetchLiveFX(showNotice) {
    try {
      const [fiatRes, cryptoRes] = await Promise.allSettled([
        fetch("https://open.er-api.com/v6/latest/USD"),
        fetch("https://api.coingecko.com/api/v3/simple/price?ids=tether,usd-coin&vs_currencies=usd,krw,vnd")
      ]);
      const next = Object.assign({}, state.rates);
      if (fiatRes.status === "fulfilled" && fiatRes.value.ok) {
        const j = await fiatRes.value.json();
        if (j && j.rates) {
          ["KRW", "VND", "EUR", "JPY", "RUB", "UZS", "BYN"].forEach(c => {
            if (j.rates[c]) next[c] = j.rates[c];
          });
        }
      }
      if (cryptoRes.status === "fulfilled" && cryptoRes.value.ok) {
        const cg = await cryptoRes.value.json();
        if (cg && cg.tether && cg.tether.usd) next.USDT = 1 / cg.tether.usd;
      }
      const now = new Date();
      next.updatedAt = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
      state.rates = next;
      localStorage.setItem(FX_CACHE_KEY, JSON.stringify(next));
      if (showNotice) showToast("Refreshed live FX & Stablecoin rates");
    } catch (e) {
      const cached = localStorage.getItem(FX_CACHE_KEY);
      if (cached) state.rates = JSON.parse(cached);
      if (showNotice) showToast("Using offline fallback FX rates");
    }
    if (state.currentUser) renderAll();
  }

  function convertCurrency(amount, fromCurr, toCurr) {
    const val = Number(amount) || 0;
    if (fromCurr === toCurr) return val;
    const f = state.rates[fromCurr] || 1;
    const to = state.rates[toCurr] || 1;
    return (val / f) * to;
  }

  function formatMoney(amount, curr) {
    const n = Number(amount) || 0;
    if (curr === "KRW") return "₩ " + Math.round(n).toLocaleString("en-US");
    if (curr === "VND") return Math.round(n).toLocaleString("en-US") + " ₫";
    if (curr === "USD") return "$ " + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (curr === "USDT") return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " USDT";
    return n.toLocaleString("en-US", { maximumFractionDigits: 2 }) + " " + curr;
  }

  // Scoped getters
  function userWallets() { return state.db.wallets.filter(w => Number(w.User_ID) === Number(state.currentUser.User_ID)); }
  function userSavings() { return state.db.savings.filter(s => Number(s.User_ID) === Number(state.currentUser.User_ID)); }
  function userTransactions() {
    return state.db.transactions
      .filter(tx => Number(tx.User_ID) === Number(state.currentUser.User_ID))
      .sort((a, b) => (b.Date || "").localeCompare(a.Date || ""));
  }
  function userJars() {
    const uid = state.currentUser.User_ID;
    if (!state.db.budgets6Jars[uid]) {
      state.db.budgets6Jars[uid] = [
        { name: "Necessities", pct: 45 },
        { name: "Education", pct: 15 },
        { name: "Long-term Savings", pct: 15 },
        { name: "Play", pct: 10 },
        { name: "Investment", pct: 10 },
        { name: "Family Remittance", pct: 5 }
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
        travelMode: { enabled: false, tripName: "Home Visit", budgetKRW: 1500000 },
        goals: [],
        subscriptions: [],
        fxAlerts: []
      };
    }
    return state.db.goalsSubs[uid];
  }

  // ------------------------------------------------------------------------
  // 4. SCREENS, LAUNCH & AUTH
  // ------------------------------------------------------------------------
  function showScreen(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    const el = document.getElementById(id);
    if (el) el.classList.add("active");
  }

  function startLaunch() {
    showScreen("screen-launch");
    setTimeout(() => {
      const el = document.getElementById("screen-launch");
      el.classList.add("fade-out");
      setTimeout(() => {
        el.classList.remove("active", "fade-out");
        showScreen("screen-login");
      }, 340);
    }, 2000);
  }

  function switchTab(tab) {
    state.activeTab = tab;
    applyI18n();
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    const panel = document.getElementById("tab-" + tab);
    if (panel) panel.classList.add("active");
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
    document.getElementById("main-scroll").scrollTop = 0;

    if (tab === "transfer" && state.activeSubtab === "atm") setTimeout(initOrRefreshMap, 120);
    if (tab === "transfer" && state.activeSubtab === "qr") renderMyQR();
  }

  function switchSubtab(sub) {
    state.activeSubtab = sub;
    document.querySelectorAll("#transfer-subtabs .seg-btn").forEach(b => b.classList.toggle("active", b.dataset.subtab === sub));
    document.querySelectorAll(".subtab-pane").forEach(p => p.classList.remove("active"));
    const pane = document.getElementById("subtab-" + sub);
    if (pane) pane.classList.add("active");
    if (sub === "atm") setTimeout(initOrRefreshMap, 120);
    if (sub === "qr") renderMyQR();
  }

  async function handleLogin(e) {
    e.preventDefault();
    const err = document.getElementById("login-error");
    err.hidden = true;
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value;
    if (!username || !password) {
      err.textContent = "Please enter username and password.";
      err.hidden = false;
      return;
    }

    const remote = await callBackend("login", { Username: username, Password: password });
    if (remote && remote.ok && remote.user) {
      mergeRemoteData(remote);
      state.currentUser = remote.user;
      enterApp();
      return;
    }

    const found = state.db.users.find(
      u => u.Username.toLowerCase() === username.toLowerCase() && String(u.Password) === String(password)
    );
    if (!found) {
      err.textContent = "Invalid credentials. Try demo: monify / 828282";
      err.hidden = false;
      return;
    }
    state.currentUser = found;
    enterApp();
  }

  async function handleRegister(e) {
    e.preventDefault();
    const err = document.getElementById("register-error");
    err.hidden = true;

    const Username = document.getElementById("reg-username").value.trim();
    const FullName = document.getElementById("reg-fullname").value.trim();
    const DOB = document.getElementById("reg-dob").value;
    const Password = document.getElementById("reg-password").value;
    const Email = document.getElementById("reg-email").value.trim();

    if (!Username || !FullName || !DOB || !Password || !Email) {
      err.textContent = "Please fill in all 5 required fields.";
      err.hidden = false;
      return;
    }
    if (Password.length < 6) {
      err.textContent = "Password must be at least 6 characters.";
      err.hidden = false;
      return;
    }
    if (state.db.users.some(u => u.Username.toLowerCase() === Username.toLowerCase())) {
      err.textContent = "Username is already taken.";
      err.hidden = false;
      return;
    }

    const newUser = {
      User_ID: state.db.nextUserId++,
      Username,
      FullName,
      DOB,
      Password,
      Email,
      CreatedAt: new Date().toISOString()
    };

    const remote = await callBackend("register", newUser);
    if (remote && remote.ok && remote.User_ID) {
      newUser.User_ID = remote.User_ID;
      state.db.nextUserId = Math.max(state.db.nextUserId, Number(remote.User_ID) + 1);
    }

    state.db.users.push(newUser);
    state.currentUser = newUser;
    userJars();
    userMeta();
    saveLocalDB();

    showToast("Account created! User ID #" + newUser.User_ID);
    enterApp();
  }

  function mergeRemoteData(remote) {
    const uid = Number(remote.user.User_ID);
    state.db.users = state.db.users.filter(u => Number(u.User_ID) !== uid).concat([remote.user]);
    if (Array.isArray(remote.wallets)) state.db.wallets = state.db.wallets.filter(w => Number(w.User_ID) !== uid).concat(remote.wallets);
    if (Array.isArray(remote.savings)) state.db.savings = state.db.savings.filter(s => Number(s.User_ID) !== uid).concat(remote.savings);
    if (Array.isArray(remote.transactions)) state.db.transactions = state.db.transactions.filter(x => Number(x.User_ID) !== uid).concat(remote.transactions);
    if (Array.isArray(remote.jars) && remote.jars.length === 6) state.db.budgets6Jars[uid] = remote.jars;
    if (remote.meta) state.db.goalsSubs[uid] = remote.meta;
    saveLocalDB();
  }

  function enterApp() {
    showScreen("screen-main");
    switchTab("home");
    renderAll();
  }

  // ------------------------------------------------------------------------
  // 5. RENDERING ALL 5 TABS
  // ------------------------------------------------------------------------
  function renderAll() {
    if (!state.currentUser) return;
    applyI18n();
    document.getElementById("header-user-meta").textContent = "ID #" + state.currentUser.User_ID + " · " + state.currentUser.Username;
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
    const grand = walletSum + savingSum;

    document.getElementById("total-asset-value").textContent = state.hideBalance ? "••••••••" : formatMoney(grand, base);
    document.getElementById("total-asset-breakdown").textContent = state.hideBalance
      ? t("wallets_short") + ": •••  ·  " + t("savings_short") + ": •••"
      : t("wallets_short") + ": " + formatMoney(walletSum, base) + "  ·  " + t("savings_short") + ": " + formatMoney(savingSum, base);
    document.getElementById("fx-updated-label").textContent = "Stablecoin FX · " + state.rates.updatedAt;

    document.querySelectorAll("#base-currency-pills .seg-chip").forEach(b => b.classList.toggle("active", b.dataset.curr === base));

    // Wallets counter & lock at 6/6
    document.getElementById("wallet-counter").textContent = wallets.length + "/6";
    const addBtn = document.getElementById("btn-add-wallet");
    addBtn.disabled = wallets.length >= 6;
    addBtn.textContent = wallets.length >= 6 ? t("full_wallets") : t("add_wallet");

    // Money Keeper clean vertical wallet rows
    const wList = document.getElementById("wallet-list");
    if (wallets.length === 0) {
      wList.innerHTML = `<p class="mk-sub" style="padding:8px 0;">No wallets yet. Tap "+ Add" (up to 6 wallets).</p>`;
    } else {
      wList.innerHTML = wallets.map(w => `
        <div class="mk-row" data-edit-wallet="${w.Wallet_ID}">
          <div class="mk-row-left">
            <div class="mk-avatar ${w.Type === "Bank" ? "mk-avatar-velvet" : "mk-avatar-powder"}">${w.Currency}</div>
            <div class="mk-row-info">
              <div class="mk-row-title">${escapeHtml(w.Wallet_Name)}</div>
              <div class="mk-row-sub">${escapeHtml(w.Country)} · ${w.Type === "Bank" ? t("bank") : t("cash")}</div>
            </div>
          </div>
          <div class="mk-row-right">
            <div class="mk-row-val data-text">${state.hideBalance ? "••••" : formatMoney(w.Balance, w.Currency)}</div>
          </div>
        </div>
      `).join("");
    }

    // Money Keeper clean vertical savings rows
    const sList = document.getElementById("saving-list");
    if (savings.length === 0) {
      sList.innerHTML = `<p class="mk-sub" style="padding:8px 0;">No savings accounts yet.</p>`;
    } else {
      sList.innerHTML = savings.map(s => {
        const dday = calcDDay(s.Maturity_Date);
        const est = calcEstimatedInterest(s.Principal_Amount, s.Interest_Rate, s.Start_Date, s.Maturity_Date);
        return `
          <div class="mk-row" data-edit-saving="${s.Saving_ID}">
            <div class="mk-row-left">
              <div class="mk-avatar mk-avatar-deep">${s.Currency}</div>
              <div class="mk-row-info">
                <div class="mk-row-title">${escapeHtml(s.Bank_Name)}</div>
                <div class="mk-row-sub data-text">${s.Interest_Rate}%/yr · ${s.Maturity_Date || "No date"} · +${formatMoney(est, s.Currency)}</div>
              </div>
            </div>
            <div class="mk-row-right">
              <div class="mk-row-val data-text">${state.hideBalance ? "••••" : formatMoney(s.Principal_Amount, s.Currency)}</div>
              <div class="mk-row-tag data-text">${dday.label}</div>
            </div>
          </div>
        `;
      }).join("");
    }

    // Visa Balance Guard
    const meta = userMeta();
    const totalKRW = convertCurrency(grand, base, "KRW");
    const minVisa = Number(meta.visaMinKRW) || 10000000;
    const ratio = Math.min(100, Math.round((totalKRW / minVisa) * 100));
    const buf = totalKRW - minVisa;

    document.getElementById("visa-min-display").textContent = formatMoney(minVisa, "KRW");
    document.getElementById("visa-avail-display").textContent = formatMoney(totalKRW, "KRW");
    document.getElementById("visa-progress-bar").style.width = ratio + "%";

    const vBox = document.getElementById("visa-status-box");
    if (buf < 0) {
      vBox.textContent = "WARNING: Below Visa reserve by " + formatMoney(Math.abs(buf), "KRW");
    } else if (buf < minVisa * 0.2) {
      vBox.textContent = "Caution: Only " + formatMoney(buf, "KRW") + " above Visa minimum.";
    } else {
      vBox.textContent = "Safe for Visa renewal (+" + formatMoney(buf, "KRW") + " buffer).";
    }

    // $50K Limit
    const used50k = Number(meta.fx50kUsedUSD) || 0;
    const pct50k = Math.min(100, Math.round((used50k / 50000) * 100));
    document.getElementById("fx50k-used-display").textContent = formatMoney(used50k, "USD");
    const b50 = document.getElementById("fx50k-bar");
    b50.style.width = pct50k + "%";
    b50.className = "bar-fill " + (pct50k >= 80 ? "bar-deep" : "bar-powder");
  }

  function calcDDay(dateStr) {
    if (!dateStr) return { days: 999, label: "No maturity" };
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const diff = Math.ceil((new Date(dateStr) - now) / 86400000);
    if (diff < 0) return { days: diff, label: "Matured" };
    if (diff === 0) return { days: 0, label: "D-Day" };
    return { days: diff, label: "D-" + diff };
  }

  function calcEstimatedInterest(p, rate, s, e) {
    const principal = Number(p) || 0;
    const r = (Number(rate) || 0) / 100;
    if (!s || !e) return principal * r;
    const days = Math.max(1, (new Date(e) - new Date(s)) / 86400000);
    return principal * r * (days / 365);
  }

  function renderTransfer() {
    const wallets = userWallets();
    const sel = document.getElementById("remit-source-wallet");
    if (wallets.length) {
      const prev = sel.value;
      sel.innerHTML = wallets.map(w => `<option value="${w.Wallet_ID}">${escapeHtml(w.Wallet_Name)} (${formatMoney(w.Balance, w.Currency)})</option>`).join("");
      if (wallets.some(w => w.Wallet_ID === prev)) sel.value = prev;
    } else {
      sel.innerHTML = `<option value="">No wallet</option>`;
    }
    renderRemitCompare();
    updateQRPreview();
    renderSplitBill();
    renderATMList();
  }

  function renderRemitCompare() {
    const amount = Number(document.getElementById("remit-amount").value) || 0;
    const [fromCurr, toCurr] = document.getElementById("remit-pair").value.split("_");
    const mid = convertCurrency(1, fromCurr, toCurr);

    const list = [
      { id: "stablecoin", name: "Stablecoin Route (USDT/USDC)", spread: 0.002, fee: fromCurr === "KRW" ? 1500 : 1, speed: "~2 min" },
      { id: "sentbe", name: "SentBe", spread: 0.007, fee: fromCurr === "KRW" ? 5000 : 3.5, speed: "5–30 min" },
      { id: "hanpass", name: "Hanpass", spread: 0.009, fee: fromCurr === "KRW" ? 5000 : 4, speed: "10–40 min" },
      { id: "wirebarley", name: "WireBarley", spread: 0.011, fee: fromCurr === "KRW" ? 4000 : 3, speed: "1–2 hrs" }
    ].map(p => {
      const recv = Math.max(0, amount - p.fee) * mid * (1 - p.spread);
      return Object.assign({}, p, { recv });
    }).sort((a, b) => b.recv - a.recv);

    document.getElementById("remit-compare-list").innerHTML = list.map((p, idx) => `
      <div class="remit-item ${idx === 0 ? "best" : ""}">
        <div class="remit-top">
          <strong style="font-size:14px;">${p.name}</strong>
          ${idx === 0 ? `<span class="badge-powder">${t("best_rate")}</span>` : `<span class="count-tag">${p.speed}</span>`}
        </div>
        <div class="remit-bottom">
          <div>
            <div class="remit-recv data-text">${formatMoney(p.recv, toCurr)}</div>
            <div class="mk-row-sub data-text">Fee: ${formatMoney(p.fee, fromCurr)} · ${p.speed}</div>
          </div>
          <button type="button" class="toss-btn ${idx === 0 ? "toss-btn-primary" : "toss-btn-soft"} toss-btn-sm" data-send-remit="${p.id}" data-remit-name="${p.name}">
            ${t("send_now")}
          </button>
        </div>
      </div>
    `).join("");
  }

  function executeRemit(providerName) {
    const amount = Number(document.getElementById("remit-amount").value) || 0;
    const [fromCurr, toCurr] = document.getElementById("remit-pair").value.split("_");
    const walletId = document.getElementById("remit-source-wallet").value;
    const wallet = state.db.wallets.find(w => w.Wallet_ID === walletId);
    if (amount <= 0) return showToast("Enter a valid amount.");
    if (wallet) {
      wallet.Balance = Math.max(0, wallet.Balance - convertCurrency(amount, fromCurr, wallet.Currency));
      callBackend("upsertWallet", wallet);
    }
    const meta = userMeta();
    meta.fx50kUsedUSD = Number(((meta.fx50kUsedUSD || 0) + convertCurrency(amount, fromCurr, "USD")).toFixed(2));
    const tx = {
      Tx_ID: "T" + Date.now(),
      User_ID: state.currentUser.User_ID,
      Date: new Date().toISOString().slice(0, 10),
      Type: "Transfer",
      Currency: fromCurr,
      Amount: amount,
      Jar_Category: "Family Remittance",
      Wallet_ID: walletId || "",
      Is_Travel_Mode: meta.travelMode.enabled,
      Note: fromCurr + "→" + toCurr + " via " + providerName
    };
    state.db.transactions.push(tx);
    saveLocalDB();
    callBackend("addTransaction", tx);
    callBackend("saveMeta", { User_ID: state.currentUser.User_ID, meta });
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
    const size = 21, cell = canvas.width / size;
    ctx.fillStyle = "#FAF9F8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let seed = 0;
    for (let i = 0; i < payload.length; i++) seed = ((seed << 5) - seed + payload.charCodeAt(i)) | 0;

    function finder(ox, oy) {
      ctx.fillStyle = "#150811"; ctx.fillRect(ox * cell, oy * cell, 7 * cell, 7 * cell);
      ctx.fillStyle = "#FAF9F8"; ctx.fillRect((ox + 1) * cell, (oy + 1) * cell, 5 * cell, 5 * cell);
      ctx.fillStyle = "#623B70"; ctx.fillRect((ox + 2) * cell, (oy + 2) * cell, 3 * cell, 3 * cell);
    }
    finder(0, 0); finder(size - 7, 0); finder(0, size - 7);

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
    const curr = document.getElementById("qr-recv-curr").value;
    document.getElementById("qr-converted-preview").textContent =
      "Recipient gets: " + formatMoney(convertCurrency(krw, "KRW", curr), curr) + " (0 Fee)";
  }

  function renderSplitBill() {
    const listEl = document.getElementById("split-items-list");
    const settleEl = document.getElementById("split-settlement-list");
    if (state.splitItems.length === 0) {
      listEl.innerHTML = `<p class="mk-sub">No expenses yet.</p>`;
      settleEl.innerHTML = `<p class="stat-label-light">Add expenses to calculate settlement.</p>`;
      return;
    }

    listEl.innerHTML = state.splitItems.map(it => `
      <div class="mk-row" style="cursor:default;">
        <div class="mk-row-left">
          <div class="mk-avatar">${it.currency}</div>
          <div class="mk-row-info">
            <div class="mk-row-title">${escapeHtml(it.payer)}</div>
            <div class="mk-row-sub">${escapeHtml(it.note)}</div>
          </div>
        </div>
        <div class="mk-row-right" style="display:flex; align-items:center; gap:8px;">
          <span class="mk-row-val data-text">${formatMoney(it.amount, it.currency)}</span>
          <button type="button" class="top-icon-btn" style="width:28px;height:28px;" data-del-split="${it.id}">✕</button>
        </div>
      </div>
    `).join("");

    const byP = {};
    let grandKRW = 0;
    state.splitItems.forEach(it => {
      const k = convertCurrency(it.amount, it.currency, "KRW");
      grandKRW += k;
      byP[it.payer] = (byP[it.payer] || 0) + k;
    });
    const names = Object.keys(byP);
    const share = grandKRW / names.length;
    const debtors = [], creditors = [];
    names.forEach(n => {
      const d = byP[n] - share;
      if (d < -100) debtors.push({ name: n, amt: -d });
      else if (d > 100) creditors.push({ name: n, amt: d });
    });
    const res = [];
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const pay = Math.min(debtors[i].amt, creditors[j].amt);
      res.push({ from: debtors[i].name, to: creditors[j].name, amt: pay });
      debtors[i].amt -= pay; creditors[j].amt -= pay;
      if (debtors[i].amt < 100) i++;
      if (creditors[j].amt < 100) j++;
    }

    settleEl.innerHTML = res.length === 0
      ? `<div class="settle-item">Everyone is settled (${formatMoney(share, "KRW")}/person).</div>`
      : `<div class="stat-label-light data-text">Total: ${formatMoney(grandKRW, "KRW")} · Per person: ${formatMoney(share, "KRW")}</div>` +
        res.map(s => `<div class="settle-item"><span><strong>${escapeHtml(s.from)}</strong> → <strong>${escapeHtml(s.to)}</strong></span><strong class="data-text">${formatMoney(s.amt, "KRW")}</strong></div>`).join("");
  }

  function renderATMList() {
    const filtered = SEOUL_SPOTS.filter(s => state.atmFilter === "all" || s.type === state.atmFilter);
    document.getElementById("atm-list").innerHTML = filtered.map(s => `
      <div class="atm-item">
        <div class="mk-row-info">
          <div class="mk-row-title">${escapeHtml(s.name)}</div>
          <div class="mk-row-sub">${s.area} · ${s.hours}</div>
          <div class="mk-row-sub">${escapeHtml(s.note)}</div>
        </div>
        <a class="toss-btn toss-btn-primary toss-btn-sm" style="text-decoration:none; flex-shrink:0;" href="https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}" target="_blank" rel="noopener">${t("directions")}</a>
      </div>
    `).join("");
    if (state.mapInstance) updateMapMarkers(filtered);
  }

  function initOrRefreshMap() {
    const el = document.getElementById("seoul-map");
    if (!el || typeof window.L === "undefined") return;
    if (!state.mapInstance) {
      state.mapInstance = window.L.map(el, { zoomControl: false }).setView([37.551, 126.975], 12);
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap" }).addTo(state.mapInstance);
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
        radius: 8, fillColor: s.type === "fx" ? "#531245" : "#623B70",
        color: "#FAF9F8", weight: 2, fillOpacity: 0.95
      }).addTo(state.mapInstance).bindPopup(`<strong>${s.name}</strong><br/>${s.area} (${s.hours})`);
      state.mapMarkers.push(m);
    });
  }

  function renderSpend() {
    const jars = userJars();
    const normalTxs = userTransactions().filter(tx => !tx.Is_Travel_Mode);
    const incBase = normalTxs.filter(tx => tx.Type === "Income").reduce((s, tx) => s + convertCurrency(tx.Amount, tx.Currency, "KRW"), 0) || 2000000;

    const spentByJar = {};
    normalTxs.filter(tx => tx.Type !== "Income").forEach(tx => {
      const k = tx.Jar_Category || "Necessities";
      spentByJar[k] = (spentByJar[k] || 0) + convertCurrency(tx.Amount, tx.Currency, "KRW");
    });

    const totalPct = jars.reduce((s, j) => s + Number(j.pct), 0);
    const pctEl = document.getElementById("jars-total-pct");
    pctEl.textContent = totalPct + "%";
    pctEl.style.background = totalPct === 100 ? "rgba(170,170,255,0.35)" : "#531245";
    pctEl.style.color = totalPct === 100 ? "#150811" : "#FAF9F8";

    document.getElementById("jars-list").innerHTML = jars.map((j, idx) => {
      const cap = incBase * (j.pct / 100);
      const sp = spentByJar[j.name] || 0;
      const usedPct = cap > 0 ? Math.min(100, Math.round((sp / cap) * 100)) : 0;
      return `
        <div class="jar-row">
          <div class="jar-top">
            <input type="text" class="jar-name-input" data-jar-name="${idx}" value="${escapeHtml(j.name)}" />
            <span class="count-tag data-text">${j.pct}%</span>
          </div>
          <input type="range" class="jar-range" min="0" max="80" step="1" value="${j.pct}" data-jar-range="${idx}" />
          <div class="stat-pair data-text" style="font-size:11px; color:#623B70;">
            <span>${formatMoney(sp, "KRW")}</span>
            <span>${formatMoney(cap, "KRW")}</span>
          </div>
          <div class="bar-track" style="margin:2px 0 0;">
            <div class="bar-fill ${usedPct > 90 ? "bar-deep" : "bar-velvet"}" style="width:${usedPct}%;"></div>
          </div>
        </div>
      `;
    }).join("");

    renderCashflowChart(normalTxs);
    renderRecentTx();
    renderSubs();
  }

  function renderCashflowChart(normalTxs) {
    const p = state.cashflowPeriod;
    const days = { "1W": 7, "1M": 30, "3M": 90, "6M": 180, "1Y": 365 }[p] || 30;
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - days);
    const recent = normalTxs.filter(tx => new Date(tx.Date) >= cutoff);
    const realInc = recent.filter(tx => tx.Type === "Income").reduce((s, tx) => s + convertCurrency(tx.Amount, tx.Currency, "KRW"), 0);
    const realExp = recent.filter(tx => tx.Type !== "Income").reduce((s, tx) => s + convertCurrency(tx.Amount, tx.Currency, "KRW"), 0);

    const labels = {
      "1W": ["Mon", "Wed", "Fri", "Sat", "Now"],
      "1M": ["W1", "W2", "W3", "W4", "Now"],
      "3M": ["M-2", "M-1", "Mid", "Late", "Now"],
      "6M": ["M-5", "M-4", "M-3", "M-2", "Now"],
      "1Y": ["Q1", "Q2", "Q3", "Q4", "Now"]
    }[p];
    const mult = { "1W": 0.25, "1M": 1, "3M": 2.8, "6M": 5.5, "1Y": 11 }[p] || 1;
    const incS = [1650000, 1750000, 1700000, 1800000, Math.max(realInc, 1850000)].map((v, i) => i === 4 ? v : Math.round(v * mult * 0.22));
    const expS = [920000, 1180000, 860000, 1490000, Math.max(realExp, 797000)].map((v, i) => i === 4 ? v : Math.round(v * mult * 0.22));

    const sumI = incS.reduce((a, b) => a + b, 0);
    const sumE = expS.reduce((a, b) => a + b, 0);
    const avgE = sumE / expS.length;
    const maxV = Math.max(...incS, ...expS, 1);

    document.getElementById("cf-income-val").textContent = formatMoney(sumI, "KRW");
    document.getElementById("cf-expense-val").textContent = formatMoney(sumE, "KRW");
    document.getElementById("cf-net-val").textContent = formatMoney(sumI - sumE, "KRW");

    let spike = "";
    const bars = labels.map((lbl, i) => {
      const x = 16 + i * 66;
      const hi = Math.max(8, Math.round((incS[i] / maxV) * 94));
      const he = Math.max(8, Math.round((expS[i] / maxV) * 94));
      const isSp = expS[i] > avgE * 1.18;
      if (isSp) spike = lbl;
      return `
        <rect x="${x}" y="${108 - hi}" width="18" height="${hi}" rx="5" fill="#AAAAFF" />
        <rect x="${x + 22}" y="${108 - he}" width="18" height="${he}" rx="5" fill="${isSp ? "#531245" : "#623B70"}" />
        <text x="${x + 20}" y="128" text-anchor="middle" font-size="10" fill="#150811" font-family="Arial Narrow, sans-serif">${lbl}</text>
      `;
    }).join("");

    document.getElementById("cashflow-chart").innerHTML = `
      <svg viewBox="0 0 344 136" width="100%" height="136">
        <line x1="10" y1="108" x2="334" y2="108" stroke="#BEB8CD" stroke-width="1" />
        ${bars}
      </svg>
    `;
    document.getElementById("cashflow-spike-badge").hidden = !spike;
    document.getElementById("cashflow-insight-text").textContent = spike
      ? `Spending at "${spike}" exceeded the period average (${formatMoney(avgE, "KRW")}).`
      : "Spending stays steady within your average.";
  }

  function renderRecentTx() {
    const txs = userTransactions();
    document.getElementById("tx-count-label").textContent = String(txs.length);
    const list = document.getElementById("tx-list");
    if (txs.length === 0) {
      list.innerHTML = `<p class="mk-sub">No transactions yet.</p>`;
      return;
    }
    list.innerHTML = txs.slice(0, 8).map(tx => `
      <div class="mk-row" style="cursor:default;">
        <div class="mk-row-left">
          <div class="mk-avatar ${tx.Type === "Income" ? "mk-avatar-powder" : ""}">${tx.Type === "Income" ? "+" : "−"}</div>
          <div class="mk-row-info">
            <div class="mk-row-title">${escapeHtml(tx.Note || tx.Jar_Category)} ${tx.Is_Travel_Mode ? '<span class="badge-deep">Travel</span>' : ''}</div>
            <div class="mk-row-sub data-text">${tx.Date} · ${escapeHtml(tx.Jar_Category)}</div>
          </div>
        </div>
        <div class="mk-row-right">
          <div class="mk-row-val data-text ${tx.Type === "Income" ? "income" : "expense"}">
            ${tx.Type === "Income" ? "+" : "-"}${formatMoney(tx.Amount, tx.Currency)}
          </div>
        </div>
      </div>
    `).join("");
  }

  function renderSubs() {
    const subs = userMeta().subscriptions || [];
    const totalKRW = subs.reduce((s, x) => s + convertCurrency(x.amount, x.currency, "KRW"), 0);
    document.getElementById("subs-monthly-total").textContent = formatMoney(totalKRW, "KRW");

    const todayD = new Date().getDate();
    const list = document.getElementById("subs-list");
    if (subs.length === 0) {
      list.innerHTML = `<p class="stat-label-light">No active subscriptions.</p>`;
      return;
    }
    list.innerHTML = subs.map(s => {
      const diff = (Number(s.billingDay) - todayD + 31) % 31;
      const is24 = diff === 0 || diff === 1;
      return `
        <div class="sub-row">
          <div class="mk-row-info">
            <div style="font-weight:700; color:#FAF9F8;">${escapeHtml(s.name)} ${is24 ? '<span class="badge-powder">24h Alert</span>' : ''}</div>
            <div class="stat-label-light data-text">Day ${s.billingDay} · ${formatMoney(s.amount, s.currency)}</div>
          </div>
          <button type="button" class="toss-btn toss-btn-soft toss-btn-sm" style="background:rgba(250,249,248,0.16); color:#FAF9F8;" data-del-sub="${s.id}">✕</button>
        </div>
      `;
    }).join("");
  }

  function renderGoals() {
    const meta = userMeta();
    const tm = meta.travelMode;
    document.getElementById("toggle-travel-mode").checked = !!tm.enabled;
    document.getElementById("travel-mode-details").hidden = !tm.enabled;
    document.getElementById("travel-trip-name").value = tm.tripName || "";
    document.getElementById("travel-budget-krw").value = tm.budgetKRW || 1500000;

    const spent = userTransactions().filter(tx => tx.Is_Travel_Mode && tx.Type !== "Income")
      .reduce((s, tx) => s + convertCurrency(tx.Amount, tx.Currency, "KRW"), 0);
    const budget = Number(tm.budgetKRW) || 1;
    document.getElementById("travel-spent-display").textContent = formatMoney(spent, "KRW");
    document.getElementById("travel-remain-display").textContent = t("left_label") + " " + formatMoney(Math.max(0, budget - spent), "KRW");
    document.getElementById("travel-progress-bar").style.width = Math.min(100, Math.round((spent / budget) * 100)) + "%";

    const goals = meta.goals || [];
    const list = document.getElementById("goals-list");
    if (goals.length === 0) {
      list.innerHTML = `<p class="mk-sub">No goals yet. Tap "+ Goal" to start saving.</p>`;
      return;
    }
    list.innerHTML = goals.map(g => {
      const rem = Math.max(0, Number(g.targetAmount) - Number(g.savedAmount));
      const months = Math.max(1, Math.ceil((new Date(g.deadline) - new Date()) / (86400000 * 30)));
      const perM = rem / months;
      const pct = Math.min(100, Math.round((Number(g.savedAmount) / Math.max(1, Number(g.targetAmount))) * 100));
      const usdtChunk = convertCurrency(perM / 2, g.currency, "USDT");
      return `
        <div class="goal-box">
          <div class="mk-card-head" style="margin-bottom:0;">
            <div>
              <div class="mk-row-title">${escapeHtml(g.name)}</div>
              <div class="mk-row-sub data-text">${g.deadline} (${months} mo)</div>
            </div>
            <span class="count-tag data-text">${pct}%</span>
          </div>
          <div class="stat-pair data-text" style="font-size:12px; color:#623B70;">
            <span>Saved: <strong>${formatMoney(g.savedAmount, g.currency)}</strong></span>
            <span>Goal: <strong>${formatMoney(g.targetAmount, g.currency)}</strong></span>
          </div>
          <div class="bar-track" style="margin:2px 0;">
            <div class="bar-fill bar-velvet" style="width:${pct}%;"></div>
          </div>
          <div class="hedge-tip data-text">
            Save <strong>${formatMoney(perM, g.currency)}/mo</strong> · Convert <strong>${formatMoney(usdtChunk, "USDT")}</strong> bi-weekly on good FX days.
          </div>
          <div class="grid-2" style="margin-top:2px;">
            <button type="button" class="toss-btn toss-btn-soft toss-btn-sm" data-topup-goal="${g.id}">+10% Top-up</button>
            <button type="button" class="toss-btn toss-btn-soft toss-btn-sm" style="color:#531245;" data-del-goal="${g.id}">Delete</button>
          </div>
        </div>
      `;
    }).join("");
  }

  function renderAI() {
    const wallets = userWallets();
    const savings = userSavings();
    const meta = userMeta();
    const jars = userJars();

    const wKRW = wallets.reduce((s, w) => s + convertCurrency(w.Balance, w.Currency, "KRW"), 0);
    const sKRW = savings.reduce((s, sv) => s + convertCurrency(sv.Principal_Amount, sv.Currency, "KRW"), 0);
    const tot = wKRW + sKRW;

    const scSav = Math.min(35, Math.round((tot > 0 ? sKRW / tot : 0) * 45));
    const vMin = Number(meta.visaMinKRW) || 10000000;
    const scVisa = tot >= vMin * 1.2 ? 35 : tot >= vMin ? 28 : Math.round((tot / vMin) * 22);
    const scJars = jars.reduce((s, j) => s + Number(j.pct), 0) === 100 ? 28 : 16;

    const total = Math.max(0, Math.min(100, scSav + scVisa + scJars));
    const grade = total >= 85 ? "Excellent" : total >= 70 ? "Good" : total >= 50 ? "Fair" : "Needs Care";

    document.getElementById("health-score-num").textContent = total;
    document.getElementById("health-grade-pill").textContent = grade;
    document.getElementById("health-ring-circle").setAttribute("stroke-dashoffset", String(302 - (total / 100) * 302));

    document.getElementById("health-breakdown").innerHTML = `
      <div class="score-line"><span>Savings Ratio</span><strong>${scSav}/35</strong></div>
      <div class="score-line"><span>Visa Safety</span><strong>${scVisa}/35</strong></div>
      <div class="score-line"><span>6-Jar Balance</span><strong>${scJars}/30</strong></div>
    `;

    const tips = [];
    if (tot < vMin * 1.15) tips.push("Keep at least 15% buffer above your Visa minimum (" + formatMoney(vMin, "KRW") + ").");
    else tips.push("Visa reserve is safe. Consider auto-hedging surplus into USDT for your goals.");
    if (meta.subscriptions && meta.subscriptions.length >= 3) tips.push("Review " + meta.subscriptions.length + " recurring subscriptions to prevent silent leaks.");
    else tips.push("Scan receipts with AI OCR to keep your Necessities jar accurate.");
    document.getElementById("ai-weekly-tips").innerHTML = tips.map(x => `<li>${x}</li>`).join("");

    const alerts = meta.fxAlerts || [];
    const alEl = document.getElementById("fx-alerts-list");
    if (alerts.length === 0) {
      alEl.innerHTML = `<p class="mk-sub">No active rate alerts.</p>`;
    } else {
      alEl.innerHTML = alerts.map(al => {
        const [f, to] = al.pair.split("_");
        const live = convertCurrency(1, f, to);
        const hit = (al.pair === "KRW_VND" && live >= al.target) || (al.pair !== "KRW_VND" && live <= al.target);
        return `
          <div class="mk-row" style="cursor:default;">
            <div class="mk-row-info">
              <div class="mk-row-title data-text">1 ${f} → ${to} · Target ${al.target}</div>
              <div class="mk-row-sub data-text">Live: <strong>${live.toFixed(2)}</strong></div>
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
              <span class="${hit ? "badge-deep" : "count-tag"}">${hit ? "Hit!" : "Watch"}</span>
              <button type="button" class="top-icon-btn" style="width:28px;height:28px;" data-del-alert="${al.id}">✕</button>
            </div>
          </div>
        `;
      }).join("");
    }
  }

  // ------------------------------------------------------------------------
  // 6. BOTTOM SHEET MODALS (INCLUDING ACCOUNT & 6-LANGUAGE SWITCHER)
  // ------------------------------------------------------------------------
  function openModal(title, html) {
    document.getElementById("modal-title").textContent = title;
    document.getElementById("modal-body").innerHTML = html;
    document.getElementById("modal-backdrop").hidden = false;
  }
  function closeModal() { document.getElementById("modal-backdrop").hidden = true; }

  function openAccountModal() {
    openModal(t("account_settings"), `
      <div class="goal-box">
        <div class="mk-row-title">${escapeHtml(state.currentUser.FullName)}</div>
        <div class="mk-row-sub data-text">User ID #${state.currentUser.User_ID} · @${escapeHtml(state.currentUser.Username)}</div>
        <div class="mk-row-sub">${escapeHtml(state.currentUser.Email || "")}</div>
      </div>

      <div>
        <div class="mk-subtitle" style="margin-bottom:8px;">${t("language_label")}</div>
        <div class="lang-grid" id="modal-lang-grid">
          ${LANGUAGES.map(l => `<button type="button" class="lang-btn ${state.lang === l.code ? "active" : ""}" data-set-lang="${l.code}">${l.label}</button>`).join("")}
        </div>
      </div>

      <div class="grid-2" style="margin-top:6px;">
        <button type="button" class="toss-btn toss-btn-soft" id="btn-reset-demo">${t("reset_demo")}</button>
        <button type="button" class="toss-btn toss-btn-deep" id="btn-logout">${t("logout_btn")}</button>
      </div>
    `);

    document.getElementById("modal-lang-grid").onclick = (e) => {
      const btn = e.target.closest("[data-set-lang]");
      if (!btn) return;
      state.lang = btn.dataset.setLang;
      localStorage.setItem(LANG_KEY, state.lang);
      renderAll();
      openAccountModal();
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
    const ex = editId ? state.db.wallets.find(w => w.Wallet_ID === editId) : null;
    if (!ex && userWallets().length >= 6) return showToast("Maximum 6 wallets reached.");

    openModal(ex ? "Edit Wallet" : "Add Wallet", `
      <form id="modal-wallet-form" class="stack">
        <div class="field">
          <label>Wallet Name</label>
          <input name="Wallet_Name" required value="${ex ? escapeHtml(ex.Wallet_Name) : ""}" placeholder="e.g. KakaoBank / EUR Cash" />
        </div>
        <div class="grid-2">
          <div class="field">
            <label>Type</label>
            <select name="Type">
              <option value="Bank" ${ex && ex.Type === "Bank" ? "selected" : ""}>Bank</option>
              <option value="Cash" ${ex && ex.Type === "Cash" ? "selected" : ""}>Cash</option>
            </select>
          </div>
          <div class="field">
            <label>Country</label>
            <input name="Country" required value="${ex ? escapeHtml(ex.Country) : "South Korea"}" />
          </div>
        </div>
        <div class="grid-2">
          <div class="field">
            <label>Currency</label>
            <select name="Currency">
              ${["KRW", "VND", "USD", "USDT", "EUR", "JPY", "RUB", "UZS", "BYN"].map(c => `<option value="${c}" ${ex && ex.Currency === c ? "selected" : ""}>${c}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label>Balance</label>
            <input name="Balance" type="number" step="any" required class="data-text" value="${ex ? ex.Balance : 0}" />
          </div>
        </div>
        <button type="submit" class="toss-btn toss-btn-primary toss-btn-full">${ex ? "Save Changes" : "Add Wallet"}</button>
        ${ex ? `<button type="button" class="toss-btn toss-btn-soft toss-btn-full" style="color:#531245;" id="btn-del-wallet-modal">Delete Wallet</button>` : ""}
      </form>
    `);

    document.getElementById("modal-wallet-form").onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = {
        Wallet_ID: ex ? ex.Wallet_ID : "W" + Date.now(),
        User_ID: state.currentUser.User_ID,
        Wallet_Name: fd.get("Wallet_Name").trim(),
        Type: fd.get("Type"),
        Country: fd.get("Country").trim(),
        Currency: fd.get("Currency"),
        Balance: Number(fd.get("Balance")) || 0
      };
      if (ex) Object.assign(ex, data); else state.db.wallets.push(data);
      saveLocalDB();
      callBackend("upsertWallet", data);
      closeModal();
      renderAll();
      showToast(ex ? "Wallet updated" : "Wallet added");
    };

    if (ex) {
      document.getElementById("btn-del-wallet-modal").onclick = () => {
        state.db.wallets = state.db.wallets.filter(w => w.Wallet_ID !== ex.Wallet_ID);
        saveLocalDB();
        callBackend("deleteWallet", { Wallet_ID: ex.Wallet_ID });
        closeModal();
        renderAll();
        showToast("Wallet deleted");
      };
    }
  }

  function openSavingModal(editId) {
    const ex = editId ? state.db.savings.find(s => s.Saving_ID === editId) : null;
    openModal(ex ? "Edit Savings" : "Add Savings", `
      <form id="modal-saving-form" class="stack">
        <div class="field">
          <label>Bank / Account Name</label>
          <input name="Bank_Name" required value="${ex ? escapeHtml(ex.Bank_Name) : ""}" placeholder="e.g. Shinhan Savings" />
        </div>
        <div class="grid-2">
          <div class="field">
            <label>Country</label>
            <input name="Country" required value="${ex ? escapeHtml(ex.Country) : "South Korea"}" />
          </div>
          <div class="field">
            <label>Currency</label>
            <select name="Currency">
              ${["KRW", "VND", "USD"].map(c => `<option value="${c}" ${ex && ex.Currency === c ? "selected" : ""}>${c}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="grid-2">
          <div class="field">
            <label>Principal Amount</label>
            <input name="Principal_Amount" type="number" step="any" required class="data-text" value="${ex ? ex.Principal_Amount : 0}" />
          </div>
          <div class="field">
            <label>Interest Rate (%/yr)</label>
            <input name="Interest_Rate" type="number" step="0.1" required class="data-text" value="${ex ? ex.Interest_Rate : 3.5}" />
          </div>
        </div>
        <div class="grid-2">
          <div class="field">
            <label>Start Date</label>
            <input name="Start_Date" type="date" value="${ex ? ex.Start_Date : new Date().toISOString().slice(0, 10)}" />
          </div>
          <div class="field">
            <label>Maturity Date</label>
            <input name="Maturity_Date" type="date" value="${ex ? ex.Maturity_Date : ""}" />
          </div>
        </div>
        <button type="submit" class="toss-btn toss-btn-velvet toss-btn-full">Save</button>
        ${ex ? `<button type="button" class="toss-btn toss-btn-soft toss-btn-full" style="color:#531245;" id="btn-del-saving-modal">Delete Savings</button>` : ""}
      </form>
    `);

    document.getElementById("modal-saving-form").onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = {
        Saving_ID: ex ? ex.Saving_ID : "S" + Date.now(),
        User_ID: state.currentUser.User_ID,
        Bank_Name: fd.get("Bank_Name").trim(),
        Country: fd.get("Country").trim(),
        Currency: fd.get("Currency"),
        Principal_Amount: Number(fd.get("Principal_Amount")) || 0,
        Interest_Rate: Number(fd.get("Interest_Rate")) || 0,
        Start_Date: fd.get("Start_Date"),
        Maturity_Date: fd.get("Maturity_Date")
      };
      if (ex) Object.assign(ex, data); else state.db.savings.push(data);
      saveLocalDB();
      callBackend("upsertSaving", data);
      closeModal();
      renderAll();
      showToast("Savings saved");
    };

    if (ex) {
      document.getElementById("btn-del-saving-modal").onclick = () => {
        state.db.savings = state.db.savings.filter(s => s.Saving_ID !== ex.Saving_ID);
        saveLocalDB();
        callBackend("deleteSaving", { Saving_ID: ex.Saving_ID });
        closeModal();
        renderAll();
        showToast("Savings deleted");
      };
    }
  }

  function openAddTxModal(prefill) {
    const wallets = userWallets();
    const jars = userJars();
    const p = prefill || {};
    const isTravel = p.Is_Travel_Mode !== undefined ? p.Is_Travel_Mode : userMeta().travelMode.enabled;

    openModal(isTravel ? "Log Trip Expense" : "Add Transaction", `
      <form id="modal-tx-form" class="stack">
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
            <label>Amount</label>
            <input name="Amount" type="number" step="any" required class="data-text" value="${p.Amount || ""}" placeholder="15000" />
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
            <label>Jar Category</label>
            <select name="Jar_Category">
              ${jars.map(j => `<option value="${escapeHtml(j.name)}" ${p.Jar_Category === j.name ? "selected" : ""}>${escapeHtml(j.name)}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label>Wallet</label>
            <select name="Wallet_ID">
              ${wallets.map(w => `<option value="${w.Wallet_ID}">${escapeHtml(w.Wallet_Name)} (${w.Currency})</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="field">
          <label>Note</label>
          <input name="Note" type="text" value="${escapeHtml(p.Note || "")}" placeholder="e.g. Coffee / Groceries" />
        </div>
        <button type="submit" class="toss-btn toss-btn-primary toss-btn-full">Save Transaction</button>
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
        const d = convertCurrency(tx.Amount, tx.Currency, w.Currency);
        w.Balance = tx.Type === "Income" ? w.Balance + d : Math.max(0, w.Balance - d);
        callBackend("upsertWallet", w);
      }
      state.db.transactions.push(tx);
      saveLocalDB();
      callBackend("addTransaction", tx);
      closeModal();
      renderAll();
      showToast("Transaction saved");
    };
  }

  function openOCRModal() {
    openModal("AI Multilingual Receipt Scan", `
      <div class="scan-zone">
        <div id="ocr-laser" class="scan-laser" hidden></div>
        <p style="margin:0 0 10px; font-weight:700;">Upload or snap a receipt (KR / EN / VN)</p>
        <input type="file" id="ocr-file-input" accept="image/*" style="max-width:100%; font-size:12px;" />
        <p class="mk-sub" id="ocr-status-msg" style="margin-top:8px;">Or try an instant sample below:</p>
      </div>
      <div class="stack-tight">
        <button type="button" class="toss-btn toss-btn-soft toss-btn-full" data-ocr-sample="kr">Sample KR: GS25 (₩ 12,400)</button>
        <button type="button" class="toss-btn toss-btn-soft toss-btn-full" data-ocr-sample="en">Sample EN: Starbucks ($ 6.50)</button>
        <button type="button" class="toss-btn toss-btn-soft toss-btn-full" data-ocr-sample="vi">Sample VN: Pho Thin (85,000 ₫)</button>
      </div>
    `);

    const run = (sample) => {
      document.getElementById("ocr-laser").hidden = false;
      document.getElementById("ocr-status-msg").textContent = "AI extracting amount, currency & category...";
      setTimeout(() => { openAddTxModal(sample); showToast("Receipt extracted by AI"); }, 850);
    };

    document.getElementById("ocr-file-input").onchange = (e) => {
      const f = e.target.files[0];
      if (!f) return;
      run({ Type: "Expense", Amount: 18500, Currency: "KRW", Jar_Category: "Necessities", Note: "AI OCR (" + f.name.slice(0, 14) + ")" });
    };
    document.querySelectorAll("[data-ocr-sample]").forEach(b => {
      b.onclick = () => {
        const map = {
          kr: { Type: "Expense", Amount: 12400, Currency: "KRW", Jar_Category: "Necessities", Note: "GS25 Convenience (AI OCR)" },
          en: { Type: "Expense", Amount: 6.5, Currency: "USD", Jar_Category: "Play", Note: "Starbucks Coffee (AI OCR)" },
          vi: { Type: "Expense", Amount: 85000, Currency: "VND", Jar_Category: "Necessities", Note: "Pho Thin (AI OCR)" }
        };
        run(map[b.dataset.ocrSample]);
      };
    });
  }

  function openGoalModal() {
    openModal("New Savings Goal", `
      <form id="modal-goal-form" class="stack">
        <div class="field"><label>Goal Name</label><input name="name" required placeholder="e.g. Tuition / Flight Ticket" /></div>
        <div class="grid-2">
          <div class="field"><label>Target Amount</label><input name="targetAmount" type="number" required class="data-text" placeholder="5000000" /></div>
          <div class="field"><label>Currency</label><select name="currency"><option value="KRW">KRW</option><option value="USD">USD</option><option value="VND">VND</option></select></div>
        </div>
        <div class="grid-2">
          <div class="field"><label>Saved So Far</label><input name="savedAmount" type="number" value="0" class="data-text" /></div>
          <div class="field"><label>Deadline</label><input name="deadline" type="date" required value="2027-06-01" /></div>
        </div>
        <button type="submit" class="toss-btn toss-btn-primary toss-btn-full">Create Goal</button>
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
      callBackend("saveMeta", { User_ID: state.currentUser.User_ID, meta });
      closeModal();
      renderGoals();
      showToast("Goal created");
    };
  }

  function openSubModal() {
    openModal("Add Subscription", `
      <form id="modal-sub-form" class="stack">
        <div class="field"><label>Service Name</label><input name="name" required placeholder="e.g. YouTube Premium" /></div>
        <div class="grid-2">
          <div class="field"><label>Monthly Price</label><input name="amount" type="number" step="any" required class="data-text" placeholder="14900" /></div>
          <div class="field"><label>Currency</label><select name="currency"><option value="KRW">KRW</option><option value="USD">USD</option></select></div>
        </div>
        <div class="field"><label>Billing Day (1–31)</label><input name="billingDay" type="number" min="1" max="31" value="10" class="data-text" /></div>
        <button type="submit" class="toss-btn toss-btn-velvet toss-btn-full">Save Subscription</button>
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
      callBackend("saveMeta", { User_ID: state.currentUser.User_ID, meta });
      closeModal();
      renderAll();
      showToast("Subscription added");
    };
  }

  // ------------------------------------------------------------------------
  // 7. HELPERS & EVENTS
  // ------------------------------------------------------------------------
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
    document.querySelectorAll("[data-toggle-pw]").forEach(b => {
      b.addEventListener("click", () => {
        const inp = document.getElementById(b.dataset.togglePw);
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

    // Top-right Refresh & Settings
    document.getElementById("btn-refresh-fx").addEventListener("click", () => fetchLiveFX(true));
    document.getElementById("btn-open-settings").addEventListener("click", openAccountModal);

    // Bottom nav
    document.querySelectorAll(".nav-btn").forEach(b => b.addEventListener("click", () => switchTab(b.dataset.tab)));

    // Home Hero
    document.querySelectorAll("#base-currency-pills .seg-chip").forEach(b => {
      b.addEventListener("click", () => { state.baseCurrency = b.dataset.curr; renderHome(); });
    });
    document.getElementById("btn-toggle-hero-grad").addEventListener("click", () => {
      state.heroDarkGrad = !state.heroDarkGrad;
      document.getElementById("hero-asset-card").classList.toggle("hero-dark-grad", state.heroDarkGrad);
    });
    document.getElementById("btn-toggle-hide-bal").addEventListener("click", () => {
      state.hideBalance = !state.hideBalance;
      renderHome();
    });

    document.getElementById("btn-add-wallet").addEventListener("click", () => openWalletModal(null));
    document.getElementById("btn-add-saving").addEventListener("click", () => openSavingModal(null));

    document.getElementById("btn-edit-visa").addEventListener("click", () => {
      const meta = userMeta();
      openModal("Visa Balance Guard", `
        <form id="modal-visa-form" class="stack">
          <div class="field"><label>Minimum Reserve (KRW)</label><input name="visaMin" type="number" step="100000" required class="data-text" value="${meta.visaMinKRW}" /></div>
          <button type="submit" class="toss-btn toss-btn-velvet toss-btn-full">Save</button>
        </form>
      `);
      document.getElementById("modal-visa-form").onsubmit = (e) => {
        e.preventDefault();
        meta.visaMinKRW = Number(new FormData(e.target).get("visaMin")) || 10000000;
        saveLocalDB();
        callBackend("saveMeta", { User_ID: state.currentUser.User_ID, meta });
        closeModal(); renderAll(); showToast("Visa minimum updated");
      };
    });

    document.getElementById("btn-edit-fx50k").addEventListener("click", () => {
      const meta = userMeta();
      openModal("$50,000 Annual Limit", `
        <form id="modal-50k-form" class="stack">
          <div class="field"><label>Amount Transferred This Year (USD)</label><input name="used50k" type="number" step="100" required class="data-text" value="${meta.fx50kUsedUSD}" /></div>
          <button type="submit" class="toss-btn toss-btn-primary toss-btn-full">Update</button>
        </form>
      `);
      document.getElementById("modal-50k-form").onsubmit = (e) => {
        e.preventDefault();
        meta.fx50kUsedUSD = Number(new FormData(e.target).get("used50k")) || 0;
        saveLocalDB();
        callBackend("saveMeta", { User_ID: state.currentUser.User_ID, meta });
        closeModal(); renderHome(); showToast("Limit updated");
      };
    });

    // Delegated clicks inside main scroll
    document.getElementById("main-scroll").addEventListener("click", (e) => {
      const rowW = e.target.closest("[data-edit-wallet]");
      if (rowW) return openWalletModal(rowW.dataset.editWallet);
      const rowS = e.target.closest("[data-edit-saving]");
      if (rowS) return openSavingModal(rowS.dataset.editSaving);

      const btn = e.target.closest("button");
      if (!btn) return;
      if (btn.dataset.sendRemit) return executeRemit(btn.dataset.remitName);
      if (btn.dataset.delSplit) { state.splitItems = state.splitItems.filter(x => x.id !== btn.dataset.delSplit); return renderSplitBill(); }
      if (btn.dataset.delSub) {
        const meta = userMeta();
        meta.subscriptions = meta.subscriptions.filter(x => x.id !== btn.dataset.delSub);
        saveLocalDB(); callBackend("saveMeta", { User_ID: state.currentUser.User_ID, meta });
        renderAll(); return showToast("Subscription removed");
      }
      if (btn.dataset.delGoal) {
        const meta = userMeta();
        meta.goals = meta.goals.filter(x => x.id !== btn.dataset.delGoal);
        saveLocalDB(); callBackend("saveMeta", { User_ID: state.currentUser.User_ID, meta });
        renderGoals(); return showToast("Goal deleted");
      }
      if (btn.dataset.topupGoal) {
        const meta = userMeta();
        const g = meta.goals.find(x => x.id === btn.dataset.topupGoal);
        if (!g) return;
        g.savedAmount = Number(g.savedAmount) + Math.round(Number(g.targetAmount) * 0.1);
        saveLocalDB(); callBackend("saveMeta", { User_ID: state.currentUser.User_ID, meta });
        renderGoals(); return showToast("Added +10% to " + g.name);
      }
      if (btn.dataset.delAlert) {
        const meta = userMeta();
        meta.fxAlerts = meta.fxAlerts.filter(x => x.id !== btn.dataset.delAlert);
        saveLocalDB(); callBackend("saveMeta", { User_ID: state.currentUser.User_ID, meta });
        return renderAI();
      }
    });

    // Transfer controls
    document.querySelectorAll("#transfer-subtabs .seg-btn").forEach(b => b.addEventListener("click", () => switchSubtab(b.dataset.subtab)));
    document.getElementById("remit-amount").addEventListener("input", renderRemitCompare);
    document.getElementById("remit-pair").addEventListener("change", renderRemitCompare);
    document.getElementById("qr-send-amount").addEventListener("input", updateQRPreview);
    document.getElementById("qr-recv-curr").addEventListener("change", updateQRPreview);

    document.getElementById("btn-simulate-qr-send").addEventListener("click", () => {
      const krw = Number(document.getElementById("qr-send-amount").value) || 0;
      const to = document.getElementById("qr-recipient").value.trim() || "friend";
      const curr = document.getElementById("qr-recv-curr").value;
      if (krw <= 0) return showToast("Enter a valid KRW amount");
      const w = userWallets().find(x => x.Currency === "KRW") || userWallets()[0];
      if (w) w.Balance = Math.max(0, w.Balance - convertCurrency(krw, "KRW", w.Currency));
      const tx = {
        Tx_ID: "T" + Date.now(), User_ID: state.currentUser.User_ID,
        Date: new Date().toISOString().slice(0, 10), Type: "Transfer",
        Currency: "KRW", Amount: krw, Jar_Category: "Play",
        Wallet_ID: w ? w.Wallet_ID : "", Is_Travel_Mode: userMeta().travelMode.enabled,
        Note: "QR P2P to @" + to + " (" + curr + ")"
      };
      state.db.transactions.push(tx);
      saveLocalDB(); callBackend("addTransaction", tx);
      renderAll(); showToast("Sent " + formatMoney(krw, "KRW") + " to @" + to);
    });

    document.getElementById("btn-add-split-item").addEventListener("click", () => {
      const payer = document.getElementById("split-payer").value.trim();
      const amount = Number(document.getElementById("split-amount").value) || 0;
      const currency = document.getElementById("split-curr").value;
      const note = document.getElementById("split-note").value.trim() || "Shared item";
      if (!payer || amount <= 0) return showToast("Enter payer and amount");
      state.splitItems.push({ id: "sp" + Date.now(), payer, amount, currency, note });
      document.getElementById("split-payer").value = "";
      document.getElementById("split-amount").value = "";
      document.getElementById("split-note").value = "";
      renderSplitBill();
    });
    document.getElementById("btn-reset-split").addEventListener("click", () => { state.splitItems = []; renderSplitBill(); });

    document.querySelectorAll("#atm-filter-pills .seg-btn").forEach(b => {
      b.addEventListener("click", () => {
        state.atmFilter = b.dataset.atmFilter;
        document.querySelectorAll("#atm-filter-pills .seg-btn").forEach(x => x.classList.toggle("active", x === b));
        renderATMList();
      });
    });

    // Spend controls
    document.getElementById("btn-open-add-tx").addEventListener("click", () => openAddTxModal());
    document.getElementById("btn-open-ocr").addEventListener("click", openOCRModal);
    document.getElementById("btn-add-sub").addEventListener("click", openSubModal);

    document.getElementById("jars-list").addEventListener("input", (e) => {
      const jars = userJars();
      if (e.target.dataset.jarRange !== undefined) { jars[Number(e.target.dataset.jarRange)].pct = Number(e.target.value); renderSpend(); }
      else if (e.target.dataset.jarName !== undefined) { jars[Number(e.target.dataset.jarName)].name = e.target.value; }
    });
    document.getElementById("btn-autobalance-jars").addEventListener("click", () => {
      const jars = userJars();
      const sum = jars.reduce((s, j) => s + Number(j.pct), 0) || 1;
      let acc = 0;
      jars.forEach((j, i) => { if (i === jars.length - 1) j.pct = Math.max(0, 100 - acc); else { j.pct = Math.round((j.pct / sum) * 100); acc += j.pct; } });
      renderSpend();
    });
    document.getElementById("btn-save-jars").addEventListener("click", () => {
      const jars = userJars();
      const sum = jars.reduce((s, j) => s + Number(j.pct), 0);
      if (sum !== 100) return showToast("Total must equal 100% (currently " + sum + "%)");
      saveLocalDB(); callBackend("saveJars", { User_ID: state.currentUser.User_ID, jars });
      renderAI(); showToast("6-Jar budget saved");
    });

    document.querySelectorAll("#cashflow-period-pills .seg-btn").forEach(b => {
      b.addEventListener("click", () => {
        state.cashflowPeriod = b.dataset.period;
        document.querySelectorAll("#cashflow-period-pills .seg-btn").forEach(x => x.classList.toggle("active", x === b));
        renderSpend();
      });
    });

    // Goals & Travel
    document.getElementById("toggle-travel-mode").addEventListener("change", (e) => {
      const meta = userMeta();
      meta.travelMode.enabled = e.target.checked;
      saveLocalDB(); callBackend("saveMeta", { User_ID: state.currentUser.User_ID, meta });
      renderAll(); showToast(e.target.checked ? "Travel Mode ON" : "Travel Mode OFF");
    });
    document.getElementById("travel-trip-name").addEventListener("change", (e) => { userMeta().travelMode.tripName = e.target.value; saveLocalDB(); });
    document.getElementById("travel-budget-krw").addEventListener("change", (e) => { userMeta().travelMode.budgetKRW = Number(e.target.value) || 1500000; saveLocalDB(); renderGoals(); });
    document.getElementById("btn-add-travel-tx").addEventListener("click", () => openAddTxModal({ Is_Travel_Mode: true, Jar_Category: "Travel" }));
    document.getElementById("btn-add-goal").addEventListener("click", openGoalModal);

    // AI Alerts
    document.getElementById("btn-add-fx-alert").addEventListener("click", () => {
      const pair = document.getElementById("alert-pair").value;
      const target = Number(document.getElementById("alert-target").value);
      if (!target || target <= 0) return showToast("Enter a valid target rate");
      const meta = userMeta();
      meta.fxAlerts.push({ id: "AL" + Date.now(), pair, target });
      document.getElementById("alert-target").value = "";
      saveLocalDB(); callBackend("saveMeta", { User_ID: state.currentUser.User_ID, meta });
      renderAI(); showToast("Rate alert added");
    });

    // Modal close
    document.getElementById("modal-close").addEventListener("click", closeModal);
    document.getElementById("modal-backdrop").addEventListener("click", (e) => { if (e.target.id === "modal-backdrop") closeModal(); });
  }

  document.addEventListener("DOMContentLoaded", () => {
    state.db = loadLocalDB();
    applyI18n();
    bindEvents();
    startLaunch();
    fetchLiveFX(false);
    setInterval(() => fetchLiveFX(false), (window.MONIFY_CONFIG && window.MONIFY_CONFIG.AUTO_REFRESH_FX_MS) || 300000);
  });
})();
