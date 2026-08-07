import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/admin/ProtectedRoute';
import AdminLoginPage from './AdminLoginPage';
import AdminPanelPage from './AdminPanelPage';

/**
 * Todo el admin cuelga de aquí, y App lo carga con React.lazy.
 * Así el panel, sus formularios y el SDK de autenticación quedan en un
 * chunk aparte que la tienda pública no llega a descargar.
 */
const AdminArea = () => (
    <AuthProvider>
        <Routes>
            <Route index element={<AdminLoginPage />} />
            <Route element={<ProtectedRoute />}>
                <Route path="panel" element={<AdminPanelPage />} />
            </Route>
        </Routes>
    </AuthProvider>
);

export default AdminArea;
