"use client";
/**
 * Khung mẫu khối 02 Dự án dùng useProjectCarousel. Markup và class bám đúng thiết kế
 * (lấy chi tiết từng panel bằng design_get_element selector="#abt-panel-<id>").
 * Minh hoạ .abt-shot của mỗi dự án khác nhau → render bằng prop `shot`.
 */
import type { CSSProperties, ReactNode } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useProjectCarousel } from "./useProjectCarousel";

export type ProjectStatus = "live" | "building" | "demo" | "client" | "rnd";
export type Project = {
  id: string;
  title: string;
  status: ProjectStatus;
  statusLabel: string; // "Đang vận hành" …
  icon: ReactNode; // icon lucide trong .ic
  from: string; // --f
  to: string; // --t
  shot: ReactNode; // nội dung .abt-shot (tag + minh hoạ)
  shotClassName?: string; // vd "has-ill"
  desc: string;
  points: string[];
  tags: string[];
};

export function ProjectShowcase({ projects, header, cta }: { projects: Project[]; header: ReactNode; cta: ReactNode }) {
  const ids = projects.map((p) => p.id);
  const { selected, select, step, stageProps, tabListRef } = useProjectCarousel(ids);
  const total = String(projects.length).padStart(2, "0");
  return (
    <section className="abt-sec" id="abt-projects" aria-labelledby="abt-projects-h">
      <div {...stageProps}>
        <div className="abt-fx" aria-hidden="true"><div className="abt-aurora a1" /><div className="abt-aurora a2" /><div className="abt-dots" /></div>
        {header}
        <div className="abt-proj-layout">
          <div className="abt-proj-side">
            <div className="abt-tabs" role="tablist" aria-label="Danh sách dự án" ref={tabListRef}>
              {projects.map((p, i) => (
                <button key={p.id} type="button" className="abt-tab" role="tab" id={`abt-tab-${p.id}`} aria-controls={`abt-panel-${p.id}`}
                  aria-selected={selected === p.id} data-tab={p.id} onClick={() => select(p.id)}>
                  <span className="ic" style={{ "--f": p.from, "--t": p.to } as CSSProperties}>{p.icon}</span>
                  <span className="t">{p.title}<small className={`st-${p.status}`}>{p.statusLabel}</small></span>
                  <span className="n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="bar" aria-hidden="true"><i /></span>
                </button>
              ))}
            </div>
            {cta}
          </div>
          <div>
            {projects.map((p, i) => (
              <div key={p.id} className={selected === p.id ? "abt-panel" : "abt-panel abt-hide"} role="tabpanel" id={`abt-panel-${p.id}`} aria-labelledby={`abt-tab-${p.id}`} data-panel={p.id}>
                <div className={`abt-shot abt-glow-tile ${p.shotClassName ?? ""}`.trim()} style={{ "--f": p.from, "--t": p.to } as CSSProperties}>{p.shot}</div>
                <div className="abt-panel-body">
                  <div className="abt-panel-meta">
                    <span className={`abt-status ${p.status}`}>{p.statusLabel}</span>
                    <span className="abt-pager">
                      <button type="button" aria-label="Dự án trước" data-step="-1" onClick={() => step(-1)}><ChevronLeft size={16} strokeWidth={2.4} aria-hidden /></button>
                      <span>{String(i + 1).padStart(2, "0")} / {total}</span>
                      <button type="button" aria-label="Dự án tiếp theo" data-step="1" onClick={() => step(1)}><ChevronRight size={16} strokeWidth={2.4} aria-hidden /></button>
                    </span>
                  </div>
                  <h3 className="abt-panel-title">{p.title}</h3>
                  <p className="abt-panel-desc">{p.desc}</p>
                  <ul className="abt-points">{p.points.map((pt) => <li key={pt}><Check size={15} strokeWidth={2.6} aria-hidden /><span>{pt}</span></li>)}</ul>
                  <div className="abt-tags">{p.tags.map((t) => <span key={t} className="abt-tag">{t}</span>)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
