import { useTranslation } from 'react-i18next';
import { LANGS, LANG_STORAGE_KEY } from '../i18n';

/**
 * Alterna entre los dos idiomas y recuerda la elección. Header y SideNav
 * llevaban cada uno su copia de esta función, con el literal de la clave
 * de localStorage repetido.
 */
export function useLanguage() {
    const { i18n } = useTranslation();
    const next = LANGS.find((l) => l !== i18n.language) ?? 'es';

    const toggle = () => {
        i18n.changeLanguage(next);
        localStorage.setItem(LANG_STORAGE_KEY, next);
    };

    return { next, toggle };
}
