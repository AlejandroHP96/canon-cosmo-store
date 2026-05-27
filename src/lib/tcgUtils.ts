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
 * Convierte un ID de Firestore al slug de la URL.
 * Para TCGs nuevos el ID ES el slug.
 */
export function tcgIdToSlug(tcgId: string): string {
    const entry = Object.entries(LEGACY_SLUG_MAP).find(([, id]) => id === tcgId);
    return entry ? entry[0] : tcgId;
}
