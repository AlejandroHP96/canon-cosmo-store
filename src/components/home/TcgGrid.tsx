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
                        <div className="flex-1">
                            <h3 className="font-headline font-bold text-base text-on-surface uppercase tracking-wider leading-tight">
                                {tcg.name}
                            </h3>
                        </div>
                        <div className="text-[10px] font-headline text-on-surface-variant uppercase tracking-widest group-hover:text-primary transition-colors">
                            <span>Ver catálogo</span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    </>
);

export default TcgGrid;
