"use client";

import { useEffect } from "react";

/* Mở và đóng hộp "nội dung từng buổi" của khoá học. Không vẽ gì: các <dialog> đã
   được KimCourseGrid dựng sẵn trên máy chủ, ở đây chỉ gắn hành vi.

   Dùng <dialog> + showModal() của trình duyệt để có sẵn: khoá tiêu điểm trong hộp,
   Esc để đóng, trả tiêu điểm về nút vừa bấm, và phần trang phía sau thành trơ.

   Mỗi khoá có địa chỉ riêng: mở hộp thì thanh địa chỉ thành #khoa-<tên>, và ai mở
   đường dẫn đó sẽ thấy đúng khoá ấy bật ra — tiện gửi cho phụ huynh, học viên. */

const HASH = /^#khoa-([a-z0-9-]+)$/;

export default function KimSyllabus() {
  useEffect(() => {
    const root = document.documentElement;

    const open = (slug: string) => {
      const d = document.getElementById("kim-syl-" + slug);
      if (!(d instanceof HTMLDialogElement) || d.open) return;
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
      history.replaceState(null, "", "#khoa-" + slug);
    };

    const onClick = (e: MouseEvent) => {
      const el = e.target;
      if (!(el instanceof Element)) return;
      const btn = el.closest<HTMLElement>("[data-syl]");
      if (btn?.dataset.syl) {
        open(btn.dataset.syl);
        return;
      }
      const d = el.closest("dialog.kim-syl");
      if (!(d instanceof HTMLDialogElement)) return;
      // el === d: bấm vào vùng mờ quanh hộp (cú bấm lên ::backdrop tính cho chính <dialog>).
      // Nút "Hỏi lịch học" cũng đóng hộp rồi để trình duyệt tự cuộn tới khối liên hệ.
      if (el === d || el.closest("[data-syl-close]")) d.close();
    };

    // sự kiện "close" không nổi bọt, nên phải bắt ở pha capture
    const onClose = (e: Event) => {
      if (!(e.target instanceof HTMLDialogElement) || !e.target.classList.contains("kim-syl")) return;
      root.style.paddingRight = "";
      if (HASH.test(location.hash)) history.replaceState(null, "", location.pathname + location.search);
    };

    const fromHash = () => {
      const m = HASH.exec(location.hash);
      if (m) open(m[1]);
    };

    document.addEventListener("click", onClick);
    document.addEventListener("close", onClose, true);
    window.addEventListener("hashchange", fromHash);
    fromHash();
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("close", onClose, true);
      window.removeEventListener("hashchange", fromHash);
      root.style.paddingRight = "";
    };
  }, []);

  return null;
}
