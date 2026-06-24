import { useEffect, useRef } from 'react';
import { COLOR_PALETTE } from './colorPalette';

type ColorPickerPopoverProps = {
    value: string;
    onChange: (color: string) => void;
    onClose: () => void;
};

/** Popover con paleta de colores predefinidos + selector libre. */
const ColorPickerPopover = ({ value, onChange, onClose }: ColorPickerPopoverProps) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose();
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div
            ref={ref}
            className="absolute z-20 top-full mt-1 right-0 tactical-frame bg-surface-container-lowest p-3 flex flex-col gap-3 w-48 shadow-lg">
            <div className="flex items-center justify-between">
                <span className="font-headline text-[10px] uppercase tracking-widest text-on-surface-variant">
                    Color
                </span>
                <button
                    onClick={onClose}
                    className="text-on-surface-variant hover:text-on-surface transition-colors"
                    title="Cerrar">
                    <span className="material-symbols-outlined text-sm">close</span>
                </button>
            </div>

            <div className="grid grid-cols-6 gap-2">
                {COLOR_PALETTE.map((hex) => (
                    <button
                        key={hex}
                        onClick={() => onChange(hex)}
                        title={hex}
                        className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                            value.toLowerCase() === hex.toLowerCase()
                                ? 'border-primary'
                                : 'border-outline-variant/40'
                        }`}
                        style={{ backgroundColor: hex }}
                    />
                ))}
            </div>

            <div className="flex items-center gap-2 border-t border-outline-variant/30 pt-2">
                <input
                    type="color"
                    value={value || '#bec2ff'}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-8 h-8 border border-outline-variant cursor-pointer bg-transparent"
                />
                <span className="font-mono text-xs text-on-surface-variant">{value || '#bec2ff'}</span>
            </div>
        </div>
    );
};

export default ColorPickerPopover;
