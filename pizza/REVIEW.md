# Review — caja de pizza (HyperFrames)

Rehecho a partir del ejemplo de Remotion: misma escena, 7 s, 1080×1080 a 30 fps, sin sonido.

## Decisiones
- Formato cuadrado y sin música: es un clip corto (<15 s) que rehace el original cuadrado.
- Caja en 3D con CSS; GSAP mueve la caída (`#pz-drop`), la tapa (`#pz-lid`), la luz (`#pz-glow`), la cámara (`#pz-camera`) y el título.
- El humo y las burbujas del queso se dibujan desde el tiempo en un listener `hf-seek` (función pura del tiempo).
- Título: la línea entera entra desenfocada y queda quieta (antes era letra a letra), para que siga siendo una variable editable.
- La cámara solo se acerca hasta que la caja se abre (3.4 s); después se queda quieta.
- Variables editables en la escena: `title`, `brand`, `tagline`.

## Medido
- `check`: sin errores ni avisos.
- Snapshots a 0.3, 1.75, 2.6 y 6.5 s, y un fotograma del MP4 a 4.6 s.

## Avisos silenciados a propósito
- `#pz-brand` y `#pz-wall-front` llevan `data-layout-ignore`: son impresión del cartón, no texto de lectura. El contraste del logo se medía con la tapa abierta, cuando está de espaldas.

## Lo más flojo
- El humo se pierde un poco sobre el interior claro de la tapa; con más tiempo oscurecería el interior de la tapa o añadiría una sombra suave detrás del humo.
