"use client";
/**
 * Vỏ client mỏng cho cả trang: <div class="abt-canvas"><main class="abt-root">…</main></div>.
 * Gắn nghiêng 3D + tạm dừng animation khi khuất một lần cho toàn trang, nên các khối bên trong vẫn là server component.
 * dark: nối vào cơ chế theme của app (vd đọc từ next-themes) — hoặc bỏ prop này nếu CSS đã map .dark của <html>.
 */
import { useRef, type ReactNode } from "react";
import { usePauseOffscreen } from "./usePauseOffscreen";
import { useTilt } from "./useTilt";

export function AboutRoot({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  useTilt(rootRef);
  usePauseOffscreen(rootRef);
  return (
    <div className={dark ? "abt-canvas dark" : "abt-canvas"}>
      <main ref={rootRef} className="abt-root">
        {children}
      </main>
    </div>
  );
}
