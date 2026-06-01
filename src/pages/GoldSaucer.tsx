import { useRef, useState } from 'react';
import SEO from '../components/SEO';

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

const GoldSaucer = () => {
    const [reels, setReels] = useState([0, 0, 0]);
    const [spinning, setSpinning] = useState(false);
    const [stopped, setStopped] = useState([false, false, false]);
    const [result, setResult] = useState<Result>(null);
    const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);

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
                setReels(prev => {
                    const n = [...prev];
                    n[i] = Math.floor(Math.random() * SYMBOLS.length);
                    return n;
                });
            }, 80)
        );
        intervalsRef.current = ivals;

        [900, 1350, 1800].forEach((ms, i) => {
            setTimeout(() => {
                clearInterval(ivals[i]);
                setReels(prev => { const n = [...prev]; n[i] = final[i]; return n; });
                setStopped(prev => { const n = [...prev]; n[i] = true; return n; });
                if (i === 2) {
                    setTimeout(() => {
                        setSpinning(false);
                        setResult(getResult(final));
                    }, 250);
                }
            }, ms);
        });
    };

    return (
        <div className="min-h-full flex flex-col items-center justify-center py-12 px-4">
            <SEO
                title="Gold Saucer — Tragaperras"
                description="Minijuego de la tragaperras de Cait Sith. ¿Conseguirás los Lucky 7s?"
                path="/gold-saucer"
            />

            <div className="text-center mb-8">
                <p className="font-headline text-[10px] uppercase tracking-[0.3em] text-primary/60 mb-1">
                    Gold Saucer · Midgar District VII
                </p>
                <h1 className="font-headline font-bold text-2xl uppercase tracking-widest text-on-surface">
                    Tragaperras de Cait Sith
                </h1>
                <div className="h-px bg-primary/30 mt-3 max-w-xs mx-auto" />
            </div>

            <div className="tactical-frame p-8 w-full max-w-sm">
                {/* Ruletas */}
                <div className="flex gap-4 justify-center mb-8">
                    {reels.map((symIdx, i) => (
                        <div
                            key={i}
                            className={`w-20 h-20 flex items-center justify-center border-2 bg-[#000120] transition-all duration-200 ${
                                stopped[i] && !spinning
                                    ? 'border-[#c8a800]'
                                    : 'border-[#c8a800]/30'
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
                <div className="mt-5 min-h-[40px] flex items-center justify-center text-center px-2">
                    {result && (
                        <p
                            className={`font-headline uppercase tracking-widest ${result.big ? 'text-sm' : 'text-xs'}`}
                            style={{ color: result.color }}>
                            {result.text}
                        </p>
                    )}
                </div>
            </div>

            {/* Símbolos */}
            <div className="mt-6 flex gap-3 flex-wrap justify-center max-w-xs">
                {SYMBOLS.map(s => (
                    <span key={s.char} className="text-xs font-headline text-on-surface-variant flex items-center gap-1">
                        <span style={{ color: s.color }}>{s.char}</span>
                        {s.label}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default GoldSaucer;
