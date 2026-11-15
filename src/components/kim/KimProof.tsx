import { tKim, type KimLang } from "./i18n-kim";

/* Biển số liệu dưới phần mở đầu. Ba con số là số anh Nghĩa đưa (15/11/2026), không phải
   số của bản thiết kế:
     thiết kế ghi "8+ năm kinh nghiệm EdTech"          → thật là 3,5 năm
     thiết kế ghi "120+ trường và trung tâm đang dùng"  → thật là hơn 120 dự án
     thiết kế ghi "96% khách hàng gia hạn hằng năm"     → thật là 99% khách hàng hài lòng và tin tưởng */
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
        <span>{t("dự án đã thực hiện")}</span>
      </div>
      <div>
        <strong>99%</strong>
        <span>{t("khách hàng hài lòng và tin tưởng")}</span>
      </div>
    </div>
  );
}
