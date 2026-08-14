type Props = {
    page: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onChange: (page: number) => void;
};

const arrowClass =
    'p-1 text-on-surface-variant disabled:opacity-30 hover:text-primary transition-colors cursor-pointer disabled:cursor-default';

/** Devuelve los números de página a mostrar; `null` es una elipsis. */
function pageSlots(page: number, totalPages: number): (number | null)[] {
    const slots: (number | null)[] = [];
    for (let i = 0; i < totalPages; i++) {
        const isEdge = i === 0 || i === totalPages - 1;
        if (totalPages <= 7 || isEdge || Math.abs(i - page) <= 1) slots.push(i);
        else if (Math.abs(i - page) === 2) slots.push(null);
    }
    return slots;
}

const Pagination = ({
    page,
    totalPages,
    totalItems,
    pageSize,
    onChange,
}: Props) => {
    if (totalPages <= 1) return null;
    const first = page * pageSize + 1;
    const last = Math.min((page + 1) * pageSize, totalItems);

    return (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-outline-variant/30">
            <p className="text-[10px] font-headline text-on-surface-variant tracking-widest uppercase">
                {first}–{last} de {totalItems}
            </p>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onChange(0)}
                    disabled={page === 0}
                    className={arrowClass}>
                    <span className="material-symbols-outlined text-sm">
                        first_page
                    </span>
                </button>
                <button
                    onClick={() => onChange(page - 1)}
                    disabled={page === 0}
                    className={arrowClass}>
                    <span className="material-symbols-outlined text-sm">
                        chevron_left
                    </span>
                </button>

                {pageSlots(page, totalPages).map((slot, i) =>
                    slot === null ? (
                        <span
                            key={`gap-${i}`}
                            className="text-on-surface-variant/50 text-xs px-0.5">
                            …
                        </span>
                    ) : (
                        <button
                            key={slot}
                            onClick={() => onChange(slot)}
                            className={`w-7 h-7 font-headline text-[10px] tracking-widest transition-colors cursor-pointer ${
                                slot === page
                                    ? 'bg-primary text-surface'
                                    : 'text-on-surface-variant hover:text-primary'
                            }`}>
                            {slot + 1}
                        </button>
                    ),
                )}

                <button
                    onClick={() => onChange(page + 1)}
                    disabled={page === totalPages - 1}
                    className={arrowClass}>
                    <span className="material-symbols-outlined text-sm">
                        chevron_right
                    </span>
                </button>
                <button
                    onClick={() => onChange(totalPages - 1)}
                    disabled={page === totalPages - 1}
                    className={arrowClass}>
                    <span className="material-symbols-outlined text-sm">
                        last_page
                    </span>
                </button>
            </div>
        </div>
    );
};

export default Pagination;
