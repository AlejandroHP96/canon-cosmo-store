import { labelClass } from '../adminStyles';
import JuegoFormFields from './JuegoFormFields';
import type { JuegoForm } from './juegoForm';

type Props = {
    form: JuegoForm;
    saving: boolean;
    onChange: (patch: Partial<JuegoForm>) => void;
    onSubmit: (e: React.FormEvent) => void;
};

const NewJuegoForm = ({ form, saving, onChange, onSubmit }: Props) => (
    <div className="border border-dashed border-outline-variant/60 p-4 mb-8">
        <p className={labelClass}>Nuevo juego</p>
        <form onSubmit={onSubmit} className="flex flex-col gap-3 mt-2">
            <JuegoFormFields form={form} mode="alta" onChange={onChange} />
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={saving || !form.nombre.trim()}
                    className="border border-primary text-primary font-headline text-xs uppercase tracking-widest px-6 py-2 hover:bg-primary hover:text-surface transition-colors disabled:opacity-40">
                    {saving ? 'Guardando...' : 'Añadir juego'}
                </button>
            </div>
        </form>
    </div>
);

export default NewJuegoForm;
