"use client";

import { useEffect } from "react";

import { legacyHashToPath, parsePublicPath, type PublicSection } from "@/lib/public-sections";

/* Địa chỉ của từng khối trên trang công khai: /path, /projects, /courses… thay cho /#kim-path.

   Trang vẫn chỉ là một trang. Máy chủ (middleware) cho mọi địa chỉ đó hiện cùng một trang;
   việc của file này ở trình duyệt:
     1. Mở thẳng một địa chỉ khối (hoặc tải lại trang) → cuộn ngay tới khối đó.
     2. Bấm một liên kết nội bộ (mục lục, nút "Hỏi lịch học"…) → đổi địa chỉ bằng pushState và
        cuộn mượt tới khối, KHÔNG tải lại trang. Liên kết vẫn là thẻ <a href="/path"> thật, nên
        mở tab mới, bấm chuột giữa, sao chép địa chỉ đều chạy như liên kết thường.
     3. Địa chỉ kiểu cũ đã lỡ gửi đi (/#kim-path, /#khoa-hoc-may) → tự đổi sang kiểu mới.
   Nút Back/Forward: trình duyệt tự trả vị trí cuộn của từng địa chỉ, không cần làm gì thêm.

   Riêng /courses/<khoá> (mở hộp nội dung từng buổi) do KimSyllabus lo; sau mỗi lần đổi địa chỉ
   file này phát sự kiện "kim-route" để KimSyllabus đồng bộ theo.

   Không vẽ gì ra màn hình. */

export default function KimRouter() {
  useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sectionEl = (s: PublicSection) => document.getElementById("kim-" + s);

    const go = (s: PublicSection, smooth: boolean, focus: boolean) => {
      const el = sectionEl(s);
      if (!el) return;
      el.scrollIntoView({ behavior: smooth && !calm ? "smooth" : "instant", block: "start" });
      if (focus) {
        // như khi bấm liên kết #neo: phím Tab kế tiếp đi tiếp từ khối vừa tới, không quay về đầu trang
        el.tabIndex = -1;
        el.focus({ preventScroll: true });
      }
    };

    /* ---- lúc mở trang ---- */
    const legacy = legacyHashToPath(location.hash);
    if (legacy) history.replaceState(null, "", legacy + location.search);
    const first = parsePublicPath(location.pathname);
    // địa chỉ khoá học có hộp nội dung thì KimSyllabus tự cuộn tới thẻ khoá và mở hộp
    const land = first && !(first.course && document.getElementById("kim-syl-" + first.course)) ? first.section : null;
    if (land) {
      go(land, false, false);
      // phông chữ tải xong có thể làm các khối phía trên cao thấp đi một chút: canh lại một lần,
      // miễn là người xem chưa tự cuộn đi chỗ khác
      const y = window.scrollY;
      void document.fonts?.ready.then(() => {
        if (Math.abs(window.scrollY - y) < 4) go(land, false, false);
      });
    }

    /* ---- bấm liên kết nội bộ ---- */
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.<HTMLAnchorElement>("a[href]");
      // bỏ qua liên kết ra ngoài, liên kết mở tab mới, và liên kết kiểu "#…" (neo trong trang, để trình duyệt tự xử)
      if (!a || a.target === "_blank" || a.hasAttribute("download") || a.origin !== location.origin) return;
      if ((a.getAttribute("href") ?? "").startsWith("#") || a.hash) return;
      const home = a.pathname === "/";
      const target = home ? null : parsePublicPath(a.pathname);
      if (!home && !target) return;
      e.preventDefault();
      if (a.pathname !== location.pathname) history.pushState(null, "", a.pathname + a.search);
      window.dispatchEvent(new Event("kim-route"));
      if (home) window.scrollTo({ top: 0, behavior: calm ? "instant" : "smooth" });
      else if (target && !(target.course && document.getElementById("kim-syl-" + target.course))) go(target.section, true, true);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
