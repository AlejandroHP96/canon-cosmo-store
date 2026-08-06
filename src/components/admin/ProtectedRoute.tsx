import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../Spinner';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading)
        return (
            <Spinner size="lg" className="min-h-screen bg-surface" />
        );

    if (!user) return <Navigate to="/cosmos-admin" replace />;

    return <Outlet />;
};

export default ProtectedRoute;
