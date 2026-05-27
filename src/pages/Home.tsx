import { Link } from 'react-router-dom';

const TCG_CARDS = [
    {
        name: 'Pokémon TCG',
        subtitle: 'Scarlet & Violet — Prismatic Evolutions',
        path: '/tcgs/pokemon',
        icon: 'sports_esports',
        accent: 'from-[#FFCB05]/20 to-transparent',
        borderHover: 'hover:border-[#FFCB05]/80',
        tag: 'HOT',
        tagColor: 'bg-[#93000a] border-[#ffb4ab]',
    },
    {
        name: 'One Piece TCG',
        subtitle: 'OP-08 — Two Legends',
        path: '/tcgs/one-piece',
        icon: 'sailing',
        accent: 'from-[#e63946]/20 to-transparent',
        borderHover: 'hover:border-[#e63946]/80',
        tag: 'NUEVO',
        tagColor: 'bg-[#343dff] border-[#bec2ff]',
    },
    {
        name: 'Digimon TCG',
        subtitle: 'BT-15 — Exceed Apocalypse',
        path: '/tcgs/digimon',
        icon: 'memory',
        accent: 'from-[#4cc9f0]/20 to-transparent',
        borderHover: 'hover:border-[#4cc9f0]/80',
        tag: 'NUEVO',
        tagColor: 'bg-[#343dff] border-[#bec2ff]',
    },
    {
        name: 'Final Fantasy TCG',
        subtitle: 'Opus XVIII — Resurgence of Power',
        path: '/tcgs/final-fantasy',
        icon: 'auto_awesome',
        accent: 'from-[#c77dff]/20 to-transparent',
        borderHover: 'hover:border-[#c77dff]/80',
        tag: null,
        tagColor: '',
    },
    {
        name: 'Naruto TCG',
        subtitle: 'Serie 2 — Naruto Shippuden',
        path: '/tcgs/naruto',
        icon: 'bolt',
        accent: 'from-[#f4a261]/20 to-transparent',
        borderHover: 'hover:border-[#f4a261]/80',
        tag: null,
        tagColor: '',
    },
    {
        name: 'Riftbound TCG',
        subtitle: 'League of Legends — Origins',
        path: '/tcgs/riftbound',
        icon: 'hexagon',
        accent: 'from-[#c9b458]/20 to-transparent',
        borderHover: 'hover:border-[#c9b458]/80',
        tag: 'NUEVO',
        tagColor: 'bg-[#343dff] border-[#bec2ff]',
    },
];

const Home = () => {
    return (
        <div className="max-w-5xl mx-auto">
            {/* Hero */}
            <div className="tactical-frame p-8 mb-10 flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-2">
                    <span className="w-1.5 h-1.5 bg-primary animate-ping" />
                    <p className="text-[10px] font-headline text-primary tracking-[0.3em] uppercase">
                        Tienda especializada · Midgar District VII
                    </p>
                </div>
                <h1 className="font-headline font-bold text-3xl md:text-5xl text-on-surface uppercase tracking-widest leading-tight">
                    Bienvenido a<br />
                    <span className="text-primary">Cañón Cosmo</span>
                </h1>
                <p className="text-sm text-on-surface-variant font-body max-w-xl leading-relaxed">
                    Tu tienda de referencia para juegos de cartas
                    coleccionables. Encuentra sobres, mazos iniciales, bundles y
                    singles de los mejores TCGs del mercado. Catálogo
                    actualizado con las últimas expansiones.
                </p>
                <div className="flex gap-6 mt-2 pt-4 border-t border-outline-variant/30">
                    <div>
                        <p className="text-2xl font-headline font-bold text-on-surface">
                            {TCG_CARDS.length}
                        </p>
                        <p className="text-[9px] font-headline text-primary/60 tracking-widest uppercase">
                            Juegos
                        </p>
                    </div>
                    <div className="w-px bg-outline-variant/30" />
                    <div>
                        <p className="text-2xl font-headline font-bold text-on-surface">
                            42
                        </p>
                        <p className="text-[9px] font-headline text-primary/60 tracking-widest uppercase">
                            Productos
                        </p>
                    </div>
                    <div className="w-px bg-outline-variant/30" />
                    <div>
                        <p className="text-2xl font-headline font-bold text-on-surface">
                            3
                        </p>
                        <p className="text-[9px] font-headline text-primary/60 tracking-widest uppercase">
                            Novedades
                        </p>
                    </div>
                </div>
            </div>

            {/* Section title */}
            <h2 className="font-headline text-primary text-xs tracking-[0.3em] mb-4 uppercase">
                Catálogo de juegos
            </h2>

            {/* TCG grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {TCG_CARDS.map((tcg) => (
                    <Link
                        key={tcg.path}
                        to={tcg.path}
                        className={`tactical-frame p-6 flex flex-col gap-4 cursor-pointer transition-all duration-200 ${tcg.borderHover} hover:bg-surface-bright group`}>
                        <div
                            className={`w-full h-1 bg-linear-to-r ${tcg.accent}`}
                        />
                        <div className="flex items-start justify-between">
                            <span className="material-symbols-outlined text-3xl text-primary group-hover:scale-110 transition-transform">
                                {tcg.icon}
                            </span>
                            {tcg.tag && (
                                <span
                                    className={`px-2 py-0.5 text-[9px] font-headline border ${tcg.tagColor} text-[#e0e0ff]`}>
                                    {tcg.tag}
                                </span>
                            )}
                        </div>
                        <div>
                            <h3 className="font-headline font-bold text-lg text-on-surface uppercase tracking-wider leading-tight">
                                {tcg.name}
                            </h3>
                            <p className="text-[10px] font-headline text-primary/70 tracking-[0.15em] uppercase mt-1">
                                {tcg.subtitle}
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5 mt-auto text-[10px] font-headline text-on-surface-variant uppercase tracking-widest group-hover:text-primary transition-colors">
                            <span>Ver catálogo</span>
                            <span className="material-symbols-outlined text-sm">
                                arrow_forward
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Home;
