import { Link } from 'react-router-dom';

type HeaderProps = {
    onMenuToggle: () => void;
};

const Header = ({ onMenuToggle }: HeaderProps) => {
    return (
        <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-linear-to-b from-[#000180] to-[#060946] border-b-2 border-[#e0e0ff] shadow-[inset_0_0_8px_rgba(0,1,172,1)]">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuToggle}
                    className="md:hidden text-[#e0e0ff] hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <h1 className="text-xl md:text-2xl font-bold text-[#e0e0ff] font-headline uppercase tracking-widest">
                    CAÑÓN COSMO
                </h1>
            </div>
            <Link
                to="/aboutus"
                className="font-headline uppercase tracking-widest text-sm text-[#e0e0ff] opacity-70 hover:text-[#bec2ff] hover:opacity-100 transition-all">
                Sobre Nosotros
            </Link>
        </header>
    );
};

export default Header;
