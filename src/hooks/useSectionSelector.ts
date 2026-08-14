import { useEffect, useState } from 'react';
import {
    getSidebarConfig,
    type NavItem,
    type SubNavItem,
} from '../services/navService';
import { pathToSectionId, toSlug } from '../lib/tcgUtils';

/** ID de sección Firestore que corresponde a una entrada del sidebar. */
const sectionIdOf = (menu: NavItem, sub?: SubNavItem): string => {
    if (sub) return pathToSectionId(sub.path);
    if (menu.path) return pathToSectionId(menu.path);
    return toSlug(menu.label);
};

/** Localiza en qué menú/submenú vive un sectionId ya guardado. */
function findIndices(items: NavItem[], sectionId: string): [number, number] {
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.path && pathToSectionId(item.path) === sectionId)
            return [i, 0];
        if (
            !item.path &&
            !item.submenu?.length &&
            toSlug(item.label) === sectionId
        )
            return [i, 0];
        for (let j = 0; j < (item.submenu?.length ?? 0); j++) {
            if (pathToSectionId(item.submenu![j].path) === sectionId)
                return [i, j];
        }
    }
    return [0, 0];
}

/**
 * Selector de sección del catálogo para el formulario de producto.
 * El sectionId se deriva del menú seleccionado en cada render — no se guarda
 * en estado, así no hace falta sincronizarlo con un efecto.
 */
export function useSectionSelector(initialSectionId: string) {
    const [navItems, setNavItems] = useState<NavItem[]>([]);
    const [menuIdx, setMenuIdx] = useState(0);
    const [subIdx, setSubIdx] = useState(0);
    const [navReady, setNavReady] = useState(false);

    useEffect(() => {
        getSidebarConfig()
            .then((cfg) => {
                const [m, s] = findIndices(cfg.items, initialSectionId);
                setNavItems(cfg.items);
                setMenuIdx(m);
                setSubIdx(s);
            })
            // navReady igualmente: si no, el selector se queda deshabilitado
            // para siempre y el formulario no se puede usar
            .finally(() => setNavReady(true));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const menu = navItems[menuIdx];
    const subOptions = menu?.submenu ?? [];
    const activeSub =
        subOptions.length > 0
            ? subOptions[Math.min(subIdx, subOptions.length - 1)]
            : undefined;
    const sectionId = menu ? sectionIdOf(menu, activeSub) : initialSectionId;

    const selectMenu = (idx: number) => {
        setMenuIdx(idx);
        setSubIdx(0);
    };

    return {
        navItems,
        navReady,
        menuIdx,
        subIdx,
        subOptions,
        sectionId,
        selectMenu,
        setSubIdx,
    };
}
