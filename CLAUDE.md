@AGENTS.md

<!-- aihoclaptrinh-design-mcp:start -->
## Trang Giới thiệu (About) — dựng theo thiết kế qua MCP `aihoclaptrinh-design`
- Thiết kế gốc nằm trong MCP `aihoclaptrinh-design`. Mọi việc dựng/sửa trang Giới thiệu phải bám thiết kế: bắt đầu bằng `design_get_overview` + `design_get_implementation_guide`.
- CSS trang lấy bằng `design_export_css` (không sửa tay file xuất ra); ảnh bằng `design_export_assets`; hook tương tác bằng `design_get_code_template`.
- Dựng từng khối bằng đúng class/markup từ `design_get_section`, chữ từ `design_get_copy`, gắn `data-abt-section="<id>"` cho phần tử gốc của khối.
- Xong mỗi khối: `design_compare_implementation` url=http://localhost:3001/about ở desktop sáng, desktop tối, mobile — sửa tới khi ĐẠT.
- Không thêm số liệu/tên khách hàng ngoài thiết kế.
<!-- aihoclaptrinh-design-mcp:end -->

## Lưu ý thực tế khi so khớp trang Giới thiệu
Ba điều này không hiển nhiên, mất thời gian mới tìm ra:
1. **Phải truyền `wait_for: ".abt-root"`** cho `design_compare_implementation`. AppShell hiện skeleton ~620ms rồi mới đổi sang nội dung; không chờ thì công cụ báo "không thấy khối".
2. **Chạy dev ở chế độ demo** để qua được AuthGate, không sửa code, không đụng `.env.local`:
   `NEXT_PUBLIC_SUPABASE_URL= NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY= NEXT_PUBLIC_SUPABASE_ANON_KEY= npx next dev -p 3001`
3. **Chỉ số lệch điểm ảnh ở desktop/mobile không đáng tin** với app này, vì `<main class="main-pad">` tự cuộn bên trong nên ảnh chụp khối cao hơn khung nhìn bị xén → báo lệch giả. Hãy tin vào *kích thước khối* và *bảng chênh lệch style* (đang 0). Muốn xem trọn khối thì dùng `scripts/agent-shot.mjs` trong thư mục MCP.

Chromium của Playwright nằm ở `E:\DẠY HỌC\PROJECT-HUB\UI\ms-playwright` (ổ C: đã đầy), đã khai trong `.mcp.json` qua biến `PLAYWRIGHT_BROWSERS_PATH`.
