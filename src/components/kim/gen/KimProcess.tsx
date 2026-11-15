/* TỆP SINH TỰ ĐỘNG từ bản thiết kế "Xưởng Kim" (kim-convert.py). Đừng sửa tay. */
import { tKim, type KimLang } from "../i18n-kim";

export default function KimProcess({ lang }: { lang: KimLang }) {
  const t = (s: string) => tKim(lang, s);
  return (
    <section className="kim-sec" id="kim-process" aria-labelledby="kim-process-h">
      <div className="kim-head">
        <h2 className="kim-h2" id="kim-process-h">{t("Cách tôi làm việc cùng bạn")}</h2>
        <p className="kim-note">
          {t("Ba bước, rõ ràng từ lúc nghe bài toán đến khi hệ thống chạy ổn định.")}
        </p>
      </div>
      <ol className="kim-steps">
        <li className="kim-step">
          <span className="kim-coin">{"1"}</span>
          <h3>{t("Lắng nghe và tư vấn")}</h3>
          <p>{t("Hiểu đúng bài toán, mục tiêu và ngân sách của anh/chị.")}</p>
        </li>
        <li className="kim-step">
          <span className="kim-coin">{"2"}</span>
          <h3>{t("Xây dựng giải pháp AI")}</h3>
          <p>{t("Thiết kế agent, automation hay chatbot phù hợp với thực tế vận hành.")}</p>
        </li>
        <li className="kim-step">
          <span className="kim-coin">{"3"}</span>
          <h3>{t("Bàn giao và đồng hành")}</h3>
          <p>{t("Hướng dẫn sử dụng và hỗ trợ vận hành lâu dài.")}</p>
        </li>
      </ol>
    </section>
  );
}
