import { useState } from 'react';
import type { NavItem, SubNavItem } from '../../../services/navService';
import { useSidebarConfig } from '../../../hooks/useSidebarConfig';
import { useDragReorder } from '../../../hooks/useDragReorder';
import * as nav from './navMutations';
import NavItemRow from './NavItemRow';
import NavItemEditRow from './NavItemEditRow';
import SubNavRow from './SubNavRow';
import SubNavEditRow from './SubNavEditRow';
import NewSubItemForm from './NewSubItemForm';
import NewNavItemForm from './NewNavItemForm';
import {
    EMPTY_ITEM_FORM,
    EMPTY_SUB_FORM,
    type NavItemForm,
    type NewSubForm,
    type SubNavForm,
} from './navForms';

const subKey = (itemIdx: number, subIdx: number) => `${itemIdx}-${subIdx}`;
const parseSubKey = (key: string) => key.split('-').map(Number) as [number, number];

const NavManager = () => {
    const { items, loading, saving, error, setError, save } = useSidebarConfig();

    const [expandedIdx, setExpandedIdx] = useState<Set<number>>(new Set([0]));
    const [editItemIdx, setEditItemIdx] = useState<number | null>(null);
    const [editItemForm, setEditItemForm] = useState<NavItemForm>(EMPTY_ITEM_FORM);
    const [newItem, setNewItem] = useState<NavItemForm>(EMPTY_ITEM_FORM);

    const [editSubKey, setEditSubKey] = useState<string | null>(null);
    const [editSubForm, setEditSubForm] = useState<SubNavForm>({ label: '', path: '', image: '', color: '' });
    const [newSubForms, setNewSubForms] = useState<Record<number, NewSubForm>>({});
    const [colorPickerKey, setColorPickerKey] = useState<string | null>(null);

    const itemDrag = useDragReorder((from, to) => {
        if (!items) return;
        save(nav.moveItem(items, Number(from), Number(to)));
    });

    const subDrag = useDragReorder((from, to) => {
        if (!items) return;
        const [fromItem, fromSub] = parseSubKey(from);
        const [toItem, toSub] = parseSubKey(to);
        if (fromItem !== toItem) return; // no se mueven subitems entre menús
        save(nav.moveSub(items, fromItem, fromSub, toSub));
    });

    const toggleExpand = (idx: number) =>
        setExpandedIdx((prev) => {
            const next = new Set(prev);
            if (next.has(idx)) next.delete(idx);
            else next.add(idx);
            return next;
        });

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <span className="material-symbols-outlined text-primary text-3xl animate-spin">
                    progress_activity
                </span>
            </div>
        );
    }

    if (!items) return null;

    // ── Handlers primer nivel ─────────────────────────────────────────────────

    const handleAddItem = async () => {
        const icon = newItem.icon.trim();
        const label = newItem.label.trim();
        if (!icon || !label) return;
        const item: NavItem = { icon, label };
        if (newItem.path.trim()) item.path = newItem.path.trim();
        await save(nav.addItem(items, item));
        setNewItem(EMPTY_ITEM_FORM);
    };

    const handleDeleteItem = async (idx: number) => {
        await save(nav.removeItem(items, idx));
        setExpandedIdx((prev) => {
            const next = new Set(prev);
            next.delete(idx);
            return next;
        });
        if (editItemIdx === idx) setEditItemIdx(null);
    };

    const handleEditItemStart = (idx: number) => {
        const item = items[idx];
        setEditItemIdx(idx);
        setEditItemForm({ icon: item.icon, label: item.label, path: item.path ?? '' });
    };

    const handleEditItemSave = async () => {
        if (editItemIdx === null) return;
        const icon = editItemForm.icon.trim();
        const label = editItemForm.label.trim();
        if (!icon || !label) return;
        await save(nav.updateItem(items, editItemIdx, { icon, label }));
        setEditItemIdx(null);
    };

    // ── Handlers subitems ─────────────────────────────────────────────────────

    const getSubForm = (idx: number): NewSubForm => newSubForms[idx] ?? EMPTY_SUB_FORM;

    const patchSubForm = (idx: number, patch: Partial<NewSubForm>) =>
        setNewSubForms((prev) => ({ ...prev, [idx]: { ...getSubForm(idx), ...patch } }));

    const handleAddSub = async (itemIdx: number) => {
        const form = getSubForm(itemIdx);
        const label = form.label.trim();
        const path = form.path.trim();
        if (!label || !path) return;
        const sub: SubNavItem = { label, path };
        if (form.image.trim()) sub.image = form.image.trim();
        if (form.color.trim()) sub.color = form.color.trim();
        await save(nav.addSub(items, itemIdx, sub));
        patchSubForm(itemIdx, EMPTY_SUB_FORM);
    };

    const handleDeleteSub = async (itemIdx: number, subIdx: number) => {
        await save(nav.removeSub(items, itemIdx, subIdx));
        if (editSubKey === subKey(itemIdx, subIdx)) setEditSubKey(null);
    };

    const handleEditSubStart = (itemIdx: number, subIdx: number) => {
        const sub = items[itemIdx].submenu![subIdx];
        setEditSubKey(subKey(itemIdx, subIdx));
        setEditSubForm({ label: sub.label, path: sub.path, image: sub.image ?? '', color: sub.color ?? '' });
    };

    const handleEditSubSave = async (itemIdx: number, subIdx: number) => {
        const label = editSubForm.label.trim();
        if (!label) return;
        await save(
            nav.updateSub(items, itemIdx, subIdx, {
                label,
                image: editSubForm.image.trim(),
                color: editSubForm.color.trim(),
            }),
        );
        setEditSubKey(null);
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="max-w-2xl">
            {error && (
                <div className="flex items-center gap-2 border border-error bg-error-container/20 px-3 py-2.5 mb-6">
                    <span className="material-symbols-outlined text-error text-base shrink-0">error</span>
                    <p className="text-sm font-body text-error flex-1">{error}</p>
                    <button onClick={() => setError(null)} className="text-error/60 hover:text-error shrink-0">
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                </div>
            )}

            <div className="flex flex-col gap-3 mb-6">
                {items.length === 0 && (
                    <p className="text-sm font-body text-on-surface-variant text-center py-6">
                        Sin entradas. Añade una abajo.
                    </p>
                )}

                {items.map((item, idx) => {
                    const key = String(idx);
                    return (
                        <div
                            key={idx}
                            {...itemDrag.dragProps(key)}
                            draggable={editItemIdx !== idx}
                            className={`tactical-frame transition-all ${
                                itemDrag.isTarget(key)
                                    ? 'border-primary border-2 opacity-80'
                                    : itemDrag.dragKey === key
                                      ? 'opacity-40'
                                      : ''
                            }`}>
                            {editItemIdx === idx ? (
                                <NavItemEditRow
                                    form={editItemForm}
                                    saving={saving}
                                    onChange={(patch) => setEditItemForm((f) => ({ ...f, ...patch }))}
                                    onSave={handleEditItemSave}
                                    onCancel={() => setEditItemIdx(null)}
                                />
                            ) : (
                                <NavItemRow
                                    item={item}
                                    expanded={expandedIdx.has(idx)}
                                    saving={saving}
                                    onToggleExpand={() => toggleExpand(idx)}
                                    onEdit={() => handleEditItemStart(idx)}
                                    onDelete={() => handleDeleteItem(idx)}
                                />
                            )}

                            {expandedIdx.has(idx) && (
                                <div className="border-t border-outline-variant/30 px-4 pb-3 pt-2 flex flex-col gap-2">
                                    {(item.submenu?.length ?? 0) === 0 && (
                                        <p className="text-xs font-body text-on-surface-variant pl-3 py-1 italic">
                                            Sin subitems aún.
                                        </p>
                                    )}

                                    {(item.submenu ?? []).map((sub, sIdx) => {
                                        const sKey = subKey(idx, sIdx);
                                        const pickerOpen = colorPickerKey === sKey;
                                        return editSubKey === sKey ? (
                                            <SubNavEditRow
                                                key={sIdx}
                                                form={editSubForm}
                                                saving={saving}
                                                colorPickerOpen={pickerOpen}
                                                onChange={(patch) => setEditSubForm((f) => ({ ...f, ...patch }))}
                                                onOpenColorPicker={() => setColorPickerKey(sKey)}
                                                onCloseColorPicker={() => setColorPickerKey(null)}
                                                onSave={() => handleEditSubSave(idx, sIdx)}
                                                onCancel={() => setEditSubKey(null)}
                                            />
                                        ) : (
                                            <div
                                                key={sIdx}
                                                {...subDrag.dragProps(sKey)}
                                                className={`flex items-center gap-3 pl-2 border-l-2 transition-all ${
                                                    subDrag.isTarget(sKey)
                                                        ? 'border-primary opacity-80'
                                                        : subDrag.dragKey === sKey
                                                          ? 'border-outline-variant/40 opacity-40'
                                                          : 'border-outline-variant/40'
                                                }`}>
                                                <SubNavRow
                                                    sub={sub}
                                                    saving={saving}
                                                    colorPickerOpen={pickerOpen}
                                                    onOpenColorPicker={() => setColorPickerKey(sKey)}
                                                    onCloseColorPicker={() => setColorPickerKey(null)}
                                                    onColorChange={(color) =>
                                                        save(nav.setSubColor(items, idx, sIdx, color))
                                                    }
                                                    onEdit={() => handleEditSubStart(idx, sIdx)}
                                                    onDelete={() => handleDeleteSub(idx, sIdx)}
                                                />
                                            </div>
                                        );
                                    })}

                                    <NewSubItemForm
                                        form={getSubForm(idx)}
                                        parentLabel={item.label}
                                        saving={saving}
                                        colorPickerOpen={colorPickerKey === `new-${idx}`}
                                        onChange={(patch) => patchSubForm(idx, patch)}
                                        onOpenColorPicker={() => setColorPickerKey(`new-${idx}`)}
                                        onCloseColorPicker={() => setColorPickerKey(null)}
                                        onAdd={() => handleAddSub(idx)}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <NewNavItemForm
                form={newItem}
                saving={saving}
                onChange={(patch) => setNewItem((f) => ({ ...f, ...patch }))}
                onAdd={handleAddItem}
            />
        </div>
    );
};

export default NavManager;
