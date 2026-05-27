import { useState, useEffect } from 'react';
import {
    getCategoriesByTcg,
    CATEGORY_ICON,
    DEFAULT_CAT_ICON,
} from '../services/categoriesService';
import type { TcgId, Category } from '../types';

/**
 * Carga las categorías de un TCG desde Firestore y las devuelve como Category[].
 * Incluye siempre "Todo" como primer elemento.
 */
export function useTcgCategories(tcg: TcgId): Category[] {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        setCategories([]);
        getCategoriesByTcg(tcg).then((names) => {
            setCategories(
                names.map((label) => ({
                    label,
                    icon: CATEGORY_ICON[label] ?? DEFAULT_CAT_ICON,
                })),
            );
        });
    }, [tcg]);

    return [{ label: 'Todo', icon: 'grid_view' }, ...categories];
}
