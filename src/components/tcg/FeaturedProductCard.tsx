import { useTranslation } from 'react-i18next';
import ProductImage from '../ProductImage';
import PriceTag from './PriceTag';
import type { Product } from '../../types';

type Props = { product: Product; onSelect?: (product: Product) => void };

const FeaturedProductCard = ({ product, onSelect }: Props) => {
    const { t } = useTranslation();

    return (
        <div
            onClick={() => onSelect?.(product)}
            className="tactical-frame mb-6 flex flex-col group cursor-pointer hover:bg-surface-bright transition-colors overflow-hidden">

            {/* Top: imagen izquierda, info derecha */}
            <div className="flex flex-row gap-6 p-6 pb-4">
                <div className="w-48 shrink-0">
                    <ProductImage src={product.image} featured inStock={product.inStock} />
                </div>
                <div className="flex flex-col justify-center flex-1 gap-2">
                    <p className="text-[10px] font-headline text-primary tracking-[0.2em] uppercase">
                        {[product.set, product.category].filter(Boolean).join(' · ')}
                    </p>
                    <h3 className="font-headline font-bold text-3xl text-on-surface uppercase leading-tight">
                        {product.name}
                    </h3>
                    {product.badge && (
                        <span className={`self-start px-2 py-1 text-[10px] font-headline border ${product.badgeColor} text-[#e0e0ff]`}>
                            {product.badge}
                        </span>
                    )}
                    {product.description && (
                        <p className="text-sm text-on-surface-variant font-body line-clamp-1">
                            {product.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Bottom: precio */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-outline-variant/30">
                <PriceTag price={product.price} salePrice={product.salePrice} badge={product.badge} size="lg" />
                <div className="flex items-center gap-2">
                    {product.badgeText && (
                        <span className="text-sm font-body text-on-surface-variant">
                            {product.badgeText}
                        </span>
                    )}
                    {product.inStock === false && (
                        <span className="text-[10px] font-headline uppercase tracking-widest text-error border border-error px-2 py-1">
                            {t('featuredProduct.soldOut')}
                        </span>
                    )}
                </div>
            </div>

        </div>
    );
};

export default FeaturedProductCard;
