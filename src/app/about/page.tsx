import "./about.css";
import "./about-shell.css";

import { cookies, headers } from "next/headers";

import { AboutRoot } from "@/components/about/interactive/AboutRoot";
import LangToggle from "@/components/about/LangToggle";
import type { AbtLang } from "@/components/about/i18n-about";
import AboutHero from "@/components/about/AboutHero";
import AboutNav from "@/components/about/AboutNav";
import AboutSkills from "@/components/about/AboutSkills";
import AboutProjects from "@/components/about/AboutProjects";
import AboutSolutions from "@/components/about/AboutSolutions";
import AboutProcess from "@/components/about/AboutProcess";
import AboutJourney from "@/components/about/AboutJourney";
import AboutCourses from "@/components/about/AboutCourses";
import AboutTopics from "@/components/about/AboutTopics";
import AboutQuotes from "@/components/about/AboutQuotes";
import AboutContact from "@/components/about/AboutContact";

/* Trùng với PUBLIC_HOSTS trong src/middleware.ts và src/app/layout.tsx. */
const PUBLIC_HOSTS = new Set(["aihoclaptrinh.com", "www.aihoclaptrinh.com"]);

/* Trang Giới thiệu v4 "Neural Studio" — dựng theo MCP aihoclaptrinh-design.
   Chủ đề tối đi theo .dark trên <html> của app (about.css đã map sẵn),
   nên không truyền prop dark cho AboutRoot.

   Ngôn ngữ đọc từ cookie "aihlt-lang" để trang vẫn là server component
   (giữ SSR, tốt cho SEO). Trong app quản trị, nút VI/EN ở thanh trên cùng
   ghi cookie này; ngoài trang công khai thì dùng nút LangToggle bên dưới. */
export default async function AboutPage() {
  const [ck, hd] = await Promise.all([cookies(), headers()]);
  const lang: AbtLang = ck.get("aihlt-lang")?.value === "en" ? "en" : "vi";
  const host = (hd.get("host") ?? "").toLowerCase().split(":")[0];
  const publicSite = PUBLIC_HOSTS.has(host);

  return (
    <div className="abt-shell-reset">
      <AboutRoot>
        {/* Trang công khai không có thanh trên cùng nên cần nút đổi ngôn ngữ riêng */}
        {publicSite && <LangToggle lang={lang} />}
        <AboutHero lang={lang} />
        <AboutNav lang={lang} />
        <AboutSkills lang={lang} />
        <AboutProjects lang={lang} />
        <AboutSolutions lang={lang} />
        <AboutProcess lang={lang} />
        <AboutJourney lang={lang} />
        <AboutCourses lang={lang} />
        <AboutTopics lang={lang} />
        <AboutQuotes lang={lang} />
        <AboutContact lang={lang} />
      </AboutRoot>
    </div>
  );
}
