import { useEffect, useState } from 'react';
import { getSidebarConfig, updateSidebarConfig, type NavItem, type SubNavItem, type SidebarConfig } from '../../services/navService';
import { toSlug } from '../../lib/tcgUtils';
import { inputClass } from './adminStyles';
import ColorPickerPopover from './ColorPickerPopover';

const DEFAULT_COLOR = '#bec2ff';

type SubForm = { label: string; path: string; pathAutoSync: boolean; image: string; color: string };

const NavManager = () => {
    const [config, setConfig] = useState<SidebarConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [expandedIdx, setExpandedIdx] = useState<Set<number>>(new Set([0]));
    const [editItemIdx, setEditItemIdx] = useState<number | null>(null);
    const [editItemForm, setEditItemForm] = useState({ icon: '', label: '', path: '' });
    const [newItem, setNewItem] = useState({ icon: '', label: '', path: '' });

    const [editSubKey, setEditSubKey] = useState<string | null>(null);
    const [editSubForm, setEditSubForm] = useState({ label: '', path: '', image: '', color: '' });
    const [newSubForms, setNewSubForms] = useState<Record<number, SubForm>>({});
    const [colorPickerKey, setColorPickerKey] = useState<string | null>(null);

    const [dragIdx, setDragIdx] = useState<number | null>(null);
    const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
    const [subDragKey, setSubDragKey] = useState<{ item: number; sub: number } | null>(null);
    const [subDragOverKey, setSubDragOverKey] = useState<{ item: number; sub: number } | null>(null);

    useEffect(() => {
        getSidebarConfig()
            .then((cfg) => {
                setConfig(cfg);
                if (cfg.items[0]?.submenu?.length) setExpandedIdx(new Set([0]));
            })
            .catch(() => setError('Error al cargar la configuración.'))
            .finally(() => setLoading(false));
    }, []);

    const saveConfig = async (updated: SidebarConfig) => {
        setSaving(true);
        setError(null);
        try {
            await updateSidebarConfig(updated);
            setConfig(updated);
        } catch {
            setError('Error al guardar. Inténtalo de nuevo.');
        } finally {
            setSaving(false);
        }
    };

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

    if (!config) return null;

    // ── Handlers primer nivel ─────────────────────────────────────────────────

    const handleAddItem = async () => {
        const icon = newItem.icon.trim();
        const label = newItem.label.trim();
        if (!icon || !label) return;
        const item: NavItem = { icon, label };
        if (newItem.path.trim()) item.path = newItem.path.trim();
        await saveConfig({ items: [...config.items, item] });
        setNewItem({ icon: '', label: '', path: '' });
    };

    const handleDeleteItem = async (idx: number) => {
        await saveConfig({ items: config.items.filter((_, i) => i !== idx) });
        setExpandedIdx((prev) => {
            const next = new Set(prev);
            next.delete(idx);
            return next;
        });
        if (editItemIdx === idx) setEditItemIdx(null);
    };

    const handleEditItemStart = (idx: number) => {
        const item = config.items[idx];
        setEditItemIdx(idx);
        setEditItemForm({ icon: item.icon, label: item.label, path: item.path ?? '' });
    };

    const handleEditItemSave = async () => {
        if (editItemIdx === null) return;
        const icon = editItemForm.icon.trim();
        const label = editItemForm.label.trim();
        if (!icon || !label) return;
        const items = config.items.map((item, i): NavItem => {
            if (i !== editItemIdx) return item;
            const next: NavItem = { icon, label, submenu: item.submenu };
            if (editItemForm.path.trim()) next.path = editItemForm.path.trim();
            return next;
        });
        await saveConfig({ items });
        setEditItemIdx(null);
    };

    // ── Helpers subitems ──────────────────────────────────────────────────────

    const subKey = (iIdx: number, sIdx: number) => `${iIdx}-${sIdx}`;

    const deriveSubPath = (parentLabel: string, subLabel: string) =>
        `/${toSlug(parentLabel)}/${toSlug(subLabel)}`;

    const getSubForm = (idx: number): SubForm =>
        newSubForms[idx] ?? { label: '', path: '', pathAutoSync: true, image: '', color: '' };

    const patchSubForm = (idx: number, patch: Partial<SubForm>) =>
        setNewSubForms((prev) => ({ ...prev, [idx]: { ...getSubForm(idx), ...patch } }));

    // ── Handlers subitems ─────────────────────────────────────────────────────

    const handleAddSub = async (itemIdx: number) => {
        const form = getSubForm(itemIdx);
        const label = form.label.trim();
        const path = form.path.trim();
        if (!label || !path) return;
        const sub: SubNavItem = { label, path };
        if (form.image.trim()) sub.image = form.image.trim();
        if (form.color.trim()) sub.color = form.color.trim();
        const items = config.items.map((item, i): NavItem => {
            if (i !== itemIdx) return item;
            return { ...item, submenu: [...(item.submenu ?? []), sub] };
        });
        await saveConfig({ items });
        patchSubForm(itemIdx, { label: '', path: '', image: '', color: '', pathAutoSync: true });
    };

    const handleDeleteSub = async (itemIdx: number, subIdx: number) => {
        const items = config.items.map((item, i): NavItem => {
            if (i !== itemIdx) return item;
            return { ...item, submenu: item.submenu?.filter((_, j) => j !== subIdx) };
        });
        await saveConfig({ items });
        if (editSubKey === subKey(itemIdx, subIdx)) setEditSubKey(null);
    };

    const handleEditSubStart = (itemIdx: number, subIdx: number) => {
        const sub = config.items[itemIdx].submenu![subIdx];
        setEditSubKey(subKey(itemIdx, subIdx));
        setEditSubForm({ label: sub.label, path: sub.path, image: sub.image ?? '', color: sub.color ?? '' });
    };

    const handleEditSubSave = async (itemIdx: number, subIdx: number) => {
        const label = editSubForm.label.trim();
        const path = editSubForm.path.trim();
        if (!label || !path) return;
        const image = editSubForm.image.trim();
        const color = editSubForm.color.trim();
        const items = config.items.map((item, i): NavItem => {
            if (i !== itemIdx) return item;
            return {
                ...item,
                submenu: item.submenu?.map((sub, j) => {
                    if (j !== subIdx) return sub;
                    const updated: SubNavItem = { label, path };
                    if (image) updated.image = image;
                    if (color) updated.color = color;
                    return updated;
                }),
            };
        });
        await saveConfig({ items });
        setEditSubKey(null);
    };

    /** Aplica un nuevo color a un subitem existente sin necesidad de entrar en modo edición. */
    const handleSetSubColor = async (itemIdx: number, subIdx: number, color: string) => {
        const items = config.items.map((item, i): NavItem => {
            if (i !== itemIdx) return item;
            return {
                ...item,
                submenu: item.submenu?.map((sub, j) => (j === subIdx ? { ...sub, color } : sub)),
            };
        });
        await saveConfig({ items });
    };

    // ── Drag primer nivel ─────────────────────────────────────────────────────

    const handleDragStart = (idx: number) => setDragIdx(idx);
    const handleDragOver = (e: React.DragEvent, idx: number) => { e.preventDefault(); setDragOverIdx(idx); };
    const handleDragEnd = () => { setDragIdx(null); setDragOverIdx(null); };

    const handleDrop = async (idx: number) => {
        if (dragIdx === null || dragIdx === idx || !config) return;
        const items = [...config.items];
        const [moved] = items.splice(dragIdx, 1);
        items.splice(idx, 0, moved);
        setDragIdx(null);
        setDragOverIdx(null);
        await saveConfig({ items });
    };

    // ── Drag subitems ─────────────────────────────────────────────────────────

    const handleSubDragStart = (itemIdx: number, subIdx: number) =>
        setSubDragKey({ item: itemIdx, sub: subIdx });

    const handleSubDragOver = (e: React.DragEvent, itemIdx: number, subIdx: number) => {
        e.preventDefault();
        setSubDragOverKey({ item: itemIdx, sub: subIdx });
    };

    const handleSubDragEnd = () => { setSubDragKey(null); setSubDragOverKey(null); };

    const handleSubDrop = async (itemIdx: number, toSubIdx: number) => {
        if (!subDragKey || subDragKey.item !== itemIdx || subDragKey.sub === toSubIdx || !config) return;
        const items = config.items.map((item, i): NavItem => {
            if (i !== itemIdx) return item;
            const subs = [...(item.submenu ?? [])];
            const [moved] = subs.splice(subDragKey.sub, 1);
            subs.splice(toSubIdx, 0, moved);
            return { ...item, submenu: subs };
        });
        setSubDragKey(null);
        setSubDragOverKey(null);
        await saveConfig({ items });
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
                {config.items.length === 0 && (
                    <p className="text-sm font-body text-on-surface-variant text-center py-6">
                        Sin entradas. Añade una abajo.
                    </p>
                )}

                {config.items.map((item, idx) => (
                    <div
                        key={idx}
                        draggable={editItemIdx !== idx}
                        onDragStart={() => handleDragStart(idx)}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDrop={() => handleDrop(idx)}
                        onDragEnd={handleDragEnd}
                        className={`tactical-frame transition-all ${
                            dragOverIdx === idx && dragIdx !== idx
                                ? 'border-primary border-2 opacity-80'
                                : dragIdx === idx
                                  ? 'opacity-40'
                                  : ''
                        }`}>
                        {/* Fila primer nivel */}
                        {editItemIdx === idx ? (
                            <div className="px-4 py-3 flex items-center gap-2 flex-wrap">
                                <span className="material-symbols-outlined text-primary text-base shrink-0">
                                    {editItemForm.icon || 'category'}
                                </span>
                                <input
                                    value={editItemForm.icon}
                                    onChange={(e) => setEditItemForm((f) => ({ ...f, icon: e.target.value }))}
                                    placeholder="Icono"
                                    className={inputClass + ' w-32 font-mono'}
                                />
                                <input
                                    value={editItemForm.label}
                                    onChange={(e) => setEditItemForm((f) => ({ ...f, label: e.target.value }))}
                                    placeholder="Label"
                                    className={inputClass + ' flex-1 min-w-28'}
                                />
                                <input
                                    value={editItemForm.path}
                                    onChange={(e) => setEditItemForm((f) => ({ ...f, path: e.target.value }))}
                                    placeholder="/ruta (opcional)"
                                    className={inputClass + ' flex-1 min-w-28 font-mono'}
                                    onKeyDown={(e) => e.key === 'Enter' && handleEditItemSave()}
                                />
                                <button
                                    onClick={handleEditItemSave}
                                    disabled={saving}
                                    className="text-primary hover:text-on-surface transition-colors disabled:opacity-40"
                                    title="Guardar">
                                    <span className="material-symbols-outlined text-sm">check</span>
                                </button>
                                <button
                                    onClick={() => setEditItemIdx(null)}
                                    className="text-on-surface-variant hover:text-on-surface transition-colors"
                                    title="Cancelar">
                                    <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                            </div>
                        ) : (
                            <div className="px-4 py-3 flex items-center gap-3">
                                <span
                                    className="material-symbols-outlined text-on-surface-variant/40 hover:text-on-surface-variant text-base shrink-0 cursor-grab active:cursor-grabbing"
                                    title="Arrastrar para reordenar">
                                    drag_indicator
                                </span>
                                <span className="material-symbols-outlined text-primary text-base shrink-0">
                                    {item.icon}
                                </span>
                                <span className="font-body text-sm text-on-surface flex-1">{item.label}</span>
                                {item.path && (
                                    <span className="font-mono text-xs text-on-surface-variant hidden sm:block truncate max-w-32">
                                        {item.path}
                                    </span>
                                )}
                                {(item.submenu?.length ?? 0) > 0 && (
                                    <span className="text-[10px] font-headline text-primary/50 shrink-0 hidden sm:block">
                                        {item.submenu!.length} sub{item.submenu!.length !== 1 ? 's' : ''}
                                    </span>
                                )}
                                <div className="flex items-center gap-1 shrink-0">
                                    <button
                                        onClick={() => toggleExpand(idx)}
                                        disabled={saving}
                                        className={`transition-colors disabled:opacity-40 ${expandedIdx.has(idx) ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
                                        title="Gestionar submenú">
                                        <span className={`material-symbols-outlined text-sm transition-transform duration-200 ${expandedIdx.has(idx) ? 'rotate-180' : ''}`}>
                                            expand_more
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => handleEditItemStart(idx)}
                                        disabled={saving}
                                        className="text-on-surface-variant hover:text-primary transition-colors disabled:opacity-40"
                                        title="Editar">
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteItem(idx)}
                                        disabled={saving}
                                        className="text-on-surface-variant hover:text-error transition-colors disabled:opacity-40"
                                        title="Eliminar">
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Panel de subitems */}
                        {expandedIdx.has(idx) && (
                            <div className="border-t border-outline-variant/30 px-4 pb-3 pt-2 flex flex-col gap-2">
                                {(item.submenu?.length ?? 0) === 0 && (
                                    <p className="text-xs font-body text-on-surface-variant pl-3 py-1 italic">
                                        Sin subitems aún.
                                    </p>
                                )}

                                {(item.submenu ?? []).map((sub, sIdx) =>
                                    editSubKey === subKey(idx, sIdx) ? (
                                        <div
                                            key={sIdx}
                                            className="flex flex-col gap-2 pl-3 border-l-2 border-primary/40">
                                            <div className="flex items-center gap-2">
                                            <input
                                                value={editSubForm.label}
                                                onChange={(e) => setEditSubForm((f) => ({ ...f, label: e.target.value }))}
                                                placeholder="Label"
                                                className={inputClass + ' flex-1'}
                                                onKeyDown={(e) => e.key === 'Enter' && handleEditSubSave(idx, sIdx)}
                                            />
                                            <input
                                                value={editSubForm.path}
                                                onChange={(e) => setEditSubForm((f) => ({ ...f, path: e.target.value }))}
                                                placeholder="/ruta"
                                                className={inputClass + ' flex-1 font-mono'}
                                                onKeyDown={(e) => e.key === 'Enter' && handleEditSubSave(idx, sIdx)}
                                            />
                                            <button
                                                onClick={() => handleEditSubSave(idx, sIdx)}
                                                disabled={saving}
                                                className="text-primary hover:text-on-surface transition-colors disabled:opacity-40"
                                                title="Guardar">
                                                <span className="material-symbols-outlined text-sm">check</span>
                                            </button>
                                            <button
                                                onClick={() => setEditSubKey(null)}
                                                className="text-on-surface-variant hover:text-on-surface transition-colors"
                                                title="Cancelar">
                                                <span className="material-symbols-outlined text-sm">close</span>
                                            </button>
                                            </div>
                                            <input
                                                type="url"
                                                value={editSubForm.image}
                                                onChange={(e) => setEditSubForm((f) => ({ ...f, image: e.target.value }))}
                                                placeholder="URL imagen (opcional)"
                                                className={inputClass + ' w-full'}
                                            />
                                            <div className="relative flex items-center gap-2">
                                                <span className="font-headline text-[10px] uppercase tracking-widest text-on-surface-variant">
                                                    Color
                                                </span>
                                                <button
                                                    onClick={() => setColorPickerKey(subKey(idx, sIdx))}
                                                    title="Elegir color"
                                                    className="w-5 h-5 rounded-full border border-outline-variant/60"
                                                    style={{ backgroundColor: editSubForm.color || DEFAULT_COLOR }}
                                                />
                                                {colorPickerKey === subKey(idx, sIdx) && (
                                                    <ColorPickerPopover
                                                        value={editSubForm.color || DEFAULT_COLOR}
                                                        onChange={(color) => setEditSubForm((f) => ({ ...f, color }))}
                                                        onClose={() => setColorPickerKey(null)}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            key={sIdx}
                                            draggable
                                            onDragStart={() => handleSubDragStart(idx, sIdx)}
                                            onDragOver={(e) => handleSubDragOver(e, idx, sIdx)}
                                            onDrop={() => handleSubDrop(idx, sIdx)}
                                            onDragEnd={handleSubDragEnd}
                                            className={`flex items-center gap-3 pl-2 border-l-2 transition-all ${
                                                subDragOverKey?.item === idx && subDragOverKey?.sub === sIdx && subDragKey?.sub !== sIdx
                                                    ? 'border-primary opacity-80'
                                                    : subDragKey?.item === idx && subDragKey?.sub === sIdx
                                                      ? 'border-outline-variant/40 opacity-40'
                                                      : 'border-outline-variant/40'
                                            }`}>
                                            <span
                                                className="material-symbols-outlined text-on-surface-variant/40 hover:text-on-surface-variant text-sm shrink-0 cursor-grab active:cursor-grabbing"
                                                title="Arrastrar para reordenar">
                                                drag_indicator
                                            </span>
                                            <span className="font-body text-sm text-on-surface flex-1">{sub.label}</span>
                                            <span className="font-mono text-xs text-on-surface-variant hidden sm:block">
                                                {sub.path}
                                            </span>
                                            <div className="relative">
                                                <button
                                                    onClick={() => setColorPickerKey(subKey(idx, sIdx))}
                                                    disabled={saving}
                                                    title="Color"
                                                    className="w-5 h-5 rounded-full border border-outline-variant/60 disabled:opacity-40"
                                                    style={{ backgroundColor: sub.color || DEFAULT_COLOR }}
                                                />
                                                {colorPickerKey === subKey(idx, sIdx) && (
                                                    <ColorPickerPopover
                                                        value={sub.color || DEFAULT_COLOR}
                                                        onChange={(color) => {
                                                            handleSetSubColor(idx, sIdx, color);
                                                        }}
                                                        onClose={() => setColorPickerKey(null)}
                                                    />
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleEditSubStart(idx, sIdx)}
                                                disabled={saving}
                                                className="text-on-surface-variant hover:text-primary transition-colors disabled:opacity-40"
                                                title="Editar">
                                                <span className="material-symbols-outlined text-sm">edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSub(idx, sIdx)}
                                                disabled={saving}
                                                className="text-on-surface-variant hover:text-error transition-colors disabled:opacity-40"
                                                title="Eliminar">
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                        </div>
                                    ),
                                )}

                                {/* Añadir subitem */}
                                <div className="flex flex-col gap-2 mt-1 pl-3 border-l-2 border-outline-variant/20">
                                    <div className="flex gap-2">
                                        <input
                                            value={getSubForm(idx).label}
                                            onChange={(e) => {
                                                const newLabel = e.target.value;
                                                const form = getSubForm(idx);
                                                patchSubForm(idx, {
                                                    label: newLabel,
                                                    ...(form.pathAutoSync && {
                                                        path: deriveSubPath(item.label, newLabel),
                                                    }),
                                                });
                                            }}
                                            placeholder="Label subitem"
                                            className={inputClass + ' flex-1'}
                                        />
                                        <input
                                            value={getSubForm(idx).path}
                                            onChange={(e) =>
                                                patchSubForm(idx, { path: e.target.value, pathAutoSync: false })
                                            }
                                            placeholder="/ruta"
                                            className={inputClass + ' flex-1 font-mono'}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddSub(idx)}
                                        />
                                        <button
                                            onClick={() => handleAddSub(idx)}
                                            disabled={saving || !getSubForm(idx).label.trim() || !getSubForm(idx).path.trim()}
                                            className="border border-primary text-primary font-headline text-xs uppercase tracking-widest px-3 hover:bg-primary hover:text-surface transition-colors disabled:opacity-40">
                                            {saving ? '...' : 'Añadir'}
                                        </button>
                                    </div>
                                    <input
                                        type="url"
                                        value={getSubForm(idx).image}
                                        onChange={(e) => patchSubForm(idx, { image: e.target.value })}
                                        placeholder="URL imagen (opcional)"
                                        className={inputClass + ' w-full'}
                                    />
                                    <div className="relative flex items-center gap-2">
                                        <span className="font-headline text-[10px] uppercase tracking-widest text-on-surface-variant">
                                            Color
                                        </span>
                                        <button
                                            onClick={() => setColorPickerKey(`new-${idx}`)}
                                            title="Elegir color"
                                            className="w-5 h-5 rounded-full border border-outline-variant/60"
                                            style={{ backgroundColor: getSubForm(idx).color || DEFAULT_COLOR }}
                                        />
                                        {colorPickerKey === `new-${idx}` && (
                                            <ColorPickerPopover
                                                value={getSubForm(idx).color || DEFAULT_COLOR}
                                                onChange={(color) => patchSubForm(idx, { color })}
                                                onClose={() => setColorPickerKey(null)}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Nueva entrada primer nivel */}
            <div className="border border-dashed border-outline-variant/60 p-4">
                <p className="font-headline text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">
                    Nueva entrada
                </p>
                <div className="flex gap-2 items-center flex-wrap">
                    <span className="material-symbols-outlined text-primary/70 text-base shrink-0">
                        {newItem.icon || 'category'}
                    </span>
                    <input
                        value={newItem.icon}
                        onChange={(e) => setNewItem((f) => ({ ...f, icon: e.target.value }))}
                        placeholder="Icono (ej. diamond)"
                        className={inputClass + ' w-36 font-mono'}
                    />
                    <input
                        value={newItem.label}
                        onChange={(e) => setNewItem((f) => ({ ...f, label: e.target.value }))}
                        placeholder="Label"
                        className={inputClass + ' flex-1 min-w-28'}
                    />
                    <input
                        value={newItem.path}
                        onChange={(e) => setNewItem((f) => ({ ...f, path: e.target.value }))}
                        placeholder="/ruta (opcional si tendrá submenú)"
                        className={inputClass + ' flex-1 min-w-36 font-mono'}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                    />
                    <button
                        onClick={handleAddItem}
                        disabled={saving || !newItem.icon.trim() || !newItem.label.trim()}
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
                    <span className="material-symbols-outlined text-[11px] align-middle">expand_more</span>{' '}
                    para añadir subitems a cualquier entrada.
                </p>
            </div>
        </div>
    );
};

export default NavManager;
