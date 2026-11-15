/* TỆP SINH TỰ ĐỘNG từ bản thiết kế "Xưởng Kim" (kim-convert.py). Đừng sửa tay. */
/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import { tKim, type KimLang } from "../i18n-kim";

export default function KimProjectsView({ lang, enterP, hid, holdClass, leaveP, nextP, pick, prevP, sel }: { lang: KimLang; enterP: () => void; hid: (id: string) => string; holdClass: string; leaveP: () => void; nextP: () => void; pick: (id: string) => () => void; prevP: () => void; sel: (id: string) => boolean }) {
  const t = (s: string) => tKim(lang, s);
  return (
    <section className="kim-sec" id="kim-projects" aria-labelledby="kim-projects-h">
      <div className={"kim-proj " + holdClass} onMouseEnter={enterP} onMouseLeave={leaveP}>
        <div className="kim-head">
          <h2 className="kim-h2" id="kim-projects-h">{t("Những gì tôi đã và đang xây")}</h2>
          <p className="kim-note">
            {t("Chọn một dự án để xem chi tiết. Danh sách tự chuyển sau vài giây, rê chuột vào khung để dừng lại.")}
          </p>
        </div>
        <div className="kim-proj-layout">
          <div className="kim-proj-side">
            <div className="kim-tabs" role="tablist" aria-label={t("Danh sách dự án")}>
              <button type="button" className="kim-tab" role="tab" id="kim-tab-eduflow" aria-controls="kim-panel-eduflow" aria-selected={sel("eduflow")} data-tab="eduflow" onClick={pick("eduflow")}>
                <span className="ic">
                  <svg className="kim-ico" viewBox="0 0 64 64" aria-hidden="true">
                    <rect className="s" x="12.5" y="14.5" width="44" height="38" rx="5" />
                    <rect className="p" x="10" y="12" width="44" height="38" rx="5" />
                    <path className="l" d="M10 20 H54 M22 20 V50" />
                    <path className="g" d="M14 26 h4 M14 31 h4 M14 36 h4" />
                    <rect className="b" x="28" y="36" width="5" height="9" rx="1" />
                    <rect className="b" x="36" y="29" width="5" height="16" rx="1" />
                    <rect className="sl" x="44" y="33" width="5" height="12" rx="1" />
                  </svg>
                </span>
                <span className="t">
                  {t("EduFlow AI")}
                  <small className="st-live">{t("Đang vận hành")}</small>
                </span>
                <span className="bar" aria-hidden="true">
                  <i />
                </span>
              </button>
              <button type="button" className="kim-tab" role="tab" id="kim-tab-vision" aria-controls="kim-panel-vision" aria-selected={sel("vision")} data-tab="vision" onClick={pick("vision")}>
                <span className="ic">
                  <svg className="kim-ico" viewBox="0 0 64 64" aria-hidden="true">
                    <path className="l" d="M8 19 V8 H19 M45 8 H56 V19 M56 45 V56 H45 M19 56 H8 V45" />
                    <circle className="s" cx="34.5" cy="34.5" r="15" />
                    <circle className="p" cx="32" cy="32" r="15" />
                    <circle className="rb" cx="32" cy="32" r="9.5" />
                    <circle className="k" cx="32" cy="32" r="4.6" />
                    <circle className="w" cx="29.6" cy="29.6" r="1.7" />
                  </svg>
                </span>
                <span className="t">
                  {t("Nền tảng AI Camera đa ngành")}
                  <small className="st-building">{t("Đang phát triển")}</small>
                </span>
                <span className="bar" aria-hidden="true">
                  <i />
                </span>
              </button>
              <button type="button" className="kim-tab" role="tab" id="kim-tab-assistant" aria-controls="kim-panel-assistant" aria-selected={sel("assistant")} data-tab="assistant" onClick={pick("assistant")}>
                <span className="ic">
                  <svg className="kim-ico" viewBox="0 0 64 64" aria-hidden="true">
                    <path className="s" transform="translate(2.5 2.5)" d="M13 12 H51 a4 4 0 0 1 4 4 V37 a4 4 0 0 1 -4 4 H29 L20 49 V41 H13 a4 4 0 0 1 -4 -4 V16 a4 4 0 0 1 4 -4 Z" />
                    <path className="p" d="M13 12 H51 a4 4 0 0 1 4 4 V37 a4 4 0 0 1 -4 4 H29 L20 49 V41 H13 a4 4 0 0 1 -4 -4 V16 a4 4 0 0 1 4 -4 Z" />
                    <rect className="b" x="15" y="18" width="12" height="5" rx="2.5" />
                    <rect className="sl" x="29" y="18" width="8" height="5" rx="2.5" />
                    <rect className="b" x="39" y="18" width="10" height="5" rx="2.5" />
                    <rect className="sl" x="15" y="26" width="7" height="5" rx="2.5" />
                    <rect className="b" x="24" y="26" width="14" height="5" rx="2.5" />
                    <rect className="sl" x="40" y="26" width="9" height="5" rx="2.5" />
                    <rect className="sl" x="15" y="34" width="10" height="2" rx="1" />
                    <path className="l" d="M45 52 l3 3 l6 -7" />
                  </svg>
                </span>
                <span className="t">
                  {t("Trợ lý số ngành Giáo dục")}
                  <small className="st-demo">{t("Bản demo")}</small>
                </span>
                <span className="bar" aria-hidden="true">
                  <i />
                </span>
              </button>
              <button type="button" className="kim-tab" role="tab" id="kim-tab-cnc" aria-controls="kim-panel-cnc" aria-selected={sel("cnc")} data-tab="cnc" onClick={pick("cnc")}>
                <span className="ic">
                  <svg className="kim-ico" viewBox="0 0 64 64" aria-hidden="true">
                    <circle className="s" cx="34.5" cy="34.5" r="17" />
                    <circle className="gear" cx="32" cy="32" r="17" />
                    <circle className="p" cx="32" cy="32" r="13.5" />
                    <circle className="bl" cx="32" cy="32" r="5.4" />
                    <path className="l" d="M10 56 H54" />
                  </svg>
                </span>
                <span className="t">
                  {t("Giám sát máy CNC qua camera")}
                  <small className="st-client">{t("Dự án khách hàng")}</small>
                </span>
                <span className="bar" aria-hidden="true">
                  <i />
                </span>
              </button>
              <button type="button" className="kim-tab" role="tab" id="kim-tab-lung" aria-controls="kim-panel-lung" aria-selected={sel("lung")} data-tab="lung" onClick={pick("lung")}>
                <span className="ic">
                  <svg className="kim-ico" viewBox="0 0 64 64" aria-hidden="true">
                    <path className="s" transform="translate(2.5 2.5)" d="M29 22 C 22 18, 12 28, 12 40 C 12 49, 18 53, 25 50.5 C 29 49, 30 45, 30 40 Z" />
                    <path className="s" transform="translate(2.5 2.5)" d="M35 22 C 42 18, 52 28, 52 40 C 52 49, 46 53, 39 50.5 C 35 49, 34 45, 34 40 Z" />
                    <path className="p" d="M29 22 C 22 18, 12 28, 12 40 C 12 49, 18 53, 25 50.5 C 29 49, 30 45, 30 40 Z" />
                    <path className="p" d="M35 22 C 42 18, 52 28, 52 40 C 52 49, 46 53, 39 50.5 C 35 49, 34 45, 34 40 Z" />
                    <path className="l" d="M32 9 V27 M32 27 C 30 30, 27.5 31.5, 24.5 33 M32 27 C 34 30, 36.5 31.5, 39.5 33" />
                    <path className="g" d="M17 38 C 20 37, 22 38, 24 41 M47 38 C 44 37, 42 38, 40 41" />
                    <circle className="bl" cx="19.5" cy="31.5" r="3.4" />
                  </svg>
                </span>
                <span className="t">
                  {t("LungVision 3D")}
                  <small className="st-rnd">{t("Nghiên cứu (R&D)")}</small>
                </span>
                <span className="bar" aria-hidden="true">
                  <i />
                </span>
              </button>
              <button type="button" className="kim-tab" role="tab" id="kim-tab-rl" aria-controls="kim-panel-rl" aria-selected={sel("rl")} data-tab="rl" onClick={pick("rl")}>
                <span className="ic">
                  <svg className="kim-ico" viewBox="0 0 64 64" aria-hidden="true">
                    <rect className="s" x="14.5" y="14.5" width="36" height="36" rx="3" />
                    <rect className="p" x="12" y="12" width="36" height="36" rx="3" />
                    <rect className="o" x="36" y="12" width="12" height="12" />
                    <path className="g" d="M24 12 V48 M36 12 V48 M12 24 H48 M12 36 H48" />
                    <rect className="l" x="12" y="12" width="36" height="36" rx="3" />
                    <path className="l" d="M40 21.5 V14.5 L45.5 16.6 L40 18.8" />
                    <path className="pb" d="M18 42 H30 V30 H42 V24" />
                    <circle className="bl" cx="18" cy="42" r="4.4" />
                    <path className="l" d="M53 21 A11 11 0 0 1 53 41" />
                    <path className="l" d="M50 38.5 L53 41.5 L56.2 38.6" />
                  </svg>
                </span>
                <span className="t">
                  {t("RL Lab, 20 dự án học tăng cường")}
                  <small className="st-building">{t("Đang phát triển")}</small>
                </span>
                <span className="bar" aria-hidden="true">
                  <i />
                </span>
              </button>
              <button type="button" className="kim-tab" role="tab" id="kim-tab-straw" aria-controls="kim-panel-straw" aria-selected={sel("straw")} data-tab="straw" onClick={pick("straw")}>
                <span className="ic">
                  <svg className="kim-ico" viewBox="0 0 64 64" aria-hidden="true">
                    <path className="s" d="M16.5 54.5 H42.5 L39.5 47.5 H19.5 Z" />
                    <path className="p" d="M14 52 H40 L37 45 H17 Z" />
                    <path className="l" d="M9 52.5 H45" />
                    <path className="arm" d="M27 44 L21 25 L42 17" />
                    <path className="arm2" d="M27 44 L21 25 L42 17" />
                    <circle className="bl" cx="27" cy="44" r="4.4" />
                    <circle className="bl" cx="21" cy="25" r="4" />
                    <circle className="bl" cx="42" cy="17" r="3.4" />
                    <rect className="o" x="50" y="13.5" width="7" height="7" rx="1" />
                    <path className="l" d="M44.5 13 L50.5 11 L53 13.5 M44.5 21 L50.5 23 L53 20.5" />
                  </svg>
                </span>
                <span className="t">
                  {t("Robot thu hoạch dâu tây")}
                  <small className="st-rnd">{t("Nghiên cứu (R&D)")}</small>
                </span>
                <span className="bar" aria-hidden="true">
                  <i />
                </span>
              </button>
            </div>
            <div className="kim-proj-cta">
              <b>{t("Có bài toán tương tự?")}</b>
              <p>{t("Kể tôi nghe quy trình hiện tại của bạn, tôi đề xuất hướng ứng dụng AI phù hợp.")}</p>
              <a className="kim-btn kim-btn-brass" href="mailto:aihoclaptrinh@gmail.com?subject=H%E1%BB%A3p%20t%C3%A1c%20AI">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                {t("Trao đổi dự án")}
              </a>
            </div>
          </div>
          <div>
            <div className={"kim-panel " + hid("eduflow")} role="tabpanel" id="kim-panel-eduflow" aria-labelledby="kim-tab-eduflow" data-panel="eduflow">
              <div className="kim-shot">
                <div className="kim-win" aria-hidden="true">
                  <div className="kim-win-bar">
                    <i />
                    <i />
                    <i />
                    <b>{t("EduFlow AI, Tổng quan")}</b>
                    <span>{t("Bảng điều khiển trung tâm")}</span>
                  </div>
                  <div className="kim-win-body m-ef">
                    <aside className="m-ef-side">
                      <div className="m-ef-brand">
                        <span className="m-ef-logo">{t("E")}</span>
                        {t("EduFlow")}
                      </div>
                      <div className="m-ef-nav">
                        <span className="on">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <rect x="3" y="3" width="7" height="9" rx="1" />
                            <rect x="14" y="3" width="7" height="5" rx="1" />
                            <rect x="14" y="12" width="7" height="9" rx="1" />
                            <rect x="3" y="16" width="7" height="5" rx="1" />
                          </svg>
                          {t("Tổng quan")}
                        </span>
                        <span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                          </svg>
                          {t("Lớp học")}
                        </span>
                        <span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                          {t("Học viên")}
                        </span>
                        <span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="m9 11 3 3L22 4" />
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                          </svg>
                          {t("Điểm danh")}
                        </span>
                        <span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                            <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
                          </svg>
                          {t("Học phí")}
                        </span>
                        <span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
                          </svg>
                          {t("Zalo Bot")}
                        </span>
                      </div>
                    </aside>
                    <div className="m-ef-main">
                      <div className="m-ef-top">
                        <b>{t("Lịch hôm nay")}</b>
                        <span className="m-seg">
                          <i className="on">{t("VI")}</i>
                          <i>{t("EN")}</i>
                        </span>
                        <span className="m-ibtn">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="12" cy="12" r="4" />
                            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                          </svg>
                        </span>
                      </div>
                      <div className="m-ef-row">
                        <time>{"08:00"}</time>
                        <div>
                          <b>{t("Scratch thiếu nhi")}</b>
                          <small>{t("Phòng 1")}</small>
                        </div>
                        <span className="m-chip ok">{t("Đã điểm danh")}</span>
                      </div>
                      <div className="m-ef-row">
                        <time>{"18:00"}</time>
                        <div>
                          <b>{t("Python cơ bản")}</b>
                          <small>{t("Phòng 2")}</small>
                        </div>
                        <span className="m-chip go">{t("Sắp bắt đầu")}</span>
                      </div>
                      <div className="m-ef-row">
                        <time>{"19:30"}</time>
                        <div>
                          <b>{t("Lập trình AI nâng cao")}</b>
                          <small>{t("Học trực tuyến")}</small>
                        </div>
                        <span className="m-chip">{t("Chưa bắt đầu")}</span>
                      </div>
                      <div className="m-ef-att">
                        <span>
                          <i>{t("AN")}</i>
                          <i>{t("BH")}</i>
                          <i>{t("MK")}</i>
                          <i>{t("TL")}</i>
                        </span>
                        {t("Điểm danh lớp Scratch đã lưu, phụ huynh nhận thông báo qua Zalo.")}
                      </div>
                    </div>
                    <aside className="m-ef-zalo">
                      <header>
                        <i>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
                          </svg>
                        </i>
                        {t("Zalo Bot nhắc học phí")}
                      </header>
                      <div className="m-bubble">
                        {t("Chào phụ huynh bé An, học phí tháng 11 lớp Scratch thiếu nhi đến hạn ngày 15. Biên lai được gửi ngay khi thanh toán xong.")}
                      </div>
                      <div className="m-file">
                        <i>{t("PDF")}</i>
                        {t("Biên lai tháng 10")}
                      </div>
                      <small>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                        {t("Gửi tự động lúc 07:30")}
                      </small>
                    </aside>
                  </div>
                </div>
              </div>
              <div className="kim-panel-body">
                <div className="kim-panel-meta">
                  <div>
                    <span className="kim-status st-live">{t("Đang vận hành")}</span>
                    <span className="kim-cat">{t("Sản phẩm giáo dục của AIhoclaptrinh")}</span>
                  </div>
                  <div className="kim-pager">
                    <button type="button" aria-label={t("Dự án trước")} onClick={prevP}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </button>
                    <span>{"1 / 7"}</span>
                    <button type="button" aria-label={t("Dự án tiếp theo")} onClick={nextP}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>
                <h3 className="kim-panel-title">{t("EduFlow AI, nền tảng quản lý lớp học")}</h3>
                <p className="kim-panel-desc">
                  {t("Chính nền tảng bạn đang xem: quản lý học viên, lịch học, điểm danh và học phí cho trung tâm đào tạo.")}
                </p>
                <ul className="kim-points">
                  <li>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span>{t("Học viên, lịch học, điểm danh, học phí trong một nơi")}</span>
                  </li>
                  <li>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span>{t("Tự nhắc lịch, nhắc học phí và gửi biên lai qua Zalo Bot")}</span>
                  </li>
                  <li>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span>{t("Song ngữ Việt và Anh, giao diện sáng và tối")}</span>
                  </li>
                </ul>
                <div className="kim-tags">
                  <span className="kim-tag">{t("Next.js")}</span>
                  <span className="kim-tag">{t("Supabase")}</span>
                  <span className="kim-tag">{t("Zalo API")}</span>
                </div>
              </div>
            </div>
            <div className={"kim-panel " + hid("vision")} role="tabpanel" id="kim-panel-vision" aria-labelledby="kim-tab-vision" data-panel="vision">
              <div className="kim-shot">
                <div className="kim-win" aria-hidden="true">
                  <div className="kim-win-bar">
                    <i />
                    <i />
                    <i />
                    <b>{t("AI Camera, Trường học")}</b>
                    <span>{t("4 camera đang theo dõi")}</span>
                  </div>
                  <div className="kim-win-body m-cam">
                    <div className="m-feeds">
                      <div className="m-feed">
                        <img src="/kim/scene.jpg" width={960} height={600} alt="" loading="lazy" decoding="async" />
                        <span className="m-feed-label">{t("CAM 01 Cổng chính")}</span>
                        <span className="m-box" style={{ left: "33%", top: "28.4%", width: "24%", height: "61.6%" }}>
                          <b>{t("người 0.97")}</b>
                        </span>
                        <span className="m-box s" style={{ left: "8%", top: "12.4%", width: "36%", height: "35.2%" }}>
                          <b>{t("cây 0.86")}</b>
                        </span>
                      </div>
                      <div className="m-feed flip">
                        <img src="/kim/scene.jpg" width={960} height={600} alt="" loading="lazy" decoding="async" />
                        <span className="m-feed-label">{t("CAM 02 Sân trường")}</span>
                        <span className="m-box" style={{ left: "43%", top: "28.4%", width: "24%", height: "61.6%" }}>
                          <b>{t("người 0.95")}</b>
                        </span>
                      </div>
                      <div className="m-feed ir">
                        <img src="/kim/scene.jpg" width={960} height={600} alt="" loading="lazy" decoding="async" />
                        <span className="m-feed-label">{t("CAM 03 Hành lang, hồng ngoại")}</span>
                        <span className="m-box s" style={{ left: "33%", top: "28.4%", width: "24%", height: "61.6%" }}>
                          <b>{t("người 0.93")}</b>
                        </span>
                      </div>
                      <div className="m-feed zoom alert">
                        <img src="/kim/scene.jpg" width={960} height={600} alt="" loading="lazy" decoding="async" />
                        <span className="m-feed-label">{t("CAM 04 Khu hạn chế")}</span>
                        <span className="m-box s" style={{ left: "69.7%", top: "25.7%", width: "22.5%", height: "24.5%" }}>
                          <b>{t("toà nhà")}</b>
                        </span>
                        <span className="m-box s" style={{ left: "23.8%", top: "17.8%", width: "18.9%", height: "25.9%" }}>
                          <b>{t("toà nhà")}</b>
                        </span>
                        <span className="m-zone">
                          <b>{t("Vùng hạn chế")}</b>
                        </span>
                      </div>
                    </div>
                    <div className="m-events">
                      <header>
                        {t("Sự kiện")}
                        <span className="m-chip go">{t("Trực tiếp")}</span>
                      </header>
                      <div className="m-ev" style={{ "--c": "#C99A3A" } as CSSProperties}>
                        <i />
                        <div>
                          <b>{t("Có người vào vùng hạn chế")}</b>
                          <small>
                            <span>{t("CAM 04")}</span>
                            <span>{"14:32"}</span>
                          </small>
                        </div>
                      </div>
                      <div className="m-ev" style={{ "--c": "#6E7781" } as CSSProperties}>
                        <i />
                        <div>
                          <b>{t("Khuôn mặt đã đăng ký")}</b>
                          <small>
                            <span>{t("CAM 01")}</span>
                            <span>{"14:30"}</span>
                          </small>
                        </div>
                      </div>
                      <div className="m-ev" style={{ "--c": "#6E7781" } as CSSProperties}>
                        <i />
                        <div>
                          <b>{t("Ghi nhận biển số xe vào cổng")}</b>
                          <small>
                            <span>{t("CAM 01")}</span>
                            <span>{"14:26"}</span>
                          </small>
                        </div>
                      </div>
                      <div className="m-ev" style={{ "--c": "#A9AEB3" } as CSSProperties}>
                        <i />
                        <div>
                          <b>{t("Tụ tập đông người ở sân")}</b>
                          <small>
                            <span>{t("CAM 02")}</span>
                            <span>{"14:19"}</span>
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="kim-panel-body">
                <div className="kim-panel-meta">
                  <div>
                    <span className="kim-status st-building">{t("Đang phát triển")}</span>
                    <span className="kim-cat">{t("Thị giác máy tính")}</span>
                  </div>
                  <div className="kim-pager">
                    <button type="button" aria-label={t("Dự án trước")} onClick={prevP}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </button>
                    <span>{"2 / 7"}</span>
                    <button type="button" aria-label={t("Dự án tiếp theo")} onClick={nextP}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>
                <h3 className="kim-panel-title">{t("Nền tảng AI Camera đa ngành")}</h3>
                <p className="kim-panel-desc">
                  {t("Một lõi phát hiện, bám đối tượng, nhận dạng và cảnh báo, tách thành web app riêng cho giao thông, trường học, nông nghiệp, xây dựng, y tế.")}
                </p>
                <ul className="kim-points">
                  <li>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span>{t("Nhận diện khuôn mặt, biển số, hành vi, vùng cấm")}</span>
                  </li>
                  <li>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span>{t("Luật cảnh báo và dashboard sự kiện theo thời gian thực")}</span>
                  </li>
                </ul>
                <div className="kim-tags">
                  <span className="kim-tag">{t("YOLO")}</span>
                  <span className="kim-tag">{t("Tracking")}</span>
                  <span className="kim-tag">{t("FastAPI")}</span>
                </div>
              </div>
            </div>
            <div className={"kim-panel " + hid("assistant")} role="tabpanel" id="kim-panel-assistant" aria-labelledby="kim-tab-assistant" data-panel="assistant">
              <div className="kim-shot">
                <div className="kim-win" aria-hidden="true">
                  <div className="kim-win-bar">
                    <i />
                    <i />
                    <i />
                    <b>{t("Trợ lý số ngành Giáo dục, bản demo")}</b>
                    <span>{t("Zalo OA")}</span>
                  </div>
                  <div className="kim-win-body m-chat">
                    <div className="m-chat-body">
                      <div className="m-q">{t("Tối nay có trận bóng đá nào hay không em?")}</div>
                      <div className="m-a">
                        <span>{t("Câu này nằm ngoài phạm vi hỗ trợ. Em chuyển anh/chị sang cán bộ phụ trách nhé.")}</span>
                        <span className="m-hand">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          {t("Đã chuyển cho cán bộ")}
                        </span>
                      </div>
                      <div className="m-q">{t("Hồ sơ chuyển trường cho học sinh THCS gồm những gì ạ?")}</div>
                      <div className="m-a">
                        <span>{t("Dạ, hồ sơ cần chuẩn bị gồm:")}</span>
                        <ol>
                          <li>{t("Đơn đề nghị chuyển trường")}</li>
                          <li>{t("Học bạ bản chính")}</li>
                          <li>{t("Giấy giới thiệu chuyển trường")}</li>
                        </ol>
                        <div className="m-cite">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                            <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                            <path d="M7 21h10" />
                            <path d="M12 3v18" />
                            <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
                          </svg>
                          <span>
                            <b>{t("Căn cứ pháp lý:")}</b>
                            {" "}{t("trích nguyên văn điều khoản trong văn bản quy định, kèm số hiệu và trang.")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="m-input">
                      {t("Hỏi về thủ tục, tuyển sinh, chế độ chính sách…")}
                      <i>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
                          <path d="m21.854 2.147-10.94 10.939" />
                        </svg>
                      </i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="kim-panel-body">
                <div className="kim-panel-meta">
                  <div>
                    <span className="kim-status st-demo">{t("Bản demo")}</span>
                    <span className="kim-cat">{t("LLM và chatbot")}</span>
                  </div>
                  <div className="kim-pager">
                    <button type="button" aria-label={t("Dự án trước")} onClick={prevP}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </button>
                    <span>{"3 / 7"}</span>
                    <button type="button" aria-label={t("Dự án tiếp theo")} onClick={nextP}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>
                <h3 className="kim-panel-title">{t("Trợ lý số ngành Giáo dục")}</h3>
                <p className="kim-panel-desc">
                  {t("Giải đáp thủ tục, tuyển sinh, chế độ chính sách. Mỗi câu trả lời kèm thẻ căn cứ pháp lý, câu ngoài phạm vi chuyển cho cán bộ.")}
                </p>
                <ul className="kim-points">
                  <li>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span>{t("Trả lời có trích dẫn nguyên văn điều khoản")}</span>
                  </li>
                  <li>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span>{t("Từ chối câu ngoài phạm vi, chuyển người thật")}</span>
                  </li>
                </ul>
                <div className="kim-tags">
                  <span className="kim-tag">{t("RAG")}</span>
                  <span className="kim-tag">{t("LLM")}</span>
                  <span className="kim-tag">{t("Zalo OA")}</span>
                </div>
              </div>
            </div>
            <div className={"kim-panel " + hid("cnc")} role="tabpanel" id="kim-panel-cnc" aria-labelledby="kim-tab-cnc" data-panel="cnc">
              <div className="kim-shot">
                <div className="kim-win" aria-hidden="true">
                  <div className="kim-win-bar">
                    <i />
                    <i />
                    <i />
                    <b>{t("Giám sát máy CNC, xưởng gia công")}</b>
                    <span>{t("Cập nhật mỗi giây")}</span>
                  </div>
                  <div className="kim-win-body m-cnc">
                    <div className="m-cnc-top">
                      <b>{t("Ca sáng, 06:00 đến 14:00")}</b>
                      <span className="m-leg">
                        <i style={{ background: "#C99A3A" }} />
                        {t("Máy chạy")}
                      </span>
                      <span className="m-leg">
                        <i style={{ background: "#CBD0D2" }} />
                        {t("Máy dừng")}
                      </span>
                    </div>
                    <div className="m-mach">
                      <div className="m-mach-id">
                        <span className="m-thumb">
                          <svg viewBox="0 0 56 40" aria-hidden="true">
                            <rect width="56" height="40" fill="#2F3338" />
                            <rect x="9" y="6" width="38" height="28" rx="2" fill="#4B5158" stroke="#8A9096" strokeWidth=".8" />
                            <rect x="13" y="10" width="20" height="15" rx="1" fill="#1F2226" stroke="#8A9096" strokeWidth=".8" />
                            <rect x="21" y="10" width="4" height="7" fill="#A9AEB3" />
                            <path d="M23 17 v3.5" stroke="#E3BA55" strokeWidth="1.8" strokeLinecap="round" />
                            <rect x="15" y="22" width="16" height="2" fill="#6A7077" />
                            <rect x="36" y="10" width="8" height="6" rx="1" fill="#1F2226" />
                            <circle cx="38" cy="21" r="1.3" fill="#E3BA55" />
                            <circle cx="42" cy="21" r="1.3" fill="#6A7077" />
                            <rect x="5" y="34" width="46" height="3" fill="#3A3F45" />
                          </svg>
                        </span>
                        <div>
                          <b>{t("CNC-01")}</b>
                          <small style={{ "--c": "#C99A3A" } as CSSProperties}>{t("Đang chạy")}</small>
                        </div>
                      </div>
                      <div className="m-tl">
                        <i className="r" style={{ width: "34%" }} />
                        <i className="d" style={{ width: "6%" }} />
                        <i className="r" style={{ width: "28%" }} />
                        <i className="d" style={{ width: "4%" }} />
                        <i className="r" style={{ width: "28%" }} />
                      </div>
                    </div>
                    <div className="m-mach">
                      <div className="m-mach-id">
                        <span className="m-thumb">
                          <svg viewBox="0 0 56 40" aria-hidden="true">
                            <rect width="56" height="40" fill="#2F3338" />
                            <rect x="9" y="6" width="38" height="28" rx="2" fill="#4B5158" stroke="#8A9096" strokeWidth=".8" />
                            <rect x="13" y="10" width="20" height="15" rx="1" fill="#1F2226" stroke="#8A9096" strokeWidth=".8" />
                            <rect x="21" y="10" width="4" height="7" fill="#A9AEB3" />
                            <path d="M23 17 v3.5" stroke="#A9AEB3" strokeWidth="1.8" strokeLinecap="round" />
                            <rect x="15" y="22" width="16" height="2" fill="#6A7077" />
                            <rect x="36" y="10" width="8" height="6" rx="1" fill="#1F2226" />
                            <circle cx="38" cy="21" r="1.3" fill="#6A7077" />
                            <circle cx="42" cy="21" r="1.3" fill="#6A7077" />
                            <rect x="5" y="34" width="46" height="3" fill="#3A3F45" />
                          </svg>
                        </span>
                        <div>
                          <b>{t("CNC-02")}</b>
                          <small style={{ "--c": "#A9AEB3" } as CSSProperties}>{t("Đang dừng")}</small>
                        </div>
                      </div>
                      <div className="m-tl">
                        <i className="r" style={{ width: "22%" }} />
                        <i className="d" style={{ width: "12%" }} />
                        <i className="r" style={{ width: "38%" }} />
                        <i className="d" style={{ width: "28%" }} />
                      </div>
                    </div>
                    <div className="m-mach">
                      <div className="m-mach-id">
                        <span className="m-thumb">
                          <svg viewBox="0 0 56 40" aria-hidden="true">
                            <rect width="56" height="40" fill="#2F3338" />
                            <rect x="9" y="6" width="38" height="28" rx="2" fill="#4B5158" stroke="#8A9096" strokeWidth=".8" />
                            <rect x="13" y="10" width="20" height="15" rx="1" fill="#1F2226" stroke="#8A9096" strokeWidth=".8" />
                            <rect x="21" y="10" width="4" height="7" fill="#A9AEB3" />
                            <path d="M23 17 v3.5" stroke="#E3BA55" strokeWidth="1.8" strokeLinecap="round" />
                            <rect x="15" y="22" width="16" height="2" fill="#6A7077" />
                            <rect x="36" y="10" width="8" height="6" rx="1" fill="#1F2226" />
                            <circle cx="38" cy="21" r="1.3" fill="#E3BA55" />
                            <circle cx="42" cy="21" r="1.3" fill="#6A7077" />
                            <rect x="5" y="34" width="46" height="3" fill="#3A3F45" />
                          </svg>
                        </span>
                        <div>
                          <b>{t("CNC-03")}</b>
                          <small style={{ "--c": "#C99A3A" } as CSSProperties}>{t("Đang chạy")}</small>
                        </div>
                      </div>
                      <div className="m-tl">
                        <i className="r" style={{ width: "46%" }} />
                        <i className="d" style={{ width: "9%" }} />
                        <i className="r" style={{ width: "31%" }} />
                        <i className="d" style={{ width: "3%" }} />
                        <i className="r" style={{ width: "11%" }} />
                      </div>
                    </div>
                    <div className="m-axis">
                      <span>{"06:00"}</span>
                      <span>{"08:00"}</span>
                      <span>{"10:00"}</span>
                      <span>{"12:00"}</span>
                      <span>{"14:00"}</span>
                    </div>
                    <div className="m-foot">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
                      </svg>
                      {t("Đọc trạng thái từ camera RTSP có sẵn trong xưởng, chạy không cần GPU.")}
                    </div>
                  </div>
                </div>
              </div>
              <div className="kim-panel-body">
                <div className="kim-panel-meta">
                  <div>
                    <span className="kim-status st-client">{t("Dự án khách hàng")}</span>
                    <span className="kim-cat">{t("Công nghiệp")}</span>
                  </div>
                  <div className="kim-pager">
                    <button type="button" aria-label={t("Dự án trước")} onClick={prevP}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </button>
                    <span>{"4 / 7"}</span>
                    <button type="button" aria-label={t("Dự án tiếp theo")} onClick={nextP}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>
                <h3 className="kim-panel-title">{t("Giám sát máy CNC qua camera")}</h3>
                <p className="kim-panel-desc">
                  {t("Đếm thời gian máy chạy và dừng từ camera RTSP có sẵn trong xưởng, không cần GPU, có dashboard theo dõi nhiều máy.")}
                </p>
                <div className="kim-tags">
                  <span className="kim-tag">{t("OpenCV")}</span>
                  <span className="kim-tag">{t("RTSP")}</span>
                  <span className="kim-tag">{t("FastAPI")}</span>
                </div>
              </div>
            </div>
            <div className={"kim-panel " + hid("lung")} role="tabpanel" id="kim-panel-lung" aria-labelledby="kim-tab-lung" data-panel="lung">
              <div className="kim-shot">
                <div className="kim-win" aria-hidden="true">
                  <div className="kim-win-bar">
                    <i />
                    <i />
                    <i />
                    <b>{t("LungVision 3D")}</b>
                    <span>{t("Bản nghiên cứu")}</span>
                  </div>
                  <div className="kim-win-body m-lung">
                    <div className="m-ct">
                      <div className="m-ct-h">
                        <span>{t("Lát cắt ngang")}</span>
                        <span>{t("Ảnh CT")}</span>
                      </div>
                      <svg viewBox="0 0 200 170" aria-hidden="true" fontFamily="Archivo, ui-sans-serif, sans-serif">
                        <ellipse cx="100" cy="88" rx="88" ry="70" fill="#5A6066" />
                        <ellipse cx="100" cy="88" rx="81" ry="63" fill="#3B4045" />
                        <path d="M92 40 C 70 32, 40 44, 33 70 C 27 94, 36 122, 58 130 C 76 136, 90 126, 92 110 Z" fill="#0B0C0E" />
                        <path d="M108 40 C 130 32, 160 44, 167 70 C 173 94, 164 122, 142 130 C 124 136, 110 126, 108 110 Z" fill="#0B0C0E" />
                        <path d="M60 60 C 66 72, 64 90, 70 104 M48 86 C 58 92, 70 96, 82 94 M140 60 C 134 72, 136 90, 130 104 M152 86 C 142 92, 130 96, 118 94" fill="none" stroke="#2A2E33" strokeWidth="1.4" />
                        <ellipse cx="114" cy="100" rx="21" ry="18" fill="#6A7077" />
                        <circle cx="100" cy="62" r="6" fill="#0B0C0E" stroke="#6A7077" strokeWidth="1.5" />
                        <circle cx="100" cy="141" r="10" fill="#C8CCCF" />
                        <circle cx="100" cy="141" r="5" fill="#8A9096" />
                        <circle cx="56" cy="62" r="4" fill="#E2E4E5" />
                        <circle cx="56" cy="62" r="10" fill="none" stroke="#E3BA55" strokeWidth="1.6" />
                        <path d="M56 46 v6 M56 72 v6 M40 62 h6 M66 62 h6" stroke="#E3BA55" strokeWidth="1.4" />
                        <text x="70" y="50" fontSize="9" fontWeight="700" fill="#E3BA55">{t("Nốt 1")}</text>
                        <text x="8" y="14" fontSize="8" fill="#8A9096">{t("P")}</text>
                        <text x="186" y="14" fontSize="8" fill="#8A9096">{t("T")}</text>
                      </svg>
                      <div className="m-slider">
                        <em>{t("Lát 142")}</em>
                        <span />
                        <em>{"310"}</em>
                      </div>
                    </div>
                    <div className="m-3d">
                      <svg viewBox="0 0 360 270" aria-hidden="true">
                        <defs>
                          <radialGradient id="kimLung" cx="45%" cy="40%" r="70%">
                            <stop offset="0" stopColor="#4B5158" />
                            <stop offset="1" stopColor="#23272B" />
                          </radialGradient>
                        </defs>
                        <path d="M168 52 C 130 30, 70 70, 62 140 C 56 196, 86 236, 128 232 C 156 229, 168 205, 168 180 Z" fill="url(#kimLung)" stroke="#6A7077" strokeWidth="1.5" />
                        <path d="M192 52 C 230 30, 290 70, 298 140 C 304 196, 274 236, 232 232 C 204 229, 192 205, 192 180 Z" fill="url(#kimLung)" stroke="#6A7077" strokeWidth="1.5" />
                        <path d="M74 110 C 100 100, 140 104, 166 112 M66 150 C 98 140, 140 146, 168 154 M80 196 C 106 186, 140 190, 166 196 M122 44 C 106 100, 104 170, 116 232 M90 76 C 84 120, 84 180, 98 222 M286 110 C 260 100, 220 104, 194 112 M294 150 C 262 140, 220 146, 192 154 M280 196 C 254 186, 220 190, 194 196 M238 44 C 254 100, 256 170, 244 232 M270 76 C 276 120, 276 180, 262 222" fill="none" stroke="#5A6066" strokeWidth="1" opacity="0.7" />
                        <path d="M180 12 V70" stroke="#A9AEB3" strokeWidth="8" strokeLinecap="round" />
                        <path d="M180 70 C 170 82, 158 88, 150 93 M180 70 C 190 82, 202 88, 210 93" fill="none" stroke="#A9AEB3" strokeWidth="5" strokeLinecap="round" />
                        <path d="M150 93 C 140 110, 128 120, 112 128 M150 93 C 146 116, 146 136, 140 158 M140 98 C 128 96, 118 90, 108 82 M210 93 C 220 110, 232 120, 248 128 M210 93 C 214 116, 214 136, 220 158 M220 98 C 232 96, 242 90, 252 82" fill="none" stroke="#8A9096" strokeWidth="2.4" strokeLinecap="round" />
                        <circle cx="112" cy="92" r="17" fill="none" stroke="#E3BA55" strokeWidth="1.2" opacity="0.6" />
                        <circle cx="112" cy="92" r="9" fill="#E3BA55" stroke="#8E6A22" strokeWidth="1.5" />
                        <circle cx="109" cy="89" r="2.6" fill="#F6E3B0" />
                        <path d="M124 84 L246 30" stroke="#E3BA55" strokeWidth="1.2" strokeDasharray="4 3" />
                      </svg>
                      <div className="m-callout">
                        <b>{t("Nốt nghi ngờ số 1")}</b>
                        <span>{t("Thuỳ trên phổi phải")}</span>
                        <span>{t("Đánh dấu ở lát 142")}</span>
                      </div>
                      <div className="m-tools">
                        <span className="on">{t("Xoay")}</span>
                        <span>{t("Thu phóng")}</span>
                        <span>{t("Ẩn mạch máu")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="kim-panel-body">
                <div className="kim-panel-meta">
                  <div>
                    <span className="kim-status st-rnd">{t("Nghiên cứu (R&D)")}</span>
                    <span className="kim-cat">{t("Y tế, ảnh CT")}</span>
                  </div>
                  <div className="kim-pager">
                    <button type="button" aria-label={t("Dự án trước")} onClick={prevP}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </button>
                    <span>{"5 / 7"}</span>
                    <button type="button" aria-label={t("Dự án tiếp theo")} onClick={nextP}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>
                <h3 className="kim-panel-title">{t("LungVision 3D")}</h3>
                <p className="kim-panel-desc">
                  {t("Phát hiện nốt phổi trên ảnh CT bằng U-Net và hiển thị vị trí trên mô hình phổi 3D tương tác.")}
                </p>
                <div className="kim-tags">
                  <span className="kim-tag">{t("U-Net")}</span>
                  <span className="kim-tag">{t("CT")}</span>
                  <span className="kim-tag">{t("3D Web")}</span>
                </div>
              </div>
            </div>
            <div className={"kim-panel " + hid("rl")} role="tabpanel" id="kim-panel-rl" aria-labelledby="kim-tab-rl" data-panel="rl">
              <div className="kim-shot">
                <div className="kim-win" aria-hidden="true">
                  <div className="kim-win-bar">
                    <i />
                    <i />
                    <i />
                    <b>{t("RL Lab, Drone 3D")}</b>
                    <span>{t("Chạy trên trình duyệt")}</span>
                  </div>
                  <div className="kim-win-body m-rl">
                    <div className="m-scene">
                      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                        <rect width="400" height="300" fill="#EEF0EE" />
                        <polygon points="0,300 400,300 310,150 90,150" fill="#DDE0DD" />
                        <path d="M0.0 300 L90.0 150 M50.0 300 L117.5 150 M100.0 300 L145.0 150 M150.0 300 L172.5 150 M200.0 300 L200.0 150 M250.0 300 L227.5 150 M300.0 300 L255.0 150 M350.0 300 L282.5 150 M400.0 300 L310.0 150 M79.2 168 L320.8 168 M64.8 192 L335.2 192 M44.4 226 L355.6 226 M18.0 270 L382.0 270" stroke="#C6CBCD" strokeWidth="1" fill="none" />
                        <ellipse cx="282" cy="176" rx="34" ry="10" fill="#F6EBCF" stroke="#C99A3A" strokeWidth="3" />
                        <ellipse cx="282" cy="176" rx="18" ry="5" fill="none" stroke="#C99A3A" strokeWidth="2" />
                        <path d="M84 272 C 120 214, 168 152, 218 140 C 250 133, 270 150, 282 170" fill="none" stroke="#87631A" strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round" />
                        <ellipse cx="176" cy="236" rx="30" ry="6.5" fill="rgba(36,39,43,0.16)" />
                        <path d="M150 112 L202 140 M150 140 L202 112" stroke="#2F3338" strokeWidth="5" strokeLinecap="round" />
                        <ellipse cx="150" cy="110" rx="16" ry="4.6" fill="rgba(169,174,179,0.55)" stroke="#6A7077" strokeWidth="1" />
                        <circle cx="150" cy="110" r="3" fill="#2F3338" />
                        <ellipse cx="202" cy="110" rx="16" ry="4.6" fill="rgba(169,174,179,0.55)" stroke="#6A7077" strokeWidth="1" />
                        <circle cx="202" cy="110" r="3" fill="#2F3338" />
                        <ellipse cx="150" cy="142" rx="16" ry="4.6" fill="rgba(169,174,179,0.55)" stroke="#6A7077" strokeWidth="1" />
                        <circle cx="150" cy="142" r="3" fill="#2F3338" />
                        <ellipse cx="202" cy="142" rx="16" ry="4.6" fill="rgba(169,174,179,0.55)" stroke="#6A7077" strokeWidth="1" />
                        <circle cx="202" cy="142" r="3" fill="#2F3338" />
                        <rect x="165" y="118" width="22" height="16" rx="4" fill="#C99A3A" stroke="#2F3338" strokeWidth="2" />
                        <circle cx="176" cy="135.5" r="2.6" fill="#2F3338" />
                      </svg>
                      <span className="m-chip">{t("Tập huấn luyện 418")}</span>
                    </div>
                    <div className="m-train">
                      <header>
                        {t("Huấn luyện PPO")}
                        <span className="m-chip go">{t("Đang chạy")}</span>
                      </header>
                      <svg className="m-chart" viewBox="0 0 300 122" aria-hidden="true" fontFamily="Archivo, ui-sans-serif, sans-serif">
                        <path d="M30 34 H292 M30 60 H292 M30 86 H292" stroke="#EEF0EE" strokeWidth="1" />
                        <path d="M30 12 V104 H292" fill="none" stroke="#C6CBCD" strokeWidth="1.2" />
                        <polyline points="30.0,97.1 36.0,93.8 42.0,95.2 48.0,82.6 54.0,79.1 60.0,76.5 66.0,66.1 72.0,68.1 78.0,66.9 84.0,66.5 90.0,52.8 96.0,53.6 102.0,48.1 108.0,56.8 114.0,53.0 120.0,41.6 126.0,53.4 132.0,51.4 138.0,45.5 144.0,43.6 150.0,36.1 156.0,33.1 162.0,38.8 168.0,31.8 174.0,32.5 180.0,32.4 186.0,29.0 192.0,33.5 198.0,32.5 204.0,36.4 210.0,32.1 216.0,32.9 222.0,30.8 228.0,32.0 234.0,29.5 240.0,27.3 246.0,33.9 252.0,33.4 258.0,31.5 264.0,29.9 270.0,26.1 276.0,25.2 282.0,25.5 288.0,23.5" fill="none" stroke="#B9BEC3" strokeWidth="1.2" strokeLinejoin="round" />
                        <path d="M30.0 92.2 L36.0 89.6 L42.0 87.4 L48.0 84.3 L54.0 80.2 L60.0 76.4 L66.0 72.3 L72.0 68.0 L78.0 64.4 L84.0 60.3 L90.0 59.0 L96.0 56.8 L102.0 53.2 L108.0 51.3 L114.0 51.1 L120.0 50.0 L126.0 49.3 L132.0 46.4 L138.0 43.5 L144.0 43.1 L150.0 40.0 L156.0 37.3 L162.0 35.5 L168.0 33.4 L174.0 33.0 L180.0 32.9 L186.0 32.6 L192.0 32.6 L198.0 32.7 L204.0 32.5 L210.0 32.9 L216.0 32.3 L222.0 31.6 L228.0 31.2 L234.0 31.4 L240.0 31.2 L246.0 31.1 L252.0 30.2 L258.0 29.6 L264.0 29.4 L270.0 27.9 L276.0 27.0 L282.0 26.1 L288.0 25.1" fill="none" stroke="#C99A3A" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="288.0" cy="25.1" r="3.6" fill="#C99A3A" stroke="#FFFFFF" strokeWidth="1.5" />
                        <text x="34" y="10" fontSize="9" fill="#6A7077">{t("Phần thưởng trung bình")}</text>
                        <text x="292" y="118" fontSize="9" fill="#6A7077" textAnchor="end">{t("Bước huấn luyện")}</text>
                      </svg>
                      <div className="m-kv">
                        <div>
                          <small>{t("Thuật toán")}</small>
                          <b>{t("PPO")}</b>
                        </div>
                        <div>
                          <small>{t("Môi trường")}</small>
                          <b>{t("Drone 3D")}</b>
                        </div>
                        <div>
                          <small>{t("Chạy trên")}</small>
                          <b>{t("Trình duyệt")}</b>
                        </div>
                        <div>
                          <small>{t("Hiển thị")}</small>
                          <b>{t("Three.js")}</b>
                        </div>
                      </div>
                      <div className="m-btns">
                        <span className="on">{t("Tạm dừng")}</span>
                        <span>{t("Xem lại tập")}</span>
                        <span>{t("Đổi môi trường")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="kim-panel-body">
                <div className="kim-panel-meta">
                  <div>
                    <span className="kim-status st-building">{t("Đang phát triển")}</span>
                    <span className="kim-cat">{t("Học tăng cường")}</span>
                  </div>
                  <div className="kim-pager">
                    <button type="button" aria-label={t("Dự án trước")} onClick={prevP}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </button>
                    <span>{"6 / 7"}</span>
                    <button type="button" aria-label={t("Dự án tiếp theo")} onClick={nextP}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>
                <h3 className="kim-panel-title">{t("RL Lab, 20 dự án học tăng cường")}</h3>
                <p className="kim-panel-desc">
                  {t("Từ cơ bản đến nâng cao, mỗi dự án có demo tương tác. Drone 3D huấn luyện bằng PPO chạy ngay trên trình duyệt.")}
                </p>
                <div className="kim-tags">
                  <span className="kim-tag">{t("PPO")}</span>
                  <span className="kim-tag">{t("Three.js")}</span>
                  <span className="kim-tag">{t("Next.js")}</span>
                </div>
              </div>
            </div>
            <div className={"kim-panel " + hid("straw")} role="tabpanel" id="kim-panel-straw" aria-labelledby="kim-tab-straw" data-panel="straw">
              <div className="kim-shot">
                <div className="kim-win" aria-hidden="true">
                  <div className="kim-win-bar">
                    <i />
                    <i />
                    <i />
                    <b>{t("Robot thu hoạch dâu tây, ROS 2")}</b>
                    <span>{t("Raspberry Pi 5")}</span>
                  </div>
                  <div className="kim-win-body m-bot">
                    <div className="m-view">
                      <svg viewBox="0 0 440 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fontFamily="Archivo, ui-sans-serif, sans-serif">
                        <rect width="440" height="300" fill="#2B2F34" />
                        <rect y="70" width="440" height="60" fill="#30353A" />
                        <rect y="228" width="440" height="72" fill="#22262A" />
                        <path d="M0 228 H440" stroke="#3A3F45" strokeWidth="2" />
                        <ellipse cx="70.0" cy="168.3" rx="25" ry="11" transform="rotate(-73 70.0 168.3)" fill="#565D64" stroke="#3A3F45" strokeWidth="1" />
                        <ellipse cx="75.5" cy="163.3" rx="25" ry="11" transform="rotate(-46 75.5 163.3)" fill="#4B5158" stroke="#3A3F45" strokeWidth="1" />
                        <ellipse cx="79.7" cy="156.2" rx="25" ry="11" transform="rotate(-23 79.7 156.2)" fill="#4B5158" stroke="#3A3F45" strokeWidth="1" />
                        <ellipse cx="91.4" cy="157.0" rx="25" ry="11" transform="rotate(-1 91.4 157.0)" fill="#565D64" stroke="#3A3F45" strokeWidth="1" />
                        <ellipse cx="106.8" cy="157.5" rx="25" ry="11" transform="rotate(29 106.8 157.5)" fill="#565D64" stroke="#3A3F45" strokeWidth="1" />
                        <ellipse cx="114.7" cy="160.2" rx="25" ry="11" transform="rotate(47 114.7 160.2)" fill="#50575E" stroke="#3A3F45" strokeWidth="1" />
                        <ellipse cx="121.3" cy="168.5" rx="25" ry="11" transform="rotate(78 121.3 168.5)" fill="#4B5158" stroke="#3A3F45" strokeWidth="1" />
                        <path d="M92 178 L92 206" stroke="#3A3F45" strokeWidth="3" />
                        <ellipse cx="208.1" cy="172.2" rx="25" ry="11" transform="rotate(-74 208.1 172.2)" fill="#50575E" stroke="#3A3F45" strokeWidth="1" />
                        <ellipse cx="212.2" cy="163.2" rx="25" ry="11" transform="rotate(-40 212.2 163.2)" fill="#565D64" stroke="#3A3F45" strokeWidth="1" />
                        <ellipse cx="219.3" cy="162.2" rx="25" ry="11" transform="rotate(-27 219.3 162.2)" fill="#50575E" stroke="#3A3F45" strokeWidth="1" />
                        <ellipse cx="232.3" cy="162.5" rx="25" ry="11" transform="rotate(1 232.3 162.5)" fill="#4B5158" stroke="#3A3F45" strokeWidth="1" />
                        <ellipse cx="241.9" cy="164.7" rx="25" ry="11" transform="rotate(26 241.9 164.7)" fill="#50575E" stroke="#3A3F45" strokeWidth="1" />
                        <ellipse cx="249.9" cy="168.9" rx="25" ry="11" transform="rotate(54 249.9 168.9)" fill="#565D64" stroke="#3A3F45" strokeWidth="1" />
                        <ellipse cx="261.8" cy="171.6" rx="25" ry="11" transform="rotate(75 261.8 171.6)" fill="#50575E" stroke="#3A3F45" strokeWidth="1" />
                        <path d="M232 182 L232 210" stroke="#3A3F45" strokeWidth="3" />
                        <ellipse cx="346.8" cy="165.9" rx="25" ry="11" transform="rotate(-74 346.8 165.9)" fill="#565D64" stroke="#3A3F45" strokeWidth="1" />
                        <ellipse cx="354.8" cy="161.1" rx="25" ry="11" transform="rotate(-47 354.8 161.1)" fill="#565D64" stroke="#3A3F45" strokeWidth="1" />
                        <ellipse cx="359.4" cy="155.0" rx="25" ry="11" transform="rotate(-25 359.4 155.0)" fill="#4B5158" stroke="#3A3F45" strokeWidth="1" />
                        <ellipse cx="370.3" cy="154.5" rx="25" ry="11" transform="rotate(-3 370.3 154.5)" fill="#565D64" stroke="#3A3F45" strokeWidth="1" />
                        <ellipse cx="384.6" cy="155.9" rx="25" ry="11" transform="rotate(26 384.6 155.9)" fill="#50575E" stroke="#3A3F45" strokeWidth="1" />
                        <ellipse cx="395.8" cy="158.3" rx="25" ry="11" transform="rotate(48 395.8 158.3)" fill="#4B5158" stroke="#3A3F45" strokeWidth="1" />
                        <ellipse cx="401.0" cy="163.8" rx="25" ry="11" transform="rotate(69 401.0 163.8)" fill="#50575E" stroke="#3A3F45" strokeWidth="1" />
                        <path d="M372 176 L372 204" stroke="#3A3F45" strokeWidth="3" />
                        <path d="M72 194 C 61 194, 60 208, 72 219 C 84 208, 83 194, 72 194 Z" fill="#C9CED2" stroke="#24272B" strokeWidth="1" />
                        <circle cx="69" cy="202" r="0.9" fill="#6A7077" />
                        <circle cx="75" cy="203" r="0.9" fill="#6A7077" />
                        <circle cx="72" cy="207" r="0.9" fill="#6A7077" />
                        <circle cx="68" cy="208" r="0.9" fill="#6A7077" />
                        <circle cx="76" cy="209" r="0.9" fill="#6A7077" />
                        <circle cx="72" cy="213" r="0.9" fill="#6A7077" />
                        <path d="M66 194 L72 190 L78 194 L72 196 Z" fill="#5A6168" />
                        <path d="M108 200 C 97 200, 96 214, 108 225 C 120 214, 119 200, 108 200 Z" fill="#7D848B" stroke="#24272B" strokeWidth="1" />
                        <circle cx="105" cy="208" r="0.9" fill="#6A7077" />
                        <circle cx="111" cy="209" r="0.9" fill="#6A7077" />
                        <circle cx="108" cy="213" r="0.9" fill="#6A7077" />
                        <circle cx="104" cy="214" r="0.9" fill="#6A7077" />
                        <circle cx="112" cy="215" r="0.9" fill="#6A7077" />
                        <circle cx="108" cy="219" r="0.9" fill="#6A7077" />
                        <path d="M102 200 L108 196 L114 200 L108 202 Z" fill="#5A6168" />
                        <path d="M214 198 C 203 198, 202 212, 214 223 C 226 212, 225 198, 214 198 Z" fill="#C9CED2" stroke="#24272B" strokeWidth="1" />
                        <circle cx="211" cy="206" r="0.9" fill="#6A7077" />
                        <circle cx="217" cy="207" r="0.9" fill="#6A7077" />
                        <circle cx="214" cy="211" r="0.9" fill="#6A7077" />
                        <circle cx="210" cy="212" r="0.9" fill="#6A7077" />
                        <circle cx="218" cy="213" r="0.9" fill="#6A7077" />
                        <circle cx="214" cy="217" r="0.9" fill="#6A7077" />
                        <path d="M208 198 L214 194 L220 198 L214 200 Z" fill="#5A6168" />
                        <path d="M252 204 C 241 204, 240 218, 252 229 C 264 218, 263 204, 252 204 Z" fill="#C9CED2" stroke="#24272B" strokeWidth="1" />
                        <circle cx="249" cy="212" r="0.9" fill="#6A7077" />
                        <circle cx="255" cy="213" r="0.9" fill="#6A7077" />
                        <circle cx="252" cy="217" r="0.9" fill="#6A7077" />
                        <circle cx="248" cy="218" r="0.9" fill="#6A7077" />
                        <circle cx="256" cy="219" r="0.9" fill="#6A7077" />
                        <circle cx="252" cy="223" r="0.9" fill="#6A7077" />
                        <path d="M246 204 L252 200 L258 204 L252 206 Z" fill="#5A6168" />
                        <path d="M356 194 C 345 194, 344 208, 356 219 C 368 208, 367 194, 356 194 Z" fill="#C9CED2" stroke="#24272B" strokeWidth="1" />
                        <circle cx="353" cy="202" r="0.9" fill="#6A7077" />
                        <circle cx="359" cy="203" r="0.9" fill="#6A7077" />
                        <circle cx="356" cy="207" r="0.9" fill="#6A7077" />
                        <circle cx="352" cy="208" r="0.9" fill="#6A7077" />
                        <circle cx="360" cy="209" r="0.9" fill="#6A7077" />
                        <circle cx="356" cy="213" r="0.9" fill="#6A7077" />
                        <path d="M350 194 L356 190 L362 194 L356 196 Z" fill="#5A6168" />
                        <path d="M390 202 C 379 202, 378 216, 390 227 C 402 216, 401 202, 390 202 Z" fill="#7D848B" stroke="#24272B" strokeWidth="1" />
                        <circle cx="387" cy="210" r="0.9" fill="#6A7077" />
                        <circle cx="393" cy="211" r="0.9" fill="#6A7077" />
                        <circle cx="390" cy="215" r="0.9" fill="#6A7077" />
                        <circle cx="386" cy="216" r="0.9" fill="#6A7077" />
                        <circle cx="394" cy="217" r="0.9" fill="#6A7077" />
                        <circle cx="390" cy="221" r="0.9" fill="#6A7077" />
                        <path d="M384 202 L390 198 L396 202 L390 204 Z" fill="#5A6168" />
                        <rect x="196" y="190" width="36" height="40" fill="none" stroke="#E3BA55" strokeWidth="2" rx="2" />
                        <rect x="195" y="175" width="56" height="15" fill="#E3BA55" rx="2" />
                        <text x="199" y="186" fontSize="10" fontWeight="700" fill="#24272B">{t("chín 0.94")}</text>
                        <rect x="338" y="186" width="36" height="40" fill="none" stroke="#E3BA55" strokeWidth="2" rx="2" />
                        <rect x="337" y="171" width="56" height="15" fill="#E3BA55" rx="2" />
                        <text x="341" y="182" fontSize="10" fontWeight="700" fill="#24272B">{t("chín 0.91")}</text>
                        <rect x="91" y="192" width="34" height="40" fill="none" stroke="#A9AEB3" strokeWidth="2" rx="2" />
                        <rect x="90" y="177" width="83" height="15" fill="#A9AEB3" rx="2" />
                        <text x="94" y="188" fontSize="10" fontWeight="700" fill="#24272B">{t("chưa chín 0.81")}</text>
                        <circle cx="214" cy="210" r="27" fill="none" stroke="#E3BA55" strokeWidth="1.5" strokeDasharray="4 4" />
                        <path d="M350 -20 L272 112" stroke="#6A7077" strokeWidth="20" strokeLinecap="round" />
                        <path d="M350 -20 L272 112" stroke="#8A9096" strokeWidth="12" strokeLinecap="round" />
                        <circle cx="272" cy="112" r="12" fill="#A9AEB3" stroke="#24272B" strokeWidth="2" />
                        <path d="M266 122 L232 176 M280 124 L246 184" stroke="#C8CCCF" strokeWidth="6" strokeLinecap="round" />
                        <circle cx="272" cy="112" r="4" fill="#E3BA55" />
                      </svg>
                      <div className="m-ov">
                        <span>{t("Camera tay máy")}</span>
                        <span className="on">{t("Đang gắp quả chín")}</span>
                      </div>
                    </div>
                    <div className="m-map">
                      <svg viewBox="0 0 300 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fontFamily="Archivo, ui-sans-serif, sans-serif">
                        <rect width="300" height="300" fill="#17191C" />
                        <path d="M150 254 L22 30 A 260 260 0 0 1 278 30 Z" fill="rgba(227,186,85,0.06)" />
                        <circle cx="150" cy="254" r="50" fill="none" stroke="#2A2E33" strokeWidth="1" />
                        <circle cx="150" cy="254" r="100" fill="none" stroke="#2A2E33" strokeWidth="1" />
                        <circle cx="150" cy="254" r="150" fill="none" stroke="#2A2E33" strokeWidth="1" />
                        <circle cx="150" cy="254" r="200" fill="none" stroke="#2A2E33" strokeWidth="1" />
                        <circle cx="91.8" cy="34.0" r="1.6" fill="#B9BEC3" opacity="0.69" />
                        <circle cx="93.8" cy="39.6" r="1.6" fill="#B9BEC3" opacity="0.50" />
                        <circle cx="94.0" cy="46.6" r="1.6" fill="#B9BEC3" opacity="0.54" />
                        <circle cx="92.6" cy="53.8" r="1.6" fill="#B9BEC3" opacity="0.52" />
                        <circle cx="93.0" cy="60.3" r="1.6" fill="#B9BEC3" opacity="0.73" />
                        <circle cx="90.3" cy="68.2" r="1.6" fill="#B9BEC3" opacity="0.62" />
                        <circle cx="92.0" cy="73.6" r="1.6" fill="#B9BEC3" opacity="0.96" />
                        <circle cx="93.4" cy="81.0" r="1.6" fill="#B9BEC3" opacity="0.69" />
                        <circle cx="90.0" cy="89.0" r="1.6" fill="#B9BEC3" opacity="0.65" />
                        <circle cx="93.1" cy="96.7" r="1.6" fill="#B9BEC3" opacity="0.71" />
                        <circle cx="90.8" cy="102.0" r="1.6" fill="#B9BEC3" opacity="0.60" />
                        <circle cx="93.5" cy="108.2" r="1.6" fill="#B9BEC3" opacity="0.60" />
                        <circle cx="93.9" cy="116.7" r="1.6" fill="#B9BEC3" opacity="0.53" />
                        <circle cx="92.0" cy="123.2" r="1.6" fill="#B9BEC3" opacity="0.51" />
                        <circle cx="94.0" cy="129.9" r="1.6" fill="#B9BEC3" opacity="0.56" />
                        <circle cx="90.1" cy="137.3" r="1.6" fill="#B9BEC3" opacity="0.79" />
                        <circle cx="90.5" cy="145.9" r="1.6" fill="#B9BEC3" opacity="0.50" />
                        <circle cx="92.2" cy="151.2" r="1.6" fill="#B9BEC3" opacity="0.51" />
                        <circle cx="92.0" cy="156.6" r="1.6" fill="#B9BEC3" opacity="0.96" />
                        <circle cx="91.5" cy="163.2" r="1.6" fill="#B9BEC3" opacity="0.82" />
                        <circle cx="92.4" cy="168.6" r="1.6" fill="#B9BEC3" opacity="0.59" />
                        <circle cx="94.3" cy="176.1" r="1.6" fill="#B9BEC3" opacity="0.53" />
                        <circle cx="92.5" cy="183.3" r="1.6" fill="#B9BEC3" opacity="0.57" />
                        <circle cx="94.5" cy="189.3" r="1.6" fill="#B9BEC3" opacity="1.00" />
                        <circle cx="93.0" cy="194.8" r="1.6" fill="#B9BEC3" opacity="0.98" />
                        <circle cx="92.6" cy="200.8" r="1.6" fill="#B9BEC3" opacity="0.52" />
                        <circle cx="92.9" cy="207.2" r="1.6" fill="#B9BEC3" opacity="0.80" />
                        <circle cx="89.9" cy="215.3" r="1.6" fill="#B9BEC3" opacity="0.67" />
                        <circle cx="92.4" cy="223.8" r="1.6" fill="#B9BEC3" opacity="0.73" />
                        <circle cx="94.4" cy="230.4" r="1.6" fill="#B9BEC3" opacity="0.79" />
                        <circle cx="93.5" cy="235.5" r="1.6" fill="#B9BEC3" opacity="0.66" />
                        <circle cx="90.6" cy="242.2" r="1.6" fill="#B9BEC3" opacity="0.72" />
                        <circle cx="89.9" cy="248.5" r="1.6" fill="#B9BEC3" opacity="0.81" />
                        <circle cx="209.4" cy="34.0" r="1.6" fill="#B9BEC3" opacity="0.51" />
                        <circle cx="209.5" cy="42.1" r="1.6" fill="#B9BEC3" opacity="0.75" />
                        <circle cx="206.7" cy="50.0" r="1.6" fill="#B9BEC3" opacity="0.87" />
                        <circle cx="206.7" cy="56.7" r="1.6" fill="#B9BEC3" opacity="0.98" />
                        <circle cx="207.4" cy="63.3" r="1.6" fill="#B9BEC3" opacity="0.93" />
                        <circle cx="208.8" cy="69.7" r="1.6" fill="#B9BEC3" opacity="0.59" />
                        <circle cx="206.8" cy="78.1" r="1.6" fill="#B9BEC3" opacity="0.53" />
                        <circle cx="206.4" cy="87.0" r="1.6" fill="#B9BEC3" opacity="0.97" />
                        <circle cx="208.5" cy="96.0" r="1.6" fill="#B9BEC3" opacity="0.51" />
                        <circle cx="206.5" cy="101.2" r="1.6" fill="#B9BEC3" opacity="0.69" />
                        <circle cx="210.3" cy="108.7" r="1.6" fill="#B9BEC3" opacity="0.68" />
                        <circle cx="208.3" cy="114.2" r="1.6" fill="#B9BEC3" opacity="0.57" />
                        <circle cx="208.3" cy="119.6" r="1.6" fill="#B9BEC3" opacity="0.85" />
                        <circle cx="207.8" cy="124.8" r="1.6" fill="#B9BEC3" opacity="0.85" />
                        <circle cx="207.4" cy="132.9" r="1.6" fill="#B9BEC3" opacity="0.94" />
                        <circle cx="209.1" cy="138.6" r="1.6" fill="#B9BEC3" opacity="0.89" />
                        <circle cx="208.0" cy="147.1" r="1.6" fill="#B9BEC3" opacity="0.55" />
                        <circle cx="208.1" cy="152.3" r="1.6" fill="#B9BEC3" opacity="0.59" />
                        <circle cx="205.9" cy="159.8" r="1.6" fill="#B9BEC3" opacity="0.89" />
                        <circle cx="205.6" cy="165.7" r="1.6" fill="#B9BEC3" opacity="0.59" />
                        <circle cx="208.3" cy="172.5" r="1.6" fill="#B9BEC3" opacity="0.69" />
                        <circle cx="207.9" cy="178.2" r="1.6" fill="#B9BEC3" opacity="0.97" />
                        <circle cx="210.2" cy="185.3" r="1.6" fill="#B9BEC3" opacity="0.51" />
                        <circle cx="209.9" cy="194.3" r="1.6" fill="#B9BEC3" opacity="0.77" />
                        <circle cx="208.2" cy="201.4" r="1.6" fill="#B9BEC3" opacity="0.95" />
                        <circle cx="208.7" cy="206.7" r="1.6" fill="#B9BEC3" opacity="0.77" />
                        <circle cx="209.1" cy="212.9" r="1.6" fill="#B9BEC3" opacity="0.86" />
                        <circle cx="209.0" cy="218.3" r="1.6" fill="#B9BEC3" opacity="0.73" />
                        <circle cx="208.7" cy="225.2" r="1.6" fill="#B9BEC3" opacity="0.53" />
                        <circle cx="207.4" cy="232.7" r="1.6" fill="#B9BEC3" opacity="0.94" />
                        <circle cx="209.6" cy="238.6" r="1.6" fill="#B9BEC3" opacity="0.86" />
                        <circle cx="209.9" cy="246.1" r="1.6" fill="#B9BEC3" opacity="0.52" />
                        <circle cx="143.9" cy="136.3" r="2" fill="#E3BA55" />
                        <circle cx="147.8" cy="141.0" r="2" fill="#E3BA55" />
                        <circle cx="152.8" cy="144.9" r="2" fill="#E3BA55" />
                        <circle cx="151.1" cy="141.6" r="2" fill="#E3BA55" />
                        <circle cx="146.2" cy="143.5" r="2" fill="#E3BA55" />
                        <circle cx="147.8" cy="139.7" r="2" fill="#E3BA55" />
                        <circle cx="150.8" cy="136.5" r="2" fill="#E3BA55" />
                        <circle cx="150.4" cy="138.6" r="2" fill="#E3BA55" />
                        <circle cx="157.0" cy="138.5" r="2" fill="#E3BA55" />
                        <circle cx="160.8" cy="138.9" r="2" fill="#E3BA55" />
                        <circle cx="151.5" cy="138.2" r="2" fill="#E3BA55" />
                        <circle cx="147.6" cy="142.3" r="2" fill="#E3BA55" />
                        <circle cx="150.7" cy="137.4" r="2" fill="#E3BA55" />
                        <circle cx="150.5" cy="142.1" r="2" fill="#E3BA55" />
                        <circle cx="157.6" cy="145.0" r="2" fill="#E3BA55" />
                        <circle cx="155.3" cy="139.4" r="2" fill="#E3BA55" />
                        <circle cx="149.7" cy="135.7" r="2" fill="#E3BA55" />
                        <circle cx="144.7" cy="139.5" r="2" fill="#E3BA55" />
                        <path d="M150 244 C 150 206, 184 188, 182 148 C 180 110, 150 96, 150 44" fill="none" stroke="#E8C063" strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round" />
                        <text x="166" y="128" fontSize="10" fontWeight="700" fill="#E3BA55">{t("Vật cản")}</text>
                        <text x="190" y="196" fontSize="10" fill="#B9BEC3">{t("Đường đi")}</text>
                        <polygon points="150,240 141,262 159,262" fill="#E3BA55" stroke="#24272B" strokeWidth="1.5" />
                      </svg>
                      <div className="m-ov">
                        <span>{t("LiDAR 2D")}</span>
                        <span>{t("Tránh vật cản")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="kim-panel-body">
                <div className="kim-panel-meta">
                  <div>
                    <span className="kim-status st-rnd">{t("Nghiên cứu (R&D)")}</span>
                    <span className="kim-cat">{t("Robotics")}</span>
                  </div>
                  <div className="kim-pager">
                    <button type="button" aria-label={t("Dự án trước")} onClick={prevP}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </button>
                    <span>{"7 / 7"}</span>
                    <button type="button" aria-label={t("Dự án tiếp theo")} onClick={nextP}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>
                <h3 className="kim-panel-title">{t("Robot thu hoạch dâu tây")}</h3>
                <p className="kim-panel-desc">
                  {t("Xe tự hành Raspberry Pi 5 kết hợp tay máy 3 bậc tự do, tránh vật cản bằng ROS 2 và LiDAR.")}
                </p>
                <div className="kim-tags">
                  <span className="kim-tag">{t("ROS 2")}</span>
                  <span className="kim-tag">{t("LiDAR")}</span>
                  <span className="kim-tag">{t("Raspberry Pi")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
