/* TỆP SINH TỰ ĐỘNG từ bản thiết kế "Xưởng Kim" (kim-convert.py). Đừng sửa tay. */
import { tKim, type KimLang } from "../i18n-kim";

export default function KimNav({ lang }: { lang: KimLang }) {
  const t = (s: string) => tKim(lang, s);
  return (
    <nav className="kim-nav" aria-label={t("Mục lục trang")}>
      <a href="#kim-path">{t("Lộ trình")}</a>
      <a href="#kim-projects">{t("Dự án")}</a>
      <a href="#kim-solutions">{t("Giải pháp")}</a>
      <a href="#kim-process">{t("Cách làm việc")}</a>
      <a href="#kim-courses">{t("Khoá học")}</a>
      <a href="#kim-journey">{t("Hành trình")}</a>
      <a href="#kim-quotes">{t("Cảm nhận")}</a>
      <a className="is-cta" href="#kim-contact">{t("Liên hệ")}</a>
    </nav>
  );
}
