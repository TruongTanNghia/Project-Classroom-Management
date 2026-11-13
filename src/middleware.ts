import { NextResponse, type NextRequest } from "next/server";

import { isPublicHost } from "@/lib/hosts";

/**
 * Tách hai mặt của cùng một ứng dụng theo TÊN MIỀN:
 *
 *   www.aihoclaptrinh.com     → trang công khai, CHỈ có trang Giới thiệu.
 *                               "/" hiện luôn nội dung Giới thiệu (không đổi URL).
 *                               Mọi đường dẫn quản trị đều bị đẩy về "/".
 *
 *   admin.aihoclaptrinh.com   → ứng dụng quản trị đầy đủ, có cổng đăng nhập.
 *   *.vercel.app, localhost     Danh sách tên miền công khai nằm ở src/lib/hosts.ts.
 *
 * Vẫn cho qua trên tên miền công khai:
 *   /bienlai/*  link biên lai đã gửi cho học viên qua Zalo (có chữ ký số)
 *   /api/*      webhook Zalo, cron nhắc lịch — đều tự bảo vệ bằng khoá bí mật
 * Chặn hai nhóm này sẽ làm chết tự động hoá và link học viên đang cầm.
 */

const ALLOWED_ON_PUBLIC = ["/about", "/bienlai", "/api"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isPublicHost(request.headers.get("host"))) {
    // Gõ "admin.aihoclaptrinh.com" trần là vào thẳng Bảng điều khiển.
    // Không thể trông vào redirect() trong src/app/page.tsx: cổng đăng nhập
    // là client component, nó thay children bằng màn đăng nhập nên lệnh
    // chuyển trang chỉ nổ ra SAU khi đăng nhập xong — trước đó "/" đứng im.
    if (pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    // Tên miền quản trị: chạy app như cũ, nhưng xin các máy tìm kiếm đừng
    // lập chỉ mục. Không có dòng này thì admin.aihoclaptrinh.com có ngày
    // hiện lên Google — tuy chỉ ra màn đăng nhập, vẫn là chỉ đường.
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

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
    "/((?!_next/static|_next/image|favicon.ico|.*\.(?:webp|jpg|jpeg|png|gif|svg|ico|woff|woff2|ttf|css|js|map|txt|xml|json)$).*)",
  ],
};
