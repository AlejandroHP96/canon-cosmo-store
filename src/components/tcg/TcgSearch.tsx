type Props = {
    value: string;
    onChange: (val: string) => void;
};

const TcgSearch = ({ value, onChange }: Props) => (
    <div className="flex items-center border border-outline-variant bg-surface-container-lowest mb-4 focus-within:border-primary transition-colors">
        <span className="material-symbols-outlined text-on-surface-variant text-base px-3 shrink-0">
            search
        </span>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Buscar producto..."
            className="flex-1 bg-transparent text-on-surface font-body text-sm py-2 pr-3 focus:outline-none placeholder:text-on-surface-variant/50"
        />
        {value && (
            <button
                onClick={() => onChange('')}
                className="text-on-surface-variant hover:text-primary px-3 shrink-0 transition-colors">
                <span className="material-symbols-outlined text-base">close</span>
            </button>
        )}
    </div>
);

export default TcgSearch;
