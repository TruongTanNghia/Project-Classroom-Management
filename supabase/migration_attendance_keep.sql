-- =============================================================
-- SỬA: xóa/sửa BUỔI HỌC không còn xóa lây điểm danh nữa.
-- Trước đây session_id dùng ON DELETE CASCADE → xóa 1 buổi là mất sạch
-- điểm danh của buổi đó. Đổi sang ON DELETE SET NULL → điểm danh được GIỮ LẠI
-- (chỉ bỏ liên kết tới buổi đã xóa). Chuyên cần/học phí tính theo học viên nên
-- vẫn đúng.
-- Chạy 1 lần trong Supabase → SQL Editor → Run.
-- =============================================================
alter table attendance_records
  drop constraint if exists attendance_records_session_id_fkey;

alter table attendance_records
  add constraint attendance_records_session_id_fkey
  foreign key (session_id) references schedule_sessions (id) on delete set null;
