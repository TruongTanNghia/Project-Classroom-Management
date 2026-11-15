import type { KimLang } from "./i18n-kim";

/* Các khoá học hiện trên trang công khai: tên, học phí, nội dung từng buổi.

   NGUỒN NỘI DUNG — giáo trình thật của anh Nghĩa ở E:\DẠY HỌC\GIAO-TRINH, không tự nghĩ ra:
     Học máy, Học sâu, Học tăng cường, Thị giác   TONG-QUAN-4-KHOA.md (ở E:\DẠY HỌC)
     Harness AI      AI_Harness/docs/lo-trinh-khoa-hoc-36-buoi.md
     Robotics        Robotics/Muc-Luc-32-Buoi.md  (khoá cho học sinh tiểu học)
     Phân tích DL    Phan-Tich-Du-Lieu/README.md
     NLP & LLM       CHƯA có giáo trình riêng. Ghép từ lộ trình "NLP Engineer" trong
                     Dao-Tao-Nhan-Su/README.md (10 bài có sẵn).
     Edge AI         CHƯA có giáo trình riêng. Ghép từ lộ trình "MLOps / Edge" trong
                     cùng file đó (8 bài có sẵn).
   Hai khoá ghép là do Claude sắp thứ tự, anh Nghĩa chưa duyệt lúc viết file này.

   HỌC PHÍ — anh Nghĩa đưa ngày 15/11/2026: tính theo buổi, đủ 8 buổi thu một lần.
     Học máy, Học sâu              300.000₫/buổi
     Thị giác, Học tăng cường      350.000₫/buổi
     các khoá còn lại              380.000₫/buổi

   Chuỗi viết một lần nếu hai ngôn ngữ giống nhau, hoặc cặp [Việt, Anh]. */

export type L = string | readonly [vi: string, en: string];
export const tx = (lang: KimLang, l: L): string => (typeof l === "string" ? l : l[lang === "en" ? 1 : 0]);

/** một mẩu trên dòng code ở bìa thẻ: chữ thường, hoặc [chữ, kiểu] với k = từ khoá, s = chuỗi */
export type Tok = string | readonly [text: L, cls: "k" | "s"];
export type Cover =
  | { kind: "code"; lines: readonly (readonly Tok[])[]; out: L }
  | { kind: "blocks"; rows: readonly { c: string; inset?: boolean; pre: L; n: string; post: L }[] };

export type Session = readonly [title: L, desc: L];
export type Part = { name?: L; sessions: readonly Session[] };
export type Course = {
  slug: string;
  /** số thứ tự trên lộ trình (1–8); null = khoá riêng, không nằm trên lộ trình */
  step: number | null;
  /** tên chặng của lộ trình, đúng chữ đang dùng ở khối Lộ trình (dịch qua tKim) */
  phase: string | null;
  name: L;
  sum: L;
  /** đồng mỗi buổi */
  fee: number;
  cover: Cover;
  note?: L;
  parts: readonly Part[];
};

/** số buổi của một đợt thu học phí */
export const CYCLE = 8;

export const countSessions = (c: Course) => c.parts.reduce((n, p) => n + p.sessions.length, 0);
/** 2400000 → "2.400.000₫" (tự viết để máy chủ nào cũng ra cùng một chuỗi) */
export const dong = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "₫";

const LT: L = ["Lý thuyết", "Theory"];
const TH: L = ["Thực hành", "Hands-on"];

export const COURSES: readonly Course[] = [
  /* ------------------------------------------------------------------ 1 */
  {
    slug: "hoc-may",
    step: 1,
    phase: "Nền tảng",
    name: ["Học máy", "Machine learning"],
    sum: [
      "Từ dữ liệu thô đến mô hình đã triển khai: EDA, cây quyết định, SVM, XGBoost, rồi mạng nơ-ron và LLM.",
      "From raw data to a deployed model: EDA, decision trees, SVM, XGBoost, then neural networks and LLMs.",
    ],
    fee: 300_000,
    cover: {
      kind: "code",
      lines: [["model = XGBClassifier()"], ["model.fit(X_train, y_train)"], ["y_pred = model.predict(X_test)"]],
      out: ["✓ Dự đoán xong trên dữ liệu mới", "✓ Predictions made on unseen data"],
    },
    parts: [
      {
        sessions: [
          [["Giới thiệu học máy", "Introduction to machine learning"], ["Học máy là gì, học có giám sát và không giám sát, quy trình làm việc và bộ công cụ.", "What ML is, supervised and unsupervised learning, the workflow and the toolkit."]],
          [["Xử lý dữ liệu & EDA", "Data preparation & EDA"], ["Làm sạch, khám phá và trực quan hoá dữ liệu; xử lý giá trị thiếu và ngoại lệ.", "Cleaning, exploring and visualising data; handling missing values and outliers."]],
          [["Feature Engineering & cây quyết định", "Feature engineering & decision trees"], ["Tạo đặc trưng, Decision Tree, Random Forest.", "Building features, decision trees, random forests."]],
          ["Logistic Regression, SVM & Metrics", ["Phân loại tuyến tính, SVM; đánh giá bằng accuracy, precision, recall, F1, ROC.", "Linear classifiers, SVM; evaluation with accuracy, precision, recall, F1 and ROC."]],
          [["Học không giám sát & PCA", "Unsupervised learning & PCA"], ["Phân cụm K-Means, giảm chiều bằng PCA.", "K-Means clustering, dimensionality reduction with PCA."]],
          ["Ensemble & End-to-End", ["Bagging, Boosting (XGBoost), pipeline hoàn chỉnh.", "Bagging, boosting (XGBoost), a complete pipeline."]],
          [["Mạng nơ-ron", "Neural networks"], ["Perceptron, MLP, backpropagation; Keras trên MNIST.", "Perceptron, MLP, backpropagation; Keras on MNIST."]],
          ["NLP", ["Xử lý văn bản, TF-IDF, phân loại văn bản.", "Text processing, TF-IDF, text classification."]],
          [["Chuỗi thời gian", "Time series"], ["Dự báo chuỗi thời gian.", "Forecasting time series."]],
          ["CNN & Computer Vision", ["Mạng tích chập, phân loại ảnh.", "Convolutional networks, image classification."]],
          [["Triển khai mô hình", "Deploying a model"], ["Đưa mô hình lên production bằng API và Docker.", "Shipping a model to production with an API and Docker."]],
          [["Capstone & tổng kết", "Capstone & wrap-up"], ["Dự án tổng hợp end-to-end.", "An end-to-end capstone project."]],
          [["Toán hồi quy nâng cao", "Advanced regression maths"], ["Hồi quy chuyên sâu, regularization (Ridge, Lasso).", "Regression in depth, regularisation (Ridge, Lasso)."]],
          ["RNN, LSTM, Transformer", ["Mô hình chuỗi và cơ chế attention.", "Sequence models and the attention mechanism."]],
          ["LLM, RAG & GenAI", ["Mô hình ngôn ngữ lớn, RAG, AI tạo sinh.", "Large language models, RAG, generative AI."]],
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 2 */
  {
    slug: "hoc-sau",
    step: 2,
    phase: "Nền tảng",
    name: ["Học sâu", "Deep learning"],
    sum: [
      "PyTorch từ tensor đến tự cài GPT: CNN, YOLO, U-Net, Transformer, GAN, Diffusion.",
      "PyTorch from tensors to building your own GPT: CNN, YOLO, U-Net, Transformer, GAN, Diffusion.",
    ],
    fee: 300_000,
    cover: {
      kind: "code",
      lines: [[["for", "k"], " x, y ", ["in", "k"], " loader:"], ["    loss = loss_fn(net(x), y)"], ["    loss.backward(); opt.step()"]],
      out: ["✓ Loss giảm dần qua từng epoch", "✓ Loss falls epoch after epoch"],
    },
    parts: [
      {
        sessions: [
          [["Giới thiệu Deep Learning & PyTorch", "Introduction to deep learning & PyTorch"], ["Tensor, autograd, vòng lặp huấn luyện.", "Tensors, autograd, the training loop."]],
          [["Mạng nơ-ron chuyên sâu", "Neural networks in depth"], ["Kiến trúc, hàm kích hoạt, khởi tạo trọng số.", "Architectures, activation functions, weight initialisation."]],
          [["Optimization & Training Tricks", "Optimisation & training tricks"], ["Optimizer, regularization, BatchNorm, Dropout.", "Optimisers, regularisation, BatchNorm, Dropout."]],
          [["CNN nâng cao & ResNet", "Advanced CNNs & ResNet"], ["Mạng tích chập sâu, skip connection.", "Deep convolutional networks, skip connections."]],
          ["Object Detection (YOLO)", ["Phát hiện vật thể trong ảnh.", "Detecting objects in images."]],
          ["Image Segmentation (U-Net)", ["Phân vùng ảnh theo từng pixel.", "Segmenting images pixel by pixel."]],
          ["Vision Transformer & CLIP", ["ViT, mô hình thị giác – ngôn ngữ.", "ViT, vision–language models."]],
          ["NLP: Word2Vec & BERT", ["Word embedding, Transformer cho ngôn ngữ.", "Word embeddings, Transformers for language."]],
          ["GPT From Scratch", ["Tự cài mô hình GPT từ đầu.", "Implementing a GPT model from the ground up."]],
          ["GAN", ["Mạng đối sinh, sinh ảnh.", "Generative adversarial networks for image generation."]],
          ["VAE & Diffusion", ["Autoencoder biến phân, mô hình khuếch tán.", "Variational autoencoders, diffusion models."]],
          ["Multimodal: CLIP & DALL·E", ["Đa phương thức, text-to-image.", "Multimodal models, text-to-image."]],
          ["RL: Q-Learning & DQN", ["Học tăng cường cơ bản (value-based).", "Reinforcement learning basics (value-based)."]],
          ["RL: Policy Gradient & RLHF", ["Policy gradient, căn chỉnh mô hình bằng RLHF.", "Policy gradients, aligning models with RLHF."]],
          ["Production & Capstone", ["Triển khai mô hình deep learning và dự án tổng kết.", "Deploying deep models, plus the capstone project."]],
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 3 */
  {
    slug: "hoc-tang-cuong",
    step: 3,
    phase: "Nền tảng",
    name: ["Học tăng cường", "Reinforcement learning"],
    sum: [
      "Từ bandit và phương trình Bellman đến DQN, PPO, SAC, rồi RLHF: cách các mô hình ngôn ngữ lớn được căn chỉnh.",
      "From bandits and the Bellman equations to DQN, PPO and SAC, then RLHF: how large language models are aligned.",
    ],
    fee: 350_000,
    cover: {
      kind: "code",
      lines: [["action = agent.act(state)"], ["state, reward = env.step(action)"], ["agent.learn(reward)"]],
      out: ["✓ Tác tử tự học giữ thăng bằng", "✓ The agent learns to balance"],
    },
    parts: [
      {
        name: ["Phần 1 · Nền tảng", "Part 1 · Foundations"],
        sessions: [
          ["RL & Multi-Armed Bandit", ["Khám phá hay khai thác; ε-greedy, UCB, Thompson Sampling.", "Explore or exploit; ε-greedy, UCB, Thompson sampling."]],
          ["Contextual Bandit → MDP", ["Thêm ngữ cảnh (LinUCB), cá nhân hoá; cầu nối tới MDP.", "Adding context (LinUCB), personalisation; the bridge to MDPs."]],
          [["MDP & phương trình Bellman", "MDPs & the Bellman equations"], ["S, A, P, R, γ; V(s), Q(s,a); Bellman expectation và optimality.", "S, A, P, R, γ; V(s), Q(s,a); Bellman expectation and optimality."]],
          ["Dynamic Programming", "Policy Iteration, Value Iteration, GPI."],
        ],
      },
      {
        name: ["Phần 2 · Model-free Tabular", "Part 2 · Model-free tabular"],
        sessions: [
          ["Monte Carlo", ["Học từ episode trọn vẹn; MC control (Blackjack).", "Learning from complete episodes; MC control (Blackjack)."]],
          ["Temporal-Difference & SARSA", ["Bootstrapping, học sau mỗi bước; on-policy (Cliff Walking).", "Bootstrapping, learning at every step; on-policy (Cliff Walking)."]],
          ["Q-Learning", ["Off-policy, học thẳng chính sách tối ưu; Double Q.", "Off-policy, learning the optimal policy directly; Double Q."]],
          ["TD(λ) & Eligibility Traces", ["n-step, cầu nối giữa MC và TD, SARSA(λ).", "n-step returns, bridging MC and TD, SARSA(λ)."]],
        ],
      },
      {
        name: ["Phần 3 · Value-based Deep RL", "Part 3 · Value-based deep RL"],
        sessions: [
          ["Function Approximation", "Tile coding, semi-gradient, deadly triad (Mountain Car)."],
          ["Deep Q-Network (DQN)", ["Mạng Q, Experience Replay, Target Network (CartPole).", "Q-network, experience replay, target network (CartPole)."]],
          [["DQN nâng cao → Rainbow", "Advanced DQN → Rainbow"], "Double, Dueling, Prioritized Replay, Noisy, Distributional."],
        ],
      },
      {
        name: ["Phần 4 · Policy-based Deep RL", "Part 4 · Policy-based deep RL"],
        sessions: [
          ["Policy Gradient & REINFORCE", ["Học thẳng chính sách, định lý policy gradient, baseline giảm phương sai.", "Learning the policy directly, the policy-gradient theorem, variance-reducing baselines."]],
          ["Actor-Critic (A2C/A3C)", ["Actor và Critic, advantage, GAE.", "Actor and critic, advantage, GAE."]],
          ["PPO & TRPO", ["Clip giới hạn bước cập nhật để ổn định; nền của RLHF.", "Clipping the update step for stability; the basis of RLHF."]],
          ["Continuous Control (DDPG · TD3 · SAC)", ["Điều khiển liên tục cho robot (Pendulum, MuJoCo).", "Continuous control for robots (Pendulum, MuJoCo)."]],
        ],
      },
      {
        name: ["Phần 5 · Nâng cao & RLHF", "Part 5 · Advanced & RLHF"],
        sessions: [
          ["Model-based (Dyna · MCTS · MuZero)", ["Học mô hình thế giới, lập kế hoạch; AlphaZero, MuZero.", "Learning a world model, planning; AlphaZero, MuZero."]],
          ["Exploration · Reward Shaping", ["RND, phần thưởng thưa, potential-based shaping, cẩm nang debug.", "RND, sparse rewards, potential-based shaping, a debugging playbook."]],
          ["Offline RL & Imitation Learning", ["Học từ dữ liệu tĩnh; BC, DAgger, GAIL, CQL.", "Learning from static data; BC, DAgger, GAIL, CQL."]],
          ["Multi-Agent RL (MARL)", "Non-stationarity, Nash, self-play (CTDE, QMIX, MADDPG)."],
          ["RLHF · DPO & Capstone", ["Căn chỉnh LLM bằng reward model và DPO; dự án tổng kết.", "Aligning LLMs with a reward model and DPO; the capstone."]],
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 4 */
  {
    slug: "thi-giac-may-tinh",
    step: 4,
    phase: "Ứng dụng chuyên sâu",
    name: ["Thị giác máy tính", "Computer vision"],
    sum: [
      "Thị giác máy tính ở mức sản phẩm: phát hiện, bám đối tượng, khuôn mặt, OCR, biển số, đa camera, thiết bị biên.",
      "Production-grade computer vision: detection, tracking, faces, OCR, licence plates, multi-camera, edge devices.",
    ],
    fee: 350_000,
    cover: {
      kind: "code",
      lines: [["model = YOLO(", ['"yolo11n.pt"', "s"], ")"], [["for", "k"], " box ", ["in", "k"], " model.track(camera):"], ["    count(box.id)"]],
      out: ["✓ Phát hiện, bám và đếm qua camera", "✓ Detect, track and count on camera"],
    },
    parts: [
      {
        sessions: [
          ["CV Architect Mindset", ["Tư duy giải pháp, pipeline 5 pha, chi phí sở hữu (TCO).", "Solution thinking, the five-phase pipeline, total cost of ownership."]],
          ["Image Processing: OpenCV Pro", ["Xử lý ảnh nâng cao, quét tài liệu, augmentation.", "Advanced image processing, document scanning, augmentation."]],
          ["Annotation & Active Learning", ["Gán nhãn, active learning, dữ liệu tổng hợp, DVC.", "Labelling, active learning, synthetic data, DVC."]],
          ["Detection Production (YOLO11 · RT-DETR)", ["Phát hiện ở mức production, TTA, ensemble, open-vocabulary (GroundingDINO).", "Production-grade detection, TTA, ensembles, open-vocabulary (GroundingDINO)."]],
          ["Multi-Object Tracking (MOT)", ["Bám đa đối tượng (ByteTrack), Re-ID, đếm người.", "Tracking many objects (ByteTrack), Re-ID, people counting."]],
          ["Pose & Action Recognition", ["Tư thế và hành động: phát hiện té ngã, huấn luyện viên tập luyện.", "Pose and action: fall detection, a workout coach."]],
          ["Face Recognition Production", ["Nhận diện khuôn mặt (ArcFace), chống giả mạo, vector DB.", "Face recognition (ArcFace), anti-spoofing, vector DB."]],
          ["OCR & Document AI", ["Trích xuất văn bản và hoá đơn tiếng Việt (PaddleOCR, VietOCR).", "Extracting text and Vietnamese invoices (PaddleOCR, VietOCR)."]],
          ["License Plate Recognition (LPR)", ["Nhận diện biển số Việt Nam, bãi đỗ xe, triển khai trên thiết bị biên.", "Vietnamese licence plates, parking systems, edge deployment."]],
          ["Video Analytics & Anomaly", ["Đếm đám đông, đồ bảo hộ (PPE), xâm nhập và lảng vảng.", "Crowd counting, PPE compliance, intrusion and loitering."]],
          ["Real-time Stream & DeepStream", ["Xử lý đa luồng camera, batching, Triton.", "Multi-camera streams, batching, Triton."]],
          ["3D Vision, Depth & SLAM", ["Thị giác 3D, ước lượng độ sâu, đo đạc AR.", "3D vision, depth estimation, AR measurement."]],
          ["Medical & Industrial Vision", ["Y tế (segmentation), công nghiệp (phát hiện bất thường).", "Medical (segmentation) and industrial (anomaly detection)."]],
          ["Edge AI: Jetson & Mobile", ["Triển khai trên thiết bị biên, lượng tử hoá INT8, chọn thiết bị.", "Edge deployment, INT8 quantisation, choosing hardware."]],
          ["CV Architecture & Capstone", ["Kiến trúc microservices, giám sát và drift, dự án end-to-end.", "Microservice architecture, monitoring and drift, an end-to-end project."]],
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 5 */
  {
    slug: "nlp-llm",
    step: 5,
    phase: "Ứng dụng chuyên sâu",
    name: "NLP & LLM",
    sum: [
      "Từ TF-IDF, Word2Vec, PhoBERT đến tự cài GPT, rồi RAG và AI agent trả lời có trích dẫn. Mỗi buổi một bài toán doanh nghiệp.",
      "From TF-IDF, Word2Vec and PhoBERT to building your own GPT, then RAG and AI agents that cite their sources. One business problem per session.",
    ],
    fee: 380_000,
    cover: {
      kind: "code",
      lines: [["index = embed(documents)"], ["docs = index.search(question)"], ["answer = llm(question, docs)"]],
      out: ["✓ Trả lời kèm trích dẫn nguồn", "✓ Answer with cited sources"],
    },
    parts: [
      {
        name: ["Phần 1 · Nền tảng xử lý ngôn ngữ", "Part 1 · Language-processing foundations"],
        sessions: [
          ["TF-IDF", ["Bài toán: tự động phân loại ticket hỗ trợ.", "Problem: routing support tickets automatically."]],
          ["Word2Vec / GloVe", ["Bài toán: gợi ý sản phẩm liên quan.", "Problem: recommending related products."]],
          ["BERT / PhoBERT", ["Bài toán: phân tích cảm xúc bình luận tiếng Việt.", "Problem: sentiment analysis of Vietnamese comments."]],
          ["GPT from scratch", ["Tự code một mô hình sinh văn bản.", "Coding a text-generation model yourself."]],
          ["T5 (Seq2Seq)", ["Bài toán: tóm tắt văn bản tiếng Việt.", "Problem: summarising Vietnamese text."]],
        ],
      },
      {
        name: ["Phần 2 · LLM ứng dụng", "Part 2 · Applied LLMs"],
        sessions: [
          ["LLM API", ["Bài toán: tóm tắt biên bản họp tự động.", "Problem: summarising meeting minutes automatically."]],
          ["Prompt Engineering", ["Bài toán: chuẩn hoá phản hồi chăm sóc khách hàng.", "Problem: standardising customer-service replies."]],
          ["Embeddings + Cosine", ["Bài toán: khớp CV ứng viên với mô tả công việc.", "Problem: matching candidate CVs to job descriptions."]],
          ["RAG + Vector DB", ["Bài toán: hỏi đáp quy trình nội bộ.", "Problem: Q&A over internal procedures."]],
          ["AI Agents", ["Bài toán: trợ lý tra cứu và đặt lịch.", "Problem: an assistant that looks things up and books appointments."]],
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 6 */
  {
    slug: "edge-ai",
    step: 6,
    phase: "Ứng dụng chuyên sâu",
    name: "Edge AI",
    sum: [
      "Nén mô hình và đưa xuống thiết bị: ONNX, TensorRT, lượng tử hoá, TFLite, rồi giám sát sau khi triển khai.",
      "Shrinking a model and putting it on the device: ONNX, TensorRT, quantisation, TFLite, then monitoring after deployment.",
    ],
    fee: 380_000,
    cover: {
      kind: "code",
      lines: [["model = load(", ['"detector.onnx"', "s"], ")"], ["small = quantize(model, ", ['"int8"', "s"], ")"], ["small.save(", ['"model.tflite"', "s"], ")"]],
      out: ["✓ Chạy tại chỗ, không cần cloud", "✓ Runs on the device, no cloud"],
    },
    parts: [
      {
        name: ["Phần 1 · Mô hình mang đi triển khai", "Part 1 · The models you will deploy"],
        sessions: [
          [["MLP với Keras", "MLP with Keras"], ["Bài toán: chấm điểm rủi ro hồ sơ.", "Problem: scoring application risk."]],
          ["YOLOv8 / v11", ["Bài toán: đếm xe qua nút giao.", "Problem: counting vehicles through a junction."]],
        ],
      },
      {
        name: ["Phần 2 · Nén và đưa xuống thiết bị", "Part 2 · Shrinking it onto the device"],
        sessions: [
          ["ONNX & TensorRT", ["Chuyển đổi mô hình, nơi kết quả sai âm thầm.", "Model conversion, where results go wrong silently."]],
          [["Lượng tử hoá PTQ / QAT", "Quantisation: PTQ / QAT"], ["Nén 4 lần, và độ chính xác biến mất không đều.", "Four times smaller, and accuracy does not fade evenly."]],
          [["TFLite & di động", "TFLite & mobile"], ["Giới hạn nhiệt, delegate, phần cứng không kiểm soát được.", "Thermal limits, delegates, hardware you do not control."]],
        ],
      },
      {
        name: ["Phần 3 · Chạy thật và vận hành", "Part 3 · Running it for real"],
        sessions: [
          ["RTSP & DeepStream", ["Nơi hệ thống camera thật sự sập, và không phải vì mô hình.", "Where camera systems really fall over, and not because of the model."]],
          ["Triton Inference Server", ["Dịch vụ dùng chung, P99 và tách mức ưu tiên.", "A shared service, P99 and priority tiers."]],
          [["MLOps cho thị giác máy tính", "MLOps for computer vision"], ["Mô hình xuống cấp mà không ai nhận ra.", "The model degrades and nobody notices."]],
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 7 */
  {
    slug: "harness-ai",
    step: 7,
    phase: "Hệ thống thật",
    name: "Harness AI",
    sum: [
      "Dựng bảy lớp harness quanh LLM: ngữ cảnh, công cụ, điều phối, đánh giá, bảo mật, quản trị, vận hành. Bốn sản phẩm agent nối tiếp nhau.",
      "Building seven harness layers around an LLM: context, tools, orchestration, evaluation, security, governance, operations. Four agent products, one after another.",
    ],
    fee: 380_000,
    cover: {
      kind: "code",
      lines: [["tools = mcp.connect(", ['"drive"', "s"], ")"], ["agent = Agent(llm, tools)"], ["agent.run(", [['"bao-cao-ngay"', '"daily-report"'], "s"], ")"]],
      out: ["✓ Agent đã gửi báo cáo", "✓ Agent sent the report"],
    },
    note: [
      "Yêu cầu đầu vào: Python trung cấp, REST API, JSON, Git cơ bản. Trước khai giảng có một buổi kiểm tra đầu vào và cài môi trường.",
      "Prerequisites: intermediate Python, REST APIs, JSON, basic Git. There is an entry test and environment set-up session before the course starts.",
    ],
    parts: [
      {
        name: ["Phần 1 · Nền tảng Agentic AI", "Part 1 · Agentic AI foundations"],
        sessions: [
          ["LLM Fundamentals, Transformer & Attention", ["Thí nghiệm token, chi phí, temperature.", "Experiments with tokens, cost and temperature."]],
          ["Prompt Engineering, Tool Calling", ["Tự viết vòng lặp agent bằng API thô.", "Writing the agent loop yourself on the raw API."]],
          ["MCP, AI Agent Landscape, Framework Harness", ["Lab mổ xẻ Claude Code.", "Lab: taking Claude Code apart."]],
        ],
      },
      {
        name: ["Phần 2 · Context Harness: nền tảng RAG", "Part 2 · Context harness: RAG foundations"],
        sessions: [
          ["RAG Architecture, Chunking, Embedding", ["Index tài liệu tiếng Việt, golden dataset 20 câu.", "Indexing Vietnamese documents, a 20-question golden dataset."]],
          ["Hybrid Search, Reranking", ["So sánh recall@5 của 3 cấu hình.", "Comparing recall@5 across three configurations."]],
          ["Agent Memory, Context Compression, Long Context", ["Thêm bộ nhớ có nén, trích dẫn bắt buộc.", "Adding compressed memory, mandatory citations."]],
          [["Hoàn thiện trợ lý tri thức nội bộ", "Finishing the internal knowledge assistant"], ["Đo lại và báo cáo số liệu trước, sau.", "Re-measuring and reporting before/after numbers."]],
        ],
      },
      {
        name: ["Phần 3 · Bổ trợ Docker", "Part 3 · Docker primer"],
        sessions: [
          ["Docker: image, container, Dockerfile", ["Đóng gói trợ lý tri thức.", "Packaging the knowledge assistant."]],
          ["Docker Compose, volume, network, sandbox", ["Compose agent với vector DB, sandbox chạy mã.", "Composing the agent with a vector DB, a code-execution sandbox."]],
        ],
      },
      {
        name: ["Phần 4 · Bổ trợ Cloud", "Part 4 · Cloud primer"],
        sessions: [
          [["Cloud: triển khai container, secret manager", "Cloud: deploying containers, secret manager"], ["Deploy lên Cloud Run hoặc ECS với HTTPS.", "Deploying to Cloud Run or ECS over HTTPS."]],
          [["CI/CD, autoscaling, chi phí cloud", "CI/CD, autoscaling, cloud cost"], ["Pipeline GitHub Actions tự deploy.", "A GitHub Actions pipeline that deploys by itself."]],
        ],
      },
      {
        name: ["Phần 5 · Tool Harness", "Part 5 · Tool Harness"],
        sessions: [
          ["Function Calling, MCP Servers", ["Viết MCP server đầu tiên, MCP Inspector.", "Writing your first MCP server, MCP Inspector."]],
          ["API Privilege Design, Least Privilege, Tool Registry", "Lab: CRM Agent."],
          ["Retry, Error Recovery, Audit Logging", "Lab: ERP Agent."],
          [["Database Agent, tổng kết Tool Harness", "Database Agent, Tool Harness wrap-up"], ["Text-to-SQL chỉ đọc.", "Read-only text-to-SQL."]],
        ],
      },
      {
        name: ["Phần 6 · Bài tập lớn 1: Drive Agent", "Part 6 · Major assignment 1: Drive Agent"],
        sessions: [
          [["Giao đề Drive Agent, Drive API, OAuth", "Drive Agent brief, Drive API, OAuth"], ["Dựng Drive MCP server, tìm file.", "Standing up a Drive MCP server, finding files."]],
          [["Tóm tắt, hỏi đáp, sắp xếp file", "Summarising, answering questions, organising files"], ["Nhóm làm việc có trợ giảng.", "Team work with teaching assistants."]],
          [["Demo và chấm Drive Agent", "Drive Agent demo and marking"], ["Chấm theo rubric.", "Marked against the rubric."]],
        ],
      },
      {
        name: ["Phần 7 · Orchestration Harness", "Part 7 · Orchestration Harness"],
        sessions: [
          ["Planning, DAG, State Machine, LangGraph", "StateGraph, checkpointer, interrupt."],
          ["Multi-Agent Systems, Parallel Execution", ["Research Agent, đo chất lượng và chi phí.", "Research Agent, measuring quality and cost."]],
          ["Routing Strategies, Fallback Models", ["Customer Service Agent: router và đổi trả.", "Customer Service Agent: router and returns."]],
          [["Hoàn thiện Customer Service Agent", "Finishing the Customer Service Agent"], "Fallback, streaming."],
        ],
      },
      {
        name: ["Phần 8 · Evaluation Harness", "Part 8 · Evaluation Harness"],
        sessions: [
          ["Golden Dataset, LLM-as-a-Judge, Human Feedback", ["Golden dataset 50 mục, grader, judge 4 chiều.", "A 50-item golden dataset, graders, a four-dimension judge."]],
          [["RAG Evaluation, Hallucination, pass@k và pass^k", "RAG Evaluation, Hallucination, pass@k and pass^k"], ["Ragas, chạy 5 lần, báo cáo pass@1 và pass^3.", "Ragas, five runs, reporting pass@1 and pass^3."]],
          [["A/B Testing, Regression Testing trong CI", "A/B Testing, Regression Testing in CI"], ["GitHub Actions chặn merge khi chất lượng giảm quá 2%.", "GitHub Actions blocks the merge when quality drops by more than 2%."]],
        ],
      },
      {
        name: ["Phần 9 · Security Harness", "Part 9 · Security Harness"],
        sessions: [
          ["Threat model, OWASP Agentic Top 10, Injection, Jailbreak", ["Guardrail đầu vào và đầu ra.", "Input and output guardrails."]],
          ["Data Leakage, PII, Access Control, Credential", ["Presidio, lọc RAG theo quyền, Vault, garak.", "Presidio, permission-filtered RAG, Vault, garak."]],
          ["Attack & Defend AI Agents", ["Đổi vai tấn công và phòng thủ, báo cáo lỗ hổng.", "Swapping attacker and defender roles, a vulnerability report."]],
        ],
      },
      {
        name: ["Phần 10 · Governance Harness", "Part 10 · Governance Harness"],
        sessions: [
          ["Audit Trail, Explainability, Approval, HITL", ["Audit log append-only, agent card, hàng đợi duyệt.", "Append-only audit log, agent card, approval queue."]],
          ["AI Policies, Risk Management, Compliance", "AI Governance Dashboard."],
        ],
      },
      {
        name: ["Phần 11 · AgentOps Harness", "Part 11 · AgentOps Harness"],
        sessions: [
          ["Monitoring, Tracing OpenTelemetry, Observability", ["Gắn tracing vào Customer Service Agent, gửi về Phoenix hoặc LangSmith.", "Adding tracing to the Customer Service Agent, sent to Phoenix or LangSmith."]],
          ["Cost, Latency, Accuracy, Drift, Load test", ["Dashboard p95, chi phí mỗi tác vụ, k6.", "A p95 dashboard, cost per task, k6."]],
        ],
      },
      {
        name: ["Phần 12 · Project cuối khoá: Enterprise AI Agent Platform", "Part 12 · Final project: Enterprise AI Agent Platform"],
        sessions: [
          [["Kickoff project cuối khoá", "Final project kickoff"], ["Chọn đề tài, kiến trúc, cam kết ngưỡng.", "Choosing the topic and architecture, committing to thresholds."]],
          [["Mentoring 1: review kiến trúc và tiến độ", "Mentoring 1: architecture and progress review"], ["Review theo 9 thành phần.", "A review across nine components."]],
          [["Mentoring 2: red team chéo, load test, ROI", "Mentoring 2: cross red-teaming, load test, ROI"], ["20 kịch bản red team, bảng chi phí.", "Twenty red-team scenarios, a cost table."]],
          [["Bảo vệ trước hội đồng", "Defence before the panel"], ["Demo trực tiếp, chấm theo rubric.", "A live demo, marked against the rubric."]],
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 8 */
  {
    slug: "robotics",
    step: 8,
    phase: "Hệ thống thật",
    name: "Robotics",
    sum: [
      "Robotics cho học sinh tiểu học: mạch điện, bánh răng, động cơ, lập trình khối, cảm biến, rồi tự chế tạo robot của đội.",
      "Robotics for primary-school pupils: circuits, gears, motors, block programming, sensors, then building the team's own robot.",
    ],
    fee: 380_000,
    cover: {
      kind: "blocks",
      rows: [
        { c: "#E8C063", pre: ["Khi bấm nút", "When button pressed"], n: "", post: "" },
        { c: "#C9CED2", pre: ["Lặp lại", "Repeat"], n: "4", post: ["lần", "times"] },
        { c: "#D9B36A", inset: true, pre: ["Đi thẳng", "Forward"], n: "20", post: "cm" },
        { c: "#B9BEC3", inset: true, pre: ["Rẽ phải", "Turn right"], n: "90", post: ["độ", "degrees"] },
      ],
    },
    note: [
      "Dành cho học sinh tiểu học (lớp 1–5), chưa cần biết gì về robot. Mỗi nhiệm vụ gồm một buổi lý thuyết và một buổi thực hành, dẫn dắt bằng câu chuyện giải cứu hành tinh Bít-Bô.",
      "For primary-school pupils (grades 1–5) with no robotics background. Each mission is one theory session and one hands-on session, told through the story of rescuing planet Bit-Bo.",
    ],
    parts: [
      {
        name: ["Chặng 1 · Đánh thức Bít-Bô", "Stage 1 · Waking Bit-Bo"],
        sessions: [
          [["Robot là gì?", "What is a robot?"], LT],
          [["“Bạn là robot” tìm kho báu", "“You are the robot” treasure hunt"], TH],
          [["Giác quan – Bộ não – Tay chân", "Senses – Brain – Limbs"], LT],
          [["Làm quen dây nối và công tắc", "Getting to know wires and switches"], TH],
          [["Mạch kín và mạch hở", "Closed and open circuits"], LT],
          [["Thám tử mạch điện", "Circuit detectives"], TH],
        ],
      },
      {
        name: ["Chặng 2 · Chế tạo xe cứu hộ", "Stage 2 · Building the rescue car"],
        sessions: [
          [["Vì sao bánh xe giúp di chuyển dễ?", "Why do wheels make moving easy?"], LT],
          [["Lắp khung xe đầu tiên", "Building the first chassis"], TH],
          [["Bánh răng và đòn bẩy", "Gears and levers"], LT],
          [["Cơ cấu bánh răng của đội", "The team's gear mechanism"], TH],
          [["Động cơ – cơ bắp của robot", "Motors – the robot's muscles"], LT],
          [["Lắp động cơ, xe tự chạy", "Fitting the motor: the car drives itself"], TH],
          [["Làm sao cho xe tốt hơn?", "How do we make the car better?"], LT],
          [["Grand Prix Bít-Bô", "The Bit-Bo Grand Prix"], TH],
        ],
      },
      {
        name: ["Chặng 3 · Dạy robot suy nghĩ", "Stage 3 · Teaching the robot to think"],
        sessions: [
          [["Thuật toán là công thức", "An algorithm is a recipe"], LT],
          [["Làm quen bo mạch, săn Bug trên giấy", "Meeting the circuit board, hunting bugs on paper"], TH],
          [["Lập trình bằng khối màu", "Programming with colour blocks"], LT],
          [["Đưa xe tới kho báu", "Driving the car to the treasure"], TH],
          [["Vòng lặp như điệp khúc", "Loops are like a chorus"], LT],
          [["Xe chạy hình vuông, đèn nhạc theo vòng lặp", "Driving a square, lights and music in loops"], TH],
          [["Cảm biến siêu âm và Nếu – Thì", "The ultrasonic sensor and If – Then"], LT],
          [["Xe tự dừng trước vật cản", "The car that stops before an obstacle"], TH],
          [["Cảm biến dò line", "The line-following sensor"], LT],
          [["Xe đi hết mê cung đen", "The car that finishes the black maze"], TH],
        ],
      },
      {
        name: ["Chặng 4 · Robot của riêng em", "Stage 4 · A robot of your own"],
        sessions: [
          [["Từ ý tưởng đến thiết kế", "From idea to design"], LT],
          [["Vẽ thiết kế, đăng ký bằng sáng chế", "Drawing the design, filing the patent"], TH],
          [["Quy trình kỹ sư và Thanh tra Bug", "The engineering process and the Bug inspection"], LT],
          [["Chế tạo và thanh tra lần 1", "Building, and inspection round 1"], TH],
          [["Giới thiệu robot của đội", "Presenting the team's robot"], LT],
          [["Hoàn thiện robot, thanh tra lần 2, tổng duyệt", "Finishing the robot, inspection round 2, dress rehearsal"], TH],
          [["Ôn tập và tự đánh giá", "Review and self-assessment"], LT],
          [["Ngày hội Giải cứu Bít-Bô", "The Rescue Bit-Bo festival"], TH],
        ],
      },
    ],
  },

  /* -------------------------------------------------- khoá ngoài lộ trình */
  {
    slug: "phan-tich-du-lieu",
    step: null,
    phase: null,
    name: ["Phân tích dữ liệu", "Data analysis"],
    sum: [
      "Từ người mới hoàn toàn đến analyst làm được việc: SQL, pandas, thống kê, Power BI, học trên dữ liệu thị trường thật.",
      "From complete beginner to a working analyst: SQL, pandas, statistics and Power BI, learned on real market data.",
    ],
    fee: 380_000,
    cover: {
      kind: "code",
      lines: [[["SELECT", "k"], " month, ", ["SUM", "k"], "(revenue)"], [["FROM", "k"], " orders"], [["GROUP BY", "k"], " month"]],
      out: ["✓ Một bảng số trả lời đúng câu hỏi", "✓ One table that answers the question"],
    },
    note: [
      "Laptop thường là đủ, không cần GPU. Khoá dùng dữ liệu thị trường thật làm chất liệu để luyện phán đoán; khoá không dạy dự đoán giá và không phải lời khuyên đầu tư.",
      "An ordinary laptop is enough, no GPU needed. The course uses real market data as material for training judgement; it does not teach price prediction and is not investment advice.",
    ],
    parts: [
      {
        name: ["Phần 1 · Nền tảng nghề", "Part 1 · Foundations of the trade"],
        sessions: [
          [["Tư duy phân tích", "Analytical thinking"], ["Câu hỏi trước, dữ liệu sau. Khung 5 câu hỏi, định nghĩa metric, bốn tầng phân tích.", "Question first, data second. The five-question frame, defining metrics, four levels of analysis."]],
          [["SQL cho analyst", "SQL for analysts"], ["SELECT, JOIN, GROUP BY, window function, CTE, phân tích cohort.", "SELECT, JOIN, GROUP BY, window functions, CTEs, cohort analysis."]],
          ["Python & pandas", ["Từ biến số đến DataFrame. Dữ liệu bẩn thật: thiếu, trùng, sai kiểu, lệch múi giờ.", "From variables to DataFrames. Real dirty data: missing, duplicated, mistyped, time-zone shifted."]],
          [["Thống kê mô tả & phân phối", "Descriptive statistics & distributions"], ["Vì sao trung bình là con số nguy hiểm nhất trong tài chính. Đuôi béo.", "Why the mean is the most dangerous number in finance. Fat tails."]],
          [["Trực quan hoá & kể chuyện", "Visualisation & storytelling"], ["Cùng dữ liệu, hai biểu đồ, hai kết luận trái ngược. Biểu đồ trung thực.", "Same data, two charts, two opposite conclusions. Honest charts."]],
        ],
      },
      {
        name: ["Phần 2 · Dữ liệu thị trường", "Part 2 · Market data"],
        sessions: [
          [["Giải phẫu dữ liệu thị trường", "The anatomy of market data"], ["OHLCV, sổ lệnh, funding rate, open interest. Lấy từ API sàn thật.", "OHLCV, order book, funding rate, open interest. Pulled from a real exchange API."]],
          [["Làm sạch dữ liệu thị trường", "Cleaning market data"], ["Thiên lệch sống sót, coin đã huỷ niêm yết, giao dịch giả, thiếu nến.", "Survivorship bias, delisted coins, wash trades, missing candles."]],
          [["Chuỗi thời gian", "Time series"], ["Tính dừng, tự tương quan, cụm biến động.", "Stationarity, autocorrelation, volatility clustering."]],
          [["Phân tích on-chain", "On-chain analysis"], ["Dòng vào và ra sàn, ví cá voi, phân bố nắm giữ, tuổi đồng tiền.", "Exchange inflows and outflows, whale wallets, holder distribution, coin age."]],
          [["Rủi ro & danh mục", "Risk & portfolio"], ["VaR, CVaR, sụt giảm tối đa. Tương quan gãy đúng lúc cần nó nhất.", "VaR, CVaR, maximum drawdown. Correlation breaks just when you need it most."]],
        ],
      },
      {
        name: ["Phần 3 · Suy luận và không tự lừa mình", "Part 3 · Inference, and not fooling yourself"],
        sessions: [
          [["Suy luận thống kê & p-hacking", "Statistical inference & p-hacking"], ["Tự tay p-hack ra một “chỉ báo thần thánh” từ dữ liệu ngẫu nhiên.", "P-hacking your way to a “magic indicator” from random data."]],
          [["Nhân quả", "Causality"], ["A/B test, khác biệt kép (DiD), nghiên cứu sự kiện. Tương quan không phải nhân quả.", "A/B tests, difference-in-differences, event studies. Correlation is not causation."]],
          [["Backtest thảm hoạ", "The disaster backtest"], ["Xây một chiến lược lãi khoảng 400% rồi tự tay phá nó bằng 6 lỗi thiên lệch.", "Building a strategy that returns about 400%, then breaking it yourself with six biases."]],
          [["Phát hiện bất thường & gian lận", "Detecting anomalies & fraud"], ["Bơm-xả, giao dịch giả, rút thảm: dấu vết để lại trên dữ liệu.", "Pump-and-dump, wash trading, rug pulls: the traces they leave in the data."]],
        ],
      },
      {
        name: ["Phần 4 · Sản phẩm", "Part 4 · Products"],
        sessions: [
          [["Mô hình dự báo", "Forecasting models"], ["So mọi mô hình với baseline “mai = hôm nay”. Baseline thường thắng.", "Comparing every model with the “tomorrow = today” baseline. The baseline usually wins."]],
          ["Dashboard & BI", ["Dựng cùng một dashboard bằng Power BI và Streamlit, so ưu nhược.", "Building the same dashboard in Power BI and Streamlit, and comparing them."]],
          [["Pipeline & chất lượng dữ liệu", "Pipelines & data quality"], ["Thu thập, kiểm tra, cảnh báo khi dữ liệu hỏng.", "Collecting, checking, alerting when the data breaks."]],
          [["Capstone & nghề nghiệp", "Capstone & career"], ["Một nghiên cứu hoàn chỉnh, bảo vệ trước phản biện.", "A complete study, defended against challenge."]],
        ],
      },
      {
        name: ["Phần 5 · Thực chiến và nghề nghiệp", "Part 5 · Real practice and career"],
        sessions: [
          [["SQL thực chiến", "SQL in the real world"], ["Dữ liệu bẩn thật: 3 định dạng ngày trong một cột, bản ghi trùng, khoá mồ côi.", "Real dirty data: three date formats in one column, duplicate rows, orphaned keys."]],
          [["Thu thập dữ liệu", "Collecting data"], ["Tự lấy dữ liệu từ sàn: REST và WebSocket thời gian thực.", "Pulling data from an exchange yourself: REST and real-time WebSocket."]],
          ["Power BI", ["Dashboard 3 trang, mô hình sao, bộ số đo DAX.", "A three-page dashboard, a star schema, a set of DAX measures."]],
          [["Portfolio & xin việc", "Portfolio & job hunting"], ["3 dự án, CV một trang, 30 câu phỏng vấn.", "Three projects, a one-page CV, thirty interview questions."]],
        ],
      },
    ],
  },
];
