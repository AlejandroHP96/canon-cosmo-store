import { useEffect, useState } from 'react';
import { getCategoriesByTcg, updateCategoriesByTcg } from '../../../services/categoriesService';
import { useSectionSelector } from '../../../hooks/useSectionSelector';
import { inputClass } from '../adminStyles';
import ErrorBanner from '../../ErrorBanner';
import Spinner from '../../Spinner';
import SectionTabs from './SectionTabs';
import CategoryRow from './CategoryRow';
import {
    anadirCategoria,
    quitarCategoria,
    renombrarCategoria,
    validarNombre,
} from './categoryRules';

const CategoriesManager = () => {
    const section = useSectionSelector('');

    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newCat, setNewCat] = useState('');
    const [editingCat, setEditingCat] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    useEffect(() => {
        if (!section.sectionId) return;
        let cancelled = false;
        setLoading(true);
        getCategoriesByTcg(section.sectionId)
            .then((cats) => {
                if (!cancelled) setCategories(cats);
            })
            .catch(() => {
                if (!cancelled) setError('Error al cargar categorías.');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        // Evita que la respuesta de la sección anterior pise a la nueva
        return () => {
            cancelled = true;
        };
    }, [section.sectionId]);

    const save = async (updated: string[]) => {
        setSaving(true);
        setError(null);
        try {
            await updateCategoriesByTcg(section.sectionId, updated);
            setCategories(updated);
            return true;
        } catch {
            setError('Error al guardar. Inténtalo de nuevo.');
            return false;
        } finally {
            setSaving(false);
        }
    };

    const handleAdd = async () => {
        if (!newCat.trim()) return;
        const problema = validarNombre(categories, newCat);
        if (problema) {
            setError(problema);
            return;
        }
        if (await save(anadirCategoria(categories, newCat))) setNewCat('');
    };

    const cancelEdit = () => {
        setEditingCat(null);
        setEditValue('');
    };

    const handleRename = async () => {
        if (!editingCat) return;
        if (!editValue.trim() || editValue.trim() === editingCat) {
            cancelEdit();
            return;
        }
        const problema = validarNombre(categories, editValue, editingCat);
        if (problema) {
            setError(problema);
            return;
        }
        if (await save(renombrarCategoria(categories, editingCat, editValue))) cancelEdit();
    };

    if (!section.navReady) return <Spinner />;

    return (
        <div className="max-w-lg">
            <SectionTabs
                navItems={section.navItems}
                subOptions={section.subOptions}
                menuIdx={section.menuIdx}
                subIdx={section.subIdx}
                onSelectMenu={section.selectMenu}
                onSelectSub={section.setSubIdx}
            />

            {loading ? (
                <Spinner />
            ) : categories.length === 0 ? (
                <p className="text-sm font-body text-on-surface-variant text-center py-6">
                    Sin categorías. Añade una abajo.
                </p>
            ) : (
                <div className="flex flex-col gap-2 mb-4">
                    {categories.map((cat) => (
                        <CategoryRow
                            key={cat}
                            categoria={cat}
                            editing={editingCat === cat}
                            editValue={editValue}
                            saving={saving}
                            onEditValueChange={setEditValue}
                            onStartEdit={() => {
                                setEditingCat(cat);
                                setEditValue(cat);
                                setError(null);
                            }}
                            onRename={handleRename}
                            onCancelEdit={cancelEdit}
                            onRemove={() => save(quitarCategoria(categories, cat))}
                        />
                    ))}
                </div>
            )}

            <ErrorBanner message={error} onDismiss={() => setError(null)} className="mb-3" />

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
