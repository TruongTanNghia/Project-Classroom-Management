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

## Trang công khai aihoclaptrinh.com — bản "Xưởng Kim" (`src/app/kim`)

Trang chủ của tên miền công khai KHÔNG còn là `/about`. Nó là `/kim`, dựng theo bản thiết kế `UI/UI mệnh Kim/XuongKim.dc.html`. Khu quản trị vẫn dùng trang Giới thiệu bản cũ ở trên; hai bản không chung dòng CSS nào (tiền tố `kim-` và `abt-`).

- **Đừng sửa tay** `src/app/kim/kim.css` và `src/components/kim/gen/*.tsx`: chúng sinh ra từ bản thiết kế bằng `UI/aihoclaptrinh-design-mcp/scripts/kim-convert.py`. Chỗ nào cố ý khác thiết kế (số năm kinh nghiệm, địa điểm, chỗ chèn viên kim cương) khai trong bảng `OVERRIDES` đầu file đó, rồi chạy lại.
- Phần thêm ngoài thiết kế nằm riêng: `kim-shell.css` (khớp với Next + Tailwind, nút ngôn ngữ/sáng tối, phóng trang trên màn rộng), `kim-diamond.css` + `KimGem.tsx` + `KimFx.tsx` (lớp lấp lánh). Mở trang với `?plain=1` thì lớp lấp lánh tắt, trang đúng nguyên bản thiết kế.
- **Khối khoá học là phần viết tay, cố ý khác thiết kế** (thiết kế chỉ có 3 thẻ mẫu). 9 khoá = 8 bước của lộ trình + Phân tích dữ liệu; bấm "Xem khoá học" mở `<dialog>` nội dung từng buổi; mỗi khoá có đường dẫn riêng `/#khoa-<slug>`. File: `KimCourseGrid.tsx` (dựng trên máy chủ), `KimSyllabus.tsx` (mở/đóng), `kim-courses.css`, và **`courses-data.ts` — mọi tên khoá, số buổi, học phí, nội dung buổi nằm ở đây**, sửa nội dung thì sửa file này.
  - Nội dung buổi lấy từ giáo trình thật ở `E:\DẠY HỌC\GIAO-TRINH` (nguồn từng khoá ghi ở đầu `courses-data.ts`). Đừng tự nghĩ ra buổi học; khoá nào chưa có giáo trình thì nói rõ với anh Nghĩa.
  - Học phí anh Nghĩa đưa: tính theo buổi, đủ 8 buổi thu một lần. Học máy, Học sâu 300k; Thị giác, Học tăng cường 350k; còn lại 380k.
- **Luật màu**: chỉ trắng, bạc, thép, vàng, nâu đất. Không đỏ, hồng, tím, cam (anh Nghĩa mệnh Kim, Hoả khắc Kim). Hiệu ứng mới cũng phải theo luật này.
- **Xem thử trên máy**: `npx next dev -p 3001` rồi mở `http://public.localhost:3001` — tên miền này đóng vai tên miền công khai, chỉ có ở bản dev (`src/lib/hosts.ts`). `localhost:3001` vẫn là khu quản trị.
- **Kiểm tra** (chạy trong `UI/aihoclaptrinh-design-mcp`, cần `python -m http.server 5311` ở thư mục thiết kế): `scripts/kim-compare.mjs [rộng] [dark]` đo từng khối so với thiết kế (đang khớp 31/31 ở 1440, 1100, 390; ở 900 lệch đúng một chỗ là thanh mục lục, do `kim-shell.css` cố ý thu hẹp để chừa chỗ cho cụm nút; phần cao thêm của khối khoá học được trừ đi trước khi so); `scripts/kim-lang-test.mjs` kiểm song ngữ, các nút, số buổi + học phí của 9 khoá và hộp nội dung; `scripts/kim-i18n-check.py <strings.json>` tìm câu thiếu bản dịch và khoá chết trong `i18n-kim.ts`; `scripts/kim-courses-shot.mjs` chụp khối khoá học ở nhiều bề rộng.
- Kiểm thử bằng Playwright: đo "trang có đứng yên không" thì bấm bằng `page.mouse.click(x, y)`. `page.click()` tự cuộn trang trước khi bấm, và chế độ headless ẩn thanh cuộn nên báo trang xê 5px khi mở hộp — cả hai đều không xảy ra trên máy thật (`scripts/kim-syl-debug.mjs` đo đủ ba kiểu thanh cuộn).
- `pkill` trong Git Bash không tắt được `next dev` trên Windows. Tìm PID bằng `netstat -ano | grep :3001` rồi `taskkill //PID <pid> //T //F`, nếu không lần chạy sau sẽ âm thầm nói chuyện với máy chủ cũ.
