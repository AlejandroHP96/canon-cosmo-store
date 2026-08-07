import { inputClass } from '../adminStyles';

type Props = {
    categoria: string;
    editing: boolean;
    editValue: string;
    saving: boolean;
    onEditValueChange: (value: string) => void;
    onStartEdit: () => void;
    onRename: () => void;
    onCancelEdit: () => void;
    onRemove: () => void;
};

const CategoryRow = ({
    categoria,
    editing,
    editValue,
    saving,
    onEditValueChange,
    onStartEdit,
    onRename,
    onCancelEdit,
    onRemove,
}: Props) => (
    <div className="tactical-frame px-3 py-2 flex items-center gap-2">
        {editing ? (
            <>
                <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => onEditValueChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') onRename();
                        if (e.key === 'Escape') onCancelEdit();
                    }}
                    className={inputClass + ' flex-1 py-1 text-sm'}
                />
                <button
                    onClick={onRename}
                    disabled={saving}
                    className="text-primary hover:text-on-surface transition-colors disabled:opacity-40"
                    title="Guardar" aria-label="Guardar">
                    <span className="material-symbols-outlined text-sm">check</span>
                </button>
                <button
                    onClick={onCancelEdit}
                    className="text-on-surface-variant hover:text-on-surface transition-colors"
                    title="Cancelar" aria-label="Cancelar">
                    <span className="material-symbols-outlined text-sm">close</span>
                </button>
            </>
        ) : (
            <>
                <span className="font-body text-sm text-on-surface flex-1">{categoria}</span>
                <button
                    onClick={onStartEdit}
                    disabled={saving}
                    className="text-on-surface-variant hover:text-primary transition-colors disabled:opacity-40"
                    title="Editar" aria-label="Editar">
                    <span className="material-symbols-outlined text-sm">edit</span>
                </button>
                <button
                    onClick={onRemove}
                    disabled={saving}
                    className="text-on-surface-variant hover:text-error transition-colors disabled:opacity-40"
                    title="Eliminar" aria-label="Eliminar">
                    <span className="material-symbols-outlined text-sm">delete</span>
                </button>
            </>
        )}
    </div>
);

export default CategoryRow;
