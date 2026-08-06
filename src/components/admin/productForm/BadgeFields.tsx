import { BADGE_OPTIONS, inputClass, labelClass } from '../adminStyles';
import PriceInput from './PriceInput';

type Props = {
    badge: string;
    badgeColor: string;
    badgeText: string;
    salePriceInput: string;
    onBadgeChange: (badge: string, badgeColor: string) => void;
    onBadgeTextChange: (value: string) => void;
    onSalePriceChange: (raw: string, parsed: number | undefined) => void;
};

/** Badge del producto y los campos que dependen de él (texto personalizado, precio de oferta). */
const BadgeFields = ({
    badge,
    badgeColor,
    badgeText,
    salePriceInput,
    onBadgeChange,
    onBadgeTextChange,
    onSalePriceChange,
}: Props) => {
    const selected = BADGE_OPTIONS.find((o) => o.badgeColor === badgeColor) ?? BADGE_OPTIONS[0];

    return (
        <>
            <div className="flex items-end gap-3">
                <div className="flex-1">
                    <label className={labelClass}>Badge</label>
                    <select
                        value={selected.badgeColor}
                        onChange={(e) => {
                            const opt = BADGE_OPTIONS.find((o) => o.badgeColor === e.target.value)!;
                            onBadgeChange(opt.badge, opt.badgeColor);
                        }}
                        className={inputClass}>
                        {BADGE_OPTIONS.map((o) => (
                            <option key={o.label} value={o.badgeColor}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                </div>
                {badge && (
                    <span
                        className={`mb-0.5 px-2 py-1 text-[9px] font-headline border ${selected.badgeColor} text-[#e0e0ff] shrink-0`}>
                        {badge}
                    </span>
                )}
            </div>

            {selected.badge === 'PRÓXIMAMENTE' && (
                <div>
                    <label className={labelClass}>Texto a mostrar en el producto</label>
                    <input
                        value={badgeText}
                        onChange={(e) => onBadgeTextChange(e.target.value)}
                        placeholder="Ej: Disponible en julio"
                        className={inputClass}
                    />
                </div>
            )}

            {badge === 'OFERTA' && (
                <PriceInput
                    label="Precio de oferta"
                    value={salePriceInput}
                    placeholder="3,99"
                    highlight
                    onChange={onSalePriceChange}
                />
            )}
        </>
    );
};

export default BadgeFields;
