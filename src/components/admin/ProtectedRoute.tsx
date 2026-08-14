import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../Spinner';

const ProtectedRoute = () => {
    const { user, isAdmin, loading } = useAuth();

    if (loading)
        return (
            <Spinner size="lg" className="min-h-screen bg-surface" />
        );

    // Esto es solo comodidad: la barrera real son las reglas de Firestore, que
    // exigen el mismo claim. Sirve para que a quien pierda el claim con la
    // sesión abierta no le reciba un panel lleno de errores de permisos.
    if (!user || !isAdmin) return <Navigate to="/cosmos-admin" replace />;

    return <Outlet />;
};

export default ProtectedRoute;
