import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    query,
    orderBy,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export type DiaSemana =
    | 'lunes'
    | 'martes'
    | 'miercoles'
    | 'jueves'
    | 'viernes'
    | 'sabado'
    | 'domingo';

export type Torneo = {
    id: string;
    nombre: string;
    dia: DiaSemana;
    hora: string;
    descripcion?: string;
    estado: 'abierto' | 'cerrado';
};

const COL = 'torneos';

export const getTorneos = async (): Promise<Torneo[]> => {
    const snap = await getDocs(query(collection(db, COL), orderBy('hora')));
    return snap.docs.map((d) => ({
        id: d.id,
        estado: 'abierto',
        ...(d.data() as Omit<Torneo, 'id'>),
    }));
};

export const addTorneo = async (data: Omit<Torneo, 'id'>): Promise<void> => {
    await addDoc(collection(db, COL), data);
};

export const updateTorneoEstado = async (
    id: string,
    estado: Torneo['estado'],
): Promise<void> => {
    await updateDoc(doc(db, COL, id), { estado });
};

export const deleteTorneo = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COL, id));
};
