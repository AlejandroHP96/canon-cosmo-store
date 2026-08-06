import { labelClass } from '../adminStyles';

type Option = {
    value: boolean;
    label: string;
    icon: string;
    /** Clases del estado activo. El valor `true` usa siempre el color primary. */
    activeClass: string;
};

type Props = {
    label: string;
    value: boolean;
    options: [Option, Option];
    onChange: (value: boolean) => void;
};

/** Par de botones excluyentes (disponibilidad, visibilidad…). */
const ToggleGroup = ({ label, value, options, onChange }: Props) => (
    <div>
        <label className={labelClass}>{label}</label>
        <div className="grid grid-cols-2 gap-2">
            {options.map((opt) => (
                <button
                    key={opt.label}
                    type="button"
                    onClick={() => onChange(opt.value)}
                    className={`flex items-center justify-center gap-1.5 py-2.5 border font-headline text-[10px] uppercase tracking-widest transition-all ${
                        value === opt.value
                            ? opt.activeClass
                            : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                    }`}>
                    <span className="material-symbols-outlined text-sm">{opt.icon}</span>
                    {opt.label}
                </button>
            ))}
        </div>
    </div>
);

export default ToggleGroup;
