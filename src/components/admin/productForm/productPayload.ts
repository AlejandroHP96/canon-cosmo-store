import { deleteField, type FieldValue } from 'firebase/firestore/lite';
import type { Product } from '../../../types';

/** Datos del formulario: el producto sin su id ni la sección (que se deriva del selector). */
export type ProductForm = Omit<Product, 'id' | 'tcg'>;

export const EMPTY_PRODUCT_FORM: ProductForm = {
    name: '',
    set: '',
    price: undefined,
    category: '',
    description: '',
    badge: '',
    badgeColor: '',
    badgeText: '',
    salePrice: undefined,
    inStock: true,
    image: '',
    featured: false,
    visible: true,
    reservable: false,
};

const defined = (form: ProductForm, tcg: string) =>
    Object.fromEntries(
        Object.entries({ ...form, tcg }).filter(([, v]) => v !== undefined && v !== ''),
    );

/** Payload de creación: se omiten los campos vacíos para no ensuciar el documento. */
export const buildAddPayload = (form: ProductForm, tcg: string) =>
    defined(form, tcg) as Omit<Product, 'id'>;

/**
 * Payload de edición: los campos opcionales que quedan vacíos se borran
 * explícitamente con deleteField(), si no quedarían con el valor anterior.
 */
export const buildUpdatePayload = (
    form: ProductForm,
    tcg: string,
): Record<string, string | number | boolean | FieldValue | undefined> => ({
    ...defined(form, tcg),
    set: form.set || deleteField(),
    category: form.category || deleteField(),
    description: form.description || deleteField(),
    badge: form.badge || deleteField(),
    badgeColor: form.badgeColor || deleteField(),
    badgeText: form.badge === 'PRÓXIMAMENTE' && form.badgeText ? form.badgeText : deleteField(),
    price: form.price ?? deleteField(),
    salePrice:
        form.badge === 'OFERTA' && form.salePrice !== undefined ? form.salePrice : deleteField(),
    image: form.image || deleteField(),
});
