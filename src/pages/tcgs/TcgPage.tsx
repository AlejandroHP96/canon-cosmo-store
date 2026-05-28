import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductImage from '../../components/ProductImage';
import { getProductsByTcg } from '../../services/productsService';
import { useTcgCategories } from '../../hooks/useTcgCategories';
import { useTcgOptions } from '../../hooks/useTcgOptions';
import { pathToSectionId } from '../../lib/tcgUtils';
import type { Product } from '../../types';

const TcgPage = () => {
    const { pathname } = useLocation();

    // Convierte el pathname al ID de sección en Firestore
    // (ej. '/tcgs/final-fantasy' → 'finalfantasy', '/accesorios-tcgs' → 'accesorios-tcgs')
    const sectionId = pathToSectionId(pathname);

    const categories = useTcgCategories(sectionId);
    const tcgOptions = useTcgOptions();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('Todo');
    const [search, setSearch] = useState('');

    // Nombre legible desde el nav config, o se formatea el último segmento del path
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

    return (
        <>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <div className="tactical-frame px-4 py-2 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-2xl">
                        playing_cards
                    </span>
                    <div>
                        <h2 className="font-headline font-bold text-xl text-on-surface uppercase tracking-widest">
                            {sectionLabel}
                        </h2>
                    </div>
                </div>
                <div className="ml-auto flex items-center gap-2 text-[10px] font-headline text-on-surface-variant uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 bg-primary animate-ping" />
                    {needle || selectedCategory !== 'Todo'
                        ? `${visible.length} / ${products.length}`
                        : products.length}{' '}
                    producto{products.length !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Buscador */}
            <div className="flex items-center border border-outline-variant bg-surface-container-lowest mb-4 focus-within:border-primary transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant text-base px-3 shrink-0">
                    search
                </span>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar producto..."
                    className="flex-1 bg-transparent text-on-surface font-body text-sm py-2 pr-3 focus:outline-none placeholder:text-on-surface-variant/50"
                />
                {search && (
                    <button
                        onClick={() => setSearch('')}
                        className="text-on-surface-variant hover:text-primary px-3 shrink-0 transition-colors">
                        <span className="material-symbols-outlined text-base">close</span>
                    </button>
                )}
            </div>

            {/* Filtro de categorías */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {categories.map(({ label }) => (
                    <button
                        key={label}
                        onClick={() => setSelectedCategory(label)}
                        className={`px-3 py-1.5 text-xs font-headline uppercase tracking-wider border transition-all ${
                            label === selectedCategory
                                ? 'border-primary text-primary bg-surface-container'
                                : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                        }`}>
                        {label}
                    </button>
                ))}
            </div>

            {/* Producto destacado */}
            {visible
                .filter((p) => p.featured)
                .map((product) => (
                    <div
                        key={product.id}
                        className="tactical-frame p-6 mb-6 flex flex-col md:flex-row gap-6 group cursor-pointer hover:bg-surface-bright transition-colors">
                        <div className="w-full md:w-64 md:shrink-0">
                            <ProductImage src={product.image} featured inStock={product.inStock} />
                        </div>
                        <div className="flex flex-col justify-between flex-1">
                            <div>
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="text-[10px] font-headline text-primary tracking-[0.2em] uppercase mb-1">
                                            {product.set} · {product.category}
                                        </p>
                                        <h3 className="font-headline font-bold text-2xl text-on-surface uppercase">
                                            {product.name}
                                        </h3>
                                    </div>
                                    {product.badge && (
                                        <span
                                            className={`px-2 py-1 text-[10px] font-headline border ${product.badgeColor} text-[#e0e0ff]`}>
                                            {product.badge}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-outline-variant/30">
                                <div>
                                    <p className="text-[10px] text-primary font-headline tracking-widest mb-1">
                                        PRECIO
                                    </p>
                                    <p className="text-3xl font-headline font-bold text-on-surface">
                                        {product.price}
                                    </p>
                                </div>
                                {product.inStock === false && (
                                    <span className="text-[10px] font-headline uppercase tracking-widest text-error border border-error px-2 py-1">
                                        Agotado
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

            {/* Grid de productos o estado vacío */}
            {visible.length === 0 ? (
                <div className="tactical-frame p-10 flex flex-col items-center gap-3 text-center">
                    <span className="material-symbols-outlined text-4xl text-outline">
                        {products.length === 0 ? 'playing_cards' : 'search_off'}
                    </span>
                    <p className="text-sm font-body text-on-surface-variant">
                        {products.length === 0 ? (
                            <>
                                Aún no hay productos para{' '}
                                <span className="font-headline text-primary uppercase">
                                    {sectionLabel}
                                </span>
                                .<br />
                                <span className="text-xs">
                                    Añade productos desde el panel de
                                    administración.
                                </span>
                            </>
                        ) : needle ? (
                            <>
                                Sin resultados para{' '}
                                <span className="font-headline text-primary">
                                    &ldquo;{search}&rdquo;
                                </span>
                            </>
                        ) : (
                            <>
                                Sin productos en{' '}
                                <span className="font-headline text-primary uppercase">
                                    {selectedCategory}
                                </span>
                            </>
                        )}
                    </p>
                </div>
            ) : (
                <>
                    <h3 className="font-headline text-primary text-xs tracking-[0.3em] mb-4 uppercase">
                        Catálogo completo
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {visible
                            .filter((p) => !p.featured)
                            .map((product) => (
                                <div
                                    key={product.id}
                                    className="tactical-frame p-4 hover:bg-surface-bright transition-colors cursor-pointer flex flex-col gap-3 group">
                                    <ProductImage src={product.image} inStock={product.inStock} />
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[9px] font-headline text-primary/60 tracking-widest uppercase truncate">
                                                {product.set}
                                            </p>
                                            <p className="text-sm font-headline font-bold text-on-surface uppercase leading-tight mt-0.5">
                                                {product.name}
                                            </p>
                                        </div>
                                        {product.badge && (
                                            <span
                                                className={`shrink-0 px-1.5 py-0.5 text-[8px] font-headline border ${product.badgeColor} text-[#e0e0ff]`}>
                                                {product.badge}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-outline-variant/30">
                                        <span className="font-headline font-bold text-sm text-primary">
                                            {product.price}
                                        </span>
                                        {product.inStock === false && (
                                            <span className="text-[8px] font-headline uppercase tracking-widest text-error border border-error px-1.5 py-0.5">
                                                Agotado
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                </>
            )}
        </>
    );
};

export default TcgPage;
