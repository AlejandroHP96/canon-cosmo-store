/**
 * Precios: en Firestore se guardan como number (euros).
 * Los documentos antiguos guardaban strings ya formateados ('4,99 €'),
 * por eso toPrice() acepta ambos formatos hasta que la migración esté hecha.
 * Ver scripts/migrate-price-to-number.js
 */

const FORMATTER = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
});

/** Normaliza un valor de Firestore (number o string legacy) a number. */
export const toPrice = (value: unknown): number | undefined => {
    if (typeof value === 'number')
        return Number.isFinite(value) ? value : undefined;
    if (typeof value !== 'string') return undefined;
    return parsePriceInput(value);
};

/** Convierte lo que escribe el admin ('4,99', '4.99', '1.234,50 €') a number. */
export const parsePriceInput = (input: string): number | undefined => {
    let s = input.replace(/[^\d,.-]/g, '');
    if (!s) return undefined;
    const lastComma = s.lastIndexOf(',');
    const lastDot = s.lastIndexOf('.');
    if (lastComma > -1 && lastDot > -1) {
        // El separador decimal es el que aparece más a la derecha
        const decimal = lastComma > lastDot ? ',' : '.';
        const thousands = decimal === ',' ? '.' : ',';
        s = s.split(thousands).join('').replace(decimal, '.');
    } else if (lastComma > -1) {
        s = s.replace(',', '.');
    }
    const n = Number(s);
    return Number.isFinite(n) ? n : undefined;
};

/** Formatea para mostrar: 4.99 -> '4,99 €'. */
export const formatPrice = (value: unknown): string => {
    const n = toPrice(value);
    return n === undefined ? '' : FORMATTER.format(n);
};

/** Valor para el input del admin: 4.99 -> '4,99'. Vacío si no hay precio. */
export const toPriceInput = (value: unknown): string => {
    const n = toPrice(value);
    return n === undefined ? '' : String(n).replace('.', ',');
};
