import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import SideNav from '../SideNav/SideNav';
import Footer from '../Footer/Footer';
import KonamiEasterEgg from '../KonamiEasterEgg';

const Layout = () => {
    const [sideNavOpen, setSideNavOpen] = useState(false);

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
            <KonamiEasterEgg />
        </div>
    );
};

export default Layout;
