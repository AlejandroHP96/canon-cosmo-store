/**
 * Identificador de un TCG en Firestore.
 * Los TCGs legacy usan IDs sin guiones ('finalfantasy', 'onepiece').
 * Los TCGs nuevos usan el slug de la URL ('dragon-ball', 'union-arena').
 * Ver src/lib/tcgUtils.ts para el mapeo slug ↔ ID.
 */
export type TcgId = string;

export type Product = {
    id: string; // Firestore document ID
    tcg: TcgId;
    name: string;
    set: string;
    /** Euros. Opcional: los productos reservables pueden no tener precio aún. */
    price?: number;
    category: string;
    description?: string;
    badge?: string;
    badgeColor?: string;
    badgeText?: string; // Texto personalizado a mostrar cuando badge === 'PRÓXIMAMENTE'
    salePrice?: number;
    inStock?: boolean;
    image?: string;
    featured?: boolean;
    visible?: boolean;
    reservable?: boolean;
};

export type Category = {
    label: string;
    icon: string;
};
