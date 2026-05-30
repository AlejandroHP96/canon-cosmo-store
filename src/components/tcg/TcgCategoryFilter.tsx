type Props = {
    categories: { label: string }[];
    selected: string;
    onSelect: (label: string) => void;
};

const TcgCategoryFilter = ({ categories, selected, onSelect }: Props) => (
    <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map(({ label }) => (
            <button
                key={label}
                onClick={() => onSelect(label)}
                className={`px-3 py-1.5 text-xs font-headline uppercase tracking-wider border transition-all ${
                    label === selected
                        ? 'border-primary text-primary bg-surface-container'
                        : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                }`}>
                {label}
            </button>
        ))}
    </div>
);

export default TcgCategoryFilter;
