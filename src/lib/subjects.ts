import type { Subject } from "./types";

// Subject → avatar-tint class index (shares the theme-aware .tint-N classes)
export const subjectTintClass: Record<Subject, string> = {
  Math: "tint-0",
  Science: "tint-1",
  English: "tint-2",
  History: "tint-3",
  CS: "tint-4",
  Arts: "tint-5",
};

export const SUBJECTS: Subject[] = ["Math", "Science", "English", "History", "Arts", "CS"];

// Avatar palette rotation used across tables/lists
export const avatarTint = (i: number) => `tint-${i % 6}`;

// Revenue-by-course bar palette (matches prototype hexes; readable in both themes)
export const revBarPalette = [
  "#5E5CE6",
  "#0284C7",
  "#059669",
  "#D97706",
  "#DB2777",
  "#7C3AED",
  "#78716C",
];
