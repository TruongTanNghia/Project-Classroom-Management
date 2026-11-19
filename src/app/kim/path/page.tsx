import { kimEnv, type KimPageProps } from "../env";
import { pageMetadata } from "../page-meta";

import KimShell from "@/components/kim/KimShell";
import { KimNextPage, KimPageHero } from "@/components/kim/KimPageHero";
import KimPath from "@/components/kim/gen/KimPath";

/* Trang Lộ trình 8 mảng AI (/path): phần mở đầu của trang, nội dung của khối, rồi "Trang tiếp theo".
   Chân trang (khối Liên hệ) nằm trong KimShell, trang nào cũng có. */
export const generateMetadata = () => pageMetadata("path");

export default async function KimPathPage({ searchParams }: KimPageProps) {
  const { lang, dark, jewel } = await kimEnv(searchParams);
  return (
    <KimShell lang={lang} dark={dark} jewel={jewel} current="path">
      <KimPageHero lang={lang} page="path" />
      <KimPath lang={lang} />
      <KimNextPage lang={lang} page="path" />
    </KimShell>
  );
}
