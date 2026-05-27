import { useState } from 'react';

type Props = {
    src?: string;
    featured?: boolean;
};
const ProductImage = ({ src}: Props) => {
    const [failed, setFailed] = useState(false);

    if (src && !failed) {
        return (
            <img
                src={src}
                alt="Product"
                className="w-full h-full object-contain bg-surface-container-lowest border border-outline-variant/50"
                onError={() => setFailed(true)}
            />
        );
    }

    return (
        <div className="w-full h-full bg-surface-container-lowest border border-outline-variant/50 flex flex-col items-center justify-center gap-2">
            <span className="material-symbols-outlined text-4xl text-outline">image</span>
            <p className="text-[9px] font-headline text-outline tracking-widest uppercase">
                Imagen pendiente
            </p>
        </div>
    );
};

export default ProductImage;
