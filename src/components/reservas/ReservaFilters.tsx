type Props = {
    search: string;
    secciones: string[];
    seccionSeleccionada: string | null;
    onSearchChange: (value: string) => void;
    onSeccionChange: (seccion: string | null) => void;
};

const chipClass = (active: boolean) =>
    `px-3 py-1.5 font-headline text-[11px] uppercase tracking-wider border transition-all ${
        active
            ? 'border-primary text-primary bg-surface-bright'
            : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
    }`;

const ReservaFilters = ({
    search,
    secciones,
    seccionSeleccionada,
    onSearchChange,
    onSeccionChange,
}: Props) => (
    <div className="mb-6">
        <div className="relative max-w-xs mb-3">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">
                search
            </span>
            <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar producto..."
                className="w-full bg-surface border border-outline-variant/60 pl-9 pr-8 py-2 text-sm font-body text-on-surface outline-none focus:border-primary transition-colors"
            />
            {search && (
                <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors">
                    <span className="material-symbols-outlined text-sm">close</span>
                </button>
            )}
        </div>
        {secciones.length > 1 && (
            <div className="flex flex-wrap gap-1.5">
                <button
                    onClick={() => onSeccionChange(null)}
                    className={chipClass(seccionSeleccionada === null)}>
                    Todas
                </button>
                {secciones.map((s) => (
                    <button
                        key={s}
                        onClick={() => onSeccionChange(s)}
                        className={chipClass(seccionSeleccionada === s)}>
                        {s}
                    </button>
                ))}
            </div>
        )}
    </div>
);

export default ReservaFilters;
