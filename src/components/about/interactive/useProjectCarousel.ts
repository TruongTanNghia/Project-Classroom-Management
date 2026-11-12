"use client";
/**
 * useProjectCarousel — chuyển 1:1 logic khối 02 Dự án:
 *  - chọn dự án (tab/nút ‹ ›), vòng tròn
 *  - tự chuyển sau 7000ms; chỉ khi khối hiện ≥30%, không bị giữ (hover), không reduced-motion
 *  - hover khung: hold = true + class .is-hold (thanh tiến trình đứng yên); rời chuột: chạy lại
 *  - đổi dự án: cuộn mượt danh sách tab ngang (tablet/mobile) tới tab đang chọn
 * Thanh tiến trình .bar i chạy bằng CSS (abtProg 7s) theo [aria-selected="true"] — tab mới được chọn sẽ tự chạy lại.
 */
import { useCallback, useEffect, useRef, useState } from "react";

export function useProjectCarousel(ids: readonly string[], intervalMs = 7000) {
  const [selected, setSelected] = useState(ids[0]);
  const [hold, setHold] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);
  const seen = useRef(false);
  const reduce = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  const scrollTabIntoView = useCallback((id: string) => {
    requestAnimationFrame(() => {
      const list = tabListRef.current;
      const t = list?.querySelector<HTMLElement>(`[data-tab="${id}"]`);
      if (list && t && list.scrollWidth > list.clientWidth + 4) {
        list.scrollTo({ left: t.offsetLeft - list.offsetLeft - 8, behavior: "smooth" });
      }
    });
  }, []);

  const select = useCallback((id: string) => { setSelected(id); scrollTabIntoView(id); }, [scrollTabIntoView]);
  const step = useCallback((d: number) => {
    const k = ids.indexOf(selectedRef.current);
    select(ids[(k + d + ids.length) % ids.length]);
  }, [ids, select]);

  // (re)arm sau mỗi lần đổi dự án / đổi trạng thái hold — giống arm() của thiết kế
  const arm = useCallback(() => {
    clearTimeout(timer.current);
    if (reduce.current || !seen.current || hold) return;
    timer.current = setTimeout(() => step(1), intervalMs);
  }, [hold, intervalMs, step]);

  useEffect(() => { arm(); return () => clearTimeout(timer.current); }, [selected, arm]);

  useEffect(() => {
    reduce.current = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const stage = stageRef.current;
    if (!stage || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((en) => {
      seen.current = en[0].isIntersecting;
      if (seen.current) arm(); else clearTimeout(timer.current);
    }, { threshold: 0.3 });
    io.observe(stage);
    return () => io.disconnect();
  }, [arm]);

  const stageProps = {
    ref: stageRef,
    className: hold ? "abt-stage abt-proj-stage is-hold" : "abt-stage abt-proj-stage",
    "data-anim": "projects",
    onMouseEnter: () => { setHold(true); clearTimeout(timer.current); },
    onMouseLeave: () => setHold(false),
  } as const;

  return { selected, select, step, stageProps, tabListRef };
}
