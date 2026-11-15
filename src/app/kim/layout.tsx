import type { Metadata } from "next";
import { Archivo, JetBrains_Mono, Patrick_Hand } from "next/font/google";

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

export const metadata: Metadata = {
  title: "Trương Tấn Nghĩa — Co-Founder & CEO AIhoclaptrinh",
  description:
    "Trương Tấn Nghĩa làm mọi thứ về AI, từ mô hình học máy đến robot chạy ngoài đời thật: AI agent, chatbot, thị giác máy tính, Edge AI, robotics và đào tạo lập trình AI.",
};

export default function KimLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${archivo.variable} ${patrickHand.variable} ${mono.variable}`}>{children}</div>;
}
