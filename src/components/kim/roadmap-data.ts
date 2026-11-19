import type { L } from "./i18n-kim";

/* TỆP SINH TỰ ĐỘNG bằng UI/aihoclaptrinh-design-mcp/scripts/roadmap-build.py. Đừng sửa tay.

   Dữ liệu của "AI Engineer Roadmap — Coder Xuất Ngũ", bản roadmap anh Nghĩa đưa ngày 18/11/2026
   (UI/AI_ENGINEER_ROADMAP_CODER_XUAT_NGU.html), dựng lại trên trang /roadmap. Nội dung giữ
   nguyên từng chữ của bản gốc; bản tiếng Anh dịch theo cùng cấu trúc.

   TIERS   6 chặng (hàng ngang trên bản đồ)
   STAGES  6 giai đoạn theo thời gian, tổng 18 tháng (thanh thời gian phía trên bản đồ)
   NODES   29 ô kỹ năng; tier 6 là 7 dự án. pre = các ô cần học trước
   GOAL    ô đích "AI Engineer"
   CPS     2 checkpoint tự kiểm tra, nằm sau chặng 1 và chặng 2 */

export type RmTier = { n: number; name: L; en: string; desc: L };
export type RmStage = { n: number; name: L; time: L; m: number; c: number; desc: L };
export type RmNode = {
  id: string;
  code: string;
  tier: number;
  stage: number;
  /** độ khó 1–5 */
  lv: number;
  title: L;
  sub: L;
  pre: string[];
  tag: L;
  what: L;
  why: L;
  learn: L[];
  tools: L[];
  practice: L;
  done: L[];
  pit: L;
  note?: L;
  kind: "node" | "project";
};
export type RmGoal = { id: "AIE"; kind: "goal"; code: string; title: L; tag: L; what: L; why: L; learn: L[]; practice: L; done: L[]; pit: L };
export type RmCheckpoint = { id: string; kind: "cp"; code: string; after: number; title: L; short: L; needs: string[]; tag: L; what: L; checks: L[] };

export const TIERS: RmTier[] = [
 {
  "n": 1,
  "name": [
   "Nền tảng bắt buộc",
   "Required foundations"
  ],
  "en": "Foundation",
  "desc": [
   "Những thứ không trực tiếp là AI nhưng quyết định bạn đi được bao xa: lập trình, toán, dữ liệu, hệ thống và cách làm việc nhóm. Chặng này bắt buộc với mọi hướng.",
   "Things that are not AI as such but decide how far you can go: programming, maths, data, systems and teamwork. This tier is required whichever track you take."
  ]
 },
 {
  "n": 2,
  "name": [
   "Cốt lõi AI",
   "Core AI"
  ],
  "en": "Core AI",
  "desc": [
   "Ba cách máy học: học quy luật từ dữ liệu (Machine Learning), học biểu diễn nhiều tầng bằng mạng nơ-ron (Deep Learning), và học qua thử – sai với phần thưởng (Reinforcement Learning).",
   "Three ways a machine learns: learning patterns from data (Machine Learning), learning multi-layer representations with neural networks (Deep Learning), and learning by trial and error with rewards (Reinforcement Learning)."
  ]
 },
 {
  "n": 3,
  "name": [
   "Chuyên sâu & Ứng dụng AI",
   "Specialisation & AI applications"
  ],
  "en": "Specialization",
  "desc": [
   "Mỗi ô ở đây là một nghề. Không ai cần giỏi cả năm: hãy chọn một đến hai hướng để đào sâu, các hướng còn lại hiểu ở mức khái quát.",
   "Each tile here is a profession in its own right. Nobody needs to be good at all five: pick one or two tracks to go deep on, and understand the rest at an overview level."
  ]
 },
 {
  "n": 4,
  "name": [
   "Kỹ thuật hệ thống AI",
   "AI systems engineering"
  ],
  "en": "AI Engineering",
  "desc": [
   "Phần biến mô hình thành sản phẩm: dữ liệu chảy vào thế nào, mô hình được huấn luyện lại, đóng gói, phục vụ và theo dõi ra sao. Đây là phần làm nên chữ “Engineer”.",
   "The part that turns models into products: how data flows in, and how models are retrained, packaged, served and monitored. This is the part that earns the word “Engineer”."
  ]
 },
 {
  "n": 5,
  "name": [
   "Ứng dụng & Công nghệ tương lai",
   "Applications & future technology"
  ],
  "en": "Applications & Future",
  "desc": [
   "Nơi AI rời khỏi máy chủ: đi vào robot, vào thiết bị nhỏ, và thử nghiệm trên máy tính lượng tử. Đây là chặng mở rộng, học khi đã vững các chặng trước.",
   "Where AI leaves the server: into robots, into small devices, and into experiments on quantum computers. This is an extension tier, to study once you are solid on the earlier tiers."
  ]
 },
 {
  "n": 6,
  "name": [
   "Dự án tổng hợp",
   "Capstone projects"
  ],
  "en": "Capstone Projects",
  "desc": [
   "Bảy dự án đi kèm lộ trình. Mỗi dự án chốt một chặng kiến thức và là thứ bạn đem ra cho người khác xem. Không cần đợi học xong mới làm: mỗi dự án gắn với một giai đoạn.",
   "Seven projects that come with the roadmap. Each one rounds off a stretch of knowledge and is something you can show other people. You do not need to finish studying first: each project is tied to a stage."
  ]
 }
];

export const STAGES: RmStage[] = [
 {
  "n": 1,
  "name": [
   "Nền tảng",
   "Foundations"
  ],
  "time": [
   "0–2 tháng",
   "0–2 months"
  ],
  "m": 2,
  "c": 1,
  "desc": [
   "Lập trình, Python, cấu trúc dữ liệu, toán, cơ sở dữ liệu, hệ thống, Git.",
   "Programming, Python, data structures, maths, databases, systems, Git."
  ]
 },
 {
  "n": 2,
  "name": [
   "ML cơ bản",
   "ML basics"
  ],
  "time": [
   "2–4 tháng",
   "2–4 months"
  ],
  "m": 2,
  "c": 2,
  "desc": [
   "Machine Learning và các thuật toán cổ điển. Làm Dự án 1.",
   "Machine Learning and the classic algorithms. Build Project 1."
  ]
 },
 {
  "n": 3,
  "name": [
   "DL nâng cao",
   "Advanced DL"
  ],
  "time": [
   "4–6 tháng",
   "4–6 months"
  ],
  "m": 2,
  "c": 2,
  "desc": [
   "Deep Learning: CNN, RNN, Transformer. Làm Dự án 2.",
   "Deep Learning: CNN, RNN, Transformer. Build Project 2."
  ]
 },
 {
  "n": 4,
  "name": [
   "Ứng dụng chuyên sâu",
   "Specialist applications"
  ],
  "time": [
   "6–10 tháng",
   "6–10 months"
  ],
  "m": 4,
  "c": 3,
  "desc": [
   "Computer Vision, NLP & LLM, Generative AI, Multimodal. Làm Dự án 3 và 4.",
   "Computer Vision, NLP & LLM, Generative AI, Multimodal. Build Projects 3 and 4."
  ]
 },
 {
  "n": 5,
  "name": [
   "Hệ thống & Triển khai",
   "Systems & deployment"
  ],
  "time": [
   "10–12 tháng",
   "10–12 months"
  ],
  "m": 2,
  "c": 4,
  "desc": [
   "Data Engineering, MLOps, triển khai, tối ưu. Làm Dự án 5.",
   "Data Engineering, MLOps, deployment, optimisation. Build Project 5."
  ]
 },
 {
  "n": 6,
  "name": [
   "Mở rộng & Tương lai",
   "Expansion & the future"
  ],
  "time": [
   "12–18 tháng",
   "12–18 months"
  ],
  "m": 6,
  "c": 5,
  "desc": [
   "AI Agent, Reinforcement Learning, Robotics, Edge AI, Quantum Computing. Làm Dự án 6 và 7.",
   "AI Agent, Reinforcement Learning, Robotics, Edge AI, Quantum Computing. Build Projects 6 and 7."
  ]
 }
];

export const NODES: RmNode[] = [
 {
  "id": "PS",
  "code": "PS",
  "tier": 1,
  "stage": 1,
  "lv": 1,
  "title": [
   "Tư duy lập trình & Giải quyết vấn đề",
   "Programming mindset & problem solving"
  ],
  "sub": [
   "Phân rã · Thuật toán · Gỡ lỗi",
   "Decomposition · Algorithms · Debugging"
  ],
  "pre": [],
  "tag": [
   "Biết chia một vấn đề lớn thành những bước máy tính làm được.",
   "Breaking a big problem into steps a computer can carry out."
  ],
  "what": [
   "Đây là kỹ năng đứng trước mọi ngôn ngữ lập trình: đọc hiểu yêu cầu, chia bài toán thành các phần nhỏ, mô tả lời giải thành từng bước rõ ràng, rồi kiểm tra xem nó có đúng không.",
   "This is the skill that comes before any programming language: understanding the requirements, splitting the problem into small parts, describing the solution as clear steps, then checking whether it is correct."
  ],
  "why": [
   "Công cụ AI thay đổi mỗi năm, còn cách suy nghĩ này thì không. Viết prompt tốt, gỡ lỗi huấn luyện hay thiết kế pipeline đều dựa vào cùng một kỹ năng: phân rã vấn đề.",
   "AI tools change every year, but this way of thinking does not. Writing good prompts, debugging training runs and designing pipelines all rest on the same skill: breaking problems down."
  ],
  "learn": [
   [
    "Biến, kiểu dữ liệu, điều kiện, vòng lặp, hàm",
    "Variables, data types, conditionals, loops, functions"
   ],
   [
    "Phân rã bài toán và viết mã giả (pseudocode)",
    "Breaking problems down and writing pseudocode"
   ],
   [
    "Đọc thông báo lỗi và gỡ lỗi có hệ thống",
    "Reading error messages and debugging systematically"
   ],
   [
    "Kiểm thử với các trường hợp biên",
    "Testing with edge cases"
   ],
   [
    "Đọc hiểu code của người khác",
    "Reading and understanding other people’s code"
   ]
  ],
  "tools": [
   "Python",
   "VS Code",
   "Debugger",
   [
    "Giấy và bút",
    "Pen and paper"
   ]
  ],
  "practice": [
   "Giải 30 bài mức dễ trên một trang luyện tập (LeetCode, HackerRank, Codeforces). Với mỗi bài, viết lời giải bằng lời trước rồi mới viết code.",
   "Solve 30 easy problems on a practice site (LeetCode, HackerRank, Codeforces). For each one, write the solution in words before you write any code."
  ],
  "done": [
   [
    "Tự viết được chương trình 100–200 dòng mà không chép mẫu",
    "You can write a 100–200 line program on your own without copying a template"
   ],
   [
    "Gặp lỗi thì biết khoanh vùng thay vì sửa mò",
    "When you hit a bug, you narrow it down instead of guessing at fixes"
   ]
  ],
  "pit": [
   "Xem video hướng dẫn liên tục mà không tự gõ. Kỹ năng này chỉ tăng khi bạn tự mắc kẹt và tự thoát ra.",
   "Watching tutorial after tutorial without typing anything yourself. This skill only grows when you get stuck and get yourself out."
  ],
  "kind": "node"
 },
 {
  "id": "PY",
  "code": "PY",
  "tier": 1,
  "stage": 1,
  "lv": 2,
  "title": "Python",
  "sub": [
   "Cơ bản → Nâng cao",
   "Basics → Advanced"
  ],
  "pre": [
   "PS"
  ],
  "tag": [
   "Ngôn ngữ chung của gần như toàn bộ hệ sinh thái AI.",
   "The common language of almost the entire AI ecosystem."
  ],
  "what": [
   "PyTorch, TensorFlow, scikit-learn, Hugging Face và hầu hết công cụ dữ liệu đều dùng Python. Bạn cần đi từ cú pháp cơ bản tới mức viết được code sạch, có cấu trúc, và xử lý mảng nhanh với NumPy.",
   "PyTorch, TensorFlow, scikit-learn, Hugging Face and most data tools all use Python. You need to go from basic syntax to writing clean, well-structured code and processing arrays quickly with NumPy."
  ],
  "why": [
   "Mọi chặng phía sau đều viết bằng Python. Yếu Python thì mỗi bài học AI sẽ biến thành bài học sửa lỗi cú pháp.",
   "Every later tier is written in Python. If your Python is weak, every AI lesson turns into a lesson in fixing syntax errors."
  ],
  "learn": [
   [
    "Kiểu dữ liệu: list, dict, set, tuple; comprehension",
    "Data types: list, dict, set, tuple; comprehensions"
   ],
   [
    "Hàm, module, package, môi trường ảo",
    "Functions, modules, packages, virtual environments"
   ],
   [
    "Lập trình hướng đối tượng: class, kế thừa",
    "Object-oriented programming: classes, inheritance"
   ],
   [
    "Xử lý file, JSON, ngoại lệ",
    "Working with files, JSON, exceptions"
   ],
   [
    "NumPy (mảng, broadcasting) và pandas (DataFrame)",
    "NumPy (arrays, broadcasting) and pandas (DataFrame)"
   ],
   [
    "Type hints, decorator, generator",
    "Type hints, decorators, generators"
   ],
   [
    "Vẽ biểu đồ với Matplotlib",
    "Plotting with Matplotlib"
   ]
  ],
  "tools": [
   "Python 3",
   "Jupyter",
   "NumPy",
   "pandas",
   "Matplotlib",
   "venv / conda / uv"
  ],
  "practice": [
   "Viết một công cụ dòng lệnh đọc file CSV, làm sạch dữ liệu, tính thống kê và xuất biểu đồ.",
   "Write a command-line tool that reads a CSV file, cleans the data, computes statistics and outputs charts."
  ],
  "done": [
   [
    "Viết được class và module tái sử dụng",
    "You can write reusable classes and modules"
   ],
   [
    "Thay vòng lặp bằng phép toán NumPy khi xử lý mảng",
    "You replace loops with NumPy operations when working with arrays"
   ],
   [
    "Đọc hiểu được code của một thư viện mã nguồn mở nhỏ",
    "You can read and follow the code of a small open-source library"
   ]
  ],
  "pit": [
   "Học hết cú pháp nâng cao trước khi làm gì đó thật. Học vừa đủ rồi làm dự án, thiếu đâu quay lại học đó.",
   "Learning all the advanced syntax before building anything real. Learn just enough, then build a project, and go back to whatever you find missing."
  ],
  "kind": "node"
 },
 {
  "id": "DSA",
  "code": "DSA",
  "tier": 1,
  "stage": 1,
  "lv": 3,
  "title": [
   "Cấu trúc dữ liệu & Giải thuật",
   "Data structures & algorithms"
  ],
  "sub": [
   "Mảng · Cây · Đồ thị · Big-O",
   "Arrays · Trees · Graphs · Big-O"
  ],
  "pre": [
   "PY"
  ],
  "tag": [
   "Cách tổ chức dữ liệu quyết định code chạy một giây hay một giờ.",
   "How you organise data decides whether code runs in a second or an hour."
  ],
  "what": [
   "Cấu trúc dữ liệu là cách sắp xếp dữ liệu trong bộ nhớ; giải thuật là các bước xử lý chúng. Ký hiệu Big-O cho biết thời gian và bộ nhớ tăng thế nào khi dữ liệu lớn dần.",
   "A data structure is a way of arranging data in memory; an algorithm is the steps that process it. Big-O notation tells you how time and memory grow as the data gets larger."
  ],
  "why": [
   "Dữ liệu AI thường rất lớn. Chọn dict thay cho list đúng chỗ, hay hiểu vì sao tìm kiếm vector cần chỉ mục, là khác biệt giữa hệ thống dùng được và không dùng được. Đây cũng là nội dung phỏng vấn kỹ thuật phổ biến.",
   "AI data is often very large. Choosing a dict over a list in the right place, or understanding why vector search needs an index, is the difference between a usable system and an unusable one. It is also a common topic in technical interviews."
  ],
  "learn": [
   [
    "Mảng, danh sách liên kết, ngăn xếp, hàng đợi",
    "Arrays, linked lists, stacks, queues"
   ],
   [
    "Bảng băm (hash table)",
    "Hash tables"
   ],
   [
    "Cây, cây nhị phân tìm kiếm, heap",
    "Trees, binary search trees, heaps"
   ],
   [
    "Đồ thị, duyệt BFS và DFS",
    "Graphs, BFS and DFS traversal"
   ],
   [
    "Sắp xếp và tìm kiếm nhị phân",
    "Sorting and binary search"
   ],
   [
    "Đệ quy và quy hoạch động",
    "Recursion and dynamic programming"
   ],
   [
    "Phân tích độ phức tạp Big-O",
    "Big-O complexity analysis"
   ]
  ],
  "tools": [
   "Python",
   "LeetCode",
   "VisuAlgo"
  ],
  "practice": [
   "Tự cài đặt một hash table và một heap, sau đó giải khoảng 50 bài chia theo chủ đề.",
   "Implement a hash table and a heap yourself, then solve about 50 problems grouped by topic."
  ],
  "done": [
   [
    "Ước lượng được Big-O của đoạn code mình viết",
    "You can estimate the Big-O of code you write"
   ],
   [
    "Chọn đúng cấu trúc dữ liệu cho các bài toán thường gặp",
    "You pick the right data structure for common problems"
   ]
  ],
  "pit": [
   "Học thuộc lời giải. Mục tiêu là nhận ra dạng bài, không phải nhớ đáp án.",
   "Memorising solutions. The goal is to recognise the type of problem, not to remember answers."
  ],
  "kind": "node"
 },
 {
  "id": "MATH",
  "code": "MATH",
  "tier": 1,
  "stage": 1,
  "lv": 4,
  "title": [
   "Toán học cho AI",
   "Maths for AI"
  ],
  "sub": [
   "Đại số tuyến tính · Giải tích · Xác suất – Thống kê",
   "Linear algebra · Calculus · Probability & statistics"
  ],
  "pre": [],
  "tag": [
   "Ngôn ngữ mà mọi mô hình AI được viết ra.",
   "The language every AI model is written in."
  ],
  "what": [
   "Ba mảng toán đủ dùng cho AI: đại số tuyến tính (dữ liệu và mô hình đều là vector, ma trận), giải tích (đạo hàm cho biết chỉnh tham số theo hướng nào), và xác suất – thống kê (mô hình hóa sự không chắc chắn, đánh giá kết quả).",
   "Three areas of maths cover what AI needs: linear algebra (data and models are all vectors and matrices), calculus (derivatives tell you which way to adjust the parameters), and probability and statistics (modelling uncertainty, evaluating results)."
  ],
  "why": [
   "Dùng thư viện thì không cần giỏi toán. Nhưng cần toán để hiểu vì sao mô hình không hội tụ, để đọc được bài báo, và để không bị số liệu đánh lừa.",
   "You do not need to be good at maths to use a library. But you need maths to understand why a model will not converge, to read papers, and to avoid being fooled by numbers."
  ],
  "learn": [
   [
    "Vector, ma trận, tích vô hướng, phép nhân ma trận",
    "Vectors, matrices, dot products, matrix multiplication"
   ],
   [
    "Trị riêng, vector riêng, SVD (mức ý tưởng)",
    "Eigenvalues, eigenvectors, SVD (conceptual level)"
   ],
   [
    "Đạo hàm, đạo hàm riêng, gradient, quy tắc dây chuyền",
    "Derivatives, partial derivatives, gradients, the chain rule"
   ],
   [
    "Xác suất có điều kiện, định lý Bayes",
    "Conditional probability, Bayes’ theorem"
   ],
   [
    "Các phân phối thường gặp, kỳ vọng, phương sai",
    "Common distributions, expectation, variance"
   ],
   [
    "Ước lượng hợp lý cực đại (MLE)",
    "Maximum likelihood estimation (MLE)"
   ],
   [
    "Kiểm định giả thuyết, khoảng tin cậy",
    "Hypothesis testing, confidence intervals"
   ]
  ],
  "tools": [
   "NumPy",
   "SymPy",
   "3Blue1Brown",
   "Khan Academy"
  ],
  "practice": [
   "Tự cài đặt hồi quy tuyến tính bằng gradient descent chỉ với NumPy, không dùng thư viện Machine Learning.",
   "Implement linear regression with gradient descent yourself using only NumPy, without any Machine Learning library."
  ],
  "done": [
   [
    "Giải thích được gradient là gì và vì sao đi ngược gradient thì loss giảm",
    "You can explain what a gradient is and why moving against it makes the loss go down"
   ],
   [
    "Đọc được công thức trong một bài báo Machine Learning cơ bản",
    "You can read the formulas in a basic Machine Learning paper"
   ]
  ],
  "pit": [
   "Đợi học xong toàn bộ toán rồi mới bắt đầu Machine Learning. Hãy học song song: gặp khái niệm nào thì quay lại học phần toán đó.",
   "Waiting until you have finished all the maths before starting Machine Learning. Learn them side by side: when you meet a concept, go back and learn that piece of maths."
  ],
  "kind": "node"
 },
 {
  "id": "DB",
  "code": "DB",
  "tier": 1,
  "stage": 1,
  "lv": 2,
  "title": [
   "Cơ sở dữ liệu",
   "Databases"
  ],
  "sub": "SQL · NoSQL",
  "pre": [
   "PY"
  ],
  "tag": [
   "Dữ liệu thật nằm trong cơ sở dữ liệu, không nằm trong file CSV.",
   "Real data lives in databases, not in CSV files."
  ],
  "what": [
   "Cơ sở dữ liệu quan hệ lưu dữ liệu thành bảng và truy vấn bằng SQL. NoSQL gồm nhiều kiểu khác (tài liệu, khóa – giá trị, đồ thị), hợp với dữ liệu linh hoạt hoặc cần tốc độ cao.",
   "Relational databases store data in tables and query it with SQL. NoSQL covers several other kinds (document, key–value, graph), suited to flexible data or to cases that need high speed."
  ],
  "why": [
   "Bước đầu của mọi dự án AI là lấy dữ liệu ra. Về sau, cơ sở dữ liệu vector trong RAG cũng dựa trên chính những khái niệm này: chỉ mục, truy vấn, đánh đổi giữa tốc độ và độ chính xác.",
   "The first step of every AI project is getting the data out. Later on, the vector databases used in RAG rest on these same ideas: indexes, queries, and the trade-off between speed and accuracy."
  ],
  "learn": [
   [
    "SELECT, WHERE, JOIN, GROUP BY, hàm cửa sổ",
    "SELECT, WHERE, JOIN, GROUP BY, window functions"
   ],
   [
    "Thiết kế bảng, khóa chính, khóa ngoại, chuẩn hóa",
    "Table design, primary keys, foreign keys, normalisation"
   ],
   [
    "Chỉ mục và vì sao truy vấn chậm",
    "Indexes and why queries are slow"
   ],
   [
    "Giao dịch (transaction) và tính nhất quán",
    "Transactions and consistency"
   ],
   [
    "NoSQL: kiểu tài liệu, kiểu khóa – giá trị",
    "NoSQL: document stores, key–value stores"
   ],
   [
    "Kết nối cơ sở dữ liệu từ Python",
    "Connecting to databases from Python"
   ]
  ],
  "tools": [
   "PostgreSQL",
   "SQLite",
   "MongoDB",
   "Redis",
   "SQLAlchemy"
  ],
  "practice": [
   "Thiết kế cơ sở dữ liệu cho một cửa hàng nhỏ và viết 20 truy vấn phân tích doanh thu.",
   "Design a database for a small shop and write 20 queries that analyse its revenue."
  ],
  "done": [
   [
    "Viết được truy vấn JOIN nhiều bảng kết hợp GROUP BY",
    "You can write queries that JOIN several tables together with GROUP BY"
   ],
   [
    "Biết khi nào chọn SQL, khi nào chọn NoSQL",
    "You know when to choose SQL and when to choose NoSQL"
   ]
  ],
  "pit": [
   "Kéo toàn bộ bảng về pandas rồi mới lọc. Hãy để cơ sở dữ liệu làm việc nó giỏi.",
   "Pulling whole tables into pandas and only then filtering. Let the database do what it is good at."
  ],
  "kind": "node"
 },
 {
  "id": "OS",
  "code": "OS",
  "tier": 1,
  "stage": 1,
  "lv": 3,
  "title": [
   "Hệ điều hành & Hệ thống",
   "Operating systems & computer systems"
  ],
  "sub": [
   "Linux · Mạng · Tiến trình",
   "Linux · Networking · Processes"
  ],
  "pre": [
   "PS"
  ],
  "tag": [
   "Mô hình của bạn rồi sẽ chạy trên một máy Linux không có màn hình.",
   "Your model will end up running on a Linux machine with no screen."
  ],
  "what": [
   "Hiểu máy tính chạy chương trình thế nào: tiến trình, luồng, bộ nhớ, hệ thống file, mạng. Trên thực tế nghĩa là dùng thành thạo dòng lệnh Linux và hiểu một máy chủ có GPU hoạt động ra sao.",
   "Understanding how a computer runs programs: processes, threads, memory, file systems, networking. In practice this means being fluent on the Linux command line and understanding how a GPU server works."
  ],
  "why": [
   "Huấn luyện trên máy chủ, đóng gói Docker, triển khai lên cloud đều diễn ra trên Linux. Khi hết bộ nhớ GPU hay tiến trình bị treo, kiến thức hệ thống là thứ cứu bạn.",
   "Training on servers, packaging with Docker and deploying to the cloud all happen on Linux. When the GPU runs out of memory or a process hangs, systems knowledge is what saves you."
  ],
  "learn": [
   [
    "Dòng lệnh Linux: file, quyền, tiến trình, pipe",
    "The Linux command line: files, permissions, processes, pipes"
   ],
   [
    "Shell script cơ bản",
    "Basic shell scripting"
   ],
   [
    "Tiến trình, luồng, bộ nhớ, CPU và GPU",
    "Processes, threads, memory, CPU and GPU"
   ],
   [
    "Mạng cơ bản: IP, cổng, HTTP, DNS",
    "Networking basics: IP, ports, HTTP, DNS"
   ],
   [
    "SSH và làm việc trên máy chủ từ xa",
    "SSH and working on remote servers"
   ],
   [
    "Biến môi trường, quản lý gói",
    "Environment variables, package management"
   ]
  ],
  "tools": [
   "Ubuntu",
   "Bash",
   "SSH",
   "tmux",
   "htop",
   "nvidia-smi"
  ],
  "practice": [
   "Dựng hoặc thuê một máy Linux, SSH vào, cài môi trường Python và chạy một script huấn luyện trong tmux.",
   "Set up or rent a Linux machine, SSH in, install a Python environment and run a training script inside tmux."
  ],
  "done": [
   [
    "Làm việc được cả ngày trên terminal mà không cần giao diện đồ họa",
    "You can work a full day in the terminal without a graphical interface"
   ],
   [
    "Đọc được mức dùng CPU, RAM, GPU và biết tiến trình nào đang chiếm",
    "You can read CPU, RAM and GPU usage and tell which process is taking them up"
   ]
  ],
  "pit": [
   "Chỉ làm việc trên giao diện đồ họa, tới lúc triển khai mới bắt đầu học Linux.",
   "Working only in graphical interfaces and starting to learn Linux only when it is time to deploy."
  ],
  "kind": "node"
 },
 {
  "id": "GIT",
  "code": "GIT",
  "tier": 1,
  "stage": 1,
  "lv": 2,
  "title": [
   "Git & Quy trình làm việc",
   "Git & workflow"
  ],
  "sub": "Version control · Pull request · Review",
  "pre": [
   "PS"
  ],
  "tag": [
   "Cỗ máy thời gian cho code, và cách các kỹ sư làm việc cùng nhau.",
   "A time machine for code, and the way engineers work together."
  ],
  "what": [
   "Git lưu lại mọi thay đổi của code để bạn quay lại bất kỳ thời điểm nào và làm việc song song trên nhiều nhánh. Quanh nó là quy trình nhóm: pull request, review code, quản lý công việc.",
   "Git records every change to your code so you can go back to any point in time and work on several branches in parallel. Around it sits the team workflow: pull requests, code review, task management."
  ],
  "why": [
   "Gần như mọi nhóm phần mềm đều làm việc qua Git. Hồ sơ GitHub cũng là nơi người khác nhìn vào để đánh giá bạn làm được gì.",
   "Almost every software team works through Git. Your GitHub profile is also where other people look to judge what you can do."
  ],
  "learn": [
   "commit, branch, merge, rebase",
   [
    "Làm việc với remote: clone, push, pull",
    "Working with remotes: clone, push, pull"
   ],
   [
    "Giải quyết xung đột (conflict)",
    "Resolving conflicts"
   ],
   [
    "Pull request và review code",
    "Pull requests and code review"
   ],
   [
    ".gitignore; không đưa dữ liệu lớn và khóa bí mật lên repo",
    ".gitignore; keeping large data and secret keys out of the repo"
   ],
   [
    "Viết README và commit message rõ ràng",
    "Writing clear READMEs and commit messages"
   ]
  ],
  "tools": [
   "Git",
   "GitHub",
   "GitHub Actions",
   "Markdown"
  ],
  "practice": [
   "Đưa mọi bài tập từ đầu lộ trình lên GitHub, mỗi dự án một repo có README.",
   "Put every exercise since the start of the roadmap on GitHub, one repo with a README per project."
  ],
  "done": [
   [
    "Tạo nhánh, mở pull request và xử lý conflict mà không sợ mất code",
    "You create branches, open pull requests and handle conflicts without fear of losing code"
   ],
   [
    "Lịch sử commit đọc được như một câu chuyện",
    "Your commit history reads like a story"
   ]
  ],
  "pit": [
   "Một commit duy nhất tên “update” chứa toàn bộ dự án.",
   "A single commit called “update” containing the whole project."
  ],
  "kind": "node"
 },
 {
  "id": "ML",
  "code": "ML",
  "tier": 2,
  "stage": 2,
  "lv": 3,
  "title": "Machine Learning",
  "sub": [
   "Hồi quy · Phân loại · SVM · Tree · RF · XGBoost",
   "Regression · Classification · SVM · Tree · RF · XGBoost"
  ],
  "pre": [
   "PY",
   "MATH",
   "DSA"
  ],
  "tag": [
   "Dạy máy tìm quy luật từ dữ liệu thay vì viết quy luật bằng tay.",
   "Teaching machines to find rules in data instead of writing the rules by hand."
  ],
  "what": [
   "Machine Learning là nhóm thuật toán học một hàm từ dữ liệu. Học có giám sát dùng dữ liệu có nhãn để dự đoán một con số (hồi quy) hoặc một nhóm (phân loại). Học không giám sát tìm cấu trúc ẩn như cụm hay chiều chính.",
   "Machine Learning is a family of algorithms that learn a function from data. Supervised learning uses labelled data to predict a number (regression) or a category (classification). Unsupervised learning finds hidden structure such as clusters or principal components."
  ],
  "why": [
   "Với dữ liệu dạng bảng, các mô hình cây tăng cường như XGBoost vẫn là lựa chọn mạnh trong thực tế. Quan trọng hơn, Machine Learning dạy quy trình chuẩn mà mọi nhánh AI đều dùng: chia dữ liệu, huấn luyện, đánh giá, chống overfitting.",
   "For tabular data, boosted tree models such as XGBoost are still a strong choice in practice. More importantly, Machine Learning teaches the standard workflow every branch of AI uses: splitting data, training, evaluating, guarding against overfitting."
  ],
  "learn": [
   [
    "Hồi quy tuyến tính và hồi quy logistic",
    "Linear regression and logistic regression"
   ],
   [
    "Cây quyết định, Random Forest, Gradient Boosting (XGBoost)",
    "Decision trees, Random Forest, Gradient Boosting (XGBoost)"
   ],
   "SVM, k-NN, Naive Bayes",
   [
    "Phân cụm k-means, giảm chiều bằng PCA",
    "Clustering with k-means, dimensionality reduction with PCA"
   ],
   [
    "Chia train / validation / test, cross-validation",
    "Train / validation / test splits, cross-validation"
   ],
   [
    "Overfitting, underfitting, regularization",
    "Overfitting, underfitting, regularisation"
   ],
   [
    "Chỉ số: accuracy, precision, recall, F1, ROC-AUC, RMSE",
    "Metrics: accuracy, precision, recall, F1, ROC-AUC, RMSE"
   ],
   [
    "Feature engineering, xử lý dữ liệu thiếu",
    "Feature engineering, handling missing data"
   ]
  ],
  "tools": [
   "scikit-learn",
   "XGBoost",
   "pandas",
   "Matplotlib",
   "Kaggle"
  ],
  "practice": [
   "Tham gia một cuộc thi Kaggle dạng bảng cho người mới (Titanic, House Prices) và viết lại toàn bộ quy trình thành một pipeline scikit-learn.",
   "Enter a beginner tabular Kaggle competition (Titanic, House Prices) and rewrite the whole process as a scikit-learn pipeline."
  ],
  "done": [
   [
    "Tự xây được pipeline từ dữ liệu thô tới mô hình có đánh giá chéo",
    "You can build a pipeline yourself, from raw data to a cross-validated model"
   ],
   [
    "Giải thích được vì sao điểm trên tập huấn luyện cao mà trên tập kiểm tra thấp, và cách xử lý",
    "You can explain why the score is high on the training set but low on the test set, and how to fix it"
   ],
   [
    "Chọn được chỉ số đánh giá phù hợp với bài toán",
    "You can choose an evaluation metric that fits the problem"
   ]
  ],
  "pit": [
   "Rò rỉ dữ liệu (data leakage): để thông tin của tập kiểm tra lọt vào lúc huấn luyện, khiến kết quả đẹp giả.",
   "Data leakage: letting information from the test set slip into training, which makes the results look falsely good."
  ],
  "kind": "node"
 },
 {
  "id": "DL",
  "code": "DL",
  "tier": 2,
  "stage": 3,
  "lv": 4,
  "title": "Deep Learning",
  "sub": "Neural Network · CNN · RNN · LSTM · Transformer",
  "pre": [
   "ML",
   "MATH"
  ],
  "tag": [
   "Mạng nơ-ron nhiều tầng tự học đặc trưng từ dữ liệu thô.",
   "Multi-layer neural networks that learn features from raw data by themselves."
  ],
  "what": [
   "Deep Learning dùng mạng nơ-ron nhiều tầng. Mỗi tầng biến dữ liệu thành biểu diễn trừu tượng hơn; cả mạng được huấn luyện bằng lan truyền ngược và gradient descent. Các kiến trúc chính: CNN cho ảnh, RNN/LSTM cho chuỗi, và Transformer cho hầu hết các bài toán hiện nay.",
   "Deep Learning uses neural networks with many layers. Each layer turns the data into a more abstract representation; the whole network is trained with backpropagation and gradient descent. The main architectures: CNNs for images, RNNs/LSTMs for sequences, and Transformers for most problems today."
  ],
  "why": [
   "Thị giác máy tính, mô hình ngôn ngữ lớn, AI tạo sinh đều xây trên Deep Learning. Đây là cánh cửa bắt buộc trước mọi hướng chuyên sâu.",
   "Computer vision, large language models and generative AI are all built on Deep Learning. It is the door you must go through before any specialisation."
  ],
  "learn": [
   [
    "Nơ-ron, hàm kích hoạt, hàm mất mát",
    "Neurons, activation functions, loss functions"
   ],
   [
    "Lan truyền ngược (backpropagation)",
    "Backpropagation"
   ],
   [
    "Bộ tối ưu: SGD, Momentum, Adam; learning rate",
    "Optimisers: SGD, Momentum, Adam; learning rate"
   ],
   [
    "Chống overfitting: dropout, weight decay, augmentation",
    "Fighting overfitting: dropout, weight decay, augmentation"
   ],
   [
    "Batch normalization, khởi tạo trọng số",
    "Batch normalisation, weight initialisation"
   ],
   [
    "CNN: tích chập, pooling, ResNet",
    "CNN: convolution, pooling, ResNet"
   ],
   [
    "RNN, LSTM và hạn chế với chuỗi dài",
    "RNN, LSTM and their limits on long sequences"
   ],
   [
    "Attention và kiến trúc Transformer",
    "Attention and the Transformer architecture"
   ],
   [
    "Transfer learning và fine-tuning",
    "Transfer learning and fine-tuning"
   ]
  ],
  "tools": [
   "PyTorch",
   "TensorFlow / Keras",
   "TensorBoard",
   "Google Colab",
   "GPU + CUDA"
  ],
  "practice": [
   "Viết vòng lặp huấn luyện PyTorch từ đầu cho MNIST, sau đó huấn luyện một CNN trên CIFAR-10 và theo dõi đường loss.",
   "Write a PyTorch training loop from scratch for MNIST, then train a CNN on CIFAR-10 and watch the loss curve."
  ],
  "done": [
   [
    "Viết được training loop mà không cần chép mẫu",
    "You can write a training loop without copying a template"
   ],
   [
    "Nhìn đường loss và đoán được vấn đề: learning rate, overfitting hay lỗi dữ liệu",
    "You can look at a loss curve and guess the problem: learning rate, overfitting or a data bug"
   ],
   [
    "Giải thích được attention ở mức ý tưởng",
    "You can explain attention conceptually"
   ]
  ],
  "pit": [
   "Chỉ gọi hàm huấn luyện có sẵn mà không hiểu bên trong. Hãy tự cài một mạng nhỏ bằng NumPy ít nhất một lần.",
   "Only calling ready-made training functions without understanding what happens inside. Implement a small network in NumPy yourself at least once."
  ],
  "kind": "node"
 },
 {
  "id": "RL",
  "code": "RL",
  "tier": 2,
  "stage": 6,
  "lv": 5,
  "title": "Reinforcement Learning",
  "sub": "Q-Learning · DQN · PPO",
  "pre": [
   "ML",
   "DL"
  ],
  "tag": [
   "Học bằng thử – sai: làm, nhận thưởng hoặc phạt, rồi làm tốt hơn.",
   "Learning by trial and error: act, get rewarded or penalised, then do better."
  ],
  "what": [
   "Trong học tăng cường, một tác tử (agent) tương tác với môi trường: quan sát trạng thái, chọn hành động, nhận phần thưởng. Mục tiêu là tìm chính sách tối đa hóa tổng phần thưởng về lâu dài. Không có đáp án mẫu, chỉ có tín hiệu thưởng.",
   "In reinforcement learning, an agent interacts with an environment: it observes the state, chooses an action and receives a reward. The goal is to find a policy that maximises total reward over the long run. There are no model answers, only a reward signal."
  ],
  "why": [
   "Đây là nền của AI chơi game, điều khiển robot, và một phần quá trình tinh chỉnh mô hình ngôn ngữ theo phản hồi của con người. Bắt buộc nếu bạn đi hướng Robotics.",
   "It underpins game-playing AI, robot control, and part of the process of fine-tuning language models on human feedback. Required if you take the Robotics track."
  ],
  "note": [
   "Trong lộ trình thời gian, ô này xếp ở giai đoạn 6 vì chủ yếu phục vụ Robotics. Học sớm hơn, ngay sau Deep Learning, cũng được.",
   "In the timeline, this tile sits in stage 6 because it mainly serves Robotics. Learning it earlier, right after Deep Learning, is fine too."
  ],
  "learn": [
   "Agent, environment, state, action, reward",
   [
    "Quá trình quyết định Markov (MDP), phương trình Bellman",
    "Markov decision processes (MDP), the Bellman equation"
   ],
   [
    "Khám phá và khai thác (exploration – exploitation)",
    "Exploration and exploitation"
   ],
   [
    "Q-Learning và Deep Q-Network (DQN)",
    "Q-Learning and Deep Q-Network (DQN)"
   ],
   "Policy gradient, Actor-Critic",
   [
    "PPO, thuật toán được dùng rộng rãi trong thực hành",
    "PPO, an algorithm widely used in practice"
   ],
   [
    "Thiết kế hàm thưởng",
    "Designing reward functions"
   ]
  ],
  "tools": [
   "Gymnasium",
   "Stable-Baselines3",
   "PyTorch",
   "MuJoCo",
   "Isaac Lab"
  ],
  "practice": [
   "Huấn luyện tác tử giải CartPole bằng DQN, rồi LunarLander bằng PPO với Stable-Baselines3.",
   "Train an agent to solve CartPole with DQN, then LunarLander with PPO using Stable-Baselines3."
  ],
  "done": [
   [
    "Mô tả được một bài toán dưới dạng trạng thái – hành động – phần thưởng",
    "You can describe a problem in terms of state – action – reward"
   ],
   [
    "Hiểu vì sao học tăng cường khó ổn định và cần rất nhiều lượt thử",
    "You understand why reinforcement learning is hard to stabilise and needs a great many trials"
   ]
  ],
  "pit": [
   "Thiết kế hàm thưởng sơ sài: tác tử sẽ tìm cách “ăn gian” phần thưởng thay vì làm điều bạn muốn.",
   "A sloppy reward function: the agent will find ways to “game” the reward instead of doing what you want."
  ],
  "kind": "node"
 },
 {
  "id": "CV",
  "code": "CV",
  "tier": 3,
  "stage": 4,
  "lv": 4,
  "title": "Computer Vision",
  "sub": [
   "Phân loại ảnh · YOLO · Segmentation · Tracking · OCR",
   "Image classification · YOLO · Segmentation · Tracking · OCR"
  ],
  "pre": [
   "DL"
  ],
  "tag": [
   "Dạy máy nhìn và hiểu ảnh, video.",
   "Teaching machines to see and understand images and video."
  ],
  "what": [
   "Thị giác máy tính trích xuất thông tin từ ảnh và video. Các bài toán chính tăng dần độ chi tiết: ảnh này là gì (phân loại), vật ở đâu (phát hiện), từng điểm ảnh thuộc vật nào (phân đoạn), vật di chuyển thế nào (theo dõi), chữ trong ảnh là gì (OCR).",
   "Computer vision extracts information from images and video. The main tasks, in increasing detail: what the image shows (classification), where the objects are (detection), which object each pixel belongs to (segmentation), how objects move (tracking), and what text the image contains (OCR)."
  ],
  "why": [
   "Camera có ở khắp nơi: nhà máy, giao thông, y tế, bán lẻ, robot. Đây là một trong những mảng AI có nhiều ứng dụng công nghiệp nhất.",
   "Cameras are everywhere: factories, traffic, healthcare, retail, robots. This is one of the areas of AI with the most industrial applications."
  ],
  "learn": [
   [
    "Xử lý ảnh cơ bản: không gian màu, bộ lọc, biến đổi hình học",
    "Basic image processing: colour spaces, filters, geometric transforms"
   ],
   [
    "Phân loại ảnh với CNN và Vision Transformer",
    "Image classification with CNNs and Vision Transformers"
   ],
   [
    "Phát hiện đối tượng: họ YOLO, hộp bao, NMS",
    "Object detection: the YOLO family, bounding boxes, NMS"
   ],
   [
    "Phân đoạn: semantic và instance",
    "Segmentation: semantic and instance"
   ],
   [
    "Theo dõi đối tượng (tracking)",
    "Object tracking"
   ],
   [
    "OCR, ước lượng tư thế (pose)",
    "OCR, pose estimation"
   ],
   [
    "Chỉ số IoU, mAP",
    "IoU and mAP metrics"
   ],
   [
    "Gán nhãn và tăng cường dữ liệu ảnh",
    "Labelling and augmenting image data"
   ]
  ],
  "tools": [
   "OpenCV",
   "torchvision",
   "Ultralytics YOLO",
   "Albumentations",
   "CVAT / Roboflow",
   "PaddleOCR"
  ],
  "practice": [
   "Huấn luyện YOLO phát hiện một loại vật thể do bạn tự chụp và gán nhãn, rồi chạy trên webcam theo thời gian thực.",
   "Train YOLO to detect a type of object you have photographed and labelled yourself, then run it on a webcam in real time."
  ],
  "done": [
   [
    "Chọn đúng loại bài toán (phân loại, phát hiện hay phân đoạn) cho một yêu cầu thực tế",
    "You pick the right kind of task (classification, detection or segmentation) for a real-world requirement"
   ],
   [
    "Đọc được mAP và chỉ ra mô hình sai ở đâu",
    "You can read mAP and point out where the model goes wrong"
   ]
  ],
  "pit": [
   "Dồn thời gian chỉnh mô hình trong khi vấn đề nằm ở dữ liệu: nhãn sai, thiếu ảnh ở điều kiện ánh sáng thật.",
   "Pouring time into tuning the model when the problem is in the data: wrong labels, too few images in real lighting conditions."
  ],
  "kind": "node"
 },
 {
  "id": "NLP",
  "code": "NLP",
  "tier": 3,
  "stage": 4,
  "lv": 4,
  "title": "NLP & LLM",
  "sub": [
   "Tokenization · Embedding · Transformer · Fine-tune · RAG",
   "Tokenisation · Embedding · Transformer · Fine-tune · RAG"
  ],
  "pre": [
   "DL"
  ],
  "tag": [
   "Dạy máy đọc, hiểu và viết ngôn ngữ con người.",
   "Teaching machines to read, understand and write human language."
  ],
  "what": [
   "Xử lý ngôn ngữ tự nhiên biến văn bản thành số (token, embedding) để mô hình xử lý. Mô hình ngôn ngữ lớn (LLM) là Transformer được huấn luyện trên lượng văn bản khổng lồ để dự đoán token tiếp theo; từ đó nó tóm tắt, dịch, hỏi đáp, viết code.",
   "Natural language processing turns text into numbers (tokens, embeddings) so a model can process it. A large language model (LLM) is a Transformer trained on a huge amount of text to predict the next token; from that it can summarise, translate, answer questions and write code."
  ],
  "why": [
   "LLM là trung tâm của làn sóng AI hiện tại. Biết gọi API là chưa đủ: kỹ sư cần hiểu token, context window, embedding và RAG để xây sản phẩm đáng tin.",
   "LLMs are at the centre of the current AI wave. Knowing how to call an API is not enough: engineers need to understand tokens, context windows, embeddings and RAG to build reliable products."
  ],
  "learn": [
   [
    "Tokenization (BPE) và vì sao chi phí tính theo token",
    "Tokenisation (BPE) and why cost is counted in tokens"
   ],
   [
    "Embedding và tìm kiếm theo ngữ nghĩa",
    "Embeddings and semantic search"
   ],
   "Transformer: self-attention, encoder, decoder",
   [
    "Tiền huấn luyện và fine-tuning; LoRA",
    "Pre-training and fine-tuning; LoRA"
   ],
   [
    "Prompt engineering, đầu ra có cấu trúc",
    "Prompt engineering, structured output"
   ],
   [
    "RAG: truy xuất tài liệu rồi mới sinh câu trả lời",
    "RAG: retrieving documents before generating the answer"
   ],
   [
    "Ảo giác (hallucination) và cách đánh giá LLM",
    "Hallucination and how to evaluate LLMs"
   ]
  ],
  "tools": [
   "Hugging Face Transformers",
   "sentence-transformers",
   "FAISS / Chroma",
   [
    "API của các LLM",
    "LLM APIs"
   ],
   "Ollama"
  ],
  "practice": [
   "Xây hệ hỏi đáp trên bộ tài liệu của riêng bạn bằng RAG, có trích nguồn cho từng câu trả lời.",
   "Build a question-answering system over your own documents with RAG, citing sources for every answer."
  ],
  "done": [
   [
    "Giải thích được token, context window và embedding cho người ngoài ngành",
    "You can explain tokens, context windows and embeddings to someone outside the field"
   ],
   [
    "Biết khi nào dùng prompt, khi nào RAG, khi nào fine-tune",
    "You know when to use prompting, when to use RAG and when to fine-tune"
   ]
  ],
  "pit": [
   "Tin câu trả lời của LLM mà không có bộ câu hỏi kiểm thử. Không đo thì không biết hệ thống tốt lên hay tệ đi.",
   "Trusting LLM answers without a set of test questions. If you do not measure, you cannot tell whether the system is getting better or worse."
  ],
  "kind": "node"
 },
 {
  "id": "GEN",
  "code": "GEN",
  "tier": 3,
  "stage": 4,
  "lv": 4,
  "title": "Generative AI",
  "sub": "GAN · Diffusion · Stable Diffusion · Sora",
  "pre": [
   "DL",
   "CV"
  ],
  "tag": [
   "Mô hình không chỉ nhận diện mà còn tạo ra nội dung mới.",
   "Models that do not just recognise things but also create new content."
  ],
  "what": [
   "AI tạo sinh học phân phối của dữ liệu để sinh ra mẫu mới: ảnh, video, âm thanh, văn bản. GAN cho hai mạng đấu nhau, một sinh ảnh và một phân biệt thật – giả. Mô hình khuếch tán (diffusion) học cách khử nhiễu từng bước để biến nhiễu ngẫu nhiên thành ảnh; đây là nền của Stable Diffusion và các mô hình sinh video như Sora.",
   "Generative AI learns the distribution of the data in order to produce new samples: images, video, audio, text. A GAN pits two networks against each other, one generating images and one telling real from fake. Diffusion models learn to remove noise step by step, turning random noise into an image; this is the basis of Stable Diffusion and of video models such as Sora."
  ],
  "why": [
   "Thiết kế, quảng cáo, game, phim đang đưa công cụ tạo sinh vào quy trình làm việc. Kỹ sư hiểu cơ chế sẽ điều khiển được kết quả thay vì chỉ thử prompt.",
   "Design, advertising, games and film are bringing generative tools into their workflows. Engineers who understand the mechanics can steer the results instead of just trying prompts."
  ],
  "learn": [
   [
    "Mô hình sinh khác mô hình phân biệt thế nào",
    "How generative models differ from discriminative models"
   ],
   [
    "GAN: generator, discriminator, vì sao khó huấn luyện",
    "GANs: generator, discriminator, why they are hard to train"
   ],
   [
    "VAE và không gian tiềm ẩn (latent space)",
    "VAEs and latent space"
   ],
   [
    "Diffusion: quá trình thêm nhiễu và khử nhiễu",
    "Diffusion: adding noise and removing it"
   ],
   [
    "Latent diffusion, điều kiện hóa bằng văn bản",
    "Latent diffusion, text conditioning"
   ],
   [
    "Điều khiển đầu ra: ControlNet, LoRA",
    "Controlling the output: ControlNet, LoRA"
   ],
   [
    "Sinh video và các giới hạn hiện tại",
    "Video generation and its current limits"
   ],
   [
    "Bản quyền, deepfake và trách nhiệm khi sử dụng",
    "Copyright, deepfakes and responsible use"
   ]
  ],
  "tools": [
   "Hugging Face Diffusers",
   "Stable Diffusion",
   "ComfyUI",
   "PyTorch"
  ],
  "practice": [
   "Fine-tune một LoRA cho Stable Diffusion theo phong cách của riêng bạn và dựng thành một công cụ sinh ảnh nhỏ.",
   "Fine-tune a LoRA for Stable Diffusion in your own style and turn it into a small image generation tool."
  ],
  "done": [
   [
    "Giải thích được diffusion bằng lời, không cần công thức",
    "You can explain diffusion in words, without formulas"
   ],
   [
    "Điều khiển được bố cục và phong cách ảnh sinh ra ở mức cơ bản",
    "You can control the layout and style of generated images at a basic level"
   ]
  ],
  "pit": [
   "Dùng dữ liệu hoặc khuôn mặt của người khác khi chưa có quyền. Vấn đề pháp lý và đạo đức ở mảng này là thật.",
   "Using other people’s data or faces without permission. The legal and ethical issues in this area are real."
  ],
  "kind": "node"
 },
 {
  "id": "MM",
  "code": "MM",
  "tier": 3,
  "stage": 4,
  "lv": 4,
  "title": "Multimodal AI",
  "sub": "Vision-Language · Text – Image – Audio – Video",
  "pre": [
   "CV",
   "NLP"
  ],
  "tag": [
   "Một mô hình hiểu cùng lúc chữ, ảnh, âm thanh và video.",
   "One model that understands text, images, audio and video at the same time."
  ],
  "what": [
   "AI đa phương thức đưa nhiều loại dữ liệu về chung một không gian biểu diễn để mô hình liên hệ được chúng với nhau: mô tả ảnh bằng lời, trả lời câu hỏi về video, tìm ảnh bằng câu chữ. CLIP nối ảnh với văn bản; các mô hình ngôn ngữ – thị giác (VLM) ghép bộ mã hóa ảnh vào LLM.",
   "Multimodal AI maps several kinds of data into one shared representation space so the model can relate them to each other: describing images in words, answering questions about video, finding images from a sentence. CLIP links images with text; vision-language models (VLMs) attach an image encoder to an LLM."
  ],
  "why": [
   "Thế giới thật không chỉ có văn bản. Trợ lý đọc ảnh chụp màn hình, robot nghe lệnh rồi nhìn để làm theo, tìm kiếm trong video: tất cả đều cần đa phương thức.",
   "The real world is not just text. Assistants that read screenshots, robots that hear a command and then look to carry it out, search inside video: all of these need multimodality."
  ],
  "learn": [
   [
    "Không gian embedding chung giữa các phương thức",
    "Shared embedding spaces across modalities"
   ],
   [
    "CLIP và học tương phản (contrastive learning)",
    "CLIP and contrastive learning"
   ],
   [
    "Mô hình ngôn ngữ – thị giác: mô tả ảnh, hỏi đáp trên ảnh",
    "Vision-language models: image captioning, visual question answering"
   ],
   [
    "Nhận dạng giọng nói (ASR) và tổng hợp giọng nói (TTS)",
    "Speech recognition (ASR) and speech synthesis (TTS)"
   ],
   [
    "Hiểu tài liệu: bảng, biểu đồ, bản scan",
    "Document understanding: tables, charts, scans"
   ],
   [
    "Đánh giá mô hình đa phương thức",
    "Evaluating multimodal models"
   ]
  ],
  "tools": [
   "CLIP",
   "Whisper",
   "LLaVA",
   "Hugging Face Transformers"
  ],
  "practice": [
   "Xây công cụ tìm ảnh bằng câu mô tả trên thư viện ảnh cá nhân, dùng embedding kiểu CLIP (chọn bản đa ngôn ngữ nếu muốn gõ tiếng Việt).",
   "Build a tool that searches your personal photo library by text description, using CLIP-style embeddings (pick a multilingual version if you want to type in Vietnamese)."
  ],
  "done": [
   [
    "Giải thích được vì sao ảnh và chữ lại so sánh được với nhau",
    "You can explain why images and text can be compared with each other"
   ],
   [
    "Ghép được mô hình thị giác và mô hình ngôn ngữ trong một ứng dụng",
    "You can combine a vision model and a language model in one application"
   ]
  ],
  "pit": [
   "Cho rằng mô hình “nhìn” như người. VLM vẫn dễ sai ở việc đếm, đọc chữ nhỏ và quan hệ không gian.",
   "Assuming the model “sees” the way people do. VLMs still often get counting, small text and spatial relationships wrong."
  ],
  "kind": "node"
 },
 {
  "id": "AGT",
  "code": "AGT",
  "tier": 3,
  "stage": 6,
  "lv": 4,
  "title": "AI Agent",
  "sub": "LangChain · AutoGen · Tool Use · MCP",
  "pre": [
   "NLP"
  ],
  "tag": [
   "LLM không chỉ trả lời mà còn tự lên kế hoạch và dùng công cụ để làm việc.",
   "An LLM that does not just answer but also plans for itself and uses tools to get work done."
  ],
  "what": [
   "Tác tử AI đặt LLM vào một vòng lặp: nhận mục tiêu, suy nghĩ, gọi công cụ (tìm kiếm, chạy code, truy vấn cơ sở dữ liệu), xem kết quả rồi quyết định bước tiếp theo. MCP (Model Context Protocol) là một chuẩn mở để kết nối mô hình với công cụ và nguồn dữ liệu theo cùng một cách.",
   "An AI agent puts an LLM inside a loop: take a goal, think, call tools (search, run code, query a database), look at the result, then decide the next step. MCP (Model Context Protocol) is an open standard for connecting models to tools and data sources in one consistent way."
  ],
  "why": [
   "Đây là hướng đưa LLM từ “trả lời câu hỏi” sang “hoàn thành công việc”. Xây agent đòi hỏi kỹ năng kỹ thuật phần mềm nhiều hơn là huấn luyện mô hình.",
   "This is what takes LLMs from “answering questions” to “getting work done”. Building agents calls for software engineering skills more than model training."
  ],
  "learn": [
   "Function calling / tool use",
   [
    "Vòng lặp suy luận – hành động (ReAct)",
    "The reasoning – acting loop (ReAct)"
   ],
   [
    "Bộ nhớ ngắn hạn, dài hạn và quản lý ngữ cảnh",
    "Short-term and long-term memory, context management"
   ],
   [
    "Lập kế hoạch và chia việc cho nhiều agent",
    "Planning and splitting work across multiple agents"
   ],
   [
    "MCP: máy chủ cung cấp công cụ, tài nguyên, prompt",
    "MCP: servers that provide tools, resources, prompts"
   ],
   [
    "Rào chắn an toàn, phân quyền, xác nhận của con người",
    "Safety guardrails, permissions, human confirmation"
   ],
   [
    "Đánh giá agent: tỉ lệ hoàn thành nhiệm vụ, chi phí, độ trễ",
    "Evaluating agents: task completion rate, cost, latency"
   ]
  ],
  "tools": [
   "LangChain / LangGraph",
   "AutoGen",
   "MCP SDK",
   [
    "API có tool use",
    "APIs with tool use"
   ]
  ],
  "practice": [
   "Xây một agent nghiên cứu: nhận câu hỏi, tự tìm kiếm web, đọc tài liệu và viết báo cáo có trích nguồn.",
   "Build a research agent: it takes a question, searches the web on its own, reads documents and writes a report with citations."
  ],
  "done": [
   [
    "Thiết kế được bộ công cụ rõ ràng cho agent",
    "You can design a clear set of tools for an agent"
   ],
   [
    "Giới hạn được quyền của agent và ghi lại mọi hành động của nó",
    "You can limit an agent’s permissions and log every action it takes"
   ]
  ],
  "pit": [
   "Cho agent quá nhiều quyền ngay từ đầu. Agent có thể xóa file hay gửi email thì phải có bước xác nhận.",
   "Giving an agent too many permissions from the start. If an agent can delete files or send emails, it needs a confirmation step."
  ],
  "kind": "node"
 },
 {
  "id": "DE",
  "code": "DE",
  "tier": 4,
  "stage": 5,
  "lv": 3,
  "title": "Data Engineering",
  "sub": [
   "Thu thập · Xử lý · Pipeline · Data Lake",
   "Collection · Processing · Pipeline · Data Lake"
  ],
  "pre": [
   "PY",
   "DB"
  ],
  "tag": [
   "Đường ống đưa dữ liệu sạch, đúng giờ tới mô hình.",
   "The pipes that deliver clean data to models on time."
  ],
  "what": [
   "Kỹ thuật dữ liệu lo việc thu thập dữ liệu từ nhiều nguồn, làm sạch, biến đổi và lưu trữ để các nhóm khác dùng được. Sản phẩm là các pipeline chạy tự động, theo lô (batch) hoặc theo dòng (streaming).",
   "Data engineering takes care of collecting data from many sources, cleaning it, transforming it and storing it so other teams can use it. The output is automated pipelines, running in batches or as streams."
  ],
  "why": [
   "Mô hình không thể tốt hơn dữ liệu nó được học. Dự án AI thường vướng ở dữ liệu trước khi vướng ở mô hình.",
   "A model cannot be better than the data it learns from. AI projects usually get stuck on data before they get stuck on the model."
  ],
  "learn": [
   [
    "ETL và ELT",
    "ETL and ELT"
   ],
   [
    "Xử lý theo lô và theo dòng",
    "Batch and stream processing"
   ],
   [
    "Data lake và data warehouse khác nhau thế nào",
    "How a data lake differs from a data warehouse"
   ],
   [
    "Định dạng lưu trữ: Parquet, phân vùng dữ liệu",
    "Storage formats: Parquet, data partitioning"
   ],
   [
    "Điều phối pipeline theo lịch",
    "Scheduling and orchestrating pipelines"
   ],
   [
    "Kiểm tra chất lượng dữ liệu",
    "Data quality checks"
   ],
   [
    "Gán nhãn và quản lý phiên bản dữ liệu",
    "Data labelling and versioning"
   ]
  ],
  "tools": [
   "pandas / Polars",
   "Apache Spark",
   "Apache Airflow",
   "Kafka",
   "Parquet",
   "S3 / MinIO"
  ],
  "practice": [
   "Dựng pipeline chạy hằng ngày: lấy dữ liệu từ một API công khai, làm sạch, lưu Parquet và cập nhật một bảng tổng hợp.",
   "Build a daily pipeline: pull data from a public API, clean it, store it as Parquet and update a summary table."
  ],
  "done": [
   [
    "Pipeline chạy lại nhiều lần mà không sinh dữ liệu trùng",
    "The pipeline can rerun many times without creating duplicate data"
   ],
   [
    "Phát hiện được dữ liệu bất thường trước khi nó tới mô hình",
    "You catch anomalous data before it reaches the model"
   ]
  ],
  "pit": [
   "Xử lý dữ liệu bằng tay trong notebook, để rồi lần sau không ai, kể cả bạn, tái tạo lại được.",
   "Processing data by hand in a notebook, so that next time nobody, not even you, can reproduce it."
  ],
  "kind": "node"
 },
 {
  "id": "OPS",
  "code": "OPS",
  "tier": 4,
  "stage": 5,
  "lv": 4,
  "title": "MLOps",
  "sub": "Train – Deploy – Monitor · MLflow · DVC · Airflow",
  "pre": [
   "ML",
   "GIT",
   "DE"
  ],
  "tag": [
   "Đưa kỷ luật của kỹ thuật phần mềm vào vòng đời mô hình.",
   "Bringing software engineering discipline to the model lifecycle."
  ],
  "what": [
   "MLOps là tập hợp các thực hành để mô hình được huấn luyện, kiểm thử, triển khai và theo dõi một cách tự động, lặp lại được. Nó quản lý ba thứ cùng thay đổi: code, dữ liệu và mô hình.",
   "MLOps is a set of practices for training, testing, deploying and monitoring models in an automated, repeatable way. It manages three things that change together: code, data and models."
  ],
  "why": [
   "Mô hình xuống cấp theo thời gian vì dữ liệu ngoài đời thay đổi. Không có MLOps, mỗi lần cập nhật là một lần làm thủ công và cầu may.",
   "Models degrade over time because real-world data changes. Without MLOps, every update is a manual job and a gamble."
  ],
  "learn": [
   [
    "Theo dõi thí nghiệm: tham số, chỉ số, artifact",
    "Experiment tracking: parameters, metrics, artifacts"
   ],
   [
    "Model registry và phiên bản mô hình",
    "Model registry and model versioning"
   ],
   [
    "Quản lý phiên bản dữ liệu",
    "Data versioning"
   ],
   [
    "Pipeline huấn luyện tự động",
    "Automated training pipelines"
   ],
   [
    "CI/CD cho Machine Learning",
    "CI/CD for Machine Learning"
   ],
   [
    "Giám sát: độ trễ, lỗi, chất lượng dự đoán",
    "Monitoring: latency, errors, prediction quality"
   ],
   [
    "Trôi dữ liệu (data drift) và huấn luyện lại",
    "Data drift and retraining"
   ]
  ],
  "tools": [
   "MLflow",
   "DVC",
   "Apache Airflow",
   "GitHub Actions",
   "Prometheus + Grafana",
   "Evidently"
  ],
  "practice": [
   "Lấy một mô hình đã có, thêm MLflow để theo dõi thí nghiệm và dựng pipeline huấn luyện lại chạy bằng một lệnh.",
   "Take an existing model, add MLflow for experiment tracking and build a retraining pipeline that runs with a single command."
  ],
  "done": [
   [
    "Tái tạo được bất kỳ mô hình nào đã huấn luyện: đúng code, đúng dữ liệu, đúng tham số",
    "You can reproduce any model you have trained: same code, same data, same parameters"
   ],
   [
    "Có cảnh báo khi chất lượng mô hình trên dữ liệu mới giảm",
    "You get an alert when model quality drops on new data"
   ]
  ],
  "pit": [
   "Dựng hạ tầng phức tạp trước khi có mô hình nào chạy thật. Bắt đầu nhỏ, tự động hóa thứ đang gây đau nhất.",
   "Building complex infrastructure before any model is running for real. Start small and automate whatever hurts most."
  ],
  "kind": "node"
 },
 {
  "id": "DEP",
  "code": "DEP",
  "tier": 4,
  "stage": 5,
  "lv": 3,
  "title": [
   "Triển khai mô hình",
   "Model deployment"
  ],
  "sub": "FastAPI · Docker · ONNX · TensorRT",
  "pre": [
   "OPS",
   "OS"
  ],
  "tag": [
   "Biến file trọng số thành dịch vụ người khác gọi được.",
   "Turning a weights file into a service other people can call."
  ],
  "what": [
   "Triển khai là đóng gói mô hình thành dịch vụ: nhận yêu cầu, chạy suy luận, trả kết quả. Thường gồm một API (FastAPI), một container (Docker) để chạy giống nhau ở mọi nơi, và một định dạng mô hình tối ưu cho suy luận (ONNX, TensorRT).",
   "Deployment means packaging a model as a service: take a request, run inference, return the result. It usually involves an API (FastAPI), a container (Docker) so it runs the same everywhere, and a model format optimised for inference (ONNX, TensorRT)."
  ],
  "why": [
   "Đây là lúc mô hình bắt đầu tạo ra giá trị. Kỹ năng này phân biệt AI Engineer với người chỉ làm trên notebook.",
   "This is where a model starts to create value. This skill is what separates an AI Engineer from someone who only works in notebooks."
  ],
  "learn": [
   [
    "Thiết kế API suy luận với FastAPI",
    "Designing inference APIs with FastAPI"
   ],
   [
    "Docker: image, container, Dockerfile",
    "Docker: images, containers, Dockerfiles"
   ],
   [
    "Xuất mô hình sang ONNX",
    "Exporting models to ONNX"
   ],
   [
    "Runtime suy luận: ONNX Runtime, TensorRT, Triton",
    "Inference runtimes: ONNX Runtime, TensorRT, Triton"
   ],
   [
    "Suy luận trực tuyến và theo lô",
    "Online and batch inference"
   ],
   [
    "Độ trễ, thông lượng, batching",
    "Latency, throughput, batching"
   ],
   [
    "Triển khai lên cloud; phiên bản và rollback",
    "Deploying to the cloud; versioning and rollback"
   ]
  ],
  "tools": [
   "FastAPI",
   "Docker",
   "ONNX Runtime",
   "TensorRT",
   "Triton Inference Server",
   "Gradio"
  ],
  "practice": [
   "Đóng gói một mô hình phân loại ảnh thành API trong Docker, đo độ trễ trước và sau khi chuyển sang ONNX.",
   "Package an image classification model as an API in Docker, and measure latency before and after converting it to ONNX."
  ],
  "done": [
   [
    "Người khác chạy được dịch vụ của bạn bằng một lệnh docker run",
    "Someone else can run your service with a single docker run command"
   ],
   [
    "Biết dịch vụ chịu được bao nhiêu yêu cầu mỗi giây",
    "You know how many requests per second your service can handle"
   ]
  ],
  "pit": [
   "Môi trường huấn luyện và môi trường chạy thật khác nhau (phiên bản thư viện, bước tiền xử lý) làm kết quả lệch mà không báo lỗi.",
   "Training and production environments that differ (library versions, preprocessing steps), which skews results without raising any error."
  ],
  "kind": "node"
 },
 {
  "id": "OPT",
  "code": "OPT",
  "tier": 4,
  "stage": 5,
  "lv": 4,
  "title": [
   "Tối ưu & Vận hành",
   "Optimisation & operations"
  ],
  "sub": [
   "Quantization · Pruning · Scaling",
   "Quantisation · Pruning · Scaling"
  ],
  "pre": [
   "DEP",
   "DL"
  ],
  "tag": [
   "Nhanh hơn, nhẹ hơn, rẻ hơn mà vẫn đủ chính xác.",
   "Faster, lighter, cheaper, and still accurate enough."
  ],
  "what": [
   "Tối ưu mô hình giảm kích thước và thời gian suy luận: lượng tử hóa (dùng số 8 bit thay cho 32 bit), cắt tỉa (bỏ trọng số ít quan trọng), chưng cất (dạy mô hình nhỏ bắt chước mô hình lớn). Vận hành lo việc hệ thống co giãn theo tải và kiểm soát chi phí.",
   "Model optimisation cuts size and inference time: quantisation (using 8-bit numbers instead of 32-bit), pruning (removing less important weights), distillation (teaching a small model to imitate a large one). Operations covers scaling the system with load and keeping costs under control."
  ],
  "why": [
   "GPU đắt. Mô hình nhanh hơn nghĩa là cần ít máy hơn cho cùng lượng yêu cầu, và nhiều khi là điều kiện để chạy được trên thiết bị nhỏ.",
   "GPUs are expensive. A faster model means fewer machines for the same number of requests, and is often what makes it possible to run on small devices."
  ],
  "learn": [
   [
    "Lượng tử hóa: sau huấn luyện và trong huấn luyện",
    "Quantisation: post-training and during training"
   ],
   [
    "Cắt tỉa (pruning)",
    "Pruning"
   ],
   [
    "Chưng cất tri thức (knowledge distillation)",
    "Knowledge distillation"
   ],
   [
    "Đo đạc và tìm điểm nghẽn (profiling)",
    "Profiling and finding bottlenecks"
   ],
   [
    "Batching, lưu đệm kết quả",
    "Batching, caching results"
   ],
   [
    "Tự động co giãn (autoscaling), cân bằng tải",
    "Autoscaling, load balancing"
   ],
   [
    "Theo dõi chi phí; đánh đổi độ chính xác và tốc độ",
    "Tracking costs; trading accuracy against speed"
   ]
  ],
  "tools": [
   "ONNX Runtime",
   "TensorRT",
   "PyTorch quantization",
   "Kubernetes",
   "Locust / k6"
  ],
  "practice": [
   "Lượng tử hóa một mô hình xuống INT8 và lập bảng so sánh kích thước, độ trễ, độ chính xác trước – sau.",
   "Quantise a model to INT8 and make a table comparing size, latency and accuracy before and after."
  ],
  "done": [
   [
    "Đưa ra được con số: tối ưu này đổi bao nhiêu độ chính xác lấy bao nhiêu tốc độ",
    "You can put numbers on it: how much accuracy this optimisation trades for how much speed"
   ],
   [
    "Tìm điểm nghẽn bằng đo đạc chứ không đoán",
    "You find bottlenecks by measuring, not guessing"
   ]
  ],
  "pit": [
   "Tối ưu trước khi đo. Điểm nghẽn thường nằm ở tiền xử lý hoặc đọc ghi dữ liệu, không phải ở mô hình.",
   "Optimising before measuring. The bottleneck is often in preprocessing or data reads and writes, not in the model."
  ],
  "kind": "node"
 },
 {
  "id": "ROB",
  "code": "ROB",
  "tier": 5,
  "stage": 6,
  "lv": 5,
  "title": "Robotics & Embodied AI",
  "sub": [
   "ROS 2 · SLAM · Điều khiển · Cảm biến",
   "ROS 2 · SLAM · Control · Sensors"
  ],
  "pre": [
   "CV",
   "RL",
   "EDGE"
  ],
  "tag": [
   "AI có cơ thể: cảm nhận, quyết định và hành động trong thế giới vật lý.",
   "AI with a body: sensing, deciding and acting in the physical world."
  ],
  "what": [
   "Robot chạy một vòng lặp liên tục: cảm nhận (camera, LiDAR, IMU), định vị và dựng bản đồ (SLAM), lập kế hoạch, rồi điều khiển động cơ. ROS 2 là bộ khung phần mềm phổ biến để các phần này trao đổi với nhau. Embodied AI đưa mô hình học sâu vào chính vòng lặp đó.",
   "A robot runs a continuous loop: sense (camera, LiDAR, IMU), localise and map (SLAM), plan, then drive the motors. ROS 2 is a widely used software framework that lets these parts talk to each other. Embodied AI puts deep learning models into that loop itself."
  ],
  "why": [
   "Xe tự hành, robot kho hàng, drone, robot hình người là nơi AI gặp vật lý. Mảng này cần người hiểu cả mô hình lẫn hệ thống thời gian thực.",
   "Self-driving cars, warehouse robots, drones and humanoid robots are where AI meets physics. This area needs people who understand both models and real-time systems."
  ],
  "learn": [
   [
    "ROS 2: node, topic, service, action",
    "ROS 2: nodes, topics, services, actions"
   ],
   [
    "Cảm biến: camera, LiDAR, IMU, encoder",
    "Sensors: cameras, LiDAR, IMU, encoders"
   ],
   [
    "Động học và điều khiển PID",
    "Kinematics and PID control"
   ],
   [
    "SLAM: vừa định vị vừa dựng bản đồ",
    "SLAM: localising and mapping at the same time"
   ],
   [
    "Lập kế hoạch đường đi",
    "Path planning"
   ],
   [
    "Mô phỏng và chuyển từ mô phỏng ra thực tế (sim-to-real)",
    "Simulation and moving from simulation to reality (sim-to-real)"
   ],
   [
    "Mô hình thị giác – ngôn ngữ – hành động (VLA)",
    "Vision-language-action models (VLA)"
   ]
  ],
  "tools": [
   "ROS 2",
   "Gazebo",
   "NVIDIA Isaac Sim",
   "Nav2",
   "OpenCV"
  ],
  "practice": [
   "Trong Gazebo, cho một robot di động tự dựng bản đồ căn phòng rồi tự đi tới điểm chỉ định bằng Nav2.",
   "In Gazebo, have a mobile robot map a room by itself and then drive to a given point on its own using Nav2."
  ],
  "done": [
   [
    "Dựng được hệ ROS 2 có nhiều node trao đổi dữ liệu cảm biến",
    "You can build a ROS 2 system with several nodes exchanging sensor data"
   ],
   [
    "Hiểu vì sao thứ chạy tốt trong mô phỏng lại hỏng ngoài đời",
    "You understand why something that works well in simulation breaks in the real world"
   ]
  ],
  "pit": [
   "Bỏ qua mô phỏng và thử thẳng trên phần cứng: chậm, đắt và dễ hỏng thiết bị.",
   "Skipping simulation and testing straight on hardware: it is slow, expensive and easily damages equipment."
  ],
  "kind": "node"
 },
 {
  "id": "EDGE",
  "code": "EDGE",
  "tier": 5,
  "stage": 6,
  "lv": 4,
  "title": "Edge AI & IoT",
  "sub": "Jetson · Raspberry Pi · ESP32 · TinyML",
  "pre": [
   "DL",
   "OPT",
   "OS"
  ],
  "tag": [
   "Chạy AI ngay trên thiết bị, không cần gửi dữ liệu lên máy chủ.",
   "Running AI on the device itself, without sending data to a server."
  ],
  "what": [
   "Edge AI đưa mô hình xuống thiết bị gần nơi sinh ra dữ liệu: máy tính nhúng có GPU (Jetson), máy tính một bo mạch (Raspberry Pi), hay vi điều khiển chỉ có vài trăm kilobyte RAM (ESP32, TinyML). Ràng buộc chính là bộ nhớ, điện năng và độ trễ.",
   "Edge AI moves models onto devices close to where the data is produced: embedded computers with a GPU (Jetson), single-board computers (Raspberry Pi), or microcontrollers with only a few hundred kilobytes of RAM (ESP32, TinyML). The main constraints are memory, power and latency."
  ],
  "why": [
   "Xử lý tại chỗ cho phản hồi nhanh, vẫn chạy khi mất mạng và giữ dữ liệu riêng tư trên thiết bị. Camera thông minh, thiết bị đeo, cảm biến công nghiệp đều đi theo hướng này.",
   "Processing on the spot gives fast responses, keeps working when the network is down and keeps private data on the device. Smart cameras, wearables and industrial sensors are all heading this way."
  ],
  "learn": [
   [
    "Ràng buộc phần cứng: RAM, điện năng, nhiệt",
    "Hardware constraints: RAM, power, heat"
   ],
   [
    "Tối ưu mô hình cho thiết bị: lượng tử hóa, kiến trúc nhẹ",
    "Optimising models for devices: quantisation, lightweight architectures"
   ],
   [
    "TensorRT trên Jetson",
    "TensorRT on Jetson"
   ],
   [
    "TensorFlow Lite (nay là LiteRT) và bản cho vi điều khiển",
    "TensorFlow Lite (now LiteRT) and its microcontroller version"
   ],
   [
    "Thu dữ liệu cảm biến, giao thức MQTT",
    "Collecting sensor data, the MQTT protocol"
   ],
   [
    "Cập nhật mô hình từ xa (OTA)",
    "Updating models remotely (OTA)"
   ]
  ],
  "tools": [
   "NVIDIA Jetson",
   "Raspberry Pi",
   "ESP32",
   "TensorFlow Lite",
   "Edge Impulse",
   "MQTT"
  ],
  "practice": [
   "Chạy mô hình phát hiện người trên Raspberry Pi hoặc Jetson với camera, gửi sự kiện qua MQTT về một bảng theo dõi.",
   "Run a person detection model on a Raspberry Pi or Jetson with a camera, and send events over MQTT to a monitoring dashboard."
  ],
  "done": [
   [
    "Đo được số khung hình mỗi giây và mức dùng bộ nhớ trên thiết bị thật",
    "You can measure frames per second and memory use on a real device"
   ],
   [
    "Chọn được phần cứng phù hợp cho một bài toán cho trước",
    "You can choose suitable hardware for a given problem"
   ]
  ],
  "pit": [
   "Huấn luyện mô hình lớn rồi mới nghĩ tới thiết bị. Hãy bắt đầu từ ràng buộc phần cứng.",
   "Training a large model and only then thinking about the device. Start from the hardware constraints."
  ],
  "kind": "node"
 },
 {
  "id": "QC",
  "code": "QC",
  "tier": 5,
  "stage": 6,
  "lv": 5,
  "title": "Quantum Computing",
  "sub": [
   "Qubit · Cổng lượng tử · Qiskit · Quantum ML",
   "Qubits · Quantum gates · Qiskit · Quantum ML"
  ],
  "pre": [
   "MATH",
   "ML"
  ],
  "tag": [
   "Một mô hình tính toán khác hẳn, dựa trên cơ học lượng tử.",
   "A completely different model of computation, based on quantum mechanics."
  ],
  "what": [
   "Máy tính lượng tử dùng qubit, có thể ở trạng thái chồng chập của 0 và 1 và vướng víu với nhau. Thuật toán lượng tử sắp các cổng lượng tử thành mạch để giải một số lớp bài toán nhanh hơn máy tính cổ điển. Quantum ML thử dùng mạch lượng tử làm mô hình học.",
   "Quantum computers use qubits, which can be in a superposition of 0 and 1 and can be entangled with each other. Quantum algorithms arrange quantum gates into circuits to solve certain classes of problems faster than classical computers. Quantum ML tries using quantum circuits as learning models."
  ],
  "why": [
   "Đây là hướng dài hạn. Máy lượng tử hiện nay còn nhiễu và ít qubit, lợi thế thực tế cho Machine Learning chưa được chứng minh rõ. Học phần này để hiểu nền tảng và sẵn sàng khi công nghệ chín, chưa phải để tìm việc ngay.",
   "This is a long-term direction. Today’s quantum machines are still noisy and have few qubits, and a practical advantage for Machine Learning has not been clearly shown. Study this to understand the foundations and be ready when the technology matures, not to find a job right away."
  ],
  "learn": [
   [
    "Qubit, chồng chập, vướng víu, phép đo",
    "Qubits, superposition, entanglement, measurement"
   ],
   [
    "Cổng lượng tử H, X, CNOT và mạch lượng tử",
    "Quantum gates H, X, CNOT and quantum circuits"
   ],
   [
    "Thuật toán Grover và Shor ở mức ý tưởng",
    "Grover’s and Shor’s algorithms, conceptually"
   ],
   [
    "Giai đoạn NISQ: máy còn nhiễu, quy mô vừa",
    "The NISQ era: noisy, intermediate-scale machines"
   ],
   [
    "Mạch lượng tử biến phân, mô hình lai lượng tử – cổ điển",
    "Variational quantum circuits, hybrid quantum–classical models"
   ],
   [
    "Chạy mạch trên trình mô phỏng và máy thật qua cloud",
    "Running circuits on simulators and on real machines via the cloud"
   ]
  ],
  "tools": [
   "Qiskit",
   "PennyLane",
   "Cirq",
   "IBM Quantum"
  ],
  "practice": [
   "Dựng mạch tạo cặp qubit vướng víu (trạng thái Bell) bằng Qiskit, chạy trên trình mô phỏng và xem phân bố kết quả đo.",
   "Build a circuit that creates an entangled pair of qubits (a Bell state) in Qiskit, run it on a simulator and look at the distribution of measurement results."
  ],
  "done": [
   [
    "Giải thích được chồng chập và vướng víu mà không dùng cách ví sai “thử mọi đáp án cùng lúc”",
    "You can explain superposition and entanglement without the misleading analogy of “trying every answer at once”"
   ],
   [
    "Viết và chạy được một mạch lượng tử nhỏ",
    "You can write and run a small quantum circuit"
   ]
  ],
  "pit": [
   "Tin vào quảng cáo. Máy tính lượng tử không nhanh hơn cho mọi bài toán; lợi thế chỉ có ở một số lớp bài toán cụ thể.",
   "Believing the hype. Quantum computers are not faster for every problem; the advantage exists only for certain specific classes of problems."
  ],
  "kind": "node"
 },
 {
  "id": "P1",
  "code": "P1",
  "tier": 6,
  "stage": 2,
  "lv": 2,
  "title": [
   "Dự án 1 · Phân tích dữ liệu & Dự đoán",
   "Project 1 · Data analysis & prediction"
  ],
  "sub": [
   "Dữ liệu bảng · ML cổ điển",
   "Tabular data · Classic ML"
  ],
  "pre": [
   "ML",
   "DB"
  ],
  "tag": [
   "Từ một bảng dữ liệu thô tới mô hình dự đoán được đánh giá đàng hoàng.",
   "From a raw data table to a properly evaluated prediction model."
  ],
  "what": [
   "Chọn một bộ dữ liệu dạng bảng có ý nghĩa với bạn (giá nhà, khách hàng rời bỏ, doanh số). Khám phá dữ liệu, xây đặc trưng, huấn luyện vài mô hình và so sánh chúng với một mốc cơ sở đơn giản.",
   "Pick a tabular dataset that means something to you (house prices, customer churn, sales). Explore the data, build features, train a few models and compare them with a simple baseline."
  ],
  "why": [
   "Cho thấy bạn nắm quy trình Machine Learning chuẩn và biết kể một câu chuyện bằng dữ liệu.",
   "Shows you know the standard Machine Learning workflow and can tell a story with data."
  ],
  "learn": [
   [
    "Đặt câu hỏi và chọn chỉ số đánh giá",
    "Framing the question and choosing an evaluation metric"
   ],
   [
    "Khám phá dữ liệu (EDA) bằng biểu đồ",
    "Exploratory data analysis (EDA) with charts"
   ],
   [
    "Làm sạch, xử lý giá trị thiếu, tạo đặc trưng",
    "Cleaning, handling missing values, creating features"
   ],
   [
    "Dựng mốc cơ sở, rồi Random Forest và XGBoost",
    "Setting a baseline, then Random Forest and XGBoost"
   ],
   [
    "Đánh giá chéo và phân tích lỗi",
    "Cross-validation and error analysis"
   ],
   [
    "Viết báo cáo kết luận",
    "Writing up the conclusions"
   ]
  ],
  "tools": [
   "pandas",
   "scikit-learn",
   "XGBoost",
   "Matplotlib",
   "Jupyter"
  ],
  "practice": [
   "Một repo GitHub gồm notebook sạch, README nêu câu hỏi – cách làm – kết quả, và bảng so sánh các mô hình với mốc cơ sở.",
   "A GitHub repo with a clean notebook, a README setting out question – method – results, and a table comparing the models with the baseline."
  ],
  "done": [
   [
    "Người khác chạy lại ra đúng kết quả",
    "Someone else can rerun it and get the same results"
   ],
   [
    "Giải thích được đặc trưng nào quan trọng và vì sao",
    "You can explain which features matter and why"
   ]
  ],
  "pit": [
   "Chọn bộ dữ liệu quá sạch, quá quen. Dữ liệu tự thu thập, dù nhỏ, thuyết phục hơn nhiều.",
   "Choosing a dataset that is too clean and too familiar. Data you collect yourself, however small, is far more convincing."
  ],
  "kind": "project"
 },
 {
  "id": "P2",
  "code": "P2",
  "tier": 6,
  "stage": 3,
  "lv": 3,
  "title": [
   "Dự án 2 · Nhận diện ảnh",
   "Project 2 · Image recognition"
  ],
  "sub": "CNN · Transfer learning",
  "pre": [
   "DL"
  ],
  "tag": [
   "Mô hình Deep Learning đầu tiên tự tay huấn luyện trên ảnh của mình.",
   "The first Deep Learning model you train yourself, on your own images."
  ],
  "what": [
   "Xây bộ phân loại ảnh cho một bài toán cụ thể (loại rác, bệnh trên lá cây, món ăn). Bắt đầu từ mô hình đã huấn luyện sẵn như ResNet rồi tinh chỉnh trên dữ liệu của bạn.",
   "Build an image classifier for a specific problem (types of waste, plant leaf diseases, dishes). Start from a pre-trained model such as ResNet, then fine-tune it on your data."
  ],
  "why": [
   "Cho thấy bạn huấn luyện, đánh giá và gỡ lỗi được một mạng nơ-ron.",
   "Shows you can train, evaluate and debug a neural network."
  ],
  "learn": [
   [
    "Thu thập và chia dữ liệu ảnh",
    "Collecting and splitting image data"
   ],
   [
    "Tăng cường dữ liệu",
    "Data augmentation"
   ],
   [
    "Tinh chỉnh mô hình đã huấn luyện sẵn",
    "Fine-tuning a pre-trained model"
   ],
   [
    "Theo dõi loss, chống overfitting",
    "Watching the loss, fighting overfitting"
   ],
   [
    "Lập ma trận nhầm lẫn, xem lại các ảnh đoán sai",
    "Building a confusion matrix, reviewing misclassified images"
   ],
   [
    "Dựng giao diện demo",
    "Building a demo interface"
   ]
  ],
  "tools": [
   "PyTorch",
   "torchvision",
   "Gradio",
   "Google Colab"
  ],
  "practice": [
   "Mô hình đã huấn luyện, một trang demo cho người khác tải ảnh lên thử, và phần phân tích các trường hợp mô hình sai.",
   "The trained model, a demo page where others can upload images to try it, and an analysis of the cases where the model gets it wrong."
  ],
  "done": [
   [
    "Độ chính xác trên tập kiểm tra vượt rõ mốc cơ sở",
    "Test set accuracy clearly beats the baseline"
   ],
   [
    "Giải thích được mô hình hay nhầm lớp nào và vì sao",
    "You can explain which classes the model often confuses and why"
   ]
  ],
  "pit": [
   "Ảnh huấn luyện và ảnh kiểm tra chụp cùng một vật trong cùng điều kiện, khiến điểm số cao giả.",
   "Training and test images that show the same object in the same conditions, which inflates the score."
  ],
  "kind": "project"
 },
 {
  "id": "P3",
  "code": "P3",
  "tier": 6,
  "stage": 4,
  "lv": 4,
  "title": [
   "Dự án 3 · Phát hiện đối tượng",
   "Project 3 · Object detection"
  ],
  "sub": [
   "YOLO · Thời gian thực",
   "YOLO · Real time"
  ],
  "pre": [
   "CV"
  ],
  "tag": [
   "Tìm và khoanh vùng vật thể trong video theo thời gian thực.",
   "Finding and localising objects in video in real time."
  ],
  "what": [
   "Huấn luyện YOLO cho một bài toán thật: đếm xe, phát hiện mũ bảo hộ, kiểm tra lỗi sản phẩm. Tự thu ảnh, tự gán nhãn, rồi chạy mô hình trên luồng video.",
   "Train YOLO for a real problem: counting vehicles, detecting hard hats, inspecting products for defects. Collect the images yourself, label them yourself, then run the model on a video stream."
  ],
  "why": [
   "Cho thấy bạn làm trọn được một bài toán thị giác máy tính, kể cả phần dữ liệu.",
   "Shows you can see a computer vision problem through from start to finish, data included."
  ],
  "learn": [
   [
    "Xác định lớp đối tượng và thu ảnh",
    "Defining object classes and collecting images"
   ],
   [
    "Gán nhãn hộp bao",
    "Labelling bounding boxes"
   ],
   [
    "Huấn luyện YOLO, đọc mAP",
    "Training YOLO, reading mAP"
   ],
   [
    "Phân tích lỗi: bỏ sót, nhận nhầm",
    "Error analysis: missed detections, false detections"
   ],
   [
    "Chạy trên video, thêm theo dõi và đếm",
    "Running on video, adding tracking and counting"
   ],
   [
    "Xuất sang ONNX để tăng tốc",
    "Exporting to ONNX for speed"
   ]
  ],
  "tools": [
   "Ultralytics YOLO",
   "CVAT / Roboflow",
   "OpenCV",
   "ONNX Runtime"
  ],
  "practice": [
   "Video demo chạy thời gian thực, bộ dữ liệu đã gán nhãn, báo cáo mAP và tốc độ khung hình trên phần cứng của bạn.",
   "A real-time demo video, the labelled dataset, and a report of mAP and frame rate on your hardware."
  ],
  "done": [
   [
    "Mô hình chạy ổn trên video quay ở điều kiện khác lúc thu dữ liệu",
    "The model works well on video shot in conditions different from when you collected the data"
   ],
   [
    "Có con số FPS đo thật",
    "You have a measured FPS figure"
   ]
  ],
  "pit": [
   "Gán nhãn không nhất quán. Một quy ước gán nhãn rõ ràng quan trọng hơn thêm một nghìn ảnh.",
   "Inconsistent labelling. A clear labelling convention matters more than another thousand images."
  ],
  "kind": "project"
 },
 {
  "id": "P4",
  "code": "P4",
  "tier": 6,
  "stage": 4,
  "lv": 4,
  "title": [
   "Dự án 4 · Chatbot / RAG",
   "Project 4 · Chatbot / RAG"
  ],
  "sub": [
   "LLM · Truy xuất tài liệu",
   "LLM · Document retrieval"
  ],
  "pre": [
   "NLP"
  ],
  "tag": [
   "Trợ lý trả lời dựa trên tài liệu của bạn, có trích nguồn.",
   "An assistant that answers from your documents, with citations."
  ],
  "what": [
   "Xây chatbot hỏi đáp trên một kho tài liệu riêng (quy định công ty, giáo trình, hướng dẫn sản phẩm). Hệ thống tìm các đoạn tài liệu liên quan rồi mới để LLM viết câu trả lời dựa trên chúng.",
   "Build a question-answering chatbot over a private document collection (company policies, course materials, product guides). The system first finds the relevant passages, then has the LLM write an answer based on them."
  ],
  "why": [
   "Đây là kiểu ứng dụng LLM phổ biến trong doanh nghiệp. Dự án cho thấy bạn xây được hệ thống LLM đáng tin chứ không chỉ gọi API.",
   "This is a common kind of LLM application in business. The project shows you can build a reliable LLM system, not just call an API."
  ],
  "learn": [
   [
    "Thu thập và cắt tài liệu thành đoạn (chunk)",
    "Collecting documents and splitting them into chunks"
   ],
   [
    "Tạo embedding, lưu vào cơ sở dữ liệu vector",
    "Creating embeddings and storing them in a vector database"
   ],
   [
    "Truy xuất và xếp hạng lại",
    "Retrieval and reranking"
   ],
   [
    "Viết prompt buộc trả lời theo nguồn",
    "Writing prompts that force answers to follow the sources"
   ],
   [
    "Xây bộ câu hỏi kiểm thử, đo chất lượng",
    "Building a set of test questions, measuring quality"
   ],
   [
    "Giao diện chat có hiển thị nguồn",
    "A chat interface that shows sources"
   ]
  ],
  "tools": [
   [
    "LLM API hoặc Ollama",
    "LLM API or Ollama"
   ],
   "sentence-transformers",
   "FAISS / Chroma",
   "FastAPI",
   "Gradio / Streamlit"
  ],
  "practice": [
   "Ứng dụng chat chạy được, bộ câu hỏi kiểm thử kèm kết quả, và ghi chú về những câu hệ thống trả lời sai.",
   "A working chat app, the set of test questions with results, and notes on the questions the system gets wrong."
  ],
  "done": [
   [
    "Mỗi câu trả lời dẫn về đúng đoạn tài liệu gốc",
    "Every answer points back to the right passage in the source document"
   ],
   [
    "Hệ thống biết nói “không tìm thấy” thay vì bịa",
    "The system knows to say “not found” instead of making things up"
   ]
  ],
  "pit": [
   "Chỉ thử vài câu hỏi dễ rồi kết luận hệ thống tốt.",
   "Trying only a few easy questions and concluding the system is good."
  ],
  "kind": "project"
 },
 {
  "id": "P5",
  "code": "P5",
  "tier": 6,
  "stage": 5,
  "lv": 5,
  "title": [
   "Dự án 5 · Hệ thống AI hoàn chỉnh",
   "Project 5 · A complete AI system"
  ],
  "sub": "Deploy + MLOps",
  "pre": [
   "OPS",
   "DEP",
   "DE"
  ],
  "tag": [
   "Đưa một mô hình ra chạy thật, có giám sát và tự cập nhật.",
   "Putting a model into real use, with monitoring and automatic updates."
  ],
  "what": [
   "Lấy mô hình từ một dự án trước và xây quanh nó một hệ thống đầy đủ: API, container, pipeline huấn luyện lại, kiểm thử tự động, triển khai lên cloud và bảng theo dõi.",
   "Take the model from an earlier project and build a full system around it: API, container, retraining pipeline, automated tests, cloud deployment and a monitoring dashboard."
  ],
  "why": [
   "Đây là dự án gần với công việc hằng ngày của AI Engineer nhất. Nếu chỉ chọn một dự án để đầu tư kỹ, hãy chọn dự án này.",
   "This is the project closest to an AI Engineer’s day-to-day work. If you pick only one project to invest in properly, pick this one."
  ],
  "learn": [
   [
    "Đóng gói mô hình thành API trong Docker",
    "Packaging the model as an API in Docker"
   ],
   [
    "Theo dõi thí nghiệm và đăng ký mô hình",
    "Experiment tracking and model registration"
   ],
   [
    "Pipeline huấn luyện lại tự động",
    "An automated retraining pipeline"
   ],
   [
    "CI/CD: kiểm thử rồi triển khai",
    "CI/CD: test, then deploy"
   ],
   [
    "Triển khai lên cloud",
    "Deploying to the cloud"
   ],
   [
    "Giám sát độ trễ, lỗi và trôi dữ liệu",
    "Monitoring latency, errors and data drift"
   ]
  ],
  "tools": [
   "FastAPI",
   "Docker",
   "MLflow",
   "GitHub Actions",
   "Cloud (AWS / GCP / Azure)",
   "Prometheus + Grafana"
  ],
  "practice": [
   "Một địa chỉ API đang chạy, sơ đồ kiến trúc, repo có CI/CD và bảng theo dõi hoạt động.",
   "A live API endpoint, an architecture diagram, a repo with CI/CD and a working monitoring dashboard."
  ],
  "done": [
   [
    "Đẩy code mới lên là hệ thống tự kiểm thử và triển khai",
    "When you push new code, the system tests and deploys it automatically"
   ],
   [
    "Có cảnh báo khi dịch vụ lỗi hoặc dữ liệu đầu vào đổi khác",
    "You get alerts when the service fails or the input data changes"
   ]
  ],
  "pit": [
   "Ôm quá nhiều công cụ. Một hệ thống đơn giản chạy thật có giá trị hơn một sơ đồ kiến trúc đẹp.",
   "Taking on too many tools. A simple system that really runs is worth more than a pretty architecture diagram."
  ],
  "kind": "project"
 },
 {
  "id": "P6",
  "code": "P6",
  "tier": 6,
  "stage": 6,
  "lv": 5,
  "title": [
   "Dự án 6 · AI + Robotics",
   "Project 6 · AI + Robotics"
  ],
  "sub": [
   "Điều khiển robot",
   "Robot control"
  ],
  "pre": [
   "ROB"
  ],
  "tag": [
   "Cho một robot nhìn, quyết định và di chuyển.",
   "Getting a robot to see, decide and move."
  ],
  "what": [
   "Kết hợp thị giác máy tính với điều khiển trên một robot mô phỏng hoặc robot thật giá rẻ: robot bám theo người, robot nhặt vật theo màu, xe tự hành mini tránh vật cản.",
   "Combine computer vision with control on a simulated robot or a cheap real one: a robot that follows a person, a robot that picks up objects by colour, a mini self-driving car that avoids obstacles."
  ],
  "why": [
   "Cho thấy bạn ghép được mô hình AI vào một hệ thống thời gian thực có phần cứng.",
   "Shows you can fit an AI model into a real-time system with hardware."
  ],
  "learn": [
   [
    "Dựng robot trong mô phỏng với ROS 2",
    "Setting up a robot in simulation with ROS 2"
   ],
   [
    "Đưa luồng camera qua mô hình nhận diện",
    "Feeding the camera stream through a recognition model"
   ],
   [
    "Biến kết quả nhận diện thành lệnh điều khiển",
    "Turning recognition results into control commands"
   ],
   [
    "Thử nhiều tình huống trong mô phỏng",
    "Testing many scenarios in simulation"
   ],
   [
    "Tối ưu để chạy trên thiết bị biên",
    "Optimising to run on an edge device"
   ],
   [
    "Chuyển sang robot thật nếu có",
    "Moving to a real robot if you have one"
   ]
  ],
  "tools": [
   "ROS 2",
   "Gazebo",
   "YOLO",
   "Jetson / Raspberry Pi"
  ],
  "practice": [
   "Video robot hoàn thành nhiệm vụ, mã nguồn ROS 2 và ghi chép về khác biệt giữa mô phỏng và thực tế.",
   "A video of the robot completing its task, the ROS 2 source code, and notes on the differences between simulation and reality."
  ],
  "done": [
   [
    "Robot hoàn thành nhiệm vụ lặp lại nhiều lần, không chỉ một lần may mắn",
    "The robot completes the task again and again, not just once by luck"
   ],
   [
    "Độ trễ từ camera tới hành động được đo cụ thể",
    "The latency from camera to action has been measured"
   ]
  ],
  "pit": [
   "Mua phần cứng đắt tiền trước khi làm xong trong mô phỏng.",
   "Buying expensive hardware before you have finished the job in simulation."
  ],
  "kind": "project"
 },
 {
  "id": "P7",
  "code": "P7",
  "tier": 6,
  "stage": 6,
  "lv": 5,
  "title": [
   "Dự án 7 · Bài toán lượng tử",
   "Project 7 · A quantum problem"
  ],
  "sub": "Quantum ML",
  "pre": [
   "QC"
  ],
  "tag": [
   "Thử một mô hình học máy chạy trên mạch lượng tử.",
   "Trying a machine learning model that runs on a quantum circuit."
  ],
  "what": [
   "Xây một bộ phân loại nhỏ bằng mạch lượng tử biến phân trên trình mô phỏng, huấn luyện theo kiểu lai lượng tử – cổ điển, rồi so sánh thẳng thắn với một mô hình cổ điển trên cùng dữ liệu.",
   "Build a small classifier from a variational quantum circuit on a simulator, train it in a hybrid quantum–classical way, then compare it honestly with a classical model on the same data."
  ],
  "why": [
   "Mục tiêu là hiểu Quantum ML vận hành thế nào và giới hạn của nó ở đâu, không phải đạt kết quả vượt trội.",
   "The aim is to understand how Quantum ML works and where its limits are, not to get outstanding results."
  ],
  "learn": [
   [
    "Chọn bộ dữ liệu nhỏ, ít đặc trưng",
    "Choosing a small dataset with few features"
   ],
   [
    "Mã hóa dữ liệu vào qubit",
    "Encoding data into qubits"
   ],
   [
    "Thiết kế mạch biến phân",
    "Designing a variational circuit"
   ],
   [
    "Huấn luyện bằng bộ tối ưu cổ điển",
    "Training with a classical optimiser"
   ],
   [
    "So sánh với mô hình cổ điển",
    "Comparing with a classical model"
   ],
   [
    "Thêm nhiễu để xem ảnh hưởng",
    "Adding noise to see its effect"
   ]
  ],
  "tools": [
   "Qiskit",
   "PennyLane",
   "scikit-learn"
  ],
  "practice": [
   "Notebook có mạch lượng tử, đường huấn luyện, bảng so sánh với mô hình cổ điển và phần nhận xét trung thực.",
   "A notebook with the quantum circuit, training curves, a comparison table against the classical model and an honest write-up."
  ],
  "done": [
   [
    "Giải thích được từng phần của mạch làm gì",
    "You can explain what each part of the circuit does"
   ],
   [
    "Kết luận dựa trên số liệu, kể cả khi mô hình lượng tử kém hơn",
    "Your conclusions rest on the numbers, even when the quantum model does worse"
   ]
  ],
  "pit": [
   "Tuyên bố “lợi thế lượng tử” từ một thí nghiệm nhỏ trên trình mô phỏng.",
   "Claiming “quantum advantage” from a small experiment on a simulator."
  ],
  "kind": "project"
 }
];

export const GOAL: RmGoal = {
 "id": "AIE",
 "kind": "goal",
 "code": "AIE",
 "title": "AI Engineer",
 "tag": [
  "Người biến mô hình AI thành sản phẩm chạy được ngoài đời thật.",
  "The person who turns AI models into products that work in the real world."
 ],
 "what": [
  "AI Engineer đứng giữa nghiên cứu và sản phẩm. Họ hiểu mô hình đủ sâu để chọn, huấn luyện và tinh chỉnh; đồng thời đủ vững kỹ thuật phần mềm để đóng gói, triển khai và theo dõi mô hình khi có người dùng thật.",
  "An AI Engineer sits between research and product. They understand models deeply enough to choose, train and fine-tune them, and are strong enough in software engineering to package, deploy and monitor those models once there are real users."
 ],
 "why": [
  "Một mô hình chỉ có giá trị khi được dùng. Trong hệ thống Machine Learning thực tế, phần code mô hình chỉ là một mảnh nhỏ; bao quanh nó là dữ liệu, hạ tầng và giám sát (Sculley và cộng sự, 2015).",
  "A model only has value when it is used. In a real-world Machine Learning system, the model code is only a small piece; around it sit data, infrastructure and monitoring (Sculley et al., 2015)."
 ],
 "learn": [
  [
   "Chặng 1 · Nền tảng: lập trình, toán, dữ liệu, hệ thống",
   "Tier 1 · Foundations: programming, maths, data, systems"
  ],
  [
   "Chặng 2 · Cốt lõi AI: ML, DL, RL",
   "Tier 2 · Core AI: ML, DL, RL"
  ],
  [
   "Chặng 3 · Một đến hai hướng chuyên sâu",
   "Tier 3 · One or two specialisations"
  ],
  [
   "Chặng 4 · Kỹ thuật hệ thống: dữ liệu, MLOps, triển khai, tối ưu",
   "Tier 4 · Systems engineering: data, MLOps, deployment, optimisation"
  ],
  [
   "Chặng 5 · Mở rộng: robot, thiết bị biên, lượng tử",
   "Tier 5 · Extensions: robots, edge devices, quantum"
  ],
  [
   "Chặng 6 · Bảy dự án làm bằng chứng năng lực",
   "Tier 6 · Seven projects as proof of ability"
  ]
 ],
 "practice": [
  "Đi từ trên xuống. Bấm vào từng ô để xem cần học gì, học xong thì đánh dấu. Hai checkpoint là chỗ dừng lại tự kiểm tra trước khi đi tiếp. Bấm một giai đoạn ở thanh lộ trình để biết lúc này nên tập trung vào ô nào.",
  "Work from the top down. Click each tile to see what to learn, and tick it off once you have learnt it. The two checkpoints are places to stop and test yourself before moving on. Click a stage on the roadmap bar to see which tiles to focus on right now."
 ],
 "done": [
  [
   "Tự xây và triển khai được một hệ thống AI, từ dữ liệu thô tới dịch vụ đang chạy",
   "You can build and deploy an AI system yourself, from raw data to a running service"
  ],
  [
   "Làm chủ ít nhất một hướng chuyên sâu",
   "You have mastered at least one specialisation"
  ],
  [
   "Có bộ dự án công khai chứng minh năng lực",
   "You have a public portfolio of projects that proves your ability"
  ]
 ],
 "pit": [
  "Học dàn trải mọi ô với cùng một mức độ. Chặng 1, 2 và 4 là bắt buộc; chặng 3 chọn hướng; chặng 5 là mở rộng.",
  "Spreading yourself evenly across every tile. Tiers 1, 2 and 4 are required; in tier 3 you choose a track; tier 5 is an extension."
 ]
};

export const CPS: RmCheckpoint[] = [
 {
  "id": "CP1",
  "kind": "cp",
  "code": "◆1",
  "after": 1,
  "title": [
   "Checkpoint 1 · Nền tảng vững chắc",
   "Checkpoint 1 · Solid foundations"
  ],
  "short": [
   "Nền tảng vững chắc",
   "Solid foundations"
  ],
  "needs": [
   "PS",
   "PY",
   "DSA",
   "MATH",
   "DB",
   "OS",
   "GIT"
  ],
  "tag": [
   "Dừng lại tự kiểm tra trước khi vào Machine Learning.",
   "Stop and test yourself before moving on to Machine Learning."
  ],
  "what": [
   "Nếu còn câu nào dưới đây chưa làm được, hãy quay lại ô tương ứng. Đi tiếp với nền yếu sẽ phải trả giá ở mọi chặng sau.",
   "If you cannot yet do any of the items below, go back to the matching tile. Moving on with a weak foundation will cost you in every later tier."
  ],
  "checks": [
   [
    "Viết được chương trình Python vài trăm dòng có hàm, class và đọc ghi file",
    "You can write a Python program of a few hundred lines with functions, classes and file reading and writing"
   ],
   [
    "Giải được bài mức dễ đến trung bình về mảng, bảng băm, cây",
    "You can solve easy to medium problems on arrays, hash tables and trees"
   ],
   [
    "Giải thích được đạo hàm, gradient, phép nhân ma trận và phân phối chuẩn",
    "You can explain derivatives, gradients, matrix multiplication and the normal distribution"
   ],
   [
    "Viết được truy vấn SQL có JOIN và GROUP BY",
    "You can write SQL queries with JOIN and GROUP BY"
   ],
   [
    "Làm việc được trên terminal Linux qua SSH",
    "You can work in a Linux terminal over SSH"
   ],
   [
    "Dùng Git với nhánh và pull request",
    "You use Git with branches and pull requests"
   ]
  ]
 },
 {
  "id": "CP2",
  "kind": "cp",
  "code": "◆2",
  "after": 2,
  "title": [
   "Checkpoint 2 · Làm chủ ML/DL cơ bản",
   "Checkpoint 2 · Mastering the ML/DL basics"
  ],
  "short": [
   "Làm chủ ML/DL cơ bản",
   "Mastering the ML/DL basics"
  ],
  "needs": [
   "ML",
   "DL"
  ],
  "tag": [
   "Dừng lại tự kiểm tra trước khi chọn hướng chuyên sâu.",
   "Stop and test yourself before choosing a specialisation."
  ],
  "what": [
   "Từ đây trở đi, mọi ô đều giả định bạn đã vững Machine Learning và Deep Learning. Reinforcement Learning không bắt buộc ở mốc này.",
   "From here on, every tile assumes you are solid on Machine Learning and Deep Learning. Reinforcement Learning is not required at this point."
  ],
  "checks": [
   [
    "Tự xây pipeline Machine Learning hoàn chỉnh có đánh giá chéo",
    "You can build a complete Machine Learning pipeline with cross-validation on your own"
   ],
   [
    "Giải thích được overfitting và ít nhất ba cách xử lý",
    "You can explain overfitting and at least three ways to deal with it"
   ],
   [
    "Viết được vòng lặp huấn luyện PyTorch từ đầu",
    "You can write a PyTorch training loop from scratch"
   ],
   [
    "Huấn luyện được một CNN cho kết quả hợp lý trên bộ dữ liệu chuẩn",
    "You can train a CNN that gives sensible results on a standard dataset"
   ],
   [
    "Giải thích được attention ở mức ý tưởng",
    "You can explain attention conceptually"
   ],
   [
    "Đã hoàn thành Dự án 1 và Dự án 2",
    "You have finished Project 1 and Project 2"
   ]
  ]
 }
];
