// Café 11•11 — "Botón secreto": salpicadura de café que cubre la pantalla, gotas que escurren y granos que caen
(() => {
  const btn = document.querySelector('[data-secret]');
  if (!btn) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const COFFEE = ['#2a160b', '#3b2314', '#4a2c19', '#5a3520'];
  let running = false;

  btn.addEventListener('click', () => { if (!running) play(); });

  function play() {
    running = true;
    const r = btn.getBoundingClientRect();
    const ox = r.left + r.width / 2, oy = r.top + r.height / 2;
    const W = innerWidth, H = innerHeight, dpr = Math.min(devicePixelRatio || 1, 2);
    const layer = document.createElement('div'); layer.className = 'splash-layer'; layer.setAttribute('aria-hidden', 'true');
    const cv = document.createElement('canvas'); cv.width = W * dpr; cv.height = H * dpr; layer.appendChild(cv);
    document.body.appendChild(layer);
    const ctx = cv.getContext('2d'); ctx.scale(dpr, dpr);
    const cover = Math.hypot(Math.max(ox, W - ox), Math.max(oy, H - oy)) * 1.15;

    // forma de la salpicadura: picos irregulares alrededor del punto
    const N = 90, spikes = [];
    for (let i = 0; i < N; i++) spikes.push(1 + (Math.random() < .18 ? rnd(.12, .35) : rnd(-.04, .06)));
    for (let k = 0; k < 2; k++) for (let i = 0; i < N; i++) spikes[i] = (spikes[(i + N - 1) % N] + spikes[i] * 2 + spikes[(i + 1) % N]) / 4;
    // gotas lanzadas desde el centro
    const drops = Array.from({ length: reduce ? 0 : 70 }, () => { const a = rnd(0, Math.PI * 2), v = rnd(6, 22);
      return { x: ox, y: oy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - rnd(2, 8), r: rnd(3, 11), c: COFFEE[(Math.random() * 4) | 0], stuck: false }; });
    // gotas que escurren desde arriba
    const nd = Math.round(W / 75);
    const drips = Array.from({ length: reduce ? 0 : nd }, (_, i) => ({ x: (i + rnd(.15, .85)) * (W / nd), y: rnd(-20, H * .12), w: rnd(5, 26), len: 0, v: rnd(.6, 4.2), c: COFFEE[(Math.random() * 4) | 0], wob: rnd(0, 6.28) }));
    // granos de café que caen
    const beans = Array.from({ length: reduce ? 0 : Math.round(W / 30) }, () => ({ x: rnd(0, W), y: rnd(-H * 1.2, -40), vx: rnd(-1.5, 1.5), vy: rnd(0, 4), rot: rnd(0, 6.28), vr: rnd(-.12, .12), s: rnd(14, 28), bounced: 0 }));

    const t0 = performance.now(), DUR = reduce ? 1400 : 5200;
    let raf, skip = false;
    layer.addEventListener('click', () => { skip = true; });
    addEventListener('keydown', onKey);
    function onKey(e) { if (e.key === 'Escape') skip = true; }

    function splat(cx, cy, R, alpha) {
      ctx.save(); ctx.globalAlpha = alpha;
      const g = ctx.createRadialGradient(cx, cy, R * .05, cx, cy, R);
      g.addColorStop(0, '#1f0f06'); g.addColorStop(.55, '#3b2314'); g.addColorStop(.9, '#6b4226'); g.addColorStop(1, '#8a5a34');
      ctx.fillStyle = g; ctx.beginPath();
      for (let i = 0; i <= N; i++) { const a = (i / N) * Math.PI * 2, rr = R * spikes[i % N]; const px = cx + Math.cos(a) * rr, py = cy + Math.sin(a) * rr; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
      ctx.closePath(); ctx.fill();
      // crema clara en el centro
      const c = ctx.createRadialGradient(cx - R * .1, cy - R * .1, 0, cx, cy, R * .35);
      c.addColorStop(0, 'rgba(198,140,88,.35)'); c.addColorStop(1, 'rgba(198,140,88,0)');
      ctx.fillStyle = c; ctx.beginPath(); ctx.arc(cx, cy, R * .35, 0, 7); ctx.fill();
      ctx.restore();
    }
    function bean(b) {
      ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.rot);
      const g = ctx.createLinearGradient(-b.s / 2, -b.s / 2, b.s / 2, b.s / 2);
      g.addColorStop(0, '#7a4a2a'); g.addColorStop(1, '#2e180b');
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, b.s * .38, b.s * .52, 0, 0, 7); ctx.fill();
      ctx.strokeStyle = 'rgba(20,10,4,.9)'; ctx.lineWidth = Math.max(1.5, b.s * .08); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(0, -b.s * .44); ctx.bezierCurveTo(b.s * .16, -b.s * .15, -b.s * .16, b.s * .15, 0, b.s * .44); ctx.stroke();
      ctx.fillStyle = 'rgba(255,230,200,.18)'; ctx.beginPath(); ctx.ellipse(-b.s * .12, -b.s * .18, b.s * .08, b.s * .16, -.4, 0, 7); ctx.fill();
      ctx.restore();
    }

    function frame(now) {
      const t = skip ? DUR : Math.max(0, now - t0);
      ctx.clearRect(0, 0, W, H);
      // 1) la salpicadura crece hasta cubrir la pantalla y luego se desvanece
      const grow = Math.min(1, t / 520), ease = 1 - Math.pow(1 - grow, 3);
      const fade = t < 1500 ? 1 : Math.max(0, 1 - (t - 1500) / 1300);
      if (fade > 0) splat(ox, oy, cover * ease, fade * .97);
      // 2) gotas lanzadas: vuelan, caen y se quedan pegadas como manchas
      const stainA = t < 3600 ? 1 : Math.max(0, 1 - (t - 3600) / 1400);
      for (const d of drops) {
        if (!d.stuck) { d.x += d.vx; d.y += d.vy; d.vy += .55; d.vx *= .985; if (t > 450 && Math.random() < .03) d.stuck = true; if (d.y > H + 20) d.stuck = true; }
        ctx.globalAlpha = stainA; ctx.fillStyle = d.c; ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 7); ctx.fill();
        if (d.stuck && d.y < H) { d.y += .25; ctx.beginPath(); ctx.arc(d.x, d.y + d.r * .6, d.r * .55, 0, 7); ctx.fill(); }
      }
      // 3) escurrimientos desde arriba
      if (t > 500) for (const d of drips) {
        d.len += d.v; d.v *= 1.006;
        const end = d.y + d.len, sway = Math.sin(d.wob + d.len / 60) * d.w * .25;
        ctx.globalAlpha = stainA * .92; ctx.fillStyle = d.c;
        ctx.beginPath(); ctx.moveTo(d.x - d.w * .9, -10);
        ctx.quadraticCurveTo(d.x - d.w * .5 + sway, end * .5, d.x - d.w / 2 + sway, end);
        ctx.arc(d.x + sway, end, d.w / 2, Math.PI, 0, true);
        ctx.quadraticCurveTo(d.x + d.w * .5 + sway, end * .5, d.x + d.w * .9, -10); ctx.fill();
        ctx.beginPath(); ctx.arc(d.x + sway, end + d.w * .35, d.w * .62, 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1;
      // 4) granos que caen con gravedad, rebotan en el piso y se van
      if (t > 700) for (const b of beans) {
        b.vy += .38; b.x += b.vx; b.y += b.vy; b.rot += b.vr;
        if (b.y > H - b.s * .4 && b.bounced < 2 && t < 4200) { b.y = H - b.s * .4; b.vy *= -rnd(.35, .5); b.vx *= .8; b.vr *= -.8; b.bounced++; }
        ctx.globalAlpha = stainA; bean(b);
      }
      ctx.globalAlpha = 1;
      if (t < DUR) raf = requestAnimationFrame(frame);
      else { cancelAnimationFrame(raf); removeEventListener('keydown', onKey); layer.remove(); running = false; btn.focus({ preventScroll: true }); }
    }
    raf = requestAnimationFrame(frame);
  }
})();
