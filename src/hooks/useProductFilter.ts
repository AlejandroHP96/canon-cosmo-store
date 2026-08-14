import { useMemo } from 'react';
import type { Product } from '../types';
import { normalizarBusqueda } from '../lib/text';

export function useProductFilter(
    products: Product[],
    selectedCategory: string,
    search: string,
) {
    return useMemo(() => {
        const needle = normalizarBusqueda(search.trim());
        const visible = products.filter((p) => {
            const matchCat =
                selectedCategory === 'Todo' || p.category === selectedCategory;
            const matchSearch =
                !needle ||
                normalizarBusqueda(p.name).includes(needle) ||
                normalizarBusqueda(p.set ?? '').includes(needle);
            return matchCat && matchSearch;
        });
        return {
            visible,
            featuredProducts: visible.filter((p) => p.featured),
            gridProducts: visible.filter((p) => !p.featured),
            hasActiveFilter: !!needle || selectedCategory !== 'Todo',
        };
    }, [products, selectedCategory, search]);
}
