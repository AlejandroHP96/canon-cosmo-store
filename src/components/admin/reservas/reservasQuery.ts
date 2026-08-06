import type { SolicitudReserva } from '../../../services/reservasService';

/** Más antiguas primero: las que llevan más esperando se atienden antes. */
export function ordenarPorFecha(reservas: SolicitudReserva[]): SolicitudReserva[] {
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
    const q = search.trim().toLowerCase();
    return reservas.filter((r) => {
        if (seccion && r.seccion !== seccion) return false;
        if (producto && r.productoNombre !== producto) return false;
        if (!q) return true;
        return (
            r.cliente.toLowerCase().includes(q) ||
            r.productoNombre.toLowerCase().includes(q) ||
            (r.email ?? '').toLowerCase().includes(q)
        );
    });
}
