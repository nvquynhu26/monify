# Monify — My Finance Manager (GitHub Pages Ready)

Mobile-first Web App quản lý tài chính đa tiền tệ chuẩn Fintech tối giản (Toss / Revolut), tuân thủ 100% bảng màu Monify và hỗ trợ đồng bộ 2 chiều với Google Sheets.

## Cấu trúc thư mục
```text
/
├── index.html      # Giao diện chính (Launch Screen, Login, Register, 5 Tabs)
├── styles.css      # Hệ thống thiết kế chuẩn 6 mã màu Monify + Responsive khung điện thoại
├── app.js          # Toàn bộ 15 chức năng, tỷ giá thời gian thực & localStorage fallback
├── config.js       # Nơi dán URL Google Apps Script Web App
├── Code.gs         # Mã nguồn Google Apps Script (tự tạo 6 Sheet & seed tài khoản monify)
├── logo1.png       # (Bạn tự đặt file logo của mình vào đây)
└── README.md       # Hướng dẫn cài đặt
```

---

## 1. Chạy thử ngay (Không cần nối Google Sheets)
1. Giải nén thư mục và đặt file **`logo1.png`** vào ngay thư mục gốc (cùng cấp `index.html`).
2. Mở trực tiếp `index.html` trên trình duyệt hoặc đẩy lên GitHub Pages.
3. Sau 2 giây màn hình chào (Launch Screen), đăng nhập bằng tài khoản kiểm thử có sẵn:
   - **Username:** `monify`
   - **Password:** `828282`
   - Đã có sẵn **5/6 ví tiền** (còn trống 1 slot để test thêm ví) và **2 sổ tiết kiệm** (Hàn Quốc & Việt Nam).

---

## 2. Kết nối với Google Sheets (Lưu trữ thật theo `User_ID`)
1. Tạo một file **Google Sheets** mới.
2. Trên thanh menu chọn **Extensions (Tiện ích mở rộng) → Apps Script**.
3. Xóa code mặc định, copy toàn bộ nội dung file **`Code.gs`** dán vào và bấm **Save (Lưu)**.
4. Chọn hàm `initSheets` trên thanh công cụ và bấm **Run** 1 lần (cấp quyền truy cập) để tự động tạo đủ 6 tab (`Users`, `Wallets`, `Savings`, `Transactions`, `Budgets_6Jars`, `Goals_Subscriptions`) cùng dữ liệu mẫu `monify`.
5. Bấm **Deploy (Triển khai) → New deployment (Triển khai mới)**:
   - Select type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Copy **Web App URL** (có dạng `https://script.google.com/macros/s/.../exec`).
7. Dán URL đó vào `GOOGLE_SCRIPT_URL` trong file **`config.js`** (hoặc dán trực tiếp trong mục **Cài đặt Tài khoản** ở góc trên bên phải bên trong app).

---

## 3. Đẩy lên GitHub Pages để tạo link & mã QR demo
1. Tạo một repository mới trên GitHub (ví dụ: `monify-app`).
2. Tải toàn bộ file (`index.html`, `styles.css`, `app.js`, `config.js`, `logo1.png`) lên nhánh `main` (thư mục gốc `/`).
3. Vào tab **Settings → Pages**:
   - Source: **Deploy from a branch**
   - Branch: **`main`** · Folder: **`/ (root)`** → Bấm **Save**.
4. Chờ ~1 phút, GitHub sẽ cấp đường dẫn dạng `https://<ten-github>.github.io/monify-app/`. Bạn có thể mở trực tiếp trên điện thoại hoặc tạo mã QR gắn vào slide thuyết trình.
