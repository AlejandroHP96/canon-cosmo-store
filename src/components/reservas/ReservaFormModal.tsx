import { useTranslation } from 'react-i18next';
import type { Product } from '../../types';
import { NOMBRE_COMPLETO_PATTERN, type ReservaForm } from './reservaForm';

const labelClass =
    'block font-headline text-[10px] uppercase tracking-widest text-primary/60 mb-1';
const fieldClass =
    'w-full bg-surface border border-outline-variant/60 px-3 py-2 text-sm font-body text-on-surface outline-none focus:border-primary transition-colors';

type Props = {
    producto: Product;
    form: ReservaForm;
    saving: boolean;
    onChange: (patch: Partial<ReservaForm>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
};

const ReservaFormModal = ({ producto, form, saving, onChange, onSubmit, onClose }: Props) => {
    const { t } = useTranslation();

    return (
    <>
        <div className="flex items-center justify-between mb-4">
            <p className="font-headline text-[10px] uppercase tracking-[0.3em] text-primary/60">
                {t('reservas.form.heading')}: {producto.name.toUpperCase()}
            </p>
            <button onClick={onClose} className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-sm">close</span>
            </button>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div>
                <label className={labelClass}>{t('reservas.form.name')}</label>
                <input
                    required
                    pattern={NOMBRE_COMPLETO_PATTERN}
                    title={t('reservas.form.nameHint')}
                    value={form.cliente}
                    onChange={(e) => onChange({ cliente: e.target.value })}
                    placeholder={t('reservas.form.namePlaceholder')}
                    className={fieldClass}
                />
            </div>
            <div>
                <label className={labelClass}>{t('reservas.form.quantity')}</label>
                <input
                    type="number"
                    min={1}
                    value={form.cantidad}
                    onChange={(e) =>
                        onChange({ cantidad: Math.max(1, parseInt(e.target.value) || 1) })
                    }
                    className={fieldClass}
                />
            </div>
            <div>
                <label className={labelClass}>{t('reservas.form.notes')}</label>
                <textarea
                    rows={3}
                    value={form.notas}
                    onChange={(e) => onChange({ notas: e.target.value })}
                    placeholder={t('reservas.form.notesPlaceholder')}
                    className={fieldClass + ' resize-none'}
                />
            </div>
            <div className="flex justify-end pt-2">
                <button
                    type="submit"
                    disabled={saving}
                    className="border border-primary text-primary font-headline text-xs uppercase tracking-widest px-8 py-2.5 hover:bg-primary hover:text-surface transition-colors disabled:opacity-40">
                    {saving ? t('reservas.form.submitting') : t('reservas.form.submit')}
                </button>
            </div>
        </form>
    </>
    );
};

export default ReservaFormModal;
