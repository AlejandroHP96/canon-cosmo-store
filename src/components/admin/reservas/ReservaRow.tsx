import type { SolicitudReserva } from '../../../services/reservasService';

const FECHA_FORMATO: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
};

type Props = {
    reserva: SolicitudReserva;
    expanded: boolean;
    saving: boolean;
    onToggleNotas: () => void;
    onDelete: () => void;
};

const ReservaRow = ({ reserva, expanded, saving, onToggleNotas, onDelete }: Props) => (
    <div className="tactical-frame p-2.5">
        <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
                <span className="font-headline font-bold text-xs uppercase text-on-surface truncate">
                    {reserva.cliente}
                </span>
                <span className="text-on-surface-variant/50 text-xs">→</span>
                <span className="font-headline text-xs text-primary uppercase truncate">
                    {reserva.productoNombre}
                </span>
                <span className="text-[10px] font-body text-on-surface-variant shrink-0">
                    ×{reserva.cantidad}
                </span>
            </div>
            <span className="text-[10px] font-body text-on-surface-variant truncate hidden sm:block w-36 shrink-0">
                {reserva.email || '—'}
            </span>
            <span className="text-[10px] font-body text-on-surface-variant truncate hidden md:block w-24 shrink-0">
                {reserva.telefono || '—'}
            </span>
            <span className="text-[10px] font-body text-on-surface-variant shrink-0 hidden lg:block w-24">
                {new Date(reserva.fecha).toLocaleDateString('es-ES', FECHA_FORMATO)}
            </span>
            {reserva.notas && (
                <button
                    onClick={onToggleNotas}
                    className={`shrink-0 hover:text-primary transition-colors ${
                        expanded ? 'text-primary' : 'text-on-surface-variant'
                    }`}
                    title="Ver notas" aria-label="Ver notas">
                    <span className="material-symbols-outlined text-sm">sticky_note_2</span>
                </button>
            )}
            <button
                onClick={onDelete}
                disabled={saving}
                className="shrink-0 text-error hover:bg-error-container/30 p-1 transition-colors disabled:opacity-40"
                title="Eliminar" aria-label="Eliminar">
                <span className="material-symbols-outlined text-sm">delete</span>
            </button>
        </div>
        {expanded && reserva.notas && (
            <p className="text-xs font-body text-on-surface-variant italic border-t border-outline-variant/20 mt-2 pt-2">
                {reserva.notas}
            </p>
        )}
    </div>
);

export default ReservaRow;
