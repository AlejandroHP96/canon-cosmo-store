import JuegoFormFields from './JuegoFormFields';
import type { JuegoForm } from './juegoForm';

type Props = {
    form: JuegoForm;
    saving: boolean;
    onChange: (patch: Partial<JuegoForm>) => void;
    onSave: () => void;
    onCancel: () => void;
};

const JuegoEditRow = ({ form, saving, onChange, onSave, onCancel }: Props) => (
    <div className="tactical-frame p-4 flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <JuegoFormFields form={form} mode="edicion" onChange={onChange} />
        </div>
        <div className="flex gap-2 justify-end">
            <button
                onClick={onCancel}
                className="border border-outline-variant text-on-surface-variant font-headline text-xs uppercase tracking-widest px-4 py-1.5 hover:border-primary hover:text-primary transition-colors">
                Cancelar
            </button>
            <button
                onClick={onSave}
                disabled={saving || !form.nombre.trim()}
                className="border border-primary text-primary font-headline text-xs uppercase tracking-widest px-4 py-1.5 hover:bg-primary hover:text-surface transition-colors disabled:opacity-40">
                {saving ? 'Guardando...' : 'Guardar'}
            </button>
        </div>
    </div>
);

export default JuegoEditRow;
