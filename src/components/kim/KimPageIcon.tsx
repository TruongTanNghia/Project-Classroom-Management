import type { PageKey } from "./site";

/* Huy hiệu của từng trang: cùng bộ nét với các huy hiệu sẵn có của thiết kế (khung 64,
   lớp .s bóng bạc, .p mặt giấy, .l nét mực, .bl khối đồng thau…, định nghĩa ở kim.css
   mục "Biểu tượng tự vẽ"), để trang mới trông như cùng một bộ với trang cũ. */

const ICONS: Record<PageKey | "home", React.ReactNode> = {
  // viên kim cương
  home: (
    <>
      <path className="s" transform="translate(2.5 2.5)" d="M14 22 22 12h20l8 10-18 30z" />
      <path className="p" d="M14 22 22 12h20l8 10-18 30z" />
      <path className="l" d="M14 22h36M22 12l6 10 4-10 4 10 6-10M28 22l4 30 4-30" />
      <path className="bl" d="M28 22h8l-4 14z" />
    </>
  ),
  // ba bậc thang đi lên, có đường đi chấm vàng
  path: (
    <>
      <rect className="s" x="12.5" y="38.5" width="14" height="16" rx="2" />
      <rect className="p" x="10" y="36" width="14" height="16" rx="2" />
      <rect className="s" x="27.5" y="28.5" width="14" height="26" rx="2" />
      <rect className="p" x="25" y="26" width="14" height="26" rx="2" />
      <rect className="bl" x="40" y="14" width="14" height="38" rx="2" />
      <path className="pb" d="M17 30 C 22 22, 28 20, 32 20 S 42 10, 47 8" />
      <path className="l" d="M8 56h48" />
    </>
  ),
  // bản đồ ô lưới có đường đi và lá cờ đích
  roadmap: (
    <>
      <rect className="s" x="12.5" y="12.5" width="40" height="40" rx="4" />
      <rect className="p" x="10" y="10" width="40" height="40" rx="4" />
      <path className="g" d="M23.3 10V50M36.6 10V50M10 23.3H50M10 36.6H50" />
      <path className="pb" d="M16 44H30V30H43V18" />
      <circle className="bl" cx="16" cy="44" r="4.2" />
      <path className="l" d="M43 18V6.5l7.5 3-7.5 3" />
      <rect className="l" x="10" y="10" width="40" height="40" rx="4" />
    </>
  ),
  // hai cửa sổ ứng dụng chồng lên nhau
  projects: (
    <>
      <rect className="s" x="20.5" y="10.5" width="36" height="28" rx="4" />
      <rect className="sl" x="18" y="8" width="36" height="28" rx="4" />
      <rect className="s" x="10.5" y="26.5" width="36" height="28" rx="4" />
      <rect className="p" x="8" y="24" width="36" height="28" rx="4" />
      <path className="l" d="M8 31h36" />
      <circle className="k" cx="12.5" cy="27.5" r="1.3" />
      <circle className="k" cx="16.5" cy="27.5" r="1.3" />
      <rect className="bl" x="13" y="36" width="12" height="10" rx="2" />
      <path className="l" d="M29 38h10M29 43h7" />
    </>
  ),
  // bánh răng và bong bóng hội thoại
  solutions: (
    <>
      <circle className="gear" cx="24" cy="38" r="13" />
      <circle className="p" cx="24" cy="38" r="9.5" />
      <circle className="bl" cx="24" cy="38" r="4" />
      <path className="s" transform="translate(2.5 2.5)" d="M32 8h20a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4h-9l-7 6v-6h-4a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4z" />
      <path className="p" d="M32 8h20a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4h-9l-7 6v-6h-4a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4z" />
      <path className="l" d="M34 15h16M34 21h10" />
    </>
  ),
  // ba nút nối nhau thành quy trình
  process: (
    <>
      <path className="d" d="M17 32h30" />
      <circle className="s" cx="13.5" cy="34.5" r="8" />
      <circle className="p" cx="11" cy="32" r="8" />
      <circle className="s" cx="34.5" cy="34.5" r="8" />
      <circle className="p" cx="32" cy="32" r="8" />
      <circle className="bl" cx="53" cy="32" r="8" />
      <path className="l" d="M7.5 32l2.5 2.5 4.5-5M29 29.5h6M29 34.5h4M50 32l2 2 4-4" />
    </>
  ),
  // quyển sách mở
  courses: (
    <>
      <path className="s" transform="translate(2.5 2.5)" d="M8 16c8-3 16-3 24 2 8-5 16-5 24-2v32c-8-3-16-3-24 2-8-5-16-5-24-2z" />
      <path className="p" d="M8 16c8-3 16-3 24 2 8-5 16-5 24-2v32c-8-3-16-3-24 2-8-5-16-5-24-2z" />
      <path className="l" d="M32 18v32M14 25c5-1.5 9-1.5 13 1M14 32c5-1.5 9-1.5 13 1M37 26c4-2.5 8-2.5 13-1" />
      <path className="bl" d="M40 30h8v16l-4-3-4 3z" />
    </>
  ),
  // viên đá mài dần thành kim cương
  journey: (
    <>
      <path className="sl" d="M8 40l5-9 8 2 2 9-8 5z" />
      <path className="s" transform="translate(2.5 2.5)" d="M30 26l6-7h10l6 7-11 20z" />
      <path className="p" d="M30 26l6-7h10l6 7-11 20z" />
      <path className="l" d="M30 26h22M36 19l3 7 2-7 2 7 3-7M39 26l2 20 2-20" />
      <path className="pb" d="M22 38c3-4 5-6 8-8" />
      <path className="hb" d="M52 8v6M49 11h6" />
    </>
  ),
  // bong bóng lời nói có dấu ngoặc kép
  quotes: (
    <>
      <path className="s" transform="translate(2.5 2.5)" d="M12 10h40a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H30l-10 9v-9h-8a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4z" />
      <path className="p" d="M12 10h40a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H30l-10 9v-9h-8a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4z" />
      <path className="bl" d="M18 20h9v8l-4 7h-4l3-6h-4zM34 20h9v8l-4 7h-4l3-6h-4z" />
    </>
  ),
  // phong bì có tem vàng
  contact: (
    <>
      <rect className="s" x="10.5" y="18.5" width="46" height="34" rx="4" />
      <rect className="p" x="8" y="16" width="46" height="34" rx="4" />
      <path className="l" d="M8 20l23 17 23-17" />
      <rect className="bl" x="42" y="8" width="14" height="14" rx="2" />
      <path className="l" d="M46 15h6M49 12v6" />
    </>
  ),
};

export default function KimPageIcon({ k, className = "kim-ico" }: { k: PageKey | "home"; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      {ICONS[k]}
    </svg>
  );
}
