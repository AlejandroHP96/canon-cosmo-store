export const SYMBOLS = [
    { char: '7', color: '#ffd700', label: 'Siete' },
    { char: '♥', color: '#ff4455', label: 'Corazón' },
    { char: '★', color: '#ffcc00', label: 'Estrella' },
    { char: '♣', color: '#44ff88', label: 'Materia' },
    { char: '♦', color: '#cc55ff', label: 'Cristal' },
    { char: '☁', color: '#88ccff', label: 'Cloud' },
    { char: '✿', color: '#ffaabb', label: 'Flor' },
];

export type SlotResult = { text: string; color: string; big?: boolean } | null;

/** Premio de una tirada, de mejor a peor. */
export function getResult(reels: number[]): SlotResult {
    const [a, b, c] = reels;

    if (a === b && b === c) {
        if (SYMBOLS[a].char === '7')
            return { text: '¡¡¡LUCKY 7s!!! ¡CAIT SITH ENLOQUECE!', color: '#ffd700', big: true };
        if (SYMBOLS[a].char === '♥')
            return { text: '¡Tres corazones! El Planeta te ama.', color: '#ff4455', big: true };
        return { text: `¡¡PREMIO MAYOR!! ¡Tres ${SYMBOLS[a].label}s!`, color: '#ff9900', big: true };
    }

    if (a === b || b === c || a === c)
        return { text: '¡Un par! Algo es algo...', color: '#88ff88' };

    if ([a, b, c].some((i) => SYMBOLS[i].char === '7'))
        return { text: 'Casi, casi... el 7 estaba ahí.', color: '#ffcc44' };

    return { text: 'Nyuk nyuk nyuk... ¡La ruleta del destino es cruel!', color: '#888899' };
}

export const randomSymbol = () => Math.floor(Math.random() * SYMBOLS.length);
