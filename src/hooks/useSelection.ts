import { useState } from 'react';

/** Selección múltiple por id, con "seleccionar todo" acotado a lo visible. */
export function useSelection() {
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const toggle = (id: string) =>
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });

    const remove = (id: string) =>
        setSelected((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });

    const clear = () => setSelected(new Set());

    /** Marca todos los ids dados, o los desmarca si ya lo estaban todos. */
    const toggleAll = (ids: string[]) =>
        setSelected(
            ids.every((id) => selected.has(id)) ? new Set() : new Set(ids),
        );

    const areAllSelected = (ids: string[]) =>
        ids.length > 0 && ids.every((id) => selected.has(id));

    return { selected, toggle, remove, clear, toggleAll, areAllSelected };
}
