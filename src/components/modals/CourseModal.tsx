"use client";

import { useRef, useState } from "react";
import { BookOpen, Check, FileCode, ImagePlus, X } from "lucide-react";
import { useApp } from "@/lib/store";
import { dicts } from "@/lib/i18n";
import ModalShell, { Field } from "./ModalShell";

// Nén ảnh về tối đa 900px, JPEG chất lượng 0.82 → data URL nhẹ để lưu DB
function resizeImage(file: File, maxW = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("no ctx"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = reject;
      img.src = String(reader.result || "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

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
  const imgRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  if (!modal) return null;
  const isEdit = modal.mode === "edit";
  const existing = isEdit ? courses.find((c) => c.id === modal.id) : undefined;
  // Đã có tài liệu HTML? (từ file vừa tải hoặc từ dữ liệu cũ)
  const hasHtml = form.html !== undefined ? Boolean(form.html) : Boolean(existing?.html);
  // Ảnh bìa đang hiển thị (từ ảnh vừa chọn hoặc dữ liệu cũ)
  const coverImg = form.image !== undefined ? form.image : existing?.image || "";

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

  const onPickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const dataUrl = await resizeImage(f);
      setForm({ image: dataUrl });
    } catch {
      /* bỏ qua nếu ảnh lỗi */
    }
  };
  const clearImage = () => {
    setForm({ image: "" });
    if (imgRef.current) imgRef.current.value = "";
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
      {/* Ảnh bìa */}
      <Field label={vi ? "Ảnh bìa khóa học" : "Cover image"}>
        <input ref={imgRef} type="file" accept="image/*" onChange={onPickImage} style={{ display: "none" }} />
        {coverImg ? (
          <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: "1px solid var(--border)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverImg} alt="cover" style={{ width: "100%", height: 150, objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 6 }}>
              <button type="button" onClick={() => imgRef.current?.click()} className="btn" style={{ padding: "5px 10px", fontSize: 12 }}>
                {vi ? "Đổi ảnh" : "Change"}
              </button>
              <button
                type="button"
                onClick={clearImage}
                className="ghost-icon-btn"
                title={vi ? "Xoá" : "Remove"}
                style={{ background: "rgba(255,255,255,0.9)" }}
              >
                <X size={15} strokeWidth={2} color="#1C1917" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => imgRef.current?.click()}
            className="btn"
            style={{
              justifyContent: "center", flexDirection: "column", gap: 6, height: 110,
              width: "100%", borderStyle: "dashed",
            }}
          >
            <ImagePlus size={22} strokeWidth={1.8} color="var(--accent)" />
            <span style={{ fontSize: 12.5 }}>{vi ? "Chọn ảnh bìa" : "Choose a cover image"}</span>
          </button>
        )}
      </Field>

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
      <Field label={vi ? "Số buổi của khóa học" : "Total sessions"}>
        <input
          className="input"
          value={form.totalSessions || ""}
          onChange={(e) => setForm({ totalSessions: e.target.value.replace(/[^0-9]/g, "") })}
          placeholder={vi ? "VD: 24 buổi" : "e.g. 24"}
          inputMode="numeric"
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
