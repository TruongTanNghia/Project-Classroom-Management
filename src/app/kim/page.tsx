import { kimEnv, type KimPageProps } from "./env";

import KimShell from "@/components/kim/KimShell";
import { KimExplore } from "@/components/kim/KimPageHero";
import KimHero from "@/components/kim/gen/KimHero";

/* Trang chủ của aihoclaptrinh.com — bản thiết kế "Giới thiệu v6 · Xưởng Kim".

   Từ 18/11/2026 trang công khai chia thành nhiều trang (anh Nghĩa dặn), xem
   src/lib/public-sections.ts. Trang chủ giữ phần mở đầu của thiết kế (chân dung, viên kim
   cương, số liệu) và một lưới dẫn sang từng trang. Chân trang (khối Liên hệ) ở KimShell.

   Chỉ tên miền công khai mới tới được đây: middleware đổi "/" thành "/kim" ở đó, còn trong
   khu quản trị thì "/kim" bị đẩy về trang Giới thiệu bản cũ. Hai bản không dùng chung dòng CSS
   nào (bản này tiền tố kim-, bản cũ abt-). */
export default async function KimHomePage({ searchParams }: KimPageProps) {
  const { lang, dark, jewel } = await kimEnv(searchParams);
  return (
    <KimShell lang={lang} dark={dark} jewel={jewel} current={null}>
      <KimHero lang={lang} />
      <KimExplore lang={lang} />
    </KimShell>
  );
}
