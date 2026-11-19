import { kimEnv, type KimPageProps } from "../env";
import { pageMetadata } from "../page-meta";

import KimShell from "@/components/kim/KimShell";
import { KimNextPage, KimPageHero } from "@/components/kim/KimPageHero";
import KimSolutions from "@/components/kim/gen/KimSolutions";

/* Trang Giải pháp (/solutions): phần mở đầu của trang, nội dung của khối, rồi "Trang tiếp theo".
   Chân trang (khối Liên hệ) nằm trong KimShell, trang nào cũng có. */
export const generateMetadata = () => pageMetadata("solutions");

export default async function KimSolutionsPage({ searchParams }: KimPageProps) {
  const { lang, dark, jewel } = await kimEnv(searchParams);
  return (
    <KimShell lang={lang} dark={dark} jewel={jewel} current="solutions">
      <KimPageHero lang={lang} page="solutions" />
      <KimSolutions lang={lang} />
      <KimNextPage lang={lang} page="solutions" />
    </KimShell>
  );
}
