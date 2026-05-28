import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
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
};

const COL = 'torneos';

export const getTorneos = async (): Promise<Torneo[]> => {
    const snap = await getDocs(query(collection(db, COL), orderBy('hora')));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Torneo, 'id'>) }));
};

export const addTorneo = async (data: Omit<Torneo, 'id'>): Promise<void> => {
    await addDoc(collection(db, COL), data);
};

export const deleteTorneo = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COL, id));
};
