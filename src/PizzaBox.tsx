import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { gsap } from "gsap";

/*
 * GSAP en Remotion: el timeline se crea pausado y en cada frame se hace
 * seek(frame / fps). GSAP calcula los valores (con sus easings) sobre un
 * objeto plano y React los pinta. Así el render es determinista.
 */

const BOX = 560; // lado de la caja (px)
const WALL = 64; // alto de las paredes
const TILT = 52; // inclinación de la mesa (grados)

const OUTER = "#c9945a";
const OUTER_DARK = "#a8743f";
const INNER = "#e6c590";
const INNER_DARK = "#d4ad73";

const TITLE = "¡Recién horneada!";

type State = {
  dropY: number;
  dropScale: number;
  lid: number;
  steam: number;
  cam: number;
  glow: number;
  chars: { p: number }[];
};

const useTimeline = () =>
  useMemo(() => {
    const s: State = {
      dropY: -900,
      dropScale: 0.85,
      lid: 0,
      steam: 0,
      cam: 0.92,
      glow: 0,
      chars: TITLE.split("").map(() => ({ p: 0 })),
    };
    const tl = gsap.timeline({ paused: true });

    // La caja cae sobre la mesa
    tl.fromTo(s, { dropY: -900 }, { dropY: 0, duration: 0.9, ease: "bounce.out" }, 0);
    tl.fromTo(s, { dropScale: 0.85 }, { dropScale: 1, duration: 0.9, ease: "power2.out" }, 0);

    // Anticipación: la tapa se levanta un poquito dos veces
    tl.fromTo(s, { lid: 0 }, { lid: 9, duration: 0.14, ease: "power2.out" }, 1.25);
    tl.fromTo(s, { lid: 9 }, { lid: 0, duration: 0.18, ease: "bounce.out" }, 1.39);
    tl.fromTo(s, { lid: 0 }, { lid: 14, duration: 0.16, ease: "power2.out" }, 1.7);
    tl.fromTo(s, { lid: 14 }, { lid: 0, duration: 0.2, ease: "bounce.out" }, 1.86);

    // ¡Se abre!
    tl.fromTo(s, { lid: 0 }, { lid: 112, duration: 1.0, ease: "back.out(1.6)" }, 2.25);
    tl.fromTo(s, { glow: 0 }, { glow: 1, duration: 0.8, ease: "power2.out" }, 2.4);
    tl.fromTo(s, { steam: 0 }, { steam: 1, duration: 1.2, ease: "power1.inOut" }, 2.45);

    // Cámara: acercamiento lento durante todo el clip
    tl.fromTo(s, { cam: 0.92 }, { cam: 1.06, duration: 7, ease: "sine.inOut" }, 0);

    // Título letra por letra
    tl.fromTo(
      s.chars,
      { p: 0 },
      { p: 1, duration: 0.6, ease: "back.out(2.2)", stagger: 0.035 },
      3.4
    );

    return { s, tl };
  }, []);

/* ---------- Pizza ---------- */

const pepperoni = [
  [0, -120], [105, -70], [-110, -60], [60, 40], [-50, 70],
  [130, 75], [-140, 55], [10, 150], [-20, -20], [100, -150], [-90, -165],
];
const basil = [
  [40, -60, 20], [-80, 10, -40], [80, 130, 70], [-60, 140, 10], [150, -10, -30],
];
const olives = [
  [-160, -10], [30, 100], [160, 20], [-30, -165], [70, -110], [-120, 110],
];

const cheesePath = (() => {
  // Borde irregular del queso, fijo (sin aleatoriedad por frame)
  const pts: string[] = [];
  const n = 48;
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r = 196 + Math.sin(a * 7) * 6 + Math.sin(a * 13 + 1) * 4;
    pts.push(`${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`);
  }
  return `M${pts.join("L")}Z`;
})();

const Pizza: React.FC<{ frame: number; heat: number }> = ({ frame, heat }) => (
  <svg width={500} height={500} viewBox="-250 -250 500 500" style={{ overflow: "visible" }}>
    <defs>
      <radialGradient id="crust" r="0.5">
        <stop offset="0.78" stopColor="#e9a74e" />
        <stop offset="0.9" stopColor="#d18a36" />
        <stop offset="1" stopColor="#9c5a1f" />
      </radialGradient>
      <radialGradient id="cheese" r="0.5">
        <stop offset="0" stopColor="#fff2b8" />
        <stop offset="0.75" stopColor="#ffd86b" />
        <stop offset="1" stopColor="#f0b443" />
      </radialGradient>
      <radialGradient id="pep" r="0.5">
        <stop offset="0" stopColor="#c4382a" />
        <stop offset="0.8" stopColor="#a8261c" />
        <stop offset="1" stopColor="#7a1610" />
      </radialGradient>
    </defs>
    {/* papel encerado */}
    <circle r={246} fill="#f4ead4" opacity={0.7} />
    <circle r={236} fill="url(#crust)" />
    <circle r={208} fill="#c8341f" />
    <path d={cheesePath} fill="url(#cheese)" />
    {/* cortes */}
    {[0, 45, 90, 135].map((a) => (
      <line
        key={a}
        x1={-236}
        x2={236}
        stroke="#b87a2a"
        strokeOpacity={0.35}
        strokeWidth={3}
        transform={`rotate(${a})`}
      />
    ))}
    {pepperoni.map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y})`}>
        <circle r={27} fill="url(#pep)" />
        <circle r={4} cx={-8} cy={-6} fill="#7a1610" opacity={0.6} />
        <circle r={3} cx={9} cy={5} fill="#7a1610" opacity={0.6} />
        <ellipse rx={9} ry={5} cx={-6} cy={-12} fill="#fff" opacity={0.25} />
      </g>
    ))}
    {olives.map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y})`}>
        <circle r={11} fill="#2b2420" />
        <circle r={4.5} fill="#5a4a3a" />
      </g>
    ))}
    {basil.map(([x, y, r], i) => (
      <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
        <path d="M-18,0 Q0,-14 18,0 Q0,14 -18,0Z" fill="#3f8f3a" />
        <path d="M-16,0 L16,0" stroke="#2c6b28" strokeWidth={1.5} />
      </g>
    ))}
    {/* burbujas de queso caliente */}
    {[[-40, 20], [70, -20], [-100, -110], [120, 130], [-150, 100]].map(([x, y], i) => {
      const b = (Math.sin(frame / 7 + i * 1.7) + 1) / 2;
      return (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={4 + b * 5}
          fill="#fff6cc"
          opacity={heat * (0.3 + b * 0.5)}
        />
      );
    })}
  </svg>
);

/* ---------- Humo ---------- */

const Wisp: React.FC<{ frame: number; i: number; amount: number }> = ({
  frame,
  i,
  amount,
}) => {
  const period = 75 + (i % 3) * 12;
  const offset = (i * 37) % period;
  const p = ((frame + offset) % period) / period; // 0→1 ciclo de vida
  const xBase = ((i * 71) % 280) - 140;
  const height = 380;
  const pts: string[] = [];
  for (let k = 0; k <= 24; k++) {
    const t = k / 24;
    const y = -t * height;
    const amp = 10 + t * 38;
    const x = Math.sin(t * 5.5 + frame / 11 + i * 1.3) * amp;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const rise = p * 260;
  const opacity = Math.sin(Math.PI * p) * 0.85 * amount;
  return (
    <path
      d={`M${pts.join("L")}`}
      transform={`translate(${xBase} ${-rise}) scale(${0.8 + p * 0.5})`}
      fill="none"
      stroke="#fff"
      strokeWidth={22 + (i % 3) * 8}
      strokeLinecap="round"
      opacity={opacity}
      filter="url(#steamBlur)"
    />
  );
};

const Steam: React.FC<{ frame: number; amount: number }> = ({ frame, amount }) => (
  <svg
    width={700}
    height={800}
    viewBox="-350 -700 700 800"
    style={{ position: "absolute", left: 540 - 350, top: 0, pointerEvents: "none" }}
  >
    <defs>
      <filter id="steamBlur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="14" />
      </filter>
      <linearGradient id="steamFade" x1="0" y1="100" x2="0" y2="-700" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.2" stopColor="#fff" stopOpacity="1" />
        <stop offset="0.75" stopColor="#fff" stopOpacity="0.6" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <mask id="steamMask">
        <rect x={-350} y={-700} width={700} height={800} fill="url(#steamFade)" />
      </mask>
    </defs>
    <g mask="url(#steamMask)">
      {Array.from({ length: 7 }).map((_, i) => (
        <Wisp key={i} frame={frame} i={i} amount={amount} />
      ))}
    </g>
  </svg>
);

/* ---------- Caja 3D (CSS) ---------- */

const face = (
  w: number,
  h: number,
  transform: string,
  style: React.CSSProperties
): React.CSSProperties => ({
  position: "absolute",
  left: -w / 2,
  top: -h / 2,
  width: w,
  height: h,
  transform,
  ...style,
});

const Box: React.FC<{ lid: number; frame: number; heat: number }> = ({
  lid,
  frame,
  heat,
}) => {
  const half = BOX / 2;
  const preserve: React.CSSProperties = { transformStyle: "preserve-3d" };
  return (
    <div style={{ position: "absolute", left: 0, top: 0, ...preserve }}>
      {/* sombra */}
      <div
        style={face(BOX + 80, BOX + 80, "translateZ(0.5px)", {
          background: "radial-gradient(closest-side, rgba(0,0,0,0.55), rgba(0,0,0,0))",
        })}
      />
      {/* fondo interior */}
      <div
        style={face(BOX, BOX, `translateZ(1px)`, {
          background: `radial-gradient(circle, ${INNER} 60%, ${INNER_DARK})`,
        })}
      />
      {/* pizza */}
      <div
        style={face(500, 500, "translateZ(3px)", {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        })}
      >
        <Pizza frame={frame} heat={heat} />
      </div>
      {/* paredes */}
      <div
        style={face(BOX, WALL, `translate3d(0, ${-half}px, ${WALL / 2}px) rotateX(-90deg)`, {
          background: INNER_DARK,
        })}
      />
      <div
        style={face(BOX, WALL, `translate3d(${-half}px, 0, ${WALL / 2}px) rotateZ(90deg) rotateX(-90deg)`, {
          background: INNER,
        })}
      />
      <div
        style={face(BOX, WALL, `translate3d(${half}px, 0, ${WALL / 2}px) rotateZ(90deg) rotateX(-90deg)`, {
          background: INNER,
        })}
      />
      <div
        style={face(BOX, WALL, `translate3d(0, ${half}px, ${WALL / 2}px) rotateX(-90deg)`, {
          background: `linear-gradient(${OUTER}, ${OUTER_DARK})`,
          boxShadow: "inset 0 3px 0 rgba(255,255,255,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#7a2a12",
          font: "700 22px/1 Georgia, serif",
          letterSpacing: 6,
        })}
      >
        HOT &amp; FRESH
      </div>
      {/* tapa con bisagra en el borde trasero */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          ...preserve,
          transform: `translate3d(0, ${-half}px, ${WALL}px) rotateX(${lid}deg) translate3d(0, ${half}px, 0)`,
        }}
      >
        {/* cara exterior */}
        <div
          style={face(BOX, BOX, "translateZ(0.5px)", {
            background: `linear-gradient(160deg, ${OUTER}, ${OUTER_DARK})`,
            backfaceVisibility: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          })}
        >
          <Logo />
        </div>
        {/* cara interior */}
        <div
          style={face(BOX, BOX, "translateZ(-0.5px) rotateY(180deg)", {
            background: `linear-gradient(${INNER_DARK}, ${INNER})`,
            backfaceVisibility: "hidden",
          })}
        />
        {/* pestaña frontal */}
        <div
          style={face(BOX, 18, `translate3d(0, ${half}px, -9px) rotateX(-90deg)`, {
            background: OUTER_DARK,
          })}
        />
      </div>
    </div>
  );
};

const Logo: React.FC = () => (
  <svg width={330} height={330} viewBox="-165 -165 330 330">
    <circle r={150} fill="#b3261e" />
    <circle r={136} fill="none" stroke="#f6e7c8" strokeWidth={4} strokeDasharray="10 8" />
    <path
      d="M0,-70 L60,40 Q0,62 -60,40 Z"
      fill="#f6c453"
      stroke="#f6e7c8"
      strokeWidth={6}
      strokeLinejoin="round"
    />
    <circle cx={-10} cy={0} r={10} fill="#b3261e" />
    <circle cx={18} cy={22} r={9} fill="#b3261e" />
    <circle cx={-22} cy={30} r={8} fill="#b3261e" />
    <text
      y={98}
      textAnchor="middle"
      fill="#f6e7c8"
      style={{ font: "700 34px Georgia, serif", letterSpacing: 4 }}
    >
      PIZZA
    </text>
  </svg>
);

/* ---------- Escena ---------- */

export const PizzaBox: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { s, tl } = useTimeline();
  tl.seek(frame / fps, false);

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at 50% 35%, #4a2416 0%, #1c0d07 70%)",
        overflow: "hidden",
      }}
    >
      {/* luz cálida al abrir */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle at 50% 55%, rgba(255,170,60,0.35), rgba(255,170,60,0) 55%)",
          opacity: s.glow,
        }}
      />
      <AbsoluteFill
        style={{
          perspective: 1500,
          perspectiveOrigin: "50% 20%",
          transform: `scale(${s.cam})`,
        }}
      >
        {/* mesa */}
        <div
          style={{
            position: "absolute",
            left: 540,
            top: 600,
            transformStyle: "preserve-3d",
            transform: `rotateX(${TILT}deg)`,
          }}
        >
          <div
            style={face(2600, 2600, "translateZ(-1px)", {
              background:
                "repeating-linear-gradient(90deg, #5b3420 0 120px, #64391f 120px 124px, #6b3f24 124px 240px, #4e2b19 240px 244px)",
              maskImage: "radial-gradient(closest-side, #000 30%, transparent 70%)",
              WebkitMaskImage: "radial-gradient(closest-side, #000 30%, transparent 70%)",
            })}
          />
          <div
            style={{
              position: "absolute",
              transformStyle: "preserve-3d",
              transform: `translate3d(0, 0, ${-s.dropY}px) scale(${s.dropScale})`,
            }}
          >
            <Box lid={s.lid} frame={frame} heat={s.glow} />
          </div>
        </div>
        {/* humo (capa 2D sobre la pizza) */}
        <div style={{ position: "absolute", left: 0, top: -90, width: 1080 }}>
          <Steam frame={frame} amount={s.steam} />
        </div>
      </AbsoluteFill>
      {/* título */}
      <div
        style={{
          position: "absolute",
          bottom: 70,
          width: "100%",
          textAlign: "center",
          font: "700 72px Georgia, serif",
          color: "#ffe2a8",
          textShadow: "0 4px 24px rgba(0,0,0,0.6)",
        }}
      >
        {TITLE.split("").map((c, i) => {
          const p = s.chars[i].p;
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                whiteSpace: "pre",
                opacity: Math.min(1, p * 1.5),
                transform: `translateY(${(1 - p) * 60}px) scale(${0.6 + p * 0.4})`,
              }}
            >
              {c}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
