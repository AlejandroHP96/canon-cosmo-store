import Modal from '../../Modal';
type Props = {
    count: number;
    deleting: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

const ConfirmDeleteAllModal = ({ count, deleting, onClose, onConfirm }: Props) => (
    <Modal
        onClose={onClose}
        title="Eliminar todas las reservas"
        panelClass="tactical-frame p-6 w-full max-w-sm"
        disableBackdropClose={deleting}>
            <h2 className="font-headline font-bold text-lg text-on-surface uppercase tracking-widest mb-2">
                Eliminar todas las reservas
            </h2>
            <p className="text-sm font-body text-on-surface-variant mb-6">
                ¿Seguro que quieres eliminar las {count} solicitudes de reserva? Esta acción no se
                puede deshacer.
            </p>
            <div className="flex gap-3">
                <button
                    onClick={onClose}
                    disabled={deleting}
                    className="flex-1 border border-outline-variant text-on-surface-variant font-headline text-xs uppercase tracking-widest py-2.5 hover:border-primary hover:text-primary transition-colors disabled:opacity-40">
                    Cancelar
                </button>
                <button
                    onClick={onConfirm}
                    disabled={deleting}
                    className="flex-1 border border-error bg-error-container/30 text-error font-headline text-xs uppercase tracking-widest py-2.5 hover:bg-error-container/60 transition-colors disabled:opacity-50">
                    {deleting ? 'Eliminando...' : 'Eliminar todas'}
                </button>
            </div>
    </Modal>
);

export default ConfirmDeleteAllModal;
