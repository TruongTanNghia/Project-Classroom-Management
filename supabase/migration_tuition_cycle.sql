-- =============================================================
-- HỌC PHÍ KIỂU "CHỐT BUỔI" (chạy 1 lần trong Supabase → SQL Editor → Run)
--
-- • attendance_records.paid : buổi này đã được gom vào 1 phiếu thu hay chưa.
--     - false = đã học nhưng CHƯA thu tiền  → đang NỢ
--     - true  = đã nằm trong một phiếu thu → không tính nợ nữa
-- • payments.detail : danh sách buổi được gom vào lần thu đó (ảnh chụp lúc thu,
--     giữ nguyên kể cả sau này có xoá điểm danh).
--
-- Nhờ vậy: bấm "Thu học phí" là bộ đếm nợ tự về 0 cho kỳ mới,
-- KHÔNG cần xoá lịch sử điểm danh thủ công nữa.
-- =============================================================

alter table attendance_records
  add column if not exists paid boolean not null default false;

alter table payments
  add column if not exists detail jsonb;

-- Tăng tốc truy vấn "buổi chưa thu của học viên X"
create index if not exists attendance_records_unpaid_idx
  on attendance_records (student_id, present, paid);
