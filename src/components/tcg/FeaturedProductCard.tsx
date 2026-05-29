import { useTranslation } from 'react-i18next';
import ProductImage from '../ProductImage';
import type { Product } from '../../types';

type Props = { product: Product };

const FeaturedProductCard = ({ product }: Props) => {
    const { t } = useTranslation();

    return (
        <div className="tactical-frame mb-6 flex flex-col group cursor-pointer hover:bg-surface-bright transition-colors overflow-hidden">

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
                </div>
            </div>

            {/* Bottom: precio */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-outline-variant/30">
                <div>
                    <p className="text-[10px] text-primary font-headline tracking-widest mb-1">
                        {t('featuredProduct.price')}
                    </p>
                    <p className="text-3xl font-headline font-bold text-on-surface">{product.price}</p>
                </div>
                {product.inStock === false && (
                    <span className="text-[10px] font-headline uppercase tracking-widest text-error border border-error px-2 py-1">
                        {t('featuredProduct.soldOut')}
                    </span>
                )}
            </div>

        </div>
    );
};

export default FeaturedProductCard;
