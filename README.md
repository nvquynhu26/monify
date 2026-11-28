# Monify — My Finance Manager

## Chạy thử ngay
Mở `index.html` (hoặc chạy GitHub Pages). Đăng nhập `monify` / `828282` — dữ liệu mẫu lưu trong localStorage.
Đặt file logo của bạn tên **`logo1.png`** ở thư mục gốc (nếu thiếu, app hiện chữ "Monify").

## Bật GitHub Pages
1. Tạo repo, upload toàn bộ file (`index.html`, `style.css`, `app.js`, `config.js`, `logo1.png`).
2. **Settings → Pages → Source: Deploy from a branch → `main` / `(root)` → Save**.
3. Mở `https://<tên-bạn>.github.io/<tên-repo>/` sau ~1 phút.

## Nối Google Sheets
1. Tạo Google Sheet mới → **Extensions → Apps Script**, dán toàn bộ `apps-script/Code.gs`.
2. **Deploy → New deployment → Web app**: Execute as *Me*, Who has access *Anyone* → Deploy → copy URL `/exec`.
3. Dán URL vào `config.js`: `window.MONIFY_API = "https://script.google.com/macros/s/.../exec";`
4. Các sheet (`Users`, `Wallets`, `Savings`, `Transactions`, `Budgets_6Jars`, `Goals_Subscriptions`) tự được tạo. Muốn dùng tài khoản `monify`, hãy đăng ký tài khoản này trong app trên Sheets (mật khẩu 828282).

## Lưu ý
- Tỷ giá, phí chuyển tiền, OCR hóa đơn hiện là **số/giả lập mẫu** (đổi bảng `R` trong `app.js` hoặc nối API thật).
- Theo yêu cầu, mật khẩu đang lưu dạng chữ thường trong Sheet — nên băm (hash) trước khi dùng thật.
