# Mi Súper

Lista de super inteligente: lista de compras, alacena (lo que tienes en casa) e historial — todo en un tap. Opcional: voz, lectura de tickets y chef, usando tu propia API key de Google Gemini.

## Usar

Abre la URL en tu celular. Para la mejor experiencia, **agrégala a la pantalla de inicio**:

- **iPhone**: compartir → "Agregar a pantalla de inicio"
- **Android**: menú de Chrome → "Instalar app"

Una vez instalada funciona offline.

## Funciones con AI (opcional)

Para voz, tickets y chef necesitas una API key gratis de Google Gemini:

1. Ve a [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Inicia sesión con Google
3. "Create API key" → copia la key
4. En la app: icono de engrane → pega la key → Guardar

También puedes usar DeepSeek (solo para texto) desde [platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys).

## Qué puedes hacer

- Agregar items tecleando o con el micrófono ("falta leche, tengo huevo")
- Foto de ticket → extrae productos y precios automáticamente
- "Chef" sugiere receta con lo que tienes en casa
- Marcar esenciales: cuando se acaban, regresan automáticamente a la lista
- Exportar/importar CSV para respaldo

## Lista compartida con amigos (opcional)

Si la persona que te compartió la app activó modo grupo, vas a ver al inicio:
- **Crear grupo nuevo** → genera un código (ej. `AB23PQ12`) que compartes con tus amigos.
- **Unirme con código** → pega el código que te pasaron y entras al grupo.
- **Solo este dispositivo** → la app funciona en local (modo por defecto).

En modo grupo, todos ven y editan la misma lista en tiempo real desde sus celulares y compus. Puedes cambiar de modo desde el engrane.

Para activar modo grupo en tu propia copia de la app, ver [SETUP.md](SETUP.md).

## Privacidad

En modo solo-local: todo vive en tu navegador. Nada sale de tu dispositivo.

En modo grupo: tus items se sincronizan a Supabase (Postgres). Solo los miembros de tu grupo (verificados con tu código) pueden leer o escribir. La app no usa identificadores personales: cada dispositivo es anónimo.

Las API keys de Gemini/DeepSeek se guardan localmente y solo se envían a Google/DeepSeek cuando usas voz, tickets o chef.

## Tech

HTML + React + Tailwind en un solo archivo. Sin build step. Service worker para offline.

## Cómo se identifican las fotos (Vision pipeline)

Una foto sube al bucket Supabase Storage `item-photos/<group_id>/<item_id>-<ts>.jpeg` y crea un item con `name = "Identificando…"` en la tabla `items`. El nombre real lo rellena alguno de estos 3 paths según lo que esté armado en este Mac:

### Path A · Browser Vision (default, instant)

Dentro de la PWA, al subir la foto se llama `callAI()` con la API key del usuario (Gemini 2.5 Flash, fallback Claude Haiku 4.5, GPT-4o-mini). Si la key está configurada en Settings (⚙️), patchea el item desde el browser en segundos.

Requiere: usuario tiene API key gratis de Google Gemini guardada en localStorage de la PWA. Sin key, el item se queda placeholder.

### Path B · Watcher Node 24/7 (Claude API)

`scripts/watch-incoming-photos.mjs` corre bajo launchd cada 5s. Polea Supabase por items con name placeholder, llama Claude Haiku 4.5 vision via API, patchea row. No requiere sesión Claude abierta. Cuesta tokens API directos.

Env requerido: `ANTHROPIC_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GROUP_ID`.

### Path C · Listener `/listen` con sesión Claude Code (Plan Max)

Cuando Pedro NO está usando API directa y vive en Plan Max, el flujo es:

1. Daemon launchd `com.pedro.listen.alacena` polea Supabase con cadencia adaptativa.
2. Detecta items con `name = "Identificando…"` → escribe a queue.
3. Después de debounce, abre Terminal.app con `claude --resume <session-id>` retomando la sesión Claude que tiene contexto de mi-super.
4. La sesión retomada baja las fotos con `curl`, las lee multimodal con Read, decide name/category/units, y patchea via `curl` a Supabase.

Requiere: armar listener via skill `/listen` en una sesión Claude con cwd de este repo, y registrar SERVICE_ROLE_KEY en `~/.claude/skills/listen/state/alacena/env` para que el reactor pueda PATCH bypassing RLS.

**Estado actual de este Mac:** revisar con `~/bin/listen-status` qué daemons están vivos.

### Bug histórico 2026-05-28: 135 fotos huérfanas

Pedro subió 135 fotos con el bulk upload nuevo. Las fotos llegaron al bucket OK pero los items quedaron en `Identificando…` porque:
- Path A: la PWA probablemente cargó SW viejo (v12) sin las correcciones de `compressImage` + retry. Después de actualizar (v14) y con Gemini key, el batch nuevo debería procesarse solo.
- Path B: no había watcher Node corriendo.
- Path C: no había listener `/listen` armado para alacena.

Fix: armar Path C con `/listen` + identificar las 135 huérfanas en una pasada con agentes paralelos. Ver `docs/` para el procedimiento.

## Operación

```bash
# Ver listeners activos para este repo
~/bin/listen-status

# Logs del watcher Node
launchctl print "gui/$(id -u)/com.pedro.miSuper.watcher" 2>/dev/null

# Items con placeholder pendientes (requiere SERVICE_ROLE_KEY en .env)
node scripts/sync-photos.mjs
```

