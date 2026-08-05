import { describe, it, expect } from 'vitest';
import { toPrice, parsePriceInput, formatPrice, toPriceInput } from './price';

describe('parsePriceInput', () => {
    it('acepta coma decimal, que es lo que teclea el admin', () => {
        expect(parsePriceInput('4,99')).toBe(4.99);
    });

    it('acepta punto decimal', () => {
        expect(parsePriceInput('4.99')).toBe(4.99);
    });

    it('acepta enteros sin decimales', () => {
        expect(parsePriceInput('50')).toBe(50);
    });

    it('ignora el símbolo de euro y los espacios', () => {
        expect(parsePriceInput('19,99 €')).toBe(19.99);
        expect(parsePriceInput(' 19,99€ ')).toBe(19.99);
    });

    it('resuelve el separador de miles en formato español', () => {
        expect(parsePriceInput('1.234,50')).toBe(1234.5);
    });

    it('resuelve el separador de miles en formato inglés', () => {
        expect(parsePriceInput('1,234.50')).toBe(1234.5);
    });

    it('devuelve undefined si no hay nada que parsear', () => {
        expect(parsePriceInput('')).toBeUndefined();
        expect(parsePriceInput('   ')).toBeUndefined();
        expect(parsePriceInput('abc')).toBeUndefined();
        expect(parsePriceInput('€')).toBeUndefined();
    });

    it('distingue el cero de la ausencia de precio', () => {
        expect(parsePriceInput('0')).toBe(0);
        expect(parsePriceInput('0,00')).toBe(0);
    });

    it('tolera estados intermedios mientras se escribe', () => {
        // El input guarda el texto aparte precisamente por esto
        expect(parsePriceInput('4,')).toBe(4);
        expect(parsePriceInput('4,0')).toBe(4);
    });
});

describe('toPrice', () => {
    it('deja pasar los números tal cual', () => {
        expect(toPrice(19.99)).toBe(19.99);
        expect(toPrice(0)).toBe(0);
    });

    it('normaliza los strings legacy de Firestore', () => {
        expect(toPrice('19,99 €')).toBe(19.99);
        expect(toPrice('50 €')).toBe(50);
    });

    it('descarta valores no numéricos', () => {
        expect(toPrice(undefined)).toBeUndefined();
        expect(toPrice(null)).toBeUndefined();
        expect(toPrice('')).toBeUndefined();
        expect(toPrice({})).toBeUndefined();
        expect(toPrice(NaN)).toBeUndefined();
        expect(toPrice(Infinity)).toBeUndefined();
    });
});

describe('formatPrice', () => {
    // Intl usa espacio duro (U+00A0) antes del símbolo
    const nbsp = ' ';

    it('formatea en euros con coma decimal', () => {
        expect(formatPrice(19.99)).toBe(`19,99${nbsp}€`);
    });

    it('añade los decimales que falten', () => {
        expect(formatPrice(13)).toBe(`13,00${nbsp}€`);
        expect(formatPrice(4.5)).toBe(`4,50${nbsp}€`);
    });

    it('formatea también los strings legacy', () => {
        expect(formatPrice('19,99 €')).toBe(`19,99${nbsp}€`);
    });

    it('devuelve cadena vacía si no hay precio', () => {
        expect(formatPrice(undefined)).toBe('');
        expect(formatPrice('')).toBe('');
    });

    it('formatea el cero como precio, no como vacío', () => {
        expect(formatPrice(0)).toBe(`0,00${nbsp}€`);
    });
});

describe('toPriceInput', () => {
    it('devuelve el valor con coma, listo para el input del admin', () => {
        expect(toPriceInput(19.99)).toBe('19,99');
        expect(toPriceInput(50)).toBe('50');
    });

    it('queda vacío si no hay precio', () => {
        expect(toPriceInput(undefined)).toBe('');
    });
});

describe('viaje de ida y vuelta', () => {
    // Lo que ocurre cada vez que se abre y se guarda un producto en el admin
    it.each([4.99, 50, 13, 0.5, 1234.5, 0])('conserva el valor %s', (precio) => {
        expect(parsePriceInput(toPriceInput(precio))).toBe(precio);
    });
});
