import { describe, it, expect } from 'vitest';
import {
    MAX_CANTIDAD,
    MIN_CANTIDAD,
    normalizeCantidad,
    sanitizeCantidadInput,
} from './reservaForm';

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
