import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading)
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-4xl animate-spin">
                    progress_activity
                </span>
            </div>
        );

    if (!user) return <Navigate to="/cosmos-admin" replace />;

    return <Outlet />;
};

export default ProtectedRoute;
