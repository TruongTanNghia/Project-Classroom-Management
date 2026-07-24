"use client";

import { Pencil, Plus } from "lucide-react";
import { useApp } from "@/lib/store";
import { dicts, subjectLabels } from "@/lib/i18n";
import { subjectTintClass } from "@/lib/subjects";
import type { Course } from "@/lib/types";
import { Page, PageHeader } from "@/components/ui/bits";

export default function CoursesPage() {
  const lang = useApp((s) => s.lang);
  const courses = useApp((s) => s.courses);
  const openModal = useApp((s) => s.openModal);
  const t = dicts[lang];
  const vi = lang !== "en";

  const openAdd = () =>
    openModal({ mode: "add", kind: "course" }, { name: "", teacher: "", schedule: "", subject: "CS" });

  const openEdit = (c: Course) =>
    openModal(
      { mode: "edit", kind: "course", id: c.id },
      { name: c.name, teacher: c.teacher, schedule: c.schedule, subject: c.subject }
    );

  const localizeSchedule = (s: string) =>
    vi
      ? s.replace("Mon", "T2").replace("Tue", "T3").replace("Wed", "T4")
          .replace("Thu", "T5").replace("Fri", "T6").replace("Daily", "Hằng ngày")
      : s;

  return (
    <Page>
      <PageHeader
        title={t.coursesTitle}
        subtitle={vi ? `${courses.length} khóa học` : `${courses.length} courses`}
        actions={
          <button className="btn-primary" onClick={openAdd}>
            <Plus size={14} strokeWidth={2.2} />
            {t.createCourse}
          </button>
        }
      />

      <div data-stagger="true" className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {courses.map((c) => (
          <div
            key={c.id}
            className="card card-hover-lift"
            style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <span
                className={"pill " + subjectTintClass[c.subject]}
                style={{ fontSize: 11.5, fontWeight: 600 }}
              >
                {subjectLabels[lang][c.subject]}
              </span>
              <button
                className="ghost-icon-btn"
                style={{ padding: 4 }}
                title={t.editAction}
                onClick={(e) => {
                  e.stopPropagation();
                  openEdit(c);
                }}
              >
                <Pencil size={15} strokeWidth={2} color="var(--text-3)" />
              </button>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>{c.name}</div>
              <div style={{ color: "var(--text-2)", fontSize: 13, marginTop: 3 }}>
                {c.teacher} · {localizeSchedule(c.schedule)}
              </div>
            </div>
            <div
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                fontSize: 12.5, color: "var(--text-2)",
              }}
            >
              <span>
                {c.students} {t.studentsWord}
              </span>
              <span>
                {t.avgScore} {c.avg}
              </span>
            </div>
            <div>
              <div
                style={{
                  display: "flex", justifyContent: "space-between", fontSize: 12,
                  color: "var(--text-2)", marginBottom: 6,
                }}
              >
                <span>{t.currProgress}</span>
                <span style={{ fontWeight: 500, color: "var(--text)" }}>{c.progress}%</span>
              </div>
              <div className="progress-track" style={{ height: 5 }}>
                <div
                  className="progress-fill"
                  style={{ width: c.progress + "%", background: "var(--accent-strong)" }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
}
