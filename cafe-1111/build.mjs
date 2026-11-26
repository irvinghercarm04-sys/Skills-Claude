// Genera index.html a partir de menu-data.mjs:  node build.mjs
import { writeFileSync } from 'node:fs';
import { sections } from './menu-data.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const money = (n) => '$' + n;
const PLUS = '<svg class="add__plus" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 2v8M2 6h8"/></svg>';
const ARROW = '<svg class="m-arrow" viewBox="0 0 12 12" aria-hidden="true"><path class="m-arrow__stem" d="M1 6h8"/><path class="m-arrow__head" d="M4.5 2.5 8 6l-3.5 3.5"/></svg>';
const KEY = '<svg class="key" viewBox="0 0 64 24" aria-hidden="true"><circle cx="10" cy="12" r="7.2" fill="none" stroke="currentColor" stroke-width="2.6"/><circle cx="10" cy="12" r="2.4"/><rect x="17.5" y="9" width="3" height="6" rx="1"/><rect x="20" y="10.6" width="38" height="2.8" rx="1.2"/><path d="M47 13.2h11.5v8.3h-3v-3.4h-2.4v3.4h-2.4v-5h-3.7z"/></svg>';

function row(it) {
  const btns = it.sizes.map(([label, p], i) =>
    `<button class="add" type="button" data-add="${it.id}" data-size="${i}" aria-label="Agregar ${esc(it.name)}${label ? ' ' + esc(label) : ''}, ${money(p)}">` +
    (label ? `<span class="add__size">${esc(label)}</span>` : '') + `<span class="add__price">${money(p)}</span>${PLUS}</button>`).join('');
  return `<li class="item"><div class="item__text"><span class="rows__name">${esc(it.name)}</span>` +
    (it.desc ? `<p class="item__desc">${esc(it.desc)}</p>` : '') + `</div><div class="item__adds">${btns}</div></li>`;
}

function menuSection(s, i) {
  const big = false;
  return `
  <section class="section menu menu--${s.id}${big ? ' g2' : ''}" id="${s.id}" aria-labelledby="${s.id}-h">
    <div class="wrap">
      <div class="section-head section-head--split menu__head">
        ${ICONS[s.id] || ''}
        <div><h2 id="${s.id}-h">${esc(s.h2)}</h2><p>${esc(s.lead)}</p></div>
      </div>
      <div class="grid menu__groups">
        ${s.groups.map((g) => `<div class="menu__group span-6"><h3 class="t-label">${esc(g.label)}</h3><ul class="rows">${g.items.map(row).join('')}</ul></div>`).join('\n        ')}
        ${s.id === 'dulce' ? `<div class="cakes span-12"><h3 class="cakes__title">¡Pasteles enteros!</h3><p>Hacemos tu postre favorito sobre pedido.</p><a class="link" href="https://wa.me/522214378911?text=${encodeURIComponent('Hola Café 11•11, quiero pedir un pastel entero.')}" target="_blank" rel="noopener">Encargar un pastel por WhatsApp</a></div>` : ''}
      </div>
    </div>
  </section>`;
}

const ICONS = {
  calientes: `<svg class="deco-ic deco-ic--steam" viewBox="0 0 96 96" aria-hidden="true"><path class="st st1" d="M36 34c-6-7 6-11 0-19"/><path class="st st2" d="M48 34c-6-7 6-11 0-19"/><path class="st st3" d="M60 34c-6-7 6-11 0-19"/><path d="M22 42h52v14a22 22 0 0 1-22 22h-8a22 22 0 0 1-22-22z"/><path d="M74 48h4a9 9 0 0 1 0 18h-6"/><path d="M16 86h64"/></svg>`,
  frios: `<svg class="deco-ic deco-ic--bubbles" viewBox="0 0 96 96" aria-hidden="true"><path d="M30 30h36l-5 56H35z"/><path d="M26 30h44"/><path d="M53 30l9-22h8"/><path d="M32 46h32"/><circle class="bb bb1" cx="42" cy="70" r="2.5"/><circle class="bb bb2" cx="52" cy="62" r="2"/><circle class="bb bb3" cx="47" cy="76" r="1.8"/><path d="M32 30c0-8 7-12 16-12s16 4 16 12"/></svg>`,
  comer: `<svg class="deco-ic deco-ic--sway" viewBox="0 0 96 96" aria-hidden="true"><ellipse cx="48" cy="44" rx="34" ry="16"/><ellipse cx="48" cy="44" rx="9" ry="4"/><path class="leaf" d="M16 60c8 6 20 8 32 8s24-2 32-8"/><path class="leaf" d="M18 66c4 3 10 6 14 4s6-6 10-4 8 6 12 4 6-6 10-4 8 4 14-1"/><path d="M14 74c8 7 21 10 34 10s26-3 34-10"/></svg>`,
  dulce: `<svg class="deco-ic deco-ic--candle" viewBox="0 0 96 96" aria-hidden="true"><path class="flame" d="M48 10c4 5 5 9 0 13-5-4-4-8 0-13z"/><path d="M48 23v12"/><path d="M18 52h60v32H18z"/><path d="M18 52c4 7 9 7 12 0 3 7 9 7 12 0 3 7 9 7 12 0 3 7 9 7 12 0 3 7 8 7 12 0"/><path d="M24 40h48v12H24z"/><path d="M12 84h72"/></svg>`,
};
ICONS.bebidas = `<svg class="deco-ic deco-ic--bubbles" viewBox="0 0 96 96" aria-hidden="true"><path d="M40 8h16v14l8 12v50a4 4 0 0 1-4 4H36a4 4 0 0 1-4-4V34l8-12z"/><path d="M32 48h32M32 68h32"/><circle class="bb bb1" cx="44" cy="62" r="2"/><circle class="bb bb2" cx="52" cy="58" r="1.8"/><circle class="bb bb3" cx="48" cy="64" r="1.5"/></svg>`;
ICONS.salados = `<svg class="deco-ic deco-ic--sway" viewBox="0 0 96 96" aria-hidden="true"><circle cx="44" cy="52" r="26"/><path d="M70 52h18"/><circle class="leaf" cx="44" cy="52" r="10" fill="#e8b04a" stroke="#e8b04a"/><path d="M8 84h72"/></svg>`;
const PHOTOS = {
  chilaquiles: ['img/chilaquiles-780.webp', 'Chilaquiles verdes con huevo estrellado y aguacate en sartén de hierro', '50% 45%'],
  latte: ['img/latte-780.webp', 'Latte en vaso de cristal con espuma y canela', '50% 40%'],
  americano: ['img/americano-muffin-780.webp', 'Taza de café americano con muffin de elote', '30% 60%'],
  muffin: ['img/americano-muffin-780.webp', 'Muffin de elote junto a un café americano', '85% 80%'],
  espresso: ['assets/img/photo-m28989985-1200.webp', 'Espresso corriendo sobre una taza blanca', '62% 60%'],
};
const pick = (sid, gi) => sections.find((x) => x.id === sid).groups[gi];
const TABS = [
  { id: 'calientes', label: 'Calientes', h: 'Tómate algo calientito', note: 'Precios chico / grande. Personaliza tu bebida: Leche Entera o Deslactosada. Carga extra de café +$10.', groups: [pick('calientes', 0), pick('calientes', 1)] },
  { id: 'frios', label: 'Frappés y fríos', h: 'Frappés, smoothies y granizados', note: 'Precios chico / grande.', groups: [pick('frios', 0), { label: 'Smoothies, granizados y chamoyadas', items: pick('frios', 1).items.slice(0, 3) }] },
  { id: 'bebidas', label: 'Bebidas y cerveza', h: 'Aguas, refrescos, cerveza y vino', groups: [{ label: 'Bebidas', items: pick('frios', 1).items.slice(3, 7) }, { label: 'Cerveza y vino', items: pick('frios', 1).items.slice(7) }] },
  { id: 'comer', label: 'Bagels y chapatas', h: 'Bagels y chapatas', note: 'Promoción Arma tu Combo: elige tu Chapata o Bagel y por $35 más, añade Agua del día y Ensalada.', groups: [pick('comer', 0), pick('comer', 1)] },
  { id: 'salados', label: 'Salados y ensaladas', h: 'Más salados y ensaladas', note: 'Todas las ensaladas llevan lechuga y espinaca.', groups: [pick('comer', 2), { label: 'Ensaladas', items: pick('comer', 3).items }] },
  { id: 'dulce', label: 'Dulce', h: 'Antojos dulces y postres', note: 'Los postres los vamos variando: pregunta por los postres del día.', groups: [pick('dulce', 0), pick('dulce', 1)], cakes: true },
];

function card(it) {
  const ph = PHOTOS[it.id];
  const btns = it.sizes.map(([label, p], i) =>
    `<button class="add" type="button" data-add="${it.id}" data-size="${i}" aria-label="Agregar ${esc(it.name)}${label ? ' ' + esc(label) : ''}, ${money(p)}">` +
    (label ? `<span class="add__size">${esc(label)}</span>` : '') + `<span class="add__price">${money(p)}</span>${PLUS}</button>`).join('');
  return `<article class="mcard${ph ? ' mcard--photo' : ''}">` +
    (ph ? `<figure class="mcard__pic"><img src="${ph[0]}" alt="${esc(ph[1])}" loading="lazy" decoding="async" style="object-position:${ph[2]}"></figure>` : '') +
    `<div class="mcard__body"><h4 class="mcard__name">${esc(it.name)}</h4>` +
    (it.desc ? `<p class="mcard__desc">${esc(it.desc)}</p>` : '') +
    `<div class="mcard__adds">${btns}</div></div></article>`;
}

function menuBlock() {
  const wa = `https://wa.me/522214378911?text=${encodeURIComponent('Hola Café 11•11, quiero pedir un pastel entero.')}`;
  return `
  <section class="section menu-x" id="menu" aria-labelledby="menu-h">
    <div class="wrap">
      <div class="menu-x__head">
        <div><p class="menu-x__eyebrow">Precios en MXN</p><h2 id="menu-h">Nuestro menú</h2></div>
        <p class="menu-x__lead">Desayuna, Lunchea, Come o Cena... Toca un precio para agregarlo a tu pedido.</p>
      </div>
      <div class="tabs-x" role="tablist" aria-label="Categorías del menú">
        ${TABS.map((t, i) => `<button class="tab-x" role="tab" type="button" id="tab-${t.id}" aria-controls="${t.id}" aria-selected="${i === 0}" data-tab="${t.id}"><span class="tab-x__ic">${ICONS[t.id]}</span>${esc(t.label)}</button>`).join('')}
      </div>
      ${TABS.map((t, i) => `<div class="panel-x" role="tabpanel" id="${t.id}" aria-labelledby="tab-${t.id}"${i ? ' hidden' : ''}>
        <div class="panel-x__head"><h3>${esc(t.h)}</h3>${t.note ? `<p>${esc(t.note)}</p>` : ''}</div>
        ${t.groups.map((g) => `<p class="panel-x__label">${esc(g.label)}</p><div class="mgrid">${g.items.map(card).join('')}</div>`).join('')}
        ${t.cakes ? `<div class="cakes-x"><span class="cakes-x__ic">${ICONS.dulce}</span><div><h4>¡Pasteles enteros!</h4><p>Hacemos tu postre favorito sobre pedido.</p></div><a class="btn cakes-x__btn" href="${wa}" target="_blank" rel="noopener">Encargar por WhatsApp</a></div>` : ''}
      </div>`).join('\n      ')}
    </div>
  </section>`;
}
const MAPS = 'https://maps.app.goo.gl/JHZndEco7oGyx8NG9?g_st=ac';
// Mapa: pon aquí la dirección o coordenadas del café (ej. 'Calle 5 Sur 1101, Puebla' o '19.0414,-98.2063')
// y se mostrará un mapa de Google incrustado. Vacío = mapa ilustrado con botón a Google Maps.
const MAP_QUERY = '';

const html = `<!doctype html>
<html lang="es" data-type="place" data-radius="soft" data-buttons="arrow" data-motion>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Café 11•11: café, desayunos y antojos</title>
<meta name="description" content="Café de especialidad, chilaquiles, bagels, chapatas y postres. Arma tu pedido en línea y envíalo por WhatsApp.">
<meta property="og:type" content="website">
<meta property="og:title" content="Café 11•11: café, desayunos y antojos">
<meta property="og:description" content="Life is too short for bad coffee. Arma tu pedido y envíalo por WhatsApp.">
<meta property="og:image" content="share.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<meta name="theme-color" content="#f4efe6">
<!-- <link rel="canonical" href="https://[dominio del café]/"> -->
<meta name="site-kind" content="other">
<meta name="page-type" content="place">
<meta name="page-kind" content="place">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,400..600,0..100,0..1&family=Figtree:wght@400..600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/system.css">
<link rel="stylesheet" href="assets/ui/cards.css">
<link rel="stylesheet" href="assets/motion/motion.css">
<link rel="stylesheet" href="assets/layout/layout.css">
<style>
:root {
  --p-bg: #f4efe6; --p-surface: #e9e1d3; --p-ink: #1c1a17; --p-muted: #4b453d;
  --p-accent: #2f5f57; --p-accent-ink: #f4efe6; --p-action: #2f5f57; --p-action-ink: #f4efe6;
  --p-inv-bg: #1c1a17; --p-inv-surface: #282623; --p-inv-ink: #f4efe6; --p-inv-muted: #9a968f;
  --p-inv-accent: #f4efe6; --p-inv-accent-ink: #1c1a17; --p-inv-action: #f4efe6; --p-inv-action-ink: #1c1a17;
  --font-display: "Fraunces", Georgia, serif;
  --font-text: "Figtree", system-ui, sans-serif;
  --display-weight: 400;
  --display-tracking: -0.02em;
  --display-axes: 'SOFT' 30, 'WONK' 0;
}
</style>
<link rel="stylesheet" href="cafe.css">
<script>document.documentElement.classList.add('m-enter');setTimeout(()=>document.documentElement.classList.add('m-enter-done'),700)</script>
</head>
<body>
<!-- type: place (café)
     deal: hero place, nav nav-cards (palabras simples), close close-word (momento de tipo: el nombre), footer footer-columns,
     rhythm surface-pairs, buttons arrow, mark: el logotipo propio del cliente (llave antigua), palette: colores propios (start.mjs brand)
     galería fija de 3 fotos en #historia -->
<header class="nav">
  <div class="wrap nav__bar">
    <a class="skip-link" href="#top">Ir al contenido</a>
    <a class="nav__logo" href="#top" aria-label="Café 11•11, inicio">${KEY}<span>Café 11•11</span></a>
    <nav class="nav__links" aria-label="Principal">
      <div class="nav__item"><a class="nav__link" href="#calientes">Calientes</a></div>
      <div class="nav__item"><a class="nav__link" href="#frios">Fríos</a></div>
      <div class="nav__item"><a class="nav__link" href="#comer">Para comer</a></div>
      <div class="nav__item"><a class="nav__link" href="#dulce">Dulce</a></div>
      <div class="nav__item"><a class="nav__link" href="#ubicacion">Ubicación</a></div>
    </nav>
    <div class="nav__actions">
      <button class="btn btn--primary cart-open" type="button" data-cart-open>Ver pedido <span class="cart-count" data-cart-count>0</span></button>
    </div>
    <button class="nav__toggle" type="button" aria-expanded="false" aria-label="Menú">
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 5h14M2 13h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>
  </div>
</header>
<main id="top">
  <section class="hero hero--place" data-enter aria-labelledby="hero-h">
    <img class="hero__bg hero__bg--banner" src="img/portada-1672.webp" srcset="img/portada-900.webp 900w, img/portada-1672.webp 1672w" sizes="100vw" width="1672" height="941" alt="Tazas de capuchino con arte latte sobre barra de madera junto al logotipo de Café 11•11 con la llave antigua" style="--ly-pos: 50% 50%" fetchpriority="high" data-source="client" data-subject="portada">
    <button class="secret-btn" type="button" data-secret><span class="secret-btn__bean" aria-hidden="true"></span>Botón secreto</button>
    <div class="wrap"><div class="hero-text">
      <div class="hero__text">
        <h1 id="hero-h">Café, desayunos y antojos en <span class="swash">Café 11•11<svg viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true"><path d="M4 14C60 4 120 4 170 9s90 6 126-3"/></svg></span></h1>
        <p class="hero__lead">Desayuna, Lunchea, Come o Cena... Chilaquiles verdes $89 y capuchino desde $43. Arma tu pedido aquí y envíalo por WhatsApp.</p>
        <div class="btn-row"><a class="btn btn--primary" href="#calientes">Armar mi pedido${ARROW}</a></div>
      </div>
    </div></div>
  </section>


  <div class="ribbon" aria-hidden="true">
    <div class="ribbon__track">
      ${Array(2).fill('<span>Life is too short for bad coffee</span><i>✦</i><span>Desayuna, Lunchea, Come o Cena...</span><i>✦</i><span>¡Pasteles enteros sobre pedido!</span><i>✦</i><span>Pide por WhatsApp</span><i>✦</i>').join('')}
    </div>
  </div>

  <section class="section" id="historia" aria-labelledby="historia-h">
    <div class="wrap">
      <div class="section-head"><h2 id="historia-h">Life is too short for bad coffee</h2><p>Espresso, latte con canela y café americano con muffin de elote, servidos en la mesa de madera.</p></div>
      <div class="grid gallery">
        <a class="gallery__item span-4" href="#calientes">
          <figure class="gallery__pic"><img src="assets/img/photo-m28989985-1200.webp" alt="Una taza blanca bajo el portafiltro mientras corre el espresso" width="1200" height="857" loading="lazy" data-source="library-057" data-subject="bar" style="object-position: 62% 60%"></figure>
          <h3>Espresso, sencillo o doble</h3>
          <p>$32 el sencillo, $41 el doble. Con carga extra por $10.</p>
        </a>
        <a class="gallery__item span-4" href="#calientes">
          <figure class="gallery__pic"><img src="img/latte-1200.webp" alt="Latte en vaso de cristal con capas de leche y espuma con canela, sobre plato blanco" width="1200" height="1577" loading="lazy" data-source="client" data-subject="latte"></figure>
          <h3>Latte con espuma y canela</h3>
          <p>$43 chico, $52 grande. Con sabor desde $54.</p>
        </a>
        <a class="gallery__item span-4" href="#dulce">
          <figure class="gallery__pic"><img src="img/americano-muffin-1200.webp" alt="Taza de café americano junto a un muffin de elote en la mesa junto a la ventana" width="1200" height="1582" loading="lazy" data-source="client" data-subject="americano y muffin"></figure>
          <h3>Americano y muffin de elote</h3>
          <p>Americano $32 y muffin de elote $42.</p>
        </a>
      </div>
    </div>
  </section>
${menuBlock()}
  <section class="section ubic" id="ubicacion" aria-labelledby="ubic-h">
    <div class="wrap">
      <div class="ubic__head">
        <h2 id="ubic-h">Encuéntranos</h2>
        <a class="btn btn--primary" href="${MAPS}" target="_blank" rel="noopener">Abrir en Google Maps${ARROW}</a>
      </div>
      <a class="ubic__map" href="${MAPS}" target="_blank" rel="noopener" aria-label="Ver la ubicación de Café 11•11 en Google Maps">
        ${MAP_QUERY ? `<iframe title="Mapa de Café 11•11" src="https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&z=17&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>` : `<svg class="ubic__art" viewBox="0 0 1200 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <rect width="1200" height="520" class="m-ground"/>
          <path class="m-park" d="M820 40h260v170H820z"/><circle class="m-tree" cx="870" cy="90" r="14"/><circle class="m-tree" cx="930" cy="140" r="18"/><circle class="m-tree" cx="1010" cy="80" r="12"/><circle class="m-tree" cx="1040" cy="160" r="16"/>
          <path class="m-block" d="M40 40h220v150H40zM310 40h220v150H310zM580 40h190v150H580zM40 250h220v230H40zM310 250h160v100H310zM310 390h160v90H310zM820 270h260v210H820zM1120 40h80v440h-80z"/>
          <path class="m-road" d="M0 220h1200M285 0v520M795 0v520M0 375h560"/>
          <path class="m-road m-road--main" d="M-20 470C200 430 420 300 560 260s300-40 660-120"/>
          <path class="m-route" d="M120 480C240 430 380 360 480 330s100-50 120-70"/>
          <circle class="m-pulse" cx="600" cy="260" r="24"/>
        </svg>
        <span class="ubic__pin" aria-hidden="true"><svg viewBox="0 0 64 24"><circle cx="10" cy="12" r="7.2" fill="none" stroke="currentColor" stroke-width="2.6"/><circle cx="10" cy="12" r="2.4"/><rect x="17.5" y="9" width="3" height="6" rx="1"/><rect x="20" y="10.6" width="38" height="2.8" rx="1.2"/><path d="M47 13.2h11.5v8.3h-3v-3.4h-2.4v3.4h-2.4v-5h-3.7z"/></svg></span>
        <span class="ubic__tag">Café 11•11 · Toca para abrir el mapa</span>`}
      </a>
    </div>
  </section>

</main>

<footer class="footer closing" id="contacto" aria-labelledby="close-h">
  <div class="wrap">
    <div class="closing__cta close--word">
      <div class="section-head--split">
        <div><h2 id="close-h">Tu pedido, directo a WhatsApp</h2><p class="t-lead">Elige del menú, escribe a nombre de quién va y envíalo con el total.</p></div>
        <button class="btn btn--primary" type="button" data-cart-open>Ver mi pedido${ARROW}</button>
      </div>
      <p class="close__word" aria-hidden="true">Café 11•11</p>
    </div>
    <div class="closing__links">
      <div class="grid">
        <div class="span-4 stack-4">
          <a class="nav__logo" href="#top" aria-label="Café 11•11, inicio">${KEY}<span>Café 11•11</span></a>
          <p class="footer__lede">Desayuna, Lunchea, Come o Cena...</p>
        </div>
        <div class="span-2 start-7 footer__col"><h3>Menú</h3><ul><li><a href="#calientes">Calientes</a></li><li><a href="#frios">Fríos</a></li><li><a href="#comer">Para comer</a></li><li><a href="#dulce">Dulce</a></li></ul></div>
        <div class="span-2 footer__col"><h3>Pedidos</h3><ul><li><a href="#calientes">Por WhatsApp</a></li></ul></div>
        <div class="span-2 footer__col"><h3>Ubicación</h3><ul><li><a href="${MAPS}" target="_blank" rel="noopener">Google Maps</a></li><li><a href="#ubicacion">Cómo llegar</a></li></ul></div>
      </div>
      <div class="footer__legal">
        <span>&copy; 2026 Café 11•11</span>
        <a class="credits" href="credits.html">Algunas fotografías vía Wikimedia Commons</a>
      </div>
    </div>
  </div>
</footer>

<!-- barra del carrito: aparece cuando hay productos -->
<div class="cartbar" data-cartbar hidden>
  <button class="cartbar__btn" type="button" data-cart-open>
    <span class="cartbar__count"><span data-cart-count>0</span> <span data-cart-noun>productos</span></span>
    <span class="cartbar__label">Ver pedido</span>
    <span class="cartbar__total" data-cart-total>$0</span>
  </button>
</div>
<p class="toast" role="status" aria-live="polite" data-toast></p>

<!-- opciones de un producto -->
<dialog class="sheet sheet--opts" data-opts aria-labelledby="opts-h">
  <form method="dialog" class="sheet__inner" data-opts-form>
    <div class="sheet__head">
      <h2 id="opts-h" data-opts-title>Producto</h2>
      <button class="sheet__close" type="button" data-close aria-label="Cerrar"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/></svg></button>
    </div>
    <p class="sheet__desc" data-opts-desc></p>
    <div class="sheet__body" data-opts-body></div>
    <div class="sheet__foot">
      <div class="qty" role="group" aria-label="Cantidad">
        <button type="button" class="qty__btn" data-qty="-1" aria-label="Uno menos">−</button>
        <output class="qty__n" data-qty-n>1</output>
        <button type="button" class="qty__btn" data-qty="1" aria-label="Uno más">+</button>
      </div>
      <button class="btn btn--primary sheet__cta" type="submit" data-opts-add>Agregar <span data-opts-total>$0</span></button>
    </div>
  </form>
</dialog>

<!-- el pedido -->
<dialog class="sheet sheet--cart" data-cart aria-labelledby="cart-h">
  <div class="sheet__inner">
    <div class="sheet__head">
      <h2 id="cart-h">Tu pedido</h2>
      <button class="sheet__close" type="button" data-close aria-label="Cerrar"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/></svg></button>
    </div>
    <div class="sheet__body">
      <p class="cart__empty" data-cart-empty>Aún no hay nada. Toca un precio del menú para agregarlo.</p>
      <ul class="cart__lines" data-cart-lines></ul>
      <form class="cart__form" data-cart-form novalidate>
        <div class="field"><label for="c-name">¿A nombre de quién queda?</label>
          <input id="c-name" name="name" type="text" autocomplete="name" required aria-describedby="c-name-err" placeholder="Tu nombre">
          <p class="field__error" id="c-name-err" hidden>Escribe el nombre para el pedido.</p></div>
        <div class="field"><label for="c-notes">Notas (opcional)</label>
          <textarea id="c-notes" name="notes" rows="2" placeholder="Ej. sin cebolla, paso a las 9:30"></textarea></div>
      </form>
    </div>
    <div class="sheet__foot sheet__foot--cart">
      <div class="cart__total"><span>Total</span><strong data-cart-total>$0</strong></div>
      <a class="btn btn--primary btn--wa sheet__cta" href="https://wa.me/522214378911" target="_blank" rel="noopener" data-cart-send>
        <svg class="wa" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2A9.8 9.8 0 0 0 3.6 17l-1.4 4.8 5-1.3A9.8 9.8 0 1 0 12 2.2zm0 17.8a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .2-1.2c-.1-.1-.3-.2-.5-.3z"/></svg>
        Enviar pedido por WhatsApp
      </a>
      <p class="cart__hint">Se abre WhatsApp con tu pedido y el total ya escritos.</p>
    </div>
  </div>
</dialog>

<script>window.MENU = ${JSON.stringify(sections.flatMap((s) => s.groups.flatMap((g) => g.items)).reduce((m, it) => (m[it.id] = it, m), {}))};</script>
<script type="module" src="assets/system.js"></script>
<script type="module" src="assets/motion/motion.js"></script>
<script type="module" src="assets/layout/layout.js"></script>
<script src="cart.js" defer></script>
<script src="deco.js" defer></script>
<script src="secret.js" defer></script>
</body>
</html>
`;
writeFileSync(new URL('./index.html', import.meta.url), html);
console.log('index.html written,', html.length, 'bytes');
