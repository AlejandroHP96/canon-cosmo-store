/** Formas de los formularios del editor de navegación y sus valores iniciales. */

export type NavItemForm = { icon: string; label: string; path: string };

export type SubNavForm = {
    label: string;
    path: string;
    image: string;
    color: string;
};

export type NewSubForm = SubNavForm & {
    /** Mientras esté activo, la ruta se deriva del label. Se apaga al editarla a mano. */
    pathAutoSync: boolean;
};

export const EMPTY_ITEM_FORM: NavItemForm = { icon: '', label: '', path: '' };

export const EMPTY_SUB_FORM: NewSubForm = {
    label: '',
    path: '',
    pathAutoSync: true,
    image: '',
    color: '',
};

export const PATH_LOCK_HINT =
    'La ruta no se puede cambiar para no desvincular productos y categorías.';
