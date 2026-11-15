/* TỆP SINH TỰ ĐỘNG từ bản thiết kế "Xưởng Kim" (kim-convert.py). Đừng sửa tay. */
import { tKim, type KimLang } from "../i18n-kim";
import KimGem from "../KimGem";

export default function KimContact({ lang }: { lang: KimLang }) {
  const t = (s: string) => tKim(lang, s);
  return (
    <section className="kim-contact" id="kim-contact" aria-labelledby="kim-contact-h">
      <svg className="kim-contact-ring" viewBox="0 0 460 460" aria-hidden="true">
        <circle className="r1" cx="230" cy="230" r="200" />
        <circle className="r2" cx="230" cy="230" r="172" />
        <circle className="r2" cx="230" cy="230" r="224" />
      </svg>
      <KimGem variant="contact" />
      <div className="kim-contact-copy">
        <span className="kim-plate">{t("Hợp tác cùng AIhoclaptrinh")}</span>
        <h2 id="kim-contact-h">{t("Sẵn sàng đưa AI vào công việc của bạn?")}</h2>
        <p>
          {t("Đưa AI đến gần mọi người, để ai cũng có thể ứng dụng AI vào công việc và học tập nếu được kèm đúng cách, đúng lúc. Nhắn tôi một câu, mình bắt đầu nhé.")}
        </p>
        <div className="kim-actions">
          <a className="kim-btn kim-btn-brass" href="mailto:aihoclaptrinh@gmail.com?subject=H%E1%BB%A3p%20t%C3%A1c%20AI">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            {t("Gửi email hợp tác")}
          </a>
          <a className="kim-btn kim-btn-line" href="https://zalo.me/0862554248">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
            </svg>
            {t("Nhắn Zalo")}
          </a>
        </div>
      </div>
      <div className="kim-contact-list">
        <a className="kim-contact-item" href="mailto:aihoclaptrinh@gmail.com?subject=H%E1%BB%A3p%20t%C3%A1c%20AI">
          <i>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </i>
          <div>
            <small>{t("Email")}</small>
            <b>{t("aihoclaptrinh@gmail.com")}</b>
          </div>
        </a>
        <a className="kim-contact-item" href="tel:0862554248">
          <i>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
            </svg>
          </i>
          <div>
            <small>{t("Điện thoại và Zalo")}</small>
            <b>{"0862 554 248"}</b>
          </div>
        </a>
        <div className="kim-contact-item">
          <i>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </i>
          <div>
            <small>{t("Địa điểm")}</small>
            <b>{t("Nha Trang")}</b>
          </div>
        </div>
      </div>
    </section>
  );
}
