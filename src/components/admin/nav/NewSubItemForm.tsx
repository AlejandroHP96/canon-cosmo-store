import { DEFAULT_NAV_COLOR, inputClass } from '../adminStyles';
import ColorPickerPopover from '../ColorPickerPopover';
import { deriveSubPath } from './navMutations';
import type { NewSubForm } from './navForms';

type Props = {
    form: NewSubForm;
    parentLabel: string;
    saving: boolean;
    colorPickerOpen: boolean;
    onChange: (patch: Partial<NewSubForm>) => void;
    onOpenColorPicker: () => void;
    onCloseColorPicker: () => void;
    onAdd: () => void;
};

const NewSubItemForm = ({
    form,
    parentLabel,
    saving,
    colorPickerOpen,
    onChange,
    onOpenColorPicker,
    onCloseColorPicker,
    onAdd,
}: Props) => (
    <div className="flex flex-col gap-2 mt-1 pl-3 border-l-2 border-outline-variant/20">
        <div className="flex gap-2">
            <input
                value={form.label}
                onChange={(e) => {
                    const label = e.target.value;
                    onChange({
                        label,
                        ...(form.pathAutoSync && {
                            path: deriveSubPath(parentLabel, label),
                        }),
                    });
                }}
                placeholder="Label subitem"
                className={inputClass + ' flex-1'}
            />
            <input
                value={form.path}
                onChange={(e) =>
                    onChange({ path: e.target.value, pathAutoSync: false })
                }
                placeholder="/ruta"
                className={inputClass + ' flex-1 font-mono'}
                onKeyDown={(e) => e.key === 'Enter' && onAdd()}
            />
            <button
                onClick={onAdd}
                disabled={saving || !form.label.trim() || !form.path.trim()}
                className="border border-primary text-primary font-headline text-xs uppercase tracking-widest px-3 hover:bg-primary hover:text-surface transition-colors disabled:opacity-40">
                {saving ? '...' : 'Añadir'}
            </button>
        </div>
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
                aria-label="Elegir color"
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

export default NewSubItemForm;
