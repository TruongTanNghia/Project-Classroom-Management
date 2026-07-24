-- =============================================================
-- Migration: lịch học hiển thị đủ 7 ngày (chạy 1 lần trong SQL Editor)
-- Cho phép cột "day" nhận 0..6 (0=Thứ Hai … 5=Thứ Bảy, 6=Chủ Nhật)
-- =============================================================
alter table schedule_sessions drop constraint if exists schedule_sessions_day_check;
alter table schedule_sessions add constraint schedule_sessions_day_check check (day between 0 and 6);
