type Props = {
    search: string;
    reservableOnly: boolean;
    onSearchChange: (value: string) => void;
    onToggleReservable: () => void;
};

const ProductSearchBar = ({
    search,
    reservableOnly,
    onSearchChange,
    onToggleReservable,
}: Props) => (
    <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">
                search
            </span>
            <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar por nombre, set o categoría..."
                className="w-full bg-surface-container border border-outline-variant text-on-surface font-body text-sm pl-9 pr-4 py-2 placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors"
            />
            {search && (
                <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors">
                    <span className="material-symbols-outlined text-sm">
                        close
                    </span>
                </button>
            )}
        </div>
        <button
            onClick={onToggleReservable}
            className={`flex items-center gap-1.5 px-3 py-2 font-headline text-xs uppercase tracking-wider border transition-all shrink-0 ${
                reservableOnly
                    ? 'border-primary text-primary bg-surface-container'
                    : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
            }`}>
            <span className="material-symbols-outlined text-sm">
                event_upcoming
            </span>
            Reservables
        </button>
    </div>
);

export default ProductSearchBar;
