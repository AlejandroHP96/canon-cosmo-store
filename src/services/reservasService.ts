import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    writeBatch,
    doc,
    query,
    orderBy,
    serverTimestamp,
    Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export type SolicitudReserva = {
    id: string;
    productoId: string;
    productoNombre: string;
    seccion: string;
    cliente: string;
    email: string;
    telefono: string;
    cantidad: number;
    notas: string;
    fecha: string;
    estado: 'pendiente' | 'confirmada' | 'cancelada';
};

const COLLECTION = 'reservas';

export async function getReservas(): Promise<SolicitudReserva[]> {
    const q = query(collection(db, COLLECTION), orderBy('fecha', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => {
        const data = d.data();
        const fecha = data.fecha instanceof Timestamp ? data.fecha.toDate().toISOString() : data.fecha;
        return { ...data, id: d.id, fecha } as SolicitudReserva;
    });
}

export async function addReserva(
    data: Omit<SolicitudReserva, 'id' | 'fecha' | 'estado'>,
): Promise<string> {
    const ref = await addDoc(collection(db, COLLECTION), {
        ...data,
        fecha: serverTimestamp(),
        estado: 'pendiente',
    });
    return ref.id;
}

export async function updateReservaEstado(
    id: string,
    estado: SolicitudReserva['estado'],
): Promise<void> {
    await updateDoc(doc(db, COLLECTION, id), { estado });
}

export async function deleteReserva(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
}

/** Elimina varias reservas en lotes de 500 (límite de writeBatch) */
export async function deleteAllReservas(ids: string[]): Promise<void> {
    const BATCH_SIZE = 500;
    for (let i = 0; i < ids.length; i += BATCH_SIZE) {
        const batch = writeBatch(db);
        ids.slice(i, i + BATCH_SIZE).forEach((id) =>
            batch.delete(doc(db, COLLECTION, id)),
        );
        await batch.commit();
    }
}
