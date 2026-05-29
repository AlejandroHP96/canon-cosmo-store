import { useEffect, useState } from 'react';
import { deleteField } from 'firebase/firestore';
import { addProduct, updateProduct } from '../../services/productsService';
import { getCategoriesByTcg } from '../../services/categoriesService';
import { getSidebarConfig, type NavItem } from '../../services/navService';
import { pathToSectionId, toSlug } from '../../lib/tcgUtils';
import type { Product } from '../../types';
import { inputClass, labelClass, BADGE_OPTIONS } from './adminStyles';

type FormData = Omit<Product, 'id'>;

const EMPTY_FORM: FormData = {
    tcg: 'pokemon',
    name: '',
    set: '',
    price: '',
    category: '',
    badge: '',
    badgeColor: '',
    inStock: true,
    image: '',
    featured: false,
    visible: true,
};

type Props = {
    initial: Product | null;
    onClose: () => void;
    onSaved: () => void;
};

const ProductFormModal = ({ initial, onClose, onSaved }: Props) => {
    const isEdit = initial !== null;
    const [form, setForm] = useState<FormData>(initial ? { ...initial } : { ...EMPTY_FORM });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<string[]>([]);

    const [navItems, setNavItems] = useState<NavItem[]>([]);
    const [menuIdx, setMenuIdx] = useState(0);
    const [subIdx, setSubIdx] = useState(0);
    const [navReady, setNavReady] = useState(false);

    const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    useEffect(() => {
        getSidebarConfig().then((cfg) => {
            const items = cfg.items;
            setNavItems(items);
            let mIdx = 0;
            let sIdx = 0;
            outer: for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.path && pathToSectionId(item.path) === form.tcg) {
                    mIdx = i;
                    break outer;
                }
                if (!item.path && !(item.submenu?.length) && toSlug(item.label) === form.tcg) {
                    mIdx = i;
                    break outer;
                }
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
            set('tcg', toSlug(menu.label));
        }
    }, [menuIdx, subIdx, navReady]); // eslint-disable-line react-hooks/exhaustive-deps

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
            const raw: FormData = { ...form };
            if (isEdit) {
                const updatePayload: Record<string, string | number | boolean | ReturnType<typeof deleteField> | undefined> = {
                    ...Object.fromEntries(Object.entries(raw).filter(([, v]) => v !== undefined && v !== '')),
                    badge: raw.badge || deleteField(),
                    badgeColor: raw.badgeColor || deleteField(),
                    image: raw.image || deleteField(),
                };
                await updateProduct(initial!.id, updatePayload);
            } else {
                const addPayload = Object.fromEntries(
                    Object.entries(raw).filter(([, v]) => v !== undefined && v !== ''),
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
    const selectedPath = subOptions.length > 0
        ? subOptions[Math.min(subIdx, subOptions.length - 1)]?.path ?? ''
        : navItems[menuIdx]?.path ?? '';
    const isTcgSection = selectedPath.startsWith('/tcgs/');
    const selectedBadge = BADGE_OPTIONS.find((o) => o.badge === (form.badge ?? ''));

    return (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-2">
            <div className="tactical-frame p-6 w-full max-w-2xl max-h-[96vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-headline font-bold text-lg text-on-surface uppercase tracking-widest">
                        {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
                    </h2>
                    <button onClick={onClose} className="text-on-surface-variant hover:text-primary">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Sección del catálogo */}
                    <div className="border border-outline-variant/50 p-3 flex flex-col gap-2">
                        <p className={labelClass}>Sección del catálogo</p>
                        <div className={`grid gap-2 items-center ${subOptions.length > 0 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            <div className="flex items-center gap-2">
                                {navItems[menuIdx] && (
                                    <span className="material-symbols-outlined text-primary text-base shrink-0">
                                        {navItems[menuIdx].icon}
                                    </span>
                                )}
                                <select
                                    value={menuIdx}
                                    onChange={(e) => { setMenuIdx(Number(e.target.value)); setSubIdx(0); }}
                                    className={inputClass}
                                    disabled={!navReady}>
                                    {navItems.map((item, i) => (
                                        <option key={i} value={i}>{item.label}</option>
                                    ))}
                                    {!navReady && <option>Cargando...</option>}
                                </select>
                            </div>
                            {subOptions.length > 0 && (
                                <select
                                    value={subIdx}
                                    onChange={(e) => setSubIdx(Number(e.target.value))}
                                    className={inputClass}>
                                    {subOptions.map((sub, i) => (
                                        <option key={i} value={i}>{sub.label}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>

                    {/* Nombre */}
                    <div>
                        <label className={labelClass}>Nombre</label>
                        <input
                            required
                            value={form.name}
                            onChange={(e) => set('name', e.target.value)}
                            className={inputClass}
                        />
                    </div>

                    {/* Set + Categoría */}
                    <div className={`grid gap-3 ${isTcgSection ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {isTcgSection && (
                            <div>
                                <label className={labelClass}>Set / Expansión</label>
                                <input
                                    required
                                    value={form.set}
                                    onChange={(e) => set('set', e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                        )}
                        <div>
                            <label className={labelClass}>Categoría</label>
                            <select
                                required
                                value={form.category}
                                onChange={(e) => set('category', e.target.value)}
                                className={inputClass}
                                disabled={categories.length === 0}>
                                {categories.length === 0 && <option value="">Cargando...</option>}
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Precio + Disponibilidad */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelClass}>Precio</label>
                            <div className="flex items-center">
                                <input
                                    required
                                    placeholder="4,99"
                                    value={form.price.replace(/ ?€$/, '')}
                                    onChange={(e) =>
                                        set('price', e.target.value ? `${e.target.value.trim()} €` : '')
                                    }
                                    className={inputClass + ' border-r-0'}
                                />
                                <span className="shrink-0 border border-outline-variant bg-surface-container px-3 py-2 text-sm text-on-surface-variant font-body">
                                    €
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Disponibilidad</label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { value: true, label: 'DISPONIBLE', icon: 'check_circle' },
                                    { value: false, label: 'AGOTADO', icon: 'remove_shopping_cart' },
                                ].map(({ value, label, icon }) => {
                                    const active = (form.inStock ?? true) === value;
                                    return (
                                        <button
                                            key={label}
                                            type="button"
                                            onClick={() => set('inStock', value)}
                                            className={`flex items-center justify-center gap-1.5 py-2.5 border font-headline text-[10px] uppercase tracking-widest transition-all ${
                                                active
                                                    ? value
                                                        ? 'border-primary bg-primary/10 text-primary'
                                                        : 'border-error bg-error/10 text-error'
                                                    : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                                            }`}>
                                            <span className="material-symbols-outlined text-sm">{icon}</span>
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* URL de imagen */}
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
                    <div className="flex items-end gap-3">
                        <div className="flex-1">
                            <label className={labelClass}>Badge</label>
                            <select
                                value={form.badge ?? ''}
                                onChange={(e) => {
                                    const opt = BADGE_OPTIONS.find((o) => o.badge === e.target.value)!;
                                    set('badge', opt.badge);
                                    set('badgeColor', opt.badgeColor);
                                }}
                                className={inputClass}>
                                {BADGE_OPTIONS.map((o) => (
                                    <option key={o.label} value={o.badge}>{o.label}</option>
                                ))}
                            </select>
                        </div>
                        {selectedBadge?.badge && (
                            <span className={`mb-0.5 px-2 py-1 text-[9px] font-headline border ${selectedBadge.badgeColor} text-[#e0e0ff] shrink-0`}>
                                {selectedBadge.badge}
                            </span>
                        )}
                    </div>

                    {/* Visibilidad */}
                    <div>
                        <label className={labelClass}>Visibilidad</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { value: true,  label: 'Visible',  icon: 'visibility' },
                                { value: false, label: 'Oculto',   icon: 'visibility_off' },
                            ].map(({ value, label, icon }) => {
                                const active = (form.visible ?? true) === value;
                                return (
                                    <button
                                        key={label}
                                        type="button"
                                        onClick={() => set('visible', value)}
                                        className={`flex items-center justify-center gap-1.5 py-2.5 border font-headline text-[10px] uppercase tracking-widest transition-all ${
                                            active
                                                ? value
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-yellow-500 bg-yellow-500/10 text-yellow-400'
                                                : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                                        }`}>
                                        <span className="material-symbols-outlined text-sm">{icon}</span>
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Destacado */}
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
                            <span className="material-symbols-outlined text-sm">error</span>
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
                            {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear producto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductFormModal;
