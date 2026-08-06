/** Exige nombre y al menos un apellido (dos palabras separadas por espacio). */
export const NOMBRE_COMPLETO_PATTERN = '\\S+(\\s+\\S+)+';

/** La misma regla que el atributo pattern, para validar antes de enviar. */
export const NOMBRE_COMPLETO = new RegExp(`^${NOMBRE_COMPLETO_PATTERN}$`);

export type ReservaForm = {
    cliente: string;
    cantidad: number;
    notas: string;
};

export const EMPTY_RESERVA_FORM: ReservaForm = { cliente: '', cantidad: 1, notas: '' };
