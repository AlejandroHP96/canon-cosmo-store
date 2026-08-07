import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Spinner from './components/Spinner';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Torneos from './pages/Torneos';
import Reservas from './pages/Reservas';
import TcgPage from './pages/tcgs/TcgPage';

// El admin y el SDK de autenticación se descargan solo al entrar en /cosmos-admin
const AdminArea = lazy(() => import('./pages/admin/AdminArea'));

const App = () => {
    return (
        <Routes>
            {/* Tienda pública */}
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/aboutus" element={<AboutUs />} />
                <Route path="/torneos" element={<Torneos />} />
                <Route path="/reservas" element={<Reservas />} />
                {/* Catch-all: cualquier ruta no explícita renderiza TcgPage dinámicamente */}
                <Route path="*" element={<TcgPage />} />
            </Route>

            {/* Admin — ruta oculta, sin Layout público */}
            <Route
                path="/cosmos-admin/*"
                element={
                    <Suspense fallback={<Spinner size="lg" className="min-h-screen bg-surface" />}>
                        <AdminArea />
                    </Suspense>
                }
            />
        </Routes>
    );
};

export default App;
