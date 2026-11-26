# Café 11•11 — sitio web

Página estática (abre `index.html` o súbela a cualquier hosting: Netlify, GitHub Pages, Vercel).

- **Menú y precios:** edita `menu-data.mjs` y corre `node build.mjs` para regenerar `index.html`.
- **Carrito y WhatsApp:** `cart.js` (número en la constante `WA`, con lada de México 52).
- **Estilos propios:** `cafe.css` (sobre el sistema de diseño en `assets/`).
- **Foto de la fachada:** guarda tu foto como `img/fachada.jpg` y cambia el `src` marcado como `CLIENT SLOT` en `build.mjs`.
- **DiDi Food:** el botón apunta a la página general de DiDi Food México; pon el enlace directo de tu tienda en `DIDI` dentro de `build.mjs`.
