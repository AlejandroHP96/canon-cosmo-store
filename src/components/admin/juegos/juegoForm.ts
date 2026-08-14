import type { JuegoTorneo } from '../../../services/torneosService';

export type JuegoForm = {
    nombre: string;
    imagen: string;
    descripcion: string;
    url: string;
};

export const EMPTY_JUEGO_FORM: JuegoForm = {
    nombre: '',
    imagen: '',
    descripcion: '',
    url: '',
};

export const juegoToForm = (juego: JuegoTorneo): JuegoForm => ({
    nombre: juego.nombre,
    imagen: juego.imagen ?? '',
    descripcion: juego.descripcion ?? '',
    url: juego.url ?? '',
});

/** Alta: los campos opcionales vacíos no se envían, para no crear claves sueltas. */
export function buildAddJuego(form: JuegoForm): Omit<JuegoTorneo, 'id'> {
    const payload: Omit<JuegoTorneo, 'id'> = { nombre: form.nombre.trim() };
    if (form.imagen.trim()) payload.imagen = form.imagen.trim();
    if (form.descripcion.trim()) payload.descripcion = form.descripcion.trim();
    if (form.url.trim()) payload.url = form.url.trim();
    return payload;
}

/** Edición: los vacíos van como undefined para que el servicio los limpie. */
export function buildUpdateJuego(form: JuegoForm): Omit<JuegoTorneo, 'id'> {
    return {
        nombre: form.nombre.trim(),
        imagen: form.imagen.trim() || undefined,
        descripcion: form.descripcion.trim() || undefined,
        url: form.url.trim() || undefined,
    };
}
