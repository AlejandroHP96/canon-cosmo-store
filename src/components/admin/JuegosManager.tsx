import { useEffect, useState } from 'react';
import {
    getJuegos,
    addJuego,
    updateJuego,
    deleteJuego,
    type JuegoTorneo,
} from '../../services/torneosService';
import { inputClass, labelClass } from './adminStyles';

const EMPTY_JUEGO = { nombre: '', imagen: '', descripcion: '', url: '' };

const JuegosManager = () => {
    const [juegos, setJuegos] = useState<JuegoTorneo[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState({ ...EMPTY_JUEGO });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ ...EMPTY_JUEGO });

    const refresh = () => {
        setLoading(true);
        getJuegos()
            .then(setJuegos)
            .catch(() => setError('Error al cargar juegos.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { refresh(); }, []);

    const setField = <K extends keyof typeof form>(key: K, value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const setEditField = <K extends keyof typeof editForm>(key: K, value: string) =>
        setEditForm((prev) => ({ ...prev, [key]: value }));

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.nombre.trim()) return;
        setSaving(true);
        setError(null);
        try {
            const payload: Omit<JuegoTorneo, 'id'> = { nombre: form.nombre.trim() };
            if (form.imagen.trim()) payload.imagen = form.imagen.trim();
            if (form.descripcion.trim()) payload.descripcion = form.descripcion.trim();
            if (form.url.trim()) payload.url = form.url.trim();
            await addJuego(payload);
            setForm({ ...EMPTY_JUEGO });
            refresh();
        } catch {
            setError('Error al guardar. Inténtalo de nuevo.');
        } finally {
            setSaving(false);
        }
    };

    const handleEditStart = (juego: JuegoTorneo) => {
        setEditingId(juego.id);
        setEditForm({
            nombre: juego.nombre,
            imagen: juego.imagen ?? '',
            descripcion: juego.descripcion ?? '',
            url: juego.url ?? '',
        });
    };

    const handleEditSave = async () => {
        if (!editingId || !editForm.nombre.trim()) return;
        setSaving(true);
        setError(null);
        try {
            await updateJuego(editingId, {
                nombre: editForm.nombre.trim(),
                imagen: editForm.imagen.trim() || undefined,
                descripcion: editForm.descripcion.trim() || undefined,
                url: editForm.url.trim() || undefined,
            });
            setEditingId(null);
            refresh();
        } catch {
            setError('Error al guardar. Inténtalo de nuevo.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        setSaving(true);
        try {
            await deleteJuego(id);
            refresh();
        } catch {
            setError('Error al eliminar.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-2xl">
            {/* Formulario añadir */}
            <div className="border border-dashed border-outline-variant/60 p-4 mb-8">
                <p className={labelClass}>Nuevo juego</p>
                <form onSubmit={handleAdd} className="flex flex-col gap-3 mt-2">
                    <div>
                        <label className={labelClass}>Nombre</label>
                        <input
                            required
                            value={form.nombre}
                            onChange={(e) => setField('nombre', e.target.value)}
                            placeholder="Pokémon, Dragon Ball..."
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Imagen (URL, opcional)</label>
                        <input
                            type="url"
                            value={form.imagen}
                            onChange={(e) => setField('imagen', e.target.value)}
                            placeholder="https://..."
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Descripción (opcional)</label>
                        <input
                            value={form.descripcion}
                            onChange={(e) => setField('descripcion', e.target.value)}
                            placeholder="Formato, info adicional..."
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>URL (opcional — el cuadrado abrirá este enlace)</label>
                        <input
                            type="url"
                            value={form.url}
                            onChange={(e) => setField('url', e.target.value)}
                            placeholder="https://..."
                            className={inputClass}
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={saving || !form.nombre.trim()}
                            className="border border-primary text-primary font-headline text-xs uppercase tracking-widest px-6 py-2 hover:bg-primary hover:text-surface transition-colors disabled:opacity-40">
                            {saving ? 'Guardando...' : 'Añadir juego'}
                        </button>
                    </div>
                </form>
            </div>

            {error && (
                <div className="flex items-center gap-2 border border-error bg-error-container/20 px-3 py-2.5 mb-4">
                    <span className="material-symbols-outlined text-error text-base shrink-0">error</span>
                    <p className="text-sm font-body text-error flex-1">{error}</p>
                    <button onClick={() => setError(null)} className="text-error/60 hover:text-error shrink-0">
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-10">
                    <span className="material-symbols-outlined text-primary text-3xl animate-spin">
                        progress_activity
                    </span>
                </div>
            ) : juegos.length === 0 ? (
                <p className="text-sm font-body text-on-surface-variant text-center py-6">
                    Sin juegos. Añade uno arriba.
                </p>
            ) : (
                <div className="flex flex-col gap-3">
                    {juegos.map((juego) =>
                        editingId === juego.id ? (
                            <div key={juego.id} className="tactical-frame p-4 flex flex-col gap-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelClass}>Nombre</label>
                                        <input
                                            required
                                            value={editForm.nombre}
                                            onChange={(e) => setEditField('nombre', e.target.value)}
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Imagen (URL)</label>
                                        <input
                                            type="url"
                                            value={editForm.imagen}
                                            onChange={(e) => setEditField('imagen', e.target.value)}
                                            placeholder="https://..."
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Descripción</label>
                                        <input
                                            value={editForm.descripcion}
                                            onChange={(e) => setEditField('descripcion', e.target.value)}
                                            placeholder="Formato, info adicional..."
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>URL</label>
                                        <input
                                            type="url"
                                            value={editForm.url}
                                            onChange={(e) => setEditField('url', e.target.value)}
                                            placeholder="https://..."
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <button
                                        onClick={() => setEditingId(null)}
                                        className="border border-outline-variant text-on-surface-variant font-headline text-xs uppercase tracking-widest px-4 py-1.5 hover:border-primary hover:text-primary transition-colors">
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleEditSave}
                                        disabled={saving || !editForm.nombre.trim()}
                                        className="border border-primary text-primary font-headline text-xs uppercase tracking-widest px-4 py-1.5 hover:bg-primary hover:text-surface transition-colors disabled:opacity-40">
                                        {saving ? 'Guardando...' : 'Guardar'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div key={juego.id} className="tactical-frame p-4 flex items-center gap-4">
                                {juego.imagen ? (
                                    <img
                                        src={juego.imagen}
                                        alt={juego.nombre}
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
                                        onClick={() => handleEditStart(juego)}
                                        disabled={saving}
                                        className="text-on-surface-variant hover:text-primary transition-colors disabled:opacity-40"
                                        title="Editar">
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(juego.id)}
                                        disabled={saving}
                                        className="text-on-surface-variant hover:text-error transition-colors disabled:opacity-40"
                                        title="Eliminar">
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </div>
                        ),
                    )}
                </div>
            )}
        </div>
    );
};

export default JuegosManager;
