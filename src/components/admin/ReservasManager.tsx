import { useEffect, useMemo, useState } from 'react';
import {
    getReservas,
    deleteReserva,
    deleteAllReservas,
    type SolicitudReserva,
} from '../../services/reservasService';
import { inputClass } from './adminStyles';

const ReservasManager = () => {
    const [reservas, setReservas] = useState<SolicitudReserva[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
    const [search, setSearch] = useState('');
    const [seccionFiltro, setSeccionFiltro] = useState<string | null>(null);
    const [productoFiltro, setProductoFiltro] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const refresh = () => {
        setLoading(true);
        getReservas()
            .then((data) =>
                setReservas(
                    [...data].sort(
                        (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime(),
                    ),
                ),
            )
            .catch(() => setError('Error al cargar reservas.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { refresh(); }, []);

    const secciones = useMemo(
        () => [...new Set(reservas.map((r) => r.seccion))].sort(),
        [reservas],
    );

    const productos = useMemo(
        () => [...new Set(
            reservas
                .filter((r) => !seccionFiltro || r.seccion === seccionFiltro)
                .map((r) => r.productoNombre),
        )].sort(),
        [reservas, seccionFiltro],
    );

    const filtradas = useMemo(() => {
        const q = search.trim().toLowerCase();
        return reservas.filter((r) => {
            if (seccionFiltro && r.seccion !== seccionFiltro) return false;
            if (productoFiltro && r.productoNombre !== productoFiltro) return false;
            if (!q) return true;
            return (
                r.cliente.toLowerCase().includes(q) ||
                r.productoNombre.toLowerCase().includes(q) ||
                r.email.toLowerCase().includes(q)
            );
        });
    }, [reservas, search, seccionFiltro, productoFiltro]);

    const handleDelete = async (id: string) => {
        setSaving(true);
        setError(null);
        try {
            await deleteReserva(id);
            refresh();
        } catch {
            setError('Error al eliminar la reserva.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAll = async () => {
        setSaving(true);
        setError(null);
        try {
            await deleteAllReservas(reservas.map((r) => r.id));
            setConfirmDeleteAll(false);
            refresh();
        } catch {
            setError('Error al eliminar las reservas.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl flex flex-col h-[calc(100vh-180px)]">
            {error && (
                <div className="flex items-center gap-2 border border-error bg-error-container/20 px-3 py-2.5 mb-4 shrink-0">
                    <span className="material-symbols-outlined text-error text-base shrink-0">error</span>
                    <p className="text-sm font-body text-error flex-1">{error}</p>
                    <button onClick={() => setError(null)} className="text-error/60 hover:text-error shrink-0">
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                </div>
            )}

            {reservas.length > 0 && (
                <div className="shrink-0">
                    <div className="flex items-center justify-between gap-4 mb-3">
                        <div className="relative flex-1 max-w-xs">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">
                                search
                            </span>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar por cliente, producto o email..."
                                className={`${inputClass} pl-9 pr-8`}
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors">
                                    <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => setConfirmDeleteAll(true)}
                            disabled={saving}
                            className="flex items-center gap-1 border border-error text-error font-headline text-[10px] uppercase tracking-widest px-3 py-2 hover:bg-error-container/30 transition-colors disabled:opacity-40 shrink-0">
                            <span className="material-symbols-outlined text-sm">delete_sweep</span>
                            Eliminar todas
                        </button>
                    </div>

                    {secciones.length > 1 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            <button
                                onClick={() => { setSeccionFiltro(null); setProductoFiltro(null); }}
                                className={`px-3 py-1.5 font-headline text-[11px] uppercase tracking-wider border transition-all ${
                                    seccionFiltro === null
                                        ? 'border-primary text-primary bg-surface-container'
                                        : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                                }`}>
                                Todas
                            </button>
                            {secciones.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => { setSeccionFiltro(s); setProductoFiltro(null); }}
                                    className={`px-3 py-1.5 font-headline text-[11px] uppercase tracking-wider border transition-all ${
                                        seccionFiltro === s
                                            ? 'border-primary text-primary bg-surface-container'
                                            : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                                    }`}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    {productos.length > 1 && (
                        <div className="flex flex-wrap gap-1.5 mb-4 pl-2 border-l-2 border-primary/30">
                            <button
                                onClick={() => setProductoFiltro(null)}
                                className={`px-3 py-1 font-headline text-[10px] uppercase tracking-wider border transition-all ${
                                    productoFiltro === null
                                        ? 'border-primary text-primary bg-surface-container'
                                        : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                                }`}>
                                Todos los productos
                            </button>
                            {productos.map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setProductoFiltro(p)}
                                    className={`px-3 py-1 font-headline text-[10px] uppercase tracking-wider border transition-all ${
                                        productoFiltro === p
                                            ? 'border-primary text-primary bg-surface-container'
                                            : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                                    }`}>
                                    {p}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="flex-1 overflow-y-auto min-h-0">
            {loading ? (
                <div className="flex justify-center py-10">
                    <span className="material-symbols-outlined text-primary text-3xl animate-spin">
                        progress_activity
                    </span>
                </div>
            ) : reservas.length === 0 ? (
                <p className="text-sm font-body text-on-surface-variant text-center py-6">
                    No hay solicitudes de reserva todavía.
                </p>
            ) : filtradas.length === 0 ? (
                <p className="text-sm font-body text-on-surface-variant text-center py-6">
                    Ninguna reserva coincide con el filtro.
                </p>
            ) : (
                <div className="flex flex-col gap-1.5 pr-1">
                    {filtradas.map((reserva) => (
                        <div key={reserva.id} className="tactical-frame p-2.5">
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
                                    {reserva.email}
                                </span>
                                <span className="text-[10px] font-body text-on-surface-variant truncate hidden md:block w-24 shrink-0">
                                    {reserva.telefono || '—'}
                                </span>
                                <span className="text-[10px] font-body text-on-surface-variant shrink-0 hidden lg:block w-24">
                                    {new Date(reserva.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {reserva.notas && (
                                    <button
                                        onClick={() => setExpandedId(expandedId === reserva.id ? null : reserva.id)}
                                        className={`shrink-0 hover:text-primary transition-colors ${expandedId === reserva.id ? 'text-primary' : 'text-on-surface-variant'}`}
                                        title="Ver notas">
                                        <span className="material-symbols-outlined text-sm">sticky_note_2</span>
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(reserva.id)}
                                    disabled={saving}
                                    className="shrink-0 text-error hover:bg-error-container/30 p-1 transition-colors disabled:opacity-40"
                                    title="Eliminar">
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                            </div>
                            {expandedId === reserva.id && reserva.notas && (
                                <p className="text-xs font-body text-on-surface-variant italic border-t border-outline-variant/20 mt-2 pt-2">
                                    {reserva.notas}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
            </div>

            {confirmDeleteAll && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
                    <div className="tactical-frame p-6 w-full max-w-sm">
                        <h2 className="font-headline font-bold text-lg text-on-surface uppercase tracking-widest mb-2">
                            Eliminar todas las reservas
                        </h2>
                        <p className="text-sm font-body text-on-surface-variant mb-6">
                            ¿Seguro que quieres eliminar las {reservas.length} solicitudes de reserva? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmDeleteAll(false)}
                                disabled={saving}
                                className="flex-1 border border-outline-variant text-on-surface-variant font-headline text-xs uppercase tracking-widest py-2.5 hover:border-primary hover:text-primary transition-colors disabled:opacity-40">
                                Cancelar
                            </button>
                            <button
                                onClick={handleDeleteAll}
                                disabled={saving}
                                className="flex-1 border border-error bg-error-container/30 text-error font-headline text-xs uppercase tracking-widest py-2.5 hover:bg-error-container/60 transition-colors disabled:opacity-50">
                                {saving ? 'Eliminando...' : 'Eliminar todas'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReservasManager;
