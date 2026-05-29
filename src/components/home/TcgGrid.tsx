import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    getSidebarConfig,
    DEFAULT_SIDEBAR,
    type NavItem,
} from '../../services/navService';
import { TCG_CARDS } from '../../data/tcgCards';

const NAV_CACHE_KEY = 'canon-cosmo-nav-config';

const colorMap = Object.fromEntries(TCG_CARDS.map((c) => [c.path, c.color]));

function getTcgSubmenu(): { label: string; path: string }[] {
    try {
        const raw = localStorage.getItem(NAV_CACHE_KEY);
        if (raw) {
            const items: NavItem[] = JSON.parse(raw);
            const group = items.find((i) => i.label === 'TCGs');
            if (group?.submenu?.length) return group.submenu;
        }
    } catch {
        // cache corrupto — ignorar
    }
    return DEFAULT_SIDEBAR.items[0].submenu ?? [];
}

const TcgGrid = () => {
    const { t } = useTranslation();
    const hasCached = !!localStorage.getItem(NAV_CACHE_KEY);
    const [tcgItems, setTcgItems] = useState(hasCached ? getTcgSubmenu() : []);

    useEffect(() => {
        getSidebarConfig()
            .then((config) => {
                const group = config.items.find((i) => i.label === 'TCGs');
                if (group?.submenu?.length) setTcgItems(group.submenu);
            })
            .catch(() => {
                if (!hasCached) setTcgItems(DEFAULT_SIDEBAR.items[0].submenu ?? []);
            });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
                        className="tactical-frame flex overflow-hidden group hover:bg-surface-bright transition-colors">
                        <div
                            className="w-1 shrink-0 transition-all group-hover:w-1.5"
                            style={{ backgroundColor: colorMap[tcg.path] ?? '#bec2ff' }}
                        />
                        <div className="flex-1 p-5 flex flex-col gap-3">
                            <div className="flex-1">
                                <h3 className="font-headline font-bold text-base text-on-surface uppercase tracking-wider leading-tight">
                                    {tcg.label}
                                </h3>
                            </div>
                            <div className="text-[10px] font-headline text-on-surface-variant uppercase tracking-widest group-hover:text-primary transition-colors">
                                <span>{t('tcgGrid.viewCatalog')}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    );
};

export default TcgGrid;
