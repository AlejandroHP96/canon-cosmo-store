import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNavItems } from '../../hooks/useNavItems';
import { TCG_CARDS } from '../../data/tcgCards';

const colorMap = Object.fromEntries(TCG_CARDS.map((c) => [c.path, c.color]));

const TcgGrid = () => {
    const { t } = useTranslation();
    const navItems = useNavItems();
    const tcgItems = navItems.find((i) => i.label === 'TCGs')?.submenu ?? [];

    return (
        <>
            <div className="flex items-center gap-4 mb-5">
                <h2 className="font-headline text-primary text-xs tracking-[0.3em] uppercase">
                    {t('tcgGrid.title')}
                </h2>
                <div className="flex-1 h-px bg-outline-variant/30" />
                <span className="text-[9px] font-headline text-on-surface-variant tracking-widest">
                    {tcgItems.length} {t('tcgGrid.sections')}
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {tcgItems.length === 0 && (
                    <div className="col-span-full flex flex-col gap-2 opacity-30 animate-pulse">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-20 bg-[#bec2ff]/20 rounded-sm" />
                        ))}
                    </div>
                )}
                {tcgItems.map((tcg) => (
                    <Link
                        key={tcg.path}
                        to={tcg.path}
                        className="tactical-frame overflow-hidden hover:border-primary transition-colors"
                        style={{ borderLeftColor: colorMap[tcg.path] ?? '#bec2ff', borderLeftWidth: '3px' }}>
                        <div className="relative h-40 overflow-hidden group">
                            {tcg.image ? (
                                <img
                                    src={tcg.image}
                                    alt={tcg.label}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full bg-surface-container flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary/20 text-7xl">playing_cards</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#010241] via-[#010241]/60 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-1">
                                <h3 className="font-headline font-bold text-base uppercase tracking-widest text-on-surface">
                                    {tcg.label}
                                </h3>
                                <span className="text-[10px] font-headline text-on-surface-variant uppercase tracking-widest group-hover:text-primary transition-colors">
                                    {t('tcgGrid.viewCatalog')}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    );
};

export default TcgGrid;
