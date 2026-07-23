# EduFlow AI — AIhoclaptrinh Dashboard

Bảng điều khiển quản lý lớp học AI/lập trình của **AIhoclaptrinh**, rebuild từ bản design
Claude Designer (`design_handoff_eduflow/`) sang **Next.js 16** (App Router) + **Tailwind CSS v4**
+ **Supabase**. App song ngữ **VI/EN**, có **light/dark mode**, chạy được ngay cả khi chưa
cấu hình Supabase (chế độ demo với dữ liệu mẫu).

## 10 màn hình

Giới thiệu · Tổng quan · Học viên (CRUD + chu kỳ học phí) · Khóa học (CRUD) · Phân tích AI ·
Lịch học (tuần T2–T6 × 6 ca, điểm danh) · Zalo Bot (liên kết + automation) ·
Học phí (KPI doanh thu, doanh thu theo khóa, nhắc phí qua Zalo) · Tin nhắn · Cài đặt

Logic nghiệp vụ then chốt (tự động, xuyên màn hình):
**điểm danh trên Lịch học** → đếm số buổi đã học → so với **chu kỳ đóng phí** của học viên →
đủ chu kỳ thì hiện **"Đến kỳ thu học phí"** → bấm **Nhắc qua Zalo** (tạo tin nhắn + toast) →
**Ghi nhận đã thu** → KPI doanh thu cập nhật.

## Chạy local

```bash
npm install
npm run dev        # http://localhost:3000
```

> ⚠️ Nếu máy có phần mềm VPN chiếm port 3000 (VD: EonVPN), chạy `npx next dev -p 3001`.

Chưa có `.env.local` → app chạy **demo mode** (dữ liệu mẫu trong bộ nhớ, không lưu).

## Kết nối Supabase (3 bước)

1. Tạo project tại [supabase.com](https://supabase.com) (free tier là đủ).
2. Vào **SQL Editor** → New query → paste toàn bộ file [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
   (Tạo 7 bảng + RLS + dữ liệu mẫu giống prototype.)
3. Copy `.env.local.example` → `.env.local`, điền 2 giá trị từ
   **Project Settings → API**:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   ```

Restart `npm run dev` → mọi thao tác thêm/sửa/xoá/điểm danh/thu học phí sẽ lưu thẳng vào Supabase.

## Deploy lên Vercel

1. Push code lên GitHub:

   ```bash
   git add -A && git commit -m "EduFlow AI dashboard"
   git remote add origin https://github.com/<user>/eduflow.git
   git push -u origin main
   ```

2. Vào [vercel.com/new](https://vercel.com/new) → **Import** repo → framework tự nhận Next.js.
3. Ở bước **Environment Variables**, thêm `NEXT_PUBLIC_SUPABASE_URL` và
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` (bỏ qua bước này nếu muốn chạy demo mode) → **Deploy**.

## Lưu ý bảo mật (v1 chưa có đăng nhập)

RLS trong `schema.sql` đang mở full quyền cho anon key — ai có link app đều đọc/ghi được data.
Đủ dùng cho nội bộ; khi cần khoá thật: bật **Supabase Auth**, đổi policy `to anon` →
`to authenticated`, và thêm màn hình đăng nhập.

## Cấu trúc

```
src/
├─ app/                  # 10 routes + layout (font Geist, theme script) + globals.css (design tokens)
├─ components/
│  ├─ shell/             # Sidebar, Topbar, AppShell (drawer mobile + skeleton transition), PageSkeleton
│  ├─ modals/            # ModalShell + Student/Course/Zalo/Thread/Sched + DeleteConfirm
│  └─ ui/bits.tsx        # PageHeader, Avatar, Page
└─ lib/
   ├─ store.ts           # Zustand store: toàn bộ rows + CRUD, optimistic update + sync Supabase
   ├─ supabase.ts        # client (null → demo mode)
   ├─ seed.ts            # dữ liệu mẫu (demo mode)
   ├─ derived.ts         # logic học phí/điểm danh/doanh thu
   ├─ i18n.ts            # từ điển VI/EN
   ├─ subjects.ts        # màu môn học + avatar palette
   └─ types.ts
supabase/schema.sql      # bảng + RLS + seed — chạy 1 lần trong SQL Editor
```

Ngôn ngữ (`aihlt-lang`) và theme (`aihlt-dark`) lưu trong `localStorage`.
