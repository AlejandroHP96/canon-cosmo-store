export interface NavItem {
    label: string;
    path: string;
}

export type TcgId =
    | 'pokemon'
    | 'digimon'
    | 'onepiece'
    | 'naruto'
    | 'finalfantasy'
    | 'riftbound';

export type Product = {
    id: string; // Firestore document ID
    tcg: TcgId;
    name: string;
    set: string;
    price: string;
    category: string;
    badge?: string;
    badgeColor?: string;
    stock: number;
    maxStock: number;
    image?: string;
    featured?: boolean;
};

export type Category = {
    label: string;
    icon: string;
};
