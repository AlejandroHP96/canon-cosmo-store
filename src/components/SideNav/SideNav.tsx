import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    getSidebarConfig,
    DEFAULT_SIDEBAR,
    type NavItem,
} from '../../services/navService';
import { toSlug } from '../../lib/tcgUtils';

type SideNavProps = {
    isOpen: boolean;
    onClose: () => void;
};

const NAV_CACHE_KEY = 'canon-cosmo-nav-config';

function getCachedItems(): NavItem[] {
    try {
        const raw = localStorage.getItem(NAV_CACHE_KEY);
        if (raw) return JSON.parse(raw) as NavItem[];
    } catch {
        // cache corrupto — ignorar
    }
    return DEFAULT_SIDEBAR.items;
}

const SideNav = ({ isOpen, onClose }: SideNavProps) => {
    const { t } = useTranslation();

    const cached = getCachedItems();
    const hasCachedFromFirestore = !!localStorage.getItem(NAV_CACHE_KEY);
    const [items, setItems] = useState<NavItem[]>(hasCachedFromFirestore ? cached : []);

    const [openItems, setOpenItems] = useState<Set<number>>(new Set());
    const [hoveredItem, setHoveredItem] = useState<number | null>(null);

    useEffect(() => {
        getSidebarConfig()
            .then((config) => {
                setItems(config.items);
                localStorage.setItem(NAV_CACHE_KEY, JSON.stringify(config.items));
            })
            .catch(() => {
                if (!hasCachedFromFirestore) setItems(DEFAULT_SIDEBAR.items);
            });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const toggle = (idx: number) =>
        setOpenItems((prev) => {
            if (prev.has(idx)) return new Set<number>();
            return new Set<number>([idx]);
        });

    return (
        <aside
            className={`fixed left-0 top-16 h-[calc(100vh-64px)] w-64 p-4 bg-[#141851] border-r-2 border-[#e0e0ff] shadow-[inset_0_0_10px_rgba(0,1,172,0.5)] flex flex-col z-40 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="mb-8 px-2">
                <h2 className="text-[#e0e0ff] font-black font-headline text-xl">
                    {t('sidenav.command')}
                </h2>
                <p className="text-[#bec2ff] text-[10px] tracking-[0.2em] font-headline">
                    {t('sidenav.selectAction')}
                </p>
            </div>

            <nav className="flex flex-col gap-2 font-headline font-bold text-lg flex-1 overflow-y-auto min-h-0">
                {items.length === 0 && (
                    <div className="flex flex-col gap-2 px-2 opacity-30 animate-pulse">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-10 bg-[#bec2ff]/20 rounded-sm" />
                        ))}
                    </div>
                )}
                {items.map((item, idx) =>
                    item.submenu && item.submenu.length > 0 ? (
                        <div key={idx}>
                            <button
                                onClick={() => toggle(idx)}
                                onMouseEnter={() => setHoveredItem(idx)}
                                onMouseLeave={() => setHoveredItem(null)}
                                className="relative w-full flex items-center py-3 px-6 text-[#bec2ff] hover:bg-[#2f336c] transition-all cursor-pointer">
                                <span
                                    className="absolute left-1 text-xs transition-opacity duration-150"
                                    style={{
                                        opacity:
                                            hoveredItem === idx ||
                                            openItems.has(idx)
                                                ? 1
                                                : 0,
                                        animation:
                                            hoveredItem === idx ||
                                            openItems.has(idx)
                                                ? 'pulse-arrow 1s infinite'
                                                : 'none',
                                    }}>
                                    ▶
                                </span>
                                <span className="material-symbols-outlined mr-3">
                                    {item.icon}
                                </span>
                                <span className="flex-1 text-left">
                                    {item.label}
                                </span>
                                <span
                                    className={`material-symbols-outlined text-base transition-transform duration-200 ${openItems.has(idx) ? 'rotate-180' : ''}`}>
                                    expand_more
                                </span>
                            </button>

                            {openItems.has(idx) && (
                                <div className="ml-6 border-l-2 border-[#bec2ff]/30 flex flex-col">
                                    {item.submenu.map(({ label, path }) => (
                                        <Link
                                            key={label}
                                            to={path}
                                            onClick={onClose}
                                            className="py-2 pl-4 text-sm text-[#e0e0ff] opacity-60 hover:opacity-100 hover:bg-[#2f336c] hover:text-[#bec2ff] transition-all">
                                            {label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : item.path ? (
                        <Link
                            key={idx}
                            to={item.path}
                            onClick={onClose}
                            className="flex items-center py-3 pl-6 text-[#e0e0ff] opacity-70 hover:bg-[#2f336c] hover:opacity-100 transition-all">
                            <span className="material-symbols-outlined mr-3">
                                {item.icon}
                            </span>
                            {item.label}
                        </Link>
                    ) : (
                        <Link
                            key={idx}
                            to={`/${toSlug(item.label)}`}
                            onClick={onClose}
                            className="flex items-center py-3 pl-6 text-[#e0e0ff] opacity-70 hover:bg-[#2f336c] hover:opacity-100 transition-all">
                            <span className="material-symbols-outlined mr-3">
                                {item.icon}
                            </span>
                            {item.label}
                        </Link>
                    ),
                )}
            </nav>

            <div className="mt-auto tactical-frame p-4 relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="material-symbols-outlined text-8xl">
                        auto_awesome
                    </span>
                </div>
                <p className="text-[10px] text-primary mb-1 font-headline">
                    {t('sidenav.currentStatus')}
                </p>
                <p className="text-xs text-on-surface leading-tight font-body">
                    {t('sidenav.statusMessage')}
                </p>
            </div>
        </aside>
    );
};

export default SideNav;
