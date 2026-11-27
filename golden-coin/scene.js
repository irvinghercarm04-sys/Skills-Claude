// Golden Coin — 3D scene: a field of paper cards and gold cash coins the camera flies
// through on scroll, which assembles into a wall near the end of the page.
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = THREE.MathUtils.lerp;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

// Seeded random so the composition is the same on every visit.
let seed = 20261127;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const range = (a, b) => a + rand() * (b - a);

const BG = 0x0c0806;
const CARD_W = 1.1;
const CARD_H = 1.5;
const START_Z = 9;
const END_Z = -46;

/* ------------------------------------------------------------------ */
/* Card faces                                                          */
/* ------------------------------------------------------------------ */
const THEMES = {
  paper: { bg: "#efe5cf", ink: "#1b130c", accent: "#b51c2a" },
  gold: { bg: "#ecc14f", ink: "#1b130c", accent: "#1b130c" },
  red: { bg: "#b51c2a", ink: "#fbe9d6", accent: "#f3c95e" },
  ink: { bg: "#1c140e", ink: "#efe5cf", accent: "#e8b84a" },
};
const FACES = [
  { t: "Desayuno", h: "早餐", th: "paper", l: "a" },
  { t: "Brunch", h: "早午", th: "gold", l: "b" },
  { t: "Comida", h: "午饭", th: "paper", l: "a" },
  { t: "Cena", h: "晚饭", th: "ink", l: "b" },
  { t: "Postre", h: "甜点", th: "paper", l: "c" },
  { t: "Bocadillos rápidos", h: "小吃", th: "paper", l: "a" },
  { t: "Platillos pequeños", h: "点", th: "red", l: "a" },
  { t: "Café", h: "咖啡", th: "paper", l: "b" },
  { t: "Té", h: "茶", th: "gold", l: "c" },
  { t: "Cerveza", h: "啤酒", th: "paper", l: "a" },
  { t: "Vino", h: "葡萄酒", th: "red", l: "b" },
  { t: "Cócteles", h: "鸡尾酒", th: "paper", l: "a" },
  { t: "Bebidas con alcohol", h: "酒", th: "ink", l: "a" },
  { t: "En el local", h: "堂食", th: "paper", l: "b" },
  { t: "Para llevar", h: "外卖", th: "gold", l: "a" },
  { t: "Golden Coin", h: "金币", th: "red", l: "c" },
  { t: "Lunes a domingo", h: "日日", th: "paper", l: "a" },
  { t: "8:00 a 21:00", h: "早晚", th: "ink", l: "a" },
  { t: "Los Pinos, Puebla", h: "金", th: "paper", l: "a" },
  { t: "Buena fortuna", h: "福", th: "red", l: "c" },
  { t: "Té de la tarde", h: "茶", th: "paper", l: "b" },
  { t: "Una copa más", h: "酒", th: "gold", l: "a" },
  { t: "Para compartir", h: "吃", th: "paper", l: "c" },
  { t: "Abierto hoy", h: "日", th: "paper", l: "b" },
];

function wrapLines(ctx, text, maxW) {
  const words = text.split(" ");
  const lines = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? cur + " " + w : w;
    if (ctx.measureText(test).width > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else cur = test;
  }
  if (cur) lines.push(cur);
  return lines;
}

function drawFace(face, index) {
  const W = 512;
  const H = 698;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d");
  const th = THEMES[face.th];
  const pad = 34;

  ctx.fillStyle = th.bg;
  ctx.fillRect(0, 0, W, H);

  // paper grain + soft light falloff
  for (let i = 0; i < 2600; i++) {
    ctx.fillStyle = rand() > 0.5 ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)";
    ctx.fillRect(rand() * W, rand() * H, 1.6, 1.6);
  }
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "rgba(255,255,255,0.10)");
  g.addColorStop(1, "rgba(0,0,0,0.16)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = th.ink;
  ctx.strokeStyle = th.ink;
  ctx.textBaseline = "alphabetic";
  if ("fontStretch" in ctx) ctx.fontStretch = "normal";

  // masthead
  ctx.font = '600 20px "Bricolage Grotesque", sans-serif';
  ctx.fillText("GOLDEN COIN", pad, 54);
  ctx.textAlign = "right";
  ctx.fillText("Nº " + String(index + 1).padStart(2, "0"), W - pad, 54);
  ctx.textAlign = "left";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pad, 72);
  ctx.lineTo(W - pad, 72);
  ctx.stroke();

  // footer
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(pad, H - 70);
  ctx.lineTo(W - pad, H - 70);
  ctx.stroke();
  ctx.font = '500 18px "Bricolage Grotesque", sans-serif';
  ctx.fillText("8:00 — 21:00", pad, H - 38);
  ctx.textAlign = "right";
  ctx.fillText("PUEBLA", W - pad, H - 38);
  ctx.textAlign = "left";

  const setTitleFont = (size) => {
    if ("fontStretch" in ctx) ctx.fontStretch = "condensed";
    ctx.font = `800 ${size}px "Bricolage Grotesque", sans-serif`;
  };
  const fitTitle = (maxW, maxLines, start) => {
    let size = start;
    let lines;
    do {
      setTitleFont(size);
      lines = wrapLines(ctx, face.t, maxW);
      size -= 4;
    } while ((lines.length > maxLines || lines.some((l) => ctx.measureText(l).width > maxW)) && size > 40);
    return { size: size + 4, lines };
  };

  const han = (size, x, y, color, align = "left") => {
    if ("fontStretch" in ctx) ctx.fontStretch = "normal";
    ctx.font = `900 ${size}px "Noto Serif SC", serif`;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.fillText(face.h, x, y);
    ctx.textAlign = "left";
  };

  const maxW = W - pad * 2;
  if (face.l === "a") {
    // big condensed title at the top, characters bottom right
    const { size, lines } = fitTitle(maxW, 3, 150);
    ctx.fillStyle = th.ink;
    lines.forEach((ln, i) => ctx.fillText(ln, pad - 4, 82 + size * 0.86 * (i + 1)));
    const hs = face.h.length > 2 ? 92 : 130;
    han(hs, W - pad, H - 96, th.accent, "right");
  } else if (face.l === "b") {
    // characters vertical on the left, title bottom
    if ("fontStretch" in ctx) ctx.fontStretch = "normal";
    ctx.font = '900 118px "Noto Serif SC", serif';
    ctx.fillStyle = th.accent;
    [...face.h].forEach((ch, i) => ctx.fillText(ch, pad, 200 + i * 124));
    const { size, lines } = fitTitle(maxW, 2, 128);
    ctx.fillStyle = th.ink;
    const baseY = H - 92 - (lines.length - 1) * size * 0.86;
    lines.forEach((ln, i) => {
      ctx.textAlign = "right";
      ctx.fillText(ln, W - pad + 2, baseY + size * 0.86 * i);
    });
    ctx.textAlign = "left";
  } else {
    // stamp: one red seal in the middle, small title under it
    const s = 250;
    const x = (W - s) / 2;
    const y = 128;
    ctx.fillStyle = face.th === "red" ? "#f3c95e" : "#b51c2a";
    ctx.fillRect(x, y, s, s);
    ctx.strokeStyle = face.th === "red" ? "#b51c2a" : th.bg;
    ctx.lineWidth = 8;
    ctx.strokeRect(x + 14, y + 14, s - 28, s - 28);
    han(face.h.length > 1 ? 104 : 170, W / 2, face.h.length > 1 ? y + 168 : y + 190, face.th === "red" ? "#b51c2a" : th.bg, "center");
    const { size, lines } = fitTitle(maxW, 2, 110);
    ctx.fillStyle = th.ink;
    ctx.textAlign = "center";
    lines.forEach((ln, i) => ctx.fillText(ln, W / 2, y + s + 40 + size * 0.86 * (i + 1)));
    ctx.textAlign = "left";
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/* ------------------------------------------------------------------ */
/* Coin (Chinese cash coin: round with a square hole)                  */
/* ------------------------------------------------------------------ */
function coinGeometry() {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, 1, 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  const s = 0.27;
  hole.moveTo(-s, -s);
  hole.lineTo(-s, s);
  hole.lineTo(s, s);
  hole.lineTo(s, -s);
  hole.lineTo(-s, -s);
  shape.holes.push(hole);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.12,
    bevelEnabled: true,
    bevelThickness: 0.045,
    bevelSize: 0.04,
    bevelSegments: 4,
    curveSegments: 72,
  });
  geo.center();
  return geo;
}

function coinTextures() {
  const N = 512;
  const mk = () => {
    const c = document.createElement("canvas");
    c.width = c.height = N;
    return [c, c.getContext("2d")];
  };
  const chars = [
    ["金", 0, -1],
    ["币", 0, 1],
    ["福", 1, 0],
    ["寿", -1, 0],
  ];
  // UVs on the caps run -1..1 across the coin; map that to 0..1 with repeat/offset below.
  const toPx = (u) => (u * 0.5 + 0.5) * N;

  const [cc, cx] = mk();
  const grad = cx.createRadialGradient(N * 0.38, N * 0.32, 10, N / 2, N / 2, N * 0.6);
  grad.addColorStop(0, "#ffe7a3");
  grad.addColorStop(0.55, "#e2ad44");
  grad.addColorStop(1, "#a8761f");
  cx.fillStyle = grad;
  cx.fillRect(0, 0, N, N);

  const [bc, bx] = mk();
  bx.fillStyle = "#555";
  bx.fillRect(0, 0, N, N);

  for (const [ctx, ink, rim] of [
    [cx, "rgba(120,74,12,0.55)", "rgba(255,236,170,0.55)"],
    [bx, "#fff", "#fff"],
  ]) {
    // raised rim and raised border round the hole
    ctx.strokeStyle = rim;
    ctx.lineWidth = N * 0.035;
    ctx.beginPath();
    ctx.arc(N / 2, N / 2, N * 0.455, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = N * 0.03;
    const hs = 0.27 * N * 0.5 + N * 0.03;
    ctx.strokeRect(N / 2 - hs, N / 2 - hs, hs * 2, hs * 2);
    ctx.fillStyle = ink;
    ctx.font = `900 ${N * 0.16}px "Noto Serif SC", serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const [ch, x, y] of chars) {
      // canvas y grows downward, shape y grows upward
      ctx.fillText(ch, toPx(x * 0.64), toPx(y * 0.64));
    }
  }

  const map = new THREE.CanvasTexture(cc);
  map.colorSpace = THREE.SRGBColorSpace;
  const bump = new THREE.CanvasTexture(bc);
  for (const t of [map, bump]) {
    t.repeat.set(0.5, 0.5);
    t.offset.set(0.5, 0.5);
    t.anisotropy = 8;
  }
  return { map, bump };
}

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */
async function init() {
  const canvas = document.getElementById("scene");
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  } catch {
    document.documentElement.classList.add("no-webgl");
    return;
  }

  // Wait for the fonts the canvas textures draw with (bounded, so a slow network never blocks the scene).
  try {
    await Promise.race([
      Promise.all([
        document.fonts.load('800 100px "Bricolage Grotesque"'),
        document.fonts.load('600 20px "Bricolage Grotesque"'),
        document.fonts.load('900 100px "Noto Serif SC"', "金币福寿早餐午饭晚甜点小吃咖啡茶啤酒葡萄鸡尾外卖堂食日"),
      ]),
      new Promise((r) => setTimeout(r, 2500)),
    ]);
  } catch {}

  const small = innerWidth < 760;
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 2));
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(BG, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(BG, 5, small ? 26 : 30);

  const camera = new THREE.PerspectiveCamera(small ? 62 : 50, innerWidth / innerHeight, 0.1, 120);
  camera.position.set(0, 0, START_Z);

  // lights: dim warm room, one key, a gold light that follows the pointer
  scene.add(new THREE.AmbientLight(0x7a5a44, 0.55));
  const key = new THREE.DirectionalLight(0xfff0d8, 1.6);
  key.position.set(-4, 6, 8);
  scene.add(key);
  const pointerLight = new THREE.PointLight(0xffc46a, 26, 0, 1.6);
  scene.add(pointerLight);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  /* ---- cards ---- */
  const faces = FACES.map((f, i) => drawFace(f, i));
  const materials = faces.map(
    (map) => new THREE.MeshStandardMaterial({ map, roughness: 0.88, metalness: 0, side: THREE.DoubleSide }),
  );
  const geos = [-0.1, 0.05, 0.13].map((curl) => {
    const g = new THREE.PlaneGeometry(CARD_W, CARD_H, 6, 8);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i);
      const y = p.getY(i);
      p.setZ(i, curl * x * x + curl * 0.25 * y * y);
    }
    g.computeVertexNormals();
    return g;
  });

  const COUNT = small ? 56 : 96;
  const cards = [];
  for (let i = 0; i < COUNT; i++) {
    const mesh = new THREE.Mesh(geos[i % geos.length], materials[i % materials.length]);
    const z = lerp(4.5, END_Z - 10, i / COUNT) + range(-1.5, 1.5);
    let x, y;
    do {
      x = range(small ? -4.5 : -9, small ? 4.5 : 9);
      y = range(-5.2, 5.2);
    } while (Math.abs(x) < (small ? 1.1 : 1.6) && Math.abs(y) < 1.4); // keep the flight lane open
    const s = range(0.85, 1.25);
    const sPos = new THREE.Vector3(x, y, z);
    const sQuat = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(range(-0.35, 0.35), range(-0.7, 0.7), range(-0.3, 0.3)),
    );
    mesh.position.copy(sPos);
    mesh.quaternion.copy(sQuat);
    mesh.scale.setScalar(s);
    scene.add(mesh);
    cards.push({
      mesh,
      sPos,
      sQuat,
      s,
      wPos: new THREE.Vector3(),
      wQuat: new THREE.Quaternion(),
      delay: 0,
      phase: range(0, Math.PI * 2),
      speed: range(0.35, 0.7),
    });
  }

  /* ---- coins ---- */
  const coinGeo = coinGeometry();
  const { map: coinMap, bump: coinBump } = coinTextures();
  const coinFace = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: coinMap,
    bumpMap: coinBump,
    bumpScale: 4,
    metalness: 1,
    roughness: 0.3,
    envMap,
    envMapIntensity: 1.25,
  });
  const coinEdge = new THREE.MeshStandardMaterial({
    color: 0xd9a441,
    metalness: 1,
    roughness: 0.26,
    envMap,
    envMapIntensity: 1.25,
  });
  const coinMats = [coinFace, coinEdge];

  const heroCoin = new THREE.Group();
  const heroMesh = new THREE.Mesh(coinGeo, coinMats);
  heroCoin.add(heroMesh);
  // a tasseled red cord through the hole
  const cord = new THREE.Mesh(
    new THREE.TorusGeometry(0.42, 0.035, 12, 48),
    new THREE.MeshStandardMaterial({ color: 0xb51c2a, roughness: 0.6 }),
  );
  cord.position.set(0, 0.62, 0);
  cord.rotation.y = Math.PI / 2;
  heroMesh.add(cord);
  scene.add(heroCoin);

  const placeHero = () => {
    const narrow = innerWidth < 760;
    heroCoin.position.set(narrow ? 1.2 : 3.1, narrow ? 1.9 : 0.35, narrow ? 3.4 : 4.4);
    heroCoin.scale.setScalar(narrow ? 0.85 : 1.25);
  };
  placeHero();

  const coins = [];
  const COINS = small ? 7 : 12;
  for (let i = 0; i < COINS; i++) {
    const m = new THREE.Mesh(coinGeo, coinMats);
    const z = lerp(0, END_Z - 6, (i + 0.5) / COINS);
    m.position.set(range(-6, 6), range(-3.6, 3.6), z);
    if (Math.abs(m.position.x) < 1.4) m.position.x += Math.sign(m.position.x || 1) * 1.6;
    m.scale.setScalar(range(0.28, 0.5));
    m.rotation.set(range(-0.6, 0.6), range(0, Math.PI), range(-0.4, 0.4));
    scene.add(m);
    coins.push({ m, spin: range(0.25, 0.6) * (rand() > 0.5 ? 1 : -1), phase: range(0, 6.28), base: m.position.clone() });
  }

  /* ---- gold dust ---- */
  const DUST = small ? 260 : 520;
  const dustPos = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) {
    dustPos[i * 3] = range(-11, 11);
    dustPos[i * 3 + 1] = range(-7, 7);
    dustPos[i * 3 + 2] = range(END_Z - 14, START_Z);
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  const dotC = document.createElement("canvas");
  dotC.width = dotC.height = 64;
  const dctx = dotC.getContext("2d");
  const dg = dctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  dg.addColorStop(0, "rgba(255,226,150,1)");
  dg.addColorStop(0.35, "rgba(255,200,90,0.45)");
  dg.addColorStop(1, "rgba(255,200,90,0)");
  dctx.fillStyle = dg;
  dctx.fillRect(0, 0, 64, 64);
  const dust = new THREE.Points(
    dustGeo,
    new THREE.PointsMaterial({
      size: 0.09,
      map: new THREE.CanvasTexture(dotC),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.85,
    }),
  );
  scene.add(dust);

  /* ---- wall layout (cards assemble into a flat grid facing the final camera) ---- */
  const tmpEuler = new THREE.Euler();
  function layoutWall() {
    const aspect = innerWidth / innerHeight;
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const cellW = CARD_W * 1.06;
    const cellH = CARD_H * 1.05;
    // choose the distance so the grid of COUNT cards just overfills the view
    let D = Math.sqrt((COUNT * cellW * cellH) / aspect) / (2 * tanHalf);
    let cols, rows;
    for (;;) {
      const vh = 2 * D * tanHalf;
      const vw = vh * aspect;
      cols = Math.ceil(vw / cellW) + 1;
      rows = Math.ceil(vh / cellH) + 1;
      if (cols * rows <= COUNT || D < 2) break;
      D *= 0.96;
    }
    const wallZ = END_Z - D;
    const slots = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c - (cols - 1) / 2) * cellW + (r % 2 ? cellW * 0.18 : 0);
        const y = (r - (rows - 1) / 2) * cellH;
        slots.push(new THREE.Vector3(x, y, wallZ));
      }
    }
    // spread the faces so the same card never sits next to itself too often
    const order = cards.map((_, i) => i).sort((a, b) => ((a * 37) % COUNT) - ((b * 37) % COUNT));
    order.forEach((ci, k) => {
      const card = cards[ci];
      card.out = new THREE.Vector2(card.sPos.x, card.sPos.y).normalize();
      card.arc = clamp(Math.abs(card.sPos.z - wallZ) / 18) * 9;
      if (k < slots.length) {
        card.wPos.copy(slots[k]);
        card.wPos.z += range(-0.05, 0.05);
        tmpEuler.set(range(-0.04, 0.04), range(-0.05, 0.05), range(-0.05, 0.05));
        card.wQuat.setFromEuler(tmpEuler);
        card.delay = clamp(slots[k].length() > 0 ? Math.hypot(slots[k].x, slots[k].y) / 9 : 0);
        card.wScale = 1;
      } else {
        // spares retreat into the dark behind the wall
        card.wPos.set(card.sPos.x * 1.4, card.sPos.y * 1.4, wallZ - 18);
        card.wQuat.copy(card.sQuat);
        card.delay = 0.5;
        card.wScale = card.s;
      }
    });
  }
  layoutWall();

  /* ---- scroll + pointer ---- */
  const wallSection = document.getElementById("muro");
  let travelEnd = 1;
  let wallStart = 1;
  let wallEnd = 1;
  function measure() {
    const top = wallSection.getBoundingClientRect().top + scrollY;
    travelEnd = Math.max(1, top - innerHeight * 0.4);
    wallStart = top - innerHeight * 0.9;
    wallEnd = top + innerHeight * 0.35;
  }
  measure();

  const pointer = new THREE.Vector2();
  const pointerSmooth = new THREE.Vector2();
  addEventListener(
    "pointermove",
    (e) => {
      pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    },
    { passive: true },
  );

  addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight, false);
    placeHero();
    layoutWall();
    measure();
  });
  // layout can shift after fonts settle
  document.fonts?.ready.then(measure);
  addEventListener("load", measure);

  /* ---- loop ---- */
  const timer = new THREE.Timer();
  timer.connect(document);
  let sTravel = 0;
  let sWall = 0;
  const v = new THREE.Vector3();
  const q = new THREE.Quaternion();
  const look = new THREE.Vector3();

  function frame() {
    timer.update();
    const t = reduce ? 0 : timer.getElapsed();
    const y = scrollY;

    const travel = clamp(y / travelEnd);
    const wall = clamp((y - wallStart) / (wallEnd - wallStart));
    const k = reduce ? 1 : 0.075;
    sTravel += (travel - sTravel) * k;
    sWall += (wall - sWall) * k;
    if (!reduce) pointerSmooth.lerp(pointer, 0.06);

    // camera: fly down the tunnel with a gentle S-curve, then settle square to the wall
    const tr = easeInOut(sTravel);
    const sway = 1 - easeOut(sWall);
    camera.position.set(
      Math.sin(tr * Math.PI * 1.5) * 1.3 * sway + pointerSmooth.x * 0.45,
      Math.sin(tr * Math.PI) * 0.7 * sway + pointerSmooth.y * 0.3,
      lerp(START_Z, END_Z, tr),
    );
    look.set(
      camera.position.x * 0.35 * sway + pointerSmooth.x * 0.9,
      camera.position.y * 0.35 * sway + pointerSmooth.y * 0.5,
      camera.position.z - 10,
    );
    camera.lookAt(look);
    camera.rotateZ(Math.sin(tr * Math.PI * 2) * 0.05 * sway);

    pointerLight.position.set(
      camera.position.x + pointerSmooth.x * 4,
      camera.position.y + pointerSmooth.y * 2.6,
      camera.position.z - 4.5,
    );

    // cards
    for (const c of cards) {
      const m = easeInOut(clamp((sWall - c.delay * 0.35) / 0.65));
      const f = 1 - m;
      v.lerpVectors(c.sPos, c.wPos, m);
      // arc outward on the way to the wall so no card sweeps through the lens
      const arc = Math.sin(m * Math.PI) * c.arc;
      v.x += c.out.x * arc;
      v.y += c.out.y * arc;
      v.y += Math.sin(t * c.speed + c.phase) * 0.12 * f;
      v.x += Math.cos(t * c.speed * 0.8 + c.phase) * 0.06 * f;
      c.mesh.position.copy(v);
      q.slerpQuaternions(c.sQuat, c.wQuat, m);
      c.mesh.quaternion.copy(q);
      c.mesh.rotateZ(Math.sin(t * c.speed * 0.6 + c.phase) * 0.05 * f);
      c.mesh.scale.setScalar(lerp(c.s, c.wScale, m));
    }

    // coins
    heroCoin.rotation.y = t * 0.35 + pointerSmooth.x * 0.6 + 0.5;
    heroCoin.rotation.x = -pointerSmooth.y * 0.35 + Math.sin(t * 0.6) * 0.08;
    heroCoin.position.y += (((innerWidth < 760 ? 1.9 : 0.35) + Math.sin(t * 0.9) * 0.08) - heroCoin.position.y) * 0.1;
    for (const c of coins) {
      c.m.rotation.y += c.spin * 0.016 * (reduce ? 0 : 1);
      c.m.position.y = c.base.y + Math.sin(t * 0.7 + c.phase) * 0.18;
    }
    dust.rotation.z = t * 0.01;

    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(frame);
  canvas.classList.add("is-ready");
}

init();
