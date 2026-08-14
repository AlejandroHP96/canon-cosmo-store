import { formatPrice } from '../../lib/price';

const SALE_BADGE = 'OFERTA';

type Props = {
    price?: number;
    salePrice?: number;
    badge?: string;
    size?: 'sm' | 'md' | 'lg';
};

const SIZE = {
    sm: { original: 'text-xs', sale: 'text-base font-bold' },
    md: { original: 'text-sm', sale: 'text-2xl font-bold' },
    lg: { original: 'text-base', sale: 'text-4xl font-bold' },
};

const PriceTag = ({ price, salePrice, badge, size = 'md' }: Props) => {
    const s = SIZE[size];
    const formatted = formatPrice(price);
    if (badge === SALE_BADGE && salePrice !== undefined) {
        return (
            <div className="flex items-baseline gap-2">
                <span className={`${s.sale} font-headline text-[#ffb074]`}>
                    {formatPrice(salePrice)}
                </span>
                <span
                    className={`${s.original} font-headline text-on-surface-variant line-through`}>
                    {formatted}
                </span>
            </div>
        );
    }
    return (
        <span className={`${s.sale} font-headline text-on-surface`}>
            {formatted}
        </span>
    );
};

export default PriceTag;
