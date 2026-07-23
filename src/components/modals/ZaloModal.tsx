"use client";

import { Bot } from "lucide-react";
import { useApp } from "@/lib/store";
import { dicts, zaloStatusLabels } from "@/lib/i18n";
import ModalShell, { Choices, Field } from "./ModalShell";

export default function ZaloModal() {
  const lang = useApp((s) => s.lang);
  const modal = useApp((s) => s.modal);
  const form = useApp((s) => s.form);
  const setForm = useApp((s) => s.setForm);
  const saveZalo = useApp((s) => s.saveZalo);
  const t = dicts[lang];

  if (!modal) return null;
  const isEdit = modal.mode === "edit";

  return (
    <ModalShell
      icon={<Bot size={18} strokeWidth={2} color="var(--accent)" />}
      title={isEdit ? t.mEditZalo : t.mAddZalo}
      subtitle={isEdit ? t.mSubZaloEdit : t.mSubZaloAdd}
      cta={isEdit ? t.saveUpdate : t.addLinkCta}
      canSave={Boolean(form.name && form.name.trim())}
      showDelete={isEdit}
      onSave={saveZalo}
    >
      <Field label={t.fName}>
        <input
          className="input"
          value={form.name || ""}
          onChange={(e) => setForm({ name: e.target.value })}
          placeholder={t.fNamePh}
        />
      </Field>
      <Field label={t.fToken}>
        <input
          className="input mono"
          value={form.token || ""}
          onChange={(e) => setForm({ token: e.target.value })}
          placeholder={t.fTokenPh}
        />
      </Field>
      <Field label={t.fChatId}>
        <input
          className="input mono"
          value={form.chatId || ""}
          onChange={(e) => setForm({ chatId: e.target.value })}
          placeholder={t.fChatIdPh}
        />
      </Field>
      <Field label={t.fStatus}>
        <Choices
          options={(["Connected", "Pending", "Not linked"] as const).map((v) => ({
            label: zaloStatusLabels[lang][v],
            on: form.status === v,
            onPick: () => setForm({ status: v }),
          }))}
        />
      </Field>
    </ModalShell>
  );
}
