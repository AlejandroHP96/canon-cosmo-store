import { useEffect, useState } from 'react';
import { getTorneos, type DiaSemana, type Torneo } from '../services/torneosService';

const DIAS: { id: DiaSemana; label: string }[] = [
    { id: 'lunes',     label: 'Lunes' },
    { id: 'martes',    label: 'Martes' },
    { id: 'miercoles', label: 'Miércoles' },
    { id: 'jueves',    label: 'Jueves' },
    { id: 'viernes',   label: 'Viernes' },
    { id: 'sabado',    label: 'Sábado' },
    { id: 'domingo',   label: 'Domingo' },
];

const Torneos = () => {
    const [torneos, setTorneos] = useState<Torneo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTorneos()
            .then(setTorneos)
            .finally(() => setLoading(false));
    }, []);

    const porDia = (dia: DiaSemana) => torneos.filter((t) => t.dia === dia);

    return (
        <div className="min-h-screen px-4 py-16 md:px-8">
            <h1 className="text-2xl md:text-3xl font-headline font-bold uppercase tracking-widest text-[#e0e0ff] mb-10 text-center">
                Torneos
            </h1>

            {loading ? (
                <div className="flex justify-center py-20">
                    <span className="material-symbols-outlined text-primary text-4xl animate-spin">
                        progress_activity
                    </span>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 max-w-7xl mx-auto">
                    {DIAS.map(({ id, label }) => {
                        const eventos = porDia(id);
                        return (
                            <div
                                key={id}
                                className="tactical-frame flex flex-col min-h-[160px]">
                                {/* Cabecera del día */}
                                <div className="px-3 py-2 border-b border-outline-variant/40">
                                    <p className="font-headline text-xs uppercase tracking-widest text-primary">
                                        {label}
                                    </p>
                                </div>

                                {/* Torneos del día */}
                                <div className="flex flex-col gap-2 p-2 flex-1">
                                    {eventos.length === 0 ? (
                                        <p className="text-[10px] font-body text-on-surface-variant text-center my-auto opacity-40 italic">
                                            Sin torneos
                                        </p>
                                    ) : (
                                        eventos.map((t) => (
                                            <div
                                                key={t.id}
                                                className="border border-outline-variant/50 bg-surface-container-lowest px-2.5 py-2">
                                                <p className="font-headline text-xs text-[#e0e0ff] uppercase tracking-wide leading-tight">
                                                    {t.nombre}
                                                </p>
                                                <p className="font-body text-[10px] text-primary mt-0.5">
                                                    {t.hora}
                                                </p>
                                                {t.descripcion && (
                                                    <p className="font-body text-[10px] text-on-surface-variant mt-1 leading-relaxed">
                                                        {t.descripcion}
                                                    </p>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Torneos;
