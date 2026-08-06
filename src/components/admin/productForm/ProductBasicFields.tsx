import { inputClass, labelClass } from '../adminStyles';
import type { ProductForm } from './productPayload';

type Props = {
    form: ProductForm;
    categories: string[];
    onChange: <K extends keyof ProductForm>(key: K, value: ProductForm[K]) => void;
};

/** Nombre, set, categoría, descripción e imagen. */
const ProductBasicFields = ({ form, categories, onChange }: Props) => (
    <>
        <div>
            <label className={labelClass}>Nombre</label>
            <input
                required
                value={form.name}
                onChange={(e) => onChange('name', e.target.value)}
                className={inputClass}
            />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
                <label className={labelClass}>Set / Expansión</label>
                <input
                    value={form.set ?? ''}
                    onChange={(e) => onChange('set', e.target.value)}
                    className={inputClass}
                />
            </div>
            {categories.length > 0 && (
                <div>
                    <label className={labelClass}>Categoría</label>
                    <select
                        value={form.category}
                        onChange={(e) => onChange('category', e.target.value)}
                        className={inputClass}>
                        <option value="">Sin categoría</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>

        <div>
            <label className={labelClass}>Descripción</label>
            <textarea
                value={form.description ?? ''}
                onChange={(e) => onChange('description', e.target.value)}
                rows={3}
                className={inputClass + ' resize-none'}
            />
        </div>
    </>
);

export default ProductBasicFields;
