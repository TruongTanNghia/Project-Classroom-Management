"use client";
/**
 * useNeuralCanvas — chuyển 1:1 từ abtNeural() trong artboard Main.dc.html.
 * Lưới nơ-ron: 28–95 nút theo diện tích (W·H/11000), nối khi gần < 128px, quầng cho nút màu,
 * rê chuột trong host: hút nút bán kính 170px + vẽ dây tới con trỏ. Dừng khi khuất; DPR ≤ 2.
 * prefers-reduced-motion: chỉ vẽ một khung tĩnh.
 */
import { useEffect, type RefObject } from "react";

type NeuralNode = { x: number; y: number; vx: number; vy: number; r: number; c: string };

const COLORS = ["255,255,255", "255,255,255", "255,255,255", "255,255,255", "31,182,184", "31,182,184", "133,131,240", "245,166,35"];
const LINK = 128;
const PULL = 170;

export function useNeuralCanvas(canvasRef: RefObject<HTMLCanvasElement | null>, hostRef?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const host: HTMLElement = hostRef?.current ?? canvas.closest("section") ?? canvas.parentElement ?? canvas;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    let W = 0, H = 0, raf = 0, visible = true;
    let nodes: NeuralNode[] = [];
    let mouse: { x: number; y: number } | null = null;

    const seed = () => {
      const n = Math.round(Math.min(95, Math.max(28, (W * H) / 11000)));
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.5 + 0.7,
        c: COLORS[(Math.random() * COLORS.length) | 0],
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const L2 = LINK * LINK;
      ctx.lineWidth = 0.8;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
          if (d2 < L2) {
            ctx.strokeStyle = `rgba(${a.c},${((1 - Math.sqrt(d2) / LINK) * 0.22).toFixed(3)})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        if (mouse) {
          const dx = a.x - mouse.x, dy = a.y - mouse.y, d2 = dx * dx + dy * dy;
          if (d2 < PULL * PULL) {
            ctx.strokeStyle = `rgba(31,182,184,${((1 - Math.sqrt(d2) / PULL) * 0.55).toFixed(3)})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
          }
        }
      }
      for (const a of nodes) {
        ctx.fillStyle = `rgba(${a.c},0.85)`; ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.283); ctx.fill();
        if (a.c !== "255,255,255") { ctx.fillStyle = `rgba(${a.c},0.18)`; ctx.beginPath(); ctx.arc(a.x, a.y, a.r * 4, 0, 6.283); ctx.fill(); }
      }
    };

    const step = () => {
      raf = 0;
      if (!visible) return;
      for (const p of nodes) {
        if (mouse) {
          const dx = mouse.x - p.x, dy = mouse.y - p.y, d2 = dx * dx + dy * dy;
          if (d2 < PULL * PULL) { p.vx += dx * 0.00004; p.vy += dy * 0.00004; }
        }
        const sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (sp > 0.6) { p.vx *= 0.6 / sp; p.vy *= 0.6 / sp; }
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10; if (p.y > H + 10) p.y = -10;
      }
      draw();
      raf = requestAnimationFrame(step);
    };

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = canvas.clientWidth; H = canvas.clientHeight;
      if (!W || !H) return;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed(); draw();
    };

    const move = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      if (!r.width) return;
      mouse = { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) };
    };
    const leave = () => { mouse = null; };

    resize();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    ro?.observe(canvas);
    let io: IntersectionObserver | null = null;
    if (!reduce) {
      host.addEventListener("mousemove", move);
      host.addEventListener("mouseleave", leave);
      if (typeof IntersectionObserver !== "undefined") {
        io = new IntersectionObserver((en) => { visible = en[0].isIntersecting; if (visible && !raf) raf = requestAnimationFrame(step); });
        io.observe(canvas);
      }
      raf = requestAnimationFrame(step);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      io?.disconnect();
      host.removeEventListener("mousemove", move);
      host.removeEventListener("mouseleave", leave);
    };
  }, [canvasRef, hostRef]);
}
