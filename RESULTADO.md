# Mi Súper · v27 simplificada (2026-09-30)

## Fase 2 · Claro construida (lista para "publícala")

Pedro eligió **C · Claro** con su logo.

- **Preview en el iPhone:** https://anvil.tail8be012.ts.net/bf27eeb1fb3d3bea/mi-super-v27-claro/
- **Evidencia (criterios, capturas y conteo):** https://anvil.tail8be012.ts.net/bf27eeb1fb3d3bea/mi-super-v27-claro/evidencia/

Todo responde HTTP 200 y la página de evidencia no se sale a lo ancho en 390 px. Igual que la de la Fase 1, esta preview no se conecta a Supabase (config vacío) y guarda sus datos con el prefijo `v27c:`: en la prueba no salió ni una petición a supabase.co.

### Qué cambió

- **Una sola navegación:** barra abajo con Lista / Casa / Historial y el + del lado del pulgar. Se esconde con el teclado.
- **Código muerto fuera:**
  - el selector de Ajustes y los estados `nav_variant` y `design_dir`;
  - las variantes actual, A y B, y las direcciones Fresco y Mercado;
  - la cabecera oscura, el swipe entre pestañas y el campo de agregar en la cabecera;
  - la fila vieja con editar, foto y borrar, y el CSS sin uso;
  - la fuente Newsreader.
- **Claro:**
  - fondo `#f2f2f7`, lista en un bloque blanco y azul `#2f6fe4` como único acento;
  - el título dice la sección y lo secundario está en "Más";
  - los filtros están en "Ver y ordenar";
  - Editar y Borrar están en el detalle del producto;
  - en Casa, Mari Kondo sigue mostrando duplicado, sin foto y sin comprar en 6 meses, y los agotados tienen "Ya hay".
- **Logo:** está en `icon.svg`, `icon-192.png`, `icon-512.png` y `apple-touch-icon.png` (fuente: `design/logos/claro.svg`). El manifest lleva `background_color` y `theme_color` `#f2f2f7` y el ícono SVG. `theme-color` es `#f2f2f7` y `apple-mobile-web-app-status-bar-style` es `default`, porque la cabecera ya es clara.
- **Versión:** `APP_VERSION` 27 y `CACHE` `mi-super-v27`.
- **Datos:** sin cambios de esquema ni de llaves de datos (`data_v4`, `purchases_v1`). `nav_variant` y `design_dir` quedan huérfanas en los teléfonos que probaron las previews; la app ya no las lee.

### Criterios

| Criterio | Resultado |
|---|---|
| Preview de comparación con 3 direcciones y logos, HTTP 200, link aquí | Sí (Fase 1, abajo) |
| Acciones principales en la zona del pulgar en 390 × 844, con captura | Sí. Agregar, ir a Casa, ir a Historial y finalizar quedan entre el 84 % y el 92 % de la altura; dictar y leer ticket, dentro de la hoja del +. Capturas en la página de evidencia. Prueba: `tests/nav.test.mjs` → "acciones principales dentro de la zona del pulgar" |
| Menos elementos por pantalla que v26, con conteo | Sí, tabla abajo |
| `npm test` en verde, incluida la revisión de nada tapado abajo | Sí, 43/43. Los 84 estados salen limpios: 28 vistas × app instalada, Safari con barra y teclado abierto. Se agregaron las hojas "Más" y "Ver y ordenar" |
| Logo nuevo en los 4 íconos y en el manifest | Sí |
| Producción, `main` y Supabase sin tocar | Sí |

Conteo en 390 × 844: controles y textos fuera de las filas, más botones por producto.

| Pantalla | v26 actual | v26 A / B / C | v27 Claro |
|---|---|---|---|
| Lista | 28 · 24 | 21 / 22 / 20 controles | 8 · 7 |
| Agregar | 28 · 24 | 13 / 22 / 13 | 13 · 10 |
| Casa | 28 · 22, 5 por producto | 21 / 22 / 20, 5 por producto | 7 · 5, 2 por producto |
| Historial | 21 · 18 | 14 / 15 / 13 | 7 · 7 |

La pantalla Agregar de Claro es la misma hoja que tenían las variantes A y C; ahí no hay reducción, pero sí contra la actual y la B.

Pruebas que cambiaron:
- `nav.test.mjs` se reescribió para la navegación única, incluida la prueba de la zona del pulgar.
- `ux.test.mjs` y `layout.test.mjs` ahora pasan por el +, "Más", "Ver y ordenar" y el detalle.
- `hunt.test.mjs` corre una sola vez: antes corría cuatro, una por variante.

### Publicar (solo cuando Pedro diga "publícala")

`main` está en v24 y esta rama trae v25 (Rendimientos), v26 y v27, así que al publicar sale todo junto:

```bash
cd ~/Projects/personal/mi-super
git fetch origin && git checkout main && git merge --ff-only origin/feat/simple-v27 && git push origin main
```

Antes de publicar, `tests/fixtures/items.json` (los 60 productos de la alacena) y `design/` van al repo público. Los mismos 60 nombres también quedan en la página de comparación y en la preview (`demo.js`), con URL secreta en el mini.

### En el iPhone (importante)

iOS **no actualiza el ícono** ni el color de la barra de estado de una app ya agregada a inicio. Para ver el logo nuevo, cuando se publique:
1. Abre la app y confirma arriba que dice v27 (Más → la versión está al final; "refrescar" fuerza la actualización).
2. Borra Mi Súper de la pantalla de inicio: mantén presionado → Eliminar app.
3. Abre https://pedrorojascampuzano-blip.github.io/mi-super/ en Safari → Compartir → Agregar a inicio.

Ojo: la app de inicio guarda sus datos aparte de Safari. Si estás en un grupo, la lista vuelve desde Supabase al entrar de nuevo al grupo. Lo que solo estaba en el teléfono (modo local, historial de compras `purchases_v1`) se borra con la app. Si hace falta conservarlo, exporta antes el CSV desde Más.

### Commits

Los hashes están en `git log feat/simple-v27`.

---

# Fase 1: direcciones

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
