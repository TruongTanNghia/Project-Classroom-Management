import { kimEnv, type KimPageProps } from "../env";
import { pageMetadata } from "../page-meta";

import KimShell from "@/components/kim/KimShell";
import { KimNextPage, KimPageHero } from "@/components/kim/KimPageHero";
import KimProjects from "@/components/kim/KimProjects";

/* Trang Dự án (/projects): phần mở đầu của trang, nội dung của khối, rồi "Trang tiếp theo".
   Chân trang (khối Liên hệ) nằm trong KimShell, trang nào cũng có. */
export const generateMetadata = () => pageMetadata("projects");

export default async function KimProjectsPage({ searchParams }: KimPageProps) {
  const { lang, dark, jewel } = await kimEnv(searchParams);
  return (
    <KimShell lang={lang} dark={dark} jewel={jewel} current="projects">
      <KimPageHero lang={lang} page="projects" />
      <KimProjects lang={lang} />
      <KimNextPage lang={lang} page="projects" />
    </KimShell>
  );
}
