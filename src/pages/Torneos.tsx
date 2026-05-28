import { useEffect, useState } from 'react';
import { getJuegos, type JuegoTorneo } from '../services/torneosService';

const Torneos = () => {
    const [juegos, setJuegos] = useState<JuegoTorneo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getJuegos()
            .then(setJuegos)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-surface text-on-surface pt-20 px-6 pb-12">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <p className="font-headline text-[10px] uppercase tracking-[0.3em] text-primary/60 mb-1">
                        Cañón Cosmo Store
                    </p>
                    <h1 className="font-headline font-bold text-2xl md:text-3xl uppercase tracking-widest text-on-surface">
                        Torneos
                    </h1>
                    <div className="h-px bg-primary/30 mt-4" />
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <span className="material-symbols-outlined text-primary text-4xl animate-spin">
                            progress_activity
                        </span>
                    </div>
                ) : juegos.length === 0 ? (
                    <div className="tactical-frame p-10 text-center text-on-surface-variant font-body text-sm">
                        Próximamente torneos disponibles.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {juegos.map((juego) => {
                            const cardClass = `tactical-frame overflow-hidden flex flex-col${juego.url ? ' cursor-pointer hover:border-primary transition-colors' : ''}`;
                            const inner = (
                                <>
                                    {juego.imagen ? (
                                        <div className="h-40 overflow-hidden bg-surface-container">
                                            <img
                                                src={juego.imagen}
                                                alt={juego.nombre}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-40 bg-surface-container flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary/30 text-5xl">
                                                emoji_events
                                            </span>
                                        </div>
                                    )}
                                    <div className="p-4 flex flex-col gap-1 flex-1">
                                        <h2 className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface">
                                            {juego.nombre}
                                        </h2>
                                        {juego.descripcion && (
                                            <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                                                {juego.descripcion}
                                            </p>
                                        )}
                                        {juego.url && (
                                            <span className="mt-auto pt-2 flex items-center gap-1 text-[10px] font-headline uppercase tracking-widest text-primary/60">
                                                <span className="material-symbols-outlined text-xs">open_in_new</span>
                                                Ver más
                                            </span>
                                        )}
                                    </div>
                                </>
                            );
                            return juego.url ? (
                                <a
                                    key={juego.id}
                                    href={juego.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cardClass}>
                                    {inner}
                                </a>
                            ) : (
                                <div key={juego.id} className={cardClass}>
                                    {inner}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Torneos;
