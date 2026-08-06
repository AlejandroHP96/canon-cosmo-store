type Props = {
    categories: string[];
    selected: string | null;
    onSelect: (category: string | null) => void;
};

const chipClass = (active: boolean) =>
    `px-3 py-1.5 font-headline text-[11px] uppercase tracking-wider border transition-all ${
        active
            ? 'border-primary text-primary bg-surface-container'
            : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
    }`;

const CategoryChips = ({ categories, selected, onSelect }: Props) => {
    // Con una sola categoría el filtro no aporta nada
    if (categories.length <= 1) return null;

    return (
        <div className="flex flex-wrap gap-1.5 mb-6">
            <button onClick={() => onSelect(null)} className={chipClass(selected === null)}>
                Todas las categorías
            </button>
            {categories.map((cat) => (
                <button key={cat} onClick={() => onSelect(cat)} className={chipClass(selected === cat)}>
                    {cat}
                </button>
            ))}
        </div>
    );
};

export default CategoryChips;
