import type { NavItem, SubNavItem } from '../../../services/navService';
import { inputClass, labelClass } from '../adminStyles';

type Props = {
    navItems: NavItem[];
    navReady: boolean;
    menuIdx: number;
    subIdx: number;
    subOptions: SubNavItem[];
    onSelectMenu: (idx: number) => void;
    onSelectSub: (idx: number) => void;
};

/** Selector de menú + submenú del sidebar que determina la sección del producto. */
const SectionSelector = ({
    navItems,
    navReady,
    menuIdx,
    subIdx,
    subOptions,
    onSelectMenu,
    onSelectSub,
}: Props) => (
    <div className="border border-outline-variant/50 p-3 flex flex-col gap-2">
        <p className={labelClass}>Sección del catálogo</p>
        <div
            className={`grid gap-2 items-center ${subOptions.length > 0 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
            <div className="flex items-center gap-2">
                {navItems[menuIdx] && (
                    <span className="material-symbols-outlined text-primary text-base shrink-0">
                        {navItems[menuIdx].icon}
                    </span>
                )}
                <select
                    value={menuIdx}
                    onChange={(e) => onSelectMenu(Number(e.target.value))}
                    className={inputClass}
                    disabled={!navReady}>
                    {navItems.map((item, i) => (
                        <option key={i} value={i}>
                            {item.label}
                        </option>
                    ))}
                    {!navReady && <option>Cargando...</option>}
                </select>
            </div>
            {subOptions.length > 0 && (
                <select
                    value={subIdx}
                    onChange={(e) => onSelectSub(Number(e.target.value))}
                    className={inputClass}>
                    {subOptions.map((sub, i) => (
                        <option key={i} value={i}>
                            {sub.label}
                        </option>
                    ))}
                </select>
            )}
        </div>
    </div>
);

export default SectionSelector;
