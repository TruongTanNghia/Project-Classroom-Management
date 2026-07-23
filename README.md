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
đủ chu kỳ thì hiện **"Đến kỳ thu học phí"** → bấm **Nhắc qua Zalo** (gửi tin thật qua Zalo Bot
nếu học viên có Chat ID + toast) → **Ghi nhận đã thu** → KPI doanh thu cập nhật.

## Gửi thông báo Zalo thật (Zalo Bot)

Nút **Nhắc** gọi API route server-side `/api/zalo/send` (giữ token bí mật, không lộ ra trình
duyệt) → gửi qua **Zapps Bot API** (`bot-api.zapps.me`). Cần:

1. Điền `ZALO_BOT_TOKEN` vào `.env.local` (xem `.env.local.example`) — **không** có tiền tố
   `NEXT_PUBLIC_`. Trên Vercel: thêm biến này ở **Settings → Environment Variables**.
2. **Onboard Chat ID cho từng phụ huynh**: bảo phụ huynh nhắn 1 tin cho bot → mở
   `https://<app>/api/zalo/updates` (hoặc gọi GET route đó) để lấy `chatId` → vào trang
   **Zalo Bot**, sửa liên kết của học viên, dán Chat ID vào. Từ đó nút Nhắc sẽ gửi thật tới họ.

Học viên **chưa có Chat ID** → nút Nhắc chỉ ghi nhận trong app (không gửi ra ngoài), không lỗi.

Trong modal sửa liên kết Zalo có nút **"Lấy Chat ID"**: bấm → nhờ phụ huynh nhắn 1 tin cho bot
→ Chat ID tự điền vào; và nút **"Gửi tin thử"** để kiểm tra kết nối ngay.

## Tự động nhắc lịch học (trước giờ ~20 phút)

Mỗi học viên có **bot Zalo riêng** (token + Chat ID trong trang Zalo Bot). Một dịch vụ cron
ngoài gọi định kỳ vào route `/api/cron/reminders`; route tìm các buổi sắp bắt đầu trong ~20
phút tới rồi gửi tin lịch học tới từng học viên (bằng bot riêng của học viên), có **chống gửi
trùng**.

**Lịch học 2 kiểu**: để trống ô "Ngày cụ thể" = **lặp hằng tuần** theo thứ; điền ngày = buổi
**một lần** đúng ngày đó. Cron canh giờ theo **múi giờ VN (UTC+7)**.

**Cài cron miễn phí (không cần Vercel Pro):**
1. Chạy `supabase/migration_reminders.sql` trong SQL Editor (thêm cột `date` + bảng
   `reminder_sent`). Project mới chạy `schema.sql` thì đã có sẵn.
2. Đặt `CRON_SECRET` trong `.env.local` / Vercel env (chuỗi bí mật tự đặt).
3. Tạo tài khoản [cron-job.org](https://cron-job.org) (miễn phí) → tạo job:
   - URL: `https://<app>.vercel.app/api/cron/reminders?key=<CRON_SECRET>`
   - Lịch: **mỗi 5 phút**.

**Test nhanh** (không cần chờ tới giờ):
- Xem trước sẽ gửi gì: `GET /api/cron/reminders?key=<secret>&dry=1`
- Ép gửi ngay 1 buổi: `GET /api/cron/reminders?key=<secret>&force=<sessionId>`

> Nếu dùng **Vercel Pro**: có thể thay cron ngoài bằng `vercel.json` với `crons` chạy mỗi vài
> phút. Gói Free của Vercel chỉ chạy cron 1 lần/ngày nên không đủ — dùng cron ngoài.

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
3. Ở bước **Environment Variables**, thêm:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (hoặc `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - `ZALO_BOT_TOKEN` (nếu muốn gửi Zalo thật — **không** có `NEXT_PUBLIC_`)
   - `CRON_SECRET` (nếu bật tự động nhắc lịch — **không** có `NEXT_PUBLIC_`)

   (Bỏ hết nếu chỉ muốn chạy demo mode.) → **Deploy**.

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
