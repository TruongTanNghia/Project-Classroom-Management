/* Địa chỉ các khối của trang công khai (aihoclaptrinh.com).

   Trang công khai chỉ có MỘT trang, nhưng mỗi khối có địa chỉ riêng dạng đường dẫn thật:
     /path  /projects  /solutions  /process  /courses  /journey  /quotes  /contact
     /courses/<khoá>   mở thẳng nội dung từng buổi của một khoá, vd /courses/hoc-may
   thay cho kiểu cũ /#kim-path và /#khoa-hoc-may (anh Nghĩa dặn bỏ chữ "#kim" khỏi địa chỉ).

   File này là nguồn duy nhất của danh sách đó, dùng ở cả hai phía:
     - src/middleware.ts: trên tên miền công khai, các đường dẫn này hiện cùng trang "/" (rewrite)
     - src/components/kim/KimRouter.tsx: cuộn tới đúng khối, đổi địa chỉ khi bấm mục lục
   Không import gì ở đây: middleware chạy ở biên, gói càng nhỏ càng tốt.

   Tên khối là phần sau "kim-" của id phần tử (id="kim-path" ↔ /path). Thêm khối mới vào trang thì
   thêm tên nó vào đây. Trùng tên với đường dẫn của khu quản trị (như /courses) không sao: hai
   khu chia nhau theo tên miền, không bao giờ gặp nhau. */

export const PUBLIC_SECTIONS = ["path", "projects", "solutions", "process", "courses", "journey", "quotes", "contact"] as const;
export type PublicSection = (typeof PUBLIC_SECTIONS)[number];

export type PublicTarget = { section: PublicSection; course?: string };

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** "/path" → {section:"path"}; "/courses/hoc-may" → {section:"courses", course:"hoc-may"}; còn lại → null */
export function parsePublicPath(pathname: string): PublicTarget | null {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0 || parts.length > 2) return null;
  const section = parts[0] as PublicSection;
  if (!PUBLIC_SECTIONS.includes(section)) return null;
  if (parts.length === 1) return { section };
  if (section === "courses" && SLUG.test(parts[1])) return { section, course: parts[1] };
  return null;
}

export const sectionPath = (section: PublicSection) => "/" + section;
export const coursePath = (slug: string) => "/courses/" + slug;

/** Địa chỉ kiểu cũ (đã lỡ gửi đi): "#kim-path" → "/path", "#khoa-hoc-may" → "/courses/hoc-may" */
export function legacyHashToPath(hash: string): string | null {
  const section = /^#kim-([a-z]+)$/.exec(hash)?.[1] as PublicSection | undefined;
  if (section && PUBLIC_SECTIONS.includes(section)) return sectionPath(section);
  const course = /^#khoa-([a-z0-9-]+)$/.exec(hash)?.[1];
  if (course && SLUG.test(course)) return coursePath(course);
  return null;
}
