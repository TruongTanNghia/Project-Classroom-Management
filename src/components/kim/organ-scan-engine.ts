import * as THREE from "three";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { SCAN_INFO, type Organ } from "./organ-scan-info";

/* Phần dựng 3D của bản trình diễn "quét cơ quan, tìm khối u" trong thẻ dự án LungVision 3D.

   File này kéo theo three.js (~600 KB) nên KHÔNG được import thẳng: KimOrganScan.tsx chỉ nạp
   nó bằng import() khi thẻ dự án hiện ra lần đầu, để trang không gánh three.js lúc tải.

   Đây là MÔ PHỎNG MINH HOẠ, không phải kết quả của mô hình nhận dạng nào: khối u là một khối
   hình học đặt vào trong mô hình giải phẫu, lát cắt là một mặt phẳng trượt từ trên xuống.
   Không có vật lý. Mọi thứ là một hàm của thời gian t tính từ lúc bắt đầu quét:

     0.3s → 3.4s   mặt phẳng quét đi từ lát 1 tới lát cuối; chỗ nó cắt qua cơ quan loé sáng.
                   Tới lát có khối u thì khựng lại 0.45s (pha "hit").
     tiếp 0.9s     tắt mặt quét, khối u "mọc" ra thành khối 3D, khung bao khép lại (pha "build")
     sau đó        cơ quan xoay để khối u hướng về phía người xem, đung đưa nhẹ (pha "found")

   Vị trí khối u không gõ tay: lúc tải xong mô hình, bắn tia vào chính lưới của nó để tìm một
   điểm chắc chắn nằm TRONG mô (phổi phải / thuỳ trán phải). Nhờ vậy đổi mô hình khác vẫn đúng.

   Màu theo luật mệnh Kim của trang: mô là bạc–thép, mọi thứ "phát hiện" là vàng. Không dùng
   đỏ như phần mềm y khoa thường dùng. */

export type { Organ };
/** load → scan (đang quét) → hit (khựng lại ở lát có khối u) → after (quét nốt phần còn lại)
    → build (dựng khối 3D) → found (đã đánh dấu) */
export type Phase = "load" | "scan" | "hit" | "after" | "build" | "found";

export type ScanEvents = {
  /** lát đang quét (1..total). Sau khi quét xong sẽ trở về đúng lát có khối u. */
  onSlice?: (slice: number, total: number, hitSlice: number) => void;
  onPhase?: (phase: Phase) => void;
  /** toạ độ khối u trên màn hình (px, so với canvas) để vẽ đường chỉ dẫn; visible=false khi chưa hiện */
  onProject?: (x: number, y: number, visible: boolean) => void;
  onError?: (err: unknown) => void;
};

type Cfg = {
  url: string;
  /** Xoay mô hình gốc quanh trục đứng (rad) để MẶT TRƯỚC cơ thể quay về +Z, tức về phía camera.
      Cần đúng thì "bên phải người bệnh" mới là x âm (bên trái người xem) như quy ước ảnh y khoa.
      "auto": tự tìm, dựa vào tên nút thuỳ trán và thuỳ chẩm của mô hình não. */
  face: number | "auto";
  /** vòng sóng lan ra tới mấy lần bán kính khối u; quầng sáng rộng mấy lần */
  ringMax: number;
  glow: number;
  /** tổng số lát của "ca chụp", và lát ứng với đỉnh / đáy của cơ quan (ca chụp rộng hơn cơ quan) */
  slices: number;
  top: number;
  bottom: number;
  hitSlice: number;
  /** bán kính khối u, theo đơn vị đã chuẩn hoá (cơ quan cao đúng 2 đơn vị) */
  tumorR: number;
  /** góc nhìn lúc quét: xoay ngang và ngẩng (rad) */
  viewYaw: number;
  pitch: number;
  /** tìm chỗ đặt khối u; trả thêm lưới của thuỳ chứa nó nếu mô hình chia thuỳ */
  place: (ctx: PlaceCtx) => { at: THREE.Vector3; lobe?: THREE.Mesh };
};
type PlaceCtx = {
  box: THREE.Box3;
  y: number;
  cast: (from: THREE.Vector3, dir: THREE.Vector3) => THREE.Intersection[];
  under: (o: THREE.Object3D, name: string) => boolean;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeOutBack = (t: number) => 1 + 2.7 * Math.pow(t - 1, 3) + 1.7 * Math.pow(t - 1, 2);

const ORGANS: Record<Organ, Cfg> = {
  lung: {
    url: "/kim/models/lungs.glb",
    face: 0, // mô hình phổi sẵn quay mặt trước ra: khuyết tim nằm ở phổi bên phải người xem (phổi trái)
    ...SCAN_INFO.lung,
    tumorR: 0.075,
    ringMax: 4.2,
    glow: 7,
    viewYaw: 0.16,
    pitch: 0.17,
    // Phổi phải của người bệnh nằm bên TRÁI người xem (x âm). Tia đi từ ngoài vào theo +x chạm
    // thành ngoài của phổi phải; lùi vào 42% quãng đường tới đường giữa là nằm trong nhu mô.
    place: ({ box, y, cast }) => {
      const c = box.getCenter(new THREE.Vector3());
      const side = cast(new THREE.Vector3(box.min.x - 1, y, c.z), new THREE.Vector3(1, 0, 0));
      const x = side.length ? lerp(side[0].point.x, c.x, 0.42) : lerp(box.min.x, c.x, 0.5);
      const depth = cast(new THREE.Vector3(x, y, box.max.z + 1), new THREE.Vector3(0, 0, -1));
      const z = depth.length ? lerp(depth[0].point.z, depth[depth.length - 1].point.z, 0.42) : c.z;
      return { at: new THREE.Vector3(x, y, z) };
    },
  },
  brain: {
    url: "/kim/models/brain.glb",
    face: "auto",
    ...SCAN_INFO.brain,
    tumorR: 0.15,
    ringMax: 2.9,
    glow: 4.6,
    viewYaw: 0.62,
    pitch: 0.24,
    // Thuỳ trán phải: bắn tia từ phía trước vào, lệch sang phải người bệnh (x âm), và chỉ nhận
    // điểm chạm thuộc lưới thuỳ trán (nút "frontal1" của mô hình). Thử vài vị trí cho chắc.
    place: ({ box, y, cast, under }) => {
      const c = box.getCenter(new THREE.Vector3());
      const half = (box.max.x - box.min.x) / 2;
      let fallback: THREE.Vector3 | null = null;
      for (const dy of [0, 0.08, -0.08, 0.16]) {
        for (const fx of [0.36, 0.28, 0.46, 0.2]) {
          const hits = cast(new THREE.Vector3(c.x - half * fx, y + dy, box.max.z + 1), new THREE.Vector3(0, 0, -1));
          if (!hits.length) continue;
          const p = hits[0].point.clone();
          p.z -= 0.24; // lùi vào trong vỏ não
          if (under(hits[0].object, "frontal")) return { at: p, lobe: hits[0].object as THREE.Mesh };
          fallback ??= p;
        }
      }
      return { at: fallback ?? c.clone() };
    },
  },
};

/* ---------- shader ---------- */
// Mô vẽ kiểu "chụp X-quang": gần như trong suốt khi nhìn thẳng vào, sáng lên ở mép (fresnel),
// cộng dồn ánh sáng nên chỗ nào nhiều lớp mô chồng lên nhau thì đậm hơn.
const ORGAN_VERT = /* glsl */ `
  uniform mat4 uToOrgan;
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vP;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vP = (uToOrgan * w).xyz;          // toạ độ trong hệ của cơ quan: lát cắt luôn nằm ngang với nó dù đang xoay
    vec4 mv = viewMatrix * w;
    vV = -mv.xyz;
    vN = normalMatrix * normal;
    gl_Position = projectionMatrix * mv;
  }`;
const ORGAN_FRAG = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uRim;
  uniform vec3 uGold;
  uniform vec3 uFocus;
  uniform float uScanY;
  uniform float uBand;
  uniform float uScanAmt;
  uniform float uReveal;
  uniform float uFocusR;
  uniform float uFocusAmt;
  uniform float uLobe;
  uniform float uDensity;
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vP;
  void main() {
    float fres = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.0);
    vec3 col = mix(uBase, uRim, fres);
    float a = (0.035 + 0.5 * fres) * uDensity;

    // lát đang quét: một vạch sáng mảnh ôm theo bề mặt, có quầng mờ hai bên
    float d = abs(vP.y - uScanY);
    float line = smoothstep(uBand, 0.0, d);
    float halo = smoothstep(uBand * 9.0, 0.0, d) * 0.3;
    // phần mặt quét đã đi qua (ở trên) hiện rõ hơn phần chưa quét
    float done = smoothstep(uScanY - 0.02, uScanY + 0.02, vP.y);
    a *= mix(1.0, 0.55 + 0.75 * done, uScanAmt);
    col += uGold * (line * 1.5 + halo) * uScanAmt;
    a += (line * 0.85 + halo * 0.4) * uScanAmt;

    // vùng quanh khối u và thuỳ chứa nó ánh vàng lên sau khi phát hiện
    float f = smoothstep(uFocusR, 0.0, distance(vP, uFocus)) * uFocusAmt;
    col = mix(col, uGold, clamp(f * 0.75 + uLobe * 0.55, 0.0, 1.0));
    a += f * 0.22 + uLobe * (0.05 + 0.25 * fres);

    gl_FragColor = vec4(col, a * uReveal);
  }`;
const PLANE_FRAG = /* glsl */ `
  uniform vec3 uGold;
  uniform float uAmt;
  varying vec2 vUv;
  void main() {
    vec2 p = abs(vUv - 0.5);
    float m = max(p.x, p.y);
    float frame = smoothstep(0.478, 0.492, m) * smoothstep(0.5, 0.494, m);
    vec2 g = abs(fract(vUv * 12.0) - 0.5);
    float grid = smoothstep(0.455, 0.5, max(g.x, g.y));
    float a = (0.035 + grid * 0.07) * smoothstep(0.5, 0.3, m) + frame * 0.6;
    gl_FragColor = vec4(uGold, a * uAmt);
  }`;
const TUMOR_FRAG = /* glsl */ `
  uniform vec3 uGold;
  uniform float uAmt;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 1.4);
    vec3 col = mix(vec3(1.0, 0.95, 0.78), uGold, 0.25 + 0.75 * f);
    gl_FragColor = vec4(col, (0.72 + 0.28 * f) * uAmt);
  }`;
const BASIC_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vV = -mv.xyz;
    vN = normalMatrix * normal;
    gl_Position = projectionMatrix * mv;
  }`;

const GOLD = new THREE.Color(0xe9c160);

/** số giả ngẫu nhiên cố định theo hạt giống: khối u có cùng hình dạng ở mọi lần tải */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** một khối sần sùi không đều: hình cầu bị đẩy lồi lõm bởi vài sóng chồng nhau */
function tumorGeometry(seed: number) {
  const g = new THREE.IcosahedronGeometry(1, 5);
  const r = rng(seed);
  const waves = Array.from({ length: 5 }, () => ({
    dir: new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).normalize(),
    freq: 1.6 + r() * 2.6,
    amp: 0.07 + r() * 0.1,
    ph: r() * 6.28,
  }));
  const pos = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    let k = 1;
    for (const w of waves) k += w.amp * Math.sin(v.dot(w.dir) * w.freq * 3.1416 + w.ph);
    v.multiplyScalar(k);
    pos.setXYZ(i, v.x, v.y * 0.86, v.z);
  }
  g.computeVertexNormals();
  return g;
}

/** tám góc của một khung hộp, mỗi góc ba vạch ngắn: kiểu khung "đã khoanh vùng" */
function cornerBox(len = 0.34) {
  const pts: number[] = [];
  for (const sx of [-1, 1])
    for (const sy of [-1, 1])
      for (const sz of [-1, 1]) {
        pts.push(sx, sy, sz, sx * (1 - len), sy, sz);
        pts.push(sx, sy, sz, sx, sy * (1 - len), sz);
        pts.push(sx, sy, sz, sx, sy, sz * (1 - len));
      }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return g;
}

function glowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(255,240,196,0.95)");
  grad.addColorStop(0.25, "rgba(236,196,100,0.55)");
  grad.addColorStop(1, "rgba(236,196,100,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

type Loaded = {
  root: THREE.Group;
  meshes: THREE.Mesh[];
  box: THREE.Box3;
  at: THREE.Vector3;
  lobe?: THREE.Mesh;
  yTop: number;
  yBottom: number;
};

export function createOrganScan(canvas: HTMLCanvasElement, opts: { organ: Organ; reduce: boolean; events: ScanEvents }) {
  const { events, reduce } = opts;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setClearColor(0x16181b, 1); // đúng màu nền của khung trình diễn, để phép cộng ánh sáng ra đúng màu
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
  const pivot = new THREE.Group(); // mọi thứ xoay theo người xem kéo
  scene.add(pivot);

  const shared = {
    uToOrgan: { value: new THREE.Matrix4() },
    uBase: { value: new THREE.Color(0x4f5961) },
    uRim: { value: new THREE.Color(0xe9edef) },
    uGold: { value: GOLD },
    uFocus: { value: new THREE.Vector3() },
    uScanY: { value: 9 },
    uBand: { value: 0.012 },
    uScanAmt: { value: 0 },
    uReveal: { value: 0 },
    uFocusR: { value: 0.5 },
    uFocusAmt: { value: 0 },
    uDensity: { value: 1 },
  };

  /* mặt phẳng quét */
  const planeMat = new THREE.ShaderMaterial({
    uniforms: { uGold: shared.uGold, uAmt: { value: 0 } },
    vertexShader: BASIC_VERT,
    fragmentShader: PLANE_FRAG,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), planeMat);
  plane.rotation.x = -Math.PI / 2;
  plane.renderOrder = 1;
  pivot.add(plane);

  /* khối u + quầng sáng + khung bao + hai vòng sóng */
  const tumorMat = new THREE.ShaderMaterial({
    uniforms: { uGold: shared.uGold, uAmt: { value: 0 } },
    vertexShader: BASIC_VERT,
    fragmentShader: TUMOR_FRAG,
    transparent: true,
    depthWrite: false,
    depthTest: false,
  });
  const tumor = new THREE.Mesh(tumorGeometry(20261116), tumorMat);
  tumor.renderOrder = 3;
  const glowMat = new THREE.SpriteMaterial({ map: glowTexture(), transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, opacity: 0 });
  const glow = new THREE.Sprite(glowMat);
  glow.renderOrder = 2;
  const boxMat = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0, depthTest: false, depthWrite: false });
  const bbox = new THREE.LineSegments(cornerBox(), boxMat);
  bbox.renderOrder = 4;
  const ringGeo = new THREE.RingGeometry(0.93, 1, 64);
  const rings = [0, 1].map(() => {
    const m = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0, depthTest: false, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }));
    m.renderOrder = 4;
    return m;
  });
  const marker = new THREE.Group();
  marker.add(tumor, glow, bbox, ...rings);
  marker.visible = false;
  pivot.add(marker);

  /* ---------- tải mô hình ---------- */
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  const cache = new Map<Organ, Promise<Loaded>>();
  const lobeUniforms = new Map<THREE.Mesh, { value: number }>();
  const ray = new THREE.Raycaster();

  function load(organ: Organ): Promise<Loaded> {
    let p = cache.get(organ);
    if (p) return p;
    const cfg = ORGANS[organ];
    p = loader.loadAsync(cfg.url).then((gltf) => {
      const model = gltf.scene;
      const under = (o: THREE.Object3D | null, name: string) => {
        for (let n = o; n; n = n.parent) if (n.name.toLowerCase().includes(name)) return true;
        return false;
      };
      if (cfg.face === "auto") {
        // hướng trước–sau của não = từ tâm thuỳ chẩm tới tâm thuỳ trán; xoay cho hướng đó trùng +Z
        model.updateMatrixWorld(true);
        const centreOf = (name: string) => {
          const b = new THREE.Box3();
          model.traverse((o) => {
            if ((o as THREE.Mesh).isMesh && under(o, name)) b.expandByObject(o);
          });
          return b.isEmpty() ? null : b.getCenter(new THREE.Vector3());
        };
        const front = centreOf("frontal");
        const back = centreOf("occipit");
        if (front && back) model.rotation.y = -Math.atan2(front.x - back.x, front.z - back.z);
      } else {
        model.rotation.y = cfg.face;
      }
      // đưa về gốc toạ độ và co giãn cho cơ quan cao đúng 2 đơn vị, để mọi con số bên dưới dùng chung
      const raw = new THREE.Box3().setFromObject(model);
      const size = raw.getSize(new THREE.Vector3());
      const centre = raw.getCenter(new THREE.Vector3());
      const root = new THREE.Group();
      const k = 2 / size.y;
      model.position.copy(centre).multiplyScalar(-k);
      model.scale.multiplyScalar(k);
      root.add(model);
      const meshes: THREE.Mesh[] = [];
      root.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh) return;
        m.geometry.computeVertexNormals(); // file đã bỏ pháp tuyến cho nhẹ, tính lại ở đây (mượt)
        const uLobe = { value: 0 };
        lobeUniforms.set(m, uLobe);
        m.material = new THREE.ShaderMaterial({
          uniforms: { ...shared, uLobe },
          vertexShader: ORGAN_VERT,
          fragmentShader: ORGAN_FRAG,
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
        });
        m.renderOrder = 0;
        meshes.push(m);
      });
      root.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(root);
      const span = cfg.bottom - cfg.top;
      const yOf = (slice: number) => box.max.y - ((slice - cfg.top) / span) * (box.max.y - box.min.y);
      const cast = (from: THREE.Vector3, dir: THREE.Vector3) => {
        ray.set(from, dir);
        return ray.intersectObjects(meshes, false);
      };
      const placed = cfg.place({ box, y: yOf(cfg.hitSlice), cast, under });
      return { root, meshes, box, at: placed.at, lobe: placed.lobe, yTop: yOf(1), yBottom: yOf(cfg.slices) };
    });
    cache.set(organ, p);
    return p;
  }

  /* ---------- trạng thái ---------- */
  let organ: Organ = opts.organ;
  let cur: Loaded | null = null;
  let active = false;
  let disposed = false;
  let raf = 0;
  let t = 0; // giây kể từ lúc bắt đầu quét
  let last = 0;
  let phase: Phase = "load";
  let yaw = ORGANS[organ].viewYaw;
  let userYaw = 0;
  let userPitch = 0;
  let dragging = false;
  let lastSlice = -1;
  let token = 0;
  let hiddenAt = -1e9; // lúc khung khuất khỏi màn hình lần gần nhất

  const SCAN_START = 0.3;
  const SCAN_LEN = 3.1;
  const HOLD = 0.45;
  const BUILD = 0.9;

  function setPhase(p: Phase) {
    if (p === phase) return;
    phase = p;
    events.onPhase?.(p);
  }

  function fit() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // lùi camera vừa đủ để cơ quan (cao 2, rộng tuỳ mô hình) nằm gọn, chừa lề cho chữ chồng lên
    // bề ngang tính theo chiều dài nhất trong hai chiều nằm ngang: cơ quan xoay quanh trục đứng,
    // lúc quay nghiêng thì chiều trước–sau mới là chiều choán chỗ (não dài hơn rộng)
    const wide = cur ? Math.max(cur.box.max.x - cur.box.min.x, cur.box.max.z - cur.box.min.z) : 2;
    const half = Math.max(1.12, (wide / 2 / camera.aspect) * 1.06);
    camera.position.set(0, 0, half / Math.tan((camera.fov * Math.PI) / 360));
    camera.updateProjectionMatrix();
    // khung rộng thì xê cơ quan sang trái một chút, nhường góc trên phải cho khung chú thích
    pivot.position.x = camera.aspect > 1.4 ? -0.2 : 0;
  }

  async function show(next: Organ) {
    const my = ++token;
    organ = next;
    setPhase("load");
    events.onProject?.(0, 0, false);
    let loaded: Loaded;
    try {
      loaded = await load(next);
    } catch (err) {
      if (!disposed) events.onError?.(err);
      return;
    }
    if (disposed || my !== token) return;
    if (cur) pivot.remove(cur.root);
    for (const u of lobeUniforms.values()) u.value = 0;
    cur = loaded;
    pivot.add(cur.root);
    const cfg = ORGANS[next];
    const size = cur.box.getSize(new THREE.Vector3());
    plane.scale.set(size.x * 1.16, size.z * 1.16, 1);
    marker.position.copy(cur.at);
    tumor.scale.setScalar(cfg.tumorR);
    glow.scale.setScalar(cfg.tumorR * cfg.glow);
    bbox.scale.setScalar(cfg.tumorR * 1.75);
    shared.uFocus.value.copy(cur.at);
    shared.uFocusR.value = cfg.tumorR * 4.2;
    shared.uDensity.value = next === "lung" ? 0.8 : 1.15; // phổi nhiều lớp mạch chồng nhau nên vẽ loãng hơn
    yaw = cfg.viewYaw;
    userYaw = userPitch = 0;
    fit();
    restart();
  }

  function restart() {
    t = reduce ? 99 : 0;
    lastSlice = -1;
    marker.visible = false;
    if (cur) setPhase(reduce ? "found" : "scan");
    kick();
  }

  /* ---------- mỗi khung hình ---------- */
  const proj = new THREE.Vector3();
  const qPivot = new THREE.Quaternion();
  function frame(now: number) {
    raf = 0;
    if (disposed || !active) return;
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    if (cur) {
      t += dt;
      const cfg = ORGANS[organ];
      const hitFrac = (cfg.hitSlice - 1) / (cfg.slices - 1);
      const tHit = SCAN_START + SCAN_LEN * hitFrac;
      const tEnd = SCAN_START + SCAN_LEN + HOLD;
      // tiến độ quét 0..1, đứng lại HOLD giây ở lát có khối u
      const scanT = t < tHit ? t - SCAN_START : t < tHit + HOLD ? tHit - SCAN_START : t - HOLD - SCAN_START;
      const prog = clamp01(scanT / SCAN_LEN);
      const scanning = t < tEnd;
      const y = lerp(cur.yTop, cur.yBottom, prog);
      plane.position.y = y;
      shared.uScanY.value = y;
      shared.uReveal.value = smooth(0, 0.5, t);
      const scanAmt = scanning ? smooth(0.05, 0.4, t) : 1 - smooth(tEnd, tEnd + 0.4, t);
      shared.uScanAmt.value = scanAmt;
      planeMat.uniforms.uAmt.value = scanAmt;

      const inHold = t >= tHit && t < tHit + HOLD;
      const build = clamp01((t - tEnd) / BUILD);
      const found = t >= tEnd + BUILD;
      const afterHit = t >= tHit + HOLD && scanning;
      setPhase(found ? "found" : t >= tEnd ? "build" : afterHit ? "after" : inHold ? "hit" : "scan");

      // lát đang quét → báo ra ngoài; quét xong thì trở về lát có khối u
      const slice = scanning ? Math.max(1, Math.round(1 + prog * (cfg.slices - 1))) : cfg.hitSlice;
      if (slice !== lastSlice) {
        lastSlice = slice;
        events.onSlice?.(slice, cfg.slices, cfg.hitSlice);
      }

      // khối u: chớp nhẹ lúc mặt quét chạm tới, rồi mọc hẳn ra ở pha build
      const blip = inHold ? Math.sin(((t - tHit) / HOLD) * Math.PI) : 0;
      const grow = build > 0 ? easeOutBack(clamp01(build / 0.7)) : 0;
      const seen = Math.max(blip * 0.55, afterHit ? 0.3 : 0, grow);
      marker.visible = seen > 0.001;
      const pulse = 1 + 0.05 * Math.sin(t * 3.2);
      tumor.scale.setScalar(cfg.tumorR * Math.max(0.001, seen) * pulse);
      tumor.rotation.y = t * 0.35;
      tumorMat.uniforms.uAmt.value = clamp01(seen * 1.2);
      glowMat.opacity = clamp01(seen) * (0.75 + 0.2 * Math.sin(t * 3.2));
      const boxIn = smooth(0.35, 1, build);
      boxMat.opacity = boxIn * 0.95;
      bbox.scale.setScalar(cfg.tumorR * lerp(3.2, 1.75, boxIn));
      shared.uFocusAmt.value = Math.max(blip * 0.8, afterHit ? 0.3 : 0, smooth(0, 1, build) * 0.9);
      if (cur.lobe) lobeUniforms.get(cur.lobe)!.value = smooth(0.2, 1, build) * 0.5;
      rings.forEach((ring, i) => {
        const on = found || build > 0.5;
        const k = ((t * 0.55 + i * 0.5) % 1 + 1) % 1;
        // vòng sóng luôn quay mặt về camera dù cơ quan đang xoay
        ring.quaternion.copy(camera.quaternion).premultiply(pivot.getWorldQuaternion(qPivot).invert());
        ring.scale.setScalar(cfg.tumorR * lerp(1.4, cfg.ringMax, k));
        (ring.material as THREE.MeshBasicMaterial).opacity = on ? (1 - k) * 0.7 : 0;
      });

      // xoay: lúc quét thì đung đưa quanh góc nhìn chính; phát hiện xong thì đưa khối u về phía người xem
      const toTumor = -Math.atan2(cur.at.x, Math.max(0.05, cur.at.z + 1.2)) * 0.9;
      const target = build > 0 ? toTumor + (reduce ? 0 : Math.sin(t * 0.45) * 0.34) : cfg.viewYaw + Math.sin(t * 0.7) * 0.16;
      yaw += (target - yaw) * (1 - Math.exp(-dt * 2.2));
      if (!dragging) {
        const decay = Math.exp(-dt * 0.55);
        userYaw *= decay;
        userPitch *= decay;
      }
      pivot.rotation.set(cfg.pitch + userPitch, yaw + userYaw, 0);
      pivot.updateMatrixWorld(true);
      shared.uToOrgan.value.copy(pivot.matrixWorld).invert();

      // khối u nằm ở đâu trên màn hình → cho đường chỉ dẫn của khung chú thích
      proj.copy(cur.at).applyMatrix4(pivot.matrixWorld).project(camera);
      events.onProject?.(((proj.x + 1) / 2) * canvas.clientWidth, ((1 - proj.y) / 2) * canvas.clientHeight, found);
    }
    renderer.render(scene, camera);
    kick();
  }
  function kick() {
    if (!raf && active && !disposed) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }

  /* ---------- kéo để xoay ---------- */
  let px = 0;
  let py = 0;
  const down = (e: PointerEvent) => {
    dragging = true;
    px = e.clientX;
    py = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  };
  const move = (e: PointerEvent) => {
    if (!dragging) return;
    userYaw += (e.clientX - px) * 0.008;
    userPitch = Math.max(-0.7, Math.min(0.7, userPitch + (e.clientY - py) * 0.006));
    px = e.clientX;
    py = e.clientY;
  };
  const up = () => {
    dragging = false;
  };
  canvas.addEventListener("pointerdown", down);
  canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointercancel", up);

  const ro = new ResizeObserver(() => {
    fit();
    kick();
  });
  ro.observe(canvas);
  void show(organ);

  return {
    setOrgan: (o: Organ) => (o === organ && cur ? restart() : void show(o)),
    restart,
    /** Chỉ vẽ khi khung đang hiện trên màn hình. Khuất lâu rồi hiện lại (đổi sang thẻ dự án
        khác rồi quay về, cuộn đi xa rồi cuộn lại) thì quét lại từ đầu; khuất thoáng qua (cuộn
        lướt ngang mép màn hình) thì chạy tiếp chỗ đang dở, không bắt người xem coi lại. */
    setActive(on: boolean) {
      if (on === active) return;
      active = on;
      if (on) {
        if (cur && performance.now() - hiddenAt > 1500) restart();
        else kick();
      } else {
        hiddenAt = performance.now();
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      }
    },
    /** chỉ dùng khi kiểm thử: nhảy tới một thời điểm của kịch bản, đặt góc nhìn */
    debug: (seconds: number, extraYaw = 0, extraPitch = 0) => {
      t = seconds;
      userYaw = extraYaw;
      userPitch = extraPitch;
      dragging = extraYaw !== 0 || extraPitch !== 0;
    },
    dispose() {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
      for (const p of cache.values())
        void p.then((l) =>
          l.root.traverse((o) => {
            const m = o as THREE.Mesh;
            m.geometry?.dispose();
            (m.material as THREE.Material | undefined)?.dispose();
          })
        ).catch(() => {});
      glowMat.map?.dispose();
      renderer.dispose();
    },
  };
}

export type OrganScan = ReturnType<typeof createOrganScan>;
