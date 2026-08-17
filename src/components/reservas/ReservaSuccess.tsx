import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    localizador: string;
    onClose: () => void;
};

const ReservaSuccess = ({ localizador, onClose }: Props) => {
    const { t } = useTranslation();
    const [copiado, setCopiado] = useState(false);

    /**
     * El portapapeles no está disponible en todos lados (hace falta contexto
     * seguro, y el usuario puede haber denegado el permiso). Si falla no se
     * avisa de nada: el código está escrito ahí al lado y se puede copiar a
     * mano, así que un error rojo solo asustaría.
     */
    const copiar = async () => {
        try {
            await navigator.clipboard.writeText(localizador);
            setCopiado(true);
            setTimeout(() => setCopiado(false), 2000);
        } catch {
            setCopiado(false);
        }
    };

    return (
        <div className="text-center py-4">
            <span className="material-symbols-outlined text-primary text-4xl mb-3">
                check_circle
            </span>
            <p className="font-headline font-bold text-base uppercase tracking-widest text-on-surface mb-1">
                {t('reservas.success.title')}
            </p>
            <p className="font-body text-sm text-on-surface-variant">
                {t('reservas.success.text')}
            </p>

            <div className="tactical-frame mt-6 p-4">
                <p className="font-headline text-[10px] uppercase tracking-[0.3em] text-primary/60 mb-2">
                    {t('reservas.success.codeLabel')}
                </p>
                <div className="flex items-center justify-center gap-2">
                    <span
                        // Seleccionable de un toque: en móvil se comparte por
                        // WhatsApp mucho más a menudo que se copia con el botón
                        className="font-headline font-bold text-2xl tracking-[0.2em] text-primary select-all"
                        data-testid="localizador">
                        {localizador}
                    </span>
                    <button
                        type="button"
                        onClick={copiar}
                        title={t('reservas.success.copy')}
                        aria-label={t('reservas.success.copy')}
                        className="text-on-surface-variant hover:text-primary transition-colors p-1">
                        <span className="material-symbols-outlined text-base">
                            {copiado ? 'check' : 'content_copy'}
                        </span>
                    </button>
                </div>
                <p className="font-body text-xs text-on-surface-variant mt-3">
                    {t('reservas.success.codeHint')}
                </p>
            </div>

            {/* El código no se guarda en ninguna parte del lado del cliente y
            no hay pantalla para recuperarlo: al cerrar el modal se pierde de
            verdad. El aviso va en rojo y con icono porque es irreversible. */}
            <div
                role="alert"
                className="border-2 border-error bg-error-container/20 mt-4 p-3 flex items-start gap-2 text-left">
                <span className="material-symbols-outlined text-error text-lg shrink-0">
                    warning
                </span>
                <div>
                    <p className="font-headline font-bold text-xs uppercase tracking-widest text-error mb-1">
                        {t('reservas.success.warningTitle')}
                    </p>
                    <p className="font-body text-xs text-on-surface">
                        {t('reservas.success.warningText')}
                    </p>
                </div>
            </div>

            <button
                onClick={onClose}
                className="mt-6 border border-primary text-primary font-headline text-xs uppercase tracking-widest px-6 py-2 hover:bg-primary hover:text-surface transition-colors">
                {t('reservas.success.close')}
            </button>
        </div>
    );
};

export default ReservaSuccess;
