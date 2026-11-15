import { tKim, type KimLang } from "./i18n-kim";

/* Biển số liệu dưới phần mở đầu.
   Bản thiết kế ghi "8+ năm kinh nghiệm EdTech"; số thật anh Nghĩa đưa là 3,5 năm.
   Hai con số còn lại giữ nguyên như trang đang chạy. */
export default function KimProof({ lang }: { lang: KimLang }) {
  const t = (s: string) => tKim(lang, s);
  return (
    <div className="kim-proof">
      <div>
        <strong>{t("3,5")}</strong>
        <span>{t("năm kinh nghiệm")}</span>
      </div>
      <div>
        <strong>120+</strong>
        <span>{t("trường và trung tâm đang dùng AIhoclaptrinh")}</span>
      </div>
      <div>
        <strong>96%</strong>
        <span>{t("khách hàng gia hạn hằng năm")}</span>
      </div>
    </div>
  );
}
