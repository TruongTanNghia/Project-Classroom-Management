/* TỆP SINH TỰ ĐỘNG từ bản thiết kế "Xưởng Kim" (kim-convert.py). Đừng sửa tay. */
import { tKim, type KimLang } from "../i18n-kim";

export default function KimJourney({ lang }: { lang: KimLang }) {
  const t = (s: string) => tKim(lang, s);
  return (
    <section className="kim-sec" id="kim-journey" aria-labelledby="kim-journey-h">
      <div className="kim-journey">
        <div className="kim-head">
          <h2 className="kim-h2" id="kim-journey-h">{t("Chặng đường đã qua")}</h2>
          <p className="kim-note">{t("Từ dòng code đầu tiên đến hôm nay.")}</p>
        </div>
        <ol className="kim-years">
          <li className="kim-year">
            <span className="kim-year-n">{"2017"}</span>
            <span className="kim-year-dot" />
            <p>{t("Bắt đầu hành trình lập trình và nghiên cứu AI.")}</p>
          </li>
          <li className="kim-year">
            <span className="kim-year-n">{"2020"}</span>
            <span className="kim-year-dot" />
            <p>{t("Đưa AI vào giảng dạy, kèm lứa học viên đầu tiên.")}</p>
          </li>
          <li className="kim-year">
            <span className="kim-year-n">{"2022"}</span>
            <span className="kim-year-dot" />
            <p>{t("Sáng lập AIhoclaptrinh, nền tảng dạy và ứng dụng AI.")}</p>
          </li>
          <li className="kim-year">
            <span className="kim-year-n">{"2024"}</span>
            <span className="kim-year-dot" />
            <p>{t("Hơn 120 trường và trung tâm ứng dụng nền tảng.")}</p>
          </li>
          <li className="kim-year is-now">
            <span className="kim-year-n">{t("Hôm nay")}</span>
            <span className="kim-year-dot" />
            <p>{t("Xây AI agent và automation cho doanh nghiệp và lớp học.")}</p>
          </li>
        </ol>
        <div className="kim-motto">
          <strong>{t("Never give up.")}</strong>
          <span>{t("Phương châm của AIhoclaptrinh")}</span>
        </div>
        <div className="kim-tools">
          <b>{t("Công cụ dùng hằng ngày")}</b>
          <span className="kim-tool">{t("Python")}</span>
          <span className="kim-tool">{t("PyTorch")}</span>
          <span className="kim-tool">{t("TensorFlow")}</span>
          <span className="kim-tool">{t("LangChain")}</span>
          <span className="kim-tool">{t("OpenAI")}</span>
          <span className="kim-tool">{t("Hugging Face")}</span>
          <span className="kim-tool">{t("n8n")}</span>
          <span className="kim-tool">{t("Supabase")}</span>
          <span className="kim-tool">{t("Next.js")}</span>
          <span className="kim-tool">{t("OpenCV")}</span>
          <span className="kim-tool">{t("YOLO")}</span>
          <span className="kim-tool">{t("ROS 2")}</span>
          <span className="kim-tool">{t("Zalo API")}</span>
        </div>
      </div>
    </section>
  );
}
