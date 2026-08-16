import type { Metadata } from "next";
import { Geist, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/shell/AppShell";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${geist.className} ${beVietnam.variable}`} suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('aihlt-dark')==='1')document.documentElement.classList.add('dark')}catch(e){}",
          }}
        />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
