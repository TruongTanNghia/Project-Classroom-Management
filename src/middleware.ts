import { NextResponse, type NextRequest } from "next/server";

/**
 * Tách hai mặt của cùng một ứng dụng theo TÊN MIỀN:
 *
 *   www.aihoclaptrinh.com   → trang công khai, CHỈ có trang Giới thiệu.
 *                             "/" hiện luôn nội dung Giới thiệu (không đổi URL).
 *                             Mọi đường dẫn quản trị đều bị đẩy về "/".
 *
 *   *.vercel.app (và local) → ứng dụng quản trị đầy đủ như cũ, không đổi gì.
 *
 * Vẫn cho qua trên tên miền công khai:
 *   /bienlai/*  link biên lai đã gửi cho học viên qua Zalo (có chữ ký số)
 *   /api/*      webhook Zalo, cron nhắc lịch — đều tự bảo vệ bằng khoá bí mật
 * Chặn hai nhóm này sẽ làm chết tự động hoá và link học viên đang cầm.
 */

const PUBLIC_HOSTS = new Set(["aihoclaptrinh.com", "www.aihoclaptrinh.com"]);

const ALLOWED_ON_PUBLIC = ["/about", "/bienlai", "/api"];

export function middleware(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").toLowerCase().split(":")[0];
  if (!PUBLIC_HOSTS.has(host)) return NextResponse.next();

  const { pathname } = request.nextUrl;

  // Trang chủ của tên miền công khai = trang Giới thiệu, giữ nguyên URL "/"
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/about";
    return NextResponse.rewrite(url);
  }

  const allowed = ALLOWED_ON_PUBLIC.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (allowed) return NextResponse.next();

  // Còn lại (dashboard, students, tuition…) → về trang Giới thiệu
  const url = request.nextUrl.clone();
  url.pathname = "/";
  return NextResponse.redirect(url);
}

export const config = {
  // Bỏ qua file tĩnh để không tốn công xử lý
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:webp|jpg|jpeg|png|gif|svg|ico|woff|woff2|ttf|css|js|map|txt|xml|json)$).*)",
  ],
};
