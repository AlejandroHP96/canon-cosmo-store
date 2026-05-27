import { useState } from 'react';

type Props = {
    src?: string;
    featured?: boolean;
    className?: string;
};

const ProductImage = ({ src, featured = false, className }: Props) => {
    const [failed, setFailed] = useState(false);
    const defaultH = featured ? 'h-48' : 'h-36';
    const sizeClass = className ?? `w-full ${defaultH}`;

    if (src && !failed) {
        return (
            <img
                src={src}
                alt="Product"
                className={`object-contain bg-surface-container-lowest border border-outline-variant/50 ${sizeClass}`}
                onError={() => setFailed(true)}
            />
        );
    }

    return (
        <div
            className={`bg-surface-container-lowest border border-outline-variant/50 flex flex-col items-center justify-center gap-2 ${sizeClass}`}>
            <span className="material-symbols-outlined text-outline" style={{ fontSize: '1.25rem' }}>
                image
            </span>
        </div>
    );
};

export default ProductImage;
