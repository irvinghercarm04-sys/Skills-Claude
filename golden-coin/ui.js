// Golden Coin — DOM motion: hero entrance, reveals, word scroll, scroll band, tilt, open status.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/* ---------- Hero entrance (once, on load) ---------- */
requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add("is-loaded")));

/* ---------- Reveal on enter ---------- */
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    }
  },
  { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
);
document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

/* ---------- Word scroll: split into words, light them as the section scrolls ---------- */
const wordsEl = document.querySelector("[data-words]");
const words = [];
if (wordsEl) {
  const frag = document.createDocumentFragment();
  let joined = false; // true when the last thing written was a word with no space after it
  const push = (text, key) => {
    text.split(/(\s+)/).forEach((tok) => {
      if (!tok) return;
      if (/^\s+$/.test(tok)) {
        joined = false;
        return frag.append(" ");
      }
      if (joined && words.length) {
        // punctuation glued to the previous word across an <em> boundary ("cena,")
        words[words.length - 1].textContent += tok;
        return;
      }
      joined = true;
      const s = document.createElement("span");
      s.className = "w" + (key ? " is-key" : "");
      s.textContent = tok;
      frag.append(s);
      words.push(s);
    });
  };
  wordsEl.childNodes.forEach((n) => {
    if (n.nodeType === 3) push(n.textContent.trim() ? n.textContent : " ", false);
    else push(n.textContent, true);
  });
  wordsEl.setAttribute("aria-label", wordsEl.textContent.replace(/\s+/g, " ").trim());
  wordsEl.textContent = "";
  wordsEl.append(frag);
  words.forEach((w) => w.setAttribute("aria-hidden", "true"));
}
const wordsSection = document.querySelector(".words");

/* ---------- Scroll band ---------- */
const bands = [...document.querySelectorAll("[data-band]")];
const bandSection = document.querySelector(".band");

/* ---------- Nav ---------- */
const nav = document.querySelector(".nav");

let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(update);
}
function update() {
  ticking = false;
  const vh = innerHeight;
  nav.classList.toggle("is-scrolled", scrollY > 40);

  if (wordsSection && words.length) {
    const r = wordsSection.getBoundingClientRect();
    const total = r.height - vh;
    // 0 when the sticky block pins, 1 a little before it releases
    const p = reduce ? 1 : clamp(-r.top / (total * 0.85));
    const n = words.length;
    for (let i = 0; i < n; i++) {
      const local = clamp(p * (n + 4) - i, 0, 4) / 4; // each word fades over ~4 word-steps
      words[i].style.setProperty("--o", (0.14 + local * 0.86).toFixed(3));
    }
  }

  if (bandSection && !reduce) {
    const r = bandSection.getBoundingClientRect();
    if (r.bottom > 0 && r.top < vh) {
      const p = (vh - r.top) / (vh + r.height); // 0..1 while the band crosses the screen
      bands.forEach((b) => {
        const dir = Number(b.dataset.band);
        const w = b.firstElementChild.offsetWidth;
        const shift = dir < 0 ? -p * w * 0.35 : -w * 0.35 + p * w * 0.35;
        b.style.transform = `translate3d(${shift.toFixed(1)}px,0,0)`;
      });
    }
  }
}
addEventListener("scroll", onScroll, { passive: true });
addEventListener("resize", onScroll);
update();

/* ---------- 3D tilt on drink cards (pointer devices only) ---------- */
if (finePointer && !reduce) {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.setProperty("--ry", ((x - 0.5) * 10).toFixed(2) + "deg");
      card.style.setProperty("--rx", ((0.5 - y) * 8).toFixed(2) + "deg");
      card.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
      card.style.setProperty("--my", (y * 100).toFixed(1) + "%");
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });
}

/* ---------- Open now (Puebla time) + today's row ---------- */
function pueblaNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Mexico_City",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t)?.value;
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  const h = Number(get("hour")) % 24;
  const m = Number(get("minute"));
  return { day, minutes: h * 60 + m };
}
function refreshStatus() {
  const { day, minutes } = pueblaNow();
  const open = minutes >= 8 * 60 && minutes < 21 * 60;
  const el = document.querySelector("[data-status]");
  if (el) {
    el.classList.toggle("is-open", open);
    el.classList.toggle("is-closed", !open);
    el.querySelector("b").textContent = open ? "Abierto · cierra 21:00" : "Cerrado · abre 8:00";
  }
  document.querySelectorAll("[data-hours] li").forEach((li) => li.classList.toggle("is-today", Number(li.dataset.day) === day));
}
refreshStatus();
setInterval(refreshStatus, 60_000);
