import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

const SideNav = ({ isOpen, onClose }: SideNavProps) => {
    // Inicializamos con defaults para evitar flash vacío mientras carga Firestore
    const [items, setItems] = useState<NavItem[]>(DEFAULT_SIDEBAR.items);

    // Set de índices cuyo submenú está abierto (el primero abre por defecto)
    const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]));
    const [hoveredItem, setHoveredItem] = useState<number | null>(null);

    useEffect(() => {
        getSidebarConfig()
            .then((config) => setItems(config.items))
            .catch(() => {
                // Mantener defaults si hay error
            });
    }, []);

    const toggle = (idx: number) =>
        setOpenItems((prev) => {
            const next = new Set(prev);
            if (next.has(idx)) next.delete(idx);
            else next.add(idx);
            return next;
        });

    return (
        <aside
            className={`fixed left-0 top-16 h-[calc(100vh-64px)] w-64 p-4 bg-[#141851] border-r-2 border-[#e0e0ff] shadow-[inset_0_0_10px_rgba(0,1,172,0.5)] flex flex-col z-40 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="mb-8 px-2">
                <h2 className="text-[#e0e0ff] font-black font-headline text-xl">
                    COMMAND
                </h2>
                <p className="text-[#bec2ff] text-[10px] tracking-[0.2em] font-headline">
                    SELECT ACTION
                </p>
            </div>

            <nav className="flex flex-col gap-2 font-headline font-bold text-lg">
                {items.map((item, idx) =>
                    item.submenu && item.submenu.length > 0 ? (
                        /* ── Entrada con submenú expandible ── */
                        <div key={idx}>
                            <button
                                onClick={() => toggle(idx)}
                                onMouseEnter={() => setHoveredItem(idx)}
                                onMouseLeave={() => setHoveredItem(null)}
                                className="relative w-full flex items-center py-3 px-6 text-[#bec2ff] hover:bg-[#2f336c] transition-all">
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
                        /* ── Entrada con ruta directa ── */
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
                        /* ── Entrada sin ruta explícita: deriva el path del label ── */
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
                    CURRENT STATUS
                </p>
                <p className="text-xs text-on-surface leading-tight font-body">
                    Bugenhagen's archive is open. Planetary health: STABLE.
                </p>
            </div>
        </aside>
    );
};

export default SideNav;
