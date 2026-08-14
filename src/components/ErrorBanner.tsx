type Props = {
    message: string | null;
    onDismiss: () => void;
    className?: string;
};

/** Aviso de error descartable. Compartido por la tienda y el panel de admin. */
const ErrorBanner = ({ message, onDismiss, className = 'mb-6' }: Props) => {
    if (!message) return null;

    return (
        <div
            className={`flex items-center gap-2 border border-error bg-error-container/20 px-3 py-2.5 ${className}`}>
            <span className="material-symbols-outlined text-error text-base shrink-0">
                error
            </span>
            <p className="text-sm font-body text-error flex-1">{message}</p>
            <button
                onClick={onDismiss}
                className="text-error/60 hover:text-error shrink-0">
                <span className="material-symbols-outlined text-sm">close</span>
            </button>
        </div>
    );
};

export default ErrorBanner;
