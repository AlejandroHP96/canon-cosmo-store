import { describe, it, expect } from 'vitest';
import type { NavItem } from '../../../services/navService';
import type { Product } from '../../../types';
import {
    availableCategories,
    filterProducts,
    matchesSection,
    menuSectionIds,
    type SectionFilter,
} from './productQuery';

const product = (patch: Partial<Product>): Product => ({
    id: 'x',
    tcg: 'pokemon',
    name: 'Sobre',
    set: 'Base',
    category: 'Sobres',
    ...patch,
});

const catalogo: Product[] = [
    product({
        id: '1',
        tcg: 'pokemon',
        name: 'Sobre Pokemon',
        category: 'Sobres',
    }),
    product({
        id: '2',
        tcg: 'pokemon',
        name: 'ETB Pokemon',
        category: 'Cajas',
    }),
    product({
        id: '3',
        tcg: 'digimon',
        name: 'Mazo Digimon',
        category: 'Mazos',
        reservable: true,
    }),
    product({
        id: '4',
        tcg: 'funko-pop',
        name: 'Funko Goku',
        category: '',
        set: 'Anime',
    }),
];

describe('menuSectionIds', () => {
    it('devuelve las secciones de los subitems si el menú tiene submenú', () => {
        const menu: NavItem = {
            icon: 'x',
            label: 'TCGs',
            submenu: [
                { label: 'Pokemon', path: '/tcgs/pokemon' },
                { label: 'One Piece', path: '/tcgs/one-piece' },
            ],
        };
        expect(menuSectionIds(menu)).toEqual(['pokemon', 'onepiece']);
    });

    it('usa el path si la entrada no tiene submenú', () => {
        expect(
            menuSectionIds({
                icon: 'x',
                label: 'Funko Pop',
                path: '/funko-pop',
            }),
        ).toEqual(['funko-pop']);
    });

    it('cae al slug del label si no hay path ni submenú', () => {
        expect(menuSectionIds({ icon: 'x', label: 'Accesorios TCGs' })).toEqual(
            ['accesorios-tcgs'],
        );
    });

    it('devuelve vacío si no hay menú', () => {
        expect(menuSectionIds(null)).toEqual([]);
    });
});

describe('matchesSection', () => {
    it('deja pasar todo si no hay menú seleccionado', () => {
        expect(matchesSection(product({ tcg: 'lo-que-sea' }), null)).toBe(true);
    });

    it("con 'all' acepta cualquier sección del menú", () => {
        const section: SectionFilter = {
            menuSectionIds: ['pokemon', 'digimon'],
            sectionId: 'all',
        };
        expect(matchesSection(product({ tcg: 'pokemon' }), section)).toBe(true);
        expect(matchesSection(product({ tcg: 'digimon' }), section)).toBe(true);
        expect(matchesSection(product({ tcg: 'funko-pop' }), section)).toBe(
            false,
        );
    });

    it('con una sección concreta ignora el resto del menú', () => {
        const section: SectionFilter = {
            menuSectionIds: ['pokemon', 'digimon'],
            sectionId: 'digimon',
        };
        expect(matchesSection(product({ tcg: 'digimon' }), section)).toBe(true);
        expect(matchesSection(product({ tcg: 'pokemon' }), section)).toBe(
            false,
        );
    });
});

describe('filterProducts', () => {
    const query = (patch = {}) => ({
        section: null,
        search: '',
        reservableOnly: false,
        category: null,
        ...patch,
    });

    it('sin filtros devuelve todo', () => {
        expect(filterProducts(catalogo, query())).toHaveLength(4);
    });

    it('busca por nombre sin distinguir mayúsculas', () => {
        expect(
            filterProducts(catalogo, query({ search: 'GOKU' })).map(
                (p) => p.id,
            ),
        ).toEqual(['4']);
    });

    it('busca también por set y por categoría', () => {
        expect(
            filterProducts(catalogo, query({ search: 'anime' })).map(
                (p) => p.id,
            ),
        ).toEqual(['4']);
        expect(
            filterProducts(catalogo, query({ search: 'mazos' })).map(
                (p) => p.id,
            ),
        ).toEqual(['3']);
    });

    it('ignora los espacios sobrantes de la búsqueda', () => {
        expect(
            filterProducts(catalogo, query({ search: '  goku  ' })),
        ).toHaveLength(1);
    });

    it('filtra por reservables', () => {
        expect(
            filterProducts(catalogo, query({ reservableOnly: true })).map(
                (p) => p.id,
            ),
        ).toEqual(['3']);
    });

    it('filtra por categoría exacta', () => {
        expect(
            filterProducts(catalogo, query({ category: 'Cajas' })).map(
                (p) => p.id,
            ),
        ).toEqual(['2']);
    });

    it('combina los filtros', () => {
        const out = filterProducts(
            catalogo,
            query({
                section: {
                    menuSectionIds: ['pokemon', 'digimon'],
                    sectionId: 'all',
                },
                search: 'o',
                category: 'Sobres',
            }),
        );
        expect(out.map((p) => p.id)).toEqual(['1']);
    });
});

describe('availableCategories', () => {
    it('devuelve las categorías únicas y ordenadas', () => {
        expect(availableCategories(catalogo, null)).toEqual([
            'Cajas',
            'Mazos',
            'Sobres',
        ]);
    });

    it('descarta las vacías', () => {
        expect(availableCategories(catalogo, null)).not.toContain('');
    });

    it('se limita a la sección elegida', () => {
        const section: SectionFilter = {
            menuSectionIds: ['pokemon'],
            sectionId: 'all',
        };
        expect(availableCategories(catalogo, section)).toEqual([
            'Cajas',
            'Sobres',
        ]);
    });
});
