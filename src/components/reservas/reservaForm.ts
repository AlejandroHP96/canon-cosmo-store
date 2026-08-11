/** Exige nombre y al menos un apellido: dos palabras o más. Sin tope por arriba. */
const NOMBRE_COMPLETO_CORE = '\\S+(\\s+\\S+)+';

/**
 * Para el atributo `pattern` del input, que valida el valor tal cual está
 * escrito, sin recortarlo. Tolera espacios sueltos a los lados: los teclados
 * de móvil con texto predictivo dejan uno al final al aceptar la sugerencia, y
 * eso hacía que el navegador rechazara nombres perfectamente válidos.
 */
export const NOMBRE_COMPLETO_PATTERN = `\\s*${NOMBRE_COMPLETO_CORE}\\s*`;

/** La misma regla, ya sobre el valor recortado. */
export const NOMBRE_COMPLETO = new RegExp(`^${NOMBRE_COMPLETO_CORE}$`);

/** Única puerta de entrada para validar el nombre, recorte incluido. */
export function esNombreCompleto(raw: string): boolean {
    return NOMBRE_COMPLETO.test(raw.trim());
}

/** Tope de unidades por reserva. Lo exigen también las reglas de Firestore. */
export const MAX_CANTIDAD = 100;
export const MIN_CANTIDAD = 1;

export type ReservaForm = {
    cliente: string;
    /**
     * Texto crudo mientras se escribe, no un número. Guardarlo ya normalizado
     * impedía teclear con libertad: al borrar el campo volvía solo a 1, y
     * cualquier cifra se recortaba a mitad de tecleo.
     */
    cantidad: string;
    notas: string;
};

export const EMPTY_RESERVA_FORM: ReservaForm = { cliente: '', cantidad: '1', notas: '' };

/**
 * Filtra lo que se admite en el campo mientras se teclea: solo dígitos, y sin
 * pasar de las cifras que caben en el tope. Deja pasar la cadena vacía, para
 * poder vaciar el campo y volver a escribir.
 */
export function sanitizeCantidadInput(raw: string): string {
    return raw.replace(/\D/g, '').slice(0, String(MAX_CANTIDAD).length);
}

/**
 * Convierte el texto del campo en la cantidad que se guarda. Se aplica al
 * salir del campo y al enviar, no en cada tecla: pasarse del tope lo deja
 * en el tope, y vacío o inválido vuelve al mínimo.
 */
export function normalizeCantidad(raw: string): number {
    const n = parseInt(raw, 10);
    if (!Number.isFinite(n)) return MIN_CANTIDAD;
    return Math.min(MAX_CANTIDAD, Math.max(MIN_CANTIDAD, n));
}
