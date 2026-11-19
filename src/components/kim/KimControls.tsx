"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { tKim, type KimLang } from "./i18n-kim";
import type { PageKey } from "./site";

/* Cụm nút góc trên phải của trang công khai: đổi ngôn ngữ và đổi giao diện sáng/tối.

   Cả hai lựa chọn lưu bằng cookie để MÁY CHỦ dựng trang đúng ngay từ đầu:
   chữ nằm sẵn trong HTML (Google đọc được cả hai bản), và giao diện tối không bị
   chớp sáng một nhịp lúc tải trang.
   Cookie ngôn ngữ dùng chung tên với khu quản trị ("aihlt-lang").

   Thêm nút Menu (chỉ hiện ở màn hẹp, nơi thanh mục lục bị ẩn): mở danh sách mọi trang
   bằng một <dialog>, để người xem điện thoại vẫn đi được sang trang khác. */

type MenuLink = { href: string; label: string; no: string; key: PageKey };
type Menu = { links: MenuLink[]; current: PageKey | null; home: string };

const YEAR = 60 * 60 * 24 * 365;

export default function KimControls({ lang, dark, menu }: { lang: KimLang; dark: boolean; menu?: Menu }) {
  const router = useRouter();
  const sheet = useRef<HTMLDialogElement>(null);
  const [pending, startTransition] = useTransition();
  const [isDark, setIsDark] = useState(dark);
  const t = (s: string) => tKim(lang, s);

  const pickLang = (next: KimLang) => {
    if (next === lang) return;
    document.cookie = `aihlt-lang=${next}; path=/; max-age=${YEAR}; samesite=lax`;
    startTransition(() => router.refresh());
  };

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.cookie = `aihlt-kim-theme=${next ? "dark" : "light"}; path=/; max-age=${YEAR}; samesite=lax`;
    // đổi ngay trên trang, không cần tải lại
    document.getElementById("kim-canvas")?.classList.toggle("dark", next);
  };

  return (
    <div className="kim-ctl" style={{ opacity: pending ? 0.6 : 1 }}>
      {menu && (
        <>
          <button type="button" className="kim-ctl-menu" aria-haspopup="dialog" onClick={() => sheet.current?.showModal()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h10" />
            </svg>
            {lang === "en" ? "Menu" : "Mục lục"}
          </button>
          <dialog
            className="kim-menu"
            ref={sheet}
            aria-label={lang === "en" ? "Pages" : "Các trang"}
            onClick={(e) => {
              // bấm ra vùng mờ quanh tấm menu thì đóng
              if (e.target === e.currentTarget) e.currentTarget.close();
            }}
          >
            <div className="kim-menu-head">
              <b>{lang === "en" ? "Pages" : "Các trang"}</b>
              <button type="button" className="kim-menu-x" aria-label={lang === "en" ? "Close" : "Đóng"} onClick={() => sheet.current?.close()}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <ul>
              <li>
                <a href="/" aria-current={menu.current === null ? "page" : undefined}>
                  <span className="no">00</span>
                  {menu.home}
                </a>
              </li>
              {menu.links.map((l) => (
                <li key={l.key}>
                  <a href={l.href} aria-current={menu.current === l.key ? "page" : undefined}>
                    <span className="no">{l.no}</span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </dialog>
        </>
      )}
      <div className="kim-ctl-seg" role="group" aria-label={t("Ngôn ngữ")}>
        <button type="button" aria-pressed={lang === "vi"} aria-label={t("Tiếng Việt")} onClick={() => pickLang("vi")}>
          VI
        </button>
        <button type="button" aria-pressed={lang === "en"} aria-label={t("Tiếng Anh")} onClick={() => pickLang("en")}>
          EN
        </button>
      </div>
      <button
        type="button"
        className="kim-ctl-theme"
        aria-label={isDark ? t("Chuyển sang giao diện sáng") : t("Chuyển sang giao diện tối")}
        onClick={toggleTheme}
      >
        {isDark ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        )}
      </button>
    </div>
  );
}
