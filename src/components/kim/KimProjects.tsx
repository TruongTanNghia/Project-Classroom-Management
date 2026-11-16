"use client";

import { useEffect, useRef, useState } from "react";
import KimProjectsView from "./gen/KimProjectsView";
import type { KimLang } from "./i18n-kim";

/* Khối dự án: 7 thẻ bên trái, một khung trình diễn bên phải.
   Phần hình do máy sinh từ bản thiết kế (gen/KimProjectsView); file này chỉ giữ
   hành vi, theo đúng lớp logic của bản thiết kế:
     - tự chuyển dự án sau 7 giây, chỉ khi khối đang nằm trong màn hình
     - rê chuột vào khung thì dừng, rời ra thì đếm lại
     - người dùng tắt hiệu ứng chuyển động thì không tự chuyển
   Thêm ngoài thiết kế: phần trình diễn nào có thứ để bấm (khung quét 3D của LungVision) thì khi
   người xem đã chạm vào nó, băng chuyền đứng hẳn ở dự án đó cho tới khi họ tự chọn dự án khác.
   Không có điều này thì trên điện thoại (không có "rê chuột") thẻ bị chuyển đi giữa lúc đang xem.
   Phần trình diễn báo lên bằng sự kiện DOM "kim-proj-pin" (nổi bọt), khỏi phải luồn hàm qua
   file sinh tự động. */

const IDS = ["eduflow", "vision", "assistant", "cnc", "lung", "rl", "straw"];
const DWELL = 7000;
/* LungVision dừng lâu hơn: phần trình diễn của nó là một kịch bản quét 3D dài chừng 5 giây, lần
   đầu còn phải tải three.js và mô hình. 7 giây thì người xem chưa kịp thấy kết quả đã bị chuyển
   thẻ. Thanh tiến độ dưới thẻ chạy cùng thời lượng này (kim-organ-scan.css). */
const DWELL_OF: Record<string, number> = { lung: 11000 };
const next = (id: string, d: number) => IDS[(IDS.indexOf(id) + d + IDS.length) % IDS.length];

export default function KimProjects({ lang }: { lang: KimLang }) {
  const [cur, setCur] = useState(IDS[0]);
  const [hold, setHold] = useState(false);
  const [seen, setSeen] = useState(false);
  // dự án mà người xem đã chạm vào phần trình diễn; họ tự chọn dự án khác thì xoá
  const [pin, setPin] = useState<string | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const pinned = pin === cur;

  // hẹn giờ tự chuyển: đặt lại mỗi khi đổi dự án; dừng khi đang rê chuột, khi người xem đã chạm
  // vào phần trình diễn của dự án này, hoặc khi khối ra khỏi màn hình
  useEffect(() => {
    if (!seen || hold || pinned) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => setCur((c) => next(c, 1)), DWELL_OF[cur] ?? DWELL);
    return () => window.clearTimeout(t);
  }, [cur, hold, seen, pinned]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const onPin = (e: Event) => {
      const id = (e.target as Element | null)?.closest?.("[data-panel]")?.getAttribute("data-panel");
      if (id) setPin(id);
    };
    el.addEventListener("kim-proj-pin", onPin);
    return () => el.removeEventListener("kim-proj-pin", onPin);
  }, []);

  useEffect(() => {
    const stage = wrap.current?.querySelector(".kim-proj");
    if (!stage) return;
    const io = new IntersectionObserver((en) => setSeen(en[0].isIntersecting), { threshold: 0.3 });
    io.observe(stage);
    return () => io.disconnect();
  }, []);

  // ở màn hẹp các thẻ xếp thành một hàng ngang: cuộn thẻ đang chọn vào tầm nhìn
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const tab = wrap.current?.querySelector<HTMLElement>(`[data-tab="${cur}"]`);
      const list = tab?.parentElement;
      if (tab && list && list.scrollWidth > list.clientWidth + 4) {
        list.scrollTo({ left: tab.offsetLeft - list.offsetLeft - 8, behavior: "smooth" });
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [cur]);

  return (
    <div ref={wrap} style={{ display: "contents" }}>
      <KimProjectsView
        lang={lang}
        sel={(id) => cur === id}
        hid={(id) => (cur === id ? "" : "kim-hide")}
        // người xem tự chọn dự án: bỏ luôn dấu "đứng lại", để lần sau băng chuyền đi ngang dự án cũ không bị kẹt ở đó
        pick={(id) => () => {
          setPin(null);
          setCur(id);
        }}
        prevP={() => {
          setPin(null);
          setCur((c) => next(c, -1));
        }}
        nextP={() => {
          setPin(null);
          setCur((c) => next(c, 1));
        }}
        enterP={() => setHold(true)}
        leaveP={() => setHold(false)}
        holdClass={hold || pinned ? "is-hold" : ""}
      />
    </div>
  );
}
