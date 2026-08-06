import { describe, it, expect } from 'vitest';
import {
    buildAddPayload,
    buildUpdatePayload,
    EMPTY_PRODUCT_FORM,
    type ProductForm,
} from './productPayload';

const form = (patch: Partial<ProductForm> = {}): ProductForm => ({
    ...EMPTY_PRODUCT_FORM,
    name: 'Sobre Pokemon',
    price: 4.99,
    ...patch,
});

/** deleteField() devuelve un sentinel de Firestore, no un valor plano */
const isDeleteField = (v: unknown) =>
    typeof v === 'object' && v !== null && v.constructor.name.includes('Delete');

describe('buildAddPayload', () => {
    it('mete la sección que viene del selector', () => {
        expect(buildAddPayload(form(), 'pokemon').tcg).toBe('pokemon');
    });

    it('descarta los campos vacíos para no ensuciar el documento', () => {
        const out = buildAddPayload(form({ set: '', description: '', badge: '' }), 'pokemon');
        expect(out).not.toHaveProperty('set');
        expect(out).not.toHaveProperty('description');
        expect(out).not.toHaveProperty('badge');
    });

    it('conserva los booleanos en false, que sí son un valor', () => {
        const out = buildAddPayload(form({ inStock: false, visible: false }), 'pokemon');
        expect(out.inStock).toBe(false);
        expect(out.visible).toBe(false);
    });

    it('omite el precio cuando no se ha puesto', () => {
        // Los productos reservables pueden no tener precio todavía
        const out = buildAddPayload(form({ price: undefined, reservable: true }), 'pokemon');
        expect(out).not.toHaveProperty('price');
    });

    it('conserva un precio de 0', () => {
        expect(buildAddPayload(form({ price: 0 }), 'pokemon').price).toBe(0);
    });
});

describe('buildUpdatePayload', () => {
    it('borra los campos opcionales que quedan vacíos', () => {
        // Sin deleteField() se quedarían con el valor anterior
        const out = buildUpdatePayload(form({ set: '', description: '', image: '' }), 'pokemon');
        expect(isDeleteField(out.set)).toBe(true);
        expect(isDeleteField(out.description)).toBe(true);
        expect(isDeleteField(out.image)).toBe(true);
    });

    it('borra el precio si se deja en blanco al editar', () => {
        const out = buildUpdatePayload(form({ price: undefined }), 'pokemon');
        expect(isDeleteField(out.price)).toBe(true);
    });

    it('guarda un precio de 0 en vez de borrarlo', () => {
        expect(buildUpdatePayload(form({ price: 0 }), 'pokemon').price).toBe(0);
    });

    describe('salePrice', () => {
        it('se guarda si el badge es OFERTA', () => {
            const out = buildUpdatePayload(form({ badge: 'OFERTA', salePrice: 3.99 }), 'pokemon');
            expect(out.salePrice).toBe(3.99);
        });

        it('se borra si el badge deja de ser OFERTA', () => {
            // Si no, quedaría un precio rebajado fantasma en el documento
            const out = buildUpdatePayload(form({ badge: 'NOVEDAD', salePrice: 3.99 }), 'pokemon');
            expect(isDeleteField(out.salePrice)).toBe(true);
        });

        it('se borra si es OFERTA pero no se ha puesto importe', () => {
            const out = buildUpdatePayload(form({ badge: 'OFERTA', salePrice: undefined }), 'pokemon');
            expect(isDeleteField(out.salePrice)).toBe(true);
        });
    });

    describe('badgeText', () => {
        it('se guarda si el badge es PRÓXIMAMENTE', () => {
            const out = buildUpdatePayload(
                form({ badge: 'PRÓXIMAMENTE', badgeText: 'Disponible en julio' }),
                'pokemon',
            );
            expect(out.badgeText).toBe('Disponible en julio');
        });

        it('se borra con cualquier otro badge', () => {
            const out = buildUpdatePayload(
                form({ badge: 'NOVEDAD', badgeText: 'Disponible en julio' }),
                'pokemon',
            );
            expect(isDeleteField(out.badgeText)).toBe(true);
        });
    });

    it('actualiza la sección con la del selector', () => {
        expect(buildUpdatePayload(form(), 'digimon').tcg).toBe('digimon');
    });
});
