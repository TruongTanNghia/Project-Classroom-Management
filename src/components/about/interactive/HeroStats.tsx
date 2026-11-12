"use client";
/** Ô số liệu của hero (.abt-stats) — đếm lên giống thiết kế. Nhãn truyền từ từ điển i18n của app. */
import { useRef } from "react";
import { useCountUp } from "./useCountUp";

export type Stat = { value: number; suffix: string; label: string };

export function HeroStats({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const e = useCountUp(ref);
  return (
    <div ref={ref} className="abt-stats" data-stats="1">
      {stats.map((s) => (
        <div key={s.label} className="abt-stat">
          <div className="abt-stat-num" data-count={s.value} data-suffix={s.suffix}>
            {`${Math.round(s.value * e)}${s.suffix}`}
          </div>
          <div className="abt-stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
