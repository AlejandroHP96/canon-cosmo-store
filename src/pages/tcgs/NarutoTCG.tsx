type Category = { label: string; icon: string };
type Product = {
    name: string;
    set: string;
    price: string;
    category: string;
    badge?: string;
    badgeColor?: string;
    stock: number;
    maxStock: number;
    featured?: boolean;
};

const CATEGORIES: Category[] = [
    { label: 'Todo', icon: 'grid_view' },
    { label: 'Booster Packs', icon: 'style' },
    { label: 'Starter Decks', icon: 'inventory_2' },
    { label: 'Bundles', icon: 'package_2' },
    { label: 'Singles', icon: 'playing_cards' },
];

const PRODUCTS: Product[] = [
    {
        name: 'Naruto Shippuden Booster Box',
        set: 'Serie 2',
        price: '74,99 €',
        category: 'Bundles',
        badge: 'HOT',
        badgeColor: 'bg-[#93000a] border-[#ffb4ab]',
        stock: 2,
        maxStock: 5,
        featured: true,
    },
    {
        name: 'Naruto Shippuden Booster Pack',
        set: 'Serie 2',
        price: '3,99 €',
        category: 'Booster Packs',
        badge: 'NUEVO',
        badgeColor: 'bg-[#343dff] border-[#bec2ff]',
        stock: 5,
        maxStock: 5,
    },
    {
        name: 'Starter Deck — Naruto Uzumaki',
        set: 'Serie 1',
        price: '11,99 €',
        category: 'Starter Decks',
        stock: 3,
        maxStock: 5,
    },
    {
        name: 'Starter Deck — Sasuke Uchiha',
        set: 'Serie 1',
        price: '11,99 €',
        category: 'Starter Decks',
        stock: 4,
        maxStock: 5,
    },
    {
        name: 'Rise of the Hokage Booster Pack',
        set: 'Serie 1',
        price: '3,49 €',
        category: 'Booster Packs',
        stock: 3,
        maxStock: 5,
    },
    {
        name: 'Minato Namikaze — Secret Rare',
        set: 'Serie 2',
        price: '49,99 €',
        category: 'Singles',
        badge: 'SEC',
        badgeColor: 'bg-[#454747] border-[#c6c6c6]',
        stock: 1,
        maxStock: 2,
    },
    {
        name: 'Itachi Uchiha — Full Art',
        set: 'Serie 1',
        price: '22,99 €',
        category: 'Singles',
        badge: 'FA',
        badgeColor: 'bg-[#454747] border-[#c6c6c6]',
        stock: 2,
        maxStock: 3,
    },
];

const StockBar = ({ stock, maxStock }: { stock: number; maxStock: number }) => (
    <div className="flex items-center gap-1">
        <p className="text-[9px] font-headline uppercase text-primary/60">Stock</p>
        <div className="flex gap-0.5">
            {Array.from({ length: maxStock }).map((_, i) => (
                <div
                    key={i}
                    className={`w-2 h-1 ${i < stock ? 'bg-primary' : 'bg-surface-container-highest'}`}
                />
            ))}
        </div>
    </div>
);

const ImagePlaceholder = ({ featured = false }: { featured?: boolean }) => (
    <div
        className={`w-full bg-surface-container-lowest border border-outline-variant/50 flex flex-col items-center justify-center gap-2 ${featured ? 'h-48' : 'h-36'}`}>
        <span className="material-symbols-outlined text-4xl text-outline">image</span>
        <p className="text-[9px] font-headline text-outline tracking-widest uppercase">
            Imagen pendiente
        </p>
    </div>
);

const NarutoTCG = () => {
    return (
        <>
            <div className="flex items-center gap-4 mb-6">
                <div className="tactical-frame px-4 py-2 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-2xl">
                        playing_cards
                    </span>
                    <div>
                        <h2 className="font-headline font-bold text-xl text-on-surface uppercase tracking-widest">
                            Naruto TCG
                        </h2>
                        <p className="text-[10px] text-primary font-headline tracking-[0.2em]">
                            SERIE 2 — NARUTO SHIPPUDEN
                        </p>
                    </div>
                </div>
                <div className="ml-auto flex items-center gap-2 text-[10px] font-headline text-on-surface-variant uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 bg-primary animate-ping" />
                    {PRODUCTS.length} productos
                </div>
            </div>

            <div className="flex gap-2 mb-6 flex-wrap">
                {CATEGORIES.map(({ label, icon }, i) => (
                    <button
                        key={label}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-headline uppercase tracking-wider border transition-all ${
                            i === 0
                                ? 'border-primary text-primary bg-surface-container'
                                : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                        }`}>
                        <span className="material-symbols-outlined text-sm">{icon}</span>
                        {label}
                    </button>
                ))}
            </div>

            {PRODUCTS.filter((p) => p.featured).map((product) => (
                <div
                    key={product.name}
                    className="tactical-frame p-6 mb-6 flex flex-col md:flex-row gap-6 group cursor-pointer hover:bg-surface-bright transition-colors">
                    <div className="w-full md:w-64 md:shrink-0">
                        <ImagePlaceholder featured />
                    </div>
                    <div className="flex flex-col justify-between flex-1">
                        <div>
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="text-[10px] font-headline text-primary tracking-[0.2em] uppercase mb-1">
                                        {product.set} · {product.category}
                                    </p>
                                    <h3 className="font-headline font-bold text-2xl text-on-surface uppercase">
                                        {product.name}
                                    </h3>
                                </div>
                                {product.badge && (
                                    <span className={`px-2 py-1 text-[10px] font-headline border ${product.badgeColor} text-[#e0e0ff]`}>
                                        {product.badge}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-on-surface-variant font-body mt-2">
                                Caja completa de 24 sobres de la Serie 2. Incluye personajes
                                icónicos de Shippuden con nuevas mecánicas de juego y arte exclusivo.
                            </p>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-outline-variant/30">
                            <div>
                                <p className="text-[10px] text-primary font-headline tracking-widest mb-1">PRECIO</p>
                                <p className="text-3xl font-headline font-bold text-on-surface">{product.price}</p>
                            </div>
                            <StockBar stock={product.stock} maxStock={product.maxStock} />
                        </div>
                    </div>
                </div>
            ))}

            <h3 className="font-headline text-primary text-xs tracking-[0.3em] mb-4 uppercase">
                Catálogo completo
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {PRODUCTS.filter((p) => !p.featured).map((product) => (
                    <div
                        key={product.name}
                        className="tactical-frame p-4 hover:bg-surface-bright transition-colors cursor-pointer flex flex-col gap-3 group">
                        <ImagePlaceholder />
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                                <p className="text-[9px] font-headline text-primary/60 tracking-widest uppercase truncate">
                                    {product.set}
                                </p>
                                <p className="text-sm font-headline font-bold text-on-surface uppercase leading-tight mt-0.5">
                                    {product.name}
                                </p>
                            </div>
                            {product.badge && (
                                <span className={`shrink-0 px-1.5 py-0.5 text-[8px] font-headline border ${product.badgeColor} text-[#e0e0ff]`}>
                                    {product.badge}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-outline-variant/30">
                            <span className="font-headline font-bold text-sm text-primary">
                                {product.price}
                            </span>
                            <StockBar stock={product.stock} maxStock={product.maxStock} />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default NarutoTCG;
