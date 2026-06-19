import { useCallback, useEffect, useRef, useState } from 'react';

const TRIGGER = 'goldsaucer';

const SYMBOLS = [
    { char: '7',  color: '#ffd700', label: 'Siete'    },
    { char: '♥',  color: '#ff4455', label: 'Corazón'  },
    { char: '★',  color: '#ffcc00', label: 'Estrella' },
    { char: '♣',  color: '#44ff88', label: 'Materia'  },
    { char: '♦',  color: '#cc55ff', label: 'Cristal'  },
    { char: '☁',  color: '#88ccff', label: 'Cloud'    },
    { char: '✿',  color: '#ffaabb', label: 'Flor'     },
];

type Result = { text: string; color: string; big?: boolean } | null;

const getResult = (r: number[]): Result => {
    const [a, b, c] = r;
    if (a === b && b === c) {
        if (SYMBOLS[a].char === '7')
            return { text: '¡¡¡LUCKY 7s!!! ¡CAIT SITH ENLOQUECE!', color: '#ffd700', big: true };
        if (SYMBOLS[a].char === '♥')
            return { text: '¡Tres corazones! El Planeta te ama.', color: '#ff4455', big: true };
        return { text: `¡¡PREMIO MAYOR!! ¡Tres ${SYMBOLS[a].label}s!`, color: '#ff9900', big: true };
    }
    if (a === b || b === c || a === c)
        return { text: '¡Un par! Algo es algo...', color: '#88ff88' };
    if (SYMBOLS[a].char === '7' || SYMBOLS[b].char === '7' || SYMBOLS[c].char === '7')
        return { text: 'Casi, casi... el 7 estaba ahí.', color: '#ffcc44' };
    return { text: 'Nyuk nyuk nyuk... ¡La ruleta del destino es cruel!', color: '#888899' };
};

const GoldSaucerModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [reels, setReels] = useState([0, 0, 0]);
    const [spinning, setSpinning] = useState(false);
    const [stopped, setStopped] = useState([false, false, false]);
    const [result, setResult] = useState<Result>(null);
    const buffer = useRef('');
    const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const spinIntervals = useRef<ReturnType<typeof setInterval>[]>([]);

    const close = useCallback(() => {
        setIsOpen(false);
        setResult(null);
        setReels([0, 0, 0]);
        setStopped([false, false, false]);
        setSpinning(false);
        spinIntervals.current.forEach(clearInterval);
    }, []);

    // Typing detection
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (isOpen) {
                if (e.key === 'Escape') close();
                return;
            }

            const tag = (e.target as HTMLElement).tagName.toLowerCase();
            if (tag === 'input' || tag === 'textarea') return;
            if (e.key.length !== 1) return;

            if (inactivityTimer.current) clearTimeout(inactivityTimer.current);

            const char = e.key.toLowerCase();
            if (char !== ' ') buffer.current += char;
            if (buffer.current.length > TRIGGER.length)
                buffer.current = buffer.current.slice(-TRIGGER.length);

            if (buffer.current === TRIGGER) {
                buffer.current = '';
                setIsOpen(true);
            }

            inactivityTimer.current = setTimeout(() => { buffer.current = ''; }, 3000);
        };

        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [isOpen, close]);

    const spin = () => {
        if (spinning) return;
        setSpinning(true);
        setResult(null);
        setStopped([false, false, false]);

        const final = Array.from({ length: 3 }, () =>
            Math.floor(Math.random() * SYMBOLS.length)
        );

        const ivals = [0, 1, 2].map(i =>
            setInterval(() => {
                setReels(prev => { const n = [...prev]; n[i] = Math.floor(Math.random() * SYMBOLS.length); return n; });
            }, 80)
        );
        spinIntervals.current = ivals;

        [900, 1350, 1800].forEach((ms, i) => {
            setTimeout(() => {
                clearInterval(ivals[i]);
                setReels(prev => { const n = [...prev]; n[i] = final[i]; return n; });
                setStopped(prev => { const n = [...prev]; n[i] = true; return n; });
                if (i === 2) setTimeout(() => { setSpinning(false); setResult(getResult(final)); }, 250);
            }, ms);
        });
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-200 bg-black/70 flex items-center justify-center p-4"
            onClick={close}>
            <div
                className="tactical-frame p-4 sm:p-8 w-full max-w-sm"
                onClick={e => e.stopPropagation()}>
                {/* Header */}
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

                {/* Ruletas */}
                <div className="flex gap-2 sm:gap-4 justify-center mb-8">
                    {reels.map((symIdx, i) => (
                        <div
                            key={i}
                            className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center border-2 bg-[#000120] transition-all duration-200 ${
                                stopped[i] && !spinning ? 'border-[#c8a800]' : 'border-[#c8a800]/30'
                            }`}>
                            <span
                                className={`font-headline font-bold text-4xl select-none transition-all duration-75 ${
                                    spinning && !stopped[i] ? 'blur-[1.5px] scale-110' : 'blur-0 scale-100'
                                }`}
                                style={{ color: SYMBOLS[symIdx].color }}>
                                {SYMBOLS[symIdx].char}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Botón */}
                <button
                    onClick={spin}
                    disabled={spinning}
                    className="w-full border border-primary bg-surface-container text-primary font-headline text-sm uppercase tracking-widest py-3 hover:bg-primary hover:text-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {spinning ? '· · ·' : '¡ T I R A R !'}
                </button>

                {/* Resultado */}
                <div className="mt-5 min-h-[36px] flex items-center justify-center text-center px-2">
                    {result && (
                        <p
                            className={`font-headline uppercase tracking-widest ${result.big ? 'text-sm' : 'text-xs'}`}
                            style={{ color: result.color }}>
                            {result.text}
                        </p>
                    )}
                </div>

                {/* Símbolos */}
                <div className="mt-4 pt-4 border-t border-outline-variant/30 flex gap-3 flex-wrap justify-center">
                    {SYMBOLS.map(s => (
                        <span key={s.char} className="text-[10px] font-headline text-on-surface-variant flex items-center gap-1">
                            <span style={{ color: s.color }}>{s.char}</span>
                            {s.label}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GoldSaucerModal;
