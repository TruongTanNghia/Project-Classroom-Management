import { tAbout, type AbtLang } from "./i18n-about";

export default function AboutProcess({ lang }: { lang: AbtLang }) {
  const t = (s: string) => tAbout(lang, s);
  return (
    <section data-abt-section="process" className="abt-sec" id="abt-process" aria-labelledby="abt-process-h"><header className="abt-head"><div><div className="abt-kicker"><b>04</b><span>{t("Quy trình")}</span></div><h2 className="abt-h2" id="abt-process-h">{t("Cách tôi")} <em>{t("đồng hành")}</em> {t("cùng bạn")}</h2></div><p className="abt-note">{t("đơn giản, rõ ràng")}</p></header><div className="abt-process"><div className="abt-process-line" aria-hidden="true"><i></i></div><div className="abt-step"><div className="abt-step-num" aria-hidden="true"><span>01</span></div><h3 className="abt-title">{t("Lắng nghe & tư vấn")}</h3><p className="abt-desc">{t("Hiểu đúng bài toán, mục tiêu và ngân sách của anh/chị.")}</p></div><div className="abt-step"><div className="abt-step-num" aria-hidden="true"><span>02</span></div><h3 className="abt-title">{t("Xây dựng giải pháp AI")}</h3><p className="abt-desc">{t("Thiết kế agent / automation / chatbot phù hợp thực tế.")}</p></div><div className="abt-step"><div className="abt-step-num" aria-hidden="true"><span>03</span></div><h3 className="abt-title">{t("Bàn giao & đồng hành")}</h3><p className="abt-desc">{t("Hướng dẫn sử dụng và hỗ trợ vận hành lâu dài.")}</p></div></div></section>
  );
}
