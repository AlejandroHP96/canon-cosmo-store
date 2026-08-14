import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useProductFilter } from './useProductFilter';
import type { Product } from '../types';

const producto = (patch: Partial<Product>): Product => ({
    id: 'x',
    tcg: 'pokemon',
    name: 'Sobre',
    set: 'Base',
    category: 'Sobres',
    ...patch,
});

const catalogo: Product[] = [
    producto({ id: '1', name: 'ETB Pokémon', set: 'Chispas' }),
    producto({ id: '2', name: 'Mazo Digimon', category: 'Mazos' }),
    producto({ id: '3', name: 'Edición Especial', featured: true }),
];

const filtrar = (search: string, categoria = 'Todo') =>
    renderHook(() => useProductFilter(catalogo, categoria, search)).result
        .current;

describe('useProductFilter', () => {
    it('sin búsqueda ni categoría devuelve todo', () => {
        const { visible, hasActiveFilter } = filtrar('');
        expect(visible).toHaveLength(3);
        expect(hasActiveFilter).toBe(false);
    });

    it('encuentra el producto aunque la búsqueda vaya sin tildes', () => {
        expect(filtrar('pokemon').visible.map((p) => p.id)).toEqual(['1']);
        expect(filtrar('edicion').visible.map((p) => p.id)).toEqual(['3']);
    });

    it('encuentra igual buscando con tilde', () => {
        expect(filtrar('Pokémon').visible.map((p) => p.id)).toEqual(['1']);
    });

    it('busca también por set', () => {
        expect(filtrar('chispas').visible.map((p) => p.id)).toEqual(['1']);
    });

    it('separa los destacados del resto de la parrilla', () => {
        const { featuredProducts, gridProducts } = filtrar('');
        expect(featuredProducts.map((p) => p.id)).toEqual(['3']);
        expect(gridProducts.map((p) => p.id)).toEqual(['1', '2']);
    });

    it('combina categoría y búsqueda', () => {
        expect(filtrar('mazo', 'Mazos').visible.map((p) => p.id)).toEqual([
            '2',
        ]);
        expect(filtrar('mazo', 'Sobres').visible).toHaveLength(0);
    });

    it('marca que hay filtro activo con solo la categoría', () => {
        expect(filtrar('', 'Mazos').hasActiveFilter).toBe(true);
    });
});
