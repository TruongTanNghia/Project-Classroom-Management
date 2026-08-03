-- =============================================================
-- KHÓA DATABASE: chỉ tài khoản đã ĐĂNG NHẬP (authenticated) mới đọc/ghi.
-- Chạy 1 lần trong Supabase → SQL Editor → New query → Run.
--
-- Sau khi chạy:
--   • Khách vãng lai (anon, chưa đăng nhập)  → KHÔNG đọc/ghi được gì.
--   • Admin đăng nhập trong app              → toàn quyền.
--   • Cron (service_role key)                → tự động bỏ qua RLS, vẫn chạy.
--
-- An toàn để chạy lại nhiều lần (idempotent): tự bật RLS, xóa policy cũ,
-- tạo lại policy "chỉ authenticated".
-- =============================================================
do $$
declare
  t   text;
  pol record;
  tables text[] := array[
    'students','payments','courses','schedule_sessions','zalo_links',
    'threads','app_settings','attendance_records','reminder_sent','message_log'
  ];
begin
  foreach t in array tables loop
    -- chỉ xử lý bảng thực sự tồn tại
    if to_regclass('public.'||t) is null then
      raise notice 'Bỏ qua (chưa có bảng): %', t;
      continue;
    end if;

    execute format('alter table public.%I enable row level security', t);

    -- xóa mọi policy cũ (kể cả policy mở cho anon)
    for pol in
      select policyname from pg_policies
      where schemaname = 'public' and tablename = t
    loop
      execute format('drop policy %I on public.%I', pol.policyname, t);
    end loop;

    -- chỉ cho tài khoản đã đăng nhập, toàn quyền
    execute format(
      'create policy "admin_authenticated_all" on public.%I for all to authenticated using (true) with check (true)',
      t
    );
    raise notice 'Đã khóa bảng: %', t;
  end loop;
end $$;
