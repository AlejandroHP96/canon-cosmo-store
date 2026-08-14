import { useEffect, useState } from 'react';
import {
    getJuegos,
    addJuego,
    updateJuego,
    deleteJuego,
    type JuegoTorneo,
} from '../../../services/torneosService';
import ErrorBanner from '../../ErrorBanner';
import Spinner from '../../Spinner';
import NewJuegoForm from './NewJuegoForm';
import JuegoRow from './JuegoRow';
import JuegoEditRow from './JuegoEditRow';
import {
    buildAddJuego,
    buildUpdateJuego,
    EMPTY_JUEGO_FORM,
    juegoToForm,
    type JuegoForm,
} from './juegoForm';

const JuegosManager = () => {
    const [juegos, setJuegos] = useState<JuegoTorneo[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState<JuegoForm>(EMPTY_JUEGO_FORM);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<JuegoForm>(EMPTY_JUEGO_FORM);

    const refresh = () => {
        setLoading(true);
        getJuegos()
            .then(setJuegos)
            .catch(() => setError('Error al cargar juegos.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        refresh();
    }, []);

    /** Envuelve una escritura con su estado de guardado, su error y el refresco. */
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

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.nombre.trim()) return;
        await run(async () => {
            await addJuego(buildAddJuego(form));
            setForm(EMPTY_JUEGO_FORM);
        }, 'Error al guardar. Inténtalo de nuevo.');
    };

    const handleEditSave = async () => {
        if (!editingId || !editForm.nombre.trim()) return;
        await run(async () => {
            await updateJuego(editingId, buildUpdateJuego(editForm));
            setEditingId(null);
        }, 'Error al guardar. Inténtalo de nuevo.');
    };

    const handleDelete = (id: string) =>
        run(() => deleteJuego(id), 'Error al eliminar.');

    return (
        <div className="max-w-2xl">
            <NewJuegoForm
                form={form}
                saving={saving}
                onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
                onSubmit={handleAdd}
            />

            <ErrorBanner
                message={error}
                onDismiss={() => setError(null)}
                className="mb-4"
            />

            {loading ? (
                <Spinner />
            ) : juegos.length === 0 ? (
                <p className="text-sm font-body text-on-surface-variant text-center py-6">
                    Sin juegos. Añade uno arriba.
                </p>
            ) : (
                <div className="flex flex-col gap-3">
                    {juegos.map((juego) =>
                        editingId === juego.id ? (
                            <JuegoEditRow
                                key={juego.id}
                                form={editForm}
                                saving={saving}
                                onChange={(patch) =>
                                    setEditForm((prev) => ({
                                        ...prev,
                                        ...patch,
                                    }))
                                }
                                onSave={handleEditSave}
                                onCancel={() => setEditingId(null)}
                            />
                        ) : (
                            <JuegoRow
                                key={juego.id}
                                juego={juego}
                                saving={saving}
                                onEdit={() => {
                                    setEditingId(juego.id);
                                    setEditForm(juegoToForm(juego));
                                }}
                                onDelete={() => handleDelete(juego.id)}
                            />
                        ),
                    )}
                </div>
            )}
        </div>
    );
};

export default JuegosManager;
