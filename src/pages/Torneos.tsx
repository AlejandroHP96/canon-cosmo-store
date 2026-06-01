import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getJuegos, type JuegoTorneo } from '../services/torneosService';
import SEO from '../components/SEO';

const Torneos = () => {
    const { t } = useTranslation();
    const [juegos, setJuegos] = useState<JuegoTorneo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getJuegos()
            .then(setJuegos)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-surface text-on-surface pt-20 px-6 pb-12">
            <SEO
                title="Torneos"
                description="Consulta los próximos torneos de TCG en Cañón Cosmo Store. Pokémon, One Piece, Final Fantasy y más."
                path="/torneos"
            />
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <p className="font-headline text-[10px] uppercase tracking-[0.3em] text-primary/60 mb-1">
                        {t('tournaments.subtitle')}
                    </p>
                    <h1 className="font-headline font-bold text-2xl md:text-3xl uppercase tracking-widest text-on-surface">
                        {t('tournaments.title')}
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
                        {t('tournaments.comingSoon')}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {juegos.map((juego) => {
                            const inner = (
                                <div className="relative h-56 overflow-hidden group">
                                    {juego.imagen ? (
                                        <img src={juego.imagen} alt={juego.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full bg-surface-container flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary/20 text-7xl">emoji_events</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#010241] via-[#010241]/60 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-1">
                                        <h2 className="font-headline font-bold text-base uppercase tracking-widest text-on-surface">
                                            {juego.nombre}
                                        </h2>
                                        {juego.descripcion && (
                                            <p className="font-body text-[11px] text-on-surface-variant leading-snug line-clamp-2">
                                                {juego.descripcion}
                                            </p>
                                        )}
                                        {juego.url && (
                                            <span className="mt-1 flex items-center gap-1 text-[10px] font-headline uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                                {t('tournaments.viewMore')}
                                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                            const cls = `tactical-frame overflow-hidden${juego.url ? ' cursor-pointer hover:border-primary transition-colors' : ''}`;
                            return juego.url ? (
                                <a key={juego.id} href={juego.url} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
                            ) : (
                                <div key={juego.id} className={cls}>{inner}</div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Torneos;
