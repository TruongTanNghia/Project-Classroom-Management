"use client";

import { useState, type CSSProperties } from "react";

import { tx, type KimLang, type L } from "./i18n-kim";
import { PILLARS, QUOTES, type Quote } from "./quotes-data";

/* Khối "Học viên và khách hàng nói gì": ba ý được nhắc nhiều nhất + một bức tường nhận xét
   trôi ngang hai hàng ngược chiều.

   Bản thiết kế có ba thẻ nhận xét đứng yên. Anh Nghĩa dặn làm cho xịn và nhiều lên, phần lớn
   nói về việc anh dạy dễ hiểu, tận tình, có góc nhìn thực tế.

   Mọi lời nhận xét hiện là VÍ DỤ MINH HOẠ và mang nhãn "Minh hoạ" (xem quotes-data.ts để biết
   vì sao không được bỏ nhãn, và cách thay bằng nhận xét thật).

   Hai hàng tự trôi: mỗi hàng in danh sách thẻ hai lần liền nhau rồi trượt đúng một lượt danh
   sách, nên vòng lặp không thấy mối nối; bản in thứ hai ẩn với trình đọc màn hình. Rê chuột,
   bấm nút "Tạm dừng", hoặc máy đặt "giảm chuyển động" thì đứng lại; lúc đứng lại vẫn vuốt/cuộn
   ngang được để đọc hết. */

const STAR = "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z";

function Card({ q, lang }: { q: Quote; lang: KimLang }) {
  const x = (l: L) => tx(lang, l);
  return (
    <figure className="kim-quote kim-qw-card">
      <div className="kim-quote-top">
        <span className="kim-stars" role="img" aria-label={x(["5 trên 5 sao", "5 out of 5 stars"])}>
          {[0, 1, 2, 3, 4].map((i) => (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true" key={i}>
              <path d={STAR} />
            </svg>
          ))}
        </span>
        {!q.real && <span className="kim-sample">{x(["Minh hoạ", "Illustrative"])}</span>}
      </div>
      <blockquote>
        {x(q.text[0])}
        <em className="kim-qw-hl">{x(q.text[1])}</em>
        {x(q.text[2])}
      </blockquote>
      <figcaption className="kim-person">
        <span className="kim-avatar" style={{ "--av": q.av } as CSSProperties}>
          {q.initial}
        </span>
        <div>
          <b>{x(q.who)}</b>
          <small>{x(q.role)}</small>
        </div>
      </figcaption>
    </figure>
  );
}

function Row({ quotes, lang, reverse }: { quotes: readonly Quote[]; lang: KimLang; reverse?: boolean }) {
  return (
    <div className={"kim-qw-row" + (reverse ? " is-rev" : "")}>
      <div className="kim-qw-track">
        {quotes.map((q, i) => (
          <Card q={q} lang={lang} key={i} />
        ))}
      </div>
      {/* bản in thứ hai chỉ để vòng trôi liền mạch */}
      <div className="kim-qw-track" aria-hidden="true">
        {quotes.map((q, i) => (
          <Card q={q} lang={lang} key={i} />
        ))}
      </div>
    </div>
  );
}

export default function KimQuoteWall({ lang }: { lang: KimLang }) {
  const x = (l: L) => tx(lang, l);
  const [paused, setPaused] = useState(false);
  const half = Math.ceil(QUOTES.length / 2);

  return (
    <div className="kim-quotes kim-qw" data-paused={paused ? "1" : "0"}>
      <p className="kim-qw-cap">{x(["Ba điều học viên và khách hàng nhắc tới nhiều nhất", "The three things students and clients mention most"])}</p>
      <ul className="kim-qw-pillars">
        {PILLARS.map((p, i) => (
          <li key={i}>
            <span className="n">0{i + 1}</span>
            <strong>{x(p.name)}</strong>
            <p>{x(p.desc)}</p>
          </li>
        ))}
      </ul>

      <div className="kim-qw-bar">
        <button type="button" className="kim-qw-pause" aria-pressed={paused} onClick={() => setPaused((v) => !v)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            {paused ? <path d="M7 4.5v15l12-7.5z" /> : <path d="M6 4.5h4v15H6zM14 4.5h4v15h-4z" />}
          </svg>
          {paused ? x(["Chạy tiếp", "Play"]) : x(["Tạm dừng", "Pause"])}
        </button>
      </div>

      <div className="kim-qw-rows">
        <Row quotes={QUOTES.slice(0, half)} lang={lang} />
        <Row quotes={QUOTES.slice(half)} lang={lang} reverse />
      </div>
    </div>
  );
}
