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
  const dayCa = form.dayCa || {};
  const caLabel = (slot: string) => (vi ? "Ca " : "Slot ") + (CA_SLOTS.indexOf(slot) + 1) + " · " + slot;

  const pickCourse = (name: string, subject: string) => setForm({ name, subject });

  const toggleStudent = (id: number) => {
    const cur = ids.slice();
    const ix = cur.indexOf(id);
    if (ix >= 0) cur.splice(ix, 1);
    else cur.push(id);
    setForm({ studentIds: cur });
  };
  const toggleAtt = (id: number) => setForm({ att: { ...att, [id]: !att[id] } });

  // Bật/tắt 1 thứ trong tuần (mode add) — bật thì mặc định Ca 1
  const toggleDay = (di: number) => {
    const next = { ...dayCa };
    if (next[di] !== undefined) delete next[di];
    else next[di] = CA_SLOTS[0];
    setForm({ dayCa: next });
  };
  const setDayCa = (di: number, slot: string) => setForm({ dayCa: { ...dayCa, [di]: slot } });

  const canSave = Boolean(form.name && form.name.trim()) && (isEdit || Object.keys(dayCa).length > 0);

  return (
    <ModalShell
      icon={<Calendar size={18} strokeWidth={2} color="var(--accent)" />}
      title={isEdit ? t.mEditSched : t.mAddSched}
      subtitle={isEdit ? t.mSubSchedEdit : (vi ? "Chọn nhiều buổi trong tuần cho khóa học." : "Add several weekly sessions at once.")}
      cta={isEdit ? t.saveUpdate : t.addSchedCta}
      canSave={canSave}
      showDelete={isEdit}
      onSave={saveSched}
    >
      {/* Học khóa nào */}
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

      {/* Ngày bắt đầu học */}
      <Field label={vi ? "Ngày bắt đầu học (tùy chọn)" : "Start date (optional)"}>
        <input
          type="date"
          className="input"
          value={form.date || ""}
          onChange={(e) => setForm({ date: e.target.value })}
        />
      </Field>

      {isEdit ? (
        /* ---- Sửa 1 buổi: chọn 1 thứ + 1 ca ---- */
        <>
          <Field label={vi ? "Học vào thứ mấy?" : "Which day?"}>
            <Choices
              wrap
              options={dayMeta[lang].map((d, di) => ({
                label: d.short,
                on: form.day === di,
                onPick: () => setForm({ day: di }),
                noFlex: true,
              }))}
            />
          </Field>
          <Field label={vi ? "Học ca nào?" : "Which slot?"}>
            <Choices
              wrap
              options={CA_SLOTS.map((slot) => ({
                label: caLabel(slot),
                on: form.time === slot,
                onPick: () => setForm({ time: slot }),
                noFlex: true,
              }))}
            />
          </Field>
          {ids.length > 0 && (
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
        </>
      ) : (
        /* ---- Thêm mới: chọn nhiều thứ, mỗi thứ 1 ca ---- */
        <Field label={vi ? "Học vào thứ mấy? (chọn nhiều — mỗi thứ 1 ca)" : "Which days? (multi — a slot each)"}>
          <Choices
            wrap
            options={dayMeta[lang].map((d, di) => ({
              label: d.short,
              on: dayCa[di] !== undefined,
              onPick: () => toggleDay(di),
              noFlex: true,
            }))}
          />
          {/* Với mỗi thứ đã chọn: chọn ca */}
          {dayMeta[lang].map((d, di) =>
            dayCa[di] !== undefined ? (
              <div
                key={di}
                style={{
                  display: "flex", alignItems: "center", gap: 10, marginTop: 8,
                  padding: "8px 10px", background: "var(--sidebar)",
                  border: "1px solid var(--subtle)", borderRadius: 8,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600, minWidth: 64 }}>{d.day}</span>
                <select
                  className="input"
                  value={dayCa[di]}
                  onChange={(e) => setDayCa(di, e.target.value)}
                  style={{ flex: 1, cursor: "pointer" }}
                >
                  {CA_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {caLabel(slot)}
                    </option>
                  ))}
                </select>
              </div>
            ) : null
          )}
        </Field>
      )}
    </ModalShell>
  );
}
