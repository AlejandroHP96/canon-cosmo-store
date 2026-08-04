import type { SubNavItem } from '../../../services/navService';
import { DEFAULT_NAV_COLOR } from '../adminStyles';
import ColorPickerPopover from '../ColorPickerPopover';

type Props = {
    sub: SubNavItem;
    saving: boolean;
    colorPickerOpen: boolean;
    onOpenColorPicker: () => void;
    onCloseColorPicker: () => void;
    onColorChange: (color: string) => void;
    onEdit: () => void;
    onDelete: () => void;
};

/** Fila de un subitem en modo lectura. */
const SubNavRow = ({
    sub,
    saving,
    colorPickerOpen,
    onOpenColorPicker,
    onCloseColorPicker,
    onColorChange,
    onEdit,
    onDelete,
}: Props) => (
    <>
        <span
            className="material-symbols-outlined text-on-surface-variant/40 hover:text-on-surface-variant text-sm shrink-0 cursor-grab active:cursor-grabbing"
            title="Arrastrar para reordenar">
            drag_indicator
        </span>
        <span className="font-body text-sm text-on-surface flex-1">{sub.label}</span>
        <span className="font-mono text-xs text-on-surface-variant hidden sm:block">{sub.path}</span>
        <div className="relative">
            <button
                onClick={onOpenColorPicker}
                disabled={saving}
                title="Color"
                className="w-5 h-5 rounded-full border border-outline-variant/60 disabled:opacity-40"
                style={{ backgroundColor: sub.color || DEFAULT_NAV_COLOR }}
            />
            {colorPickerOpen && (
                <ColorPickerPopover
                    value={sub.color || DEFAULT_NAV_COLOR}
                    onChange={onColorChange}
                    onClose={onCloseColorPicker}
                />
            )}
        </div>
        <button
            onClick={onEdit}
            disabled={saving}
            className="text-on-surface-variant hover:text-primary transition-colors disabled:opacity-40"
            title="Editar">
            <span className="material-symbols-outlined text-sm">edit</span>
        </button>
        <button
            onClick={onDelete}
            disabled={saving}
            className="text-on-surface-variant hover:text-error transition-colors disabled:opacity-40"
            title="Eliminar">
            <span className="material-symbols-outlined text-sm">delete</span>
        </button>
    </>
);

export default SubNavRow;
