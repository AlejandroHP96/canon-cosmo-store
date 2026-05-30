import { useEffect, useState } from 'react';
import { getCategoriesByTcg, updateCategoriesByTcg } from '../../services/categoriesService';
import { getSidebarConfig, type NavItem } from '../../services/navService';
import { pathToSectionId, toSlug } from '../../lib/tcgUtils';
import { inputClass } from './adminStyles';

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
    const [editingCat, setEditingCat] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    useEffect(() => {
        getSidebarConfig()
            .then((cfg) => { setNavItems(cfg.items); setNavReady(true); })
            .catch(() => setError('Error al cargar la configuración.'));
    }, []);

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

    const handleRemove = (cat: string) => save(categories.filter((c) => c !== cat));

    const startEdit = (cat: string) => { setEditingCat(cat); setEditValue(cat); setError(null); };
    const cancelEdit = () => { setEditingCat(null); setEditValue(''); };

    const handleRename = async () => {
        const trimmed = editValue.trim();
        if (!trimmed || trimmed === editingCat) { cancelEdit(); return; }
        if (categories.includes(trimmed)) {
            setError(`"${trimmed}" ya existe en la lista.`);
            return;
        }
        await save(categories.map((c) => (c === editingCat ? trimmed : c)));
        cancelEdit();
    };

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
                        onClick={() => { setMenuIdx(idx); setSubIdx(0); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 font-headline text-xs uppercase tracking-wider border transition-all ${
                            menuIdx === idx
                                ? 'border-primary text-primary bg-surface-container'
                                : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                        }`}>
                        <span className="material-symbols-outlined text-sm">{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Nivel 2: subitems */}
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
                        <div key={cat} className="tactical-frame px-3 py-2 flex items-center gap-2">
                            {editingCat === cat ? (
                                <>
                                    <input
                                        autoFocus
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleRename();
                                            if (e.key === 'Escape') cancelEdit();
                                        }}
                                        className={inputClass + ' flex-1 py-1 text-sm'}
                                    />
                                    <button
                                        onClick={handleRename}
                                        disabled={saving}
                                        className="text-primary hover:text-on-surface transition-colors disabled:opacity-40"
                                        title="Guardar">
                                        <span className="material-symbols-outlined text-sm">check</span>
                                    </button>
                                    <button
                                        onClick={cancelEdit}
                                        className="text-on-surface-variant hover:text-on-surface transition-colors"
                                        title="Cancelar">
                                        <span className="material-symbols-outlined text-sm">close</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span className="font-body text-sm text-on-surface flex-1">{cat}</span>
                                    <button
                                        onClick={() => startEdit(cat)}
                                        disabled={saving}
                                        className="text-on-surface-variant hover:text-primary transition-colors disabled:opacity-40"
                                        title="Editar">
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleRemove(cat)}
                                        disabled={saving}
                                        className="text-on-surface-variant hover:text-error transition-colors disabled:opacity-40"
                                        title="Eliminar">
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <div className="flex items-center gap-2 border border-error bg-error-container/20 px-3 py-2.5 mb-3">
                    <span className="material-symbols-outlined text-error text-base shrink-0">error</span>
                    <p className="text-sm font-body text-error flex-1">{error}</p>
                    <button onClick={() => setError(null)} className="text-error/60 hover:text-error shrink-0">
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                </div>
            )}

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

export default CategoriesManager;
