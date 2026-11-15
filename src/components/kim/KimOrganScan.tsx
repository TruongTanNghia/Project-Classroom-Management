"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { tx, type KimLang, type L } from "./i18n-kim";
import type { OrganScan, Phase } from "./organ-scan-engine";
import { CC_BY, MODEL_CREDIT, SCAN_INFO, type Organ } from "./organ-scan-info";

/* Phần thân của cửa sổ "LungVision 3D" trong khối dự án: quét cơ quan từng lát, tìm khối u.

   Bản thiết kế vẽ sẵn một hình phổi tĩnh. Anh Nghĩa đưa hai mô hình 3D thật (phổi, não) và
   dặn: thay hình vẽ bằng mô hình thật, thêm cả não, mô phỏng như đang phát hiện khối u thật.

   Bên trái là lát cắt 2D, bên phải là mô hình 3D; hai bên chạy cùng một kịch bản: mặt quét
   đi từ lát 1 xuống, số lát và con trượt chạy theo, tới lát có khối u thì cả hai bên cùng
   đánh dấu, rồi khối u hiện thành khối 3D và khung chú thích mở ra. Kịch bản và phần 3D nằm ở
   organ-scan-engine.ts; file đó kéo theo three.js nên chỉ được nạp (import động) khi cửa sổ
   này hiện ra trên màn hình lần đầu.

   ĐÂY LÀ MÔ PHỎNG MINH HOẠ, không phải kết quả chẩn đoán; trên khung có ghi rõ điều đó.

   Cửa sổ trình diễn mang aria-hidden (nó là hình minh hoạ), nên mấy nút ở đây để tabIndex=-1:
   bấm được bằng chuột và ngón tay, không chen vào thứ tự phím Tab. */

type Txt = { slice: L; scanKind: L; mark: L; calloutTitle: L; calloutWhere: L; name: L };
const TXT: Record<Organ, Txt> = {
  lung: {
    slice: ["Lát cắt ngang", "Axial slice"],
    scanKind: ["Ảnh CT", "CT scan"],
    mark: ["Nốt 1", "Nodule 1"],
    calloutTitle: ["Nốt nghi ngờ số 1", "Suspicious nodule 1"],
    calloutWhere: ["Thuỳ trên phổi phải", "Right upper lobe"],
    name: ["Phổi", "Lungs"],
  },
  brain: {
    slice: ["Lát cắt ngang", "Axial slice"],
    scanKind: ["Ảnh MRI", "MRI scan"],
    mark: ["Khối u 1", "Tumour 1"],
    calloutTitle: ["Khối u nghi ngờ số 1", "Suspicious tumour 1"],
    calloutWhere: ["Thuỳ trán phải", "Right frontal lobe"],
    name: ["Não", "Brain"],
  },
};
const STATUS: Record<Phase | "fail", L> = {
  load: ["Đang tải mô hình 3D…", "Loading 3D model…"],
  scan: ["Đang quét", "Scanning"],
  hit: ["Phát hiện vùng bất thường", "Abnormal region detected"],
  after: ["Đang quét", "Scanning"],
  build: ["Đang dựng khối 3D…", "Building the 3D volume…"],
  found: ["Đã đánh dấu 1 vùng nghi ngờ", "1 suspicious region marked"],
  fail: ["Máy này không dựng được 3D", "3D is not available on this device"],
};
const pad3 = (n: number) => String(n).padStart(3, "0");

/* ---------- lát cắt 2D ---------- */
/* Hình vẽ tĩnh. Lúc quét, phần ảnh (data-img) co giãn theo vị trí lát để trông như đang lật
   qua từng lát; đốm sáng của khối u (data-lesion) chỉ hiện quanh lát có nó; vòng đánh dấu
   (data-mark) hiện khi đã phát hiện. P/T = bên Phải / bên Trái của người bệnh. */
function LungSlice({ mark }: { mark: string }) {
  return (
    <svg viewBox="0 0 200 170" aria-hidden="true" fontFamily="Archivo, ui-sans-serif, sans-serif">
      <g data-img style={{ transformOrigin: "100px 88px" }}>
        <ellipse cx="100" cy="88" rx="88" ry="70" fill="#5A6066" />
        <ellipse cx="100" cy="88" rx="81" ry="63" fill="#3B4045" />
        <path d="M92 40 C 70 32, 40 44, 33 70 C 27 94, 36 122, 58 130 C 76 136, 90 126, 92 110 Z" fill="#0B0C0E" />
        <path d="M108 40 C 130 32, 160 44, 167 70 C 173 94, 164 122, 142 130 C 124 136, 110 126, 108 110 Z" fill="#0B0C0E" />
        <path d="M60 60 C 66 72, 64 90, 70 104 M48 86 C 58 92, 70 96, 82 94 M140 60 C 134 72, 136 90, 130 104 M152 86 C 142 92, 130 96, 118 94" fill="none" stroke="#2A2E33" strokeWidth="1.4" />
        <ellipse cx="114" cy="100" rx="21" ry="18" fill="#6A7077" />
        <circle cx="100" cy="62" r="6" fill="#0B0C0E" stroke="#6A7077" strokeWidth="1.5" />
        <circle cx="100" cy="141" r="10" fill="#C8CCCF" />
        <circle cx="100" cy="141" r="5" fill="#8A9096" />
        <circle data-lesion cx="56" cy="62" r="4" fill="#E2E4E5" />
      </g>
      <g data-mark>
        <circle cx="56" cy="62" r="10" fill="none" stroke="#E3BA55" strokeWidth="1.6" />
        <path d="M56 46 v6 M56 72 v6 M40 62 h6 M66 62 h6" stroke="#E3BA55" strokeWidth="1.4" />
        <text x="70" y="50" fontSize="9" fontWeight="700" fill="#E3BA55">
          {mark}
        </text>
      </g>
      <text x="8" y="14" fontSize="8" fill="#8A9096">P</text>
      <text x="186" y="14" fontSize="8" fill="#8A9096">T</text>
    </svg>
  );
}
function BrainSlice({ mark }: { mark: string }) {
  return (
    <svg viewBox="0 0 200 170" aria-hidden="true" fontFamily="Archivo, ui-sans-serif, sans-serif">
      <g data-img style={{ transformOrigin: "100px 88px" }}>
        {/* da đầu, xương sọ, dịch não tuỷ, rồi tới nhu mô não */}
        <ellipse cx="100" cy="88" rx="66" ry="78" fill="#6A7077" />
        <ellipse cx="100" cy="88" rx="61" ry="73" fill="#17191C" />
        <ellipse cx="100" cy="88" rx="57" ry="69" fill="#4B5158" />
        <ellipse cx="76" cy="88" rx="23" ry="46" fill="#5E656C" />
        <ellipse cx="124" cy="88" rx="23" ry="46" fill="#5E656C" />
        {/* rãnh liên bán cầu và các nếp cuộn vỏ não */}
        <path d="M100 19 V157" stroke="#0B0C0E" strokeWidth="2.2" />
        <path d="M58 44 C 66 50, 64 58, 72 60 M48 70 C 58 72, 60 82, 70 82 M46 98 C 56 96, 62 104, 72 102 M54 124 C 62 118, 70 124, 78 120 M142 44 C 134 50, 136 58, 128 60 M152 70 C 142 72, 140 82, 130 82 M154 98 C 144 96, 138 104, 128 102 M146 124 C 138 118, 130 124, 122 120 M76 30 C 80 38, 88 36, 90 44 M124 30 C 120 38, 112 36, 110 44 M78 146 C 82 138, 90 142, 92 134 M122 146 C 118 138, 110 142, 108 134" fill="none" stroke="#2A2E33" strokeWidth="1.5" strokeLinecap="round" />
        {/* hai não thất bên */}
        <path d="M93 66 C 82 72, 82 92, 90 108 C 95 100, 96 80, 93 66 Z M107 66 C 118 72, 118 92, 110 108 C 105 100, 104 80, 107 66 Z" fill="#0B0C0E" />
        {/* khối u ở thuỳ trán phải (ảnh quy ước: bên phải người bệnh nằm bên trái ảnh, phía trước ở trên) */}
        <g data-lesion>
          <ellipse cx="71" cy="53" rx="13" ry="11" fill="#7D858C" opacity="0.55" />
          <path d="M63 52 C 62 46, 69 43, 74 46 C 80 46, 81 54, 77 58 C 73 62, 65 60, 63 52 Z" fill="#E2E4E5" />
        </g>
      </g>
      <g data-mark>
        <circle cx="71" cy="53" r="15" fill="none" stroke="#E3BA55" strokeWidth="1.6" />
        <path d="M71 32 v6 M71 68 v6 M50 53 h6 M86 53 h6" stroke="#E3BA55" strokeWidth="1.4" />
        <text x="90" y="38" fontSize="9" fontWeight="700" fill="#E3BA55">
          {mark}
        </text>
      </g>
      <text x="8" y="14" fontSize="8" fill="#8A9096">P</text>
      <text x="186" y="14" fontSize="8" fill="#8A9096">T</text>
    </svg>
  );
}

export default function KimOrganScan({ lang }: { lang: KimLang }) {
  const x = (l: L) => tx(lang, l);
  const [organ, setOrgan] = useState<Organ>("lung");
  const [phase, setPhase] = useState<Phase | "fail">("load");
  const [ready, setReady] = useState(false);

  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const sliceNo = useRef<HTMLElement>(null);
  const track = useRef<HTMLSpanElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const lead = useRef<SVGLineElement>(null);
  const callout = useRef<HTMLDivElement>(null);
  const api = useRef<OrganScan | null>(null);
  const organRef = useRef<Organ>(organ);

  /* Dựng máy 3D khi cửa sổ hiện ra lần đầu; về sau chỉ bật/tắt vòng vẽ theo việc nó có đang
     nằm trên màn hình hay không (thẻ dự án khác đang mở thì cửa sổ này display:none). */
  useEffect(() => {
    const el = root.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    let dead = false;
    let starting = false;
    let visible = false;

    const onSlice = (slice: number, total: number, hit: number) => {
      const info = SCAN_INFO[organRef.current];
      if (sliceNo.current) sliceNo.current.textContent = pad3(slice);
      if (counter.current) counter.current.textContent = `${pad3(slice)}/${total}`;
      track.current?.style.setProperty("--p", String((slice - 1) / (total - 1)));
      // lát cắt 2D: thiết diện nhỏ ở đỉnh và đáy cơ quan, to nhất ở giữa; ngoài cơ quan thì trống
      const f = (slice - info.top) / (info.bottom - info.top);
      const img = el.querySelector<SVGGElement>("[data-img]");
      if (img) {
        const inside = f > 0 && f < 1;
        const k = inside ? 0.42 + 0.58 * Math.sin(Math.PI * Math.min(1, Math.max(0, f))) ** 0.6 : 0.42;
        img.style.transform = `scale(${k.toFixed(3)})`;
        img.style.opacity = inside ? "1" : "0";
      }
      const lesion = el.querySelector<SVGElement>("[data-lesion]");
      if (lesion) lesion.style.opacity = String(Math.max(0, 1 - Math.abs(slice - hit) / 9));
    };
    const onProject = (px: number, py: number, show: boolean) => {
      const line = lead.current;
      const box = callout.current;
      if (!line || !box) return;
      line.style.opacity = show ? "0.9" : "0";
      if (!show) return;
      // nối tới điểm gần khối u nhất trên mép dưới của khung chú thích (khung nằm góc trên phải ở
      // màn rộng, góc trên trái ở điện thoại)
      const ax = Math.min(box.offsetLeft + box.offsetWidth - 8, Math.max(box.offsetLeft + 8, px));
      line.setAttribute("x1", px.toFixed(1));
      line.setAttribute("y1", py.toFixed(1));
      line.setAttribute("x2", ax.toFixed(1));
      line.setAttribute("y2", String(box.offsetTop + box.offsetHeight));
    };

    const start = async () => {
      if (starting || api.current) return;
      starting = true;
      try {
        const { createOrganScan } = await import("./organ-scan-engine");
        if (dead) return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const scan = createOrganScan(cv, {
          organ: organRef.current,
          reduce,
          events: {
            onSlice,
            onProject,
            onPhase: (p) => {
              setPhase(p);
              if (p !== "load") setReady(true);
            },
            onError: () => setPhase("fail"),
          },
        });
        api.current = scan;
        scan.setActive(visible);
        // chỉ ở bản dev: cho script kiểm thử nhảy tới một thời điểm của kịch bản để chụp ảnh
        if (process.env.NODE_ENV !== "production") (window as unknown as { __kimOrgan?: OrganScan }).__kimOrgan = scan;
      } catch {
        // không có WebGL, hoặc tải three.js hỏng: giữ khung tối với dòng báo, trang vẫn dùng bình thường
        if (!dead) setPhase("fail");
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) void start();
        api.current?.setActive(visible);
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => {
      dead = true;
      io.disconnect();
      api.current?.dispose();
      api.current = null;
    };
  }, []);

  const pick = (o: Organ) => {
    if (o === organ) return;
    organRef.current = o;
    setOrgan(o);
    setReady(false);
    api.current?.setOrgan(o);
  };

  const t = TXT[organ];
  const info = SCAN_INFO[organ];
  const credit = MODEL_CREDIT[organ];
  const hitPos = (info.hitSlice - 1) / (info.slices - 1);

  return (
    <div className="kim-win-body m-lung kim-os" ref={root} data-organ={organ} data-phase={phase} data-ready={ready ? "1" : "0"}>
      <div className="m-ct">
        <div className="m-ct-h">
          <span>{x(t.slice)}</span>
          <span>{x(t.scanKind)}</span>
        </div>
        {organ === "lung" ? <LungSlice mark={x(t.mark)} /> : <BrainSlice mark={x(t.mark)} />}
        <div className="m-slider">
          <em>
            {x(["Lát", "Slice"])} <b ref={sliceNo}>{pad3(info.hitSlice)}</b>
          </em>
          <span ref={track} style={{ "--p": hitPos } as CSSProperties} />
          <em>{info.slices}</em>
        </div>
      </div>

      <div className="m-3d">
        <canvas className="kim-os-canvas" ref={canvas} />
        <svg className="kim-os-lead" aria-hidden="true">
          <line ref={lead} />
        </svg>

        <div className="kim-os-status">
          <span>{x(STATUS[phase])}</span>
          <span className="kim-os-count" ref={counter} />
        </div>
        <span className="kim-os-sim">{x(["Mô phỏng minh hoạ", "Illustrative simulation"])}</span>

        <div className="m-callout" ref={callout}>
          <b>{x(t.calloutTitle)}</b>
          <span>{x(t.calloutWhere)}</span>
          <span>
            {x(["Đánh dấu ở lát", "Marked on slice"])} {info.hitSlice}
          </span>
        </div>

        <div className="m-tools">
          {(["lung", "brain"] as const).map((o) => (
            <button type="button" tabIndex={-1} className={o === organ ? "on" : undefined} data-organ-btn={o} onClick={() => pick(o)} key={o}>
              {x(TXT[o].name)}
            </button>
          ))}
          <button type="button" tabIndex={-1} data-rescan onClick={() => api.current?.restart()}>
            {x(["Quét lại", "Rescan"])}
          </button>
        </div>

        {/* ghi công bắt buộc theo giấy phép CC BY 4.0 của hai mô hình */}
        <span className="kim-os-credit">
          {/* ở khung hẹp, dòng "mô phỏng minh hoạ" dọn xuống đây cho khỏi chồng lên khung chú thích */}
          <span className="kim-os-sim-inline">{x(["Mô phỏng minh hoạ", "Illustrative simulation"])} · </span>
          {x(["Mô hình 3D", "3D model"])}:{" "}
          <a href={credit.source} target="_blank" rel="noopener noreferrer" tabIndex={-1} title={`“${credit.title}” — ${credit.author}`}>
            {credit.author}
          </a>
          {" · "}
          <a href={CC_BY} target="_blank" rel="license noopener noreferrer" tabIndex={-1}>
            CC BY 4.0
          </a>
          {" · "}
          {x(["đã giản lược", "simplified"])}
        </span>
      </div>
    </div>
  );
}
