import { pathToSectionId, toSlug } from '../../../lib/tcgUtils';
import type { NavItem } from '../../../services/navService';
import type { Product } from '../../../types';

/** Filtro de sección activo. `null` = no hay ningún menú seleccionado. */
export type SectionFilter = {
    /** Secciones que cuelgan del menú elegido */
    menuSectionIds: string[];
    /** Sección concreta, o 'all' para todas las del menú */
    sectionId: string;
} | null;

export type ProductQuery = {
    section: SectionFilter;
    search: string;
    reservableOnly: boolean;
    category: string | null;
};

/** Secciones de Firestore que representa una entrada del sidebar. */
export function menuSectionIds(menu: NavItem | null): string[] {
    if (!menu) return [];
    if ((menu.submenu?.length ?? 0) > 0)
        return menu.submenu!.map((sub) => pathToSectionId(sub.path));
    if (menu.path) return [pathToSectionId(menu.path)];
    return [toSlug(menu.label)];
}

export function matchesSection(
    product: Product,
    section: SectionFilter,
): boolean {
    if (section === null) return true;
    if (section.sectionId !== 'all') return product.tcg === section.sectionId;
    return section.menuSectionIds.includes(product.tcg);
}

function matchesSearch(product: Product, needle: string): boolean {
    if (!needle) return true;
    return (
        product.name.toLowerCase().includes(needle) ||
        (product.set?.toLowerCase().includes(needle) ?? false) ||
        (product.category?.toLowerCase().includes(needle) ?? false)
    );
}

export function filterProducts(
    products: Product[],
    query: ProductQuery,
): Product[] {
    const needle = query.search.trim().toLowerCase();
    return products.filter(
        (p) =>
            matchesSection(p, query.section) &&
            matchesSearch(p, needle) &&
            (!query.reservableOnly || p.reservable === true) &&
            (!query.category || p.category === query.category),
    );
}

/** Categorías presentes en la sección elegida, para los chips de filtro. */
export function availableCategories(
    products: Product[],
    section: SectionFilter,
): string[] {
    const cats = products
        .filter((p) => matchesSection(p, section))
        .map((p) => p.category)
        .filter(Boolean);
    return [...new Set(cats)].sort();
}
