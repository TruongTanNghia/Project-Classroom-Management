"use client";

import { ExternalLink, FileCode, Pencil, Plus } from "lucide-react";
import { useApp } from "@/lib/store";
import { dicts } from "@/lib/i18n";
import type { Course } from "@/lib/types";
import { Page, PageHeader } from "@/components/ui/bits";

export default function CoursesPage() {
  const lang = useApp((s) => s.lang);
  const courses = useApp((s) => s.courses);
  const openModal = useApp((s) => s.openModal);
  const t = dicts[lang];
  const vi = lang !== "en";

  const openAdd = () =>
    openModal(
      { mode: "add", kind: "course" },
      { name: "", teacher: "", price: "", totalSessions: "" }
    );

  const openEdit = (c: Course) =>
    openModal(
      { mode: "edit", kind: "course", id: c.id },
      {
        name: c.name, teacher: c.teacher, price: c.price || "",
        totalSessions: c.totalSessions ? String(c.totalSessions) : "",
      }
      // html KHÔNG đưa vào form → giữ nguyên tài liệu cũ nếu không tải file mới
    );

  // Mở tài liệu HTML của khóa học trong tab mới (blob URL)
  const openHtml = (c: Course) => {
    if (!c.html) return;
    const blob = new Blob([c.html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

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

      {courses.length === 0 && (
        <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--text-3)", fontSize: 14 }}>
          {vi ? "Chưa có khóa học. Bấm “Tạo khóa học” để thêm." : "No courses yet. Click “Create course”."}
        </div>
      )}

      <div data-stagger="true" className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {courses.map((c) => {
          const clickable = Boolean(c.html);
          return (
            <div
              key={c.id}
              className={"card" + (clickable ? " card-hover-lift" : "")}
              style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}
              onClick={() => clickable && openHtml(c)}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                {c.price ? (
                  <span className="pill pill-accent" style={{ fontSize: 12.5, fontWeight: 600 }}>
                    {c.price}
                  </span>
                ) : (
                  <span style={{ fontSize: 12.5, color: "var(--text-3)" }}>
                    {vi ? "Chưa có giá" : "No price"}
                  </span>
                )}
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
                  {c.teacher}
                  {c.totalSessions ? " · " + c.totalSessions + (vi ? " buổi" : " sessions") : ""}
                </div>
              </div>

              <div
                style={{
                  marginTop: "auto", paddingTop: 12, borderTop: "1px solid var(--hairline)",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}
              >
                {c.html ? (
                  <span
                    style={{
                      display: "flex", alignItems: "center", gap: 6, fontSize: 13,
                      fontWeight: 500, color: "var(--accent)",
                    }}
                  >
                    <ExternalLink size={14} strokeWidth={2} />
                    {vi ? "Xem tài liệu" : "View document"}
                  </span>
                ) : (
                  <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--text-3)" }}>
                    <FileCode size={14} strokeWidth={2} />
                    {vi ? "Chưa có tài liệu" : "No document"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Page>
  );
}
