/* TỆP SINH TỰ ĐỘNG từ bản thiết kế "Xưởng Kim" (kim-convert.py). Đừng sửa tay. */
import { tKim, type KimLang } from "../i18n-kim";
import KimCourseGrid from "../KimCourseGrid";

export default function KimCourses({ lang }: { lang: KimLang }) {
  const t = (s: string) => tKim(lang, s);
  return (
    <section className="kim-sec" id="kim-courses" aria-labelledby="kim-courses-h">
      <div className="kim-head">
        <h2 className="kim-h2" id="kim-courses-h">{t("Khoá học: học đến đâu, làm được đến đó")}</h2>
        <p className="kim-note">
          {t("Mỗi bước của lộ trình ở trên là một khoá, học theo đúng thứ tự đó. Học phí tính theo buổi, đóng theo đợt 8 buổi.")}
        </p>
      </div>
      <KimCourseGrid lang={lang} />
      <div className="kim-topics">
        <div>
          <h3>{t("Chủ đề tôi hay chia sẻ")}</h3>
          <p>{t("Miễn phí cho cộng đồng.")}</p>
        </div>
        <ul className="kim-topic-list">
          <li>
            <a href="#">
              <div>
                <small>{t("Cơ bản")}</small>
                <b>{t("Bắt đầu với AI agent")}</b>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </a>
          </li>
          <li>
            <a href="#">
              <div>
                <small>{t("Thực hành")}</small>
                <b>{t("Automation cho người mới")}</b>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </a>
          </li>
          <li>
            <a href="#">
              <div>
                <small>{t("Nâng cao")}</small>
                <b>{t("LLM và nghệ thuật viết prompt")}</b>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
