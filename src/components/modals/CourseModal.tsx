"use client";

import { BookOpen } from "lucide-react";
import { useApp } from "@/lib/store";
import { dicts, subjectLabels } from "@/lib/i18n";
import { SUBJECTS } from "@/lib/subjects";
import ModalShell, { Choices, Field } from "./ModalShell";

export default function CourseModal() {
  const lang = useApp((s) => s.lang);
  const modal = useApp((s) => s.modal);
  const form = useApp((s) => s.form);
  const setForm = useApp((s) => s.setForm);
  const saveCourse = useApp((s) => s.saveCourse);
  const t = dicts[lang];

  if (!modal) return null;
  const isEdit = modal.mode === "edit";

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
        <Field label={t.fSchedule}>
          <input
            className="input"
            value={form.schedule || ""}
            onChange={(e) => setForm({ schedule: e.target.value })}
            placeholder={t.fSchedulePh}
          />
        </Field>
      </div>
      <Field label={t.fSubject}>
        <Choices
          wrap
          options={SUBJECTS.map((k) => ({
            label: subjectLabels[lang][k],
            on: form.subject === k,
            onPick: () => setForm({ subject: k }),
          }))}
        />
      </Field>
    </ModalShell>
  );
}
