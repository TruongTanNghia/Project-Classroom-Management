"use client";
/**
 * useCountUp — chuyển 1:1 từ bộ đếm số liệu: khi phần tử hiện ≥40% thì đếm 0 → giá trị trong 1500ms, easeOutCubic.
 * Trả về tiến độ e (0..1). reduced-motion hoặc không có IntersectionObserver: e = 1 ngay (hiện giá trị cuối).
 * SSR render giá trị cuối (e = 1) để không nhảy layout và bot đọc được số thật.
 */
import { useEffect, useState, type RefObject } from "react";

export function useCountUp(ref: RefObject<HTMLElement | null>, duration = 1500): number {
  const [p, setP] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((en) => en.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        setP(0);
        const tick = (now: number) => {
          const v = Math.min(1, (now - start) / duration);
          setP(v);
          if (v < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [ref, duration]);
  return 1 - Math.pow(1 - p, 3);
}
