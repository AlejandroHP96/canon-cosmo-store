import { useEffect, useMemo, useState } from 'react';
import {
    getReservas,
    deleteReserva,
    deleteAllReservas,
    type SolicitudReserva,
} from '../../../services/reservasService';
import ErrorBanner from '../../ErrorBanner';
import Spinner from '../../Spinner';
import ReservasFilters from './ReservasFilters';
import ReservaRow from './ReservaRow';
import ConfirmDeleteAllModal from './ConfirmDeleteAllModal';
import {
    filtrarReservas,
    ordenarPorFecha,
    productosDeReservas,
    seccionesDeReservas,
} from './reservasQuery';

const ReservasManager = () => {
    const [reservas, setReservas] = useState<SolicitudReserva[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
    const [search, setSearch] = useState('');
    const [seccion, setSeccion] = useState<string | null>(null);
    const [producto, setProducto] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const refresh = () => {
        setLoading(true);
        getReservas()
            .then((data) => setReservas(ordenarPorFecha(data)))
            .catch(() => setError('Error al cargar reservas.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        refresh();
    }, []);

    const secciones = useMemo(() => seccionesDeReservas(reservas), [reservas]);
    const productos = useMemo(
        () => productosDeReservas(reservas, seccion),
        [reservas, seccion],
    );
    const filtradas = useMemo(
        () => filtrarReservas(reservas, search, seccion, producto),
        [reservas, search, seccion, producto],
    );

    /** Envuelve un borrado con su estado de guardado, su error y el refresco. */
    const run = async (
        operacion: () => Promise<void>,
        mensajeError: string,
    ) => {
        setSaving(true);
        setError(null);
        try {
            await operacion();
            refresh();
        } catch {
            setError(mensajeError);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAll = () =>
        run(async () => {
            await deleteAllReservas(reservas.map((r) => r.id));
            setConfirmDeleteAll(false);
        }, 'Error al eliminar las reservas.');

    return (
        <div className="max-w-4xl flex flex-col h-[calc(100dvh-180px)]">
            <ErrorBanner
                message={error}
                onDismiss={() => setError(null)}
                className="mb-4 shrink-0"
            />

            {reservas.length > 0 && (
                <ReservasFilters
                    search={search}
                    secciones={secciones}
                    productos={productos}
                    seccion={seccion}
                    producto={producto}
                    saving={saving}
                    onSearchChange={setSearch}
                    onSeccionChange={(s) => {
                        setSeccion(s);
                        setProducto(null);
                    }}
                    onProductoChange={setProducto}
                    onDeleteAll={() => setConfirmDeleteAll(true)}
                />
            )}

            <div className="flex-1 overflow-y-auto overscroll-contain min-h-0">
                {loading ? (
                    <Spinner />
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
                            <ReservaRow
                                key={reserva.id}
                                reserva={reserva}
                                expanded={expandedId === reserva.id}
                                saving={saving}
                                onToggleNotas={() =>
                                    setExpandedId(
                                        expandedId === reserva.id
                                            ? null
                                            : reserva.id,
                                    )
                                }
                                onDelete={() =>
                                    run(
                                        () => deleteReserva(reserva.id),
                                        'Error al eliminar la reserva.',
                                    )
                                }
                            />
                        ))}
                    </div>
                )}
            </div>

            {confirmDeleteAll && (
                <ConfirmDeleteAllModal
                    count={reservas.length}
                    deleting={saving}
                    onClose={() => setConfirmDeleteAll(false)}
                    onConfirm={handleDeleteAll}
                />
            )}
        </div>
    );
};

export default ReservasManager;
