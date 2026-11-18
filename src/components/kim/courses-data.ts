import type { L } from "./i18n-kim";

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

   THỰC HÀNH TỪNG BUỔI (thêm ngày 18/11/2026, anh Nghĩa dặn phải thấy rõ bài thực hành):
     Học máy, Học sâu, Học tăng cường, Thị giác, Phân tích DL   thư mục Demo/ và Bai-Tap/ của từng buổi
     Robotics        mục "Mục tiêu" và "Hoạt động chi tiết" trong giáo án từng buổi
     Harness AI      cột "Thực hành chính" của bảng 36 buổi
     NLP & LLM, Edge AI   cột "Bài toán thực tế" của Dao-Tao-Nhan-Su/README.md và README từng bài
   Số bài tập ở mỗi buổi (ex) là số đếm thật trong tệp Bai-Tap; con số tổng trên thẻ khoá học
   (practice) phải bằng tổng các số đó, kim-lang-test.mjs kiểm điều này.

   Chuỗi viết một lần nếu hai ngôn ngữ giống nhau, hoặc cặp [Việt, Anh]. */


/** một mẩu trên dòng code ở bìa thẻ: chữ thường, hoặc [chữ, kiểu] với k = từ khoá, s = chuỗi */
export type Tok = string | readonly [text: L, cls: "k" | "s"];
export type Cover =
  | { kind: "code"; lines: readonly (readonly Tok[])[]; out: L }
  | { kind: "blocks"; rows: readonly { c: string; inset?: boolean; pre: L; n: string; post: L }[] };

/** Phần THỰC HÀNH của một buổi. Lấy từ chính buổi đó trong giáo trình: tên các bản demo chạy
    trên lớp (thư mục Demo/), số bài tập (thư mục Bai-Tap/), và dự án nếu buổi đó có. Công cụ rút:
    UI/aihoclaptrinh-design-mcp/scripts/syllabus-extract.py. Đừng thêm bài không có trong giáo trình. */
export type Lab = {
  /** làm gì trên lớp */
  d: L;
  /** số bài tập về nhà / trên lớp của buổi */
  ex?: number;
  /** tên dự án, nếu buổi này có dự án */
  pj?: L;
};
/** [tên buổi, mô tả (null nếu tên đã đủ rõ), phần thực hành (buổi lý thuyết thuần thì không có)] */
export type Session = readonly [title: L, desc: L | null, lab?: Lab];
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
  /** số tuần ở nhịp PER_WEEK buổi/tuần, và cách nói bằng tháng (hiện to trên thẻ) */
  weeks: number;
  months: L;
  /** thời lượng một buổi, nếu giáo trình có ghi */
  hours?: L;
  /** con số thực hành hiện trên thẻ ("64 bài tập"), và câu nói thêm trong hộp nội dung */
  practice: L;
  practiceMore: L;
  /** học xong làm ra được cái gì */
  final: L;
  cover: Cover;
  note?: L;
  parts: readonly Part[];
};

/** Nhịp học: số buổi mỗi tuần. Giáo trình Harness AI và Robotics ghi rõ 2 buổi/tuần; các khoá còn
    lại chưa ghi nên dùng cùng nhịp (Claude chọn ngày 18/11/2026, chờ anh Nghĩa xác nhận). Ở nhịp này
    8 buổi = 4 tuần ≈ 1 tháng, đúng bằng một đợt đóng học phí. */
export const PER_WEEK = 2;

/** số buổi của một đợt thu học phí */
export const CYCLE = 8;

export const countSessions = (c: Course) => c.parts.reduce((n, p) => n + p.sessions.length, 0);
/** tổng số bài tập ghi ở từng buổi (để kiểm con số trên thẻ có khớp với danh sách buổi không) */
export const countExercises = (c: Course) => c.parts.reduce((n, p) => n + p.sessions.reduce((m, s) => m + (s[2]?.ex ?? 0), 0), 0);
/** 2400000 → "2.400.000₫" (tự viết để máy chủ nào cũng ra cùng một chuỗi) */
export const dong = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "₫";


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
    weeks: 8,
    months: ["2 tháng", "2 months"],
    hours: ["2,5–3 giờ", "2.5–3 hours"],
    practice: ["64 bài tập", "64 exercises"],
    practiceMore: ["34 bản demo chạy được, dự án end-to-end và đồ án cuối khoá", "34 runnable demos, an end-to-end project and a capstone"],
    final: ["Chatbot RAG hỏi đáp tài liệu cho lĩnh vực bạn chọn, cùng ứng dụng web dự đoán bệnh tim đưa lên bằng Streamlit và FastAPI.", "A RAG chatbot over documents in a field of your choice, plus a heart-disease prediction web app shipped with Streamlit and FastAPI."],
    cover: {
      kind: "code",
      lines: [["model = XGBClassifier()"], ["model.fit(X_train, y_train)"], ["y_pred = model.predict(X_test)"]],
      out: ["✓ Dự đoán xong trên dữ liệu mới", "✓ Predictions made on unseen data"],
    },
    parts: [
      {
        sessions: [
          [["Giới thiệu học máy", "Introduction to machine learning"], ["Học máy là gì, học có giám sát và không giám sát, quy trình làm việc và bộ công cụ.", "What ML is, supervised and unsupervised learning, the workflow and the toolkit."], { d: ["Dự đoán giá nhà bằng hồi quy tuyến tính, phân loại hoa Iris bằng KNN", "House-price prediction with linear regression, Iris classification with KNN"], ex: 5 }],
          [["Xử lý dữ liệu & EDA", "Data preparation & EDA"], ["Làm sạch, khám phá và trực quan hoá dữ liệu; xử lý giá trị thiếu và ngoại lệ.", "Cleaning, exploring and visualising data; handling missing values and outliers."], { d: ["Khám phá bộ dữ liệu tàu Titanic, làm sạch dữ liệu bẩn", "Exploring the Titanic dataset, cleaning dirty data"], ex: 5 }],
          [["Feature Engineering & cây quyết định", "Feature engineering & decision trees"], ["Tạo đặc trưng, Decision Tree, Random Forest.", "Building features, decision trees, random forests."], { d: ["Dựng pipeline Titanic hoàn chỉnh, so sánh overfitting, Random Forest với GridSearchCV", "A complete Titanic pipeline, comparing overfitting, Random Forest with GridSearchCV"], ex: 5 }],
          ["Logistic Regression, SVM & Metrics", ["Phân loại tuyến tính, SVM; đánh giá bằng accuracy, precision, recall, F1, ROC.", "Linear classifiers, SVM; evaluation with accuracy, precision, recall, F1 and ROC."], { d: ["Logistic Regression và SVM, tự tính metrics, vẽ đường ROC, xử lý dữ liệu lệch lớp", "Logistic regression and SVM, computing metrics by hand, ROC curves, imbalanced data"], ex: 5 }],
          [["Học không giám sát & PCA", "Unsupervised learning & PCA"], ["Phân cụm K-Means, giảm chiều bằng PCA.", "K-Means clustering, dimensionality reduction with PCA."], { d: ["Phân cụm K-Means với phương pháp khuỷu tay, kết hợp PCA và K-Means", "K-Means clustering with the elbow method, PCA combined with K-Means"], ex: 5 }],
          ["Ensemble & End-to-End", ["Bagging, Boosting (XGBoost), pipeline hoàn chỉnh.", "Bagging, boosting (XGBoost), a complete pipeline."], { d: ["XGBoost với GridSearchCV, lưu và nạp mô hình", "XGBoost with GridSearchCV, saving and loading models"], ex: 5, pj: ["Dự đoán bệnh tim end-to-end", "End-to-end heart-disease prediction"] }],
          [["Mạng nơ-ron", "Neural networks"], ["Perceptron, MLP, backpropagation; Keras trên MNIST.", "Perceptron, MLP, backpropagation; Keras on MNIST."], { d: ["Nhận dạng chữ số viết tay bằng Keras, tự code mạng nơ-ron từ số 0 bằng NumPy", "Handwritten digit recognition with Keras, a neural network from scratch in NumPy"], ex: 5 }],
          ["NLP", ["Xử lý văn bản, TF-IDF, phân loại văn bản.", "Text processing, TF-IDF, text classification."], { d: ["Phân loại tin nhắn spam, phân loại chủ đề văn bản bằng TF-IDF", "Spam SMS filtering, topic classification with TF-IDF"], ex: 4 }],
          [["Chuỗi thời gian", "Time series"], ["Dự báo chuỗi thời gian.", "Forecasting time series."], { d: ["Dự đoán nhiệt độ, dự báo lượng hành khách hàng không, dự đoán doanh số", "Temperature prediction, airline-passenger forecasting, sales prediction"], ex: 4 }],
          ["CNN & Computer Vision", ["Mạng tích chập, phân loại ảnh.", "Convolutional networks, image classification."], { d: ["CNN nhận dạng chữ số trên 99%, phân loại 10 loại ảnh CIFAR-10", "A CNN above 99% on digits, 10-class image classification on CIFAR-10"], ex: 4 }],
          [["Triển khai mô hình", "Deploying a model"], ["Đưa mô hình lên production bằng API và Docker.", "Shipping a model to production with an API and Docker."], { d: ["Đưa mô hình lên web bằng Streamlit, viết REST API bằng FastAPI", "Putting the model on the web with Streamlit, a REST API with FastAPI"], ex: 4, pj: ["Ứng dụng web dự đoán bệnh tim", "Heart-disease prediction web app"] }],
          [["Capstone & tổng kết", "Capstone & wrap-up"], ["Dự án tổng hợp end-to-end.", "An end-to-end capstone project."], { d: ["Soát 4 cạm bẫy của dự án ML: baseline, accuracy, rò rỉ dữ liệu, ngưỡng quyết định", "Checking four ML-project traps: baseline, accuracy, data leakage, decision threshold"], pj: ["Capstone end-to-end", "End-to-end capstone"] }],
          [["Toán hồi quy nâng cao", "Advanced regression maths"], ["Hồi quy chuyên sâu, regularization (Ridge, Lasso).", "Regression in depth, regularisation (Ridge, Lasso)."], { d: ["Ridge, Lasso, ElasticNet; so sánh 9 mô hình hồi quy trên cùng một bộ dữ liệu", "Ridge, Lasso, ElasticNet; comparing nine regressors on one dataset"], ex: 5 }],
          ["RNN, LSTM, Transformer", ["Mô hình chuỗi và cơ chế attention.", "Sequence models and the attention mechanism."], { d: ["LSTM dự đoán giá cổ phiếu, phân tích cảm xúc bằng Transformer", "LSTM stock-price prediction, sentiment analysis with Transformers"], ex: 4 }],
          ["LLM, RAG & GenAI", ["Mô hình ngôn ngữ lớn, RAG, AI tạo sinh.", "Large language models, RAG, generative AI."], { d: ["Prompt engineering với Claude API, chatbot RAG hỏi đáp tài liệu PDF", "Prompt engineering with the Claude API, a RAG chatbot over PDF documents"], ex: 4, pj: ["Chatbot RAG cho lĩnh vực bạn chọn", "A RAG chatbot for a field of your choice"] }],
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
    weeks: 8,
    months: ["2 tháng", "2 months"],
    hours: ["2,5–3 giờ", "2.5–3 hours"],
    practice: ["61 bài tập", "61 exercises"],
    practiceMore: ["30 bản demo PyTorch chạy được, 5 dự án", "30 runnable PyTorch demos, 5 projects"],
    final: ["Một mô hình học sâu của riêng bạn, chuyển sang ONNX, lượng tử hoá và đưa lên Hugging Face Spaces.", "A deep-learning model of your own, exported to ONNX, quantised and deployed to Hugging Face Spaces."],
    cover: {
      kind: "code",
      lines: [[["for", "k"], " x, y ", ["in", "k"], " loader:"], ["    loss = loss_fn(net(x), y)"], ["    loss.backward(); opt.step()"]],
      out: ["✓ Loss giảm dần qua từng epoch", "✓ Loss falls epoch after epoch"],
    },
    parts: [
      {
        sessions: [
          [["Giới thiệu Deep Learning & PyTorch", "Introduction to deep learning & PyTorch"], ["Tensor, autograd, vòng lặp huấn luyện.", "Tensors, autograd, the training loop."], { d: ["Tensor và autograd, huấn luyện MLP trên MNIST, so sánh PyTorch với Keras", "Tensors and autograd, training an MLP on MNIST, PyTorch against Keras"], ex: 4 }],
          [["Mạng nơ-ron chuyên sâu", "Neural networks in depth"], ["Kiến trúc, hàm kích hoạt, khởi tạo trọng số.", "Architectures, activation functions, weight initialisation."], { d: ["Tự code lan truyền ngược không dùng autograd, thí nghiệm tiêu biến gradient", "Backpropagation by hand without autograd, vanishing-gradient experiments"], ex: 5 }],
          [["Optimization & Training Tricks", "Optimisation & training tricks"], ["Optimizer, regularization, BatchNorm, Dropout.", "Optimisers, regularisation, BatchNorm, Dropout."], { d: ["So sánh 5 optimizer, dựng pipeline huấn luyện chuyên nghiệp (AdamW, OneCycleLR, mixed precision)", "Comparing five optimisers, a professional training pipeline (AdamW, OneCycleLR, mixed precision)"], ex: 4 }],
          [["CNN nâng cao & ResNet", "Advanced CNNs & ResNet"], ["Mạng tích chập sâu, skip connection.", "Deep convolutional networks, skip connections."], { d: ["Dựng ResNet và VGG-11 từ đầu, fine-tune ResNet50 / EfficientNet", "ResNet and VGG-11 from scratch, fine-tuning ResNet50 / EfficientNet"], ex: 4 }],
          ["Object Detection (YOLO)", ["Phát hiện vật thể trong ảnh.", "Detecting objects in images."], { d: ["Tự code IoU và NMS, chạy YOLOv8 nhiều tình huống", "IoU and NMS by hand, YOLOv8 across scenarios"], ex: 4, pj: ["Huấn luyện YOLO trên dữ liệu riêng", "Training YOLO on your own data"] }],
          ["Image Segmentation (U-Net)", ["Phân vùng ảnh theo từng pixel.", "Segmenting images pixel by pixel."], { d: ["U-Net cho ảnh y tế, gán nhãn tự động bằng SAM", "U-Net on medical images, auto-labelling with SAM"], ex: 4 }],
          ["Vision Transformer & CLIP", ["ViT, mô hình thị giác – ngôn ngữ.", "ViT, vision–language models."], { d: ["Fine-tune ViT, máy tìm ảnh bằng CLIP, phân loại vật thể tiếng Việt không cần huấn luyện", "Fine-tuning ViT, an image search engine with CLIP, zero-shot Vietnamese object classification"], ex: 4 }],
          ["NLP: Word2Vec & BERT", ["Word embedding, Transformer cho ngôn ngữ.", "Word embeddings, Transformers for language."], { d: ["Fine-tune PhoBERT cho tin tức Việt, nhận dạng thực thể (NER)", "Fine-tuning PhoBERT on Vietnamese news, named-entity recognition"], ex: 4, pj: ["Phân tích cảm xúc tiếng Việt", "Vietnamese sentiment analysis"] }],
          ["GPT From Scratch", ["Tự cài mô hình GPT từ đầu.", "Implementing a GPT model from the ground up."], { d: ["Tự code Mini-GPT, huấn luyện trên văn bản tiếng Việt, fine-tune GPT-2", "A Mini-GPT from scratch, trained on Vietnamese text, fine-tuning GPT-2"], ex: 4 }],
          ["GAN", ["Mạng đối sinh, sinh ảnh.", "Generative adversarial networks for image generation."], { d: ["DCGAN sinh chữ số và mặt người, GAN có điều kiện, WGAN-GP", "DCGAN generating digits and faces, conditional GANs, WGAN-GP"], ex: 4, pj: ["GAN trên dữ liệu của bạn", "A GAN on your own data"] }],
          ["VAE & Diffusion", ["Autoencoder biến phân, mô hình khuếch tán.", "Variational autoencoders, diffusion models."], { d: ["VAE và mô hình khuếch tán (DDPM) trên MNIST, Stable Diffusion với diffusers", "VAE and a diffusion model (DDPM) on MNIST, Stable Diffusion with diffusers"], ex: 4 }],
          ["Multimodal: CLIP & DALL·E", ["Đa phương thức, text-to-image.", "Multimodal models, text-to-image."], { d: ["Stable Diffusion, chú thích ảnh bằng BLIP-2, chép lời video bằng Whisper, chatbot đa phương thức", "Stable Diffusion, image captioning with BLIP-2, transcribing video with Whisper, a multimodal chatbot"], ex: 4 }],
          ["RL: Q-Learning & DQN", ["Học tăng cường cơ bản (value-based).", "Reinforcement learning basics (value-based)."], { d: ["Q-Learning trên FrozenLake, DQN chơi CartPole", "Q-Learning on FrozenLake, DQN playing CartPole"], ex: 4, pj: ["DQN chơi game Atari", "DQN plays Atari"] }],
          ["RL: Policy Gradient & RLHF", ["Policy gradient, căn chỉnh mô hình bằng RLHF.", "Policy gradients, aligning models with RLHF."], { d: ["PPO cho robot hai chân (BipedalWalker), fine-tune chatbot bằng DPO", "PPO for a two-legged walker (BipedalWalker), fine-tuning a chatbot with DPO"], ex: 4 }],
          ["Production & Capstone", ["Triển khai mô hình deep learning và dự án tổng kết.", "Deploying deep models, plus the capstone project."], { d: ["Chuyển mô hình sang ONNX, lượng tử hoá, đưa lên Hugging Face Spaces bằng Gradio", "Exporting to ONNX, quantisation, deploying to Hugging Face Spaces with Gradio"], ex: 4, pj: ["Đồ án cuối khoá", "Capstone project"] }],
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
    weeks: 10,
    months: ["2,5 tháng", "2.5 months"],
    hours: ["2,5–3,5 giờ", "2.5–3.5 hours"],
    practice: ["100 bài tập", "100 exercises"],
    practiceMore: ["40 bản demo chạy được, mỗi buổi kết thúc bằng một dự án nhỏ", "40 runnable demos, every session ending in a mini project"],
    final: ["Hệ thống học tăng cường end-to-end, sau 20 dự án nhỏ từ bandit đến AlphaZero thu nhỏ.", "An end-to-end reinforcement-learning system, after 20 mini projects from bandits to a small AlphaZero."],
    cover: {
      kind: "code",
      lines: [["action = agent.act(state)"], ["state, reward = env.step(action)"], ["agent.learn(reward)"]],
      out: ["✓ Tác tử tự học giữ thăng bằng", "✓ The agent learns to balance"],
    },
    parts: [
      {
        name: ["Phần 1 · Nền tảng", "Part 1 · Foundations"],
        sessions: [
          ["RL & Multi-Armed Bandit", ["Khám phá hay khai thác; ε-greedy, UCB, Thompson Sampling.", "Explore or exploit; ε-greedy, UCB, Thompson sampling."], { d: ["So sánh Greedy, ε-greedy, UCB, Thompson Sampling", "Comparing greedy, ε-greedy, UCB and Thompson sampling"], ex: 5, pj: ["Tối ưu quảng cáo bằng bandit", "Ad optimisation with bandits"] }],
          ["Contextual Bandit → MDP", ["Thêm ngữ cảnh (LinUCB), cá nhân hoá; cầu nối tới MDP.", "Adding context (LinUCB), personalisation; the bridge to MDPs."], { d: ["LinUCB so với bandit thường, gợi ý tin tức cá nhân hoá", "LinUCB against a plain bandit, personalised news recommendations"], ex: 5, pj: ["Hệ gợi ý phim, sản phẩm cá nhân hoá", "A personalised film and product recommender"] }],
          [["MDP & phương trình Bellman", "MDPs & the Bellman equations"], ["S, A, P, R, γ; V(s), Q(s,a); Bellman expectation và optimality.", "S, A, P, R, γ; V(s), Q(s,a); Bellman expectation and optimality."], { d: ["Dựng MDP Gridworld, đánh giá chính sách, thử hệ số chiết khấu γ", "Building a Gridworld MDP, policy evaluation, experimenting with the discount γ"], ex: 5, pj: ["Mô hình hoá một bài toán thật thành MDP", "Turning a real problem into an MDP"] }],
          ["Dynamic Programming", "Policy Iteration, Value Iteration, GPI.", { d: ["Value Iteration và Policy Iteration giải Gridworld có đích và bẫy", "Value and policy iteration on a Gridworld with goals and traps"], ex: 5, pj: ["Robot giao hàng tối ưu", "An optimal delivery robot"] }],
        ],
      },
      {
        name: ["Phần 2 · Model-free Tabular", "Part 2 · Model-free tabular"],
        sessions: [
          ["Monte Carlo", ["Học từ episode trọn vẹn; MC control (Blackjack).", "Learning from complete episodes; MC control (Blackjack)."], { d: ["Monte Carlo prediction, tự học chơi Blackjack", "Monte Carlo prediction, learning to play Blackjack"], ex: 5, pj: ["Chiến lược tối ưu cho game tự thiết kế", "The best strategy for a game you design"] }],
          ["Temporal-Difference & SARSA", ["Bootstrapping, học sau mỗi bước; on-policy (Cliff Walking).", "Bootstrapping, learning at every step; on-policy (Cliff Walking)."], { d: ["TD(0) so với Monte Carlo, SARSA giải Cliff Walking", "TD(0) against Monte Carlo, SARSA on Cliff Walking"], ex: 5, pj: ["Agent điều hướng biết tính rủi ro", "A risk-aware navigation agent"] }],
          ["Q-Learning", ["Off-policy, học thẳng chính sách tối ưu; Double Q.", "Off-policy, learning the optimal policy directly; Double Q."], { d: ["Q-Learning so với SARSA, Q-Learning giải bài Taxi đón trả khách", "Q-Learning against SARSA, Q-Learning on the Taxi pick-up problem"], ex: 5, pj: ["Agent tự học chơi game lưới", "An agent that teaches itself a grid game"] }],
          ["TD(λ) & Eligibility Traces", ["n-step, cầu nối giữa MC và TD, SARSA(λ).", "n-step returns, bridging MC and TD, SARSA(λ)."], { d: ["n-step TD, SARSA(λ) với eligibility traces", "n-step TD, SARSA(λ) with eligibility traces"], ex: 5, pj: ["So tốc độ hội tụ theo λ khi thưởng trễ", "Convergence speed against λ with delayed reward"] }],
        ],
      },
      {
        name: ["Phần 3 · Value-based Deep RL", "Part 3 · Value-based deep RL"],
        sessions: [
          ["Function Approximation", "Tile coding, semi-gradient, deadly triad (Mountain Car).", { d: ["Mountain Car với tile coding, tái hiện deadly triad", "Mountain Car with tile coding, reproducing the deadly triad"], ex: 5, pj: ["Tự thiết kế đặc trưng cho bài liên tục", "Designing features for a continuous problem"] }],
          ["Deep Q-Network (DQN)", ["Mạng Q, Experience Replay, Target Network (CartPole).", "Q-network, experience replay, target network (CartPole)."], { d: ["Tự code DQN bằng PyTorch giải CartPole, thử bỏ target network", "DQN from scratch in PyTorch on CartPole, testing without a target network"], ex: 5, pj: ["DQN giải LunarLander", "DQN solves LunarLander"] }],
          [["DQN nâng cao → Rainbow", "Advanced DQN → Rainbow"], "Double, Dueling, Prioritized Replay, Noisy, Distributional.", { d: ["Double DQN, Dueling, Prioritized Replay", "Double DQN, Dueling, Prioritized Replay"], ex: 5, pj: ["Ghép dần Rainbow, đo từng thành phần", "Building Rainbow step by step, with ablations"] }],
        ],
      },
      {
        name: ["Phần 4 · Policy-based Deep RL", "Part 4 · Policy-based deep RL"],
        sessions: [
          ["Policy Gradient & REINFORCE", ["Học thẳng chính sách, định lý policy gradient, baseline giảm phương sai.", "Learning the policy directly, the policy-gradient theorem, variance-reducing baselines."], { d: ["REINFORCE giải CartPole, đo phương sai khi có baseline", "REINFORCE on CartPole, measuring variance with a baseline"], ex: 5, pj: ["REINFORCE cho bài quyết định nhiều lựa chọn", "REINFORCE for a multi-choice decision problem"] }],
          ["Actor-Critic (A2C/A3C)", ["Actor và Critic, advantage, GAE.", "Actor and critic, advantage, GAE."], { d: ["A2C với GAE giải CartPole, so phương sai ba cách", "A2C with GAE on CartPole, comparing variance three ways"], ex: 5, pj: ["A2C + GAE trên môi trường Gymnasium", "A2C + GAE on a Gymnasium environment"] }],
          ["PPO & TRPO", ["Clip giới hạn bước cập nhật để ổn định; nền của RLHF.", "Clipping the update step for stability; the basis of RLHF."], { d: ["Tự code PPO bằng PyTorch, minh hoạ cơ chế clip", "PPO from scratch in PyTorch, how the clip works"], ex: 5, pj: ["PPO giải LunarLander", "PPO solves LunarLander"] }],
          ["Continuous Control (DDPG · TD3 · SAC)", ["Điều khiển liên tục cho robot (Pendulum, MuJoCo).", "Continuous control for robots (Pendulum, MuJoCo)."], { d: ["TD3 điều khiển con lắc Pendulum, tự cài SAC", "TD3 controlling a pendulum, implementing SAC"], ex: 5, pj: ["SAC / TD3 giải bài điều khiển khó", "SAC / TD3 on a hard control task"] }],
        ],
      },
      {
        name: ["Phần 5 · Nâng cao & RLHF", "Part 5 · Advanced & RLHF"],
        sessions: [
          ["Model-based (Dyna · MCTS · MuZero)", ["Học mô hình thế giới, lập kế hoạch; AlphaZero, MuZero.", "Learning a world model, planning; AlphaZero, MuZero."], { d: ["Dyna-Q lập kế hoạch trong mê cung, MCTS chơi cờ ca-rô", "Dyna-Q planning in a maze, MCTS playing tic-tac-toe"], ex: 5, pj: ["AlphaZero thu nhỏ: self-play + MCTS + mạng nơ-ron", "A small AlphaZero: self-play + MCTS + a neural network"] }],
          ["Exploration · Reward Shaping", ["RND, phần thưởng thưa, potential-based shaping, cẩm nang debug.", "RND, sparse rewards, potential-based shaping, a debugging playbook."], { d: ["Vì sao thưởng thưa khó, count-based exploration, RND", "Why sparse rewards are hard, count-based exploration, RND"], ex: 5, pj: ["Giải môi trường khó bằng đủ các mẹo", "Cracking a hard environment with every trick"] }],
          ["Offline RL & Imitation Learning", ["Học từ dữ liệu tĩnh; BC, DAgger, GAIL, CQL.", "Learning from static data; BC, DAgger, GAIL, CQL."], { d: ["Behavior Cloning và lỗi tích luỹ, DAgger, CQL", "Behaviour cloning and compounding error, DAgger, CQL"], ex: 5, pj: ["Học điều khiển từ người làm mẫu", "Learning control from demonstrations"] }],
          ["Multi-Agent RL (MARL)", "Non-stationarity, Nash, self-play (CTDE, QMIX, MADDPG).", { d: ["Thế lưỡng nan tù nhân, oẳn tù tì tự chơi hội tụ về cân bằng Nash", "Prisoner's dilemma, rock-paper-scissors self-play converging to Nash"], ex: 5, pj: ["Trò chơi nhiều agent hợp tác và cạnh tranh", "A cooperative and competitive multi-agent game"] }],
          ["RLHF · DPO & Capstone", ["Căn chỉnh LLM bằng reward model và DPO; dự án tổng kết.", "Aligning LLMs with a reward model and DPO; the capstone."], { d: ["RLHF thu nhỏ với reward model, DPO trên mô hình ngôn ngữ nhỏ thật", "A small RLHF with a reward model, DPO on a real small language model"], ex: 5, pj: ["Capstone: hệ thống RL end-to-end", "Capstone: an end-to-end RL system"] }],
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
    weeks: 8,
    months: ["2 tháng", "2 months"],
    hours: ["2,5–3,5 giờ", "2.5–3.5 hours"],
    practice: ["73 bài tập", "73 exercises"],
    practiceMore: ["30 bản demo chạy được, 3 dự án lớn và đồ án cuối khoá", "30 runnable demos, 3 major projects and a capstone"],
    final: ["Hệ thống thị giác máy tính end-to-end kèm tài liệu kiến trúc; trên đường đi: chấm công bằng khuôn mặt, đọc hoá đơn tiếng Việt, bãi đỗ xe đọc biển số.", "An end-to-end computer-vision system with an architecture document; along the way: face check-in, Vietnamese receipt reading, a licence-plate car park."],
    cover: {
      kind: "code",
      lines: [["model = YOLO(", ['"yolo11n.pt"', "s"], ")"], [["for", "k"], " box ", ["in", "k"], " model.track(camera):"], ["    count(box.id)"]],
      out: ["✓ Phát hiện, bám và đếm qua camera", "✓ Detect, track and count on camera"],
    },
    parts: [
      {
        sessions: [
          ["CV Architect Mindset", ["Tư duy giải pháp, pipeline 5 pha, chi phí sở hữu (TCO).", "Solution thinking, the five-phase pipeline, total cost of ownership."], { d: ["Khung pipeline CV production, tính chi phí Cloud so với Edge, viết tài liệu quyết định kiến trúc", "A production CV pipeline template, cloud-versus-edge cost, an architecture decision record"], ex: 4 }],
          ["Image Processing: OpenCV Pro", ["Xử lý ảnh nâng cao, quét tài liệu, augmentation.", "Advanced image processing, document scanning, augmentation."], { d: ["Máy quét tài liệu, đếm đồng xu bằng OpenCV, kiểm tra sản phẩm lỗi", "A document scanner, coin counting with OpenCV, spotting defective products"], ex: 4 }],
          ["Annotation & Active Learning", ["Gán nhãn, active learning, dữ liệu tổng hợp, DVC.", "Labelling, active learning, synthetic data, DVC."], { d: ["Vòng active learning, gán nhãn tự động bằng GroundingDINO + SAM 2", "An active-learning loop, auto-labelling with GroundingDINO + SAM 2"], ex: 5 }],
          ["Detection Production (YOLO11 · RT-DETR)", ["Phát hiện ở mức production, TTA, ensemble, open-vocabulary (GroundingDINO).", "Production-grade detection, TTA, ensembles, open-vocabulary (GroundingDINO)."], { d: ["YOLO11 + TTA + ensemble, phát hiện vật thể bằng câu lệnh chữ", "YOLO11 + TTA + ensembles, detecting objects from a text prompt"], ex: 5 }],
          ["Multi-Object Tracking (MOT)", ["Bám đa đối tượng (ByteTrack), Re-ID, đếm người.", "Tracking many objects (ByteTrack), Re-ID, people counting."], { d: ["Đếm người vào ra cửa hàng bằng ByteTrack, nhận lại khách giữa các camera", "Counting shoppers in and out with ByteTrack, re-identifying people across cameras"], ex: 5 }],
          ["Pose & Action Recognition", ["Tư thế và hành động: phát hiện té ngã, huấn luyện viên tập luyện.", "Pose and action: fall detection, a workout coach."], { d: ["Phát hiện người ngã, huấn luyện viên đếm rep và chấm tư thế squat", "Fall detection, a coach that counts reps and grades squat form"], ex: 5 }],
          ["Face Recognition Production", ["Nhận diện khuôn mặt (ArcFace), chống giả mạo, vector DB.", "Face recognition (ArcFace), anti-spoofing, vector DB."], { d: ["Chấm công bằng khuôn mặt, chống giả mạo bằng ảnh", "Face check-in, anti-spoofing"], ex: 5, pj: ["Chấm công văn phòng end-to-end", "End-to-end office check-in"] }],
          ["OCR & Document AI", ["Trích xuất văn bản và hoá đơn tiếng Việt (PaddleOCR, VietOCR).", "Extracting text and Vietnamese invoices (PaddleOCR, VietOCR)."], { d: ["Đọc hoá đơn thành JSON, trích trường từ CCCD và hoá đơn", "Turning receipts into JSON, extracting fields from ID cards and invoices"], ex: 5, pj: ["Đọc hoá đơn tiếng Việt", "Vietnamese receipt extractor"] }],
          ["License Plate Recognition (LPR)", ["Nhận diện biển số Việt Nam, bãi đỗ xe, triển khai trên thiết bị biên.", "Vietnamese licence plates, parking systems, edge deployment."], { d: ["Đọc và chuẩn hoá biển số Việt Nam, bãi đỗ xe vào, ra, tính phí", "Reading Vietnamese licence plates, a parking lot with entry, exit and fees"], ex: 5, pj: ["Bãi đỗ xe đọc biển số trên thiết bị biên", "Licence-plate parking on an edge device"] }],
          ["Video Analytics & Anomaly", ["Đếm đám đông, đồ bảo hộ (PPE), xâm nhập và lảng vảng.", "Crowd counting, PPE compliance, intrusion and loitering."], { d: ["Giám sát mũ bảo hộ ở công trường, phát hiện xâm nhập và lảng vảng", "Hard-hat monitoring on site, intrusion and loitering detection"], ex: 5 }],
          ["Real-time Stream & DeepStream", ["Xử lý đa luồng camera, batching, Triton.", "Multi-camera streams, batching, Triton."], { d: ["Chạy nhiều camera cùng lúc không trễ, gom lô khung hình cho GPU", "Many cameras at once without lag, batching frames for the GPU"], ex: 5 }],
          ["3D Vision, Depth & SLAM", ["Thị giác 3D, ước lượng độ sâu, đo đạc AR.", "3D vision, depth estimation, AR measurement."], { d: ["Ảnh độ sâu thành đám mây điểm, đo kích thước thật qua camera", "Depth images to point clouds, measuring real sizes through a camera"], ex: 5, pj: ["Quét 3D, đo AR bằng điện thoại", "Phone 3D scanner and AR measure"] }],
          ["Medical & Industrial Vision", ["Y tế (segmentation), công nghiệp (phát hiện bất thường).", "Medical (segmentation) and industrial (anomaly detection)."], { d: ["Phát hiện lỗi sản phẩm chỉ học từ ảnh bình thường, chỉ số lâm sàng cho ảnh y tế", "Defect detection learned only from normal images, clinical metrics for medical images"], ex: 5, pj: ["Phát hiện lỗi bo mạch (QC 4.0)", "PCB defect detector (QC 4.0)"] }],
          ["Edge AI: Jetson & Mobile", ["Triển khai trên thiết bị biên, lượng tử hoá INT8, chọn thiết bị.", "Edge deployment, INT8 quantisation, choosing hardware."], { d: ["So FP32, FP16, INT8; chọn thiết bị biên theo bài toán; triển khai trên Jetson và điện thoại", "FP32, FP16 and INT8 compared; choosing edge hardware; deploying to Jetson and mobile"], ex: 5 }],
          ["CV Architecture & Capstone", ["Kiến trúc microservices, giám sát và drift, dự án end-to-end.", "Microservice architecture, monitoring and drift, an end-to-end project."], { d: ["Pipeline microservices, phát hiện trôi dữ liệu không cần nhãn", "A microservices pipeline, detecting data drift without labels"], ex: 5, pj: ["Capstone: hệ thống CV end-to-end", "Capstone: an end-to-end CV system"] }],
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
    weeks: 5,
    months: ["Hơn 1 tháng", "Over 1 month"],
    practice: ["10 bài toán thật", "10 real problems"],
    practiceMore: ["Mỗi buổi một bài toán doanh nghiệp, dữ liệu công khai", "One business problem per session, on public data"],
    final: ["Trợ lý AI tra cứu tài liệu nội bộ và đặt lịch, trả lời có trích dẫn nguồn.", "An AI assistant that searches internal documents and books appointments, citing its sources."],
    cover: {
      kind: "code",
      lines: [["index = embed(documents)"], ["docs = index.search(question)"], ["answer = llm(question, docs)"]],
      out: ["✓ Trả lời kèm trích dẫn nguồn", "✓ Answer with cited sources"],
    },
    parts: [
      {
        name: ["Phần 1 · Nền tảng xử lý ngôn ngữ", "Part 1 · Language-processing foundations"],
        sessions: [
          ["TF-IDF", ["Biểu diễn văn bản bằng tần suất từ, mô hình phân loại văn bản đầu tiên.", "Representing text by word frequency, a first text classifier."], { d: ["Tự động phân loại ticket hỗ trợ khách hàng", "Routing customer-support tickets automatically"] }],
          ["Word2Vec / GloVe", ["Nhúng từ: từ gần nghĩa thì vectơ gần nhau.", "Word embeddings: words with similar meanings sit close together."], { d: ["Gợi ý sản phẩm liên quan cho cửa hàng online", "Recommending related products for an online shop"] }],
          ["BERT / PhoBERT", ["Mô hình ngôn ngữ học sẵn, fine-tune cho tiếng Việt.", "Pre-trained language models, fine-tuned for Vietnamese."], { d: ["Phân tích cảm xúc bình luận tiếng Việt", "Sentiment analysis of Vietnamese comments"] }],
          ["GPT from scratch", ["Tự cài kiến trúc Transformer sinh văn bản.", "Implementing a text-generating Transformer yourself."], { d: ["Tự code một mô hình sinh văn bản", "Coding a text-generation model yourself"] }],
          ["T5 (Seq2Seq)", ["Mô hình seq2seq: văn bản vào, văn bản ra.", "Seq2seq models: text in, text out."], { d: ["Tóm tắt văn bản tiếng Việt", "Summarising Vietnamese text"] }],
        ],
      },
      {
        name: ["Phần 2 · LLM ứng dụng", "Part 2 · Applied LLMs"],
        sessions: [
          ["LLM API", ["Gọi mô hình ngôn ngữ lớn qua API, kiểm soát chi phí và độ ổn định.", "Calling large language models over an API, keeping cost and reliability in check."], { d: ["Tóm tắt biên bản họp tự động", "Summarising meeting minutes automatically"] }],
          ["Prompt Engineering", ["Viết prompt có cấu trúc, ép đầu ra theo khuôn.", "Structured prompts, forcing output into a fixed shape."], { d: ["Chuẩn hoá câu trả lời chăm sóc khách hàng", "Standardising customer-service replies"] }],
          ["Embeddings + Cosine", ["Tìm kiếm theo nghĩa thay vì theo từ khoá.", "Searching by meaning instead of keywords."], { d: ["Khớp CV ứng viên với mô tả công việc", "Matching candidate CVs to job descriptions"] }],
          ["RAG + Vector DB", ["Cho LLM trả lời dựa trên tài liệu của bạn, có trích dẫn.", "Letting an LLM answer from your documents, with citations."], { d: ["Hỏi đáp quy trình nội bộ", "Q&A over internal procedures"] }],
          ["AI Agents", ["LLM biết gọi công cụ và làm việc nhiều bước.", "LLMs that call tools and work in several steps."], { d: ["Trợ lý tra cứu và đặt lịch", "An assistant that looks things up and books appointments"] }],
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
    weeks: 4,
    months: ["1 tháng", "1 month"],
    practice: ["8 bài thực chiến", "8 field exercises"],
    practiceMore: ["Mỗi bài một tình huống triển khai thật", "Each one a real deployment situation"],
    final: ["Mô hình chạy ngay trên thiết bị, kèm hệ thống giám sát phát hiện khi nó xuống cấp.", "A model running on the device, with monitoring that catches it degrading."],
    cover: {
      kind: "code",
      lines: [["model = load(", ['"detector.onnx"', "s"], ")"], ["small = quantize(model, ", ['"int8"', "s"], ")"], ["small.save(", ['"model.tflite"', "s"], ")"]],
      out: ["✓ Chạy tại chỗ, không cần cloud", "✓ Runs on the device, no cloud"],
    },
    parts: [
      {
        name: ["Phần 1 · Mô hình mang đi triển khai", "Part 1 · The models you will deploy"],
        sessions: [
          [["MLP với Keras", "MLP with Keras"], ["Tự thiết kế kiến trúc mạng, một mô hình nhỏ gọn để mang đi triển khai.", "Designing the network yourself, a compact model ready to deploy."], { d: ["Chấm điểm khách hàng tiềm năng mua bảo hiểm ô tô", "Scoring likely buyers of car insurance"] }],
          ["YOLOv8 / v11", ["Mô hình phát hiện vật thể sẽ được nén và đưa xuống thiết bị ở các buổi sau.", "The object detector that later sessions shrink and move onto devices."], { d: ["Đếm xe qua nút giao để điều chỉnh đèn tín hiệu", "Counting vehicles at a junction to tune the traffic lights"] }],
        ],
      },
      {
        name: ["Phần 2 · Nén và đưa xuống thiết bị", "Part 2 · Shrinking it onto the device"],
        sessions: [
          ["ONNX & TensorRT", ["Chuyển đổi mô hình, nơi kết quả sai âm thầm.", "Model conversion, where results go wrong silently."], { d: ["Chuyển PyTorch sang ONNX rồi TensorRT, kiểm chứng sai lệch bằng số (mAP)", "PyTorch to ONNX to TensorRT, verifying the drift with numbers (mAP)"] }],
          [["Lượng tử hoá PTQ / QAT", "Quantisation: PTQ / QAT"], ["Nén 4 lần, và độ chính xác biến mất không đều.", "Four times smaller, and accuracy does not fade evenly."], { d: ["Lượng tử hoá INT8, đo đúng cái giá phải trả và khi nào nó đáng", "INT8 quantisation, measuring exactly what it costs and when it is worth it"] }],
          [["TFLite & di động", "TFLite & mobile"], ["Giới hạn nhiệt, delegate, phần cứng không kiểm soát được.", "Thermal limits, delegates, hardware you do not control."], { d: ["Đưa mô hình lên điện thoại Android, thử với người dùng thật", "Putting the model on Android phones, testing with real users"] }],
        ],
      },
      {
        name: ["Phần 3 · Chạy thật và vận hành", "Part 3 · Running it for real"],
        sessions: [
          ["RTSP & DeepStream", ["Nơi hệ thống camera thật sự sập, và không phải vì mô hình.", "Where camera systems really fall over, and not because of the model."], { d: ["Chẩn đoán và sửa luồng camera rớt kết nối, đầy bộ đệm, rò bộ nhớ", "Diagnosing and fixing camera streams that drop, fill their buffers or leak memory"] }],
          ["Triton Inference Server", ["Dịch vụ dùng chung, P99 và tách mức ưu tiên.", "A shared service, P99 and priority tiers."], { d: ["Tách suy luận thành dịch vụ dùng chung, đo độ trễ P99", "Splitting inference into a shared service, measuring P99 latency"] }],
          [["MLOps cho thị giác máy tính", "MLOps for computer vision"], ["Mô hình xuống cấp mà không ai nhận ra.", "The model degrades and nobody notices."], { d: ["Dựng hệ thống phát hiện mô hình xuống cấp sau triển khai", "Building a system that catches a model degrading after deployment"] }],
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
    weeks: 18,
    months: ["4,5 tháng", "4.5 months"],
    hours: ["3 giờ", "3 hours"],
    practice: ["36 buổi lab", "36 lab sessions"],
    practiceMore: ["4 sản phẩm agent nối tiếp nhau trong khoá", "4 agent products built one after another"],
    final: ["Enterprise AI Agent Platform, bảo vệ trước hội đồng.", "An Enterprise AI Agent Platform, defended before a panel."],
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
          ["LLM Fundamentals, Transformer & Attention", null, { d: ["Thí nghiệm token, chi phí, temperature", "Experiments with tokens, cost and temperature"] }],
          ["Prompt Engineering, Tool Calling", null, { d: ["Tự viết vòng lặp agent bằng API thô", "Writing the agent loop yourself on the raw API"] }],
          ["MCP, AI Agent Landscape, Framework Harness", null, { d: ["Mổ xẻ Claude Code", "taking Claude Code apart"] }],
        ],
      },
      {
        name: ["Phần 2 · Context Harness: nền tảng RAG", "Part 2 · Context harness: RAG foundations"],
        sessions: [
          ["RAG Architecture, Chunking, Embedding", null, { d: ["Index tài liệu tiếng Việt, golden dataset 20 câu", "Indexing Vietnamese documents, a 20-question golden dataset"] }],
          ["Hybrid Search, Reranking", null, { d: ["So sánh recall@5 của 3 cấu hình", "Comparing recall@5 across three configurations"] }],
          ["Agent Memory, Context Compression, Long Context", null, { d: ["Thêm bộ nhớ có nén, trích dẫn bắt buộc", "Adding compressed memory, mandatory citations"] }],
          [["Hoàn thiện trợ lý tri thức nội bộ", "Finishing the internal knowledge assistant"], null, { d: ["Đo lại và báo cáo số liệu trước, sau", "Re-measuring and reporting before/after numbers"] }],
        ],
      },
      {
        name: ["Phần 3 · Bổ trợ Docker", "Part 3 · Docker primer"],
        sessions: [
          ["Docker: image, container, Dockerfile", null, { d: ["Đóng gói trợ lý tri thức", "Packaging the knowledge assistant"] }],
          ["Docker Compose, volume, network, sandbox", null, { d: ["Compose agent với vector DB, sandbox chạy mã", "Composing the agent with a vector DB, a code-execution sandbox"] }],
        ],
      },
      {
        name: ["Phần 4 · Bổ trợ Cloud", "Part 4 · Cloud primer"],
        sessions: [
          [["Cloud: triển khai container, secret manager", "Cloud: deploying containers, secret manager"], null, { d: ["Deploy lên Cloud Run hoặc ECS với HTTPS", "Deploying to Cloud Run or ECS over HTTPS"] }],
          [["CI/CD, autoscaling, chi phí cloud", "CI/CD, autoscaling, cloud cost"], null, { d: ["Pipeline GitHub Actions tự deploy", "A GitHub Actions pipeline that deploys by itself"] }],
        ],
      },
      {
        name: ["Phần 5 · Tool Harness", "Part 5 · Tool Harness"],
        sessions: [
          ["Function Calling, MCP Servers", null, { d: ["Viết MCP server đầu tiên, MCP Inspector", "Writing your first MCP server, MCP Inspector"] }],
          ["API Privilege Design, Least Privilege, Tool Registry", null, { d: ["CRM Agent", "CRM Agent"] }],
          ["Retry, Error Recovery, Audit Logging", null, { d: ["ERP Agent", "ERP Agent"] }],
          [["Database Agent, tổng kết Tool Harness", "Database Agent, Tool Harness wrap-up"], null, { d: ["Text-to-SQL chỉ đọc", "Read-only text-to-SQL"] }],
        ],
      },
      {
        name: ["Phần 6 · Bài tập lớn 1: Drive Agent", "Part 6 · Major assignment 1: Drive Agent"],
        sessions: [
          [["Giao đề Drive Agent, Drive API, OAuth", "Drive Agent brief, Drive API, OAuth"], null, { d: ["Dựng Drive MCP server, tìm file", "Standing up a Drive MCP server, finding files"] }],
          [["Tóm tắt, hỏi đáp, sắp xếp file", "Summarising, answering questions, organising files"], null, { d: ["Nhóm làm việc có trợ giảng", "Team work with teaching assistants"] }],
          [["Demo và chấm Drive Agent", "Drive Agent demo and marking"], null, { d: ["Chấm theo rubric", "Marked against the rubric"] }],
        ],
      },
      {
        name: ["Phần 7 · Orchestration Harness", "Part 7 · Orchestration Harness"],
        sessions: [
          ["Planning, DAG, State Machine, LangGraph", null, { d: ["StateGraph, checkpointer, interrupt", "StateGraph, checkpointer, interrupt"] }],
          ["Multi-Agent Systems, Parallel Execution", null, { d: ["Research Agent, đo chất lượng và chi phí", "Research Agent, measuring quality and cost"] }],
          ["Routing Strategies, Fallback Models", null, { d: ["Customer Service Agent: router và đổi trả", "Customer Service Agent: router and returns"] }],
          [["Hoàn thiện Customer Service Agent", "Finishing the Customer Service Agent"], null, { d: ["Fallback, streaming", "Fallback, streaming"] }],
        ],
      },
      {
        name: ["Phần 8 · Evaluation Harness", "Part 8 · Evaluation Harness"],
        sessions: [
          ["Golden Dataset, LLM-as-a-Judge, Human Feedback", null, { d: ["Golden dataset 50 mục, grader, judge 4 chiều", "A 50-item golden dataset, graders, a four-dimension judge"] }],
          [["RAG Evaluation, Hallucination, pass@k và pass^k", "RAG Evaluation, Hallucination, pass@k and pass^k"], null, { d: ["Ragas, chạy 5 lần, báo cáo pass@1 và pass^3", "Ragas, five runs, reporting pass@1 and pass^3"] }],
          [["A/B Testing, Regression Testing trong CI", "A/B Testing, Regression Testing in CI"], null, { d: ["GitHub Actions chặn merge khi chất lượng giảm quá 2%", "GitHub Actions blocks the merge when quality drops by more than 2%"] }],
        ],
      },
      {
        name: ["Phần 9 · Security Harness", "Part 9 · Security Harness"],
        sessions: [
          ["Threat model, OWASP Agentic Top 10, Injection, Jailbreak", null, { d: ["Guardrail đầu vào và đầu ra", "Input and output guardrails"] }],
          ["Data Leakage, PII, Access Control, Credential", null, { d: ["Presidio, lọc RAG theo quyền, Vault, garak", "Presidio, permission-filtered RAG, Vault, garak"] }],
          ["Attack & Defend AI Agents", null, { d: ["Đổi vai tấn công và phòng thủ, báo cáo lỗ hổng", "Swapping attacker and defender roles, a vulnerability report"] }],
        ],
      },
      {
        name: ["Phần 10 · Governance Harness", "Part 10 · Governance Harness"],
        sessions: [
          ["Audit Trail, Explainability, Approval, HITL", null, { d: ["Audit log append-only, agent card, hàng đợi duyệt", "Append-only audit log, agent card, approval queue"] }],
          ["AI Policies, Risk Management, Compliance", null, { d: ["AI Governance Dashboard", "AI Governance Dashboard"] }],
        ],
      },
      {
        name: ["Phần 11 · AgentOps Harness", "Part 11 · AgentOps Harness"],
        sessions: [
          ["Monitoring, Tracing OpenTelemetry, Observability", null, { d: ["Gắn tracing vào Customer Service Agent, gửi về Phoenix hoặc LangSmith", "Adding tracing to the Customer Service Agent, sent to Phoenix or LangSmith"] }],
          ["Cost, Latency, Accuracy, Drift, Load test", null, { d: ["Dashboard p95, chi phí mỗi tác vụ, k6", "A p95 dashboard, cost per task, k6"] }],
        ],
      },
      {
        name: ["Phần 12 · Project cuối khoá: Enterprise AI Agent Platform", "Part 12 · Final project: Enterprise AI Agent Platform"],
        sessions: [
          [["Kickoff project cuối khoá", "Final project kickoff"], null, { d: ["Chọn đề tài, kiến trúc, cam kết ngưỡng", "Choosing the topic and architecture, committing to thresholds"] }],
          [["Mentoring 1: review kiến trúc và tiến độ", "Mentoring 1: architecture and progress review"], null, { d: ["Review theo 9 thành phần", "A review across nine components"] }],
          [["Mentoring 2: red team chéo, load test, ROI", "Mentoring 2: cross red-teaming, load test, ROI"], null, { d: ["20 kịch bản red team, bảng chi phí", "Twenty red-team scenarios, a cost table"] }],
          [["Bảo vệ trước hội đồng", "Defence before the panel"], null, { d: ["Demo trực tiếp, chấm theo rubric", "A live demo, marked against the rubric"] }],
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
    weeks: 16,
    months: ["4 tháng", "4 months"],
    hours: ["60–90 phút", "60–90 minutes"],
    practice: ["16 buổi thực hành", "16 hands-on sessions"],
    practiceMore: ["Mỗi buổi lý thuyết 60 phút đi kèm một buổi thực hành 90 phút", "Every 60-minute theory session is paired with a 90-minute hands-on one"],
    final: ["Robot của đội, trình diễn ở Ngày hội Giải cứu Bít-Bô trước phụ huynh.", "The team's own robot, shown off to parents at the Rescue Bit-Bo festival."],
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
          [["Robot là gì?", "What is a robot?"], ["Nhận biết robot là máy làm theo lệnh, và chỉ làm đúng điều ta bảo.", "A robot is a machine that follows commands, and does exactly what it is told."]],
          [["“Bạn là robot” tìm kho báu", "“You are the robot” treasure hunt"], ["Ra lệnh bằng 4 thẻ mũi tên để đưa “robot” tới đích.", "Giving commands with four arrow cards to bring the “robot” to the goal."], { d: ["Một bạn đóng vai robot đi trên thảm ô theo dãy thẻ lệnh của đội.", "One child plays the robot on a grid mat, following the team's command cards."] }],
          [["Giác quan – Bộ não – Tay chân", "Senses – Brain – Limbs"], ["Robot có 3 phần: giác quan, bộ não, tay chân; công tắc đóng mở “con đường” điện.", "A robot has three parts: senses, brain, limbs; a switch opens and closes the electric “road”."]],
          [["Làm quen dây nối và công tắc", "Getting to know wires and switches"], ["Bật tắt mạch mẫu, nối lại dây chắc chắn.", "Switching a sample circuit on and off, reconnecting wires firmly."], { d: ["Tháo và nối lại dây, xếp bộ phận robot vào ba nhóm giác quan – bộ não – tay chân.", "Unplugging and reconnecting wires, sorting robot parts into senses, brain and limbs."] }],
          [["Mạch kín và mạch hở", "Closed and open circuits"], ["Đèn chỉ sáng khi mạch kín; cực pin và chiều của đèn LED.", "A light only turns on in a closed circuit; battery poles and LED direction."]],
          [["Thám tử mạch điện", "Circuit detectives"], ["Tự lắp mạch pin – công tắc – đèn LED, tìm lỗi theo thứ tự.", "Building a battery – switch – LED circuit, finding faults in order."], { d: ["Điều tra 3 mạch lỗi (dây hở, công tắc tắt, pin ngược); mỗi em tự sửa một mạch trong 3 phút.", "Investigating three faulty circuits (loose wire, switch off, battery reversed); each child fixes one in three minutes."] }],
        ],
      },
      {
        name: ["Chặng 2 · Chế tạo xe cứu hộ", "Stage 2 · Building the rescue car"],
        sessions: [
          [["Vì sao bánh xe giúp di chuyển dễ?", "Why do wheels make moving easy?"], ["Vì sao vật lăn dễ hơn vật kéo lê; bánh xe, trục, khung làm gì.", "Why rolling beats dragging; what wheels, axles and frames do."]],
          [["Lắp khung xe đầu tiên", "Building the first chassis"], ["Lắp khung xe 4 bánh lăn được.", "Building a four-wheeled frame that rolls."], { d: ["Thử xe trên dốc với bánh to, bánh nhỏ, lốp trơn, lốp gai; ghi bảng so sánh.", "Testing on a slope with big, small, smooth and treaded wheels; recording a comparison."] }],
          [["Bánh răng và đòn bẩy", "Gears and levers"], ["Bánh răng truyền chuyển động và đổi chiều quay; đòn bẩy nâng vật nặng.", "Gears pass on motion and reverse it; levers lift heavy things."]],
          [["Cơ cấu bánh răng của đội", "The team's gear mechanism"], ["Lắp cơ cấu 2–3 bánh răng chạy trơn.", "Building a smooth two- or three-gear train."], { d: ["Đoán chiều quay rồi thử, đếm số vòng bánh răng nhỏ; làm đòn bẩy nâng hộp bút.", "Predicting rotation then testing, counting the small gear's turns; a lever that lifts a pencil case."] }],
          [["Động cơ – cơ bắp của robot", "Motors – the robot's muscles"], ["Động cơ có điện thì quay, đảo dây thì quay ngược; chuỗi lệnh đúng thứ tự.", "A motor spins when powered and reverses when wires swap; commands in the right order."]],
          [["Lắp động cơ, xe tự chạy", "Fitting the motor: the car drives itself"], ["Lắp động cơ vào khung xe cho xe tự chạy.", "Fitting a motor so the car drives itself."], { d: ["Cho động cơ quay và quay ngược; xe chạy thẳng 2 mét, đặt tên xe.", "Spinning and reversing the motor; the car drives two metres straight and gets a name."] }],
          [["Làm sao cho xe tốt hơn?", "How do we make the car better?"], ["Tìm nguyên nhân xe chậm, lệch, đổ; quy trình Thử – Quan sát – Sửa – Thử lại.", "Why a car is slow, veers or tips; the Try – Observe – Fix – Retry cycle."]],
          [["Grand Prix Bít-Bô", "The Bit-Bo Grand Prix"], ["Cải tiến xe dựa trên kết quả chạy thử.", "Improving the car from test results."], { d: ["Đua hai vòng, giữa hai vòng sửa xe theo Phiếu cải tiến.", "Two race rounds, with a repair stop in between."] }],
        ],
      },
      {
        name: ["Chặng 3 · Dạy robot suy nghĩ", "Stage 3 · Teaching the robot to think"],
        sessions: [
          [["Thuật toán là công thức", "An algorithm is a recipe"], ["Thuật toán là các bước theo đúng thứ tự; bo mạch là bộ não của robot.", "An algorithm is steps in the right order; the circuit board is the robot's brain."]],
          [["Làm quen bo mạch, săn Bug trên giấy", "Meeting the circuit board, hunting bugs on paper"], ["Cắm đúng cổng trên bo mạch, tìm lỗi trong chương trình viết trên giấy.", "Plugging into the right ports, finding bugs in a program written on paper."], { d: ["Gắn bo mạch lên xe, chạy chương trình mẫu; săn 3 lỗi trong chuỗi thẻ lệnh.", "Mounting the board and running a sample program; hunting three bugs in command cards."] }],
          [["Lập trình bằng khối màu", "Programming with colour blocks"], ["Làm quen giao diện lập trình khối; số bước và số giây trong lệnh.", "The block-programming screen; steps and seconds in a command."]],
          [["Đưa xe tới kho báu", "Driving the car to the treasure"], ["Ghép 1–5 khối lệnh để xe đi tới đích.", "Snapping one to five blocks together to drive the car to the goal."], { d: ["Chuyển kế hoạch trên giấy thành khối lệnh, dự đoán trước mỗi lần chạy; vòng qua vật cản.", "Turning the paper plan into blocks, predicting before each run; steering round an obstacle."] }],
          [["Vòng lặp như điệp khúc", "Loops are like a chorus"], ["Nhận ra phần lặp lại, dùng vòng lặp để viết gọn.", "Spotting repetition and using a loop to shorten it."]],
          [["Xe chạy hình vuông, đèn nhạc theo vòng lặp", "Driving a square, lights and music in loops"], ["Dùng khối lặp để lập trình xe và đèn.", "Programming the car and lights with loop blocks."], { d: ["Xe chạy hình vuông bằng vòng lặp; mỗi đội soạn một điệu nhảy đèn và còi.", "Driving a square with a loop; each team composes a light-and-horn dance."] }],
          [["Cảm biến siêu âm và Nếu – Thì", "The ultrasonic sensor and If – Then"], ["Cảm biến cho robot biết khoảng cách; câu lệnh Nếu – Thì.", "Sensors tell the robot distances; the If – Then statement."]],
          [["Xe tự dừng trước vật cản", "The car that stops before an obstacle"], ["Đọc khoảng cách từ cảm biến, viết lệnh Nếu – Thì cho xe dừng.", "Reading distances from the sensor, writing If – Then so the car stops."], { d: ["Đo khoảng cách gần, vừa, xa; xe tự dừng trước vật cản, lớp lớn cho xe lùi và rẽ.", "Measuring near, middle and far; the car stops itself, older pupils make it reverse and turn."] }],
          [["Cảm biến dò line", "The line-following sensor"], ["Cảm biến dò line phân biệt đen và trắng; hai trường hợp Nếu – Thì để đi theo vạch.", "The line sensor tells black from white; two If – Then cases to follow a line."]],
          [["Xe đi hết mê cung đen", "The car that finishes the black maze"], ["Lắp cảm biến dò line, lập trình xe đi hết mê cung.", "Fitting the line sensor and programming the car through a maze."], { d: ["Chạy đoạn thẳng, đoạn cong rồi cả mê cung; ghi mỗi lỗi bắt được vào sổ đội.", "A straight, then a curve, then the whole maze; every bug caught goes in the team log."] }],
        ],
      },
      {
        name: ["Chặng 4 · Robot của riêng em", "Stage 4 · A robot of your own"],
        sessions: [
          [["Từ ý tưởng đến thiết kế", "From idea to design"], ["Ôn toàn bộ linh kiện và cách lập trình; chia việc lớn thành việc nhỏ.", "Reviewing every part and programming step; splitting a big job into small ones."]],
          [["Vẽ thiết kế, đăng ký bằng sáng chế", "Drawing the design, filing the patent"], ["Có bản thiết kế robot và thử được bộ phận đầu tiên.", "A robot design on paper, and the first part working."], { d: ["Điền Phiếu bằng sáng chế, chia vai kỹ sư cơ khí – lập trình – thư ký, lắp phần đầu tiên.", "The patent form, roles for mechanics, programming and a bug clerk, the first part built."] }],
          [["Quy trình kỹ sư và Thanh tra Bug", "The engineering process and the Bug inspection"], ["Quy trình Thiết kế – Chế tạo – Thử – Sửa; cách góp ý cho đội bạn.", "The Design – Build – Test – Fix process; giving feedback to another team."]],
          [["Chế tạo và thanh tra lần 1", "Building, and inspection round 1"], ["Robot chạy được phần lớn thiết kế.", "The robot runs most of its design."], { d: ["Chế tạo theo thiết kế; hai đội đổi chỗ thanh tra lỗi cho nhau rồi sửa.", "Building to the design; two teams swap to inspect each other's robot, then fix."] }],
          [["Giới thiệu robot của đội", "Presenting the team's robot"], ["Giải thích chương trình từng khối một, trình bày 2 phút trước lớp.", "Explaining the program block by block, a two-minute talk to the class."]],
          [["Hoàn thiện robot, thanh tra lần 2, tổng duyệt", "Finishing the robot, inspection round 2, dress rehearsal"], ["Robot chạy đủ nhiệm vụ, đội trình bày trọn vẹn.", "The robot completes its mission; the team presents in full."], { d: ["Hoàn thiện, trang trí robot, thanh tra lần 2, tổng duyệt như Ngày hội thật.", "Finishing and decorating, a second inspection, a full dress rehearsal."] }],
          [["Ôn tập và tự đánh giá", "Review and self-assessment"], ["Nhìn lại cả hành trình, tự nhận ra điều mình đã làm được.", "Looking back over the journey and recognising what you can now do."]],
          [["Ngày hội Giải cứu Bít-Bô", "The Rescue Bit-Bo festival"], ["Trình diễn sản phẩm cuối khoá trước phụ huynh.", "Showing the final project to parents."], { d: ["Từng đội giới thiệu robot; robot các đội hợp lực trên bản đồ chung; phụ huynh điều khiển cùng con.", "Each team presents its robot; all robots work together on one map; parents drive them with their children."] }],
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
    weeks: 11,
    months: ["Gần 3 tháng", "Nearly 3 months"],
    practice: ["105 bài tập", "105 exercises"],
    practiceMore: ["22 notebook chạy được, học trên dữ liệu thị trường thật", "22 runnable notebooks, on real market data"],
    final: ["3 dự án trên GitHub, CV một trang và 30 câu phỏng vấn đã luyện.", "3 projects on GitHub, a one-page CV and 30 rehearsed interview questions."],
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
          [["Tư duy phân tích", "Analytical thinking"], ["Câu hỏi trước, dữ liệu sau. Khung 5 câu hỏi, định nghĩa metric, bốn tầng phân tích.", "Question first, data second. The five-question frame, defining metrics, four levels of analysis."], { d: ["Ba tình huống: sàn giao dịch, quỹ đầu tư, một vấn đề đạo đức", "Three cases: an exchange, an investment fund, an ethical dilemma"], ex: 3 }],
          [["SQL cho analyst", "SQL for analysts"], ["SELECT, JOIN, GROUP BY, window function, CTE, phân tích cohort.", "SELECT, JOIN, GROUP BY, window functions, CTEs, cohort analysis."], { d: ["Truy vấn nền tảng, bẫy SQL phải chứng minh bằng số, window function, phân tích cohort", "Core queries, SQL traps proven with numbers, window functions, cohort analysis"], ex: 5 }],
          ["Python & pandas", ["Từ biến số đến DataFrame. Dữ liệu bẩn thật: thiếu, trùng, sai kiểu, lệch múi giờ.", "From variables to DataFrames. Real dirty data: missing, duplicated, mistyped, time-zone shifted."], { d: ["Năm cái bẫy pandas: sai kiểu dữ liệu, merge làm tăng số dòng, ffill hay fillna(0)", "Five pandas traps: wrong dtypes, merges that add rows, ffill or fillna(0)"], ex: 5 }],
          [["Thống kê mô tả & phân phối", "Descriptive statistics & distributions"], ["Vì sao trung bình là con số nguy hiểm nhất trong tài chính. Đuôi béo.", "Why the mean is the most dangerous number in finance. Fat tails."], { d: ["Trung bình nói dối, đo đuôi béo, nghịch lý Simpson", "The lying mean, measuring fat tails, Simpson's paradox"], ex: 5 }],
          [["Trực quan hoá & kể chuyện", "Visualisation & storytelling"], ["Cùng dữ liệu, hai biểu đồ, hai kết luận trái ngược. Biểu đồ trung thực.", "Same data, two charts, two opposite conclusions. Honest charts."], { d: ["Một biểu đồ bốn cách nói dối, chọn biểu đồ theo câu hỏi, một slide một thông điệp", "One chart, four ways to lie; choosing the chart for the question; one slide, one message"], ex: 4 }],
        ],
      },
      {
        name: ["Phần 2 · Dữ liệu thị trường", "Part 2 · Market data"],
        sessions: [
          [["Giải phẫu dữ liệu thị trường", "The anatomy of market data"], ["OHLCV, sổ lệnh, funding rate, open interest. Lấy từ API sàn thật.", "OHLCV, order book, funding rate, open interest. Pulled from a real exchange API."], { d: ["Nến được gán nhãn lúc nào, nến cuối chưa đóng, nến thiếu, lệch múi giờ", "When candles are labelled, the unclosed last candle, missing candles, time zones"], ex: 4 }],
          [["Làm sạch dữ liệu thị trường", "Cleaning market data"], ["Thiên lệch sống sót, coin đã huỷ niêm yết, giao dịch giả, thiếu nến.", "Survivorship bias, delisted coins, wash trades, missing candles."], { d: ["Thiên lệch sống sót, phát hiện khối lượng giao dịch giả, quy trình làm sạch ghi chép lại được", "Survivorship bias, spotting fake volume, a documented cleaning process"], ex: 4 }],
          [["Chuỗi thời gian", "Time series"], ["Tính dừng, tự tương quan, cụm biến động.", "Stationarity, autocorrelation, volatility clustering."], { d: ["Hồi quy giả mạo, kiểm định ADF và KPSS, cụm biến động", "Spurious regression, ADF and KPSS tests, volatility clustering"], ex: 4 }],
          [["Phân tích on-chain", "On-chain analysis"], ["Dòng vào và ra sàn, ví cá voi, phân bố nắm giữ, tuổi đồng tiền.", "Exchange inflows and outflows, whale wallets, holder distribution, coin age."], { d: ["Gom địa chỉ ví, on-chain dẫn trước hay đi sau giá, viết truy vấn Dune", "Clustering wallet addresses, does on-chain data lead or lag price, writing a Dune query"], ex: 4 }],
          [["Rủi ro & danh mục", "Risk & portfolio"], ["VaR, CVaR, sụt giảm tối đa. Tương quan gãy đúng lúc cần nó nhất.", "VaR, CVaR, maximum drawdown. Correlation breaks just when you need it most."], { d: ["Sụt giảm tối đa, tương quan gãy đúng lúc cần, VaR không nói gì về đuôi", "Maximum drawdown, correlation breaking when needed, what VaR misses in the tail"], ex: 4 }],
        ],
      },
      {
        name: ["Phần 3 · Suy luận và không tự lừa mình", "Part 3 · Inference, and not fooling yourself"],
        sessions: [
          [["Suy luận thống kê & p-hacking", "Statistical inference & p-hacking"], ["Tự tay p-hack ra một “chỉ báo thần thánh” từ dữ liệu ngẫu nhiên.", "P-hacking your way to a “magic indicator” from random data."], { d: ["Tự p-hack rồi tự thú nhận, kiểm định hoán vị, nhật ký phân tích", "P-hacking and owning up to it, permutation tests, an analysis log"], ex: 4 }],
          [["Nhân quả", "Causality"], ["A/B test, khác biệt kép (DiD), nghiên cứu sự kiện. Tương quan không phải nhân quả.", "A/B tests, difference-in-differences, event studies. Correlation is not causation."], { d: ["Vẽ đồ thị nhân quả trước khi hồi quy, khác biệt kép và kiểm tra xu hướng song song", "Drawing the causal graph before regressing, difference-in-differences and parallel trends"], ex: 4 }],
          [["Backtest thảm hoạ", "The disaster backtest"], ["Xây một chiến lược lãi khoảng 400% rồi tự tay phá nó bằng 6 lỗi thiên lệch.", "Building a strategy that returns about 400%, then breaking it yourself with six biases."], { d: ["Soi backtest của người khác, chứng minh bằng nhiễu, viết một backtest trung thực", "Auditing someone else's backtest, proving it with noise, writing an honest backtest"], ex: 4 }],
          [["Phát hiện bất thường & gian lận", "Detecting anomalies & fraud"], ["Bơm-xả, giao dịch giả, rút thảm: dấu vết để lại trên dữ liệu.", "Pump-and-dump, wash trading, rug pulls: the traces they leave in the data."], { d: ["Đường chi phí, kiểm tra thiên lệch, khi nào luật Benford dùng sai chỗ", "The cost curve, bias checks, when Benford's law is misused"], ex: 5 }],
        ],
      },
      {
        name: ["Phần 4 · Sản phẩm", "Part 4 · Products"],
        sessions: [
          [["Mô hình dự báo", "Forecasting models"], ["So mọi mô hình với baseline “mai = hôm nay”. Baseline thường thắng.", "Comparing every model with the “tomorrow = today” baseline. The baseline usually wins."], { d: ["Tự tạo rò rỉ dữ liệu, so với đường cơ sở, kiểm tra mức phủ của khoảng dự báo", "Creating leakage on purpose, beating the baseline, checking interval coverage"], ex: 4 }],
          ["Dashboard & BI", ["Dựng cùng một dashboard bằng Power BI và Streamlit, so ưu nhược.", "Building the same dashboard in Power BI and Streamlit, and comparing them."], { d: ["Ba con số “đúng” mà khác nhau, sửa một dashboard nói dối, mở rộng app Streamlit", "Three “correct” numbers that disagree, fixing a lying dashboard, extending a Streamlit app"], ex: 4 }],
          [["Pipeline & chất lượng dữ liệu", "Pipelines & data quality"], ["Thu thập, kiểm tra, cảnh báo khi dữ liệu hỏng.", "Collecting, checking, alerting when the data breaks."], { d: ["Viết hợp đồng dữ liệu, ngưỡng cảnh báo bền, pipeline chạy lại được", "Writing a data contract, robust alert thresholds, a re-runnable pipeline"], ex: 5 }],
          [["Capstone & nghề nghiệp", "Capstone & career"], ["Một nghiên cứu hoàn chỉnh, bảo vệ trước phản biện.", "A complete study, defended against challenge."], { d: ["Một nghiên cứu hoàn chỉnh từ câu hỏi đến kết luận, bảo vệ trước phản biện", "A complete study from question to conclusion, defended against challenge"], pj: ["Nghiên cứu cuối khoá", "Final study"] }],
        ],
      },
      {
        name: ["Phần 5 · Thực chiến và nghề nghiệp", "Part 5 · Real practice and career"],
        sessions: [
          [["SQL thực chiến", "SQL in the real world"], ["Dữ liệu bẩn thật: 3 định dạng ngày trong một cột, bản ghi trùng, khoá mồ côi.", "Real dirty data: three date formats in one column, duplicate rows, orphaned keys."], { d: ["Lập từ điển dữ liệu, săn giá trị bẩn, CTE làm sạch, định nghĩa doanh thu", "A data dictionary, hunting dirty values, a cleaning CTE, defining revenue"], ex: 10 }],
          [["Thu thập dữ liệu", "Collecting data"], ["Tự lấy dữ liệu từ sàn: REST và WebSocket thời gian thực.", "Pulling data from an exchange yourself: REST and real-time WebSocket."], { d: ["Tự cào dữ liệu từ sàn, tìm nến thiếu, chạy thời gian thực, đo độ trễ", "Scraping an exchange yourself, finding missing candles, going real-time, measuring latency"], ex: 6 }],
          ["Power BI", ["Dashboard 3 trang, mô hình sao, bộ số đo DAX.", "A three-page dashboard, a star schema, a set of DAX measures."], { d: ["Nạp và săn lỗi kiểu dữ liệu, mô hình sao, số đo DAX, thẻ cảnh báo dữ liệu cũ", "Loading and catching type errors, a star schema, DAX measures, a stale-data warning card"], ex: 9 }],
          [["Portfolio & xin việc", "Portfolio & job hunting"], ["3 dự án, CV một trang, 30 câu phỏng vấn.", "Three projects, a one-page CV, thirty interview questions."], { d: ["Hoàn thiện ba dự án, luyện 30 câu phỏng vấn có ghi âm, viết CV, phân tích 10 tin tuyển dụng thật", "Polishing three projects, rehearsing 30 interview questions on tape, a CV, analysing 10 real job ads"], ex: 8, pj: ["Portfolio xin việc", "Job-hunting portfolio"] }],
        ],
      },
    ],
  },
];
