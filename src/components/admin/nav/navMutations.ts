import { toSlug } from '../../../lib/tcgUtils';
import type { NavItem, SubNavItem } from '../../../services/navService';

/** Transformaciones puras sobre la lista de entradas del sidebar. */

export const deriveSubPath = (parentLabel: string, subLabel: string) =>
    `/${toSlug(parentLabel)}/${toSlug(subLabel)}`;

const mapItem = (
    items: NavItem[],
    idx: number,
    fn: (item: NavItem) => NavItem,
): NavItem[] => items.map((item, i) => (i === idx ? fn(item) : item));

const move = <T>(list: T[], from: number, to: number): T[] => {
    const next = [...list];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return next;
};

// ── Primer nivel ──────────────────────────────────────────────────────────────

export const addItem = (items: NavItem[], item: NavItem): NavItem[] => [
    ...items,
    item,
];

export const removeItem = (items: NavItem[], idx: number): NavItem[] =>
    items.filter((_, i) => i !== idx);

/** La ruta no se edita: se conserva la original para no desvincular
 *  productos y categorías ya asociados a este path. */
export const updateItem = (
    items: NavItem[],
    idx: number,
    { icon, label }: { icon: string; label: string },
): NavItem[] =>
    mapItem(items, idx, (item) => {
        const next: NavItem = { icon, label, submenu: item.submenu };
        if (item.path) next.path = item.path;
        return next;
    });

export const moveItem = (
    items: NavItem[],
    from: number,
    to: number,
): NavItem[] => move(items, from, to);

// ── Subitems ──────────────────────────────────────────────────────────────────

export const addSub = (
    items: NavItem[],
    itemIdx: number,
    sub: SubNavItem,
): NavItem[] =>
    mapItem(items, itemIdx, (item) => ({
        ...item,
        submenu: [...(item.submenu ?? []), sub],
    }));

export const removeSub = (
    items: NavItem[],
    itemIdx: number,
    subIdx: number,
): NavItem[] =>
    mapItem(items, itemIdx, (item) => ({
        ...item,
        submenu: item.submenu?.filter((_, j) => j !== subIdx),
    }));

/** Igual que updateItem: la ruta se conserva intacta. */
export const updateSub = (
    items: NavItem[],
    itemIdx: number,
    subIdx: number,
    { label, image, color }: { label: string; image: string; color: string },
): NavItem[] =>
    mapItem(items, itemIdx, (item) => ({
        ...item,
        submenu: item.submenu?.map((sub, j) => {
            if (j !== subIdx) return sub;
            const updated: SubNavItem = { label, path: sub.path };
            if (image) updated.image = image;
            if (color) updated.color = color;
            return updated;
        }),
    }));

export const setSubColor = (
    items: NavItem[],
    itemIdx: number,
    subIdx: number,
    color: string,
): NavItem[] =>
    mapItem(items, itemIdx, (item) => ({
        ...item,
        submenu: item.submenu?.map((sub, j) =>
            j === subIdx ? { ...sub, color } : sub,
        ),
    }));

export const moveSub = (
    items: NavItem[],
    itemIdx: number,
    from: number,
    to: number,
): NavItem[] =>
    mapItem(items, itemIdx, (item) => ({
        ...item,
        submenu: move(item.submenu ?? [], from, to),
    }));
