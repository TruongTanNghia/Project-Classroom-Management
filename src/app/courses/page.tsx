"use client";

import { BookOpen, ExternalLink, FileCode, Pencil, Plus } from "lucide-react";
import { useApp } from "@/lib/store";
import { dicts } from "@/lib/i18n";
import type { Course } from "@/lib/types";
import { Page, PageHeader } from "@/components/ui/bits";

// Giá là số thuần → format "2400000" thành "2.400.000₫"; nếu đã có ký tự thì giữ nguyên
function fmtPrice(p?: string) {
  if (!p) return "";
  const digits = p.replace(/[^0-9]/g, "");
  if (digits && /^\d+$/.test(p.trim())) return Number(digits).toLocaleString("vi-VN") + "₫";
  return p;
}

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
      // html/image KHÔNG đưa vào form → giữ nguyên nếu không tải mới
    );

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
              style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}
              onClick={() => clickable && openHtml(c)}
            >
              {/* Ảnh bìa / placeholder */}
              <div style={{ position: "relative", height: 140, flexShrink: 0 }}>
                {c.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.image} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                ) : (
                  <div
                    style={{
                      width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                      background: "linear-gradient(135deg, var(--accent-tint), var(--accent-tint-2))",
                    }}
                  >
                    <BookOpen size={34} strokeWidth={1.6} color="var(--accent)" />
                  </div>
                )}
                {/* Giá + nút sửa nổi trên ảnh */}
                {c.price && (
                  <span
                    style={{
                      position: "absolute", left: 12, bottom: 12, background: "rgba(255,255,255,0.95)",
                      color: "var(--accent-strong)", fontSize: 13, fontWeight: 700, padding: "4px 10px",
                      borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                  >
                    {fmtPrice(c.price)}
                  </span>
                )}
                <button
                  className="ghost-icon-btn"
                  style={{ position: "absolute", top: 8, right: 8, background: "rgba(255,255,255,0.9)" }}
                  title={t.editAction}
                  onClick={(e) => {
                    e.stopPropagation();
                    openEdit(c);
                  }}
                >
                  <Pencil size={15} strokeWidth={2} color="#1C1917" />
                </button>
              </div>

              {/* Nội dung */}
              <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>{c.name}</div>
                  <div style={{ color: "var(--text-2)", fontSize: 13, marginTop: 3 }}>
                    {c.teacher}
                    {c.totalSessions ? " · " + c.totalSessions + (vi ? " buổi" : " sessions") : ""}
                  </div>
                </div>
                <div
                  style={{
                    marginTop: "auto", paddingTop: 10, borderTop: "1px solid var(--hairline)",
                    display: "flex", alignItems: "center",
                  }}
                >
                  {c.html ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: "var(--accent)" }}>
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
            </div>
          );
        })}
      </div>
    </Page>
  );
}
