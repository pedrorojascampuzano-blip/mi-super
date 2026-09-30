# Mi Súper · v27 simplificada · Fase 1: direcciones (2026-09-30)

## Links

- **Comparación (elige aquí):** https://anvil.tail8be012.ts.net/bf27eeb1fb3d3bea/mi-super-v27/comparar/
- **Probar en el iPhone:**
  - A · Fresco: https://anvil.tail8be012.ts.net/bf27eeb1fb3d3bea/mi-super-v27/?dir=fresco
  - B · Mercado: https://anvil.tail8be012.ts.net/bf27eeb1fb3d3bea/mi-super-v27/?dir=mercado
  - C · Claro: https://anvil.tail8be012.ts.net/bf27eeb1fb3d3bea/mi-super-v27/?dir=claro

Todo responde HTTP 200: la página, las 32 capturas, los 4 logos, la app y sus archivos. La página no se sale a lo ancho en 390 px.

## Resumen

Las tres direcciones comparten la simplificación:
- Fondo claro.
- Una sola navegación abajo.
- El título dice en qué sección estás.
- Chef, sugerencias, exportar/importar y ajustes pasan a un botón "Más".
- Tienda, orden y agrupar quedan en un botón de filtros junto a Buscar.
- Editar, borrar y foto se hacen desde el detalle del producto, ya no en cada fila.

| | A · Fresco | B · Mercado | C · Claro |
|---|---|---|---|
| Color | verde | naranja, letra grande | azul, estilo Recordatorios |
| Navegación | pestañas abajo con + | campo "¿Qué falta?" siempre abajo, con mic y ticket | barra única: segmentos y + |
| Logo | bolsa con palomita | canasta | lista con palomitas |

Está construido dentro de la app real: `?dir=fresco|mercado|claro` y Ajustes → Diseño. Sin `?dir` la app se ve exactamente como la v26; las pruebas pasan 46/46.

## Diagnóstico de la v26 (390 × 844, zona segura emulada)

Script: `design/measure.mjs`. También se midió en 430 × 932; las capturas de los dos tamaños están en la página.

| | v24 | v26 A / B / C | Fresco | Mercado | Claro |
|---|---|---|---|---|---|
| Controles fuera de las filas, Lista | 28 | 21 / 22 / 20 | 8 | 12 | 8 |
| Controles fuera de las filas, Casa | 28 | 21 / 22 / 20 | 7 | 11 | 7 |
| Textos fuera de las filas, Lista | 24 | 19 / 18 / 15 | 10 | 7 | 7 |
| Botones por producto en Casa | 5 | 5 | 2 | 2 | 2 |
| Acciones principales fuera del pulgar (de 5) | 4 | 2 / 3 / 2 | 0 | 0 | 0 |

Las acciones principales son agregar, dictar, leer ticket, ir a Casa y finalizar. En la v26, dictar, ticket y ajustes siguen en la esquina superior (al 9 % de la altura) en todas las variantes.

Toques por tarea:

| Tarea | v24 | Fresco | Mercado | Claro |
|---|---|---|---|---|
| Agregar | 1, arriba | 2, abajo | 1, abajo | 2, abajo |
| Marcar | 1 | 1 | 1 | 1 |
| Finalizar | 2 | 2 | 2 | 2 |
| Ver Casa | 1, a media pantalla | 1, abajo | 1, abajo | 1, abajo |
| Dictar o ticket | 1, arriba | 2, abajo | 1, abajo | 2, abajo |

## Supabase y datos

- La preview **no se conecta a Supabase**: su `config.js` va vacío, así que corre en modo local, y en las pruebas no hubo ni una petición a supabase.co.
- Sus datos van con el prefijo `v27p:` en localStorage para no mezclarse con las previews v24 y v26, que viven en el mismo dominio y **esas sí pueden conectarse al grupo real**.
- Arranca con la alacena de ejemplo (`tests/fixtures/items.json`).
- No se tocaron producción, `main` ni los datos.

## Estado

Fase 1 terminada. **Detenido hasta que Pedro elija A, B o C** (o una mezcla, por ejemplo "B con logo A").

Para la Fase 2:
- Dejar solo la dirección elegida: quitar el selector, las variantes de navegación y el diseño v26.
- Logo nuevo en `icon.svg`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` y en el manifest. Se generan con `node design/render-icons.mjs design/logos/<dir>.svg .`.
- `theme-color` claro y `apple-mobile-web-app-status-bar-style` en `default`: la cabecera ya no es oscura y con `black-translucent` la hora se vería blanca sobre blanco.
- `APP_VERSION` y `CACHE` a 27.
- Recorrer las 75 pantallas buscando cosas tapadas con la dirección elegida.
- En el iPhone hay que **borrar la app de inicio y volver a agregarla**: iOS no actualiza el ícono ni el estilo de la barra de estado de una app ya agregada.

## Archivos

- `src/app.jsx`, `index.html`: las direcciones (`DIRS`, `renderSimpleItem`, `simpleHeader`, `simpleTools`, hojas "Más" y "Ver y ordenar") y su CSS (`[data-dir]`).
- `design/measure.mjs`: conteo de elementos, zonas del pulgar y capturas.
- `design/render-icons.mjs` y `design/logos/*.svg`: los logos.
- `design/comparar.html`: la página de comparación.
- En el mini: `~/Sites/bf27eeb1fb3d3bea/mi-super-v27/`. Para quitarla: `ssh pedro@100.96.88.84 'rm -rf ~/Sites/bf27eeb1fb3d3bea'`.
