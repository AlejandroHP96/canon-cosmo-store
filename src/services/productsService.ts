import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    type FieldValue,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Product, TcgId } from '../types';

const COLLECTION = 'products';

/** Devuelve todos los productos de un TCG concreto */
export async function getProductsByTcg(tcg: TcgId): Promise<Product[]> {
    const q = query(collection(db, COLLECTION), where('tcg', '==', tcg));
    const snapshot = await getDocs(q);
    return snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }) as Product)
        .sort((a, b) => a.name.localeCompare(b.name));
}

/** Devuelve todos los productos (para admin/seed) */
export async function getAllProducts(): Promise<Product[]> {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }) as Product)
        .sort(
            (a, b) =>
                a.tcg.localeCompare(b.tcg) || a.name.localeCompare(b.name),
        );
}

/** Añade un producto nuevo (sin id — Firestore lo genera) */
export async function addProduct(
    product: Omit<Product, 'id'>,
): Promise<string> {
    const ref = await addDoc(collection(db, COLLECTION), product);
    return ref.id;
}

/** Actualiza campos de un producto existente.
 *  Acepta FieldValue (ej. deleteField()) para eliminar campos opcionales. */
export async function updateProduct(
    id: string,
    fields: Record<string, string | number | boolean | FieldValue | undefined>,
): Promise<void> {
    await updateDoc(doc(db, COLLECTION, id), fields);
}

/** Elimina un producto */
export async function deleteProduct(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
}
