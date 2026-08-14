import { describe, it, expect } from 'vitest';
import type { Product } from '../../types';
import { filtrarReservables, seccionesDisponibles } from './reservaQuery';

const producto = (patch: Partial<Product>): Product => ({
    id: 'x',
    tcg: 'pokemon',
    name: 'Sobre',
    set: 'Base',
    category: 'Sobres',
    ...patch,
});

const reservables: Product[] = [
    producto({ id: '1', tcg: 'pokemon', name: 'ETB Pokemon', set: 'Chispas' }),
    producto({ id: '2', tcg: 'digimon', name: 'Mazo Digimon', set: 'ST 24' }),
    producto({ id: '3', tcg: 'pokemon', name: 'Bundle Pokemon', set: '' }),
];

describe('seccionesDisponibles', () => {
    it('devuelve las secciones únicas y ordenadas', () => {
        expect(seccionesDisponibles(reservables)).toEqual([
            'digimon',
            'pokemon',
        ]);
    });

    it('devuelve vacío sin productos', () => {
        expect(seccionesDisponibles([])).toEqual([]);
    });
});

describe('filtrarReservables', () => {
    it('sin filtros devuelve todo', () => {
        expect(filtrarReservables(reservables, '', null)).toHaveLength(3);
    });

    it('filtra por sección', () => {
        expect(
            filtrarReservables(reservables, '', 'pokemon').map((p) => p.id),
        ).toEqual(['1', '3']);
    });

    it('busca por nombre, set o sección', () => {
        expect(
            filtrarReservables(reservables, 'bundle', null).map((p) => p.id),
        ).toEqual(['3']);
        expect(
            filtrarReservables(reservables, 'st 24', null).map((p) => p.id),
        ).toEqual(['2']);
        expect(
            filtrarReservables(reservables, 'digimon', null).map((p) => p.id),
        ).toEqual(['2']);
    });

    it('no distingue mayúsculas ni espacios sobrantes', () => {
        expect(
            filtrarReservables(reservables, '  CHISPAS ', null).map(
                (p) => p.id,
            ),
        ).toEqual(['1']);
    });

    it('combina sección y búsqueda', () => {
        expect(
            filtrarReservables(reservables, 'pokemon', 'digimon'),
        ).toHaveLength(0);
    });

    it('no falla con productos sin set', () => {
        expect(() => filtrarReservables(reservables, 'x', null)).not.toThrow();
    });
});
