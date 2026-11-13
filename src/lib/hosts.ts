/**
 * Một nơi duy nhất quyết định khách thấy gì, chủ thấy gì.
 *
 *   aihoclaptrinh.com          Mặt tiền: khách vào chỉ thấy trang Giới thiệu.
 *   www.aihoclaptrinh.com      Gõ /dashboard, /students… đều bị đẩy về Giới thiệu.
 *
 *   admin.aihoclaptrinh.com    Mặt trong: app quản trị đầy đủ, qua cổng đăng nhập.
 *   *.vercel.app, localhost
 *
 * CỬA VÀO: gõ "/admin" (hoặc "/dash") ở BẤT KỲ tên miền nào cũng vào được khu
 * quản trị — kể cả tên miền mặt tiền. Nhờ vậy máy nào cũng dùng được ngay,
 * không phải chỉnh DNS từng máy. Vào cửa một lần thì máy đó nhớ cả năm.
 *
 * Nói cho rõ: cửa này chỉ để giấu mặt tiền cho sạch, KHÔNG phải lớp bảo mật.
 * Ai cũng tự đặt được cookie đó. Thứ thật sự giữ dữ liệu là đăng nhập
 * Supabase + RLS; cửa chỉ khiến khách vãng lai không vô tình thấy ô đăng nhập.
 */

export const PUBLIC_HOSTS = new Set(["aihoclaptrinh.com", "www.aihoclaptrinh.com"]);

/** Gõ mấy đường dẫn này là mở cửa vào khu quản trị. */
export const DOOR_PATHS = ["/admin", "/dash"];

/** Vào cửa rồi thì máy đó nhớ, khỏi gõ lại. */
export const DOOR_COOKIE = "aihlt-door";
export const DOOR_MAX_AGE = 60 * 60 * 24 * 365; // 1 năm

/** Trang dành cho khách — không cần mở cửa, không cần đăng nhập. */
export const GUEST_PATHS = [
  "/about", // trang Giới thiệu
  "/bienlai", // link biên lai đã gửi học viên qua Zalo
  "/api", // webhook Zalo + cron, tự bảo vệ bằng khoá bí mật
];

/**
 * Middleware ghi header này để layout gốc biết nên dựng khung nào, vì cùng
 * một tên miền giờ phục vụ cả hai mặt — chỉ nhìn tên miền là không đủ nữa.
 */
export const SHELL_HEADER = "x-aihlt-shell";

/** Cắt cổng khỏi header Host ("localhost:3001" → "localhost"). */
export function hostOf(rawHost: string | null | undefined): string {
  return (rawHost ?? "").toLowerCase().split(":")[0];
}

/** Nhận nguyên header Host, trả về có phải tên miền mặt tiền hay không. */
export function isPublicHost(rawHost: string | null | undefined): boolean {
  return PUBLIC_HOSTS.has(hostOf(rawHost));
}

/** pathname có khớp một trong các tiền tố không (khớp cả "/x" lẫn "/x/con"). */
export function matchesPrefix(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

/**
 * Dành cho server component: nên dựng khung khách hay khung quản trị.
 * Tin header của middleware trước; không có thì đoán theo tên miền để trang
 * vẫn hiển thị đúng nếu vì lý do nào đó middleware không chạy.
 */
export function isPublicShell(h: { get(name: string): string | null }): boolean {
  const shell = h.get(SHELL_HEADER);
  if (shell) return shell === "public";
  return isPublicHost(h.get("host"));
}
