# Setup — Modo grupo (Supabase)

La app funciona sin Supabase: queda en modo "solo este dispositivo" (datos en localStorage). Para activar **lista compartida entre amigos / dispositivos**, sigue estos pasos una sola vez.

## 1. Crear proyecto Supabase

1. Ve a [supabase.com](https://supabase.com) → "Start your project" → inicia sesión con GitHub.
2. "New project". Nombre: `mi-super`. Región: la más cercana (West US para México). Genera password fuerte (no lo necesitarás ahora).
3. Espera ~2 min a que aprovisione.

## 2. Correr el schema

1. Sidebar → **SQL Editor** → "New query".
2. Pega el contenido de [`supabase/schema.sql`](supabase/schema.sql).
3. "Run". Debería decir "Success. No rows returned".

## 3. Permitir usuarios anónimos

1. Sidebar → **Authentication** → **Providers**.
2. Encuentra "Anonymous Sign-Ins" → toggle **ON** → Save.

## 4. Copiar credenciales

1. Sidebar → **Project Settings** (engrane) → **API**.
2. Copia:
   - **Project URL** (ej. `https://abcdefgh.supabase.co`)
   - **anon public** key (es larga, empieza con `eyJ...`)

## 5. Pegar en `config.js`

Abre `config.js` en este repo y pega:

```js
window.SUPABASE_URL = 'https://TU-PROYECTO.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJ...la-anon-key';
```

Commit, push, y la URL pública (https://pedrorojascampuzano-blip.github.io/mi-super/) ya tendrá modo grupo.

## Notas

- **Anon key es público por diseño.** Está protegido por RLS — solo miembros de un grupo ven sus items.
- **Nunca pegues la `service_role` key.** Esa sí da acceso total.
- **Free tier de Supabase**: 500 MB DB + 50K MAU + Realtime ilimitado. Sobra para tu grupo.
- Si pierdes el código de grupo, lo puedes ver en SQL Editor: `select code from groups where name = 'tu grupo'`.
