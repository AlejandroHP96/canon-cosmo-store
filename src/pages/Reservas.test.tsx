import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HelmetProvider } from 'react-helmet-async';
import Reservas from './Reservas';
import { getReservableProducts } from '../services/productsService';
import { addReserva } from '../services/reservasService';
import type { Product } from '../types';

vi.mock('../services/productsService', () => ({
    getReservableProducts: vi.fn(),
}));
vi.mock('../services/reservasService', () => ({
    addReserva: vi.fn(),
}));

const PRODUCTO: Product = {
    id: 'p1',
    tcg: 'pokemon',
    name: 'Caja Destinos Paldeanos',
    set: 'Escarlata y Púrpura',
    category: 'Cajas',
    reservable: true,
};

const mockGetProductos = vi.mocked(getReservableProducts);
const mockAddReserva = vi.mocked(addReserva);

const renderPagina = () =>
    render(
        <HelmetProvider>
            <Reservas />
        </HelmetProvider>,
    );

/** Abre el modal de reserva del único producto de la lista. */
async function abrirFormulario(user: ReturnType<typeof userEvent.setup>) {
    await screen.findByText(PRODUCTO.name);
    await user.click(screen.getByRole('button', { name: /reservar/i }));
    return screen.getByRole('dialog');
}

describe('<Reservas />', () => {
    beforeEach(() => {
        mockGetProductos.mockResolvedValue([PRODUCTO]);
        mockAddReserva.mockResolvedValue('r1');
    });

    it('envía la reserva con la cantidad ya normalizada a número', async () => {
        const user = userEvent.setup();
        renderPagina();
        await abrirFormulario(user);

        await user.type(
            screen.getByPlaceholderText('Nombre y apellidos'),
            'Ada Lovelace',
        );
        const cantidad = screen.getByLabelText('Cantidad');
        await user.clear(cantidad);
        await user.type(cantidad, '3');
        await user.type(
            screen.getByPlaceholderText(/algo que debamos saber/i),
            '  sin prisa  ',
        );

        await user.click(
            screen.getByRole('button', { name: /solicitar reserva/i }),
        );

        await waitFor(() => expect(mockAddReserva).toHaveBeenCalledTimes(1));
        expect(mockAddReserva).toHaveBeenCalledWith({
            productoId: 'p1',
            productoNombre: PRODUCTO.name,
            seccion: 'pokemon',
            cliente: 'Ada Lovelace',
            cantidad: 3,
            notas: 'sin prisa',
        });
    });

    it('confirma al usuario cuando la reserva se ha guardado', async () => {
        const user = userEvent.setup();
        renderPagina();
        await abrirFormulario(user);

        await user.type(
            screen.getByPlaceholderText('Nombre y apellidos'),
            'Ada Lovelace',
        );
        await user.click(
            screen.getByRole('button', { name: /solicitar reserva/i }),
        );

        expect(
            await screen.findByText('Solicitud enviada'),
        ).toBeInTheDocument();
    });

    // El nombre de una sola palabra lo rechazan también las reglas de Firestore
    // (cliente.matches('^\\S+(\\s+\\S+)+$')). Si esta guarda desapareciera, el
    // cliente rellenaría el formulario para que Firestore lo rechazara al final.
    it('no envía nada si el nombre no trae apellido', async () => {
        const user = userEvent.setup();
        renderPagina();
        await abrirFormulario(user);

        await user.type(
            screen.getByPlaceholderText('Nombre y apellidos'),
            'Ada',
        );
        await user.click(
            screen.getByRole('button', { name: /solicitar reserva/i }),
        );

        expect(mockAddReserva).not.toHaveBeenCalled();
        expect(screen.queryByText('Solicitud enviada')).not.toBeInTheDocument();
    });

    // Los teclados de móvil con texto predictivo dejan un espacio al final
    it('acepta el nombre aunque venga con espacios sueltos a los lados', async () => {
        const user = userEvent.setup();
        renderPagina();
        await abrirFormulario(user);

        await user.type(
            screen.getByPlaceholderText('Nombre y apellidos'),
            '  Ada Lovelace  ',
        );
        await user.click(
            screen.getByRole('button', { name: /solicitar reserva/i }),
        );

        await waitFor(() => expect(mockAddReserva).toHaveBeenCalledTimes(1));
        expect(mockAddReserva.mock.calls[0][0].cliente).toBe('Ada Lovelace');
    });

    it('muestra el error de Firestore sin tragárselo', async () => {
        mockAddReserva.mockRejectedValue(
            new Error('Missing or insufficient permissions'),
        );
        const user = userEvent.setup();
        renderPagina();
        await abrirFormulario(user);

        await user.type(
            screen.getByPlaceholderText('Nombre y apellidos'),
            'Ada Lovelace',
        );
        await user.click(
            screen.getByRole('button', { name: /solicitar reserva/i }),
        );

        expect(
            await screen.findByText(/Missing or insufficient permissions/),
        ).toBeInTheDocument();
        expect(screen.queryByText('Solicitud enviada')).not.toBeInTheDocument();
    });

    it('avisa si el catálogo de reservables no carga', async () => {
        mockGetProductos.mockRejectedValue(new Error('red caída'));
        renderPagina();

        expect(
            await screen.findByText('Error al cargar productos disponibles.'),
        ).toBeInTheDocument();
    });
});
