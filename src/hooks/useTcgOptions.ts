import { useState, useEffect } from 'react';
import { getSidebarConfig, type NavItem } from '../services/navService';
import { slugToTcgId } from '../lib/tcgUtils';

export type TcgOption = {
    id: string;   // ID en Firestore (ej. 'finalfantasy', 'dragon-ball')
    label: string; // Nombre legible (ej. 'Final Fantasy', 'Dragon Ball')
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
 * Extrae los TCGs disponibles del nav config:
 * - Subitems de cualquier entrada que apunten a /tcgs/xxx
 * - Entradas de primer nivel que apunten a /tcgs/xxx
 */
function extractTcgsFromNav(items: NavItem[]): TcgOption[] {
    const seen = new Set<string>();
    const result: TcgOption[] = [];

    const push = (urlSlug: string, label: string) => {
        const id = slugToTcgId(urlSlug);
        if (id && !seen.has(id)) {
            seen.add(id);
            result.push({ id, label });
        }
    };

    for (const item of items) {
        // Subitems de grupos expandibles
        for (const sub of item.submenu ?? []) {
            if (sub.path.startsWith('/tcgs/')) {
                push(sub.path.slice('/tcgs/'.length), sub.label);
            }
        }
        // Entradas directas de primer nivel
        if (item.path?.startsWith('/tcgs/')) {
            push(item.path.slice('/tcgs/'.length), item.label);
        }
    }

    return result.length > 0 ? result : FALLBACK;
}

/**
 * Devuelve la lista de TCGs disponibles cargada desde el nav config.
 * Inicializa con fallback para evitar flash vacío.
 */
export function useTcgOptions(): TcgOption[] {
    const [options, setOptions] = useState<TcgOption[]>(FALLBACK);

    useEffect(() => {
        getSidebarConfig()
            .then((config) => {
                const tcgs = extractTcgsFromNav(config.items);
                setOptions(tcgs);
            })
            .catch(() => {
                // Mantener fallback en caso de error
            });
    }, []);

    return options;
}
