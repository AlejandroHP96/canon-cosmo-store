import { inputClass } from '../adminStyles';

import { PATH_LOCK_HINT, type NavItemForm } from './navForms';

type Props = {
    form: NavItemForm;
    saving: boolean;
    onChange: (patch: Partial<NavItemForm>) => void;
    onSave: () => void;
    onCancel: () => void;
};

/** Fila de una entrada de primer nivel en modo edición. */
const NavItemEditRow = ({ form, saving, onChange, onSave, onCancel }: Props) => (
    <div className="px-4 py-3 flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
            <span className="material-symbols-outlined text-primary text-base shrink-0">
                {form.icon || 'category'}
            </span>
            <input
                value={form.icon}
                onChange={(e) => onChange({ icon: e.target.value })}
                placeholder="Icono"
                className={inputClass + ' w-32 font-mono'}
            />
            <input
                value={form.label}
                onChange={(e) => onChange({ label: e.target.value })}
                placeholder="Label"
                className={inputClass + ' flex-1 min-w-28'}
                onKeyDown={(e) => e.key === 'Enter' && onSave()}
            />
            {form.path && (
                <span
                    title={PATH_LOCK_HINT}
                    className="flex-1 min-w-28 flex items-center gap-1.5 border border-outline-variant/40 bg-surface-container px-3 py-2 font-mono text-sm text-on-surface-variant truncate">
                    <span className="material-symbols-outlined text-sm shrink-0">lock</span>
                    {form.path}
                </span>
            )}
            <button
                onClick={onSave}
                disabled={saving}
                className="text-primary hover:text-on-surface transition-colors disabled:opacity-40"
                title="Guardar" aria-label="Guardar">
                <span className="material-symbols-outlined text-sm">check</span>
            </button>
            <button
                onClick={onCancel}
                className="text-on-surface-variant hover:text-on-surface transition-colors"
                title="Cancelar" aria-label="Cancelar">
                <span className="material-symbols-outlined text-sm">close</span>
            </button>
        </div>
        {form.path && (
            <p className="text-[10px] font-body text-on-surface-variant pl-0.5">{PATH_LOCK_HINT}</p>
        )}
    </div>
);

export default NavItemEditRow;
