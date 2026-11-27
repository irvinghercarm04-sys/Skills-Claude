# Golden Coin

Sitio de una sola página para Golden Coin, cocina china en Los Pinos, Puebla.

- `index.html`: contenido y estructura
- `styles.css`: estilos, entrada del hero y aparición de secciones
- `ui.js`: scroll de palabras, banda de texto con scroll, tarjetas con inclinación 3D y estado "abierto/cerrado" con la hora de Puebla
- `scene.js`: escena Three.js (tarjetas de papel, monedas chinas doradas, polvo dorado). La cámara avanza con el scroll y al final las tarjetas forman un muro
- `vendor/three`: Three.js r186 incluido localmente

Usa módulos ES, así que se abre desde un servidor, no con doble clic:

```
cd golden-coin
python3 -m http.server 8000
# abrir http://localhost:8000
```

Se puede publicar tal cual en cualquier hosting estático (GitHub Pages, Netlify, Vercel).
