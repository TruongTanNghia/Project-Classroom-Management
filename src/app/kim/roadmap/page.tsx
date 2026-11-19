import { kimEnv, type KimPageProps } from "../env";
import { pageMetadata } from "../page-meta";

import KimShell from "@/components/kim/KimShell";
import { KimNextPage, KimPageHero } from "@/components/kim/KimPageHero";
import KimRoadmap from "@/components/kim/KimRoadmap";

/* Trang Roadmap AI Engineer (/roadmap, và /roadmap/<ô> mở thẳng chi tiết một ô).
   Nội dung lấy từ bản roadmap anh Nghĩa đưa (UI/AI_ENGINEER_ROADMAP_CODER_XUAT_NGU.html),
   dựng lại theo phong cách Xưởng Kim: xem KimRoadmap.tsx và roadmap-data.ts. */
export const generateMetadata = () => pageMetadata("roadmap");

export default async function KimRoadmapPage({ searchParams }: KimPageProps) {
  const { lang, dark, jewel } = await kimEnv(searchParams);
  return (
    <KimShell lang={lang} dark={dark} jewel={jewel} current="roadmap">
      <KimPageHero lang={lang} page="roadmap" />
      <KimRoadmap lang={lang} />
      <KimNextPage lang={lang} page="roadmap" />
    </KimShell>
  );
}
