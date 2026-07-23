"use client";

// Loading skeleton shown for ~620ms on every navigation (from the prototype)
export default function PageSkeleton() {
  const four = [1, 2, 3, 4];
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="sk" style={{ width: 260, height: 24 }} />
        <div className="sk" style={{ width: 420, height: 14 }} />
      </div>
      <div className="g4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {four.map((s) => (
          <div
            key={s}
            style={{
              background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
              padding: 20, display: "flex", flexDirection: "column", gap: 14,
            }}
          >
            <div className="sk" style={{ width: "60%", height: 13 }} />
            <div className="sk" style={{ width: "45%", height: 26 }} />
            <div className="sk" style={{ width: "70%", height: 12 }} />
          </div>
        ))}
      </div>
      <div className="g2a" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <div
          style={{
            background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
            padding: 24, display: "flex", flexDirection: "column", gap: 16,
          }}
        >
          <div className="sk" style={{ width: "40%", height: 16 }} />
          <div className="sk" style={{ width: "100%", height: 180, borderRadius: 12 }} />
        </div>
        <div
          style={{
            background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
            padding: 20, display: "flex", flexDirection: "column", gap: 12,
          }}
        >
          <div className="sk" style={{ width: "55%", height: 16 }} />
          <div className="sk" style={{ width: "100%", height: 13 }} />
          <div className="sk" style={{ width: "90%", height: 13 }} />
          <div className="sk" style={{ width: "95%", height: 13 }} />
          <div className="sk" style={{ width: "100%", height: 40, borderRadius: 10, marginTop: 8 }} />
          <div className="sk" style={{ width: "100%", height: 40, borderRadius: 10 }} />
        </div>
      </div>
      <div
        style={{
          background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
          padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14,
        }}
      >
        <div className="sk" style={{ width: "30%", height: 16 }} />
        {four.map((s) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="sk" style={{ width: 34, height: 34, minWidth: 34, borderRadius: 99 }} />
            <div className="sk" style={{ flex: 2, height: 13 }} />
            <div className="sk" style={{ flex: 1, height: 13 }} />
            <div className="sk" style={{ flex: 1, height: 13 }} />
            <div className="sk" style={{ width: 70, height: 22, borderRadius: 99 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
