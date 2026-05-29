import { useEffect, useState } from 'react';
import { getAllProducts, deleteProducts, updateProduct } from '../../services/productsService';
import { getSidebarConfig, type NavItem } from '../../services/navService';
import { pathToSectionId, toSlug } from '../../lib/tcgUtils';
import type { Product } from '../../types';
import ProductFilters from './ProductFilters';
import ProductSelectionBar from './ProductSelectionBar';
import ProductRow from './ProductRow';
import ProductFormModal from './ProductFormModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import BulkDeleteModal from './BulkDeleteModal';

const ProductsView = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const [filterNavItems, setFilterNavItems] = useState<NavItem[]>([]);
    const [filterMenuIdx, setFilterMenuIdx] = useState<number | null>(null);
    const [filterSectionId, setFilterSectionId] = useState<string>('all');

    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [bulkDeleting, setBulkDeleting] = useState(false);
    const [showBulkConfirm, setShowBulkConfirm] = useState(false);

    const refresh = async () => {
        setLoading(true);
        const data = await getAllProducts();
        setProducts(data);
        setLoading(false);
    };

    useEffect(() => {
        refresh();
        getSidebarConfig().then((cfg) => setFilterNavItems(cfg.items));
    }, []);

    const selectedMenu = filterMenuIdx !== null ? filterNavItems[filterMenuIdx] : null;

    const menuSectionIds: string[] = selectedMenu
        ? (selectedMenu.submenu?.length ?? 0) > 0
            ? selectedMenu.submenu!.map((sub) => pathToSectionId(sub.path))
            : selectedMenu.path
              ? [pathToSectionId(selectedMenu.path)]
              : [toSlug(selectedMenu.label)]
        : [];

    const visible = products.filter((p) => {
        if (filterMenuIdx === null) return true;
        if (filterSectionId !== 'all') return p.tcg === filterSectionId;
        return menuSectionIds.includes(p.tcg);
    });

    const toggleSelect = (id: string) =>
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });

    const allVisibleSelected = visible.length > 0 && visible.every((p) => selectedIds.has(p.id));

    const toggleSelectAll = () =>
        setSelectedIds(allVisibleSelected ? new Set() : new Set(visible.map((p) => p.id)));

    const handleBulkDelete = async () => {
        setBulkDeleting(true);
        try {
            await deleteProducts([...selectedIds]);
            setSelectedIds(new Set());
            setShowBulkConfirm(false);
            refresh();
        } finally {
            setBulkDeleting(false);
        }
    };

    return (
        <>
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <ProductFilters
                    navItems={filterNavItems}
                    filterMenuIdx={filterMenuIdx}
                    filterSectionId={filterSectionId}
                    selectedMenu={selectedMenu}
                    onMenuChange={(idx) => { setFilterMenuIdx(idx); setFilterSectionId('all'); }}
                    onSectionChange={setFilterSectionId}
                />
                <button
                    onClick={() => { setEditingProduct(null); setShowForm(true); }}
                    className="flex items-center gap-2 border border-primary text-primary font-headline text-xs uppercase tracking-widest px-4 py-2 hover:bg-primary hover:text-surface transition-colors">
                    <span className="material-symbols-outlined text-sm">add</span>
                    Nuevo producto
                </button>
            </div>

            <ProductSelectionBar
                visibleCount={visible.length}
                selectedCount={selectedIds.size}
                allSelected={allVisibleSelected}
                onToggleAll={toggleSelectAll}
                onClearSelection={() => setSelectedIds(new Set())}
                onBulkDelete={() => setShowBulkConfirm(true)}
            />

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
                        <ProductRow
                            key={product.id}
                            product={product}
                            isSelected={selectedIds.has(product.id)}
                            onToggleSelect={() => toggleSelect(product.id)}
                            onEdit={() => { setEditingProduct(product); setShowForm(true); }}
                            onDelete={() => setDeleteTarget(product)}
                            onToggleVisible={async () => {
                                await updateProduct(product.id, { visible: product.visible === false });
                                refresh();
                            }}
                        />
                    ))}
                </div>
            )}

            {showForm && (
                <ProductFormModal
                    initial={editingProduct}
                    onClose={() => setShowForm(false)}
                    onSaved={() => { setShowForm(false); refresh(); }}
                />
            )}

            {deleteTarget && (
                <DeleteConfirmModal
                    product={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onDeleted={() => {
                        setDeleteTarget(null);
                        setSelectedIds((prev) => {
                            const next = new Set(prev);
                            next.delete(deleteTarget.id);
                            return next;
                        });
                        refresh();
                    }}
                />
            )}

            {showBulkConfirm && (
                <BulkDeleteModal
                    count={selectedIds.size}
                    deleting={bulkDeleting}
                    onClose={() => setShowBulkConfirm(false)}
                    onConfirm={handleBulkDelete}
                />
            )}
        </>
    );
};

export default ProductsView;
