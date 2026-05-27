/**
 * Script de seed: sube todos los productos hardcodeados a Firestore.
 * Ejecutar con:  npm run seed
 *
 * Nota: las imágenes en base64 se omiten a propósito.
 * Las URLs de imagen externas se conservan.
 */

import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// ─── Config ────────────────────────────────────────────────────────────────

// dotenv carga .env.local automáticamente si se le indica el path
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ─── Tipos ─────────────────────────────────────────────────────────────────

type TcgId = 'pokemon' | 'digimon' | 'onepiece' | 'naruto' | 'finalfantasy' | 'riftbound';

type ProductSeed = {
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

// ─── Datos ─────────────────────────────────────────────────────────────────

const PRODUCTS: ProductSeed[] = [
    // ── Pokémon ────────────────────────────────────────────────────────────
    {
        tcg: 'pokemon',
        name: 'Surging Sparks Booster Pack',
        set: 'Scarlet & Violet',
        price: '4,99 €',
        category: 'Booster Packs',
        badge: 'NUEVO',
        badgeColor: 'bg-[#343dff] border-[#bec2ff]',
        stock: 4,
        maxStock: 5,
        // imagen base64 omitida — reemplazar por URL en Firebase Storage
    },
    {
        tcg: 'pokemon',
        name: 'Prismatic Evolutions ETB',
        set: 'Scarlet & Violet',
        price: '54,99 €',
        category: 'ETBs',
        badge: 'HOT',
        badgeColor: 'bg-[#93000a] border-[#ffb4ab]',
        stock: 1,
        maxStock: 5,
        image: 'https://cardzone.es/cdn/shop/files/siguemeeninstagram_1920x1920px_-2024-11-01T191009.078.png?v=1730485239&width=4800',
        featured: true,
    },
    {
        tcg: 'pokemon',
        name: 'Twilight Masquerade Booster Pack',
        set: 'Scarlet & Violet',
        price: '4,49 €',
        category: 'Booster Packs',
        stock: 3,
        maxStock: 5,
    },
    {
        tcg: 'pokemon',
        name: 'Stellar Crown Booster Bundle',
        set: 'Scarlet & Violet',
        price: '24,99 €',
        category: 'Bundles',
        stock: 2,
        maxStock: 5,
    },
    {
        tcg: 'pokemon',
        name: 'Surging Sparks ETB',
        set: 'Scarlet & Violet',
        price: '49,99 €',
        category: 'ETBs',
        stock: 3,
        maxStock: 5,
    },

    // ── Digimon ────────────────────────────────────────────────────────────
    {
        tcg: 'digimon',
        name: 'Exceed Apocalypse Booster Box',
        set: 'BT-15',
        price: '79,99 €',
        category: 'Bundles',
        badge: 'HOT',
        badgeColor: 'bg-[#93000a] border-[#ffb4ab]',
        stock: 3,
        maxStock: 5,
        image: 'https://en.digimoncard.com/images/products/pack/ver15/bnr.jpg',
        featured: true,
    },
    {
        tcg: 'digimon',
        name: 'Exceed Apocalypse Booster Pack',
        set: 'BT-15',
        price: '3,99 €',
        category: 'Booster Packs',
        badge: 'NUEVO',
        badgeColor: 'bg-[#343dff] border-[#bec2ff]',
        stock: 5,
        maxStock: 5,
        image: 'https://en.digimoncard.com/images/products/pack/ver15/img_pkg.png',
    },
    {
        tcg: 'digimon',
        name: 'Starter Deck — Agumon & Gabumon',
        set: 'ST-1',
        price: '10,99 €',
        category: 'Starter Decks',
        stock: 4,
        maxStock: 5,
    },
    {
        tcg: 'digimon',
        name: 'Starter Deck — UlforceVeedramon',
        set: 'ST-19',
        price: '12,99 €',
        category: 'Starter Decks',
        stock: 2,
        maxStock: 5,
    },
    {
        tcg: 'digimon',
        name: 'Double Diamond Booster Pack',
        set: 'BT-06',
        price: '3,49 €',
        category: 'Booster Packs',
        stock: 4,
        maxStock: 5,
    },
    {
        tcg: 'digimon',
        name: 'Omnimon — Secret Rare Alt Art',
        set: 'BT-15',
        price: '69,99 €',
        category: 'Singles',
        badge: 'SEC',
        badgeColor: 'bg-[#454747] border-[#c6c6c6]',
        stock: 1,
        maxStock: 2,
    },
    {
        tcg: 'digimon',
        name: 'WarGreymon — Full Art Parallel',
        set: 'BT-06',
        price: '19,99 €',
        category: 'Singles',
        badge: 'PAR',
        badgeColor: 'bg-[#454747] border-[#c6c6c6]',
        stock: 2,
        maxStock: 3,
    },

    // ── One Piece ──────────────────────────────────────────────────────────
    {
        tcg: 'onepiece',
        name: 'Two Legends Booster Box',
        set: 'OP-08',
        price: '84,99 €',
        category: 'Bundles',
        badge: 'HOT',
        badgeColor: 'bg-[#93000a] border-[#ffb4ab]',
        stock: 3,
        maxStock: 5,
        image: 'https://en.onepiece-cardgame.com/images/products/boosters/op08/mv_01.jpg',
        featured: true,
    },
    {
        tcg: 'onepiece',
        name: 'Two Legends Booster Pack',
        set: 'OP-08',
        price: '4,49 €',
        category: 'Booster Packs',
        badge: 'NUEVO',
        badgeColor: 'bg-[#343dff] border-[#bec2ff]',
        stock: 5,
        maxStock: 5,
    },
    {
        tcg: 'onepiece',
        name: 'Starter Deck — Straw Hat Crew',
        set: 'ST-01',
        price: '11,99 €',
        category: 'Starter Decks',
        stock: 4,
        maxStock: 5,
        image: 'https://en.onepiece-cardgame.com/images/products/decks/st01-04/mv_01.jpg',
    },
    {
        tcg: 'onepiece',
        name: 'Starter Deck — Seven Warlords',
        set: 'ST-03',
        price: '11,99 €',
        category: 'Starter Decks',
        stock: 3,
        maxStock: 5,
        image: 'https://en.onepiece-cardgame.com/images/products/decks/st01-04/mv_01.jpg',
    },
    {
        tcg: 'onepiece',
        name: 'Wings of the Captain Booster Pack',
        set: 'OP-06',
        price: '3,99 €',
        category: 'Booster Packs',
        stock: 4,
        maxStock: 5,
        image: 'https://en.onepiece-cardgame.com/images/products/boosters/op06/mv_01.jpg',
    },
    {
        tcg: 'onepiece',
        name: 'Monkey D. Luffy — Secret Rare',
        set: 'OP-08',
        price: '79,99 €',
        category: 'Singles',
        badge: 'SEC',
        badgeColor: 'bg-[#454747] border-[#c6c6c6]',
        stock: 1,
        maxStock: 2,
    },
    {
        tcg: 'onepiece',
        name: 'Shanks — Leader Alt Art',
        set: 'OP-08',
        price: '34,99 €',
        category: 'Singles',
        badge: 'ALT',
        badgeColor: 'bg-[#454747] border-[#c6c6c6]',
        stock: 2,
        maxStock: 3,
    },

    // ── Naruto ─────────────────────────────────────────────────────────────
    {
        tcg: 'naruto',
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
        tcg: 'naruto',
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
        tcg: 'naruto',
        name: 'Starter Deck — Naruto Uzumaki',
        set: 'Serie 1',
        price: '11,99 €',
        category: 'Starter Decks',
        stock: 3,
        maxStock: 5,
    },
    {
        tcg: 'naruto',
        name: 'Starter Deck — Sasuke Uchiha',
        set: 'Serie 1',
        price: '11,99 €',
        category: 'Starter Decks',
        stock: 4,
        maxStock: 5,
    },
    {
        tcg: 'naruto',
        name: 'Rise of the Hokage Booster Pack',
        set: 'Serie 1',
        price: '3,49 €',
        category: 'Booster Packs',
        stock: 3,
        maxStock: 5,
    },
    {
        tcg: 'naruto',
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
        tcg: 'naruto',
        name: 'Itachi Uchiha — Full Art',
        set: 'Serie 1',
        price: '22,99 €',
        category: 'Singles',
        badge: 'FA',
        badgeColor: 'bg-[#454747] border-[#c6c6c6]',
        stock: 2,
        maxStock: 3,
    },

    // ── Final Fantasy ──────────────────────────────────────────────────────
    {
        tcg: 'finalfantasy',
        name: 'Resurgence of Power Booster Box',
        set: 'Opus XVIII',
        price: '94,99 €',
        category: 'Bundles',
        badge: 'HOT',
        badgeColor: 'bg-[#93000a] border-[#ffb4ab]',
        stock: 2,
        maxStock: 5,
        featured: true,
    },
    {
        tcg: 'finalfantasy',
        name: 'Resurgence of Power Booster Pack',
        set: 'Opus XVIII',
        price: '4,49 €',
        category: 'Booster Packs',
        badge: 'NUEVO',
        badgeColor: 'bg-[#343dff] border-[#bec2ff]',
        stock: 5,
        maxStock: 5,
    },
    {
        tcg: 'finalfantasy',
        name: 'Starter Deck — Cloud & Tifa',
        set: 'Opus XVIII',
        price: '12,99 €',
        category: 'Starter Decks',
        stock: 4,
        maxStock: 5,
    },
    {
        tcg: 'finalfantasy',
        name: 'Starter Deck — Terra & Kefka',
        set: 'Opus XVIII',
        price: '12,99 €',
        category: 'Starter Decks',
        stock: 3,
        maxStock: 5,
    },
    {
        tcg: 'finalfantasy',
        name: 'Crystal Dominion Booster Pack',
        set: 'Opus XXII',
        price: '3,99 €',
        category: 'Booster Packs',
        stock: 3,
        maxStock: 5,
    },
    {
        tcg: 'finalfantasy',
        name: 'Sephiroth — Legend Full Art',
        set: 'Opus XVIII',
        price: '59,99 €',
        category: 'Singles',
        badge: 'LEG',
        badgeColor: 'bg-[#454747] border-[#c6c6c6]',
        stock: 1,
        maxStock: 2,
    },
    {
        tcg: 'finalfantasy',
        name: 'Lightning — Secret Rare',
        set: 'Opus XXII',
        price: '24,99 €',
        category: 'Singles',
        badge: 'SR',
        badgeColor: 'bg-[#454747] border-[#c6c6c6]',
        stock: 2,
        maxStock: 3,
    },

    // ── Riftbound ──────────────────────────────────────────────────────────
    {
        tcg: 'riftbound',
        name: 'Origins Booster Display',
        set: 'Origins',
        price: '89,99 €',
        category: 'Bundles',
        badge: 'HOT',
        badgeColor: 'bg-[#93000a] border-[#ffb4ab]',
        stock: 2,
        maxStock: 5,
        image: 'https://cdn.sanity.io/images/dsfx7636/consumer_products_live/e026ee1a44bc86095f9afc5949c5fdb519b29c66-2560x2560.png?accountingTag=consumer_products',
        featured: true,
    },
    {
        tcg: 'riftbound',
        name: 'Origins Booster Pack',
        set: 'Origins',
        price: '4,99 €',
        category: 'Booster Packs',
        badge: 'NUEVO',
        badgeColor: 'bg-[#343dff] border-[#bec2ff]',
        stock: 5,
        maxStock: 5,
    },
    {
        tcg: 'riftbound',
        name: 'Starter Deck — Vanguard',
        set: 'Origins',
        price: '14,99 €',
        category: 'Starter Decks',
        stock: 3,
        maxStock: 5,
    },
    {
        tcg: 'riftbound',
        name: 'Starter Deck — Shadow',
        set: 'Origins',
        price: '14,99 €',
        category: 'Starter Decks',
        stock: 4,
        maxStock: 5,
    },
    {
        tcg: 'riftbound',
        name: 'Unleashed Booster Display',
        set: 'Unleashed',
        price: '94,99 €',
        category: 'Bundles',
        stock: 2,
        maxStock: 5,
        image: 'https://cdn.sanity.io/images/dsfx7636/consumer_products_live/46c776a96cc14227a260d24489f10b4090cd2cd9-2560x2560.png?accountingTag=consumer_products',
    },
    {
        tcg: 'riftbound',
        name: 'Aetherion — Full Art Legendary',
        set: 'Origins',
        price: '44,99 €',
        category: 'Singles',
        badge: 'LEG',
        badgeColor: 'bg-[#454747] border-[#c6c6c6]',
        stock: 1,
        maxStock: 3,
    },
    {
        tcg: 'riftbound',
        name: 'Void Harbinger — Secret Rare',
        set: 'Origins',
        price: '29,99 €',
        category: 'Singles',
        badge: 'SR',
        badgeColor: 'bg-[#454747] border-[#c6c6c6]',
        stock: 2,
        maxStock: 3,
    },
];

// ─── Upload ────────────────────────────────────────────────────────────────

async function seed() {
    console.log(`\n🌱 Subiendo ${PRODUCTS.length} productos a Firestore...\n`);

    let ok = 0;
    let fail = 0;

    for (const product of PRODUCTS) {
        // Eliminar campos undefined para que Firestore no los rechace
        const clean = Object.fromEntries(
            Object.entries(product).filter(([, v]) => v !== undefined)
        );

        try {
            const ref = await addDoc(collection(db, 'products'), clean);
            console.log(`  ✅ [${product.tcg}] ${product.name}  →  ${ref.id}`);
            ok++;
        } catch (err) {
            console.error(`  ❌ [${product.tcg}] ${product.name}`, err);
            fail++;
        }
    }

    console.log(`\n─────────────────────────────────────`);
    console.log(`✅ ${ok} productos subidos`);
    if (fail > 0) console.log(`❌ ${fail} errores`);
    console.log(`─────────────────────────────────────\n`);

    process.exit(0);
}

seed();
