import { tAbout, type AbtLang } from "./i18n-about";

export default function AboutNav({ lang }: { lang: AbtLang }) {
  const t = (s: string) => tAbout(lang, s);
  return (
    <nav data-abt-section="nav" className="abt-nav" aria-label={t("Mục lục trang")}><a href="#abt-skills">{t("Năng lực")}</a><a href="#abt-projects">{t("Dự án")}</a><a href="#abt-solutions">{t("Giải pháp")}</a><a href="#abt-process">{t("Quy trình")}</a><a href="#abt-journey">{t("Hành trình")}</a><a href="#abt-quotes">{t("Cảm nhận")}</a><a className="cta" href="#abt-contact">{t("Liên hệ")}</a></nav>
  );
}
