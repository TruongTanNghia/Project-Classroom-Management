import type { CSSProperties } from "react";

import { tx, type KimLang, type L } from "./i18n-kim";

/* Dòng thời gian của khối "Chặng đường đã qua".

   Bản thiết kế ghi 2017 → 2020 → 2022 → 2024, là số bịa của bản mẫu. Mốc thật anh Nghĩa
   đưa ngày 15/11/2026: bắt đầu 2022, tốt nghiệp 2023, nhập ngũ 2024 (trong quân ngũ vẫn
   chịu khó học tập), xuất ngũ 2026 rồi gây dựng mọi thứ. Anh dặn "làm cho wow lên".

   Ý tưởng: anh mệnh Kim và muốn hình ảnh của mình là thứ quý đã qua tôi luyện, nên dòng
   thời gian kể đúng chuyện đó — một viên đá thô thành kim cương. Mỗi mốc là một giai đoạn
   của viên đá (hình vẽ to dần, nhiều mặt cắt dần), và đường nối đổi chất liệu theo chặng:
   bạc, rồi thép dày ở hai năm quân ngũ, rồi vàng. Chữ chỉ nói điều anh đã kể; phần ví von
   nằm ở hình và ở năm cái nhãn nhỏ.

   Giữ nguyên class của thiết kế (.kim-years, .kim-year, .kim-year-n) để chữ số năm và kiểu
   chữ không đổi; phần thêm ở kim-journey.css. */

type Stage = 1 | 2 | 3 | 4 | 5;
type Milestone = { year: L; stage: Stage; label: L; lead: L; text: L; now?: boolean };

const MILESTONES: readonly Milestone[] = [
  {
    year: "2022",
    stage: 1,
    label: ["Đá thô", "Rough stone"],
    lead: ["Dòng code đầu tiên.", "The first line of code."],
    text: ["Bắt đầu hành trình lập trình và nghiên cứu AI.", "The start of the journey into programming and AI research."],
  },
  {
    year: "2023",
    stage: 2,
    label: ["Thành hình", "Taking shape"],
    lead: ["Tốt nghiệp.", "Graduated."],
    text: ["Nền tảng đầu tiên đã có, đường dài mới bắt đầu.", "The first foundation in place, the long road only beginning."],
  },
  {
    year: "2024",
    stage: 3,
    label: ["Tôi luyện", "Under pressure"],
    lead: ["Nhập ngũ.", "Enlisted."],
    text: [
      "Trong quân ngũ vẫn chịu khó học tập, không để con đường AI đứt quãng.",
      "Kept studying hard throughout military service, never letting the AI path break off.",
    ],
  },
  {
    year: "2026",
    stage: 4,
    label: ["Mài giũa", "Cut and polished"],
    lead: ["Xuất ngũ.", "Discharged."],
    text: ["Trở về và gây dựng mọi thứ, từng viên gạch một.", "Came home and built everything, one brick at a time."],
  },
  {
    year: ["Hôm nay", "Today"],
    stage: 5,
    label: ["Toả sáng", "Brilliant"],
    lead: ["Làm thật, dạy thật.", "Real work, real teaching."],
    text: ["Xây AI agent và automation cho doanh nghiệp và lớp học.", "Building AI agents and automation for businesses and classrooms."],
    now: true,
  },
];

/* ---------- hình viên đá ở năm giai đoạn ---------- */
/* Nhìn từ trên xuống một viên giác tròn, cùng hình học với viên lớn ở đầu trang (KimGem):
   mặt bàn 8 cạnh, 8 mặt sao, 8 mặt diều, 16 mặt vành trên. Giai đoạn đầu chưa có mặt cắt
   nào; mỗi giai đoạn sau thêm một lớp, tới giai đoạn 4 thì đủ 33 mặt. */
const C = 50;
const RT = 21; // mặt bàn
const RS = 32; // đỉnh mặt sao
const RG = 46; // vành
const pt = (r: number, deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)];
};
const T = (k: number) => pt(RT, 45 * k);
const S = (k: number) => pt(RS, 45 * k + 22.5);
const G = (k: number) => pt(RG, 45 * k);
const H = (k: number) => pt(RG, 45 * k + 22.5);
const poly = (ps: [number, number][]) => ps.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

/** Đèn rọi từ góc trên trái. Trả về 0..1: mặt quay về phía đèn thì sáng. */
const LIGHT = (-135 * Math.PI) / 180;
function tone(ps: [number, number][], base: number, depth: number) {
  const cx = ps.reduce((s, p) => s + p[0], 0) / ps.length - C;
  const cy = ps.reduce((s, p) => s + p[1], 0) / ps.length - C;
  const facing = Math.cos(Math.atan2(cy, cx) - LIGHT); // -1..1
  return Math.max(0, Math.min(1, base + depth * facing));
}
type Facet = { points: string; tone: number; gold?: boolean };

function facets(stage: Stage): Facet[] {
  const K = [0, 1, 2, 3, 4, 5, 6, 7];
  const table: [number, number][] = K.map(T);
  const out: Facet[] = [];
  if (stage === 2) {
    // mới mài phẳng mặt trên: một vành thô quanh mặt bàn
    K.forEach((k) => {
      const q = [T(k), T(k + 1), G(k + 1), G(k)];
      out.push({ points: poly(q), tone: tone(q, 0.5, 0.2) });
    });
  } else if (stage === 3) {
    // tám mặt chính đã rõ, tương phản mạnh: viên đá đang chịu lực
    K.forEach((k) => {
      const q = [T(k), T(k + 1), G(k + 1), H(k), G(k)];
      out.push({ points: poly(q), tone: tone(q, 0.42, 0.42) });
    });
  } else {
    K.forEach((k) => {
      const star = [T(k), T(k + 1), S(k)];
      const kite = [T(k), S(k), G(k), S(k - 1)];
      const u1 = [S(k), G(k), H(k)];
      const u2 = [S(k), H(k), G(k + 1)];
      // giai đoạn 5: các mặt sao bắt ánh vàng, xen kẽ, như viên đá đã lên nước
      out.push({ points: poly(star), tone: tone(star, 0.72, 0.28), gold: stage === 5 && k % 2 === 0 });
      out.push({ points: poly(kite), tone: tone(kite, 0.55, 0.42) });
      out.push({ points: poly(u1), tone: tone(u1, 0.5, 0.46) });
      out.push({ points: poly(u2), tone: tone(u2, 0.44, 0.46) });
    });
  }
  out.push({ points: poly(table), tone: stage >= 4 ? 0.96 : stage === 3 ? 0.62 : 0.74 });
  return out;
}

/** viên đá thô: một khối méo, chưa có mặt cắt, chỉ vài vết nứt */
const ROUGH = "50,7 76,13 93,39 86,70 60,93 28,87 8,60 15,27";
const CRACKS = ["M50 7 L46 38 L15 27", "M46 38 L62 60 L86 70", "M62 60 L60 93"];

function Gem({ stage }: { stage: Stage }) {
  const fill = (t: number) => `color-mix(in srgb, var(--jr-hi) ${Math.round(t * 100)}%, var(--jr-lo))`;
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      {stage === 1 ? (
        <>
          <polygon className="f" points={ROUGH} style={{ fill: fill(0.5) }} />
          <polygon className="f" points="50,7 76,13 93,39 62,60 46,38" style={{ fill: fill(0.66) }} />
          <polygon className="f" points="46,38 62,60 60,93 28,87 8,60 15,27" style={{ fill: fill(0.36) }} />
          {CRACKS.map((d) => (
            <path className="l" d={d} key={d} />
          ))}
        </>
      ) : (
        facets(stage).map((f, i) => (
          <polygon className={f.gold ? "f g" : "f"} points={f.points} style={f.gold ? undefined : { fill: fill(f.tone) }} key={i} />
        ))
      )}
    </svg>
  );
}

export default function KimYears({ lang }: { lang: KimLang }) {
  const x = (l: L) => tx(lang, l);
  return (
    <ol className="kim-years kim-jr">
      {MILESTONES.map((m, i) => (
        <li className={"kim-year" + (m.now ? " is-now" : "")} data-stage={m.stage} style={{ "--jr-i": i } as CSSProperties} key={i}>
          <span className="kim-year-n">{x(m.year)}</span>
          {/* viên đá và nhãn là con trực tiếp của <li>: lưới của <li> đặt chúng cạnh nhau trên
              trục ở máy tính, và tách ra hai cột khi dòng thời gian dựng dọc */}
          <span className="kim-jr-gem">
            <Gem stage={m.stage} />
          </span>
          <span className="kim-jr-stage">{x(m.label)}</span>
          <p>
            <b>{x(m.lead)}</b> {x(m.text)}
          </p>
        </li>
      ))}
    </ol>
  );
}
