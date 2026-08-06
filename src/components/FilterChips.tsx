const SIZE = {
    sm: 'px-3 py-1 text-[10px]',
    md: 'px-3 py-1.5 text-[11px]',
};

type Props = {
    options: string[];
    selected: string | null;
    /** Texto del chip que quita el filtro */
    allLabel: string;
    onSelect: (value: string | null) => void;
    size?: keyof typeof SIZE;
    /** Estilo del chip activo: el admin y la tienda usan fondos distintos. */
    activeClass?: string;
    className?: string;
};

/** Fila de chips excluyentes con una opción "todos" al principio.
 *  Se oculta si hay una sola opción, porque entonces no filtra nada. */
const FilterChips = ({
    options,
    selected,
    allLabel,
    onSelect,
    size = 'md',
    activeClass = 'border-primary text-primary bg-surface-container',
    className = '',
}: Props) => {
    if (options.length <= 1) return null;

    const chipClass = (active: boolean) =>
        `${SIZE[size]} font-headline uppercase tracking-wider border transition-all ${
            active
                ? activeClass
                : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
        }`;

    return (
        <div className={`flex flex-wrap gap-1.5 ${className}`}>
            <button onClick={() => onSelect(null)} className={chipClass(selected === null)}>
                {allLabel}
            </button>
            {options.map((option) => (
                <button
                    key={option}
                    onClick={() => onSelect(option)}
                    className={chipClass(selected === option)}>
                    {option}
                </button>
            ))}
        </div>
    );
};

export default FilterChips;
