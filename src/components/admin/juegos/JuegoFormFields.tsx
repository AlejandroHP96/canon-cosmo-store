import { inputClass, labelClass } from '../adminStyles';
import type { JuegoForm } from './juegoForm';

/** El alta aclara qué campos son opcionales; en la edición ya se da por sabido. */
const LABELS = {
    alta: {
        imagen: 'Imagen (URL, opcional)',
        descripcion: 'Descripción (opcional)',
        url: 'URL (opcional — el cuadrado abrirá este enlace)',
    },
    edicion: {
        imagen: 'Imagen (URL)',
        descripcion: 'Descripción',
        url: 'URL',
    },
};

type Props = {
    form: JuegoForm;
    mode: 'alta' | 'edicion';
    onChange: (patch: Partial<JuegoForm>) => void;
};

/** Los cuatro campos de un juego, compartidos por el alta y la edición. */
const JuegoFormFields = ({ form, mode, onChange }: Props) => {
    const labels = LABELS[mode];

    return (
        <>
            <div>
                <label className={labelClass}>Nombre</label>
                <input
                    required
                    value={form.nombre}
                    onChange={(e) => onChange({ nombre: e.target.value })}
                    placeholder="Pokémon, Dragon Ball..."
                    className={inputClass}
                />
            </div>
            <div>
                <label className={labelClass}>{labels.imagen}</label>
                <input
                    type="url"
                    value={form.imagen}
                    onChange={(e) => onChange({ imagen: e.target.value })}
                    placeholder="https://..."
                    className={inputClass}
                />
            </div>
            <div>
                <label className={labelClass}>{labels.descripcion}</label>
                <input
                    value={form.descripcion}
                    onChange={(e) => onChange({ descripcion: e.target.value })}
                    placeholder="Formato, info adicional..."
                    className={inputClass}
                />
            </div>
            <div>
                <label className={labelClass}>{labels.url}</label>
                <input
                    type="url"
                    value={form.url}
                    onChange={(e) => onChange({ url: e.target.value })}
                    placeholder="https://..."
                    className={inputClass}
                />
            </div>
        </>
    );
};

export default JuegoFormFields;
