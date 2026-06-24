import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useInView, useMotionValueEvent, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AmbientParticles } from "@/components/site/AmbientParticles";
import { HeroWireframe } from "@/components/site/HeroWireframe";
import { CustomCursor } from "@/components/site/CustomCursor";
import mockupTech from "@/assets/imagen nueva- tech.png";
import mockupDerma from "@/assets/imagen nueva-derma.png";
import restaurantNuevo from "@/assets/restaurant-nuevo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Camilo Meza Ytuarte — Diseño web que convierte visitas en clientes" },
      { name: "description", content: "Páginas web profesionales 100% a medida para pequeños y medianos negocios. Entrega en 3 a 7 días. Pago 50/50." },
    ],
  }),
  component: Index,
});

/* -------------------- helpers -------------------- */

function getAssetUrl(asset: any): string {
  if (typeof asset === 'string') return asset;
  if (asset && asset.url) return asset.url;
  return '';
}

function useLenis() {
  useEffect(() => {
    let lenis: any;
    let raf = 0;
    (async () => {
      const { default: Lenis } = await import("lenis");
      lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      const tick = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(tick); };
      raf = requestAnimationFrame(tick);
    })();
    return () => { cancelAnimationFrame(raf); lenis?.destroy?.(); };
  }, []);
}

function SplitText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const chars = Array.from(text);
  return (
    <span className={className} aria-label={text}>
      {chars.map((c, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          initial={{ y: "0.6em", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: delay + i * 0.02, type: "spring", stiffness: 110, damping: 14 }}
          style={{ whiteSpace: c === " " ? "pre" : undefined }}
        >
          {c}
        </motion.span>
      ))}
    </span>
  );
}

function ArrowCTA({ children, onClick, href }: { children: React.ReactNode; onClick?: () => void; href?: string }) {
  const Comp: any = href ? "a" : "button";
  return (
    <Comp
      href={href}
      onClick={onClick}
      data-magnetic
      className="group relative inline-flex items-center gap-3 py-2 text-sm uppercase tracking-[0.2em] text-white"
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-1 left-0 h-px w-0 bg-[var(--electric)] transition-[width] duration-500 ease-out group-hover:w-full" />
      </span>
      <span className="relative block h-px w-10 overflow-hidden">
        <span className="absolute inset-y-1/2 left-0 block h-px w-full bg-white/40 transition-all duration-500 group-hover:bg-[var(--electric)] group-hover:translate-x-2" />
      </span>
      <svg width="14" height="14" viewBox="0 0 14 14" className="transition-transform duration-500 group-hover:translate-x-2">
        <path d="M1 7h12M8 2l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
    </Comp>
  );
}

/* -------------------- HERO -------------------- */

function Hero() {
  const scrollTo = () => {
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-[1]">
        <HeroWireframe />
      </div>
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-transparent via-transparent to-[var(--void)]" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1600px] flex-col justify-center px-6 pt-32 md:px-12">
        <div className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/40">
          <span className="h-px w-8 bg-white/30" />
          <span className="font-mono">Estudio independiente · Diseño web a medida</span>
        </div>
        <h1 className="font-display font-extralight uppercase leading-[0.85] tracking-[-0.05em] text-white">
          <span className="block text-[clamp(38px,8.5vw,140px)]">
            <SplitText text="Camilo" />
          </span>
          <span className="block text-[clamp(38px,8.5vw,140px)] text-white/70">
            <SplitText text="Meza Ytuarte" delay={0.25} />
          </span>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mt-12 max-w-2xl text-2xl font-light leading-[1.25] tracking-tight text-white/85 md:text-4xl"
        >
          Diseño web que convierte visitas en clientes.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-white/70 md:text-xl"
        >
          Webs profesionales 100% a medida para negocios locales — listas para atraer clientes desde el primer día.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="mt-12"
        >
          <ArrowCTA onClick={scrollTo}>Quiero mi web</ArrowCTA>
        </motion.div>
      </div>
      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-white/30 font-mono">
        Scroll
      </div>
    </section>
  );
}

/* -------------------- PROCESS -------------------- */

const steps = [
  { n: "01", title: "Diagnóstico", text: "Entendemos tu negocio y a quién querés atraer. Sin tecnicismos." },
  { n: "02", title: "Diseño", text: "Una propuesta visual 100% adaptada a tu marca. Cero plantillas." },
  { n: "03", title: "Desarrollo", text: "Construimos tu web optimizada para que cargue rápido en cualquier dispositivo." },
  { n: "04", title: "Lanzamiento", text: "Publicamos tu sitio con dominio y hosting funcionando." },
  { n: "05", title: "Soporte", text: "Te acompañamos después del lanzamiento." },
];

function ProcessStep({ n, title, text }: typeof steps[number]) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3, once: false });
  return (
    <div ref={ref} className="relative grid min-h-[80vh] grid-cols-12 items-center gap-6 border-t border-white/5 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
        transition={{ type: "spring", stiffness: 100, damping: 18 }}
        className="col-span-12 md:col-span-5"
      >
        <div
          className="font-display text-[20vw] font-extralight leading-none md:text-[14vw]"
          style={{
            WebkitTextStroke: "2.5px rgba(255,255,255,0.35)",
            color: "transparent",
            letterSpacing: "-0.05em",
          }}
        >
          {n}
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ type: "spring", stiffness: 100, damping: 18, delay: 0.1 }}
        className="col-span-12 md:col-span-7"
      >
        <h3 className="font-display text-4xl font-extralight tracking-tight text-white md:text-6xl">{title}</h3>
        <p className="mt-6 max-w-md text-base font-light leading-relaxed text-white/50">{text}</p>
      </motion.div>
    </div>
  );
}

function ProcessSection() {
  return (
    <section className="relative z-10 mx-auto max-w-[1400px] px-6 py-32 md:px-12">
      <div className="mb-20 flex items-end justify-between">
        <div>
          <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--electric)]">
            <span className="h-px w-8 bg-[var(--electric)]" /> El proceso
          </div>
          <h2 className="font-display text-5xl font-extralight tracking-tight text-white md:text-7xl">
            Cinco pasos.<br /><span className="text-white/40">Sin sorpresas.</span>
          </h2>
        </div>
      </div>
      <div>
        {steps.map((s) => <ProcessStep key={s.n} {...s} />)}
      </div>
    </section>
  );
}

/* -------------------- RUBROS (horizontal scroll) -------------------- */

const rubros = [
  { tag: "01 / Sector", name: "Salud y Estética", desc: "Clínicas dentales, centros de estética, fisioterapia.", grad: "from-[#1a0f2e] to-[#050507]" },
  { tag: "02 / Sector", name: "Gastronomía", desc: "Restaurantes, bares, locales nocturnos.", grad: "from-[#2e1a0f] to-[#050507]" },
  { tag: "03 / Sector", name: "Comercios", desc: "Tiendas, indumentaria, negocios de barrio.", grad: "from-[#0f2e1f] to-[#050507]" },
  { tag: "04 / Sector", name: "Servicios Profesionales", desc: "Consultoras, estudios, freelancers.", grad: "from-[#0f1a2e] to-[#050507]" },
];

function RubrosSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });
  // 4 cards: translate from 0 to -(N-1)/N * 100vw effectively; we translate by -((N-1)*100)% of inner
  const n = rubros.length;
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${((n - 1) / n) * 100}%`]);
  const progressW = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={wrapRef} className="relative" style={{ height: `${n * 100}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute left-6 top-10 z-20 md:left-12">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--electric)]">Rubros con los que trabajamos</div>
        </div>
        <motion.div style={{ x, width: `${n * 100}vw` }} className="flex h-full">
          {rubros.map((r) => (
            <div key={r.name} className="relative h-full w-screen shrink-0">
              <div className={`absolute inset-0 bg-gradient-to-br ${r.grad}`} />
              <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-16">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--electric)]">{r.tag}</div>
                <h3
                  className="mt-6 font-display font-extralight uppercase leading-[0.85] tracking-[-0.05em] text-white"
                  style={{ fontSize: "clamp(40px, 13vw, 220px)" }}
                >
                  {r.name}
                </h3>
                <p className="mt-8 max-w-xl text-lg font-light text-white/50">{r.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
        <div className="absolute bottom-8 left-6 right-6 z-20 md:left-12 md:right-12">
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            <span>01</span>
            <div className="relative h-px flex-1 bg-white/10">
              <motion.div style={{ width: progressW }} className="absolute inset-y-0 left-0 bg-[var(--electric)]" />
            </div>
            <span>0{n}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- MOCKUPS -------------------- */

function Mockup({ src, idx }: { src: string; idx: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useTransform(my, [-50, 50], [6, -6]);
  const ry = useTransform(mx, [-50, 50], [-6, 6]);
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 100);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 100);
  };
  const onLeave = () => { mx.set(0); my.set(0); };
  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, scale: 0.94, y: 60 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ type: "spring", stiffness: 80, damping: 18 }}
      style={{ perspective: 1200 }}
      className="relative mx-auto w-full max-w-5xl"
    >
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="relative rounded-xl border border-white/10 bg-[#0a0a12] shadow-[0_30px_120px_-30px_rgba(110,86,255,0.45)]"
      >
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <div className="ml-4 h-5 flex-1 rounded bg-white/[0.04]" />
        </div>
        <div className="overflow-hidden rounded-b-xl">
          <img src={src} alt="" className="block w-full" loading="lazy" />
        </div>
      </motion.div>
    </motion.div>
  );
}

function MockupsSection() {
  const imgs = [restaurantNuevo, mockupTech, mockupDerma];
  return (
    <section className="relative z-10 mx-auto max-w-[1500px] space-y-40 px-6 py-40 md:px-12">
      {imgs.map((src, i) => (
        <Mockup key={i} src={src} idx={i} />
      ))}
      <p className="mx-auto max-w-2xl text-center text-lg font-light leading-relaxed text-white/55">
        Cada detalle, pensado para que tus clientes confíen en ti desde el primer segundo.
      </p>
    </section>
  );
}

/* -------------------- STATS -------------------- */

function CountUp({ to, suffix = "", from = 0, duration = 1900 }: { to: number; suffix?: string; from?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [n, setN] = useState(from);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      // easeOutCubic — perceivable mid-range, still fast
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, from, duration]);
  return <span ref={ref}>{n}{suffix}</span>;
}

function Stat({ value, label, delay, children }: { value?: string; label: string; delay: number; children?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="border-t border-white/10 pt-8"
    >
      <div className="font-mono text-6xl font-light tracking-tight text-[var(--electric)] md:text-8xl" style={{ fontVariantNumeric: "tabular-nums" }}>
        {children ?? value}
      </div>
      <div className="mt-6 max-w-sm text-sm font-light leading-relaxed text-white/55">{label}</div>
    </motion.div>
  );
}

function StatsSection() {
  return (
    <section className="relative z-10 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.6]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 py-32 md:px-12 md:py-48">
        <div className="mb-20 max-w-2xl">
          <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--electric)]">Cómo trabajamos</div>
          <h2 className="font-display text-5xl font-extralight tracking-tight text-white md:text-7xl">
            Hechos, no promesas.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-16 md:grid-cols-3 md:gap-10">
          <Stat label="Diseño a medida." delay={0}>
            <CountUp from={0} to={100} suffix="%" />
          </Stat>
          <Stat value="50/50" label="Pago simple y transparente (50% contra la demo y el resto contra la entrega final)." delay={0.2} />
          <Stat value="3-7 días" label="Tiempos de entrega final." delay={0.4} />
        </div>
      </div>
    </section>
  );
}

/* -------------------- PHILOSOPHY (word reveal) -------------------- */

const philosophyText =
  "Creemos que tu negocio no necesita una plantilla que también usa tu competencia. Necesita una web que cargue rápido, se vea increíble y convierta visitas en clientes — sin el precio ni los tiempos de una agencia grande.";

function PhilosophySection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "center 0.55"] });
  const [progress, setProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setProgress(v));

  const words = philosophyText.split(" ");
  const accent = "convierta";

  return (
    <section ref={ref} className="relative z-10 mx-auto max-w-4xl px-6 py-[30vh] md:px-12">
      <p
        className="font-display text-3xl font-light leading-[1.4] tracking-tight md:text-5xl"
        style={{ maxWidth: "60ch" }}
      >
        {words.map((w, i) => {
          const wordProgress = i / (words.length - 1);
          const active = progress >= wordProgress - 0.03;
          const isAccent = w.toLowerCase().replace(/[^a-záéíóúñ]/gi, "") === accent;
          return (
            <span
              key={i}
              className="inline-block transition-[color,opacity] duration-500"
              style={{
                color: active ? (isAccent ? "var(--electric)" : "#ffffff") : "rgba(255,255,255,0.18)",
                marginRight: "0.25em",
              }}
            >
              {w}
            </span>
          );
        })}
      </p>
    </section>
  );
}

/* -------------------- CONTACT -------------------- */

function FloatingInput({ label, name, type = "text", textarea }: { label: string; name: string; type?: string; textarea?: boolean }) {
  const [val, setVal] = useState("");
  const [focused, setFocused] = useState(false);
  const float = focused || val.length > 0;
  const common: CSSProperties = {
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(255,255,255,0.15)",
    outline: "none",
    width: "100%",
    color: "#fff",
    padding: "26px 0 10px",
    fontSize: "16px",
    fontWeight: 300,
    resize: textarea ? "none" : undefined,
  };
  return (
    <div className="relative">
      <label
        className="pointer-events-none absolute left-0 origin-left font-mono text-xs uppercase tracking-[0.2em] transition-all duration-300"
        style={{
          top: float ? 0 : 28,
          fontSize: float ? 10 : 12,
          color: float ? "var(--electric)" : "rgba(255,255,255,0.4)",
        }}
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          name={name}
          rows={2}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={common}
        />
      ) : (
        <input
          name={name}
          type={type}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={common}
        />
      )}
    </div>
  );
}

function ContactSection() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xbdvdovw", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(responseText || `Formspree respondió ${response.status}`);
      }

      setSent(true);
      form.reset();
    } catch (err) {
      console.error("Error enviando formulario:", err);
      setError(err instanceof Error ? err.message : "No se pudo enviar el formulario");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="relative z-10 mx-auto max-w-4xl px-6 pt-24 pb-12 md:px-12 md:py-40">
      <div className="mb-16">
        <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--electric)]">Contacto</div>
        <h2 className="font-display text-5xl font-extralight tracking-tight text-white md:text-7xl">
          Cuéntanos sobre<br />tu negocio.
        </h2>
        <p className="mt-6 max-w-md text-base font-light text-white/55">
          Te respondemos con una propuesta a medida. Sin compromiso, sin letra chica.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <FloatingInput label="Nombre" name="nombre" />
          <FloatingInput label="Negocio / rubro" name="negocio" />
          <FloatingInput label="Email" name="email" type="email" />
          <FloatingInput label="Teléfono (opcional)" name="tel" type="tel" />
        </div>

        <FloatingInput label="Cuéntanos brevemente qué necesitas" name="msg" textarea />

        <div className="pt-8">
          {!sent ? (
            <button
              type="submit"
              disabled={submitting}
              data-magnetic
              className="group relative inline-flex items-center gap-3 py-2 text-sm uppercase tracking-[0.2em] text-white disabled:opacity-50"
            >
              <span className="relative">
                {submitting ? "Enviando..." : "Enviar"}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[var(--electric)] transition-[width] duration-500 ease-out group-hover:w-full" />
              </span>
              <svg width="14" height="14" viewBox="0 0 14 14" className="transition-transform duration-500 group-hover:translate-x-2">
                <path d="M1 7h12M8 2l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1" />
              </svg>
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-[var(--electric)]"
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <motion.path
                  d="M3 9l4 4 8-9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6 }}
                />
              </svg>
              ¡Listo! Te contactamos pronto.
            </motion.div>
          )}

          {error && (
            <p className="mt-4 text-sm text-red-400">
              {error}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}

/* -------------------- FOOTER -------------------- */

function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 px-6 py-10 text-xs font-light text-white/35 md:flex-row md:px-12">
        <div className="font-mono uppercase tracking-[0.2em]">
          © 2026 camilomeza<span className="inline-block h-1 w-1 rounded-full bg-[var(--electric)] align-middle mx-[3px] dot-pulse" />com
        </div>
        <div className="flex gap-6 font-mono uppercase tracking-[0.2em]">
          <a href="#" className="hover:text-white/70">Aviso legal</a>
          <a href="#" className="hover:text-white/70">Privacidad</a>
        </div>
      </div>
    </footer>
  );
}

/* -------------------- NAV -------------------- */

function Nav() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-6 md:px-12">
        <a href="#" className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--electric)]" />
          Camilo Meza Ytuarte
        </a>
        <nav className="hidden gap-8 font-mono text-[10px] uppercase tracking-[0.3em] text-white/50 md:flex">
          <a href="#proceso" className="hover:text-white">Proceso</a>
          <a href="#rubros" className="hover:text-white">Rubros</a>
          <a href="#contacto" className="hover:text-white">Contacto</a>
        </nav>
      </div>
    </header>
  );
}

/* -------------------- ROOT -------------------- */

function Index() {
  useLenis();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[var(--void)] text-white">
      {/* Loader */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: loaded ? 0 : 1 }}
        transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
        style={{ pointerEvents: loaded ? "none" : "auto" }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--void)]"
      >
        <svg width="280" height="60" viewBox="0 0 280 60" className="overflow-visible">
          <motion.text
            x="0"
            y="44"
            fill="none"
            stroke="#ffffff"
            strokeWidth="0.6"
            className="font-display"
            style={{ fontSize: 42, fontWeight: 200, letterSpacing: "-0.04em" }}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          >
            CAMILO MEZA
          </motion.text>
        </svg>
      </motion.div>

      <CustomCursor />
      <AmbientParticles />
      <Nav />

      <main className="relative">
        <Hero />
        <div id="proceso"><ProcessSection /></div>
        <div id="rubros"><RubrosSection /></div>
        <MockupsSection />
        <StatsSection />
        <PhilosophySection />
        <ContactSection />
        <Footer />
      </main>
    </div>
  );
}
