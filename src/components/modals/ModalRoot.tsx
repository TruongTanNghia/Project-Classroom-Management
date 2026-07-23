"use client";

import { useApp } from "@/lib/store";
import StudentModal from "./StudentModal";
import CourseModal from "./CourseModal";
import ZaloModal from "./ZaloModal";
import ThreadModal from "./ThreadModal";
import SchedModal from "./SchedModal";
import DeleteConfirm from "./DeleteConfirm";

export default function ModalRoot() {
  const modal = useApp((s) => s.modal);
  if (!modal) return null;
  if (modal.mode === "delete") return <DeleteConfirm />;
  switch (modal.kind) {
    case "student":
      return <StudentModal />;
    case "course":
      return <CourseModal />;
    case "zalo":
      return <ZaloModal />;
    case "thread":
      return <ThreadModal />;
    case "sched":
      return <SchedModal />;
    default:
      return null;
  }
}
