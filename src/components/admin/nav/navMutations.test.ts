import { describe, it, expect } from 'vitest';
import type { NavItem } from '../../../services/navService';
import * as nav from './navMutations';

const items = (): NavItem[] => [
    {
        icon: 'playing_cards',
        label: 'TCGs',
        submenu: [
            { label: 'Pokemon', path: '/tcgs/pokemon' },
            { label: 'Digimon', path: '/tcgs/digimon', color: '#ff0000' },
            {
                label: 'One Piece',
                path: '/tcgs/one-piece',
                image: 'https://x/y.png',
            },
        ],
    },
    { icon: 'diamond', label: 'Accesorios TCGs', path: '/accesorios-tcgs' },
    { icon: 'smart_toy', label: 'Funko Pop' },
];

describe('deriveSubPath', () => {
    it('compone la ruta a partir de los labels', () => {
        expect(nav.deriveSubPath('Accesorios TCGs', 'Fundas')).toBe(
            '/accesorios-tcgs/fundas',
        );
    });
});

describe('primer nivel', () => {
    it('addItem añade al final', () => {
        const out = nav.addItem(items(), { icon: 'star', label: 'Nuevo' });
        expect(out).toHaveLength(4);
        expect(out[3].label).toBe('Nuevo');
    });

    it('removeItem quita solo el índice pedido', () => {
        const out = nav.removeItem(items(), 1);
        expect(out.map((i) => i.label)).toEqual(['TCGs', 'Funko Pop']);
    });

    it('updateItem conserva el path original', () => {
        // Cambiar la ruta desvincularía los productos ya asociados a ella
        const out = nav.updateItem(items(), 1, {
            icon: 'star',
            label: 'Renombrado',
        });
        expect(out[1]).toEqual({
            icon: 'star',
            label: 'Renombrado',
            path: '/accesorios-tcgs',
        });
    });

    it('updateItem conserva el submenú', () => {
        const out = nav.updateItem(items(), 0, { icon: 'x', label: 'Cartas' });
        expect(out[0].submenu).toHaveLength(3);
    });

    it('updateItem no inventa un path si la entrada no lo tenía', () => {
        const out = nav.updateItem(items(), 2, { icon: 'x', label: 'Funkos' });
        expect(out[2]).not.toHaveProperty('path');
    });

    it('moveItem reordena', () => {
        expect(nav.moveItem(items(), 0, 2).map((i) => i.label)).toEqual([
            'Accesorios TCGs',
            'Funko Pop',
            'TCGs',
        ]);
        expect(nav.moveItem(items(), 2, 0).map((i) => i.label)).toEqual([
            'Funko Pop',
            'TCGs',
            'Accesorios TCGs',
        ]);
    });
});

describe('subitems', () => {
    it('addSub añade al submenú indicado', () => {
        const out = nav.addSub(items(), 0, {
            label: 'Riftbound',
            path: '/tcgs/riftbound',
        });
        expect(out[0].submenu).toHaveLength(4);
        expect(out[0].submenu![3].label).toBe('Riftbound');
    });

    it('addSub crea el submenú si la entrada no tenía', () => {
        const out = nav.addSub(items(), 2, {
            label: 'Anime',
            path: '/funko-pop/anime',
        });
        expect(out[2].submenu).toEqual([
            { label: 'Anime', path: '/funko-pop/anime' },
        ]);
    });

    it('removeSub quita solo ese subitem', () => {
        const out = nav.removeSub(items(), 0, 1);
        expect(out[0].submenu!.map((s) => s.label)).toEqual([
            'Pokemon',
            'One Piece',
        ]);
    });

    it('updateSub conserva el path original', () => {
        const out = nav.updateSub(items(), 0, 0, {
            label: 'Pokémon TCG',
            image: '',
            color: '',
        });
        expect(out[0].submenu![0]).toEqual({
            label: 'Pokémon TCG',
            path: '/tcgs/pokemon',
        });
    });

    it('updateSub descarta imagen y color vacíos en vez de guardarlos', () => {
        const out = nav.updateSub(items(), 0, 1, {
            label: 'Digimon',
            image: '',
            color: '',
        });
        expect(out[0].submenu![1]).not.toHaveProperty('color');
        expect(out[0].submenu![1]).not.toHaveProperty('image');
    });

    it('updateSub guarda imagen y color cuando vienen', () => {
        const out = nav.updateSub(items(), 0, 0, {
            label: 'Pokemon',
            image: 'https://x/p.png',
            color: '#00ff00',
        });
        expect(out[0].submenu![0]).toMatchObject({
            image: 'https://x/p.png',
            color: '#00ff00',
        });
    });

    it('setSubColor cambia el color sin tocar el resto', () => {
        const out = nav.setSubColor(items(), 0, 2, '#123456');
        expect(out[0].submenu![2]).toEqual({
            label: 'One Piece',
            path: '/tcgs/one-piece',
            image: 'https://x/y.png',
            color: '#123456',
        });
    });

    it('moveSub reordena dentro del submenú', () => {
        const out = nav.moveSub(items(), 0, 2, 0);
        expect(out[0].submenu!.map((s) => s.label)).toEqual([
            'One Piece',
            'Pokemon',
            'Digimon',
        ]);
    });

    it('moveSub no toca los demás menús', () => {
        const out = nav.moveSub(items(), 0, 0, 1);
        expect(out[1]).toEqual(items()[1]);
        expect(out[2]).toEqual(items()[2]);
    });
});

describe('inmutabilidad', () => {
    // El hook guarda en Firestore y solo entonces actualiza el estado:
    // si estas funciones mutasen, la UI mostraría cambios no persistidos
    it.each([
        [
            'addItem',
            (i: NavItem[]) => nav.addItem(i, { icon: 'x', label: 'y' }),
        ],
        ['removeItem', (i: NavItem[]) => nav.removeItem(i, 0)],
        [
            'updateItem',
            (i: NavItem[]) => nav.updateItem(i, 0, { icon: 'x', label: 'y' }),
        ],
        ['moveItem', (i: NavItem[]) => nav.moveItem(i, 0, 2)],
        [
            'addSub',
            (i: NavItem[]) => nav.addSub(i, 0, { label: 'x', path: '/x' }),
        ],
        ['removeSub', (i: NavItem[]) => nav.removeSub(i, 0, 0)],
        [
            'updateSub',
            (i: NavItem[]) =>
                nav.updateSub(i, 0, 0, { label: 'x', image: '', color: '' }),
        ],
        ['setSubColor', (i: NavItem[]) => nav.setSubColor(i, 0, 0, '#fff')],
        ['moveSub', (i: NavItem[]) => nav.moveSub(i, 0, 0, 2)],
    ])('%s no muta la entrada', (_name, fn) => {
        const original = items();
        fn(original);
        expect(original).toEqual(items());
    });
});
