import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../hooks/useLanguage';
import CaitSithSprite from './CaitSithSprite';
import logo from '../../assets/logo.png';

type HeaderProps = {
    onMenuToggle: () => void;
};

/** Estilo común de los enlaces de la barra. */
const NAV_LINK =
    'font-headline uppercase tracking-widest text-sm text-[#e0e0ff] opacity-70 hover:text-[#bec2ff] hover:opacity-100 transition-all';

const Header = ({ onMenuToggle }: HeaderProps) => {
    const { t } = useTranslation();
    const { next: nextLang, toggle: toggleLang } = useLanguage();

    return (
        <header className="fixed top-0 w-full z-50 flex items-center h-[var(--header-h)] px-6 bg-linear-to-b from-[#000180] to-[#060946] border-b-2 border-[#e0e0ff] shadow-[inset_0_0_8px_rgba(0,1,172,1)]">
            <div className="flex items-center gap-4 shrink-0">
                <button
                    onClick={onMenuToggle}
                    className="md:hidden text-[#e0e0ff] hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">menu</span>
                </button>
                {/* En móvil no cabe el logo junto a los enlaces: se sustituye
                    por un "Inicio" de texto, con el mismo destino. */}
                <Link
                    to="/"
                    className="hidden sm:flex items-center gap-2 text-xl md:text-2xl font-bold text-[#e0e0ff] font-headline uppercase tracking-widest hover:text-primary transition-colors">
                    <img src={logo} alt="Cañón Cosmo Store" className="h-8 w-8 object-contain" />
                    <span className="hidden sm:inline">CAÑÓN COSMO STORE</span>
                </Link>
                <Link to="/" className={`sm:hidden ${NAV_LINK}`}>
                    {t('header.home')}
                </Link>
                <Link to="/torneos" className={`hidden sm:block ${NAV_LINK}`}>
                    {t('header.tournaments')}
                </Link>
                <Link to="/reservas" className={NAV_LINK}>
                    {t('header.reservas')}
                </Link>
            </div>

            <CaitSithSprite />

            <div className="flex items-center gap-4 shrink-0">
                <Link to="/aboutus" className={`hidden sm:block ${NAV_LINK}`}>
                    {t('header.aboutUs')}
                </Link>
                <button
                    onClick={toggleLang}
                    className="hidden md:block font-headline uppercase tracking-widest text-xs text-[#e0e0ff] opacity-60 hover:opacity-100 transition-all border border-[#e0e0ff]/30 px-2 py-0.5 hover:border-primary">
                    {nextLang.toUpperCase()}
                </button>
            </div>
        </header>
    );
};

export default Header;
