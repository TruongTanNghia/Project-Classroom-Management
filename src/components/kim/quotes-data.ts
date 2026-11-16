import type { L } from "./i18n-kim";

/* Nội dung khối "Học viên và khách hàng nói gì".

   ⚠ MỌI LỜI NHẬN XÉT DƯỚI ĐÂY LÀ VÍ DỤ MINH HOẠ, do Claude viết theo ba ý anh Nghĩa cho biết
   học viên hay nói nhất (dạy dễ hiểu, tận tình, có góc nhìn thực tế). Chúng KHÔNG phải lời của
   người thật, tên cũng là tên đặt. Vì vậy mỗi thẻ mang nhãn "Minh hoạ" và đầu khối có ghi rõ.

   Không được bỏ nhãn đó khỏi một lời nhận xét bịa: đăng nhận xét bịa như thật là lừa người xem
   và là quảng cáo sai sự thật. Khi anh Nghĩa đưa nhận xét THẬT (tin nhắn Zalo, email… kèm tên
   và việc người đó cho phép đăng), thêm vào đây với `real: true`: thẻ đó sẽ không còn nhãn
   "Minh hoạ". Khi mọi thẻ đều là thật thì sửa luôn câu dẫn của khối (OVERRIDES trong
   kim-convert.py). */

export type Quote = {
  who: L;
  role: L;
  /** chữ cái và màu của hình đại diện (màu trong bảng mệnh Kim: vàng, thép, nâu đất) */
  initial: string;
  av: string;
  /** câu nhận xét chia ba khúc: trước, khúc được tô nổi, sau */
  text: readonly [L, L, L];
  /** true = lời thật của người thật, đã được phép đăng. Mặc định là ví dụ minh hoạ. */
  real?: boolean;
};

/** Ba ý anh Nghĩa cho biết học viên và khách hàng nhắc tới nhiều nhất (anh nói ngày 16/11/2026). */
export const PILLARS: readonly { name: L; desc: L }[] = [
  {
    name: ["Dễ hiểu", "Clear"],
    desc: ["Khái niệm khó được gỡ ra từng bước, học xong tự làm lại được.", "Hard ideas taken apart step by step, so you can redo them on your own."],
  },
  {
    name: ["Tận tình", "Devoted"],
    desc: ["Kèm sát từng người, chưa hiểu thì giảng lại theo cách khác.", "Close attention to each learner; if it has not clicked, it is explained another way."],
  },
  {
    name: ["Thực tế", "Practical"],
    desc: ["Bài nào cũng gắn với bài toán thật, qua góc nhìn của người đang làm nghề.", "Every lesson tied to a real problem, seen through the eyes of someone doing the work."],
  },
];

export const QUOTES: readonly Quote[] = [
  {
    who: ["Chị Lan", "Lan"],
    role: ["Chủ trung tâm", "Centre owner"],
    initial: "L",
    av: "#8A6418",
    text: [
      ["Thầy Nghĩa ", "Mr Nghĩa "],
      ["dạy dễ hiểu, làm được ngay", "teaches clearly, and you can use it straight away"],
      [". Automation giúp trung tâm em tiết kiệm hàng giờ mỗi ngày.", ". Automation saves our centre hours every day."],
    ],
  },
  {
    who: ["Bạn Khoa", "Khoa"],
    role: ["Học viên Học máy", "Machine learning student"],
    initial: "K",
    av: "#5A626D",
    text: [
      ["Phần toán em từng sợ nhất. Thầy ", "The maths was what I feared most. He "],
      ["gỡ ra từng bước", "took it apart step by step"],
      [", tự nhiên thấy nó không khó như mình nghĩ.", ", and suddenly it was not as hard as I had thought."],
    ],
  },
  {
    who: ["Anh Tuấn", "Tuan"],
    role: ["Kỹ sư phần mềm", "Software engineer"],
    initial: "T",
    av: "#6B4F33",
    text: [
      ["Thầy không dạy theo sách. ", "He does not teach from the book. "],
      ["Bài nào cũng gắn với bài toán thật", "Every lesson is tied to a real problem"],
      [", nên học xong biết ngay dùng vào đâu.", ", so you know at once where to use it."],
    ],
  },
  {
    who: ["Bạn Vy", "Vy"],
    role: ["Học viên Học sâu", "Deep learning student"],
    initial: "V",
    av: "#A9802C",
    text: [
      ["Hỏi lúc nào thầy cũng trả lời. Chưa hiểu thì thầy ", "He answers whenever I ask. If I do not get it, he "],
      ["giảng lại theo cách khác", "explains it again another way"],
      [", tới khi em hiểu mới thôi.", ", until I do."],
    ],
  },
  {
    who: ["Anh Minh", "Minh"],
    role: ["Chủ shop online", "Online shop owner"],
    initial: "M",
    av: "#3D444B",
    text: [
      ["Chatbot AI thầy xây cho shop mình ", "The AI chatbot he built for my shop "],
      ["chốt đơn rất tốt", "closes orders really well"],
      [", khách khen phản hồi nhanh.", ", and customers praise the quick replies."],
    ],
  },
  {
    who: ["Chị Mai", "Mai"],
    role: ["Quản lý vận hành", "Operations manager"],
    initial: "M",
    av: "#8E6A22",
    text: [
      ["Thầy ", "He "],
      ["nói thẳng cái gì AI làm được, cái gì chưa", "says plainly what AI can do and what it cannot yet"],
      [". Nhờ vậy bên tôi không đổ tiền vào thứ không cần.", ". That kept us from pouring money into things we did not need."],
    ],
  },
  {
    who: ["Bạn Hà", "Ha"],
    role: ["Học viên", "Student"],
    initial: "H",
    av: "#7D858C",
    text: [
      ["Từ mất gốc, sau khoá học em đã ", "Starting from scratch, after the course I "],
      ["tự làm được AI agent", "built an AI agent myself"],
      [" cho công việc của mình.", " for my own work."],
    ],
  },
  {
    who: ["Chị Hương", "Huong"],
    role: ["Phụ huynh", "Parent"],
    initial: "H",
    av: "#9A7B4F",
    text: [
      ["Con tôi học robotics về kể suốt bữa cơm. Thầy ", "My child talks about robotics class all through dinner. He is "],
      ["kiên nhẫn với từng bạn nhỏ", "patient with every single kid"],
      [".", "."],
    ],
  },
  {
    who: ["Anh Phong", "Phong"],
    role: ["Trưởng nhóm kỹ thuật", "Engineering lead"],
    initial: "P",
    av: "#4B5158",
    text: [
      ["Dự án thị giác máy tính của nhóm bế tắc cả tháng. Thầy ", "Our computer-vision project had been stuck for a month. He "],
      ["chỉ ra đúng chỗ dữ liệu có vấn đề", "pointed to exactly where the data was the problem"],
      [", tuần sau đã chạy được.", ", and it was running the week after."],
    ],
  },
  {
    who: ["Bạn Ngân", "Ngan"],
    role: ["Học viên Phân tích dữ liệu", "Data analysis student"],
    initial: "N",
    av: "#6B4F33",
    text: [
      ["Em chuyển ngành từ kế toán. Thầy ", "I switched over from accounting. He "],
      ["kèm rất sát", "coached me closely"],
      [", giờ em đọc số liệu theo cách khác hẳn.", ", and now I read numbers in a completely different way."],
    ],
  },
];
