/* Số liệu dùng chung giữa phần dựng 3D (organ-scan-engine.ts, có three.js) và phần giao diện
   (KimOrganScan.tsx). Để riêng ở đây vì giao diện cần các con số này ngay, còn three.js thì
   chỉ nạp khi thẻ dự án hiện ra. File này không được import three. */

export type Organ = "lung" | "brain";

/** Một "ca chụp" giả định: tổng số lát, lát ứng với đỉnh và đáy cơ quan (ca chụp rộng hơn cơ
    quan), và lát có khối u. Số của phổi lấy theo bản thiết kế ("Lát 142", "310"). */
export const SCAN_INFO: Record<Organ, { slices: number; top: number; bottom: number; hitSlice: number }> = {
  lung: { slices: 310, top: 58, bottom: 296, hitSlice: 142 },
  brain: { slices: 176, top: 14, bottom: 150, hitSlice: 58 },
};

/** Hai mô hình anh Nghĩa đưa (eduflow/models-3D) lấy từ Sketchfab, giấy phép CC BY 4.0:
    BẮT BUỘC ghi tên tác giả, dẫn nguồn, dẫn giấy phép và nói rõ đã chỉnh sửa. Đừng bỏ dòng ghi
    công trên trang. Bản dùng trên web đã giản lược bằng scripts/glb-optimize.mjs. */
export const MODEL_CREDIT: Record<Organ, { title: string; author: string; source: string }> = {
  lung: {
    title: "Lungs - normal study",
    author: "valchanov",
    source: "https://sketchfab.com/3d-models/lungs-normal-study-79149850d98842f981a1c60e7498413b",
  },
  brain: {
    title: "human-brain (1) - copy 1",
    author: "mo99ghahremani",
    source: "https://sketchfab.com/3d-models/human-brain-1-copy-1-315449e9517047edb65e3b462c259b91",
  },
};
export const CC_BY = "https://creativecommons.org/licenses/by/4.0/";
