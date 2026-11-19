import { cookies } from "next/headers";

import type { KimLang } from "@/components/kim/i18n-kim";

/* Ngôn ngữ, sáng/tối, có bật lớp kim cương hay không: mọi trang công khai đọc cùng một cách.
   Ngôn ngữ và giao diện lưu bằng cookie (KimControls ghi) để máy chủ dựng đúng ngay từ đầu.
   ?plain=1 tắt lớp kim cương, trang về đúng nguyên bản thiết kế: dùng khi đo đối chiếu. */
export type KimEnv = { lang: KimLang; dark: boolean; jewel: boolean };

export async function kimEnv(searchParams?: Promise<{ plain?: string }>): Promise<KimEnv> {
  const [ck, sp] = await Promise.all([cookies(), searchParams ?? Promise.resolve({} as { plain?: string })]);
  return {
    lang: ck.get("aihlt-lang")?.value === "en" ? "en" : "vi",
    dark: ck.get("aihlt-kim-theme")?.value === "dark",
    jewel: sp.plain !== "1",
  };
}

export type KimPageProps = { searchParams: Promise<{ plain?: string }> };
