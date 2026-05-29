import { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import SideNav from '../SideNav/SideNav';
import Footer from '../Footer/Footer';

const KONAMI = [
    'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
    'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
    'b','a',
];

const Layout = () => {
    const [sideNavOpen, setSideNavOpen] = useState(false);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const progress = useRef(0);

    useEffect(() => {
        progress.current = 0;
    }, [pathname]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (pathname !== '/aboutus') return;
            if (e.key === KONAMI[progress.current]) {
                progress.current += 1;
                if (progress.current === KONAMI.length) {
                    progress.current = 0;
                    navigate('/cosmos-admin');
                }
            } else {
                progress.current = e.key === KONAMI[0] ? 1 : 0;
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [navigate, pathname]);

    return (
        <div className="bg-background text-on-surface font-body overflow-hidden h-screen select-none">
            <Header onMenuToggle={() => setSideNavOpen((o) => !o)} />
            <SideNav
                isOpen={sideNavOpen}
                onClose={() => setSideNavOpen(false)}
            />
            {sideNavOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/60 md:hidden"
                    onClick={() => setSideNavOpen(false)}
                />
            )}
            <main className="md:ml-64 mt-16 p-8 h-[calc(100vh-100px)] overflow-y-auto bg-surface-dim">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
