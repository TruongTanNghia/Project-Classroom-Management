import "./kim.css";
import "./kim-shell.css";
import "./kim-courses.css";
import "./kim-journey.css";
import "./kim-organ-scan.css";
import "./kim-diamond.css";

import { cookies } from "next/headers";

import KimControls from "@/components/kim/KimControls";
import KimFx from "@/components/kim/KimFx";
import KimProjects from "@/components/kim/KimProjects";
import type { KimLang } from "@/components/kim/i18n-kim";
import KimContact from "@/components/kim/gen/KimContact";
import KimCourses from "@/components/kim/gen/KimCourses";
import KimHero from "@/components/kim/gen/KimHero";
import KimJourney from "@/components/kim/gen/KimJourney";
import KimNav from "@/components/kim/gen/KimNav";
import KimPath from "@/components/kim/gen/KimPath";
import KimProcess from "@/components/kim/gen/KimProcess";
import KimQuotes from "@/components/kim/gen/KimQuotes";
import KimSolutions from "@/components/kim/gen/KimSolutions";

/* Trang công khai của aihoclaptrinh.com — bản thiết kế "Giới thiệu v6 · Xưởng Kim".

   Chỉ tên miền công khai mới tới được đây: middleware đổi "/" thành "/kim" ở đó,
   còn trong khu quản trị thì "/kim" bị đẩy về trang Giới thiệu bản cũ. Hai bản
   không dùng chung dòng CSS nào (bản này tiền tố kim-, bản cũ abt-).

   Ngôn ngữ và giao diện sáng/tối đọc từ cookie để dựng sẵn trên máy chủ. */
export default async function KimPage({ searchParams }: { searchParams: Promise<{ plain?: string }> }) {
  const [ck, sp] = await Promise.all([cookies(), searchParams]);
  const lang: KimLang = ck.get("aihlt-lang")?.value === "en" ? "en" : "vi";
  const dark = ck.get("aihlt-kim-theme")?.value === "dark";
  // ?plain=1: tắt lớp kim cương, còn lại đúng nguyên bản thiết kế — để đo đối chiếu
  const jewel = sp.plain !== "1";

  return (
    <div id="kim-canvas" className={"kim-canvas" + (dark ? " dark" : "") + (jewel ? " kim-jewel" : "")} lang={lang}>
      <KimControls lang={lang} dark={dark} />
      <main className="kim-root">
        <KimHero lang={lang} />
        <KimNav lang={lang} />
        <KimPath lang={lang} />
        <KimProjects lang={lang} />
        <KimSolutions lang={lang} />
        <KimProcess lang={lang} />
        <KimCourses lang={lang} />
        <KimJourney lang={lang} />
        <KimQuotes lang={lang} />
        <KimContact lang={lang} />
      </main>
      {jewel && <KimFx />}
    </div>
  );
}
