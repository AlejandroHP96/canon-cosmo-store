import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { TcgId } from '../types';

const COLLECTION = 'tcg_categories';

/** Categorías por defecto al crear por primera vez el documento */
const DEFAULTS: Record<TcgId, string[]> = {
    pokemon: ['Booster Packs', 'ETBs', 'Bundles'],
    digimon: ['Booster Packs', 'Starter Decks', 'Bundles'],
    onepiece: ['Booster Packs', 'Starter Decks', 'Bundles'],
    naruto: ['Booster Packs', 'Starter Decks', 'Bundles'],
    finalfantasy: ['Booster Packs', 'Starter Decks', 'Bundles'],
    riftbound: ['Booster Packs', 'Starter Decks', 'Bundles'],
};

/** Icono Material Symbols por nombre de categoría */
export const CATEGORY_ICON: Record<string, string> = {
    'Booster Packs': 'style',
    ETBs: 'inventory_2',
    'Starter Decks': 'inventory_2',
    Bundles: 'package_2',
    Cajas: 'inventory',
    Tins: 'deployed_code',
    Accesorios: 'diamond',
};
export const DEFAULT_CAT_ICON = 'category';

/** Devuelve las categorías de un TCG. Si no existen en Firestore las crea con los defaults. */
export async function getCategoriesByTcg(tcg: TcgId): Promise<string[]> {
    const ref = doc(db, COLLECTION, tcg);
    const snap = await getDoc(ref);
    if (snap.exists()) {
        return (snap.data().categories as string[]) ?? [];
    }
    // Primera vez: auto-seed con categorías por defecto
    await setDoc(ref, { categories: DEFAULTS[tcg] });
    return DEFAULTS[tcg];
}

/** Sobreescribe las categorías de un TCG */
export async function updateCategoriesByTcg(
    tcg: TcgId,
    categories: string[],
): Promise<void> {
    await setDoc(doc(db, COLLECTION, tcg), { categories });
}
