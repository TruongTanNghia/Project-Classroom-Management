"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, Check, KeyRound, Loader2, Lock, LogIn, MailCheck } from "lucide-react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

type Status = "loading" | "in" | "out" | "recover";

/**
 * Cổng bảo vệ: chỉ admin đã đăng nhập mới vào được app.
 * - Chưa cấu hình Supabase (chế độ demo) → bỏ qua đăng nhập.
 * - Đã cấu hình → kiểm tra phiên; chưa đăng nhập thì hiện màn hình Login.
 * Kết hợp với RLS (chỉ 'authenticated' đọc/ghi) nên đây là khóa THẬT, không
 * chỉ chặn giao diện.
 *
 * Quên mật khẩu: Supabase gửi mail có link kèm #type=recovery. Mở link xong
 * supabase-js tạo phiên khôi phục và bắn sự kiện PASSWORD_RECOVERY → hiện màn
 * đặt mật khẩu mới thay vì thả thẳng vào app.
 */
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>(isSupabaseConfigured ? "loading" : "in");

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supa = getSupabase();
    if (!supa) return;
    let alive = true;

    // Link khôi phục có thể được xử lý xong TRƯỚC khi sự kiện kịp bắn,
    // nên đọc thẳng hash để không lỡ nhịp.
    const fromRecoveryLink =
      typeof window !== "undefined" && window.location.hash.includes("type=recovery");
    if (fromRecoveryLink) setStatus("recover");

    supa.auth.getSession().then(({ data }) => {
      if (!alive || fromRecoveryLink) return;
      setStatus(data.session ? "in" : "out");
    });

    const { data: sub } = supa.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setStatus("recover");
        return;
      }
      setStatus((prev) => (prev === "recover" && session ? "recover" : session ? "in" : "out"));
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (status === "loading") {
    return (
      <div style={centerWrap}>
        <Loader2 size={26} className="spin" color="var(--accent)" />
      </div>
    );
  }
  if (status === "recover") return <NewPasswordScreen onDone={() => setStatus("in")} />;
  if (status === "out") return <LoginScreen />;
  return <>{children}</>;
}

/* ---------- vỏ chung cho mọi màn hình xác thực ---------- */
function AuthCard({
  children,
  subtitle,
}: {
  children: React.ReactNode;
  subtitle: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 22 }}>
      <Image
        src="/uploads/Logo.jpeg"
        alt="AIhoclaptrinh"
        width={52}
        height={52}
        style={{ borderRadius: 14, objectFit: "cover", boxShadow: "0 4px 14px rgba(28,25,23,0.22)" }}
      />
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em" }}>
          AIhoclaptrinh
        </div>
        <div
          style={{
            fontSize: 12.5,
            color: "var(--text-2)",
            marginTop: 3,
            display: "flex",
            alignItems: "center",
            gap: 5,
            justifyContent: "center",
          }}
        >
          {subtitle}
        </div>
      </div>
      {children}
    </div>
  );
}

/* ---------- màn hình đăng nhập + quên mật khẩu ---------- */
function LoginScreen() {
  const [mode, setMode] = useState<"login" | "forgot" | "sent">("login");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const supa = getSupabase();
    if (!supa) return;
    const { error } = await supa.auth.signInWithPassword({ email: email.trim(), password: pw });
    if (error) {
      setErr("Email hoặc mật khẩu không đúng. Thử lại nhé anh.");
      setBusy(false);
    }
    // Thành công: onAuthStateChange sẽ bắn → AuthGate render lại vào app.
  };

  const sendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const supa = getSupabase();
    if (!supa) return;
    const { error } = await supa.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin,
    });
    setBusy(false);
    if (error) setErr("Chưa gửi được mail: " + error.message);
    else setMode("sent");
  };

  if (mode === "sent") {
    return (
      <div style={centerWrap}>
        <div style={{ position: "fixed", inset: 0, background: "var(--bg-iris)", pointerEvents: "none" }} />
        <div style={card}>
          <AuthCard subtitle={<><MailCheck size={12} strokeWidth={2.2} /> Đã gửi mail đặt lại</>}>
            <></>
          </AuthCard>
          <div style={{ fontSize: 13.5, color: "var(--body-c)", lineHeight: 1.65, textAlign: "center" }}>
            Em đã gửi link đặt lại mật khẩu tới
            <br />
            <b style={{ color: "var(--text)" }}>{email.trim()}</b>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "11px 13px",
              background: "var(--warn-tint)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              fontSize: 12,
              color: "var(--body-c)",
              lineHeight: 1.6,
            }}
          >
            Không thấy mail thì xem thư mục <b>Spam</b>. Mở link trên{" "}
            <b>chính máy và trình duyệt này</b> thì mới đặt lại được.
          </div>
          <button type="button" onClick={() => { setMode("login"); setErr(""); }} className="btn" style={{ ...btn, marginTop: 18 }}>
            <ArrowLeft size={15} strokeWidth={2.2} /> Về trang đăng nhập
          </button>
        </div>
      </div>
    );
  }

  const forgot = mode === "forgot";

  return (
    <div style={centerWrap}>
      <div style={{ position: "fixed", inset: 0, background: "var(--bg-iris)", pointerEvents: "none" }} />
      <form onSubmit={forgot ? sendReset : signIn} style={card}>
        <AuthCard
          subtitle={
            forgot ? (
              <><KeyRound size={12} strokeWidth={2.2} /> Lấy lại mật khẩu</>
            ) : (
              <><Lock size={12} strokeWidth={2.2} /> Khu vực quản trị · chỉ dành cho admin</>
            )
          }
        >
          <></>
        </AuthCard>

        {forgot && (
          <div style={{ fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.6, marginBottom: 16, textAlign: "center" }}>
            Nhập email tài khoản admin. Em gửi link đặt lại mật khẩu cho anh.
          </div>
        )}

        <label style={lbl}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email của anh"
          autoComplete="username"
          required
          style={inp}
        />

        {!forgot && (
          <>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 14 }}>
              <label style={{ ...lbl, marginBottom: 6 }}>Mật khẩu</label>
              <button
                type="button"
                onClick={() => { setMode("forgot"); setErr(""); setPw(""); }}
                style={linkBtn}
              >
                Quên mật khẩu?
              </button>
            </div>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              style={inp}
            />
          </>
        )}

        {err && <div style={{ marginTop: 12, fontSize: 12.5, color: "#EF4444", fontWeight: 500 }}>{err}</div>}

        <button
          type="submit"
          disabled={busy || !email || (!forgot && !pw)}
          className="btn-primary"
          style={btn}
        >
          {busy ? <Loader2 size={15} className="spin" /> : forgot ? <KeyRound size={15} strokeWidth={2.2} /> : <LogIn size={15} strokeWidth={2.2} />}
          {busy ? "Đang xử lý…" : forgot ? "Gửi link đặt lại" : "Đăng nhập"}
        </button>

        {forgot ? (
          <button type="button" onClick={() => { setMode("login"); setErr(""); }} style={{ ...linkBtn, display: "block", margin: "14px auto 0" }}>
            ← Quay lại đăng nhập
          </button>
        ) : (
          <div style={{ marginTop: 14, fontSize: 11.5, color: "var(--text-3)", textAlign: "center" }}>
            Dữ liệu được bảo vệ. Người chưa đăng nhập không đọc/ghi được.
          </div>
        )}
      </form>
    </div>
  );
}

/* ---------- màn hình đặt mật khẩu mới (mở từ link trong mail) ---------- */
function NewPasswordScreen({ onDone }: { onDone: () => void }) {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 6) return setErr("Mật khẩu phải từ 6 ký tự trở lên.");
    if (pw !== pw2) return setErr("Hai ô mật khẩu chưa khớp nhau.");
    setBusy(true);
    setErr("");
    const supa = getSupabase();
    if (!supa) return;
    const { error } = await supa.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return setErr("Chưa đổi được: " + error.message);
    // Dọn hash khôi phục khỏi URL rồi vào app
    history.replaceState(null, "", window.location.pathname + window.location.search);
    setOk(true);
    setTimeout(onDone, 900);
  };

  return (
    <div style={centerWrap}>
      <div style={{ position: "fixed", inset: 0, background: "var(--bg-iris)", pointerEvents: "none" }} />
      <form onSubmit={save} style={card}>
        <AuthCard subtitle={<><KeyRound size={12} strokeWidth={2.2} /> Đặt mật khẩu mới</>}>
          <></>
        </AuthCard>

        {ok ? (
          <div style={{ textAlign: "center", padding: "10px 0 4px" }}>
            <Check size={30} strokeWidth={2.4} color="var(--success)" />
            <div style={{ marginTop: 10, fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
              Đổi mật khẩu xong!
            </div>
            <div style={{ marginTop: 4, fontSize: 12.5, color: "var(--text-2)" }}>Đang vào app…</div>
          </div>
        ) : (
          <>
            <label style={lbl}>Mật khẩu mới</label>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="ít nhất 6 ký tự"
              autoComplete="new-password"
              required
              style={inp}
            />

            <label style={{ ...lbl, marginTop: 14 }}>Nhập lại mật khẩu</label>
            <input
              type="password"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              required
              style={inp}
            />

            {err && <div style={{ marginTop: 12, fontSize: 12.5, color: "#EF4444", fontWeight: 500 }}>{err}</div>}

            <button type="submit" disabled={busy || !pw || !pw2} className="btn-primary" style={btn}>
              {busy ? <Loader2 size={15} className="spin" /> : <Check size={15} strokeWidth={2.4} />}
              {busy ? "Đang lưu…" : "Lưu mật khẩu mới"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}

const centerWrap: React.CSSProperties = {
  position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
  background: "var(--bg)", padding: 20,
};
const card: React.CSSProperties = {
  position: "relative", width: "100%", maxWidth: 380, background: "var(--surface)",
  border: "1px solid var(--border)", borderRadius: 18, padding: "30px 26px",
  boxShadow: "0 18px 50px rgba(28,25,23,0.16)",
  animation: "fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both",
};
const lbl: React.CSSProperties = {
  display: "block", fontSize: 12, fontWeight: 600, color: "var(--head-c)", marginBottom: 6,
};
const inp: React.CSSProperties = {
  width: "100%", padding: "11px 13px", borderRadius: 10, border: "1px solid var(--border)",
  background: "var(--bg)", color: "var(--text)", fontSize: 14, outline: "none",
};
const btn: React.CSSProperties = {
  width: "100%", marginTop: 22, justifyContent: "center", padding: "11px 0", fontSize: 14,
  display: "inline-flex", alignItems: "center", gap: 8,
};
const linkBtn: React.CSSProperties = {
  background: "none", border: "none", padding: 0, cursor: "pointer",
  fontSize: 12, fontWeight: 600, color: "var(--accent)",
};
