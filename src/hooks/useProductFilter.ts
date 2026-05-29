import { useMemo } from 'react';
import type { Product } from '../types';

export function useProductFilter(products: Product[], selectedCategory: string, search: string) {
    return useMemo(() => {
        const needle = search.trim().toLowerCase();
        const visible = products.filter((p) => {
            const matchCat = selectedCategory === 'Todo' || p.category === selectedCategory;
            const matchSearch = !needle ||
                p.name.toLowerCase().includes(needle) ||
                p.set?.toLowerCase().includes(needle);
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
