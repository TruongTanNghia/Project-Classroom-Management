import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/shell/AppShell";
import { isPublicShell } from "@/lib/hosts";

// Geist trên Google Fonts chưa có subset tiếng Việt — glyph có dấu sẽ
// fallback sang font hệ thống, giống hệt hành vi của bản prototype.
const geist = Geist({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

// Font hiển thị cao cấp cho trang Giới thiệu — hỗ trợ tiếng Việt đầy đủ.
const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "AIhoclaptrinh — EduFlow AI",
  description: "Bảng điều khiển quản lý lớp học AI/lập trình của AIhoclaptrinh",
  icons: { icon: "/uploads/Logo.jpeg" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Khung khách (chỉ trang Giới thiệu, không sidebar/topbar, không cổng đăng
  // nhập) hay khung quản trị? Nay cùng một tên miền phục vụ cả hai mặt —
  // aihoclaptrinh.com/admin vẫn vào được khu quản trị — nên phải hỏi
  // middleware qua header, chứ nhìn mỗi tên miền là đoán sai.
  const publicSite = isPublicShell(await headers());

  // Trang công khai luôn chạy chủ đề tối: không có nút đổi chủ đề ở đó, và
  // nền tối lấp hai bên cánh nên màn rộng không bị trơ. Đặt class ngay từ
  // máy chủ để không chớp sáng một nhịp rồi mới tối.
  const htmlClass = [geist.className, beVietnam.variable, publicSite && "dark"]
    .filter(Boolean)
    .join(" ");

  return (
    <html lang="vi" className={htmlClass} suppressHydrationWarning>
      <body className={publicSite ? "public-site" : "app-site"}>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('aihlt-dark')==='1')document.documentElement.classList.add('dark')}catch(e){}",
          }}
        />
        {publicSite ? children : <AppShell>{children}</AppShell>}
      </body>
    </html>
  );
}
