import { createContext } from 'react';
import type { User } from 'firebase/auth';

export type AuthContextValue = {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
};

/** Vive aparte del provider para que el fichero del componente solo exporte
 *  componentes y Fast Refresh siga funcionando. Consúmelo con useAuth(). */
export const AuthContext = createContext<AuthContextValue | null>(null);
