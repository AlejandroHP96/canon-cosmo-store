type Props = {
    price: string;
    salePrice?: string;
    badge?: string;
    size?: 'sm' | 'md' | 'lg';
};

const SIZE = {
    sm: { original: 'text-xs',  sale: 'text-base font-bold' },
    md: { original: 'text-sm',  sale: 'text-2xl font-bold' },
    lg: { original: 'text-base', sale: 'text-4xl font-bold' },
};

const PriceTag = ({ price, salePrice, badge, size = 'md' }: Props) => {
    const s = SIZE[size];
    if (badge === 'OFERTA' && salePrice) {
        return (
            <div className="flex items-baseline gap-2">
                <span className={`${s.sale} font-headline text-[#ffb074]`}>
                    {salePrice}
                </span>
                <span className={`${s.original} font-headline text-on-surface-variant line-through`}>
                    {price}
                </span>
            </div>
        );
    }
    return <span className={`${s.sale} font-headline text-on-surface`}>{price}</span>;
};

export default PriceTag;
