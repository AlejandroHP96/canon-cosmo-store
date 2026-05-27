import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { TcgId } from '../types';

const COLLECTION = 'tcg_categories';

/** Categorías por defecto para TCGs conocidos */
const DEFAULTS: Record<string, string[]> = {
    pokemon: ['Booster Packs', 'ETBs', 'Bundles'],
    digimon: ['Booster Packs', 'Starter Decks', 'Bundles'],
    onepiece: ['Booster Packs', 'Starter Decks', 'Bundles'],
    naruto: ['Booster Packs', 'Starter Decks', 'Bundles'],
    finalfantasy: ['Booster Packs', 'Starter Decks', 'Bundles'],
    riftbound: ['Booster Packs', 'Starter Decks', 'Bundles'],
};

/** Categorías por defecto para cualquier TCG nuevo */
const GENERIC_DEFAULTS = ['Booster Packs', 'Starter Decks', 'Bundles'];

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

/**
 * Devuelve las categorías de un TCG.
 * Si no existen en Firestore las crea con los defaults del TCG o con
 * los genéricos si es un TCG nuevo.
 */
export async function getCategoriesByTcg(tcg: TcgId): Promise<string[]> {
    const ref = doc(db, COLLECTION, tcg);
    const snap = await getDoc(ref);
    if (snap.exists()) {
        return (snap.data().categories as string[]) ?? [];
    }
    // Primera vez: seed con defaults del TCG conocido o genéricos
    const seed = DEFAULTS[tcg] ?? GENERIC_DEFAULTS;
    await setDoc(ref, { categories: seed });
    return seed;
}

/** Sobreescribe las categorías de un TCG */
export async function updateCategoriesByTcg(
    tcg: TcgId,
    categories: string[],
): Promise<void> {
    await setDoc(doc(db, COLLECTION, tcg), { categories });
}
