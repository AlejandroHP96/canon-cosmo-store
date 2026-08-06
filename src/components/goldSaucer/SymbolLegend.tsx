import { SYMBOLS } from './slotMachine';

const SymbolLegend = () => (
    <div className="mt-4 pt-4 border-t border-outline-variant/30 flex gap-3 flex-wrap justify-center">
        {SYMBOLS.map((s) => (
            <span
                key={s.char}
                className="text-[10px] font-headline text-on-surface-variant flex items-center gap-1">
                <span style={{ color: s.color }}>{s.char}</span>
                {s.label}
            </span>
        ))}
    </div>
);

export default SymbolLegend;
