import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import SideNav from '../SideNav/SideNav';
import Footer from '../Footer/Footer';

const Layout = () => {
    return (
        <div className="bg-background text-on-surface font-body overflow-hidden h-screen select-none">
            <Header />
            <SideNav />
            <main className="ml-64 mt-16 p-8 h-[calc(100vh-100px)] overflow-y-auto bg-surface-dim">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
