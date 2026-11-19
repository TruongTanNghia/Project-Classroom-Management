import type { CSSProperties, ReactNode } from "react";

import KimRoadmapFx from "./KimRoadmapFx";
import { tx, type KimLang, type L } from "./i18n-kim";
import { CPS, GOAL, NODES, STAGES, TIERS, type RmNode } from "./roadmap-data";

/* Trang /roadmap: "AI Engineer Roadmap — Coder Xuất Ngũ", bản roadmap anh Nghĩa đưa
   (UI/AI_ENGINEER_ROADMAP_CODER_XUAT_NGU.html), dựng lại theo phong cách Xưởng Kim.

   Giữ đúng nội dung và cách dùng của bản gốc: 6 chặng × 29 ô kỹ năng, 2 checkpoint tự kiểm tra,
   ô đích "AI Engineer"; rê chuột vào một ô thì hiện dây nối tới ô cần học trước và ô nó mở khoá;
   bấm thì mở ngăn chi tiết; ← → đi lần lượt; D đánh dấu đã học (lưu trên máy người xem); ô tìm.
   Thêm: thanh thời gian 18 tháng (6 giai đoạn), bấm một giai đoạn để thấy lúc đó học ô nào.

   Đổi so với bản gốc: bảng màu. Bản gốc tô các chặng hồng, tím, cam; trang này theo luật màu
   mệnh Kim (chỉ bạc, thép, vàng, nâu đất), mỗi chặng một sắc kim loại (kim-roadmap.css).

   Toàn bộ nội dung, kể cả chi tiết từng ô, dựng sẵn trên máy chủ (máy tìm kiếm đọc được, mở ra
   không phải tải gì). Phần tương tác ở KimRoadmapFx, chỉ gắn hành vi lên HTML có sẵn. */

const pad = (n: number) => String(n).padStart(2, "0");
const noOf = new Map(NODES.map((n, i) => [n.id, i + 1]));
const byId = new Map(NODES.map((n) => [n.id, n]));
const nextOf = (id: string) => NODES.filter((n) => n.pre.includes(id)).map((n) => n.id);
const stripProject = (s: string) => s.replace(/^(Dự án|Project) \d · /, "");

/** chữ V chồng nhau, số chữ = số chặng, như bản gốc */
function Chev({ n }: { n: number }) {
  return (
    <svg className="kim-rm-chev" viewBox={`0 0 28 ${8 + n * 6}`} aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <path key={i} d={`M4 ${7 + i * 6}l10-5 10 5`} />
      ))}
    </svg>
  );
}

function Level({ v, x }: { v: number; x: (l: L) => string }) {
  return (
    <span className="kim-rm-lv" role="img" aria-label={x([`Độ khó ${v} trên 5`, `Difficulty ${v} of 5`])}>
      {[1, 2, 3, 4, 5].map((i) => (
        <i key={i} className={i <= v ? "on" : undefined} />
      ))}
    </span>
  );
}

function Links({ ids, x, empty }: { ids: string[]; x: (l: L) => string; empty: L }) {
  if (!ids.length) return <p className="kim-rm-none">{x(empty)}</p>;
  return (
    <ul className="kim-rm-links">
      {ids.map((id) => {
        const n = byId.get(id)!;
        return (
          <li key={id}>
            <button type="button" data-rm-go={id} style={{ "--c": `var(--rm${n.tier})` } as CSSProperties}>
              <i translate="no">{n.code}</i>
              <span>{x(n.title)}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default function KimRoadmap({ lang }: { lang: KimLang }) {
  const x = (l: L) => tx(lang, l);
  const en = lang === "en";
  const total = STAGES.reduce((n, s) => n + s.m, 0);
  const stageTime = (n: RmNode) => x(STAGES[n.stage - 1].time);

  // thứ tự đi bằng ← →: ô đích, rồi từng chặng (đầu chặng, các ô, checkpoint sau chặng)
  const order: string[] = ["AIE"];
  TIERS.forEach((t) => {
    order.push("T" + t.n);
    NODES.filter((n) => n.tier === t.n).forEach((n) => order.push(n.id));
    const cp = CPS.find((c) => c.after === t.n);
    if (cp) order.push(cp.id);
  });

  return (
    <section
      className="kim-sec kim-rm"
      id="kim-roadmap"
      aria-labelledby="kim-rm-h"
      data-order={order.join(",")}
      style={{ "--l-pre": JSON.stringify(x(["Cần trước", "Learn first"])), "--l-next": JSON.stringify(x(["Mở khoá", "Unlocks"])) } as CSSProperties}
    >
      <div className="kim-head">
        <h2 className="kim-h2" id="kim-rm-h">
          {x(["Từ con số 0 tới AI Engineer", "From zero to AI Engineer"])}
        </h2>
        <p className="kim-note">
          {x([
            "Chặng 1, 2 và 4 là bắt buộc; chặng 3 chọn một đến hai hướng; chặng 5 là mở rộng. Mỗi chặng chốt bằng dự án.",
            "Tiers 1, 2 and 4 are required; in tier 3 pick one or two tracks; tier 5 is for going further. Every tier is capped with a project.",
          ])}
        </p>
      </div>

      {/* thanh thời gian: 6 giai đoạn, rộng theo số tháng */}
      <div className="kim-rm-stagebar" role="group" aria-label={x(["Lộ trình theo thời gian, 18 tháng", "Timeline, 18 months"])}>
        {STAGES.map((s) => (
          <button
            type="button"
            key={s.n}
            className="kim-rm-stage"
            data-rm-stage={s.n}
            aria-pressed="false"
            style={{ "--w": s.m / total, "--c": `var(--rm${s.c})` } as CSSProperties}
          >
            <span className="t">{x(s.time)}</span>
            <b>
              {pad(s.n)} · {x(s.name)}
            </b>
            <span className="d">{x(s.desc)}</span>
          </button>
        ))}
      </div>

      {/* thanh công cụ: tìm, tiến độ, đặt lại */}
      <div className="kim-rm-bar">
        <label className="kim-rm-search">
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input type="search" id="kim-rm-q" placeholder={x(["Tìm: YOLO, RAG, Docker…", "Search: YOLO, RAG, Docker…"])} autoComplete="off" spellCheck={false} aria-label={x(["Tìm trong roadmap", "Search the roadmap"])} />
          <span className="hits" id="kim-rm-hits" aria-live="polite" />
        </label>
        <div className="kim-rm-prog" title={x(["Số ô đã đánh dấu đã học (lưu trên máy của bạn)", "Tiles marked as learned (saved on your device)"])}>
          <svg viewBox="0 0 44 44" aria-hidden="true">
            <circle className="trk" cx="22" cy="22" r="18" />
            <circle className="arc" id="kim-rm-arc" cx="22" cy="22" r="18" strokeDasharray="113.1" strokeDashoffset="113.1" />
          </svg>
          <span>
            <b id="kim-rm-count" aria-live="polite">
              0/{NODES.length}
            </b>
            <small>{x(["đã học", "learned"])}</small>
          </span>
        </div>
        <button type="button" className="kim-rm-reset" id="kim-rm-reset" data-confirm={x(["Bấm lần nữa để xoá hết", "Click again to clear all"])}>
          {x(["Đặt lại", "Reset"])}
        </button>
      </div>

      {/* bản đồ */}
      <div className="kim-rm-map" id="kim-rm-map">
        <svg className="kim-rm-wires" id="kim-rm-wires" aria-hidden="true" />
        <button type="button" className="kim-rm-goal" data-rm="AIE" aria-label={x(["AI Engineer, mục tiêu cuối cùng", "AI Engineer, the final goal"])}>
          <span className="ring" translate="no">
            AIE
          </span>
          <b>AI Engineer</b>
          <small>{x(["Mục tiêu cuối cùng", "The final goal"])}</small>
        </button>

        {TIERS.map((t) => {
          const nodes = NODES.filter((n) => n.tier === t.n);
          const cp = CPS.find((c) => c.after === t.n);
          return (
            <div key={t.n} className="kim-rm-tier-wrap">
              <span className="kim-rm-link" aria-hidden="true" />
              <section className="kim-rm-tier" data-tier={t.n} style={{ "--c": `var(--rm${t.n})`, "--n": nodes.length } as CSSProperties} aria-label={`${x(["Chặng", "Tier"])} ${t.n}: ${x(t.name)}`}>
                <button type="button" className="kim-rm-head" data-rm={"T" + t.n}>
                  <span className="lbl">
                    <Chev n={t.n} />
                    {x(["Chặng", "Tier"])} {pad(t.n)}
                  </span>
                  <b>{x(t.name)}</b>
                  {!en && <em>{t.en}</em>}
                  <span className="tp">
                    <i />
                    <span className="tpn" data-rm-tp={t.n}>
                      0/{nodes.length}
                    </span>
                  </span>
                </button>
                <div className="kim-rm-tiles">
                  {nodes.map((n) => (
                    <button
                      type="button"
                      key={n.id}
                      className={"kim-rm-tile" + (n.kind === "project" ? " is-star" : "")}
                      data-rm={n.id}
                      data-stage={n.stage}
                      data-pre={n.pre.join(",")}
                      data-next={nextOf(n.id).join(",")}
                      data-q={[n.code, x(n.title), x(n.sub), x(n.tag), x(n.what), ...n.tools.map(x), ...n.learn.map(x)].join(" ").toLowerCase()}
                      aria-label={`${pad(noOf.get(n.id)!)} ${x(n.title)}`}
                    >
                      <span className="t-row">
                        <span className="no">{pad(noOf.get(n.id)!)}</span>
                        <span className="chk" aria-hidden="true">
                          <svg viewBox="0 0 12 12">
                            <path d="M2 6.5l2.8 2.8L10 3.4" />
                          </svg>
                        </span>
                      </span>
                      <span className="t-body">
                        <span className="code" translate="no">
                          {n.code}
                          {n.kind === "project" && <sup aria-hidden="true">★</sup>}
                        </span>
                        <span className="txt">
                          <span className="ttl">{stripProject(x(n.title))}</span>
                          <span className="sub">{x(n.sub)}</span>
                          <span className="tag">{x(n.tag)}</span>
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </section>
              {cp && (
                <button type="button" className="kim-rm-cp" data-rm={cp.id} aria-label={x(cp.title)}>
                  <span className="ln" aria-hidden="true" />
                  <span className="core">
                    <span className="dia" aria-hidden="true" />
                    <b>Checkpoint {cp.after}</b>
                    <em>{x(cp.short)}</em>
                    <span className="cs" data-rm-cs={cp.id}>
                      0/{cp.needs.length}
                    </span>
                  </span>
                  <span className="ln" aria-hidden="true" />
                </button>
              )}
            </div>
          );
        })}

        <p className="kim-rm-info">
          <span className="msg">
            <kbd>{x(["Rê chuột", "Hover"])}</kbd> {x(["vào một ô để xem nó nối với ô nào", "over a tile to see what it connects to"])} · <kbd>{x(["Bấm", "Click"])}</kbd>{" "}
            {x(["để mở nội dung", "to open it"])} · <kbd>←</kbd>
            <kbd>→</kbd> {x(["đi lần lượt", "step through"])} · <kbd>D</kbd> {x(["đánh dấu đã học", "mark as learned"])}
          </span>
          <span className="lg">
            <svg viewBox="0 0 34 8" aria-hidden="true">
              <path d="M1 4h32" strokeDasharray="8 5" />
            </svg>
            {x(["cần học trước", "learn first"])}
          </span>
          <span className="lg">
            <svg viewBox="0 0 34 8" aria-hidden="true">
              <path d="M1 4h32" strokeDasharray="2.5 5" />
            </svg>
            {x(["học xong mở khoá", "unlocks next"])}
          </span>
        </p>
      </div>

      {/* ngăn chi tiết: mọi ô dựng sẵn, KimRoadmapFx chỉ hiện ô đang chọn */}
      <dialog className="kim-rm-drawer" id="kim-rm-drawer" aria-label={x(GOAL.title)}>
        <div className="kim-rm-dtop">
          <span className="crumb" id="kim-rm-crumb" />
          <button type="button" className="ib" data-rm-step="-1" aria-label={x(["Ô trước (←)", "Previous (←)"])}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button type="button" className="ib" data-rm-step="1" aria-label={x(["Ô sau (→)", "Next (→)"])}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button type="button" className="ib" data-rm-close aria-label={x(["Đóng (Esc)", "Close (Esc)"])}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <div className="kim-rm-dscroll" tabIndex={0}>
          {/* ô đích */}
          <article className="kim-rm-panel" data-rm-panel="AIE" data-crumb={x(["Mục tiêu cuối cùng", "The final goal"])} hidden>
            <header className="kim-rm-dhero" style={{ "--c": "var(--rm6)" } as CSSProperties}>
              <span className="dcode" translate="no">
                AIE
              </span>
              <div>
                <h3>{x(GOAL.title)}</h3>
                <p className="dtag">{x(GOAL.tag)}</p>
              </div>
            </header>
            <Block t={["Là gì", "What it is"]} x={x}>
              <p>{x(GOAL.what)}</p>
            </Block>
            <Block t={["Vì sao cần", "Why it matters"]} x={x}>
              <p>{x(GOAL.why)}</p>
            </Block>
            <Block t={["Lộ trình", "The route"]} x={x}>
              <ul className="kim-rm-ul">{GOAL.learn.map((l, i) => <li key={i}>{x(l)}</li>)}</ul>
            </Block>
            <Block t={["Cách dùng bản đồ", "Using the map"]} x={x}>
              <p>{x(GOAL.practice)}</p>
            </Block>
            <Block t={["Xong khi", "Done when"]} x={x}>
              <ul className="kim-rm-ok">{GOAL.done.map((l, i) => <li key={i}>{x(l)}</li>)}</ul>
            </Block>
            <Block t={["Bẫy hay gặp", "Common trap"]} x={x} pit>
              <p>{x(GOAL.pit)}</p>
            </Block>
          </article>

          {/* đầu từng chặng */}
          {TIERS.map((t) => {
            const nodes = NODES.filter((n) => n.tier === t.n);
            return (
              <article key={t.n} className="kim-rm-panel" data-rm-panel={"T" + t.n} data-crumb={`${x(["Chặng", "Tier"])} ${pad(t.n)} · ${t.en}`} hidden>
                <header className="kim-rm-dhero" style={{ "--c": `var(--rm${t.n})` } as CSSProperties}>
                  <span className="dcode">{pad(t.n)}</span>
                  <div>
                    <h3>{x(t.name)}</h3>
                    <p className="dtag">{x(t.desc)}</p>
                  </div>
                </header>
                <p className="kim-rm-pills">
                  <span>
                    {nodes.length} {x(["ô", "tiles"])}
                  </span>
                  <span>
                    {x(["Đã học", "Learned"])} <b data-rm-tpd={t.n}>0</b>/{nodes.length}
                  </span>
                </p>
                <Block t={["Các ô trong chặng", "Tiles in this tier"]} x={x}>
                  <Links ids={nodes.map((n) => n.id)} x={x} empty={["", ""]} />
                </Block>
              </article>
            );
          })}

          {/* từng ô */}
          {NODES.map((n) => (
            <article key={n.id} className="kim-rm-panel" data-rm-panel={n.id} data-crumb={`${x(["Chặng", "Tier"])} ${pad(n.tier)} · ${pad(noOf.get(n.id)!)} / ${NODES.length}`} hidden>
              <header className="kim-rm-dhero" style={{ "--c": `var(--rm${n.tier})` } as CSSProperties}>
                <span className="dcode" translate="no">
                  {n.code}
                </span>
                <div>
                  <h3>{x(n.title)}</h3>
                  <p className="dtag">{x(n.tag)}</p>
                </div>
              </header>
              <p className="kim-rm-pills">
                <Level v={n.lv} x={x} />
                <span>
                  {x(["Giai đoạn", "Stage"])} {n.stage} · {stageTime(n)}
                </span>
                <span>{x(n.sub)}</span>
              </p>
              <Block t={["Là gì", "What it is"]} x={x}>
                <p>{x(n.what)}</p>
              </Block>
              <Block t={["Vì sao cần", "Why it matters"]} x={x}>
                <p>{x(n.why)}</p>
              </Block>
              <Block t={["Cần học", "What to learn"]} x={x}>
                <ul className="kim-rm-ul">{n.learn.map((l, i) => <li key={i}>{x(l)}</li>)}</ul>
              </Block>
              <Block t={["Công cụ", "Tools"]} x={x}>
                <p className="kim-rm-tools">
                  {n.tools.map((l, i) => (
                    <span key={i}>{x(l)}</span>
                  ))}
                </p>
              </Block>
              <Block t={["Thực hành", "Practice"]} x={x} lab>
                <p>{x(n.practice)}</p>
              </Block>
              <Block t={["Xong khi", "Done when"]} x={x}>
                <ul className="kim-rm-ok">{n.done.map((l, i) => <li key={i}>{x(l)}</li>)}</ul>
              </Block>
              <Block t={["Bẫy hay gặp", "Common trap"]} x={x} pit>
                <p>{x(n.pit)}</p>
              </Block>
              {n.note && (
                <Block t={["Ghi chú", "Note"]} x={x}>
                  <p>{x(n.note)}</p>
                </Block>
              )}
              <div className="kim-rm-rel">
                <Block t={["Cần học trước", "Learn first"]} x={x}>
                  <Links ids={n.pre} x={x} empty={["Không có, bắt đầu được ngay.", "Nothing, you can start right away."]} />
                </Block>
                <Block t={["Học xong mở khoá", "Unlocks"]} x={x}>
                  <Links ids={nextOf(n.id)} x={x} empty={["Không có ô nào phía sau.", "Nothing further."]} />
                </Block>
              </div>
            </article>
          ))}

          {/* checkpoint */}
          {CPS.map((c) => (
            <article key={c.id} className="kim-rm-panel" data-rm-panel={c.id} data-crumb={`Checkpoint ${c.after}`} hidden>
              <header className="kim-rm-dhero" style={{ "--c": "var(--rm6)" } as CSSProperties}>
                <span className="dcode">◆{c.after}</span>
                <div>
                  <h3>{x(c.title)}</h3>
                  <p className="dtag">{x(c.tag)}</p>
                </div>
              </header>
              <Block t={["Vì sao dừng ở đây", "Why stop here"]} x={x}>
                <p>{x(c.what)}</p>
              </Block>
              <Block t={["Tự kiểm tra", "Check yourself"]} x={x}>
                <ul className="kim-rm-ok">{c.checks.map((l, i) => <li key={i}>{x(l)}</li>)}</ul>
              </Block>
              <Block t={["Các ô cần xong", "Tiles to finish"]} x={x}>
                <Links ids={c.needs} x={x} empty={["", ""]} />
              </Block>
            </article>
          ))}
        </div>
        <div className="kim-rm-dfoot">
          <span className="keys">
            <kbd>←</kbd>
            <kbd>→</kbd> {x(["chuyển ô", "move"])} · <kbd>D</kbd> {x(["đánh dấu", "mark"])} · <kbd>Esc</kbd> {x(["đóng", "close"])}
          </span>
          <button type="button" className="kim-rm-mark" id="kim-rm-mark" aria-pressed="false" data-on={x(["Đã học ✓", "Learned ✓"])} data-off={x(["Đánh dấu đã học", "Mark as learned"])}>
            {x(["Đánh dấu đã học", "Mark as learned"])}
          </button>
        </div>
      </dialog>

      <KimRoadmapFx />
    </section>
  );
}

function Block({ t, x, children, pit, lab }: { t: L; x: (l: L) => string; children: ReactNode; pit?: boolean; lab?: boolean }) {
  return (
    <section className={"kim-rm-block" + (pit ? " is-pit" : "") + (lab ? " is-lab" : "")}>
      <h4>{x(t)}</h4>
      {children}
    </section>
  );
}
