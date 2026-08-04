import { DEFAULT_NAV_COLOR, inputClass } from '../adminStyles';
import ColorPickerPopover from '../ColorPickerPopover';

import { PATH_LOCK_HINT, type SubNavForm } from './navForms';

type Props = {
    form: SubNavForm;
    saving: boolean;
    colorPickerOpen: boolean;
    onChange: (patch: Partial<SubNavForm>) => void;
    onOpenColorPicker: () => void;
    onCloseColorPicker: () => void;
    onSave: () => void;
    onCancel: () => void;
};

/** Fila de un subitem en modo edición. */
const SubNavEditRow = ({
    form,
    saving,
    colorPickerOpen,
    onChange,
    onOpenColorPicker,
    onCloseColorPicker,
    onSave,
    onCancel,
}: Props) => (
    <div className="flex flex-col gap-2 pl-3 border-l-2 border-primary/40">
        <div className="flex items-center gap-2">
            <input
                value={form.label}
                onChange={(e) => onChange({ label: e.target.value })}
                placeholder="Label"
                className={inputClass + ' flex-1'}
                onKeyDown={(e) => e.key === 'Enter' && onSave()}
            />
            <span
                title={PATH_LOCK_HINT}
                className="flex-1 flex items-center gap-1.5 border border-outline-variant/40 bg-surface-container px-3 py-2 font-mono text-sm text-on-surface-variant truncate">
                <span className="material-symbols-outlined text-sm shrink-0">lock</span>
                {form.path}
            </span>
            <button
                onClick={onSave}
                disabled={saving}
                className="text-primary hover:text-on-surface transition-colors disabled:opacity-40"
                title="Guardar">
                <span className="material-symbols-outlined text-sm">check</span>
            </button>
            <button
                onClick={onCancel}
                className="text-on-surface-variant hover:text-on-surface transition-colors"
                title="Cancelar">
                <span className="material-symbols-outlined text-sm">close</span>
            </button>
        </div>
        <p className="text-[10px] font-body text-on-surface-variant pl-0.5 -mt-1">{PATH_LOCK_HINT}</p>
        <input
            type="url"
            value={form.image}
            onChange={(e) => onChange({ image: e.target.value })}
            placeholder="URL imagen (opcional)"
            className={inputClass + ' w-full'}
        />
        <div className="relative flex items-center gap-2">
            <span className="font-headline text-[10px] uppercase tracking-widest text-on-surface-variant">
                Color
            </span>
            <button
                onClick={onOpenColorPicker}
                title="Elegir color"
                className="w-5 h-5 rounded-full border border-outline-variant/60"
                style={{ backgroundColor: form.color || DEFAULT_NAV_COLOR }}
            />
            {colorPickerOpen && (
                <ColorPickerPopover
                    value={form.color || DEFAULT_NAV_COLOR}
                    onChange={(color) => onChange({ color })}
                    onClose={onCloseColorPicker}
                />
            )}
        </div>
    </div>
);

export default SubNavEditRow;
