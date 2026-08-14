import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { getProductsByTcg } from '../../services/productsService';
import { useTcgCategories } from '../../hooks/useTcgCategories';
import { useTcgOptions } from '../../hooks/useTcgOptions';
import { useProductFilter } from '../../hooks/useProductFilter';
import { pathToSectionId, toSlug } from '../../lib/tcgUtils';
import { useNavItems } from '../../hooks/useNavItems';
import type { NavItem } from '../../services/navService';
import NotFound from '../NotFound';
import SECTION_DESCRIPTIONS from '../../data/sectionDescriptions';
import type { Product } from '../../types';
import TcgHeader from '../../components/tcg/TcgHeader';
import TcgSearch from '../../components/tcg/TcgSearch';
import TcgCategoryFilter from '../../components/tcg/TcgCategoryFilter';
import FeaturedProductCard from '../../components/tcg/FeaturedProductCard';
import FeaturedSection from '../../components/tcg/FeaturedSection';
import ProductGrid from '../../components/tcg/ProductGrid';
import ProductModal from '../../components/tcg/ProductModal';
import SEO from '../../components/SEO';
import Spinner from '../../components/Spinner';

/** Todas las secciones que el sidebar declara, de primer nivel y de submenú. */
function sectionIdsFromNav(items: NavItem[]): Set<string> {
    const ids = new Set<string>();
    for (const item of items) {
        if (item.submenu?.length) {
            item.submenu.forEach((sub) => ids.add(pathToSectionId(sub.path)));
        } else if (item.path) {
            ids.add(pathToSectionId(item.path));
        } else {
            ids.add(toSlug(item.label));
        }
    }
    return ids;
}

const TcgSection = ({
    sectionId,
    pathname,
}: {
    sectionId: string;
    pathname: string;
}) => {
    const { t } = useTranslation();
    const categories = useTcgCategories(sectionId);
    const tcgOptions = useTcgOptions();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Todo');
    const [search, setSearch] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        null,
    );

    const lastSegment = pathname.split('/').filter(Boolean).at(-1) ?? '';
    const sectionLabel =
        tcgOptions.find((o) => o.id === sectionId)?.label ??
        lastSegment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    const seoDescription =
        SECTION_DESCRIPTIONS[sectionId] ??
        `Explora todos los productos de ${sectionLabel} en Cañón Cosmo Store.`;

    useEffect(() => {
        let cancelled = false;
        getProductsByTcg(sectionId)
            .then((data) => {
                if (!cancelled) setProducts(data);
            })
            .catch(() => {
                // Sin esto el spinner se quedaba girando para siempre
                if (!cancelled) setError(true);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [sectionId]);

    const { visible, featuredProducts, gridProducts, hasActiveFilter } =
        useProductFilter(products, selectedCategory, search);

    if (loading) return <Spinner size="lg" className="h-64" />;

    if (error) {
        return (
            <div
                role="alert"
                className="tactical-frame p-8 text-center text-on-surface-variant font-body text-sm">
                {t('errors.loadSection')}
            </div>
        );
    }

    return (
        <>
            <SEO
                title={sectionLabel}
                description={seoDescription}
                path={pathname}
            />
            <TcgHeader
                sectionLabel={sectionLabel}
                total={products.length}
                filtered={visible.length}
                hasActiveFilter={hasActiveFilter}
            />
            <TcgSearch value={search} onChange={setSearch} />
            <TcgCategoryFilter
                categories={categories}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
            />
            {featuredProducts.length === 1 ? (
                <FeaturedProductCard
                    product={featuredProducts[0]}
                    onSelect={setSelectedProduct}
                />
            ) : (
                <FeaturedSection
                    products={featuredProducts}
                    onSelect={setSelectedProduct}
                />
            )}
            <ProductGrid
                products={gridProducts}
                totalCount={products.length}
                search={search}
                selectedCategory={selectedCategory}
                sectionLabel={sectionLabel}
                onSelect={setSelectedProduct}
            />
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </>
    );
};

/**
 * Página dinámica de sección (catch-all). La `key` hace que al cambiar de
 * sección el contenido se remonte: los filtros, la búsqueda y el estado de
 * carga vuelven solos a su valor inicial, sin resetearlos desde un efecto.
 *
 * Antes de renderizar comprueba que la ruta corresponde a una entrada real
 * del sidebar. Si no, es un 404: sin esto cualquier URL inventada mostraba
 * una sección vacía, que Google puede indexar como si existiera.
 */
const TcgPage = () => {
    const { pathname } = useLocation();
    const navItems = useNavItems();
    const sectionId = pathToSectionId(pathname);

    // El nav aún no ha cargado: no se puede decidir si la ruta es válida
    if (navItems.length === 0) return <Spinner size="lg" className="h-64" />;

    if (!sectionIdsFromNav(navItems).has(sectionId)) return <NotFound />;

    return (
        <TcgSection key={sectionId} sectionId={sectionId} pathname={pathname} />
    );
};

export default TcgPage;
