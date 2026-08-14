import ToggleGroup from './ToggleGroup';
import type { ProductForm } from './productPayload';

type CheckboxProps = {
    checked: boolean;
    label: string;
    hint?: string;
    boxed?: boolean;
    onChange: (checked: boolean) => void;
};

const Checkbox = ({ checked, label, hint, boxed, onChange }: CheckboxProps) => (
    <label
        className={`flex items-center gap-3 cursor-pointer ${
            boxed ? 'border border-dashed border-outline-variant/40 p-3' : ''
        }`}>
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 accent-primary"
        />
        <div className="flex flex-col">
            <span className="font-headline text-xs uppercase tracking-widest text-on-surface-variant">
                {label}
            </span>
            {hint && (
                <span className="font-body text-[10px] text-on-surface-variant/60">
                    {hint}
                </span>
            )}
        </div>
    </label>
);

type Props = {
    form: ProductForm;
    onChange: <K extends keyof ProductForm>(
        key: K,
        value: ProductForm[K],
    ) => void;
};

/** Visibilidad, destacado y reservable. */
const ProductFlagsFields = ({ form, onChange }: Props) => (
    <>
        <ToggleGroup
            label="Visibilidad"
            value={form.visible ?? true}
            onChange={(v) => onChange('visible', v)}
            options={[
                {
                    value: true,
                    label: 'Visible',
                    icon: 'visibility',
                    activeClass: 'border-primary bg-primary/10 text-primary',
                },
                {
                    value: false,
                    label: 'Oculto',
                    icon: 'visibility_off',
                    activeClass:
                        'border-yellow-500 bg-yellow-500/10 text-yellow-400',
                },
            ]}
        />

        <Checkbox
            checked={form.featured ?? false}
            label="Producto destacado"
            onChange={(v) => onChange('featured', v)}
        />

        <Checkbox
            boxed
            checked={form.reservable ?? false}
            label="Producto reservable"
            hint="Aparecerá en la sección de reservas pública"
            onChange={(v) => onChange('reservable', v)}
        />
    </>
);

export default ProductFlagsFields;
