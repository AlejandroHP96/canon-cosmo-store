import { Link } from 'react-router-dom';
import { STATS } from '../../data/tcgCards';

const STATUS_ROWS = [
    { label: 'Inventario',       value: 'ACTUALIZADO', ok: true },
    { label: 'Últimas novedades', value: '3 ITEMS',    ok: true },
    { label: 'Torneos',          value: 'DISPONIBLES', ok: true },
    { label: 'Catálogo',         value: 'ACTIVO',      ok: true },
];

const HeroSection = () => (
    <div className="tactical-frame mb-10 overflow-hidden">
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
            <div className="p-8 flex flex-col justify-between gap-6">
                <div className="flex flex-col gap-4">
                    <h1 className="font-headline font-bold uppercase leading-none tracking-widest">
                        <span className="block text-4xl md:text-5xl text-primary">Cañón</span>
                        <span className="block text-4xl md:text-5xl text-on-surface">Cosmo</span>
                        <span className="block text-lg md:text-xl text-on-surface-variant mt-1">Store</span>
                    </h1>
                    <p className="text-sm text-on-surface-variant font-body leading-relaxed max-w-sm">
                        Tienda especializada en juegos de cartas coleccionables. Sobres, mazos, bundles
                        y singles de los mejores TCGs del mercado.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Link
                        to="/tcgs/pokemon"
                        className="flex items-center gap-2 border border-primary bg-primary/10 text-primary font-headline text-xs uppercase tracking-widest px-5 py-2.5 hover:bg-primary hover:text-surface transition-all">
                        <span className="material-symbols-outlined text-sm">playing_cards</span>
                        Ver catálogo
                    </Link>
                    <Link
                        to="/torneos"
                        className="flex items-center gap-2 border border-outline-variant text-on-surface-variant font-headline text-xs uppercase tracking-widest px-5 py-2.5 hover:border-primary hover:text-primary transition-all">
                        <span className="material-symbols-outlined text-sm">emoji_events</span>
                        Torneos
                    </Link>
                </div>
            </div>

            <div className="border-l border-outline-variant/30 p-6 bg-surface-container/40 flex flex-col gap-3 justify-center">
                <p className="text-[9px] font-headline text-primary/60 tracking-[0.3em] uppercase mb-1">
                    // Estado del sistema
                </p>
                {STATUS_ROWS.map(({ label, value, ok }) => (
                    <div
                        key={label}
                        className="flex items-center justify-between border border-outline-variant/20 px-3 py-2 bg-surface-container/60">
                        <span className="font-mono text-[10px] text-on-surface-variant">{label}</span>
                        <span className={`font-headline text-[10px] tracking-widest ${ok ? 'text-primary' : 'text-error'}`}>
                            {value}
                        </span>
                    </div>
                ))}
                <div className="grid grid-cols-4 gap-2 mt-2 pt-3 border-t border-outline-variant/20">
                    {STATS.map(({ value, label }) => (
                        <div key={label} className="text-center">
                            <p className="font-headline font-bold text-lg text-on-surface leading-none">{value}</p>
                            <p className="text-[8px] font-headline text-primary/60 tracking-widest uppercase mt-0.5">
                                {label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default HeroSection;
