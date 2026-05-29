import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ProductImage from '../ProductImage';
import PriceTag from './PriceTag';
import type { Product } from '../../types';

type Props = { products: Product[] };

const GRID_COLS: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-3',
};

const SIZE = {
    2: { img: 'w-36', title: 'text-2xl', padding: 'p-5', gap: 'gap-5', pricePad: 'px-5 py-4' },
    3: { img: 'w-24', title: 'text-xl',  padding: 'p-4', gap: 'gap-4', pricePad: 'px-4 py-3' },
} as const;

const PER_PAGE = 3;
const AUTO_INTERVAL = 4000;


const CompactCard = ({ product, count }: { product: Product; count: 2 | 3 }) => {
    const { t } = useTranslation();
    const s = SIZE[count];
    return (
        <div className="tactical-frame flex flex-col group cursor-pointer hover:bg-surface-bright transition-colors overflow-hidden">
            <div className={`flex flex-row ${s.gap} ${s.padding} pb-3`}>
                <div className={`${s.img} shrink-0`}>
                    <ProductImage src={product.image} featured inStock={product.inStock} />
                </div>
                <div className="flex flex-col justify-center flex-1 min-w-0 gap-1">
                    <p className="text-[9px] font-headline text-primary tracking-[0.2em] uppercase">
                        {[product.set, product.category].filter(Boolean).join(' · ')}
                    </p>
                    <h3 className={`font-headline font-bold ${s.title} text-on-surface uppercase leading-tight`}>
                        {product.name}
                    </h3>
                    {product.badge && (
                        <span className={`self-start px-2 py-0.5 text-[9px] font-headline border ${product.badgeColor} text-[#e0e0ff]`}>
                            {product.badge}
                        </span>
                    )}
                </div>
            </div>
            <div className={`flex items-center justify-between ${s.pricePad} border-t border-outline-variant/30`}>
                <PriceTag price={product.price} salePrice={product.salePrice} badge={product.badge} size="md" />
                {product.inStock === false && (
                    <span className="text-[9px] font-headline uppercase tracking-widest text-error border border-error px-2 py-0.5">
                        {t('featuredProduct.soldOut')}
                    </span>
                )}
            </div>
        </div>
    );
};

const FeaturedSection = ({ products }: Props) => {
    const [page, setPage] = useState(0);
    const hovered = useRef(false);

    const totalPages = Math.ceil(products.length / PER_PAGE);

    useEffect(() => {
        if (products.length <= PER_PAGE) return;
        const id = setInterval(() => {
            if (!hovered.current) {
                setPage((p) => (p + 1) % totalPages);
            }
        }, AUTO_INTERVAL);
        return () => clearInterval(id);
    }, [totalPages, products.length]);

    if (products.length === 0) return null;

    if (products.length <= PER_PAGE) {
        const count = products.length as 2 | 3;
        return (
            <div className={`grid ${GRID_COLS[count]} gap-4 mb-6`}>
                {products.map((p) => (
                    <CompactCard key={p.id} product={p} count={count} />
                ))}
            </div>
        );
    }

    const visible = products.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

    return (
        <div
            className="mb-6"
            onMouseEnter={() => { hovered.current = true; }}
            onMouseLeave={() => { hovered.current = false; }}
        >
            <div key={page} className="featured-page-enter grid grid-cols-1 sm:grid-cols-3 gap-4">
                {visible.map((p) => (
                    <CompactCard key={p.id} product={p} count={3} />
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
                        onClick={() => setPage((p) => (p - 1 + totalPages) % totalPages)}
                        className="flex items-center gap-1 text-[10px] font-headline text-primary hover:text-on-surface transition-colors tracking-widest uppercase cursor-pointer">
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                        Prev
                    </button>
                    <button
                        onClick={() => setPage((p) => (p + 1) % totalPages)}
                        className="flex items-center gap-1 text-[10px] font-headline text-primary hover:text-on-surface transition-colors tracking-widest uppercase cursor-pointer">
                        Next
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeaturedSection;
