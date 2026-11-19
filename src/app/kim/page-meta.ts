import type { Metadata } from "next";
import { cookies } from "next/headers";

import { tx, type KimLang } from "@/components/kim/i18n-kim";
import { pageOf, type PageKey } from "@/components/kim/site";

/* Tiêu đề tab, mô tả và địa chỉ gốc (canonical) của trang chủ và từng trang con, theo ngôn ngữ
   người xem đang chọn (cookie aihlt-lang, KimControls ghi). Máy tìm kiếm không có cookie nên
   luôn đọc bản tiếng Việt, ngôn ngữ chính của trang; hai bản dùng chung một địa chỉ. */
async function langOf(): Promise<KimLang> {
  return (await cookies()).get("aihlt-lang")?.value === "en" ? "en" : "vi";
}

const BRAND = "Trương Tấn Nghĩa · AIhoclaptrinh";

export async function homeMetadata(): Promise<Metadata> {
  const lang = await langOf();
  return {
    title: tx(lang, ["Trương Tấn Nghĩa — Co-Founder AIhoclaptrinh", "Trương Tấn Nghĩa — Co-Founder of AIhoclaptrinh"]),
    description: tx(lang, [
      "Trương Tấn Nghĩa làm mọi thứ về AI, từ mô hình học máy đến robot chạy ngoài đời thật: AI agent, chatbot, thị giác máy tính, Edge AI, robotics và đào tạo lập trình AI.",
      "Trương Tấn Nghĩa works across the whole of AI, from machine-learning models to robots running in the real world: AI agents, chatbots, computer vision, Edge AI, robotics and AI programming courses.",
    ]),
    alternates: { canonical: "https://www.aihoclaptrinh.com/" },
  };
}

export async function pageMetadata(key: PageKey): Promise<Metadata> {
  const lang = await langOf();
  const p = pageOf(key);
  return {
    title: `${tx(lang, p.title)} — ${BRAND}`,
    description: tx(lang, p.lead),
    alternates: { canonical: `https://www.aihoclaptrinh.com/${key}` },
  };
}
