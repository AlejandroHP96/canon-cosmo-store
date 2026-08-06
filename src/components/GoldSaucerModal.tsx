import { useCallback, useEffect, useState } from 'react';
import { useSecretCode } from '../hooks/useSecretCode';
import { useSlotMachine } from './goldSaucer/useSlotMachine';
import SlotReels from './goldSaucer/SlotReels';
import SymbolLegend from './goldSaucer/SymbolLegend';

const TRIGGER = 'goldsaucer';

const GoldSaucerModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { reels, spinning, stopped, result, spin, reset } = useSlotMachine();

    const close = useCallback(() => {
        setIsOpen(false);
        reset();
    }, [reset]);

    // El código solo escucha con el modal cerrado; abierto, Escape lo cierra
    useSecretCode(TRIGGER, () => setIsOpen(true), !isOpen);

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [isOpen, close]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-200 bg-black/70 flex items-center justify-center p-4"
            onClick={close}>
            <div
                className="tactical-frame p-4 sm:p-8 w-full max-w-sm"
                onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="font-headline text-[9px] uppercase tracking-[0.3em] text-primary/60 mb-0.5">
                            Gold Saucer · Midgar District VII
                        </p>
                        <h2 className="font-headline font-bold text-lg uppercase tracking-widest text-on-surface">
                            Tragaperras de Cait Sith
                        </h2>
                    </div>
                    <button
                        onClick={close}
                        className="text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <SlotReels reels={reels} stopped={stopped} spinning={spinning} />

                <button
                    onClick={spin}
                    disabled={spinning}
                    className="w-full border border-primary bg-surface-container text-primary font-headline text-sm uppercase tracking-widest py-3 hover:bg-primary hover:text-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {spinning ? '· · ·' : '¡ T I R A R !'}
                </button>

                <div className="mt-5 min-h-[36px] flex items-center justify-center text-center px-2">
                    {result && (
                        <p
                            className={`font-headline uppercase tracking-widest ${
                                result.big ? 'text-sm' : 'text-xs'
                            }`}
                            style={{ color: result.color }}>
                            {result.text}
                        </p>
                    )}
                </div>

                <SymbolLegend />
            </div>
        </div>
    );
};

export default GoldSaucerModal;
