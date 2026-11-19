import { kimEnv, type KimPageProps } from "../env";
import { pageMetadata } from "../page-meta";

import KimShell from "@/components/kim/KimShell";
import { KimNextPage, KimPageHero } from "@/components/kim/KimPageHero";
import { COURSES, countExercises, countSessions } from "@/components/kim/courses-data";
import KimCourses from "@/components/kim/gen/KimCourses";

/* Trang Khoá học (/courses, và /courses/<khoá> mở thẳng nội dung từng buổi của khoá đó).
   Ba con số ở đầu trang tính từ courses-data.ts, khớp đúng với các thẻ khoá bên dưới. */
export const generateMetadata = () => pageMetadata("courses");

export default async function KimCoursesPage({ searchParams }: KimPageProps) {
  const { lang, dark, jewel } = await kimEnv(searchParams);
  const sessions = COURSES.reduce((n, c) => n + countSessions(c), 0);
  const exercises = COURSES.reduce((n, c) => n + countExercises(c), 0);
  return (
    <KimShell lang={lang} dark={dark} jewel={jewel} current="courses">
      <KimPageHero
        lang={lang}
        page="courses"
        stats={[
          [String(COURSES.length), ["khoá học", "courses"]],
          [String(sessions), ["buổi học", "sessions"]],
          [String(exercises), ["bài tập thực hành", "hands-on exercises"]],
        ]}
      />
      <KimCourses lang={lang} />
      <KimNextPage lang={lang} page="courses" />
    </KimShell>
  );
}
