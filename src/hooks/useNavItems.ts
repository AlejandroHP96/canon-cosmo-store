import { useState, useEffect } from 'react';
import { getSidebarConfig, DEFAULT_SIDEBAR, type NavItem } from '../services/navService';

export const NAV_CACHE_KEY = 'canon-cosmo-nav-config';

function getCachedItems(): NavItem[] {
    try {
        const raw = localStorage.getItem(NAV_CACHE_KEY);
        if (raw) return JSON.parse(raw) as NavItem[];
    } catch { /* cache corrupto */ }
    return DEFAULT_SIDEBAR.items;
}

export function useNavItems(): NavItem[] {
    const hasCached = !!localStorage.getItem(NAV_CACHE_KEY);
    const [items, setItems] = useState<NavItem[]>(hasCached ? getCachedItems() : []);

    useEffect(() => {
        getSidebarConfig()
            .then((config) => {
                setItems(config.items);
                localStorage.setItem(NAV_CACHE_KEY, JSON.stringify(config.items));
            })
            .catch(() => {
                if (!hasCached) setItems(DEFAULT_SIDEBAR.items);
            });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return items;
}
