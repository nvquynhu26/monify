# Monify — My Finance Manager (v2)

Clean Mobile-First Fintech Web App inspired by **MISA Money Keeper** & **TOSS**, built strictly on the 6-color Monify palette (`#FAF9F8`, `#150811`, `#AAAAFF`, `#623B70`, `#531245`, `#BEB8CD`) and ready for **GitHub Pages**.

## Highlights
- **Default English UI** with instant 6-language switcher inside **Settings (top right)**: English, 한국어, Русский, Tiếng Việt, Oʻzbekcha, Беларуская.
- **Pre-connected Backend**: Google Apps Script Web App URL is hardcoded directly in `config.js` and `app.js` (silent background sync + instant `localStorage` fallback). No manual Google Sheets sync UI in the app.
- **iPhone-Fitted Layout**: All buttons, cards, and segmented controls stay strictly inside the iPhone frame with `>=15px` margins on all four sides.
- **Top-Right Controls**: Refresh FX and Settings/Account buttons positioned cleanly at the top right.

## Deploy on GitHub Pages
1. Upload `index.html`, `styles.css`, `app.js`, `config.js`, and your `logo1.png` to the root of your GitHub repository (`main` branch).
2. Go to **Settings → Pages** → Branch: **`main`**, Folder: **`/ (root)`** → **Save**.
3. Sign in with demo account `monify` / `828282` or register a new account.
