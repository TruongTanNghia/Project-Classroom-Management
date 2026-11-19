"use client";

import { useEffect } from "react";

import { legacyHashToPath } from "@/lib/public-sections";

/* Hai việc nhỏ về địa chỉ trên trang công khai (giờ đã là nhiều trang riêng, xem
   src/lib/public-sections.ts). Không vẽ gì ra màn hình.

   1. Địa chỉ kiểu cũ đã lỡ gửi đi (/#kim-path, /#khoa-hoc-may) → chuyển sang trang mới
      (/path, /courses/hoc-may). Dùng location.replace để nút Back không quay về địa chỉ cũ.
   2. "Liên hệ": trang nào cũng có khối Liên hệ ở chân trang, nên bấm "Liên hệ" (mục lục,
      nút "Hỏi lịch học"…) thì cuộn mượt xuống chân trang của chính trang đang xem, không tải
      trang khác. Liên kết vẫn là <a href="/contact"> thật: mở tab mới, bấm chuột giữa, hay
      trình duyệt không chạy JS thì vẫn tới trang /contact. */

export default function KimRouter() {
  useEffect(() => {
    const legacy = legacyHashToPath(location.hash);
    if (legacy) {
      location.replace(legacy + location.search);
      return;
    }

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.<HTMLAnchorElement>("a[href]");
      if (!a || a.target === "_blank" || a.origin !== location.origin || a.pathname !== "/contact") return;
      const foot = document.getElementById("kim-contact");
      if (!foot || location.pathname === "/contact") return;
      e.preventDefault();
      // menu điện thoại đang mở thì đóng trước khi cuộn
      a.closest("dialog")?.close();
      foot.scrollIntoView({ behavior: calm ? "instant" : "smooth", block: "start" });
      foot.tabIndex = -1;
      foot.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
