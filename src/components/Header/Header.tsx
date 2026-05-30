import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type HeaderProps = {
    onMenuToggle: () => void;
};

const LANGS = ['es', 'en'] as const;

const Header = ({ onMenuToggle }: HeaderProps) => {
    const { t, i18n } = useTranslation();

    const toggleLang = () => {
        const next = i18n.language === 'es' ? 'en' : 'es';
        i18n.changeLanguage(next);
        localStorage.setItem('canon-cosmo-lang', next);
    };

    return (
        <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-linear-to-b from-[#000180] to-[#060946] border-b-2 border-[#e0e0ff] shadow-[inset_0_0_8px_rgba(0,1,172,1)]">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuToggle}
                    className="md:hidden text-[#e0e0ff] hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <Link
                    to="/"
                    className="flex items-center gap-2 text-xl md:text-2xl font-bold text-[#e0e0ff] font-headline uppercase tracking-widest hover:text-primary transition-colors">
                    <img src="/logo.png" alt="Cañón Cosmo Store" className="h-8 w-8 object-contain" />
                    CAÑÓN COSMO STORE
                </Link>
                <Link
                    to="/torneos"
                    className="hidden sm:block font-headline uppercase tracking-widest text-sm text-[#e0e0ff] opacity-70 hover:text-[#bec2ff] hover:opacity-100 transition-all">
                    {t('header.tournaments')}
                </Link>
            </div>
            <div className="flex items-center gap-4">
                <Link
                    to="/aboutus"
                    className="font-headline uppercase tracking-widest text-sm text-[#e0e0ff] opacity-70 hover:text-[#bec2ff] hover:opacity-100 transition-all">
                    {t('header.aboutUs')}
                </Link>
                <button
                    onClick={toggleLang}
                    className="font-headline uppercase tracking-widest text-xs text-[#e0e0ff] opacity-60 hover:opacity-100 transition-all border border-[#e0e0ff]/30 px-2 py-0.5 hover:border-primary">
                    {LANGS.find((l) => l !== i18n.language)?.toUpperCase()}
                </button>
            </div>
        </header>
    );
};

export default Header;
