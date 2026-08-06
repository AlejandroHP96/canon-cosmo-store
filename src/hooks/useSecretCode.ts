import { useEffect, useRef } from 'react';

const INACTIVITY_MS = 3000;

/**
 * Dispara onTrigger cuando se teclea `code` fuera de un campo de texto.
 * El buffer se vacía tras unos segundos sin escribir, para que no se
 * complete la palabra a base de pulsaciones sueltas muy separadas.
 */
export function useSecretCode(code: string, onTrigger: () => void, enabled = true) {
    const buffer = useRef('');
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    // En una ref para no reinstalar el listener en cada render
    const trigger = useRef(onTrigger);
    useEffect(() => {
        trigger.current = onTrigger;
    });

    useEffect(() => {
        if (!enabled) return;

        const onKey = (e: KeyboardEvent) => {
            const tag = (e.target as HTMLElement).tagName.toLowerCase();
            if (tag === 'input' || tag === 'textarea') return;
            if (e.key.length !== 1) return;

            if (timer.current) clearTimeout(timer.current);

            const char = e.key.toLowerCase();
            if (char !== ' ') buffer.current += char;
            if (buffer.current.length > code.length) {
                buffer.current = buffer.current.slice(-code.length);
            }

            if (buffer.current === code) {
                buffer.current = '';
                trigger.current();
            }

            timer.current = setTimeout(() => {
                buffer.current = '';
            }, INACTIVITY_MS);
        };

        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('keydown', onKey);
            if (timer.current) clearTimeout(timer.current);
        };
    }, [code, enabled]);
}
