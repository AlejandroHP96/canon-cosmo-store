import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import TcgPage from './TcgPage';
import { getSidebarConfig, getCachedNavItems } from '../../services/navService';
import { getProductsByTcg } from '../../services/productsService';
import { getCategoriesByTcg } from '../../services/categoriesService';
import type { Product } from '../../types';

vi.mock('../../services/navService', async (importOriginal) => {
    // DEFAULT_SIDEBAR se usa como fallback y no interesa doblarlo
    const real =
        await importOriginal<typeof import('../../services/navService')>();
    return {
        ...real,
        getSidebarConfig: vi.fn(),
        getCachedNavItems: vi.fn(),
    };
});
vi.mock('../../services/productsService', () => ({
    getProductsByTcg: vi.fn(),
}));
vi.mock('../../services/categoriesService', () => ({
    getCategoriesByTcg: vi.fn(),
    CATEGORY_ICON: {},
    DEFAULT_CAT_ICON: 'category',
}));

const SIDEBAR = {
    items: [
        {
            icon: 'playing_cards',
            label: 'TCGs',
            submenu: [{ label: 'Pokemon', path: '/tcgs/pokemon' }],
        },
        { icon: 'toys', label: 'Funko Pop', path: '/funko-pop' },
    ],
};

const PRODUCTO: Product = {
    id: 'p1',
    tcg: 'pokemon',
    name: 'Caja Destinos Paldeanos',
    set: 'Escarlata y Púrpura',
    category: 'Cajas',
};

const renderRuta = (ruta: string) =>
    render(
        <HelmetProvider>
            <MemoryRouter initialEntries={[ruta]}>
                <Routes>
                    <Route path="*" element={<TcgPage />} />
                </Routes>
            </MemoryRouter>
        </HelmetProvider>,
    );

describe('<TcgPage />', () => {
    beforeEach(() => {
        vi.mocked(getCachedNavItems).mockReturnValue(SIDEBAR.items);
        vi.mocked(getSidebarConfig).mockResolvedValue(SIDEBAR);
        vi.mocked(getProductsByTcg).mockResolvedValue([PRODUCTO]);
        vi.mocked(getCategoriesByTcg).mockResolvedValue(['Cajas']);
    });

    it('pinta la sección cuando la ruta existe en el nav', async () => {
        renderRuta('/tcgs/pokemon');
        expect(await screen.findByText(PRODUCTO.name)).toBeInTheDocument();
        expect(getProductsByTcg).toHaveBeenCalledWith('pokemon');
    });

    it('resuelve también las entradas de primer nivel', async () => {
        vi.mocked(getProductsByTcg).mockResolvedValue([]);
        renderRuta('/funko-pop');
        await screen.findByRole('heading', { name: /funko pop/i });
        expect(getProductsByTcg).toHaveBeenCalledWith('funko-pop');
    });

    // Sin esta comprobación cualquier URL inventada pintaba una sección vacía
    // con estado 200, que Google puede indexar como si existiera de verdad
    it('devuelve 404 para una ruta que no está en el nav', async () => {
        renderRuta('/seccion-que-no-existe');
        expect(await screen.findByText('404')).toBeInTheDocument();
        expect(getProductsByTcg).not.toHaveBeenCalled();
    });

    it('no decide nada mientras el nav no ha cargado', () => {
        vi.mocked(getCachedNavItems).mockReturnValue(null);
        vi.mocked(getSidebarConfig).mockReturnValue(new Promise(() => {}));
        renderRuta('/tcgs/pokemon');

        expect(screen.queryByText('404')).not.toBeInTheDocument();
        expect(getProductsByTcg).not.toHaveBeenCalled();
    });

    it('no deja el spinner girando si el catálogo falla', async () => {
        vi.mocked(getProductsByTcg).mockRejectedValue(new Error('sin red'));
        renderRuta('/tcgs/pokemon');

        expect(await screen.findByRole('alert')).toBeInTheDocument();
    });
});
