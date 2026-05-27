import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    getSidebarConfig,
    DEFAULT_SIDEBAR,
    type TcgNavItem,
    type NavEntry,
} from '../../services/navService';

type SideNavProps = {
    isOpen: boolean;
    onClose: () => void;
};

const SideNav = ({ isOpen, onClose }: SideNavProps) => {
    const [tcgOpen, setTcgOpen] = useState(true);
    const [tcgHovered, setTcgHovered] = useState(false);

    // Inicializamos con los defaults para que no haya flash vacío
    const [tcgItems, setTcgItems] = useState<TcgNavItem[]>(
        DEFAULT_SIDEBAR.tcgItems,
    );
    const [navEntries, setNavEntries] = useState<NavEntry[]>(
        DEFAULT_SIDEBAR.navEntries,
    );

    useEffect(() => {
        getSidebarConfig()
            .then((config) => {
                setTcgItems(config.tcgItems);
                setNavEntries(config.navEntries);
            })
            .catch(() => {
                // Mantener defaults si hay error
            });
    }, []);

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
                {/* TCGs entry with submenu */}
                <div>
                    <button
                        onClick={() => setTcgOpen((o) => !o)}
                        onMouseEnter={() => setTcgHovered(true)}
                        onMouseLeave={() => setTcgHovered(false)}
                        className="relative w-full flex items-center py-3 px-6 text-[#bec2ff] hover:bg-[#2f336c] transition-all">
                        <span
                            className="absolute left-1 text-xs transition-opacity duration-150"
                            style={{
                                opacity: tcgHovered || tcgOpen ? 1 : 0,
                                animation:
                                    tcgHovered || tcgOpen
                                        ? 'pulse-arrow 1s infinite'
                                        : 'none',
                            }}>
                            ▶
                        </span>
                        <span className="material-symbols-outlined mr-3">
                            playing_cards
                        </span>
                        <span className="flex-1 text-left">TCGs</span>
                        <span
                            className={`material-symbols-outlined text-base transition-transform duration-200 ${tcgOpen ? 'rotate-180' : ''}`}>
                            expand_more
                        </span>
                    </button>

                    {tcgOpen && (
                        <div className="ml-6 border-l-2 border-[#bec2ff]/30 flex flex-col">
                            {tcgItems.map(({ label, path }) => (
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

                {navEntries.map(({ icon, label }) => (
                    <a
                        key={label}
                        className="flex items-center py-3 pl-6 text-[#e0e0ff] opacity-70 hover:bg-[#2f336c] hover:opacity-100 transition-all"
                        href="#">
                        <span className="material-symbols-outlined mr-3">
                            {icon}
                        </span>
                        {label}
                    </a>
                ))}
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
