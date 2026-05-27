import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const COLLECTION = 'nav_config';
const DOC_ID = 'sidebar';

export type TcgNavItem = {
    label: string;
    path: string;
};

export type NavEntry = {
    icon: string;
    label: string;
};

export type SidebarConfig = {
    tcgItems: TcgNavItem[];
    navEntries: NavEntry[];
};

export const DEFAULT_SIDEBAR: SidebarConfig = {
    tcgItems: [
        { label: 'Pokemon', path: '/tcgs/pokemon' },
        { label: 'Riftbound', path: '/tcgs/riftbound' },
        { label: 'Final Fantasy', path: '/tcgs/final-fantasy' },
        { label: 'Digimon', path: '/tcgs/digimon' },
        { label: 'Naruto', path: '/tcgs/naruto' },
        { label: 'One Piece', path: '/tcgs/one-piece' },
    ],
    navEntries: [
        { icon: 'diamond', label: 'Accesorios TCGs' },
        { icon: 'smart_toy', label: 'Funko Pop' },
    ],
};

/**
 * Devuelve la configuración del sidebar desde Firestore.
 * Si no existe el documento lo crea con los valores por defecto.
 */
export async function getSidebarConfig(): Promise<SidebarConfig> {
    const ref = doc(db, COLLECTION, DOC_ID);
    const snap = await getDoc(ref);
    if (snap.exists()) {
        const data = snap.data();
        return {
            tcgItems:
                (data.tcgItems as TcgNavItem[]) ?? DEFAULT_SIDEBAR.tcgItems,
            navEntries:
                (data.navEntries as NavEntry[]) ?? DEFAULT_SIDEBAR.navEntries,
        };
    }
    // Primera vez: auto-seed con los valores por defecto
    await setDoc(ref, DEFAULT_SIDEBAR);
    return DEFAULT_SIDEBAR;
}

/** Sobreescribe la configuración completa del sidebar */
export async function updateSidebarConfig(
    config: SidebarConfig,
): Promise<void> {
    await setDoc(doc(db, COLLECTION, DOC_ID), config);
}
