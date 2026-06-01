import { useEffect, useState, useMemo } from 'react';
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

const PAGE_SIZE = 25;

const ProductsView = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const [filterNavItems, setFilterNavItems] = useState<NavItem[]>([]);
    const [filterMenuIdx, setFilterMenuIdx] = useState<number | null>(null);
    const [filterSectionId, setFilterSectionId] = useState<string>('all');

    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
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

    const visible = useMemo(() => {
        const needle = search.trim().toLowerCase();
        return products.filter((p) => {
            const matchMenu = filterMenuIdx === null
                ? true
                : filterSectionId !== 'all'
                  ? p.tcg === filterSectionId
                  : menuSectionIds.includes(p.tcg);
            const matchSearch = !needle ||
                p.name.toLowerCase().includes(needle) ||
                p.set?.toLowerCase().includes(needle) ||
                p.category?.toLowerCase().includes(needle);
            return matchMenu && matchSearch;
        });
    }, [products, filterMenuIdx, filterSectionId, menuSectionIds, search]); // eslint-disable-line react-hooks/exhaustive-deps

    const totalPages = Math.ceil(visible.length / PAGE_SIZE);
    const paginated = visible.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    const resetPage = () => setPage(0);

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
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <ProductFilters
                    navItems={filterNavItems}
                    filterMenuIdx={filterMenuIdx}
                    filterSectionId={filterSectionId}
                    selectedMenu={selectedMenu}
                    onMenuChange={(idx) => { setFilterMenuIdx(idx); setFilterSectionId('all'); resetPage(); }}
                    onSectionChange={(id) => { setFilterSectionId(id); resetPage(); }}
                />
                <button
                    onClick={() => { setEditingProduct(null); setShowForm(true); }}
                    className="flex items-center gap-2 border border-primary text-primary font-headline text-xs uppercase tracking-widest px-4 py-2 hover:bg-primary hover:text-surface transition-colors">
                    <span className="material-symbols-outlined text-sm">add</span>
                    Nuevo producto
                </button>
            </div>

            <div className="relative mb-6">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">
                    search
                </span>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); resetPage(); }}
                    placeholder="Buscar por nombre, set o categoría..."
                    className="w-full bg-surface-container border border-outline-variant text-on-surface font-body text-sm pl-9 pr-4 py-2 placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors"
                />
                {search && (
                    <button
                        onClick={() => { setSearch(''); resetPage(); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors">
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                )}
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
                <>
                    <div className="flex flex-col gap-3">
                        {paginated.map((product) => (
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

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-outline-variant/30">
                            <p className="text-[10px] font-headline text-on-surface-variant tracking-widest uppercase">
                                {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, visible.length)} de {visible.length}
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setPage(0)}
                                    disabled={page === 0}
                                    className="p-1 text-on-surface-variant disabled:opacity-30 hover:text-primary transition-colors cursor-pointer disabled:cursor-default">
                                    <span className="material-symbols-outlined text-sm">first_page</span>
                                </button>
                                <button
                                    onClick={() => setPage((p) => p - 1)}
                                    disabled={page === 0}
                                    className="p-1 text-on-surface-variant disabled:opacity-30 hover:text-primary transition-colors cursor-pointer disabled:cursor-default">
                                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                                </button>

                                {[...Array(totalPages)].map((_, i) => {
                                    if (totalPages <= 7 || Math.abs(i - page) <= 1 || i === 0 || i === totalPages - 1) {
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => setPage(i)}
                                                className={`w-7 h-7 font-headline text-[10px] tracking-widest transition-colors cursor-pointer ${
                                                    i === page
                                                        ? 'bg-primary text-surface'
                                                        : 'text-on-surface-variant hover:text-primary'
                                                }`}>
                                                {i + 1}
                                            </button>
                                        );
                                    }
                                    if (Math.abs(i - page) === 2) {
                                        return <span key={i} className="text-on-surface-variant/50 text-xs px-0.5">…</span>;
                                    }
                                    return null;
                                })}

                                <button
                                    onClick={() => setPage((p) => p + 1)}
                                    disabled={page === totalPages - 1}
                                    className="p-1 text-on-surface-variant disabled:opacity-30 hover:text-primary transition-colors cursor-pointer disabled:cursor-default">
                                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                                </button>
                                <button
                                    onClick={() => setPage(totalPages - 1)}
                                    disabled={page === totalPages - 1}
                                    className="p-1 text-on-surface-variant disabled:opacity-30 hover:text-primary transition-colors cursor-pointer disabled:cursor-default">
                                    <span className="material-symbols-outlined text-sm">last_page</span>
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {showForm && (
                <ProductFormModal
                    initial={editingProduct}
                    onClose={() => setShowForm(false)}
                    onSaved={() => { setShowForm(false); refresh(); }}
                    onSavedContinue={() => refresh()}
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
