/* Các trang của trang công khai (aihoclaptrinh.com).

   Từ 18/11/2026 trang công khai không còn là một trang dài (landing page) mà chia thành
   nhiều trang, mỗi đầu mục một trang (anh Nghĩa dặn):
     /           trang chủ
     /path       lộ trình 8 mảng AI          /roadmap    roadmap AI Engineer
     /projects   dự án                       /solutions  giải pháp
     /process    cách làm việc               /courses    khoá học
     /journey    hành trình                  /quotes     cảm nhận
     /contact    liên hệ (khối này còn là chân trang của mọi trang)
   và hai kiểu địa chỉ con:
     /courses/<khoá>    mở thẳng nội dung từng buổi của một khoá, vd /courses/hoc-may
     /roadmap/<ô>       mở thẳng chi tiết một ô của roadmap, vd /roadmap/ml

   File này là nguồn duy nhất của danh sách đó, dùng ở:
     - src/middleware.ts: trên tên miền công khai, "/projects" hiện trang nội bộ /kim/projects (rewrite)
     - src/components/kim/site.ts: tên, thứ tự, mô tả của từng trang
     - KimRouter, KimSyllabus, KimRoadmap: đọc địa chỉ hiện tại
   Không import gì ở đây: middleware chạy ở biên, gói càng nhỏ càng tốt.

   Trùng tên với đường dẫn của khu quản trị (như /courses) không sao: hai khu chia nhau theo
   tên miền, không bao giờ gặp nhau. */

export const PUBLIC_SECTIONS = ["path", "roadmap", "projects", "solutions", "process", "courses", "journey", "quotes", "contact"] as const;
export type PublicSection = (typeof PUBLIC_SECTIONS)[number];

export type PublicTarget = { section: PublicSection; course?: string; node?: string };

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** "/path" → {section:"path"}; "/courses/hoc-may" → {…, course}; "/roadmap/ml" → {…, node}; còn lại → null */
export function parsePublicPath(pathname: string): PublicTarget | null {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0 || parts.length > 2) return null;
  const section = parts[0] as PublicSection;
  if (!PUBLIC_SECTIONS.includes(section)) return null;
  if (parts.length === 1) return { section };
  if (section === "courses" && SLUG.test(parts[1])) return { section, course: parts[1] };
  if (section === "roadmap" && SLUG.test(parts[1])) return { section, node: parts[1] };
  return null;
}

export const sectionPath = (section: PublicSection) => "/" + section;
export const coursePath = (slug: string) => "/courses/" + slug;
export const roadmapPath = (id: string) => "/roadmap/" + id.toLowerCase();

/** Địa chỉ kiểu cũ (đã lỡ gửi đi): "#kim-path" → "/path", "#khoa-hoc-may" → "/courses/hoc-may" */
export function legacyHashToPath(hash: string): string | null {
  const section = /^#kim-([a-z]+)$/.exec(hash)?.[1] as PublicSection | undefined;
  if (section && PUBLIC_SECTIONS.includes(section)) return sectionPath(section);
  const course = /^#khoa-([a-z0-9-]+)$/.exec(hash)?.[1];
  if (course && SLUG.test(course)) return coursePath(course);
  return null;
}
