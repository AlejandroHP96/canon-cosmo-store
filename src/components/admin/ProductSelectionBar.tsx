type Props = {
    visibleCount: number;
    selectedCount: number;
    allSelected: boolean;
    onToggleAll: () => void;
    onClearSelection: () => void;
    onBulkDelete: () => void;
};

const ProductSelectionBar = ({
    visibleCount,
    selectedCount,
    allSelected,
    onToggleAll,
    onClearSelection,
    onBulkDelete,
}: Props) => (
    <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={onToggleAll}
                    className="w-4 h-4 accent-primary"
                />
                <span className="text-[10px] font-headline text-on-surface-variant uppercase tracking-widest">
                    {allSelected ? 'Deseleccionar todo' : 'Seleccionar todo'}
                </span>
            </label>
            <span className="text-[10px] font-headline text-on-surface-variant uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-primary animate-ping inline-block mr-2" />
                {visibleCount} producto{visibleCount !== 1 ? 's' : ''}
            </span>
        </div>
        {selectedCount > 0 && (
            <div className="flex items-center gap-3">
                <span className="text-[10px] font-headline text-primary uppercase tracking-widest">
                    {selectedCount} seleccionado{selectedCount !== 1 ? 's' : ''}
                </span>
                <button
                    onClick={onClearSelection}
                    className="text-[10px] font-headline text-on-surface-variant uppercase tracking-widest hover:text-primary transition-colors">
                    Limpiar
                </button>
                <button
                    onClick={onBulkDelete}
                    className="flex items-center gap-1.5 border border-error text-error font-headline text-xs uppercase tracking-widest px-3 py-1.5 hover:bg-error hover:text-surface transition-colors">
                    <span className="material-symbols-outlined text-sm">delete_sweep</span>
                    Eliminar seleccionados
                </button>
            </div>
        )}
    </div>
);

export default ProductSelectionBar;
