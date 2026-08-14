import { useEffect, useRef, useState } from 'react';
import Modal from '../../Modal';
import { addProduct, updateProduct } from '../../../services/productsService';
import { getCategoriesByTcg } from '../../../services/categoriesService';
import { toPriceInput } from '../../../lib/price';
import type { Product } from '../../../types';
import { inputClass, labelClass } from '../adminStyles';
import {
    buildAddPayload,
    buildUpdatePayload,
    EMPTY_PRODUCT_FORM,
    type ProductForm,
} from './productPayload';
import { useSectionSelector } from '../../../hooks/useSectionSelector';
import SectionSelector from './SectionSelector';
import PriceInput from './PriceInput';
import ToggleGroup from './ToggleGroup';
import ProductBasicFields from './ProductBasicFields';
import ProductFlagsFields from './ProductFlagsFields';
import BadgeFields from './BadgeFields';
import ProductFormActions from './ProductFormActions';

type Props = {
    initial: Product | null;
    forceCreate?: boolean;
    onClose: () => void;
    onSaved: () => void;
    onSavedContinue?: () => void;
};

const ProductFormModal = ({
    initial,
    forceCreate,
    onClose,
    onSaved,
    onSavedContinue,
}: Props) => {
    const isEdit = initial !== null && !forceCreate;
    const [form, setForm] = useState<ProductForm>(
        initial
            ? { ...EMPTY_PRODUCT_FORM, ...initial }
            : { ...EMPTY_PRODUCT_FORM },
    );
    const [priceInput, setPriceInput] = useState(() =>
        toPriceInput(initial?.price),
    );
    const [salePriceInput, setSalePriceInput] = useState(() =>
        toPriceInput(initial?.salePrice),
    );
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastSaved, setLastSaved] = useState<string | null>(null);
    const continueMode = useRef(false);
    const [categories, setCategories] = useState<string[]>([]);

    const section = useSectionSelector(initial?.tcg ?? 'pokemon');

    const set = <K extends keyof ProductForm>(key: K, value: ProductForm[K]) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    useEffect(() => {
        if (!section.sectionId) return;
        getCategoriesByTcg(section.sectionId).then((cats) => {
            setCategories(cats);
            // La categoría anterior puede no existir en la nueva sección
            setForm((prev) => {
                if (cats.length > 0 && !cats.includes(prev.category)) {
                    return { ...prev, category: cats[0] };
                }
                if (cats.length === 0 && prev.category)
                    return { ...prev, category: '' };
                return prev;
            });
        });
    }, [section.sectionId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isContinue = continueMode.current;
        continueMode.current = false;
        setError(null);
        setLastSaved(null);
        setSaving(true);
        try {
            if (isEdit) {
                await updateProduct(
                    initial!.id,
                    buildUpdatePayload(form, section.sectionId),
                );
            } else {
                await addProduct(buildAddPayload(form, section.sectionId));
            }
            if (isContinue) {
                setLastSaved(form.name);
                set('name', '');
                onSavedContinue?.();
            } else {
                onSaved();
            }
        } catch {
            setError('Error al guardar. Inténtalo de nuevo.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            onClose={onClose}
            title={isEdit ? 'Editar producto' : 'Nuevo producto'}
            backdropClass="bg-black/70 p-2"
            panelClass="tactical-frame p-4 sm:p-6 w-full max-w-2xl max-h-[96vh] overflow-y-auto"
            disableBackdropClose={saving}>
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
                <SectionSelector
                    navItems={section.navItems}
                    navReady={section.navReady}
                    menuIdx={section.menuIdx}
                    subIdx={section.subIdx}
                    subOptions={section.subOptions}
                    onSelectMenu={section.selectMenu}
                    onSelectSub={section.setSubIdx}
                />

                <ProductBasicFields
                    form={form}
                    categories={categories}
                    onChange={set}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <PriceInput
                        label={`Precio${form.reservable ? ' (opcional si aún no lo sabes)' : ''}`}
                        value={priceInput}
                        placeholder="4,99"
                        required={!form.reservable}
                        onChange={(raw, parsed) => {
                            setPriceInput(raw);
                            set('price', parsed);
                        }}
                    />
                    <ToggleGroup
                        label="Disponibilidad"
                        value={form.inStock ?? true}
                        onChange={(v) => set('inStock', v)}
                        options={[
                            {
                                value: true,
                                label: 'DISPONIBLE',
                                icon: 'check_circle',
                                activeClass:
                                    'border-primary bg-primary/10 text-primary',
                            },
                            {
                                value: false,
                                label: 'AGOTADO',
                                icon: 'remove_shopping_cart',
                                activeClass:
                                    'border-error bg-error/10 text-error',
                            },
                        ]}
                    />
                </div>

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

                <BadgeFields
                    badge={form.badge ?? ''}
                    badgeColor={form.badgeColor ?? ''}
                    badgeText={form.badgeText ?? ''}
                    salePriceInput={salePriceInput}
                    onBadgeChange={(badge, badgeColor) => {
                        setForm((prev) => ({
                            ...prev,
                            badge,
                            badgeColor,
                            ...(badge !== 'OFERTA' && { salePrice: undefined }),
                            ...(badge !== 'PRÓXIMAMENTE' && { badgeText: '' }),
                        }));
                        if (badge !== 'OFERTA') setSalePriceInput('');
                    }}
                    onBadgeTextChange={(v) => set('badgeText', v)}
                    onSalePriceChange={(raw, parsed) => {
                        setSalePriceInput(raw);
                        set('salePrice', parsed);
                    }}
                />

                <ProductFlagsFields form={form} onChange={set} />

                {error && (
                    <p className="text-xs font-body text-error flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                            error
                        </span>
                        {error}
                    </p>
                )}
                {lastSaved && !error && (
                    <p className="text-xs font-body text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                            check_circle
                        </span>
                        «{lastSaved}» guardado. Puedes añadir el siguiente.
                    </p>
                )}

                <ProductFormActions
                    isEdit={isEdit}
                    saving={saving}
                    showContinue={!isEdit && !!onSavedContinue}
                    onCancel={onClose}
                    onContinue={() => {
                        continueMode.current = true;
                    }}
                />
            </form>
        </Modal>
    );
};

export default ProductFormModal;
