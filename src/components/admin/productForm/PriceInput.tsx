import { inputClass, labelClass } from '../adminStyles';
import { parsePriceInput } from '../../../lib/price';

type Props = {
    label: string;
    /** Texto crudo del input: se mantiene aparte del number para poder escribir '4,'. */
    value: string;
    placeholder: string;
    required?: boolean;
    /** Variante naranja para el precio de oferta. */
    highlight?: boolean;
    onChange: (raw: string, parsed: number | undefined) => void;
};

const PriceInput = ({
    label,
    value,
    placeholder,
    required,
    highlight,
    onChange,
}: Props) => {
    const border = highlight
        ? ' border-r-0 border-[#ffb074]/60 focus:border-[#ffb074]'
        : ' border-r-0';
    const suffix = highlight
        ? 'border-[#ffb074]/60 bg-[#7a3500]/30 text-[#ffb074]'
        : 'border-outline-variant bg-surface-container text-on-surface-variant';

    return (
        <div>
            <label className={labelClass}>{label}</label>
            <div className="flex items-center">
                <input
                    required={required}
                    inputMode="decimal"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) =>
                        onChange(
                            e.target.value,
                            parsePriceInput(e.target.value),
                        )
                    }
                    className={inputClass + border}
                />
                <span
                    className={`shrink-0 border px-3 py-2 text-sm font-body ${suffix}`}>
                    €
                </span>
            </div>
        </div>
    );
};

export default PriceInput;
