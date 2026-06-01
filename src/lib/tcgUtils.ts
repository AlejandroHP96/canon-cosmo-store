/**
 * Mapeo de slugs de URL a IDs de Firestore para los TCGs legacy
 * que usan un identificador diferente al slug de la ruta.
 *
 * Ejemplo: la URL es /tcgs/final-fantasy pero en Firestore
 * los productos tienen tcg: 'finalfantasy'.
 */
const LEGACY_SLUG_MAP: Record<string, string> = {
    'final-fantasy': 'finalfantasy',
    'one-piece': 'onepiece',
};

/**
 * Convierte el slug de la URL al ID que usa Firestore.
 * Para TCGs nuevos el slug ES el ID.
 */
export function slugToTcgId(slug: string): string {
    return LEGACY_SLUG_MAP[slug] ?? slug;
}

/**
 * Convierte texto libre en slug: "Funko Pop" → "funko-pop"
 */
export function toSlug(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
}

/**
 * Convierte cualquier pathname de la app al ID de sección en Firestore.
 *
 *   /tcgs/final-fantasy        →  'finalfantasy'         (legacy mapping)
 *   /tcgs/dragon-ball          →  'dragon-ball'
 *   /accesorios-tcgs           →  'accesorios-tcgs'
 *   /accesorios-tcgs/fundas    →  'accesorios-tcgs__fundas'
 *   /funko-pop                 →  'funko-pop'
 *
 * Las barras internas se sustituyen por '__' para producir un ID
 * válido en Firestore (que no permite '/' en IDs de documento).
 */
export function pathToSectionId(pathname: string): string {
    const stripped = pathname.replace(/^\//, ''); // quita la / inicial
    if (stripped.startsWith('tcgs/')) {
        return slugToTcgId(stripped.slice('tcgs/'.length));
    }
    return stripped.replace(/\//g, '__');
}
