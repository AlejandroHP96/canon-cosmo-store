import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getProductsByTcg } from '../../services/productsService';
import { useTcgCategories } from '../../hooks/useTcgCategories';
import { useTcgOptions } from '../../hooks/useTcgOptions';
import { pathToSectionId } from '../../lib/tcgUtils';
import type { Product } from '../../types';
import TcgHeader from '../../components/tcg/TcgHeader';
import TcgSearch from '../../components/tcg/TcgSearch';
import TcgCategoryFilter from '../../components/tcg/TcgCategoryFilter';
import FeaturedProductCard from '../../components/tcg/FeaturedProductCard';
import ProductGrid from '../../components/tcg/ProductGrid';

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

    useEffect(() => {
        setLoading(true);
        setSelectedCategory('Todo');
        setSearch('');
        getProductsByTcg(sectionId).then((data) => {
            setProducts(data);
            setLoading(false);
        });
    }, [sectionId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <span className="material-symbols-outlined text-primary text-4xl animate-spin">
                    progress_activity
                </span>
            </div>
        );
    }

    const needle = search.trim().toLowerCase();
    const visible = products.filter((p) => {
        const matchCat = selectedCategory === 'Todo' || p.category === selectedCategory;
        const matchSearch = !needle ||
            p.name.toLowerCase().includes(needle) ||
            p.set?.toLowerCase().includes(needle);
        return matchCat && matchSearch;
    });

    const featuredProducts = visible.filter((p) => p.featured);
    const gridProducts = visible.filter((p) => !p.featured);
    const hasActiveFilter = !!needle || selectedCategory !== 'Todo';

    return (
        <>
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
            {featuredProducts.map((product) => (
                <FeaturedProductCard key={product.id} product={product} />
            ))}
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
