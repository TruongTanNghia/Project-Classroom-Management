"use client";

import { Check, Plus, UserRoundPlus } from "lucide-react";
import { useApp } from "@/lib/store";
import { dicts } from "@/lib/i18n";
import ModalShell, { Choices, Field } from "./ModalShell";

export default function StudentModal() {
  const lang = useApp((s) => s.lang);
  const modal = useApp((s) => s.modal);
  const form = useApp((s) => s.form);
  const setForm = useApp((s) => s.setForm);
  const saveStudent = useApp((s) => s.saveStudent);
  const recordPayment = useApp((s) => s.recordPayment);
  const students = useApp((s) => s.students);
  const t = dicts[lang];
  const vi = lang !== "en";

  if (!modal) return null;
  const isEdit = modal.mode === "edit";
  const student = isEdit ? students.find((r) => r.id === modal.id) : undefined;
  const payHistory = (student?.payments || []).slice().reverse();

  return (
    <ModalShell
      icon={<UserRoundPlus size={18} strokeWidth={2} color="var(--accent)" />}
      title={isEdit ? t.mEditTitle : t.mAddTitle}
      subtitle={isEdit ? t.mSubEdit : t.mSubAdd}
      cta={isEdit ? t.saveUpdate : t.saveCreate}
      canSave={Boolean(form.name && form.name.trim())}
      showDelete={isEdit}
      onSave={saveStudent}
    >
      <Field label={t.fName}>
        <input
          className="input"
          value={form.name || ""}
          onChange={(e) => setForm({ name: e.target.value })}
          placeholder={t.fNamePh}
        />
      </Field>
      <Field label={t.fEmail}>
        <input
          className="input"
          value={form.email || ""}
          onChange={(e) => setForm({ email: e.target.value })}
          placeholder={t.fEmailPh}
        />
      </Field>
      <Field label={t.fPhone}>
        <input
          className="input"
          value={form.phone || ""}
          onChange={(e) => setForm({ phone: e.target.value })}
          placeholder={t.fPhonePh}
        />
      </Field>
      <Field label={t.fCycle}>
        <Choices
          wrap
          options={["8", "10", "12", "15", "20"].map((n) => ({
            label: n + (vi ? " buổi" : ""),
            on: String(form.cycle) === n,
            onPick: () => setForm({ cycle: n }),
          }))}
        />
        <input
          className="input"
          value={form.cycle || ""}
          onChange={(e) => setForm({ cycle: e.target.value })}
          placeholder="10"
          inputMode="numeric"
          style={{ width: 120 }}
        />
      </Field>
      <Field label={t.fFee}>
        <input
          className="input"
          value={form.fee || ""}
          onChange={(e) => setForm({ fee: e.target.value })}
          placeholder={t.fFeePh}
        />
      </Field>
      <Field label={t.fStatus}>
        <Choices
          options={[
            ["Active", t.sActive],
            ["At risk", t.sAtRisk],
            ["Inactive", t.sInactive],
          ].map(([v, l]) => ({
            label: l,
            on: form.status === v,
            onPick: () => setForm({ status: v }),
          }))}
        />
      </Field>

      {isEdit && (
        <div
          style={{
            borderTop: "1px solid var(--hairline)", paddingTop: 16,
            display: "flex", flexDirection: "column", gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <label className="field-label" style={{ fontWeight: 600 }}>
              {t.payTitle} ({payHistory.length})
            </label>
            <button
              onClick={() => modal.id != null && recordPayment(modal.id)}
              style={{
                display: "flex", alignItems: "center", gap: 6, background: "var(--success-tint)",
                border: "1px solid var(--success-border)", color: "var(--success)", borderRadius: 8,
                padding: "6px 12px", fontSize: 12.5, fontWeight: 500, cursor: "pointer",
              }}
            >
              <Plus size={13} strokeWidth={2.2} />
              {t.recordPay}
            </button>
          </div>
          {payHistory.length === 0 && (
            <div style={{ fontSize: 13, color: "var(--text-3)", padding: "8px 0" }}>{t.payEmpty}</div>
          )}
          {payHistory.map((p) => (
            <div
              key={p.id}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
                background: "var(--sidebar)", border: "1px solid var(--subtle)", borderRadius: 8,
              }}
            >
              <span
                style={{
                  width: 30, height: 30, minWidth: 30, borderRadius: 8, background: "var(--success-tint)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <Check size={15} strokeWidth={2} color="var(--success)" />
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{p.amount}</div>
                <div style={{ fontSize: 11.5, color: "var(--text-2)" }}>
                  {p.date} · {p.sessions} {t.paySessions}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ModalShell>
  );
}
