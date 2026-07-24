-- =============================================================
-- Migration: khóa học có giá + tài liệu HTML (chạy 1 lần trong SQL Editor)
-- =============================================================

-- Giá khóa học (nhập tự do, VD "1.500.000₫")
alter table courses add column if not exists price text default '';

-- Nội dung file HTML tài liệu khóa học (bấm vào khóa học sẽ mở ra xem)
alter table courses add column if not exists html_content text default '';
