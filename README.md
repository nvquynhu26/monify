# Monify v2 — My Finance Manager (MISA Money Keeper Style)

## Updates in v2
- **Default Language: English** with built-in language switcher (**English / 한국어 / Tiếng Việt**) inside **Account & Language** (and on Login screen).
- **Auto-Connected Google Sheets**: Hardcoded your Google Apps Script Web App URL directly in `config.js` & `app.js` (manual URL entry removed).
- **Zero Horizontal Overflow**: Rebuilt the Transfer sub-navigation into a strict 4-column segmented bar (`Compare | QR Pay | Split | ATM/FX`) and enforced `minmax(0, 1fr)` grids so every button fits cleanly inside any phone screen.
- **MISA Money Keeper Minimalist Redesign**: Clean Velvet Purple header, crisp Snow cards with soft dividers, compact horizontal list rows for Wallets/Savings/Transactions, strictly adhering to the 6-color Monify palette.

## Quick Deploy to GitHub Pages
1. Extract all files (`index.html`, `styles.css`, `app.js`, `config.js`) into your repository root alongside `logo1.png`.
2. Push to `main` branch — GitHub Pages updates automatically.
3. Demo account: **`monify`** / **`828282`**.
