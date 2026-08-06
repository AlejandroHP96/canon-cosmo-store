const ReservaSuccess = ({ onClose }: { onClose: () => void }) => (
    <div className="text-center py-4">
        <span className="material-symbols-outlined text-primary text-4xl mb-3">check_circle</span>
        <p className="font-headline font-bold text-base uppercase tracking-widest text-on-surface mb-1">
            Solicitud enviada
        </p>
        <p className="font-body text-sm text-on-surface-variant">
            Te contactaremos pronto para confirmar tu reserva.
        </p>
        <button
            onClick={onClose}
            className="mt-6 border border-primary text-primary font-headline text-xs uppercase tracking-widest px-6 py-2 hover:bg-primary hover:text-surface transition-colors">
            Cerrar
        </button>
    </div>
);

export default ReservaSuccess;
