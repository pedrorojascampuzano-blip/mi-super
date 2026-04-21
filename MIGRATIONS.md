# Migrations

Cómo evolucionar Mi Súper sin perder datos de usuarios existentes.

## Cómo se entera el usuario de un update

1. Push a `main` → GitHub Pages re-deploya en ~1 min.
2. Cualquier app instalada (PWA en iOS/Android/desktop) detecta el cambio:
   - Al abrirse, el service worker pregunta por una versión nueva del propio `sw.js`.
   - Si hay versión nueva, la **instala en background**. La versión vieja sigue corriendo en la pestaña actual.
   - Cuando termina la instalación, el cliente muestra un banner amarillo arriba: **"Hay una versión nueva · Recargar"**.
3. El usuario decide cuándo recargar (no hay reload forzado a media edición).
4. Tap "Recargar" → SW manda `SKIP_WAITING` al worker nuevo → se activa → la página se recarga sola → versión nueva en pantalla.
5. Si el usuario tiene la app abierta más de 1 minuto, polleamos `reg.update()` para detectar versiones nuevas sin esperar a que cierre la pestaña.

## Datos del usuario: qué sobrevive

### localStorage (modo solo-local)

Estas keys son estables. **No las renombres ni las borres** sin migration:

| Key | Contenido |
|---|---|
| `data_v4` | Array de items (lista + alacena + historial) |
| `saved_tags` | Tags rápidos del header |
| `gem_key`, `ds_key`, `cl_key`, `oa_key` | API keys de cada provider |
| `cloud_group_id`, `cloud_group_code`, `cloud_group_name`, `cloud_nickname` | Estado del grupo en modo cloud |
| `onboarded_v1` | Si ya pasó por el onboarding |

### Reglas para evolucionar el schema

**Es seguro:**
- Agregar un campo nuevo a un item (`item.notes = ''` por defecto). Items viejos sin el campo siguen funcionando si el código tolera `undefined`.
- Agregar una key nueva a localStorage.
- Agregar una nueva tabla en Supabase.
- Agregar una columna `nullable` a una tabla existente en Supabase.

**Requiere migración:**
- Renombrar una key de localStorage o un campo de un item.
- Cambiar el tipo de un campo (string → array, etc).
- Borrar una key/campo que el usuario aún tenga.
- Renombrar/borrar columnas en Supabase.
- Cambiar políticas RLS de forma que rompa accesos previos.

### Cómo escribir una migration de localStorage

Cuando la haya, agregar arriba del componente principal:

```js
const runLocalMigrations = () => {
    const v = parseInt(localStorage.getItem('app_data_version') || '0', 10);
    if (v < 1) {
        // ejemplo: rename data_v4 → data_v5 con cambio de estructura
        const old = localStorage.getItem('data_v4');
        if (old) {
            const migrated = JSON.parse(old).map(i => ({ ...i, notes: '' }));
            localStorage.setItem('data_v5', JSON.stringify(migrated));
        }
        localStorage.setItem('app_data_version', '1');
    }
    // if (v < 2) { ... }
};
```

Llámala una sola vez al inicio (antes de cualquier `useState` que lea de localStorage).

### Cómo escribir una migration de Supabase

Crear `supabase/migrations/NNN_description.sql` con SQL idempotente (`IF NOT EXISTS`, `OR REPLACE`). Correrla manualmente en SQL Editor del proyecto (o vía Management API).

Ejemplo:

```sql
-- supabase/migrations/01_add_notes_to_items.sql
alter table items add column if not exists notes text default '';
```

Para borrar/renombrar columnas, primero asegúrate de que ningún cliente activo dependa del nombre viejo (deploy del código nuevo primero, espera unos días, luego corre la migration).

## Bumps de service worker

Cada cambio que altera assets cacheados debe bumpear `CACHE` en `sw.js` (`mi-super-vN`). Sin bump, el SW viejo seguirá sirviendo HTML/JS viejo aunque el usuario recargue.

Cuando tengas dudas: bumpea.
