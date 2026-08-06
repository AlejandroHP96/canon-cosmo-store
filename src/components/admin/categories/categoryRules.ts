/**
 * Reglas de la lista de categorías de una sección.
 * Se guardan como array de strings, así que el nombre es la identidad:
 * no puede haber duplicados ni cadenas vacías.
 */

/** Devuelve el mensaje de error, o null si el nombre se puede usar. */
export function validarNombre(
    categorias: string[],
    nombre: string,
    /** Nombre actual, si se está renombrando: no choca consigo mismo. */
    actual?: string,
): string | null {
    const limpio = nombre.trim();
    if (!limpio) return 'El nombre no puede estar vacío.';
    if (limpio !== actual && categorias.includes(limpio)) return `"${limpio}" ya existe en la lista.`;
    return null;
}

export const anadirCategoria = (categorias: string[], nombre: string): string[] => [
    ...categorias,
    nombre.trim(),
];

export const quitarCategoria = (categorias: string[], nombre: string): string[] =>
    categorias.filter((c) => c !== nombre);

export const renombrarCategoria = (
    categorias: string[],
    actual: string,
    nuevo: string,
): string[] => categorias.map((c) => (c === actual ? nuevo.trim() : c));
