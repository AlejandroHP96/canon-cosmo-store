import {
    getAuth,
    browserSessionPersistence,
    setPersistence,
} from 'firebase/auth';
import { app } from './firebase';

export const auth = getAuth(app);

// La sesión se cierra al cerrar la pestaña
setPersistence(auth, browserSessionPersistence);
