import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ProductsView from '../../components/admin/ProductsView';
import CategoriesManager from '../../components/admin/CategoriesManager';
import NavManager from '../../components/admin/NavManager';
import JuegosManager from '../../components/admin/JuegosManager';

type AdminView = 'products' | 'categories' | 'nav' | 'torneos';

const TABS: { id: AdminView; label: string; icon: string }[] = [
    { id: 'products',   label: 'Productos',  icon: 'inventory' },
    { id: 'categories', label: 'Categorías', icon: 'folder' },
    { id: 'nav',        label: 'Navegación', icon: 'menu' },
    { id: 'torneos',    label: 'Torneos',    icon: 'emoji_events' },
];

const AdminPanelPage = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [adminView, setAdminView] = useState<AdminView>('products');

    const handleSignOut = async () => {
        await signOut();
        navigate('/cosmos-admin', { replace: true });
    };

    return (
        <div className="min-h-screen bg-surface text-on-surface">
            <header className="sticky top-0 z-40 border-b-2 border-[#e0e0ff] bg-primary-container px-6 py-3 flex items-center justify-between shadow-[inset_0_0_8px_rgba(0,1,172,1)]">
                <Link to="/" className="group">
                    <p className="text-[10px] font-headline text-primary/60 tracking-[0.3em] uppercase group-hover:text-primary transition-colors">
                        COSMOS-ADMIN
                    </p>
                    <p className="font-headline font-bold text-on-surface uppercase tracking-widest text-sm group-hover:text-primary transition-colors">
                        Panel de Control
                    </p>
                </Link>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-headline text-on-surface-variant hidden sm:block">
                        {user?.email}
                    </span>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-1.5 border border-outline-variant text-on-surface-variant font-headline text-[10px] uppercase tracking-widest px-3 py-1.5 hover:border-primary hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-sm">logout</span>
                        Salir
                    </button>
                </div>
            </header>

            <div className="border-b border-outline-variant/30 px-6 flex gap-0">
                {TABS.map(({ id, label, icon }) => (
                    <button
                        key={id}
                        onClick={() => setAdminView(id)}
                        className={`flex items-center gap-2 px-4 py-3 font-headline text-xs uppercase tracking-widest border-b-2 transition-all ${
                            adminView === id
                                ? 'border-primary text-primary'
                                : 'border-transparent text-on-surface-variant hover:text-on-surface'
                        }`}>
                        <span className="material-symbols-outlined text-sm">{icon}</span>
                        {label}
                    </button>
                ))}
            </div>

            <div className="p-6">
                {adminView === 'products'   && <ProductsView />}
                {adminView === 'categories' && <CategoriesManager />}
                {adminView === 'nav'        && <NavManager />}
                {adminView === 'torneos'    && <JuegosManager />}
            </div>
        </div>
    );
};

export default AdminPanelPage;
