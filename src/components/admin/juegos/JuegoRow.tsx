import type { JuegoTorneo } from '../../../services/torneosService';

type Props = {
    juego: JuegoTorneo;
    saving: boolean;
    onEdit: () => void;
    onDelete: () => void;
};

const JuegoRow = ({ juego, saving, onEdit, onDelete }: Props) => (
    <div className="tactical-frame p-4 flex items-center gap-4">
        {juego.imagen ? (
            <img
                src={juego.imagen}
                alt={juego.nombre}
                loading="lazy"
                decoding="async"
                className="w-14 h-14 object-cover shrink-0"
            />
        ) : (
            <div className="w-14 h-14 bg-surface-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary/30 text-2xl">
                    emoji_events
                </span>
            </div>
        )}
        <div className="flex-1 min-w-0">
            <p className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface truncate">
                {juego.nombre}
            </p>
            {juego.descripcion && (
                <p className="font-body text-xs text-on-surface-variant truncate">
                    {juego.descripcion}
                </p>
            )}
            {juego.url && (
                <p className="font-mono text-[10px] text-primary/50 truncate mt-0.5">
                    {juego.url}
                </p>
            )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
            <button
                onClick={onEdit}
                disabled={saving}
                className="text-on-surface-variant hover:text-primary transition-colors disabled:opacity-40"
                title="Editar"
                aria-label="Editar">
                <span className="material-symbols-outlined text-sm">edit</span>
            </button>
            <button
                onClick={onDelete}
                disabled={saving}
                className="text-on-surface-variant hover:text-error transition-colors disabled:opacity-40"
                title="Eliminar"
                aria-label="Eliminar">
                <span className="material-symbols-outlined text-sm">
                    delete
                </span>
            </button>
        </div>
    </div>
);

export default JuegoRow;
