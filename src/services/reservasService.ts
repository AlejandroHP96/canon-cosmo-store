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
} from 'firebase/firestore/lite';
import { db } from '../lib/firebase';
import { generarLocalizador } from '../lib/localizador';

export type SolicitudReserva = {
    id: string;
    productoId: string;
    productoNombre: string;
    seccion: string;
    cliente: string;
    /** Código que el cliente enseña al recoger. Ver `lib/localizador`. */
    localizador: string;
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
        const fecha =
            data.fecha instanceof Timestamp
                ? data.fecha.toDate().toISOString()
                : data.fecha;
        // Las reservas creadas antes del localizador no traen el campo: se
        // rellena vacío para que la pantalla y la búsqueda no tengan que
        // andar comprobando si existe.
        return {
            ...data,
            id: d.id,
            fecha,
            localizador: data.localizador ?? '',
        } as SolicitudReserva;
    });
}

/**
 * Crea la solicitud y devuelve su localizador. El código se genera aquí y no
 * en la pantalla: así no hay forma de guardar una reserva sin él ni de que
 * dos sitios inventen formatos distintos.
 */
export async function addReserva(
    data: Omit<SolicitudReserva, 'id' | 'fecha' | 'estado' | 'localizador'>,
): Promise<{ id: string; localizador: string }> {
    const localizador = generarLocalizador();
    const ref = await addDoc(collection(db, COLLECTION), {
        ...data,
        localizador,
        fecha: serverTimestamp(),
        estado: 'pendiente',
    });
    return { id: ref.id, localizador };
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
