import { describe, it, expect } from 'vitest';
import { normalizarBusqueda } from './text';

describe('normalizarBusqueda', () => {
    it('quita las tildes', () => {
        expect(normalizarBusqueda('Fabián')).toBe('fabian');
        expect(normalizarBusqueda('Ana Pérez')).toBe('ana perez');
        expect(normalizarBusqueda('Jesús Muñóz')).toBe('jesus munoz');
    });

    it('pasa a minúsculas', () => {
        expect(normalizarBusqueda('FABIAN')).toBe('fabian');
    });

    it('deja igual lo que ya está normalizado', () => {
        expect(normalizarBusqueda('fabian')).toBe('fabian');
    });

    // Consecuencia asumida: buscar es más útil así, aunque "año" y "ano"
    // acaben coincidiendo
    it('convierte la eñe en ene', () => {
        expect(normalizarBusqueda('Cañón')).toBe('canon');
    });

    it('no toca los espacios ni la puntuación', () => {
        expect(normalizarBusqueda('  José  López ')).toBe('  jose  lopez ');
        expect(normalizarBusqueda('a@b.com')).toBe('a@b.com');
    });

    it('aguanta la cadena vacía', () => {
        expect(normalizarBusqueda('')).toBe('');
    });

    // El mismo nombre puede llegar precompuesto (á) o descompuesto (a + ´)
    // según de dónde se copie y pegue; los dos deben dar lo mismo
    it('trata igual el texto precompuesto y el descompuesto', () => {
        const precompuesto = 'Fabi\u00e1n'; // á como un solo carácter
        const descompuesto = 'Fabia\u0301n'; // a + acento suelto
        expect(precompuesto).not.toBe(descompuesto);
        expect(normalizarBusqueda(precompuesto)).toBe(
            normalizarBusqueda(descompuesto),
        );
    });
});
