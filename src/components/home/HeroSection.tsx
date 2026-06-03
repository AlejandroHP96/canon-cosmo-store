import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
    const { t } = useTranslation();

    return (
        <div className="tactical-frame mb-10 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-2 border-b border-outline-variant/30 bg-surface-container">
                <span className="w-1.5 h-1.5 bg-primary animate-ping shrink-0" />
                <p className="text-[9px] font-headline text-primary tracking-[0.35em] uppercase flex-1">
                    {t('hero.systemActive')}
                </p>
                <span className="text-[9px] font-headline text-on-surface-variant tracking-widest hidden sm:block">
                    VER.2.4.1
                </span>
            </div>

            <div className="grid md:grid-cols-2 gap-0">
                <div className="p-5 md:p-8 flex flex-col justify-center gap-4">
                    <div className="flex items-center gap-4">
                        <h1 className="font-headline font-bold uppercase leading-none tracking-widest">
                            <span className="block text-4xl md:text-5xl text-primary">Cañón</span>
                            <span className="block text-4xl md:text-5xl text-on-surface">Cosmo</span>
                            <span className="block text-lg md:text-xl text-on-surface-variant mt-1">Store</span>
                        </h1>
                        <img src="/logo.png" alt="Cañón Cosmo Store" className="ml-4 md:ml-10 w-24 h-24 md:w-36 md:h-36 object-contain shrink-0" />
                    </div>
                    <p className="text-sm text-on-surface-variant font-body leading-relaxed max-w-sm">
                        {t('hero.description')}
                    </p>
                </div>

                <div className="border-t md:border-t-0 md:border-l border-outline-variant/30 p-5 md:p-8 bg-surface-container/40 flex flex-col gap-3 justify-center">
                    <Link
                        to="/tcgs/pokemon"
                        className="flex items-center justify-center gap-2 border border-primary bg-primary/10 text-primary font-headline text-xs md:text-sm uppercase tracking-wider md:tracking-widest px-4 md:px-6 py-4 hover:bg-primary hover:text-surface transition-all">
                        <span className="material-symbols-outlined">playing_cards</span>
                        {t('hero.viewCatalog')}
                    </Link>
                    <Link
                        to="/torneos"
                        className="flex items-center justify-center gap-2 border border-outline-variant text-on-surface-variant font-headline text-xs md:text-sm uppercase tracking-wider md:tracking-widest px-4 md:px-6 py-4 hover:border-primary hover:text-primary transition-all">
                        <span className="material-symbols-outlined">emoji_events</span>
                        {t('hero.tournaments')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
