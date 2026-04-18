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

## Privacidad

Todo vive en tu navegador. Tus listas, tus keys, tu historial: nada se envía a un servidor. Las API keys solo se usan al llamar a Google/DeepSeek (cuando usas voz, tickets o chef).

## Tech

HTML + React + Tailwind en un solo archivo. Sin build step. Service worker para offline.
