import type { Metadata } from "next";
import localFont from "next/font/local";
import { Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";

/* Geist bản local do MCP thiết kế xuất ra — có đủ dấu tiếng Việt,
   khác với Geist trên Google Fonts (thiếu subset vietnamese).
   Chỉ áp cho trang Giới thiệu nên không đụng phần còn lại của app. */
const geistSans = localFont({
  src: "../fonts/Geist-Variable.woff2",
  weight: "100 900",
  variable: "--font-geist-sans",
  display: "swap",
});

/* about.css đọc đúng 3 biến này: --font-geist-sans, --font-be-vietnam-pro,
   --font-jetbrains-mono (nó tự map sang --font-display / --font-mono bên trong). */
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Giới thiệu — Trương Tấn Nghĩa | AIhoclaptrinh",
  description:
    "Trương Tấn Nghĩa — Nhà sáng lập & CEO AIhoclaptrinh. AI agents, chatbot, automation, thị giác máy tính và đào tạo lập trình AI.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${geistSans.variable} ${beVietnamPro.variable} ${jetbrainsMono.variable}`}>
      {children}
    </div>
  );
}
