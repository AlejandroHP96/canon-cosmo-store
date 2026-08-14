import { useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    type User,
} from 'firebase/auth';
import { auth } from '../lib/firebaseAuth';
import { AuthContext } from './authContext';

/** Lee el custom claim `admin` del ID token. Es el mismo que exige
 *  firestore.rules, así que la UI y los datos deciden con el mismo criterio. */
async function hasAdminClaim(user: User): Promise<boolean> {
    const { claims } = await user.getIdTokenResult();
    return claims.admin === true;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                setIsAdmin(
                    firebaseUser ? await hasAdminClaim(firebaseUser) : false,
                );
            } catch {
                // Leer el claim va a la red y puede fallar. Sin el try, la
                // excepción se tragaría el setLoading(false) de abajo y el
                // panel se quedaría con el spinner puesto para siempre.
                setIsAdmin(false);
            } finally {
                setUser(firebaseUser);
                setLoading(false);
            }
        });
        return unsubscribe;
    }, []);

    const signIn = async (email: string, password: string) => {
        const credential = await signInWithEmailAndPassword(
            auth,
            email,
            password,
        );

        // Credenciales válidas no bastan: sin el claim, Firestore rechazaría
        // cualquier escritura. Se cierra la sesión para no dejar al usuario
        // dentro de un panel que no puede usar.
        if (!(await hasAdminClaim(credential.user))) {
            await firebaseSignOut(auth);
            throw Object.assign(new Error('La cuenta no es administradora'), {
                code: 'auth/not-admin',
            });
        }
    };

    const signOut = async () => {
        await firebaseSignOut(auth);
    };

    return (
        <AuthContext.Provider
            value={{ user, isAdmin, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};
