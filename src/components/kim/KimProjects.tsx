"use client";

import { useEffect, useRef, useState } from "react";
import KimProjectsView from "./gen/KimProjectsView";
import type { KimLang } from "./i18n-kim";

/* Khối dự án: 7 thẻ bên trái, một khung trình diễn bên phải.
   Phần hình do máy sinh từ bản thiết kế (gen/KimProjectsView); file này chỉ giữ
   hành vi, theo đúng lớp logic của bản thiết kế:
     - tự chuyển dự án sau 7 giây, chỉ khi khối đang nằm trong màn hình
     - rê chuột vào khung thì dừng, rời ra thì đếm lại
     - người dùng tắt hiệu ứng chuyển động thì không tự chuyển */

const IDS = ["eduflow", "vision", "assistant", "cnc", "lung", "rl", "straw"];
const DWELL = 7000;
const next = (id: string, d: number) => IDS[(IDS.indexOf(id) + d + IDS.length) % IDS.length];

export default function KimProjects({ lang }: { lang: KimLang }) {
  const [cur, setCur] = useState(IDS[0]);
  const [hold, setHold] = useState(false);
  const [seen, setSeen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  // hẹn giờ tự chuyển: đặt lại mỗi khi đổi dự án, dừng khi đang rê chuột hoặc khối ra khỏi màn hình
  useEffect(() => {
    if (!seen || hold) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => setCur((c) => next(c, 1)), DWELL);
    return () => window.clearTimeout(t);
  }, [cur, hold, seen]);

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
        pick={(id) => () => setCur(id)}
        prevP={() => setCur((c) => next(c, -1))}
        nextP={() => setCur((c) => next(c, 1))}
        enterP={() => setHold(true)}
        leaveP={() => setHold(false)}
        holdClass={hold ? "is-hold" : ""}
      />
    </div>
  );
}
