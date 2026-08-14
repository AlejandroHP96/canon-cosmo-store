import { describe, it, expect } from 'vitest';
import type { SolicitudReserva } from '../../../services/reservasService';
import {
    filtrarReservas,
    ordenarPorFecha,
    productosDeReservas,
    seccionesDeReservas,
} from './reservasQuery';

const reserva = (patch: Partial<SolicitudReserva>): SolicitudReserva => ({
    id: 'x',
    productoId: 'p',
    productoNombre: 'Sobre Pokemon',
    seccion: 'pokemon',
    cliente: 'Ana Pérez',
    cantidad: 1,
    notas: '',
    fecha: '2026-01-01T10:00:00.000Z',
    estado: 'pendiente',
    ...patch,
});

const solicitudes: SolicitudReserva[] = [
    reserva({
        id: '1',
        fecha: '2026-03-01T10:00:00.000Z',
        cliente: 'Ana Pérez',
    }),
    reserva({
        id: '2',
        fecha: '2026-01-01T10:00:00.000Z',
        cliente: 'Luis Gómez',
        seccion: 'digimon',
        productoNombre: 'Mazo Digimon',
        email: 'luis@example.com',
    }),
    reserva({
        id: '3',
        fecha: '2026-02-01T10:00:00.000Z',
        cliente: 'Marta Ruiz',
        productoNombre: 'ETB Pokemon',
    }),
];

describe('ordenarPorFecha', () => {
    it('deja las más antiguas primero', () => {
        expect(ordenarPorFecha(solicitudes).map((r) => r.id)).toEqual([
            '2',
            '3',
            '1',
        ]);
    });

    it('no muta la lista original', () => {
        const original = [...solicitudes];
        ordenarPorFecha(solicitudes);
        expect(solicitudes).toEqual(original);
    });
});

describe('seccionesDeReservas', () => {
    it('devuelve las secciones únicas y ordenadas', () => {
        expect(seccionesDeReservas(solicitudes)).toEqual([
            'digimon',
            'pokemon',
        ]);
    });
});

describe('productosDeReservas', () => {
    it('sin sección devuelve todos los productos', () => {
        expect(productosDeReservas(solicitudes, null)).toEqual([
            'ETB Pokemon',
            'Mazo Digimon',
            'Sobre Pokemon',
        ]);
    });

    it('se limita a la sección elegida', () => {
        expect(productosDeReservas(solicitudes, 'pokemon')).toEqual([
            'ETB Pokemon',
            'Sobre Pokemon',
        ]);
    });
});

describe('filtrarReservas', () => {
    it('sin filtros devuelve todo', () => {
        expect(filtrarReservas(solicitudes, '', null, null)).toHaveLength(3);
    });

    it('filtra por sección y por producto', () => {
        expect(
            filtrarReservas(solicitudes, '', 'digimon', null).map((r) => r.id),
        ).toEqual(['2']);
        expect(
            filtrarReservas(solicitudes, '', null, 'ETB Pokemon').map(
                (r) => r.id,
            ),
        ).toEqual(['3']);
    });

    it('busca por cliente, producto o email', () => {
        expect(
            filtrarReservas(solicitudes, 'marta', null, null).map((r) => r.id),
        ).toEqual(['3']);
        expect(
            filtrarReservas(solicitudes, 'mazo', null, null).map((r) => r.id),
        ).toEqual(['2']);
        expect(
            filtrarReservas(solicitudes, 'luis@', null, null).map((r) => r.id),
        ).toEqual(['2']);
    });

    // El nombre real lleva tilde y quien busca en el panel no la teclea
    it('encuentra al cliente aunque la búsqueda vaya sin tildes', () => {
        const conTilde = [
            reserva({ id: '9', cliente: 'Fabián Ríos' }),
            ...solicitudes,
        ];
        expect(
            filtrarReservas(conTilde, 'fabian', null, null).map((r) => r.id),
        ).toEqual(['9']);
        expect(
            filtrarReservas(conTilde, 'Rios', null, null).map((r) => r.id),
        ).toEqual(['9']);
    });

    // Y al revés: el nombre escrito sin tilde debe salir al buscarlo con ella
    it('encuentra al cliente escrito sin tilde buscándolo con ella', () => {
        const sinTilde = [reserva({ id: '9', cliente: 'Fabian Rios' })];
        expect(
            filtrarReservas(sinTilde, 'Fabián', null, null).map((r) => r.id),
        ).toEqual(['9']);
    });

    it('ignora las tildes también en producto y email', () => {
        const otras = [
            reserva({
                id: '9',
                productoNombre: 'Edición Especial',
                email: 'ROCÍO@example.com',
            }),
        ];
        expect(filtrarReservas(otras, 'edicion', null, null)).toHaveLength(1);
        expect(filtrarReservas(otras, 'rocio@', null, null)).toHaveLength(1);
    });

    it('no falla si la reserva no tiene email', () => {
        expect(() =>
            filtrarReservas(solicitudes, 'algo', null, null),
        ).not.toThrow();
    });
});
