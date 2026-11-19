import { kimEnv, type KimPageProps } from "../env";
import { pageMetadata } from "../page-meta";

import KimShell from "@/components/kim/KimShell";
import { KimNextPage, KimPageHero } from "@/components/kim/KimPageHero";
import KimQuotes from "@/components/kim/gen/KimQuotes";

/* Trang Cảm nhận (/quotes): phần mở đầu của trang, nội dung của khối, rồi "Trang tiếp theo".
   Chân trang (khối Liên hệ) nằm trong KimShell, trang nào cũng có. */
export const generateMetadata = () => pageMetadata("quotes");

export default async function KimQuotesPage({ searchParams }: KimPageProps) {
  const { lang, dark, jewel } = await kimEnv(searchParams);
  return (
    <KimShell lang={lang} dark={dark} jewel={jewel} current="quotes">
      <KimPageHero lang={lang} page="quotes" />
      <KimQuotes lang={lang} />
      <KimNextPage lang={lang} page="quotes" />
    </KimShell>
  );
}
