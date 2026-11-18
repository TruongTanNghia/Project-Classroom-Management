import type { CSSProperties } from "react";

import KimSyllabus from "./KimSyllabus";
import { COURSES, CYCLE, PER_WEEK, countSessions, dong, type Course, type Cover } from "./courses-data";
import { tKim, tx, type KimLang, type L } from "./i18n-kim";

/* biểu tượng nhỏ đứng trước con số thời lượng / thực hành */
const CLOCK = "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z";
const WRENCH = "M14.7 6.3a4 4 0 0 0-5.4 5.2L3.5 17.3a1.8 1.8 0 0 0 2.5 2.5l5.8-5.8a4 4 0 0 0 5.2-5.4l-2.5 2.5-2.3-.6-.6-2.3z";
function Ico({ d }: { d: string }) {
  return (
    <svg className="kim-cx-ico" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/* Lưới khoá học + hộp "nội dung từng buổi" của mỗi khoá.

   Bản thiết kế chỉ có ba thẻ khoá mẫu. Anh Nghĩa dặn: khoá học phải ứng với lộ trình
   ở trên, bấm "Xem khoá học" thì hiện nội dung các buổi, có học phí theo buổi (đủ 8
   buổi thu một lần), và thêm khoá Phân tích dữ liệu. Nên ở đây là 8 khoá theo đúng
   8 bước của lộ trình + 1 khoá riêng, giữ nguyên kiểu thẻ của thiết kế (.kim-course).

   Toàn bộ nội dung dựng sẵn trên máy chủ: mỗi khoá một <dialog> đóng, nằm ngay trong
   HTML, nên máy tìm kiếm đọc được và mở ra không phải tải thêm gì. Phần bấm mở/đóng
   ở KimSyllabus (client). Dữ liệu và nguồn của nó: courses-data.ts. */

function CoverArt({ cover, lang }: { cover: Cover; lang: KimLang }) {
  const x = (l: L) => tx(lang, l);
  if (cover.kind === "blocks") {
    return (
      <div className="c-blocks">
        {cover.rows.map((r, i) => (
          <span key={i} className={r.inset ? "in" : undefined} style={{ "--c": r.c } as CSSProperties}>
            {x(r.pre)}
            {r.n && (
              <>
                {" "}
                <em>{r.n}</em>{" "}
              </>
            )}
            {x(r.post)}
          </span>
        ))}
      </div>
    );
  }
  return (
    <div className="c-code">
      {cover.lines.map((line, i) => (
        <span className="ln" key={i}>
          {line.map((tok, j) =>
            typeof tok === "string" ? (
              tok
            ) : (
              <span className={tok[1]} key={j}>
                {x(tok[0])}
              </span>
            ),
          )}
        </span>
      ))}
      <span className="o">{x(cover.out)}</span>
    </div>
  );
}

/** đồng xu số bước trên lộ trình; khoá riêng thì là một viên đá nhỏ */
function Coin({ step }: { step: number | null }) {
  return <span className={"kim-cx-no" + (step ? "" : " is-gem")}>{step ?? ""}</span>;
}

export default function KimCourseGrid({ lang }: { lang: KimLang }) {
  const t = (s: string) => tKim(lang, s);
  const x = (l: L) => tx(lang, l);
  const en = lang === "en";
  const cycleShort = en ? `Every ${CYCLE} sessions:` : `Đợt ${CYCLE} buổi:`;
  const cycleLong = en ? `Each block of ${CYCLE} sessions` : `Mỗi đợt ${CYCLE} buổi`;
  const cycleRule = en
    ? `Tuition is charged per session and paid once every ${CYCLE} sessions.`
    : `Học phí tính theo buổi, đủ ${CYCLE} buổi đóng một lần.`;
  const label = (c: Course) =>
    c.step && c.phase ? `${t("Bước")} ${c.step} · ${t(c.phase)}` : t("Khoá riêng · Cho người mới hoàn toàn");

  return (
    <>
      <div className="kim-courses kim-cx-grid">
        {COURSES.map((c) => (
          <article className="kim-course kim-cx" id={"khoa-" + c.slug} key={c.slug}>
            <div className="kim-course-cover" aria-hidden="true">
              <Coin step={c.step} />
              <CoverArt cover={c.cover} lang={lang} />
            </div>
            <div className="kim-course-body">
              <span className="kim-cx-ph">{label(c)}</span>
              <h3>{x(c.name)}</h3>
              {/* hai con số người xem cần biết ngay: học bao lâu, thực hành bao nhiêu */}
              <ul className="kim-cx-facts">
                <li className="is-time">
                  <Ico d={CLOCK} />
                  <b>{x(c.months)}</b>
                  <span>
                    · {countSessions(c)} {t("buổi")}
                  </span>
                </li>
                <li className="is-lab">
                  <Ico d={WRENCH} />
                  <b>{x(c.practice)}</b>
                </li>
              </ul>
              <p className="kim-cx-sum">{x(c.sum)}</p>
              <div className="kim-course-foot">
                <span className="kim-cx-fee">
                  <span>
                    <span className="kim-price">{dong(c.fee)}</span>
                    <span className="kim-cx-per">{t("/buổi")}</span>
                  </span>
                  <small>
                    {cycleShort} {dong(c.fee * CYCLE)}
                  </small>
                </span>
                <button
                  type="button"
                  className="kim-link kim-cx-open"
                  data-syl={c.slug}
                  aria-haspopup="dialog"
                  aria-label={`${t("Xem khoá học")}: ${x(c.name)}`}
                >
                  {t("Xem khoá học")}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {COURSES.map((c) => {
        // số buổi đã qua trước mỗi phần, để đánh số liền mạch từ 01 tới hết khoá
        const before = c.parts.map((_, i) => c.parts.slice(0, i).reduce((n, p) => n + p.sessions.length, 0));
        return (
          <dialog className="kim-syl" id={"kim-syl-" + c.slug} aria-labelledby={"kim-syl-h-" + c.slug} key={c.slug}>
            <header className="kim-syl-head">
              <Coin step={c.step} />
              <div>
                <span className="kim-cx-ph">{label(c)}</span>
                <h3 id={"kim-syl-h-" + c.slug}>{x(c.name)}</h3>
                <span className="kim-syl-by">{t("giảng viên Trương Tấn Nghĩa")}</span>
              </div>
              <button type="button" className="kim-syl-x" data-syl-close aria-label={t("Đóng")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </header>

            <div className="kim-syl-scroll" tabIndex={0} role="group" aria-label={t("Nội dung từng buổi")}>
              {/* lời giới thiệu nằm trong phần cuộn chứ không nằm ở đầu hộp: đầu hộp đứng yên,
                  để nó thấp thì trên điện thoại còn chỗ cho danh sách buổi */}
              <p className="kim-syl-sum">{x(c.sum)}</p>
              <dl className="kim-syl-facts">
                <div className="is-time">
                  <dt>
                    <Ico d={CLOCK} />
                    {t("Thời lượng")}
                  </dt>
                  <dd>{x(c.months)}</dd>
                  <dd className="sub">
                    {countSessions(c)} {t("buổi")} · {c.weeks} {en ? "weeks" : "tuần"} · {PER_WEEK} {en ? "per week" : "buổi/tuần"}
                    {c.hours && (
                      <>
                        {" · "}
                        {x(c.hours)}
                        {t("/buổi")}
                      </>
                    )}
                  </dd>
                </div>
                <div className="is-lab">
                  <dt>
                    <Ico d={WRENCH} />
                    {x(["Thực hành", "Hands-on"])}
                  </dt>
                  <dd>{x(c.practice)}</dd>
                  <dd className="sub">{x(c.practiceMore)}</dd>
                </div>
                <div>
                  <dt>{t("Học phí")}</dt>
                  <dd>
                    {dong(c.fee)}
                    <small>{t("/buổi")}</small>
                  </dd>
                </div>
                <div>
                  <dt>{cycleLong}</dt>
                  <dd>{dong(c.fee * CYCLE)}</dd>
                  <dd className="sub">{x([`đóng một lần, khoảng ${CYCLE / PER_WEEK} tuần học`, `paid once, about ${CYCLE / PER_WEEK} weeks of classes`])}</dd>
                </div>
              </dl>

              {/* học xong làm ra được gì: thứ người xem muốn biết nhất sau thời lượng và học phí */}
              <div className="kim-syl-final">
                <span className="kim-syl-final-ico" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
                    <path d="M6 3h12l3 5-9 13L3 8z" />
                    <path d="M3 8h18M9 3l3 5 3-5M12 8v13" />
                  </svg>
                </span>
                <div>
                  <b>{x(["Sản phẩm cuối khoá", "What you finish with"])}</b>
                  <p>{x(c.final)}</p>
                </div>
              </div>
              {c.note && <p className="kim-syl-note">{x(c.note)}</p>}

              <h4 className="kim-syl-h">{t("Nội dung từng buổi")}</h4>
              {c.parts.map((part, pi) => (
                <section key={pi}>
                  {part.name && <h5 className="kim-syl-part">{x(part.name)}</h5>}
                  <ol className="kim-syl-list" start={before[pi] + 1}>
                    {part.sessions.map(([title, desc, lab], si) => (
                      <li key={si}>
                        <span className="n">{String(before[pi] + si + 1).padStart(2, "0")}</span>
                        <div>
                          <b>{x(title)}</b>
                          {desc && <span className="d">{x(desc)}</span>}
                          {lab && (
                            <span className="kim-syl-lab">
                              <span className="tag">
                                <Ico d={WRENCH} />
                                {x(["Thực hành", "Hands-on"])}
                              </span>
                              <span className="txt">
                                {x(lab.d)}
                                {lab.ex ? (
                                  <span className="ex">
                                    {" · "}
                                    {lab.ex} {x(["bài tập", lab.ex === 1 ? "exercise" : "exercises"])}
                                  </span>
                                ) : null}
                              </span>
                              {lab.pj && (
                                <span className="pj">
                                  <b>{x(["Dự án", "Project"])}</b> {x(lab.pj)}
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>

            <footer className="kim-syl-foot">
              <span>{cycleRule}</span>
              {/* địa chỉ của khối liên hệ; KimRouter chặn cú bấm và cuộn tới đó, không tải lại trang */}
              <a className="kim-btn kim-btn-brass" href="/contact" data-syl-close>
                {t("Hỏi lịch học")}
              </a>
            </footer>
          </dialog>
        );
      })}

      <KimSyllabus />
    </>
  );
}
