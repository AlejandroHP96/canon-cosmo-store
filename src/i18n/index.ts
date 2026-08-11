import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from './es.json';
import en from './en.json';

export const LANG_STORAGE_KEY = 'canon-cosmo-lang';
export const LANGS = ['es', 'en'] as const;

const saved = localStorage.getItem(LANG_STORAGE_KEY) ?? 'es';

i18n.use(initReactI18next).init({
    resources: { es: { translation: es }, en: { translation: en } },
    lng: saved,
    fallbackLng: 'es',
    interpolation: { escapeValue: false },
});

export default i18n;
