import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

// Character names (proper nouns, not translated) + their color
const CHARS = [
    { char: 'Cloud',     color: '#7ec8e3' },
    { char: 'Cloud',     color: '#7ec8e3' },
    { char: 'Barret',    color: '#ffa040' },
    { char: 'Aerith',    color: '#ffb3cc' },
    { char: 'Aerith',    color: '#ffb3cc' },
    { char: 'Tifa',      color: '#ff6b6b' },
    { char: 'Sephiroth', color: '#c8c8ff' },
    { char: 'Sephiroth', color: '#c8c8ff' },
    { char: 'Cait Sith', color: '#ffc0cb' },
    { char: 'Yuffie',    color: '#90ee90' },
    { char: 'Red XIII',  color: '#ff6030' },
    { char: 'Vincent',   color: '#cc4444' },
    { char: 'Cid',       color: '#87ceeb' },
    { char: 'NPC Shinra', color: '#aaaaaa' },
];

type Phase = 'idle' | 'flashing' | 'dialog';
type Entry = { char: string; color: string; quote: string };

const KonamiEasterEgg = () => {
    const { t } = useTranslation();
    const [phase, setPhase] = useState<Phase>('idle');
    const [entry, setEntry] = useState<Entry>({ ...CHARS[0], quote: '' });
    const progress = useRef(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const dismiss = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setPhase('idle');
    }, []);

    const trigger = useCallback(() => {
        const idx = Math.floor(Math.random() * CHARS.length);
        setEntry({ ...CHARS[idx], quote: t(`konami.quotes.${idx}`) });
        setPhase('flashing');
        setTimeout(() => setPhase('dialog'), 650);
        timerRef.current = setTimeout(dismiss, 5500);
    }, [dismiss, t]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (phase !== 'idle') { dismiss(); return; }
            if (e.key === KONAMI[progress.current]) {
                progress.current += 1;
                if (progress.current === KONAMI.length) {
                    progress.current = 0;
                    trigger();
                }
            } else {
                progress.current = e.key === KONAMI[0] ? 1 : 0;
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [phase, dismiss, trigger]);

    if (phase === 'idle') return null;

    return (
        <div className="fixed inset-0 z-[200] pointer-events-none">
            {phase === 'flashing' && (
                <div className="absolute inset-0 konami-flash" />
            )}

            {phase === 'dialog' && (
                <div
                    className="absolute inset-0 flex items-end justify-center pb-24 px-6 pointer-events-auto"
                    onClick={dismiss}>
                    <div
                        className="konami-dialog-enter w-full max-w-lg"
                        style={{
                            background: 'rgba(0, 1, 36, 0.97)',
                            border: '2px solid #c8a800',
                            boxShadow: 'inset 0 0 0 1px rgba(200,168,0,0.25), 0 0 40px rgba(200,168,0,0.15)',
                        }}>
                        <div className="px-4 py-2 border-b border-[#c8a800]/25">
                            <span
                                className="text-[10px] font-headline tracking-[0.25em] uppercase"
                                style={{ color: entry.color }}>
                                {entry.char}
                            </span>
                        </div>
                        <div className="px-5 py-4">
                            <p className="font-headline text-sm text-[#e0e0ff] leading-relaxed tracking-wide">
                                {entry.quote}
                                <span className="konami-cursor ml-1">▮</span>
                            </p>
                        </div>
                        <div className="px-4 pb-2.5 text-right">
                            <span className="text-[9px] font-headline text-[#6a5800] tracking-widest uppercase">
                                {t('konami.pressAnyKey')}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KonamiEasterEgg;
