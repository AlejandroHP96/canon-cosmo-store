import { useState } from 'react';

type Props = {
    src?: string;
    featured?: boolean;
};

const ProductImage = ({ src, featured = false }: Props) => {
    const [failed, setFailed] = useState(false);
    const h = featured ? 'h-48' : 'h-36';

    if (src && !failed) {
        return (
            <img
                src={src}
                alt="Product"
                className={`w-full object-contain bg-surface-container-lowest border border-outline-variant/50 ${h}`}
                onError={() => setFailed(true)}
            />
        );
    }

    return (
        <div
            className={`w-full bg-surface-container-lowest border border-outline-variant/50 flex flex-col items-center justify-center gap-2 ${h}`}>
            <span className="material-symbols-outlined text-4xl text-outline">
                image
            </span>
            <p className="text-[9px] font-headline text-outline tracking-widest uppercase">
                Imagen pendiente
            </p>
        </div>
    );
};

export default ProductImage;
