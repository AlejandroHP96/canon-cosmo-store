import { useState, useEffect } from 'react';
import ProductImage from '../../components/ProductImage';
import StockBar from '../../components/StockBar';
import { getProductsByTcg } from '../../services/productsService';
import { useTcgCategories } from '../../hooks/useTcgCategories';
import type { Product } from '../../types';

const FinalFantasyTCG = () => {
    const categories = useTcgCategories('finalfantasy');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('Todo');

    useEffect(() => {
        getProductsByTcg('finalfantasy').then((data) => {
            setProducts(data);
            setLoading(false);
        });
    }, []);

    if (loading)
        return (
            <div className="flex items-center justify-center h-64">
                <span className="material-symbols-outlined text-primary text-4xl animate-spin">
                    progress_activity
                </span>
            </div>
        );

    const visible =
        selectedCategory === 'Todo'
            ? products
            : products.filter((p) => p.category === selectedCategory);

    return (
        <>
            <div className="flex items-center gap-4 mb-6">
                <div className="tactical-frame px-4 py-2 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-2xl">
                        playing_cards
                    </span>
                    <div>
                        <h2 className="font-headline font-bold text-xl text-on-surface uppercase tracking-widest">
                            Final Fantasy TCG
                        </h2>
                        <p className="text-[10px] text-primary font-headline tracking-[0.2em]">
                            OPUS XVIII — RESURGENCE OF POWER
                        </p>
                    </div>
                </div>
                <div className="ml-auto flex items-center gap-2 text-[10px] font-headline text-on-surface-variant uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 bg-primary animate-ping" />
                    {products.length} productos
                </div>
            </div>

            <div className="flex gap-2 mb-6 flex-wrap">
                {categories.map(({ label, icon }) => (
                    <button
                        key={label}
                        onClick={() => setSelectedCategory(label)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-headline uppercase tracking-wider border transition-all ${
                            label === selectedCategory
                                ? 'border-primary text-primary bg-surface-container'
                                : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                        }`}>
                        <span className="material-symbols-outlined text-sm">
                            {icon}
                        </span>
                        {label}
                    </button>
                ))}
            </div>

            {visible.filter((p) => p.featured).map((product) => (
                    <div
                        key={product.id}
                        className="tactical-frame p-6 mb-6 flex flex-col md:flex-row gap-6 group cursor-pointer hover:bg-surface-bright transition-colors">
                        <div className="w-full md:w-64 md:shrink-0">
                            <ProductImage src={product.image} featured />
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
                                <p className="text-xs text-on-surface-variant font-body mt-2">
                                    Caja completa de 36 sobres del último Opus.
                                    Incluye carta promocional exclusiva y póster
                                    coleccionable.
                                </p>
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
                                <StockBar
                                    stock={product.stock}
                                    maxStock={product.maxStock}
                                />
                            </div>
                        </div>
                    </div>
                ))}

            {visible.length === 0 ? (
                <div className="tactical-frame p-10 flex flex-col items-center gap-3 text-center">
                    <span className="material-symbols-outlined text-4xl text-outline">
                        search_off
                    </span>
                    <p className="text-sm font-body text-on-surface-variant">
                        Sin productos en{' '}
                        <span className="font-headline text-primary uppercase">
                            {selectedCategory}
                        </span>
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
                                    <ProductImage src={product.image} />
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
                                        <StockBar
                                            stock={product.stock}
                                            maxStock={product.maxStock}
                                        />
                                    </div>
                                </div>
                            ))}
                    </div>
                </>
            )}
        </>
    );
};

export default FinalFantasyTCG;
