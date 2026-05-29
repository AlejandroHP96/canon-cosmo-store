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

// Sine wave: pico al mediodía (~90%), mínimo a medianoche (~10%)
const getMakoLevel = (): number => {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    const normalized = minutes / (24 * 60);
    const level = Math.round(50 + 40 * Math.sin(2 * Math.PI * (normalized - 0.25)));
    return Math.max(10, Math.min(99, level));
};

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
    const [makoLevel, setMakoLevel] = useState(getMakoLevel);

    useEffect(() => {
        const id = setInterval(() => setMakoLevel(getMakoLevel()), 60_000);
        return () => clearInterval(id);
    }, []);

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

            <nav className="flex flex-col gap-2 font-headline font-bold text-lg flex-1 overflow-y-auto min-h-0 ff7-scrollbar">
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

            <div className="mt-auto tactical-frame overflow-hidden hidden md:block">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1f5e] border-b border-[#bec2ff]/20">
                    <span className="material-symbols-outlined text-sm text-primary">terminal</span>
                    <p className="text-[9px] text-primary tracking-[0.25em] font-headline uppercase">
                        Shinra Inc. Terminal
                    </p>
                    <span className="ml-auto w-1.5 h-1.5 bg-green-400 animate-ping shrink-0" />
                </div>
                <div className="p-3 pb-8 flex flex-col gap-2">
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-sm text-yellow-400">bolt</span>
                                <span className="text-[9px] font-headline text-[#bec2ff]/70 tracking-widest uppercase">Mako Lvl</span>
                            </div>
                            <span className="text-[9px] font-headline text-yellow-400">{makoLevel}%</span>
                        </div>
                        <div className="h-1 bg-[#bec2ff]/10 w-full">
                            <div
                                className="h-full bg-yellow-400/80 transition-all duration-[2000ms] ease-in-out"
                                style={{ width: `${makoLevel}%` }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-green-400">public</span>
                        <span className="text-[9px] font-headline text-[#bec2ff]/70 tracking-widest uppercase flex-1">Planeta</span>
                        <span className="text-[9px] font-headline text-green-400 tracking-widest">ESTABLE</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-red-400">warning</span>
                        <span className="text-[9px] font-headline text-[#bec2ff]/70 tracking-widest uppercase flex-1">Avalancha</span>
                        <span className="text-[9px] font-headline text-red-400 tracking-widest">DETECTADA</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-primary">wifi</span>
                        <span className="text-[9px] font-headline text-[#bec2ff]/70 tracking-widest uppercase flex-1">Señal</span>
                        <span className="text-[9px] font-headline text-primary tracking-widest">ACTIVA</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default SideNav;
