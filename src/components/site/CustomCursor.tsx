import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const [variant, setVariant] = useState<"default" | "interactive" | "text">("default");

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      const el = e.target as HTMLElement | null;
      if (!el) return;
      if (el.closest("a, button, [role=button], input, textarea, [data-magnetic]")) setVariant("interactive");
      else if (el.closest("h1, h2, h3, p, span, label")) setVariant("text");
      else setVariant("default");
    };
    window.addEventListener("mousemove", onMove);
    let raf = 0;
    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.18;
      pos.current.y += (target.current.y - pos.current.y) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  const size = variant === "interactive" ? 48 : variant === "text" ? 2 : 8;
  const height = variant === "text" ? 24 : size;
  return (
    <div
      ref={dotRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
      style={{
        width: size,
        height,
        borderRadius: variant === "text" ? 1 : 9999,
        border: variant === "text" ? "none" : "1px solid var(--electric)",
        background: variant === "interactive" ? "rgba(110,86,255,0.15)" : variant === "text" ? "var(--electric)" : "transparent",
        transition: "width .25s cubic-bezier(.2,.9,.3,1.2), height .25s cubic-bezier(.2,.9,.3,1.2), background .2s, border-radius .25s",
        mixBlendMode: "difference",
      }}
    />
  );
}
