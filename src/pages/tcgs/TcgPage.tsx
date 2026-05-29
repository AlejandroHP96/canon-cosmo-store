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
import FeaturedSection from '../../components/tcg/FeaturedSection';
import ProductGrid from '../../components/tcg/ProductGrid';
import SEO from '../../components/SEO';

const SECTION_DESCRIPTIONS: Record<string, string> = {
    pokemon: 'Compra sobres, ETBs, bundles y colecciones de Pokémon TCG. Siempre con las últimas expansiones.',
    digimon: 'Cajas, sobres y starter decks de Digimon Card Game. Todas las expansiones disponibles.',
    finalfantasy: 'Sobres, mazos y colecciones del Final Fantasy TCG. La tienda de referencia en España.',
    onepiece: 'Sobres, starter decks y sets especiales del One Piece Card Game en español y japonés.',
    naruto: 'Productos del Naruto TCG. Sobres y packs especiales.',
    lorcana: 'Cajas, sobres, decks e Illumineer\'s Troves de Disney Lorcana.',
    magic: 'Sobres, bundles y mazos Commander de Magic: The Gathering.',
    yugioh: 'Sobres, latas y colecciones de Yu-Gi-Oh! TCG.',
    riftbound: 'Sobres, decks y presentaciones de Riftbound, el nuevo TCG de League of Legends.',
    gundam: 'Sobres y starter decks del Gundam Card Game.',
    'dragon-ball': 'Productos del Dragon Ball Super Card Game.',
    starwars: 'Sobres y colecciones del Star Wars TCG.',
    'funko-pop': 'Amplio catálogo de Funko Pop: llaveros, deluxe, minis y más.',
    'videojuegos__consolas': 'Consolas y hardware de videojuegos.',
    'videojuegos__videojuegos': 'Videojuegos para Nintendo Switch, PlayStation y más.',
    'videojuegos__accesorios': 'Accesorios y periféricos para videojuegos.',
    'accesorios-tcgs__fundas': 'Fundas Dragon Shield, Ultra Pro y más para proteger tus cartas.',
    'accesorios-tcgs__carpetas': 'Álbumes y carpetas para guardar y exhibir tu colección de cartas.',
    'accesorios-tcgs__tapetes': 'Tapetes de juego para TCG de todas las temáticas.',
    'accesorios-tcgs__deck-box': 'Deck boxes Ultra Guard, Gamegenic, Dragon Shield y más.',
    'accesorios-tcgs__varios': 'Dados, contadores, soportes y otros accesorios para TCG.',
    'varios__mangas': 'Mangas, cómics y libros de tus series favoritas.',
    'varios__figuras': 'Figuras de colección: Bring Arts, Play Arts Kai, Figuarts y más.',
    'varios__juegos-de-mesa': 'Juegos de mesa y party games para toda la familia.',
    'varios__merchandising': 'Merchandising oficial: llaveros, puzzles, peluches y más.',
    'varios__musica': 'Bandas sonoras, vinilos y CDs de videojuegos y anime.',
};

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

    const seoDescription = SECTION_DESCRIPTIONS[sectionId] ??
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
