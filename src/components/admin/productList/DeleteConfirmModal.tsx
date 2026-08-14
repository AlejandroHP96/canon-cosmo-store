import { useState } from 'react';
import Modal from '../../Modal';
import ErrorBanner from '../../ErrorBanner';
import { deleteProduct } from '../../../services/productsService';
import type { Product } from '../../../types';

type Props = {
    product: Product;
    onClose: () => void;
    onDeleted: () => void;
};

const DeleteConfirmModal = ({ product, onClose, onDeleted }: Props) => {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        setDeleting(true);
        setError(null);
        try {
            await deleteProduct(product.id);
            onDeleted();
        } catch {
            setError('No se ha podido eliminar. Inténtalo de nuevo.');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Modal
            onClose={onClose}
            title="Eliminar producto"
            panelClass="tactical-frame p-6 w-full max-w-sm"
            disableBackdropClose={deleting}>
            <h2 className="font-headline font-bold text-lg text-on-surface uppercase tracking-widest mb-2">
                Eliminar producto
            </h2>
            <p className="text-sm font-body text-on-surface-variant mb-6">
                ¿Seguro que quieres eliminar{' '}
                <span className="text-on-surface font-bold">
                    {product.name}
                </span>
                ? Esta acción no se puede deshacer.
            </p>
            <ErrorBanner
                message={error}
                onDismiss={() => setError(null)}
                className="mb-4"
            />

            <div className="flex gap-3">
                <button
                    onClick={onClose}
                    className="flex-1 border border-outline-variant text-on-surface-variant font-headline text-xs uppercase tracking-widest py-2.5 hover:border-primary hover:text-primary transition-colors">
                    Cancelar
                </button>
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 border border-error bg-error-container/30 text-error font-headline text-xs uppercase tracking-widest py-2.5 hover:bg-error-container/60 transition-colors disabled:opacity-50">
                    {deleting ? 'Eliminando...' : 'Eliminar'}
                </button>
            </div>
        </Modal>
    );
};

export default DeleteConfirmModal;
