import { describe, it, expect } from 'vitest';
import {
    LOCALIZADOR,
    generarLocalizador,
    normalizarLocalizador,
} from './localizador';

describe('generarLocalizador', () => {
    it('emite el formato XXXX-XXXX que también exigen las reglas', () => {
        for (let i = 0; i < 50; i++) {
            expect(generarLocalizador()).toMatch(LOCALIZADOR);
        }
    });

    // Se dicta por teléfono y se copia a mano de un papel: un 0 que se lea
    // como O manda al cliente a discutir su reserva al mostrador
    it('no usa caracteres que se confundan al leerlos', () => {
        const codigos = Array.from({ length: 200 }, generarLocalizador).join(
            '',
        );
        expect(codigos).not.toMatch(/[01ILO]/);
    });

    it('no repite el mismo código en una tanda larga', () => {
        const codigos = Array.from({ length: 500 }, generarLocalizador);
        expect(new Set(codigos).size).toBe(codigos.length);
    });
});

describe('normalizarLocalizador', () => {
    it('iguala el código escrito de cualquier manera', () => {
        const esperado = 'A7K39QXM';
        expect(normalizarLocalizador('A7K3-9QXM')).toBe(esperado);
        expect(normalizarLocalizador('a7k39qxm')).toBe(esperado);
        expect(normalizarLocalizador(' a7k3 - 9qxm ')).toBe(esperado);
    });
});
