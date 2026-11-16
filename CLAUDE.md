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
- **Dòng thời gian "Chặng đường đã qua" cũng viết tay** (`KimYears.tsx` + `kim-journey.css`): mốc thật anh Nghĩa đưa là 2022 bắt đầu, 2023 tốt nghiệp, 2024 nhập ngũ, 2026 xuất ngũ; các năm trong bản thiết kế là số mẫu. Mỗi mốc là một giai đoạn của viên đá (đá thô → kim cương), đường nối đổi chất liệu bạc → thép → vàng. Thanh số liệu đầu trang (`KimProof.tsx`) cũng dùng số thật: 3,5 năm, 120+ dự án, 99% khách hàng hài lòng. Chữ ở các khối này chỉ nói điều anh đã kể; đừng thêm sự kiện.
- **Khung quét 3D trong thẻ dự án LungVision 3D** (`KimOrganScan.tsx` + `organ-scan-engine.ts` + `organ-scan-info.ts` + `kim-organ-scan.css`): mô hình phổi và não thật, mặt quét trượt từng lát, tới lát có khối u thì đánh dấu ở cả lát cắt 2D lẫn khối 3D. Đây là **mô phỏng minh hoạ**, khối u là hình học đặt vào mô hình; trên khung có ghi rõ, đừng bỏ dòng đó.
  - `organ-scan-engine.ts` kéo theo three.js (~650 KB): chỉ được nạp bằng `import()` bên trong `KimOrganScan`, không import thẳng ở đâu khác, nếu không cả trang phải gánh three.js lúc tải.
  - Mô hình trên web ở `public/kim/models/*.glb` (phổi 0,24 MB, não 0,15 MB), sinh từ bản gốc anh Nghĩa đưa ở `models-3D/` (29 MB, **không đưa vào git**) bằng `UI/aihoclaptrinh-design-mcp/scripts/glb-optimize.mjs`. Thay mô hình thì chạy lại script đó; vị trí khối u tự tìm bằng cách bắn tia vào lưới nên không phải gõ lại toạ độ.
  - Hai mô hình lấy từ Sketchfab, giấy phép **CC BY 4.0: bắt buộc ghi tên tác giả + nguồn + giấy phép + "đã chỉnh sửa"**. Dòng ghi công nằm ở góc khung 3D, dữ liệu ở `organ-scan-info.ts`. Đổi mô hình thì đổi luôn dòng này.
  - Khối u và mọi dấu "phát hiện" màu vàng, không dùng đỏ như phần mềm y khoa (luật màu bên dưới).
  - File tĩnh có đuôi mới trong `public/` phải được thêm vào `matcher` cuối `src/middleware.ts`, không thì trên tên miền công khai nó bị đẩy về "/" thay vì được tải (đã dính với `.glb`).
  - Băng chuyền dự án (`KimProjects.tsx`) dừng ở thẻ LungVision 11 giây thay vì 7, và đứng hẳn lại khi người xem đã chạm vào khung quét (sự kiện DOM `kim-proj-pin`); họ tự chọn dự án khác thì chạy lại.
  - Kiểm: `scripts/kim-organ-shot.mjs [lung|brain] [rộng]` chụp từng thời điểm của kịch bản (cần GPU, script tự bật). Bản dev có `window.__kimOrgan.debug(giây)` để nhảy tới một thời điểm; bản đóng gói không có. `scripts/kim-pin-test.mjs [url]` kiểm băng chuyền + khung quét, chạy được trên cả trang thật.
- **Luật màu**: chỉ trắng, bạc, thép, vàng, nâu đất. Không đỏ, hồng, tím, cam (anh Nghĩa mệnh Kim, Hoả khắc Kim). Hiệu ứng mới cũng phải theo luật này.
- **Xem thử trên máy**: `npx next dev -p 3001` rồi mở `http://public.localhost:3001` — tên miền này đóng vai tên miền công khai, chỉ có ở bản dev (`src/lib/hosts.ts`). `localhost:3001` vẫn là khu quản trị.
- **Kiểm tra** (chạy trong `UI/aihoclaptrinh-design-mcp`, cần `python -m http.server 5311` ở thư mục thiết kế): `scripts/kim-compare.mjs [rộng] [dark]` đo từng khối so với thiết kế (đang khớp 31/31 ở 1440, 1100, 900, 390. Ba khối có nội dung cố ý khác thiết kế — thanh số liệu, lưới khoá học, dòng thời gian — khai trong `INTENDED` đầu script: phần cao thấp chênh ra của chúng được trừ đi trước khi so, nên mọi lệch khác vẫn bị bắt. Thêm khối viết tay mới thì thêm tên nó vào đó); `scripts/kim-lang-test.mjs` kiểm song ngữ, các nút, số buổi + học phí của 9 khoá và hộp nội dung; `scripts/kim-i18n-check.py <strings.json>` tìm câu thiếu bản dịch và khoá chết trong `i18n-kim.ts`; `scripts/kim-courses-shot.mjs`, `scripts/kim-journey-shot.mjs`, `scripts/kim-proof-shot.mjs` chụp và đo từng khối viết tay ở nhiều bề rộng; `scripts/kim-live-check.mjs` kiểm trang đang chạy thật sau khi triển khai; `scripts/kim-css-probe.mjs "<selector>" <thuộc tính>` cho biết luật CSS nào đang ăn vào một phần tử.
- Kiểm thử bằng Playwright: đo "trang có đứng yên không" thì bấm bằng `page.mouse.click(x, y)`. `page.click()` tự cuộn trang trước khi bấm, và chế độ headless ẩn thanh cuộn nên báo trang xê 5px khi mở hộp — cả hai đều không xảy ra trên máy thật (`scripts/kim-syl-debug.mjs` đo đủ ba kiểu thanh cuộn).
- **Đẩy lên `main` chưa chắc đã lên trang thật.** Vercel dựng hỏng thì trang cứ lặng lẽ chạy bản cũ (đã gặp ngày 16/11/2026: lần dựng hỏng sau 12 giây dù mã không sai; đẩy một commit rỗng để dựng lại thì qua). Sau mỗi lần đẩy, xem trạng thái thật: `gh api repos/TruongTanNghia/Project-Classroom-Management/commits/<sha>/statuses --jq '.[0].state'` phải ra `success`, rồi mới kiểm nội dung bằng `scripts/kim-live-check.mjs`. Nhật ký dựng của Vercel nằm sau đăng nhập; muốn biết mã có dựng được không thì dựng lại commit đó trong Docker (`node:24`, clone từ `.git`, `npx vercel build --prod` với một `.vercel/project.json` tối thiểu).
- `pkill` trong Git Bash không tắt được `next dev` trên Windows. Tìm PID bằng `netstat -ano | grep :3001` rồi `taskkill //PID <pid> //T //F`, nếu không lần chạy sau sẽ âm thầm nói chuyện với máy chủ cũ.
