"use client";

import { useEffect } from "react";

import { parsePublicPath, roadmapPath, sectionPath } from "@/lib/public-sections";

/* Hành vi của trang /roadmap. Không vẽ nội dung: bản đồ, các ô và mọi ngăn chi tiết đã được
   KimRoadmap dựng sẵn trên máy chủ, ở đây chỉ gắn hành vi lên đó.

   1. Ngăn chi tiết (<dialog>, mở bằng showModal: khoá tiêu điểm, Esc để đóng). Mỗi ô có địa chỉ
      riêng /roadmap/<ô> (vd /roadmap/ml): mở ô thì thanh địa chỉ đổi theo, ai mở địa chỉ đó thấy
      đúng ô ấy bật ra. ← → đi lần lượt, D đánh dấu đã học.
   2. Dây nối: rê chuột (hoặc Tab tới) một ô thì vẽ đường cong tới ô cần học trước (nét gạch) và
      ô nó mở khoá (nét chấm), các ô khác mờ đi.
   3. Tiến độ: ô đã học lưu trong localStorage của người xem (chỉ là tiện ích trên máy họ, không
      gửi đi đâu; trình duyệt chặn lưu thì trang vẫn chạy, chỉ là không nhớ).
   4. Tìm (phím "/" để nhảy vào ô tìm) và lọc theo giai đoạn trên thanh thời gian.

   Trạng thái ghi bằng thuộc tính data-*, CSS ở kim-roadmap.css tự vẽ theo. */

const KEY = "aihlt-roadmap-done";
const SVGNS = "http://www.w3.org/2000/svg";

/** bỏ dấu tiếng Việt để gõ "hoc may" vẫn tìm ra "Học máy" */
const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d");

function load(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : []);
  } catch {
    return new Set();
  }
}
function save(done: Set<string>) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...done]));
  } catch {
    /* chế độ ẩn danh, bị chặn lưu: bỏ qua */
  }
}

export default function KimRoadmapFx() {
  useEffect(() => {
    const sec = document.getElementById("kim-roadmap");
    const map = document.getElementById("kim-rm-map");
    const wires = document.getElementById("kim-rm-wires") as SVGSVGElement | null;
    const drawer = document.getElementById("kim-rm-drawer");
    if (!sec || !map || !wires || !(drawer instanceof HTMLDialogElement)) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const order = (sec.dataset.order || "").split(",").filter(Boolean);
    const tiles = Array.from(map.querySelectorAll<HTMLElement>(".kim-rm-tile"));
    const tileOf = new Map(tiles.map((t) => [t.dataset.rm!, t]));
    const listOf = (t: HTMLElement, k: "pre" | "next") => (t.dataset[k] || "").split(",").filter(Boolean);
    const panelOf = (id: string) => drawer.querySelector<HTMLElement>(`[data-rm-panel="${id}"]`);
    const idFromSlug = (slug: string) => order.find((id) => id.toLowerCase() === slug.toLowerCase()) ?? null;
    const mark = drawer.querySelector<HTMLButtonElement>("#kim-rm-mark")!;
    const crumb = drawer.querySelector<HTMLElement>("#kim-rm-crumb")!;
    const scroller = drawer.querySelector<HTMLElement>(".kim-rm-dscroll")!;
    const cleanups: (() => void)[] = [];
    const on = (el: EventTarget, type: string, fn: (e: never) => void, opt?: AddEventListenerOptions | boolean) => {
      el.addEventListener(type, fn as EventListener, opt);
      cleanups.push(() => el.removeEventListener(type, fn as EventListener, opt));
    };

    /* ================= 3. tiến độ ================= */
    let done = load();
    const paint = (popId?: string) => {
      // bỏ những mã không còn trên bản đồ (bản đồ đổi về sau)
      done = new Set([...done].filter((id) => tileOf.has(id)));
      tiles.forEach((t) => {
        const id = t.dataset.rm!;
        const isDone = done.has(id);
        const ready = !isDone && listOf(t, "pre").every((p) => done.has(p));
        t.toggleAttribute("data-done", isDone);
        t.toggleAttribute("data-ready", ready && done.size > 0);
      });
      const n = done.size;
      const total = tiles.length;
      const count = sec.querySelector("#kim-rm-count");
      if (count) count.textContent = `${n}/${total}`;
      const arc = sec.querySelector<SVGCircleElement>("#kim-rm-arc");
      if (arc) arc.style.strokeDashoffset = String(113.1 * (1 - n / total));
      sec.toggleAttribute("data-any", n > 0);
      sec.querySelectorAll<HTMLElement>(".kim-rm-tier").forEach((tier) => {
        const ts = Array.from(tier.querySelectorAll<HTMLElement>(".kim-rm-tile"));
        const k = ts.filter((t) => done.has(t.dataset.rm!)).length;
        tier.style.setProperty("--p", String(k / ts.length));
        tier.toggleAttribute("data-full", k === ts.length);
        const lbl = tier.querySelector(`[data-rm-tp]`);
        if (lbl) lbl.textContent = `${k}/${ts.length}`;
        const inDrawer = drawer.querySelector(`[data-rm-tpd="${tier.dataset.tier}"]`);
        if (inDrawer) inDrawer.textContent = String(k);
      });
      sec.querySelectorAll<HTMLElement>(".kim-rm-cp").forEach((cp) => {
        const needs = Array.from(drawer.querySelectorAll<HTMLElement>(`[data-rm-panel="${cp.dataset.rm}"] [data-rm-go]`)).map((b) => b.dataset.rmGo!);
        const k = needs.filter((id) => done.has(id)).length;
        const lbl = cp.querySelector("[data-rm-cs]");
        if (lbl) lbl.textContent = `${k}/${needs.length}`;
        cp.toggleAttribute("data-ok", needs.length > 0 && k === needs.length);
      });
      // ô trong danh sách liên kết của ngăn chi tiết cũng hiện dấu đã học
      drawer.querySelectorAll<HTMLElement>("[data-rm-go]").forEach((b) => b.toggleAttribute("data-done", done.has(b.dataset.rmGo!)));
      syncMark();
      if (popId && !reduce) {
        const t = tileOf.get(popId);
        if (t) {
          t.removeAttribute("data-pop");
          void t.offsetWidth;
          t.setAttribute("data-pop", "");
        }
      }
    };
    const toggleDone = (id: string) => {
      if (!tileOf.has(id)) return;
      if (done.has(id)) done.delete(id);
      else done.add(id);
      save(done);
      paint(done.has(id) ? id : undefined);
    };

    /* ================= 1. ngăn chi tiết ================= */
    let cur: string | null = null;
    function syncMark() {
      const isNode = !!cur && tileOf.has(cur);
      mark.hidden = !isNode;
      const isDone = !!cur && done.has(cur);
      mark.setAttribute("aria-pressed", String(isDone));
      mark.textContent = (isDone ? mark.dataset.on : mark.dataset.off) || "";
    }
    const show = (id: string) => {
      const panel = panelOf(id);
      if (!panel) return false;
      drawer.querySelectorAll<HTMLElement>("[data-rm-panel]").forEach((p) => (p.hidden = p !== panel));
      sec.querySelectorAll("[data-rm][data-cur]").forEach((el) => el.removeAttribute("data-cur"));
      sec.querySelector(`[data-rm="${id}"]`)?.setAttribute("data-cur", "");
      cur = id;
      crumb.textContent = panel.dataset.crumb || "";
      drawer.setAttribute("aria-label", panel.querySelector("h3")?.textContent || "");
      drawer.style.setProperty("--c", panel.querySelector<HTMLElement>(".kim-rm-dhero")?.style.getPropertyValue("--c") || "var(--rm6)");
      scroller.scrollTo(0, 0);
      if (!reduce) {
        panel.removeAttribute("data-in");
        void panel.offsetWidth;
        panel.setAttribute("data-in", "");
      }
      syncMark();
      const path = roadmapPath(id);
      if (location.pathname !== path) history.replaceState(null, "", path + location.search);
      return true;
    };
    const open = (id: string) => {
      if (!show(id)) return;
      if (!drawer.open) {
        clearWires();
        drawer.showModal();
      }
    };
    const step = (d: number) => {
      if (!cur) return;
      const i = order.indexOf(cur);
      const next = order[(i + d + order.length) % order.length];
      show(next);
      // ô vừa tới nằm ngay sau ngăn: kéo nó vào màn hình để đóng ngăn là thấy đúng chỗ
      sec.querySelector(`[data-rm="${next}"]`)?.scrollIntoView({ block: "nearest", behavior: reduce ? "instant" : "smooth" });
    };

    on(drawer, "close", () => {
      const was = cur;
      cur = null;
      sec.querySelectorAll("[data-rm][data-cur]").forEach((el) => el.removeAttribute("data-cur"));
      if (parsePublicPath(location.pathname)?.node) history.replaceState(null, "", sectionPath("roadmap") + location.search);
      // trả tiêu điểm về đúng ô đang xem (có thể đã đi ← → sang ô khác so với ô bấm mở)
      if (was) sec.querySelector<HTMLElement>(`[data-rm="${was}"]`)?.focus({ preventScroll: true });
    });

    /** khớp ngăn với địa chỉ: lúc mở trang, khi bấm Back/Forward */
    const sync = () => {
      const target = parsePublicPath(location.pathname);
      const id = target?.node ? idFromSlug(target.node) : null;
      if (target?.node && !id) {
        history.replaceState(null, "", sectionPath("roadmap") + location.search);
        if (drawer.open) drawer.close();
        return;
      }
      if (id) {
        sec.querySelector(`[data-rm="${id}"]`)?.scrollIntoView({ block: "center", behavior: "instant" });
        open(id);
      } else if (drawer.open) drawer.close();
    };
    on(window, "popstate", sync);

    on(sec, "click", (e: MouseEvent) => {
      const el = e.target;
      if (!(el instanceof Element)) return;
      if (el === drawer) {
        drawer.close(); // bấm ra vùng mờ quanh ngăn
        return;
      }
      const go = el.closest<HTMLElement>("[data-rm-go]");
      if (go) {
        show(go.dataset.rmGo!);
        return;
      }
      const st = el.closest<HTMLElement>("[data-rm-step]");
      if (st) {
        step(Number(st.dataset.rmStep));
        return;
      }
      if (el.closest("[data-rm-close]")) {
        drawer.close();
        return;
      }
      if (el.closest("#kim-rm-mark")) {
        if (cur) toggleDone(cur);
        return;
      }
      const stage = el.closest<HTMLElement>("[data-rm-stage]");
      if (stage) {
        const n = stage.dataset.rmStage!;
        stageOn = stageOn === n ? null : n;
        sec.querySelectorAll<HTMLElement>("[data-rm-stage]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.rmStage === stageOn)));
        filter();
        return;
      }
      const item = el.closest<HTMLElement>("[data-rm]");
      if (item && map.contains(item)) open(item.dataset.rm!);
    });

    on(document, "keydown", (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const typing = e.target instanceof HTMLElement && (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName));
      if (drawer.open) {
        if (typing) return;
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          e.preventDefault();
          step(e.key === "ArrowLeft" ? -1 : 1);
        } else if ((e.key === "d" || e.key === "D") && cur) {
          e.preventDefault();
          toggleDone(cur);
        }
        return;
      }
      if (e.key === "/" && !typing && !document.querySelector("dialog[open]")) {
        e.preventDefault();
        q?.focus();
      }
    });

    /* ================= 4. tìm và lọc ================= */
    const q = sec.querySelector<HTMLInputElement>("#kim-rm-q");
    const hits = sec.querySelector<HTMLElement>("#kim-rm-hits");
    const hay = new Map(tiles.map((t) => [t, fold(t.dataset.q || "")]));
    let stageOn: string | null = null;
    const filter = () => {
      const words = fold(q?.value.trim() || "").split(/\s+/).filter(Boolean);
      const any = words.length > 0 || stageOn !== null;
      let n = 0;
      tiles.forEach((t) => {
        const okQ = words.every((w) => hay.get(t)!.includes(w));
        const okS = stageOn === null || t.dataset.stage === stageOn;
        const hit = any && okQ && okS;
        if (hit) n++;
        t.toggleAttribute("data-hit", hit);
        t.toggleAttribute("data-miss", any && !hit);
      });
      map.toggleAttribute("data-filter", any);
      sec.querySelectorAll<HTMLElement>(".kim-rm-tier").forEach((tier) => {
        tier.toggleAttribute("data-empty", any && !tier.querySelector(".kim-rm-tile[data-hit]"));
      });
      if (hits) hits.textContent = any ? `${n}/${tiles.length}` : "";
    };
    if (q) {
      on(q, "input", filter);
      on(q, "keydown", (e: KeyboardEvent) => {
        if (e.key === "Escape" && q.value) {
          e.preventDefault();
          q.value = "";
          filter();
        } else if (e.key === "Enter") {
          const first = tiles.find((t) => t.hasAttribute("data-hit"));
          if (first) {
            e.preventDefault();
            open(first.dataset.rm!);
          }
        }
      });
    }

    /* đặt lại: bấm hai lần (lần đầu nút đổi chữ để hỏi lại), tránh lỡ tay xoá tiến độ */
    const reset = sec.querySelector<HTMLButtonElement>("#kim-rm-reset");
    if (reset) {
      const label = reset.textContent || "";
      let armed = 0;
      on(reset, "click", () => {
        if (armed) {
          window.clearTimeout(armed);
          armed = 0;
          reset.textContent = label;
          reset.removeAttribute("data-armed");
          done.clear();
          save(done);
          paint();
          return;
        }
        reset.textContent = reset.dataset.confirm || label;
        reset.setAttribute("data-armed", "");
        armed = window.setTimeout(() => {
          armed = 0;
          reset.textContent = label;
          reset.removeAttribute("data-armed");
        }, 3200);
      });
      cleanups.push(() => window.clearTimeout(armed));
    }

    /* ================= 2. dây nối ================= */
    let hoverId: string | null = null;
    const clearWires = () => {
      hoverId = null;
      wires.replaceChildren();
      map.removeAttribute("data-wire");
      tiles.forEach((t) => t.removeAttribute("data-rel"));
    };
    const drawWires = (id: string, force = false) => {
      const me = tileOf.get(id);
      if (!me || (hoverId === id && !force)) return;
      clearWires();
      hoverId = id;
      const mr = map.getBoundingClientRect();
      // cả trang có thể đang được phóng (zoom) trên màn rộng: đổi về toạ độ của chính bản đồ
      const z = map.offsetWidth ? mr.width / map.offsetWidth : 1;
      const W = map.offsetWidth;
      const H = map.offsetHeight;
      wires.setAttribute("viewBox", `0 0 ${W} ${H}`);
      wires.setAttribute("width", String(W));
      wires.setAttribute("height", String(H));
      const box = (el: Element) => {
        const r = el.getBoundingClientRect();
        return { x: (r.left - mr.left) / z, y: (r.top - mr.top) / z, w: r.width / z, h: r.height / z };
      };
      const a = box(me);
      const curve = (other: HTMLElement, kind: "pre" | "next", i: number) => {
        const b = box(other);
        let d: string;
        const ax = a.x + a.w / 2;
        const bx = b.x + b.w / 2;
        if (Math.abs(a.y - b.y) < a.h * 0.5) {
          // cùng một hàng: vòng cung vắt qua phía trên
          const lift = Math.min(70, 26 + Math.abs(ax - bx) * 0.12);
          d = `M${ax} ${a.y + 2} C${ax} ${a.y - lift} ${bx} ${b.y - lift} ${bx} ${b.y + 2}`;
        } else {
          // khác hàng: nối mép dưới của ô ở trên với mép trên của ô ở dưới
          const top = a.y < b.y ? { x: ax, y: a.y + a.h } : { x: bx, y: b.y + b.h };
          const bot = a.y < b.y ? { x: bx, y: b.y } : { x: ax, y: a.y };
          const my = (top.y + bot.y) / 2;
          d = `M${top.x} ${top.y} C${top.x} ${my} ${bot.x} ${my} ${bot.x} ${bot.y}`;
        }
        const p = document.createElementNS(SVGNS, "path");
        p.setAttribute("d", d);
        p.setAttribute("class", "w-" + kind);
        p.style.setProperty("--c", getComputedStyle(other).getPropertyValue("--c"));
        p.style.setProperty("--i", String(i));
        wires.appendChild(p);
        // chấm tròn ở đầu dây bên kia
        const end = document.createElementNS(SVGNS, "circle");
        end.setAttribute("cx", String(bx));
        end.setAttribute("cy", String(Math.abs(a.y - b.y) < a.h * 0.5 ? b.y + 2 : a.y < b.y ? b.y : b.y + b.h));
        end.setAttribute("r", "3.6");
        end.setAttribute("class", "w-dot w-" + kind);
        end.style.setProperty("--c", p.style.getPropertyValue("--c"));
        end.style.setProperty("--i", String(i));
        wires.appendChild(end);
        other.setAttribute("data-rel", kind);
      };
      let i = 0;
      listOf(me, "pre").forEach((p) => tileOf.get(p) && curve(tileOf.get(p)!, "pre", i++));
      listOf(me, "next").forEach((n) => tileOf.get(n) && curve(tileOf.get(n)!, "next", i++));
      me.setAttribute("data-rel", "me");
      map.setAttribute("data-wire", "");
    };
    on(map, "pointerover", (e: PointerEvent) => {
      if (e.pointerType === "touch" || drawer.open) return;
      const t = (e.target as Element | null)?.closest?.<HTMLElement>(".kim-rm-tile");
      if (t) drawWires(t.dataset.rm!);
      else if (hoverId && !(e.target as Element | null)?.closest?.(".kim-rm-tiles")) clearWires();
    });
    on(map, "pointerleave", () => {
      if (!map.contains(document.activeElement) || !document.activeElement?.matches(".kim-rm-tile")) clearWires();
    });
    on(map, "focusin", (e: FocusEvent) => {
      const t = (e.target as Element | null)?.closest?.<HTMLElement>(".kim-rm-tile");
      if (t && t.matches(":focus-visible") && !drawer.open) drawWires(t.dataset.rm!);
    });
    on(map, "focusout", (e: FocusEvent) => {
      if (!map.contains(e.relatedTarget as Node | null)) clearWires();
    });
    on(window, "resize", clearWires, { passive: true });
    // chặng vừa cuộn tới còn đang trượt lên (hiệu ứng hiện dần của KimFx): rê chuột lúc đó thì dây
    // đo theo chỗ cũ của ô. Hiệu ứng xong thì vẽ lại theo chỗ mới. Chỉ nghe animationend, không nghe
    // transitionend: chính việc vẽ dây làm các ô đổi viền/độ mờ (transition), nghe nó là vẽ lại mãi.
    on(map, "animationend", (e: AnimationEvent) => {
      if (hoverId && /^kim(Rise|RmTileIn)$/.test(e.animationName)) drawWires(hoverId, true);
    });

    /* ---- khởi động ---- */
    paint();
    filter();
    sync();
    sec.setAttribute("data-live", "");

    return () => {
      cleanups.forEach((c) => c());
      if (drawer.open) drawer.close();
      clearWires();
    };
  }, []);

  return null;
}
