import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ProductImage from '../ProductImage';
import PriceTag from './PriceTag';
import type { Product } from '../../types';

type Props = { product: Product; onClose: () => void };

const ProductModal = ({ product, onClose }: Props) => {
    const { t } = useTranslation();

    const handleEsc = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [handleEsc]);

    return (
        <div
            className="modal-overlay-enter fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
            onClick={onClose}>
            <div
                className="modal-panel-enter tactical-frame p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-end mb-2">
                    <button onClick={onClose} className="text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="w-full mb-5">
                    <ProductImage src={product.image} featured inStock={product.inStock} className="w-full h-64" />
                </div>

                <p className="text-[10px] font-headline text-primary tracking-[0.2em] uppercase mb-1">
                    {[product.set, product.category].filter(Boolean).join(' · ')}
                </p>
                <h2 className="font-headline font-bold text-2xl sm:text-3xl text-on-surface uppercase leading-tight mb-2">
                    {product.name}
                </h2>
                {product.badge && (
                    <span className={`inline-block px-2 py-1 text-[10px] font-headline border mb-3 ${product.badgeColor} text-[#e0e0ff]`}>
                        {product.badge}
                    </span>
                )}
                {product.description && (
                    <p className="text-sm text-on-surface-variant font-body leading-relaxed mb-4">
                        {product.description}
                    </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30">
                    <PriceTag price={product.price} salePrice={product.salePrice} badge={product.badge} size="lg" />
                    <div className="flex items-center gap-2">
                        {product.badgeText && (
                            <span className="text-base font-body text-on-surface-variant">
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
        </div>
    );
};

export default ProductModal;
