import "./kim.css";
import "./kim-shell.css";
import "./kim-site.css";
import "./kim-courses.css";
import "./kim-journey.css";
import "./kim-organ-scan.css";
import "./kim-quotes.css";
import "./kim-roadmap.css";
import "./kim-diamond.css";

import { Archivo, JetBrains_Mono, Patrick_Hand } from "next/font/google";

import { homeMetadata } from "./page-meta";

/* Phông của bản thiết kế "Xưởng Kim". Archivo phải nạp cả trục bề rộng (wdth):
   tiêu đề dùng font-stretch 114–125% để ra dáng chữ dập trên kim loại; thiếu trục
   này trình duyệt sẽ tự kéo giãn chữ, nét bị méo. */
const archivo = Archivo({
  subsets: ["latin", "latin-ext", "vietnamese"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const patrickHand = Patrick_Hand({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: "400",
  variable: "--font-patrick-hand",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600"],
  variable: "--font-kim-mono",
  display: "swap",
});

// tiêu đề, mô tả, canonical của trang chủ (theo ngôn ngữ đang chọn); trang con tự khai ở page-meta.ts
export const generateMetadata = homeMetadata;

export default function KimLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${archivo.variable} ${patrickHand.variable} ${mono.variable}`}>{children}</div>;
}
