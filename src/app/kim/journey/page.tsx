import { kimEnv, type KimPageProps } from "../env";
import { pageMetadata } from "../page-meta";

import KimShell from "@/components/kim/KimShell";
import { KimNextPage, KimPageHero } from "@/components/kim/KimPageHero";
import KimJourney from "@/components/kim/gen/KimJourney";

/* Trang Hành trình (/journey): phần mở đầu của trang, nội dung của khối, rồi "Trang tiếp theo".
   Chân trang (khối Liên hệ) nằm trong KimShell, trang nào cũng có. */
export const generateMetadata = () => pageMetadata("journey");

export default async function KimJourneyPage({ searchParams }: KimPageProps) {
  const { lang, dark, jewel } = await kimEnv(searchParams);
  return (
    <KimShell lang={lang} dark={dark} jewel={jewel} current="journey">
      <KimPageHero lang={lang} page="journey" />
      <KimJourney lang={lang} />
      <KimNextPage lang={lang} page="journey" />
    </KimShell>
  );
}
