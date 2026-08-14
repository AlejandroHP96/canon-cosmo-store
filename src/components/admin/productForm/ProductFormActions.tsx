type Props = {
    isEdit: boolean;
    saving: boolean;
    showContinue: boolean;
    onCancel: () => void;
    onContinue: () => void;
};

/** Botonera del formulario de producto. */
const ProductFormActions = ({
    isEdit,
    saving,
    showContinue,
    onCancel,
    onContinue,
}: Props) => (
    <div className="flex gap-3 mt-2">
        <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-outline-variant text-on-surface-variant font-headline text-xs uppercase tracking-widest py-2.5 hover:border-primary hover:text-primary transition-colors">
            Cancelar
        </button>
        {showContinue && (
            <button
                type="submit"
                disabled={saving}
                onClick={onContinue}
                className="flex-1 border border-primary/50 text-primary/70 font-headline text-xs uppercase tracking-widest py-2.5 hover:border-primary hover:text-primary transition-colors disabled:opacity-50">
                {saving ? 'Guardando...' : '+ Añadir otro'}
            </button>
        )}
        <button
            type="submit"
            disabled={saving}
            className="flex-1 border border-primary bg-surface-container text-primary font-headline text-xs uppercase tracking-widest py-2.5 hover:bg-primary hover:text-surface transition-colors disabled:opacity-50">
            {saving
                ? 'Guardando...'
                : isEdit
                  ? 'Guardar cambios'
                  : 'Crear producto'}
        </button>
    </div>
);

export default ProductFormActions;
