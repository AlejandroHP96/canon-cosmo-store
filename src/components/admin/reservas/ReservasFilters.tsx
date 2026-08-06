import { inputClass } from '../adminStyles';
import FilterChips from '../../FilterChips';

type Props = {
    search: string;
    secciones: string[];
    productos: string[];
    seccion: string | null;
    producto: string | null;
    saving: boolean;
    onSearchChange: (value: string) => void;
    onSeccionChange: (seccion: string | null) => void;
    onProductoChange: (producto: string | null) => void;
    onDeleteAll: () => void;
};

const ReservasFilters = ({
    search,
    secciones,
    productos,
    seccion,
    producto,
    saving,
    onSearchChange,
    onSeccionChange,
    onProductoChange,
    onDeleteAll,
}: Props) => (
    <div className="shrink-0">
        <div className="flex items-center justify-between gap-4 mb-3">
            <div className="relative flex-1 max-w-xs">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">
                    search
                </span>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Buscar por cliente, producto o email..."
                    className={`${inputClass} pl-9 pr-8`}
                />
                {search && (
                    <button
                        onClick={() => onSearchChange('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors">
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                )}
            </div>
            <button
                onClick={onDeleteAll}
                disabled={saving}
                className="flex items-center gap-1 border border-error text-error font-headline text-[10px] uppercase tracking-widest px-3 py-2 hover:bg-error-container/30 transition-colors disabled:opacity-40 shrink-0">
                <span className="material-symbols-outlined text-sm">delete_sweep</span>
                Eliminar todas
            </button>
        </div>

        <FilterChips
            options={secciones}
            selected={seccion}
            allLabel="Todas"
            onSelect={onSeccionChange}
            className="mb-3"
        />

        <FilterChips
            options={productos}
            selected={producto}
            allLabel="Todos los productos"
            onSelect={onProductoChange}
            size="sm"
            className="mb-4 pl-2 border-l-2 border-primary/30"
        />
    </div>
);

export default ReservasFilters;
