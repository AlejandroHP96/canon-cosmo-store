import { useState, useEffect } from 'react';
import {
    getSidebarConfig,
    DEFAULT_SIDEBAR,
    type NavItem,
} from '../services/navService';
import { pathToSectionId, toSlug } from '../lib/tcgUtils';

export type TcgOption = {
    id: string; // ID en Firestore (ej. 'finalfantasy', 'accesorios-tcgs')
    label: string; // Nombre legible (ej. 'Final Fantasy', 'Accesorios TCGs')
};

/**
 * Extrae TODAS las páginas disponibles del nav config:
 * subitems y entradas de primer nivel, con path o sin él.
 *
 * La derivación del ID es la misma que usa el enrutado en TcgPage: si la
 * entrada no declara `path`, su sección es el slug de la etiqueta. Sin esa
 * última rama, las entradas sin path (Accesorios TCGs, Funko Pop) no aparecían
 * en el selector del formulario de producto, aunque sí tuvieran su página.
 */
function extractSectionsFromNav(items: NavItem[]): TcgOption[] {
    const seen = new Set<string>();
    const result: TcgOption[] = [];

    const push = (id: string, label: string) => {
        if (id && !seen.has(id)) {
            seen.add(id);
            result.push({ id, label });
        }
    };

    for (const item of items) {
        // Subitems de grupos expandibles (ej. pokemon, digimon…)
        for (const sub of item.submenu ?? []) {
            push(pathToSectionId(sub.path), sub.label);
        }
        // Entradas de primer nivel, con ruta propia o derivada de la etiqueta
        if (!item.submenu?.length) {
            push(
                item.path ? pathToSectionId(item.path) : toSlug(item.label),
                item.label,
            );
        }
    }

    return result;
}

/** Opciones mientras carga el nav config. Derivadas del mismo default que el
 *  sidebar, para que no puedan divergir: antes había una segunda lista escrita
 *  a mano aquí, y ya no coincidía con `DEFAULT_SIDEBAR`. */
const FALLBACK: TcgOption[] = extractSectionsFromNav(DEFAULT_SIDEBAR.items);

/**
 * Devuelve todas las secciones/páginas disponibles desde el nav config.
 * Inicializa con fallback para evitar flash vacío.
 */
export function useTcgOptions(): TcgOption[] {
    const [options, setOptions] = useState<TcgOption[]>(FALLBACK);

    useEffect(() => {
        let cancelled = false;
        getSidebarConfig()
            .then((config) => {
                const sections = extractSectionsFromNav(config.items);
                if (!cancelled && sections.length > 0) setOptions(sections);
            })
            .catch(() => {
                // Mantener fallback en caso de error
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return options;
}
