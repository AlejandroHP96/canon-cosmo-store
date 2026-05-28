import { Link } from 'react-router-dom';

const TournamentBanner = () => (
    <Link
        to="/torneos"
        className="tactical-frame flex items-center gap-6 px-8 py-6 hover:bg-surface-bright transition-colors group overflow-hidden relative">
        <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent pointer-events-none" />
        <span className="material-symbols-outlined text-4xl text-primary shrink-0 group-hover:scale-110 transition-transform">
            emoji_events
        </span>
        <div className="flex-1 min-w-0">
            <p className="text-[9px] font-headline text-primary/60 tracking-[0.3em] uppercase mb-1">
                Próximamente
            </p>
            <h3 className="font-headline font-bold text-lg uppercase tracking-widest text-on-surface">
                Torneos & Eventos
            </h3>
            <p className="text-xs font-body text-on-surface-variant mt-0.5">
                Consulta el calendario de torneos y apúntate a los próximos eventos.
            </p>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors shrink-0">
            arrow_forward
        </span>
    </Link>
);

export default TournamentBanner;
