import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    deleteField,
    doc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export type JuegoTorneo = {
    id: string;
    nombre: string;
    imagen?: string;
    descripcion?: string;
    url?: string;
};

const COLLECTION = 'torneosJuegos';

export async function getJuegos(): Promise<JuegoTorneo[]> {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }) as JuegoTorneo)
        .sort((a, b) => a.nombre.localeCompare(b.nombre));
}

export async function addJuego(
    juego: Omit<JuegoTorneo, 'id'>,
): Promise<string> {
    const ref = await addDoc(collection(db, COLLECTION), juego);
    return ref.id;
}

export async function updateJuego(
    id: string,
    data: Omit<JuegoTorneo, 'id'>,
): Promise<void> {
    await updateDoc(doc(db, COLLECTION, id), {
        nombre: data.nombre,
        imagen: data.imagen || deleteField(),
        descripcion: data.descripcion || deleteField(),
        url: data.url || deleteField(),
    });
}

export async function deleteJuego(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
}
