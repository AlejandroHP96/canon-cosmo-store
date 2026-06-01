import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Torneos from './pages/Torneos';
import GoldSaucer from './pages/GoldSaucer';
import TcgPage from './pages/tcgs/TcgPage';
import { AuthProvider } from './contexts/AuthContext';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminPanelPage from './pages/admin/AdminPanelPage';
import ProtectedRoute from './components/admin/ProtectedRoute';

const App = () => {
    return (
        <AuthProvider>
            <Routes>
                {/* Tienda pública */}
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/aboutus" element={<AboutUs />} />
                    <Route path="/torneos" element={<Torneos />} />
                    <Route path="/gold-saucer" element={<GoldSaucer />} />
                    {/* Catch-all: cualquier ruta no explícita renderiza TcgPage dinámicamente */}
                    <Route path="*" element={<TcgPage />} />
                </Route>

                {/* Admin — ruta oculta, sin Layout público */}
                <Route path="/cosmos-admin" element={<AdminLoginPage />} />
                <Route element={<ProtectedRoute />}>
                    <Route
                        path="/cosmos-admin/panel"
                        element={<AdminPanelPage />}
                    />
                </Route>
            </Routes>
        </AuthProvider>
    );
};

export default App;
