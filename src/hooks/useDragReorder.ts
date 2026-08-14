import { useState } from 'react';

/**
 * Reordenación por drag & drop sobre elementos identificados por una clave string.
 * El consumidor decide qué significa cada clave y aplica el movimiento en onReorder.
 */
export function useDragReorder(
    onReorder: (fromKey: string, toKey: string) => void,
) {
    const [dragKey, setDragKey] = useState<string | null>(null);
    const [overKey, setOverKey] = useState<string | null>(null);

    const reset = () => {
        setDragKey(null);
        setOverKey(null);
    };

    const dragProps = (key: string) => ({
        draggable: true,
        onDragStart: () => setDragKey(key),
        onDragOver: (e: React.DragEvent) => {
            e.preventDefault();
            setOverKey(key);
        },
        onDrop: () => {
            if (dragKey !== null && dragKey !== key) onReorder(dragKey, key);
            reset();
        },
        onDragEnd: reset,
    });

    /** true si hay que resaltar `key` como destino del arrastre en curso. */
    const isTarget = (key: string) => overKey === key && dragKey !== key;

    return { dragKey, dragProps, isTarget };
}

export type DragReorder = ReturnType<typeof useDragReorder>;
