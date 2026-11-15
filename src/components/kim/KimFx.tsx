"use client";

import { useEffect } from "react";

/* Lớp hiệu ứng "kim cương" cho cả trang. Không vẽ gì ra màn hình; chỉ gắn hành vi
   lên những phần tử có sẵn của bản thiết kế, nên bỏ file này đi thì trang trở về
   đúng nguyên bản thiết kế.

   Ba việc:
   1. Hiện dần khi cuộn tới — chỉ áp cho phần đang nằm DƯỚI màn hình lúc tải trang,
      để không có cảnh nội dung hiện ra rồi chớp tắt rồi hiện lại.
   2. Viền sáng chạy theo con trỏ trên thẻ: ghi toạ độ chuột (so với thẻ) vào biến
      CSS --px/--py, CSS tự vẽ.
   3. Rắc sao lấp lánh lên vài chỗ: biển tên, đồng xu số bước, phương châm, khối liên hệ.

   Trạng thái ghi bằng thuộc tính data-* và biến CSS chứ không sửa className, vì
   React sẽ ghi đè className của những phần tử nó quản lý (thẻ dự án, khung trình diễn). */

const REVEAL =
  ".kim-head, .kim-phases, .kim-station, .kim-proj-layout, .kim-sol, .kim-step, .kim-course, .kim-topics, .kim-year, .kim-motto, .kim-tools, .kim-quote, .kim-contact";
const SPOT = ".kim-sol, .kim-course, .kim-quote, .kim-panel, .kim-proj-cta, .kim-topic-list a, .kim-proof, .kim-proj, .kim-journey, .kim-contact-item";

/** bộ sinh số giả ngẫu nhiên có hạt giống: sao rơi cùng chỗ ở mọi lần tải trang */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function star(host: Element, x: string, y: string, size: number, delay: number, period: number) {
  const el = document.createElement("span");
  el.className = "kim-star";
  el.setAttribute("aria-hidden", "true");
  el.style.setProperty("--x", x);
  el.style.setProperty("--y", y);
  el.style.setProperty("--s", size + "px");
  el.style.setProperty("--d", delay.toFixed(2) + "s");
  el.style.setProperty("--t", period.toFixed(2) + "s");
  host.appendChild(el);
  return el;
}

export default function KimFx() {
  useEffect(() => {
    const root = document.getElementById("kim-canvas");
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const made: Element[] = [];

    /* ---- 1. hiện dần khi cuộn tới ---- */
    let io: IntersectionObserver | null = null;
    if (!reduce) {
      const vh = window.innerHeight;
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            (e.target as HTMLElement).dataset.rv = "in";
            io!.unobserve(e.target);
          }
        },
        { rootMargin: "0px 0px -7% 0px", threshold: 0.06 }
      );
      root.querySelectorAll<HTMLElement>(REVEAL).forEach((el) => {
        if (el.getBoundingClientRect().top < vh * 0.92) return; // đã nằm trong màn hình: để yên
        // các thẻ cùng hàng hiện so le nhau một nhịp
        const sibs = el.parentElement ? Array.from(el.parentElement.children).filter((c) => c.matches(REVEAL)) : [el];
        el.style.setProperty("--rv-i", String(Math.min(7, sibs.indexOf(el))));
        el.dataset.rv = "";
        io!.observe(el);
      });
    }

    /* ---- 2. viền sáng theo con trỏ ---- */
    let raf = 0;
    let pending: PointerEvent | null = null;
    const apply = () => {
      raf = 0;
      const e = pending;
      if (!e) return;
      let el = (e.target as Element | null)?.closest?.(SPOT) as HTMLElement | null;
      // một thẻ nằm trong một bảng lớn: cập nhật cả hai
      while (el) {
        const r = el.getBoundingClientRect();
        // trang có thể đang được phóng (zoom) trên màn rộng: đổi về toạ độ của chính phần tử
        const z = el.offsetWidth ? r.width / el.offsetWidth : 1;
        el.style.setProperty("--px", ((e.clientX - r.left) / z).toFixed(1) + "px");
        el.style.setProperty("--py", ((e.clientY - r.top) / z).toFixed(1) + "px");
        el = el.parentElement?.closest?.(SPOT) as HTMLElement | null;
      }
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pending = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    root.addEventListener("pointermove", onMove, { passive: true });

    /* ---- 3. sao lấp lánh ---- */
    if (!reduce) {
      const rnd = rng(20261115);
      root.querySelectorAll(".kim-plate").forEach((p, i) => made.push(star(p, "100%", "0%", 15, 1.2 + i * 2.1, 5.2)));
      root.querySelectorAll(".kim-coin").forEach((c, i) => made.push(star(c, "76%", "18%", 16, 0.6 + i * 1.3, 6.3)));
      const motto = root.querySelector(".kim-motto strong");
      if (motto) {
        made.push(star(motto, "3%", "12%", 22, 0.4, 5.5));
        made.push(star(motto, "57%", "2%", 16, 2.2, 6.4));
        made.push(star(motto, "98.5%", "66%", 26, 3.6, 5.9));
      }
      const now = root.querySelector(".kim-year.is-now .kim-year-dot");
      if (now) made.push(star(now, "50%", "50%", 20, 0.8, 4.2));
      // bụi kim cương quanh mặt đồng hồ: nằm trên vành vạch chia, tránh chỗ tám huy hiệu
      const gauge = root.querySelector(".kim-gauge");
      if (gauge) {
        const spots: [number, number, number][] = [
          [-22, 37, 15], [4, 39.5, 11], [24, 36.5, 17], [-60, 35.5, 10], [61, 36, 12],
          [-118, 36.5, 13], [121, 37, 15], [-152, 38, 11], [156, 37.5, 16], [-91, 46.5, 10], [90, 46.5, 12],
        ];
        spots.forEach(([deg, rho, size], i) => {
          const a = ((deg - 90) * Math.PI) / 180;
          const x = 50 + rho * Math.cos(a);
          const y = 40 + (rho * Math.sin(a)) / 1.12;
          made.push(star(gauge, x.toFixed(2) + "%", y.toFixed(2) + "%", size, (i * 0.83) % 6.1, 5.4 + (i % 4) * 0.7));
        });
      }
      const contact = root.querySelector(".kim-contact");
      if (contact) {
        // dày quanh viên đá ở góc trên phải, thưa dần ra xa; nửa trái là chữ nên chỉ rắc
        // ở hai dải mép trên và dưới, không để sao rơi đè lên tiêu đề
        let n = 0;
        while (n < 28) {
          const x = 100 - Math.pow(rnd(), 1.6) * 97;
          const y = Math.pow(rnd(), 1.4) * 93 + 3;
          const overText = x < 54 && y > 13 && y < 90;
          const overCards = x >= 54 && x < 96 && y > 44 && y < 93;
          if (overText || overCards) continue;
          made.push(star(contact, x.toFixed(1) + "%", y.toFixed(1) + "%", 8 + rnd() * 14, rnd() * 7, 4 + rnd() * 5));
          n++;
        }
      }
    }

    return () => {
      io?.disconnect();
      root.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
      made.forEach((m) => m.remove());
    };
  }, []);

  return null;
}
