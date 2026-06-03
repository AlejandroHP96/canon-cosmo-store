import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const TournamentBanner = () => {
    const { t } = useTranslation();

    return (
        <Link
            to="/torneos"
            className="tactical-frame flex items-center gap-4 md:gap-6 px-4 py-3 md:px-8 md:py-6 hover:bg-surface-bright transition-colors group overflow-hidden relative">
            <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent pointer-events-none" />
            <span className="material-symbols-outlined text-2xl md:text-4xl text-primary shrink-0 group-hover:scale-110 transition-transform">
                emoji_events
            </span>
            <div className="flex-1 min-w-0">
                <p className="text-[8px] md:text-[9px] font-headline text-primary/60 tracking-[0.2em] md:tracking-[0.3em] uppercase mb-0.5 md:mb-1">
                    {t('tournamentBanner.comingSoon')}
                </p>
                <h3 className="font-headline font-bold text-sm md:text-lg uppercase tracking-wide md:tracking-widest text-on-surface">
                    {t('tournamentBanner.title')}
                </h3>
                <p className="text-[11px] md:text-xs font-body text-on-surface-variant mt-0.5">
                    {t('tournamentBanner.description')}
                </p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors shrink-0">
                arrow_forward
            </span>
        </Link>
    );
};

export default TournamentBanner;
