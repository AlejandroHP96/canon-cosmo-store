import { describe, it, expect } from 'vitest';
import { slugToTcgId, toSlug, pathToSectionId } from './tcgUtils';

describe('slugToTcgId', () => {
    it('traduce los slugs legacy a su ID de Firestore', () => {
        expect(slugToTcgId('final-fantasy')).toBe('finalfantasy');
        expect(slugToTcgId('one-piece')).toBe('onepiece');
    });

    it('deja intactos los TCGs nuevos, donde el slug ES el ID', () => {
        expect(slugToTcgId('dragon-ball')).toBe('dragon-ball');
        expect(slugToTcgId('pokemon')).toBe('pokemon');
    });
});

describe('toSlug', () => {
    it('pasa a minúsculas y une con guiones', () => {
        expect(toSlug('Funko Pop')).toBe('funko-pop');
        expect(toSlug('Accesorios TCGs')).toBe('accesorios-tcgs');
    });

    it('quita los acentos', () => {
        expect(toSlug('Cañón Cosmo')).toBe('canon-cosmo');
        expect(toSlug('Edición Española')).toBe('edicion-espanola');
    });

    it('descarta la puntuación', () => {
        expect(toSlug('One Piece!')).toBe('one-piece');
        expect(toSlug('Magic: The Gathering')).toBe('magic-the-gathering');
    });

    it('colapsa los espacios de sobra', () => {
        expect(toSlug('  Dragon   Ball  ')).toBe('dragon-ball');
    });

    it('conserva los guiones que ya venían', () => {
        expect(toSlug('dragon-ball')).toBe('dragon-ball');
    });
});

describe('pathToSectionId', () => {
    it('aplica el mapeo legacy bajo /tcgs', () => {
        expect(pathToSectionId('/tcgs/final-fantasy')).toBe('finalfantasy');
        expect(pathToSectionId('/tcgs/one-piece')).toBe('onepiece');
    });

    it('usa el slug tal cual para los TCGs nuevos', () => {
        expect(pathToSectionId('/tcgs/dragon-ball')).toBe('dragon-ball');
        expect(pathToSectionId('/tcgs/pokemon')).toBe('pokemon');
    });

    it('resuelve las secciones de primer nivel', () => {
        expect(pathToSectionId('/funko-pop')).toBe('funko-pop');
        expect(pathToSectionId('/accesorios-tcgs')).toBe('accesorios-tcgs');
    });

    it('sustituye las barras internas por __, que Firestore sí admite en un ID', () => {
        expect(pathToSectionId('/accesorios-tcgs/fundas')).toBe(
            'accesorios-tcgs__fundas',
        );
    });

    it('no aplica el mapeo legacy fuera de /tcgs', () => {
        // 'one-piece' solo se traduce como slug de TCG, no como sección suelta
        expect(pathToSectionId('/one-piece')).toBe('one-piece');
    });

    it('acepta rutas sin barra inicial', () => {
        expect(pathToSectionId('funko-pop')).toBe('funko-pop');
    });
});
