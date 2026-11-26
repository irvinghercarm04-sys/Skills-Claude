// Genera un solo archivo HTML con todo dentro: node bundle.mjs  ->  cafe-1111.html
import { readFileSync, writeFileSync } from 'node:fs';
const rd = (p) => readFileSync(new URL(p, import.meta.url));
const txt = (p) => rd(p).toString();
const js = (p) => txt(p).replace(/<\/script/gi, '<\\/script'); // nunca cerrar el <script> antes de tiempo
const mime = { webp: 'image/webp', svg: 'image/svg+xml', jpg: 'image/jpeg', png: 'image/png' };
const data = (p) => `data:${mime[p.split('.').pop()]};base64,${rd(p).toString('base64')}`;
let h = txt('./index.html');

// estilos
h = h.replace(/<link rel="stylesheet" href="((?:assets\/)[^"]+|cafe\.css)">/g, (_, p) => `<style>\n${txt('./' + p)}\n</style>`);
// fotos: una sola versión por foto (la de 780/900 px) para que el archivo pese poco
h = h.replace(/ srcset="[^"]*"/g, '').replace(/ sizes="[^"]*"/g, '');
const smaller = { 'img/portada-1672.webp': 'img/portada-1672.webp', 'img/latte-1200.webp': 'img/latte-780.webp', 'img/americano-muffin-1200.webp': 'img/americano-muffin-780.webp' };
h = h.replace(/src="((?:img|assets\/img)\/[^"]+\.webp)"/g, (_, p) => `src="${data('./' + (smaller[p] || p))}"`);
h = h.replace('href="favicon.svg"', () => `href="${data('./favicon.svg')}"`);
// créditos de la foto de muestra
h = h.replace('href="credits.html"', 'href="https://commons.wikimedia.org/wiki/File:Double_ristretto_naked_portafilter.jpg" target="_blank" rel="noopener"')
     .replace('Algunas fotografías vía Wikimedia Commons', 'Foto del espresso: Takeaway, CC BY-SA 3.0, vía Wikimedia Commons');
// scripts: el del kit que no depende de otros archivos va en línea; el resto se sustituye por uno pequeño
h = h.replace('<script type="module" src="assets/system.js"></script>', () => `<script>
// menú del celular
(() => { const nav = document.querySelector('.nav'), t = nav.querySelector('.nav__toggle');
  t.addEventListener('click', () => { const o = nav.classList.toggle('is-open'); t.setAttribute('aria-expanded', o); document.documentElement.style.overflow = o ? 'hidden' : ''; });
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) { nav.classList.remove('is-open'); t.setAttribute('aria-expanded', 'false'); document.documentElement.style.overflow = ''; } });
  const io = new IntersectionObserver(([e]) => nav.classList.toggle('is-scrolled', !e.isIntersecting)); const s = document.createElement('div'); s.style.cssText = 'position:absolute;top:0;height:1px;width:1px'; document.body.prepend(s); io.observe(s);
})();
</script>`);
h = h.replace('<script type="module" src="assets/motion/motion.js"></script>', () => `<script type="module">\n${js('./assets/motion/motion.js')}\n</script>`);
h = h.replace('<script type="module" src="assets/layout/layout.js"></script>\n', '');
h = h.replace('<script src="cart.js" defer></script>', () => `<script>\ndocument.addEventListener('DOMContentLoaded', () => {\n${js('./cart.js')}\n});\n</script>`);
h = h.replace('<script src="deco.js" defer></script>', () => `<script>\ndocument.addEventListener('DOMContentLoaded', () => {\n${js('./deco.js')}\n});\n</script>`);
h = h.replace('<script src="secret.js" defer></script>', () => `<script>\ndocument.addEventListener('DOMContentLoaded', () => {\n${js('./secret.js')}\n});\n</script>`);
h = h.replace('<meta property="og:image" content="share.jpg">\n', '');

const left = h.match(/(?:src|href)="(?!https?:|data:|#|mailto:)[^"]+"/g);
if (left) console.warn('quedan referencias locales:', left);
writeFileSync(new URL('./cafe-1111.html', import.meta.url), h);
console.log('cafe-1111.html', (h.length / 1024).toFixed(0), 'KB');
