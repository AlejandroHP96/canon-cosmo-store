import { describe, it, expect } from 'vitest';
import { getResult, SYMBOLS } from './slotMachine';

/** Índice del símbolo con ese carácter, para no depender del orden del array. */
const idx = (char: string) => SYMBOLS.findIndex((s) => s.char === char);

const SIETE = idx('7');
const CORAZON = idx('♥');
const ESTRELLA = idx('★');
const MATERIA = idx('♣');
const CRISTAL = idx('♦');

describe('getResult', () => {
    it('tres sietes es el premio máximo', () => {
        const r = getResult([SIETE, SIETE, SIETE]);
        expect(r?.text).toContain('LUCKY 7s');
        expect(r?.big).toBe(true);
    });

    it('tres corazones tiene su propio mensaje', () => {
        const r = getResult([CORAZON, CORAZON, CORAZON]);
        expect(r?.text).toContain('Planeta');
        expect(r?.big).toBe(true);
    });

    it('cualquier otro trío es premio mayor, con el nombre del símbolo', () => {
        const r = getResult([ESTRELLA, ESTRELLA, ESTRELLA]);
        expect(r?.text).toContain('PREMIO MAYOR');
        expect(r?.text).toContain('Estrellas');
        expect(r?.big).toBe(true);
    });

    it('detecta el par en cualquier posición', () => {
        for (const combo of [
            [MATERIA, MATERIA, CRISTAL],
            [MATERIA, CRISTAL, CRISTAL],
            [MATERIA, CRISTAL, MATERIA],
        ]) {
            expect(getResult(combo)?.text).toContain('Un par');
        }
    });

    it('sin par pero con un siete, da el mensaje de casi', () => {
        const r = getResult([SIETE, ESTRELLA, MATERIA]);
        expect(r?.text).toContain('Casi');
    });

    it('sin par ni siete, no hay premio', () => {
        const r = getResult([ESTRELLA, MATERIA, CRISTAL]);
        expect(r?.text).toContain('Nyuk');
    });

    it('el par manda sobre el siete suelto', () => {
        // Dos estrellas y un siete es par, no "casi"
        expect(getResult([ESTRELLA, ESTRELLA, SIETE])?.text).toContain('Un par');
    });

    it('siempre devuelve un resultado con texto y color', () => {
        for (let a = 0; a < SYMBOLS.length; a++) {
            for (let b = 0; b < SYMBOLS.length; b++) {
                for (let c = 0; c < SYMBOLS.length; c++) {
                    const r = getResult([a, b, c]);
                    expect(r?.text).toBeTruthy();
                    expect(r?.color).toMatch(/^#[0-9a-f]{6}$/i);
                }
            }
        }
    });
});
