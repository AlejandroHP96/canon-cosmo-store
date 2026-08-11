import { describe, it, expect } from 'vitest';
import {
    MAX_CANTIDAD,
    MIN_CANTIDAD,
    NOMBRE_COMPLETO_PATTERN,
    esNombreCompleto,
    normalizeCantidad,
    sanitizeCantidadInput,
} from './reservaForm';

/** Lo que hace el navegador con el atributo pattern: anclado y sin recortar. */
const patternAcepta = (valor: string) =>
    new RegExp(`^(?:${NOMBRE_COMPLETO_PATTERN})$`, 'u').test(valor);

describe('nombre completo', () => {
    it('acepta cualquier número de palabras a partir de dos', () => {
        expect(esNombreCompleto('Alejandro Herrera')).toBe(true);
        expect(esNombreCompleto('Jose Alejandro Herrera Pestana')).toBe(true);
        expect(esNombreCompleto('Maria del Carmen Ruiz de la Fuente')).toBe(true);
    });

    it('exige al menos un apellido', () => {
        expect(esNombreCompleto('Alejandro')).toBe(false);
        expect(esNombreCompleto('')).toBe(false);
        expect(esNombreCompleto('   ')).toBe(false);
    });

    it('no se cae por los espacios que deja el teclado del móvil', () => {
        expect(esNombreCompleto('Jose Alejandro Herrera Pestana ')).toBe(true);
        expect(esNombreCompleto(' Alejandro Herrera')).toBe(true);
        expect(esNombreCompleto('  Alejandro Herrera  ')).toBe(true);
    });

    it('el pattern del input tolera esos mismos espacios', () => {
        // Antes esto lo rechazaba el navegador antes siquiera de enviar
        expect(patternAcepta('Jose Alejandro Herrera Pestana ')).toBe(true);
        expect(patternAcepta(' Alejandro Herrera')).toBe(true);
        expect(patternAcepta('Alejandro Herrera')).toBe(true);
    });

    it('el pattern sigue rechazando una sola palabra', () => {
        expect(patternAcepta('Alejandro')).toBe(false);
        expect(patternAcepta('  Alejandro  ')).toBe(false);
    });
});

describe('sanitizeCantidadInput', () => {
    it('deja escribir cualquier cifra dentro del tope', () => {
        expect(sanitizeCantidadInput('7')).toBe('7');
        expect(sanitizeCantidadInput('42')).toBe('42');
        expect(sanitizeCantidadInput('100')).toBe('100');
    });

    it('permite vaciar el campo para volver a teclear', () => {
        expect(sanitizeCantidadInput('')).toBe('');
    });

    it('descarta lo que no sean dígitos', () => {
        expect(sanitizeCantidadInput('1e5')).toBe('15');
        expect(sanitizeCantidadInput('-3')).toBe('3');
        expect(sanitizeCantidadInput('2,5')).toBe('25');
        expect(sanitizeCantidadInput('abc')).toBe('');
    });

    it('no admite más cifras de las que caben en el tope', () => {
        expect(sanitizeCantidadInput('1234')).toBe('123');
    });
});

describe('normalizeCantidad', () => {
    it('respeta lo que ya está dentro del rango', () => {
        expect(normalizeCantidad('1')).toBe(1);
        expect(normalizeCantidad('37')).toBe(37);
        expect(normalizeCantidad('100')).toBe(100);
    });

    it('recorta al tope lo que se pasa', () => {
        expect(normalizeCantidad('101')).toBe(MAX_CANTIDAD);
        expect(normalizeCantidad('999')).toBe(MAX_CANTIDAD);
    });

    it('vuelve al mínimo con campo vacío o inválido', () => {
        expect(normalizeCantidad('')).toBe(MIN_CANTIDAD);
        expect(normalizeCantidad('abc')).toBe(MIN_CANTIDAD);
        expect(normalizeCantidad('0')).toBe(MIN_CANTIDAD);
    });
});
