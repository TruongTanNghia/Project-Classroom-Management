"use client";

import { useEffect } from "react";

import { coursePath, legacyHashToPath, parsePublicPath, sectionPath } from "@/lib/public-sections";

/* Mở và đóng hộp "nội dung từng buổi" của khoá học. Không vẽ gì: các <dialog> đã
   được KimCourseGrid dựng sẵn trên máy chủ, ở đây chỉ gắn hành vi.

   Dùng <dialog> + showModal() của trình duyệt để có sẵn: khoá tiêu điểm trong hộp,
   Esc để đóng, trả tiêu điểm về nút vừa bấm, và phần trang phía sau thành trơ.

   Mỗi khoá có địa chỉ riêng: mở hộp thì thanh địa chỉ thành /courses/<khoá> (vd
   /courses/hoc-may), và ai mở địa chỉ đó sẽ thấy đúng khoá ấy bật ra — tiện gửi cho phụ
   huynh, học viên. Đóng hộp thì địa chỉ về /courses. Địa chỉ kiểu cũ /#khoa-<khoá> vẫn chạy.
   Địa chỉ của các khối còn lại do KimRouter lo (xem src/lib/public-sections.ts). */

export default function KimSyllabus() {
  useEffect(() => {
    const root = document.documentElement;
    const dialogOf = (slug: string) => {
      const d = document.getElementById("kim-syl-" + slug);
      return d instanceof HTMLDialogElement ? d : null;
    };

    const open = (slug: string, bringCardIntoView: boolean) => {
      const d = dialogOf(slug);
      if (!d || d.open) return;
      // mở bằng địa chỉ thì đưa thẻ khoá ra giữa màn hình trước, để đóng hộp lại là thấy đúng thẻ đó
      if (bringCardIntoView) document.getElementById("khoa-" + slug)?.scrollIntoView({ block: "center", behavior: "instant" });
      const widthBefore = document.body.getBoundingClientRect().width;
      d.showModal();
      // Hộp mở thì CSS khoá cuộn trang và giữ chỗ thanh cuộn bằng scrollbar-gutter. Trình duyệt
      // chưa hỗ trợ thuộc tính đó (Safari cũ, khi thanh cuộn chiếm chỗ) sẽ để trang nở ra đúng
      // bằng bề rộng thanh cuộn và giật ngang; bù lại phần vừa nở. Bình thường phần này bằng 0.
      // Đo bề rộng của <body> chứ không đo clientWidth của <html>: clientWidth tính luôn cả phần
      // giữ chỗ nên báo "nở ra" ngay cả khi trang không hề xê dịch.
      const gained = document.body.getBoundingClientRect().width - widthBefore;
      if (gained > 0.5) root.style.paddingRight = gained + "px";
      d.querySelector(".kim-syl-scroll")?.scrollTo(0, 0);
      // replaceState không tạo mục mới trong lịch sử: bấm Back vẫn rời trang như thường
      if (location.pathname !== coursePath(slug)) history.replaceState(null, "", coursePath(slug) + location.search);
    };

    const onClick = (e: MouseEvent) => {
      const el = e.target;
      if (!(el instanceof Element)) return;
      const btn = el.closest<HTMLElement>("[data-syl]");
      if (btn?.dataset.syl) {
        open(btn.dataset.syl, false);
        return;
      }
      const d = el.closest("dialog.kim-syl");
      if (!(d instanceof HTMLDialogElement)) return;
      // el === d: bấm vào vùng mờ quanh hộp (cú bấm lên ::backdrop tính cho chính <dialog>).
      // Nút "Hỏi lịch học" cũng đóng hộp; việc đổi địa chỉ và cuộn tới khối liên hệ là của KimRouter.
      if (el === d || el.closest("[data-syl-close]")) d.close();
    };

    // sự kiện "close" không nổi bọt, nên phải bắt ở pha capture
    const onClose = (e: Event) => {
      if (!(e.target instanceof HTMLDialogElement) || !e.target.classList.contains("kim-syl")) return;
      root.style.paddingRight = "";
      // còn đang ở địa chỉ của khoá (đóng bằng Esc, nút X, bấm ra ngoài) thì lùi về địa chỉ khối khoá học
      if (parsePublicPath(location.pathname)?.course) history.replaceState(null, "", sectionPath("courses") + location.search);
    };

    /** cho hộp khớp với địa chỉ hiện tại: lúc mở trang, khi bấm Back/Forward, khi KimRouter đổi địa chỉ */
    const sync = () => {
      const target = parsePublicPath(location.pathname) ?? parsePublicPath(legacyHashToPath(location.hash) ?? "");
      const want = target?.course ? dialogOf(target.course) : null;
      document.querySelectorAll<HTMLDialogElement>("dialog.kim-syl[open]").forEach((d) => {
        if (d !== want) d.close();
      });
      if (target?.course) open(target.course, true);
    };

    document.addEventListener("click", onClick);
    document.addEventListener("close", onClose, true);
    window.addEventListener("popstate", sync);
    window.addEventListener("kim-route", sync);
    sync();
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("close", onClose, true);
      window.removeEventListener("popstate", sync);
      window.removeEventListener("kim-route", sync);
      root.style.paddingRight = "";
    };
  }, []);

  return null;
}
