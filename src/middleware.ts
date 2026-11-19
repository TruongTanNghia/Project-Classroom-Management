import { NextResponse, type NextRequest } from "next/server";

import { isPublicHost } from "@/lib/hosts";
import { parsePublicPath } from "@/lib/public-sections";

/**
 * Tách hai mặt của cùng một ứng dụng theo TÊN MIỀN:
 *
 *   www.aihoclaptrinh.com     → trang công khai: trang chủ "/" và các trang /path, /roadmap,
 *                               /projects, /courses… (nội bộ là /kim/<trang>, URL không đổi).
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

const ALLOWED_ON_PUBLIC = ["/bienlai", "/api"];

/**
 * Trang công khai bản "Xưởng Kim" (src/app/kim). Đường dẫn này là tên nội bộ:
 * khách chỉ thấy "/" trên tên miền công khai, không bao giờ thấy "/kim".
 * Trang Giới thiệu bản cũ (/about) vẫn nguyên trong khu quản trị.
 */
const PUBLIC_HOME = "/kim";

const under = (pathname: string, p: string) => pathname === p || pathname.startsWith(p + "/");

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isPublicHost(request.headers.get("host"))) {
    // Khu quản trị không có trang "Xưởng Kim": ai gõ /kim thì về trang Giới thiệu
    // của khu quản trị, để hai giao diện không bao giờ nằm chung một tên miền.
    if (under(pathname, PUBLIC_HOME)) {
      const url = request.nextUrl.clone();
      url.pathname = "/about";
      return NextResponse.redirect(url);
    }

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

  // Trang chủ của tên miền công khai = trang "Xưởng Kim", giữ nguyên URL "/".
  // Mỗi đầu mục là một trang riêng: "/projects" hiện trang nội bộ /kim/projects, vẫn giữ URL.
  // Địa chỉ con (/courses/hoc-may, /roadmap/ml) hiện trang mẹ; hộp chi tiết do trình duyệt mở.
  // Danh sách trang: src/lib/public-sections.ts
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = PUBLIC_HOME;
    return NextResponse.rewrite(url);
  }
  const page = parsePublicPath(pathname);
  if (page) {
    const url = request.nextUrl.clone();
    url.pathname = `${PUBLIC_HOME}/${page.section}`;
    return NextResponse.rewrite(url);
  }

  // Tên nội bộ /kim/<trang> → địa chỉ công khai /<trang>; link cũ aihoclaptrinh.com/about
  // (đã chia sẻ, đã được Google ghi nhận) → "/". Mỗi trang chỉ có đúng một địa chỉ.
  if (under(pathname, "/about") || under(pathname, PUBLIC_HOME)) {
    const url = request.nextUrl.clone();
    const rest = under(pathname, PUBLIC_HOME) ? pathname.slice(PUBLIC_HOME.length) : "";
    url.pathname = rest && parsePublicPath(rest) ? rest : "/";
    return NextResponse.redirect(url, 308);
  }

  const allowed = ALLOWED_ON_PUBLIC.some((p) => under(pathname, p));
  if (allowed) return NextResponse.next();

  // Còn lại (dashboard, students, tuition…) → về trang Giới thiệu
  const url = request.nextUrl.clone();
  url.pathname = "/";
  return NextResponse.redirect(url);
}

export const config = {
  // Bỏ qua file tĩnh để không tốn công xử lý. Đuôi nào không có trong danh sách này sẽ đi qua
  // bộ lọc ở trên và bị đẩy về "/" — thêm loại file tĩnh mới vào public/ thì phải thêm đuôi vào
  // đây (glb: mô hình 3D của trang công khai, public/kim/models).
  matcher: [
    // "\\." (hai gạch): trong chuỗi JS, "\." chỉ còn là "." và khớp MỌI ký tự, khi đó cả
    // "/roadmap" (tận cùng bằng "map") cũng bị coi là tệp tĩnh và lọt qua middleware.
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:webp|jpg|jpeg|png|gif|svg|ico|woff|woff2|ttf|css|js|map|txt|xml|json|glb)$).*)",
  ],
};
