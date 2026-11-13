/**
 * Bản tiếng Anh cho trang Giới thiệu.
 *
 * Bản tiếng Việt là bản GỐC (lấy từ thiết kế), nên khoá tra cứu chính là
 * câu tiếng Việt. Thiếu khoá thì trả về nguyên câu tiếng Việt — trang vẫn
 * chạy, chỉ là chỗ đó chưa dịch, không bao giờ vỡ.
 *
 * Lưu ý khi thêm chuỗi: viết dấu "&" thật, KHÔNG viết "&amp;". JSX chỉ giải
 * mã thực thể trong văn bản, không giải mã trong chuỗi JavaScript.
 *
 * Vài tiêu đề bị cắt làm 2–3 mảnh vì có <em> tô màu ở giữa. Bản dịch phải
 * ghép lại cho đúng ngữ pháp:
 *   "Chặng đường " + "đã qua"            → "The road " + "so far"
 *   "Giải pháp " + "trọn gói" + " cho…"  → "Solutions " + "tailored" + " to…"
 */

export type AbtLang = "vi" | "en";

const EN: Record<string, string> = {
  /* ---------- Hero ---------- */
  "Xin chào, tôi là": "Hi, I am",
  "Trương Tấn": "Trương Tấn",   // tên riêng — giữ nguyên dấu ở cả hai bản
  "Nghĩa": "Nghĩa",
  "Nhà sáng lập & CEO · AIhoclaptrinh": "Founder & CEO · AIhoclaptrinh",
  "Tôi xây": "I build",
  "Chatbot bán hàng": "Sales chatbots",
  "Thị giác máy tính": "Computer vision",
  "Người sáng lập AIhoclaptrinh — làm tất cả mọi thứ về AI: AI agents, chatbot, automation và đào tạo lập trình AI. Tin rằng ai cũng có thể ứng dụng AI nếu được kèm đúng cách, đúng lúc.":
    "Founder of AIhoclaptrinh — I work across the whole AI stack: agents, chatbots, automation and AI programming courses. I believe anyone can put AI to work with the right guidance at the right time.",
  "Liên hệ với tôi": "Get in touch",
  "Nhắn Zalo": "Message on Zalo",
  "Điện thoại · Zalo": "Phone · Zalo",
  "TP. Hồ Chí Minh": "Ho Chi Minh City",
  "Địa điểm": "Location",
  "Chuyên gia AI": "AI specialist",
  "8+ năm kinh nghiệm": "8+ years of experience",
  "· đang chạy": "· running",
  "Đọc tin nhắn mới trên Zalo": "Read new Zalo messages",
  "Tra tồn kho trên Google Sheets": "Check stock in Google Sheets",
  "Chốt đơn, gửi xác nhận cho khách": "Close the order, send confirmation",
  "năm kinh nghiệm EdTech": "years in EdTech",
  "trường & trung tâm đang dùng AIhoclaptrinh": "schools & centres running on AIhoclaptrinh",
  "khách hàng gia hạn hằng năm": "of clients renew every year",
  "Dạy lập trình AI": "Teaching AI programming",
  "Xử lý ngôn ngữ lớn (NLP/LLM)": "NLP & large language models",

  /* ---------- Mục lục ---------- */
  "Năng lực": "Expertise",
  "Dự án": "Projects",
  "Giải pháp": "Solutions",
  "Quy trình": "Process",
  "Hành trình": "Journey",
  "Cảm nhận": "Testimonials",
  "Liên hệ": "Contact",

  /* ---------- 01 Năng lực ---------- */
  "Trọn bộ năng lực AI,": "The full AI toolkit,",
  "từ ý tưởng đến vận hành": "from idea to production",
  "Mỗi ô là một minh hoạ động về cách hệ thống làm việc.":
    "Each tile is a live illustration of how the system works.",
  "Xây dựng agent tự vận hành, thay con người làm việc lặp lại.":
    "Autonomous agents that take over the repetitive work.",
  "agent — chăm sóc đơn hàng": "agent — order support",
  "Đọc tin nhắn mới trên Zalo OA": "Read new messages on Zalo OA",
  "Tạo đơn, gửi xác nhận cho khách": "Create the order, confirm with the customer",
  "Ghi vào báo cáo cuối ngày": "Write it into the end-of-day report",
  "Chatbot thông minh, tích hợp mô hình ngôn ngữ lớn.":
    "Smart chatbots powered by large language models.",
  "Trợ lý bán hàng": "Sales assistant",
  "Trực tuyến 24/7": "Online 24/7",
  "Áo khoác gió còn size M không shop?": "Do you still have the windbreaker in size M?",
  "Dạ còn ạ! Em gửi anh/chị mẫu đang có sẵn nhé:": "Yes we do! Here is what is in stock:",
  "Áo khoác gió · Size M": "Windbreaker · Size M",
  "Còn hàng": "In stock",
  "Chốt cho em 1 cái nhé!": "I will take one!",
  "Đã tạo đơn ✓ Em gửi xác nhận qua Zalo ngay ạ.":
    "Order created ✓ Sending the confirmation on Zalo now.",
  "Tự động hoá quy trình end-to-end.": "End-to-end process automation.",
  "Đào tạo AI": "AI training",
  "Kèm học viên ứng dụng AI thực chiến, học là làm được.":
    "Hands-on coaching that turns learners into builders.",
  "Python nền tảng": "Python foundations",
  "AI Agents thực chiến": "AI agents in practice",
  "Nhận diện, đếm, cảnh báo qua camera bằng AI thời gian thực.":
    "Real-time detection, counting and alerts from camera feeds.",
  "AI cho mọi ngành": "AI for every industry",
  "Một bộ năng lực, ứng dụng vào nhiều lĩnh vực.":
    "One skill set, applied across many fields.",
  "Giáo dục & Đào tạo": "Education & training",
  "Trợ giảng, chấm bài, cá nhân hoá lộ trình.":
    "AI tutors, grading, personalised learning paths.",
  "Bán hàng & Chốt đơn": "Sales & checkout",
  "Chatbot tư vấn, chốt đơn 24/7.": "Advisory chatbots closing orders 24/7.",
  "Chăm sóc khách hàng": "Customer care",
  "Phản hồi tức thì mọi lúc.": "Instant replies, any time.",
  "Sinh nội dung, phân tích chiến dịch.": "Content generation and campaign analytics.",
  "Vận hành & Văn phòng": "Operations & back office",
  "Báo cáo, nhập liệu tự động.": "Automated reporting and data entry.",
  "Phân tích dữ liệu": "Data analytics",
  "Insight, dự báo từ dữ liệu thô.": "Insights and forecasts from raw data.",

  /* ---------- 02 Dự án ---------- */
  "nổi bật": "in focus",
  "Những gì tôi đã và đang xây dựng. Chọn một dự án để xem chi tiết.":
    "What I have built and am building. Pick a project to see the details.",
  "EduFlow AI — nền tảng quản lý lớp học": "EduFlow AI — classroom management platform",
  "Đang vận hành": "Live",
  "Đang phát triển": "In development",
  "Bản demo": "Demo",
  "Dự án khách hàng": "Client project",
  "Nghiên cứu (R&D)": "Research (R&D)",
  "Giáo dục · Sản phẩm của AIhoclaptrinh": "Education · An AIhoclaptrinh product",
  "Chính nền tảng bạn đang xem: quản lý học viên, lịch học, điểm danh và học phí cho trung tâm đào tạo.":
    "The very platform you are looking at: students, schedules, attendance and tuition for a training centre.",
  "Học viên, lịch học, điểm danh, học phí trong một nơi":
    "Students, schedule, attendance and tuition in one place",
  "Tự nhắc lịch, nhắc học phí và gửi biên lai qua Zalo Bot":
    "Automatic class and tuition reminders, receipts sent over Zalo Bot",
  "Song ngữ Việt – Anh, giao diện sáng / tối":
    "Vietnamese – English, light and dark themes",
  "Nền tảng AI Camera đa ngành": "Multi-industry AI camera platform",
  "Một lõi phát hiện → bám đối tượng → nhận dạng → cảnh báo, tách thành web app riêng cho giao thông, trường học, nông nghiệp, xây dựng, y tế.":
    "One core — detect → track → recognise → alert — packaged as separate web apps for traffic, schools, agriculture, construction and healthcare.",
  "Nhận diện khuôn mặt, biển số, hành vi, vùng cấm":
    "Face, licence plate, behaviour and restricted-zone detection",
  "Luật cảnh báo + dashboard sự kiện theo thời gian thực":
    "Alert rules plus a real-time event dashboard",
  "Trợ lý số ngành Giáo dục": "Digital assistant for the education sector",
  "Giải đáp thủ tục, tuyển sinh, chế độ chính sách; mỗi câu trả lời kèm thẻ căn cứ pháp lý, câu ngoài phạm vi chuyển cho cán bộ.":
    "Answers on procedures, admissions and policy; every reply carries a legal-basis citation, and anything out of scope is handed to a human officer.",
  "§ Căn cứ pháp lý · trích nguyên văn": "§ Legal basis · verbatim quote",
  "Hồ sơ chuyển trường cần những gì?": "What documents do I need to transfer schools?",
  "Dạ, em liệt kê hồ sơ cần chuẩn bị kèm điều khoản tương ứng ạ.":
    "Here is the list of documents, each with the clause it comes from.",
  "Trả lời có trích dẫn nguyên văn điều khoản": "Replies quote the clause verbatim",
  "Từ chối câu ngoài phạm vi, chuyển người thật":
    "Declines out-of-scope questions and hands over to a person",
  "Giám sát máy CNC qua camera": "CNC machine monitoring by camera",
  "Đếm thời gian máy chạy – dừng từ camera RTSP có sẵn trong xưởng, không cần GPU; dashboard theo dõi nhiều máy.":
    "Measures run and idle time from the RTSP cameras already in the workshop — no GPU needed — with a dashboard covering many machines.",
  "Phát hiện nốt phổi trên ảnh CT bằng U-Net và hiển thị vị trí trên mô hình phổi 3D tương tác.":
    "Detects lung nodules in CT scans with U-Net and places them on an interactive 3D lung model.",
  "Y tế · Ảnh CT": "Healthcare · CT imaging",
  "RL Lab — 20 dự án học tăng cường": "RL Lab — 20 reinforcement learning projects",
  "Từ cơ bản đến nâng cao, mỗi dự án có demo tương tác; drone 3D huấn luyện PPO chạy ngay trên trình duyệt.":
    "From basics to advanced, each project ships an interactive demo; the 3D drone trains with PPO right in the browser.",
  "Robot thu hoạch dâu tây": "Strawberry-harvesting robot",
  "Xe tự hành Raspberry Pi 5 kết hợp tay máy 3 bậc tự do, tránh vật cản bằng ROS 2 và LiDAR.":
    "A Raspberry Pi 5 rover with a 3-DOF arm, avoiding obstacles using ROS 2 and LiDAR.",
  "Công nghiệp": "Industry",
  "Có bài toán tương tự?": "Have a similar problem?",
  "Kể tôi nghe quy trình hiện tại của bạn — tôi đề xuất hướng ứng dụng AI phù hợp.":
    "Tell me how your process works today and I will suggest where AI fits.",
  "Trao đổi dự án": "Discuss a project",

  /* ---------- 03 Giải pháp ---------- */
  "trọn gói": "tailored",
  "cho doanh nghiệp": "to your business",
  "Mỗi giải pháp đều tuỳ chỉnh được theo quy trình riêng của bạn.":
    "Every solution is shaped around the way you already work.",
  "Chatbot bán hàng & CSKH": "Sales & support chatbot",
  "Tư vấn, chốt đơn, chăm khách tự động trên Zalo & Website 24/7.":
    "Advises, closes orders and supports customers on Zalo and your website, 24/7.",
  "AI Agent tự động hoá": "Automation AI agent",
  "Agent tự nối các app, xử lý quy trình từ đầu đến cuối không cần người.":
    "Agents that connect your apps and run whole workflows hands-free.",
  "Trợ giảng & chấm bài AI": "AI tutor & grading",
  "Trợ giảng ảo, chấm bài, cá nhân hoá lộ trình cho từng học viên.":
    "A virtual tutor that grades work and personalises each learner's path.",
  "Trao đổi về giải pháp này": "Talk about this solution",

  /* ---------- 04 Quy trình ---------- */
  "Cách tôi": "How I",
  "đồng hành": "work",
  "cùng bạn": "with you",
  "đơn giản, rõ ràng": "simple and clear",
  "Lắng nghe & tư vấn": "Listen & advise",
  "Hiểu đúng bài toán, mục tiêu và ngân sách của anh/chị.":
    "Understand the real problem, your goals and your budget.",
  "Xây dựng giải pháp AI": "Build the AI solution",
  "Thiết kế agent / automation / chatbot phù hợp thực tế.":
    "Design the agent, automation or chatbot that actually fits.",
  "Bàn giao & đồng hành": "Hand over & support",
  "Hướng dẫn sử dụng và hỗ trợ vận hành lâu dài.":
    "Train your team and support the system long term.",

  /* ---------- 05 Hành trình ---------- */
  "Chặng đường": "The road",
  "đã qua": "so far",
  "từ dòng code đầu tiên đến hôm nay": "from the first line of code until today",
  "Bắt đầu hành trình lập trình & nghiên cứu AI.":
    "Started the programming and AI research journey.",
  "Đưa AI vào giảng dạy, kèm lứa học viên đầu tiên.":
    "Brought AI into teaching and coached the first cohort.",
  "Sáng lập AIhoclaptrinh — nền tảng dạy & ứng dụng AI.":
    "Founded AIhoclaptrinh — a platform for learning and applying AI.",
  "120+ trường & trung tâm ứng dụng nền tảng.":
    "120+ schools and centres running on the platform.",
  "Hôm nay": "Today",
  "Xây AI agents & automation cho doanh nghiệp và lớp học.":
    "Building AI agents and automation for businesses and classrooms.",

  /* ---------- 06 Đào tạo ---------- */
  "Đào tạo": "Training",
  "Khóa học": "Courses",
  "học là làm được": "learn it, then build it",
  "Scratch thiếu nhi": "Scratch for kids",
  "Python cơ bản": "Python basics",
  "Lập trình AI nâng cao": "Advanced AI programming",
  "Trương Tấn Nghĩa · 10 buổi": "Trương Tấn Nghĩa · 10 sessions",
  "Trương Tấn Nghĩa · 12 buổi": "Trương Tấn Nghĩa · 12 sessions",
  "Trương Tấn Nghĩa · 16 buổi": "Trương Tấn Nghĩa · 16 sessions",
  "Xem khóa": "View course",

  /* ---------- 07 Kiến thức ---------- */
  "Kiến thức": "Learn",
  "Chủ đề tôi": "What I",
  "hay chia sẻ": "share most",
  "miễn phí cho cộng đồng": "free for the community",
  "Bắt đầu với AI Agents": "Getting started with AI agents",
  "Cơ bản": "Basics",
  "Automation cho người mới": "Automation for beginners",
  "Thực hành": "Hands-on",
  "LLM & nghệ thuật viết prompt": "LLMs and the craft of prompting",
  "Nâng cao": "Advanced",

  /* ---------- 08 Cảm nhận ---------- */
  "Học viên & khách hàng": "What students & clients",
  "nói gì": "say",
  "Ví dụ minh hoạ — đang cập nhật nhận xét thật, kèm tên và đơn vị.":
    "Illustrative examples — real testimonials with names and organisations are on the way.",
  "Minh hoạ": "Illustrative",
  "Thầy Nghĩa dạy dễ hiểu, làm được ngay. Automation giúp trung tâm em tiết kiệm hàng giờ mỗi ngày.":
    "Nghia teaches in a way you can act on immediately. The automation saves our centre hours every day.",
  "Chị Lan": "Ms. Lan",
  "Chủ trung tâm": "Centre owner",
  "Chatbot AI thầy xây cho shop mình chốt đơn cực tốt, khách khen phản hồi nhanh.":
    "The AI chatbot he built closes orders beautifully — customers love how fast it replies.",
  "Chủ shop online": "Online shop owner",
  "Từ mất gốc, sau khoá học em đã tự làm được AI agent cho công việc của mình.":
    "I started from nothing and finished the course able to build an AI agent for my own job.",
  "Bạn Hà": "Ha",
  "Học viên": "Student",

  /* ---------- Liên hệ ---------- */
  "Hợp tác": "Work together",
  "Sẵn sàng đưa AI vào": "Ready to bring AI into",
  "công việc của bạn?": "your work?",
  "Đưa AI đến gần mọi người — để ai cũng có thể ứng dụng AI vào công việc và học tập, nếu được kèm đúng cách, đúng lúc. Nhắn tôi một câu, mình bắt đầu nhé.":
    "Bringing AI within reach of everyone — anyone can apply it to their work and study with the right guidance at the right time. Send me a message and let us start.",
  "Hợp tác cùng tôi": "Work with me",
  "Công nghệ tôi dùng hằng ngày · di chuột để tạm dừng":
    "The tools I use every day · hover to pause",
  "— phương châm của AIhoclaptrinh": "— the AIhoclaptrinh motto",

  /* ---------- nhãn trợ năng (aria-label) ---------- */
  "Chuyên môn": "Expertise",
  "Mục lục trang": "Page sections",
  "Danh sách dự án": "Project list",
  "Dự án trước": "Previous project",
  "Dự án tiếp theo": "Next project",
  "5 trên 5 sao": "5 out of 5 stars",
  "Lộ trình học": "Learning path",
};

/** Dịch một câu. Không có bản dịch thì giữ nguyên tiếng Việt. */
export function tAbout(lang: AbtLang, vi: string): string {
  if (lang !== "en") return vi;
  return EN[vi] ?? vi;
}

/** Số chuỗi đã dịch — dùng cho kiểm thử. */
export const EN_KEYS = Object.keys(EN).length;
