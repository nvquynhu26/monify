const R = { KRW: 1400, VND: 25400, USD: 1, USDT: 1, EUR: 0.92, JPY: 150, RUB: 90, UZS: 12700 };
const CUR = Object.keys(R);
const API = window.MONIFY_API || "";

const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const f = (n, c) => (Math.abs(n) < 100 && n % 1 ? n.toFixed(2) : Math.round(n).toLocaleString("en-US")) + (c ? " " + c : "");
const cv = (a, x, y) => a / R[x] * R[y];
const cl = x => Math.max(0, Math.min(1, x));
const ld = k => JSON.parse(localStorage.getItem(k) || "null");
const sv = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const opt = d => CUR.map(c => `<option ${c == d ? "selected" : ""}>${c}</option>`).join("");
const today = () => new Date().toISOString().slice(0, 10);

/* ---------- Alphabetical Languages ----------
   Belarusian, Chinese, English, Korean, Russian, Uzbek, Vietnamese
*/
const LANG_LIST = [
  { code: "be", label: "Belarusian" },
  { code: "zh", label: "Chinese" },
  { code: "en", label: "English" },
  { code: "ko", label: "Korean" },
  { code: "ru", label: "Russian" },
  { code: "uz", label: "Uzbek" },
  { code: "vi", label: "Vietnamese" }
];

const I18N = {
  en: {
    subtitle: "My Finance Manager",
    username: "Username",
    password: "Password",
    showHide: "Show/Hide",
    login: "Log In",
    noAccount: "Don't have an account?",
    registerNow: "Register now",
    register: "Create Account",
    fullName: "Full Name",
    dob: "Date of Birth",
    email: "Email",
    phone: "Phone Number",
    fillAll: "Please fill in all fields",
    backLogin: "← Back to Log In",
    loginErr: "Invalid username or password",
    userExists: "Username already exists",
    menuAccount: "Account",
    menuLang: "Language",
    menuLogout: "Log Out",
    saveProfile: "Save to Google Sheet",
    profileSaved: "Updated!",
    tabs: ["Home", "Transfer", "Spending", "Goals", "AI Assistant"],
    totalAssets: "Total Assets (incl. Savings)",
    wallets: "Wallets",
    walletsUnit: "wallets",
    edit: "Edit",
    del: "Delete",
    addWallet: "+ Add Wallet",
    savings: "Savings Accounts",
    matured: "Matured D+",
    yr: "/yr",
    estInterest: "Est. interest",
    visaShield: "Visa Balance Shield",
    minVisa: "Minimum required balance (KRW)",
    safe: "Safe",
    warnVisa: "Warning: Available balance is close to threshold!",
    available: "available",
    remitRadar: "$50,000/yr Remittance Radar",
    record: "+ Record",
    taxNote: "Reminder: Tax settlement/refund in May. For reference only.",
    intlCompare: "International Transfer Comparison",
    best: "Best",
    fee: "Fee",
    sampleRateNote: "Fees and exchange spreads are sample figures; connect live API for real-time rates.",
    myQr: "My QR",
    qrSim: "simulated QR code",
    amount: "Amount",
    scanSend: "Scan QR & Send (Simulated)",
    splitTitle: "Multi-Currency Group Split",
    splitHint: "Each line: Name,Amount Paid,Currency",
    total: "Total",
    each: "each",
    settled: "All settled",
    atmTitle: "Global ATM & Exchange Booths",
    directions: "Directions",
    sixJars: "6 Jars Budget",
    monthlyInc: "Monthly Income (KRW)",
    spent: "Spent",
    jarTotal: "Total",
    need100: "— must equal 100%",
    editJarsTitle: "Edit 6 Jars Allocation",
    jarName: "Jar Name",
    done: "Done",
    addExpense: "Add Expense",
    travelCheck: "Home Visit / Travel Expense",
    save: "Save",
    scanReceipt: "Scan Receipt (Demo)",
    cashFlow: "Cash Flow Analysis",
    periods: ["1W", "1M", "3M", "6M", "1Y"],
    chartLegend: "Income (gray) · Expense (blue) · Above average spend (deep purple)",
    radarTitle: "6 Jars Spending Radar",
    radarLegend: "Target % (dashed) vs. Actual Share % (filled)",
    subsTitle: "Recurring Subscriptions",
    mo: "/mo",
    dayOfMonth: "Day {d} every month",
    due24h: " · due within 24h!",
    addSub: "+ Add Subscription",
    travelMode: "Home Visit / Travel Mode",
    travelDesc: "Separate trip expenses from daily living stats",
    on: "ON",
    off: "OFF",
    travelSpent: "Travel spending",
    finGoals: "Financial Goals",
    deadline: "deadline",
    needMonthly: "Monthly saving needed",
    usdtTip: "Tip: Split ~{amt}/transfer, 4 times/month when rates are favorable.",
    addGoal: "+ Add Goal",
    healthScore: "Financial Health Score",
    greatKeep: "Great job, keep it up!",
    tipSave: "Savings rate below 20%: try cutting Play jar spending this week.",
    tipVisa: "Balance close to Visa threshold: pause large expenses and top up.",
    tipJarOver: "One or more jars exceeded budget: review the Spending tab.",
    tipJar100: "Total jar percentages do not equal 100%.",
    aiChatTitle: "Chat with AI Assistant",
    aiWelcome: "Ask me anything about your finances.",
    aiPlaceholder: "Type a message...",
    send: "Send",
    aiUnsupported: "This feature is not currently supported by the app.",
    fxTitle: "Target Exchange Rate Alert",
    threshold: "Target Rate",
    setAlert: "Set Alert",
    currentSample: "Current (sample)",
    reached: "TARGET REACHED",
    notReached: "not reached",
    fxDisclaimer: "Analysis is for reference only based on historical data and does not guarantee future exchange rates.",
    defaultJars: ["Necessities", "Education", "Long-term Savings", "Play", "Investment", "Give / Home"],
    prompts: {
      wName: "Wallet Name",
      wCur: "Currency: ",
      wCurErr: "Unsupported currency",
      wType: "Type: Bank or Cash",
      wCountry: "Country",
      wBal: "Balance",
      wDel: "Delete this wallet?",
      sPrin: "Principal Amount",
      sStart: "Start Date (YYYY-MM-DD)",
      sMat: "Maturity Date (YYYY-MM-DD)",
      sRate: "Interest Rate %/year",
      sentAmt: "Remitted Amount (USD)",
      subName: "Subscription Name",
      subCur: "Currency: KRW or USD",
      subAmt: "Monthly Amount",
      subDay: "Billing Day (1-28)",
      gName: "Goal Name (tuition, housing deposit...)",
      gTarget: "Target Amount",
      gDl: "Deadline (YYYY-MM-DD)",
      gSaved: "Already Saved",
      scanDemo: "Demo: filled 15,800 KRW → Necessities jar. Connect real OCR API (Claude/Google Vision) for live scanning.",
      qrOut: "Sender pays {a} → Recipient receives {b}"
    }
  },
  ko: {
    subtitle: "나의 자산 관리 매니저",
    username: "아이디",
    password: "비밀번호",
    showHide: "표시/숨기기",
    login: "로그인",
    noAccount: "계정이 없으신가요?",
    registerNow: "회원가입",
    register: "회원가입",
    fullName: "이름",
    dob: "생년월일",
    email: "이메일",
    phone: "전화번호",
    fillAll: "모든 항목을 입력해 주세요",
    backLogin: "← 로그인으로 돌아가기",
    loginErr: "아이디 또는 비밀번호가 올바르지 않습니다",
    userExists: "이미 존재하는 아이디입니다",
    menuAccount: "계정 정보",
    menuLang: "언어",
    menuLogout: "로그아웃",
    saveProfile: "Google 시트에 저장",
    profileSaved: "저장 완료!",
    tabs: ["홈", "해외송금", "지출관리", "목표", "AI 비서"],
    totalAssets: "총 자산 (예적금 포함)",
    wallets: "지갑",
    walletsUnit: "개",
    edit: "수정",
    del: "삭제",
    addWallet: "+ 지갑 추가",
    savings: "예·적금 계좌",
    matured: "만기 경과 D+",
    yr: "/년",
    estInterest: "예상 이자",
    visaShield: "비자 잔고 방어막",
    minVisa: "최소 유지 잔고 (KRW)",
    safe: "안전",
    warnVisa: "주의: 가용 잔고가 기준선에 근접했습니다!",
    available: "가용 금액",
    remitRadar: "연간 $50,000 송금 한도 레이더",
    record: "+ 기록",
    taxNote: "안내: 5월 종합소득세/연말정산 참고용이며 법적 효력은 없습니다.",
    intlCompare: "해외송금 수수료 비교",
    best: "최적",
    fee: "수수료",
    sampleRateNote: "수수료 및 환율은 샘플 데이터입니다. 실제 API 연동이 필요합니다.",
    myQr: "내 QR 코드",
    qrSim: "시뮬레이션 QR 코드",
    amount: "금액",
    scanSend: "QR 스캔 및 송금 (시뮬레이션)",
    splitTitle: "다통화 더치페이 정산",
    splitHint: "한 줄씩 입력: 이름,지출금액,통화",
    total: "총액",
    each: "1인당",
    settled: "정산 완료",
    atmTitle: "글로벌 ATM 및 환전소",
    directions: "길찾기",
    sixJars: "6개의 항아리 예산",
    monthlyInc: "월 수입 (KRW)",
    spent: "지출",
    jarTotal: "합계",
    need100: "— 정확히 100%여야 합니다",
    editJarsTitle: "6개의 항아리 비율 수정",
    jarName: "항아리 이름",
    done: "완료",
    addExpense: "지출 추가",
    travelCheck: "귀국 / 여행 지출",
    save: "저장",
    scanReceipt: "영수증 스캔 (데모)",
    cashFlow: "현금 흐름 분석",
    periods: ["1주", "1개월", "3개월", "6개월", "1년"],
    chartLegend: "수입 (회색) · 지출 (파랑) · 평균 초과 지출 (진보라)",
    radarTitle: "6개의 항아리 지출 레이더",
    radarLegend: "목표 비율 % (점선) vs 실제 지출 비율 % (실선)",
    subsTitle: "정기 구독 결제",
    mo: "/월",
    dayOfMonth: "매월 {d}일",
    due24h: " · 24시간 내 결제 예정!",
    addSub: "+ 구독 추가",
    travelMode: "귀국 / 여행 모드",
    travelDesc: "여행 지출을 일반 생활비 통계에서 분리합니다",
    on: "켜짐",
    off: "꺼짐",
    travelSpent: "여행 누적 지출",
    finGoals: "재무 목표",
    deadline: "목표일",
    needMonthly: "월 필요 저축액",
    usdtTip: "팁: 환율이 유리할 때 월 4회, 회당 ~{amt}씩 분할 환전하세요.",
    addGoal: "+ 목표 추가",
    healthScore: "재무 건전성 점수",
    greatKeep: "아주 훌륭합니다! 계속 유지하세요.",
    tipSave: "저축률이 20% 미만입니다: 이번 주 여가/유흥 항아리 지출을 줄여보세요.",
    tipVisa: "비자 잔고 기준선에 근접했습니다: 큰 지출을 멈추고 잔고를 보충하세요.",
    tipJarOver: "예산을 초과한 항아리가 있습니다: 지출관리 탭을 확인하세요.",
    tipJar100: "6개 항아리 비율 합계가 100%가 아닙니다.",
    aiChatTitle: "AI 비서 채팅",
    aiWelcome: "재무 관리에 대해 무엇이든 물어보세요.",
    aiPlaceholder: "메시지를 입력하세요...",
    send: "전송",
    aiUnsupported: "현재 앱에서 이 기능을 지원하지 않습니다.",
    fxTitle: "목표 환율 알림",
    threshold: "목표 환율",
    setAlert: "알림 설정",
    currentSample: "현재 환율 (샘플)",
    reached: "목표 도달",
    notReached: "미도달",
    fxDisclaimer: "과거 데이터를 기반으로 한 참고용 분석이며 미래 환율을 보장하지 않습니다.",
    defaultJars: ["필수 생활비", "교육/자기계발", "장기 저축", "여가/유흥", "투자", "기부/송금"],
    prompts: {
      wName: "지갑 이름", wCur: "통화: ", wCurErr: "지원하지 않는 통화입니다", wType: "유형: Bank 또는 Cash", wCountry: "국가", wBal: "잔액", wDel: "이 지갑을 삭제할까요?",
      sPrin: "원금", sStart: "시작일 (YYYY-MM-DD)", sMat: "만기일 (YYYY-MM-DD)", sRate: "연 이자율 (%)", sentAmt: "송금액 (USD)",
      subName: "구독 서비스명", subCur: "통화: KRW 또는 USD", subAmt: "월 결제액", subDay: "결제일 (1-28)",
      gName: "목표 이름 (등록금, 보증금 등)", gTarget: "목표 금액", gDl: "목표 기한 (YYYY-MM-DD)", gSaved: "현재 모은 금액",
      scanDemo: "데모: 15,800 KRW → 필수 생활비 입력됨. 실제 OCR은 API 연동이 필요합니다.",
      qrOut: "송금인 지불 {a} → 수취인 수령 {b}"
    }
  },
  ru: {
    subtitle: "Персональный финансовый менеджер",
    username: "Логин",
    password: "Пароль",
    showHide: "Показать/Скрыть",
    login: "Войти",
    noAccount: "Нет аккаунта?",
    registerNow: "Регистрация",
    register: "Создать аккаунт",
    fullName: "Полное имя",
    dob: "Дата рождения",
    email: "Электронная почта",
    phone: "Номер телефона",
    fillAll: "Пожалуйста, заполните все поля",
    backLogin: "← Назад ко входу",
    loginErr: "Неверный логин или пароль",
    userExists: "Логин уже существует",
    menuAccount: "Аккаунт",
    menuLang: "Язык",
    menuLogout: "Выйти",
    saveProfile: "Сохранить в Google Таблицу",
    profileSaved: "Обновлено!",
    tabs: ["Главная", "Переводы", "Расходы", "Цели", "ИИ-помощник"],
    totalAssets: "Общие активы (вкл. вклады)",
    wallets: "Кошельки",
    walletsUnit: "кош.",
    edit: "Изм.",
    del: "Удал.",
    addWallet: "+ Добавить кошелёк",
    savings: "Сберегательные вклады",
    matured: "Истёк D+",
    yr: "/год",
    estInterest: "Ожид. доход",
    visaShield: "Контроль баланса для визы",
    minVisa: "Минимальный остаток (KRW)",
    safe: "Безопасно",
    warnVisa: "Внимание: доступный остаток близок к порогу!",
    available: "доступно",
    remitRadar: "Лимит переводов $50,000/год",
    record: "+ Записать",
    taxNote: "Напоминание: налоговый расчёт в мае. Только для справки.",
    intlCompare: "Сравнение международных переводов",
    best: "Лучший",
    fee: "Комиссия",
    sampleRateNote: "Комиссии и курсы тестовые; подключите API для реальных данных.",
    myQr: "Мой QR",
    qrSim: "симуляция QR-кода",
    amount: "Сумма",
    scanSend: "Сканировать QR и отправить",
    splitTitle: "Разделение счёта (мультивалюта)",
    splitHint: "Каждая строка: Имя,Сумма,Валюта",
    total: "Итого",
    each: "с каждого",
    settled: "Всё рассчитано",
    atmTitle: "Банкоматы Global ATM и обменники",
    directions: "Маршрут",
    sixJars: "Метод 6 кувшинов",
    monthlyInc: "Месячный доход (KRW)",
    spent: "Потрачено",
    jarTotal: "Итого",
    need100: "— должно быть ровно 100%",
    editJarsTitle: "Настройка 6 кувшинов",
    jarName: "Название кувшина",
    done: "Готово",
    addExpense: "Добавить расход",
    travelCheck: "Поездка / Отпуск",
    save: "Сохранить",
    scanReceipt: "Скан чека (демо)",
    cashFlow: "Анализ денежного потока",
    periods: ["1Н", "1М", "3М", "6М", "1Г"],
    chartLegend: "Доход (серый) · Расход (синий) · Выше среднего (тёмно-фиолетовый)",
    radarTitle: "Радар расходов по 6 кувшинам",
    radarLegend: "План % (пунктир) vs Факт % (заливка)",
    subsTitle: "Регулярные подписки",
    mo: "/мес",
    dayOfMonth: "{d}-го числа каждого месяца",
    due24h: " · списание в течение 24ч!",
    addSub: "+ Добавить подписку",
    travelMode: "Режим поездки / домой",
    travelDesc: "Отделяет расходы в поездке от обычных трат",
    on: "ВКЛ",
    off: "ВЫКЛ",
    travelSpent: "Расходы в поездках",
    finGoals: "Финансовые цели",
    deadline: "срок",
    needMonthly: "Нужно откладывать в месяц",
    usdtTip: "Совет: меняйте ~{amt} за раз 4 раза в месяц по выгодному курсу.",
    addGoal: "+ Добавить цель",
    healthScore: "Индекс финансового здоровья",
    greatKeep: "Отлично, так держать!",
    tipSave: "Норма сбережений ниже 20%: сократите расходы на развлечения.",
    tipVisa: "Баланс близок к порогу визы: приостановите крупные траты.",
    tipJarOver: "Превышен лимит в одном из кувшинов: проверьте вкладку Расходы.",
    tipJar100: "Сумма процентов по кувшинам не равна 100%.",
    aiChatTitle: "Чат с ИИ-помощником",
    aiWelcome: "Задайте вопрос о ваших финансах.",
    aiPlaceholder: "Введите сообщение...",
    send: "Отпр.",
    aiUnsupported: "В настоящее время приложение не поддерживает эту функцию.",
    fxTitle: "Уведомление о целевом курсе",
    threshold: "Целевой курс",
    setAlert: "Установить",
    currentSample: "Текущий (тест)",
    reached: "ДОСТИГНУТО",
    notReached: "не достигнуто",
    fxDisclaimer: "Анализ носит справочный характер и не гарантирует будущий курс.",
    defaultJars: ["Необходимое", "Образование", "Долгосрочные накопления", "Развлечения", "Инвестиции", "Помощь семье"],
    prompts: {
      wName: "Название кошелька", wCur: "Валюта: ", wCurErr: "Валюта не поддерживается", wType: "Тип: Bank или Cash", wCountry: "Страна", wBal: "Баланс", wDel: "Удалить кошелёк?",
      sPrin: "Сумма вклада", sStart: "Дата открытия (YYYY-MM-DD)", sMat: "Дата закрытия (YYYY-MM-DD)", sRate: "Ставка %/год", sentAmt: "Сумма перевода (USD)",
      subName: "Название подписки", subCur: "Валюта: KRW или USD", subAmt: "Сумма в месяц", subDay: "День оплаты (1-28)",
      gName: "Название цели", gTarget: "Целевая сумма", gDl: "Срок (YYYY-MM-DD)", gSaved: "Уже накоплено",
      scanDemo: "Демо: заполнено 15,800 KRW → Необходимое.",
      qrOut: "Отправитель платит {a} → Получатель получает {b}"
    }
  },
  be: {
    subtitle: "Асабісты фінансавы менеджар",
    username: "Лагін",
    password: "Пароль",
    showHide: "Паказаць/Схаваць",
    login: "Увайсці",
    noAccount: "Няма акаўнта?",
    registerNow: "Рэгістрацыя",
    register: "Стварыць акаўнт",
    fullName: "Поўнае імя",
    dob: "Дата нараджэння",
    email: "Электронная пошта",
    phone: "Нумар тэлефона",
    fillAll: "Калі ласка, запоўніце ўсе палі",
    backLogin: "← Назад да ўваходу",
    loginErr: "Няправільны лагін або пароль",
    userExists: "Лагін ужо існуе",
    menuAccount: "Акаўнт",
    menuLang: "Мова",
    menuLogout: "Выйсці",
    saveProfile: "Захаваць у Google Табліцу",
    profileSaved: "Абноўлена!",
    tabs: ["Галоўная", "Пераводы", "Выдаткі", "Мэты", "ІІ-памочнік"],
    totalAssets: "Агульныя актывы (укл. уклады)",
    wallets: "Кашалькі",
    walletsUnit: "каш.",
    edit: "Змян.",
    del: "Выд.",
    addWallet: "+ Дадаць кашалёк",
    savings: "Ашчадныя ўклады",
    matured: "Скончыўся D+",
    yr: "/год",
    estInterest: "Чаканы даход",
    visaShield: "Кантроль балансу для візы",
    minVisa: "Мінімальны астатак (KRW)",
    safe: "Бяспечна",
    warnVisa: "Увага: даступны астатак блізкі да парога!",
    available: "даступна",
    remitRadar: "Ліміт пераводаў $50,000/год",
    record: "+ Запісаць",
    taxNote: "Напамін: падатковы разлік у маі. Толькі для даведкі.",
    intlCompare: "Параўнанне міжнародных пераводаў",
    best: "Лепшы",
    fee: "Камісія",
    sampleRateNote: "Камісіі і курсы тэставыя; падключыце API для рэальных даных.",
    myQr: "Мой QR",
    qrSim: "сімуляцыя QR-кода",
    amount: "Сума",
    scanSend: "Сканаваць QR і адправіць",
    splitTitle: "Падзел рахунку (мультывалюта)",
    splitHint: "Кожны радок: Імя,Сума,Валюта",
    total: "Усяго",
    each: "з кожнага",
    settled: "Усё разлічана",
    atmTitle: "Банкаматы Global ATM і абменнікі",
    directions: "Маршрут",
    sixJars: "Метад 6 збаноў",
    monthlyInc: "Месячны даход (KRW)",
    spent: "Выдаткавана",
    jarTotal: "Усяго",
    need100: "— павінна быць роўна 100%",
    editJarsTitle: "Налада 6 збаноў",
    jarName: "Назва збана",
    done: "Гатова",
    addExpense: "Дадаць выдатак",
    travelCheck: "Паездка / Адпачынак",
    save: "Захаваць",
    scanReceipt: "Скан чэка (дэма)",
    cashFlow: "Аналіз грашовага патоку",
    periods: ["1Т", "1М", "3М", "6М", "1Г"],
    chartLegend: "Даход (шэры) · Выдатак (сіні) · Вышэй за сярэдні (цёмна-фіялетавы)",
    radarTitle: "Радар выдаткаў па 6 збанах",
    radarLegend: "План % (пункцір) vs Факт % (заліўка)",
    subsTitle: "Рэгулярныя падпіскі",
    mo: "/мес",
    dayOfMonth: "{d}-га чысла кожнага месяца",
    due24h: " · спісанне на працягу 24г!",
    addSub: "+ Дадаць падпіску",
    travelMode: "Рэжым паездкі / дадому",
    travelDesc: "Аддзяляе выдаткі ў паездцы ад звычайных трат",
    on: "УКЛ",
    off: "ВЫКЛ",
    travelSpent: "Выдаткі ў паездках",
    finGoals: "Фінансавыя мэты",
    deadline: "тэрмін",
    needMonthly: "Трэба адкладаць у месяц",
    usdtTip: "Парада: мяняйце ~{amt} за раз 4 разы на месяц па выгадным курсе.",
    addGoal: "+ Дадаць мэту",
    healthScore: "Індэкс фінансавага здароўя",
    greatKeep: "Выдатна, так трымаць!",
    tipSave: "Норма зберажэнняў ніжэй за 20%: скараціце выдаткі на забавы.",
    tipVisa: "Баланс блізкі да парога візы: прыпыніце буйныя траты.",
    tipJarOver: "Перавышаны ліміт у адным са збаноў: праверце ўкладку Выдаткі.",
    tipJar100: "Сума працэнтаў па збанах не роўная 100%.",
    aiChatTitle: "Чат з ІІ-памочнікам",
    aiWelcome: "Задайце пытанне пра вашы фінансы.",
    aiPlaceholder: "Увядзіце паведамленне...",
    send: "Дасл.",
    aiUnsupported: "У цяперашні час праграма не падтрымлівае гэтую функцыю.",
    fxTitle: "Апавяшчэнне аб мэтавым курсе",
    threshold: "Мэтавы курс",
    setAlert: "Усталяваць",
    currentSample: "Бягучы (тэст)",
    reached: "ДАСЯГНУТА",
    notReached: "не дасягнута",
    fxDisclaimer: "Аналіз мае даведачны характар і не гарантуе будучы курс.",
    defaultJars: ["Неабходнае", "Адукацыя", "Доўгатэрміновыя зберажэнні", "Забавы", "Інвестыцыі", "Дапамога сям'і"],
    prompts: {
      wName: "Назва кашалька", wCur: "Валюта: ", wCurErr: "Валюта не падтрымліваецца", wType: "Тып: Bank або Cash", wCountry: "Краіна", wBal: "Баланс", wDel: "Выдаліць кашалёк?",
      sPrin: "Сума ўкладу", sStart: "Дата адкрыцця (YYYY-MM-DD)", sMat: "Дата закрыцця (YYYY-MM-DD)", sRate: "Стаўка %/год", sentAmt: "Сума пераводу (USD)",
      subName: "Назва падпіскі", subCur: "Валюта: KRW або USD", subAmt: "Сума ў месяц", subDay: "Дзень аплаты (1-28)",
      gName: "Назва мэты", gTarget: "Мэтавая сума", gDl: "Тэрмін (YYYY-MM-DD)", gSaved: "Ужо назапашана",
      scanDemo: "Дэма: запоўнена 15,800 KRW → Неабходнае.",
      qrOut: "Адпраўнік плаціць {a} → Атрымальнік атрымлівае {b}"
    }
  },
  vi: {
    subtitle: "Quản lý tài chính cá nhân",
    username: "Tên đăng nhập",
    password: "Mật khẩu",
    showHide: "Hiện/Ẩn",
    login: "Đăng nhập",
    noAccount: "Chưa có tài khoản?",
    registerNow: "Đăng ký ngay",
    register: "Đăng ký tài khoản",
    fullName: "Họ và tên",
    dob: "Ngày tháng năm sinh",
    email: "Địa chỉ Email",
    phone: "Số điện thoại",
    fillAll: "Vui lòng điền đầy đủ thông tin",
    backLogin: "← Quay lại đăng nhập",
    loginErr: "Sai tên đăng nhập hoặc mật khẩu",
    userExists: "Tên đăng nhập đã tồn tại",
    menuAccount: "Tài khoản",
    menuLang: "Ngôn ngữ",
    menuLogout: "Đăng xuất",
    saveProfile: "Cập nhật lên Google Sheet",
    profileSaved: "Đã cập nhật!",
    tabs: ["Trang chủ", "Chuyển tiền", "Chi tiêu", "Mục tiêu", "Trợ lý AI"],
    totalAssets: "Tổng tài sản (gồm sổ tiết kiệm)",
    wallets: "Ví tiền",
    walletsUnit: "ví",
    edit: "Sửa",
    del: "Xóa",
    addWallet: "+ Thêm ví",
    savings: "Sổ tiết kiệm",
    matured: "Đã đáo hạn D+",
    yr: "/năm",
    estInterest: "lãi dự kiến",
    visaShield: "Lá chắn số dư Visa",
    minVisa: "Số dư tối thiểu cần giữ (KRW)",
    safe: "An toàn",
    warnVisa: "Cảnh báo: số dư khả dụng sát ngưỡng!",
    available: "khả dụng",
    remitRadar: "Radar hạn mức $50,000/năm",
    record: "+ Ghi nhận",
    taxNote: "Nhắc: quyết toán/hoàn thuế vào tháng 5. Chỉ mang tính tham khảo.",
    intlCompare: "So sánh chuyển tiền quốc tế",
    best: "Tốt nhất",
    fee: "Phí",
    sampleRateNote: "Phí và biên độ tỷ giá là số mẫu; cần nối API thật.",
    myQr: "My QR",
    qrSim: "mã QR mô phỏng",
    amount: "Số tiền",
    scanSend: "Quét QR & gửi (mô phỏng)",
    splitTitle: "Chia tiền nhóm đa tiền tệ",
    splitHint: "Mỗi dòng: Tên,Số tiền đã trả,Tiền tệ",
    total: "Tổng",
    each: "mỗi người",
    settled: "Đã cân bằng",
    atmTitle: "Global ATM & tiệm đổi tiền",
    directions: "Chỉ đường",
    sixJars: "6 chiếc lọ",
    monthlyInc: "Thu nhập tháng (KRW)",
    spent: "Đã chi",
    jarTotal: "Tổng",
    need100: "— cần đúng 100%",
    editJarsTitle: "Chỉnh sửa 6 chiếc lọ",
    jarName: "Tên hũ",
    done: "Xong",
    addExpense: "Thêm khoản chi",
    travelCheck: "Chi tiêu du lịch/về nước",
    save: "Lưu",
    scanReceipt: "Quét hóa đơn (demo)",
    cashFlow: "Phân tích dòng tiền",
    periods: ["1 Tuần", "1 Tháng", "3 Tháng", "6 Tháng", "1 Năm"],
    chartLegend: "Thu nhập (xám) · Chi tiêu (xanh) · Chi vượt mức trung bình (tím đậm)",
    radarTitle: "Biểu đồ Radar chi tiêu 6 chiếc hũ",
    radarLegend: "Mục tiêu % (nét đứt) vs Thực tế % (vùng tô)",
    subsTitle: "Gói đăng ký định kỳ",
    mo: "/tháng",
    dayOfMonth: "Ngày {d} hằng tháng",
    due24h: " · thanh toán trong 24h tới!",
    addSub: "+ Thêm gói",
    travelMode: "Chế độ Về nước / Du lịch",
    travelDesc: "Chi tiêu chuyến đi tách khỏi thống kê sinh hoạt",
    on: "BẬT",
    off: "TẮT",
    travelSpent: "Chi tiêu du lịch",
    finGoals: "Mục tiêu tài chính",
    deadline: "hạn",
    needMonthly: "Cần để dành mỗi tháng",
    usdtTip: "Gợi ý: chia ~{amt}/lần, đổi 4 lần/tháng khi tỷ giá thuận lợi.",
    addGoal: "+ Thêm mục tiêu",
    healthScore: "Điểm sức khỏe tài chính",
    greatKeep: "Tuyệt vời, hãy duy trì!",
    tipSave: "Tỷ lệ tiết kiệm dưới 20%: tuần này thử giảm chi ở hũ Hưởng thụ.",
    tipVisa: "Số dư sát ngưỡng Visa: tạm dừng chi lớn và bổ sung số dư.",
    tipJarOver: "Có hũ chi vượt hạn mức: xem lại tab Chi tiêu.",
    tipJar100: "Tổng % các hũ chưa bằng 100%.",
    aiChatTitle: "Trò chuyện với Trợ lý AI",
    aiWelcome: "Hãy đặt câu hỏi về tài chính của bạn.",
    aiPlaceholder: "Nhập tin nhắn...",
    send: "Gửi",
    aiUnsupported: "Hiện tại app chưa hỗ trợ chức năng này",
    fxTitle: "Canh tỷ giá mục tiêu",
    threshold: "Ngưỡng",
    setAlert: "Đặt cảnh báo",
    currentSample: "Hiện tại (mẫu)",
    reached: "ĐÃ ĐẠT ngưỡng",
    notReached: "chưa đạt",
    fxDisclaimer: "Phân tích chỉ mang tính tham khảo dựa trên dữ liệu lịch sử, không cam kết dự đoán chính xác tỷ giá tương lai.",
    defaultJars: ["Thiết yếu", "Học phí/Giáo dục", "Tiết kiệm dài hạn", "Hưởng thụ", "Đầu tư", "Gửi về nhà"],
    prompts: {
      wName: "Tên ví", wCur: "Tiền tệ: ", wCurErr: "Tiền tệ không hỗ trợ", wType: "Loại: Bank hoặc Cash", wCountry: "Quốc gia", wBal: "Số dư", wDel: "Xóa ví này?",
      sPrin: "Số tiền gốc", sStart: "Ngày mở (YYYY-MM-DD)", sMat: "Ngày đáo hạn (YYYY-MM-DD)", sRate: "Lãi suất %/năm", sentAmt: "Số tiền đã chuyển (USD)",
      subName: "Tên gói", subCur: "Tiền tệ: KRW hoặc USD", subAmt: "Số tiền/tháng", subDay: "Ngày thanh toán (1-28)",
      gName: "Tên mục tiêu (học phí, tiền cọc nhà...)", gTarget: "Số tiền mục tiêu", gDl: "Hạn chót (YYYY-MM-DD)", gSaved: "Đã tích lũy",
      scanDemo: "Demo: đã điền mẫu 15,800 KRW → hũ Thiết yếu. Để OCR thật cần nối API.",
      qrOut: "Người gửi trả {a} → người nhận nhận {b}"
    }
  },
  uz: {
    subtitle: "Shaxsiy moliya menejeri",
    username: "Foydalanuvchi nomi",
    password: "Parol",
    showHide: "Ko'rsatish/Yashirish",
    login: "Kirish",
    noAccount: "Hisobingiz yo'qmi?",
    registerNow: "Ro'yxatdan o'tish",
    register: "Hisob yaratish",
    fullName: "To'liq ism",
    dob: "Tug'ilgan sana",
    email: "Elektron pochta",
    phone: "Telefon raqami",
    fillAll: "Iltimos, barcha maydonlarni to'ldiring",
    backLogin: "← Kirishga qaytish",
    loginErr: "Login yoki parol noto'g'ri",
    userExists: "Bu login band",
    menuAccount: "Hisob",
    menuLang: "Til",
    menuLogout: "Chiqish",
    saveProfile: "Google Sheet-ga saqlash",
    profileSaved: "Yangilandi!",
    tabs: ["Asosiy", "O'tkazma", "Xarajat", "Maqsad", "AI Yordamchi"],
    totalAssets: "Jami aktivlar (omonatlar bilan)",
    wallets: "Hamyonlar",
    walletsUnit: "ta",
    edit: "Tahrir",
    del: "O'chirish",
    addWallet: "+ Hamyon qo'shish",
    savings: "Omonat hisoblari",
    matured: "Muddati tugagan D+",
    yr: "/yil",
    estInterest: "kutilayotgan foiz",
    visaShield: "Viza balans himoyasi",
    minVisa: "Minimal saqlanadigan balans (KRW)",
    safe: "Xavfsiz",
    warnVisa: "Ogohlantirish: mavjud balans chegaraga yaqin!",
    available: "mavjud",
    remitRadar: "Yillik $50,000 o'tkazma radari",
    record: "+ Yozish",
    taxNote: "Eslatma: may oyida soliq hisob-kitobi. Faqat ma'lumot uchun.",
    intlCompare: "Xalqaro pul o'tkazmalarini taqqoslash",
    best: "Eng yaxshi",
    fee: "Komissiya",
    sampleRateNote: "Komissiya va kurslar namuna sifatida berilgan.",
    myQr: "Mening QR",
    qrSim: "simulyatsiya QR kodi",
    amount: "Summa",
    scanSend: "QR skanerlash va yuborish",
    splitTitle: "Ko'p valyutali guruh hisobi",
    splitHint: "Har bir qator: Ism,To'langan summa,Valyuta",
    total: "Jami",
    each: "har biriga",
    settled: "Hisob-kitob tugadi",
    atmTitle: "Global ATM va valyuta ayirboshlash",
    directions: "Yo'nalish",
    sixJars: "6 ta ko'za byudjeti",
    monthlyInc: "Oylik daromad (KRW)",
    spent: "Sarflandi",
    jarTotal: "Jami",
    need100: "— aynan 100% bo'lishi kerak",
    editJarsTitle: "6 ta ko'zani tahrirlash",
    jarName: "Ko'za nomi",
    done: "Tayyor",
    addExpense: "Xarajat qo'shish",
    travelCheck: "Sayohat / Uyga safar xarajati",
    save: "Saqlash",
    scanReceipt: "Chekni skanerlash (demo)",
    cashFlow: "Pul oqimi tahlili",
    periods: ["1H", "1O", "3O", "6O", "1Y"],
    chartLegend: "Daromad (kulrang) · Xarajat (ko'k) · O'rtachadan yuqori (to'q binafsha)",
    radarTitle: "6 ta ko'za xarajat radari",
    radarLegend: "Maqsad % (uziq chiziq) vs Haqiqiy % (bo'yalgan)",
    subsTitle: "Doimiy obunalar",
    mo: "/oy",
    dayOfMonth: "Har oyning {d}-kuni",
    due24h: " · 24 soat ichida to'lov!",
    addSub: "+ Obuna qo'shish",
    travelMode: "Sayohat / Uyga qaytish rejimi",
    travelDesc: "Sayohat xarajatlarini kundalik statistikadan ajratadi",
    on: "YONIQ",
    off: "O'CHIQ",
    travelSpent: "Sayohat xarajatlari",
    finGoals: "Moliyaviy maqsadlar",
    deadline: "muddat",
    needMonthly: "Oylik jamg'arma kerak",
    usdtTip: "Maslahat: kurs qulay paytda oyiga 4 marta ~{amt} dan almashtiring.",
    addGoal: "+ Maqsad qo'shish",
    healthScore: "Moliyaviy salomatlik bali",
    greatKeep: "Ajoyib, shunday davom eting!",
    tipSave: "Jamg'arma darajasi 20% dan past: ko'ngilochar xarajatlarni kamaytiring.",
    tipVisa: "Balans viza chegarasiga yaqin: katta xarajatlarni to'xtating.",
    tipJarOver: "Ba'zi ko'zalarda limit oshib ketdi: Xarajat bo'limini tekshiring.",
    tipJar100: "Ko'zalar foizlari yig'indisi 100% ga teng emas.",
    aiChatTitle: "AI yordamchi bilan suhbat",
    aiWelcome: "Moliyangiz haqida istalgan savol bering.",
    aiPlaceholder: "Xabar yozing...",
    send: "Yuborish",
    aiUnsupported: "Hozircha ilova ushbu funksiyani qo'llab-quvvatlamaydi.",
    fxTitle: "Maqsadli valyuta kursi",
    threshold: "Chegara kurs",
    setAlert: "Ogohlantirish qo'yish",
    currentSample: "Joriy (namuna)",
    reached: "CHEGARAGA YETDI",
    notReached: "yetmadi",
    fxDisclaimer: "Tahlil faqat ma'lumot uchun va kelajakdagi kursni kafolatlamaydi.",
    defaultJars: ["Zaruriy", "Ta'lim", "Uzoq muddatli jamg'arma", "Ko'ngilochar", "Investitsiya", "Uyga yuborish"],
    prompts: {
      wName: "Hamyon nomi", wCur: "Valyuta: ", wCurErr: "Qo'llab-quvvatlanmaydigan valyuta", wType: "Turi: Bank yoki Cash", wCountry: "Mamlakat", wBal: "Balans", wDel: "Ushbu hamyon o'chirilsinmi?",
      sPrin: "Asosiy summa", sStart: "Boshlanish sanasi (YYYY-MM-DD)", sMat: "Tugash sanasi (YYYY-MM-DD)", sRate: "Yillik foiz stavkasi %", sentAmt: "Yuborilgan summa (USD)",
      subName: "Obuna nomi", subCur: "Valyuta: KRW yoki USD", subAmt: "Oylik summa", subDay: "To'lov kuni (1-28)",
      gName: "Maqsad nomi", gTarget: "Maqsad summasi", gDl: "Muddat (YYYY-MM-DD)", gSaved: "Jamg'arilgan summa",
      scanDemo: "Demo: 15,800 KRW → Zaruriy ko'zasiga kiritildi.",
      qrOut: "Yuboruvchi to'laydi {a} → Qabul qiluvchi oladi {b}"
    }
  },
  zh: {
    subtitle: "个人财务管家",
    username: "用户名",
    password: "密码",
    showHide: "显示/隐藏",
    login: "登录",
    noAccount: "还没有账号？",
    registerNow: "立即注册",
    register: "创建账号",
    fullName: "姓名",
    dob: "出生日期",
    email: "电子邮箱",
    phone: "手机号码",
    fillAll: "请填写所有字段",
    backLogin: "← 返回登录",
    loginErr: "用户名或密码错误",
    userExists: "用户名已存在",
    menuAccount: "账户信息",
    menuLang: "语言",
    menuLogout: "退出登录",
    saveProfile: "更新至 Google 表格",
    profileSaved: "已更新！",
    tabs: ["首页", "跨境汇款", "支出", "目标", "AI 助手"],
    totalAssets: "总资产（含定期存款）",
    wallets: "钱包",
    walletsUnit: "个钱包",
    edit: "编辑",
    del: "删除",
    addWallet: "+ 添加钱包",
    savings: "定期存款",
    matured: "已到期 D+",
    yr: "/年",
    estInterest: "预计利息",
    visaShield: "签证余额保护盾",
    minVisa: "最低保留余额 (KRW)",
    safe: "安全",
    warnVisa: "警告：可用余额接近警戒线！",
    available: "可用",
    remitRadar: "每年 $50,000 汇款额度雷达",
    record: "+ 记录",
    taxNote: "提示：5月进行税务结算/退税，仅供参考。",
    intlCompare: "国际汇款比价",
    best: "最优",
    fee: "手续费",
    sampleRateNote: "手续费与汇率为示例数据，需连接实时 API。",
    myQr: "我的二维码",
    qrSim: "模拟二维码",
    amount: "金额",
    scanSend: "扫码并汇款（模拟）",
    splitTitle: "多币种AA制分账",
    splitHint: "每行格式：姓名,已付金额,币种",
    total: "总计",
    each: "每人",
    settled: "已结清",
    atmTitle: "全球 ATM 与换汇点",
    directions: "导航",
    sixJars: "6个罐子理财法",
    monthlyInc: "月收入 (KRW)",
    spent: "已支出",
    jarTotal: "总计",
    need100: "— 必须等于 100%",
    editJarsTitle: "编辑6个罐子比例",
    jarName: "罐子名称",
    done: "完成",
    addExpense: "添加支出",
    travelCheck: "回国 / 旅游支出",
    save: "保存",
    scanReceipt: "扫描小票（演示）",
    cashFlow: "现金流分析",
    periods: ["1周", "1月", "3月", "6月", "1年"],
    chartLegend: "收入（灰）· 支出（蓝）· 超出平均支出（深紫）",
    radarTitle: "6个罐子支出雷达图",
    radarLegend: "目标比例 %（虚线）vs 实际支出比例 %（填充）",
    subsTitle: "周期性订阅",
    mo: "/月",
    dayOfMonth: "每月 {d} 日",
    due24h: " · 24小时内扣款！",
    addSub: "+ 添加订阅",
    travelMode: "回国 / 旅游模式",
    travelDesc: "将旅行支出与日常开销统计分开",
    on: "开启",
    off: "关闭",
    travelSpent: "旅行累计支出",
    finGoals: "财务目标",
    deadline: "截止",
    needMonthly: "每月需存",
    usdtTip: "建议：汇率合适时每月分4次兑换，每次约 {amt}。",
    addGoal: "+ 添加目标",
    healthScore: "财务健康评分",
    greatKeep: "非常棒，请继续保持！",
    tipSave: "储蓄率低于 20%：本周尝试减少娱乐罐子支出。",
    tipVisa: "余额接近签证警戒线：请暂停大额支出并补充余额。",
    tipJarOver: "有罐子超出预算：请查看支出页面。",
    tipJar100: "6个罐子比例总和不等于 100%。",
    aiChatTitle: "与 AI 助手对话",
    aiWelcome: "请输入您的财务相关问题。",
    aiPlaceholder: "输入消息...",
    send: "发送",
    aiUnsupported: "当前应用暂不支持此功能。",
    fxTitle: "目标汇率提醒",
    threshold: "目标汇率",
    setAlert: "设置提醒",
    currentSample: "当前（示例）",
    reached: "已达到目标",
    notReached: "未达到",
    fxDisclaimer: "分析仅基于历史数据供参考，不保证未来汇率走势。",
    defaultJars: ["生活必需", "教育学习", "长期储蓄", "娱乐消费", "投资理财", "寄回家用"],
    prompts: {
      wName: "钱包名称", wCur: "币种：", wCurErr: "不支持该币种", wType: "类型：Bank 或 Cash", wCountry: "国家/地区", wBal: "余额", wDel: "确定删除此钱包？",
      sPrin: "本金", sStart: "存入日期 (YYYY-MM-DD)", sMat: "到期日期 (YYYY-MM-DD)", sRate: "年利率 (%)", sentAmt: "已汇款金额 (USD)",
      subName: "订阅名称", subCur: "币种：KRW 或 USD", subAmt: "每月金额", subDay: "扣款日 (1-28)",
      gName: "目标名称（学费、房租押金等）", gTarget: "目标金额", gDl: "截止日期 (YYYY-MM-DD)", gSaved: "已存金额",
      scanDemo: "演示：已填入 15,800 KRW → 生活必需罐子。",
      qrOut: "付款方支付 {a} → 收款方收到 {b}"
    }
  }
};

/* ---------- App State (100% English by default) ---------- */
let lang = localStorage.getItem("mf_lang") || "en";
if (!I18N[lang]) lang = "en";
const t = k => I18N[lang][k] ?? I18N.en[k] ?? k;

const JP = [40, 15, 15, 10, 10, 10];
let S, U, tab = 0, per = 30;
let menuOpen = false, menuSub = "", jarModal = false;
let chatLog = [];

/* ---------- API Layer ---------- */
async function api(a, p) {
  if (API) {
    const r = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ action: a, ...p })
    });
    return r.json();
  }
  const us = ld("mf_users") || [{
    id: 1,
    username: "monify",
    fullName: "Monify Demo",
    dob: "2000-01-01",
    password: "828282",
    email: "demo@monify.app",
    phone: "+82 10-1234-5678"
  }];
  if (a == "login") {
    const u = us.find(x => x.username == p.username && x.password == p.password);
    return u ? { ok: 1, user: u, data: ld("mf_d" + u.id) } : { ok: 0, msg: t("loginErr") };
  }
  if (a == "register") {
    if (us.some(x => x.username == p.username)) return { ok: 0, msg: t("userExists") };
    const u = { ...p, id: Math.max(0, ...us.map(x => x.id)) + 1 };
    us.push(u);
    sv("mf_users", us);
    return { ok: 1, user: u };
  }
  if (a == "updateProfile") {
    const idx = us.findIndex(x => x.id == p.userId);
    if (idx > -1) {
      us[idx].email = p.email;
      us[idx].phone = p.phone;
      sv("mf_users", us);
    }
    return { ok: 1 };
  }
  if (a == "save") {
    sv("mf_d" + p.userId, p.data);
    return { ok: 1 };
  }
}

const save = () => api("save", { userId: U.id, data: S });

function blank() {
  return {
    base: "KRW",
    wallets: [],
    savings: [],
    tx: [],
    jars: I18N[lang].defaultJars.map((n, i) => ({ n, p: JP[i] })),
    goals: [],
    subs: [],
    visa: 1e7,
    sent: 0,
    inc: 3e6,
    travel: false,
    alerts: []
  };
}

function seed() {
  const s = blank();
  const w = (id, name, type, country, cur, bal) => ({ id, name, type, country, cur, bal });
  s.wallets = [
    w(1, "Toss Bank", "Bank", "South Korea", "KRW", 1e6),
    w(2, "Vietcombank", "Bank", "Vietnam", "VND", 3e6),
    w(3, "USD Cash", "Cash", "Global", "USD", 1000),
    w(4, "VND Cash", "Cash", "Vietnam", "VND", 7e6),
    w(5, "KRW Cash", "Cash", "South Korea", "KRW", 3e5)
  ];
  s.savings = [
    { id: 1, bank: "Korea Savings", country: "South Korea", cur: "KRW", principal: 1e7, start: "2025-06-03", mat: "2026-06-03", rate: 3 },
    { id: 2, bank: "Vietnam Savings", country: "Vietnam", cur: "VND", principal: 2e8, start: "2026-06-03", mat: "2027-06-03", rate: 5 }
  ];
  s.subs = [
    { n: "Coupang Wow", amt: 7890, cur: "KRW", day: 5 },
    { n: "Netflix", amt: 13.99, cur: "USD", day: 12 },
    { n: "ChatGPT", amt: 20, cur: "USD", day: 20 }
  ];
  s.sent = 12000;
  s.goals = [{ n: "Next Semester Tuition", t: 8e6, cur: "KRW", dl: "2027-02-28", saved: 2e6 }];
  for (let m = 0; m < 12; m++) {
    [[10, "Income", "", 3e6], [3, "Expense", 0, 7e5 + m % 3 * 8e4], [12, "Expense", 3, 25e4 + m % 4 * 9e4], [24, "Expense", 1, 3e5]].forEach(([d, tp, j, a], i) => {
      const x = new Date();
      x.setDate(1);
      x.setMonth(x.getMonth() - m);
      x.setDate(d);
      if (x > new Date()) return;
      s.tx.push({ id: "s" + m + i, date: x.toISOString().slice(0, 10), type: tp, cur: "KRW", amt: a, jar: j, wallet: 1, travel: false, note: "" });
    });
  }
  return s;
}

const tot = (c = S.base) => S.wallets.reduce((a, w) => a + cv(w.bal, w.cur, c), 0) + S.savings.reduce((a, s) => a + cv(s.principal, s.cur, c), 0);
const days = d => Math.ceil((new Date(d) - new Date()) / 864e5);

/* ---------- Launch & Auth ---------- */
$("#app").innerHTML = `<div class="launch-screen"><img src="./lauchscreen.jpg" alt="Monify Launch" onerror="this.outerHTML='<h1 style=color:#fff>Monify</h1>'"></div>`;
setTimeout(login, 2000);

const eye = i => {
  const x = $("#" + i);
  x.type = x.type == "password" ? "text" : "password";
};

function login() {
  document.documentElement.lang = lang;
  $("#app").innerHTML = `
  <div class="auth-screen">
    <div class="auth-top">
      <img class="auth-logo" src="./logo.png" alt="Monify" onerror="this.outerHTML='<h1>Monify</h1>'">
      <p class="sm">${t("subtitle")}</p>
    </div>
    <div class="auth-form">
      <input id="u" placeholder="${t("username")}" autocomplete="username">
      <div class="pw">
        <input id="p" type="password" placeholder="${t("password")}">
        <a onclick="eye('p')">${t("showHide")}</a>
      </div>
      <p id="m" class="sm" style="color:var(--d);margin-top:4px"></p>
      <br>
      <button class="btn" style="width:100%" onclick="doLogin()">${t("login")}</button>
      <p class="sm" style="margin-top:14px;text-align:center">${t("noAccount")} <a onclick="reg()">${t("registerNow")}</a></p>
    </div>
  </div>`;
}

async function doLogin() {
  const r = await api("login", { username: $("#u").value.trim(), password: $("#p").value });
  if (!r.ok) return $("#m").textContent = r.msg || t("loginErr");
  U = { dob: "2000-01-01", phone: "", ...r.user };
  S = { ...blank(), ...(r.data || (U.id == 1 ? seed() : {})) };
  if (!r.data) save();
  tab = 0;
  menuOpen = false;
  menuSub = "";
  chatLog = [{ role: "bot", text: t("aiWelcome") }];
  draw();
}

function reg() {
  $("#app").innerHTML = `
  <div class="auth-screen">
    <div class="auth-top" style="flex:0 0 26%">
      <img class="auth-logo" src="./logo.png" style="max-height:80px" alt="Monify" onerror="this.outerHTML='<h2>Monify</h2>'">
      <h2>${t("register")}</h2>
    </div>
    <div class="auth-form">
      <input id="ru" placeholder="${t("username")}">
      <input id="rn" placeholder="${t("fullName")}">
      <input id="rd" type="date" placeholder="${t("dob")}">
      <div class="pw">
        <input id="rp" type="password" placeholder="${t("password")}">
        <a onclick="eye('rp')">${t("showHide")}</a>
      </div>
      <input id="re" type="email" placeholder="${t("email")}">
      <input id="rph" type="tel" placeholder="${t("phone")}">
      <p id="m" class="sm" style="color:var(--d)"></p>
      <button class="btn" style="width:100%;margin-top:6px" onclick="doReg()">${t("register")}</button>
      <p class="sm" style="margin-top:12px;text-align:center"><a onclick="login()">${t("backLogin")}</a></p>
    </div>
  </div>`;
}

async function doReg() {
  const p = {
    username: $("#ru").value.trim(),
    fullName: $("#rn").value.trim(),
    dob: $("#rd").value,
    password: $("#rp").value,
    email: $("#re").value.trim(),
    phone: $("#rph").value.trim()
  };
  if (!p.username || !p.fullName || !p.dob || !p.password || !p.email) {
    return $("#m").textContent = t("fillAll");
  }
  const r = await api("register", p);
  if (!r.ok) return $("#m").textContent = r.msg;
  U = r.user;
  S = blank();
  save();
  tab = 0;
  menuOpen = false;
  chatLog = [{ role: "bot", text: t("aiWelcome") }];
  draw();
}

/* ---------- Top Header & Dropdown Controls ---------- */
function toggleMenu() {
  menuOpen = !menuOpen;
  if (!menuOpen) menuSub = "";
  draw();
}

function toggleSub(name) {
  menuSub = menuSub === name ? "" : name;
  draw();
}

async function saveAccountInfo() {
  const newEmail = $("#acc-email").value.trim();
  const newPhone = $("#acc-phone").value.trim();
  U.email = newEmail;
  U.phone = newPhone;
  await api("updateProfile", { userId: U.id, email: newEmail, phone: newPhone });
  $("#acc-status").textContent = t("profileSaved");
  setTimeout(() => { if ($("#acc-status")) $("#acc-status").textContent = ""; }, 2000);
}

function changeLang(newLang) {
  lang = newLang;
  localStorage.setItem("mf_lang", lang);
  document.documentElement.lang = lang;
  chatLog = [{ role: "bot", text: t("aiWelcome") }];
  draw();
}

function logout() {
  U = null;
  S = null;
  menuOpen = false;
  menuSub = "";
  jarModal = false;
  login();
}

function renderTopbar() {
  const langOptions = LANG_LIST.map(l => `<option value="${l.code}" ${l.code === lang ? "selected" : ""}>${l.label}</option>`).join("");
  return `
  <header class="topbar">
    <img class="brand-logo" src="./logo.png" alt="Monify" onerror="this.outerHTML='<b>Monify</b>'">
    <button class="hamburger-btn" onclick="toggleMenu()" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
    ${menuOpen ? `
    <div class="dropdown-menu">
      <button class="menu-item" onclick="toggleSub('account')">
        <span>${t("menuAccount")}</span><span>${menuSub === "account" ? "▲" : "▼"}</span>
      </button>
      ${menuSub === "account" ? `
      <div class="menu-subpanel">
        <div><b>${t("fullName")}:</b> ${esc(U.fullName || U.username)}</div>
        <div style="margin-top:3px"><b>${t("dob")}:</b> ${esc(U.dob || "-")}</div>
        <label>${t("email")}</label>
        <input id="acc-email" type="email" value="${esc(U.email || "")}">
        <label>${t("phone")}</label>
        <input id="acc-phone" type="tel" value="${esc(U.phone || "")}">
        <div class="row" style="margin-top:6px">
          <button class="btn sm-btn" onclick="saveAccountInfo()">${t("saveProfile")}</button>
          <span id="acc-status" class="sm" style="color:var(--v);font-weight:bold"></span>
        </div>
      </div>` : ""}

      <button class="menu-item" onclick="toggleSub('language')">
        <span>${t("menuLang")}</span><span>${menuSub === "language" ? "▲" : "▼"}</span>
      </button>
      ${menuSub === "language" ? `
      <div class="menu-subpanel">
        <select onchange="changeLang(this.value)">${langOptions}</select>
      </div>` : ""}

      <button class="menu-item danger" onclick="logout()">
        <span>${t("menuLogout")}</span><span>→</span>
      </button>
    </div>` : ""}
  </header>`;
}

/* ---------- Shell ---------- */
function draw() {
  document.documentElement.lang = lang;
  $("#app").innerHTML = `
    ${renderTopbar()}
    <main onclick="if(menuOpen){menuOpen=false;menuSub='';draw()}">${[home, xfer, spend, goals, ai][tab]()}</main>
    <nav>${t("tabs").map((n, i) => `<button class="${i == tab ? "on" : ""}" onclick="tab=${i};menuOpen=false;draw()">${n}</button>`).join("")}</nav>
    ${jarModal ? renderJarModal() : ""}
  `;
  if (tab == 1) { cmp(); spl(); }
  if (tab == 2) { chart(); radarChart(); }
  if (tab == 4) { const cb = $("#chat-box"); if (cb) cb.scrollTop = cb.scrollHeight; }
}

/* ---------- Tab 1: Home ---------- */
function home() {
  const K = tot("KRW"), ok = K >= S.visa * 1.2, n = S.wallets.length;
  return `
  <div class="card g1">
    <div class="sm">${t("totalAssets")}</div>
    <div class="big num">${f(tot(), S.base)}</div>
    <select style="width:auto" onchange="S.base=this.value;save();draw()">
      ${["KRW", "USD", "VND", "USDT"].map(c => `<option ${c == S.base ? "selected" : ""}>${c}</option>`).join("")}
    </select>
  </div>
  <h2>${t("wallets")} · ${n}/6 ${t("walletsUnit")}</h2>
  ${S.wallets.map(w => `
    <div class="card wallet-card">
      <div class="wallet-left">
        <b class="wallet-name" title="${esc(w.name)}">${esc(w.name)}</b>
        <div class="sm wallet-meta">${esc(w.type)} · ${esc(w.country)}</div>
      </div>
      <div class="num wallet-right">
        <b class="wallet-bal" title="${f(w.bal, w.cur)}">${f(w.bal, w.cur)}</b>
        <div class="sm"><a onclick="wal(${w.id})">${t("edit")}</a> · <a onclick="delw(${w.id})">${t("del")}</a></div>
      </div>
    </div>`).join("")}
  <button class="btn" ${n >= 6 ? "disabled" : ""} onclick="wal()">${t("addWallet")}</button>

  <h2>${t("savings")}</h2>
  ${S.savings.map(s => {
    const d = days(s.mat);
    const it = s.principal * s.rate / 100 * Math.max(0, (new Date(s.mat) - new Date(s.start)) / 864e5) / 365;
    return `
    <div class="card vel">
      <div class="row"><b>${esc(s.bank)}</b><span class="num">${d >= 0 ? "D-" + d : t("matured") + -d}</span></div>
      <div class="num big" style="font-size:20px">${f(s.principal, s.cur)}</div>
      <div class="sm">${s.start} → ${s.mat} · ${s.rate}%${t("yr")} · ${t("estInterest")} ${f(it, s.cur)}</div>
      <button class="btn" style="margin-top:8px" onclick="esav(${s.id})">${t("edit")}</button>
    </div>`;
  }).join("")}

  <h2>${t("visaShield")}</h2>
  <div class="card ${ok ? "" : "deep"}">
    <div class="sm">${t("minVisa")}</div>
    <input type="number" value="${S.visa}" onchange="S.visa=+this.value;save();draw()">
    <div class="bar ${ok ? "" : "w"}"><i style="width:${cl(S.visa / (K || 1)) * 100}%"></i></div>
    <div>${ok ? t("safe") : t("warnVisa")} · ${t("available")} ${f(Math.max(0, K - S.visa), "KRW")}</div>
  </div>

  <h2>${t("remitRadar")}</h2>
  <div class="card">
    <div class="row"><b class="num">$${f(S.sent)} / $50,000</b><a onclick="addSent()">${t("record")}</a></div>
    <div class="bar ${S.sent > 4e4 ? "w" : ""}"><i style="width:${cl(S.sent / 5e4) * 100}%"></i></div>
    <div class="sm">${t("taxNote")}</div>
  </div>`;
}

function wal(id) {
  const P = t("prompts");
  const w = S.wallets.find(x => x.id == id) || { id: Date.now(), name: "", type: "Bank", country: "", cur: "KRW", bal: 0 };
  const nw = !S.wallets.includes(w);
  if (nw && S.wallets.length >= 6) return;
  const name = prompt(P.wName, w.name);
  if (!name) return;
  const cur = (prompt(P.wCur + CUR.join("/"), w.cur) || w.cur).toUpperCase();
  if (!R[cur]) return alert(P.wCurErr);
  const type = /cash/i.test(prompt(P.wType, w.type) || "") ? "Cash" : "Bank";
  const country = prompt(P.wCountry, w.country) || "";
  const b = parseFloat(prompt(P.wBal + " (" + cur + ")", w.bal));
  Object.assign(w, { name, cur, type, country, bal: isNaN(b) ? 0 : b });
  if (nw) S.wallets.push(w);
  save();
  draw();
}

function delw(id) {
  if (confirm(t("prompts").wDel)) {
    S.wallets = S.wallets.filter(w => w.id != id);
    save();
    draw();
  }
}

function esav(id) {
  const P = t("prompts");
  const s = S.savings.find(x => x.id == id);
  s.principal = parseFloat(prompt(P.sPrin, s.principal)) || s.principal;
  s.start = prompt(P.sStart, s.start) || s.start;
  s.mat = prompt(P.sMat, s.mat) || s.mat;
  s.rate = parseFloat(prompt(P.sRate, s.rate)) || s.rate;
  save();
  draw();
}

function addSent() {
  const a = parseFloat(prompt(t("prompts").sentAmt));
  if (a > 0) {
    S.sent += a;
    save();
    draw();
  }
}

/* ---------- Tab 2: Transfer ---------- */
function cmp() {
  const a = +$("#ca").value || 0, fr = $("#cf").value, to = $("#ct").value;
  const P = [
    ["SentBe", 3000, 0.005, "1~2 days"],
    ["Hanpass", 0, 0.009, "1~2 days"],
    ["WireBarley", 2500, 0.004, "Mins ~ 1 day"],
    ["Stablecoin USDT/USDC", 1500, 0.002, "Minutes"]
  ];
  const r = P.map(p => {
    const fee = cv(p[1], "KRW", fr);
    return { n: p[0], fee, get: Math.max(0, cv(a - fee, fr, to) * (1 - p[2])), t: p[3] };
  }).sort((x, y) => y.get - x.get);
  $("#co").innerHTML = r.map((x, i) => `
    <div class="card ${i ? "" : "best"}" style="margin:6px 0">
      <div class="row"><b>${x.n}${i ? "" : " · " + t("best")}</b><b class="num">${f(x.get, to)}</b></div>
      <div class="sm">${t("fee")} ${f(x.fee, fr)} · ${x.t}</div>
    </div>`).join("");
}

function qr() {
  let h = 0;
  for (const c of U.username) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  let s = "";
  for (let y = 0; y < 15; y++) {
    for (let x = 0; x < 15; x++) {
      h = (h * 1103515245 + 12345) >>> 0;
      if ((h >>> 16) & 1 || (x < 3 && y < 3) || (x > 11 && y < 3) || (x < 3 && y > 11)) {
        s += `<rect x=${x} y=${y} width=1 height=1 />`;
      }
    }
  }
  return `<svg viewBox="-1 -1 17 17" width=130 style="background:#FAF9F8;border-radius:12px" fill="#150811">${s}</svg>`;
}

function scanSim() {
  const a = +$("#qa").value || 0, p = $("#qp").value, r = $("#qr").value;
  $("#qo").textContent = t("prompts").qrOut
    .replace("{a}", f(a, p))
    .replace("{b}", f(cv(a, p, r) * 0.998, r));
}

function spl() {
  const L = $("#sp").value.split("\n")
    .map(l => l.split(","))
    .filter(x => x.length == 3 && R[x[2].trim().toUpperCase()])
    .map(x => ({ n: x[0].trim(), p: cv(+x[1], x[2].trim().toUpperCase(), "KRW") }));
  if (!L.length) { $("#so").innerHTML = ""; return; }
  const sh = L.reduce((a, x) => a + x.p, 0) / L.length;
  const D = L.filter(x => x.p < sh - 1).map(x => ({ n: x.n, a: sh - x.p }));
  const C = L.filter(x => x.p > sh + 1).map(x => ({ n: x.n, a: x.p - sh }));
  const o = [];
  for (const d of D) {
    for (const c of C) {
      const m = Math.min(d.a, c.a);
      if (m > 1) {
        o.push(`${d.n} → ${c.n}: ${f(m, "KRW")}`);
        d.a -= m;
        c.a -= m;
      }
    }
  }
  $("#so").innerHTML = `<p class="sm">${t("total")} ${f(sh * L.length, "KRW")} · ${t("each")} ${f(sh, "KRW")}</p>` +
    (o.map(x => `<div class="row"><b class="num">${x}</b></div>`).join("") || t("settled"));
}

function xfer() {
  const map = q => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
  return `
  <h2>${t("intlCompare")}</h2>
  <div class="card">
    <input id="ca" type="number" value="1000000" oninput="cmp()">
    <div class="row"><select id="cf" onchange="cmp()">${opt("KRW")}</select><select id="ct" onchange="cmp()">${opt("VND")}</select></div>
    <div id="co"></div>
    <p class="sm">${t("sampleRateNote")}</p>
  </div>

  <h2>${t("myQr")}</h2>
  <div class="card dark" style="text-align:center">
    ${qr()}
    <p class="sm">@${esc(U.username)} · ${t("qrSim")}</p>
    <input id="qa" type="number" placeholder="${t("amount")}" style="color:#150811">
    <div class="row"><select id="qp">${opt("KRW")}</select><select id="qr">${opt("VND")}</select></div>
    <button class="btn" onclick="scanSim()">${t("scanSend")}</button>
    <p id="qo" class="sm" style="margin-top:6px"></p>
  </div>

  <h2>${t("splitTitle")}</h2>
  <div class="card">
    <p class="sm">${t("splitHint")}</p>
    <textarea id="sp" rows="4" oninput="spl()">An,300000,KRW
Dasha,100,USD
Tan,2000000,VND</textarea>
    <div id="so"></div>
  </div>

  <h2>${t("atmTitle")}</h2>
  <div class="card">
    ${[["Global ATM 24/7 Myeongdong", "Myeongdong"], ["Currency Exchange Hongdae", "Hongdae"], ["Currency Exchange Itaewon", "Itaewon"]]
      .map(x => `<div class="row"><b>${x[1]}</b><a href="${map(x[0])}" target="_blank" rel="noopener">${t("directions")}</a></div>`).join("")}
  </div>`;
}

/* ---------- Tab 3: Spending (6 Jars Popup + Cash Flow + Hexagon Radar) ---------- */
function renderJarModal() {
  const tp = S.jars.reduce((a, j) => a + j.p, 0);
  return `
  <div class="modal-backdrop">
    <div class="modal-box">
      <div class="modal-header">
        <b>${t("editJarsTitle")}</b>
        <button class="modal-close" onclick="jarModal=false;save();draw()" title="Close">×</button>
      </div>
      <div class="modal-body">
        ${S.jars.map((j, i) => `
          <div class="card" style="padding:10px;margin-bottom:8px">
            <div class="row">
              <input value="${esc(j.n)}" placeholder="${t("jarName")}" onchange="S.jars[${i}].n=this.value;save()" style="width:70%">
              <b class="num" id="jp-lbl-${i}">${j.p}%</b>
            </div>
            <input type="range" min="0" max="100" value="${j.p}"
              oninput="S.jars[${i}].p=+this.value;document.getElementById('jp-lbl-${i}').textContent=this.value+'%';updateModalTotal()"
              onchange="save()">
          </div>`).join("")}
        <div id="modal-total" class="card ${tp == 100 ? "" : "deep"}" style="padding:10px">
          ${t("jarTotal")}: ${tp}% ${tp == 100 ? "✓" : t("need100")}
        </div>
        <button class="btn" style="width:100%" onclick="jarModal=false;save();draw()">${t("done")}</button>
      </div>
    </div>
  </div>`;
}

function updateModalTotal() {
  const tp = S.jars.reduce((a, j) => a + j.p, 0);
  const el = $("#modal-total");
  if (!el) return;
  el.className = "card " + (tp == 100 ? "" : "deep");
  el.textContent = `${t("jarTotal")}: ${tp}% ${tp == 100 ? "✓" : t("need100")}`;
}

function spend() {
  const m = today().slice(0, 7);
  const sp = j => S.tx.filter(t => t.type == "Expense" && !t.travel && t.jar === j && t.date.startsWith(m))
    .reduce((a, t) => a + cv(t.amt, t.cur, "KRW"), 0);
  const tp = S.jars.reduce((a, j) => a + j.p, 0);
  const ms = S.subs.reduce((a, s) => a + cv(s.amt, s.cur, "KRW"), 0);
  const tm = new Date(Date.now() + 864e5).getDate();

  return `
  <div class="row" style="margin-top:4px">
    <h2 style="margin:0">${t("sixJars")}</h2>
    <button class="btn sm-btn s" onclick="jarModal=true;draw()">${t("edit")}</button>
  </div>
  <div class="card" style="margin-top:8px">
    <div class="sm">${t("monthlyInc")}</div>
    <input type="number" value="${S.inc}" onchange="S.inc=+this.value;save();draw()">
  </div>

  ${S.jars.map((j, i) => {
    const al = S.inc * j.p / 100, u = sp(i);
    return `
    <div class="card">
      <div class="row"><b>${esc(j.n)}</b><b class="num">${j.p}%</b></div>
      <div class="bar ${u > al ? "w" : ""}"><i style="width:${al ? cl(u / al) * 100 : 0}%"></i></div>
      <div class="sm">${t("spent")} ${f(u, "KRW")} / ${f(al, "KRW")}</div>
    </div>`;
  }).join("")}

  <div class="card ${tp == 100 ? "" : "deep"}">${t("jarTotal")}: ${tp}% ${tp == 100 ? "✓" : t("need100")}</div>

  <h2>${t("addExpense")}</h2>
  <div class="card">
    <input id="xa" type="number" placeholder="${t("amount")}">
    <div class="row">
      <select id="xc">${opt("KRW")}</select>
      <select id="xj">${S.jars.map((j, i) => `<option value="${i}">${esc(j.n)}</option>`).join("")}</select>
    </div>
    <input id="xd" type="date" value="${today()}">
    <label class="sm" style="display:flex;align-items:center;gap:6px;margin:6px 0">
      <input id="xt" type="checkbox" ${S.travel ? "checked" : ""} style="width:auto"> ${t("travelCheck")}
    </label>
    <div class="row">
      <button class="btn" onclick="addX()">${t("save")}</button>
      <label class="btn s">${t("scanReceipt")}<input type="file" accept="image/*" hidden onchange="scan()"></label>
    </div>
  </div>

  <h2>${t("cashFlow")}</h2>
  <div class="card">
    <div class="tabs">
      ${[[7, 0], [30, 1], [90, 2], [180, 3], [365, 4]].map(([d, idx]) =>
        `<button class="btn ${per == d ? "" : "s"}" onclick="per=${d};draw()">${t("periods")[idx]}</button>`).join("")}
    </div>
    <div id="ch"></div>
  </div>

  <h2>${t("radarTitle")}</h2>
  <div class="card" style="text-align:center">
    <div id="radar-ch"></div>
    <p class="sm">${t("radarLegend")}</p>
  </div>

  <h2>${t("subsTitle")} · ${f(ms, "KRW")}${t("mo")}</h2>
  <div class="card">
    ${S.subs.map((s, i) => `
      <div class="row">
        <div>
          <b>${esc(s.n)}</b>
          <div class="sm">${t("dayOfMonth").replace("{d}", s.day)}${s.day == tm ? t("due24h") : ""}</div>
        </div>
        <div class="num">${f(s.amt, s.cur)} <a onclick="S.subs.splice(${i},1);save();draw()">${t("del")}</a></div>
      </div>`).join("")}
    <button class="btn" style="margin-top:6px" onclick="addSub()">${t("addSub")}</button>
  </div>`;
}

function addX() {
  const a = +$("#xa").value;
  if (!a) return;
  const c = $("#xc").value;
  S.tx.push({
    id: "t" + Date.now(),
    date: $("#xd").value || today(),
    type: "Expense",
    cur: c,
    amt: a,
    jar: +$("#xj").value,
    wallet: 0,
    travel: $("#xt").checked,
    note: ""
  });
  const w = S.wallets.find(x => x.cur == c);
  if (w) w.bal -= a;
  save();
  draw();
}

function scan() {
  $("#xa").value = 15800;
  $("#xc").value = "KRW";
  $("#xj").value = 0;
  $("#xd").value = today();
  alert(t("prompts").scanDemo);
}

function addSub() {
  const P = t("prompts");
  const n = prompt(P.subName);
  if (!n) return;
  const c = (prompt(P.subCur, "KRW") || "KRW").toUpperCase();
  const a = parseFloat(prompt(P.subAmt));
  const d = parseInt(prompt(P.subDay, "1"));
  if (R[c] && a > 0) {
    S.subs.push({ n, amt: a, cur: c, day: d || 1 });
    save();
    draw();
  }
}

function chart() {
  const [n, l] = { 7: [7, 1], 30: [4, 7], 90: [3, 30], 180: [6, 30], 365: [12, 30] }[per];
  const b = Array.from({ length: n }, () => ({ i: 0, x: 0 }));
  const now = Date.now();
  S.tx.filter(t => !t.travel).forEach(t => {
    const k = Math.floor((now - new Date(t.date)) / 864e5 / l);
    if (k >= 0 && k < n) b[n - 1 - k][t.type == "Income" ? "i" : "x"] += cv(t.amt, t.cur, "KRW");
  });
  const mx = Math.max(1, ...b.map(o => Math.max(o.i, o.x)));
  const av = b.reduce((a, o) => a + o.x, 0) / n;
  const w = 300 / n;
  $("#ch").innerHTML = `
    <svg viewBox="0 0 300 120" style="width:100%">
      ${b.map((o, k) => `
        <rect x="${k * w + 2}" y="${110 - o.i / mx * 100}" width="${w / 2 - 3}" height="${o.i / mx * 100}" fill="#BEB8CD"/>
        <rect x="${k * w + w / 2}" y="${110 - o.x / mx * 100}" width="${w / 2 - 3}" height="${o.x / mx * 100}" fill="${o.x > av * 1.2 ? "#531245" : "#AAAAFF"}"/>
      `).join("")}
    </svg>
    <p class="sm">${t("chartLegend")}</p>`;
}

function radarChart() {
  const el = $("#radar-ch");
  if (!el) return;
  const m = today().slice(0, 7);
  const actualRaw = [0, 1, 2, 3, 4, 5].map(i =>
    S.tx.filter(tx => tx.type == "Expense" && !tx.travel && tx.jar === i && tx.date.startsWith(m))
      .reduce((a, tx) => a + cv(tx.amt, tx.cur, "KRW"), 0)
  );
  const totalSpent = actualRaw.reduce((a, b) => a + b, 0);
  const actualPct = actualRaw.map(v => totalSpent > 0 ? (v / totalSpent) * 100 : 0);
  const targetPct = S.jars.map(j => j.p);
  const maxScale = Math.max(50, ...targetPct, ...actualPct);

  const cx = 160, cy = 125, rMax = 78;
  const pt = (idx, val) => {
    const ang = -Math.PI / 2 + (idx * 2 * Math.PI) / 6;
    const rad = (cl(val / maxScale)) * rMax;
    return [cx + rad * Math.cos(ang), cy + rad * Math.sin(ang)];
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const gridPolys = gridLevels.map(lv => {
    const pts = [0, 1, 2, 3, 4, 5].map(i => {
      const ang = -Math.PI / 2 + (i * 2 * Math.PI) / 6;
      return `${(cx + rMax * lv * Math.cos(ang)).toFixed(1)},${(cy + rMax * lv * Math.sin(ang)).toFixed(1)}`;
    }).join(" ");
    return `<polygon points="${pts}" fill="none" stroke="#BEB8CD" stroke-width="0.8"/>`;
  }).join("");

  const axes = [0, 1, 2, 3, 4, 5].map(i => {
    const [x, y] = pt(i, maxScale);
    return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#BEB8CD" stroke-width="0.8"/>`;
  }).join("");

  const targetPoly = targetPct.map((v, i) => pt(i, v).map(n => n.toFixed(1)).join(",")).join(" ");
  const actualPoly = actualPct.map((v, i) => pt(i, v).map(n => n.toFixed(1)).join(",")).join(" ");

  const labels = S.jars.map((j, i) => {
    const ang = -Math.PI / 2 + (i * 2 * Math.PI) / 6;
    const lx = cx + (rMax + 24) * Math.cos(ang);
    const ly = cy + (rMax + 20) * Math.sin(ang);
    const anchor = Math.abs(Math.cos(ang)) < 0.2 ? "middle" : (Math.cos(ang) > 0 ? "start" : "end");
    const shortName = j.n.length > 11 ? j.n.slice(0, 10) + "…" : j.n;
    return `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" font-size="9.5" fill="#150811" text-anchor="${anchor}" dominant-baseline="middle">${esc(shortName)} (${Math.round(actualPct[i])}%/${j.p}%)</text>`;
  }).join("");

  el.innerHTML = `
  <svg viewBox="0 0 320 250" style="width:100%;max-width:320px">
    ${gridPolys}
    ${axes}
    <polygon points="${targetPoly}" fill="rgba(98,59,112,0.12)" stroke="#623B70" stroke-width="1.6" stroke-dasharray="4 3"/>
    <polygon points="${actualPoly}" fill="rgba(170,170,255,0.45)" stroke="#531245" stroke-width="2"/>
    ${actualPct.map((v, i) => {
      const [px, py] = pt(i, v);
      return `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="3.2" fill="#531245"/>`;
    }).join("")}
    ${labels}
  </svg>`;
}

/* ---------- Tab 4: Goals ---------- */
function goals() {
  const tr = S.tx.filter(t => t.travel).reduce((a, t) => a + cv(t.amt, t.cur, "KRW"), 0);
  return `
  <div class="card vel row">
    <div><b>${t("travelMode")}</b><div class="sm">${t("travelDesc")}</div></div>
    <button class="btn" onclick="S.travel=!S.travel;save();draw()">${S.travel ? t("on") : t("off")}</button>
  </div>
  <div class="card">${t("travelSpent")}: <b class="num">${f(tr, "KRW")}</b></div>

  <h2>${t("finGoals")}</h2>
  ${S.goals.map((g, i) => {
    const ml = Math.max(1, Math.ceil((new Date(g.dl) - new Date()) / 2592e6));
    const mo = Math.max(0, g.t - g.saved) / ml;
    return `
    <div class="card">
      <div class="row"><b>${esc(g.n)}</b><a onclick="S.goals.splice(${i},1);save();draw()">${t("del")}</a></div>
      <div class="bar"><i style="width:${cl(g.saved / g.t) * 100}%"></i></div>
      <div class="sm">${f(g.saved, g.cur)} / ${f(g.t, g.cur)} · ${t("deadline")} ${g.dl}</div>
      <div>${t("needMonthly")}: <b class="num">${f(mo, g.cur)}</b></div>
      <div class="sm">${t("usdtTip").replace("{amt}", f(cv(mo, g.cur, "USDT") / 4, "USDT"))}</div>
    </div>`;
  }).join("")}
  <button class="btn" onclick="addG()">${t("addGoal")}</button>`;
}

function addG() {
  const P = t("prompts");
  const n = prompt(P.gName);
  if (!n) return;
  const c = (prompt(P.wCur + CUR.join("/"), "KRW") || "KRW").toUpperCase();
  const target = parseFloat(prompt(P.gTarget));
  const dl = prompt(P.gDl);
  const sv2 = parseFloat(prompt(P.gSaved, "0")) || 0;
  if (R[c] && target > 0 && dl) {
    S.goals.push({ n, t: target, cur: c, dl, saved: sv2 });
    save();
    draw();
  }
}

/* ---------- Tab 5: AI Assistant (1. AI Chat + 2. Exchange Rate Alert) ---------- */
function hs() {
  const K = tot("KRW"), m = today().slice(0, 7);
  const ex = S.tx.filter(t => t.type == "Expense" && !t.travel && Date.now() - new Date(t.date) < 2592e6)
    .reduce((a, t) => a + cv(t.amt, t.cur, "KRW"), 0);
  const r = S.inc ? (S.inc - ex) / S.inc : 0;
  const a = Math.round(cl(r / 0.2) * 40);
  const b = K >= S.visa * 1.2 ? 30 : K >= S.visa ? 15 : 0;
  const tp = S.jars.reduce((x, j) => x + j.p, 0);
  const over = S.jars.filter((j, i) =>
    S.tx.filter(t => t.type == "Expense" && !t.travel && t.jar === i && t.date.startsWith(m))
      .reduce((x, t) => x + cv(t.amt, t.cur, "KRW"), 0) > S.inc * j.p / 100
  ).length;
  const c = tp == 100 ? Math.round(30 * (6 - over) / 6) : 0;
  const tips = [];
  if (a < 40) tips.push(t("tipSave"));
  if (b < 30) tips.push(t("tipVisa"));
  if (c < 30) tips.push(tp == 100 ? t("tipJarOver") : t("tipJar100"));
  return { s: a + b + c, tips: tips.slice(0, 2) };
}

function sendChat() {
  const inp = $("#ai-in");
  if (!inp) return;
  const msg = inp.value.trim();
  if (!msg) return;
  chatLog.push({ role: "user", text: msg });
  chatLog.push({ role: "bot", text: t("aiUnsupported") });
  draw();
}

function addAl() {
  const p = $("#ap").value, th = parseFloat($("#at").value);
  if (th > 0) {
    S.alerts.push({ p, th });
    save();
    draw();
  }
}

function ai() {
  const h = hs();
  return `
  <div class="card deep">
    <div class="sm">${t("healthScore")}</div>
    <div class="big num">${h.s} / 100</div>
    <div class="bar"><i style="width:${h.s}%"></i></div>
    ${h.tips.map(tip => `<div>• ${tip}</div>`).join("") || `<div>${t("greatKeep")}</div>`}
  </div>

  <h2>1. ${t("aiChatTitle")}</h2>
  <div class="card">
    <div id="chat-box" class="chat-box">
      ${chatLog.map(m => `<div class="msg ${m.role}">${esc(m.text)}</div>`).join("")}
    </div>
    <div class="chat-input-row">
      <input id="ai-in" placeholder="${t("aiPlaceholder")}" onkeydown="if(event.key==='Enter')sendChat()">
      <button class="btn sm-btn" onclick="sendChat()">${t("send")}</button>
    </div>
  </div>

  <h2>2. ${t("fxTitle")}</h2>
  <div class="card">
    <div class="row">
      <select id="ap">${["KRW/VND", "USD/KRW", "USD/VND", "KRW/USD"].map(x => `<option>${x}</option>`).join("")}</select>
      <input id="at" type="number" step="any" placeholder="${t("threshold")}">
    </div>
    <button class="btn" onclick="addAl()">${t("setAlert")}</button>
    ${S.alerts.map((a, i) => {
      const [x, y] = a.p.split("/"), r = cv(1, x, y);
      return `
      <div class="row" style="margin-top:8px">
        <div>
          <b>${a.p} ≥ ${a.th}</b>
          <div class="sm">${t("currentSample")}: ${r.toFixed(r < 1 ? 5 : 2)} · ${r >= a.th ? t("reached") : t("notReached")}</div>
        </div>
        <a onclick="S.alerts.splice(${i},1);save();draw()">${t("del")}</a>
      </div>`;
    }).join("")}
  </div>
  <p class="sm"><i>${t("fxDisclaimer")}</i></p>`;
}
