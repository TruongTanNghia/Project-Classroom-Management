-- =============================================================
-- Migration: nhắc lịch học tự động (chạy 1 lần trong SQL Editor)
-- Bổ sung cho các project đã chạy schema.sql trước đó.
-- =============================================================

-- 1) Ngày cụ thể (tùy chọn) cho buổi học.
--    NULL  = buổi lặp lại hằng tuần theo cột "day" (0=T2 … 4=T6).
--    Có giá trị = buổi diễn ra đúng ngày đó (định dạng YYYY-MM-DD).
alter table schedule_sessions add column if not exists date date;

-- 2) Nhật ký đã nhắc — chống gửi trùng khi cron chạy nhiều lần.
--    id = "<session_id>:<YYYYMMDD>:<student_id>"
create table if not exists reminder_sent (
  id text primary key,
  sent_at timestamptz not null default now()
);
alter table reminder_sent enable row level security;
drop policy if exists "anon full access" on reminder_sent;
create policy "anon full access" on reminder_sent for all to anon using (true) with check (true);
