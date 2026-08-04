import { inputClass } from '../adminStyles';
import type { NavItemForm } from './navForms';

type Props = {
    form: NavItemForm;
    saving: boolean;
    onChange: (patch: Partial<NavItemForm>) => void;
    onAdd: () => void;
};

const NewNavItemForm = ({ form, saving, onChange, onAdd }: Props) => (
    <div className="border border-dashed border-outline-variant/60 p-4">
        <p className="font-headline text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">
            Nueva entrada
        </p>
        <div className="flex gap-2 items-center flex-wrap">
            <span className="material-symbols-outlined text-primary/70 text-base shrink-0">
                {form.icon || 'category'}
            </span>
            <input
                value={form.icon}
                onChange={(e) => onChange({ icon: e.target.value })}
                placeholder="Icono (ej. diamond)"
                className={inputClass + ' w-36 font-mono'}
            />
            <input
                value={form.label}
                onChange={(e) => onChange({ label: e.target.value })}
                placeholder="Label"
                className={inputClass + ' flex-1 min-w-28'}
            />
            <input
                value={form.path}
                onChange={(e) => onChange({ path: e.target.value })}
                placeholder="/ruta (opcional si tendrá submenú)"
                className={inputClass + ' flex-1 min-w-36 font-mono'}
                onKeyDown={(e) => e.key === 'Enter' && onAdd()}
            />
            <button
                onClick={onAdd}
                disabled={saving || !form.icon.trim() || !form.label.trim()}
                className="border border-primary text-primary font-headline text-xs uppercase tracking-widest px-4 py-2 hover:bg-primary hover:text-surface transition-colors disabled:opacity-40">
                {saving ? '...' : 'Añadir'}
            </button>
        </div>
        <p className="text-[10px] font-body text-on-surface-variant mt-2">
            Icono:{' '}
            <a
                href="https://fonts.google.com/icons"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline">
                Material Symbols
            </a>
            . Usa{' '}
            <span className="material-symbols-outlined text-[11px] align-middle">expand_more</span> para
            añadir subitems a cualquier entrada.
        </p>
    </div>
);

export default NewNavItemForm;
