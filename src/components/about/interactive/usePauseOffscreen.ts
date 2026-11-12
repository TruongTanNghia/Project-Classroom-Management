"use client";
/** usePauseOffscreen — chuyển 1:1 từ abtPause(): thêm .abt-paused cho [data-anim] khi khuất (rootMargin 120px). */
import { useEffect, type RefObject } from "react";

export function usePauseOffscreen(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (en) => en.forEach((x) => x.target.classList.toggle("abt-paused", !x.isIntersecting)),
      { rootMargin: "120px" }
    );
    root.querySelectorAll("[data-anim]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rootRef]);
}
