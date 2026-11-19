import { kimEnv, type KimPageProps } from "../env";
import { pageMetadata } from "../page-meta";

import KimShell from "@/components/kim/KimShell";
import { KimNextPage, KimPageHero } from "@/components/kim/KimPageHero";
import KimProcess from "@/components/kim/gen/KimProcess";

/* Trang Cách làm việc (/process): phần mở đầu của trang, nội dung của khối, rồi "Trang tiếp theo".
   Chân trang (khối Liên hệ) nằm trong KimShell, trang nào cũng có. */
export const generateMetadata = () => pageMetadata("process");

export default async function KimProcessPage({ searchParams }: KimPageProps) {
  const { lang, dark, jewel } = await kimEnv(searchParams);
  return (
    <KimShell lang={lang} dark={dark} jewel={jewel} current="process">
      <KimPageHero lang={lang} page="process" />
      <KimProcess lang={lang} />
      <KimNextPage lang={lang} page="process" />
    </KimShell>
  );
}
