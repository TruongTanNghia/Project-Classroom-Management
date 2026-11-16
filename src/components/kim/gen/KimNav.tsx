/* TỆP SINH TỰ ĐỘNG từ bản thiết kế "Xưởng Kim" (kim-convert.py). Đừng sửa tay. */
import { tKim, type KimLang } from "../i18n-kim";

export default function KimNav({ lang }: { lang: KimLang }) {
  const t = (s: string) => tKim(lang, s);
  return (
    <nav className="kim-nav" aria-label={t("Mục lục trang")}>
      <a href="/path">{t("Lộ trình")}</a>
      <a href="/projects">{t("Dự án")}</a>
      <a href="/solutions">{t("Giải pháp")}</a>
      <a href="/process">{t("Cách làm việc")}</a>
      <a href="/courses">{t("Khoá học")}</a>
      <a href="/journey">{t("Hành trình")}</a>
      <a href="/quotes">{t("Cảm nhận")}</a>
      <a className="is-cta" href="/contact">{t("Liên hệ")}</a>
    </nav>
  );
}
