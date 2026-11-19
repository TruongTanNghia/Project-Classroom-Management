import type { L } from "./i18n-kim";
import type { PublicSection } from "@/lib/public-sections";

/* Tên, thứ tự và phần mở đầu của từng trang trên trang công khai.

   Thứ tự ở đây là thứ tự trên thanh mục lục, trong menu điện thoại, ở lưới "Khám phá" của
   trang chủ, và là thứ tự "Trang tiếp theo" cuối mỗi trang. Địa chỉ của trang: /<key>.

   Con số trong `stats` phải là số có thật trên chính trang đó (đếm từ nội dung), không đặt
   số cho đẹp. Số khoá học, số buổi, số bài tập của trang Khoá học tính thẳng từ courses-data.ts
   lúc dựng trang (xem app/kim/courses/page.tsx), không gõ tay ở đây. */

export type PageKey = PublicSection;
export type PageStat = readonly [value: string, label: L];
export type PageMeta = {
  key: PageKey;
  /** chữ trên thanh mục lục */
  nav: L;
  /** tiêu đề lớn ở đầu trang */
  title: L;
  lead: L;
  stats?: readonly PageStat[];
};

export const PAGES: readonly PageMeta[] = [
  {
    key: "path",
    nav: ["Lộ trình", "Learning path"],
    title: ["Lộ trình", "Learning path"],
    lead: [
      "Tám mảng AI học theo đúng thứ tự: vững nền tảng trước, rồi đi sâu, rồi đưa AI ra đời thực.",
      "Eight areas of AI in the right order: solid foundations first, then depth, then AI out in the real world.",
    ],
    stats: [
      ["8", ["mảng AI", "areas of AI"]],
      ["3", ["chặng học", "stages"]],
    ],
  },
  {
    key: "roadmap",
    nav: ["Roadmap", "Roadmap"],
    title: ["Roadmap AI Engineer", "AI Engineer roadmap"],
    lead: [
      "Bản đồ từ con số 0 tới AI Engineer. Bấm vào từng ô để xem cần học gì, học xong thì đánh dấu.",
      "A map from zero to AI Engineer. Open any tile to see what to learn, and tick it off when you are done.",
    ],
    stats: [
      ["18", ["tháng", "months"]],
      ["29", ["ô kỹ năng", "skills"]],
      ["7", ["dự án", "projects"]],
    ],
  },
  {
    key: "projects",
    nav: ["Dự án", "Projects"],
    title: ["Dự án", "Projects"],
    lead: [
      "Những hệ thống tôi đã và đang xây: quản lý lớp học, camera thông minh, trợ lý số, giám sát máy CNC, quét 3D tìm khối u, robot.",
      "Systems I have built and am building: class management, smart cameras, digital assistants, CNC monitoring, 3D tumour scanning, robots.",
    ],
    stats: [
      ["7", ["dự án tiêu biểu", "featured projects"]],
      ["120+", ["dự án đã thực hiện", "projects delivered"]],
    ],
  },
  {
    key: "solutions",
    nav: ["Giải pháp", "Solutions"],
    title: ["Giải pháp", "Solutions"],
    lead: [
      "Giải pháp AI trọn gói cho doanh nghiệp, tuỳ chỉnh theo đúng quy trình riêng của bạn.",
      "End-to-end AI solutions for businesses, tailored to the way you actually work.",
    ],
    stats: [["4", ["giải pháp", "solutions"]]],
  },
  {
    key: "process",
    nav: ["Cách làm việc", "How I work"],
    title: ["Cách làm việc", "How I work"],
    lead: [
      "Nghe kỹ bài toán trước, xây giải pháp vừa đúng nhu cầu, rồi ở lại đồng hành khi hệ thống đã chạy.",
      "Hear the problem out first, build what it actually needs, then stay alongside once the system is running.",
    ],
    stats: [["3", ["bước", "steps"]]],
  },
  {
    key: "courses",
    nav: ["Khoá học", "Courses"],
    title: ["Khoá học", "Courses"],
    lead: [
      "Mỗi bước của lộ trình là một khoá. Buổi nào cũng có thực hành, học phí tính theo buổi.",
      "Each step of the learning path is a course. Every session includes hands-on work; tuition is charged per session.",
    ],
  },
  {
    key: "journey",
    nav: ["Hành trình", "Journey"],
    title: ["Hành trình", "Journey"],
    lead: [
      "Từ dòng code đầu tiên năm 2022, qua hai năm quân ngũ, tới hôm nay: AI ở mọi tầng.",
      "From the first line of code in 2022, through two years of military service, to today: AI at every layer.",
    ],
    stats: [
      ["2022", ["năm bắt đầu", "the start"]],
      ["3,5", ["năm kinh nghiệm", "years of experience"]],
    ],
  },
  {
    key: "quotes",
    nav: ["Cảm nhận", "Testimonials"],
    title: ["Cảm nhận", "Testimonials"],
    lead: [
      "Điều học viên và khách hàng nhắc tới nhiều nhất: dễ hiểu, tận tình, có góc nhìn thực tế.",
      "What students and clients mention most: clear, devoted, and grounded in real practice.",
    ],
  },
  {
    key: "contact",
    nav: ["Liên hệ", "Contact"],
    title: ["Liên hệ", "Contact"],
    lead: [
      "Có bài toán muốn đưa AI vào, hay muốn học AI cho bài bản? Nhắn một câu qua Zalo hoặc email, mình bắt đầu.",
      "A problem you want to bring AI to, or want to learn AI properly? Send a message on Zalo or by email and we will get started.",
    ],
  },
];

export const HOME_NAV: L = ["Trang chủ", "Home"];
export const pageOf = (key: PageKey) => PAGES.find((p) => p.key === key)!;
export const pageNo = (key: PageKey) => PAGES.findIndex((p) => p.key === key) + 1;
/** trang kế tiếp, vòng lại trang đầu sau trang cuối */
export const nextPageOf = (key: PageKey) => PAGES[pageNo(key) % PAGES.length];
export const pad2 = (n: number) => String(n).padStart(2, "0");
