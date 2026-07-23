export function screenFromPath(pathname: string): string {
  const seg = pathname.split("/")[1] || "dashboard";
  if (seg === "tuition") return "billing";
  return seg;
}
