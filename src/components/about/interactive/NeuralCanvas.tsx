"use client";
/** <canvas class="abt-neural" data-neural> của hero — đặt bên trong <div class="abt-fx" aria-hidden="true">. */
import { useRef } from "react";
import { useNeuralCanvas } from "./useNeuralCanvas";

export function NeuralCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useNeuralCanvas(ref); // host mặc định = <section> gần nhất (giống thiết kế)
  return <canvas ref={ref} className="abt-neural" data-neural="1" />;
}
