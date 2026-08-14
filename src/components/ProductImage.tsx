import { useState } from 'react';

type Props = {
    src?: string;
    /** Obligatorio: normalmente el nombre del producto. Sirve al lector de
     *  pantalla, a Google Imágenes y como texto de respaldo si la URL falla. */
    alt: string;
    featured?: boolean;
    className?: string;
    inStock?: boolean;
    /** Desactiva la carga diferida en imágenes visibles de entrada. */
    eager?: boolean;
};

const ProductImage = ({
    src,
    alt,
    featured = false,
    className,
    inStock = true,
    eager,
}: Props) => {
    const [failed, setFailed] = useState(false);
    const defaultH = featured ? 'h-48' : 'h-36';
    const sizeClass = className ?? `w-full ${defaultH}`;
    const stockClass = inStock ? '' : 'grayscale opacity-50';

    if (src && !failed) {
        return (
            <img
                src={src}
                alt={alt}
                loading={eager ? 'eager' : 'lazy'}
                decoding="async"
                className={`object-contain ${sizeClass} ${stockClass}`}
                onError={() => setFailed(true)}
            />
        );
    }

    // Hueco decorativo: el icono de Material Symbols es la ligadura de la
    // palabra "image", que un lector de pantalla leería en voz alta.
    return (
        <div
            aria-hidden="true"
            className={`bg-surface-container-lowest border border-outline-variant/50 flex flex-col items-center justify-center gap-2 ${sizeClass} ${stockClass}`}>
            <span
                className="material-symbols-outlined text-outline"
                style={{ fontSize: '1.25rem' }}>
                image
            </span>
        </div>
    );
};

export default ProductImage;
