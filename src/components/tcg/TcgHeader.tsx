type Props = {
    sectionLabel: string;
    total: number;
    filtered: number;
    hasActiveFilter: boolean;
};

const TcgHeader = ({ sectionLabel, total, filtered, hasActiveFilter }: Props) => (
    <div className="flex items-center gap-4 mb-6">
        <div className="tactical-frame px-4 py-2 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl">playing_cards</span>
            <h2 className="font-headline font-bold text-xl text-on-surface uppercase tracking-widest">
                {sectionLabel}
            </h2>
        </div>
        <div className="ml-auto flex items-center gap-2 text-[10px] font-headline text-on-surface-variant uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-primary animate-ping" />
            {hasActiveFilter ? `${filtered} / ${total}` : total}{' '}
            producto{total !== 1 ? 's' : ''}
        </div>
    </div>
);

export default TcgHeader;
