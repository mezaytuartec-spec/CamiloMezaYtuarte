import { useEffect, useRef } from "react";

/**
 * Hero wireframe — Layer 2.
 * A FIXED set of ~15 outlined blocks that literally compose a webpage skeleton
 * (navbar, hero rect, 3 cards, footer). They start scattered with random
 * rotation + low opacity and snap one by one (spring) into their correct slot,
 * flashing electric on arrival. Once assembled: rest → fade out → 3s hidden → restart.
 * The mouse never touches this layer. Pure background atmosphere.
 */

type Block = {
  // target slot (in viewport fractions)
  tfx: number; tfy: number; tfw: number; tfh: number;
  // pixel target (computed on resize)
  tx: number; ty: number; tw: number; th: number; tr: number;
  // current state
  x: number; y: number; r: number;
  vx: number; vy: number; vr: number;
  placed: boolean;
  flash: number;
  placeAt: number;
  // origin scatter (fractions of canvas, reseeded each cycle)
  sxFrac: number; syFrac: number; srRad: number;
};

type Phase = "building" | "rest" | "fading" | "hidden";

// Webpage skeleton, expressed in viewport fractions.
// Safe zone (text+CTA): roughly x 0.04–0.58, y 0.16–0.78. No block ends inside it.
const SLOTS: Array<[number, number, number, number]> = [
  // navbar zone (top strip, above text)
  [0.06, 0.085, 0.12, 0.022],   // logo
  [0.60, 0.090, 0.06, 0.016],   // nav link
  [0.68, 0.090, 0.06, 0.016],   // nav link
  [0.76, 0.090, 0.06, 0.016],   // nav link
  [0.86, 0.082, 0.08, 0.028],   // nav button
  // right column — hero visual + inner content (the "good" zone)
  [0.60, 0.180, 0.34, 0.42],    // big right rect
  [0.625, 0.215, 0.22, 0.022],  // inner headline bar
  [0.625, 0.265, 0.18, 0.014],  // inner subline
  [0.625, 0.300, 0.14, 0.014],  // inner subline
  [0.625, 0.500, 0.10, 0.030],  // inner CTA
  // 3 small cards in bottom-right strip (well clear of text + CTA)
  [0.60, 0.660, 0.105, 0.095],
  [0.72, 0.660, 0.105, 0.095],
  [0.84, 0.660, 0.105, 0.095],
  // footer (bottom strip, below text block)
  [0.06, 0.920, 0.88, 0.040],
];

export function HeroWireframe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let blocks: Block[] = [];
    let phase: Phase = "building";
    let phaseStart = performance.now();
    let alpha = 1;

    const reseedOrigins = (b: Block) => {
      b.sxFrac = Math.random();
      b.syFrac = Math.random();
      b.srRad = (Math.random() - 0.5) * 0.6; // ±~17°
    };

    const computeTargets = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      for (const b of blocks) {
        b.tx = b.tfx * w;
        b.ty = b.tfy * h;
        b.tw = b.tfw * w;
        b.th = b.tfh * h;
        b.tr = 0;
      }
    };

    const resetCycle = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      computeTargets();
      blocks.forEach((b, i) => {
        reseedOrigins(b);
        b.x = b.sxFrac * w - b.tw / 2;
        b.y = b.syFrac * h - b.th / 2;
        b.r = b.srRad;
        b.vx = 0; b.vy = 0; b.vr = 0;
        b.placed = false;
        b.flash = 0;
        b.placeAt = i * 360; // ~0.36s between placements
      });
      phase = "building";
      phaseStart = performance.now();
      alpha = 1;
    };

    const init = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      blocks = SLOTS.map(([fx, fy, fw, fh]) => ({
        tfx: fx, tfy: fy, tfw: fw, tfh: fh,
        tx: 0, ty: 0, tw: 0, th: 0, tr: 0,
        x: 0, y: 0, r: 0, vx: 0, vy: 0, vr: 0,
        placed: false, flash: 0, placeAt: 0,
        sxFrac: 0, syFrac: 0, srRad: 0,
      }));
      resetCycle();
    };
    setTimeout(init, 30);

    const onResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      computeTargets();
    };
    window.addEventListener("resize", onResize);

    const drawBlock = (b: Block, baseAlpha: number) => {
      const cx = b.x + b.tw / 2;
      const cy = b.y + b.th / 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(b.r);
      // base outline
      const outline = b.placed ? 0.22 : 0.10;
      ctx.globalAlpha = baseAlpha * outline;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      ctx.strokeRect(-b.tw / 2, -b.th / 2, b.tw, b.th);
      // flash on arrival
      if (b.flash > 0.02) {
        ctx.globalAlpha = baseAlpha * b.flash * 0.9;
        ctx.strokeStyle = "#6E56FF";
        ctx.lineWidth = 1.4;
        ctx.strokeRect(-b.tw / 2, -b.th / 2, b.tw, b.th);
      }
      ctx.restore();
    };

    let raf = 0;
    const tick = (now: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const elapsed = now - phaseStart;

      if (phase === "building") {
        let allPlaced = blocks.length > 0;
        for (const b of blocks) {
          if (!b.placed && elapsed >= b.placeAt) {
            const dx = b.tx - b.x, dy = b.ty - b.y, dr = b.tr - b.r;
            b.vx = (b.vx + dx * 0.16) * 0.74;
            b.vy = (b.vy + dy * 0.16) * 0.74;
            b.vr = (b.vr + dr * 0.16) * 0.74;
            b.x += b.vx; b.y += b.vy; b.r += b.vr;
            if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(b.vx) < 0.3 && Math.abs(b.vy) < 0.3 && Math.abs(dr) < 0.01) {
              b.x = b.tx; b.y = b.ty; b.r = 0;
              b.placed = true;
              b.flash = 1;
            } else {
              allPlaced = false;
            }
          } else if (!b.placed) {
            allPlaced = false;
          }
          b.flash *= 0.92;
        }
        if (allPlaced) { phase = "rest"; phaseStart = now; }
      } else if (phase === "rest") {
        for (const b of blocks) b.flash *= 0.92;
        if (elapsed > 2500) { phase = "fading"; phaseStart = now; }
      } else if (phase === "fading") {
        alpha = Math.max(0, 1 - elapsed / 1400);
        if (alpha <= 0.01) { phase = "hidden"; phaseStart = now; }
      } else if (phase === "hidden") {
        if (elapsed > 3000) resetCycle();
        raf = requestAnimationFrame(tick);
        return;
      }

      for (const b of blocks) drawBlock(b, alpha);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 h-full w-full"
      style={{ pointerEvents: "none" }}
    />
  );
}
