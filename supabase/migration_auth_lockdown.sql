-- =====================================================================
-- EduFlow AI — KHOA DU LIEU BANG SUPABASE AUTH (chay 1 lan)
-- © Truong Tan Nghia · AI Hoc Lap Trinh
-- =====================================================================
-- Truoc khi chay: schema.sql da chay, RLS dang mo cho "anon"
--   => ai co link app deu doc/ghi duoc du lieu.
-- Sau khi chay: chi tai khoan da DANG NHAP (role authenticated) moi
--   doc/ghi duoc. Cac route server (cron nhac lich, webhook Zalo) dung
--   SUPABASE_SERVICE_ROLE_KEY nen bo qua RLS, van chay binh thuong.
--
-- THU TU BAT BUOC:
--   1. Supabase Dashboard > Authentication > Providers > Email: BAT
--   2. Authentication > Users > Add user: tao tai khoan admin duy nhat
--      (tat "Auto Confirm User" thi phai xac nhan email, nen bat len)
--   3. Chay file nay trong SQL Editor
--   4. Dang nhap vao app bang tai khoan vua tao
-- CANH BAO: chay file nay TRUOC khi tao user => app se trang tron
--           vi khong con quyen doc du lieu.
-- =====================================================================

-- 1) Bao dam RLS bat tren moi bang ------------------------------------
alter table students          enable row level security;
alter table payments          enable row level security;
alter table courses           enable row level security;
alter table schedule_sessions enable row level security;
alter table attendance_records enable row level security;
alter table zalo_links        enable row level security;
alter table threads           enable row level security;
alter table message_log       enable row level security;
alter table reminder_sent     enable row level security;
alter table app_settings      enable row level security;

-- 2) Xoa quyen cua khach chua dang nhap (anon) ------------------------
drop policy if exists "anon full access" on students;
drop policy if exists "anon full access" on payments;
drop policy if exists "anon full access" on courses;
drop policy if exists "anon full access" on schedule_sessions;
drop policy if exists "anon full access" on attendance_records;
drop policy if exists "anon full access" on zalo_links;
drop policy if exists "anon full access" on threads;
drop policy if exists "anon full access" on message_log;
drop policy if exists "anon full access" on reminder_sent;
drop policy if exists "anon full access" on app_settings;

-- 3) Cap toan quyen cho tai khoan da dang nhap ------------------------
drop policy if exists "auth full access" on students;
create policy "auth full access" on students
  for all to authenticated using (true) with check (true);

drop policy if exists "auth full access" on payments;
create policy "auth full access" on payments
  for all to authenticated using (true) with check (true);

drop policy if exists "auth full access" on courses;
create policy "auth full access" on courses
  for all to authenticated using (true) with check (true);

drop policy if exists "auth full access" on schedule_sessions;
create policy "auth full access" on schedule_sessions
  for all to authenticated using (true) with check (true);

drop policy if exists "auth full access" on attendance_records;
create policy "auth full access" on attendance_records
  for all to authenticated using (true) with check (true);

drop policy if exists "auth full access" on zalo_links;
create policy "auth full access" on zalo_links
  for all to authenticated using (true) with check (true);

drop policy if exists "auth full access" on threads;
create policy "auth full access" on threads
  for all to authenticated using (true) with check (true);

drop policy if exists "auth full access" on message_log;
create policy "auth full access" on message_log
  for all to authenticated using (true) with check (true);

drop policy if exists "auth full access" on reminder_sent;
create policy "auth full access" on reminder_sent
  for all to authenticated using (true) with check (true);

drop policy if exists "auth full access" on app_settings;
create policy "auth full access" on app_settings
  for all to authenticated using (true) with check (true);

-- 4) Kiem tra ket qua -------------------------------------------------
-- Moi bang phai co dung 1 dong, roles = {authenticated}
select tablename, policyname, roles
from pg_policies
where schemaname = 'public'
order by tablename;
