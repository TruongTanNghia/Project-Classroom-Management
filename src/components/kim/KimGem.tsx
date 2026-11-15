"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/* Mặt kim cương sau ảnh chân dung.

   Bản thiết kế đặt chân dung trước một mặt đồng hồ đo bằng nhôm tiện. Ở đây mặt
   đồng hồ được "nạm" một viên kim cương giác tròn nhìn từ trên xuống: một mặt bàn
   bát giác, 8 mặt sao, 8 mặt chính, 16 mặt vành — đối xứng bậc 8, khớp với tám
   mảng AI xếp quanh vành.

   Viên đá không có ảnh nào: 33 mặt cắt là 33 đa giác SVG. Mỗi mặt có một pháp tuyến
   (nghiêng ra ngoài theo đúng loại mặt). Mỗi khung hình, độ sáng của từng mặt tính
   từ góc giữa pháp tuyến đó và hướng đèn — mà hướng đèn chính là vị trí con trỏ.
   Rê chuột quanh viên đá thì các mặt lần lượt loé lên, như xoay kim cương dưới đèn.
   Không có chuột (điện thoại) thì đèn tự quay chậm.

   Màu chỉ dùng trắng, bạc và ánh vàng champagne: mệnh Kim kỵ đỏ, hồng, tím, cam
   (Hoả khắc Kim) nên "lửa" của viên đá ở đây không tán sắc cầu vồng. */

const D2R = Math.PI / 180;
/** điểm trên vòng bán kính r, góc tính từ đỉnh, theo chiều kim đồng hồ */
const P = (r: number, deg: number): [number, number] => [
  +(r * Math.sin(deg * D2R)).toFixed(2),
  +(-r * Math.cos(deg * D2R)).toFixed(2),
];

const RT = 50; // mặt bàn
const RS = 72; // đỉnh mặt sao
const RG = 100; // vành

interface Facet {
  pts: string;
  /** pháp tuyến (x phải, y xuống, z về phía người nhìn) */
  n: [number, number, number];
  kind: 0 | 1 | 2 | 3;
  verts: [number, number][];
}

function facet(verts: [number, number][], azDeg: number, tiltDeg: number, kind: Facet["kind"]): Facet {
  const st = Math.sin(tiltDeg * D2R);
  return {
    pts: verts.map((v) => v.join(",")).join(" "),
    n: [st * Math.sin(azDeg * D2R), -st * Math.cos(azDeg * D2R), Math.cos(tiltDeg * D2R)],
    kind,
    verts,
  };
}

const T = Array.from({ length: 8 }, (_, k) => P(RT, 22.5 + 45 * k));
const S = Array.from({ length: 8 }, (_, k) => P(RS, 45 + 45 * k));
const G = Array.from({ length: 8 }, (_, k) => P(RG, 22.5 + 45 * k));
const M = Array.from({ length: 8 }, (_, k) => P(RG, 45 + 45 * k));

const FACETS: Facet[] = [facet(T, 0, 0, 0)];
for (let k = 0; k < 8; k++) {
  const k1 = (k + 1) % 8;
  const kp = (k + 7) % 8;
  FACETS.push(facet([T[k], S[k], T[k1]], 45 + 45 * k, 17, 1)); // mặt sao
  FACETS.push(facet([T[k], S[kp], G[k], S[k]], 22.5 + 45 * k, 31, 2)); // mặt chính
  FACETS.push(facet([S[k], G[k], M[k]], 33.75 + 45 * k, 43, 3)); // mặt vành
  FACETS.push(facet([S[k], M[k], G[k1]], 56.25 + 45 * k, 43, 3));
}

/** các đỉnh có ngôi sao lấp lánh: đỉnh mặt sao, và xen kẽ đỉnh vành, đỉnh mặt bàn */
const STARS: { at: [number, number]; size: number; facets: number[] }[] = [
  ...S.map((at) => ({ at, size: 7.5 })),
  ...G.filter((_, k) => k % 2 === 0).map((at) => ({ at, size: 6 })),
  ...T.filter((_, k) => k % 2 === 1).map((at) => ({ at, size: 5 })),
].map((s) => ({
  ...s,
  facets: FACETS.map((f, i) => (f.verts.some((v) => v[0] === s.at[0] && v[1] === s.at[1]) ? i : -1)).filter((i) => i > 0),
}));

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** độ sáng nền (0..1) và hai lớp loé của một mặt cắt dưới hướng đèn (phi, s) */
function shade(f: Facet, phi: number, s: number) {
  const c = Math.sqrt(1 - s * s);
  const lx = Math.cos(phi) * s;
  const ly = Math.sin(phi) * s;
  const d = f.n[0] * lx + f.n[1] * ly + f.n[2] * c;
  // phản chiếu môi trường: dải sáng tối xoay theo hướng đèn, cho viên đá có "đời sống"
  const az = Math.atan2(f.n[1], f.n[0]);
  const env = 0.5 + 0.5 * Math.cos(3 * (az - phi) + f.kind * 1.7);
  const raw = f.kind === 0 ? 0.8 + 0.2 * c : 0.5 * smooth(0.45, 1, d) + 0.5 * env;
  // kim cương thật phần lớn là mặt sáng, xen vài mặt tối sắc nét: nâng vùng giữa lên,
  // chỉ để những mặt quay hẳn đi mới tối
  const tone = Math.pow(raw, 0.55);
  // mặt nào quay đúng về phía đèn thì loé trắng
  const flash = smooth(0.955, 0.995, d);
  // "lửa": ánh vàng champagne ở các mặt đối diện
  const s2 = 0.6;
  const d2 = -f.n[0] * Math.cos(phi) * s2 - f.n[1] * Math.sin(phi) * s2 + f.n[2] * Math.sqrt(1 - s2 * s2);
  const fire = smooth(0.962, 0.997, d2) * 0.55;
  return { tone, flash, fire };
}

const fillOf = (tone: number) => `color-mix(in srgb, var(--gem-hi) ${Math.round(tone * 100)}%, var(--gem-lo))`;

// hướng đèn lúc đầu: từ trên, bên trái — để trang dựng sẵn trên máy chủ đã có khối sáng tối
const PHI0 = Math.atan2(-0.72, -0.62);
const S0 = 0.5;
const STAR_PATH = "M0-1C.07-.2.2-.07 1 0 .2.07.07.2 0 1-.07.2-.2.07-1 0-.2-.07-.07-.2 0-1Z";

/**
 * variant "hero": viên đá sau chân dung, kèm tia sáng chạy trên vành vàng.
 * variant "contact": viên đá lớn ló ra ở góc khối liên hệ nền thép.
 */
export default function KimGem({ variant = "hero" }: { variant?: "hero" | "contact" }) {
  const ref = useRef<SVGSVGElement>(null);
  // hai viên đá cùng trang: id của gradient/clipPath phải khác nhau
  const id = (name: string) => `kim-gem-${name}-${variant}`;

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const base = Array.from(svg.querySelectorAll<SVGPolygonElement>("[data-f]"));
    const flash = Array.from(svg.querySelectorAll<SVGPolygonElement>("[data-w]"));
    const fire = Array.from(svg.querySelectorAll<SVGPolygonElement>("[data-g]"));
    const stars = Array.from(svg.querySelectorAll<SVGGElement>("[data-star]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let phi = PHI0;
    let s = S0;
    let tPhi = PHI0;
    let tS = S0;
    let lastMove = -1e9;
    let visible = true;
    let raf = 0;
    let last = performance.now();
    // mỗi ngôi sao tự nháy ngẫu nhiên, kể cả khi không ai rê chuột
    const twinkle = stars.map(() => ({ at: 800 + Math.random() * 5000, life: 0 }));

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = svg.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      tPhi = Math.atan2(dy, dx);
      tS = Math.min(0.8, 0.16 + Math.hypot(dx, dy) / (r.width * 1.5));
      lastMove = performance.now();
    };

    // Chỉ ghi vào DOM khi giá trị thật sự đổi, và chỉ tính 30 lần mỗi giây: viên đá
    // quay chậm nên mắt không phân biệt được, mà máy yếu đỡ phải vẽ lại liên tục.
    const lastTone = new Int16Array(FACETS.length).fill(-1);
    const lastFlash = new Float32Array(FACETS.length).fill(-1);
    const lastFire = new Float32Array(FACETS.length).fill(-1);
    const lastStar = new Float32Array(stars.length).fill(-1);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) {
        last = now;
        return;
      }
      if (now - last < 32) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (now - lastMove > 2600) {
        // không ai rê chuột: đèn tự quay chậm quanh viên đá
        tPhi += dt * 0.42;
        tS = 0.5 + 0.14 * Math.sin(now / 1900);
      }
      let dPhi = tPhi - phi;
      while (dPhi > Math.PI) dPhi -= 2 * Math.PI;
      while (dPhi < -Math.PI) dPhi += 2 * Math.PI;
      const k = 1 - Math.exp(-dt * 7);
      phi += dPhi * k;
      s += (tS - s) * k;

      const fl: number[] = [];
      for (let i = 0; i < FACETS.length; i++) {
        const sh = shade(FACETS[i], phi, s);
        const tn = Math.round(sh.tone * 100);
        if (tn !== lastTone[i]) {
          lastTone[i] = tn;
          base[i].style.fill = fillOf(sh.tone);
        }
        if (Math.abs(sh.flash - lastFlash[i]) > 0.02) {
          lastFlash[i] = sh.flash;
          flash[i].style.opacity = sh.flash.toFixed(2);
        }
        if (Math.abs(sh.fire - lastFire[i]) > 0.02) {
          lastFire[i] = sh.fire;
          fire[i].style.opacity = sh.fire.toFixed(2);
        }
        fl.push(Math.max(sh.flash, sh.fire * 1.2));
      }
      for (let j = 0; j < stars.length; j++) {
        const tw = twinkle[j];
        tw.at -= dt * 1000;
        if (tw.at <= 0) {
          tw.life = 1;
          tw.at = 1800 + Math.random() * 6500;
        }
        tw.life = Math.max(0, tw.life - dt * 1.6);
        const pulse = Math.sin(Math.PI * tw.life) ** 2;
        let lit = 0;
        for (const fi of STARS[j].facets) lit = Math.max(lit, fl[fi]);
        const v = Math.min(1, lit * 1.1 + pulse);
        if (Math.abs(v - lastStar[j]) < 0.015) continue;
        lastStar[j] = v;
        stars[j].style.opacity = v.toFixed(2);
        stars[j].style.transform = `scale(${(0.35 + 0.65 * v).toFixed(2)}) rotate(${(v * 28).toFixed(1)}deg)`;
      }
    };

    if (reduce) return; // người dùng tắt chuyển động: giữ nguyên khối sáng tối đã dựng sẵn
    const io = new IntersectionObserver((en) => (visible = en[0].isIntersecting), { threshold: 0 });
    io.observe(svg);
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <>
      {/* tia sáng chạy dọc vành vàng của mặt đồng hồ (cùng toạ độ với cung "rail" của bản thiết kế) */}
      {variant === "hero" && (
        <svg className="kim-gauge-glint" viewBox="0 0 1000 1120" aria-hidden="true">
          <path className="tail" pathLength={100} d="M203 745 A420 420 0 1 1 797 745" />
          <path className="head" pathLength={100} d="M203 745 A420 420 0 1 1 797 745" />
        </svg>
      )}
      <div className={"kim-gem kim-gem-" + variant} aria-hidden="true">
      <svg ref={ref} viewBox="-108 -108 216 216">
        <defs>
          <radialGradient id={id("depth")} cx="50%" cy="46%" r="52%">
            <stop offset="0.55" stopColor="var(--gem-shade)" stopOpacity="0" />
            <stop offset="1" stopColor="var(--gem-shade)" style={{ stopOpacity: "var(--gem-depth)" }} />
          </radialGradient>
          <radialGradient id={id("prong")} cx="35%" cy="30%" r="75%">
            <stop offset="0" stopColor="#FFF3C9" />
            <stop offset="0.55" stopColor="#D9AC45" />
            <stop offset="1" stopColor="#8E6A22" />
          </radialGradient>
          <clipPath id={id("clip")}>
            <circle r={RG} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${id("clip")})`}>
          {FACETS.map((f, i) => (
            <polygon
              key={"f" + i}
              data-f=""
              className={"gf k" + f.kind}
              points={f.pts}
              style={{ fill: fillOf(shade(f, PHI0, S0).tone), "--i": i } as CSSProperties}
            />
          ))}
          {/* làm tròn 3 số lẻ để chuỗi style trên máy chủ và trên trình duyệt trùng khít */}
          {FACETS.map((f, i) => (
            <polygon key={"g" + i} data-g="" className="gg" points={f.pts} style={{ opacity: +shade(f, PHI0, S0).fire.toFixed(3) }} />
          ))}
          {FACETS.map((f, i) => (
            <polygon key={"w" + i} data-w="" className="gw" points={f.pts} style={{ opacity: +shade(f, PHI0, S0).flash.toFixed(3) }} />
          ))}
          <circle r={RG} fill={`url(#${id("depth")})`} />
        </g>
        {/* vành đai và chấu giữ đá bằng vàng */}
        <circle className="girdle" r={RG} />
        <circle className="bezel" r={RG + 3.4} />
        {G.map((g, k) => (
          <circle key={"p" + k} className="prong" cx={g[0] * 1.012} cy={g[1] * 1.012} r={k % 2 === 0 ? 3.3 : 2.3} fill={`url(#${id("prong")})`} />
        ))}
        {STARS.map((st, j) => (
          <g key={"s" + j} transform={`translate(${st.at[0]} ${st.at[1]}) scale(${st.size})`}>
            <g data-star="" className="gs" style={{ opacity: 0 }}>
              <path d={STAR_PATH} />
            </g>
          </g>
        ))}
      </svg>
      </div>
    </>
  );
}
