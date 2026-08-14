import { useState, useEffect } from 'react';
import {
    getSidebarConfig,
    getCachedNavItems,
    DEFAULT_SIDEBAR,
    type NavItem,
} from '../services/navService';

/**
 * Entradas del sidebar. Arranca con lo cacheado en localStorage para no pintar
 * un nav vacío, y lo refresca contra Firestore. La lectura la deduplica
 * `getSidebarConfig`, así que montar varias instancias no multiplica peticiones.
 */
export function useNavItems(): NavItem[] {
    const [items, setItems] = useState<NavItem[]>(
        () => getCachedNavItems() ?? [],
    );

    useEffect(() => {
        let cancelled = false;
        getSidebarConfig()
            .then((config) => {
                if (!cancelled) setItems(config.items);
            })
            .catch(() => {
                // Sin red y sin caché: al menos el nav por defecto
                if (!cancelled)
                    setItems((prev) =>
                        prev.length > 0 ? prev : DEFAULT_SIDEBAR.items,
                    );
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return items;
}
