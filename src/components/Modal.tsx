import { useEffect, useRef, type ReactNode } from 'react';

const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Posicionamiento del fondo, igual para todos los modales. Va por encima del
 * header y del footer, que están en z-50: los modales se renderizan dentro de
 * <main>, y como el footer viene después en el DOM, con el mismo z-index
 * ganaba él y tapaba la parte baja del diálogo.
 */
const BACKDROP_BASE = 'fixed inset-0 z-[60] flex items-center justify-center';

type Props = {
    children: ReactNode;
    onClose: () => void;
    /** Nombre accesible del diálogo. Se anuncia al abrirlo. */
    title: string;
    /** Clases del panel. Por defecto, marco táctico de ancho medio. */
    panelClass?: string;
    /** Estilos en línea del panel, para los que no usan el marco táctico. */
    panelStyle?: React.CSSProperties;
    /** Clases extra del fondo oscuro (opacidad, padding, animación de entrada). */
    backdropClass?: string;
    /** Impide cerrar pulsando fuera. */
    disableBackdropClose?: boolean;
    /**
     * Impide cerrar con Escape. Un diálogo normal debe cerrarse así, y quitarlo
     * empeora la accesibilidad, de modo que solo se justifica cuando cerrar
     * pierde algo que no se puede recuperar: la pantalla que enseña el
     * localizador de la reserva es el único sitio donde ese código existe.
     * Úsalo únicamente con un botón de cierre visible y evidente.
     */
    disableEscapeClose?: boolean;
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
    backdropClass = 'bg-black/70 p-4',
    disableBackdropClose = false,
    disableEscapeClose = false,
}: Props) => {
    const panelRef = useRef<HTMLDivElement>(null);
    // En refs para no reinstalar el listener si el padre recrea la función o
    // cambia el flag a mitad de vida del modal (pasa al terminar de guardar)
    const cerrar = useRef(onClose);
    const escapeBloqueado = useRef(disableEscapeClose);
    useEffect(() => {
        cerrar.current = onClose;
        escapeBloqueado.current = disableEscapeClose;
    });

    useEffect(() => {
        const previo = document.activeElement as HTMLElement | null;
        const panel = panelRef.current;

        // Foco al primer control, o al panel si no hay ninguno
        (panel?.querySelector<HTMLElement>(FOCUSABLE) ?? panel)?.focus();

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (!escapeBloqueado.current) cerrar.current();
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
        <div
            className={`${BACKDROP_BASE} ${backdropClass}`}
            onClick={disableBackdropClose ? undefined : onClose}>
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
