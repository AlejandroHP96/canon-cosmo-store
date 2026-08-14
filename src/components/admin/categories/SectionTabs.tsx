import type { NavItem, SubNavItem } from '../../../services/navService';

const activeClass = 'border-primary text-primary bg-surface-container';
const idleClass =
    'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary';

type Props = {
    navItems: NavItem[];
    subOptions: SubNavItem[];
    menuIdx: number;
    subIdx: number;
    onSelectMenu: (idx: number) => void;
    onSelectSub: (idx: number) => void;
};

/** Menús de primer nivel y, debajo, los subitems del menú activo. */
const SectionTabs = ({
    navItems,
    subOptions,
    menuIdx,
    subIdx,
    onSelectMenu,
    onSelectSub,
}: Props) => (
    <>
        <div className="flex flex-wrap gap-2 mb-2">
            {navItems.map((item, idx) => (
                <button
                    key={idx}
                    onClick={() => onSelectMenu(idx)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 font-headline text-xs uppercase tracking-wider border transition-all ${
                        menuIdx === idx ? activeClass : idleClass
                    }`}>
                    <span className="material-symbols-outlined text-sm">
                        {item.icon}
                    </span>
                    {item.label}
                </button>
            ))}
        </div>

        {subOptions.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-6 pl-2 border-l-2 border-primary/30">
                {subOptions.map((sub, idx) => (
                    <button
                        key={sub.path}
                        onClick={() => onSelectSub(idx)}
                        className={`px-3 py-1 font-headline text-[11px] uppercase tracking-wider border transition-all ${
                            subIdx === idx ? activeClass : idleClass
                        }`}>
                        {sub.label}
                    </button>
                ))}
            </div>
        ) : (
            <div className="mb-6" />
        )}
    </>
);

export default SectionTabs;
