import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from '../i18n/es.json';

// Se inicializa i18next aquí, y no se importa src/i18n, porque aquel módulo
// lee localStorage al cargarse y fija el idioma según lo que hubiera guardado.
// Los tests afirman sobre los textos en español, así que el idioma se clava.
i18n.use(initReactI18next).init({
    resources: { es: { translation: es } },
    lng: 'es',
    fallbackLng: 'es',
    interpolation: { escapeValue: false },
});

afterEach(cleanup);
