"use client";

import { Send } from "lucide-react";
import { useApp } from "@/lib/store";
import { dicts } from "@/lib/i18n";
import ModalShell, { Field } from "./ModalShell";

export default function ThreadModal() {
  const lang = useApp((s) => s.lang);
  const modal = useApp((s) => s.modal);
  const form = useApp((s) => s.form);
  const setForm = useApp((s) => s.setForm);
  const saveThread = useApp((s) => s.saveThread);
  const t = dicts[lang];

  if (!modal) return null;
  const isEdit = modal.mode === "edit";

  return (
    <ModalShell
      icon={<Send size={18} strokeWidth={2} color="var(--accent)" />}
      title={isEdit ? t.mEditThread : t.mAddThread}
      subtitle={isEdit ? t.mSubThreadEdit : t.mSubThreadAdd}
      cta={isEdit ? t.saveUpdate : t.sendCta}
      canSave={Boolean(form.name && form.name.trim())}
      showDelete={isEdit}
      onSave={saveThread}
    >
      <Field label={t.fTo}>
        <input
          className="input"
          value={form.name || ""}
          onChange={(e) => setForm({ name: e.target.value })}
          placeholder={t.fToPh}
        />
      </Field>
      <Field label={t.fSubjectField}>
        <input
          className="input"
          value={form.subject || ""}
          onChange={(e) => setForm({ subject: e.target.value })}
          placeholder={t.fSubjectPh}
        />
      </Field>
      <Field label={t.fContent}>
        <input
          className="input"
          value={form.content || ""}
          onChange={(e) => setForm({ content: e.target.value })}
          placeholder={t.fContentPh}
        />
      </Field>
    </ModalShell>
  );
}
