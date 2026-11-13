import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/shell/AppShell";

/* Trùng với PUBLIC_HOSTS trong src/middleware.ts — sửa thì sửa cả hai. */
const PUBLIC_HOSTS = new Set(["aihoclaptrinh.com", "www.aihoclaptrinh.com"]);

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
  // Tên miền công khai (aihoclaptrinh.com) chỉ dùng để khoe trang Giới thiệu:
  // không dựng sidebar/topbar quản trị, cũng không qua cổng đăng nhập —
  // middleware đã chặn mọi đường dẫn quản trị trên tên miền này rồi.
  const host = ((await headers()).get("host") ?? "").toLowerCase().split(":")[0];
  const publicSite = PUBLIC_HOSTS.has(host);

  return (
    <html lang="vi" className={`${geist.className} ${beVietnam.variable}`} suppressHydrationWarning>
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
