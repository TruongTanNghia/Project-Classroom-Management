"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";
import { useApp } from "@/lib/store";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import PageSkeleton from "./PageSkeleton";
import ModalRoot from "@/components/modals/ModalRoot";
import AttendanceModal from "@/components/modals/AttendanceModal";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const hydrate = useApp((s) => s.hydrate);
  const toast = useApp((s) => s.toast);
  const pathname = usePathname();
  // Skeleton shows while the current path hasn't "settled" yet (~620ms per navigation)
  const [settledPath, setSettledPath] = useState<string | null>(null);
  const loading = settledPath !== pathname;
  const first = useRef(true);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const ms = first.current ? 750 : 620;
    first.current = false;
    const timer = setTimeout(() => setSettledPath(pathname), ms);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontSize: 14 }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Topbar />
        <main className="main-pad" style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
          {loading ? <PageSkeleton /> : children}
        </main>
      </div>
      <ModalRoot />
      <AttendanceModal />
      {toast && (
        <div
          style={{
            position: "fixed", left: "50%", bottom: 28, transform: "translateX(-50%)",
            zIndex: 70, display: "flex", alignItems: "center", gap: 10,
            background: "var(--toast-bg)", color: "var(--toast-fg)", padding: "12px 18px",
            borderRadius: 12, boxShadow: "var(--toast-shadow)", fontSize: 13.5, fontWeight: 500,
            animation: "fadeUp 0.25s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          <Check size={16} strokeWidth={2.2} color="#4ADE80" />
          {toast}
        </div>
      )}
    </div>
  );
}
