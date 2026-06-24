import { useEffect, useRef } from "react";

type P = { hx: number; hy: number; x: number; y: number; vx: number; vy: number; s: number; o: number };

export function AmbientParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: P[] = [];
    const mouse = { x: -9999, y: -9999, active: false };

    const resize = () => {
      const w = document.documentElement.scrollWidth;
      const h = document.documentElement.scrollHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(1,0,0,1,0,0);
      ctx.scale(dpr, dpr);

      const density = Math.floor((w * h) / 11000);
      const target = Math.min(density, 1400);
      particles = [];
      for (let i = 0; i < target; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        particles.push({ hx: x, hy: y, x, y, vx: 0, vy: 0, s: Math.random() * 1.4 + 0.5, o: Math.random() * 0.35 + 0.12 });
      }
    };
    setTimeout(resize, 50);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX + window.scrollX;
      mouse.y = e.clientY + window.scrollY;
      mouse.active = true;
    };
    const onLeave = () => { mouse.active = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    let raf = 0;
    const tick = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      const viewTop = window.scrollY - 200;
      const viewBot = window.scrollY + window.innerHeight + 200;

      const mx = mouse.x, my = mouse.y;
      const radius = 130;
      const radSq = radius * radius;

      for (const p of particles) {
        if (p.hy < viewTop || p.hy > viewBot) continue;

        if (mouse.active) {
          const dx = p.x - mx, dy = p.y - my;
          const d2 = dx * dx + dy * dy;
          if (d2 < radSq && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const force = (1 - d / radius) * 2.5;
            p.vx += (dx / d) * force;
            p.vy += (dy / d) * force;
          }
        }
        p.vx += (p.hx - p.x) * 0.05;
        p.vy += (p.hy - p.y) * 0.05;
        p.vx *= 0.82;
        p.vy *= 0.82;
        p.x += p.vx;
        p.y += p.vy;

        ctx.fillStyle = `rgba(255,255,255,${p.o})`;
        ctx.fillRect(p.x, p.y, p.s, p.s);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const ro = new ResizeObserver(() => resize());
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ position: "absolute", top: 0, left: 0, width: "100%", pointerEvents: "none", zIndex: 0 }}
    />
  );
}
