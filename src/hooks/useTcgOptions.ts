import { useState, useEffect } from 'react';
import { getSidebarConfig, type NavItem } from '../services/navService';
import { pathToSectionId } from '../lib/tcgUtils';

export type TcgOption = {
    id: string;    // ID en Firestore (ej. 'finalfantasy', 'accesorios-tcgs')
    label: string; // Nombre legible (ej. 'Final Fantasy', 'Accesorios TCGs')
};

/** Opciones de fallback mientras carga el nav config */
const FALLBACK: TcgOption[] = [
    { id: 'pokemon', label: 'Pokémon' },
    { id: 'digimon', label: 'Digimon' },
    { id: 'onepiece', label: 'One Piece' },
    { id: 'naruto', label: 'Naruto' },
    { id: 'finalfantasy', label: 'Final Fantasy' },
    { id: 'riftbound', label: 'Riftbound' },
];

/**
 * Extrae TODAS las páginas disponibles del nav config:
 * subitems y entradas de primer nivel con path, de cualquier sección.
 */
function extractSectionsFromNav(items: NavItem[]): TcgOption[] {
    const seen = new Set<string>();
    const result: TcgOption[] = [];

    const push = (path: string, label: string) => {
        const id = pathToSectionId(path);
        if (id && !seen.has(id)) {
            seen.add(id);
            result.push({ id, label });
        }
    };

    for (const item of items) {
        // Subitems de grupos expandibles (ej. pokemon, digimon…)
        for (const sub of item.submenu ?? []) {
            push(sub.path, sub.label);
        }
        // Entradas directas de primer nivel (ej. /accesorios-tcgs, /funko-pop)
        if (item.path) {
            push(item.path, item.label);
        }
    }

    return result.length > 0 ? result : FALLBACK;
}

/**
 * Devuelve todas las secciones/páginas disponibles desde el nav config.
 * Inicializa con fallback para evitar flash vacío.
 */
export function useTcgOptions(): TcgOption[] {
    const [options, setOptions] = useState<TcgOption[]>(FALLBACK);

    useEffect(() => {
        getSidebarConfig()
            .then((config) => {
                const sections = extractSectionsFromNav(config.items);
                setOptions(sections);
            })
            .catch(() => {
                // Mantener fallback en caso de error
            });
    }, []);

    return options;
}
