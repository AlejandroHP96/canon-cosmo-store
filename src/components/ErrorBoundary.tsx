import { Component, type ErrorInfo, type ReactNode } from 'react';
// Instancia de i18next directamente: los componentes de clase no pueden usar
// el hook useTranslation, y esta pantalla no necesita reaccionar al idioma
// una vez mostrada.
import i18n from '../i18n';

type Props = {
    children: ReactNode;
    /** 'page' acota el fallo a una página; 'app' es la red de seguridad final. */
    variant?: 'page' | 'app';
    /** Muestra el enlace a la home. Sobra si el boundary es global. */
    showHomeLink?: boolean;
};

type State = { error: Error | null };

/**
 * Captura las excepciones lanzadas durante el render de sus hijos y muestra
 * una pantalla de error en vez de dejar el árbol vacío.
 *
 * Tiene que ser un componente de clase: getDerivedStateFromError y
 * componentDidCatch no tienen equivalente en hooks.
 *
 * No captura errores dentro de async/await, de manejadores de eventos ni de
 * setTimeout: esos no ocurren durante el render.
 */
class ErrorBoundary extends Component<Props, State> {
    state: State = { error: null };

    static getDerivedStateFromError(error: Error): State {
        return { error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error(
            'Error capturado por ErrorBoundary:',
            error,
            info.componentStack,
        );
    }

    private reset = () => this.setState({ error: null });

    render() {
        const { error } = this.state;
        const { children, variant = 'app', showHomeLink = true } = this.props;
        const title = i18n.t(
            variant === 'page' ? 'error.pageTitle' : 'error.title',
        );

        if (!error) return children;

        return (
            <div className="flex items-center justify-center p-6 min-h-64">
                <div className="tactical-frame p-6 max-w-md w-full text-center">
                    <span className="material-symbols-outlined text-error text-4xl mb-3">
                        error
                    </span>
                    <h2 className="font-headline font-bold text-base uppercase tracking-widest text-on-surface mb-2">
                        {title}
                    </h2>
                    <p className="font-body text-sm text-on-surface-variant mb-6">
                        {i18n.t('error.text')}
                    </p>

                    {/* El detalle solo en desarrollo: en producción no se enseñan interioridades */}
                    {import.meta.env.DEV && (
                        <pre className="text-left text-[10px] font-mono text-error bg-surface-container p-3 mb-6 overflow-x-auto whitespace-pre-wrap">
                            {error.message}
                        </pre>
                    )}

                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={this.reset}
                            className="border border-primary text-primary font-headline text-xs uppercase tracking-widest px-6 py-2.5 hover:bg-primary hover:text-surface transition-colors">
                            {i18n.t('error.retry')}
                        </button>
                        {showHomeLink && (
                            <a
                                href="/"
                                className="border border-outline-variant text-on-surface-variant font-headline text-xs uppercase tracking-widest px-6 py-2.5 hover:border-primary hover:text-primary transition-colors flex items-center">
                                {i18n.t('error.home')}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default ErrorBoundary;
