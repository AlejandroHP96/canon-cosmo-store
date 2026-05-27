import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteField } from 'firebase/firestore';
import {
    getAllProducts,
    addProduct,
    updateProduct,
    deleteProduct,
} from '../../services/productsService';
import {
    getCategoriesByTcg,
    updateCategoriesByTcg,
} from '../../services/categoriesService';
import {
    getSidebarConfig,
    updateSidebarConfig,
    type NavItem,
    type SidebarConfig,
} from '../../services/navService';
import { useTcgOptions } from '../../hooks/useTcgOptions';
import { pathToSectionId, toSlug } from '../../lib/tcgUtils';
import type { Product, TcgId } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import ProductImage from '../../components/ProductImage';

const EMPTY_FORM: Omit<Product, 'id'> = {
    tcg: 'pokemon',
    name: '',
    set: '',
    price: '',
    category: '',
    badge: '',
    badgeColor: '',
    stock: 0,
    maxStock: 5,
    image: '',
    featured: false,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const inputClass =
    'w-full border border-outline-variant bg-surface-container-lowest text-on-surface font-body text-sm px-3 py-2 focus:outline-none focus:border-primary';
const labelClass =
    'block font-headline text-[10px] uppercase tracking-widest text-on-surface-variant mb-1';


type FormData = Omit<Product, 'id'>;

const ProductFormModal = ({
    initial,
    onClose,
    onSaved,
}: {
    initial: Product | null; // null = add mode
    onClose: () => void;
    onSaved: () => void;
}) => {
    const isEdit = initial !== null;
    const [form, setForm] = useState<FormData>(
        initial ? { ...initial } : { ...EMPTY_FORM },
    );
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<string[]>([]);

    // Árbol de navegación para los dos selectores en cascada
    const [navItems, setNavItems] = useState<NavItem[]>([]);
    const [menuIdx, setMenuIdx] = useState(0);
    const [subIdx, setSubIdx] = useState(0);
    const [navReady, setNavReady] = useState(false);

    const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    // Carga el árbol de nav e inicializa los selectores según form.tcg
    useEffect(() => {
        getSidebarConfig().then((cfg) => {
            const items = cfg.items; // todos los items del nav
            setNavItems(items);
            // Busca qué menú/submenú coincide con el tcg actual
            let mIdx = 0;
            let sIdx = 0;
            outer: for (let i = 0; i < items.length; i++) {
                const item = items[i];
                // Item con path directo
                if (item.path && pathToSectionId(item.path) === form.tcg) {
                    mIdx = i;
                    break outer;
                }
                // Item sin path ni submenú: el ID se deriva del label
                if (!item.path && !(item.submenu?.length) && toSlug(item.label) === form.tcg) {
                    mIdx = i;
                    break outer;
                }
                // Subitems
                for (let j = 0; j < (item.submenu?.length ?? 0); j++) {
                    if (pathToSectionId(item.submenu![j].path) === form.tcg) {
                        mIdx = i;
                        sIdx = j;
                        break outer;
                    }
                }
            }
            setMenuIdx(mIdx);
            setSubIdx(sIdx);
            setNavReady(true);
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Cuando cambia la selección, actualiza form.tcg
    useEffect(() => {
        if (!navReady || navItems.length === 0) return;
        const menu = navItems[menuIdx];
        if (!menu) return;
        const subs = menu.submenu ?? [];
        if (subs.length > 0) {
            const sub = subs[Math.min(subIdx, subs.length - 1)];
            set('tcg', pathToSectionId(sub.path));
        } else if (menu.path) {
            set('tcg', pathToSectionId(menu.path));
        } else {
            // Item sin path ni submenú (ej. "Funko Pop" sin ruta configurada)
            set('tcg', toSlug(menu.label));
        }
    }, [menuIdx, subIdx, navReady]); // eslint-disable-line react-hooks/exhaustive-deps

    // Carga categorías cada vez que cambia la sección
    useEffect(() => {
        if (!form.tcg) return;
        getCategoriesByTcg(form.tcg).then((cats) => {
            setCategories(cats);
            if (cats.length > 0 && !cats.includes(form.category)) {
                set('category', cats[0]);
            }
        });
    }, [form.tcg]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSaving(true);
        try {
            const raw: FormData = {
                ...form,
                stock: Number(form.stock),
                maxStock: Number(form.maxStock),
            };
            if (isEdit) {
                const updatePayload: Record<string, string | number | boolean | ReturnType<typeof deleteField> | undefined> = {
                    ...Object.fromEntries(
                        Object.entries(raw).filter(
                            ([, v]) => v !== undefined && v !== '',
                        ),
                    ),
                    badge: raw.badge || deleteField(),
                    badgeColor: raw.badgeColor || deleteField(),
                    image: raw.image || deleteField(),
                };
                await updateProduct(initial!.id, updatePayload);
            } else {
                const addPayload = Object.fromEntries(
                    Object.entries(raw).filter(
                        ([, v]) => v !== undefined && v !== '',
                    ),
                ) as FormData;
                await addProduct(addPayload);
            }
            onSaved();
        } catch {
            setError('Error al guardar. Inténtalo de nuevo.');
        } finally {
            setSaving(false);
        }
    };

    const subOptions = navItems[menuIdx]?.submenu ?? [];

    return (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="tactical-frame p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-headline font-bold text-lg text-on-surface uppercase tracking-widest">
                        {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-on-surface-variant hover:text-primary">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Menú + Sección (selectores en cascada) */}
                    <div className={`grid gap-3 ${subOptions.length > 0 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        <div>
                            <label className={labelClass}>Menú</label>
                            <select
                                value={menuIdx}
                                onChange={(e) => {
                                    setMenuIdx(Number(e.target.value));
                                    setSubIdx(0);
                                }}
                                className={inputClass}
                                disabled={!navReady}>
                                {navItems.map((item, i) => (
                                    <option key={i} value={i}>
                                        {item.label}
                                    </option>
                                ))}
                                {!navReady && <option>Cargando...</option>}
                            </select>
                        </div>
                        {subOptions.length > 0 && (
                            <div>
                                <label className={labelClass}>Sección</label>
                                <select
                                    value={subIdx}
                                    onChange={(e) =>
                                        setSubIdx(Number(e.target.value))
                                    }
                                    className={inputClass}>
                                    {subOptions.map((sub, i) => (
                                        <option key={i} value={i}>
                                            {sub.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Name */}
                    <div>
                        <label className={labelClass}>Nombre</label>
                        <input
                            required
                            value={form.name}
                            onChange={(e) => set('name', e.target.value)}
                            className={inputClass}
                        />
                    </div>

                    {/* Set + Category */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelClass}>
                                Set / Expansión
                            </label>
                            <input
                                required
                                value={form.set}
                                onChange={(e) => set('set', e.target.value)}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Categoría</label>
                            <select
                                required
                                value={form.category}
                                onChange={(e) =>
                                    set('category', e.target.value)
                                }
                                className={inputClass}
                                disabled={categories.length === 0}>
                                {categories.length === 0 && (
                                    <option value="">Cargando...</option>
                                )}
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Price */}
                    <div>
                        <label className={labelClass}>Precio</label>
                        <input
                            required
                            placeholder="4,99 €"
                            value={form.price}
                            onChange={(e) => set('price', e.target.value)}
                            className={inputClass}
                        />
                    </div>

                    {/* Stock + MaxStock */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelClass}>Stock actual</label>
                            <input
                                type="number"
                                min={0}
                                value={form.stock}
                                onChange={(e) =>
                                    set('stock', Number(e.target.value))
                                }
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Stock máximo</label>
                            <input
                                type="number"
                                min={1}
                                value={form.maxStock}
                                onChange={(e) =>
                                    set('maxStock', Number(e.target.value))
                                }
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className={labelClass}>URL de imagen</label>
                        <input
                            type="url"
                            placeholder="https://..."
                            value={form.image ?? ''}
                            onChange={(e) => set('image', e.target.value)}
                            className={inputClass}
                        />
                    </div>

                    {/* Badge */}
                    {(() => {
                        const BADGE_OPTIONS = [
                            { label: '— Ninguno', badge: '', badgeColor: '' },
                            {
                                label: 'NOVEDAD',
                                badge: 'NOVEDAD',
                                badgeColor: 'bg-[#343dff] border-[#bec2ff]',
                            },
                            {
                                label: 'HOT',
                                badge: 'HOT',
                                badgeColor: 'bg-[#93000a] border-[#ffb4ab]',
                            },
                            {
                                label: 'OFERTA',
                                badge: 'OFERTA',
                                badgeColor: 'bg-[#7a3500] border-[#ffb074]',
                            },
                        ];
                        const selected = BADGE_OPTIONS.find(
                            (o) => o.badge === (form.badge ?? ''),
                        );
                        return (
                            <div className="flex items-end gap-3">
                                <div className="flex-1">
                                    <label className={labelClass}>Badge</label>
                                    <select
                                        value={form.badge ?? ''}
                                        onChange={(e) => {
                                            const opt = BADGE_OPTIONS.find(
                                                (o) => o.badge === e.target.value,
                                            )!;
                                            set('badge', opt.badge);
                                            set('badgeColor', opt.badgeColor);
                                        }}
                                        className={inputClass}>
                                        {BADGE_OPTIONS.map((o) => (
                                            <option key={o.label} value={o.badge}>
                                                {o.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {selected?.badge && (
                                    <span
                                        className={`mb-0.5 px-2 py-1 text-[9px] font-headline border ${selected.badgeColor} text-[#e0e0ff] shrink-0`}>
                                        {selected.badge}
                                    </span>
                                )}
                            </div>
                        );
                    })()}

                    {/* Featured */}
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.featured ?? false}
                            onChange={(e) => set('featured', e.target.checked)}
                            className="w-4 h-4 accent-primary"
                        />
                        <span className="font-headline text-xs uppercase tracking-widest text-on-surface-variant">
                            Producto destacado
                        </span>
                    </label>

                    {error && (
                        <p className="text-xs font-body text-error flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">
                                error
                            </span>
                            {error}
                        </p>
                    )}

                    <div className="flex gap-3 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-outline-variant text-on-surface-variant font-headline text-xs uppercase tracking-widest py-2.5 hover:border-primary hover:text-primary transition-colors">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 border border-primary bg-surface-container text-primary font-headline text-xs uppercase tracking-widest py-2.5 hover:bg-primary hover:text-surface transition-colors disabled:opacity-50">
                            {saving
                                ? 'Guardando...'
                                : isEdit
                                  ? 'Guardar cambios'
                                  : 'Crear producto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const DeleteConfirmModal = ({
    product,
    onClose,
    onDeleted,
}: {
    product: Product;
    onClose: () => void;
    onDeleted: () => void;
}) => {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteProduct(product.id);
            onDeleted();
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="tactical-frame p-6 w-full max-w-sm">
                <h2 className="font-headline font-bold text-lg text-on-surface uppercase tracking-widest mb-2">
                    Eliminar producto
                </h2>
                <p className="text-sm font-body text-on-surface-variant mb-6">
                    ¿Seguro que quieres eliminar{' '}
                    <span className="text-on-surface font-bold">
                        {product.name}
                    </span>
                    ? Esta acción no se puede deshacer.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 border border-outline-variant text-on-surface-variant font-headline text-xs uppercase tracking-widest py-2.5 hover:border-primary hover:text-primary transition-colors">
                        Cancelar
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex-1 border border-error bg-error-container/30 text-error font-headline text-xs uppercase tracking-widest py-2.5 hover:bg-error-container/60 transition-colors disabled:opacity-50">
                        {deleting ? 'Eliminando...' : 'Eliminar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Categories Manager ───────────────────────────────────────────────────────

const CategoriesManager = () => {
    const [navItems, setNavItems] = useState<NavItem[]>([]);
    const [navReady, setNavReady] = useState(false);
    const [menuIdx, setMenuIdx] = useState(0);
    const [subIdx, setSubIdx] = useState(0);

    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newCat, setNewCat] = useState('');

    // Carga el árbol de nav
    useEffect(() => {
        getSidebarConfig()
            .then((cfg) => {
                setNavItems(cfg.items);
                setNavReady(true);
            })
            .catch(() => setError('Error al cargar la configuración.'));
    }, []);

    // Deriva el tcg activo a partir de la selección de menú/subitem
    const menu = navItems[menuIdx];
    const subOptions = menu?.submenu ?? [];
    const tcg: string = (() => {
        if (!menu) return '';
        if (subOptions.length > 0) {
            const sub = subOptions[Math.min(subIdx, subOptions.length - 1)];
            return pathToSectionId(sub.path);
        }
        return menu.path ? pathToSectionId(menu.path) : toSlug(menu.label);
    })();

    // Carga categorías cuando cambia la sección activa
    useEffect(() => {
        if (!tcg) return;
        setLoading(true);
        setError(null);
        getCategoriesByTcg(tcg)
            .then((cats) => setCategories(cats))
            .catch(() => setError('Error al cargar categorías.'))
            .finally(() => setLoading(false));
    }, [tcg]); // eslint-disable-line react-hooks/exhaustive-deps

    const save = async (updated: string[]) => {
        setSaving(true);
        setError(null);
        try {
            await updateCategoriesByTcg(tcg, updated);
            setCategories(updated);
        } catch (e) {
            console.error(e);
            setError('Error al guardar. Inténtalo de nuevo.');
        } finally {
            setSaving(false);
        }
    };

    const handleAdd = async () => {
        const trimmed = newCat.trim();
        if (!trimmed) return;
        if (categories.includes(trimmed)) {
            setError(`"${trimmed}" ya existe en la lista.`);
            return;
        }
        await save([...categories, trimmed]);
        setNewCat('');
    };

    const handleRemove = (cat: string) =>
        save(categories.filter((c) => c !== cat));

    if (!navReady) {
        return (
            <div className="flex justify-center py-10">
                <span className="material-symbols-outlined text-primary text-3xl animate-spin">
                    progress_activity
                </span>
            </div>
        );
    }

    return (
        <div className="max-w-lg">
            {/* Nivel 1: menús */}
            <div className="flex flex-wrap gap-2 mb-2">
                {navItems.map((item, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setMenuIdx(idx);
                            setSubIdx(0);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 font-headline text-xs uppercase tracking-wider border transition-all ${
                            menuIdx === idx
                                ? 'border-primary text-primary bg-surface-container'
                                : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                        }`}>
                        <span className="material-symbols-outlined text-sm">
                            {item.icon}
                        </span>
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Nivel 2: subitems (solo si el menú seleccionado tiene submenú) */}
            {subOptions.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6 pl-2 border-l-2 border-primary/30">
                    {subOptions.map((sub, idx) => {
                        const id = pathToSectionId(sub.path);
                        return (
                            <button
                                key={id}
                                onClick={() => setSubIdx(idx)}
                                className={`px-3 py-1 font-headline text-[11px] uppercase tracking-wider border transition-all ${
                                    subIdx === idx
                                        ? 'border-primary text-primary bg-surface-container'
                                        : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                                }`}>
                                {sub.label}
                            </button>
                        );
                    })}
                </div>
            )}
            {subOptions.length === 0 && <div className="mb-6" />}

            {/* List */}
            {loading ? (
                <div className="flex justify-center py-10">
                    <span className="material-symbols-outlined text-primary text-3xl animate-spin">
                        progress_activity
                    </span>
                </div>
            ) : categories.length === 0 ? (
                <p className="text-sm font-body text-on-surface-variant text-center py-6">
                    Sin categorías. Añade una abajo.
                </p>
            ) : (
                <div className="flex flex-col gap-2 mb-4">
                    {categories.map((cat) => (
                        <div
                            key={cat}
                            className="tactical-frame px-4 py-2.5 flex items-center justify-between">
                            <span className="font-body text-sm text-on-surface">
                                {cat}
                            </span>
                            <button
                                onClick={() => handleRemove(cat)}
                                disabled={saving}
                                className="text-on-surface-variant hover:text-error transition-colors disabled:opacity-40"
                                title="Eliminar">
                                <span className="material-symbols-outlined text-sm">
                                    delete
                                </span>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 border border-error bg-error-container/20 px-3 py-2.5 mb-3">
                    <span className="material-symbols-outlined text-error text-base shrink-0">
                        error
                    </span>
                    <p className="text-sm font-body text-error flex-1">{error}</p>
                    <button
                        onClick={() => setError(null)}
                        className="text-error/60 hover:text-error shrink-0">
                        <span className="material-symbols-outlined text-sm">
                            close
                        </span>
                    </button>
                </div>
            )}

            {/* Add new */}
            <div className="flex gap-2 mt-2">
                <input
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    placeholder="Nueva categoría..."
                    className={inputClass + ' flex-1'}
                />
                <button
                    onClick={handleAdd}
                    disabled={saving || !newCat.trim()}
                    className="border border-primary text-primary font-headline text-xs uppercase tracking-widest px-4 hover:bg-primary hover:text-surface transition-colors disabled:opacity-40">
                    {saving ? '...' : 'Añadir'}
                </button>
            </div>
        </div>
    );
};

// ─── Nav Manager ─────────────────────────────────────────────────────────────

const NavManager = () => {
    const [config, setConfig] = useState<SidebarConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Índices con el panel de subitems abierto en el admin
    const [expandedIdx, setExpandedIdx] = useState<Set<number>>(new Set([0]));

    // Edición inline de entrada de primer nivel
    const [editItemIdx, setEditItemIdx] = useState<number | null>(null);
    const [editItemForm, setEditItemForm] = useState({
        icon: '',
        label: '',
        path: '',
    });

    // Formulario de nueva entrada de primer nivel
    const [newItem, setNewItem] = useState({ icon: '', label: '', path: '' });

    // Edición inline de subitem — clave: `${itemIdx}-${subIdx}`
    const [editSubKey, setEditSubKey] = useState<string | null>(null);
    const [editSubForm, setEditSubForm] = useState({ label: '', path: '' });

    // Formularios de nuevo subitem, uno por entrada (keyed por itemIdx).
    // pathAutoSync=true: el path se deriva del label automáticamente
    // hasta que el usuario lo edite a mano.
    const [newSubForms, setNewSubForms] = useState<
        Record<number, { label: string; path: string; pathAutoSync: boolean }>
    >({});

    useEffect(() => {
        getSidebarConfig()
            .then((cfg) => {
                setConfig(cfg);
                if (cfg.items[0]?.submenu?.length) {
                    setExpandedIdx(new Set([0]));
                }
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

    // ── Handlers de entradas de primer nivel ──────────────────────────────────

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
        await saveConfig({
            items: config.items.filter((_, i) => i !== idx),
        });
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
        setEditItemForm({
            icon: item.icon,
            label: item.label,
            path: item.path ?? '',
        });
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

    // ── Helpers de subitems ───────────────────────────────────────────────────

    const subKey = (iIdx: number, sIdx: number) => `${iIdx}-${sIdx}`;

    /** Construye el path sugerido: padre "TCGs" + sub "Dragon Ball" → /tcgs/dragon-ball */
    const deriveSubPath = (parentLabel: string, subLabel: string) =>
        `/${toSlug(parentLabel)}/${toSlug(subLabel)}`;

    type SubForm = { label: string; path: string; pathAutoSync: boolean };

    const getSubForm = (idx: number): SubForm =>
        newSubForms[idx] ?? { label: '', path: '', pathAutoSync: true };

    const patchSubForm = (idx: number, patch: Partial<SubForm>) =>
        setNewSubForms((prev) => ({
            ...prev,
            [idx]: { ...getSubForm(idx), ...patch },
        }));

    // ── Handlers de subitems ──────────────────────────────────────────────────

    const handleAddSub = async (itemIdx: number) => {
        const form = getSubForm(itemIdx);
        const label = form.label.trim();
        const path = form.path.trim();
        if (!label || !path) return;
        const items = config.items.map((item, i): NavItem => {
            if (i !== itemIdx) return item;
            return {
                ...item,
                submenu: [...(item.submenu ?? []), { label, path }],
            };
        });
        await saveConfig({ items });
        patchSubForm(itemIdx, { label: '', path: '', pathAutoSync: true });
    };

    const handleDeleteSub = async (itemIdx: number, subIdx: number) => {
        const items = config.items.map((item, i): NavItem => {
            if (i !== itemIdx) return item;
            return {
                ...item,
                submenu: item.submenu?.filter((_, j) => j !== subIdx),
            };
        });
        await saveConfig({ items });
        if (editSubKey === subKey(itemIdx, subIdx)) setEditSubKey(null);
    };

    const handleEditSubStart = (itemIdx: number, subIdx: number) => {
        setEditSubKey(subKey(itemIdx, subIdx));
        setEditSubForm({ ...config.items[itemIdx].submenu![subIdx] });
    };

    const handleEditSubSave = async (itemIdx: number, subIdx: number) => {
        const label = editSubForm.label.trim();
        const path = editSubForm.path.trim();
        if (!label || !path) return;
        const items = config.items.map((item, i): NavItem => {
            if (i !== itemIdx) return item;
            return {
                ...item,
                submenu: item.submenu?.map((sub, j) =>
                    j === subIdx ? { label, path } : sub,
                ),
            };
        });
        await saveConfig({ items });
        setEditSubKey(null);
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="max-w-2xl">
            {/* Error banner */}
            {error && (
                <div className="flex items-center gap-2 border border-error bg-error-container/20 px-3 py-2.5 mb-6">
                    <span className="material-symbols-outlined text-error text-base shrink-0">
                        error
                    </span>
                    <p className="text-sm font-body text-error flex-1">{error}</p>
                    <button
                        onClick={() => setError(null)}
                        className="text-error/60 hover:text-error shrink-0">
                        <span className="material-symbols-outlined text-sm">
                            close
                        </span>
                    </button>
                </div>
            )}

            {/* Lista de entradas */}
            <div className="flex flex-col gap-3 mb-6">
                {config.items.length === 0 && (
                    <p className="text-sm font-body text-on-surface-variant text-center py-6">
                        Sin entradas. Añade una abajo.
                    </p>
                )}

                {config.items.map((item, idx) => (
                    <div key={idx} className="tactical-frame">
                        {/* ── Fila de primer nivel ── */}
                        {editItemIdx === idx ? (
                            /* Modo edición */
                            <div className="px-4 py-3 flex items-center gap-2 flex-wrap">
                                <span className="material-symbols-outlined text-primary text-base shrink-0">
                                    {editItemForm.icon || 'category'}
                                </span>
                                <input
                                    value={editItemForm.icon}
                                    onChange={(e) =>
                                        setEditItemForm((f) => ({
                                            ...f,
                                            icon: e.target.value,
                                        }))
                                    }
                                    placeholder="Icono"
                                    className={inputClass + ' w-32 font-mono'}
                                />
                                <input
                                    value={editItemForm.label}
                                    onChange={(e) =>
                                        setEditItemForm((f) => ({
                                            ...f,
                                            label: e.target.value,
                                        }))
                                    }
                                    placeholder="Label"
                                    className={inputClass + ' flex-1 min-w-28'}
                                />
                                <input
                                    value={editItemForm.path}
                                    onChange={(e) =>
                                        setEditItemForm((f) => ({
                                            ...f,
                                            path: e.target.value,
                                        }))
                                    }
                                    placeholder="/ruta (opcional)"
                                    className={inputClass + ' flex-1 min-w-28 font-mono'}
                                    onKeyDown={(e) =>
                                        e.key === 'Enter' && handleEditItemSave()
                                    }
                                />
                                <button
                                    onClick={handleEditItemSave}
                                    disabled={saving}
                                    className="text-primary hover:text-on-surface transition-colors disabled:opacity-40"
                                    title="Guardar">
                                    <span className="material-symbols-outlined text-sm">
                                        check
                                    </span>
                                </button>
                                <button
                                    onClick={() => setEditItemIdx(null)}
                                    className="text-on-surface-variant hover:text-on-surface transition-colors"
                                    title="Cancelar">
                                    <span className="material-symbols-outlined text-sm">
                                        close
                                    </span>
                                </button>
                            </div>
                        ) : (
                            /* Modo display */
                            <div className="px-4 py-3 flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary text-base shrink-0">
                                    {item.icon}
                                </span>
                                <span className="font-body text-sm text-on-surface flex-1">
                                    {item.label}
                                </span>
                                {item.path && (
                                    <span className="font-mono text-xs text-on-surface-variant hidden sm:block truncate max-w-32">
                                        {item.path}
                                    </span>
                                )}
                                {(item.submenu?.length ?? 0) > 0 && (
                                    <span className="text-[10px] font-headline text-primary/50 shrink-0 hidden sm:block">
                                        {item.submenu!.length} sub
                                        {item.submenu!.length !== 1 ? 's' : ''}
                                    </span>
                                )}
                                <div className="flex items-center gap-1 shrink-0">
                                    {/* Toggle submenú */}
                                    <button
                                        onClick={() => toggleExpand(idx)}
                                        disabled={saving}
                                        className={`transition-colors disabled:opacity-40 ${expandedIdx.has(idx) ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
                                        title="Gestionar submenú">
                                        <span
                                            className={`material-symbols-outlined text-sm transition-transform duration-200 ${expandedIdx.has(idx) ? 'rotate-180' : ''}`}>
                                            expand_more
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => handleEditItemStart(idx)}
                                        disabled={saving}
                                        className="text-on-surface-variant hover:text-primary transition-colors disabled:opacity-40"
                                        title="Editar">
                                        <span className="material-symbols-outlined text-sm">
                                            edit
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteItem(idx)}
                                        disabled={saving}
                                        className="text-on-surface-variant hover:text-error transition-colors disabled:opacity-40"
                                        title="Eliminar">
                                        <span className="material-symbols-outlined text-sm">
                                            delete
                                        </span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── Panel de subitems ── */}
                        {expandedIdx.has(idx) && (
                            <div className="border-t border-outline-variant/30 px-4 pb-3 pt-2 flex flex-col gap-2">
                                {(item.submenu?.length ?? 0) === 0 && (
                                    <p className="text-xs font-body text-on-surface-variant pl-3 py-1 italic">
                                        Sin subitems aún.
                                    </p>
                                )}

                                {(item.submenu ?? []).map((sub, sIdx) =>
                                    editSubKey === subKey(idx, sIdx) ? (
                                        /* Sub edición */
                                        <div
                                            key={sIdx}
                                            className="flex items-center gap-2 pl-3 border-l-2 border-primary/40">
                                            <input
                                                value={editSubForm.label}
                                                onChange={(e) =>
                                                    setEditSubForm((f) => ({
                                                        ...f,
                                                        label: e.target.value,
                                                    }))
                                                }
                                                placeholder="Label"
                                                className={inputClass + ' flex-1'}
                                                onKeyDown={(e) =>
                                                    e.key === 'Enter' &&
                                                    handleEditSubSave(idx, sIdx)
                                                }
                                            />
                                            <input
                                                value={editSubForm.path}
                                                onChange={(e) =>
                                                    setEditSubForm((f) => ({
                                                        ...f,
                                                        path: e.target.value,
                                                    }))
                                                }
                                                placeholder="/ruta"
                                                className={inputClass + ' flex-1 font-mono'}
                                                onKeyDown={(e) =>
                                                    e.key === 'Enter' &&
                                                    handleEditSubSave(idx, sIdx)
                                                }
                                            />
                                            <button
                                                onClick={() =>
                                                    handleEditSubSave(idx, sIdx)
                                                }
                                                disabled={saving}
                                                className="text-primary hover:text-on-surface transition-colors disabled:opacity-40"
                                                title="Guardar">
                                                <span className="material-symbols-outlined text-sm">
                                                    check
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => setEditSubKey(null)}
                                                className="text-on-surface-variant hover:text-on-surface transition-colors"
                                                title="Cancelar">
                                                <span className="material-symbols-outlined text-sm">
                                                    close
                                                </span>
                                            </button>
                                        </div>
                                    ) : (
                                        /* Sub display */
                                        <div
                                            key={sIdx}
                                            className="flex items-center gap-3 pl-3 border-l-2 border-outline-variant/40">
                                            <span className="text-xs text-on-surface-variant shrink-0">
                                                ▸
                                            </span>
                                            <span className="font-body text-sm text-on-surface flex-1">
                                                {sub.label}
                                            </span>
                                            <span className="font-mono text-xs text-on-surface-variant hidden sm:block">
                                                {sub.path}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    handleEditSubStart(idx, sIdx)
                                                }
                                                disabled={saving}
                                                className="text-on-surface-variant hover:text-primary transition-colors disabled:opacity-40"
                                                title="Editar">
                                                <span className="material-symbols-outlined text-sm">
                                                    edit
                                                </span>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDeleteSub(idx, sIdx)
                                                }
                                                disabled={saving}
                                                className="text-on-surface-variant hover:text-error transition-colors disabled:opacity-40"
                                                title="Eliminar">
                                                <span className="material-symbols-outlined text-sm">
                                                    delete
                                                </span>
                                            </button>
                                        </div>
                                    ),
                                )}

                                {/* Añadir subitem */}
                                <div className="flex gap-2 mt-1 pl-3 border-l-2 border-outline-variant/20">
                                    <input
                                        value={getSubForm(idx).label}
                                        onChange={(e) => {
                                            const newLabel = e.target.value;
                                            const form = getSubForm(idx);
                                            patchSubForm(idx, {
                                                label: newLabel,
                                                // Auto-deriva el path mientras el usuario no lo haya tocado
                                                ...(form.pathAutoSync && {
                                                    path: deriveSubPath(
                                                        item.label,
                                                        newLabel,
                                                    ),
                                                }),
                                            });
                                        }}
                                        placeholder="Label subitem"
                                        className={inputClass + ' flex-1'}
                                    />
                                    <input
                                        value={getSubForm(idx).path}
                                        onChange={(e) =>
                                            // El usuario edita el path → desconectar auto-sync
                                            patchSubForm(idx, {
                                                path: e.target.value,
                                                pathAutoSync: false,
                                            })
                                        }
                                        placeholder="/ruta"
                                        className={inputClass + ' flex-1 font-mono'}
                                        onKeyDown={(e) =>
                                            e.key === 'Enter' && handleAddSub(idx)
                                        }
                                    />
                                    <button
                                        onClick={() => handleAddSub(idx)}
                                        disabled={
                                            saving ||
                                            !getSubForm(idx).label.trim() ||
                                            !getSubForm(idx).path.trim()
                                        }
                                        className="border border-primary text-primary font-headline text-xs uppercase tracking-widest px-3 hover:bg-primary hover:text-surface transition-colors disabled:opacity-40">
                                        {saving ? '...' : 'Añadir'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Nueva entrada de primer nivel */}
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
                        onChange={(e) =>
                            setNewItem((f) => ({ ...f, icon: e.target.value }))
                        }
                        placeholder="Icono (ej. diamond)"
                        className={inputClass + ' w-36 font-mono'}
                    />
                    <input
                        value={newItem.label}
                        onChange={(e) =>
                            setNewItem((f) => ({ ...f, label: e.target.value }))
                        }
                        placeholder="Label"
                        className={inputClass + ' flex-1 min-w-28'}
                    />
                    <input
                        value={newItem.path}
                        onChange={(e) =>
                            setNewItem((f) => ({ ...f, path: e.target.value }))
                        }
                        placeholder="/ruta (opcional si tendrá submenú)"
                        className={inputClass + ' flex-1 min-w-36 font-mono'}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                    />
                    <button
                        onClick={handleAddItem}
                        disabled={
                            saving ||
                            !newItem.icon.trim() ||
                            !newItem.label.trim()
                        }
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
                    <span className="material-symbols-outlined text-[11px] align-middle">
                        expand_more
                    </span>{' '}
                    para añadir subitems a cualquier entrada.
                </p>
            </div>
        </div>
    );
};

// ─── Main page ────────────────────────────────────────────────────────────────

const AdminPanelPage = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const [adminView, setAdminView] = useState<'products' | 'categories' | 'nav'>(
        'products',
    );

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Árbol de nav para los filtros en cascada
    const [filterNavItems, setFilterNavItems] = useState<NavItem[]>([]);
    const [filterMenuIdx, setFilterMenuIdx] = useState<number | null>(null);
    const [filterSectionId, setFilterSectionId] = useState<string>('all');

    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

    const openAdd = () => {
        setEditingProduct(null);
        setShowForm(true);
    };
    const openEdit = (p: Product) => {
        setEditingProduct(p);
        setShowForm(true);
    };
    const closeForm = () => setShowForm(false);

    const refresh = async () => {
        setLoading(true);
        const data = await getAllProducts();
        setProducts(data);
        setLoading(false);
    };

    useEffect(() => {
        refresh();
        getSidebarConfig().then((cfg) => setFilterNavItems(cfg.items));
    }, []);

    const handleSignOut = async () => {
        await signOut();
        navigate('/cosmos-admin', { replace: true });
    };

    // IDs de sección que pertenecen al menú seleccionado
    const selectedMenu =
        filterMenuIdx !== null ? filterNavItems[filterMenuIdx] : null;
    const menuSectionIds: string[] = selectedMenu
        ? (selectedMenu.submenu?.length ?? 0) > 0
            ? selectedMenu.submenu!.map((sub) => pathToSectionId(sub.path))
            : selectedMenu.path
              ? [pathToSectionId(selectedMenu.path)]
              : [toSlug(selectedMenu.label)]
        : [];

    const visible = products.filter((p) => {
        if (filterMenuIdx === null) return true;
        if (filterSectionId !== 'all') return p.tcg === filterSectionId;
        return menuSectionIds.includes(p.tcg);
    });

    return (
        <div className="min-h-screen bg-surface text-on-surface">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b-2 border-[#e0e0ff] bg-primary-container px-6 py-3 flex items-center justify-between shadow-[inset_0_0_8px_rgba(0,1,172,1)]">
                <div>
                    <p className="text-[10px] font-headline text-primary/60 tracking-[0.3em] uppercase">
                        COSMOS-ADMIN
                    </p>
                    <p className="font-headline font-bold text-on-surface uppercase tracking-widest text-sm">
                        Panel de Control
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-headline text-on-surface-variant hidden sm:block">
                        {user?.email}
                    </span>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-1.5 border border-outline-variant text-on-surface-variant font-headline text-[10px] uppercase tracking-widest px-3 py-1.5 hover:border-primary hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-sm">
                            logout
                        </span>
                        Salir
                    </button>
                </div>
            </header>

            {/* View tabs */}
            <div className="border-b border-outline-variant/30 px-6 flex gap-0">
                {(
                    [
                        { id: 'products', label: 'Productos', icon: 'inventory' },
                        {
                            id: 'categories',
                            label: 'Categorías',
                            icon: 'folder',
                        },
                        {
                            id: 'nav',
                            label: 'Navegación',
                            icon: 'menu',
                        },
                    ] as const
                ).map(({ id, label, icon }) => (
                    <button
                        key={id}
                        onClick={() => setAdminView(id)}
                        className={`flex items-center gap-2 px-4 py-3 font-headline text-xs uppercase tracking-widest border-b-2 transition-all ${
                            adminView === id
                                ? 'border-primary text-primary'
                                : 'border-transparent text-on-surface-variant hover:text-on-surface'
                        }`}>
                        <span className="material-symbols-outlined text-sm">
                            {icon}
                        </span>
                        {label}
                    </button>
                ))}
            </div>

            <div className="p-6">
                {/* Toolbar — solo en vista productos */}
                {adminView === 'categories' && (
                    <CategoriesManager />
                )}
                {adminView === 'nav' && (
                    <NavManager />
                )}
                {adminView === 'products' && (
                <>
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                    {/* Filtros en cascada: menú → sección */}
                    <div className="flex flex-col gap-2">
                        {/* Nivel 1: menús */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => {
                                    setFilterMenuIdx(null);
                                    setFilterSectionId('all');
                                }}
                                className={`px-3 py-1.5 font-headline text-xs uppercase tracking-wider border transition-all ${
                                    filterMenuIdx === null
                                        ? 'border-primary text-primary bg-surface-container'
                                        : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                                }`}>
                                Todos
                            </button>
                            {filterNavItems.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setFilterMenuIdx(idx);
                                        setFilterSectionId('all');
                                    }}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 font-headline text-xs uppercase tracking-wider border transition-all ${
                                        filterMenuIdx === idx
                                            ? 'border-primary text-primary bg-surface-container'
                                            : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                                    }`}>
                                    <span className="material-symbols-outlined text-sm">
                                        {item.icon}
                                    </span>
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {/* Nivel 2: subitems (solo si el menú seleccionado tiene submenú) */}
                        {(selectedMenu?.submenu?.length ?? 0) > 0 && (
                            <div className="flex flex-wrap gap-2 pl-2 border-l-2 border-primary/30">
                                <button
                                    onClick={() => setFilterSectionId('all')}
                                    className={`px-3 py-1 font-headline text-[11px] uppercase tracking-wider border transition-all ${
                                        filterSectionId === 'all'
                                            ? 'border-primary text-primary bg-surface-container'
                                            : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                                    }`}>
                                    Todos
                                </button>
                                {selectedMenu!.submenu!.map((sub) => {
                                    const id = pathToSectionId(sub.path);
                                    return (
                                        <button
                                            key={id}
                                            onClick={() => setFilterSectionId(id)}
                                            className={`px-3 py-1 font-headline text-[11px] uppercase tracking-wider border transition-all ${
                                                filterSectionId === id
                                                    ? 'border-primary text-primary bg-surface-container'
                                                    : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                                            }`}>
                                            {sub.label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Add button */}
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 border border-primary text-primary font-headline text-xs uppercase tracking-widest px-4 py-2 hover:bg-primary hover:text-surface transition-colors">
                        <span className="material-symbols-outlined text-sm">
                            add
                        </span>
                        Nuevo producto
                    </button>
                </div>

                {/* Product count */}
                <p className="text-[10px] font-headline text-on-surface-variant uppercase tracking-widest mb-4">
                    <span className="w-1.5 h-1.5 bg-primary animate-ping inline-block mr-2" />
                    {visible.length} producto{visible.length !== 1 ? 's' : ''}
                </p>

                {/* Table */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <span className="material-symbols-outlined text-primary text-4xl animate-spin">
                            progress_activity
                        </span>
                    </div>
                ) : visible.length === 0 ? (
                    <div className="tactical-frame p-8 text-center text-on-surface-variant font-body text-sm">
                        No hay productos.
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {visible.map((product) => (
                            <div
                                key={product.id}
                                className="tactical-frame p-4 flex items-center gap-4">
                                {/* Thumbnail */}
                                <ProductImage
                                    src={product.image}
                                    className="w-14 h-14 shrink-0"
                                />

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                        <span className="text-[9px] font-headline uppercase tracking-widest text-primary/60">
                                            {product.tcg}
                                        </span>
                                        {product.badge && (
                                            <span
                                                className={`px-1.5 py-0.5 text-[8px] font-headline border ${product.badgeColor} text-[#e0e0ff]`}>
                                                {product.badge}
                                            </span>
                                        )}
                                        {product.featured && (
                                            <span className="text-[9px] font-headline text-primary">
                                                ★ Destacado
                                            </span>
                                        )}
                                    </div>
                                    <p className="font-headline font-bold text-sm text-on-surface uppercase truncate">
                                        {product.name}
                                    </p>
                                    <p className="text-[10px] text-on-surface-variant font-body">
                                        {product.set} · {product.category}
                                    </p>
                                </div>

                                {/* Price + Stock */}
                                <div className="text-right shrink-0 hidden sm:block">
                                    <p className="font-headline font-bold text-primary text-sm">
                                        {product.price}
                                    </p>
                                    <p className="text-[10px] text-on-surface-variant font-body">
                                        Stock: {product.stock}/
                                        {product.maxStock}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => openEdit(product)}
                                        className="border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary p-1.5 transition-colors"
                                        title="Editar">
                                        <span className="material-symbols-outlined text-sm">
                                            edit
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => setDeleteTarget(product)}
                                        className="border border-outline-variant text-on-surface-variant hover:border-error hover:text-error p-1.5 transition-colors"
                                        title="Eliminar">
                                        <span className="material-symbols-outlined text-sm">
                                            delete
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                </>
                )}
            </div>

            {/* Modals */}
            {showForm && (
                <ProductFormModal
                    initial={editingProduct}
                    onClose={closeForm}
                    onSaved={() => {
                        closeForm();
                        refresh();
                    }}
                />
            )}

            {deleteTarget && (
                <DeleteConfirmModal
                    product={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onDeleted={() => {
                        setDeleteTarget(null);
                        refresh();
                    }}
                />
            )}
        </div>
    );
};

export default AdminPanelPage;
