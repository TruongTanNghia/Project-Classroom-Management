"use client";

import { Calendar } from "lucide-react";
import { useApp } from "@/lib/store";
import { dayMeta, dicts } from "@/lib/i18n";
import { CA_SLOTS } from "@/lib/derived";
import ModalShell, { Choices, Field } from "./ModalShell";

export default function SchedModal() {
  const lang = useApp((s) => s.lang);
  const modal = useApp((s) => s.modal);
  const form = useApp((s) => s.form);
  const setForm = useApp((s) => s.setForm);
  const saveSched = useApp((s) => s.saveSched);
  const students = useApp((s) => s.students);
  const courses = useApp((s) => s.courses);
  const t = dicts[lang];
  const vi = lang !== "en";

  if (!modal) return null;
  const isEdit = modal.mode === "edit";
  const ids = form.studentIds || [];
  const att = form.att || {};
  const presentCount = ids.filter((id) => att[id]).length;

  const pickCourse = (name: string, subject: string) => setForm({ name, subject });

  const toggleStudent = (id: number) => {
    const cur = ids.slice();
    const ix = cur.indexOf(id);
    if (ix >= 0) cur.splice(ix, 1);
    else cur.push(id);
    setForm({ studentIds: cur });
  };

  const toggleAtt = (id: number) => setForm({ att: { ...att, [id]: !att[id] } });

  return (
    <ModalShell
      icon={<Calendar size={18} strokeWidth={2} color="var(--accent)" />}
      title={isEdit ? t.mEditSched : t.mAddSched}
      subtitle={isEdit ? t.mSubSchedEdit : t.mSubSchedAdd}
      cta={isEdit ? t.saveUpdate : t.addSchedCta}
      canSave={Boolean(form.name && form.name.trim())}
      showDelete={isEdit}
      onSave={saveSched}
    >
      {/* Học khóa này */}
      <Field label={vi ? "Học khóa nào?" : "Which course?"}>
        {courses.length === 0 ? (
          <div style={{ fontSize: 13, color: "var(--text-3)" }}>
            {vi ? "Chưa có khóa học — hãy tạo khóa học trước." : "No courses yet — create one first."}
          </div>
        ) : (
          <Choices
            wrap
            options={courses.map((c) => ({
              label: c.name,
              on: form.name === c.name,
              onPick: () => pickCourse(c.name, c.subject),
              noFlex: true,
            }))}
          />
        )}
      </Field>

      {/* Ai đang học */}
      <Field label={(vi ? "Ai đang học?" : "Who's studying?") + " (" + ids.length + ")"}>
        {students.length === 0 ? (
          <div style={{ fontSize: 13, color: "var(--text-3)" }}>
            {vi ? "Chưa có học viên." : "No students yet."}
          </div>
        ) : (
          <Choices
            wrap
            options={students.map((st) => ({
              label: st.name,
              on: ids.includes(st.id),
              onPick: () => toggleStudent(st.id),
              noFlex: true,
            }))}
          />
        )}
      </Field>

      {/* Ngày trong tuần (7 ngày) */}
      <Field label={vi ? "Học vào thứ mấy?" : "Which day?"}>
        <Choices
          wrap
          options={dayMeta[lang].map((d, di) => ({
            label: d.short,
            on: form.day === di,
            onPick: () => setForm({ day: di, date: "" }),
            noFlex: true,
          }))}
        />
      </Field>

      {/* Ngày cụ thể (tùy chọn) */}
      <Field label={vi ? "Ngày cụ thể (tùy chọn — để trống = lặp hằng tuần)" : "Specific date (optional)"}>
        <input
          type="date"
          className="input"
          value={form.date || ""}
          onChange={(e) => {
            const v = e.target.value;
            const patch: { date: string; day?: number } = { date: v };
            if (v) {
              const dow = new Date(v + "T00:00:00").getDay(); // 0=CN..6=T7
              patch.day = dow === 0 ? 6 : dow - 1; // 0=T2..6=CN
            }
            setForm(patch);
          }}
        />
      </Field>

      {/* Ca học */}
      <Field label={vi ? "Học ca nào?" : "Which slot?"}>
        <Choices
          wrap
          options={CA_SLOTS.map((slot, ci) => ({
            label: (vi ? "Ca " : "Slot ") + (ci + 1) + " · " + slot,
            on: form.time === slot,
            onPick: () => setForm({ time: slot }),
            noFlex: true,
          }))}
        />
      </Field>

      {/* Điểm danh (khi sửa) */}
      {isEdit && ids.length > 0 && (
        <Field label={t.fAttSess + " (" + presentCount + "/" + ids.length + ")"}>
          <Choices
            wrap
            options={ids.map((id) => {
              const st = students.find((x) => x.id === id);
              const on = Boolean(att[id]);
              return {
                label: (on ? "✓ " : "") + (st?.name || "?"),
                on,
                attStyle: true,
                onPick: () => toggleAtt(id),
                noFlex: true,
              };
            })}
          />
        </Field>
      )}
    </ModalShell>
  );
}
