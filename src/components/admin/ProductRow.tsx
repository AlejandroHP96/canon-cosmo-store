import ProductImage from '../ProductImage';
import type { Product } from '../../types';

type Props = {
    product: Product;
    isSelected: boolean;
    onToggleSelect: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onToggleVisible: () => void;
};

const ProductRow = ({ product, isSelected, onToggleSelect, onEdit, onDelete, onToggleVisible }: Props) => {
    const isVisible = product.visible !== false;
    return (
        <div
            className={`tactical-frame p-4 flex items-center gap-4 transition-colors ${isSelected ? 'bg-primary/5 border-primary/40' : ''} ${!isVisible ? 'opacity-50' : ''}`}>
            <input
                type="checkbox"
                checked={isSelected}
                onChange={onToggleSelect}
                className="w-4 h-4 accent-primary shrink-0"
            />
            <ProductImage src={product.image} className="w-14 h-14 shrink-0" />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-[9px] font-headline uppercase tracking-widest text-primary/60">
                        {product.tcg}
                    </span>
                    {product.badge && (
                        <span className={`px-1.5 py-0.5 text-[8px] font-headline border ${product.badgeColor} text-[#e0e0ff]`}>
                            {product.badge}
                        </span>
                    )}
                    {product.featured && (
                        <span className="text-[9px] font-headline text-primary">★ Destacado</span>
                    )}
                    {!isVisible && (
                        <span className="text-[9px] font-headline text-yellow-500 flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[11px]">visibility_off</span>
                            Oculto
                        </span>
                    )}
                </div>
                <p className="font-headline font-bold text-sm text-on-surface uppercase truncate">
                    {product.name}
                </p>
                <p className="text-[10px] text-on-surface-variant font-body">
                    {product.set} · {product.category}
                </p>
            </div>
            <div className="text-right shrink-0 hidden sm:block">
                <p className="font-headline font-bold text-primary text-sm">{product.price}</p>
                <p className="text-[10px] text-on-surface-variant font-body">
                    {product.inStock === false ? 'Agotado' : 'Disponible'}
                </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <button
                    onClick={onToggleVisible}
                    className={`border p-1.5 transition-colors ${isVisible ? 'border-outline-variant text-on-surface-variant hover:border-yellow-500 hover:text-yellow-500' : 'border-yellow-500 text-yellow-500 hover:border-primary hover:text-primary'}`}
                    title={isVisible ? 'Ocultar producto' : 'Publicar producto'}>
                    <span className="material-symbols-outlined text-sm">
                        {isVisible ? 'visibility' : 'visibility_off'}
                    </span>
                </button>
                <button
                    onClick={onEdit}
                    className="border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary p-1.5 transition-colors"
                    title="Editar">
                    <span className="material-symbols-outlined text-sm">edit</span>
                </button>
                <button
                    onClick={onDelete}
                    className="border border-outline-variant text-on-surface-variant hover:border-error hover:text-error p-1.5 transition-colors"
                    title="Eliminar">
                    <span className="material-symbols-outlined text-sm">delete</span>
                </button>
            </div>
        </div>
    );
};

export default ProductRow;
