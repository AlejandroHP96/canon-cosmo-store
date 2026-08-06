type Props = {
    size?: 'md' | 'lg';
    /** Clases del contenedor: sirve para fijar el alto o el espaciado. */
    className?: string;
};

/** Indicador de carga. Compartido por la tienda y el panel de admin. */
const Spinner = ({ size = 'md', className = 'py-10' }: Props) => (
    <div className={`flex items-center justify-center ${className}`}>
        <span
            className={`material-symbols-outlined text-primary animate-spin ${
                size === 'lg' ? 'text-4xl' : 'text-3xl'
            }`}>
            progress_activity
        </span>
    </div>
);

export default Spinner;
