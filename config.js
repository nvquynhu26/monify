// ============================================================
// MONIFY — CẤU HÌNH KẾT NỐI GOOGLE APPS SCRIPT
// ============================================================
// Bước 1: Tạo Google Sheet -> Extensions -> Apps Script -> dán Code.gs
// Bước 2: Deploy -> New deployment -> Web app (Who has access: Anyone)
// Bước 3: Dán URL Web App (dạng https://script.google.com/macros/s/.../exec) vào bên dưới.
// Nếu để trống "", ứng dụng sẽ tự chạy chế độ Demo (localStorage) với tài khoản monify / 828282.

window.MONIFY_CONFIG = {
  GOOGLE_SCRIPT_URL: "",
  AUTO_REFRESH_FX_MS: 300000 // Tự động làm mới tỷ giá mỗi 5 phút
};
