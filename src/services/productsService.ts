import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    writeBatch,
    doc,
    type FieldValue,
} from 'firebase/firestore/lite';
import { db } from '../lib/firebase';
import { toPrice } from '../lib/price';
import type { Product, TcgId } from '../types';
import type { QueryDocumentSnapshot } from 'firebase/firestore/lite';

const COLLECTION = 'products';

/** Mapea un documento a Product normalizando los precios legacy (string) a number. */
function toProduct(d: QueryDocumentSnapshot): Product {
    const data = d.data();
    return {
        ...data,
        id: d.id,
        price: toPrice(data.price),
        salePrice: toPrice(data.salePrice),
    } as Product;
}

/** Devuelve productos marcados como reservables */
export async function getReservableProducts(): Promise<Product[]> {
    const q = query(collection(db, COLLECTION), where('reservable', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs
        .map(toProduct)
        .filter((p) => p.visible !== false)
        .sort((a, b) => a.name.localeCompare(b.name));
}

/** Devuelve todos los productos de un TCG concreto (excluye los reservables) */
export async function getProductsByTcg(tcg: TcgId): Promise<Product[]> {
    const q = query(collection(db, COLLECTION), where('tcg', '==', tcg));
    const snapshot = await getDocs(q);
    return snapshot.docs
        .map(toProduct)
        .filter((p) => p.visible !== false)
        .filter((p) => !p.reservable)
        .sort((a, b) => a.name.localeCompare(b.name));
}

/** Devuelve todos los productos (para admin/seed) */
export async function getAllProducts(): Promise<Product[]> {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.docs
        .map(toProduct)
        .sort(
            (a, b) =>
                a.tcg.localeCompare(b.tcg) || a.name.localeCompare(b.name),
        );
}

/** Añade un producto nuevo (sin id — Firestore lo genera) */
export async function addProduct(
    product: Omit<Product, 'id'>,
): Promise<string> {
    const data: Record<string, unknown> = { ...product };
    delete data.id;
    const ref = await addDoc(collection(db, COLLECTION), data);
    return ref.id;
}

/** Actualiza campos de un producto existente.
 *  Acepta FieldValue (ej. deleteField()) para eliminar campos opcionales. */
export async function updateProduct(
    id: string,
    fields: Record<string, string | number | boolean | FieldValue | undefined>,
): Promise<void> {
    const data = { ...fields };
    delete data.id;
    await updateDoc(doc(db, COLLECTION, id), data);
}

/** Elimina un producto */
export async function deleteProduct(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
}

/** Elimina varios productos en lotes de 500 (límite de writeBatch) */
export async function deleteProducts(ids: string[]): Promise<void> {
    const BATCH_SIZE = 500;
    for (let i = 0; i < ids.length; i += BATCH_SIZE) {
        const batch = writeBatch(db);
        ids.slice(i, i + BATCH_SIZE).forEach((id) =>
            batch.delete(doc(db, COLLECTION, id)),
        );
        await batch.commit();
    }
}
