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
    // El TCG se guarda junto a sus categorías: así al cambiar de sección se
    // descartan las anteriores sin necesidad de vaciarlas desde el efecto.
    const [loaded, setLoaded] = useState<{ tcg: TcgId; categories: Category[] } | null>(null);

    useEffect(() => {
        let cancelled = false;
        getCategoriesByTcg(tcg).then((names) => {
            if (cancelled) return;
            setLoaded({
                tcg,
                categories: names.map((label) => ({
                    label,
                    icon: CATEGORY_ICON[label] ?? DEFAULT_CAT_ICON,
                })),
            });
        });
        // Evita que una respuesta lenta de la sección anterior pise a la nueva
        return () => {
            cancelled = true;
        };
    }, [tcg]);

    const categories = loaded?.tcg === tcg ? loaded.categories : [];
    return [{ label: 'Todo', icon: 'grid_view' }, ...categories];
}
