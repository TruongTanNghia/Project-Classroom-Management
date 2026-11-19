/* eslint-disable @next/next/no-html-link-for-pages -- các trang công khai nằm sau middleware rewrite, xem chú thích KimSiteNav */
import KimControls from "./KimControls";
import KimFx from "./KimFx";
import KimPageIcon from "./KimPageIcon";
import KimRouter from "./KimRouter";
import { tx, type KimLang } from "./i18n-kim";
import { HOME_NAV, PAGES, pad2, type PageKey } from "./site";
import KimContact from "./gen/KimContact";

/* Khung chung của mọi trang công khai: cụm nút ngôn ngữ/giao diện, thanh mục lục, nội dung
   của trang, và chân trang là khối Liên hệ (anh Nghĩa dặn: trang nào cũng có).

   Liên kết giữa các trang là thẻ <a> thường (tải trang thật). Chuyển trang vẫn mượt nhờ
   View Transitions của trình duyệt (kim-site.css: @view-transition), không cần Link của Next:
   các trang nằm sau rewrite của middleware, và trang Khoá học trùng tên đường dẫn với trang
   /courses của khu quản trị, nên để trình duyệt tải thẳng là chắc ăn nhất. */

type Props = {
  lang: KimLang;
  dark: boolean;
  jewel: boolean;
  /** trang đang mở; null = trang chủ */
  current: PageKey | null;
  children: React.ReactNode;
};

export default function KimShell({ lang, dark, jewel, current, children }: Props) {
  const x = (l: Parameters<typeof tx>[1]) => tx(lang, l);
  const links = PAGES.map((p, i) => ({ href: "/" + p.key, label: x(p.nav), no: pad2(i + 1), key: p.key }));

  return (
    <div id="kim-canvas" className={"kim-canvas" + (dark ? " dark" : "") + (jewel ? " kim-jewel" : "")} lang={lang} data-page={current ?? "home"}>
      <KimControls lang={lang} dark={dark} menu={{ links, current, home: x(HOME_NAV) }} />
      <div className="kim-root">
        <nav className="kim-nav kim-site-nav" aria-label={x(["Các trang", "Pages"])}>
          <a className="kim-site-home" href="/" aria-label={x(HOME_NAV)} aria-current={current === null ? "page" : undefined}>
            <KimPageIcon k="home" />
          </a>
          {links.map((l) =>
            l.key === "contact" ? (
              <a className="is-cta" href={l.href} key={l.key} aria-current={current === l.key ? "page" : undefined}>
                {l.label}
              </a>
            ) : (
              <a href={l.href} key={l.key} aria-current={current === l.key ? "page" : undefined}>
                {l.label}
              </a>
            )
          )}
        </nav>

        <main className="kim-main" id="kim-main">
          {children}
        </main>

        <footer className="kim-foot">
          <KimContact lang={lang} />
          <div className="kim-foot-bar">
            <a className="kim-foot-brand" href="/">
              <KimPageIcon k="home" />
              <span>
                <b>Trương Tấn Nghĩa</b>
                <small>Co-Founder · AIhoclaptrinh</small>
              </span>
            </a>
            <ul className="kim-foot-links">
              {links.map((l) => (
                <li key={l.key}>
                  <a href={l.href} aria-current={current === l.key ? "page" : undefined}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <small className="kim-foot-copy">© 2026 AIhoclaptrinh · Nha Trang</small>
          </div>
        </footer>
      </div>
      <KimRouter />
      {jewel && <KimFx />}
    </div>
  );
}
