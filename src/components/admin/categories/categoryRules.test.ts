import { describe, it, expect } from 'vitest';
import {
    anadirCategoria,
    quitarCategoria,
    renombrarCategoria,
    validarNombre,
} from './categoryRules';

const categorias = ['Sobres', 'Cajas', 'Mazos'];

describe('validarNombre', () => {
    it('acepta un nombre nuevo', () => {
        expect(validarNombre(categorias, 'Fundas')).toBeNull();
    });

    it('rechaza el vacío', () => {
        expect(validarNombre(categorias, '')).toBe('El nombre no puede estar vacío.');
        expect(validarNombre(categorias, '   ')).toBe('El nombre no puede estar vacío.');
    });

    it('rechaza duplicados', () => {
        expect(validarNombre(categorias, 'Cajas')).toBe('"Cajas" ya existe en la lista.');
    });

    it('detecta el duplicado aunque venga con espacios', () => {
        expect(validarNombre(categorias, '  Cajas  ')).toBe('"Cajas" ya existe en la lista.');
    });

    it('al renombrar, no choca consigo mismo', () => {
        expect(validarNombre(categorias, 'Cajas', 'Cajas')).toBeNull();
    });

    it('al renombrar, sigue chocando con las demás', () => {
        expect(validarNombre(categorias, 'Sobres', 'Cajas')).toBe('"Sobres" ya existe en la lista.');
    });
});

describe('mutaciones', () => {
    it('anadirCategoria añade al final y recorta espacios', () => {
        expect(anadirCategoria(categorias, '  Fundas ')).toEqual([...categorias, 'Fundas']);
    });

    it('quitarCategoria elimina solo esa', () => {
        expect(quitarCategoria(categorias, 'Cajas')).toEqual(['Sobres', 'Mazos']);
    });

    it('renombrarCategoria conserva la posición', () => {
        expect(renombrarCategoria(categorias, 'Cajas', 'Cajas grandes')).toEqual([
            'Sobres',
            'Cajas grandes',
            'Mazos',
        ]);
    });

    it('ninguna muta la lista original', () => {
        const original = [...categorias];
        anadirCategoria(categorias, 'x');
        quitarCategoria(categorias, 'Cajas');
        renombrarCategoria(categorias, 'Cajas', 'y');
        expect(categorias).toEqual(original);
    });
});
