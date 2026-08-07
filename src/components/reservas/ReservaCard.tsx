import { useTranslation } from 'react-i18next';
import type { Product } from '../../types';
import { formatPrice } from '../../lib/price';
import ProductImage from '../ProductImage';

type Props = {
    producto: Product;
    onReservar: () => void;
};

const ReservaCard = ({ producto, onReservar }: Props) => {
    const { t } = useTranslation();

    return (
    <div className="tactical-frame p-4 flex flex-col gap-3 hover:bg-surface-bright transition-colors group">
        <ProductImage src={producto.image} alt={producto.name} inStock={producto.inStock} />
        <div className="flex-1 min-w-0">
            <p className="text-[9px] font-headline text-primary/60 tracking-widest uppercase truncate">
                {producto.set || producto.tcg}
            </p>
            <p className="text-sm font-headline font-bold text-on-surface uppercase leading-tight mt-0.5">
                {producto.name}
            </p>
            <p className="font-headline text-sm text-primary mt-1">{formatPrice(producto.price)}</p>
        </div>
        <button
            onClick={onReservar}
            className="w-full border border-primary text-primary font-headline text-[10px] uppercase tracking-widest py-2 hover:bg-primary hover:text-surface transition-colors">
            {t('reservas.reserve')}
        </button>
    </div>
    );
};

export default ReservaCard;
