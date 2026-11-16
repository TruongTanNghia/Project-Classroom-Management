/* TỆP SINH TỰ ĐỘNG từ bản thiết kế "Xưởng Kim" (kim-convert.py). Đừng sửa tay. */
import { tKim, type KimLang } from "../i18n-kim";
import KimQuoteWall from "../KimQuoteWall";

export default function KimQuotes({ lang }: { lang: KimLang }) {
  const t = (s: string) => tKim(lang, s);
  return (
    <section className="kim-sec" id="kim-quotes" aria-labelledby="kim-quotes-h">
      <div className="kim-head">
        <h2 className="kim-h2" id="kim-quotes-h">{t("Học viên và khách hàng nói gì")}</h2>
        <p className="kim-note">{t("Ví dụ minh hoạ, đang cập nhật nhận xét thật kèm tên và đơn vị.")}</p>
      </div>
      <KimQuoteWall lang={lang} />
    </section>
  );
}
