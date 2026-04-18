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
