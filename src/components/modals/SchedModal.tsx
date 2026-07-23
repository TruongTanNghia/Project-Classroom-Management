"use client";

import { Calendar } from "lucide-react";
import { useApp } from "@/lib/store";
import { dayMeta, dicts, subjectLabels } from "@/lib/i18n";
import { CA_SLOTS } from "@/lib/derived";
import { SUBJECTS } from "@/lib/subjects";
import ModalShell, { Choices, Field } from "./ModalShell";

export default function SchedModal() {
  const lang = useApp((s) => s.lang);
  const modal = useApp((s) => s.modal);
  const form = useApp((s) => s.form);
  const setForm = useApp((s) => s.setForm);
  const saveSched = useApp((s) => s.saveSched);
  const students = useApp((s) => s.students);
  const t = dicts[lang];
  const vi = lang !== "en";

  if (!modal) return null;
  const isEdit = modal.mode === "edit";
  const ids = form.studentIds || [];
  const att = form.att || {};
  const presentCount = ids.filter((id) => att[id]).length;

  const toggleStudent = (id: number) => {
    const cur = ids.slice();
    const ix = cur.indexOf(id);
    if (ix >= 0) cur.splice(ix, 1);
    else cur.push(id);
    setForm({ studentIds: cur });
  };

  const toggleAtt = (id: number) => {
    setForm({ att: { ...att, [id]: !att[id] } });
  };

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
      <Field label={t.fClass}>
        <input
          className="input"
          value={form.name || ""}
          onChange={(e) => setForm({ name: e.target.value })}
          placeholder={t.fClassPh}
        />
      </Field>
      <Field label={t.fDay}>
        <Choices
          options={dayMeta[lang].map((d, di) => ({
            label: d.day,
            on: form.day === di,
            onPick: () => setForm({ day: di, date: "" }), // chọn thứ = lặp hằng tuần, bỏ ngày cụ thể
          }))}
        />
      </Field>
      <Field label={vi ? "Ngày cụ thể (tùy chọn — để trống = lặp hằng tuần)" : "Specific date (optional — empty = weekly)"}>
        <input
          type="date"
          className="input"
          value={form.date || ""}
          onChange={(e) => {
            const v = e.target.value;
            // Nếu chọn ngày → tự set thứ trong tuần cho khớp lưới hiển thị
            const patch: { date: string; day?: number } = { date: v };
            if (v) {
              const dow = new Date(v + "T00:00:00").getDay(); // 0=CN..6=T7
              const idx = dow === 0 ? 0 : dow - 1; // map về 0=T2..4=T6 (CN/T7 gộp tạm)
              patch.day = Math.min(4, Math.max(0, idx));
            }
            setForm(patch);
          }}
        />
      </Field>
      <Field label={t.fTime}>
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
      <Field label={t.fRoom}>
        <input
          className="input"
          value={form.room || ""}
          onChange={(e) => setForm({ room: e.target.value })}
          placeholder={t.fRoomPh}
        />
      </Field>
      <Field label={t.fStudents + " (" + ids.length + ")"}>
        <Choices
          wrap
          options={students.map((st) => ({
            label: st.name,
            on: ids.includes(st.id),
            onPick: () => toggleStudent(st.id),
            noFlex: true,
          }))}
        />
      </Field>
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
