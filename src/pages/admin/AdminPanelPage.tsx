import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getAllProducts,
    addProduct,
    updateProduct,
    deleteProduct,
} from '../../services/productsService';
import type { Product, TcgId } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import ProductImage from '../../components/ProductImage';

// ─── Constants ────────────────────────────────────────────────────────────────

const TCG_OPTIONS: { id: TcgId | 'all'; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'pokemon', label: 'Pokémon' },
    { id: 'digimon', label: 'Digimon' },
    { id: 'onepiece', label: 'One Piece' },
    { id: 'naruto', label: 'Naruto' },
    { id: 'finalfantasy', label: 'Final Fantasy' },
    { id: 'riftbound', label: 'Riftbound' },
];

const EMPTY_FORM: Omit<Product, 'id'> = {
    tcg: 'pokemon',
    name: '',
    set: '',
    price: '',
    category: '',
    badge: '',
    badgeColor: '',
    stock: 0,
    maxStock: 5,
    image: '',
    featured: false,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const inputClass =
    'w-full border border-outline-variant bg-surface-container-lowest text-on-surface font-body text-sm px-3 py-2 focus:outline-none focus:border-primary';
const labelClass =
    'block font-headline text-[10px] uppercase tracking-widest text-on-surface-variant mb-1';

type FormData = Omit<Product, 'id'>;

const ProductFormModal = ({
    initial,
    onClose,
    onSaved,
}: {
    initial: Product | null; // null = add mode
    onClose: () => void;
    onSaved: () => void;
}) => {
    const isEdit = initial !== null;
    const [form, setForm] = useState<FormData>(
        initial ? { ...initial } : { ...EMPTY_FORM }
    );
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSaving(true);
        try {
            const clean: FormData = {
                ...form,
                stock: Number(form.stock),
                maxStock: Number(form.maxStock),
                badge: form.badge || undefined,
                badgeColor: form.badgeColor || undefined,
                image: form.image || undefined,
            };
            console.log(clean)
            if (isEdit) {
                await updateProduct(initial!.id, clean);
            } else {
                await addProduct(clean);
            }
            onSaved();
        } catch {
            setError('Error al guardar. Inténtalo de nuevo.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="tactical-frame p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-headline font-bold text-lg text-on-surface uppercase tracking-widest">
                        {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
                    </h2>
                    <button onClick={onClose} className="text-on-surface-variant hover:text-primary">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* TCG */}
                    <div>
                        <label className={labelClass}>TCG</label>
                        <select
                            value={form.tcg}
                            onChange={(e) => set('tcg', e.target.value as TcgId)}
                            className={inputClass}>
                            {TCG_OPTIONS.filter((t) => t.id !== 'all').map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Name */}
                    <div>
                        <label className={labelClass}>Nombre</label>
                        <input
                            required
                            value={form.name}
                            onChange={(e) => set('name', e.target.value)}
                            className={inputClass}
                        />
                    </div>

                    {/* Set + Category */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelClass}>Set / Expansión</label>
                            <input
                                required
                                value={form.set}
                                onChange={(e) => set('set', e.target.value)}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Categoría</label>
                            <input
                                required
                                value={form.category}
                                onChange={(e) => set('category', e.target.value)}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Price */}
                    <div>
                        <label className={labelClass}>Precio</label>
                        <input
                            required
                            placeholder="4,99 €"
                            value={form.price}
                            onChange={(e) => set('price', e.target.value)}
                            className={inputClass}
                        />
                    </div>

                    {/* Stock + MaxStock */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelClass}>Stock actual</label>
                            <input
                                type="number"
                                min={0}
                                value={form.stock}
                                onChange={(e) => set('stock', Number(e.target.value))}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Stock máximo</label>
                            <input
                                type="number"
                                min={1}
                                value={form.maxStock}
                                onChange={(e) => set('maxStock', Number(e.target.value))}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className={labelClass}>URL de imagen</label>
                        <input
                            type="url"
                            placeholder="https://..."
                            value={form.image ?? ''}
                            onChange={(e) => set('image', e.target.value)}
                            className={inputClass}
                        />
                    </div>

                    {/* Badge + BadgeColor */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelClass}>Badge (ej. HOT)</label>
                            <input
                                value={form.badge ?? ''}
                                onChange={(e) => set('badge', e.target.value)}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Color badge</label>
                            <input
                                placeholder="bg-[#93000a] border-[#ffb4ab]"
                                value={form.badgeColor ?? ''}
                                onChange={(e) => set('badgeColor', e.target.value)}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Featured */}
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.featured ?? false}
                            onChange={(e) => set('featured', e.target.checked)}
                            className="w-4 h-4 accent-primary"
                        />
                        <span className="font-headline text-xs uppercase tracking-widest text-on-surface-variant">
                            Producto destacado
                        </span>
                    </label>

                    {error && (
                        <p className="text-xs font-body text-error flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">error</span>
                            {error}
                        </p>
                    )}

                    <div className="flex gap-3 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-outline-variant text-on-surface-variant font-headline text-xs uppercase tracking-widest py-2.5 hover:border-primary hover:text-primary transition-colors">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 border border-primary bg-surface-container text-primary font-headline text-xs uppercase tracking-widest py-2.5 hover:bg-primary hover:text-surface transition-colors disabled:opacity-50">
                            {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear producto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const DeleteConfirmModal = ({
    product,
    onClose,
    onDeleted,
}: {
    product: Product;
    onClose: () => void;
    onDeleted: () => void;
}) => {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteProduct(product.id);
            onDeleted();
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="tactical-frame p-6 w-full max-w-sm">
                <h2 className="font-headline font-bold text-lg text-on-surface uppercase tracking-widest mb-2">
                    Eliminar producto
                </h2>
                <p className="text-sm font-body text-on-surface-variant mb-6">
                    ¿Seguro que quieres eliminar{' '}
                    <span className="text-on-surface font-bold">{product.name}</span>?
                    Esta acción no se puede deshacer.
                </p>
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
            </div>
        </div>
    );
};

// ─── Main page ────────────────────────────────────────────────────────────────

const AdminPanelPage = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterTcg, setFilterTcg] = useState<TcgId | 'all'>('all');

    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

    const openAdd = () => { setEditingProduct(null); setShowForm(true); };
    const openEdit = (p: Product) => { setEditingProduct(p); setShowForm(true); };
    const closeForm = () => setShowForm(false);

    const refresh = async () => {
        setLoading(true);
        const data = await getAllProducts();
        setProducts(data);
        setLoading(false);
    };

    useEffect(() => {
        refresh();
    }, []);

    const handleSignOut = async () => {
        await signOut();
        navigate('/cosmos-admin', { replace: true });
    };

    const visible =
        filterTcg === 'all' ? products : products.filter((p) => p.tcg === filterTcg);

    return (
        <div className="min-h-screen bg-surface text-on-surface">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b-2 border-[#e0e0ff] bg-primary-container px-6 py-3 flex items-center justify-between shadow-[inset_0_0_8px_rgba(0,1,172,1)]">
                <div>
                    <p className="text-[10px] font-headline text-primary/60 tracking-[0.3em] uppercase">
                        COSMOS-ADMIN
                    </p>
                    <p className="font-headline font-bold text-on-surface uppercase tracking-widest text-sm">
                        Panel de Control
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-headline text-on-surface-variant hidden sm:block">
                        {user?.email}
                    </span>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-1.5 border border-outline-variant text-on-surface-variant font-headline text-[10px] uppercase tracking-widest px-3 py-1.5 hover:border-primary hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-sm">logout</span>
                        Salir
                    </button>
                </div>
            </header>

            <div className="p-6">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    {/* TCG filter tabs */}
                    <div className="flex flex-wrap gap-2">
                        {TCG_OPTIONS.map(({ id, label }) => (
                            <button
                                key={id}
                                onClick={() => setFilterTcg(id as TcgId | 'all')}
                                className={`px-3 py-1.5 font-headline text-xs uppercase tracking-wider border transition-all ${
                                    filterTcg === id
                                        ? 'border-primary text-primary bg-surface-container'
                                        : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                                }`}>
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Add button */}
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 border border-primary text-primary font-headline text-xs uppercase tracking-widest px-4 py-2 hover:bg-primary hover:text-surface transition-colors">
                        <span className="material-symbols-outlined text-sm">add</span>
                        Nuevo producto
                    </button>
                </div>

                {/* Product count */}
                <p className="text-[10px] font-headline text-on-surface-variant uppercase tracking-widest mb-4">
                    <span className="w-1.5 h-1.5 bg-primary animate-ping inline-block mr-2" />
                    {visible.length} producto{visible.length !== 1 ? 's' : ''}
                </p>

                {/* Table */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <span className="material-symbols-outlined text-primary text-4xl animate-spin">
                            progress_activity
                        </span>
                    </div>
                ) : visible.length === 0 ? (
                    <div className="tactical-frame p-8 text-center text-on-surface-variant font-body text-sm">
                        No hay productos.
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {visible.map((product) => (
                            <div
                                key={product.id}
                                className="tactical-frame p-4 flex items-center gap-4">
                                {/* Thumbnail */}
                                <div className="w-14 h-14 shrink-0 overflow-hidden">
    <ProductImage src={product.image} />
</div>

                                {/* Info */}
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
                                            <span className="text-[9px] font-headline text-primary">
                                                ★ Destacado
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

                                {/* Price + Stock */}
                                <div className="text-right shrink-0 hidden sm:block">
                                    <p className="font-headline font-bold text-primary text-sm">
                                        {product.price}
                                    </p>
                                    <p className="text-[10px] text-on-surface-variant font-body">
                                        Stock: {product.stock}/{product.maxStock}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => openEdit(product)}
                                        className="border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary p-1.5 transition-colors"
                                        title="Editar">
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                    </button>
                                    <button
                                        onClick={() => setDeleteTarget(product)}
                                        className="border border-outline-variant text-on-surface-variant hover:border-error hover:text-error p-1.5 transition-colors"
                                        title="Eliminar">
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            {showForm && (
                <ProductFormModal
                    initial={editingProduct}
                    onClose={closeForm}
                    onSaved={() => { closeForm(); refresh(); }}
                />
            )}

            {deleteTarget && (
                <DeleteConfirmModal
                    product={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onDeleted={() => {
                        setDeleteTarget(null);
                        refresh();
                    }}
                />
            )}
        </div>
    );
};

export default AdminPanelPage;
