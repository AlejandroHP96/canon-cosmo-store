import type { SolicitudReserva } from '../../../services/reservasService';
import { normalizarBusqueda } from '../../../lib/text';
import { normalizarLocalizador } from '../../../lib/localizador';

/** Más antiguas primero: las que llevan más esperando se atienden antes. */
export function ordenarPorFecha(
    reservas: SolicitudReserva[],
): SolicitudReserva[] {
    return [...reservas].sort(
        (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime(),
    );
}

export function seccionesDeReservas(reservas: SolicitudReserva[]): string[] {
    return [...new Set(reservas.map((r) => r.seccion))].sort();
}

/** Productos de la sección elegida, para el segundo nivel de chips. */
export function productosDeReservas(
    reservas: SolicitudReserva[],
    seccion: string | null,
): string[] {
    const nombres = reservas
        .filter((r) => !seccion || r.seccion === seccion)
        .map((r) => r.productoNombre);
    return [...new Set(nombres)].sort();
}

export function filtrarReservas(
    reservas: SolicitudReserva[],
    search: string,
    seccion: string | null,
    producto: string | null,
): SolicitudReserva[] {
    // Sin tildes a los dos lados de la comparación: buscar "Fabian" tiene que
    // encontrar a "Fabián", que es como suele estar escrito el nombre real.
    const q = normalizarBusqueda(search.trim());
    // El localizador se compara aparte, sin guiones ni mayúsculas: el cliente
    // lo enseña en el móvil y quien atiende lo teclea como puede.
    const codigo = normalizarLocalizador(search.trim());
    return reservas.filter((r) => {
        if (seccion && r.seccion !== seccion) return false;
        if (producto && r.productoNombre !== producto) return false;
        if (!q) return true;
        return (
            normalizarBusqueda(r.cliente).includes(q) ||
            normalizarBusqueda(r.productoNombre).includes(q) ||
            (codigo !== '' &&
                normalizarLocalizador(r.localizador).includes(codigo))
        );
    });
}
