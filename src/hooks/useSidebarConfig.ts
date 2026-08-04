import { useEffect, useState } from 'react';
import {
    getSidebarConfig,
    updateSidebarConfig,
    type NavItem,
} from '../services/navService';

/** Carga y persistencia de la config del sidebar para el panel de admin. */
export function useSidebarConfig() {
    const [items, setItems] = useState<NavItem[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getSidebarConfig()
            .then((cfg) => setItems(cfg.items))
            .catch(() => setError('Error al cargar la configuración.'))
            .finally(() => setLoading(false));
    }, []);

    /** Persiste la lista completa. Solo actualiza el estado local si Firestore acepta. */
    const save = async (next: NavItem[]) => {
        setSaving(true);
        setError(null);
        try {
            await updateSidebarConfig({ items: next });
            setItems(next);
        } catch {
            setError('Error al guardar. Inténtalo de nuevo.');
        } finally {
            setSaving(false);
        }
    };

    return { items, loading, saving, error, setError, save };
}
