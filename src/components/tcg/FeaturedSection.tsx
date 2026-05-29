import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProductImage from '../ProductImage';
import type { Product } from '../../types';

type Props = { products: Product[] };

const CompactCard = ({ product }: { product: Product }) => {
    const { t } = useTranslation();
    return (
        <div className="tactical-frame overflow-hidden group cursor-pointer hover:bg-surface-bright transition-colors flex flex-col">
            <ProductImage src={product.image} featured inStock={product.inStock} />
            <div className="p-4 flex flex-col gap-1 flex-1">
                <p className="text-[9px] font-headline text-primary tracking-[0.2em] uppercase">
                    {[product.set, product.category].filter(Boolean).join(' · ')}
                </p>
                <h3 className="font-headline font-bold text-base text-on-surface uppercase leading-tight flex-1">
                    {product.name}
                </h3>
                {product.badge && (
                    <span className={`self-start px-2 py-0.5 text-[9px] font-headline border ${product.badgeColor} text-[#e0e0ff]`}>
                        {product.badge}
                    </span>
                )}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-outline-variant/30">
                    <p className="text-xl font-headline font-bold text-on-surface">{product.price}</p>
                    {product.inStock === false && (
                        <span className="text-[9px] font-headline uppercase tracking-widest text-error border border-error px-2 py-0.5">
                            {t('featuredProduct.soldOut')}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

const GRID_COLS: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-3',
};
const PER_PAGE = 3;

const FeaturedSection = ({ products }: Props) => {
    const [page, setPage] = useState(0);

    if (products.length === 0) return null;

    if (products.length <= 3) {
        return (
            <div className={`grid ${GRID_COLS[products.length]} gap-4 mb-6`}>
                {products.map((p) => (
                    <CompactCard key={p.id} product={p} />
                ))}
            </div>
        );
    }

    const totalPages = Math.ceil(products.length / PER_PAGE);
    const visible = products.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

    return (
        <div className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {visible.map((p) => (
                    <CompactCard key={p.id} product={p} />
                ))}
                {visible.length < PER_PAGE &&
                    [...Array(PER_PAGE - visible.length)].map((_, i) => (
                        <div key={`empty-${i}`} />
                    ))}
            </div>

            <div className="flex items-center justify-between mt-3 px-1">
                <div className="flex gap-1.5 items-center">
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i)}
                            className={`w-2 h-2 transition-colors cursor-pointer ${
                                i === page ? 'bg-primary' : 'bg-primary/30 hover:bg-primary/60'
                            }`}
                        />
                    ))}
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setPage((p) => p - 1)}
                        disabled={page === 0}
                        className="flex items-center gap-1 text-[10px] font-headline text-primary disabled:opacity-30 hover:text-on-surface transition-colors tracking-widest uppercase cursor-pointer disabled:cursor-default">
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                        Prev
                    </button>
                    <button
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page === totalPages - 1}
                        className="flex items-center gap-1 text-[10px] font-headline text-primary disabled:opacity-30 hover:text-on-surface transition-colors tracking-widest uppercase cursor-pointer disabled:cursor-default">
                        Next
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeaturedSection;
