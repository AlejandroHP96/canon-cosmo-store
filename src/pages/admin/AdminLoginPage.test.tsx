import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AdminLoginPage from './AdminLoginPage';
import ProtectedRoute from '../../components/admin/ProtectedRoute';
import { AuthContext, type AuthContextValue } from '../../contexts/authContext';
import type { User } from 'firebase/auth';

const USUARIO = { uid: 'u1', email: 'admin@ejemplo.com' } as User;

/** Monta login y panel bajo el mismo router, con la sesión que se le pase. */
function renderAdmin(auth: Partial<AuthContextValue>, ruta = '/cosmos-admin') {
    const value: AuthContextValue = {
        user: null,
        isAdmin: false,
        loading: false,
        signIn: vi.fn(),
        signOut: vi.fn(),
        ...auth,
    };
    render(
        <AuthContext.Provider value={value}>
            <MemoryRouter initialEntries={[ruta]}>
                <Routes>
                    <Route path="/cosmos-admin" element={<AdminLoginPage />} />
                    <Route element={<ProtectedRoute />}>
                        <Route
                            path="/cosmos-admin/panel"
                            element={<p>PANEL</p>}
                        />
                    </Route>
                </Routes>
            </MemoryRouter>
        </AuthContext.Provider>,
    );
    return value;
}

describe('<AdminLoginPage />', () => {
    it('traduce el código de Firebase a un mensaje en castellano', async () => {
        const user = userEvent.setup();
        const signIn = vi.fn().mockRejectedValue(
            Object.assign(new Error('nope'), {
                code: 'auth/invalid-credential',
            }),
        );
        renderAdmin({ signIn });

        await user.type(screen.getByLabelText('Email'), 'admin@ejemplo.com');
        await user.type(screen.getByLabelText('Contraseña'), 'secreta');
        await user.click(screen.getByRole('button', { name: /acceder/i }));

        expect(
            await screen.findByText('Email o contraseña incorrectos.'),
        ).toBeInTheDocument();
    });

    // Con la protección de enumeración de correo activada en la consola,
    // Firebase devuelve auth/invalid-credential tanto si el email no existe
    // como si la contraseña es incorrecta. Ninguna rama debe depender de
    // auth/user-not-found ni de auth/wrong-password.
    it('no delata si el email existe cuando el error es genérico', async () => {
        const user = userEvent.setup();
        const signIn = vi.fn().mockRejectedValue(
            Object.assign(new Error('nope'), {
                code: 'auth/invalid-credential',
            }),
        );
        renderAdmin({ signIn });

        await user.type(screen.getByLabelText('Email'), 'noexiste@ejemplo.com');
        await user.type(screen.getByLabelText('Contraseña'), 'secreta');
        await user.click(screen.getByRole('button', { name: /acceder/i }));

        const mensaje = await screen.findByText(
            'Email o contraseña incorrectos.',
        );
        expect(mensaje).toBeInTheDocument();
        expect(screen.queryByText(/no existe/i)).not.toBeInTheDocument();
    });

    it('avisa cuando la cuenta es válida pero no tiene el claim admin', async () => {
        const user = userEvent.setup();
        const signIn = vi.fn().mockRejectedValue(
            Object.assign(new Error('sin claim'), {
                code: 'auth/not-admin',
            }),
        );
        renderAdmin({ signIn });

        await user.type(screen.getByLabelText('Email'), 'curioso@ejemplo.com');
        await user.type(screen.getByLabelText('Contraseña'), 'secreta');
        await user.click(screen.getByRole('button', { name: /acceder/i }));

        expect(
            await screen.findByText(
                'Esta cuenta no tiene permisos de administrador.',
            ),
        ).toBeInTheDocument();
    });

    it('cae en un mensaje genérico ante un código desconocido', async () => {
        const user = userEvent.setup();
        const signIn = vi
            .fn()
            .mockRejectedValue(
                Object.assign(new Error('?'), { code: 'auth/vaya' }),
            );
        renderAdmin({ signIn });

        await user.type(screen.getByLabelText('Email'), 'admin@ejemplo.com');
        await user.type(screen.getByLabelText('Contraseña'), 'secreta');
        await user.click(screen.getByRole('button', { name: /acceder/i }));

        expect(
            await screen.findByText('Error al iniciar sesión.'),
        ).toBeInTheDocument();
    });

    it('lleva al panel a quien ya tiene sesión con el claim', () => {
        renderAdmin({ user: USUARIO, isAdmin: true });
        expect(screen.getByText('PANEL')).toBeInTheDocument();
    });

    // Sin esto login y ProtectedRoute se redirigen mutuamente sin parar
    it('no rebota al panel si la sesión no tiene el claim', () => {
        renderAdmin({ user: USUARIO, isAdmin: false });
        expect(screen.queryByText('PANEL')).not.toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /acceder/i }),
        ).toBeInTheDocument();
    });
});

describe('<ProtectedRoute />', () => {
    it('deja pasar al admin', () => {
        renderAdmin({ user: USUARIO, isAdmin: true }, '/cosmos-admin/panel');
        expect(screen.getByText('PANEL')).toBeInTheDocument();
    });

    // La barrera real son las reglas de Firestore, pero si esto se rompiera el
    // panel se pintaría entero para alguien que no puede escribir nada
    it('echa al autenticado sin claim', () => {
        renderAdmin({ user: USUARIO, isAdmin: false }, '/cosmos-admin/panel');
        expect(screen.queryByText('PANEL')).not.toBeInTheDocument();
    });

    it('echa a quien no ha iniciado sesión', () => {
        renderAdmin({ user: null, isAdmin: false }, '/cosmos-admin/panel');
        expect(screen.queryByText('PANEL')).not.toBeInTheDocument();
    });

    it('espera sin decidir mientras la sesión se está resolviendo', () => {
        renderAdmin(
            { user: null, isAdmin: false, loading: true },
            '/cosmos-admin/panel',
        );
        expect(screen.queryByText('PANEL')).not.toBeInTheDocument();
        expect(
            screen.queryByRole('button', { name: /acceder/i }),
        ).not.toBeInTheDocument();
    });
});
