import type { NavItem } from '../../../services/navService';

type Props = {
    item: NavItem;
    expanded: boolean;
    saving: boolean;
    onToggleExpand: () => void;
    onEdit: () => void;
    onDelete: () => void;
};

/** Fila de una entrada de primer nivel en modo lectura. */
const NavItemRow = ({ item, expanded, saving, onToggleExpand, onEdit, onDelete }: Props) => (
    <div className="px-4 py-3 flex items-center gap-3">
        <span
            className="material-symbols-outlined text-on-surface-variant/40 hover:text-on-surface-variant text-base shrink-0 cursor-grab active:cursor-grabbing"
            title="Arrastrar para reordenar">
            drag_indicator
        </span>
        <span className="material-symbols-outlined text-primary text-base shrink-0">{item.icon}</span>
        <span className="font-body text-sm text-on-surface flex-1">{item.label}</span>
        {item.path && (
            <span className="font-mono text-xs text-on-surface-variant hidden sm:block truncate max-w-32">
                {item.path}
            </span>
        )}
        {(item.submenu?.length ?? 0) > 0 && (
            <span className="text-[10px] font-headline text-primary/50 shrink-0 hidden sm:block">
                {item.submenu!.length} sub{item.submenu!.length !== 1 ? 's' : ''}
            </span>
        )}
        <div className="flex items-center gap-1 shrink-0">
            <button
                onClick={onToggleExpand}
                disabled={saving}
                className={`transition-colors disabled:opacity-40 ${expanded ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
                title="Gestionar submenú">
                <span
                    className={`material-symbols-outlined text-sm transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
                    expand_more
                </span>
            </button>
            <button
                onClick={onEdit}
                disabled={saving}
                className="text-on-surface-variant hover:text-primary transition-colors disabled:opacity-40"
                title="Editar">
                <span className="material-symbols-outlined text-sm">edit</span>
            </button>
            <button
                onClick={onDelete}
                disabled={saving}
                className="text-on-surface-variant hover:text-error transition-colors disabled:opacity-40"
                title="Eliminar">
                <span className="material-symbols-outlined text-sm">delete</span>
            </button>
        </div>
    </div>
);

export default NavItemRow;
