/**
 * Một nơi duy nhất quyết định tên miền nào là "công khai".
 *
 * Trước đây danh sách này bị chép ở ba chỗ (middleware, layout gốc, trang
 * Giới thiệu). Thêm hay bớt một tên miền mà quên sửa đủ ba chỗ là trang
 * quản trị lộ ra ngoài — nên gom về đây, sửa một lần là xong.
 *
 *   CÔNG KHAI   aihoclaptrinh.com, www.aihoclaptrinh.com
 *               → chỉ có trang Giới thiệu, không cần đăng nhập.
 *
 *   QUẢN TRỊ    mọi tên miền còn lại: admin.aihoclaptrinh.com,
 *               *.vercel.app, localhost
 *               → ứng dụng đầy đủ, phải đăng nhập.
 *
 * Mặc định "không công khai" là có chủ ý: tên miền lạ sẽ ra app quản trị
 * (vẫn có cổng đăng nhập chặn), chứ không âm thầm phơi trang công khai.
 *
 * CỐ Ý KHÔNG có cửa tắt kiểu aihoclaptrinh.com/admin. Đã từng làm rồi lại
 * bỏ: thầy Nghĩa chốt chỉ vào bằng tên miền quản trị riêng, không muốn ô
 * đăng nhập nào mọc trên tên miền thương hiệu. Ai định thêm lại thì hỏi
 * thầy trước.
 */
export const PUBLIC_HOSTS = new Set(["aihoclaptrinh.com", "www.aihoclaptrinh.com"]);

/** Cắt cổng khỏi header Host ("localhost:3001" → "localhost"). */
export function hostOf(rawHost: string | null | undefined): string {
  return (rawHost ?? "").toLowerCase().split(":")[0];
}

/** Nhận nguyên header Host, trả về có phải tên miền công khai hay không. */
export function isPublicHost(rawHost: string | null | undefined): boolean {
  return PUBLIC_HOSTS.has(hostOf(rawHost));
}
