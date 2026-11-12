"use client";
/**
 * useTilt — chuyển 1:1 từ abtTilt(): gắn MỘT lần trên .abt-root, mọi phần tử [data-tilt="N"] bên trong
 * nghiêng tối đa N độ theo con trỏ (CSS đọc --rx/--ry) và có quầng sáng tại --mx/--my.
 * Chỉ bật khi (hover: hover) and (pointer: fine) và không reduced-motion — đúng như thiết kế.
 */
import { useEffect, type RefObject } from "react";

export function useTilt(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mq = (q: string) => window.matchMedia?.(q).matches ?? false;
    if (!mq("(hover: hover) and (pointer: fine)") || mq("(prefers-reduced-motion: reduce)")) return;
    let raf = 0;
    let cur: HTMLElement | null = null;
    let last: { el: HTMLElement; x: number; y: number } | null = null;
    const reset = (el: HTMLElement) => { el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); };
    const apply = () => {
      raf = 0;
      if (!last) return;
      const { el } = last;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const px = (last.x - r.left) / r.width - 0.5;
      const py = (last.y - r.top) / r.height - 0.5;
      const max = parseFloat(el.getAttribute("data-tilt") ?? "") || 8;
      el.style.setProperty("--ry", `${(px * max).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${(-py * max).toFixed(2)}deg`);
      el.style.setProperty("--mx", `${((px + 0.5) * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${((py + 0.5) * 100).toFixed(1)}%`);
    };
    const move = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.<HTMLElement>("[data-tilt]") ?? null;
      if (cur && cur !== el) reset(cur);
      cur = el;
      if (!el) return;
      last = { el, x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const leave = () => { if (cur) reset(cur); cur = null; };
    root.addEventListener("mousemove", move);
    root.addEventListener("mouseleave", leave);
    return () => { root.removeEventListener("mousemove", move); root.removeEventListener("mouseleave", leave); cancelAnimationFrame(raf); };
  }, [rootRef]);
}
