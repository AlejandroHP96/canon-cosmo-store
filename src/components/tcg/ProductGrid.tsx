import ProductImage from '../ProductImage';
import type { Product } from '../../types';

type Props = {
    products: Product[];
    totalCount: number;
    search: string;
    selectedCategory: string;
    sectionLabel: string;
};

const ProductGrid = ({ products, totalCount, search, selectedCategory, sectionLabel }: Props) => {
    if (products.length === 0) {
        return (
            <div className="tactical-frame p-10 flex flex-col items-center gap-3 text-center">
                <span className="material-symbols-outlined text-4xl text-outline">
                    {totalCount === 0 ? 'playing_cards' : 'search_off'}
                </span>
                <p className="text-sm font-body text-on-surface-variant">
                    {totalCount === 0 ? (
                        <>
                            Aún no hay productos para{' '}
                            <span className="font-headline text-primary uppercase">{sectionLabel}</span>.
                            <br />
                            <span className="text-xs">
                                Añade productos desde el panel de administración.
                            </span>
                        </>
                    ) : search ? (
                        <>
                            Sin resultados para{' '}
                            <span className="font-headline text-primary">&ldquo;{search}&rdquo;</span>
                        </>
                    ) : (
                        <>
                            Sin productos en{' '}
                            <span className="font-headline text-primary uppercase">{selectedCategory}</span>
                        </>
                    )}
                </p>
            </div>
        );
    }

    return (
        <>
            <h3 className="font-headline text-primary text-xs tracking-[0.3em] mb-4 uppercase">
                Catálogo completo
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
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
                                <span className={`shrink-0 px-1.5 py-0.5 text-[8px] font-headline border ${product.badgeColor} text-[#e0e0ff]`}>
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
    );
};

export default ProductGrid;
