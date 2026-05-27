type Props = { stock: number; maxStock: number };

const StockBar = ({ stock, maxStock }: Props) => {
    const pct = maxStock > 0 ? Math.min((stock / maxStock) * 100, 100) : 0;
    const barColor =
        pct > 50 ? 'bg-primary' : pct > 20 ? 'bg-[#f4b942]' : 'bg-error';

    return (
        <div className="flex items-center gap-2">
            <span className="text-[9px] font-headline uppercase text-primary/60">
                Stock
            </span>
            <div className="w-16 h-1 bg-surface-container-highest">
                <div
                    className={`h-full ${barColor} transition-all`}
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="text-[9px] font-headline text-on-surface-variant">
                {stock}/{maxStock}
            </span>
        </div>
    );
};

export default StockBar;
