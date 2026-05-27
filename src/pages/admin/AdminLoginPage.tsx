import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ERROR_MESSAGES: Record<string, string> = {
    'auth/invalid-credential': 'Email o contraseña incorrectos.',
    'auth/invalid-email': 'El email no es válido.',
    'auth/too-many-requests': 'Demasiados intentos. Espera un momento.',
    'auth/network-request-failed': 'Error de red. Comprueba tu conexión.',
};

const AdminLoginPage = () => {
    const { user, signIn } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    if (user) return <Navigate to="/cosmos-admin/panel" replace />;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await signIn(email, password);
            navigate('/cosmos-admin/panel', { replace: true });
        } catch (err: unknown) {
            const code = (err as { code?: string }).code ?? '';
            setError(ERROR_MESSAGES[code] ?? 'Error al iniciar sesión.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-4">
            <div className="tactical-frame p-8 w-full max-w-sm">
                {/* Header */}
                <div className="mb-8">
                    <p className="text-[10px] font-headline text-primary tracking-[0.3em] uppercase mb-2">
                        COSMOS-ADMIN // ACCESO SEGURO
                    </p>
                    <h1 className="font-headline font-bold text-2xl text-on-surface uppercase tracking-widest">
                        Panel de Control
                    </h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label className="block font-headline text-xs uppercase tracking-widest text-on-surface-variant mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            className="w-full border border-outline-variant bg-surface-container-lowest text-on-surface font-body text-sm px-3 py-2 focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="block font-headline text-xs uppercase tracking-widest text-on-surface-variant mb-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            className="w-full border border-outline-variant bg-surface-container-lowest text-on-surface font-body text-sm px-3 py-2 focus:outline-none focus:border-primary"
                        />
                    </div>

                    {error && (
                        <p className="text-xs font-body text-[#ffb4ab] flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">error</span>
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="mt-2 w-full border border-primary bg-surface-container text-primary font-headline text-xs uppercase tracking-widest py-2.5 hover:bg-primary hover:text-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {submitting ? 'Accediendo...' : 'Acceder'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;
