import { useCallback, useEffect, useRef, useState } from "react";
import {
  AudioLines, BatteryCharging, BookOpen, Car, ChevronDown, Cloud, Factory, Flame,
  Gauge, Globe2, Leaf, Music, Pause, Play, RotateCcw, SkipForward, Sparkles,
  Sun, Volume2, VolumeX, Wind, Zap, ArrowUp, MousePointer2, GaugeCircle, Trees, Waves,
  CircleStop, ListMusic, Ear, Trophy, Check, X
} from "lucide-react";

/* ---------------- DATA ---------------- */
type Mix = { fosil: number; biomasa: number; hidro: number; nuclear: number; renovables: number };
type Era = {
  id: string; year: string; period: string; title: string; subtitle: string;
  description: string; narration: string; image: string; imageCaption: string;
  color: string; co2: number; co2Label: string; milestone: string; stat: string; statLabel: string;
  mix: Mix;
};

const SOURCES = [
  { key: "fosil" as const, label: "Fósiles · carbón, petróleo y gas", color: "#78716c" },
  { key: "biomasa" as const, label: "Biomasa tradicional", color: "#f59e0b" },
  { key: "hidro" as const, label: "Hidráulica", color: "#38bdf8" },
  { key: "nuclear" as const, label: "Nuclear", color: "#a78bfa" },
  { key: "renovables" as const, label: "Solar, eólica y otras renovables", color: "#34d399" },
];

const ERAS: Era[] = [
  {
    id: "fuego", year: "≈ 400.000 a. C.", period: "El origen", title: "El dominio del fuego",
    subtitle: "La primera revolución energética nació alrededor de una hoguera.",
    description: "Controlar el fuego permitió cocinar, calentarse, ahuyentar depredadores y colonizar climas fríos. La energía era biomasa local: leña, residuos y esfuerzo muscular. Era renovable a escala pequeña, pero limitada y muy ineficiente.",
    narration: "Hace unos cuatrocientos mil años, dominar el fuego cambió para siempre nuestra historia. Aquella primera llama nos dio calor, luz y protección. Toda nuestra energía procedía de la leña y de la fuerza de los cuerpos. Era el inicio del mix energético humano.",
    image: "https://images.pexels.com/photos/15949374/pexels-photo-15949374.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    imageCaption: "La hoguera: calor, luz, cocina y comunidad.", color: "#fb923c", co2: 2, co2Label: "Emisiones casi nulas a escala global",
    milestone: "Supervivencia y expansión humana", stat: "100 %", statLabel: "biomasa y fuerza muscular",
    mix: { fosil: 0, biomasa: 100, hidro: 0, nuclear: 0, renovables: 0 },
  },
  {
    id: "carbon", year: "1760 — 1840", period: "Revolución Industrial", title: "La era del carbón",
    subtitle: "El vapor multiplicó la fuerza… y también el humo.",
    description: "La máquina de vapor de Watt impulsó fábricas, trenes y barcos. El carbón sustituyó a la madera con mucha más densidad energética. Nacieron las ciudades industriales, pero también la contaminación masiva y el inicio del aumento sostenido de CO₂.",
    narration: "En el siglo dieciocho, el carbón encendió la Revolución Industrial. El vapor movió fábricas, trenes y barcos como nunca antes. El progreso se aceleró, pero el cielo de las ciudades se oscureció. Comenzaba la dependencia de los combustibles fósiles.",
    image: "https://images.pexels.com/photos/30531485/pexels-photo-30531485.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    imageCaption: "Chimeneas industriales: símbolo de potencia y contaminación.", color: "#a8a29e", co2: 18, co2Label: "El CO₂ empieza a crecer",
    milestone: "Mecanización y producción en masa", stat: "× 10", statLabel: "potencia disponible frente al músculo",
    mix: { fosil: 42, biomasa: 50, hidro: 8, nuclear: 0, renovables: 0 },
  },
  {
    id: "electricidad", year: "1882", period: "La luz moderna", title: "La electricidad ilumina el mundo",
    subtitle: "De la bombilla de Edison a las primeras redes urbanas.",
    description: "Edison inaugura en Nueva York la primera central eléctrica comercial. La electricidad separa el lugar donde se genera la energía del lugar donde se usa: llega la luz instantánea, el tranvía eléctrico y, poco después, las grandes presas hidroeléctricas.",
    narration: "En mil ochocientos ochenta y dos, la electricidad empezó a llegar a las ciudades. La bombilla transformó la noche en tiempo útil para trabajar, estudiar y vivir. La energía ya podía viajar por cables hasta hogares y fábricas.",
    image: "https://images.pexels.com/photos/2764942/pexels-photo-2764942.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    imageCaption: "La bombilla eléctrica redefinió el día y la noche.", color: "#facc15", co2: 24, co2Label: "Crece con carbón e industria",
    milestone: "Primeras redes eléctricas urbanas", stat: "1882", statLabel: "primera central comercial · Nueva York",
    mix: { fosil: 48, biomasa: 38, hidro: 14, nuclear: 0, renovables: 0 },
  },
  {
    id: "petroleo", year: "1900 — 1950", period: "Motor del siglo XX", title: "Petróleo: el mundo se pone en marcha",
    subtitle: "Automóviles, aviones y plástico: energía líquida para todo.",
    description: "El motor de combustión y el petróleo barato globalizaron el transporte. El coche pasó a ser un bien de masas y la petroquímica creó plásticos y fertilizantes. El mix se hizo más diverso, pero profundamente dependiente del petróleo y el gas.",
    narration: "Durante la primera mitad del siglo veinte, el petróleo puso ruedas al mundo. Coches, camiones y aviones conectaron países y continentes. Vivir se hizo más rápido y cómodo, aunque el planeta quedó atado al oro negro.",
    image: "https://images.pexels.com/photos/16133914/pexels-photo-16133914.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    imageCaption: "Un balancín petrolífero extrayendo crudo.", color: "#f59e0b", co2: 45, co2Label: "Emisiones en fuerte aceleración",
    milestone: "Transporte global y sociedad del automóvil", stat: "1950", statLabel: "el petróleo ya mueve al planeta",
    mix: { fosil: 62, biomasa: 24, hidro: 14, nuclear: 0, renovables: 0 },
  },
  {
    id: "atomo", year: "1954 — 1972", period: "Promesas y límites", title: "Átomo y grandes presas",
    subtitle: "Energía abundante sin humo… con nuevos riesgos.",
    description: "En 1954 la URSS conecta la primera central nuclear civil. La hidráulica vive su edad dorada con megapresas. La energía parecía ilimitada, hasta que los accidentes, los residuos radiactivos y el impacto de las presas mostraron su cara compleja.",
    narration: "En mil novecientos cincuenta y cuatro llegó la energía nuclear civil, junto a las grandes presas hidroeléctricas. Parecía energía infinita y sin humo. Pero pronto aprendimos que cada fuente tiene beneficios, costes y riesgos que gestionar.",
    image: "https://images.pexels.com/photos/18314304/pexels-photo-18314304.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    imageCaption: "Las grandes presas convirtieron ríos en electricidad.", color: "#a78bfa", co2: 52, co2Label: "Alto, pero frenado por hidro y nuclear",
    milestone: "Primera central nuclear civil (1954)", stat: "0 CO₂", statLabel: "directo al generar con nuclear e hidro",
    mix: { fosil: 68, biomasa: 12, hidro: 15, nuclear: 4, renovables: 1 },
  },
  {
    id: "despertar", year: "1973 — 1992", period: "El despertar sostenible", title: "Crisis del petróleo y conciencia verde",
    subtitle: "Cuando faltó el petróleo, el planeta empezó a hablar.",
    description: "La crisis de 1973 disparó los precios y reveló la fragilidad del modelo fósil. En paralelo: Conferencia de Estocolmo (1972), informe Brundtland (1987) que define el desarrollo sostenible y Cumbre de Río (1992). Eficiencia y renovables entran en la agenda.",
    narration: "En mil novecientos setenta y tres, la crisis del petróleo mostró la fragilidad del sistema. Nació entonces una idea decisiva: el desarrollo sostenible. Satisfacer las necesidades del presente sin comprometer a las generaciones futuras.",
    image: "https://images.pexels.com/photos/6963695/pexels-photo-6963695.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    imageCaption: "El planeta en nuestras manos: nace la conciencia ambiental global.", color: "#4ade80", co2: 58, co2Label: "La eficiencia empieza a frenarlo",
    milestone: "Informe Brundtland define «desarrollo sostenible»", stat: "1987", statLabel: "«Nuestro futuro común» cambia el debate",
    mix: { fosil: 72, biomasa: 9, hidro: 13, nuclear: 5, renovables: 1 },
  },
  {
    id: "kioto", year: "1997 — 2014", period: "Compromisos climáticos", title: "Kioto y el despegue renovable",
    subtitle: "El viento y el sol pasan del experimento a la industria.",
    description: "El Protocolo de Kioto (1997) pone los primeros límites legales a las emisiones. Alemania y España impulsan la eólica y la solar con primas; China escala la fabricación fotovoltaica y los costes comienzan su caída histórica.",
    narration: "Con el Protocolo de Kioto, los países aceptaron por primera vez límites a sus emisiones. Aerogeneradores y paneles solares se multiplicaron. Las renovables dejaron de ser una alternativa pequeña para convertirse en una industria global.",
    image: "https://images.pexels.com/photos/14036362/pexels-photo-14036362.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    imageCaption: "Parques eólicos: la nueva silueta del paisaje energético.", color: "#22d3ee", co2: 68, co2Label: "Máximos históricos, urge girar",
    milestone: "Protocolo de Kioto · primeros límites de emisiones", stat: "−80 %", statLabel: "caída del coste solar en una década",
    mix: { fosil: 68, biomasa: 8, hidro: 13, nuclear: 5, renovables: 6 },
  },
  {
    id: "paris", year: "2015", period: "El gran acuerdo", title: "París y los ODS: la hoja de ruta",
    subtitle: "195 países, un límite: no superar 1,5–2 °C.",
    description: "El Acuerdo de París compromete al mundo a frenar el calentamiento. La ONU aprueba los 17 Objetivos de Desarrollo Sostenible: el ODS 7 exige energía asequible y no contaminante para todas las personas antes de 2030.",
    narration: "En dos mil quince ocurrió algo histórico. Casi todos los países firmaron el Acuerdo de París y nacieron los Objetivos de Desarrollo Sostenible. El objetivo número siete lo dice claro: energía asequible, segura y limpia para todas las personas.",
    image: "https://images.pexels.com/photos/35105460/pexels-photo-35105460.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    imageCaption: "Solar y eólica trabajando juntas al atardecer.", color: "#34d399", co2: 64, co2Label: "La curva empieza a doblarse",
    milestone: "Acuerdo de París + ODS 7, 11 y 13", stat: "1,5 °C", statLabel: "límite para evitar los peores impactos",
    mix: { fosil: 62, biomasa: 7, hidro: 14, nuclear: 5, renovables: 12 },
  },
  {
    id: "solar", year: "2024", period: "La era solar", title: "La energía más barata de la historia",
    subtitle: "Solar, baterías, coche eléctrico e hidrógeno verde.",
    description: "La solar es hoy la fuente nueva más barata en gran parte del mundo. Las renovables superan el 30 % de la electricidad global, las baterías estabilizan la red y el hidrógeno verde apunta a descarbonizar acero, barcos y aviones.",
    narration: "Hoy vivimos la era solar. Generar electricidad con el sol es ya lo más barato en gran parte del mundo. Baterías, coches eléctricos e hidrógeno verde están cambiando industrias enteras. La transición ya no es un plan: está ocurriendo.",
    image: "https://images.pexels.com/photos/35105471/pexels-photo-35105471.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    imageCaption: "Un mar de paneles solares al amanecer en Vietnam.", color: "#fbbf24", co2: 55, co2Label: "Bajando donde las renovables lideran",
    milestone: "Renovables > 30 % de la electricidad mundial", stat: "+30 %", statLabel: "de la electricidad ya es renovable",
    mix: { fosil: 55, biomasa: 6, hidro: 14, nuclear: 5, renovables: 20 },
  },
  {
    id: "futuro", year: "2050", period: "El destino que elegimos", title: "Neutralidad climática: el futuro",
    subtitle: "No es una predicción. Es una decisión colectiva.",
    description: "Los escenarios de la AIE y el IPCC coinciden: para limitar el calentamiento a 1,5 °C el mix de 2050 debe superar el 80 % de renovables, electrificar transporte e industria y capturar el CO₂ residual. El futuro se escribe con las decisiones de hoy.",
    narration: "El viaje termina mirando al año dos mil cincuenta. Un mundo con aire limpio, energía renovable y ciudades verdes es técnicamente posible. No es una predicción automática: es una decisión que tomamos hoy, juntas y juntos.",
    image: "https://images.pexels.com/photos/34401311/pexels-photo-34401311.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    imageCaption: "La granja sostenible que anticipa el paisaje de 2050.", color: "#6ee7b7", co2: 8, co2Label: "Objetivo: emisiones netas cero",
    milestone: "Objetivo global: cero emisiones netas", stat: "> 80 %", statLabel: "renovables en el mix de 2050",
    mix: { fosil: 8, biomasa: 4, hidro: 16, nuclear: 6, renovables: 66 },
  },
];

const TRACKS = [
  { title: "Tema Terra · Amanecer renovable", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
  { title: "Tema Terra · Corrientes de viento", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" },
  { title: "Tema Terra · Horizonte 2050", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" },
];

const QUIZ = [
  { q: "¿Qué define al desarrollo sostenible (Informe Brundtland, 1987)?", options: ["Crecer sin límites", "Satisfacer el presente sin comprometer el futuro", "Dejar de usar energía"], answer: 1 },
  { q: "¿Qué garantiza el ODS 7 de la ONU?", options: ["Energía asequible y no contaminante para todos", "Más petróleo barato", "Energía solo en ciudades"], answer: 0 },
  { q: "¿Cuál es hoy la forma nueva de electricidad más barata en gran parte del mundo?", options: ["El carbón", "La solar fotovoltaica", "El diésel"], answer: 1 },
];

/* ---------------- CUSTOM CURSOR + TRAIL ---------------- */
function CursorFX({ enabled }: { enabled: boolean }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let w = (canvas.width = window.innerWidth), h = (canvas.height = window.innerHeight);
    type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; hue: number };
    let parts: P[] = [];
    const mouse = { x: w / 2, y: h / 2, tx: w / 2, ty: h / 2 };
    const ring = { x: w / 2, y: h / 2 };
    let hovering = false, down = false, raf = 0;

    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    const spawn = (x: number, y: number, n: number, power = 1) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, s = (Math.random() * 1.6 + .3) * power;
        parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - .4, life: 0, max: 45 + Math.random() * 40, size: 1 + Math.random() * 3.2, hue: [38, 150, 190, 85][Math.floor(Math.random() * 4)] });
      }
      if (parts.length > 420) parts = parts.slice(-420);
    };
    const onMove = (e: MouseEvent) => {
      mouse.tx = e.clientX; mouse.ty = e.clientY;
      const t = e.target as HTMLElement;
      hovering = !!t.closest("button,a,input,[data-hover]");
      if (enabledRef.current) spawn(e.clientX, e.clientY, 3);
    };
    const onDown = (e: MouseEvent) => { down = true; if (enabledRef.current) spawn(e.clientX, e.clientY, 26, 2.2); };
    const onUp = () => (down = false);

    const loop = () => {
      mouse.x += (mouse.tx - mouse.x) * .35; mouse.y += (mouse.ty - mouse.y) * .35;
      ring.x += (mouse.tx - ring.x) * .16; ring.y += (mouse.ty - ring.y) * .16;
      if (dotRef.current) dotRef.current.style.transform = `translate(${mouse.x}px,${mouse.y}px) translate(-50%,-50%) scale(${down ? .7 : 1})`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${ring.x}px,${ring.y}px) translate(-50%,-50%) scale(${hovering ? 1.9 : 1}) rotate(${(ring.x + ring.y) % 360}deg)`;
      ctx.clearRect(0, 0, w, h);
      parts = parts.filter(p => p.life < p.max);
      for (const p of parts) {
        p.life++; p.x += p.vx; p.y += p.vy; p.vy += .015; p.vx *= .96; p.vy *= .96;
        const k = 1 - p.life / p.max;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * k + .4, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},95%,65%,${k * .85})`;
        ctx.shadowColor = `hsla(${p.hue},95%,60%,.9)`; ctx.shadowBlur = 12; ctx.fill(); ctx.shadowBlur = 0;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); window.removeEventListener("mousemove", onMove); window.removeEventListener("mousedown", onDown); window.removeEventListener("mouseup", onUp); };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[9998]" aria-hidden />
      <div ref={dotRef} className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-2.5 w-2.5 rounded-full bg-amber-300 shadow-[0_0_18px_rgba(251,191,36,.95)] md:block" />
      <div ref={ringRef} className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-10 w-10 items-center justify-center md:flex" aria-hidden>
        <div className="absolute inset-0 rounded-full border-2 border-emerald-300/80" />
        <div className="absolute h-1.5 w-1.5 rounded-full bg-cyan-300" style={{ transform: "translateY(-20px)" }} />
        <Sparkles className="h-3.5 w-3.5 text-amber-200" />
      </div>
    </>
  );
}

/* ---------------- APP ---------------- */
export default function App() {
  const [activeId, setActiveId] = useState(ERAS[0].id);
  const [progress, setProgress] = useState(0);
  const [autoScroll, setAutoScroll] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [musicOn, setMusicOn] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);
  const [volume, setVolume] = useState(.45);
  const [narrationOn, setNarrationOn] = useState(false);
  const [speaking, setSpeaking] = useState<string>("");
  const [subtitle, setSubtitle] = useState<string>("");
  const [trailOn, setTrailOn] = useState(true);
  const [selectedMix, setSelectedMix] = useState(ERAS[ERAS.length - 2]);
  const [sim, setSim] = useState({ renovables: 55, eficiencia: 40, transporte: 45 });
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const audioRef = useRef<HTMLAudioElement>(null);
  const autoRef = useRef(autoScroll); autoRef.current = autoScroll;
  const speedRef = useRef(speed); speedRef.current = speed;
  const narrationRef = useRef(narrationOn); narrationRef.current = narrationOn;
  const lastSpokenRef = useRef<string>("");
  const active = ERAS.find(e => e.id === activeId) ?? ERAS[0];

  /* narration */
  const speak = useCallback((text: string, key: string) => {
    if (!("speechSynthesis" in window)) { setSubtitle(text); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "es-ES"; u.rate = 1.02; u.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const es = voices.find(v => v.lang.toLowerCase().startsWith("es"));
    if (es) u.voice = es;
    u.onstart = () => { setSpeaking(key); setSubtitle(text); };
    u.onend = () => { setSpeaking(""); };
    u.onerror = () => setSpeaking("");
    lastSpokenRef.current = key;
    window.speechSynthesis.speak(u);
  }, []);

  const stopSpeak = useCallback(() => { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); setSpeaking(""); setSubtitle(""); }, []);

  useEffect(() => { if (!narrationOn) stopSpeak(); }, [narrationOn, stopSpeak]);

  /* music */
  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);
  const toggleMusic = async () => {
    const a = audioRef.current; if (!a) return;
    if (musicOn) { a.pause(); setMusicOn(false); } else { try { await a.play(); setMusicOn(true); } catch { setMusicOn(false); } }
  };
  const nextTrack = () => { setTrackIdx(i => (i + 1) % TRACKS.length); if (musicOn) setTimeout(() => audioRef.current?.play().catch(() => {}), 80); };

  /* autoscroll */
  useEffect(() => {
    let raf = 0;
    const step = () => {
      if (autoRef.current) {
        window.scrollBy(0, speedRef.current * 1.15);
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) setAutoScroll(false);
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    const pauseOnUser = () => { if (autoRef.current) setAutoScroll(false); };
    window.addEventListener("wheel", pauseOnUser, { passive: true });
    window.addEventListener("touchmove", pauseOnUser, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("wheel", pauseOnUser); window.removeEventListener("touchmove", pauseOnUser); };
  }, []);

  /* scroll progress + active era */
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          const id = (en.target as HTMLElement).dataset.eraId!;
          setActiveId(id);
          const era = ERAS.find(e => e.id === id);
          if (era && narrationRef.current && lastSpokenRef.current !== id) speak(era.narration, id);
        }
      });
    }, { rootMargin: "-42% 0px -42% 0px" });
    document.querySelectorAll("[data-era-id]").forEach(el => obs.observe(el));
    return () => { window.removeEventListener("scroll", onScroll); obs.disconnect(); };
  }, [speak]);

  const startExperience = async () => {
    setNarrationOn(true); setTrailOn(true);
    const a = audioRef.current;
    if (a) { try { await a.play(); setMusicOn(true); } catch { /* user can retry from dock */ } }
    document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      setAutoScroll(true);
      const first = ERAS[0];
      speak("Bienvenido a este viaje sonoro. " + first.narration, first.id);
    }, 700);
  };

  const goEra = (id: string) => document.querySelector(`[data-era-id="${id}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });

  const simScore = Math.round(sim.renovables * .5 + sim.eficiencia * .25 + sim.transporte * .25);
  const co2Avoided = (simScore * .42).toFixed(1);
  const quizDone = Object.keys(answers).length === QUIZ.length;
  const quizScore = QUIZ.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0);

  return (
    <div className="min-h-screen bg-[#04100b] font-sans text-emerald-50 antialiased">
      <CursorFX enabled={trailOn} />
      <audio ref={audioRef} src={TRACKS[trackIdx].url} loop preload="none" />

      {/* top progress */}
      <div className="fixed inset-x-0 top-0 z-[90] h-1.5 bg-white/10">
        <div className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
      </div>

      {/* side era nav */}
      <nav className="fixed right-4 top-1/2 z-[80] hidden -translate-y-1/2 flex-col gap-2.5 lg:flex" aria-label="Épocas">
        {ERAS.map(e => (
          <button key={e.id} onClick={() => goEra(e.id)} title={`${e.year} · ${e.title}`}
            className={`group flex items-center justify-end gap-2`}>
            <span className={`rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold opacity-0 backdrop-blur transition group-hover:opacity-100 ${activeId === e.id ? "text-amber-200" : "text-white/70"}`}>{e.year}</span>
            <span className="block rounded-full border transition-all" style={{ width: activeId === e.id ? 26 : 10, height: 10, background: activeId === e.id ? e.color : "rgba(255,255,255,.25)", borderColor: e.color }} />
          </button>
        ))}
      </nav>

      {/* HERO */}
      <header className="relative flex min-h-[100svh] items-end overflow-hidden">
        <img src="https://images.pexels.com/photos/29056690/pexels-photo-29056690.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" alt="Aerogeneradores y paneles solares en un paisaje sostenible" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04100b] via-[#04100b]/55 to-cyan-950/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(52,211,153,.25),transparent_55%)]" />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-28 pt-24 sm:px-8">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-200 ring-1 ring-emerald-300/40 backdrop-blur"><Leaf className="h-3.5 w-3.5" /> Línea del tiempo interactiva</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-xs font-bold text-amber-200 ring-1 ring-amber-300/40 backdrop-blur"><Music className="h-3.5 w-3.5" /> Música · <Ear className="h-3.5 w-3.5" /> Narración · <Sparkles className="h-3.5 w-3.5" /> Cursor mágico</span>
          </div>
          <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
            De la <span className="text-amber-300">llama</span><br />a la <span className="text-shine">luz limpia</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-emerald-50/85 sm:text-xl">
            La evolución del <strong className="text-white">mix energético</strong> y el nacimiento del <strong className="text-white">desarrollo sostenible</strong>: un viaje narrado desde la primera hoguera hasta el horizonte de 2050.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={startExperience} className="pulse-ring inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-4 text-base font-black text-emerald-950 shadow-xl shadow-emerald-500/30 transition hover:scale-[1.03]">
              <Play className="h-5 w-5 fill-current" /> Iniciar viaje con sonido y narración
            </button>
            <button onClick={() => document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-6 py-4 font-bold text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white/20">
              <BookOpen className="h-5 w-5" /> Explorar a mi ritmo
            </button>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-white/60"><MousePointer2 className="h-3.5 w-3.5 text-amber-300" /> Mueve el ratón: tu cursor deja una estela de chispas. Haz clic para hacerla estallar.</p>

          <div className="mt-10 grid max-w-3xl grid-cols-3 gap-3">
            {[
              { icon: Flame, v: "400 mil años", l: "de historia energética" },
              { icon: Sun, v: "+30 %", l: "electricidad renovable hoy" },
              { icon: Globe2, v: "1,5 °C", l: "límite del Acuerdo de París" },
            ].map(s => (
              <div key={s.l} className="rounded-2xl bg-black/35 p-4 ring-1 ring-white/15 backdrop-blur">
                <s.icon className="mb-2 h-5 w-5 text-amber-300" />
                <div className="text-xl font-black sm:text-2xl">{s.v}</div>
                <div className="text-[11px] leading-tight text-white/65 sm:text-xs">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 md:block"><ChevronDown className="h-7 w-7 animate-bounce text-white/70" /></div>
      </header>

      {/* marquee */}
      <div className="overflow-hidden border-y border-emerald-300/15 bg-emerald-950/60 py-3">
        <div className="animate-marquee flex w-max gap-8 whitespace-nowrap text-sm font-bold tracking-wide text-emerald-200/80">
          {[0, 1].map(k => <span key={k} className="flex gap-8">{["FUEGO", "CARBÓN", "ELECTRICIDAD", "PETRÓLEO", "ÁTOMO", "CONCIENCIA VERDE", "KIOTO", "PARÍS · ODS 7", "ERA SOLAR", "2050 NEUTRO"].map(w => <span key={w} className="flex items-center gap-8">{w}<Sparkles className="h-4 w-4 text-amber-300" /></span>)}</span>)}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { icon: Music, c: "#fbbf24", t: "Música de fondo", d: "El «Tema Terra» acompaña el viaje. Actívala o cambia de pista en la barra inferior." },
            { icon: AudioLines, c: "#34d399", t: "Narración automática", d: "Al llegar a cada época, una voz en español te cuenta su historia. También puedes pulsar «Escuchar» en cada tarjeta." },
            { icon: GaugeCircle, c: "#22d3ee", t: "Autoscroll guiado", d: "El viaje se desplaza solo, como un documental. Rueda del ratón o pausa cuando quieras detenerte." },
            { icon: Sparkles, c: "#f472b6", t: "Cursor con rastro", d: "Tu cursor es una brasa luminosa que deja chispas de colores. Puedes apagar la estela desde la barra." },
          ].map(c => (
            <article key={c.t} className="rounded-3xl bg-white/[.04] p-5 ring-1 ring-white/10">
              <c.icon className="mb-3 h-7 w-7" style={{ color: c.c }} />
              <h3 className="font-black">{c.t}</h3><p className="mt-1 text-sm leading-relaxed text-white/65">{c.d}</p>
            </article>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <main id="timeline" className="relative mx-auto max-w-6xl scroll-mt-16 px-5 pb-24 sm:px-8">
        <div className="mb-14 text-center">
          <p className="text-xs font-black uppercase tracking-[.3em] text-cyan-300">El recorrido · 10 épocas</p>
          <h2 className="mt-3 text-4xl font-black sm:text-5xl">La gran transición energética</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/65">Cada tarjeta muestra su imagen, su mix energético, su impacto en CO₂ y el hito de sostenibilidad que la define.</p>
          <div className="mx-auto mt-6 max-w-xl rounded-2xl bg-white/[.04] p-4 ring-1 ring-white/10">
            <div className="mb-2 flex justify-between text-xs font-bold"><span style={{ color: active.color }}>{active.year} · {active.title}</span><span className="text-white/50">{Math.round(progress * 100)} % del viaje</span></div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full transition-all duration-300" style={{ width: `${Math.max(4, progress * 100)}%`, background: active.color }} /></div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-5 top-0 h-full w-1 -translate-x-1/2 rounded-full bg-white/10 md:left-1/2">
            <div className="w-full rounded-full bg-gradient-to-b from-amber-400 via-emerald-400 to-cyan-400 transition-all duration-200" style={{ height: `${progress * 100}%` }} />
          </div>

          <div className="space-y-14">
            {ERAS.map((era, i) => {
              const left = i % 2 === 0;
              const isActive = activeId === era.id;
              return (
                <article key={era.id} data-era-id={era.id} className={`relative pl-14 md:w-[calc(50%-2.5rem)] md:pl-0 ${left ? "md:mr-auto" : "md:ml-auto"}`}>
                  <div className="absolute left-5 top-10 z-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border-4 border-[#04100b] shadow-lg md:hidden"
                    style={{ background: era.color }}>
                    <Zap className="h-5 w-5 text-black/70" />
                  </div>
                  <div className={`absolute top-12 hidden h-11 w-11 translate-y-0 items-center justify-center rounded-full border-4 border-[#04100b] md:flex ${left ? "-right-[4.28rem]" : "-left-[4.28rem]"}`} style={{ background: era.color }}>
                    <Zap className="h-5 w-5 text-black/70" />
                  </div>

                  <div className={`overflow-hidden rounded-[1.8rem] bg-white/[.045] ring-1 backdrop-blur transition-all duration-500 ${isActive ? "shadow-2xl" : "ring-white/10"}`} style={isActive ? { boxShadow: `0 24px 70px -18px ${era.color}66`, outline: `1px solid ${era.color}88` } : undefined}>
                    <div className="relative h-56 overflow-hidden sm:h-64">
                      <img src={era.image} alt={era.imageCaption} className="h-full w-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                      <span className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-black text-black" style={{ background: era.color }}>{era.year}</span>
                      {speaking === era.id && <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-xs font-bold text-emerald-200 ring-1 ring-emerald-300/50"><span className="flex h-3 items-end gap-[2px]">{[0, 1, 2].map(b => <span key={b} className="eq-bar w-[3px] rounded bg-emerald-300" style={{ height: 12, animationDelay: `${b * .15}s` }} />)}</span> Narrando…</span>}
                      <p className="absolute bottom-3 left-4 right-4 text-xs font-medium text-white/85">{era.imageCaption}</p>
                    </div>

                    <div className="p-6">
                      <p className="text-[11px] font-black uppercase tracking-[.25em]" style={{ color: era.color }}>{era.period}</p>
                      <h3 className="mt-1.5 text-2xl font-black leading-tight sm:text-[1.7rem]">{era.title}</h3>
                      <p className="mt-1 font-semibold text-white/75">{era.subtitle}</p>
                      <p className="mt-3 text-sm leading-relaxed text-white/65">{era.description}</p>

                      <button onClick={() => { setNarrationOn(true); speaking === era.id ? stopSpeak() : speak(era.narration, era.id); }}
                        className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black text-black transition hover:scale-[1.03]" style={{ background: era.color }}>
                        {speaking === era.id ? <><CircleStop className="h-4 w-4" /> Detener narración</> : <><Volume2 className="h-4 w-4" /> Escuchar esta época</>}
                      </button>

                      {/* mix */}
                      <div className="mt-6">
                        <div className="mb-2 flex items-center justify-between text-xs font-bold"><span className="text-white/70">Mix energético de la época</span><span style={{ color: era.color }}>{era.mix.renovables + era.mix.hidro + era.mix.biomasa >= 50 ? "Predominio renovable" : era.mix.fosil >= 55 ? "Predominio fósil" : "Mix en transición"}</span></div>
                        <div className="flex h-5 overflow-hidden rounded-full ring-1 ring-white/15">
                          {SOURCES.map(s => era.mix[s.key] > 0 && <div key={s.key} title={`${s.label}: ${era.mix[s.key]}%`} className="h-full transition-all duration-700" style={{ width: `${era.mix[s.key]}%`, background: s.color }} />)}
                        </div>
                        <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1">
                          {SOURCES.filter(s => era.mix[s.key] > 0).map(s => <span key={s.key} className="inline-flex items-center gap-1 text-[11px] text-white/60"><span className="h-2 w-2 rounded-full" style={{ background: s.color }} />{s.label.split("·")[0]} {era.mix[s.key]}%</span>)}
                        </div>
                      </div>

                      {/* co2 + stat */}
                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-black/30 p-3.5 ring-1 ring-white/10">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-white/55"><Cloud className="h-3.5 w-3.5" /> Impacto CO₂</div>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-400" style={{ width: `${era.co2}%` }} /></div>
                          <p className="mt-1.5 text-[11px] leading-tight text-white/60">{era.co2Label}</p>
                        </div>
                        <div className="rounded-2xl bg-black/30 p-3.5 ring-1 ring-white/10">
                          <div className="text-[11px] font-bold text-white/55">Dato clave</div>
                          <div className="mt-1 text-xl font-black" style={{ color: era.color }}>{era.stat}</div>
                          <p className="text-[11px] leading-tight text-white/60">{era.statLabel}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-start gap-2 rounded-2xl border border-dashed p-3.5 text-sm" style={{ borderColor: `${era.color}66`, background: `${era.color}11` }}>
                        <Leaf className="mt-0.5 h-4 w-4 shrink-0" style={{ color: era.color }} />
                        <p className="text-white/80"><strong className="text-white">Hito sostenible:</strong> {era.milestone}</p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </main>

      {/* MIX EXPLORER */}
      <section className="border-y border-white/10 bg-white/[.025]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-xs font-black uppercase tracking-[.3em] text-amber-300">Explora los datos</p><h2 className="mt-2 text-3xl font-black sm:text-4xl">El mix, época a época</h2><p className="mt-2 max-w-xl text-white/60">Pulsa un año y observa cómo se reparten las fuentes. La barra cuenta 400.000 años en un vistazo.</p></div>
            <Factory className="hidden h-12 w-12 text-white/15 md:block" />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {ERAS.map(e => <button key={e.id} onClick={() => setSelectedMix(e)} className={`rounded-full px-3.5 py-2 text-xs font-black transition ${selectedMix.id === e.id ? "text-black" : "bg-white/[.06] text-white/70 ring-1 ring-white/15 hover:bg-white/10"}`} style={selectedMix.id === e.id ? { background: e.color } : undefined}>{e.year}</button>)}
          </div>
          <div className="mt-6 rounded-[1.8rem] bg-black/35 p-6 ring-1 ring-white/10">
            <div className="mb-3 flex flex-wrap justify-between gap-2"><h3 className="text-xl font-black">{selectedMix.title}</h3><span className="rounded-full px-3 py-1 text-xs font-black text-black" style={{ background: selectedMix.color }}>{selectedMix.year}</span></div>
            <div className="flex h-12 overflow-hidden rounded-2xl ring-1 ring-white/15">
              {SOURCES.map(s => selectedMix.mix[s.key] > 0 && <div key={s.key} className="flex h-full items-center justify-center text-xs font-black text-black/75 transition-all duration-700" style={{ width: `${selectedMix.mix[s.key]}%`, background: s.color }}>{selectedMix.mix[s.key] >= 9 ? `${selectedMix.mix[s.key]}%` : ""}</div>)}
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {SOURCES.map(s => <div key={s.key} className="rounded-xl bg-white/[.04] p-3 ring-1 ring-white/10"><span className="mb-1.5 block h-2.5 w-8 rounded-full" style={{ background: s.color }} /><div className="text-lg font-black">{selectedMix.mix[s.key]} %</div><div className="text-[11px] leading-tight text-white/55">{s.label}</div></div>)}
            </div>
          </div>
        </div>
      </section>

      {/* ODS */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <p className="text-center text-xs font-black uppercase tracking-[.3em] text-emerald-300">Desarrollo sostenible</p>
        <h2 className="mt-2 text-center text-3xl font-black sm:text-4xl">La energía que cuida el futuro</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Zap, n: "ODS 7", c: "#f59e0b", t: "Energía asequible y limpia", d: "Acceso universal a energía moderna y duplicar la cuota renovable y la eficiencia." },
            { icon: Globe2, n: "ODS 13", c: "#34d399", t: "Acción por el clima", d: "Medidas urgentes contra el cambio climático: recortar emisiones y adaptarse a sus impactos." },
            { icon: Trees, n: "ODS 11", c: "#22d3ee", t: "Ciudades sostenibles", d: "Transporte público eléctrico, edificios eficientes y aire limpio para quien vive en ciudades." },
            { icon: Waves, n: "ODS 6 + 14", c: "#38bdf8", t: "Agua y océanos sanos", d: "La hidroeléctrica responsable y el fin de vertidos fósiles protegen ríos y mares." },
          ].map(o => (
            <article key={o.n} className="rounded-3xl p-5 ring-1" style={{ background: `${o.c}10`, borderColor: o.c }}>
              <div className="flex items-center justify-between"><o.icon className="h-7 w-7" style={{ color: o.c }} /><span className="rounded-full px-2.5 py-1 text-[11px] font-black text-black" style={{ background: o.c }}>{o.n}</span></div>
              <h3 className="mt-3 font-black">{o.t}</h3><p className="mt-1 text-sm leading-relaxed text-white/65">{o.d}</p>
            </article>
          ))}
        </div>

        {/* simulator */}
        <div className="mt-10 grid gap-6 rounded-[2rem] bg-gradient-to-br from-emerald-400/15 via-white/[.04] to-cyan-400/10 p-6 ring-1 ring-emerald-300/25 lg:grid-cols-[1.2fr_.8fr] sm:p-8">
          <div>
            <div className="flex items-center gap-2"><BatteryCharging className="h-6 w-6 text-emerald-300" /><h3 className="text-2xl font-black">Simula tu planeta 2050</h3></div>
            <p className="mt-1 text-sm text-white/65">Mueve los controles y descubre tu puntuación de sostenibilidad.</p>
            {[
              { key: "renovables" as const, label: "Energía renovable (solar, eólica, hidro)", icon: Sun },
              { key: "eficiencia" as const, label: "Eficiencia: edificios, industria y consumo", icon: Gauge },
              { key: "transporte" as const, label: "Transporte eléctrico y público", icon: Car },
            ].map(s => (
              <label key={s.key} className="mt-5 block">
                <span className="mb-1.5 flex items-center justify-between text-sm font-bold"><span className="flex items-center gap-2"><s.icon className="h-4 w-4 text-amber-300" />{s.label}</span><span className="rounded-full bg-black/40 px-2.5 py-0.5 text-emerald-300 ring-1 ring-white/10">{sim[s.key]} %</span></span>
                <input type="range" min={0} max={100} value={sim[s.key]} onChange={e => setSim(v => ({ ...v, [s.key]: Number(e.target.value) }))} className="w-full" aria-label={s.label} />
              </label>
            ))}
          </div>
          <div className="flex flex-col items-center justify-center rounded-3xl bg-black/35 p-6 text-center ring-1 ring-white/10">
            <div className="relative flex h-36 w-36 items-center justify-center">
              <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90"><circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="9" /><circle cx="50" cy="50" r="42" fill="none" stroke="#34d399" strokeWidth="9" strokeLinecap="round" strokeDasharray="264" strokeDashoffset={264 - (264 * simScore) / 100} className="transition-all duration-500" /></svg>
              <div><div className="text-4xl font-black">{simScore}</div><div className="text-[10px] font-bold uppercase tracking-widest text-white/50">/ 100 puntos</div></div>
            </div>
            <p className="mt-3 font-black text-emerald-200">{simScore >= 75 ? "¡Planeta en ruta 1,5 °C!" : simScore >= 45 ? "Buen rumbo: acelera renovables" : "Riesgo alto: hay que actuar ya"}</p>
            <p className="mt-1 text-sm text-white/60">Evitarías aprox. <strong className="text-white">{co2Avoided} Gt de CO₂</strong> al año frente a un mundo fósil.</p>
          </div>
        </div>

        {/* quiz */}
        <div className="mt-6 rounded-[2rem] bg-white/[.04] p-6 ring-1 ring-white/10 sm:p-8">
          <div className="flex items-center gap-2"><Trophy className="h-6 w-6 text-amber-300" /><h3 className="text-2xl font-black">Mini-quiz del viajero energético</h3></div>
          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            {QUIZ.map((q, qi) => (
              <fieldset key={q.q}>
                <legend className="text-sm font-bold leading-snug">{qi + 1}. {q.q}</legend>
                <div className="mt-2.5 space-y-2">
                  {q.options.map((op, oi) => {
                    const picked = answers[qi] === oi, correct = oi === q.answer;
                    return <button key={op} onClick={() => setAnswers(a => ({ ...a, [qi]: oi }))} className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold ring-1 transition ${picked ? (correct ? "bg-emerald-400/20 text-emerald-100 ring-emerald-300" : "bg-red-400/20 text-red-100 ring-red-300") : "bg-black/30 text-white/75 ring-white/10 hover:bg-white/[.07]"}`}>{op}{picked && (correct ? <Check className="h-4 w-4 shrink-0" /> : <X className="h-4 w-4 shrink-0" />)}</button>;
                  })}
                </div>
              </fieldset>
            ))}
          </div>
          {quizDone && <div className="mt-5 rounded-2xl bg-gradient-to-r from-amber-400/20 to-emerald-400/20 p-4 text-center font-black ring-1 ring-emerald-300/40">Tu resultado: {quizScore} / {QUIZ.length} {quizScore === QUIZ.length ? "· ¡Guardián del clima! 🏆" : "· Sigue explorando la línea del tiempo"}</div>}
        </div>
      </section>

      <footer className="relative overflow-hidden border-t border-white/10">
        <img src="https://images.pexels.com/photos/35105458/pexels-photo-35105458.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" alt="Parque solar y eólico entre montañas" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04100b] via-[#04100b]/80 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-5 py-16 text-center sm:px-8">
          <Wind className="animate-floaty mx-auto h-10 w-10 text-emerald-300" />
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-black sm:text-4xl">La próxima época la escribes tú.</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/65">Cada panel instalado, cada viaje en transporte público y cada bombilla eficiente es una línea más de esta historia.</p>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white text-sm font-black text-emerald-950 px-5 py-3 transition hover:scale-105"><RotateCcw className="h-4 w-4" /> Repetir el viaje</button>
          <p className="mt-8 text-xs text-white/45">Imágenes: Pexels · Música: SoundHelix (Tema Terra) · Narración: voz del navegador en español · Datos orientativos a partir de AIE, IPCC y ONU.</p>
        </div>
      </footer>

      {/* SUBTITLE / NARRATOR */}
      {subtitle && narrationOn && (
        <div className="fixed inset-x-3 bottom-36 z-[95] mx-auto max-w-3xl rounded-2xl bg-black/80 p-4 ring-1 ring-emerald-300/40 backdrop-blur sm:bottom-32">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-black"><AudioLines className="h-4 w-4" /></span>
            <div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-[.25em] text-emerald-300">Narrador · {active.year}</p><p className="mt-0.5 text-sm leading-relaxed text-white/90">{subtitle}</p></div>
            <button onClick={stopSpeak} className="shrink-0 rounded-full bg-white/10 p-1.5 ring-1 ring-white/20" aria-label="Detener narración"><X className="h-4 w-4" /></button>
          </div>
        </div>
      )}

      {/* CONTROL DOCK */}
      <div className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-4xl">
        <div className="rounded-[1.6rem] bg-[#071a12]/90 p-3 shadow-2xl shadow-black/60 ring-1 ring-white/15 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button onClick={() => setAutoScroll(v => !v)} className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-black transition ${autoScroll ? "bg-cyan-300 text-black" : "bg-white/10 text-white ring-1 ring-white/15"}`}>
              {autoScroll ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} Autoscroll {autoScroll ? "ON" : "OFF"}
            </button>
            <label className="flex items-center gap-2 rounded-xl bg-white/[.06] px-3 py-2 ring-1 ring-white/10">
              <Gauge className="h-4 w-4 text-cyan-300" /><input type="range" min={0.4} max={2.6} step={0.2} value={speed} onChange={e => setSpeed(Number(e.target.value))} className="w-20" aria-label="Velocidad de autoscroll" /><span className="text-[11px] font-bold text-white/70">{speed.toFixed(1)}×</span>
            </label>

            <span className="hidden h-8 w-px bg-white/15 sm:block" />

            <button onClick={toggleMusic} className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-black transition ${musicOn ? "bg-amber-300 text-black" : "bg-white/10 text-white ring-1 ring-white/15"}`}>
              {musicOn ? <Pause className="h-4 w-4" /> : <Music className="h-4 w-4" />} Música
            </button>
            {musicOn && <span className="flex h-4 items-end gap-[2.5px]" aria-hidden>{[0, 1, 2, 3].map(b => <span key={b} className="eq-bar w-[3px] rounded bg-amber-300" style={{ height: 14, animationDelay: `${b * .13}s` }} />)}</span>}
            <button onClick={nextTrack} className="inline-flex items-center gap-1 rounded-xl bg-white/10 px-3 py-2.5 text-xs font-bold ring-1 ring-white/15" title="Siguiente tema"><SkipForward className="h-4 w-4" /><span className="hidden max-w-[130px] truncate md:inline">{TRACKS[trackIdx].title}</span></button>
            <label className="hidden items-center gap-1.5 rounded-xl bg-white/[.06] px-2.5 py-2 ring-1 ring-white/10 sm:flex">{musicOn ? <Volume2 className="h-4 w-4 text-amber-300" /> : <VolumeX className="h-4 w-4 text-white/50" />}<input type="range" min={0} max={1} step={0.05} value={volume} onChange={e => setVolume(Number(e.target.value))} className="w-16" aria-label="Volumen de la música" /></label>

            <span className="hidden h-8 w-px bg-white/15 sm:block" />

            <button onClick={() => setNarrationOn(v => !v)} className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-black transition ${narrationOn ? "bg-emerald-300 text-black" : "bg-white/10 text-white ring-1 ring-white/15"}`}>
              <AudioLines className="h-4 w-4" /> Narración {narrationOn ? "ON" : "OFF"}
            </button>
            <button onClick={() => setTrailOn(v => !v)} className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-black transition ${trailOn ? "bg-pink-300 text-black" : "bg-white/10 text-white ring-1 ring-white/15"}`}>
              <Sparkles className="h-4 w-4" /> Estela
            </button>
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="rounded-xl bg-white/10 p-2.5 ring-1 ring-white/15" aria-label="Volver arriba"><ArrowUp className="h-4 w-4" /></button>
          </div>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[11px] text-white/50"><ListMusic className="h-3.5 w-3.5 text-amber-300" /> {TRACKS[trackIdx].title} {musicOn ? "· sonando en bucle" : "· pulsa «Música» para escuchar el tema"} <span className="hidden sm:inline">· El autoscroll se pausa si ruedas o tocas la pantalla</span></p>
        </div>
      </div>

      <div className="h-32" />
    </div>
  );
}
