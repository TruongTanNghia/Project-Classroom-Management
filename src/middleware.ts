import { NextResponse, type NextRequest } from "next/server";

import {
  DOOR_COOKIE,
  DOOR_MAX_AGE,
  DOOR_PATHS,
  GUEST_PATHS,
  SHELL_HEADER,
  isPublicHost,
  matchesPrefix,
} from "@/lib/hosts";

/**
 * Chia một ứng dụng thành hai mặt. Xem src/lib/hosts.ts để biết luật chung;
 * ở đây chỉ là chỗ thi hành.
 */

/** Ghi dấu cho máy này: đã vào cửa rồi, lần sau khỏi gõ /admin. */
function moCua(res: NextResponse) {
  res.cookies.set(DOOR_COOKIE, "1", {
    path: "/",
    maxAge: DOOR_MAX_AGE,
    sameSite: "lax",
  });
  return res;
}

/** Cho đi tiếp, kèm mách cho layout gốc biết nên dựng khung nào. */
function choQua(request: NextRequest, shell: "public" | "app") {
  const headers = new Headers(request.headers);
  headers.set(SHELL_HEADER, shell);
  const res = NextResponse.next({ request: { headers } });
  if (shell === "app") {
    // Khu quản trị tuy chỉ hiện ô đăng nhập, nhưng để Google lập chỉ mục
    // thì vẫn là chỉ đường vào nhà.
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return res;
}

function doiSang(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return url;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ---- Cửa vào: dùng được trên MỌI tên miền ----
  // Phải đặt trên cùng để aihoclaptrinh.com/admin cũng ăn. Link đặt lại mật
  // khẩu trong mail cũng trỏ về đây, nên đuôi #access_token... phải sống sót
  // qua cú chuyển trang này — trình duyệt giữ nguyên phần # khi Location
  // không mang # riêng (đã dựng thật để kiểm).
  if (matchesPrefix(pathname, DOOR_PATHS)) {
    return moCua(NextResponse.redirect(doiSang(request, "/dashboard")));
  }

  // ---- Tên miền mặt trong: admin.*, *.vercel.app, localhost ----
  if (!isPublicHost(request.headers.get("host"))) {
    // Gõ tên miền trần là vào thẳng Bảng điều khiển. Không thể trông vào
    // redirect() trong src/app/page.tsx: cổng đăng nhập là client component,
    // nó thay children bằng màn đăng nhập nên lệnh chuyển trang chỉ nổ ra
    // SAU khi đăng nhập xong — trước đó "/" đứng im ở khung xương.
    if (pathname === "/") {
      return moCua(NextResponse.redirect(doiSang(request, "/dashboard")));
    }
    return moCua(choQua(request, "app"));
  }

  // ---- Tên miền mặt tiền: aihoclaptrinh.com ----

  // Trang chủ = trang Giới thiệu, giữ nguyên URL "/"
  if (pathname === "/") {
    const headers = new Headers(request.headers);
    headers.set(SHELL_HEADER, "public");
    return NextResponse.rewrite(doiSang(request, "/about"), { request: { headers } });
  }

  // Trang cho khách: Giới thiệu, biên lai học viên, webhook/cron
  if (matchesPrefix(pathname, GUEST_PATHS)) return choQua(request, "public");

  // Còn lại là đường dẫn quản trị. Máy đã vào cửa thì cho qua (và gia hạn
  // dấu, để mở một lần là dùng mãi); máy lạ thì đẩy về trang Giới thiệu.
  if (request.cookies.get(DOOR_COOKIE)?.value === "1") {
    return moCua(choQua(request, "app"));
  }
  return NextResponse.redirect(doiSang(request, "/"));
}

export const config = {
  // Bỏ qua file tĩnh để không tốn công xử lý
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\.(?:webp|jpg|jpeg|png|gif|svg|ico|woff|woff2|ttf|css|js|map|txt|xml|json)$).*)",
  ],
};
