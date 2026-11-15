/* TỆP SINH TỰ ĐỘNG từ bản thiết kế "Xưởng Kim" (kim-convert.py). Đừng sửa tay. */
/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import { tKim, type KimLang } from "../i18n-kim";

export default function KimSolutions({ lang }: { lang: KimLang }) {
  const t = (s: string) => tKim(lang, s);
  return (
    <section className="kim-sec" id="kim-solutions" aria-labelledby="kim-solutions-h">
      <div className="kim-head">
        <h2 className="kim-h2" id="kim-solutions-h">{t("Giải pháp trọn gói cho doanh nghiệp")}</h2>
        <p className="kim-note">{t("Mỗi giải pháp đều tuỳ chỉnh được theo quy trình riêng của bạn.")}</p>
      </div>
      <div className="kim-sols">
        <article className="kim-sol">
          <div className="kim-sol-ill" aria-hidden="true">
            <div className="s-chan">
              <span style={{ "--c": "#0068FF" } as CSSProperties}>
                <i />
                {t("Zalo OA")}
              </span>
              <span style={{ "--c": "#6E7781" } as CSSProperties}>
                <i />
                {t("Website")}
              </span>
              <span style={{ "--c": "#C99A3A" } as CSSProperties}>
                <i />
                {t("Trực 24/7")}
              </span>
            </div>
            <div className="s-phone">
              <div className="s-phone-head">
                <i>{t("AI")}</i>
                <div>
                  <b>{t("Trợ lý bán hàng")}</b>
                  <small>{t("Đang trực tuyến")}</small>
                </div>
              </div>
              <div className="s-phone-body">
                <div className="s-in">{t("Áo khoác gió còn size M không shop?")}</div>
                <div className="s-prod">
                  <svg viewBox="0 0 40 40">
                    <path d="M14 8 L20 11 L26 8 L33 13 L30 20 L28 18 V33 H12 V18 L10 20 L7 13 Z" fill="#A9AEB3" stroke="#2F3338" strokeWidth="1.6" strokeLinejoin="round" />
                    <path d="M20 11 V33" stroke="#2F3338" strokeWidth="1.4" />
                    <path d="M15 23 h3" stroke="#2F3338" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  <div>
                    <b>{t("Áo khoác gió, size M")}</b>
                    <small>{t("Còn hàng")}</small>
                  </div>
                </div>
                <div className="s-in">{t("Chốt cho em 1 cái nhé!")}</div>
                <div className="s-out">{t("Đã tạo đơn. Em gửi xác nhận qua Zalo ngay ạ.")}</div>
              </div>
            </div>
            <div className="s-toast">
              <i>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </i>
              {t("Đơn mới đã tạo")}
            </div>
          </div>
          <div className="kim-sol-body">
            <h3>{t("Chatbot bán hàng và chăm sóc khách")}</h3>
            <p>{t("Tư vấn, chốt đơn, chăm khách tự động trên Zalo và website, 24/7.")}</p>
            <div className="kim-sol-foot">
              <div className="kim-tags">
                <span className="kim-tag">{t("Zalo")}</span>
                <span className="kim-tag">{t("Website")}</span>
                <span className="kim-tag">{"24/7"}</span>
              </div>
              <a className="kim-link" href="mailto:aihoclaptrinh@gmail.com?subject=Chatbot%20b%C3%A1n%20h%C3%A0ng">
                {t("Trao đổi về giải pháp này")}
              </a>
            </div>
          </div>
        </article>
        <article className="kim-sol">
          <div className="kim-sol-ill" aria-hidden="true">
            <div className="s-run">
              <header>
                <b>{t("Agent chăm sóc đơn hàng")}</b>
                <span className="m-chip go">{t("Đang chạy")}</span>
              </header>
              <ol className="s-steps">
                <li>
                  <i>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
                    </svg>
                  </i>
                  <div>
                    {t("Đọc tin nhắn mới trên Zalo OA")}
                    <small>{t("Khách hỏi áo khoác gió size M")}</small>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </li>
                <li>
                  <i>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18M3 15h18M9 3v18" />
                    </svg>
                  </i>
                  <div>
                    {t("Tra tồn kho trên Google Sheets")}
                    <small>{t("Còn 12 sản phẩm")}</small>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </li>
                <li>
                  <i>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
                      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                      <path d="M12 17.5v-11" />
                    </svg>
                  </i>
                  <div>
                    {t("Tạo đơn, gửi xác nhận cho khách")}
                    <small>{t("Gửi qua Zalo")}</small>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </li>
                <li>
                  <i>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                      <path d="M10 13H8M16 17H8M16 13h-2" />
                    </svg>
                  </i>
                  <div>
                    {t("Ghi vào báo cáo cuối ngày")}
                    <small>{t("Đang ghi")}</small>
                  </div>
                  <span className="s-spin" />
                </li>
              </ol>
            </div>
          </div>
          <div className="kim-sol-body">
            <h3>{t("AI Agent tự động hoá")}</h3>
            <p>{t("Agent tự nối các ứng dụng, xử lý quy trình từ đầu đến cuối mà không cần người làm tay.")}</p>
            <div className="kim-sol-foot">
              <div className="kim-tags">
                <span className="kim-tag">{t("n8n")}</span>
                <span className="kim-tag">{t("API")}</span>
                <span className="kim-tag">{t("Workflow")}</span>
              </div>
              <a className="kim-link" href="mailto:aihoclaptrinh@gmail.com?subject=AI%20Agent%20t%E1%BB%B1%20%C4%91%E1%BB%99ng%20ho%C3%A1">
                {t("Trao đổi về giải pháp này")}
              </a>
            </div>
          </div>
        </article>
        <article className="kim-sol">
          <div className="kim-sol-ill" aria-hidden="true">
            <div className="s-cam">
              <img src="/kim/scene.jpg" width={960} height={600} alt="" loading="lazy" decoding="async" />
              <span className="m-box" style={{ left: "33%", top: "28.4%", width: "24%", height: "61.6%" }}>
                <b>{t("người 0.97")}</b>
              </span>
              <span className="m-box s" style={{ left: "8%", top: "12.4%", width: "36%", height: "35.2%" }}>
                <b>{t("cây 0.86")}</b>
              </span>
              <span className="m-box s" style={{ left: "76.5%", top: "27.6%", width: "12.5%", height: "13.6%" }}>
                <b>{t("toà nhà 0.91")}</b>
              </span>
              <span className="m-box s" style={{ left: "51%", top: "23.2%", width: "10.5%", height: "14.4%" }}>
                <b>{t("toà nhà 0.88")}</b>
              </span>
              <div className="s-hud">
                <span>{t("Camera cổng chính")}</span>
                <span className="on">{t("Đếm người: 1")}</span>
              </div>
            </div>
          </div>
          <div className="kim-sol-body">
            <h3>{t("Thị giác máy tính")}</h3>
            <p>{t("Nhận diện, đếm, cảnh báo qua camera bằng AI theo thời gian thực.")}</p>
            <div className="kim-sol-foot">
              <div className="kim-tags">
                <span className="kim-tag">{t("YOLO")}</span>
                <span className="kim-tag">{t("OpenCV")}</span>
                <span className="kim-tag">{t("Realtime")}</span>
              </div>
              <a className="kim-link" href="mailto:aihoclaptrinh@gmail.com?subject=Th%E1%BB%8B%20gi%C3%A1c%20m%C3%A1y%20t%C3%ADnh">
                {t("Trao đổi về giải pháp này")}
              </a>
            </div>
          </div>
        </article>
        <article className="kim-sol">
          <div className="kim-sol-ill" aria-hidden="true">
            <div className="s-paper">
              <header>
                <span>{t("Toán 11, kiểm tra 15 phút")}</span>
                <span>{t("Học viên: Minh An")}</span>
              </header>
              <p>{t("Bài 3. Tính đạo hàm của f(x) = x² + 3x")}</p>
              <span className="s-hand">{t("f'(x) = (x²)' + (3x)'")}</span>
              <span className="s-hand">
                <span className="s-wrong">{t("= 2x + 3x")}</span>
                {" "}
                <span className="s-fix">{t("= 2x + 3")}</span>
              </span>
              <p>{t("Bài 4. Tìm cực trị của g(x) = x³ − 3x")}</p>
              <span className="s-hand">{t("g'(x) = 3x² − 3 = 0 khi x = ±1")}</span>
              <span className="s-score">{"8/10"}</span>
            </div>
            <div className="s-note">
              <b>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
                </svg>
                {t("Trợ giảng AI nhận xét")}
              </b>
              {t("Bài 3: đạo hàm của 3x là 3, không phải 3x. Bài 4 làm đúng, nhớ kết luận cực đại, cực tiểu.")}
            </div>
          </div>
          <div className="kim-sol-body">
            <h3>{t("Trợ giảng và chấm bài AI")}</h3>
            <p>{t("Trợ giảng ảo, chấm bài, cá nhân hoá lộ trình cho từng học viên.")}</p>
            <div className="kim-sol-foot">
              <div className="kim-tags">
                <span className="kim-tag">{t("LLM")}</span>
                <span className="kim-tag">{t("Education")}</span>
                <span className="kim-tag">{t("RAG")}</span>
              </div>
              <a className="kim-link" href="mailto:aihoclaptrinh@gmail.com?subject=Tr%E1%BB%A3%20gi%E1%BA%A3ng%20AI">
                {t("Trao đổi về giải pháp này")}
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
