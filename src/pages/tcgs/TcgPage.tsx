import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getProductsByTcg } from '../../services/productsService';
import { useTcgCategories } from '../../hooks/useTcgCategories';
import { useTcgOptions } from '../../hooks/useTcgOptions';
import { useProductFilter } from '../../hooks/useProductFilter';
import { pathToSectionId } from '../../lib/tcgUtils';
import SECTION_DESCRIPTIONS from '../../data/sectionDescriptions';
import type { Product } from '../../types';
import TcgHeader from '../../components/tcg/TcgHeader';
import TcgSearch from '../../components/tcg/TcgSearch';
import TcgCategoryFilter from '../../components/tcg/TcgCategoryFilter';
import FeaturedProductCard from '../../components/tcg/FeaturedProductCard';
import FeaturedSection from '../../components/tcg/FeaturedSection';
import ProductGrid from '../../components/tcg/ProductGrid';
import SEO from '../../components/SEO';

const TcgPage = () => {
    const { pathname } = useLocation();
    const sectionId = pathToSectionId(pathname);
    const categories = useTcgCategories(sectionId);
    const tcgOptions = useTcgOptions();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('Todo');
    const [search, setSearch] = useState('');

    const lastSegment = pathname.split('/').filter(Boolean).at(-1) ?? '';
    const sectionLabel =
        tcgOptions.find((o) => o.id === sectionId)?.label ??
        lastSegment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    const seoDescription =
        SECTION_DESCRIPTIONS[sectionId] ??
        `Explora todos los productos de ${sectionLabel} en Cañón Cosmo Store.`;

    useEffect(() => {
        setLoading(true);
        setSelectedCategory('Todo');
        setSearch('');
        getProductsByTcg(sectionId).then((data) => {
            setProducts(data);
            setLoading(false);
        });
    }, [sectionId]);

    const { visible, featuredProducts, gridProducts, hasActiveFilter } =
        useProductFilter(products, selectedCategory, search);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <span className="material-symbols-outlined text-primary text-4xl animate-spin">
                    progress_activity
                </span>
            </div>
        );
    }

    return (
        <>
            <SEO title={sectionLabel} description={seoDescription} path={pathname} />
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
            {featuredProducts.length === 1
                ? <FeaturedProductCard product={featuredProducts[0]} />
                : <FeaturedSection products={featuredProducts} />
            }
            <ProductGrid
                products={gridProducts}
                totalCount={products.length}
                search={search}
                selectedCategory={selectedCategory}
                sectionLabel={sectionLabel}
            />
        </>
    );
};

export default TcgPage;
