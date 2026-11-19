/* eslint-disable @next/next/no-html-link-for-pages -- trang công khai nằm sau middleware rewrite, xem KimShell */
import KimPageIcon from "./KimPageIcon";
import { tx, type KimLang, type L } from "./i18n-kim";
import { HOME_NAV, PAGES, nextPageOf, pad2, pageNo, pageOf, type PageKey, type PageStat } from "./site";

/* Phần mở đầu của mỗi trang con: số thứ tự lớn chìm dưới nền, tiêu đề ánh kim, câu dẫn,
   vài con số nổi bật, và huy hiệu riêng của trang trong một vòng vạch chia như mặt đồng hồ.
   Cùng chất liệu với bản thiết kế (nhôm xước, đồng thau, thép). */

export function KimPageHero({ lang, page, stats, children }: { lang: KimLang; page: PageKey; stats?: readonly PageStat[]; children?: React.ReactNode }) {
  const x = (l: L) => tx(lang, l);
  const meta = pageOf(page);
  const no = pad2(pageNo(page));
  const list = stats ?? meta.stats ?? [];
  return (
    <header className="kim-ph" aria-labelledby="kim-ph-title">
      <span className="kim-ph-big" aria-hidden="true">
        {no}
      </span>
      <div className="kim-ph-copy">
        <nav className="kim-ph-crumb" aria-label={x(["Bạn đang ở", "You are here"])}>
          <a href="/">{x(HOME_NAV)}</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{x(meta.nav)}</span>
        </nav>
        <span className="kim-ph-no">
          {no}
          <i>/ {pad2(PAGES.length)}</i>
        </span>
        <h1 className="kim-ph-title" id="kim-ph-title">
          {x(meta.title)}
        </h1>
        <p className="kim-ph-lead">{x(meta.lead)}</p>
        {list.length > 0 && (
          <ul className="kim-ph-stats">
            {list.map(([v, l], i) => (
              <li key={i}>
                <b>{v}</b>
                <span>{x(l)}</span>
              </li>
            ))}
          </ul>
        )}
        {children}
      </div>
      <div className="kim-ph-art" aria-hidden="true">
        <svg className="kim-ph-ring" viewBox="0 0 200 200">
          <circle className="r1" cx="100" cy="100" r="92" />
          <circle className="r2" cx="100" cy="100" r="80" />
          <circle className="r3" cx="100" cy="100" r="99" />
        </svg>
        <span className="kim-ph-medal">
          <KimPageIcon k={page} />
        </span>
      </div>
    </header>
  );
}

/** Ô "Trang tiếp theo" cuối mỗi trang, dẫn người xem đi tiếp thay vì dừng lại. */
export function KimNextPage({ lang, page }: { lang: KimLang; page: PageKey }) {
  const x = (l: L) => tx(lang, l);
  const next = nextPageOf(page);
  return (
    <a className="kim-next" href={"/" + next.key}>
      <span className="kim-next-medal" aria-hidden="true">
        <KimPageIcon k={next.key} />
      </span>
      <span className="kim-next-copy">
        <small>
          {x(["Trang tiếp theo", "Next page"])} · {pad2(pageNo(next.key))}
        </small>
        <b>{x(next.title)}</b>
        <span>{x(next.lead)}</span>
      </span>
      <span className="kim-next-arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </a>
  );
}

/** Lưới "Khám phá" ở trang chủ: mỗi trang một thẻ, bấm vào là sang trang đó. */
export function KimExplore({ lang }: { lang: KimLang }) {
  const x = (l: L) => tx(lang, l);
  return (
    <section className="kim-sec kim-explore" aria-labelledby="kim-explore-h">
      <div className="kim-head">
        <h2 className="kim-h2" id="kim-explore-h">
          {x(["Khám phá từng trang", "Explore page by page"])}
        </h2>
        <p className="kim-note">
          {x([
            "Lộ trình học, roadmap, dự án, khoá học, hành trình… mỗi đầu mục một trang riêng.",
            "The learning path, the roadmap, projects, courses, the journey… each has a page of its own.",
          ])}
        </p>
      </div>
      <ul className="kim-explore-grid">
        {PAGES.map((p, i) => (
          <li key={p.key} style={{ "--i": i } as React.CSSProperties}>
            <a className="kim-exp-card" href={"/" + p.key}>
              <span className="kim-exp-top">
                <span className="kim-exp-medal" aria-hidden="true">
                  <KimPageIcon k={p.key} />
                </span>
                <span className="kim-exp-no">{pad2(i + 1)}</span>
              </span>
              <b>{x(p.title)}</b>
              <span className="kim-exp-lead">{x(p.lead)}</span>
              {p.stats && p.stats.length > 0 && (
                <span className="kim-exp-stat">
                  <em>{p.stats[0][0]}</em> {x(p.stats[0][1])}
                </span>
              )}
              <span className="kim-exp-go" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
