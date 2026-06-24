import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const COLLECTION = 'nav_config';
const DOC_ID = 'sidebar';

/** Un subitem dentro de un menú expandible */
export type SubNavItem = {
    label: string;
    path: string;
    image?: string;
    color?: string;
};

/** Entrada de navegación de primer nivel */
export type NavItem = {
    icon: string;
    label: string;
    /** Ruta directa (solo si no tiene submenú) */
    path?: string;
    /** Si existe y tiene items, la entrada es un grupo expandible */
    submenu?: SubNavItem[];
};

export type SidebarConfig = {
    items: NavItem[];
};

export const DEFAULT_SIDEBAR: SidebarConfig = {
    items: [
        {
            icon: 'playing_cards',
            label: 'TCGs',
            submenu: [
                { label: 'Pokemon', path: '/tcgs/pokemon' },
                { label: 'Riftbound', path: '/tcgs/riftbound' },
                { label: 'Final Fantasy', path: '/tcgs/final-fantasy' },
                { label: 'Digimon', path: '/tcgs/digimon' },
                { label: 'Naruto', path: '/tcgs/naruto' },
                { label: 'One Piece', path: '/tcgs/one-piece' },
            ],
        },
        { icon: 'diamond', label: 'Accesorios TCGs' },
        { icon: 'smart_toy', label: 'Funko Pop' },
    ],
};

/**
 * Devuelve la config del sidebar desde Firestore.
 * Migra automáticamente el formato antiguo (tcgItems/navEntries) al nuevo.
 * Si no hay documento, lo crea con los defaults.
 */
export async function getSidebarConfig(): Promise<SidebarConfig> {
    const ref = doc(db, COLLECTION, DOC_ID);
    const snap = await getDoc(ref);
    if (snap.exists()) {
        const data = snap.data();
        // Formato nuevo: { items: [...] }
        if (Array.isArray(data.items)) {
            return { items: data.items as NavItem[] };
        }
        // Formato antiguo (tcgItems + navEntries): devuelve defaults,
        // se migrará la próxima vez que el admin guarde.
    }
    await setDoc(ref, DEFAULT_SIDEBAR);
    return DEFAULT_SIDEBAR;
}

/** Sobreescribe la configuración completa del sidebar */
export async function updateSidebarConfig(
    config: SidebarConfig,
): Promise<void> {
    await setDoc(doc(db, COLLECTION, DOC_ID), config);
    try {
        localStorage.setItem('canon-cosmo-nav-config', JSON.stringify(config.items));
    } catch {
        // localStorage no disponible (SSR, modo privado, etc.)
    }
}
