"use client";

import { useRef, useState } from "react";
import { BookOpen, Check, FileCode, X } from "lucide-react";
import { useApp } from "@/lib/store";
import { dicts } from "@/lib/i18n";
import ModalShell, { Field } from "./ModalShell";

export default function CourseModal() {
  const lang = useApp((s) => s.lang);
  const modal = useApp((s) => s.modal);
  const form = useApp((s) => s.form);
  const setForm = useApp((s) => s.setForm);
  const saveCourse = useApp((s) => s.saveCourse);
  const courses = useApp((s) => s.courses);
  const t = dicts[lang];
  const vi = lang !== "en";
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  if (!modal) return null;
  const isEdit = modal.mode === "edit";
  const existing = isEdit ? courses.find((c) => c.id === modal.id) : undefined;
  // Đã có tài liệu HTML? (từ file vừa tải hoặc từ dữ liệu cũ)
  const hasHtml = form.html !== undefined ? Boolean(form.html) : Boolean(existing?.html);

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    const reader = new FileReader();
    reader.onload = () => setForm({ html: String(reader.result || "") });
    reader.readAsText(f);
  };

  const clearHtml = () => {
    setFileName("");
    setForm({ html: "" });
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <ModalShell
      icon={<BookOpen size={18} strokeWidth={2} color="var(--accent)" />}
      title={isEdit ? t.mEditCourse : t.mAddCourse}
      subtitle={isEdit ? t.mSubCourseEdit : t.mSubCourseAdd}
      cta={isEdit ? t.saveUpdate : t.createCourseCta}
      canSave={Boolean(form.name && form.name.trim())}
      showDelete={isEdit}
      onSave={saveCourse}
    >
      <Field label={t.fCourseName}>
        <input
          className="input"
          value={form.name || ""}
          onChange={(e) => setForm({ name: e.target.value })}
          placeholder={t.fCourseNamePh}
        />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label={t.fTeacher}>
          <input
            className="input"
            value={form.teacher || ""}
            onChange={(e) => setForm({ teacher: e.target.value })}
            placeholder={t.fTeacherPh}
          />
        </Field>
        <Field label={vi ? "Giá khóa học" : "Course price"}>
          <input
            className="input"
            value={form.price || ""}
            onChange={(e) => setForm({ price: e.target.value })}
            placeholder={vi ? "VD: 1.500.000₫" : "e.g. 1,500,000₫"}
          />
        </Field>
      </div>
      <Field label={t.fSchedule}>
        <input
          className="input"
          value={form.schedule || ""}
          onChange={(e) => setForm({ schedule: e.target.value })}
          placeholder={t.fSchedulePh}
        />
      </Field>

      <Field label={vi ? "Tài liệu khóa học (file HTML)" : "Course document (HTML file)"}>
        <input
          ref={fileRef}
          type="file"
          accept=".html,.htm,text/html"
          onChange={onPickFile}
          style={{ display: "none" }}
        />
        {hasHtml ? (
          <div
            style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
              background: "var(--success-tint)", border: "1px solid var(--success-border)",
              borderRadius: 8,
            }}
          >
            <Check size={15} strokeWidth={2.4} color="var(--success)" />
            <span style={{ flex: 1, fontSize: 13, color: "var(--body-c)" }}>
              {fileName || (vi ? "Đã có tài liệu HTML" : "HTML document attached")}
            </span>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="btn"
              style={{ padding: "5px 10px", fontSize: 12 }}
            >
              {vi ? "Đổi file" : "Replace"}
            </button>
            <button type="button" onClick={clearHtml} className="ghost-icon-btn" title={vi ? "Xoá" : "Remove"}>
              <X size={15} strokeWidth={2} color="var(--text-2)" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="btn"
            style={{ justifyContent: "flex-start", padding: "10px 12px", width: "100%" }}
          >
            <FileCode size={15} strokeWidth={2} color="var(--accent)" />
            {vi ? "Chọn file HTML để tải lên" : "Choose an HTML file to upload"}
          </button>
        )}
        <span style={{ fontSize: 11.5, color: "var(--text-3)" }}>
          {vi
            ? "Người xem bấm vào khóa học sẽ mở file HTML này trong tab mới."
            : "Clicking the course opens this HTML file in a new tab."}
        </span>
      </Field>
    </ModalShell>
  );
}
