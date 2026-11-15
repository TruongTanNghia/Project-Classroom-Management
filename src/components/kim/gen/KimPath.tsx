/* TỆP SINH TỰ ĐỘNG từ bản thiết kế "Xưởng Kim" (kim-convert.py). Đừng sửa tay. */
import { tKim, type KimLang } from "../i18n-kim";

export default function KimPath({ lang }: { lang: KimLang }) {
  const t = (s: string) => tKim(lang, s);
  return (
    <section className="kim-sec" id="kim-path" aria-labelledby="kim-path-h">
      <div className="kim-head">
        <h2 className="kim-h2" id="kim-path-h">{t("Học AI theo đúng thứ tự, làm AI ở mọi tầng")}</h2>
        <p className="kim-note">
          {t("Tôi làm cả tám mảng dưới đây và dạy lại theo đúng trình tự này: vững học máy, học sâu, học tăng cường trước, rồi mới sang thị giác máy tính, ngôn ngữ, thiết bị biên, harness cho agent và robot.")}
        </p>
      </div>
      <div className="kim-phases" aria-hidden="true">
        <div className="kim-phase p1">
          {t("Nền tảng")}
          <small>{t("học trước tiên")}</small>
        </div>
        <div className="kim-phase p2">
          {t("Ứng dụng chuyên sâu")}
          <small>{t("khi nền tảng đã vững")}</small>
        </div>
        <div className="kim-phase p3">
          {t("Hệ thống thật")}
          <small>{t("đưa AI ra đời thực")}</small>
        </div>
      </div>
      <ol className="kim-stations">
        <li className="kim-station">
          <span className="kim-medal">
            <svg className="kim-ico" viewBox="0 0 64 64" aria-hidden="true">
              <rect className="s" x="12.5" y="12.5" width="42" height="40" rx="5" />
              <rect className="p" x="10" y="10" width="42" height="40" rx="5" />
              <path className="d" d="M14 45 L48 15" />
              <circle className="bl" cx="19" cy="21" r="3.4" />
              <circle className="bl" cx="26.5" cy="16.5" r="3.4" />
              <circle className="bl" cx="26" cy="27.5" r="3.4" />
              <rect className="sl" x="33" y="34" width="6.5" height="6.5" rx="1.3" />
              <rect className="sl" x="42" y="27" width="6.5" height="6.5" rx="1.3" />
              <rect className="sl" x="40" y="40" width="6.5" height="6.5" rx="1.3" />
              <path className="l" d="M10 56 H52" />
              <path className="l" d="M16 56 v-3 M26 56 v-3 M36 56 v-3 M46 56 v-3" />
            </svg>
            <b>{"1"}</b>
          </span>
          <div className="kim-station-txt">
            <span className="ph">{t("Nền tảng")}</span>
            <h3>{t("Học máy")}</h3>
            <p>{t("Dự đoán từ dữ liệu: chọn đặc trưng, huấn luyện và đánh giá mô hình.")}</p>
            <span className="kw">{t("Hồi quy, cây quyết định, SVM, K-Means")}</span>
          </div>
        </li>
        <li className="kim-station">
          <span className="kim-medal">
            <svg className="kim-ico" viewBox="0 0 64 64" aria-hidden="true">
              <rect className="s" x="11.5" y="15.5" width="10" height="36" rx="5" />
              <rect className="s" x="29.5" y="9.5" width="10" height="48" rx="5" />
              <rect className="s" x="47.5" y="21.5" width="10" height="24" rx="5" />
              <path className="t" d="M14 20 L32 14 M14 20 L32 26 M14 20 L32 38 M14 20 L32 50 M14 32 L32 14 M14 32 L32 26 M14 32 L32 38 M14 32 L32 50 M14 44 L32 14 M14 44 L32 26 M14 44 L32 38 M14 44 L32 50 M32 14 L50 26 M32 14 L50 38 M32 26 L50 26 M32 26 L50 38 M32 38 L50 26 M32 38 L50 38 M32 50 L50 26 M32 50 L50 38" />
              <path className="hb" d="M14 32 L32 26 L50 38" />
              <circle className="p" cx="14" cy="20" r="4.2" />
              <circle className="p" cx="14" cy="44" r="4.2" />
              <circle className="p" cx="32" cy="14" r="4.2" />
              <circle className="p" cx="32" cy="38" r="4.2" />
              <circle className="p" cx="32" cy="50" r="4.2" />
              <circle className="p" cx="50" cy="26" r="4.2" />
              <circle className="bl" cx="14" cy="32" r="4.6" />
              <circle className="bl" cx="32" cy="26" r="4.6" />
              <circle className="bl" cx="50" cy="38" r="4.6" />
            </svg>
            <b>{"2"}</b>
          </span>
          <div className="kim-station-txt">
            <span className="ph">{t("Nền tảng")}</span>
            <h3>{t("Học sâu")}</h3>
            <p>{t("Mạng nơ-ron cho ảnh, chuỗi và văn bản, huấn luyện bằng PyTorch.")}</p>
            <span className="kw">{t("CNN, RNN, Transformer")}</span>
          </div>
        </li>
        <li className="kim-station">
          <span className="kim-medal">
            <svg className="kim-ico" viewBox="0 0 64 64" aria-hidden="true">
              <rect className="s" x="14.5" y="14.5" width="36" height="36" rx="3" />
              <rect className="p" x="12" y="12" width="36" height="36" rx="3" />
              <rect className="o" x="36" y="12" width="12" height="12" />
              <path className="g" d="M24 12 V48 M36 12 V48 M12 24 H48 M12 36 H48" />
              <rect className="l" x="12" y="12" width="36" height="36" rx="3" />
              <path className="l" d="M40 21.5 V14.5 L45.5 16.6 L40 18.8" />
              <path className="pb" d="M18 42 H30 V30 H42 V24" />
              <circle className="bl" cx="18" cy="42" r="4.4" />
              <path className="l" d="M53 21 A11 11 0 0 1 53 41" />
              <path className="l" d="M50 38.5 L53 41.5 L56.2 38.6" />
            </svg>
            <b>{"3"}</b>
          </span>
          <div className="kim-station-txt">
            <span className="ph">{t("Nền tảng")}</span>
            <h3>{t("Học tăng cường")}</h3>
            <p>{t("Dạy tác tử tự ra quyết định qua thử, sai và phần thưởng.")}</p>
            <span className="kw">{t("Q-learning, DQN, PPO")}</span>
          </div>
        </li>
        <li className="kim-station">
          <span className="kim-medal">
            <svg className="kim-ico" viewBox="0 0 64 64" aria-hidden="true">
              <path className="l" d="M8 19 V8 H19 M45 8 H56 V19 M56 45 V56 H45 M19 56 H8 V45" />
              <circle className="s" cx="34.5" cy="34.5" r="15" />
              <circle className="p" cx="32" cy="32" r="15" />
              <circle className="rb" cx="32" cy="32" r="9.5" />
              <circle className="k" cx="32" cy="32" r="4.6" />
              <circle className="w" cx="29.6" cy="29.6" r="1.7" />
            </svg>
            <b>{"4"}</b>
          </span>
          <div className="kim-station-txt">
            <span className="ph">{t("Ứng dụng chuyên sâu")}</span>
            <h3>{t("Thị giác máy tính")}</h3>
            <p>{t("Phát hiện, bám và nhận dạng đối tượng qua camera.")}</p>
            <span className="kw">{t("YOLO, OpenCV, tracking")}</span>
          </div>
        </li>
        <li className="kim-station">
          <span className="kim-medal">
            <svg className="kim-ico" viewBox="0 0 64 64" aria-hidden="true">
              <path className="s" transform="translate(2.5 2.5)" d="M13 12 H51 a4 4 0 0 1 4 4 V37 a4 4 0 0 1 -4 4 H29 L20 49 V41 H13 a4 4 0 0 1 -4 -4 V16 a4 4 0 0 1 4 -4 Z" />
              <path className="p" d="M13 12 H51 a4 4 0 0 1 4 4 V37 a4 4 0 0 1 -4 4 H29 L20 49 V41 H13 a4 4 0 0 1 -4 -4 V16 a4 4 0 0 1 4 -4 Z" />
              <rect className="b" x="15" y="18" width="12" height="5" rx="2.5" />
              <rect className="sl" x="29" y="18" width="8" height="5" rx="2.5" />
              <rect className="b" x="39" y="18" width="10" height="5" rx="2.5" />
              <rect className="sl" x="15" y="26" width="7" height="5" rx="2.5" />
              <rect className="b" x="24" y="26" width="14" height="5" rx="2.5" />
              <rect className="sl" x="40" y="26" width="9" height="5" rx="2.5" />
              <rect className="sl" x="15" y="34" width="10" height="2" rx="1" />
              <path className="l" d="M45 52 l3 3 l6 -7" />
            </svg>
            <b>{"5"}</b>
          </span>
          <div className="kim-station-txt">
            <span className="ph">{t("Ứng dụng chuyên sâu")}</span>
            <h3>{t("NLP & LLM")}</h3>
            <p>{t("Hiểu và tạo ngôn ngữ, trợ lý trả lời có trích dẫn nguồn.")}</p>
            <span className="kw">{t("RAG, fine-tune, đánh giá")}</span>
          </div>
        </li>
        <li className="kim-station">
          <span className="kim-medal">
            <svg className="kim-ico" viewBox="0 0 64 64" aria-hidden="true">
              <rect className="s" x="20.5" y="20.5" width="28" height="28" rx="4" />
              <path className="l" d="M24 11 v7 M32 11 v7 M40 11 v7 M24 46 v7 M32 46 v7 M40 46 v7 M11 24 h7 M11 32 h7 M11 40 h7 M46 24 h7 M46 32 h7 M46 40 h7" />
              <rect className="p" x="18" y="18" width="28" height="28" rx="4" />
              <rect className="bl" x="25" y="25" width="14" height="14" rx="2.5" />
              <path className="l" d="M29 32 h6 M32 29 v6" />
              <circle className="k" cx="22" cy="22" r="1.4" />
            </svg>
            <b>{"6"}</b>
          </span>
          <div className="kim-station-txt">
            <span className="ph">{t("Ứng dụng chuyên sâu")}</span>
            <h3>{t("Edge AI")}</h3>
            <p>{t("Đưa mô hình xuống thiết bị nhỏ, chạy ngay tại chỗ, không cần cloud.")}</p>
            <span className="kw">{t("Lượng tử hoá, Raspberry Pi, ESP32")}</span>
          </div>
        </li>
        <li className="kim-station">
          <span className="kim-medal">
            <svg className="kim-ico" viewBox="0 0 64 64" aria-hidden="true">
              <polygon className="s" points="34.5,24.5 43.2,29.5 43.2,39.5 34.5,44.5 25.8,39.5 25.8,29.5" />
              <path className="l" d="M23.3 27 C 18 25, 16 20, 13.5 15.5 M40.7 27 C 46 25, 48 20, 50.5 15.5 M23.3 37 C 18 39, 16 44, 13.5 48.5 M40.7 37 C 46 39, 48 44, 50.5 48.5" />
              <g transform="rotate(-45 12 13)">
                <rect className="p" x="7" y="9" width="10" height="8" rx="2" />
                <path className="l" d="M9.8 9 v-3.6 M14.2 9 v-3.6" />
              </g>
              <g transform="rotate(45 52 13)">
                <rect className="p" x="47" y="9" width="10" height="8" rx="2" />
                <path className="l" d="M49.8 9 v-3.6 M54.2 9 v-3.6" />
              </g>
              <g transform="rotate(-135 12 51)">
                <rect className="p" x="7" y="47" width="10" height="8" rx="2" />
                <path className="l" d="M9.8 47 v-3.6 M14.2 47 v-3.6" />
              </g>
              <g transform="rotate(135 52 51)">
                <rect className="p" x="47" y="47" width="10" height="8" rx="2" />
                <path className="l" d="M49.8 47 v-3.6 M54.2 47 v-3.6" />
              </g>
              <polygon className="bl" points="32,22 40.7,27 40.7,37 32,42 23.3,37 23.3,27" />
              <circle className="w" cx="32" cy="32" r="3.4" />
            </svg>
            <b>{"7"}</b>
          </span>
          <div className="kim-station-txt">
            <span className="ph">{t("Hệ thống thật")}</span>
            <h3>{t("Harness AI")}</h3>
            <p>{t("Dựng khung quanh LLM: công cụ, bộ nhớ, quy trình, kiểm thử, để agent chạy thật.")}</p>
            <span className="kw">{t("AI agent, MCP, n8n")}</span>
          </div>
        </li>
        <li className="kim-station">
          <span className="kim-medal">
            <svg className="kim-ico" viewBox="0 0 64 64" aria-hidden="true">
              <path className="s" d="M16.5 54.5 H42.5 L39.5 47.5 H19.5 Z" />
              <path className="p" d="M14 52 H40 L37 45 H17 Z" />
              <path className="l" d="M9 52.5 H45" />
              <path className="arm" d="M27 44 L21 25 L42 17" />
              <path className="arm2" d="M27 44 L21 25 L42 17" />
              <circle className="bl" cx="27" cy="44" r="4.4" />
              <circle className="bl" cx="21" cy="25" r="4" />
              <circle className="bl" cx="42" cy="17" r="3.4" />
              <rect className="o" x="50" y="13.5" width="7" height="7" rx="1" />
              <path className="l" d="M44.5 13 L50.5 11 L53 13.5 M44.5 21 L50.5 23 L53 20.5" />
            </svg>
            <b>{"8"}</b>
          </span>
          <div className="kim-station-txt">
            <span className="ph">{t("Hệ thống thật")}</span>
            <h3>{t("Robotics")}</h3>
            <p>{t("Cảm biến, điều khiển và lập kế hoạch chuyển động cho robot.")}</p>
            <span className="kw">{t("ROS 2, LiDAR, tay máy")}</span>
          </div>
        </li>
      </ol>
    </section>
  );
}
