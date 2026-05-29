import { useTranslation } from 'react-i18next';
import ProductImage from '../ProductImage';
import type { Product } from '../../types';

type Props = { product: Product };

const FeaturedProductCard = ({ product }: Props) => {
    const { t } = useTranslation();

    return (
        <div className="tactical-frame p-6 mb-6 flex flex-col md:flex-row gap-6 group cursor-pointer hover:bg-surface-bright transition-colors">
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
                            <span className={`px-2 py-1 text-[10px] font-headline border ${product.badgeColor} text-[#e0e0ff]`}>
                                {product.badge}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-outline-variant/30">
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
        </div>
    );
};

export default FeaturedProductCard;
