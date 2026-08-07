import { useTranslation } from 'react-i18next';
import FilterChips from '../FilterChips';

type Props = {
    search: string;
    secciones: string[];
    seccionSeleccionada: string | null;
    onSearchChange: (value: string) => void;
    onSeccionChange: (seccion: string | null) => void;
};

const ReservaFilters = ({
    search,
    secciones,
    seccionSeleccionada,
    onSearchChange,
    onSeccionChange,
}: Props) => {
    const { t } = useTranslation();

    return (
    <div className="mb-6">
        <div className="relative max-w-xs mb-3">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">
                search
            </span>
            <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t('reservas.searchPlaceholder')}
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
        <FilterChips
            options={secciones}
            selected={seccionSeleccionada}
            allLabel={t('reservas.allSections')}
            onSelect={onSeccionChange}
            activeClass="border-primary text-primary bg-surface-bright"
        />
    </div>
    );
};

export default ReservaFilters;
