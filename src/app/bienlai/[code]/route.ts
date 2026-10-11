import { createClient } from "@supabase/supabase-js";
import { receiptSig } from "@/lib/receipt";

// BIÊN LAI THU HỌC PHÍ — trang HTML công khai, gửi link cho học viên xem.
// Dùng Route Handler (không phải page) để KHÔNG dính cổng đăng nhập của app.
//
//   /bienlai/<id>.<chữ ký>
// Chữ ký = sha256(id + CRON_SECRET) → link không đoán mò được, khỏi cần
// thêm cột trong DB.

/* eslint-disable @typescript-eslint/no-explicit-any */

const esc = (v: unknown) =>
  String(v ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string)
  );

const money = (v?: string) => {
  const n = parseInt(String(v ?? "").replace(/[^0-9]/g, ""), 10) || 0;
  return n > 0 ? n.toLocaleString("vi-VN") + "₫" : String(v || "—");
};
const dmy = (iso: string) =>
  /^\d{4}-\d{2}-\d{2}/.test(String(iso))
    ? String(iso).slice(8, 10) + "/" + String(iso).slice(5, 7) + "/" + String(iso).slice(0, 4)
    : String(iso || "");

function page(title: string, body: string, status = 200) {
  const html = `<!DOCTYPE html>
<html lang="vi"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${esc(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Be Vietnam Pro',system-ui,sans-serif;background:#F3F4F8;color:#1C1917;
  padding:24px 14px;line-height:1.6;-webkit-font-smoothing:antialiased}
.wrap{max-width:560px;margin:0 auto}
.card{background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 18px 50px rgba(28,25,23,.12)}
.top{background:linear-gradient(135deg,#6C6AF0,#5850E0);color:#fff;padding:26px 26px 22px;position:relative}
.top:after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:22px;background:#fff;
  border-radius:22px 22px 0 0}
.brand{font-size:13px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;opacity:.85}
.ttl{font-size:25px;font-weight:800;letter-spacing:-.02em;margin-top:4px}
.sub{font-size:13.5px;opacity:.9;margin-top:3px}
.body{padding:8px 26px 26px}
.row{display:flex;justify-content:space-between;gap:14px;padding:11px 0;border-bottom:1px dashed #E7E5E4;font-size:14.5px}
.row:last-of-type{border-bottom:none}
.k{color:#78716C}
.v{font-weight:600;text-align:right}
.amt{background:#F6F5FE;border:1px solid #D9D7F7;border-radius:14px;padding:16px 18px;margin:18px 0 6px;
  display:flex;justify-content:space-between;align-items:center;gap:12px}
.amt .k{font-size:14px;color:#5B5570;font-weight:600}
.amt .v{font-size:25px;font-weight:800;color:#4A43D9;letter-spacing:-.02em}
.sec{margin-top:22px;font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#8A8480}
ol{margin:10px 0 0;padding-left:20px}
li{font-size:14px;padding:4px 0;color:#44403C}
li span{color:#8A8480}
.paid{display:inline-flex;align-items:center;gap:7px;background:#ECFDF5;color:#047857;border:1px solid #A7F3D0;
  border-radius:999px;padding:7px 15px;font-size:13.5px;font-weight:700;margin-top:18px}
.foot{text-align:center;color:#8A8480;font-size:12.5px;margin-top:18px;line-height:1.7}
.err{background:#fff;border-radius:18px;padding:34px 26px;text-align:center;box-shadow:0 18px 50px rgba(28,25,23,.12)}
@media print{body{background:#fff;padding:0}.card{box-shadow:none}}
</style></head><body><div class="wrap">${body}</div></body></html>`;
  return new Response(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}

export async function GET(_req: Request, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  const [rawId, sig] = String(code || "").split(".");
  const id = Number(rawId);
  if (!id || !sig || sig !== receiptSig(id)) {
    return page("Không tìm thấy biên lai", `<div class="err"><h2>Không tìm thấy biên lai</h2>
      <p style="color:#78716C;margin-top:8px">Đường dẫn không đúng hoặc đã hết hiệu lực.</p></div>`, 404);
  }

  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supaKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supaUrl || !supaKey) return page("Lỗi", `<div class="err"><h2>Chưa cấu hình hệ thống</h2></div>`, 503);
  const supa = createClient(supaUrl, supaKey, { auth: { persistSession: false } });

  const { data: p } = await supa.from("payments").select("*").eq("id", id).maybeSingle();
  if (!p) {
    return page("Không tìm thấy biên lai", `<div class="err"><h2>Không tìm thấy biên lai</h2></div>`, 404);
  }
  const { data: st } = await supa.from("students").select("name,phone").eq("id", (p as any).student_id).maybeSingle();

  const detail: any[] = Array.isArray((p as any).detail) ? (p as any).detail : [];
  const items = detail.length
    ? `<div class="sec">Các buổi đã học</div><ol>${detail
        .map((d) => `<li>${esc(d.name)} <span>· ${esc(dmy(d.date))}</span></li>`)
        .join("")}</ol>`
    : "";

  const body = `<div class="card">
    <div class="top">
      <div class="brand">AIhoclaptrinh</div>
      <div class="ttl">Biên lai thu học phí</div>
      <div class="sub">Số BL-${String(id).padStart(5, "0")} · ${esc((p as any).date)}</div>
    </div>
    <div class="body">
      <div class="row"><span class="k">Học viên</span><span class="v">${esc((st as any)?.name || "—")}</span></div>
      <div class="row"><span class="k">Ngày thu</span><span class="v">${esc((p as any).date)}</span></div>
      <div class="row"><span class="k">Số buổi đã thu</span><span class="v">${esc((p as any).sessions)} buổi</span></div>
      <div class="row"><span class="k">Hình thức</span><span class="v">Học phí khóa học</span></div>
      <div class="amt"><span class="k">TỔNG TIỀN ĐÃ THU</span><span class="v">${esc(money((p as any).amount))}</span></div>
      <div class="paid">✅ Đã thanh toán</div>
      ${items}
      <div class="foot">Cảm ơn em đã tin tưởng và đồng hành cùng AIhoclaptrinh 💙<br/>
      Biên lai này được tạo tự động từ hệ thống quản lý lớp học.</div>
    </div>
  </div>`;
  return page("Biên lai thu học phí · AIhoclaptrinh", body);
}
