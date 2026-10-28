// Rising Lines — Originkit (Versão Otimizada de Alta Performance - 60+ FPS)
// Elimina criação de gradientes por frame e implementa cache de sprites em Offscreen Canvas

import * as React from "react";
import { useEffect, useRef } from "react";

export type RisingLinesProps = {
  className?: string;
  particles?: number;
  color?: string;
  riseSpeed?: number;
  opacity?: number;
  scale?: number;
  showHorizon?: boolean;
  horizonColor?: string;
  horizonOpacity?: number;
  style?: React.CSSProperties;
};

const COMPONENT_DEFAULTS = {
  className: "",
  particles: 140, // Calibrado para leveza extrema e visual elegante
  color: "#FACC15", // Dourado Helmans Academy
  riseSpeed: 22,
  opacity: 85,
  scale: 6,
  showHorizon: true,
  horizonColor: "#EAB308", // Âmbar Helmans Academy
  horizonOpacity: 80,
};

function parseColor(input: string): [number, number, number] {
  if (!input) return [250, 204, 21];
  const s = input.trim();
  if (s.startsWith("#")) {
    let hex = s.slice(1);
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    const num = parseInt(hex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }
  const m = s.match(/rgba?\(([^)]+)\)/i);
  if (m) {
    const parts = m[1].split(",").map((p) => parseFloat(p.trim()));
    return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
  }
  return [250, 204, 21];
}

function __OriginkitBase_RisingLines(props: RisingLinesProps) {
  const merged = { ...COMPONENT_DEFAULTS, ...props };
  const {
    className,
    particles,
    color,
    showHorizon,
    horizonColor,
    riseSpeed: riseSpeedRaw,
    opacity: opacityRaw,
    horizonOpacity: horizonOpacityRaw,
    scale: scaleRaw,
    style,
  } = merged;

  const riseSpeed = riseSpeedRaw / 100;
  const opacity = opacityRaw / 100;
  const horizonOpacity = horizonOpacityRaw / 100;
  const scale = scaleRaw / 2;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const cParticle = parseColor(color);
    const cHorizon = parseColor(horizonColor);

    const defaultScale = 3.5;
    const worldScale = Math.max(0.1, scale) / defaultScale;

    // --- SPRITE CACHES (Cria os gradientes 1 ÚNICA VEZ fora do loop de render) ---
    // 1. Blob Sprite Cache (64x64)
    const blobCanvas = document.createElement("canvas");
    blobCanvas.width = 64;
    blobCanvas.height = 64;
    const bCtx = blobCanvas.getContext("2d");
    if (bCtx) {
      const grad = bCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, `rgba(${cParticle[0]},${cParticle[1]},${cParticle[2]},1)`);
      grad.addColorStop(0.4, `rgba(${cParticle[0]},${cParticle[1]},${cParticle[2]},0.45)`);
      grad.addColorStop(1, `rgba(${cParticle[0]},${cParticle[1]},${cParticle[2]},0)`);
      bCtx.fillStyle = grad;
      bCtx.fillRect(0, 0, 64, 64);
    }

    // 2. Spark Line Sprite Cache (4x120)
    const sparkCanvas = document.createElement("canvas");
    sparkCanvas.width = 4;
    sparkCanvas.height = 120;
    const sCtx = sparkCanvas.getContext("2d");
    if (sCtx) {
      const grad = sCtx.createLinearGradient(0, 0, 0, 120);
      grad.addColorStop(0, `rgba(${cParticle[0]},${cParticle[1]},${cParticle[2]},0)`);
      grad.addColorStop(0.7, `rgba(${cParticle[0]},${cParticle[1]},${cParticle[2]},1)`);
      grad.addColorStop(1, `rgba(${cParticle[0]},${cParticle[1]},${cParticle[2]},1)`);
      sCtx.fillStyle = grad;
      sCtx.fillRect(1, 0, 2, 120);
    }

    const makeRng = (seed: number) => {
      let s = seed >>> 0;
      return () => {
        s = (s + 0x6d2b79f5) >>> 0;
        let t = s;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    };
    const rng = makeRng(0xc0ffee);

    let particleCount = 0;
    let pX = new Float32Array(0);
    let pY = new Float32Array(0);
    let pVY = new Float32Array(0);
    let pHeight = new Float32Array(0);

    let blobCount = 0;
    let bX = new Float32Array(0);
    let bY = new Float32Array(0);
    let bVY = new Float32Array(0);
    let bR = new Float32Array(0);

    const sampleCenterX = (w: number) => {
      const r = (rng() + rng() + rng()) / 3;
      return r * w;
    };

    const sampleSparkHeight = () => {
      let tall: number;
      if (rng() < 0.12) {
        tall = 60 + rng() * 30;
      } else {
        tall = 20 + Math.pow(rng(), 0.7) * 35;
      }
      return Math.max(1, Math.floor(tall * worldScale));
    };

    const getHorizonY = (h: number) => h - 1;

    const initParticles = () => {
      const { w, h } = sizeRef.current;
      const area = w * h;
      const refArea = 800 * 400;

      // Limita quantidade máxima para manter 60+ FPS constante em qualquer notebook
      const target = Math.max(20, Math.floor((particles * area) / refArea));
      particleCount = Math.min(target, 220);
      pX = new Float32Array(particleCount);
      pY = new Float32Array(particleCount);
      pVY = new Float32Array(particleCount);
      pHeight = new Float32Array(particleCount);

      const horizonY = getHorizonY(h);
      for (let i = 0; i < particleCount; i++) {
        pX[i] = sampleCenterX(w);
        pY[i] = horizonY - rng() * horizonY * 0.95;
        pVY[i] = 10 + rng() * 35;
        pHeight[i] = sampleSparkHeight();
      }

      blobCount = Math.min(Math.max(10, Math.floor(particleCount * 0.3)), 60);
      bX = new Float32Array(blobCount);
      bY = new Float32Array(blobCount);
      bVY = new Float32Array(blobCount);
      bR = new Float32Array(blobCount);

      for (let i = 0; i < blobCount; i++) {
        bX[i] = sampleCenterX(w);
        bY[i] = horizonY - rng() * horizonY * 0.95;
        bVY[i] = 8 + rng() * 25;
        bR[i] = (1.5 + Math.pow(rng(), 1.8) * 3.5) * worldScale;
      }
    };

    const resize = (entry?: ResizeObserverEntry) => {
      // Limita DPR a 1.25 para evitar renderizar em 4K pesado em telas Retina
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);

      const cr = entry?.contentRect;
      const rectW =
        cr?.width ||
        container.clientWidth ||
        container.getBoundingClientRect().width;
      const rectH =
        cr?.height ||
        container.clientHeight ||
        container.getBoundingClientRect().height;
      const w = Math.max(1, Math.floor(rectW) || 800);
      const h = Math.max(1, Math.floor(rectH) || 400);

      sizeRef.current = { w, h, dpr };
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      initParticles();
    };

    resize();
    const ro = new ResizeObserver((entries) => {
      if (entries && entries[0]) {
        resize(entries[0]);
      }
    });
    ro.observe(container);

    // Pausa a renderização quando o elemento sair da tela (economiza 100% de CPU/GPU ao rolar)
    let isVisible = true;
    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    io.observe(container);

    const drawFrame = (deltaSec: number) => {
      const { w, h } = sizeRef.current;
      const dt = Math.max(0.001, Math.min(0.033, deltaSec));
      const horizonY = getHorizonY(h);

      // Limpa fundo
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgb(11, 11, 13)";
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = "lighter";

      // 1. Horizonte luminoso (desenhado 1 vez por frame)
      const horizonAlpha = Math.max(0, Math.min(1, horizonOpacity));
      if (showHorizon && horizonAlpha > 0.001) {
        const rx = w * 0.5;
        const ry = 40 * worldScale;
        ctx.save();
        ctx.translate(w / 2, horizonY);
        ctx.scale(rx / ry, 1);
        const hGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, ry);
        hGrad.addColorStop(0, `rgba(${cHorizon[0]},${cHorizon[1]},${cHorizon[2]},${horizonAlpha})`);
        hGrad.addColorStop(0.35, `rgba(${cHorizon[0]},${cHorizon[1]},${cHorizon[2]},${horizonAlpha * 0.65})`);
        hGrad.addColorStop(0.7, `rgba(${cHorizon[0]},${cHorizon[1]},${cHorizon[2]},${horizonAlpha * 0.2})`);
        hGrad.addColorStop(1, `rgba(${cHorizon[0]},${cHorizon[1]},${cHorizon[2]},0)`);
        ctx.fillStyle = hGrad;
        ctx.fillRect(-ry - 2, -ry - 2, (ry + 2) * 2, (ry + 2) * 2);
        ctx.restore();
      }

      const riseSpeedMul = Math.max(0, riseSpeed) * 10;
      const denom = Math.max(1, horizonY);

      // 2. Blobs circulares (Renderizados via Sprite Pré-Calculado - Zero alocação)
      for (let i = 0; i < blobCount; i++) {
        const effVy = bVY[i] * (1.0 + riseSpeedMul);
        bY[i] -= effVy * dt;

        if (bY[i] < -bR[i] * 2) {
          bX[i] = sampleCenterX(w);
          bY[i] = horizonY - rng() * 10;
          bVY[i] = 8 + rng() * 25;
          bR[i] = (1.5 + Math.pow(rng(), 1.8) * 3.5) * worldScale;
        }

        const t = Math.max(0, Math.min(1, (horizonY - bY[i]) / denom));
        const fade = t < 0.2 ? t / 0.2 : Math.max(0, 1 - (t - 0.2) / 0.8);
        const a = fade * opacity;
        if (a < 0.01) continue;

        const cx = bX[i];
        const cy = bY[i];
        const r = bR[i];
        const aClamped = Math.min(1, a);

        ctx.globalAlpha = aClamped;
        ctx.drawImage(blobCanvas, cx - r, cy - r, r * 2, r * 2);

        if (r > 2.5) {
          ctx.fillStyle = `rgba(255,255,255,${aClamped})`;
          ctx.fillRect(Math.floor(cx), Math.floor(cy), 1, 1);
        }
      }

      // 3. Linhas verticais (Renderizadas via Sprite Pré-Calculado - Zero alocação)
      for (let i = 0; i < particleCount; i++) {
        const effVy = pVY[i] * (1.0 + riseSpeedMul);
        pY[i] -= effVy * dt;

        if (pY[i] < -pHeight[i]) {
          pX[i] = sampleCenterX(w);
          pY[i] = horizonY - rng() * 10;
          pVY[i] = 10 + rng() * 35;
          pHeight[i] = sampleSparkHeight();
        }

        const t = Math.max(0, Math.min(1, (horizonY - pY[i]) / denom));
        const fade = t < 0.2 ? t / 0.2 : Math.max(0, 1 - (t - 0.2) / 0.8);
        const a = fade * opacity;
        if (a < 0.01) continue;

        const px = Math.floor(pX[i]);
        const py = Math.floor(pY[i]);
        const lineHeight = pHeight[i];
        const aClamped = Math.min(1, a);

        ctx.globalAlpha = aClamped;
        ctx.drawImage(sparkCanvas, px, py, 1, lineHeight);
      }

      ctx.globalAlpha = 1.0;
    };

    let lastT = performance.now();
    const loop = (t: number) => {
      // Se não estiver visível na janela, não gasta GPU/CPU
      if (isVisible) {
        const deltaSec = (t - lastT) / 1000;
        lastT = t;
        drawFrame(deltaSec);
      } else {
        lastT = t;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      io.disconnect();
    };
  }, [
    particles,
    color,
    showHorizon,
    horizonColor,
    riseSpeed,
    opacity,
    horizonOpacity,
    scale,
  ]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minWidth: 100,
        minHeight: 60,
        overflow: "hidden",
        background: "#0B0B0D",
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
    </div>
  );
}

const __originkitPresetProps = {
  direction: "up",
};

export default function RisingLines(props: RisingLinesProps) {
  return (
    <__OriginkitBase_RisingLines
      {...(__originkitPresetProps as any)}
      {...props}
    />
  );
}
