// Café 11•11 — animaciones al hacer scroll y "vuelo" al carrito
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  // letras del nombre final
  const word = document.querySelector('.close__word');
  if (word) word.innerHTML = [...word.textContent].map((c, i) => `<span class="ch" style="--i:${i}">${c === ' ' ? '&nbsp;' : c}</span>`).join('');

  if (!reduce && 'IntersectionObserver' in window) {
    document.querySelectorAll('.menu__group, .cakes').forEach((g) => {
      g.querySelectorAll(':scope > .t-label, .rows > li').forEach((el, i) => { el.dataset.reveal = ''; el.style.setProperty('--i', Math.min(i, 10)); });
      if (g.classList.contains('cakes')) g.dataset.reveal = '';
    });
    root.classList.add('js-reveal');
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('[data-reveal], .close__word').forEach((el) => io.observe(el));
    setTimeout(() => document.querySelectorAll('[data-reveal]').forEach((el) => { if (el.getBoundingClientRect().top < innerHeight) el.classList.add('is-in'); }), 50);
  } else if (word) word.classList.add('is-in');

  // pestañas del menú
  const tabs = [...document.querySelectorAll('.tab-x')];
  const menu = document.getElementById('menu');
  function show(id, scroll) {
    const t = tabs.find((x) => x.dataset.tab === id); if (!t) return false;
    tabs.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1;
      const pnl = document.getElementById(x.dataset.tab); pnl.hidden = !on;
      if (on && !reduce) { pnl.querySelectorAll('.panel-x__head, .mcard').forEach((c, i) => c.style.setProperty('--i', Math.min(i, 14))); pnl.classList.remove('is-entering'); void pnl.offsetWidth; pnl.classList.add('is-entering'); } });
    const bar = t.parentElement; bar.scrollTo({ left: t.offsetLeft - (bar.clientWidth - t.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
    if (scroll) menu.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    return true;
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => { show(t.dataset.tab, false); const top = menu.querySelector('.tabs-x').getBoundingClientRect().top; if (top < 0 || top > innerHeight * 0.6) menu.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); });
    t.addEventListener('keydown', (e) => { const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return; e.preventDefault(); const n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); show(n.dataset.tab, false); });
  });
  // enlaces #calientes, #frios, #comer, #dulce abren su pestaña
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const id = a.getAttribute('href').slice(1);
    if (tabs.some((t) => t.dataset.tab === id)) { e.preventDefault(); show(id, true); document.querySelector('.nav')?.classList.remove('is-open'); }
  });
  if (location.hash) show(location.hash.slice(1), true);

  // vuelo al carrito: observa la cuenta y anima desde el último botón tocado
  let from = null;
  document.addEventListener('pointerdown', (e) => { const b = e.target.closest('[data-add], [data-opts-add]'); if (b) { const r = b.getBoundingClientRect(); from = { x: r.left + r.width / 2, y: r.top + r.height / 2 }; } }, true);
  const count = document.querySelector('.cartbar [data-cart-count]');
  if (!count || reduce) return;
  let last = count.textContent;
  new MutationObserver(() => {
    if (+count.textContent > +last && from) {
      const bar = document.querySelector('[data-cartbar]');
      const target = (bar && !bar.hidden ? bar : document.querySelector('.nav [data-cart-open]')).getBoundingClientRect();
      const to = { x: target.left + target.width / 2, y: target.top + target.height / 2 };
      const d = document.createElement('div'); d.className = 'fly'; d.style.left = from.x + 'px'; d.style.top = from.y + 'px';
      document.body.appendChild(d);
      const dx = to.x - from.x, dy = to.y - from.y;
      d.animate([
        { transform: 'translate(0,0) scale(1)' },
        { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 120}px) scale(1.3)`, offset: 0.45 },
        { transform: `translate(${dx}px, ${dy}px) scale(.4)`, opacity: 0.6 },
      ], { duration: 700, easing: 'cubic-bezier(.5,0,.3,1)' }).onfinish = () => d.remove();
      from = null;
    }
    last = count.textContent;
  }).observe(count, { childList: true, characterData: true, subtree: true });
})();
