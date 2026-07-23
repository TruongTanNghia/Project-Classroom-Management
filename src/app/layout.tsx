import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/shell/AppShell";

// Geist trên Google Fonts chưa có subset tiếng Việt — glyph có dấu sẽ
// fallback sang font hệ thống, giống hệt hành vi của bản prototype.
const geist = Geist({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
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
    <html lang="vi" className={geist.className} suppressHydrationWarning>
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
