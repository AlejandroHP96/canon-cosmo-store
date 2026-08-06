import { useEffect, useRef, useState } from 'react';
import { getResult, randomSymbol, type SlotResult } from './slotMachine';

/** Cuándo se para cada ruleta, en ms desde el inicio de la tirada. */
const STOP_TIMES = [900, 1350, 1800];
const TICK_MS = 80;
const RESULT_DELAY_MS = 250;

export function useSlotMachine() {
    const [reels, setReels] = useState([0, 0, 0]);
    const [spinning, setSpinning] = useState(false);
    const [stopped, setStopped] = useState([false, false, false]);
    const [result, setResult] = useState<SlotResult>(null);

    const intervals = useRef<ReturnType<typeof setInterval>[]>([]);
    const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

    const clearTimers = () => {
        intervals.current.forEach(clearInterval);
        timeouts.current.forEach(clearTimeout);
        intervals.current = [];
        timeouts.current = [];
    };

    // Sin esto, cerrar el modal a media tirada dejaba los intervalos vivos
    useEffect(() => clearTimers, []);

    const reset = () => {
        clearTimers();
        setReels([0, 0, 0]);
        setStopped([false, false, false]);
        setSpinning(false);
        setResult(null);
    };

    const spin = () => {
        if (spinning) return;
        setSpinning(true);
        setResult(null);
        setStopped([false, false, false]);

        const final = Array.from({ length: 3 }, randomSymbol);

        intervals.current = [0, 1, 2].map((i) =>
            setInterval(() => {
                setReels((prev) => prev.map((v, j) => (j === i ? randomSymbol() : v)));
            }, TICK_MS),
        );

        timeouts.current = STOP_TIMES.map((ms, i) =>
            setTimeout(() => {
                clearInterval(intervals.current[i]);
                setReels((prev) => prev.map((v, j) => (j === i ? final[i] : v)));
                setStopped((prev) => prev.map((v, j) => (j === i ? true : v)));

                if (i === STOP_TIMES.length - 1) {
                    timeouts.current.push(
                        setTimeout(() => {
                            setSpinning(false);
                            setResult(getResult(final));
                        }, RESULT_DELAY_MS),
                    );
                }
            }, ms),
        );
    };

    return { reels, spinning, stopped, result, spin, reset };
}
