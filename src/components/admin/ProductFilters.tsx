import type { NavItem } from '../../services/navService';
import { pathToSectionId } from '../../lib/tcgUtils';

type Props = {
    navItems: NavItem[];
    filterMenuIdx: number | null;
    filterSectionId: string;
    selectedMenu: NavItem | null;
    onMenuChange: (idx: number | null) => void;
    onSectionChange: (sectionId: string) => void;
};

const ProductFilters = ({
    navItems,
    filterMenuIdx,
    filterSectionId,
    selectedMenu,
    onMenuChange,
    onSectionChange,
}: Props) => (
    <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
            <button
                onClick={() => onMenuChange(null)}
                className={`px-3 py-1.5 font-headline text-xs uppercase tracking-wider border transition-all ${
                    filterMenuIdx === null
                        ? 'border-primary text-primary bg-surface-container'
                        : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                }`}>
                Todos
            </button>
            {navItems.map((item, idx) => (
                <button
                    key={idx}
                    onClick={() => onMenuChange(idx)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 font-headline text-xs uppercase tracking-wider border transition-all ${
                        filterMenuIdx === idx
                            ? 'border-primary text-primary bg-surface-container'
                            : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                    }`}>
                    <span className="material-symbols-outlined text-sm">{item.icon}</span>
                    {item.label}
                </button>
            ))}
        </div>

        {(selectedMenu?.submenu?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-2 pl-2 border-l-2 border-primary/30">
                <button
                    onClick={() => onSectionChange('all')}
                    className={`px-3 py-1 font-headline text-[11px] uppercase tracking-wider border transition-all ${
                        filterSectionId === 'all'
                            ? 'border-primary text-primary bg-surface-container'
                            : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                    }`}>
                    Todos
                </button>
                {selectedMenu!.submenu!.map((sub) => {
                    const id = pathToSectionId(sub.path);
                    return (
                        <button
                            key={id}
                            onClick={() => onSectionChange(id)}
                            className={`px-3 py-1 font-headline text-[11px] uppercase tracking-wider border transition-all ${
                                filterSectionId === id
                                    ? 'border-primary text-primary bg-surface-container'
                                    : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                            }`}>
                            {sub.label}
                        </button>
                    );
                })}
            </div>
        )}
    </div>
);

export default ProductFilters;
