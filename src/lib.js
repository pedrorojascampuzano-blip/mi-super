// Funciones puras (sin React ni DOM) para poder probarlas en Node.

// Texto de la lista del súper para compartir: lo que falta, agrupado por categoría.
// Lo que ya está en el carrito va marcado. `place` = filtro de tienda activo ('Todos' = todo).
export const listShareText = (items, place = 'Todos') => {
    const pending = items.filter((i) => (i.status === 'needed' || i.status === 'cart')
        && (place === 'Todos' || (i.places || []).includes(place) || (i.places || []).includes('General')));
    if (!pending.length) return 'La lista del súper está vacía.';
    const groups = {};
    for (const i of pending) (groups[i.category || 'Otros'] = groups[i.category || 'Otros'] || []).push(i);
    const title = place === 'Todos' ? 'Lista del súper' : `Lista del súper · ${place}`;
    const body = Object.entries(groups)
        .sort(([a], [b]) => a.localeCompare(b, 'es'))
        .map(([cat, list]) => `${cat}\n` + list
            .sort((a, b) => (a.name || '').localeCompare(b.name || '', 'es'))
            .map((i) => `${i.status === 'cart' ? '[x]' : '[ ]'} ${i.name}${i.qty ? ` (${i.qty})` : ''}`)
            .join('\n'))
        .join('\n\n');
    return `${title}\n\n${body}`;
};
