import { useEffect, useRef, type ReactNode } from 'react';

const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type Props = {
    children: ReactNode;
    onClose: () => void;
    /** Nombre accesible del diálogo. Se anuncia al abrirlo. */
    title: string;
    /** Clases del panel. Por defecto, marco táctico de ancho medio. */
    panelClass?: string;
    /** Estilos en línea del panel, para los que no usan el marco táctico. */
    panelStyle?: React.CSSProperties;
    /** Clases del fondo oscuro. */
    backdropClass?: string;
    /** Impide cerrar pulsando fuera. */
    disableBackdropClose?: boolean;
};

/**
 * Diálogo modal accesible: anuncia su rol y su nombre, atrapa el foco
 * mientras está abierto, se cierra con Escape y devuelve el foco al elemento
 * que lo abrió. Cada modal repetía el fondo y el panel sin nada de esto.
 */
const Modal = ({
    children,
    onClose,
    title,
    panelClass = 'tactical-frame p-6 w-full max-w-lg',
    panelStyle,
    backdropClass = 'fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4',
    disableBackdropClose = false,
}: Props) => {
    const panelRef = useRef<HTMLDivElement>(null);
    // En una ref para no reinstalar el listener si el padre recrea la función
    const cerrar = useRef(onClose);
    useEffect(() => {
        cerrar.current = onClose;
    });

    useEffect(() => {
        const previo = document.activeElement as HTMLElement | null;
        const panel = panelRef.current;

        // Foco al primer control, o al panel si no hay ninguno
        (panel?.querySelector<HTMLElement>(FOCUSABLE) ?? panel)?.focus();

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                cerrar.current();
                return;
            }
            if (e.key !== 'Tab' || !panel) return;

            // Trampa de foco: sin esto se tabula por detrás del modal
            const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)];
            if (items.length === 0) return;
            const primero = items[0];
            const ultimo = items[items.length - 1];

            if (e.shiftKey && document.activeElement === primero) {
                e.preventDefault();
                ultimo.focus();
            } else if (!e.shiftKey && document.activeElement === ultimo) {
                e.preventDefault();
                primero.focus();
            }
        };

        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            previo?.focus();
        };
    }, []);

    return (
        <div className={backdropClass} onClick={disableBackdropClose ? undefined : onClose}>
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                tabIndex={-1}
                className={panelClass}
                style={panelStyle}
                onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export default Modal;
