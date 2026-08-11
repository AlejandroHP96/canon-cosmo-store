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

export const NAV_CACHE_KEY = 'canon-cosmo-nav-config';

/** Última config conocida en esta sesión. Se comparte entre todos los hooks. */
let memoCache: SidebarConfig | null = null;
/** Petición en vuelo, para que varios consumidores a la vez no pidan lo mismo. */
let inFlight: Promise<SidebarConfig> | null = null;

/** Config cacheada en localStorage, para pintar el nav sin esperar a la red. */
export function getCachedNavItems(): NavItem[] | null {
    try {
        const raw = localStorage.getItem(NAV_CACHE_KEY);
        if (raw) return JSON.parse(raw) as NavItem[];
    } catch {
        // Cache corrupto o localStorage no disponible (modo privado, etc.)
    }
    return null;
}

function writeCache(config: SidebarConfig) {
    memoCache = config;
    try {
        localStorage.setItem(NAV_CACHE_KEY, JSON.stringify(config.items));
    } catch {
        // localStorage no disponible: la caché en memoria basta para la sesión
    }
}

async function fetchSidebarConfig(): Promise<SidebarConfig> {
    const snap = await getDoc(doc(db, COLLECTION, DOC_ID));
    if (snap.exists() && Array.isArray(snap.data().items)) {
        return { items: snap.data().items as NavItem[] };
    }
    // Documento ausente o en formato antiguo (tcgItems/navEntries): se sirven
    // los defaults, pero NO se escriben. Antes esta rama hacía un setDoc que,
    // si quien cargaba la web estaba autenticado, machacaba la configuración
    // real con los valores por defecto.
    return DEFAULT_SIDEBAR;
}

/**
 * Devuelve la config del sidebar. La lee una sola vez por sesión: seis puntos
 * del código la piden y hasta tres coincidían en la misma navegación, cada uno
 * con su propio getDoc del mismo documento.
 */
export function getSidebarConfig(): Promise<SidebarConfig> {
    if (memoCache) return Promise.resolve(memoCache);
    if (inFlight) return inFlight;

    inFlight = fetchSidebarConfig()
        .then((config) => {
            writeCache(config);
            return config;
        })
        .finally(() => {
            inFlight = null;
        });

    return inFlight;
}

/** Sobreescribe la configuración completa del sidebar */
export async function updateSidebarConfig(
    config: SidebarConfig,
): Promise<void> {
    await setDoc(doc(db, COLLECTION, DOC_ID), config);
    writeCache(config);
}
