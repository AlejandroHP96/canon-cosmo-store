/**
 * Alfabeto sin caracteres que se confunden al dictar o copiar a mano un
 * código: fuera el 0 y la O, el 1 y la I y la L. Lo que queda se lee igual
 * escrito en un papel que dicho por teléfono.
 */
const ALFABETO = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

/** Caracteres por bloque y número de bloques: el formato es XXXX-XXXX. */
const BLOQUE = 4;
const BLOQUES = 2;
const LONGITUD = BLOQUE * BLOQUES;

/** El separador es solo cosmético: se ignora al comparar y al buscar. */
const SEPARADOR = '-';

/** Valida el código ya formateado, tal cual se guarda en Firestore. */
export const LOCALIZADOR_PATTERN = `^[${ALFABETO}]{${BLOQUE}}\\${SEPARADOR}[${ALFABETO}]{${BLOQUE}}$`;
export const LOCALIZADOR = new RegExp(LOCALIZADOR_PATTERN);

/**
 * Genera el localizador de una reserva: el código que el cliente enseña al
 * recoger. No se comprueba contra las reservas ya guardadas —las reglas de
 * Firestore no dejan leer la colección sin ser admin— pero con 31^8 (unas
 * 850.000 millones) de combinaciones la repetición es despreciable, y el
 * panel muestra además nombre y producto para desempatar a ojo.
 *
 * `crypto.getRandomValues` en vez de `Math.random`: el código es lo único
 * que impide que otra persona se lleve la reserva, así que no debe poder
 * adivinarse a partir de otro código ya emitido.
 */
export function generarLocalizador(): string {
    const bytes = crypto.getRandomValues(new Uint8Array(LONGITUD));
    const chars = Array.from(
        bytes,
        // El módulo sesga un pelo hacia las primeras letras del alfabeto
        // (256 no es múltiplo de 31). Es irrelevante para lo que hace falta
        // aquí y evita tener que descartar bytes y volver a pedir.
        (b) => ALFABETO[b % ALFABETO.length],
    );
    return [chars.slice(0, BLOQUE).join(''), chars.slice(BLOQUE).join('')].join(
        SEPARADOR,
    );
}

/**
 * Deja un localizador listo para comparar: sin guiones ni espacios y en
 * mayúsculas. Así el admin encuentra la reserva teclee "a7k3-9qxm",
 * "A7K39QXM" o lo que le haya llegado por WhatsApp con espacios de más.
 */
export function normalizarLocalizador(texto: string): string {
    return texto.replace(/[\s-]/g, '').toUpperCase();
}
