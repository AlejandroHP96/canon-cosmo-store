import type { Product } from '../../types';

/** Secciones presentes entre los productos reservables, para los chips de filtro. */
export function seccionesDisponibles(productos: Product[]): string[] {
    return [...new Set(productos.map((p) => p.tcg))].sort();
}

/** Filtra por sección y por texto libre (nombre, set o sección). */
export function filtrarReservables(
    productos: Product[],
    search: string,
    seccion: string | null,
): Product[] {
    const q = search.trim().toLowerCase();
    return productos.filter((p) => {
        if (seccion && p.tcg !== seccion) return false;
        if (!q) return true;
        return (
            p.name.toLowerCase().includes(q) ||
            (p.set?.toLowerCase().includes(q) ?? false) ||
            p.tcg.toLowerCase().includes(q)
        );
    });
}
