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
    price: string;
    category: string;
    badge?: string;
    badgeColor?: string;
    salePrice?: string;
    inStock?: boolean;
    image?: string;
    featured?: boolean;
    visible?: boolean;
};

export type Category = {
    label: string;
    icon: string;
};
