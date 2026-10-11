import { createHash } from "node:crypto";

// Dùng chung cho trang biên lai và các route gửi biên lai (CHỈ chạy server).

/** Chữ ký của biên lai → link không đoán mò được, khỏi thêm cột trong DB. */
export function receiptSig(id: number | string) {
  const secret = process.env.CRON_SECRET || "aihlt";
  return createHash("sha256").update(String(id) + "|" + secret).digest("hex").slice(0, 12);
}

export function receiptUrl(origin: string, id: number | string) {
  return origin + "/bienlai/" + id + "." + receiptSig(id);
}

export const receiptMoney = (v?: string) => {
  const n = parseInt(String(v ?? "").replace(/[^0-9]/g, ""), 10) || 0;
  return n > 0 ? n.toLocaleString("vi-VN") + "₫" : String(v || "—");
};

/** Tin nhắn Zalo kèm link biên lai gửi cho học viên. */
export function buildReceiptMessage(
  studentName: string,
  pay: { sessions?: number; amount?: string; date?: string },
  url: string
) {
  const BR = String.fromCharCode(10);
  return [
    "🧾 AIhoclaptrinh · BIÊN LAI THU HỌC PHÍ",
    "",
    "Chào em " + studentName + ",",
    "",
    "Thầy đã nhận học phí của em, cảm ơn em nhiều nha:",
    "",
    "   • Số buổi: " + (pay.sessions ?? "—") + " buổi",
    "   • Số tiền: " + receiptMoney(pay.amount),
    "   • Ngày thu: " + (pay.date || "—"),
    "",
    "Em xem biên lai chi tiết tại đây:",
    url,
    "",
    "Chúc em học thật tốt! 💙",
  ].join(BR);
}
