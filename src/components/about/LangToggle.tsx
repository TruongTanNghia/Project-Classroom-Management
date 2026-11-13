"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { AbtLang } from "./i18n-about";

/**
 * Nút VI/EN cho trang Giới thiệu công khai (aihoclaptrinh.com) — nơi không
 * có thanh trên cùng của app. Ghi cookie rồi refresh để máy chủ dựng lại
 * trang bằng ngôn ngữ mới; nhờ vậy trang vẫn là server component, chữ nằm
 * sẵn trong HTML nên Google đọc được cả hai bản.
 *
 * Cookie dùng chung tên "aihlt-lang" với app quản trị, nên đổi bên nào thì
 * trang Giới thiệu bên kia cũng theo.
 */
export default function LangToggle({ lang }: { lang: AbtLang }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const pick = (next: AbtLang) => {
    if (next === lang) return;
    // 1 năm, áp cho cả site
    document.cookie = `aihlt-lang=${next}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  };

  const btn = (code: AbtLang, label: string) => {
    const on = lang === code;
    return (
      <button
        type="button"
        onClick={() => pick(code)}
        aria-pressed={on}
        style={{
          border: "none",
          cursor: on ? "default" : "pointer",
          padding: "5px 11px",
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.04em",
          background: on ? "var(--abt-ink, #5E5CE6)" : "transparent",
          color: on ? "#fff" : "rgba(255,255,255,0.72)",
          transition: "background 0.2s ease, color 0.2s ease",
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 60,
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
        padding: 3,
        borderRadius: 999,
        background: "rgba(18,18,23,0.72)",
        border: "1px solid rgba(255,255,255,0.14)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        opacity: pending ? 0.6 : 1,
      }}
    >
      {btn("vi", "VI")}
      {btn("en", "EN")}
    </div>
  );
}
