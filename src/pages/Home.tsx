import { Link } from 'react-router-dom';

const TCG_CARDS = [
    {
        name: 'Pokémon TCG',
        subtitle: 'Scarlet & Violet — Prismatic Evolutions',
        path: '/tcgs/pokemon',
        icon: 'sports_esports',
        color: '#FFCB05',
        tag: 'HOT',
        tagColor: 'bg-[#93000a] border-[#ffb4ab]',
    },
    {
        name: 'One Piece TCG',
        subtitle: 'OP-08 — Two Legends',
        path: '/tcgs/one-piece',
        icon: 'sailing',
        color: '#e63946',
        tag: 'NUEVO',
        tagColor: 'bg-[#343dff] border-[#bec2ff]',
    },
    {
        name: 'Digimon TCG',
        subtitle: 'BT-15 — Exceed Apocalypse',
        path: '/tcgs/digimon',
        icon: 'memory',
        color: '#4cc9f0',
        tag: 'NUEVO',
        tagColor: 'bg-[#343dff] border-[#bec2ff]',
    },
    {
        name: 'Final Fantasy TCG',
        subtitle: 'Opus XVIII — Resurgence of Power',
        path: '/tcgs/final-fantasy',
        icon: 'auto_awesome',
        color: '#c77dff',
        tag: null,
        tagColor: '',
    },
    {
        name: 'Naruto TCG',
        subtitle: 'Serie 2 — Naruto Shippuden',
        path: '/tcgs/naruto',
        icon: 'bolt',
        color: '#f4a261',
        tag: null,
        tagColor: '',
    },
    {
        name: 'Riftbound TCG',
        subtitle: 'League of Legends — Origins',
        path: '/tcgs/riftbound',
        icon: 'hexagon',
        color: '#c9b458',
        tag: 'NUEVO',
        tagColor: 'bg-[#343dff] border-[#bec2ff]',
    },
];

const STATS = [
    { value: TCG_CARDS.length.toString(), label: 'Juegos' },
    { value: '3', label: 'Novedades' },
    { value: '24h', label: 'Envío' },
    { value: '100%', label: 'Oficial' },
];

const Home = () => {
    return (
        <div className="max-w-5xl mx-auto">

            {/* ── Hero ──────────────────────────────────────────────────────── */}
            <div className="tactical-frame mb-10 overflow-hidden">
                {/* Top status bar */}
                <div className="flex items-center gap-3 px-6 py-2 border-b border-outline-variant/30 bg-surface-container">
                    <span className="w-1.5 h-1.5 bg-primary animate-ping shrink-0" />
                    <p className="text-[9px] font-headline text-primary tracking-[0.35em] uppercase flex-1">
                        Sistema activo · Cañón Cosmo Store · Midgar District VII
                    </p>
                    <span className="text-[9px] font-headline text-on-surface-variant tracking-widest hidden sm:block">
                        VER.2.4.1
                    </span>
                </div>

                <div className="grid md:grid-cols-2 gap-0">
                    {/* Left: main content */}
                    <div className="p-8 flex flex-col justify-between gap-6">
                        <div className="flex flex-col gap-4">
                            <h1 className="font-headline font-bold uppercase leading-none tracking-widest">
                                <span className="block text-4xl md:text-5xl text-primary">
                                    Cañón
                                </span>
                                <span className="block text-4xl md:text-5xl text-on-surface">
                                    Cosmo
                                </span>
                                <span className="block text-lg md:text-xl text-on-surface-variant mt-1">
                                    Store
                                </span>
                            </h1>
                            <p className="text-sm text-on-surface-variant font-body leading-relaxed max-w-sm">
                                Tienda especializada en juegos de cartas
                                coleccionables. Sobres, mazos, bundles y singles
                                de los mejores TCGs del mercado.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                to="/tcgs/pokemon"
                                className="flex items-center gap-2 border border-primary bg-primary/10 text-primary font-headline text-xs uppercase tracking-widest px-5 py-2.5 hover:bg-primary hover:text-surface transition-all">
                                <span className="material-symbols-outlined text-sm">
                                    playing_cards
                                </span>
                                Ver catálogo
                            </Link>
                            <Link
                                to="/torneos"
                                className="flex items-center gap-2 border border-outline-variant text-on-surface-variant font-headline text-xs uppercase tracking-widest px-5 py-2.5 hover:border-primary hover:text-primary transition-all">
                                <span className="material-symbols-outlined text-sm">
                                    emoji_events
                                </span>
                                Torneos
                            </Link>
                        </div>
                    </div>

                    {/* Right: data readout panel */}
                    <div className="border-l border-outline-variant/30 p-6 bg-surface-container/40 flex flex-col gap-3 justify-center">
                        <p className="text-[9px] font-headline text-primary/60 tracking-[0.3em] uppercase mb-1">
                            // Estado del sistema
                        </p>
                        {[
                            { label: 'Inventario', value: 'ACTUALIZADO', ok: true },
                            { label: 'Últimas novedades', value: '3 ITEMS', ok: true },
                            { label: 'Torneos', value: 'DISPONIBLES', ok: true },
                            { label: 'Catálogo', value: 'ACTIVO', ok: true },
                        ].map(({ label, value, ok }) => (
                            <div
                                key={label}
                                className="flex items-center justify-between border border-outline-variant/20 px-3 py-2 bg-surface-container/60">
                                <span className="font-mono text-[10px] text-on-surface-variant">
                                    {label}
                                </span>
                                <span
                                    className={`font-headline text-[10px] tracking-widest ${ok ? 'text-primary' : 'text-error'}`}>
                                    {value}
                                </span>
                            </div>
                        ))}

                        {/* Stats strip */}
                        <div className="grid grid-cols-4 gap-2 mt-2 pt-3 border-t border-outline-variant/20">
                            {STATS.map(({ value, label }) => (
                                <div key={label} className="text-center">
                                    <p className="font-headline font-bold text-lg text-on-surface leading-none">
                                        {value}
                                    </p>
                                    <p className="text-[8px] font-headline text-primary/60 tracking-widest uppercase mt-0.5">
                                        {label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Section header ────────────────────────────────────────────── */}
            <div className="flex items-center gap-4 mb-5">
                <h2 className="font-headline text-primary text-xs tracking-[0.3em] uppercase">
                    Juegos disponibles
                </h2>
                <div className="flex-1 h-px bg-outline-variant/30" />
                <span className="text-[9px] font-headline text-on-surface-variant tracking-widest">
                    {TCG_CARDS.length} secciones
                </span>
            </div>

            {/* ── TCG grid ──────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {TCG_CARDS.map((tcg) => (
                    <Link
                        key={tcg.path}
                        to={tcg.path}
                        className="tactical-frame flex overflow-hidden group hover:bg-surface-bright transition-colors">
                        {/* Left color stripe */}
                        <div
                            className="w-1 shrink-0 transition-all group-hover:w-1.5"
                            style={{ backgroundColor: tcg.color }}
                        />

                        <div className="flex-1 p-5 flex flex-col gap-3">
                            <div className="flex items-start justify-between">
                                <span
                                    className="material-symbols-outlined text-2xl transition-transform group-hover:scale-110"
                                    style={{ color: tcg.color }}>
                                    {tcg.icon}
                                </span>
                                {tcg.tag && (
                                    <span
                                        className={`px-2 py-0.5 text-[9px] font-headline border ${tcg.tagColor} text-[#e0e0ff]`}>
                                        {tcg.tag}
                                    </span>
                                )}
                            </div>

                            <div className="flex-1">
                                <h3 className="font-headline font-bold text-base text-on-surface uppercase tracking-wider leading-tight">
                                    {tcg.name}
                                </h3>
                                <p className="text-[9px] font-headline tracking-[0.12em] uppercase mt-1"
                                    style={{ color: `${tcg.color}99` }}>
                                    {tcg.subtitle}
                                </p>
                            </div>

                            <div className="flex items-center gap-1 text-[10px] font-headline text-on-surface-variant uppercase tracking-widest group-hover:text-primary transition-colors">
                                <span>Ver catálogo</span>
                                <span className="material-symbols-outlined text-sm">
                                    arrow_forward
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* ── Torneos banner ────────────────────────────────────────────── */}
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

        </div>
    );
};

export default Home;
