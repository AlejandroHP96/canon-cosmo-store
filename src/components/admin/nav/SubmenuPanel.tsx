import type { NavItem, SubNavItem } from '../../../services/navService';
import type { DragReorder } from '../../../hooks/useDragReorder';
import SubNavRow from './SubNavRow';
import SubNavEditRow from './SubNavEditRow';
import NewSubItemForm from './NewSubItemForm';
import type { NewSubForm, SubNavForm } from './navForms';

type Props = {
    item: NavItem;
    itemIdx: number;
    saving: boolean;
    subKey: (itemIdx: number, subIdx: number) => string;
    /** Clave del subitem en edición, o null */
    editSubKey: string | null;
    editSubForm: SubNavForm;
    newSubForm: NewSubForm;
    /** Clave del selector de color abierto, o null */
    colorPickerKey: string | null;
    drag: DragReorder;
    onEditSubChange: (patch: Partial<SubNavForm>) => void;
    onNewSubChange: (patch: Partial<NewSubForm>) => void;
    onOpenColorPicker: (key: string) => void;
    onCloseColorPicker: () => void;
    onEditSubStart: (subIdx: number) => void;
    onEditSubSave: (subIdx: number) => void;
    onEditSubCancel: () => void;
    onDeleteSub: (subIdx: number) => void;
    onSubColorChange: (subIdx: number, color: string) => void;
    onAddSub: () => void;
};

const subRowClass = (drag: DragReorder, key: string) => {
    if (drag.isTarget(key)) return 'border-primary opacity-80';
    if (drag.dragKey === key) return 'border-outline-variant/40 opacity-40';
    return 'border-outline-variant/40';
};

/** Subitems de una entrada del sidebar, más el formulario para añadir otro. */
const SubmenuPanel = ({
    item,
    itemIdx,
    saving,
    subKey,
    editSubKey,
    editSubForm,
    newSubForm,
    colorPickerKey,
    drag,
    onEditSubChange,
    onNewSubChange,
    onOpenColorPicker,
    onCloseColorPicker,
    onEditSubStart,
    onEditSubSave,
    onEditSubCancel,
    onDeleteSub,
    onSubColorChange,
    onAddSub,
}: Props) => {
    const submenu: SubNavItem[] = item.submenu ?? [];
    const newKey = `new-${itemIdx}`;

    return (
        <div className="border-t border-outline-variant/30 px-4 pb-3 pt-2 flex flex-col gap-2">
            {submenu.length === 0 && (
                <p className="text-xs font-body text-on-surface-variant pl-3 py-1 italic">
                    Sin subitems aún.
                </p>
            )}

            {submenu.map((sub, sIdx) => {
                const key = subKey(itemIdx, sIdx);
                const pickerOpen = colorPickerKey === key;

                return editSubKey === key ? (
                    <SubNavEditRow
                        key={sIdx}
                        form={editSubForm}
                        saving={saving}
                        colorPickerOpen={pickerOpen}
                        onChange={onEditSubChange}
                        onOpenColorPicker={() => onOpenColorPicker(key)}
                        onCloseColorPicker={onCloseColorPicker}
                        onSave={() => onEditSubSave(sIdx)}
                        onCancel={onEditSubCancel}
                    />
                ) : (
                    <div
                        key={sIdx}
                        {...drag.dragProps(key)}
                        className={`flex items-center gap-3 pl-2 border-l-2 select-none transition-all ${subRowClass(drag, key)}`}>
                        <SubNavRow
                            sub={sub}
                            saving={saving}
                            colorPickerOpen={pickerOpen}
                            onOpenColorPicker={() => onOpenColorPicker(key)}
                            onCloseColorPicker={onCloseColorPicker}
                            onColorChange={(color) => onSubColorChange(sIdx, color)}
                            onEdit={() => onEditSubStart(sIdx)}
                            onDelete={() => onDeleteSub(sIdx)}
                        />
                    </div>
                );
            })}

            <NewSubItemForm
                form={newSubForm}
                parentLabel={item.label}
                saving={saving}
                colorPickerOpen={colorPickerKey === newKey}
                onChange={onNewSubChange}
                onOpenColorPicker={() => onOpenColorPicker(newKey)}
                onCloseColorPicker={onCloseColorPicker}
                onAdd={onAddSub}
            />
        </div>
    );
};

export default SubmenuPanel;
