import { Link } from 'react-router-dom';
import { TCG_CARDS } from '../../data/tcgCards';

const TcgGrid = () => (
    <>
        <div className="flex items-center gap-4 mb-5">
            <h2 className="font-headline text-primary text-xs tracking-[0.3em] uppercase">
                Juegos disponibles
            </h2>
            <div className="flex-1 h-px bg-outline-variant/30" />
            <span className="text-[9px] font-headline text-on-surface-variant tracking-widest">
                {TCG_CARDS.length} secciones
            </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {TCG_CARDS.map((tcg) => (
                <Link
                    key={tcg.path}
                    to={tcg.path}
                    className="tactical-frame flex overflow-hidden group hover:bg-surface-bright transition-colors">
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
                                <span className={`px-2 py-0.5 text-[9px] font-headline border ${tcg.tagColor} text-[#e0e0ff]`}>
                                    {tcg.tag}
                                </span>
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-headline font-bold text-base text-on-surface uppercase tracking-wider leading-tight">
                                {tcg.name}
                            </h3>
                            <p
                                className="text-[9px] font-headline tracking-[0.12em] uppercase mt-1"
                                style={{ color: `${tcg.color}99` }}>
                                {tcg.subtitle}
                            </p>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-headline text-on-surface-variant uppercase tracking-widest group-hover:text-primary transition-colors">
                            <span>Ver catálogo</span>
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    </>
);

export default TcgGrid;
